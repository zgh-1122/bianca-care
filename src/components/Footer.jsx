import Link from 'next/link';
import { Sparkles, Heart, Send, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#F5F5DC] via-[#EFEFE0] to-[#D8F3DC]/40 border-t-2 border-[#1B4332]/20 pt-16 pb-12 text-[#2D6A4F] relative overflow-hidden">
      
      {/* Background glow circles */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#52B788]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#1B4332]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        
        {/* Top Perks Bar with Original Background Color & Clean Borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-14 border-b border-[#1B4332]/15">
          <div className="flex items-center gap-4 p-6 rounded-3xl bg-[#F5F5DC] backdrop-blur-md shadow-sm border-2 border-[#1B4332] hover:scale-[1.02] transition-transform">
            <div className="p-3.5 rounded-2xl bg-[#1B4332] text-[#F5F5DC] shadow-inner shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-[#1B4332] text-sm">Free Express Shipping</h4>
              <p className="text-xs text-[#2D6A4F] mt-0.5">On all luxury organic orders over $50</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-6 rounded-3xl bg-[#F5F5DC] backdrop-blur-md shadow-sm border-2 border-[#1B4332] hover:scale-[1.02] transition-transform">
            <div className="p-3.5 rounded-2xl bg-[#52B788] text-[#F5F5DC] shadow-inner shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-[#1B4332] text-sm">100% Clean Formulas</h4>
              <p className="text-xs text-[#2D6A4F] mt-0.5">Dermatologist tested & approved</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 rounded-3xl bg-[#F5F5DC] backdrop-blur-md shadow-sm border-2 border-[#1B4332] hover:scale-[1.02] transition-transform">
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-[#1B4332] to-[#52B788] text-[#F5F5DC] shadow-inner shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-[#1B4332] text-sm">Easy 30-Day Returns</h4>
              <p className="text-xs text-[#2D6A4F] mt-0.5">Hassle-free money back guarantee</p>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-full bg-[#1B4332] text-[#F5F5DC] shadow-sm">
                <Sparkles className="w-4 h-4 text-[#52B788]" />
              </div>
              <span className="text-xl font-black text-[#1B4332]">
                Bianca
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#2D6A4F] leading-relaxed font-medium">
              Absorb deep into pores. Elevate your daily skincare ritual with clean, organic luxury formulas crafted for natural radiant health.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black text-[#1B4332] mb-4 text-xs uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-semibold">
              <li><Link href="/" className="hover:text-[#1B4332] transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-[#1B4332] transition-colors">Shop Collection</Link></li>
              <li><Link href="/#quiz" className="hover:text-[#1B4332] transition-colors">Find Your Skin Routine</Link></li>
              <li><Link href="/#ingredients" className="hover:text-[#1B4332] transition-colors">Hero Ingredients</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-black text-[#1B4332] mb-4 text-xs uppercase tracking-widest">Customer Care</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-semibold">
              <li><span className="cursor-pointer hover:text-[#1B4332] transition-colors">Track Your Order</span></li>
              <li><span className="cursor-pointer hover:text-[#1B4332] transition-colors">Shipping & Delivery</span></li>
              <li><span className="cursor-pointer hover:text-[#1B4332] transition-colors">Returns & Refunds</span></li>
              <li><span className="cursor-pointer hover:text-[#1B4332] transition-colors">Contact Support</span></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="font-black text-[#1B4332] mb-4 text-xs uppercase tracking-widest">Join the Glow Club</h4>
            <p className="text-xs sm:text-sm text-[#2D6A4F] mb-3 font-medium">Subscribe to unlock 15% off your first luxury purchase.</p>
            <div className="flex items-center bg-[#F5F5DC] border-2 border-[#1B4332] rounded-full p-1.5 shadow-sm">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-3 py-1 text-xs bg-transparent focus:outline-none text-[#1B4332] placeholder-[#2D6A4F]/50 font-medium"
              />
              <button className="p-2.5 rounded-full bg-[#1B4332] text-[#F5F5DC] hover:bg-[#2D6A4F] transition-colors shadow">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1B4332]/15 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#2D6A4F] font-semibold">
          <p>© {new Date().getFullYear()} Bianca Beauty Products. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Crafted with <Heart className="w-3.5 h-3.5 text-[#1B4332] fill-[#1B4332] animate-pulse" /> for healthy organic skin
          </p>
        </div>
      </div>
    </footer>
  );
}