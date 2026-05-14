"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { useTypewriter } from "@/components/landing/chat-typewriter";

export type Conversation = {
  user: string;
  navi: string;
  primaryCta: string;
  secondaryCta: string;
  secondaryHref: string;
};

export function ChatConversation({
  conversation,
  play,
}: {
  conversation: Conversation;
  play: boolean;
}) {
  const [phase, setPhase] = useState<"user" | "navi" | "actions">("user");
  const naviText = useTypewriter(conversation.navi, phase === "navi" && play, 32);
  const naviDone = naviText.length === conversation.navi.length;

  useEffect(() => {
    if (!play) {
      setPhase("user");
      return;
    }
    setPhase("user");
    const t1 = setTimeout(() => setPhase("navi"), 450);
    return () => clearTimeout(t1);
  }, [play, conversation.user]);

  useEffect(() => {
    if (phase === "navi" && naviDone) {
      const t = setTimeout(() => setPhase("actions"), 350);
      return () => clearTimeout(t);
    }
  }, [phase, naviDone]);

  return (
    <div className="card-glass-hero flex h-full min-h-[380px] flex-col p-6 md:p-8">
      <div className="mb-4 flex items-center gap-2 border-b border-white/[0.06] pb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-button text-xs font-bold text-white">
          N
        </span>
        <div>
          <p className="text-sm font-medium text-text-high">Navi Advisor</p>
          <p className="flex items-center gap-1 text-[10px] text-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
            Live
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center space-y-4" data-lenis-prevent>
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-white/10 px-4 py-3 text-sm text-text-high"
        >
          {conversation.user}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="flex gap-2"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-button text-[10px] font-bold text-white">
            N
          </span>
          <div className="max-w-[calc(100%-2.5rem)] rounded-2xl rounded-tl-sm border border-accent/20 bg-accent/5 px-4 py-3 text-sm leading-relaxed text-text-high">
            {play && phase !== "user" ? naviText : conversation.navi}
            {play && phase === "navi" && !naviDone && (
              <span className="animate-blink text-accent">|</span>
            )}
          </div>
        </motion.div>

        {(phase === "actions" || !play) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 pl-9"
          >
            <MagneticButton href="/login">
              <span className="btn-primary px-4 py-2 text-xs">
                {conversation.primaryCta}
              </span>
            </MagneticButton>
            <MagneticButton href={conversation.secondaryHref}>
              <span className="btn-secondary px-4 py-2 text-xs">
                {conversation.secondaryCta}
              </span>
            </MagneticButton>
          </motion.div>
        )}
      </div>
    </div>
  );
}
