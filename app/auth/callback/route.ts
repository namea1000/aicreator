import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // 성공하면 무조건 온보딩으로 보냅니다.
  const next = '/onboarding'

  if (code) {
    // 우리가 방금 만든 server.ts의 엔진을 빌려옵니다.
    const supabase = await createClient()
    
    // 구글이 준 코드를 세션(쿠키)으로 바꿉니다.
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 에러 발생 시 로그인 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/login?error_details=auth_failed`)
}