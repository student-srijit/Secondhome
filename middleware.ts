import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiting (Note: in serverless environments like Vercel, 
// this map resets per isolate, but still provides basic flood protection)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function middleware(request: NextRequest) {
  // Only apply rate limiting to specific sensitive API routes
  const path = request.nextUrl.pathname
  
  if (path.startsWith('/api/auth') || 
      path.startsWith('/api/upload') || 
      path.startsWith('/api/whatsapp/ai-chat') ||
      path.startsWith('/api/admin/bootstrap')) {
      
    // Get IP address (handles Vercel proxy)
    const ip = request.ip || 
               request.headers.get('x-forwarded-for')?.split(',')[0] || 
               '127.0.0.1'
               
    const key = `${ip}-${path.split('/')[2]}` // Rate limit by IP + API category
    const now = Date.now()
    const windowMs = 60 * 1000 // 1 minute
    
    // Set limits based on route
    let maxRequests = 60 // Default 60/min
    if (path.startsWith('/api/auth')) maxRequests = 10 // Auth endpoints strictly limited
    if (path.startsWith('/api/upload')) maxRequests = 20
    if (path.startsWith('/api/whatsapp')) maxRequests = 15

    const current = rateLimitMap.get(key)
    
    if (!current) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    } else {
      if (now > current.resetTime) {
        // Reset window
        rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
      } else {
        current.count++
        if (current.count > maxRequests) {
          // Log security event asynchronously if possible, or just reject
          console.warn(`[RATE LIMIT] IP: ${ip} exceeded limit for ${path}`)
          return new NextResponse(
            JSON.stringify({ error: "Too many requests. Please try again later." }),
            { 
              status: 429, 
              headers: { 'Content-Type': 'application/json', 'Retry-After': Math.ceil((current.resetTime - now) / 1000).toString() } 
            }
          )
        }
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
