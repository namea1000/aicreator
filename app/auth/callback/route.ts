import { NextResponse } from 'next/server'
// lib 폴더에 있는 사장님의 supabase 설정을 가져옵니다
import { createClient } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // 로그인 후 돌아갈 주소 (기본값은 온보딩)
  const next = searchParams.get('next') ?? '/onboarding'

  if (code) {
    // 사장님이 lib/supabase.ts에 정해둔 규칙대로 클라이언트를 만듭니다
    const supabase = await createClient()
    
    // 구글이 준 code를 실제 로그인 세션으로 교환합니다
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 로그인 성공! 온보딩 페이지로 보냅니다
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // ❌ 에러가 있거나 코드가 없는 경우 로그인 페이지로 튕깁니다
  return NextResponse.redirect(`${origin}/login?error_details=auth_failed`)
}