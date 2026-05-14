"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  DEMO_EMAIL,
  DEMO_PASSWORD,
  setAuthCookie,
  validateCredentials,
} from "@/lib/auth";

const TESTIMONIALS = [
  {
    quote:
      "Navi caught three duplicate subscriptions in my first week. That's AED 180 back every month.",
    author: "Layla M.",
    role: "Product Designer, Dubai",
  },
  {
    quote:
      "I stopped opening five different banking apps. One conversation with Navi and I know exactly what to do.",
    author: "Omar K.",
    role: "Founder, Abu Dhabi",
  },
  {
    quote:
      "The advisor feels like a real CFO — except it never judges my late-night Talabat orders.",
    author: "Sara H.",
    role: "Analyst, Sharjah",
  },
];

function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <motion.div
      className="relative"
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          "peer w-full rounded-xl border bg-white/[0.03] px-4 pb-3 pt-6 text-sm text-text-high outline-none transition-all duration-300",
          "border-white/10 focus:border-accent/50 focus:ring-2 focus:ring-accent/25"
        )}
        autoComplete={type === "password" ? "current-password" : "email"}
      />
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-4 text-text-mid transition-all duration-300",
          floated
            ? "top-2 text-[10px] font-medium uppercase tracking-wider text-accent"
            : "top-1/2 -translate-y-1/2 text-sm"
        )}
      >
        {label}
      </label>
    </motion.div>
  );
}

function InlineToast({
  message,
  visible,
  onDismiss,
}: {
  message: string;
  visible: boolean;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [visible, onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="absolute -top-14 left-0 right-0 z-20 rounded-xl border border-red-500/20 bg-red-950/80 px-4 py-3 text-center text-sm text-red-200 shadow-lg backdrop-blur-md"
          role="alert"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      mouseX.set(x * 24);
      mouseY.set(y * 24);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToastVisible(false);

    await new Promise((r) => setTimeout(r, 600));

    if (validateCredentials(email, password)) {
      setAuthCookie();
      router.push("/dashboard");
    } else {
      setLoading(false);
      setToastVisible(true);
    }
  };

  const dismissToast = useCallback(() => setToastVisible(false), []);

  return (
    <motion.div
      className="grid min-h-screen lg:grid-cols-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left — branded panel */}
      <div
        className="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between"
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ x: springX, y: springY }}
        >
          <motion.div
            className="absolute -left-1/4 -top-1/4 h-[70%] w-[70%] rounded-full bg-accent/20 blur-[120px]"
            animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.55, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-1/4 -right-1/4 h-[60%] w-[60%] rounded-full bg-[#1b2349] blur-[100px]"
            animate={{ scale: [1.05, 1, 1.05] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-1/3 top-1/3 h-48 w-48 rounded-full bg-gold/10 blur-[80px]"
            animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <div className="relative z-10 flex flex-col gap-16 p-12 xl:p-16">
          <Link href="/" className="group flex w-fit items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-lg backdrop-blur-md transition-colors group-hover:border-accent/30">
              <Sparkles className="h-5 w-5 text-accent transition-transform group-hover:rotate-12" />
            </div>
            <span className="bg-gradient-to-r from-accent via-accent-secondary to-white bg-clip-text text-2xl font-semibold tracking-tight text-transparent">
              Navi
            </span>
          </Link>

          <div className="relative min-h-[180px] max-w-lg">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={quoteIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <p className="font-display text-3xl leading-snug text-text-high xl:text-4xl">
                  &ldquo;{TESTIMONIALS[quoteIndex].quote}&rdquo;
                </p>
                <footer className="mt-6 flex items-center gap-3">
                  <motion.div
                    className="h-px w-8 bg-accent/60"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    <p className="text-sm font-medium text-text-high">
                      {TESTIMONIALS[quoteIndex].author}
                    </p>
                    <p className="text-xs text-text-mid">
                      {TESTIMONIALS[quoteIndex].role}
                    </p>
                  </motion.div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>

            <motion.div
              className="absolute -right-8 top-1/2 -translate-y-1/2"
              style={{ x: springX, y: springY }}
            >
              <div className="relative h-40 w-40">
                <motion.div
                  className="absolute inset-0 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent shadow-2xl backdrop-blur-xl"
                  animate={{ rotate: [0, 3, 0, -3, 0] }}
                  transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-4 rounded-[1.5rem] border border-accent/20 bg-accent/5"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-accent/80" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 flex gap-2 p-12 xl:p-16">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show testimonial ${i + 1}`}
              onClick={() => setQuoteIndex(i)}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                i === quoteIndex ? "w-8 bg-accent" : "w-2 bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>
      </div>

      {/* Right — login form */}
      <motion.div
        className="relative flex items-center justify-center bg-gradient-to-br from-[#0c1020] via-primary to-[#0a0e1a] p-6 sm:p-10"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(0,224,184,0.06),_transparent_60%)]" />

        <div className="relative w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-lg font-semibold text-text-high">Navi</span>
          </div>

          <motion.div
            className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-[24px] sm:p-10"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            <InlineToast
              message="Wrong credentials. Try the demo account."
              visible={toastVisible}
              onDismiss={dismissToast}
            />

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-semibold tracking-tight text-text-high">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-text-mid">
                Sign in to your financial command center.
              </p>
              <p className="mt-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 font-mono text-[11px] text-text-mid">
                Demo: {DEMO_EMAIL} / {DEMO_PASSWORD}
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <FloatingInput
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
              />
              <FloatingInput
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
              />

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                className={cn(
                  "relative mt-2 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl text-sm font-semibold text-primary shadow-lg transition-opacity",
                  "bg-gradient-to-r from-accent via-accent-secondary to-accent",
                  "disabled:cursor-not-allowed disabled:opacity-70"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  "Enter Navi"
                )}
              </motion.button>
            </form>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={fillDemo}
                className="rounded-full border border-accent/25 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent transition-colors hover:border-accent/40 hover:bg-accent/10"
              >
                Use demo account
              </button>
            </div>
          </motion.div>

          <p className="mt-8 text-center text-xs text-text-mid">
            <Link href="/" className="transition-colors hover:text-accent">
              ← Back to home
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
