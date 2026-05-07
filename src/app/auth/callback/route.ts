import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url) // origin은 이제 필요 없으므로 제거해도 됩니다.
  const code = searchParams.get('code')
  
  // 목적지 주소를 완전히 고정합니다.
  const next = 'https://gentoolbox.vercel.app/onboarding'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 🎯 origin 변수 대신 고정된 주소를 바로 사용합니다.
      return NextResponse.redirect(next)
    }
    
    // 에러 발생 시에도 절대 주소를 사용하는 것이 안전합니다.
    return NextResponse.redirect(`https://gentoolbox.vercel.app/login?error_msg=${encodeURIComponent(error.message)}`)
  }

  return NextResponse.redirect(`https://gentoolbox.vercel.app/login?error_details=auth_failed`)
}