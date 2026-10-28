
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Check,
  ShoppingBag,
  Eye,
} from "lucide-react";
import { useCart } from "../context/CardContext";
import { products } from "../data/products";

// ---------- Quiz Questions ----------
const QUESTIONS = [
  {
    key: "skin",
    title: "How does your skin feel by midday?",
    subtitle: "Pick the one that sounds most like you.",
    options: [
      { value: "dry", label: "Tight & dry", desc: "Rough, flaky or thirsty", icon: "🌵" },
      { value: "oily", label: "Shiny & oily", desc: "Extra shine, mostly the T-zone", icon: "✨" },
      { value: "combination", label: "A bit of both", desc: "Oily centre, drier cheeks", icon: "⚖️" },
      { value: "sensitive", label: "Easily irritated", desc: "Redness, stinging, reactive", icon: "🌸" },
    ],
  },
  {
    key: "goal",
    title: "What would you love to change?",
    subtitle: "We will build your routine around this.",
    options: [
      { value: "glow", label: "More glow", desc: "Bright, bouncy, hydrated", icon: "💧" },
      { value: "pores", label: "Clearer pores", desc: "Fewer breakouts, smoother texture", icon: "🌿" },
      { value: "anti-aging", label: "Smoother lines", desc: "Firmer, more youthful look", icon: "⏳" },
      { value: "calming", label: "Calmer skin", desc: "Less redness and irritation", icon: "🍃" },
    ],
  },
  {
    key: "feel",
    title: "How should your skincare feel?",
    subtitle: "This decides the texture of your serum and moisturizer.",
    options: [
      { value: "light", label: "Light & fresh", desc: "Absorbs fast, never sticky", icon: "☁️" },
      { value: "rich", label: "Rich & cushiony", desc: "Deep comfort that lasts", icon: "🍯" },
    ],
  },
];

// Question order: skin -> intensity slider -> goal -> feel
const STEP_KEYS = ["skin", "intensity", "goal", "feel"];

// ---------- Intensity Slider ----------
const INTENSITY = {
  dry: {
    title: "How dry does your skin feel?",
    subtitle: "Slide to show how dry it is right now.",
    metric: "Dryness",
    low: "Barely dry",
    high: "Very dry",
    levels: [
      "A little tight now and then. Easy to keep comfortable.",
      "Tight and rough on most days. It needs steady moisture.",
      "Flaky and uncomfortable. It needs rich, intensive care.",
    ],
  },
  oily: {
    title: "How oily does your skin get?",
    subtitle: "Slide to show how shiny it gets by the afternoon.",
    metric: "Oiliness",
    low: "Barely shiny",
    high: "Very oily",
    levels: [
      "Just a light shine by the end of the day.",
      "Visible shine on most of your face by midday.",
      "Heavy shine that comes back within a few hours.",
    ],
  },
  combination: {
    title: "How different are your T-zone and cheeks?",
    subtitle: "Slide to show how uneven your skin feels.",
    metric: "Unevenness",
    low: "Fairly balanced",
    high: "Very uneven",
    levels: [
      "Mostly balanced, with a little shine on the T-zone.",
      "Clear shine on the T-zone while the cheeks stay dry.",
      "A very oily T-zone next to very dry, tight cheeks.",
    ],
  },
  sensitive: {
    title: "How sensitive is your skin?",
    subtitle: "Slide to show how easily it reacts.",
    metric: "Sensitivity",
    low: "Rarely reacts",
    high: "Reacts easily",
    levels: [
      "Reacts only now and then.",
      "Gets red or stings with some products or weather.",
      "Reacts quickly and stays irritated for a long time.",
    ],
  },
};

const LEVEL_NAMES = ["Mild", "Moderate", "Strong"];
const levelOf = (v) => (v < 34 ? 0 : v < 67 ? 1 : 2);

const SKIN_NAME = {
  dry: "Dry skin",
  oily: "Oily skin",
  combination: "Combination skin",
  sensitive: "Sensitive skin",
};

