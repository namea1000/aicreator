import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // 성공하면 무조건 온보딩으로 보냅니다.
  const next = '/onboarding'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    
    // 에러가 있다면 주소창에 에러 내용을 직접 띄웁니다.
    return NextResponse.redirect(`${origin}/login?error_msg=${encodeURIComponent(error.message)}`)
  }

  // 에러 발생 시 로그인 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/login?error_details=auth_failed`)
}