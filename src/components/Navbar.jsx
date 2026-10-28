"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles, Menu, X, Heart, LayoutDashboard } from 'lucide-react';
import { useCart } from '../app/context/CardContext';

export default function Navbar({ wishlistCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();
  const pathname = usePathname();

  const isActive = (path) => pathname === path;
  const isShopActive = pathname === '/shop' || pathname.startsWith('/shop/');

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const drawerLinks = [
    { href: '/', label: 'Home', active: isActive('/') },
    { href: '/shop', label: 'Shop Collection', active: isShopActive },
    { href: '/dashboard', label: 'Brand Dashboard', active: isActive('/dashboard') },
    { href: '/quiz', label: 'Skin Quiz', active: isActive('/quiz') },
    { href: '/wishlist', label: 'Wishlist', active: isActive('/wishlist'), badge: wishlistCount },
    { href: '/cart', label: 'Cart & Receipt', active: isActive('/cart'), badge: cartCount },
    { href: '/support', label: 'Support & Help', active: isActive('/support') },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#F5F5DC]/90 border-b border-[#1B4332]/15 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="p-2 rounded-full bg-[#1B4332] text-[#F5F5DC] shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#52B788] animate-pulse" />
              </motion.div>
              <span className="text-xl font-black tracking-tight text-[#1B4332]">
                Bianca
              </span>
            </Link>

            {/* Desktop Navigation Links (Without Dashboard text link) */}
            <nav className="hidden md:flex items-center gap-7 font-bold text-xs uppercase tracking-wider text-[#2D6A4F]">
              <Link
                href="/"
                className={`transition-colors relative py-1 group ${
                  isActive('/') ? "text-[#1B4332] font-black" : "hover:text-[#1B4332]"
                }`}
              >
                Home
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] bg-[#1B4332] transition-all duration-300 rounded-full ${isActive('/') ? "w-full" : "w-0 group-hover:w-full"}`}></span>
              </Link>

              <Link
                href="/shop"
                className={`transition-colors relative py-1 group ${
                  isShopActive ? "text-[#1B4332] font-black" : "hover:text-[#1B4332]"
                }`}
              >
                Shop Collection
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] bg-[#1B4332] transition-all duration-300 rounded-full ${isShopActive ? "w-full" : "w-0 group-hover:w-full"}`}></span>
              </Link>

              <Link
                href="/quiz"
                className={`transition-colors relative py-1 group ${
                  isActive('/quiz') ? "text-[#1B4332] font-black" : "hover:text-[#1B4332]"
                }`}
              >
                Skin Quiz
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] bg-[#1B4332] transition-all duration-300 rounded-full ${isActive('/quiz') ? "w-full" : "w-0 group-hover:w-full"}`}></span>
              </Link>

              <Link
                href="/support"
                className={`transition-colors relative py-1 group ${
                  isActive('/support') ? "text-[#1B4332] font-black" : "hover:text-[#1B4332]"
                }`}
              >
                Support
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] bg-[#1B4332] transition-all duration-300 rounded-full ${isActive('/support') ? "w-full" : "w-0 group-hover:w-full"}`}></span>
              </Link>
            </nav>

            {/* Right Action Icons (Dashboard Icon added here) */}
            <div className="flex items-center gap-2.5 sm:gap-3">

              {/* Dashboard Icon */}
              <Link href="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2.5 rounded-full transition-all border shadow-sm flex items-center justify-center cursor-pointer ${
                    isActive('/dashboard')
                      ? "bg-[#1B4332] text-[#F5F5DC] border-[#1B4332] ring-2 ring-[#52B788]"
                      : "bg-[#EAF4EC] hover:bg-[#D8F3DC] text-[#1B4332] border-[#1B4332]/10"
                  }`}
                  title="Brand Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4" />
                </motion.div>
              </Link>

              {/* Wishlist Icon */}
              <Link href="/wishlist">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={`hidden sm:flex relative p-2.5 rounded-full transition-all border shadow-sm items-center justify-center cursor-pointer ${
                    isActive('/wishlist')
                      ? "bg-[#1B4332] text-[#F5F5DC] border-[#1B4332] ring-2 ring-[#52B788]"
                      : "bg-[#EAF4EC] hover:bg-[#D8F3DC] text-[#1B4332] border-[#1B4332]/10"
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isActive('/wishlist') ? "fill-[#F5F5DC]" : ""}`} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#1B4332] text-[#F5F5DC] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow">
                      {wishlistCount}
                    </span>
                  )}
                </motion.div>
              </Link>

              {/* Cart Icon */}
              <Link href="/cart">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-2.5 rounded-full transition-all shadow-md cursor-pointer flex items-center justify-center ${
                    isActive('/cart')
                      ? "bg-[#2D6A4F] text-[#F5F5DC] ring-2 ring-[#52B788] scale-105"
                      : "bg-[#1B4332] hover:bg-[#2D6A4F] text-[#F5F5DC]"
                  }`}
                  title="Cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#52B788] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </motion.div>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
                className="md:hidden p-2 rounded-xl text-[#1B4332] hover:bg-[#EAF4EC] transition-colors border border-[#1B4332]/10"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Side Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />

            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden fixed top-0 right-0 bottom-0 z-[70] w-[78%] max-w-xs bg-[#F5F5DC] text-[#1B4332] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-[#1B4332]/10">
                <span className="flex items-center gap-2 text-lg font-black tracking-tight">
                  <Sparkles className="w-4 h-4 text-[#52B788]" />
                  Bianca
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-[#1B4332]/10 hover:bg-[#1B4332]/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-5 py-4">
                {drawerLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between py-4 border-b border-[#1B4332]/10 text-base font-bold ${
                        link.active ? "text-[#2D6A4F]" : "text-[#1B4332] hover:text-[#2D6A4F]"
                      } transition-colors`}
                    >
                      <span className="flex items-center gap-2.5">
                        {link.active && <span className="w-1.5 h-1.5 rounded-full bg-[#52B788]"></span>}
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}