// ---------- Skin Advice ----------
const TIPS = {
  dry: [
    "Apply serum on slightly damp skin to lock in moisture.",
    "Wash with lukewarm water, hot water strips natural oils.",
    "Seal everything in with a cream, especially at night.",
  ],
  oily: [
    "Cleanse twice a day, but do not scrub hard.",
    "Choose a light, water-based serum instead of heavy oils.",
    "Never skip sunscreen, even if your skin feels oily.",
  ],
  combination: [
    "Use a light serum all over, then add cream only on dry areas.",
    "Tone the T-zone and let the cheeks rest.",
    "Finish every morning with sunscreen.",
  ],
  sensitive: [
    "Introduce only one new product at a time.",
    "Patch test on your jaw for 24 hours before using it on your face.",
    "Avoid hot water and choose gentle, soothing formulas.",
  ],
};

const ANALYZING = [
  "Reading your skin profile",
  "Matching gentle ingredients",
  "Building your routine",
];

// ---------- Routine Steps ----------
const STEPS = [
  { key: "cleanse", title: "Cleanse", when: "Morning & night", pool: [3, 19] },
  { key: "treat", title: "Treat", when: "Morning or night", pool: [1, 5, 7, 10, 13, 14, 16] },
  { key: "moisturize", title: "Moisturize", when: "Morning & night", pool: [2, 8, 15, 18] },
  { key: "protect", title: "Protect", when: "Every morning", pool: [11] },
];

// ---------- Product Matching ----------
const PRODUCT_TAGS = {
  3: { skin: ["oily", "combination"], goal: ["pores"], feel: "light" },
  19: { skin: ["dry", "sensitive", "combination", "oily"], goal: ["glow", "calming"], feel: "light" },
  1: { skin: ["dry", "combination", "sensitive"], goal: ["glow"], feel: "light" },
  5: { skin: ["oily", "combination"], goal: ["pores"], feel: "light" },
  7: { skin: ["oily", "combination", "dry"], goal: ["glow", "anti-aging"], feel: "light" },
  10: { skin: ["dry", "sensitive", "combination"], goal: ["glow", "calming"], feel: "light" },
  13: { skin: ["dry"], goal: ["anti-aging", "glow"], feel: "rich" },
  14: { skin: ["oily", "combination", "sensitive"], goal: ["calming"], feel: "light" },
  16: { skin: ["oily"], goal: ["pores"], feel: "light" },
  2: { skin: ["dry", "combination", "sensitive"], goal: ["glow"], feel: "light" },
  8: { skin: ["sensitive", "dry"], goal: ["calming"], feel: "rich" },
  15: { skin: ["dry", "combination", "oily"], goal: ["anti-aging"], feel: "rich" },
  18: { skin: ["sensitive", "combination", "oily"], goal: ["calming", "pores"], feel: "light" },
  11: { skin: ["dry", "oily", "combination", "sensitive"], goal: [], feel: null },
};

const GOAL_REASON = {
  glow: "Boosts glow",
  pores: "Helps clear pores",
  "anti-aging": "Softens fine lines",
  calming: "Calms redness",
};

const FEEL_REASON = {
  light: "Light texture",
  rich: "Rich texture",
};

function severityBonus(tags, answers) {
  const level = levelOf(answers.intensity);

  if (answers.skin === "dry" || answers.skin === "sensitive") {
    if (level === 2 && tags.feel === "rich") return 2;
    if (level === 0 && tags.feel === "light") return 1;
  }

  if (answers.skin === "oily" || answers.skin === "combination") {
    if (level === 2 && tags.goal.includes("pores")) return 2;
  }

  return 0;
}

function scoreProduct(tags, answers) {
  let score = 0;

  if (tags.skin.includes(answers.skin)) score += 3;
  if (tags.goal.includes(answers.goal)) score += 3;
  if (tags.feel && tags.feel === answers.feel) score += 2;

  score += severityBonus(tags, answers);

  return score;
}

function buildReasons(tags, answers) {
  const reasons = [];

  if (tags.skin.includes(answers.skin)) {
    reasons.push(`Great for ${answers.skin} skin`);
  }

  if (tags.goal.includes(answers.goal)) {
    reasons.push(GOAL_REASON[answers.goal]);
  }

  if (tags.feel && tags.feel === answers.feel) {
    reasons.push(FEEL_REASON[answers.feel]);
  }

  if (severityBonus(tags, answers) >= 2) {
    reasons.push(
      answers.skin === "dry" || answers.skin === "sensitive"
        ? "Intensive comfort"
        : "Extra oil control"
    );
  }

  return reasons.slice(0, 3);
}

