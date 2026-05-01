"use client";

import React, { useState, useEffect } from 'react';
import WordPressContent from '@/components/writing/WordPressContent';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Menu, X } from 'lucide-react';

type MainMenu = 'Writing' | 'Visuals' | 'Music' | 'Script' | 'Tools';

export default function AIHubUnifiedPage() {
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

  // 1. 브라우저 로딩 시 API 키 불러오기
  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  // 2. API 키 저장 함수
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    localStorage.setItem("gemini_api_key", newKey);
  };

  // 3. 콘텐츠 생성 실행 함수 (실시간 검색 및 팩트체크 강화 버전)
  const handleGenerate = async () => {
    if (!apiKey) return alert("Gemini API 키를 입력해주세요!");
    if (!topic) return alert("작성할 주제를 입력해주세요!");

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // ✅ 1. 사장님이 성공하신 모델명으로 고정
      const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview" 
      });

      // ✅ 이제 이 코드가 매일매일 날짜를 갱신해줍니다.
      const dateString = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
});

      // ✅ 2. AI에게 내리는 명확한 지시서 (프롬프트)
      const prompt = `
      [SYSTEM: PROFESSIONAL CONTENT CREATOR]
      오늘 날짜는 ${dateString}입니다.
      
      주제: "${topic}"
      **지정된 말투: "${tone}"**  // 👈 selectedTone 대신 이미 정의된 tone 사용
      **지정된 길이: "${length}"** // 👈 selectedLength 대신 이미 정의된 length 사용

        [작성 규칙]
        1. 반드시 **지정된 말투(${tone})**의 특성을 살려 전체 문장을 구성하세요.
        2. **지정된 길이(${length})**에 맞춰서 정보의 깊이와 양을 조절하세요.
        3. **SEO 최적화**: Title은 "${topic}" 키워드를 포함한 SEO 최적화 제목으로 작성하고, 모든 핵심 소제목은 반드시 Markdown H2(##) 태그를 사용하세요.
        4. **실시간 데이터**: 구글 검색 도구로 현재 시점의 실제 수치(주가, 지표, 뉴스)를 확보하여 정확하게 반영하세요. 수치는 표(Table) 형식을 활용하세요.
        5. **하이퍼링크 출처**: 글 하단 '참고 자료 출처'는 반드시 [뉴스 제목/출처](URL 주소) 마크다운 형식을 사용하여 클릭 시 바로 연결되게 작성하세요.
        6. **포맷팅**: 내용 전체적으로 구분선(---)을 절대 사용하지 마세요.
      `;

      // ✅ 3. [가장 중요] tools 설정을 generateContent 함수의 두 번째 인자로 정확히 삽입
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        tools: [
          { googleSearch: {} } as any, // 실시간 구글 검색 활성화
        ],
      });

      const response = await result.response;
      const text = response.text();
      setContent(text);

    } catch (error: any) {
      console.error("AI 생성 에러:", error);
      if (error.message.includes("503")) {
        alert("구글 서버가 현재 너무 바쁩니다. 5초 뒤에 다시 시도해주세요!");
      } else if (error.message.includes("403")) {
        alert("API 키 권한 에러입니다. Google AI Studio에서 Billing 설정을 확인해주세요.");
      } else {
        alert("에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    }
    setLoading(false);
  }; // handleGenerate 함수 끝

  // 1. 클립보드 복사 함수
  const handleCopy = async () => {
    if (!content) return alert("복사할 내용이 없습니다!");
    try {
      await navigator.clipboard.writeText(content);
      alert("글이 클립보드에 복사되었습니다!");
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  // 2. TXT 파일 다운로드 함수
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
      {/* 1. 왼쪽 사이드바 */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 border-r transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
        ${isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-300 bg-white'}
      `}>
        <div className="p-6 flex flex-col h-full overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <div className="text-2xl font-black italic tracking-tighter">AI STUDIO</div>
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

          <div className={`mt-auto p-4 border-t ${isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-white'}`}>
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
              <div className={`flex items-center gap-3 p-3 rounded-2xl ${isDark ? 'bg-zinc-900' : 'bg-zinc-50 border border-zinc-100'}`}>
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">N</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate leading-none mb-1">namea1000</p>
                  <p className="text-[10px] text-zinc-500">Hobby Plan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* 2. 오른쪽 메인 영역 */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className={`h-16 border-b flex items-center justify-between px-4 lg:px-8 ${isDark ? 'border-zinc-800 bg-black' : 'border-zinc-300 bg-white'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-zinc-500 hover:text-blue-500 transition-colors">
              <Menu size={24} />
            </button>
            <div className="flex space-x-4 lg:space-x-8 overflow-x-auto no-scrollbar whitespace-nowrap">
              {(['Writing', 'Visuals', 'Music', 'Script', 'Tools'] as MainMenu[]).map((m) => (
                <button key={m} onClick={() => setActiveMenu(m)} className={`text-sm font-black transition-all ${activeMenu === m ? 'text-blue-500' : 'text-zinc-500'}`}>{m}</button>
              ))}
            </div>
          </div>
          <button onClick={() => setTheme(isDark ? 'metallic' : 'dark')} className="flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold border border-zinc-700">
             {isDark ? '✨ Metallic' : '🌙 Dark'}
          </button>
        </header>

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
                  useSearch={useSearch}
                  setUseSearch={setUseSearch}
                  handleCopy={handleCopy}
                  handleDownload={handleDownload}
                  tone={tone}
                  setTone={setTone}
                  length={length}
                  setLength={setLength}
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