import OpenAI from "openai";
import { z } from "zod";
import type { FinancialContext } from "@/lib/mock-data";
import { buildFinancialContext } from "@/lib/mock-data";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const advisorResponseSchema = z.object({
  message: z.string(),
  suggestions: z.array(z.string()).optional(),
});

export type AdvisorResponse = z.infer<typeof advisorResponseSchema>;

const SYSTEM_PROMPT =
  "You are Navi, an AI financial coach for the UAE market. Currency is AED. Be concise, warm, and decisive. Always propose ONE specific action the user can take. Use the user's actual numbers from the provided context. Never invent data not in context. Respond in JSON: { \"message\": string, \"suggestions\": string[] }.";

function formatContext(ctx: FinancialContext): string {
  const categories = ctx.topCategories
    .map((c) => `${c.category}: AED ${c.spent} / ${c.budget}`)
    .join("; ");
  const goals = ctx.goals
    .map((g) => `${g.name}: AED ${g.current} / ${g.target}`)
    .join("; ");
  const unused = ctx.unusedSubscriptions
    .map((s) => `${s.name} (AED ${s.amount}/mo)`)
    .join(", ");

  return [
    `Available balance: AED ${ctx.availableBalance}`,
    `Monthly income: AED ${ctx.monthlyIncome}`,
    `Monthly expenses (30d): AED ${ctx.monthlyExpenses}`,
    `Top categories: ${categories}`,
    `Savings goals: ${goals}`,
    `Round-up total (30d): AED ${ctx.roundUpTotal}`,
    unused ? `Unused subscriptions: ${unused}` : "No unused subscriptions flagged",
  ].join("\n");
}

function lastUserMessage(messages: ChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return messages[messages.length - 1]?.content ?? "";
}

