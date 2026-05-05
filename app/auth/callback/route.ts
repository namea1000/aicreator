import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/onboarding'

  if (code) {
    // 서버 전용 클라이언트를 여기서 직접 만듭니다 (쿠키 제어 포함)
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // 코드를 세션으로 교환 (이때 쿠키가 자동으로 구워집니다)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 에러 발생 시 리디렉션
  return NextResponse.redirect(`${origin}/login?error_details=auth_failed`)
}