import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"
import { connectToDatabase } from "@/lib/mongodb"
import { Property } from "@/models/property"

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(req: NextRequest) {
  try {
    const { message, propertyId, conversationHistory = [] } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 })
    }

    await connectToDatabase()

    // ── CONTACT PAGE: fully context-aware with live DB data ─────────────────
    if (!propertyId || propertyId === "contact") {
      // Pull real aggregate data from DB so the LLM never hallucinates
      const [totalCount, cityAgg, typeAgg] = await Promise.all([
        Property.countDocuments({ isActive: true }),
        Property.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: "$city", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 20 },
        ]),
        Property.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: "$type", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
      ])

      const citySummary = cityAgg
        .map((c: any) => `${c._id} (${c.count} listings)`)
        .join(", ") || "Bangalore"

      const typeSummary = typeAgg
        .map((t: any) => `${t._id}: ${t.count}`)
        .join(", ") || "PG, Flat, Hostel"

      const failedTurns = conversationHistory.filter(
        (m: any) => m.role === "ai" && /sorry|can't|cannot|don't know|not sure|unable|contact.*executive/i.test(m.content)
      ).length

      const systemPrompt = `You are the SecondHome AI Assistant — a smart, friendly, and knowledgeable support agent for SecondHome, a student accommodation platform in India.

LIVE PLATFORM DATA (fetched right now from the database — use ONLY this, never invent):
- Total active listings: ${totalCount}
- Cities we operate in: ${citySummary}
- Listing types available: ${typeSummary}
- Contact email: ${process.env.ADMIN_EMAIL || "info@secondhome.in"}
- Contact phone: +91 73846 62005
- Website: secondhome.in

WHAT WE DO:
We help students find verified PGs, shared flats, and hostels near their colleges. Every listing on SecondHome is verified by our team. Students can browse, book visits, and contact property owners directly through our platform.

WHAT YOU MUST DO:
1. Answer ONLY using the live platform data above and facts about how SecondHome works. Never guess or invent city names, colleges, or listings that aren't in the data.
2. If a user asks about a city NOT in the list above, honestly say "We don't have listings there yet, but we're expanding. You can register your interest."
3. If a user asks about something you genuinely cannot resolve (e.g., payment dispute, account issue, specific booking problem), set escalate to true.
4. After ${failedTurns >= 2 ? "multiple failed attempts to help, you MUST set escalate to true now" : "2 or more failed attempts, set escalate to true"}.
5. Be warm, concise, and helpful. Use a conversational tone.
6. Suggest actionable next steps (browse listings, schedule a visit, contact support).

CONVERSATION SO FAR:
${(conversationHistory || []).map((m: any) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n")}

USER MESSAGE: ${message}

Respond ONLY in this exact JSON format:
{
  "message": "<your reply>",
  "escalate": false,
  "suggestions": [
    { "label": "<button label>", "text": "<what to send when clicked>" }
  ]
}
Set escalate to true ONLY if you cannot resolve the issue or the user explicitly wants a human. suggestions should be 0–4 quick-reply chips relevant to the conversation.`

      const groq = new Groq({ apiKey: GROQ_API_KEY })
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: systemPrompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.15,
        max_tokens: 500,
        response_format: { type: "json_object" },
      })

      const raw = completion.choices[0]?.message?.content || "{}"
      let msg = "I'm here to help! What would you like to know about SecondHome?"
      let suggestions: Array<{ label: string; text: string }> = []
      let escalate = false
      try {
        const parsed = JSON.parse(raw)
        msg = parsed.message || msg
        suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 4) : []
        escalate = parsed.escalate === true
      } catch {
        msg = raw || msg
      }

      // Auto-escalate if the user sounds frustrated regardless of AI decision
      const frustrationKeywords = ["angry", "frustrated", "upset", "annoyed", "useless", "worst", "complaint", "hate", "pathetic", "scam", "cheated", "refund"]
      const isFrustrated = frustrationKeywords.some((k) => message.toLowerCase().includes(k))
      if (isFrustrated) escalate = true

      return NextResponse.json({ success: true, response: msg, suggestions, escalate, propertyId: null })
    }

    // ── SPECIFIC PROPERTY CHAT ───────────────────────────────────────────────
    const property = (await Property.findById(propertyId)
      .populate("owner", "name phone email")
      .lean()) as any

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    const propertyContext = `
PROPERTY DETAILS (use ONLY this data, never guess):
- Title: ${property.title}
- Location: ${property.location}, ${property.city}
- Type: ${property.type}
- Gender: ${property.gender}
- Price: ₹${property.price}/month
- Deposit: ₹${property.deposit}
- Amenities: ${property.amenities?.join(", ") || "N/A"}
- Rating: ${property.rating || 0}/5 (${property.reviews || 0} reviews)
- Room types: ${property.roomTypes?.map((r: any) => `${r.type} (₹${r.price})`).join(", ") || "N/A"}
- Curfew/Rules: ${property.rules?.join("; ") || "Not specified"}
- Nearby Colleges: ${property.nearbyColleges?.map((c: any) => c.name).join(", ") || "N/A"}
- Owner: ${property.owner?.name || "N/A"}
- Verified: ${property.verificationStatus === "verified" ? "Yes ✅" : "No"}
`

    const historyContext = conversationHistory
      .map((msg: any) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n")

    const systemPrompt = `You are the SecondHome AI Assistant helping a student with a property inquiry.

${propertyContext}

STRICT RULES:
1. Answer using ONLY the property data above.
2. If information is missing from the data, say "I don't have that detail — you can contact the owner directly."
3. If you cannot resolve the issue, set escalate to true.
4. Be concise and conversational.

${historyContext ? `CONVERSATION SO FAR:\n${historyContext}\n` : ""}

USER MESSAGE: ${message}

Respond ONLY in this exact JSON:
{
  "message": "<reply>",
  "escalate": false,
  "suggestions": [ { "label": "<label>", "text": "<text>" } ]
}`

    const groq = new Groq({ apiKey: GROQ_API_KEY })
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: systemPrompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.15,
      max_tokens: 400,
      response_format: { type: "json_object" },
    })

    const raw = completion.choices[0]?.message?.content || "{}"
    let msg = "I'm here to help! What would you like to know about this property?"
    let suggestions: Array<{ label: string; text: string }> = []
    let escalate = false
    try {
      const parsed = JSON.parse(raw)
      msg = parsed.message || msg
      suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 4) : []
      escalate = parsed.escalate === true
    } catch {
      msg = raw || msg
    }

    return NextResponse.json({ success: true, response: msg, suggestions, escalate, propertyId })
  } catch (error: any) {
    console.error("AI chat error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to process AI chat", success: false },
      { status: 500 }
    )
  }
}

