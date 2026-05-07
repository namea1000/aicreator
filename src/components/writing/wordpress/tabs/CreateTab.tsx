"use client";

import React, { useState } from 'react';
import { Eye, X, PenLine, Sparkles, Loader2, Copy, FileText, Globe, MessageSquare, ListOrdered, MousePointer2, Zap, Plus, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function CreateTab({ 
  topic, setTopic, handleGenerate, loading, content,
  useSearch, setUseSearch, handleCopy, handleDownload,
  tone, setTone, length, setLength
}: any) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [postType, setPostType] = useState('생활 정책 및 정부 지원금');

  const topicPlaceholder = `원하시는 주제를 상세히 입력할수록 좋은 글이 생성됩니다.

(예시)
- 아이폰 15 프로와 갤럭시 S23 울트라의 카메라 성능 비교
- 초보자를 위한 3박 4일 도쿄 여행 코스 및 맛집 추천
- 2024년 청년 버팀목 전세자금대출 조건 및 신청 방법 정리
- 직장인을 위한 쉽고 맛있는 일주일 밑반찬 레시피 5가지`;

  const templates = [
    "최신 AI 기술을 활용한 워드프레스 자동 포스팅 구축 방법과 수익화 전략",
    "초보자도 5분 만에 끝내는 실무형 AI 툴 사용법 및 업무 효율화 가이드",
    "윈도우 11 최적화 설정 및 필수 유틸리티 설치 가이드 (속도 향상 팁)",
    "2026년 꼭 알아야 할 생활 속 유용한 상식 및 정보 총정리",
    "2026년 청년 전세자금대출 조건 및 정부 지원금 신청 방법 완벽 가이드",
    "금리 인하 시기 필수 투자 전략: 안정적인 배당주 및 채권 투자 분석",
    "삼성전자 주가 현황 및 2026년 주가 전망: 반도체 패러다임 변화 분석",
    "비타민 D 부족 증상과 올바른 영양제 선택법: 성분별 함량 비교",
    "가성비 끝판왕 무선 이어폰 내돈내산 1개월 실제 사용 후기 및 장단점 비교",
    "2026년형 신형 팰리세이드 시승기: 연비, 승차감, 옵션 추천 가이드",
    "신작 오픈월드 RPG 완벽 공략: 초반 레벨업 루트 및 필수 장비 획득처"
  ];

  return (
    <div className="flex h-full divide-x divide-zinc-800/50 bg-[#05070a]">
      
      {/* --- [왼쪽] 스튜디오 컨트롤 타워 (45%) --- */}
      <div className="w-[45%] flex flex-col h-full bg-[#05070a]">
        {/* 🌟 잘림 방지: h-full과 overflow-y-auto를 확실하게 적용 */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
          
          {/* 1. 주제 입력 섹션 */}
          <section className="space-y-3">
            <label className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <PenLine size={14} /> 포스팅 주제 / 키워드
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={topicPlaceholder}
              className="w-full h-44 bg-zinc-900/30 border border-zinc-800 rounded-2xl p-5 text-sm font-bold focus:outline-none focus:border-blue-600 transition-all resize-none placeholder:text-zinc-700 leading-relaxed text-white shadow-inner"
            />
          </section>

          {/* 2. 가로 설정 바 (기안서 디자인 100% 반영) */}
          <section className="p-6 bg-zinc-900/20 border border-zinc-800/50 rounded-[28px] space-y-6">
            
            {/* 상단: 팩트체크 & 웅장한 글 유형 */}
            <div className="flex items-center gap-6">
              <label className="flex items-center cursor-pointer group shrink-0">
                <input type="checkbox" checked={useSearch} onChange={(e) => setUseSearch(e.target.checked)} className="sr-only peer" />
                <div className="w-5 h-5 rounded border-2 border-zinc-700 peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center transition-all shadow-sm">
                  <svg className={`w-3.5 h-3.5 text-white ${useSearch ? 'opacity-100' : 'opacity-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="ml-3 text-[11px] font-black text-zinc-400 group-hover:text-zinc-200 uppercase tracking-tighter">🔍 FACT CHECK</span>
              </label>

              {/* [수정] 3개 단락 글 유형 완벽 복구 */}
              <div className="flex-1 flex items-center gap-3">
                <span className="text-[10px] font-black text-zinc-500 uppercase shrink-0">유형</span>
                <select 
                  value={postType} 
                  onChange={(e) => setPostType(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-[11px] font-bold text-zinc-300 outline-none focus:border-blue-600 appearance-none cursor-pointer"
                >
                  <optgroup label="1️⃣ 기본 및 도구">
                    <option>AI 자동 포스팅</option>
                    <option>AI 툴 및 웹 서비스 가이드</option>
                    <option>유틸리티 (설치/방법)</option>
                    <option>일반 정보성 포스팅</option>
                  </optgroup>
                  <optgroup label="2️⃣ 수익형 핵심 (고단가)">
                    <option>생활 정책 및 정부 지원금</option>
                    <option>금융 및 재테크</option>
                    <option>기업 정보 및 주식 정보</option>
                    <option>건강 정보 및 영양제 분석</option>
                  </optgroup>
                  <optgroup label="3️⃣ 리뷰 및 라이프 스타일">
                    <option>일반 제품 리뷰</option>
                    <option>자동차 모델 리뷰</option>
                    <option>게임 리뷰 및 공략법</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* 하단: 말투 & 길이 & 생성 버튼 (가로 배치) */}
            <div className="flex items-stretch gap-4">
              <div className="flex-1 space-y-3">
                {/* 말투 상세 설명 복구 */}
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-zinc-600 uppercase shrink-0 w-8">Tone</span>
                  <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-[10px] font-bold text-zinc-400 outline-none focus:border-blue-600">
                    <option>친근하고 부드러운 말투 (블로그 후기, 일상)</option>
                    <option>전문적이고 분석적인 말투 (경제, 기술, 정보전달)</option>
                    <option>익살스럽고 재치있는 말투 (커뮤니티, SNS, 유머)</option>
                    <option>비판적이고 날카로운 말투 (팩트체크, 비교 리뷰)</option>
                    <option>감성적이고 따뜻한 말투 (에세이, 여행, 맛집)</option>
                    <option>자신감 있고 설득력 있는 말투 (재테크, 투자 전망)</option>
                  </select>
                </div>
                {/* 길이 상세 설명 복구 */}
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-zinc-600 uppercase shrink-0 w-8">Size</span>
                  <select value={length} onChange={(e) => setLength(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-[10px] font-bold text-zinc-400 outline-none focus:border-blue-600">
                    <option>보통 (약 1,500자): 표준 블로그형 (일반 정보성)</option>
                    <option>짧게 (약 800자): 핵심 요약형 (뉴스, 정보 전달)</option>
                    <option>길게 (약 3,000자): SEO 상위 노출 공략용 (심층 분석)</option>
                    <option>아주 길게 (약 5,000자): 가이드북/칼럼형 (주제 완벽 정복)</option>
                  </select>
                </div>
              </div>

              {/* [수정] 생성 버튼 한국어 복구 */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-40 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white rounded-2xl flex flex-col items-center justify-center gap-1 transition-all shadow-lg shadow-blue-600/20 active:scale-95 group"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} className="group-hover:scale-110 transition-transform" />}
                <span className="text-[10px] font-black uppercase tracking-tighter">AI 콘텐츠 생성 시작</span>
              </button>
            </div>
          </section>

          {/* 3. 템플릿 선택 (잘림 없이 무한 스크롤 가능) */}
          <section className="space-y-4 pt-6 border-t border-zinc-800/50 pb-20">
            <div className="flex items-center gap-2">
              <MousePointer2 size={14} className="text-emerald-500" />
              <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">글쓰기 템플릿 (클릭 시 자동 입력)</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {templates.map((text, idx) => (
                <button
                  key={idx}
                  onClick={() => setTopic(text)}
                  className="w-full text-left px-5 py-4 bg-zinc-900/40 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800/60 rounded-xl text-[11px] font-bold text-zinc-500 transition-all flex items-center justify-between group"
                >
                  <span className="truncate group-hover:text-white transition-colors">{text}</span>
                  <Plus size={14} className="text-zinc-800 group-hover:text-blue-500 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* --- [오른쪽] 결과 프리뷰 (55%) --- */}
      <div className="w-[55%] flex flex-col bg-[#05070a] overflow-hidden">
        {/* 상단 고정 툴바 (기존 기능 보존) */}
        <div className="flex justify-between items-center px-10 py-6 border-b border-zinc-800/50 bg-[#05070a]/80 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${content ? 'bg-blue-500 animate-pulse' : 'bg-zinc-700'}`} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${content ? 'text-blue-500' : 'text-zinc-600'}`}>
              {loading ? 'AI WRITING...' : content ? 'GENERATED CONTENT' : 'STUDIO READY'}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsPreviewOpen(true)} disabled={!content || loading} className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black text-zinc-400 hover:text-white transition-all disabled:opacity-20 uppercase">Preview</button>
            <button onClick={handleCopy} disabled={!content || loading} className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black text-zinc-400 hover:text-white transition-all disabled:opacity-20 uppercase">Copy</button>
            <button onClick={handleDownload} disabled={!content || loading} className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black text-zinc-400 hover:text-white transition-all disabled:opacity-20 uppercase">Save</button>
            <button disabled={!content || loading} className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black text-zinc-400 hover:text-white transition-all disabled:opacity-20"><Share2 size={12} className="text-emerald-500" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          {!content && !loading ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-800 animate-in fade-in">
              <PenLine size={32} className="mb-4 opacity-10" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">Wait For Command</p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
              <div className="prose prose-invert prose-blue max-w-none prose-sm font-medium leading-relaxed font-sans">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 미리보기 모달 생략 (기본 로직 유지) */}
    </div>
  );
}