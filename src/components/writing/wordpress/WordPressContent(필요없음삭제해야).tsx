"use client";

import React, { useState } from 'react';
import { Eye, X } from 'lucide-react';
// ✅ 마크다운 변환 라이브러리 (npm install react-markdown remark-gfm 필요)
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface WordPressProps {
  isDark: boolean;
  topic: string;
  setTopic: (val: string) => void;
  handleGenerate: () => void;
  loading: boolean;
  content: string;
  useSearch: boolean;
  setUseSearch: (value: boolean) => void;
  handleCopy: () => void;
  handleDownload: () => void;
  tone: string;
  setTone: (val: string) => void;
  length: string;
  setLength: (val: string) => void;
}

export default function WordPressContent({ 
  isDark, 
  topic, 
  setTopic, 
  handleGenerate, 
  loading, 
  content,
  useSearch,
  setUseSearch,
  handleCopy,
  handleDownload,
  tone,
  setTone,
  length,
  setLength
}: WordPressProps) {
  const tabs = ['글 생성', '개인설정', '카테고리 관리', '태그 최적화', '예약 발행'];
  const [activeTab, setActiveTab] = useState('글 생성');
  
  // ✅ 미리 보기 모달 상태
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto">
      {/* 1. 상단 탭 메뉴 (원본 100% 보존) */}
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

      {/* 2. 메인 설정 카드 (원본 100% 보존) */}
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

            {/* 실시간 구글 검색 체크박스 (V자 SVG 로직 완벽 복구) */}
            <div className="flex items-center gap-3 px-1 -mt-4">
              <label className="relative flex items-center cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={useSearch}
                  onChange={(e) => setUseSearch(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center
                  ${isDark 
                    ? 'bg-black border-zinc-700 peer-checked:bg-blue-600 peer-checked:border-blue-600' 
                    : 'bg-white border-zinc-300 peer-checked:bg-blue-600 peer-checked:border-blue-600'}`}>
                  <svg 
                    className={`w-3.5 h-3.5 text-white transition-opacity duration-200 ${useSearch ? 'opacity-100' : 'opacity-0'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    strokeWidth="4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={`ml-3 text-sm font-bold transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-zinc-600'}`}>
                  🔍 최신 정보 팩트체크 활성화 (실시간 구글 검색 반영)
                </span>
              </label>
            </div>

            {/* 선택 박스 영역 (말투와 길이 옵션 전체 복구) */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest block mb-3 ml-1">글의 말투 (Tone)</label>
                <select 
                  value={tone} 
                  onChange={(e) => setTone(e.target.value)} 
                  className={`w-full border-2 rounded-2xl p-4 text-sm font-bold appearance-none cursor-pointer ${
                    isDark ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-200 text-black'
                  }`}
                >
                  <option>친근하고 부드러운 말투 (블로그 후기, 일상)</option>
                  <option>전문적이고 분석적인 말투 (경제, 기술, 정보전달)</option>
                  <option>익살스럽고 재치있는 말투 (커뮤니티, SNS, 유머)</option>
                  <option>비판적이고 날카로운 말투 (팩트체크, 비교 리뷰)</option>
                  <option>감성적이고 따뜻한 말투 (에세이, 여행, 맛집)</option>
                  <option>자신감 있고 설득력 있는 말투 (재테크, 투자 전망)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest block mb-3 ml-1">글 길이 (Length)</label>
                <select 
                  value={length} 
                  onChange={(e) => setLength(e.target.value)} 
                  className={`w-full border-2 rounded-2xl p-4 text-sm font-bold appearance-none cursor-pointer ${
                    isDark ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-200 text-black'
                  }`}
                >
                  <option>짧게 (약 800자): 핵심 요약형 (뉴스 요약, 빠른 정보 전달)</option>
                  <option>보통 (약 1,500자): 표준 블로그형 (일반적인 정보성 포스팅)</option>
                  <option>길게 (약 3,000자): 심층 분석형 (SEO 상위 노출 공략용)</option>
                  <option>아주 길게 (약 5,000자): 가이드북/칼럼형 (하나의 주제를 완벽 정복)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 오른쪽 버튼 영역 (원본 보존) */}
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

        {/* 생성 결과창 (미리 보기 버튼 추가된 완벽판) */}
        {content && (
          <div className={`mt-10 p-10 rounded-[24px] border-2 animate-in fade-in slide-in-from-bottom-4 duration-700 ${
            isDark ? 'bg-black/40 border-zinc-800 text-zinc-200' : 'bg-zinc-50 border-zinc-200 text-black'
          }`}>
            <div className="flex items-center justify-between mb-6 border-b border-zinc-800/30 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-blue-500 font-black tracking-tighter uppercase italic">AI GENERATED CONTENT</span>
              </div>
              
              <div className="flex gap-2">
                {/* 👁️ 추가: 미리 보기 버튼 */}
                <button 
                  onClick={() => setIsPreviewOpen(true)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border flex items-center gap-2 ${
                    isDark 
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800' 
                      : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 shadow-sm'
                  }`}
                >
                  <Eye size={14} /> 미리 보기
                </button>

                <button 
                  onClick={handleCopy}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border flex items-center gap-2 ${
                    isDark 
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800' 
                      : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 shadow-sm'
                  }`}
                >
                  📋 복사하기
                </button>

                <button 
                  onClick={handleDownload}
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
            
            <div className="whitespace-pre-wrap font-medium text-base leading-loose">
              {content}
            </div>
          </div>
        )}
      </div>

      {/* ✅ [웅장한 업그레이드] 실제 웹 화면처럼 표와 스타일을 보여주는 미리 보기 모달 */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 lg:p-10 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white text-zinc-900 w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-[48px] shadow-2xl flex flex-col relative animate-in zoom-in duration-300 border border-zinc-200">
            
            {/* 상단 브라우저 헤더 */}
            <div className="px-10 py-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/80">
              <div className="flex items-center gap-2">
                <div className="flex gap-2 mr-4">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F57] shadow-inner" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] shadow-inner" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#28C840] shadow-inner" />
                </div>
                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Web Preview Mode</span>
              </div>
              <button onClick={() => setIsPreviewOpen(false)} className="p-2 hover:bg-zinc-200 rounded-full text-zinc-400 transition-all active:scale-90"><X size={28} /></button>
            </div>

            {/* 🌟 실제 블로그/워드프레스 렌더링 영역 */}
            <div className="flex-1 overflow-y-auto p-12 lg:p-20 custom-scrollbar bg-white selection:bg-blue-100">
              <article className="max-w-3xl mx-auto">
                {/* 메인 제목 */}
                <h1 className="text-5xl font-black mb-16 leading-tight tracking-tighter text-black border-b-8 border-blue-500/10 pb-8 italic">
                  {topic || "포스팅 주제"}
                </h1>
                
                {/* 팩트체크 알림 배지 (실시간 검색 시 표시) */}
                {useSearch && (
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-12 flex items-center gap-4 text-blue-700 text-sm font-bold shadow-sm">
                    <span className="text-2xl">🔍</span> 실시간 구글 검색 결과가 반영된 최신 포스팅입니다.
                  </div>
                )}

                {/* 마크다운 렌더링 본문 (표, 소제목 완벽 렌더링) */}
                <div className="markdown-content leading-[2.1] text-zinc-800 font-medium">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // 표(Table) 스타일
                      table: ({node, ...props}) => (
                        <div className="my-12 w-full overflow-hidden rounded-2xl border border-zinc-200 shadow-sm">
                          <table className="w-full text-sm text-left border-collapse" {...props} />
                        </div>
                      ),
                      thead: ({node, ...props}) => <thead className="bg-zinc-50 border-b border-zinc-200" {...props} />,
                      th: ({node, ...props}) => <th className="px-5 py-4 font-black text-zinc-700 border-r border-zinc-200 last:border-0" {...props} />,
                      td: ({node, ...props}) => <td className="px-5 py-4 border-t border-zinc-100 border-r border-zinc-200 last:border-0" {...props} />,
                      // 소제목(H2) 스타일 - 파란색 포인트 바 적용
                      h2: ({node, ...props}) => <h2 className="scroll-m-20 border-l-8 border-blue-500 pl-6 text-3xl font-black tracking-tight mt-20 mb-10 text-black italic uppercase" {...props} />,
                      h3: ({node, ...props}) => <h3 className="scroll-m-20 text-2xl font-black tracking-tight mt-12 mb-6 text-zinc-800" {...props} />,
                      // 단락 및 리스트
                      p: ({node, ...props}) => <p className="mb-8" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-8 space-y-4 mb-10 text-zinc-700" {...props} />,
                      li: ({node, ...props}) => <li className="marker:text-blue-500" {...props} />,
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              </article>
            </div>

            {/* 하단 닫기 버튼 */}
            <div className="px-10 py-8 border-t border-zinc-100 bg-zinc-50/50 flex justify-center">
              <button 
                onClick={() => setIsPreviewOpen(false)} 
                className="px-14 py-4 bg-black text-white text-xs font-black rounded-2xl hover:bg-zinc-800 transition-all uppercase tracking-[0.3em] shadow-xl active:scale-95"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}