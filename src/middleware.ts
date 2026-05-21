import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secretKey = "bms-super-secret-key-12345"
const key = new TextEncoder().encode(secretKey)

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  const path = request.nextUrl.pathname

  // Jika mencoba akses halaman admin atau tenant
  if (path.startsWith('/admin') || path.startsWith('/tenant')) {
    
    // 1. Jika tidak ada sesi, lempar ke login
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      // 2. Verifikasi Token
      const { payload } = await jwtVerify(session, key, {
        algorithms: ["HS256"],
      })
      
      const user = payload.user as { role: string }

      // 3. Pengecekan Hak Akses (Role)
      if (path.startsWith('/admin') && user.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/tenant', request.url))
      }

      if (path.startsWith('/tenant') && user.role !== 'TENANT') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }

      // Aman, biarkan lewat
      return NextResponse.next()
    } catch (error) {
      // Token tidak valid atau kadaluarsa, lempar ke login
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Mencegah user yang sudah login untuk melihat halaman login lagi
  if (path === '/') {
    if (session) {
      try {
        const { payload } = await jwtVerify(session, key, {
          algorithms: ["HS256"],
        })
        const user = payload.user as { role: string }
        if (user.role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url))
        if (user.role === 'TENANT') return NextResponse.redirect(new URL('/tenant', request.url))
      } catch (e) {
        // Abaikan jika token invalid, biarkan render halaman login
      }
    }
  }

  return NextResponse.next()
}

// Konfigurasi path mana saja yang akan dipantau oleh middleware
export const config = {
  matcher: ['/', '/admin/:path*', '/tenant/:path*'],
}
