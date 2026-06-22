import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const { contact } = await req.json()

    if (!contact || !contact.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 })
    }

    const apkLink = "https://github.com/AdityaShome/SecondHome-releases/releases/download/v1.0.0/SecondHome.apk"

    // Send real email using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: contact,
      subject: "Download the SecondHome App!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
          <h2 style="color: #f97316;">SecondHome App</h2>
          <p style="font-size: 16px; color: #374151;">Here is your link to download the SecondHome app:</p>
          <a href="${apkLink}" style="display: inline-block; background-color: #f97316; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 16px;">Download APK</a>
          <p style="margin-top: 24px; font-size: 12px; color: #9ca3af;">If you didn't request this link, you can safely ignore this email.</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    return NextResponse.json({ success: true, message: "App link sent successfully to your email!" })

  } catch (error) {
    console.error("Error sending app link:", error)
    return NextResponse.json({ error: "Failed to send app link" }, { status: 500 })
  }
}
