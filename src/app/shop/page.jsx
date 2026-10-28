
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Sparkles, Star, Eye, Leaf } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CardContext';
import { products } from '../data/products';

const categories = ["All", "Serums", "Moisturizers", "Cleansers", "Masks", "Toners", "Sunscreens", "Scrubs"];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wishlist, setWishlist] = useState([]);

  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("bianca_wishlist") || "[]");
      setWishlist(saved);
    } catch (error) {
      setWishlist([]);
    }
  }, []);

  const toggleWishlist = (id) => {
    let updatedWishlist;

    if (wishlist.includes(id)) {
      updatedWishlist = wishlist.filter(item => item !== id);
    } else {
      updatedWishlist = [...wishlist, id];
    }

    setWishlist(updatedWishlist);
    localStorage.setItem("bianca_wishlist", JSON.stringify(updatedWishlist));
  };

  const handleAddToCartAndCheckout = (product) => {
    addToCart(product);
    router.push('/cart');
  };

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5DC] via-[#EFEFE0] to-[#D8F3DC]/40 text-[#1B4332] pb-24 relative overflow-hidden font-sans">

      {/* Background glow elements */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-[#52B788]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#1B4332]/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#E8F0E5] to-transparent py-12 px-6 border-b border-[#1B4332]/10 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B4332] text-[#F5F5DC] text-[11px] font-bold tracking-widest uppercase shadow-sm">
            <Sparkles className="w-3 h-3 text-[#52B788]" /> Bianca Signature Collection
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#1B4332] tracking-tight">
            Pure Organic Skincare
          </h1>

          <p className="text-xs sm:text-sm text-[#2D6A4F] font-medium max-w-md mx-auto">
            Explore our curated luxury range of 20+ chemical-free, dermatologist-approved formulas.
          </p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-10">

        {/* Category Filters */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                selectedCategory === category
                  ? "bg-[#1B4332] text-[#F5F5DC] shadow-md scale-105 border-2 border-[#1B4332]"
                  : "bg-[#E8F0E5] text-[#1B4332] border-2 border-[#1B4332] hover:bg-[#E8F0E5]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Vertical Rows List */}
        <div className="space-y-4">
          {filteredProducts.map((product, index) => {
            const isLiked = wishlist.includes(product.id);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                className="group bg-[#E8F0E5]/90 backdrop-blur-md rounded-2xl p-4 border-2 border-[#1B4332] shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row items-center gap-4 relative overflow-hidden"
              >

                {/* Left Side: Product Image */}
                <Link
                  href={`/shop/${product.id}`}
                  className="relative w-full md:w-44 h-32 rounded-xl overflow-hidden bg-[#E8F0E5] shrink-0 border-2 border-[#1B4332]/20 shadow-inner block cursor-pointer"
                >
                  <img
                    src={product.image.trim()}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badge Overlay */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1B4332] text-[#F5F5DC] text-[9px] font-black uppercase tracking-wider shadow-md">
                      {product.badge}
                    </span>
                  </div>

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-[#1B4332]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F0E5] text-[#1B4332] text-[11px] font-extrabold shadow-lg border-2 border-[#1B4332]">
                      <Eye className="w-3.5 h-3.5" /> View
                    </span>
                  </div>
                </Link>

                {/* Right Side: Product Details */}
                <div className="flex-1 w-full flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-[#52B788] uppercase tracking-wider">
                        {product.category}
                      </span>

                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#1B4332]">
                        <Star className="w-3 h-3 fill-[#1B4332] text-[#1B4332]" />
                        {product.rating}
                        <span className="text-[#2D6A4F]/60 font-medium">
                          ({product.reviews})
                        </span>
                      </div>
                    </div>

                    <Link href={`/shop/${product.id}`}>
                      <h3 className="font-black text-[#1B4332] text-lg group-hover:text-[#52B788] transition-colors cursor-pointer leading-tight">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-[#2D6A4F] font-medium leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Bottom Row: Price & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1B4332]/15">
                    <span className="text-xl font-black text-[#1B4332]">
                      {product.price}
                    </span>

                    <div className="flex flex-wrap items-center justify-end gap-2.5">

                      {/* Wishlist Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleWishlist(product.id)}
                        className={`p-2.5 rounded-full transition-all border-2 border-[#1B4332] shadow-sm cursor-pointer ${
                          isLiked
                            ? "bg-[#1B4332] text-[#F5F5DC]"
                            : "bg-[#E8F0E5] text-[#1B4332] hover:bg-[#E8F0E5]"
                        }`}
                        title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-[#F5F5DC]" : ""}`} />
                      </motion.button>

                      {/* See Ingredients */}
                      <Link
                        href={`/shop/${product.id}/ingredients`}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#E8F0E5] text-[#1B4332] text-[11px] font-bold border-2 border-[#1B4332] hover:bg-[#E8F0E5] transition-colors shadow-sm cursor-pointer"
                      >
                        <Leaf className="w-3.5 h-3.5 text-[#52B788]" /> See Ingredients
                      </Link>

                      {/* Add to Cart Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCartAndCheckout(product)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1B4332] text-[#F5F5DC] text-[11px] font-bold hover:bg-[#2D6A4F] transition-colors shadow-md cursor-pointer border border-[#52B788]"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                      </motion.button>

                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

