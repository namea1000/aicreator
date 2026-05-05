import { NextResponse } from 'next/server'
// lib에서 가져오는 이름은 그대로 supabase로 씁니다.
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/onboarding'

  if (code) {
    // 13번 라인: 변수를 새로 만들지 않고, 위에서 가져온 supabase를 바로 사용합니다.
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error_details=auth_failed`)
}