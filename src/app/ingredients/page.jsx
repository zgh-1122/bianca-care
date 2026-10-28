"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { products } from "../data/products";

// Ingredient ke naam me ye lafz mile to uska icon lag jata hai
const ICONS = [
  ["tea tree", "🍃"], ["tea", "🍃"], ["niacinamide", "🧪"], ["hyaluron", "💧"],
  ["glycerin", "💧"], ["aqua", "💧"], ["aloe", "🌿"], ["shea", "🥥"],
  ["jojoba", "🌼"], ["chamomile", "🌼"], ["vitamin e", "🌻"], ["sage", "🌿"],
  ["mint", "🌱"], ["coconut", "🥥"], ["rose", "🌹"], ["clay", "🪨"],
  ["kaolin", "🪨"], ["bentonite", "🪨"], ["witch", "🍂"], ["cucumber", "🥒"],
  ["coffee", "☕"], ["peptide", "🧬"], ["amino", "🧬"], ["ascorbic", "🍊"],
  ["ferulic", "🌾"], ["plum", "🍑"], ["volcanic", "🌋"], ["eucalyptus", "🌿"],
  ["charcoal", "⚫"], ["raspberry", "🍓"], ["zinc", "⚪"], ["bamboo", "🎋"],
  ["papaya", "🥭"], ["almond", "🌰"], ["honey", "🍯"], ["centella", "🌿"],
  ["squalane", "🫒"], ["ceramide", "🧴"], ["primrose", "🌼"], ["glycolic", "🧪"],
  ["salicylic", "🧪"], ["willow", "🌳"], ["oat", "🌾"], ["calendula", "🌼"],
  ["beeswax", "🐝"],
];

const getIcon = (name) => {
  const lower = name.toLowerCase();
  const match = ICONS.find(([key]) => lower.includes(key));
  return match ? match[1] : "🌿";
};

export default function IngredientsExplodedPage() {
  const { id } = useParams();
  const reduceMotion = useReducedMotion();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F5F5DC] text-[#1B4332]">
        <p className="font-bold">Product not found.</p>
        <Link href="/shop" className="underline">Back to shop</Link>
      </div>
    );
  }

  const names = product.ingredients
    .replace(/\.\s*$/, "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Ingredients ko product ke gird gol daire me barabar faasle par rakhna
  const items = names.map((name, i) => {
    const angle = ((-90 + (360 / names.length) * i) * Math.PI) / 180;
    return {
      name,
      icon: getIcon(name),
      x: 50 + 40 * Math.cos(angle),
      y: 50 + 38 * Math.sin(angle),
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5DC] via-[#EFEFE0] to-[#D8F3DC]/40 text-[#1B4332] px-6 py-10 relative overflow-hidden">
      <div className="absolute top-24 left-10 w-80 h-80 bg-[#52B788]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative">
        <Link
          href={`/shop/${product.id}`}
          className="inline-flex items-center gap-2 text-sm font-bold hover:text-[#52B788] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to product
        </Link>

        <div className="text-center mt-6 space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black leading-tight">{product.name}</h1>
          <p className="text-sm text-[#2D6A4F] font-medium">
            What's inside: {names.length} ingredients
          </p>
        </div>

        {/* Exploded view */}
        <div className="relative mx-auto mt-8 w-full max-w-xl aspect-square">
          {/* Lines: center se har ingredient tak */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {items.map((item, i) => (
              <motion.line
                key={item.name}
                x1="50"
                y1="50"
                x2={item.x}
                y2={item.y}
                stroke="#52B788"
                strokeWidth="0.35"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.5 + i * 0.12 }}
              />
            ))}
          </svg>

          {/* Product beech me (box nahi, background blend hota hai) */}
          <motion.img
            src={product.image.trim()}
            alt={product.name}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={
              reduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 1, scale: 1, y: [0, -8, 0] }
            }
            transition={{
              opacity: { duration: 0.6 },
              scale: { duration: 0.6, ease: "easeOut" },
              y: { duration: 4, ease: "easeInOut", repeat: Infinity },
            }}
            className="absolute inset-0 m-auto w-[44%] h-[44%] object-contain select-none"
            style={{ mixBlendMode: "multiply" }}
            draggable={false}
          />

          {/* Ingredients jo product se bikhar kar bahar aate hain */}
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ left: "50%", top: "50%", opacity: 0, scale: 0.3 }}
              animate={{ left: `${item.x}%`, top: `${item.y}%`, opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 14,
                delay: reduceMotion ? 0 : 0.4 + i * 0.12,
              }}
              whileHover={{ scale: 1.12 }}
              style={{ x: "-50%", y: "-50%" }}
              className="absolute flex flex-col items-center gap-1.5 cursor-default"
            >
              <span className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/90 border-2 border-[#1B4332] shadow-md flex items-center justify-center text-2xl sm:text-3xl">
                {item.icon}
              </span>
              <span className="text-[11px] sm:text-xs font-black text-center leading-tight max-w-[96px] bg-[#F5F5DC]/80 rounded-md px-1.5 py-0.5">
                {item.name}
              </span>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-[#2D6A4F] max-w-md mx-auto leading-relaxed">
          {product.howToUse}
        </p>
      </div>
    </div>
  );
}