"use client";

import { Button } from "@/components/ui/button";
import {
  buildClientContext,
  getContextHighlights,
} from "@/lib/advisor-context";
import {
  PAST_CONVERSATIONS,
  useAdvisorStore,
  useFinanceStore,
  useUserStore,
  type AdvisorMessage,
} from "@/lib/store";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Mic,
  Paperclip,
  PanelLeftClose,
  PanelRightClose,
  Send,
  Sparkles,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

const SUGGESTION_POOL = [
  "Can I afford a trip this month?",
  "How am I doing on my budget?",
  "Save AED 500/mo for travel",
  "Cancel unused subscriptions",
  "How much should I save for AED 20k in 12 months?",
  "Forecast my next 3 months",
];

function NaviOrb({ size = 36 }: { size?: number }) {
  return (
    <motion.div
      className="relative shrink-0 rounded-full"
      style={{ width: size, height: size }}
      animate={{ scale: [1, 1.06, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        className="absolute inset-0 rounded-full opacity-60 blur-md"
        style={{
          background:
            "linear-gradient(135deg, #6E56FF 0%, #9B7BFF 50%, #1B2349 100%)",
        }}
      />
      <motion.div
        className="relative h-full w-full rounded-full border border-white/20"
        style={{
          background:
            "linear-gradient(135deg, #6E56FF 0%, #9B7BFF 40%, #1B2349 120%)",
        }}
      />
    </motion.div>
  );
}

function renderMarkdownLite(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-text-high">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

async function pretendStream(
  text: string,
  onChunk: (partial: string) => void,
  delayMs = 14
) {
  let acc = "";
  for (const char of text) {
    acc += char;
    onChunk(acc);
    await new Promise((r) => setTimeout(r, delayMs));
  }
}

async function readSSEStream(
  response: Response,
  onChunk: (text: string) => void
): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) return "";

  const decoder = new TextDecoder();
  let full = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6);
      if (data === "[DONE]") continue;
      try {
        const parsed = JSON.parse(data) as { text?: string };
        if (parsed.text) {
          full += parsed.text;
          onChunk(full);
        }
      } catch {
        // ignore malformed chunks
      }
    }
  }
  return full;
}

function ActionCard({
  message,
  onDoIt,
  onDismiss,
}: {
  message: AdvisorMessage;
  onDoIt: () => void;
  onDismiss: () => void;
}) {
  const card = message.actionCard;
  if (!card || card.executed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 rounded-xl border border-accent/20 bg-accent/5 p-3"
    >
      <p className="text-xs font-medium text-accent">{card.title}</p>
      <div className="mt-2 flex gap-2">
        <Button
          size="sm"
          className="h-8 bg-accent text-primary hover:bg-accent-secondary"
          onClick={onDoIt}
        >
          Do it
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 text-text-mid hover:text-text-high"
          onClick={onDismiss}
        >
          Not now
        </Button>
      </div>
    </motion.div>
  );
}

