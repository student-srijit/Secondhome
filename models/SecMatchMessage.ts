import { Schema, Document, Model } from "mongoose"
import { connectToDatabase } from "@/lib/mongodb"

export interface ISecMatchMessage extends Document {
  fromUserId: string
  toUserId: string
  content: string
  read: boolean
  createdAt: Date
  updatedAt: Date
}

const messageSchema = new Schema<ISecMatchMessage>(
  {
    fromUserId: { type: String, required: true, index: true },
    toUserId: { type: String, required: true, index: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Compound index for querying chat between two users quickly
messageSchema.index({ fromUserId: 1, toUserId: 1 })

/**
 * Always call connectToDatabase() first so the model is registered
 * on the live mongoose connection — required because bufferCommands is false.
 */
export async function getSecMatchMessageModel(): Promise<Model<ISecMatchMessage>> {
  const conn = await connectToDatabase()
  return conn.models.SecMatchMessage ||
    conn.model<ISecMatchMessage>("SecMatchMessage", messageSchema)
}
