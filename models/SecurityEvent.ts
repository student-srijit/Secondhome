import mongoose, { Schema, Document, Model } from "mongoose"

export interface ISecurityEvent extends Document {
  eventType: "failed_login" | "rate_limit_exceeded" | "upload_failure" | "suspicious_activity" | "admin_action"
  ipAddress?: string
  userId?: string
  email?: string
  details: string
  severity: "low" | "medium" | "high" | "critical"
  createdAt: Date
}

const securityEventSchema = new Schema<ISecurityEvent>(
  {
    eventType: { 
      type: String, 
      enum: ["failed_login", "rate_limit_exceeded", "upload_failure", "suspicious_activity", "admin_action"],
      required: true 
    },
    ipAddress: { type: String },
    userId: { type: String },
    email: { type: String },
    details: { type: String, required: true },
    severity: { 
      type: String, 
      enum: ["low", "medium", "high", "critical"],
      default: "medium"
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

// Index for faster queries on admin dashboard
securityEventSchema.index({ createdAt: -1 })
securityEventSchema.index({ eventType: 1 })

export function getSecurityEventModel(): Model<ISecurityEvent> {
  return mongoose.models.SecurityEvent || mongoose.model<ISecurityEvent>("SecurityEvent", securityEventSchema)
}
