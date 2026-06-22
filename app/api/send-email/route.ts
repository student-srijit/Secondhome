import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

function getEmailTransporter() {
  const emailUser = process.env.EMAIL_USER || process.env.HOST_EMAIL
  const emailPassword = process.env.EMAIL_PASSWORD || process.env.HOST_EMAIL_PASSWORD

  if (!emailUser || !emailPassword) return null

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPassword.replace(/\s/g, ""),
    },
  })
}

export async function POST(request: Request) {
  try {
    const { to, subject, body } = await request.json()

    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const transporter = getEmailTransporter()
    if (!transporter) {
      console.error("Email configuration is missing")
      return NextResponse.json({ error: "Email configuration is missing on server" }, { status: 500 })
    }

    const fromEmail = process.env.EMAIL_USER || process.env.HOST_EMAIL

    await transporter.sendMail({
      from: `"SecondHome" <${fromEmail}>`,
      to,
      subject,
      text: body,
      // optionally formatted html
      html: body.replace(/\n/g, "<br>"),
    })

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    )
  }
}
