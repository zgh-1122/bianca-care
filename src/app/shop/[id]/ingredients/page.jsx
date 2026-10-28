// FILE: src/app/shop/[id]/ingredients/page.jsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { products } from "../../../data/products";

// Agar product ka outline pehchana na jaye to dot product ki aadhi chaurai ke itne hisse par lagta hai
// (0.8 = 80%). Dot product se bahar lage to isay barhayein, andar lage to ghatayein.
const FALLBACK_EDGE = 0.8;

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
  ["beeswax", "🐝"], ["madecassoside", "🌿"], ["allantoin", "🧴"],
  ["bakuchiol", "🌱"], ["panthenol", "🧴"], ["b5", "🧪"],
];

const getIcon = (name) => {
  const lower = name.toLowerCase();
  const match = ICONS.find(([key]) => lower.includes(key));
  return match ? match[1] : "🌿";
};

// Photo ko chhota karke pixel check karta hai: kahan product hai aur kahan background
function buildMask(img) {
  const MAX = 160;
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (!nw || !nh) return null;

  const k = Math.min(1, MAX / Math.max(nw, nh));
  const w = Math.max(2, Math.round(nw * k));
  const h = Math.max(2, Math.round(nh * k));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h); // browser ne roka to yahan error aayega

  const idx = (x, y) => (y * w + x) * 4;
  const corners = [idx(0, 0), idx(w - 1, 0), idx(0, h - 1), idx(w - 1, h - 1)];
  const transparentBg = corners.every((i) => data[i + 3] < 30);
  const bg = [0, 1, 2].map((c) => corners.reduce((s, i) => s + data[i + c], 0) / 4);

  const mask = new Uint8Array(w * h);
  let count = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = idx(x, y);
      let on = 0;
      if (transparentBg) {
        on = data[i + 3] >= 30 ? 1 : 0;
      } else if (data[i + 3] >= 30) {
        const d = Math.max(
          Math.abs(data[i] - bg[0]),
          Math.abs(data[i + 1] - bg[1]),
          Math.abs(data[i + 2] - bg[2])
        );
        on = d > 40 ? 1 : 0;
      }
      mask[y * w + x] = on;
      count += on;
    }
  }

  const ratio = count / (w * h);
  if (ratio < 0.03 || ratio > 0.97) return null; // andaza bharosemand nahi

  const rowHas = (y) => {
    let c = 0;
    for (let x = 0; x < w; x++) {
      if (mask[y * w + x]) {
        c++;
        if (c >= 2) return true;
      }
    }
    return false;
  };
  let top = 0;
  let bottom = h - 1;
  while (top < h - 1 && !rowHas(top)) top++;
  while (bottom > top && !rowHas(bottom)) bottom--;

  return { w, h, data: mask, top: top / h, bottom: (bottom + 1) / h };
}

// Kisi height par product ka left aur right kinara (photo ki chaurai ke hisab se 0 se 1)
function edgesAt(mask, yNorm) {
  const { w, h, data } = mask;
  const cy = Math.min(h - 1, Math.max(0, Math.round(yNorm * (h - 1))));
  let left = w;
  let right = -1;
  for (let y = Math.max(0, cy - 2); y <= Math.min(h - 1, cy + 2); y++) {
    for (let x = 0; x < w; x++) {
      if (data[y * w + x]) {
        if (x < left) left = x;
        break;
      }
    }
    for (let x = w - 1; x >= 0; x--) {
      if (data[y * w + x]) {
        if (x > right) right = x;
        break;
      }
    }
  }
  if (right < 0) return null;
  return { left: left / w, right: (right + 1) / w };
}

