import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/get-session"
import { getSecMatchMessageModel } from "@/models/SecMatchMessage"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get("matchId")
    if (!matchId) return NextResponse.json({ error: "matchId is required" }, { status: 400 })

    // connectToDatabase() is called inside getSecMatchMessageModel()
    const SecMatchMessage = await getSecMatchMessageModel()

    const messages = await SecMatchMessage.find({
      $or: [
        { fromUserId: session.user.id, toUserId: matchId },
        { fromUserId: matchId, toUserId: session.user.id }
      ]
    })
      .sort({ createdAt: 1 })
      .lean()

    // Mark received messages as read
    await SecMatchMessage.updateMany(
      { fromUserId: matchId, toUserId: session.user.id, read: false },
      { $set: { read: true } }
    )

    return NextResponse.json({ success: true, messages })
  } catch (error: any) {
    console.error("❌ [secmatch/chat GET] Error fetching messages:", error?.message, error?.stack)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { toUserId, content } = body

    if (!toUserId || !content || content.trim().length === 0) {
      console.error("❌ [secmatch/chat POST] Invalid request body:", { toUserId, content })
      return NextResponse.json({ error: "Invalid request: toUserId and content are required" }, { status: 400 })
    }

    // connectToDatabase() is called inside getSecMatchMessageModel()
    const SecMatchMessage = await getSecMatchMessageModel()

    const newMessage = await SecMatchMessage.create({
      fromUserId: session.user.id,
      toUserId,
      content: content.trim(),
    })

    console.log("✅ [secmatch/chat POST] Message saved:", {
      id: newMessage._id,
      from: session.user.id,
      to: toUserId,
      contentLength: content.trim().length,
    })

    return NextResponse.json({ success: true, message: newMessage })
  } catch (error: any) {
    console.error("❌ [secmatch/chat POST] Failed to save message:", error?.message, error?.stack)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
