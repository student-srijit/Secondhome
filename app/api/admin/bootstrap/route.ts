import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"
import { User } from "@/models/user"

/**
 * POST /api/admin/bootstrap
 * Creates or updates the default admin account.
 *
 * MUST be secured with ADMIN_SEED_TOKEN env variable.
 * Call with header: x-admin-seed-token: <ADMIN_SEED_TOKEN>
 *
 * ⚠️  This route MUST be disabled or deleted after initial setup.
 */
export async function POST(req: Request) {
  const token = req.headers.get("x-admin-seed-token")
  const expected = process.env.ADMIN_SEED_TOKEN

  // SECURITY: If ADMIN_SEED_TOKEN is not set, block the route entirely.
  // Never allow open bootstrapping — an attacker could call this to create/overwrite the admin account.
  if (!expected) {
    return NextResponse.json(
      { error: "Bootstrap is disabled. Set ADMIN_SEED_TOKEN in environment variables to enable." },
      { status: 403 }
    )
  }

  if (token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectToDatabase()

  const email = process.env.ADMIN_EMAIL
  const plainPassword = process.env.ADMIN_PASSWORD

  if (!email || !plainPassword) {
    return NextResponse.json(
      { error: "ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables" },
      { status: 500 }
    )
  }

  const hashed = await bcrypt.hash(plainPassword, 10)

  const updated = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        name: "SecondHome Admin",
        email,
        password: hashed,
        role: "admin",
      },
    },
    { upsert: true, new: true },
  )

  // SECURITY: Never echo back credentials — not even a partial password.
  return NextResponse.json({
    message: "Admin account bootstrapped successfully.",
    email,
    role: updated.role,
    // password intentionally omitted from response
  })
}
