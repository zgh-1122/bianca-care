
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Droplet,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

const metrics = [
  {
    label: "Total reach",
    value: 48500,
    change: "+18.4%",
    note: "vs. last month",
    icon: Users,
    suffix: "",
  },
  {
    label: "Purity index",
    value: 100,
    change: "Verified",
    note: "cruelty-free promise",
    icon: ShieldCheck,
    suffix: "%",
  },
  {
    label: "Customer rating",
    value: 4.9,
    change: "+0.3",
    note: "from recent reviews",
    icon: Star,
    suffix: "",
  },
  {
    label: "Total revenue",
    value: 124800,
    change: "+24.2%",
    note: "vs. last month",
    icon: Wallet,
    suffix: "",
  },
];

const chartValues = [24, 32, 29, 43, 38, 54, 49, 65, 59, 76, 70, 88];

const monthLabels = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function getGreeting(date = new Date()) {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";

  return "Welcome back";
}

function formatCurrentDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/* Animated number counter */
function AnimatedNumber({ value, suffix = "", prefix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (reduceMotion) {
      setCount(value);
      return;
    }

    let frame;
    const startTime = performance.now();
    const duration = 1600;

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      setCount(value * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(update);
      }
    };

    frame = requestAnimationFrame(update);

    return () => cancelAnimationFrame(frame);
  }, [inView, value, reduceMotion]);

  const formatted =
    value === 4.9
      ? count.toFixed(1)
      : Math.round(count).toLocaleString("en-US");

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/* Scroll reveal animation */
function Reveal({
  children,
  className = "",
  delay = 0,
  reduceMotion,
}) {
  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduceMotion ? 0 : 0.6,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* Reusable green dashboard card */
function GlassCard({
  children,
  className = "",
  delay = 0,
  reduceMotion,
}) {
  return (
    <Reveal
      delay={delay}
      reduceMotion={reduceMotion}
      className={`
        rounded-2xl
        border-[3px]
        border-[#2D6A4F]
        bg-[#E8F0E5]/95
        shadow-[0_8px_24px_rgba(45,106,79,0.18)]
        transition-shadow duration-300
        hover:shadow-[0_12px_30px_rgba(45,106,79,0.28)]
        ${className}
      `}
    >
      {children}
    </Reveal>
  );
}

/* Animated monthly engagement graph */
function EngagementChart({ reduceMotion }) {
  const chartRef = useRef(null);

  const chartInView = useInView(chartRef, {
    once: true,
    amount: 0.25,
  });

  const width = 700;
  const height = 230;
  const paddingX = 12;
  const paddingY = 20;

  const points = chartValues.map((value, index) => ({
    x:
      paddingX +
      (index * (width - paddingX * 2)) /
        (chartValues.length - 1),
    y:
      height -
      paddingY -
      (value / 100) * (height - paddingY * 2),
  }));

  const linePath = points
    .map((point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }

      const previous = points[index - 1];
      const middleX = (previous.x + point.x) / 2;

      return `C ${middleX} ${previous.y}, ${middleX} ${point.y}, ${point.x} ${point.y}`;
    })
    .join(" ");

  const areaPath = `
    ${linePath}
    L ${points[points.length - 1].x} ${height}
    L ${points[0].x} ${height}
    Z
  `;

  return (
    <div ref={chartRef} className="mt-6">
      <div className="rounded-xl border-2 border-[#2D6A4F]/40 bg-[#F5F5DC]/80 px-2 pt-5 shadow-[0_4px_14px_rgba(45,106,79,0.10)] sm:px-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full overflow-visible"
          role="img"
          aria-label="Monthly brand engagement line chart"
        >
          <defs>
            <linearGradient
              id="engagementGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#52B788"
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor="#52B788"
                stopOpacity="0.01"
              />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3].map((line) => {
            const y = 15 + line * 62;

            return (
              <line
                key={line}
                x1="0"
                y1={y}
                x2={width}
                y2={y}
                stroke="#1B4332"
                strokeOpacity="0.12"
                strokeDasharray="4 6"
              />
            );
          })}

          <motion.path
            d={areaPath}
            fill="url(#engagementGradient)"
            initial={{ opacity: reduceMotion ? 1 : 0 }}
            animate={{
              opacity: chartInView ? 1 : 0,
            }}
            transition={{
              duration: reduceMotion ? 0 : 0.9,
            }}
          />

          <motion.path
            d={linePath}
            fill="none"
            stroke="#2D6A4F"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{
              pathLength: reduceMotion ? 1 : 0,
              opacity: reduceMotion ? 1 : 0,
            }}
            animate={{
              pathLength: chartInView ? 1 : 0,
              opacity: chartInView ? 1 : 0,
            }}
            transition={{
              duration: reduceMotion ? 0 : 1.8,
              ease: "easeInOut",
            }}
          />

          {points.map((point, index) => (
            <motion.circle
              key={monthLabels[index]}
              cx={point.x}
              cy={point.y}
              r={index === points.length - 1 ? 5 : 3}
              fill="#2D6A4F"
              stroke="#FFFFFF"
              strokeWidth="2"
              initial={{
                opacity: reduceMotion ? 1 : 0,
                scale: reduceMotion ? 1 : 0,
              }}
              animate={{
                opacity: chartInView ? 1 : 0,
                scale: chartInView ? 1 : 0,
              }}
              transition={{
                delay: reduceMotion ? 0 : 0.1 * index,
                duration: 0.3,
              }}
            >
              <title>{`${monthLabels[index]}: ${chartValues[index]}%`}</title>
            </motion.circle>
          ))}
        </svg>

        <div className="grid grid-cols-6 gap-1 pb-4 pt-2 text-center text-[10px] font-medium text-[#668674] sm:grid-cols-12">
          {monthLabels.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-[#668674]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#2D6A4F]" />
          Engagement index
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-[#2D6A4F]/30 bg-[#D8F3DC] px-3 py-1.5 text-xs font-semibold text-[#2D6A4F]">
          <TrendingUp className="h-3.5 w-3.5" />
          Positive trend
        </div>
      </div>
    </div>
  );
}

export default function BrandDashboard() {
  const [greeting, setGreeting] = useState("Welcome back");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [mounted, setMounted] = useState(false);

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      setGreeting(getGreeting(now));

      setCurrentTime(
        new Intl.DateTimeFormat("en-PK", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(now)
      );

      setCurrentDate(formatCurrentDate(now));
      setMounted(true);
    };

    updateClock();

    const timer = setInterval(updateClock, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F5F5DC] px-4 py-6 font-sans text-[#1B4332] sm:px-6 lg:px-10 lg:py-8">
      {/* Background ambience */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, 20, 0],
                  y: [0, 15, 0],
                }
          }
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-white/80 blur-[100px]"
        />

        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, -20, 0],
                  y: [0, 15, 0],
                }
          }
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-[#B7D5BD]/50 blur-[110px]"
        />

        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#D8E8D2]/60 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 pb-10">
        {/* Dashboard header */}
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
          className="flex flex-col gap-5 rounded-2xl border-[3px] border-[#2D6A4F] bg-[#E8F0E5]/95 p-5 shadow-[0_8px_24px_rgba(45,106,79,0.18)] sm:flex-row sm:items-center sm:justify-between sm:p-6"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#2D6A4F]/25 bg-[#D8F3DC] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#2D6A4F]">
              <Sparkles className="h-3.5 w-3.5" />
              Bianca Care · Brand studio
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-[1.8rem]">
              {mounted ? greeting : "Welcome back"},{" "}
              <span className="text-[#2D6A4F]">Zuleha</span>
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#668674]">
              Your skincare brand performance, all in one place.
            </p>
          </div>

          {/* Store status and current date */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#2D6A4F]/35 bg-[#F5F5DC] px-4 py-3 text-sm font-semibold text-[#1B4332] shadow-sm"
              aria-label="Store status: active"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#74C69D] opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#2D6A4F]" />
              </span>
              Store Active
            </div>

            <div className="inline-flex items-center gap-3 rounded-full border-2 border-[#2D6A4F]/35 bg-[#F5F5DC] px-4 py-3 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1B4332] text-white">
                <CalendarDays className="h-4 w-4" />
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#668674]">
                  Today
                </p>

                <p className="text-sm font-semibold text-[#1B4332]">
                  {mounted ? currentDate : "Loading date..."}
                </p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Page heading */}
        <Reveal reduceMotion={reduceMotion}>
          <div className="flex flex-col justify-between gap-2 px-1 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#668674]">
                DASHBOARD / OVERVIEW
              </p>

              <h2 className="mt-1.5 text-xl font-bold tracking-tight">
                Your brand at a glance
              </h2>

              <p className="mt-1 text-sm text-[#668674]">
                Track your growth and customer engagement.
              </p>
            </div>

            <p className="text-xs text-[#668674]">
              {mounted
                ? `Local time · ${currentTime}`
                : "Your brand overview"}
            </p>
          </div>
        </Reveal>

        {/* Metric cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;

            return (
              <GlassCard
                key={metric.label}
                delay={index * 0.08}
                reduceMotion={reduceMotion}
                className="p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-[#668674]">
                      {metric.label}
                    </p>

                    <p className="mt-3 text-2xl font-bold tracking-tight sm:text-[1.7rem]">
                      {metric.label === "Total revenue" ? (
                        <AnimatedNumber
                          value={metric.value / 1000}
                          prefix="$"
                          suffix="k"
                        />
                      ) : (
                        <AnimatedNumber
                          value={metric.value}
                          suffix={metric.suffix}
                        />
                      )}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2D6A4F]/25 bg-[#D8F3DC] text-[#2D6A4F]">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t-2 border-[#2D6A4F]/20 pt-3">
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#2D6A4F]/20 bg-[#D8F3DC] px-2 py-1 text-[10px] font-semibold text-[#2D6A4F]">
                    <TrendingUp className="h-3 w-3" />
                    {metric.change}
                  </span>

                  <span className="text-[11px] text-[#668674]">
                    {metric.note}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Analytics chart */}
        <GlassCard
          delay={0.1}
          reduceMotion={reduceMotion}
          className="p-5 sm:p-6"
        >
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#668674]">
                <Activity className="h-4 w-4 text-[#2D6A4F]" />
                PERFORMANCE REPORT
              </div>

              <h3 className="text-lg font-bold">
                Brand engagement trend
              </h3>

              <p className="mt-1 text-xs text-[#668674]">
                Monthly engagement overview
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-[#2D6A4F]/40 bg-[#F5F5DC]/80 px-3 py-2 text-xs font-medium text-[#2D6A4F]">
              <span className="h-2 w-2 rounded-full bg-[#52B788]" />
              Year overview
            </span>
          </div>

          <EngagementChart reduceMotion={reduceMotion} />
        </GlassCard>

        {/* Brand promise and highlights */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <GlassCard
            delay={0.1}
            reduceMotion={reduceMotion}
            className="p-5 sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-[#668674]">
                  BRAND PROMISE
                </p>

                <h3 className="mt-2 text-lg font-bold">
                  Clean care, clearly
                </h3>

                <p className="mt-1 text-sm text-[#668674]">
                  Thoughtful skincare with quality at its heart.
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#2D6A4F]/25 bg-[#D8F3DC] text-[#2D6A4F]">
                <Droplet className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 rounded-xl border-[3px] border-[#2D6A4F] bg-[#F5F5DC]/80 p-4 shadow-[0_5px_16px_rgba(45,106,79,0.15)]">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">
                  Product quality score
                </span>

                <span className="font-bold text-[#2D6A4F]">
                  <AnimatedNumber value={100} suffix="%" />
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#B7D5BD]/60">
                <motion.div
                  initial={{ width: reduceMotion ? "100%" : 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{
                    duration: reduceMotion ? 0 : 1.3,
                    ease: "easeOut",
                  }}
                  className="h-full rounded-full bg-[#2D6A4F]"
                />
              </div>

              <div className="mt-3 flex items-start gap-2 text-xs leading-5 text-[#668674]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2D6A4F]" />

                <p>
                  A visual brand indicator. Connect real product data
                  to display verified quality metrics.
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard
            delay={0.2}
            reduceMotion={reduceMotion}
            className="p-5 sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-[#668674]">
                  BRAND HIGHLIGHTS
                </p>

                <h3 className="mt-2 text-lg font-bold">
                  Growing with confidence
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#2D6A4F]/25 bg-[#D8F3DC] text-[#2D6A4F]">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#2D6A4F]/25 bg-[#D8F3DC] text-[#2D6A4F]">
                  <TrendingUp className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Positive brand growth
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#668674]">
                    Your illustrative engagement trend is moving upward.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#2D6A4F]/25 bg-[#D8F3DC] text-[#2D6A4F]">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Quality-focused care
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#668674]">
                    Keep product information clear, accurate and trustworthy.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#2D6A4F]/25 bg-[#D8F3DC] text-[#2D6A4F]">
                  <Users className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Customer-first approach
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#668674]">
                    Build trust through useful skincare guidance and service.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Footer */}
        <Reveal reduceMotion={reduceMotion}>
          <footer className="flex flex-col items-center justify-between gap-2 border-t-2 border-[#2D6A4F]/30 px-1 pt-5 text-xs text-[#668674] sm:flex-row">
            <p>© 2026 Bianca Care. All rights reserved.</p>

            <p className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#52B788]" />
              Designed for thoughtful skincare
            </p>
          </footer>
        </Reveal>
      </div>
    </main>
  );
}

