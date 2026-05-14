import { NextResponse } from "next/server";
import { z } from "zod";
import { askNavi, streamAskNavi } from "@/lib/ai";
import { buildFinancialContext, type FinancialContext } from "@/lib/mock-data";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const contextSchema = z.object({
  availableBalance: z.number(),
  monthlyIncome: z.number(),
  monthlyExpenses: z.number(),
  topCategories: z.array(
    z.object({
      category: z.string(),
      spent: z.number(),
      budget: z.number(),
    })
  ),
  goals: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      target: z.number(),
      current: z.number(),
      deadline: z.string(),
      color: z.string(),
    })
  ),
  unusedSubscriptions: z.array(z.any()),
  roundUpTotal: z.number(),
  insights: z.array(z.any()).optional(),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1),
  context: contextSchema.optional(),
  stream: z.boolean().optional(),
});

const legacySchema = z.object({
  prompt: z.string().min(1),
  history: z.array(messageSchema).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const defaultContext = buildFinancialContext();

    const parsed = requestSchema.safeParse(body);
    if (parsed.success) {
      const context: FinancialContext = parsed.data.context
        ? { ...defaultContext, ...parsed.data.context, insights: defaultContext.insights }
        : defaultContext;

      if (parsed.data.stream && process.env.OPENAI_API_KEY) {
        const stream = await streamAskNavi(parsed.data.messages, context);
        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      }

      const response = await askNavi(parsed.data.messages, context);
      return NextResponse.json(response);
    }

    const legacy = legacySchema.safeParse(body);
    if (legacy.success) {
      const messages = [
        ...(legacy.data.history ?? []),
        { role: "user" as const, content: legacy.data.prompt },
      ];
      const response = await askNavi(messages, defaultContext);
      return NextResponse.json(response);
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
