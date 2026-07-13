import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getSecurityEventModel } from "@/models/SecurityEvent"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "100")

    await connectToDatabase()
    const SecurityEvent = getSecurityEventModel()

    const events = await SecurityEvent.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    return NextResponse.json({ events })
  } catch (error) {
    console.error("Error fetching security events:", error)
    return NextResponse.json(
      { error: "Failed to fetch security events" },
      { status: 500 }
    )
  }
}
