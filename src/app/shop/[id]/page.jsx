
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Heart, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../../context/CardContext';

const products = [
  {
    id: 1,
    name: "Aura Botanical Glow Serum",
    category: "Serums",
    price: "$48.00",
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    badge: "Bestseller",
    description: "Deep hydrating organic serum infused with green tea and niacinamide to restore natural radiance.",
    ingredients: "Green Tea Extract, Niacinamide, Pure Hyaluronic Acid, Botanical Glycerin, Aloe Vera Juice.",
    howToUse: "Apply 3-4 drops onto clean skin morning and night before moisturizing. Gently pat until fully absorbed."
  },
  {
    id: 2,
    name: "Velvet Hydration Cream",
    category: "Moisturizers",
    price: "$42.00",
    rating: 4.8,
    reviews: 94,
    image: "https://tse3.mm.bing.net/th/id/OIP.TBZpFIiOWonaIoQxgnCLMAHaFl?r=0&pid=Api&h=220&P=0",
    badge: "New",
    description: "Locks in moisture for 24 hours with lightweight botanical extracts and soothing aloe vera.",
    ingredients: "Shea Butter, Jojoba Oil, Chamomile Extract, Aqua, Vitamin E.",
    howToUse: "Massage a nickel-sized amount onto face and neck using upward circular motions."
  },
  {
    id: 3,
    name: "Sage & Mint Gentle Cleanser",
    category: "Cleansers",
    price: "$28.00",
    rating: 4.7,
    reviews: 76,
    image: "https://tse2.mm.bing.net/th/id/OIP.Fa9yTmK49HPwvvsNb_0fsgHaHa?r=0&pid=Api&h=220&P=0",
    badge: "Organic",
    description: "Clears pores gently without stripping natural skin oils, leaving skin refreshed and balanced.",
    ingredients: "Sage Leaf Extract, Peppermint Oil, Coconut Glucoside, Panthenol.",
    howToUse: "Lather a small amount between wet hands, massage onto face for 60 seconds, and rinse thoroughly."
  },
  {
    id: 4,
    name: "Rose Quartz Radiance Mask",
    category: "Masks",
    price: "$36.00",
    rating: 5.0,
    reviews: 112,
    image: "https://tse1.mm.bing.net/th/id/OIP.C8w8RnA5-KQRhh5Fo6Xc-QHaHa?r=0&pid=Api&h=220&P=0",
    badge: "Limited",
    description: "Revitalizes dull skin and restores natural radiant glow instantly with rose clay.",
    ingredients: "French Rose Clay, Rosehip Seed Oil, Damask Rose Water, Kaolin.",
    howToUse: "Apply an even layer to clean skin, leave for 10-15 minutes, then rinse off with warm water."
  },
  {
    id: 5,
    name: "Deep Pore Purifying Toner",
    category: "Toners",
    price: "$32.00",
    rating: 4.6,
    reviews: 65,
    image: "https://tse4.mm.bing.net/th/id/OIP.V3Re9gbN7AuHuUmgKOw7OgHaHa?r=0&pid=Api&h=220&P=0",
    badge: "Popular",
    description: "Balances pH levels and tightens pores with natural herbal witch hazel extracts.",
    ingredients: "Witch Hazel, Tea Tree Leaf Oil, Cucumber Extract, Rose Water.",
    howToUse: "Sweep over cleansed face and neck using a cotton pad morning and evening."
  },
  {
    id: 6,
    name: "Botanical Eye Renewal Gel",
    category: "Serums",
    price: "$38.00",
    rating: 4.9,
    reviews: 88,
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80",
    badge: "Bestseller",
    description: "Reduces dark circles and fine lines around delicate eye areas with caffeine and peptides.",
    ingredients: "Green Coffee Bean Extract, Palmitoyl Tripeptide, Cucumber Hydrosol.",
    howToUse: "Gently tap a pea-sized amount around the orbital bone using your ring finger."
  },
  {
    id: 7,
    name: "Vitamin C Brightening Elixir",
    category: "Serums",
    price: "$52.00",
    rating: 4.9,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
    badge: "Award Winner",
    description: "Fades dark spots and boosts collagen synthesis for a luminous, even complexion.",
    ingredients: "L-Ascorbic Acid, Ferulic Acid, Kakadu Plum Extract, Vitamin E.",
    howToUse: "Smooth 3-5 drops over face and neck every morning before sunscreen application."
  },
  {
    id: 8,
    name: "Ultra-Calming Chamomile Balm",
    category: "Moisturizers",
    price: "$45.00",
    rating: 4.8,
    reviews: 53,
    image: "https://tse2.mm.bing.net/th/id/OIP.8AwBYbpwdxzdac6PaIoOLAHaHa?r=0&pid=Api&h=220&P=0",
    badge: "Sensitive",
    description: "Instantly relieves redness and irritation for easily reactive or stressed skin.",
    ingredients: "German Chamomile Oil, Colloidal Oatmeal, Calendula Extract, Beeswax.",
    howToUse: "Warm a small amount between fingertips and gently press onto irritated or dry areas."
  },
  {
    id: 9,
    name: "Herbal Detoxifying Mud Mask",
    category: "Masks",
    price: "$34.00",
    rating: 4.7,
    reviews: 91,
    image: "https://tse3.mm.bing.net/th/id/OIP.lgcq_FzsxJ2DnPtgQQrGdQHaHa?r=0&pid=Api&h=220&P=0",
    badge: "Organic",
    description: "Draws out deeply embedded impurities and excess sebum with mineral-rich volcanic ash.",
    ingredients: "Volcanic Ash, Bentonite Clay, Eucalyptus Oil, Activated Charcoal.",
    howToUse: "Apply to face avoiding eye area. Let dry for 10 minutes and rinse thoroughly."
  },
  {
    id: 10,
    name: "Hyaluronic Acid Moisture Boost",
    category: "Serums",
    price: "$46.00",
    rating: 5.0,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80",
    badge: "Bestseller",
    description: "Multi-molecular weight hyaluronic acid that quenches thirsty skin at every cellular layer.",
    ingredients: "Sodium Hyaluronate, Vitamin B5, Organic Rosewater.",
    howToUse: "Apply to slightly damp skin for maximum moisture retention before locking in with cream."
  },
  {
    id: 11,
    name: "Daily Mineral Sun Shield SPF 50",
    category: "Sunscreens",
    price: "$39.00",
    rating: 4.9,
    reviews: 167,
    image: "https://tse3.mm.bing.net/th/id/OIP.cUneW-1EOJuDfAIfIqMCbQHaHa?r=0&pid=Api&h=220&P=0",
    badge: "Essential",
    description: "Broad-spectrum UV protection with zero white cast and a smooth velvety matte finish.",
    ingredients: "Non-Nano Zinc Oxide, Raspberry Seed Oil, Green Tea Extract.",
    howToUse: "Apply generously as the final step in your morning skincare routine 15 minutes before sun exposure."
  },
  {
    id: 12,
    name: "Smoothing Bamboo Face Polish",
    category: "Scrubs",
    price: "$30.00",
    rating: 4.6,
    reviews: 44,
    image: "https://tse4.mm.bing.net/th/id/OIP.22HgOxW0iW_P44S8ylYOzQHaD3?r=0&pid=Api&h=220&P=0",
    badge: "Natural",
    description: "Biodegradable micro-particles gently buff away dead skin cells for a silky touch.",
    ingredients: "Bamboo Stem Extract, Papaya Enzymes, Sweet Almond Oil.",
    howToUse: "Massage gently onto wet skin in circular motions 2 times a week, then rinse off."
  },
  {
    id: 13,
    name: "Jojoba & Rosehip Facial Oil",
    category: "Serums",
    price: "$50.00",
    rating: 4.8,
    reviews: 82,
    image: "https://tse1.mm.bing.net/th/id/OIP.n2F8ieBeWdiSHyaBzUqQRQHaHa?r=0&pid=Api&h=220&P=0",
    badge: "Pure",
    description: "Nourishing facial oil packed with essential fatty acids to lock in extreme hydration.",
    ingredients: "Organic Rosehip Seed Oil, Golden Jojoba Oil, Vitamin E Oil.",
    howToUse: "Press 2-3 drops into skin as the final step of your nighttime routine."
  },
  {
    id: 14,
    name: "Cucumber Refreshing Mist Toner",
    category: "Toners",
    price: "$26.00",
    rating: 4.7,
    reviews: 59,
    image: "https://lalevanatural.com/cdn/shop/files/9BDAFA4D-22D5-4CDA-BAFF-61FBBBC9983F.jpg?v=1773778359",
    badge: "Refresh",
    description: "Instant cooling facial spritz loaded with organic cucumber juice and aloe extracts.",
    ingredients: "Cucumber Fruit Extract, Aloe Barbadensis Leaf Juice, Mint Water.",
    howToUse: "Mist directly onto face throughout the day whenever skin needs an instant refresher."
  },
  {
    id: 15,
    name: "Night Repair Cellular Cream",
    category: "Moisturizers",
    price: "$55.00",
    rating: 5.0,
    reviews: 134,
    image: "https://tse3.mm.bing.net/th/id/OIP.78R-ni8digtsvjYbntqdygHaHa?r=0&pid=Api&h=220&P=0",
    badge: "Luxury",
    description: "Works overnight while you sleep to regenerate skin elasticity and smooth expression lines.",
    ingredients: "Retinol Alternative (Bakuchiol), Ceramides, Evening Primrose Oil.",
    howToUse: "Smooth generously over clean face and neck every evening before sleep."
  },
  {
    id: 16,
    name: "AHA/BHA face scrub",
    category: "Toners",
    price: "$35.00",
    rating: 4.9,
    reviews: 118,
    image: "https://tse2.mm.bing.net/th/id/OIP.0QIrD5_RGtbkZE_RB9Y0HAHaHa?r=0&pid=Api&h=220&P=0",
    badge: "Popular",
    description: "Clears congested pores, smooths texture, and gently removes dead skin buildup.",
    ingredients: "Glycolic Acid, Salicylic Acid, Willow Bark Extract, Aloe Vera.",
    howToUse: "Saturate a cotton pad and swipe across face 2-3 times a week at night."
  },
  {
    id: 17,
    name: "Organic Honey Nourishing Lip Mask",
    category: "Masks",
    price: "$22.00",
    rating: 4.8,
    reviews: 73,
    image: "https://tse4.mm.bing.net/th/id/OIP.RICooC3QVq2mWMzdduk54AHaHa?r=0&pid=Api&h=220&P=0",
    badge: "Organic",
    description: "Intensively repairs chapped lips overnight with raw organic honey and shea butter.",
    ingredients: "Raw Wild Honey, Shea Butter, Coconut Oil, Vitamin E.",
    howToUse: "Apply a generous layer to lips before going to bed and leave on overnight."
  },
  {
    id: 18,
    name: "Centella Asiatica Recovery Cream",
    category: "Moisturizers",
    price: "$44.00",
    rating: 4.9,
    reviews: 96,
    image: "https://tse3.mm.bing.net/th/id/OIP.AOQTmIMFtL_-v2tOf7TRUQHaHa?r=0&pid=Api&h=220&P=0",
    badge: "Healing",
    description: "Accelerates skin barrier recovery and soothes irritation with pure tiger grass extract.",
    ingredients: "Centella Asiatica (Tiger Grass), Madecassoside, Allantoin.",
    howToUse: "Apply to sensitive or compromised areas morning and evening."
  },
  {
    id: 19,
    name: "Green Tea Purifying Cleansing Foam",
    category: "Cleansers",
    price: "$25.00",
    rating: 4.7,
    reviews: 84,
    image: "https://tse3.mm.bing.net/th/id/OIP.gKMk8ufukfhepa5dvh0B7wHaHa?r=0&pid=Api&h=220&P=0",
    badge: "Fresh",
    description: "Rich micro-foam cleanser infused with antioxidant-rich Jeju green tea leaves.",
    ingredients: "Jeju Green Tea Extract, Amino Acid Surfactants, Glycerin.",
    howToUse: "Work into a rich lather with water, massage onto face, and rinse clean."
  },
  {
    id: 20,
    name: "Peptide Anti-Aging Neck Serum",
    category: "Serums",
    price: "$58.00",
    rating: 5.0,
    reviews: 104,
    image: "https://tse4.mm.bing.net/th/id/OIP.AueNDTJWSCbiCrkRbkENLAHaEK?r=0&pid=Api&h=220&P=0",
    badge: "Advanced",
    description: "Targets delicate neck and decollete skin to firm, tighten, and smooth fine lines.",
    ingredients: "Multi-Peptide Complex, Squalane, Niacinamide, Hyaluronic Acid.",
    howToUse: "Apply upward strokes from chest to jawline morning and night."
  }
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState('details');

  const productId = Number(params?.id);
  const product = products.find((p) => p.id === productId) || products[0];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bianca_wishlist") || "[]");
    setWishlist(saved);
  }, []);

  const isLiked = wishlist.includes(product.id);

  const toggleWishlist = () => {
    let updated;

    if (isLiked) {
      updated = wishlist.filter((id) => id !== product.id);
    } else {
      updated = [...wishlist, product.id];
    }

    setWishlist(updated);
    localStorage.setItem("bianca_wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const handleAddToCartAndCheckout = () => {
    addToCart(product);
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5DC] via-[#EFEFE0] to-[#D8F3DC]/40 text-[#1B4332] pb-20 pt-10 px-4 sm:px-8 relative overflow-hidden font-sans">

      {/* Background Orbs */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-[#52B788]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#1B4332]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">

        {/* Navigation / Back Button */}
        <div className="flex items-center justify-between border-b border-[#1B4332]/15 pb-4">
          <Link href="/shop" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1B4332] text-[#F5F5DC] text-xs font-bold hover:bg-[#2D6A4F] transition-all shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>

          <span className="text-xs font-black uppercase tracking-widest text-[#52B788]">
            {product.category}
          </span>
        </div>

        {/* Product Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#E8F0E5]/95 backdrop-blur-md border-2 border-[#1B4332] rounded-3xl p-6 sm:p-10 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        >
          {/* Left: Product Image */}
          <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border-2 border-[#1B4332]/20 shadow-inner bg-[#E8F0E5]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#1B4332] text-[#F5F5DC] text-xs font-black uppercase tracking-wider shadow-md">
              {product.badge}
            </span>
          </div>

          {/* Right: Info */}
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1B4332]">
                <Star className="w-4 h-4 fill-[#1B4332] text-[#1B4332]" />
                <span className="font-black text-sm">{product.rating}</span>
                <span className="text-[#2D6A4F]/70 font-medium">
                  ({product.reviews} customer reviews)
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#1B4332] leading-tight">
                {product.name}
              </h1>

              <p className="text-2xl font-black text-[#1B4332]">{product.price}</p>
            </div>

            <p className="text-xs sm:text-sm text-[#2D6A4F] font-medium leading-relaxed">
              {product.description}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCartAndCheckout}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1B4332] text-[#F5F5DC] text-xs sm:text-sm font-bold hover:bg-[#2D6A4F] transition-all shadow-md cursor-pointer border border-[#52B788]"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart & Buy
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleWishlist}
                className={`p-3 rounded-full border-2 border-[#1B4332] transition-all cursor-pointer shadow-sm ${
                  isLiked
                    ? "bg-[#1B4332] text-[#F5F5DC]"
                    : "bg-[#E8F0E5] text-[#1B4332] hover:bg-[#E8F0E5]"
                }`}
                title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-[#F5F5DC]" : ""}`} />
              </motion.button>
            </div>

            {/* Features Badge */}
            <div className="pt-4 border-t border-[#1B4332]/15 grid grid-cols-2 gap-3 text-xs font-bold text-[#1B4332]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#52B788]" /> 100% Chemical-Free
              </div>

              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#52B788]" /> Dermatologist Tested
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs Section: Ingredients & Usage */}
        <div className="bg-[#E8F0E5]/90 backdrop-blur-md border-2 border-[#1B4332] rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex gap-4 border-b border-[#1B4332]/15 pb-3">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider cursor-pointer transition-all ${
                activeTab === 'details'
                  ? "bg-[#1B4332] text-[#F5F5DC]"
                  : "bg-[#E8F0E5] text-[#1B4332]"
              }`}
            >
              Key Ingredients
            </button>

            <button
              onClick={() => setActiveTab('usage')}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider cursor-pointer transition-all ${
                activeTab === 'usage'
                  ? "bg-[#1B4332] text-[#F5F5DC]"
                  : "bg-[#E8F0E5] text-[#1B4332]"
              }`}
            >
              How To Use
            </button>
          </div>

          <div className="text-xs sm:text-sm text-[#2D6A4F] font-medium leading-relaxed">
            {activeTab === 'details' ? (
              <p>
                🌱 <strong className="text-[#1B4332]">Formulated with:</strong> {product.ingredients}
              </p>
            ) : (
              <p>
                ✨ <strong className="text-[#1B4332]">Application Routine:</strong> {product.howToUse}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

