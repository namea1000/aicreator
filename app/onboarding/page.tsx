import React from 'react';
import Link from 'next/link'; // 1. Link 컴포넌트 추가

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* 로고 및 인사 */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Welcome to CREBOX.AI
          </h1>
          <p className="text-slate-400 text-lg">
            환영합니다, 사장님! <br /> 
            당신의 데이터를 자산으로 만드는 첫 걸음을 시작해볼까요?
          </p>
        </div>

        {/* 시작 버튼 영역 */}
        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-6">콘텐츠 제작 스튜디오 준비</h2>
          
          <div className="space-y-4">
            {/* 2. Link로 감싸서 루트(/) 경로로 연결 */}
            <Link href="/">
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                AI 글 생성기 시작하기
              </button>
            </Link>
            
            <Link href="/">
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl transition-all">
                대시보드 둘러보기
              </button>
            </Link>
          </div>
        </div>

        <p className="text-slate-500 text-sm italic">
          Tip: 상단 메뉴에서 AI Studio 설정을 변경할 수 있습니다.
        </p>
      </div>
    </div>
  );
}