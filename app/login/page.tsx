'use client';

import { supabase } from '@/lib/supabase';
import { Globe } from 'lucide-react';

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // 1. 서버 엔진(callback)으로만 깔끔하게 보냅니다.
        redirectTo: `${window.location.origin}/auth/callback`,
        // 2. 구글 인증 시 오프라인 액세스와 동의 화면을 강제해 세션 생성을 돕습니다.
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('로그인 에러:', error.message);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#05070a]">
      <div className="p-10 bg-slate-900/50 border border-slate-800 rounded-3xl shadow-2xl text-center">
        <h1 className="text-3xl font-black text-white mb-2 italic tracking-tighter">Crebox.AI</h1>
        <p className="text-slate-400 text-sm mb-8">The Creator's AI Toolbox</p>
        
        <button
          onClick={handleGoogleLogin}
          className="flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all active:scale-95 shadow-xl"
        >
          <Globe size={20} />
          Google로 계속하기
        </button>
      </div>
    </div>
  );
}