function mockAskNavi(messages: ChatMessage[], ctx: FinancialContext): AdvisorResponse {
  const prompt = lastUserMessage(messages).toLowerCase();
  const food = ctx.topCategories.find((c) => c.category === "Food");
  const unusedTotal = ctx.unusedSubscriptions.reduce((s, u) => s + u.amount, 0);
  const emergency = ctx.goals.find((g) => g.name.includes("Emergency"));
  const bali = ctx.goals.find((g) => g.name.includes("Bali"));

  if (
    /afford|trip|travel|bali|vacation|holiday|can i pay/.test(prompt)
  ) {
    const tripCost = 4500;
    const remaining = ctx.availableBalance - tripCost;
    return {
      message: `You have AED ${ctx.availableBalance.toLocaleString()} available and spend AED ${ctx.monthlyExpenses.toLocaleString()} monthly. A Bali trip (~AED ${tripCost.toLocaleString()}) is feasible if you pause unused subs (AED ${unusedTotal.toFixed(0)}/mo) and hold Shopping to budget for 6 weeks — you'd still have ~AED ${Math.max(remaining, 0).toLocaleString()} buffer. **Action:** Move AED 500/month from Shopping into your Bali goal (currently AED ${bali?.current.toLocaleString()} / ${bali?.target.toLocaleString()}).`,
      suggestions: ["Boost Bali savings", "Show unused subscriptions"],
    };
  }

  if (/save|saving|goal|emergency|round.?up/.test(prompt)) {
    return {
      message: `Your Emergency Fund is at AED ${emergency?.current.toLocaleString()} of AED ${emergency?.target.toLocaleString()} (${Math.round(((emergency?.current ?? 0) / (emergency?.target ?? 1)) * 100)}%). Round-ups added AED ${ctx.roundUpTotal} this month. Pausing Adobe, Prime, and Canva frees AED ${unusedTotal.toFixed(0)}/mo — combined with round-ups, you'd reach AED 10,000 ~10 weeks sooner. **Action:** Auto-transfer AED 400/month to Emergency Fund on payday.`,
      suggestions: ["Set up auto-transfer", "Review round-ups"],
    };
  }

  if (/cancel|cut|subscription|unused|pause/.test(prompt)) {
    const names = ctx.unusedSubscriptions.map((s) => s.name).join(", ");
    return {
      message: `${ctx.unusedSubscriptions.length} subscriptions look unused: ${names} — AED ${unusedTotal.toFixed(2)}/month total. Netflix and Spotify are actively used; keep those. **Action:** Pause Adobe CC and Amazon Prime today to save AED ${(ctx.unusedSubscriptions.filter((s) => s.name !== "Canva Pro").reduce((a, s) => a + s.amount, 0)).toFixed(0)}/mo immediately.`,
      suggestions: ["Pause Adobe CC", "Keep Netflix & Spotify"],
    };
  }

  if (/budget|rebalance|spending|over|month/.test(prompt)) {
    const over = ctx.topCategories.filter((c) => c.spent > c.budget);
    const overText = over.length
      ? over.map((c) => `${c.category} (+AED ${(c.spent - c.budget).toFixed(0)})`).join(", ")
      : "all categories on track";
    return {
      message: `You've spent AED ${ctx.monthlyExpenses.toLocaleString()} this month against ~AED ${ctx.topCategories.reduce((s, c) => s + c.budget, 0).toLocaleString()} budgeted. Over budget: ${overText}. Food is the main pressure at AED ${food?.spent} / ${food?.budget}. **Action:** Cap Food delivery to 3×/week and reallocate AED 150 to Groceries meal-prep.`,
      suggestions: ["Show Food transactions", "Rebalance budgets"],
    };
  }

  if (/forecast|next 3 month|three month/.test(prompt)) {
    return {
      message: `Based on your last 30 days (AED ${ctx.monthlyExpenses.toLocaleString()}), Navi forecasts ~AED ${Math.round(ctx.monthlyExpenses * 1.02).toLocaleString()} in June, ~AED ${Math.round(ctx.monthlyExpenses * 0.97).toLocaleString()} in July if you trim Food delivery, and ~AED ${Math.round(ctx.monthlyExpenses * 1.05).toLocaleString()} in August with travel spend. **Action:** Set a AED 4,500 monthly spend cap to stay on track.`,
      suggestions: ["Set spend cap", "Show category forecast"],
    };
  }

  if (/20,?000|20k|twelve month|12 month/.test(prompt)) {
    return {
      message: `To reach AED 20,000 in 12 months you need ~AED 1,667/month. Your current surplus after expenses is roughly AED ${(ctx.monthlyIncome - ctx.monthlyExpenses).toLocaleString()}/mo — achievable if you redirect unused subs (AED ${unusedTotal.toFixed(0)}/mo) and AED 500 from Shopping. **Action:** Auto-save AED 1,700/month to a dedicated goal starting next payday.`,
      suggestions: ["Create AED 20k goal", "Find AED 500 to cut"],
    };
  }

  if (/500.*travel|save.*500|travel.*500/.test(prompt)) {
    return {
      message: `Your Bali goal is at AED ${bali?.current.toLocaleString()} / ${bali?.target.toLocaleString()}. Adding AED 500/mo gets you there ~4 months sooner. Shopping is AED ${ctx.topCategories.find((c) => c.category === "Shopping")?.spent} spent this month — room to shift. **Action:** Move AED 200 from Shopping to Savings for Bali.`,
      suggestions: ["Boost Bali goal", "Review Shopping spend"],
    };
  }

  if (/invest|stock|etf|grow|portfolio/.test(prompt)) {
    return {
      message: `Before investing, shore up your Emergency Fund (AED ${emergency?.current.toLocaleString()} / ${emergency?.target.toLocaleString()}). Once at AED 5,000+, a low-cost UAE ETF via a regulated platform fits your profile. **Action:** Finish Emergency Fund first, then start AED 500/mo into a diversified ETF after reaching 50% of the goal.`,
      suggestions: ["Track Emergency Fund", "Learn about UAE ETFs"],
    };
  }

  if (/business|sme|company|vat|invoice/.test(prompt)) {
    return {
      message: `Business Advisor (Navi Plus) covers cash-flow forecasting, VAT prep, and vendor negotiation — not included in your current plan. Personal finances show AED ${ctx.availableBalance.toLocaleString()} available with ${ctx.unusedSubscriptions.length} subs to trim. **Action:** Unlock Navi Plus when you're ready to separate business accounts; meanwhile, pause unused personal subs to free AED ${unusedTotal.toFixed(0)}/mo.`,
      suggestions: ["Explore Navi Plus", "Review personal subs"],
    };
  }

  return {
    message: `You're at AED ${ctx.availableBalance.toLocaleString()} available with AED ${ctx.monthlyExpenses.toLocaleString()} spent in the last 30 days. Top spend: ${ctx.topCategories[0]?.category} (AED ${ctx.topCategories[0]?.spent}). ${ctx.unusedSubscriptions.length} unused subs cost AED ${unusedTotal.toFixed(0)}/mo. **Action:** Ask me to rebalance your budget or cancel unused subscriptions — I'll use your real numbers.`,
    suggestions: [
      "How am I doing this month?",
      "Cancel unused subscriptions",
      "Can I afford a trip?",
    ],
  };
}

export async function askNavi(
  messages: ChatMessage[],
  context: FinancialContext
): Promise<AdvisorResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 500));
    return mockAskNavi(messages, context);
  }

  try {
    const openai = new OpenAI({ apiKey });
    const contextBlock = formatContext(context);

    const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `${SYSTEM_PROMPT}\n\nUser financial context:\n${contextBlock}`,
      },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages,
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    return advisorResponseSchema.parse(JSON.parse(raw));
  } catch {
    return mockAskNavi(messages, context);
  }
}

export async function streamAskNavi(
  messages: ChatMessage[],
  context: FinancialContext
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.OPENAI_API_KEY;
  const encoder = new TextEncoder();

  if (!apiKey) {
    const mock = await askNavi(messages, context);
    return new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ text: mock.message })}\n\n`)
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });
  }

  const openai = new OpenAI({ apiKey });
  const contextBlock = formatContext(context);

  const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `${SYSTEM_PROMPT}\n\nUser financial context:\n${contextBlock}`,
    },
    ...messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: chatMessages,
    stream: true,
    max_tokens: 500,
  });

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch {
        const mock = await askNavi(messages, context);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ text: mock.message })}\n\n`)
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });
}

/** @deprecated Use askNavi with messages array */
export async function getAdvisorResponse(
  prompt: string,
  history: ChatMessage[] = []
): Promise<AdvisorResponse> {
  return askNavi([...history, { role: "user", content: prompt }], buildFinancialContext());
}
