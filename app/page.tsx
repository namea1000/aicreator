"use client";

import React, { useState, useEffect, useRef } from 'react';
import WordPressContent from '@/components/writing/WordPressContent';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Menu, X, ChevronDown, User as UserIcon, Settings, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';

type MainMenu = 'Writing' | 'Visuals' | 'Music' | 'Script' | 'Tools';

export default function AIHubUnifiedPage() {
  // --- [상태 관리: 원본 유지] ---
  const [activeMenu, setActiveMenu] = useState<MainMenu>('Writing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState('워드프레스 글쓰기');
  const [theme, setTheme] = useState<'metallic' | 'dark'>('dark');
  const [apiKey, setApiKey] = useState("");
  
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(true);
  const [tone, setTone] = useState("전문적이고 분석적인 말투 (경제, 기술, 정보전달)");
  const [length, setLength] = useState("보통 (약 1,500자): 표준 블로그형 (일반적인 정보성 포스팅)");

  // --- [추가: 로그인 및 드롭다운 상태] ---
  const [user, setUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // 1. 초기 로딩 (API키 + 유저체크 + 외부클릭 감지)
  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) setApiKey(savedKey);

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    localStorage.setItem("gemini_api_key", newKey);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // --- [원본 로직: 콘텐츠 생성 함수] ---
  const handleGenerate = async () => {
    if (!apiKey) return alert("Gemini API 키를 입력해주세요!");
    if (!topic) return alert("작성할 주제를 입력해주세요!");

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      const dateString = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

      const prompt = `
      [SYSTEM: PROFESSIONAL CONTENT CREATOR]
      오늘 날짜는 ${dateString}입니다.
      주제: "${topic}"
      **지정된 말투: "${tone}"**
      **지정된 길이: "${length}"**
      [작성 규칙]
      1. 반드시 지정된 말투(${tone})의 특성을 살려 전체 문장을 구성하세요.
      2. 지정된 길이(${length})에 맞춰서 정보의 깊이와 양을 조절하세요.
      3. SEO 최적화: Title은 "${topic}" 키워드를 포함하고 소제목은 H2(##)를 사용하세요.
      4. 실시간 데이터: 구글 검색 도구로 수치를 확보하여 표(Table) 형식을 활용하세요.
      5. 하이퍼링크 출처: [뉴스 제목/출처](URL 주소) 형식을 사용하세요.
      6. 포맷팅: 내용 전체적으로 구분선(---)을 절대 사용하지 마세요.
      `;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} } as any],
      });

      const response = await result.response;
      setContent(response.text());
    } catch (error: any) {
      console.error("AI 생성 에러:", error);
      alert("에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!content) return alert("복사할 내용이 없습니다!");
    await navigator.clipboard.writeText(content);
    alert("글이 클립보드에 복사되었습니다!");
  };

  const handleDownload = () => {
    if (!content) return alert("저장할 내용이 없습니다!");
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${topic || 'ai_content'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const isDark = theme === 'dark';

  // --- [원본 데이터: 사이드바 리스트] ---
  const sidebarData = {
    Writing: ['워드프레스 글쓰기', '네이버 글쓰기', '뉴스 글쓰기', 'SNS 글쓰기', '광고 카피라이팅', '텍스트 변형/확장', 'AI 캐릭터 페르소나 설정기', 'SEO 최적화 메타 데이터'],
    Visuals: ['이미지 생성기', '비디오 생성기', '썸네일 생성기'],
    Music: ['Suno 스타일 라이브러리', 'Suno 작곡', '가사 생성기(다국어)'],
    Script: ['대본 생성기(대본/이미지/비디오)'],
    Tools: ['AI 트렌드 대시보드', '다채널 리포퍼징', '키워드 분석']
  };

  useEffect(() => {
    if (sidebarData[activeMenu]) {
      setActiveSubMenu(sidebarData[activeMenu][0]);
    }
  }, [activeMenu]);

  return (
    <div className={`flex h-screen w-full transition-colors duration-500 ${isDark ? 'bg-black text-white' : 'bg-[#e5e5e7] text-zinc-900'}`}>
      
      {/* 1. 사이드바 영역 */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 ${isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-300 bg-white'}`}>
        <div className="p-6 flex flex-col h-full overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <div className="text-2xl font-black italic tracking-tighter text-blue-500 uppercase">CREBOX.AI</div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-zinc-500"><X size={24} /></button>
          </div>
          
          <nav className="mb-10">
            <p className="text-[11px] font-black mb-5 uppercase tracking-[0.2em] text-blue-500/80 ml-2">{activeMenu} Focus</p>
            <div className="space-y-1.5">
              {sidebarData[activeMenu]?.map((item) => (
                <div key={item} onClick={() => setActiveSubMenu(item)} className={`px-4 py-3 text-[14px] font-bold rounded-xl cursor-pointer transition-all ${activeSubMenu === item ? (isDark ? 'bg-blue-600/15 text-blue-400 border border-blue-600/20' : 'bg-blue-50 text-blue-600 border border-blue-100') : (isDark ? 'hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200' : 'hover:bg-zinc-100 text-zinc-600')}`}>{item}</div>
              ))}
            </div>
          </nav>

          <nav className="mb-8">
            <p className="text-[11px] font-black mb-4 uppercase tracking-[0.2em] text-zinc-600 ml-2">Management</p>
            <div className="space-y-1">
              {['대시보드', '마켓플레이스', '커뮤니티', 'FAQ / Q&A', 'AI 챗봇'].map((item) => (
                <div key={item} className="px-4 py-2 text-[13px] font-bold text-zinc-500 hover:text-zinc-300 cursor-pointer transition-all">{item}</div>
              ))}
            </div>
          </nav>

          <div className="mt-auto pt-4 border-t border-zinc-800">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest px-2">System Key</p>
              <input type="password" value={apiKey} onChange={handleApiKeyChange} placeholder="Gemini API Key" className={`w-full p-2.5 text-[13px] font-bold rounded-xl border-2 outline-none transition-all ${isDark ? 'border-zinc-800 bg-black text-white focus:border-blue-600' : 'border-zinc-200 bg-white text-black focus:border-blue-400'}`} />
            </div>
          </div>
        </div>
      </aside>

      {/* 2. 메인 영역 */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 상단 헤더: MEXNI 스타일 + 프로필 로직 통합 */}
        <header className={`h-16 border-b flex items-center justify-between px-4 lg:px-8 z-40 ${isDark ? 'border-zinc-800 bg-black' : 'border-zinc-300 bg-white'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-zinc-500 hover:text-blue-500 transition-colors"><Menu size={24} /></button>
            <div className="hidden md:flex space-x-8">
              {(['Writing', 'Visuals', 'Music', 'Script', 'Tools'] as MainMenu[]).map((m) => (
                <button key={m} onClick={() => setActiveMenu(m)} className={`text-sm font-black transition-all ${activeMenu === m ? 'text-blue-500' : 'text-zinc-500'}`}>{m}</button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setTheme(isDark ? 'metallic' : 'dark')} className="px-3 py-1.5 rounded-full text-[10px] font-bold border border-zinc-700"> {isDark ? '✨ Metallic' : '🌙 Dark'}</button>
            
            {user ? (
              /* [로그인 상태] 드롭다운 */
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-zinc-800 transition-all group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-zinc-200 group-hover:text-white">
                    {user.email?.split('@')[0]}
                  </span>
                  <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-950/50">
                      <p className="text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-tighter">Member Identity</p>
                      <p className="text-sm font-bold truncate">{user.email?.split('@')[0]}</p>
                    </div>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"><UserIcon size={16} />내 프로필</button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"><Settings size={16} />API 키 설정</button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all border-t border-zinc-800 mt-1"><LogOut size={16} />로그아웃</button>
                  </div>
                )}
              </div>
            ) : (
              /* [비로그인 상태] MEXNI 버튼 스타일 */
              <div className="flex items-center gap-4">
                <Link href="/signup" className="text-xs font-bold text-zinc-400 hover:text-white transition-all">로그인</Link>
                <Link href="/signup">
                  <button className="px-4 py-2 bg-[#F6962F] hover:bg-[#E0851F] text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-orange-500/20">
                    회원가입
                  </button>
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* 3. 콘텐츠 영역 (원본 유지) */}
        <section className="flex-1 overflow-y-auto p-4 lg:p-10 bg-transparent">
          {activeMenu === 'Writing' ? (
            <>
              {activeSubMenu === '워드프레스 글쓰기' ? (
                <WordPressContent 
                  isDark={isDark} topic={topic} setTopic={setTopic} handleGenerate={handleGenerate} 
                  loading={loading} content={content} useSearch={useSearch} setUseSearch={setUseSearch}
                  handleCopy={handleCopy} handleDownload={handleDownload} tone={tone} setTone={setTone} 
                  length={length} setLength={setLength}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-30 italic font-bold text-2xl">{activeSubMenu} 준비 중...</div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-30 italic font-bold text-2xl">{activeMenu} Studio 준비 중...</div>
          )}
        </section>
      </main>
    </div>
  );
}