"use client";

import React, { useState } from 'react';
import { 
  Search, FileText, Trash2, Edit3, Eye, 
  Share2, Mail, Download, ChevronRight, 
  Filter, Calendar, MoreVertical, LayoutGrid, List,
  Type, AlignLeft, MessageSquare, Copy, Send
} from 'lucide-react';

// 🌟 기존 속성(Type, Date, Status) 보존 + 신규(Tone, Size) 추가
const initialPosts = [
  { 
    id: 1, 
    title: "아이폰 17 프로 vs 갤럭시 S25 울트라 카메라 성능 비교", 
    type: "IT/리뷰", 
    tone: "전문적이고 분석적인 말투", 
    size: "보통 (약 1,500자)", 
    date: "2026-05-07", 
    status: "완료",
    content: "## 카메라 성능 비교\n두 기기의 센서 크기 차이는..." 
  },
  { 
    id: 2, 
    title: "2026년 청년 전세자금대출 조건 및 정부 지원금 신청 가이드", 
    type: "수익형 핵심", 
    tone: "자신감 있고 설득력 있는 말투", 
    size: "길게 (약 3,000자)", 
    date: "2026-05-06", 
    status: "초안",
    content: "## 2026 청년 대출 가이드\n청년들의 주거 안정을 위해..." 
  },
  { 
    id: 3, 
    title: "비타민 D 부족 증상과 올바른 영양제 선택법: 성분별 함량 비교", 
    type: "건강 정보", 
    tone: "친근하고 부드러운 말투", 
    size: "짧게 (약 800자)", 
    date: "2026-05-05", 
    status: "완료",
    content: "## 비타민 D의 중요성\n현대인들에게 비타민 D는 필수입니다..." 
  }
];

