import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { connectToDatabase } from "@/lib/mongodb"
import { getUserModel } from "@/models/user"
import { headers } from "next/headers"
import { verifyToken, extractTokenFromHeader } from "@/lib/jwt"

/**
 * Get the current session in App Router API routes.
 *
 * STRATEGY (dual-auth):
 * 1. Try cookie-based NextAuth session  → used by the Next.js web app
 * 2. If no cookie session, try Authorization: Bearer <token> → used by the mobile app
 *
 * This lets the same API routes serve BOTH the web and the mobile app
 * without any changes at the call sites (all 6 routes stay zero-argument).
 *
 * The Bearer path trusts the JWT payload directly (userId, email, role) because
 * the token is signed with NEXTAUTH_SECRET — no extra DB lookup required.
 */
export async function getSession() {
  // ─── PATH 1: Cookie / NextAuth session (web browser) ───────────────────────
  try {
    const session = await getServerSession(authOptions)

    if (session?.user) {
      // Backfill session.user.id if it is missing (edge case in some NextAuth configs)
      if (!session.user.id) {
        const email = session.user.email?.toLowerCase().trim()
        if (!email) return null

        try {
          await connectToDatabase()
          const User = await getUserModel()
          const dbUser = await User.findOne({ email }).select("_id role").lean()
          if (dbUser?._id) {
            session.user.id = (dbUser._id as any).toString()
            ;(session.user as any).role =
              (dbUser as any).role || (session.user as any).role || "user"
          } else {
            return null
          }
        } catch (err) {
          console.error("❌ Failed to backfill session.user.id:", err)
          return null
        }
      }

      console.log("✅ Cookie session found:", {
        userId: session.user.id,
        email: session.user.email,
        role: (session.user as any).role,
      })

      return session
    }
  } catch (err: any) {
    // getServerSession can throw in some environments — fall through to Bearer path
    console.warn("⚠️ getServerSession error, trying Bearer fallback:", err?.message)
  }

  // ─── PATH 2: Bearer token (mobile app) ─────────────────────────────────────
  try {
    const headersList = await headers()
    const authHeader = headersList.get("authorization")
    const token = extractTokenFromHeader(authHeader)

    if (!token) {
      console.log("⚠️ No session and no Bearer token — user not authenticated")
      return null
    }

    const payload = await verifyToken(token)

    console.log("✅ Bearer token session:", {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    })

    // Shape the return value to match what NextAuth's session looks like
    // so all existing call sites work without any change
    return {
      user: {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
        name: null,
        image: null,
      },
      expires: new Date(payload.exp! * 1000).toISOString(),
    }
  } catch (err: any) {
    console.error("❌ Bearer token verification failed:", err?.message)
    return null
  }
}
