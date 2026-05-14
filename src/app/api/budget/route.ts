import { NextResponse } from "next/server";
import { mockBudgets, monthlySummary } from "@/lib/mock-data";

export async function GET() {
  const totalBudget = mockBudgets.reduce((s, b) => s + b.budget, 0);
  const totalSpent = mockBudgets.reduce((s, b) => s + b.spent, 0);

  return NextResponse.json({
    budgets: mockBudgets,
    summary: {
      ...monthlySummary,
      totalBudget,
      totalSpent,
      remaining: Math.round((totalBudget - totalSpent) * 100) / 100,
    },
  });
}
