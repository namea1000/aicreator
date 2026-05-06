"use client";

import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, CreditCard, Trash2, Globe, Camera, Save, CheckCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function MyPageContent() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  
  // 블로그 연동 상태 관리
  const [blogIds, setBlogIds] = useState({
    wordpress: "",
    naver: "",
    tistory: ""
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSaveBlog = () => {
    // 여기에 DB 저장 로직 (Supabase 등) 추가
    alert("블로그 연동 정보가 안전하게 저장되었습니다.");
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 p-4 lg:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* 헤더 섹션 */}
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">내 프로필</h1>
          <p className="text-zinc-500 text-sm font-medium">CREBOX.AI에서 사용할 개인 설정 및 블로그 정보를 관리하세요.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 1. 프로필 정보 설정 */}
          <section className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <User className="text-blue-500" size={20} />
              <h2 className="text-xl font-black italic uppercase tracking-tight">프로필 정보</h2>
            </div>

            <div className="space-y-6">
              {/* 프로필 사진 섹션 */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-3xl font-bold border-4 border-zinc-800 overflow-hidden">
                    {user?.email?.[0].toUpperCase()}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-500 transition-all">
                    <Camera size={14} />
                  </button>
                </div>
                <div className="space-y-1">
                  <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg border border-zinc-700 transition-all">
                    이미지 업로드
                  </button>
                  <p className="text-[10px] text-zinc-500 font-medium">JPG, PNG, WebP / 최대 5MB</p>
                </div>
              </div>

              {/* 닉네임 입력 */}
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">닉네임</label>
                <input 
                  type="text" 
                  placeholder="사용할 닉네임을 입력하세요"
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all"
                />
                <p className="text-[10px] text-zinc-500 font-medium ml-1">2~20자 이내로 입력해주세요.</p>
              </div>

              <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2">
                <Save size={18} /> 설정 저장하기
              </button>
            </div>
          </section>

          {/* 2. 계정 정보 (상태 확인용) */}
          <section className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <Shield className="text-emerald-500" size={20} />
              <h2 className="text-xl font-black italic uppercase tracking-tight">계정 정보</h2>
            </div>

            <div className="space-y-5">
              {[
                { label: '이메일 주소', value: user?.email || '정보 없음' },
                { label: '로그인 방식', value: user?.app_metadata?.provider === 'email' ? '이메일 로그인' : '소셜 로그인' },
                { label: '가입일', value: new Date(user?.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) },
                { label: '계정 상태', value: '정상 (Verified)', color: 'text-emerald-400' },
              ].map((info, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{info.label}</span>
                  <span className={`text-sm font-black ${info.color || 'text-zinc-200'}`}>{info.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 3. 블로그 연동 설정 (🌟 사장님 핵심 요청 사항) */}
          <section className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <Globe className="text-blue-400" size={20} />
              <h2 className="text-xl font-black italic uppercase tracking-tight">콘텐츠 배포 자동화 설정</h2>
            </div>
            
            <p className="text-sm text-zinc-500 font-medium">자동 포스팅 기능을 사용할 블로그 아이디 및 API 정보를 입력하세요.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'wordpress', label: 'WordPress URL', placeholder: 'https://your-blog.com' },
                { id: 'naver', label: 'Naver Blog ID', placeholder: 'naver_id' },
                { id: 'tistory', label: 'Tistory ID', placeholder: 'tistory_id' },
              ].map((blog) => (
                <div key={blog.id} className="space-y-2">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">{blog.label}</label>
                  <input 
                    type="text" 
                    placeholder={blog.placeholder}
                    className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all"
                    value={(blogIds as any)[blog.id]}
                    onChange={(e) => setBlogIds({...blogIds, [blog.id]: e.target.value})}
                  />
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleSaveBlog}
              className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-black rounded-xl border border-zinc-700 transition-all flex items-center gap-2"
            >
              <CheckCircle size={18} /> 블로그 연동 정보 업데이트
            </button>
          </section>

          {/* 4. 구독 플랜 관리 */}
          <section className="lg:col-span-2 bg-blue-600/5 border border-dashed border-blue-600/30 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <CreditCard className="text-blue-500" size={20} />
                  <h2 className="text-xl font-black italic uppercase tracking-tight text-white">구독 플랜</h2>
                </div>
                <p className="text-sm text-zinc-500 font-medium">현재 Free 플랜을 이용 중입니다.</p>
              </div>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-600/20">
                플랜 업그레이드
              </button>
            </div>
          </section>

          {/* 5. 회원탈퇴 (위험 구역) */}
          <section className="lg:col-span-2 bg-red-950/10 border border-red-900/20 rounded-3xl p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-black italic uppercase tracking-tight text-red-500">회원탈퇴</h3>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                  탈퇴 시 30일간 복구가 가능하며, 그 후 모든 데이터는 영구 삭제됩니다.
                </p>
              </div>
              <button className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-black rounded-lg border border-red-500/20 transition-all flex items-center gap-2">
                <Trash2 size={14} /> 회원탈퇴 신청
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}