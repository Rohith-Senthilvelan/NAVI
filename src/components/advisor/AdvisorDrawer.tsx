"use client";

import { Loader2, Send, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAdvisorStore, useUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "How am I doing this month?",
  "Can I afford a trip?",
  "Cancel unused subscriptions",
];

export function AdvisorDrawer() {
  const { advisorDrawerOpen, setAdvisorDrawerOpen } = useUIStore();
  const { messages, isLoading, addMessage, setLoading } = useAdvisorStore();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const prompt = text.trim();
    if (!prompt || isLoading) return;

    setInput("");
    addMessage("user", prompt);
    setLoading(true);

    try {
      const allMessages = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: prompt },
      ];

      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages }),
      });

      const data = await res.json();
      addMessage(
        "assistant",
        data.message ?? data.error ?? "Something went wrong. Try again."
      );
    } catch {
      addMessage("assistant", "Couldn't reach Navi right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <Sheet open={advisorDrawerOpen} onOpenChange={setAdvisorDrawerOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-white/10 bg-primary p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-white/5 px-6 py-5 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <div>
              <SheetTitle className="text-base">Navi Advisor</SheetTitle>
              <SheetDescription className="text-xs">
                Your AI financial coach
              </SheetDescription>
            </div>
            <span className="ml-auto flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/5 px-2 py-0.5 text-[10px] font-medium text-accent">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              Online
            </span>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-accent/15 text-text-high"
                      : "border border-white/10 bg-white/[0.04] text-text-high"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-text-mid">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
                  Navi is thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        <div className="border-t border-white/5 p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((chip) => (
              <button
                key={chip}
                type="button"
                disabled={isLoading}
                onClick={() => sendMessage(chip)}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-text-mid transition-colors hover:border-accent/30 hover:bg-accent/5 hover:text-accent disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Navi anything…"
              disabled={isLoading}
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-text-high outline-none transition-colors placeholder:text-text-mid focus:border-accent/40 focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary transition-opacity hover:bg-accent-secondary disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
