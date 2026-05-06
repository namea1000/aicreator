"use client";

import React, { useState, useEffect, useRef } from 'react';
import StudioLayout from '@/components/layout/StudioLayout';
import { ChevronDown, User as UserIcon, Settings, LogOut, Sparkles, Zap, ArrowRight, MousePointer2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';

export default function MainLandingPage() {
  const [isStudioActive, setIsStudioActive] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Writing');
  
  // ✅ [수정] studioViewMode 타입에 'MyPage' 추가
  const [studioViewMode, setStudioViewMode] = useState<'Studio' | 'Vault' | 'MyPage'>('Studio');
  
  const [user, setUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const menuItems = [
    { label: 'Writing Studio', value: 'Writing', desc: 'AI 글쓰기 & SEO 최적화 전문 엔진' },
    { label: 'Visuals Studio', value: 'Visuals', desc: '고퀄리티 이미지 및 비디오 생성' },
    { label: 'Music Studio', value: 'Music', desc: '텍스트 기반 AI 작곡 및 사운드 디자인' },
    { label: 'Script Studio', value: 'Script', desc: '유튜브, 광고, 시나리오 대본' },
    { label: 'Tools', value: 'Tools', desc: '크리에이터 마케팅 분석 도구' }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      
      {/* --- 전역 헤더 --- */}
      <header className="h-20 border-b border-zinc-800 bg-black flex items-center px-8 z-[100] relative shrink-0">
        <div className="absolute left-8 h-full flex items-center">
          <div 
            className="text-2xl font-black italic tracking-tighter text-blue-500 uppercase cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => { setIsStudioActive(false); setStudioViewMode('Studio'); }}
          >
            CREBOX.AI
          </div>
        </div>
        
        <div className="flex-1 flex justify-center items-center">
          <nav className="flex space-x-12">
            {menuItems.map((item) => (
              <button 
                key={item.value} 
                onClick={() => { 
                  setActiveMenu(item.value); 
                  setStudioViewMode('Studio'); 
                  setIsStudioActive(true); 
                }} 
                className={`text-2xl font-black uppercase tracking-tighter transition-all duration-300 relative py-1 ${isStudioActive && activeMenu === item.value && studioViewMode === 'Studio' ? 'text-blue-500' : 'text-white hover:text-blue-400'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute right-8 h-full flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-zinc-800/50 transition-all">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  {user.email?.[0].toUpperCase()}
                </div>
                <span className="text-base font-bold text-zinc-300 group-hover:text-white">{user.email?.split('@')[0]}</span>
                <ChevronDown size={18} className={`text-zinc-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-2 overflow-hidden z-[110]">
                  <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-950/50">
                    <p className="text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-tighter">Member Identity</p>
                    <p className="text-sm font-bold truncate text-white">{user.email?.split('@')[0]}</p>
                  </div>
                  
                  {/* ✅ [수정] 내 프로필 클릭 시 MyPage 모드로 전환 */}
                  <button 
                    onClick={() => { 
                      setIsProfileOpen(false); 
                      setIsStudioActive(true); 
                      setStudioViewMode('MyPage'); 
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                  >
                    <UserIcon size={16} />내 프로필
                  </button>
                  
                  <button 
                    onClick={() => { 
                      setIsProfileOpen(false); 
                      setIsStudioActive(true); 
                      setStudioViewMode('Vault'); 
                    }} 
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                  >
                    <Settings size={16} />API 키 관리
                  </button>
                  
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all border-t border-zinc-800 mt-1">
                    <LogOut size={16} />로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-sm font-bold text-zinc-400 hover:text-white transition-all">로그인</Link>
              <Link href="/signup">
                <button className="px-6 py-2.5 bg-[#F6962F] hover:bg-[#E0851F] text-white text-sm font-black rounded-lg shadow-lg">회원가입</button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* --- 메인 콘텐츠 영역 --- */}
      <div className="flex-1 flex overflow-hidden">
        {isStudioActive ? (
          <StudioLayout activeMenu={activeMenu} initialViewMode={studioViewMode} />
        ) : (
          <div className="flex-1 overflow-y-auto bg-[#05070a] custom-scrollbar relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-8 pt-12 pb-12 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold mb-6">
                <Sparkles size={12} /> All-in-One AI Creative Platform
              </div>

              <h1 className="text-6xl lg:text-7xl font-black tracking-tighter text-center leading-[1] italic uppercase mb-6">
                THE CREATOR'S <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-500">AI TOOLBOX</span>
              </h1>

              <p className="text-zinc-500 text-base font-medium text-center max-w-xl leading-snug mb-8">
                최첨단 AI 모델로 상상하는 모든 것을 생성하세요. <br />
                단 한 곳에서 제어하는 완벽한 크리에이티브 환경.
              </p>

              <div className="flex gap-4 mb-12">
                <button 
                  onClick={() => { setActiveMenu('Writing'); setIsStudioActive(true); setStudioViewMode('Studio'); }}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 group text-sm"
                >
                  Start Creating <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-3.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-black rounded-xl text-sm transition-all">
                  Explore Tools
                </button>
              </div>

              <div className="w-full text-left">
                <div className="flex items-center justify-between mb-6 border-b border-zinc-800/50 pb-4">
                   <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                     <MousePointer2 size={18} className="text-blue-500" /> POPULAR STUDIOS
                   </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuItems.map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => { setActiveMenu(item.value); setIsStudioActive(true); setStudioViewMode('Studio'); }}
                      className="group bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl hover:border-blue-500/50 hover:bg-zinc-900/60 transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center mb-4 border border-zinc-700 group-hover:scale-105 transition-transform duration-300">
                        <Zap size={18} className="text-blue-400" />
                      </div>
                      <h4 className="text-lg font-black mb-1 group-hover:text-blue-400 transition-colors uppercase italic">{item.label}</h4>
                      <p className="text-zinc-500 text-xs leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}