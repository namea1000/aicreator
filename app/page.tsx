"use client";

import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

type MainMenu = 'Writing' | 'Visuals' | 'Music' | 'Script' | 'Tools';

export default function AIHubUnifiedPage() {
  const [activeMenu, setActiveMenu] = useState<MainMenu>('Writing');
  const [theme, setTheme] = useState<'metallic' | 'dark'>('dark');
  const [apiKey, setApiKey] = useState("");
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const isDark = theme === 'dark';

  const sidebarData = {
    Writing: ['워드프레스 글쓰기', '네이버 글쓰기', '뉴스 글쓰기', 'SNS 글쓰기', '광고 카피라이팅', '텍스트 변형/확장', 'AI 캐릭터 페르소나 설정기', 'SEO 최적화 메타 데이터'],
    Visuals: ['이미지 생성기', '비디오 생성기', '썸네일 생성기', '유튜브 업로드', '유튜브 스튜디오', '네거티브 생성기'],
    Music: ['Suno 스타일 라이브러리', 'Suno 작곡', '가사 생성기(다국어)'],
    Script: ['대본 생성기(대본/이미지/비디오)'],
    Tools: ['AI 트렌드 대시보드', '다채널 리포퍼징', '콘텐츠 캘린더', 'AI 뉴스레터 생성기', '전자책 빌더', '스폰서 제안서 작성', '채널 분석', '키워드 분석', 'AI 뉴스레터 큐레이션', '챗봇']
  };

  const handleGenerate = async () => {
    if (!apiKey || !topic) return alert("API 키와 주제를 입력해주세요!");
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // 사장님 요청: Gemini 3 Flash Preview 모델 적용
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      const result = await model.generateContent(`${topic}에 대해 블로그 포스팅을 작성해줘.`);
      const response = await result.response;
      setContent(response.text());
    } catch (error) {
      console.error(error);
      alert("에러가 발생했습니다. 콘솔(F12)을 확인해주세요.");
    }
    setLoading(false);
  };

  return (
    <div className={`flex h-screen w-full transition-colors duration-500 ${isDark ? 'bg-black text-white' : 'bg-[#e5e5e7] text-zinc-900'}`}>
      
      {/* 1. 사이드바 영역 */}
      <aside className={`w-72 border-r flex flex-col h-full transition-colors duration-500 ${isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-300 bg-white'}`}>
        
        {/* 상단: 타이틀 및 메뉴 (스크롤 가능 영역) */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="text-2xl font-black mb-8 tracking-tighter italic">AI STUDIO</div>
          
          <nav className="mb-10">
            <p className="text-[10px] font-bold mb-4 uppercase tracking-[0.2em] text-zinc-500">{activeMenu} Studio Focus</p>
            <div className="space-y-1">
              {sidebarData[activeMenu].map((item) => (
                <div key={item} className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition-all ${isDark ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-600'}`}>
                  {item}
                </div>
              ))}
            </div>
          </nav>
        </div>

        {/* 하단: Management & Key 영역 (위치 고정 영역) */}
        <div className={`p-6 border-t ${isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-white'}`}>
          <nav className="mb-8">
            <p className="text-[10px] font-bold mb-3 uppercase tracking-[0.2em] text-zinc-500">Management</p>
            <div className="space-y-1 text-xs opacity-60">
              {['대시보드', '마켓플레이스', '커뮤니티', 'FAQ / Q&A', 'AI 챗봇'].map((item) => (
                <div key={item} className="px-3 py-1 hover:opacity-100 cursor-pointer transition-all">{item}</div>
              ))}
            </div>
          </nav>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">System Key</p>
              <input 
                type="password" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Gemini API Key"
                className={`w-full p-2.5 text-xs rounded-xl border-2 outline-none transition-all ${
                  isDark ? 'border-zinc-800 bg-black text-white focus:border-blue-600' : 'border-zinc-200 bg-white text-black focus:border-blue-400'
                }`}
              />
            </div>

            <div className={`flex items-center gap-3 p-3 rounded-2xl ${isDark ? 'bg-zinc-900 shadow-inner' : 'bg-zinc-50 border border-zinc-100'}`}>
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                N
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate leading-none mb-1">namea1000</p>
                <p className="text-[10px] text-zinc-500">Hobby Plan</p>
              </div>
              <button className="flex-shrink-0 text-[10px] font-bold text-blue-500 hover:underline px-1">
                Profile
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. 메인 영역 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className={`h-16 border-b flex items-center justify-between px-8 ${isDark ? 'border-zinc-800 bg-black' : 'border-zinc-300 bg-white'}`}>
          <div className="flex space-x-8">
            {(['Writing', 'Visuals', 'Music', 'Script', 'Tools'] as MainMenu[]).map((m) => (
              <button key={m} onClick={() => setActiveMenu(m)} className={`text-sm font-black py-5 relative transition-colors ${activeMenu === m ? 'text-blue-500' : 'text-zinc-500 hover:text-zinc-300'}`}>
                {m} Studio 
                {activeMenu === m && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />}
              </button>
            ))}
          </div>
          <button onClick={() => setTheme(isDark ? 'metallic' : 'dark')} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${isDark ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-300 text-zinc-800 hover:bg-zinc-100'}`}>
            {isDark ? '✨ M4 Metallic' : '🌙 Deep Dark'}
          </button>
        </header>

        <section className="flex-1 overflow-y-auto p-10 bg-transparent">
          {activeMenu === 'Writing' ? (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-black mb-2 tracking-tight">Writing Studio</h1>
              <p className="text-zinc-500 mb-10 font-medium text-sm">고퀄리티의 텍스트 콘텐츠를 단 몇 초 만에 생성합니다.</p>
              
              <div className={`p-8 rounded-3xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800 shadow-2xl' : 'bg-white border-zinc-200 shadow-xl'}`}>
                <div className="mb-6">
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3">Content Topic</p>
                  <input 
                    type="text" 
                    value={topic} 
                    onChange={(e) => setTopic(e.target.value)} 
                    placeholder="작성할 블로그 주제나 키워드를 입력하세요..." 
                    className={`w-full p-4 rounded-2xl bg-transparent border-2 outline-none transition-all ${
                      isDark ? 'border-zinc-800 focus:border-blue-600' : 'border-zinc-100 focus:border-blue-400'
                    }`} 
                  />
                </div>
                <button onClick={handleGenerate} disabled={loading} className="w-full py-5 rounded-2xl font-black text-lg bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all active:scale-[0.98]">
                  {loading ? "AI가 문장을 생성 중입니다..." : "AI 글쓰기 시작"}
                </button>
              </div>

              {content && (
                <div className={`mt-10 p-10 rounded-3xl border whitespace-pre-wrap text-lg leading-relaxed ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 shadow-md text-zinc-800'}`}>
                  {content}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-30 italic font-bold text-2xl">{activeMenu} Studio 준비 중...</div>
          )}
        </section>
      </main>
    </div>
  );
}