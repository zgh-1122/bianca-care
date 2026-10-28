"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Home, ShoppingBag, Search, Mail } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F5DC] text-[#1B4332] flex flex-col items-center justify-center py-8 px-4 sm:px-8 font-sans relative overflow-hidden">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-10 right-20 w-80 h-80 bg-[#52B788]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-20 w-96 h-96 bg-[#2D6A4F]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl w-full mx-auto space-y-6 relative z-10 text-center">
        
        {/* Top Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2 max-w-xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1B4332] text-[#F5F5DC] text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
            <Sparkles className="w-3 h-3 text-[#52B788]" /> Bianca Care • 404 Error
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#1B4332] tracking-tight uppercase leading-snug">
            Even an error page can have a next step.
          </h1>
          <p className="text-xs sm:text-sm text-[#2D6A4F] font-semibold">
            Good websites don't just prevent problems. They help people recover from them.
          </p>
        </motion.div>

        {/* Center Dark Luxury Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#1B4332] text-[#F5F5DC] border-2 border-[#52B788]/50 rounded-[32px] p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-8"
        >
          {/* Glow Accent */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#52B788]/20 rounded-full blur-2xl pointer-events-none"></div>

          {/* 404 Title */}
          <div className="space-y-1 relative z-10">
            <h2 className="text-6xl sm:text-8xl font-black tracking-tighter text-[#F5F5DC]">
              404
            </h2>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#52B788]">
              Page Not Found • The link might be broken or moved
            </p>
          </div>

          {/* 4 Quick Action Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
            
            <Link 
              href="/"
              className="bg-[#2D6A4F]/70 hover:bg-[#F5F5DC] hover:text-[#1B4332] border border-[#52B788]/40 hover:border-[#F5F5DC] rounded-2xl p-4 text-center space-y-2.5 transition-all duration-300 group cursor-pointer shadow-md hover:-translate-y-1"
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-[#1B4332] group-hover:bg-[#F5F5DC] border border-[#52B788]/40 flex items-center justify-center text-[#52B788] group-hover:text-[#1B4332] transition-all">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-wider text-[#F5F5DC] group-hover:text-[#1B4332]">Back Home</h3>
                <p className="text-[9px] text-[#D8F3DC]/70 group-hover:text-[#2D6A4F] mt-0.5">Return to main page</p>
              </div>
            </Link>

            <Link 
              href="/shop"
              className="bg-[#2D6A4F]/70 hover:bg-[#F5F5DC] hover:text-[#1B4332] border border-[#52B788]/40 hover:border-[#F5F5DC] rounded-2xl p-4 text-center space-y-2.5 transition-all duration-300 group cursor-pointer shadow-md hover:-translate-y-1"
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-[#1B4332] group-hover:bg-[#F5F5DC] border border-[#52B788]/40 flex items-center justify-center text-[#52B788] group-hover:text-[#1B4332] transition-all">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-wider text-[#F5F5DC] group-hover:text-[#1B4332]">Explore Shop</h3>
                <p className="text-[9px] text-[#D8F3DC]/70 group-hover:text-[#2D6A4F] mt-0.5">Browse collection</p>
              </div>
            </Link>

            <Link 
              href="/skin-quiz"
              className="bg-[#2D6A4F]/70 hover:bg-[#F5F5DC] hover:text-[#1B4332] border border-[#52B788]/40 hover:border-[#F5F5DC] rounded-2xl p-4 text-center space-y-2.5 transition-all duration-300 group cursor-pointer shadow-md hover:-translate-y-1"
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-[#1B4332] group-hover:bg-[#F5F5DC] border border-[#52B788]/40 flex items-center justify-center text-[#52B788] group-hover:text-[#1B4332] transition-all">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-wider text-[#F5F5DC] group-hover:text-[#1B4332]">Skin Quiz</h3>
                <p className="text-[9px] text-[#D8F3DC]/70 group-hover:text-[#2D6A4F] mt-0.5">Find your routine</p>
              </div>
            </Link>

            <Link 
              href="/support"
              className="bg-[#2D6A4F]/70 hover:bg-[#F5F5DC] hover:text-[#1B4332] border border-[#52B788]/40 hover:border-[#F5F5DC] rounded-2xl p-4 text-center space-y-2.5 transition-all duration-300 group cursor-pointer shadow-md hover:-translate-y-1"
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-[#1B4332] group-hover:bg-[#F5F5DC] border border-[#52B788]/40 flex items-center justify-center text-[#52B788] group-hover:text-[#1B4332] transition-all">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-wider text-[#F5F5DC] group-hover:text-[#1B4332]">Contact Us</h3>
                <p className="text-[9px] text-[#D8F3DC]/70 group-hover:text-[#2D6A4F] mt-0.5">Get support</p>
              </div>
            </Link>

          </div>

        </motion.div>

        {/* Footer Note */}
        <p className="text-[10px] font-bold text-[#2D6A4F] uppercase tracking-widest">
          Bianca Skincare • All Rights Reserved
        </p>

      </div>

    </div>
  );
}