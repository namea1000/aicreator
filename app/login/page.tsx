'use client';

import { supabase } from '@/lib/supabase';
import { Globe } from 'lucide-react'; // 아이콘 라이브러리

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // 로그인이 끝나면 유저를 보낼 주소 (배포 후엔 실제 도메인으로 변경)
        redirectTo: `${window.location.origin}/auth/callback`,
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
        <h1 className="text-3xl font-black text-white mb-2 italic tracking-tighter">CREBOX.AI</h1>
        <p className="text-slate-400 text-sm mb-8">당신의 데이터를 자산으로 만드는 시작</p>
        
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