export default function IngredientsPage() {
  const { id } = useParams();
  const reduceMotion = useReducedMotion();
  const product = products.find((p) => p.id === Number(id));
  const imageUrl = product ? product.image.trim() : "";

  const [size, setSize] = useState(270);
  const [natural, setNatural] = useState(null);
  const [mask, setMask] = useState(null);
  const [ready, setReady] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const update = () => setSize(window.innerWidth < 640 ? 160 : 270);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Product ka outline pehchanna (alag chhoti image par, taake asli image kabhi na rukay)
  useEffect(() => {
    setNatural(null);
    setMask(null);
    setReady(false);
    if (!imageUrl) return undefined;

    let cancelled = false;
    const finish = () => {
      if (!cancelled) setReady(true);
    };
    const timer = setTimeout(finish, 1500);

    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth) {
      setNatural({ w: el.naturalWidth, h: el.naturalHeight });
    }

    const probe = new window.Image();
    probe.crossOrigin = "anonymous";
    probe.onload = () => {
      try {
        const result = buildMask(probe);
        if (!cancelled) setMask(result);
      } catch (error) {
        // is image ko browser parhne nahi deta, andaze wala tareeqa chalega
      }
      finish();
    };
    probe.onerror = finish;
    probe.src = imageUrl;

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [imageUrl]);

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

  const N = names.length;
  const S = size;
  const pad = 30;
  const gap = S < 200 ? 20 : 50;

  // Photo ka asli size (S x S ke andar fit)
  const fit = natural ? Math.min(S / natural.w, S / natural.h) : 1;
  const imgW = natural ? natural.w * fit : S;
  const imgH = natural ? natural.h * fit : S;
  const stageH = imgH + pad * 2;
  const labelStart = imgW / 2 + gap; // saare labels ek hi line me

  const items = names.map((name, i) => {
    const left = i % 2 === 0;
    const topN = mask ? mask.top : 0.12;
    const bottomN = mask ? mask.bottom : 0.88;
    const yNorm = topN + ((i + 0.5) / N) * (bottomN - topN);

    let dist = (imgW / 2) * FALLBACK_EDGE;
    if (mask) {
      const e = edgesAt(mask, yNorm);
      if (e) dist = left ? (0.5 - e.left) * imgW : (e.right - 0.5) * imgW;
    }
    dist = Math.max(8, Math.min(dist, imgW / 2));

    return { name, i, left, dist, y: pad + yNorm * imgH };
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5DC] via-[#EFEFE0] to-[#D8F3DC]/40 text-[#1B4332] px-4 sm:px-6 py-10 relative overflow-hidden">
      <div className="absolute top-24 left-10 w-80 h-80 bg-[#52B788]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto relative">
        <Link
          href={`/shop/${product.id}`}
          className="inline-flex items-center gap-2 text-sm font-bold hover:text-[#52B788] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to product
        </Link>

        <div className="text-center mt-6 space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black leading-tight">{product.name}</h1>
          <p className="text-sm text-[#2D6A4F] font-medium">
            Inside this bottle: {N} key ingredients
          </p>
        </div>

        <div className="relative mx-auto mt-6" style={{ height: stageH, width: "100%" }}>
          {/* Product: poori, beech me */}
          <motion.img
            ref={imgRef}
            src={imageUrl}
            alt={product.name}
            draggable={false}
            onLoad={(e) =>
              setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            className="absolute select-none"
            style={{
              top: pad,
              left: `calc(50% - ${imgW / 2}px)`,
              width: imgW,
              height: imgH,
              mixBlendMode: "multiply",
            }}
          />

          {/* Lines + dots (product ke kinare par) + icons + naam */}
          {items.map(({ name, i, left, dist, y }) => {
            const lineLen = labelStart - dist;
            const delay = reduceMotion ? 0 : 0.15 + i * 0.15;

            return (
              <div key={name}>
                {/* Line: product ke kinare se label tak */}
                <motion.div
                  aria-hidden
                  className="absolute h-[2px] bg-[#52B788]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: ready ? 1 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.5, delay: ready ? delay : 0 }}
                  style={{
                    top: y - 1,
                    width: lineLen,
                    transformOrigin: left ? "right center" : "left center",
                    ...(left
                      ? { right: `calc(50% + ${dist}px)` }
                      : { left: `calc(50% + ${dist}px)` }),
                  }}
                />

                {/* Dot: bilkul product ke kinare par */}
                <motion.span
                  aria-hidden
                  className="absolute w-2.5 h-2.5 rounded-full bg-[#1B4332]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: ready ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: ready ? delay : 0 }}
                  style={{
                    top: y - 5,
                    ...(left
                      ? { right: `calc(50% + ${dist - 5}px)` }
                      : { left: `calc(50% + ${dist - 5}px)` }),
                  }}
                />

                {/* Icon + naam */}
                <motion.div
                  className={`absolute flex flex-col gap-1 ${
                    left ? "items-end text-right" : "items-start text-left"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: ready ? 1 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.4, delay: ready ? delay + 0.25 : 0 }}
                  style={{
                    top: y,
                    transform: "translateY(-50%)",
                    maxWidth: `calc(50% - ${labelStart}px)`,
                    ...(left
                      ? { right: `calc(50% + ${labelStart}px)` }
                      : { left: `calc(50% + ${labelStart}px)` }),
                  }}
                >
                  <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-[#1B4332] shadow-md flex items-center justify-center text-lg sm:text-2xl">
                    {getIcon(name)}
                  </span>
                  <span className="text-[10px] sm:text-xs font-black leading-tight">
                    {name}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-[#2D6A4F] max-w-md mx-auto leading-relaxed">
          {product.howToUse}
        </p>
      </div>
    </div>
  );
}