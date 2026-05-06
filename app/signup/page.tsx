'use client'

import { createClient } from '../../utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    // 1. 가입 시도
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert('가입 실패: ' + error.message)
      setLoading(false)
    } else {
      // 2. 이메일 인증을 꺼두셨으므로, 즉시 성공으로 간주하고 이동!
      // '가입 성공' 알림도 굳이 필요 없습니다. 바로 서비스로 진입하는 느낌을 줍시다.
      router.push('/onboarding')
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-zinc-900/50 p-10 rounded-2xl border border-zinc-800 backdrop-blur-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Crebox.ai <span className="text-blue-500">시작하기</span>
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            나만의 AI 스튜디오 주소를 선점하세요.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@crebox.ai"
                required
                className="block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-all disabled:opacity-50"
            >
             {loading ? '처리 중...' : 'Crebox 시작하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}