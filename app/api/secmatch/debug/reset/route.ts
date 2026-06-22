import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getSecMatchLikeModel } from "@/models/SecMatchLike"

export async function GET() {
  await connectToDatabase()
  const SecMatchLike = await getSecMatchLikeModel()
  await SecMatchLike.deleteMany({})
  return NextResponse.json({ success: true, message: "All likes/passes have been reset!" })
}
