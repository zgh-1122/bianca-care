
"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';

const allProducts = [
  { id: 1, name: "Aura Botanical Glow Serum", category: "Serums", price: "$48.00", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80", description: "Deep hydrating organic serum infused with green tea and niacinamide to restore natural radiance." },
  { id: 2, name: "Velvet Hydration Cream", category: "Moisturizers", price: "$42.00", image: "https://tse3.mm.bing.net/th/id/OIP.TBZpFIiOWonaIoQxgnCLMAHaFl?r=0&pid=Api&h=220&P=0", description: "Locks in moisture for 24 hours with lightweight botanical extracts and soothing aloe vera." },
  { id: 3, name: "Sage & Mint Gentle Cleanser", category: "Cleansers", price: "$28.00", image: "https://tse2.mm.bing.net/th/id/OIP.Fa9yTmK49HPwvvsNb_0fsgHaHa?r=0&pid=Api&h=220&P=0", description: "Clears pores gently without stripping natural skin oils, leaving skin refreshed and balanced." },
  { id: 4, name: "Rose Quartz Radiance Mask", category: "Masks", price: "$36.00", image: "https://tse1.mm.bing.net/th/id/OIP.C8w8RnA5-KQRhh5Fo6Xc-QHaHa?r=0&pid=Api&h=220&P=0", description: "Revitalizes dull skin and restores natural radiant glow instantly with rose clay." },
  { id: 5, name: "Deep Pore Purifying Toner", category: "Toners", price: "$32.00", image: "https://tse4.mm.bing.net/th/id/OIP.V3Re9gbN7AuHuUmgKOw7OgHaHa?r=0&pid=Api&h=220&P=0", description: "Balances pH levels and tightens pores with natural herbal witch hazel extracts." },
  { id: 6, name: "Botanical Eye Renewal Gel", category: "Serums", price: "$38.00", image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80", description: "Reduces dark circles and fine lines around delicate eye areas with caffeine and peptides." },
  { id: 7, name: "Vitamin C Brightening Elixir", category: "Serums", price: "$52.00", image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80", description: "Fades dark spots and boosts collagen synthesis for a luminous, even complexion." },
  { id: 8, name: "Ultra-Calming Chamomile Balm", category: "Moisturizers", price: "$45.00", image: "https://tse2.mm.bing.net/th/id/OIP.8AwBYbpwdxzdac6PaIoOLAHaHa?r=0&pid=Api&h=220&P=0", description: "Instantly relieves redness and irritation for easily reactive or stressed skin." },
  { id: 9, name: "Herbal Detoxifying Mud Mask", category: "Masks", price: "$34.00", image: "https://tse3.mm.bing.net/th/id/OIP.lgcq_FzsxJ2DnPtgQQrGdQHaHa?r=0&pid=Api&h=220&P=0", description: "Draws out deeply embedded impurities and excess sebum with mineral-rich volcanic ash." },
  { id: 10, name: "Hyaluronic Acid Moisture Boost", category: "Serums", price: "$46.00", image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80", description: "Multi-molecular weight hyaluronic acid that quenches thirsty skin at every cellular layer." },
  { id: 11, name: "Daily Mineral Sun Shield SPF 50", category: "Sunscreens", price: "$39.00", image: "https://tse3.mm.bing.net/th/id/OIP.cUneW-1EOJuDfAIfIqMCbQHaHa?r=0&pid=Api&h=220&P=0", description: "Broad-spectrum UV protection with zero white cast and a smooth velvety matte finish." },
  { id: 12, name: "Smoothing Bamboo Face Polish", category: "Scrubs", price: "$30.00", image: "https://tse4.mm.bing.net/th/id/OIP.22HgOxW0iW_P44S8ylYOzQHaD3?r=0&pid=Api&h=220&P=0", description: "Biodegradable micro-particles gently buff away dead skin cells for a silky touch." },
  { id: 13, name: "Jojoba & Rosehip Facial Oil", category: "Serums", price: "$50.00", image: "https://tse1.mm.bing.net/th/id/OIP.n2F8ieBeWdiSHyaBzUqQRQHaHa?r=0&pid=Api&h=220&P=0", description: "Nourishing facial oil packed with essential fatty acids to lock in extreme hydration." },
  { id: 14, name: "Cucumber Refreshing Mist Toner", category: "Toners", price: "$26.00", image: "https://lalevanatural.com/cdn/shop/files/9BDAFA4D-22D5-4CDA-BAFF-61FBBBC9983F.jpg?v=1773778359", description: "Instant cooling facial spritz loaded with organic cucumber juice and aloe extracts." },
  { id: 15, name: "Night Repair Cellular Cream", category: "Moisturizers", price: "$55.00", image: "https://tse3.mm.bing.net/th/id/OIP.78R-ni8digtsvjYbntqdygHaHa?r=0&pid=Api&h=220&P=0", description: "Works overnight while you sleep to regenerate skin elasticity and smooth expression lines." },
  { id: 16, name: "AHA/BHA face scrub", category: "Toners", price: "$35.00", image: "https://tse2.mm.bing.net/th/id/OIP.0QIrD5_RGtbkZE_RB9Y0HAHaHa?r=0&pid=Api&h=220&P=0", description: "Clears congested pores, smooths texture, and gently removes dead skin buildup." },
  { id: 17, name: "Organic Honey Nourishing Lip Mask", category: "Masks", price: "$22.00", image: "https://tse4.mm.bing.net/th/id/OIP.RICooC3QVq2mWMzdduk54AHaHa?r=0&pid=Api&h=220&P=0", description: "Intensively repairs chapped lips overnight with raw organic honey and shea butter." },
  { id: 18, name: "Centella Asiatica Recovery Cream", category: "Moisturizers", price: "$44.00", image: "https://tse3.mm.bing.net/th/id/OIP.AOQTmIMFtL_-v2tOf7TRUQHaHa?r=0&pid=Api&h=220&P=0", description: "Accelerates skin barrier recovery and soothes irritation with pure tiger grass extract." },
  { id: 19, name: "Green Tea Purifying Cleansing Foam", category: "Cleansers", price: "$25.00", image: "https://tse3.mm.bing.net/th/id/OIP.gKMk8ufukfhepa5dvh0B7wHaHa?r=0&pid=Api&h=220&P=0", description: "Rich micro-foam cleanser infused with antioxidant-rich Jeju green tea leaves." },
  { id: 20, name: "Peptide Anti-Aging Neck Serum", category: "Serums", price: "$58.00", image: "https://tse4.mm.bing.net/th/id/OIP.AueNDTJWSCbiCrkRbkENLAHaEK?r=0&pid=Api&h=220&P=0", description: "Targets delicate neck and decollete skin to firm, tighten, and smooth fine lines." }
];

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bianca_wishlist") || "[]");
    setWishlistIds(saved.map(id => Number(id)));
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlistIds.filter(itemid => Number(itemid) !== Number(id));
    setWishlistIds(updated);
    localStorage.setItem("bianca_wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const likedProducts = allProducts.filter(p => wishlistIds.includes(Number(p.id)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5DC] via-[#EFEFE0] to-[#D8F3DC]/40 text-[#1B4332] pb-24 px-6 pt-12 relative overflow-hidden">

      {/* Background glow effects */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-[#52B788]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#1B4332]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">

        {/* Header & Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between border-b border-[#1B4332]/15 pb-6"
        >
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-[#1B4332] flex items-center gap-3">
              <Heart className="w-8 h-8 fill-[#1B4332] text-[#1B4332]" /> My Wishlist
            </h1>
            <p className="text-sm text-[#2D6A4F] font-medium">
              Your saved organic essentials & favorite skincare picks.
            </p>
          </div>
          <Link href="/shop" className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1B4332] text-[#F5F5DC] text-xs font-bold hover:bg-[#2D6A4F] transition-all shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
        </motion.div>

        {/* Wishlist Items List */}
        {likedProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-[#E8F0E5]/95 backdrop-blur-md rounded-3xl border-2 border-[#1B4332] space-y-4 shadow-xl"
          >
            <div className="w-16 h-16 bg-[#1B4332]/10 rounded-full flex items-center justify-center mx-auto text-[#1B4332]">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-[#1B4332]">Your wishlist is currently empty</h3>
            <p className="text-sm text-[#2D6A4F] max-w-sm mx-auto font-medium">
              Explore our collection and click the heart icon on any product to save it here for later.
            </p>
            <Link href="/shop" className="inline-block mt-4 px-6 py-3 rounded-full bg-[#1B4332] text-[#F5F5DC] text-xs font-bold shadow-md hover:bg-[#2D6A4F] transition-all">
              Explore Collection
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {likedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-[#E8F0E5]/95 backdrop-blur-md border-2 border-[#1B4332] rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img src={product.image} alt={product.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-[#1B4332]/25 shrink-0 shadow-inner bg-[#E8F0E5]" />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#52B788]">{product.category}</span>
                    <h4 className="text-lg font-black text-[#1B4332]">{product.name}</h4>
                    <p className="text-xs text-[#2D6A4F] line-clamp-1 font-medium">{product.description}</p>
                    <span className="text-sm font-black text-[#1B4332] mt-1 block">{product.price}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <Link href={`/shop/${product.id}`} className="px-5 py-2.5 rounded-full bg-[#1B4332] text-[#F5F5DC] text-xs font-bold hover:bg-[#2D6A4F] transition-all flex items-center gap-2 border-2 border-[#1B4332] shadow-sm">
                    <ShoppingBag className="w-3.5 h-3.5" /> View Product
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="p-2.5 rounded-full bg-[#E8F0E5] hover:bg-red-100 text-[#1B4332] hover:text-red-600 transition-colors border-2 border-[#1B4332] shadow-sm cursor-pointer"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

