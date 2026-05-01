"use client";

import React, { useState } from 'react';

// [수정] Props 인터페이스에 useSearch 상태 관련 추가 가능 (일단 내부 상태로 구현)
interface WordPressProps {
  isDark: boolean;
  topic: string;
  setTopic: (val: string) => void;
  handleGenerate: () => void;
  loading: boolean;
  content: string;
  useSearch: boolean;
  setUseSearch: (value: boolean) => void;
  handleCopy: () => void;      // ✅ 검색결과 복사하기
  handleDownload: () => void;  // ✅ 검색결과 다운로드
}

// 2. 컴포넌트 선언 부분 수정
export default function WordPressContent({ 
  isDark, 
  topic, 
  setTopic, 
  handleGenerate, 
  loading, 
  content,
  useSearch,    // 🌟 추가
  setUseSearch,  // 🌟 추가
  handleCopy, // ✅ 추가
  handleDownload, // ✅ 추가
}: WordPressProps) {
  const tabs = ['글 생성', '개인설정', '카테고리 관리', '태그 최적화', '예약 발행'];
  const [activeTab, setActiveTab] = useState('글 생성');

  return (
    <div className="max-w-6xl mx-auto">
      {/* 1. 상단 탭 메뉴 (기존 유지) */}
      <div className={`flex items-center space-x-2 mb-10 p-1.5 rounded-2xl w-fit ${isDark ? 'bg-zinc-900/80' : 'bg-zinc-200'}`}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 text-[13px] font-black rounded-xl transition-all ${
              activeTab === tab 
                ? (isDark ? 'bg-zinc-800 text-white shadow-xl scale-105' : 'bg-white text-black shadow-md scale-105') 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 2. 메인 설정 카드 */}
      <div className={`border rounded-[32px] p-10 shadow-2xl transition-all duration-500 ${
        isDark ? 'bg-zinc-900/40 border-zinc-800/50' : 'bg-white border-zinc-200'
      }`}>
        <h2 className="text-3xl font-black mb-8 tracking-tighter italic">🚀 {activeTab} 설정</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* 주제 입력창 */}
            <div>
              <label className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em] block mb-3 ml-1">포스팅 주제 / 키워드</label>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
                className={`w-full border-2 rounded-2xl p-5 text-lg font-bold outline-none transition-all resize-none ${
                  isDark ? 'bg-black border-zinc-800 focus:border-blue-600 text-white placeholder:text-zinc-700' : 'bg-zinc-50 border-zinc-200 focus:border-blue-400 text-black'
                }`} 
                placeholder="작성할 블로그 주제를 상세히 입력하세요..." 
              />
            </div>

            {/* [수정 부분] 실시간 구글 검색 체크박스 (V자 아이콘 추가 버전) */}
<div className="flex items-center gap-3 px-1 -mt-4">
  <label className="relative flex items-center cursor-pointer group">
    <input 
      type="checkbox" 
      checked={useSearch}
      onChange={(e) => setUseSearch(e.target.checked)}
      className="sr-only peer" 
    />
    {/* V자 모양을 담을 박스 */}
    <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center
      ${isDark 
        ? 'bg-black border-zinc-700 peer-checked:bg-blue-600 peer-checked:border-blue-600' 
        : 'bg-white border-zinc-300 peer-checked:bg-blue-600 peer-checked:border-blue-600'}`}>
      
      {/* 🌟 V자 아이콘 (SVG 추가) - 체크되었을 때만 opacity-100으로 나타남 */}
      <svg 
        className={`w-3.5 h-3.5 text-white transition-opacity duration-200 ${useSearch ? 'opacity-100' : 'opacity-0'}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        strokeWidth="4" // 선 두께를 굵게 해서 V자가 잘 보이게 설정
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
                <span className={`ml-3 text-sm font-bold transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-zinc-600'}`}>
                  🔍 최신 정보 팩트체크 활성화 (실시간 구글 검색 반영)
                </span>
              </label>
            </div>

            {/* 선택 박스 (옵션 3가지씩 복구 완료) */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest block mb-3 ml-1">글의 말투 (Tone)</label>
                <select className={`w-full border-2 rounded-2xl p-4 text-sm font-bold appearance-none cursor-pointer ${isDark ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-200 text-black'}`}>
                  <option>친근하고 부드러운 말투</option>
                  <option>전문적이고 분석적인 말투</option>
                  <option>익살스럽고 재치있는 말투</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest block mb-3 ml-1">글 길이 (Length)</label>
                <select className={`w-full border-2 rounded-2xl p-4 text-sm font-bold appearance-none cursor-pointer ${isDark ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-200 text-black'}`}>
                  <option>짧게 (약 800자)</option>
                  <option>보통 (약 1,500자)</option>
                  <option>길게 (약 3,000자 이상)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 오른쪽 버튼 영역 */}
          <div className={`rounded-3xl p-8 border-2 flex flex-col justify-between transition-all ${
            isDark ? 'bg-zinc-950/50 border-zinc-800/50' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <p className={`text-sm font-bold leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                워드프레스 최적화 엔진이 <br/>
                <span className="text-blue-500 font-black italic">실시간 대기 중</span>입니다.
              </p>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white text-xl font-black rounded-2xl transition-all shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:-translate-y-1 active:translate-y-0 active:scale-95 disabled:opacity-50"
            >
              {loading ? "집필 중..." : "콘텐츠 생성 시작"}
            </button>
          </div>
        </div>

        {/* 생성 결과창 */}
        {content && (
          <div className={`mt-10 p-10 rounded-[24px] border-2 animate-in fade-in slide-in-from-bottom-4 duration-700 ${
            isDark ? 'bg-black/40 border-zinc-800 text-zinc-200' : 'bg-zinc-50 border-zinc-200 text-black'
          }`}>
            <div className="flex items-center justify-between mb-6 border-b border-zinc-800/30 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-blue-500 font-black tracking-tighter">AI GENERATED CONTENT</span>
              </div>
              
              {/* ✅ 버튼 그룹 수정 버전 */}
<div className="flex gap-2">
  {/* 복사하기 버튼 */}
  <button 
    onClick={() => {
      console.log("복사 버튼 클릭됨"); // 테스트용 로그
      handleCopy();
    }}
    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border flex items-center gap-2 ${
      isDark 
        ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800' 
        : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 shadow-sm'
    }`}
  >
    📋 복사하기
  </button>

  {/* TXT 저장 버튼 */}
  <button 
    onClick={() => {
      console.log("저장 버튼 클릭됨"); // 테스트용 로그
      handleDownload();
    }}
    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border flex items-center gap-2 ${
      isDark 
        ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800' 
        : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 shadow-sm'
    }`}
  >
    💾 TXT 저장
  </button>
</div>
            </div>
            
            {/* 글 본문 영역 */}
            <div className="whitespace-pre-wrap font-medium text-base leading-loose">
              {content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}