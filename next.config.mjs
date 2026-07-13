import path from 'path'
import { fileURLToPath } from 'url'

let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ── Trusted origins ──────────────────────────────────────────────────────────
// Only these domains are allowed as CORS origins. Never use "*".
const TRUSTED_ORIGINS = [
  'https://secondhome.site',
  'https://www.secondhome.site',
  // Add Vercel preview URLs pattern if needed during development
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  outputFileTracingRoot: __dirname,
  turbopack: {
    root: __dirname,
  },
  experimental: {},

  // ── Security Headers ────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: [
          // Prevent clickjacking — no one can embed SecondHome in an iframe
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent MIME sniffing attacks
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Control referrer info sent to third parties
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable browser features that aren't needed
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          // Force HTTPS for 1 year (HSTS) — only effective in production via Vercel
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          // XSS Protection for older browsers
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Content Security Policy — restrict where scripts/styles/images can load from
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://res.cloudinary.com https://lh3.googleusercontent.com https://platform-lookaside.fbsbx.com https://www.google-analytics.com",
              "connect-src 'self' https://api.cloudinary.com https://www.google-analytics.com https://vitals.vercel-insights.com",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      {
        // CORS for API routes — only trusted origins
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            // In production, restrict to trusted domains; in dev allow localhost
            value: process.env.NODE_ENV === 'production'
              ? 'https://secondhome.site'
              : 'http://localhost:3000',
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
    ]
  },
}

if (userConfig) {
  const config = userConfig.default || userConfig

  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      }
    } else {
      nextConfig[key] = config[key]
    }
  }
}

export default nextConfig
