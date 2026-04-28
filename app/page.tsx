"use client";
import { useState } from "react";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateBlog = async () => {
    if (!apiKey) return alert("Gemini API 키를 입력해주세요!");
    setIsLoading(true);
    
    try {
      // Gemini API 호출 경로 (v1beta 버전 사용)
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `당신은 전문 블로그 작성자입니다. 주제: "${topic}". 이 주제에 대해 독자의 흥미를 끌 수 있는 제목과 유익한 본문 내용을 한글로 상세하게 작성해줘.`
            }]
          }]
        }),
      });

      const data = await response.json();
      
      // Gemini 응답 구조에서 텍스트 추출
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        setResult(data.candidates[0].content.parts[0].text);
      } else {
        throw new Error("응답 구조가 예상과 다릅니다.");
      }

    } catch (error) {
      console.error(error);
      alert("에러가 발생했습니다. API 키가 유효한지 확인해주세요!");
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen p-8 bg-black text-white flex flex-col items-center font-sans">
      <div className="w-full max-w-2xl bg-[#111] p-8 rounded-3xl shadow-2xl border border-[#333]">
        <h1 className="text-4xl font-black mb-2 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Gemini AI Writer
        </h1>
        <p className="text-center text-gray-500 mb-8">iMac M4 Local Server Studio</p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Gemini API Key</label>
            <input 
              type="password" 
              className="w-full p-4 rounded-xl bg-black border border-[#333] focus:border-blue-500 transition-all outline-none" 
              placeholder="Google AI Studio에서 받은 키를 입력하세요" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">블로그 주제</label>
            <input 
              type="text" 
              className="w-full p-4 rounded-xl bg-black border border-[#333] focus:border-blue-500 transition-all outline-none" 
              placeholder="예: 2026년 AI 트렌드 전망" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <button 
            onClick={generateBlog}
            disabled={isLoading}
            className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-gray-200 transition-all disabled:bg-gray-800 disabled:text-gray-600 shadow-lg shadow-white/5"
          >
            {isLoading ? "제미나이가 생각 중..." : "무료로 블로그 글 생성"}
          </button>
        </div>

        {result && (
          <div className="mt-10 p-8 bg-[#0a0a0a] rounded-2xl border border-[#222] text-gray-200 leading-relaxed overflow-hidden shadow-inner font-light">
            <div className="prose prose-invert max-w-none whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-10 flex gap-4 text-[10px] text-gray-600 font-mono">
        <span>STATUS: ONLINE</span>
        <span>|</span>
        <span>HARDWARE: IMAC M4</span>
        <span>|</span>
        <span>MODEL: GEMINI 3 FLASH Preview</span>
      </div>
    </main>
  );
}