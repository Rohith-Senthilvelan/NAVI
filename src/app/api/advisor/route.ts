import { NextResponse } from "next/server";
import { z } from "zod";
import { askNavi } from "@/lib/ai";
import { buildFinancialContext } from "@/lib/mock-data";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1),
});

const legacySchema = z.object({
  prompt: z.string().min(1),
  history: z.array(messageSchema).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const context = buildFinancialContext();

    const parsed = requestSchema.safeParse(body);
    if (parsed.success) {
      const response = await askNavi(parsed.data.messages, context);
      return NextResponse.json(response);
    }

    const legacy = legacySchema.safeParse(body);
    if (legacy.success) {
      const messages = [
        ...(legacy.data.history ?? []),
        { role: "user" as const, content: legacy.data.prompt },
      ];
      const response = await askNavi(messages, context);
      return NextResponse.json(response);
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