export default function AdvisorPage() {
  const { name } = useUserStore();
  const finance = useFinanceStore();
  const {
    messages,
    isLoading,
    activeConversationId,
    addMessage,
    updateMessageContent,
    finalizeAssistantMessage,
    setMessageActionExecuted,
    setLoading,
    loadConversation,
    clearMessages,
  } = useAdvisorStore();

  const [input, setInput] = useState("");
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [chipOffset, setChipOffset] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const context = useMemo(() => buildClientContext(finance), [finance]);
  const highlights = useMemo(() => getContextHighlights(context), [context]);

  const visibleChips = useMemo(() => {
    const chips: string[] = [];
    for (let i = 0; i < 3; i++) {
      chips.push(SUGGESTION_POOL[(chipOffset + i) % SUGGESTION_POOL.length]);
    }
    return chips;
  }, [chipOffset]);

  useEffect(() => {
    const id = setInterval(() => {
      setChipOffset((o) => (o + 1) % SUGGESTION_POOL.length);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = useCallback(
    async (text: string) => {
      const prompt = text.trim();
      if (!prompt || isLoading) return;

      setInput("");
      addMessage("user", prompt);
      setLoading(true);

      const history = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: prompt },
      ];

      const assistantId = addMessage("assistant", "");

      try {
        const res = await fetch("/api/advisor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history,
            context,
            stream: true,
          }),
        });

        const isStream = res.headers
          .get("content-type")
          ?.includes("text/event-stream");

        if (isStream && res.ok) {
          const full = await readSSEStream(res, (partial) =>
            updateMessageContent(assistantId, partial)
          );
          finalizeAssistantMessage(assistantId, full);
        } else {
          const data = await res.json();
          const reply = data.message ?? data.error ?? "Something went wrong.";
          await pretendStream(reply, (partial) =>
            updateMessageContent(assistantId, partial)
          );
          finalizeAssistantMessage(assistantId, reply);
        }
      } catch {
        const fallback =
          "I couldn't reach the server right now. Try again in a moment.";
        await pretendStream(fallback, (partial) =>
          updateMessageContent(assistantId, partial)
        );
        finalizeAssistantMessage(assistantId, fallback);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [
      isLoading,
      messages,
      context,
      addMessage,
      setLoading,
      updateMessageContent,
      finalizeAssistantMessage,
    ]
  );

  const handleDoIt = (message: AdvisorMessage) => {
    setMessageActionExecuted(message.id);
    const amount = message.actionCard?.amount ?? 200;
    const bali = finance.savingsGoals.find((g) => g.name.includes("Bali"));
    if (bali) {
      finance.boostGoal(bali.id, amount);
      const pct = Math.round(
        ((bali.current + amount) / bali.target) * 100
      );
      addMessage(
        "assistant",
        `Done. Moved AED ${amount}. Your Travel goal is now ${pct}% complete.`
      );
    } else {
      addMessage("assistant", `Done. Moved AED ${amount} to savings.`);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const firstName = name.split(" ")[0];

  return (
    <motion.div
      className="relative -mx-6 -mb-8 -mt-8 flex min-h-[calc(100vh-72px)] overflow-hidden lg:-mx-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse 80% 60% at 20% 20%, rgba(110,86,255,0.08), transparent), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(42,31,110,0.5), transparent), #05060F",
            "radial-gradient(ellipse 70% 55% at 75% 25%, rgba(110,86,255,0.1), transparent), radial-gradient(ellipse 55% 45% at 25% 75%, rgba(155,123,255,0.06), transparent), #05060F",
            "radial-gradient(ellipse 80% 60% at 20% 20%, rgba(110,86,255,0.08), transparent), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(42,31,110,0.5), transparent), #05060F",
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Left rail — past conversations */}
      <AnimatePresence initial={false}>
        {leftOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="relative z-10 hidden shrink-0 overflow-hidden border-r border-white/[0.06] bg-primary/40 backdrop-blur-xl md:block"
          >
            <div className="flex h-full w-[220px] flex-col p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[11px] font-medium uppercase tracking-wider text-text-mid">
                  History
                </p>
                <button
                  type="button"
                  onClick={() => setLeftOpen(false)}
                  className="text-text-mid hover:text-text-high"
                  aria-label="Collapse history"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={clearMessages}
                className={cn(
                  "mb-2 rounded-lg px-3 py-2 text-left text-xs transition-colors",
                  activeConversationId === "current"
                    ? "bg-accent/10 text-accent"
                    : "text-text-mid hover:bg-white/[0.04]"
                )}
              >
                + New chat
              </button>
              <div className="space-y-1 overflow-y-auto">
                {PAST_CONVERSATIONS.map((conv) => (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => loadConversation(conv.id)}
                    className={cn(
                      "w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                      activeConversationId === conv.id
                        ? "bg-white/[0.06] ring-1 ring-accent/20"
                        : "hover:bg-white/[0.04]"
                    )}
                  >
                    <p className="text-xs font-medium text-text-high">
                      {conv.title}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-text-mid">
                      {conv.preview}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {!leftOpen && (
        <button
          type="button"
          onClick={() => setLeftOpen(true)}
          className="absolute left-2 top-4 z-20 hidden rounded-lg border border-white/10 bg-primary/80 p-2 text-text-mid backdrop-blur md:block"
          aria-label="Open history"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {/* Center chat column */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 border-b border-white/[0.06] bg-primary/30 px-4 py-4 backdrop-blur-xl">
          <NaviOrb size={40} />
          <div>
            <h1 className="text-base font-semibold text-text-high">Navi</h1>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="text-[11px] text-accent">online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mx-auto max-w-[760px] space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && <NaviOrb size={28} />}
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-accent text-primary"
                      : "border border-white/10 bg-white/[0.04] text-text-high backdrop-blur-xl"
                  )}
                >
                  {msg.content ? (
                    renderMarkdownLite(msg.content)
                  ) : isLoading ? (
                    <span className="flex w-full max-w-[200px] flex-col gap-2 py-1">
                      <div className="skeleton-shimmer h-3 w-full rounded-md" />
                      <div className="skeleton-shimmer h-3 w-4/5 rounded-md" />
                    </span>
                  ) : null}
                  {msg.role === "assistant" && msg.content && (
                    <ActionCard
                      message={msg}
                      onDoIt={() => handleDoIt(msg)}
                      onDismiss={() => setMessageActionExecuted(msg.id)}
                    />
                  )}
                </div>
              </motion.div>
            ))}
            <motion.div aria-hidden ref={bottomRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-white/[0.06] bg-primary/40 px-4 py-4 backdrop-blur-xl">
          <div className="mx-auto max-w-[760px]">
            {/* Rotating suggestion chips */}
            <AnimatePresence mode="wait">
              <motion.div
                key={chipOffset}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-3 flex flex-wrap gap-2"
              >
                {visibleChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    disabled={isLoading}
                    onClick={() => sendMessage(chip)}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-text-mid transition-colors hover:border-accent/30 hover:bg-accent/5 hover:text-accent disabled:opacity-50"
                  >
                    {chip}
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-text-mid"
                aria-label="Attach file"
                tabIndex={-1}
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask Navi anything, ${firstName}…`}
                disabled={isLoading}
                className="h-11 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-text-high outline-none placeholder:text-text-mid focus:border-accent/40 focus:ring-2 focus:ring-accent/15 disabled:opacity-50"
              />
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-text-mid"
                aria-label="Voice input"
                tabIndex={-1}
              >
                <Mic className="h-4 w-4" />
              </button>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-11 w-11 shrink-0 rounded-xl bg-accent p-0 text-primary hover:bg-accent-secondary disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Right rail — context panel */}
      <AnimatePresence initial={false}>
        {rightOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="relative z-10 hidden shrink-0 overflow-hidden border-l border-white/[0.06] bg-primary/40 backdrop-blur-xl lg:block"
          >
            <motion.div className="flex h-full w-[240px] flex-col p-4">
              <div className="mb-4 flex items-center justify-between">
                <motion.div className="flex items-center gap-2">
                  <Eye className="h-3.5 w-3.5 text-accent" />
                  <p className="text-[11px] font-medium uppercase tracking-wider text-text-mid">
                    Context
                  </p>
                </motion.div>
                <button
                  type="button"
                  onClick={() => setRightOpen(false)}
                  className="text-text-mid hover:text-text-high"
                  aria-label="Collapse context"
                >
                  <PanelRightClose className="h-4 w-4" />
                </button>
              </div>
              <p className="mb-3 text-[11px] leading-relaxed text-text-mid">
                Live numbers Navi uses in this session
              </p>
              <div className="space-y-3">
                {highlights.map((h) => (
                  <div
                    key={h.label}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-text-mid">
                      {h.label}
                    </p>
                    <p className="mt-1 font-mono text-sm font-medium text-text-high">
                      {h.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-auto rounded-xl border border-accent/15 bg-accent/5 p-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  <p className="text-[11px] font-medium text-accent">
                    Transparency mode
                  </p>
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-text-mid">
                  Navi only uses data you&apos;ve connected — never invents balances.
                </p>
              </div>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>

      {!rightOpen && (
        <button
          type="button"
          onClick={() => setRightOpen(true)}
          className="absolute right-2 top-4 z-20 hidden rounded-lg border border-white/10 bg-primary/80 p-2 text-text-mid backdrop-blur lg:block"
          aria-label="Open context panel"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}
