
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Leaf,
  HeartHandshake,
  ShoppingBag,
  Eye,
  X,
  Check
} from 'lucide-react';

import { useCart } from './context/CardContext';
import { products } from './data/products';

// Slide background images (public folder me hone chahiye)
const backgroundImages = [
  "/serum.png",
  "/night.png",
  "/sun.png",
  "/face.png",
  "/creame.png"
];

const categoriesList = [
  {
    id: 1,
    title: "Serums",
    subtitle: "18 Products",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Sunscreens",
    subtitle: "SPF 50+ Protection",
    image: "https://tse3.mm.bing.net/th/id/OIP.cUneW-1EOJuDfAIfIqMCbQHaHa?r=0&pid=Api&h=220&P=0"
  },
  {
    id: 3,
    title: "Moisturizers",
    subtitle: "24h Hydration",
    image: "https://tse3.mm.bing.net/th/id/OIP.TBZpFIiOWonaIoQxgnCLMAHaFl?r=0&pid=Api&h=220&P=0"
  },
  {
    id: 4,
    title: "Cleansers",
    subtitle: "Deep Purification",
    image: "https://tse2.mm.bing.net/th/id/OIP.Fa9yTmK49HPwvvsNb_0fsgHaHa?r=0&pid=Api&h=220&P=0"
  }
];

const featuredProducts = [
  {
    id: 1,
    name: "Aura Botanical Glow Serum",
    price: "$48.00",
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    description: "Deep hydrating organic serum infused with green tea and niacinamide to restore natural radiance."
  },
  {
    id: 2,
    name: "Velvet Hydration Cream",
    price: "$42.00",
    badge: "New",
    image: "https://tse3.mm.bing.net/th/id/OIP.TBZpFIiOWonaIoQxgnCLMAHaFl?r=0&pid=Api&h=220&P=0",
    description: "Locks in moisture for 24 hours with lightweight botanical extracts and soothing aloe vera."
  },
  {
    id: 15,
    name: "Night Repair Cellular Cream",
    price: "$55.00",
    badge: "Luxury",
    image: "https://tse3.mm.bing.net/th/id/OIP.78R-ni8digtsvjYbntqdygHaHa?r=0&pid=Api&h=220&P=0",
    description: "Works overnight while you sleep to regenerate skin elasticity and smooth expression lines."
  },
  {
    id: 14,
    name: "Cucumber Refreshing Mist Toner",
    price: "$26.00",
    badge: "Refresh",
    image: "https://lalevanatural.com/cdn/shop/files/9BDAFA4D-22D5-4CDA-BAFF-61FBBBC9983F.jpg?v=1773778359",
    description: "Instant cooling facial spritz loaded with organic cucumber juice and aloe extracts."
  }
];

const optionsList = [
  {
    id: 1,
    icon: Leaf,
    title: "100% Organic Extracts",
    description: "Pure botanical ingredients harvested sustainably for natural skin nourishment."
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: "Dermatologist Approved",
    description: "Rigorously tested formulas safe for all skin types, ensuring zero irritation."
  },
  {
    id: 3,
    icon: HeartHandshake,
    title: "Cruelty-Free & Ethical",
    description: "Never tested on animals, crafted with love for sustainable beauty care."
  }
];

