'use client'

import { createClient } from '../../utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    // 로그인 시도
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert('로그인 실패: ' + error.message)
      setLoading(false)
    } else {
      // 로그인 성공 시 메인 페이지로 이동
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-zinc-900/50 p-10 rounded-2xl border border-zinc-800 backdrop-blur-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Crebox.ai <span className="text-blue-500">로그인</span>
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            반가워요 사장님! 다시 스튜디오로 입장할까요?
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1 font-bold">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@crebox.ai"
                required
                className="block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm outline-none transition-all font-bold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1 font-bold">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm outline-none transition-all font-bold"
              />
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>로그인 중...</span>
                </span>
              ) : (
                '로그인하기'
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-sm text-zinc-400 font-bold">
                아직 회원이 아니신가요? {' '}
                <Link href="/signup" className="text-blue-500 hover:text-blue-400 underline underline-offset-4 transition-colors">
                  무료 회원가입
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}