export default function PostListTab() {
  const [posts, setPosts] = useState(initialPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 삭제 기능 (기존 유지)
  const handleDelete = (id: number) => {
    if(confirm("정말 이 포스팅을 삭제하시겠습니까?")) {
      setPosts(posts.filter(p => p.id !== id));
      if (selectedPost?.id === id) setSelectedPost(null);
    }
  };

  return (
    <div className="flex h-full bg-[#05070a] text-zinc-300 font-sans">
      
      {/* --- [왼쪽] 게시판 리스트 영역 --- */}
      <div className={`flex-1 flex flex-col ${selectedPost ? 'hidden lg:flex' : 'flex'}`}>
        {/* 헤더 섹션 */}
        <div className="p-8 border-b border-zinc-800/50 bg-[#05070a]/50 backdrop-blur-xl shrink-0">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-1">Post Management</h2>
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">생성된 콘텐츠의 모든 설정값을 한눈에 관리하세요.</p>
            </div>
            <div className="flex gap-2">
               <button className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:text-white transition-all"><LayoutGrid size={18}/></button>
               <button className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20"><List size={18}/></button>
            </div>
          </div>

          {/* 검색 바 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input 
              type="text" 
              placeholder="제목, 말투, 유형 검색..."
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-blue-600 transition-all font-sans"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 🌟 메인 테이블 (기존 항목 + 말투, 길이) */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                <th className="px-6 py-2 text-left w-12 font-sans">No</th>
                <th className="px-6 py-2 text-left font-sans">Title</th>
                <th className="px-6 py-2 text-left w-32 font-sans">Type</th>
                <th className="px-6 py-2 text-left w-48 font-sans text-blue-500/80">Tone (말투)</th>
                <th className="px-6 py-2 text-left w-40 font-sans text-emerald-500/80">Size (길이)</th>
                <th className="px-6 py-2 text-left w-32 font-sans">Date</th>
                <th className="px-6 py-2 text-left w-24 font-sans">Status</th>
                <th className="px-6 py-2 text-center w-28 font-sans">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, idx) => (
                <tr 
                  key={post.id} 
                  className="group bg-zinc-900/20 border border-zinc-800 hover:bg-zinc-800/40 transition-all cursor-pointer"
                  onClick={() => { setSelectedPost(post); setIsEditing(false); }}
                >
                  <td className="px-6 py-5 rounded-l-2xl border-y border-l border-zinc-800/50 text-[11px] font-bold text-zinc-600 font-sans">{idx + 1}</td>
                  <td className="px-6 py-5 border-y border-zinc-800/50">
                    <span className="text-[14px] font-black text-zinc-300 group-hover:text-blue-400 transition-colors font-sans">{post.title}</span>
                  </td>
                  <td className="px-6 py-5 border-y border-zinc-800/50">
                    <span className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-full text-[10px] font-bold text-zinc-500 font-sans">{post.type}</span>
                  </td>
                  {/* 🌟 추가된 말투 컬럼 */}
                  <td className="px-6 py-5 border-y border-zinc-800/50">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 font-sans">
                      <MessageSquare size={12} className="text-blue-500" />
                      {post.tone.split(' (')[0]}
                    </div>
                  </td>
                  {/* 🌟 추가된 길이 컬럼 */}
                  <td className="px-6 py-5 border-y border-zinc-800/50">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 font-sans">
                      <AlignLeft size={12} className="text-emerald-500" />
                      {post.size.split(' (')[0]}
                    </div>
                  </td>
                  <td className="px-6 py-5 border-y border-zinc-800/50 text-[11px] font-bold text-zinc-600 font-sans">{post.date}</td>
                  <td className="px-6 py-5 border-y border-zinc-800/50">
                    <div className="flex items-center gap-1.5 font-sans">
                      <div className={`w-1.5 h-1.5 rounded-full ${post.status === '완료' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-[10px] font-black uppercase tracking-tighter">{post.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 rounded-r-2xl border-y border-r border-zinc-800/50" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all"><Edit3 size={16}/></button>
                      <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-900/20 rounded-lg text-zinc-500 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                      <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all"><MoreVertical size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- [오른쪽] 상세 보기 슬라이드 패널 --- */}
      {selectedPost && (
        <div className="w-full lg:w-[45%] h-full flex flex-col bg-[#080a0f] border-l border-zinc-800 animate-in slide-in-from-right duration-500">
          {/* 패널 헤더 */}
          <div className="p-6 border-b border-zinc-800/50 flex justify-between items-center bg-[#05070a]">
            <button onClick={() => setSelectedPost(null)} className="flex items-center gap-2 text-zinc-500 hover:text-white text-[11px] font-black uppercase tracking-widest font-sans">
              <ChevronRight className="rotate-180" size={16}/> Back to List
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all font-sans ${isEditing ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'}`}
              >
                {isEditing ? 'Save' : 'Edit Post'}
              </button>
              <button className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-blue-500 hover:text-blue-400 transition-all"><Download size={18}/></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
            {/* 설정 요약 정보 (말투, 길이 강조) */}
            <div className="flex gap-4 mb-10 pb-10 border-b border-zinc-800/50 font-sans">
               <div className="flex-1 p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/50">
                  <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Selected Tone</p>
                  <p className="text-[12px] font-bold text-blue-400">{selectedPost.tone}</p>
               </div>
               <div className="flex-1 p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/50">
                  <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Target Size</p>
                  <p className="text-[12px] font-bold text-emerald-400">{selectedPost.size}</p>
               </div>
            </div>

            <div className="max-w-3xl">
               <h1 className="text-4xl font-black text-white italic tracking-tighter leading-tight mb-8 font-sans">{selectedPost.title}</h1>
               
               {isEditing ? (
                 <textarea
                   value={selectedPost.content}
                   onChange={(e) => setSelectedPost({...selectedPost, content: e.target.value})}
                   className="w-full min-h-[50vh] bg-transparent border-none text-zinc-400 font-mono text-[14px] leading-[2.2] focus:outline-none resize-none"
                 />
               ) : (
                 <pre className="whitespace-pre-wrap text-zinc-400 font-mono text-[14px] leading-[2.2] font-sans">
                   {selectedPost.content}
                 </pre>
               )}
            </div>
          </div>

          {/* 패널 푸터 (공유 및 프리뷰) */}
          <div className="p-8 border-t border-zinc-800/50 flex gap-4 bg-[#05070a]">
             <button className="flex-1 flex items-center justify-center gap-3 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-[11px] font-black text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all uppercase tracking-widest font-sans">
               <Share2 size={18}/> SNS Share
             </button>
             <button className="flex-1 flex items-center justify-center gap-3 py-4 bg-blue-600 rounded-2xl text-[11px] font-black text-white hover:bg-blue-500 transition-all uppercase tracking-widest shadow-xl shadow-blue-600/20 font-sans">
               <Eye size={18}/> Preview Mode
             </button>
          </div>
        </div>
      )}
    </div>
  );
}