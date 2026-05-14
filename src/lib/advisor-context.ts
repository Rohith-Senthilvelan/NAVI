import type { FinancialContext } from "@/lib/mock-data";
import type { useFinanceStore } from "@/lib/store";

type FinanceSnapshot = ReturnType<typeof useFinanceStore.getState>;

export function buildClientContext(state: FinanceSnapshot): FinancialContext {
  const topCategories = [...state.budgets]
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5)
    .map((b) => ({
      category: b.name,
      spent: b.spent,
      budget: b.allocated,
    }));

  const unusedSubscriptions = state.subscriptions
    .filter((s) => s.status === "unused" && s.active)
    .map((s) => ({
      id: s.id,
      name: s.name,
      amount: s.amount,
      lastUsed: s.lastUsed,
      category: s.category,
      status: "active" as const,
    }));

  const monthlyExpenses = state.budgets.reduce((sum, b) => sum + b.spent, 0);

  return {
    availableBalance: 12480,
    monthlyIncome: 18500,
    monthlyExpenses,
    topCategories,
    goals: state.savingsGoals,
    unusedSubscriptions,
    roundUpTotal: 87.4,
    insights: [],
  };
}

export function getContextHighlights(ctx: FinancialContext) {
  const unusedTotal = ctx.unusedSubscriptions.reduce((s, u) => s + u.amount, 0);
  return [
    { label: "Available", value: `AED ${ctx.availableBalance.toLocaleString()}` },
    {
      label: "Spent (30d)",
      value: `AED ${ctx.monthlyExpenses.toLocaleString()}`,
    },
    {
      label: "Unused subs",
      value: `AED ${Math.round(unusedTotal)}/mo`,
    },
  ];
}
