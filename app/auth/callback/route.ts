import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 성공하면 온보딩으로!
      return NextResponse.redirect(`${origin}/onboarding`)
    }

    // 🔥 에러가 있다면 주소창에 에러 내용을 담아서 튕깁니다.
    return NextResponse.redirect(`${origin}/login?error_details=${encodeURIComponent(error.message)}`)
  }

  // 코드가 아예 없는 경우
  return NextResponse.redirect(`${origin}/login?error_details=no_code_found`)
}