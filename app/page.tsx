"use client"; // 반드시 맨 첫 줄에 있어야 합니다.
import React, { useState, useEffect } from 'react';
import WordPressContent from '@/components/writing/WordPressContent';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Menu, X } from 'lucide-react'; // 사이드바 열고 닫는 아이콘

type MainMenu = 'Writing' | 'Visuals' | 'Music' | 'Script' | 'Tools';

export default function AIHubUnifiedPage() {
  const [activeMenu, setActiveMenu] = useState<MainMenu>('Writing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 모바일 사이드바 상태 추가
  const [activeSubMenu, setActiveSubMenu] = useState('워드프레스 글쓰기');
  const [theme, setTheme] = useState<'metallic' | 'dark'>('dark');
  const [apiKey, setApiKey] = useState("");
  
  // AI 연동을 위한 상태값들 유지
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. 브라우저 로딩 시 API 키 불러오기 로직 유지
  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  // 2. API 키 저장 함수 유지
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    localStorage.setItem("gemini_api_key", newKey);
  };

  // 3. [핵심] 콘텐츠 생성 실행 함수 - 모델명만 사장님 지시대로 수정
  const handleGenerate = async () => {
    if (!apiKey) return alert("왼쪽 하단에 Gemini API 키를 입력해주세요!");
    if (!topic) return alert("작성할 주제를 입력해주세요!");

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // 사장님 요청 모델명: gemini-3-flash-preview (수정완료)
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      
      const prompt = `당신은 전문 블로거입니다. 다음 주제에 대해 워드프레스에 최적화된(H1, H2 태그 포함) 한국어 블로그 글을 아주 상세하게 작성해주세요. 주제: ${topic}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setContent(text); 
    } catch (error) {
      console.error("AI 생성 에러:", error);
      // 에러 메시지 보존
      alert("AI 호출 중 에러가 발생했습니다. 키를 확인하거나 잠시 후 다시 시도해주세요.");
    }
    setLoading(false);
  };

  const isDark = theme === 'dark';

  // 사이드바 메뉴 데이터 100% 보존
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
      
      {/* 1. 왼쪽 사이드바 - 디자인 및 로직 완전 보존 */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 border-r transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 
        ${isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-300 bg-white'}
      `}>
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <div className="text-2xl font-black italic tracking-tighter">AI STUDIO</div>
            {/* 모바일용 닫기 버튼 추가 */}
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-zinc-500"><X size={24} /></button>
          </div>
          
          <nav className="mb-10">
            <p className="text-[11px] font-black mb-5 uppercase tracking-[0.2em] text-blue-500/80 ml-2">{activeMenu} Focus</p>
            <div className="space-y-1.5">
              {sidebarData[activeMenu]?.map((item) => (
                <div 
                  key={item} 
                  onClick={() => setActiveSubMenu(item)}
                  className={`px-4 py-3 text-[14px] font-bold rounded-xl cursor-pointer transition-all ${
                    activeSubMenu === item 
                      ? (isDark ? 'bg-blue-600/15 text-blue-400 border border-blue-600/20' : 'bg-blue-50 text-blue-600 border border-blue-100')
                      : (isDark ? 'hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200' : 'hover:bg-zinc-100 text-zinc-600')
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </nav>

          <nav className="mb-8">
            <p className="text-[11px] font-black mb-4 uppercase tracking-[0.2em] text-zinc-600 ml-2">Management</p>
            <div className="space-y-1">
              {['대시보드', '마켓플레이스', '커뮤니티', 'FAQ / Q&A', 'AI 챗봇'].map((item) => (
                <div key={item} className="px-4 py-2 text-[13px] font-bold text-zinc-500 hover:text-zinc-300 cursor-pointer transition-all">
                  {item}
                </div>
              ))}
            </div>
          </nav>
        </div>

        <div className={`p-6 border-t ${isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-white'}`}>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">System Key</p>
                {apiKey && <span className="text-[9px] text-green-500 font-bold">SAVED ✅</span>}
              </div>
              <input 
                type="password" 
                value={apiKey}
                onChange={handleApiKeyChange}
                placeholder="Gemini API Key"
                className={`w-full p-2.5 text-[13px] font-bold rounded-xl border-2 outline-none transition-all ${
                  isDark ? 'border-zinc-800 bg-black text-white focus:border-blue-600' : 'border-zinc-200 bg-white text-black focus:border-blue-400'
                }`}
              />
            </div>

            <div className={`flex items-center gap-3 p-3 rounded-2xl ${isDark ? 'bg-zinc-900 shadow-inner' : 'bg-zinc-50 border border-zinc-100'}`}>
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">N</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate leading-none mb-1">namea1000</p>
                <p className="text-[10px] text-zinc-500">Hobby Plan</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 모바일 사이드바 열렸을 때 배경 어둡게 처리 [추가] */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
      {/* 2. 오른쪽 메인 영역 [수정] */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className={`h-16 border-b flex items-center justify-between px-4 lg:px-8 ${isDark ? 'border-zinc-800 bg-black' : 'border-zinc-300 bg-white'}`}>
          <div className="flex items-center gap-4">
            {/* 모바일 전용 햄버거 메뉴 버튼 [추가] */}
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-zinc-500 hover:text-blue-500 transition-colors">
              <Menu size={24} />
            </button>
            <div className="flex space-x-4 lg:space-x-8 overflow-x-auto no-scrollbar whitespace-nowrap">
              {(['Writing', 'Visuals', 'Music', 'Script', 'Tools'] as MainMenu[]).map((m) => (
                <button key={m} onClick={() => setActiveMenu(m)} className={`text-sm font-black transition-all ${activeMenu === m ? 'text-blue-500' : 'text-zinc-500'}`}>{m}</button>
              ))}
            </div>
          </div>
          {/* 테마 변경 버튼 (모바일에서는 아이콘만 보이게 처리 가능) */}
          <button onClick={() => setTheme(isDark ? 'metallic' : 'dark')} className="flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold border border-zinc-700">
             {isDark ? '✨' : '🌙'}
          </button>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <section className="flex-1 overflow-y-auto p-4 lg:p-10 bg-transparent">
          {activeMenu === 'Writing' ? (
            <>
              {activeSubMenu === '워드프레스 글쓰기' ? (
                <WordPressContent 
                  isDark={isDark} 
                  topic={topic} 
                  setTopic={setTopic} 
                  handleGenerate={handleGenerate} 
                  loading={loading}
                  content={content}
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