export default function Home() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [selectedQuickView, setSelectedQuickView] = useState(null);
  const [addedCartId, setAddedCartId] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) =>
        prev === backgroundImages.length - 1 ? 0 : prev + 1
      );
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  // Add product to cart
  const handleAddToCart = (prod) => {
    const fullProduct = products.find((p) => p.id === prod.id) || prod;

    addToCart(fullProduct);
    setAddedCartId(prod.id);

    setTimeout(() => setAddedCartId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC] text-[#1B4332] font-sans overflow-x-hidden">

      {/* ================= 1. HERO SECTION ================= */}
      <div className="relative h-[85vh] w-full flex items-center justify-center px-6 sm:px-12 lg:px-20 overflow-hidden border-b-2 border-[#1B4332]">

        {/* Background slideshow */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#1B4332]">
          {backgroundImages.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden="true"
              loading="eager"
              decoding="async"
              draggable={false}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${
                i === currentBgIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          <div className="absolute inset-0 bg-black/40 z-10" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-20 max-w-4xl text-center space-y-4">

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border-2 border-[#1B4332] shadow-sm text-[#1B4332] text-xs font-extrabold tracking-widest uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#52B788] animate-spin" />
            Aura Botanicals Signature Collection
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white drop-shadow-lg"
          >
            Pure Radiance, <br />

            <span className="bg-gradient-to-r from-[#D8F3DC] via-[#52B788] to-[#95D5B2] bg-clip-text text-transparent">
              Naturally Crafted
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#EAF4EC] text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-semibold drop-shadow"
          >
            Experience the ultimate organic skincare routine designed to protect, hydrate, and rejuvenate your skin everyday.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-2 flex items-center justify-center gap-4"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#1B4332] text-[#F5F5DC] font-extrabold text-sm shadow-xl hover:bg-[#2D6A4F] hover:scale-105 transition-all border-2 border-[#52B788]"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ================= 2. SHOP BY CATEGORY ================= */}
      <section className="py-12 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 space-y-1"
        >
          <span className="text-xs uppercase tracking-widest text-[#52B788] font-extrabold">
            Explore Our Collections
          </span>

          <h2 className="text-3xl sm:text-4xl font-black text-[#1B4332]">
            Shop by Category
          </h2>

          <p className="text-[#2D6A4F] text-xs font-semibold max-w-md mx-auto">
            Discover our handcrafted collection of pure skincare essentials.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categoriesList.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="group relative rounded-2xl overflow-hidden bg-[#E8F0E5] border-2 border-[#1B4332] shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="h-52 w-full overflow-hidden relative bg-[#E8F0E5]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-4 text-center bg-[#E8F0E5] border-t border-[#1B4332]">
                <span className="text-[10px] tracking-widest text-[#52B788] font-extrabold uppercase">
                  {cat.subtitle}
                </span>

                <h3 className="text-sm font-extrabold text-[#1B4332] mt-0.5">
                  {cat.title}
                </h3>

                <Link
                  href="/shop"
                  className="mt-3 inline-flex items-center justify-center w-full py-2 rounded-full bg-[#1B4332] text-[#F5F5DC] text-xs font-bold hover:bg-[#2D6A4F] transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#1B4332] text-[#1B4332] font-extrabold text-xs uppercase tracking-widest hover:bg-[#1B4332] hover:text-[#F5F5DC] transition-all"
          >
            View All Collections
          </Link>
        </motion.div>
      </section>

      {/* ================= 3. FEATURED PRODUCTS ================= */}
      <section className="py-12 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto border-t border-[#1B4332]/20">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 space-y-1"
        >
          <span className="text-xs uppercase tracking-widest text-[#52B788] font-extrabold">
            Our Collection
          </span>

          <h2 className="text-3xl sm:text-4xl font-black text-[#1B4332]">
            Featured Products
          </h2>

          <p className="text-[#2D6A4F] text-xs font-semibold max-w-md mx-auto">
            Handpicked selection of exquisite skincare formulas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.map((prod, index) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="group relative bg-[#E8F0E5] border-2 border-[#1B4332] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
            >
              <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 bg-[#1B4332] text-[#F5F5DC] text-[9px] font-black tracking-widest rounded-full shadow">
                {prod.badge}
              </span>

              {/* Product image and Quick View */}
              <div className="h-52 w-full relative overflow-hidden bg-[#E8F0E5]">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="h-full w-full object-cover group-hover:scale-110 transition-all duration-500"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <button
                    onClick={() => setSelectedQuickView(prod)}
                    className="px-5 py-2.5 bg-[#1B4332] text-[#F5F5DC] font-extrabold text-xs rounded-full shadow-2xl flex items-center gap-2 border-2 border-[#52B788] hover:bg-[#2D6A4F] cursor-pointer transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Quick View
                  </button>
                </div>
              </div>

              <div className="p-4 text-center space-y-1.5 border-t border-[#1B4332] bg-[#E8F0E5]">
                <Link href={`/shop/${prod.id}`}>
                  <h3 className="font-extrabold text-sm text-[#1B4332] hover:text-[#52B788] transition-colors cursor-pointer">
                    {prod.name}
                  </h3>
                </Link>

                <p className="text-xs font-semibold text-[#52B788]">
                  {prod.price}
                </p>

                <button
                  onClick={() => handleAddToCart(prod)}
                  className={`w-full mt-1.5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 border-2 border-[#1B4332] cursor-pointer ${
                    addedCartId === prod.id
                      ? "bg-[#52B788] text-[#1B4332]"
                      : "bg-[#1B4332] text-[#F5F5DC] hover:bg-[#2D6A4F]"
                  }`}
                >
                  {addedCartId === prod.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1B4332] text-[#F5F5DC] font-extrabold text-sm shadow-md hover:bg-[#2D6A4F] transition-all"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* ================= 4. QUICK VIEW MODAL ================= */}
      <AnimatePresence>
        {selectedQuickView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#E8F0E5] border-2 border-[#1B4332] rounded-3xl p-6 max-w-lg w-full shadow-2xl relative space-y-5"
            >
              <button
                onClick={() => setSelectedQuickView(null)}
                aria-label="Close quick view"
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#E8F0E5] border-2 border-[#1B4332] flex items-center justify-center text-[#1B4332] hover:bg-[#1B4332] hover:text-[#F5F5DC] transition-all cursor-pointer shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                <div className="h-48 w-full rounded-2xl overflow-hidden border-2 border-[#1B4332] bg-[#E8F0E5]">
                  <img
                    src={selectedQuickView.image}
                    alt={selectedQuickView.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2">
                  <span className="px-2.5 py-0.5 bg-[#1B4332] text-[#F5F5DC] text-[9px] font-black tracking-widest rounded-full uppercase">
                    {selectedQuickView.badge}
                  </span>

                  <h3 className="text-xl font-black text-[#1B4332]">
                    {selectedQuickView.name}
                  </h3>

                  <p className="text-lg font-black text-[#52B788]">
                    {selectedQuickView.price}
                  </p>

                  <p className="text-xs text-[#2D6A4F] font-medium leading-relaxed">
                    {selectedQuickView.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1B4332]/20 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedQuickView(null)}
                  className="px-5 py-2 rounded-full bg-[#E8F0E5] text-[#1B4332] text-xs font-bold border-2 border-[#1B4332] hover:bg-[#D8E8D2] cursor-pointer"
                >
                  Close
                </button>

                <Link href={`/shop/${selectedQuickView.id}`}>
                  <span className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full bg-[#1B4332] text-[#F5F5DC] text-xs font-bold hover:bg-[#2D6A4F] transition-all shadow-md cursor-pointer border-2 border-[#1B4332]">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    View Details
                  </span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= 5. WHY CHOOSE US ================= */}
      <section className="py-12 px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-[#E8F0E5] border-2 border-[#1B4332] rounded-[30px] p-6 sm:p-10 shadow-md"
        >
          <div className="text-center mb-8 space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B4332]">
              Why Choose Aura Botanicals?
            </h2>

            <p className="text-[#2D6A4F] text-xs font-semibold">
              Our commitment to pure skin wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {optionsList.map((item, index) => {
              const IconComp = item.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                  className="bg-[#E8F0E5] border-2 border-[#1B4332] rounded-2xl p-5 flex flex-col items-center text-center space-y-3 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#1B4332] text-[#F5F5DC] flex items-center justify-center shadow-sm">
                    <IconComp className="w-5 h-5" />
                  </div>

                  <h3 className="text-sm font-extrabold text-[#1B4332]">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#2D6A4F] leading-relaxed font-medium">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>
    </div>
  );
}