function buildRoutine(answers) {
  return STEPS.map((step) => {
    let best = null;
    let bestScore = -1;

    step.pool.forEach((id) => {
      const product = products.find((p) => p.id === id);
      const tags = PRODUCT_TAGS[id];

      if (!product || !tags) return;

      const score = scoreProduct(tags, answers);

      if (score > bestScore) {
        best = { product, tags };
        bestScore = score;
      }
    });

    if (!best) return null;

    const reasons =
      step.key === "protect"
        ? ["SPF 50 every morning", "No white cast"]
        : buildReasons(best.tags, answers);

    return {
      ...step,
      product: best.product,
      reasons: reasons.length ? reasons : ["Gentle everyday pick"],
    };
  }).filter(Boolean);
}

const priceNumber = (product) =>
  parseFloat(String(product.price).replace(/[^0-9.]/g, "")) || 0;

// ---------- Main Quiz Page ----------
export default function SkinQuizPage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { addToCart } = useCart();

  const [phase, setPhase] = useState("quiz");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [intensity, setIntensity] = useState(50);
  const [locked, setLocked] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [addedId, setAddedId] = useState(null);
  const [addingAll, setAddingAll] = useState(false);

  const timers = useRef([]);
  const resultRef = useRef(null);

  useEffect(() => {
    const list = timers.current;

    return () => list.forEach(clearTimeout);
  }, []);

  // Analyzing screen
  useEffect(() => {
    if (phase !== "analyzing") return undefined;

    const tick = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, ANALYZING.length - 1));
    }, 800);

    const done = setTimeout(
      () => setPhase("result"),
      reduce ? 300 : 2600
    );

    return () => {
      clearInterval(tick);
      clearTimeout(done);
    };
  }, [phase, reduce]);

  // Smoothly scroll to recommended routine after loading
  useEffect(() => {
    if (phase !== "result" || !resultRef.current) return;

    const timer = setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    }, reduce ? 0 : 250);

    return () => clearTimeout(timer);
  }, [phase, reduce]);

  const stepKey = STEP_KEYS[step];
  const current = QUESTIONS.find((q) => q.key === stepKey);
  const skinKey = answers.skin || "dry";
  const cfg = INTENSITY[skinKey];
  const level = levelOf(intensity);

  const goNext = () => {
    if (step < STEP_KEYS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setMsgIndex(0);
      setPhase("analyzing");
    }
  };

  // Automatically move to the next question after selecting an option
  const handleSelect = (key, value) => {
    if (locked) return;

    if (key === "skin" && answers.skin !== value) {
      setIntensity(50);
    }

    setAnswers((prev) => ({ ...prev, [key]: value }));
    setLocked(true);

    const timer = setTimeout(() => {
      goNext();
      setLocked(false);
    }, reduce ? 0 : 380);

    timers.current.push(timer);
  };

  const handleBack = () => {
    if (step > 0 && !locked) {
      setStep((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setIntensity(50);
    setStep(0);
    setMsgIndex(0);
    setAddedId(null);
    setAddingAll(false);
    setLocked(false);
    setPhase("quiz");
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  const finalAnswers = {
    ...answers,
    skin: skinKey,
    intensity,
  };

  const routine = phase === "result" ? buildRoutine(finalAnswers) : [];

  const total = routine.reduce(
    (sum, item) => sum + priceNumber(item.product),
    0
  );

  const answerLabel = (key) => {
    const question = QUESTIONS.find((item) => item.key === key);
    const option = question?.options.find(
      (item) => item.value === answers[key]
    );

    return option ? option.label : "";
  };

  const handleAddOne = (product) => {
    addToCart(product);
    setAddedId(product.id);

    const timer = setTimeout(() => setAddedId(null), 1800);
    timers.current.push(timer);
  };

  const handleAddAll = async () => {
    if (addingAll) return;

    setAddingAll(true);

    for (const item of routine) {
      addToCart(item.product);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5DC] via-[#E8F0E5] to-[#D8F3DC]/50 text-[#1B4332] px-4 py-8 sm:py-10 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-12 -left-12 w-80 h-80 bg-[#52B788]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-[#1B4332]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl mx-auto relative z-10">
        {/* Progress */}
        {phase === "quiz" && (
          <div className="mb-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#2D6A4F]">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 hover:text-[#1B4332] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              ) : (
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 hover:text-[#1B4332] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to shop
                </Link>
              )}

              <span>
                Question {step + 1} of {STEP_KEYS.length}
              </span>
            </div>

            <div className="flex gap-2">
              {STEP_KEYS.map((key, index) => (
                <div
                  key={key}
                  className="h-1.5 flex-1 rounded-full bg-[#1B4332]/15 overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-[#1B4332] rounded-full"
                    initial={false}
                    animate={{
                      width:
                        index < step
                          ? "100%"
                          : index === step
                            ? "50%"
                            : "0%",
                    }}
                    transition={{ duration: reduce ? 0 : 0.35 }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Normal questions: one box per row */}
          {phase === "quiz" && stepKey !== "intensity" && current && (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, x: reduce ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduce ? 0 : -24 }}
              transition={{ duration: reduce ? 0 : 0.28 }}
            >
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                {current.title}
              </h1>

              <p className="mt-1.5 text-sm text-[#2D6A4F] font-medium">
                {current.subtitle}
              </p>

              <div className="mt-5 flex flex-col gap-3">
                {current.options.map((option) => {
                  const selected = answers[current.key] === option.value;

                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(current.key, option.value)}
                      whileHover={{ y: reduce ? 0 : -2 }}
                      whileTap={{ scale: reduce ? 1 : 0.99 }}
                      aria-pressed={selected}
                      className={`relative w-full min-h-[92px] rounded-2xl border-2 p-4 flex items-center gap-4 text-left transition-colors cursor-pointer ${
                        selected
                          ? "bg-[#1B4332] text-[#F5F5DC] border-[#1B4332] shadow-lg"
                          : "bg-[#E8F0E5] text-[#1B4332] border-[#1B4332]/25 hover:border-[#1B4332] hover:shadow-md"
                      }`}
                    >
                      {selected && (
                        <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#52B788] text-[#1B4332] flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}

                      <span className="w-12 h-12 shrink-0 rounded-full bg-[#E8F0E5] border border-[#1B4332]/10 flex items-center justify-center text-2xl">
                        {option.icon}
                      </span>

                      <span className="flex-1 min-w-0 pr-5">
                        <span className="block font-black text-sm sm:text-base leading-tight">
                          {option.label}
                        </span>

                        <span
                          className={`block mt-1 text-xs font-medium leading-snug ${
                            selected
                              ? "text-[#F5F5DC]/80"
                              : "text-[#2D6A4F]"
                          }`}
                        >
                          {option.desc}
                        </span>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Intensity slider */}
          {phase === "quiz" && stepKey === "intensity" && (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, x: reduce ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduce ? 0 : -24 }}
              transition={{ duration: reduce ? 0 : 0.28 }}
            >
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                {cfg.title}
              </h1>

              <p className="mt-1.5 text-sm text-[#2D6A4F] font-medium">
                {cfg.subtitle}
              </p>

              <div className="mt-5 rounded-3xl bg-[#E8F0E5] border-2 border-[#1B4332]/25 p-5 space-y-5">
                <div className="text-center">
                  <div className="text-6xl font-black leading-none tabular-nums">
                    {intensity}
                    <span className="text-3xl text-[#52B788]">%</span>
                  </div>

                  <p className="mt-2 text-xs font-extrabold uppercase tracking-wider text-[#2D6A4F]">
                    {cfg.metric}: {LEVEL_NAMES[level]}
                  </p>
                </div>

                <div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={intensity}
                    onChange={(event) =>
                      setIntensity(Number(event.target.value))
                    }
                    aria-label={cfg.title}
                    className="w-full h-2.5 rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1B4332] [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-[#E8F0E5] [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#1B4332] [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-[#E8F0E5]"
                    style={{
                      background: `linear-gradient(to right, #1B4332 ${intensity}%, rgba(27,67,50,0.15) ${intensity}%)`,
                    }}
                  />

                  <div className="mt-2 flex justify-between text-[11px] font-bold text-[#2D6A4F]">
                    <span>{cfg.low}</span>
                    <span>{cfg.high}</span>
                  </div>
                </div>

                <div className="min-h-[44px]">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={level}
                      initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: reduce ? 0 : -6 }}
                      transition={{ duration: reduce ? 0 : 0.2 }}
                      className="text-sm text-center font-medium text-[#1B4332] leading-relaxed"
                    >
                      {cfg.levels[level]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <motion.button
                  type="button"
                  onClick={goNext}
                  whileTap={{ scale: reduce ? 1 : 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1B4332] text-[#F5F5DC] text-sm font-black hover:bg-[#2D6A4F] transition-colors cursor-pointer shadow-md"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Analyzing screen */}
          {phase === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.3 }}
              className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-6"
            >
              <div className="relative w-24 h-24 flex items-center justify-center">
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full border-4 border-[#1B4332]/15 border-t-[#1B4332]"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.1,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />

                <Sparkles className="w-8 h-8 text-[#52B788]" />
              </div>

              <div className="h-14 space-y-2">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={msgIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="text-xl font-black"
                  >
                    {ANALYZING[msgIndex]}...
                  </motion.p>
                </AnimatePresence>

                <p className="text-xs text-[#2D6A4F] font-medium">
                  Just a moment
                </p>
              </div>
            </motion.div>
          )}

          {/* Recommended routine */}
          {phase === "result" && (
            <motion.div
              key="result"
              ref={resultRef}
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.45 }}
              className="space-y-6 scroll-mt-6"
            >
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B4332] text-[#F5F5DC] text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#52B788]" />
                  Your routine is ready
                </span>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  Your Bianca routine
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#E8F0E5] border border-[#1B4332]/20 text-xs font-bold text-[#2D6A4F]">
                    {SKIN_NAME[skinKey]} · {intensity}%
                  </span>

                  {["goal", "feel"].map((key) =>
                    answerLabel(key) ? (
                      <span
                        key={key}
                        className="px-3 py-1 rounded-full bg-[#E8F0E5] border border-[#1B4332]/20 text-xs font-bold text-[#2D6A4F]"
                      >
                        {answerLabel(key)}
                      </span>
                    ) : null
                  )}
                </div>
              </div>

              {/* Skin profile and advice */}
              <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 0.45 }}
                className="rounded-3xl bg-[#E8F0E5] border-2 border-[#1B4332] p-4 sm:p-5 space-y-4 shadow-sm"
              >
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold text-[#2D6A4F]">
                      Your skin profile
                    </p>

                    <p className="text-lg font-black leading-tight">
                      {SKIN_NAME[skinKey]}, {LEVEL_NAMES[level].toLowerCase()}{" "}
                      {cfg.metric.toLowerCase()}
                    </p>
                  </div>

                  <p className="text-3xl font-black tabular-nums">
                    {intensity}%
                  </p>
                </div>

                <div className="h-2.5 rounded-full bg-[#1B4332]/15 overflow-hidden">
                  <motion.div
                    className="h-full bg-[#1B4332] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${intensity}%` }}
                    transition={{
                      duration: reduce ? 0 : 0.9,
                      delay: reduce ? 0 : 0.2,
                      ease: "easeOut",
                    }}
                  />
                </div>

                <p className="text-sm text-[#2D6A4F] font-medium leading-relaxed">
                  {cfg.levels[level]}
                </p>

                <div className="pt-3 border-t border-[#1B4332]/15 space-y-2">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#1B4332]">
                    Quick advice for you
                  </p>

                  <ul className="space-y-2">
                    {TIPS[skinKey].map((tip) => (
                      <li
                        key={tip}
                        className="flex items-start gap-2 text-sm font-medium text-[#1B4332]"
                      >
                        <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-[#52B788]/30 flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3] text-[#1B4332]" />
                        </span>

                        {tip}
                      </li>
                    ))}
                  </ul>

                  <p className="text-[11px] text-[#2D6A4F]/80 font-medium leading-snug pt-1">
                    These are general tips. If your skin hurts, swells or
                    breaks out badly, please see a dermatologist.
                  </p>
                </div>
              </motion.div>

              {/* Product cards animate into view while scrolling */}
              <ol className="space-y-4">
                {routine.map((item, index) => (
                  <motion.li
                    key={item.key}
                    initial={{
                      opacity: 0,
                      y: reduce ? 0 : 35,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.15,
                      margin: "0px 0px -40px 0px",
                    }}
                    transition={{
                      duration: reduce ? 0 : 0.55,
                      delay: reduce ? 0 : 0.08,
                      ease: "easeOut",
                    }}
                    className="relative pl-12"
                  >
                    {index < routine.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute left-[15px] top-9 -bottom-4 w-0.5 bg-[#1B4332]/20"
                      />
                    )}

                    <span className="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#1B4332] text-[#F5F5DC] text-xs font-black flex items-center justify-center">
                      {index + 1}
                    </span>

                    <div className="rounded-3xl bg-[#E8F0E5] border-2 border-[#1B4332] p-3 sm:p-4 flex gap-3 sm:gap-4 shadow-sm">
                      <Link
                        href={`/shop/${item.product.id}`}
                        className="shrink-0"
                      >
                        <img
                          src={item.product.image.trim()}
                          alt={item.product.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#1B4332]/20 bg-[#E8F0E5]"
                        />
                      </Link>

                      <div className="flex-1 min-w-0 space-y-2">
                        <p className="text-xs font-extrabold text-[#2D6A4F]">
                          {item.title} · {item.when}
                        </p>

                        <h3 className="font-black text-base sm:text-lg leading-tight">
                          {item.product.name}
                        </h3>

                        <div className="flex flex-wrap gap-1.5">
                          {item.reasons.map((reason) => (
                            <span
                              key={reason}
                              className="px-2.5 py-1 rounded-full bg-[#D8F3DC] text-[#1B4332] text-[10px] sm:text-[11px] font-bold"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <span className="text-lg font-black">
                            {item.product.price}
                          </span>

                          <div className="flex items-center gap-2">
                            <Link
                              href={`/shop/${item.product.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#E8F0E5] text-[#1B4332] text-[11px] font-bold border-2 border-[#1B4332] hover:bg-[#D8F3DC] transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleAddOne(item.product)}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold border-2 border-[#1B4332] transition-colors cursor-pointer ${
                                addedId === item.product.id
                                  ? "bg-[#52B788] text-[#1B4332]"
                                  : "bg-[#1B4332] text-[#F5F5DC] hover:bg-[#2D6A4F]"
                              }`}
                            >
                              {addedId === item.product.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  Added
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  Add
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ol>

              {/* Add complete routine to cart */}
              <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: reduce ? 0 : 0.45 }}
                className="rounded-3xl bg-[#1B4332] text-[#F5F5DC] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
              >
                <div className="text-center sm:text-left">
                  <p className="text-sm text-[#F5F5DC]/70">
                    Complete routine, {routine.length} products
                  </p>

                  <p className="text-3xl font-black">
                    ${total.toFixed(2)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddAll}
                  disabled={addingAll}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E8F0E5] text-[#1B4332] text-sm font-black hover:bg-[#D8F3DC] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {addingAll ? "Adding..." : "Add full routine to cart"}
                </button>
              </motion.div>

              {/* Retake quiz and return to shop */}
              <div className="flex items-center justify-center gap-3 pb-4">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E8F0E5] text-[#1B4332] text-xs font-bold border-2 border-[#1B4332] hover:bg-[#D8F3DC] transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retake quiz
                </button>

                <Link
                  href="/shop"
                  className="inline-flex items-center px-4 py-2 rounded-full bg-[#E8F0E5] text-[#1B4332] text-xs font-bold border-2 border-[#1B4332] hover:bg-[#D8F3DC] transition-colors"
                >
                  Explore shop
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

