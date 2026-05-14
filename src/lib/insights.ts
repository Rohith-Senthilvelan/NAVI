import {
  mockBudgets,
  mockGoals,
  mockSubscriptions,
  mockTransactions,
  type InsightSeverity,
  type MockTransaction,
  type TransactionCategory,
} from "./mock-data";

export const REF_DATE = "2026-05-14";

export type DigIcon =
  | "utensils"
  | "store"
  | "receipt"
  | "repeat"
  | "calendar"
  | "flame";

export type DigActionType = "cap" | "advisor" | "subscriptions" | "savings";

export interface DigAction {
  label: string;
  type: DigActionType;
  payload?: string;
  category?: TransactionCategory;
}

export interface SignatureDig {
  id: string;
  title: string;
  body: string;
  severity: InsightSeverity;
  icon: DigIcon;
  primaryAction: DigAction;
  secondaryAction: DigAction;
}

export interface CategorySlice {
  category: TransactionCategory;
  value: number;
  color: string;
}

export interface CategoryTrendPoint {
  month: string;
  [category: string]: string | number;
}

export interface HeatmapCell {
  date: string | null;
  dayOfMonth: number | null;
  amount: number;
  weekIndex: number;
  dayIndex: number;
}

const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  Food: "#6E56FF",
  Groceries: "#4FD1FF",
  Transport: "#9B7BFF",
  Shopping: "#F5C453",
  Bills: "#FF6FB5",
  Subscriptions: "#4F46FF",
  Entertainment: "#8B6FFF",
  Health: "#2A1F6E",
  Travel: "#6B7099",
  Other: "#6B7099",
};

const FOOD_MERCHANTS = new Set([
  "Talabat",
  "Deliveroo",
  "Zomato",
  "Starbucks",
  "Paul Bakery",
]);

function monthKey(dateStr: string) {
  return dateStr.slice(0, 7);
}

function sumByCategory(txs: MockTransaction[]) {
  const totals = {} as Record<TransactionCategory, number>;
  for (const tx of txs) {
    totals[tx.category] = Math.round(
      ((totals[tx.category] ?? 0) + tx.amount) * 100
    ) / 100;
  }
  return totals;
}

function txsInMonth(yearMonth: string) {
  return mockTransactions.filter((t) => monthKey(t.date) === yearMonth);
}

function simulatePriorMonth(current: Record<TransactionCategory, number>, factor = 0.87) {
  const out = {} as Record<TransactionCategory, number>;
  for (const [cat, val] of Object.entries(current)) {
    out[cat as TransactionCategory] = Math.round(val * factor);
  }
  return out;
}

export function getCategoryBreakdown(): CategorySlice[] {
  const may = sumByCategory(txsInMonth("2026-05"));
  return Object.entries(may)
    .filter(([, v]) => v > 0)
    .map(([category, value]) => ({
      category: category as TransactionCategory,
      value,
      color: CATEGORY_COLORS[category as TransactionCategory],
    }))
    .sort((a, b) => b.value - a.value);
}

export function getTopCategories(n = 4): TransactionCategory[] {
  return getCategoryBreakdown()
    .slice(0, n)
    .map((c) => c.category);
}

export function getCategoryTrend(): CategoryTrendPoint[] {
  const mayTotals = sumByCategory(txsInMonth("2026-05"));
  const top = getTopCategories(4);
  const months = [
    { label: "Mar", factor: 0.78 },
    { label: "Apr", factor: 0.9 },
    { label: "May", factor: 1 },
  ];

  return months.map(({ label, factor }) => {
    const point: CategoryTrendPoint = { month: label };
    for (const cat of top) {
      point[cat] = Math.round((mayTotals[cat] ?? 0) * factor);
    }
    return point;
  });
}

export function getSpendingHeatmap(): HeatmapCell[] {
  const ref = new Date(REF_DATE);
  const year = ref.getFullYear();
  const month = ref.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: HeatmapCell[] = [];

  const dailyTotals: Record<string, number> = {};
  for (const tx of mockTransactions) {
    if (monthKey(tx.date) !== "2026-05") continue;
    dailyTotals[tx.date] = Math.round(
      ((dailyTotals[tx.date] ?? 0) + tx.amount) * 100
    ) / 100;
  }

  const firstDow = new Date(year, month, 1).getDay();
  const mondayOffset = (firstDow + 6) % 7;

  for (let week = 0; week < 5; week++) {
    for (let day = 0; day < 7; day++) {
      const cellIndex = week * 7 + day;
      const dom = cellIndex - mondayOffset + 1;
      if (dom < 1 || dom > daysInMonth) {
        cells.push({
          date: null,
          dayOfMonth: null,
          amount: 0,
          weekIndex: week,
          dayIndex: day,
        });
      } else {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dom).padStart(2, "0")}`;
        cells.push({
          date: dateStr,
          dayOfMonth: dom,
          amount: dailyTotals[dateStr] ?? 0,
          weekIndex: week,
          dayIndex: day,
        });
      }
    }
  }
  return cells;
}

export function getHeatmapMax(cells: HeatmapCell[]) {
  return Math.max(1, ...cells.map((c) => c.amount));
}

export function getSavingsStreakWeeks() {
  return 5;
}

export function generateSignatureDigs(): SignatureDig[] {
  const mayTxs = txsInMonth("2026-05");
  const mayByCat = sumByCategory(mayTxs);
  const aprByCat = simulatePriorMonth(mayByCat, 0.87);

  const digs: SignatureDig[] = [];

  // 1. Category overspend vs last month
  const foodMay = mayByCat.Food ?? 0;
  const foodApr = aprByCat.Food || 1;
  const foodPct = Math.round(((foodMay - foodApr) / foodApr) * 100);
  const foodOutings = mayTxs.filter(
    (t) => t.category === "Food" && FOOD_MERCHANTS.has(t.merchant)
  ).length;
  const aprOutings = Math.max(1, Math.round(foodOutings * 0.62));
  const saveEstimate = Math.round((foodOutings - aprOutings) * 75);

  digs.push({
    id: "dig-food-overspend",
    title: `You spent ${foodPct}% more on Food than last month.`,
    body: `Eating out ${foodOutings} times this month (vs ${aprOutings} last month). Cutting 2 outings saves ~AED ${Math.max(saveEstimate, 200)}.`,
    severity: foodPct >= 10 ? "warning" : "info",
    icon: "utensils",
    primaryAction: {
      label: "Set a food cap",
      type: "cap",
      category: "Food",
    },
    secondaryAction: {
      label: "Ask Navi why",
      type: "advisor",
      payload: `Why did my Food spending increase ${foodPct}% compared to last month?`,
    },
  });

  // 2. Most expensive merchant
  const merchantTotals: Record<string, number> = {};
  for (const tx of mayTxs) {
    merchantTotals[tx.merchant] =
      Math.round(((merchantTotals[tx.merchant] ?? 0) + tx.amount) * 100) / 100;
  }
  const topMerchant = Object.entries(merchantTotals).sort((a, b) => b[1] - a[1])[0];
  if (topMerchant) {
    const [name, total] = topMerchant;
    const share = Math.round((total / mayTxs.reduce((s, t) => s + t.amount, 0)) * 100);
    digs.push({
      id: "dig-top-merchant",
      title: `${name} is your most expensive merchant.`,
      body: `You spent AED ${total.toLocaleString()} at ${name} this month — ${share}% of total spending. Review if this aligns with your priorities.`,
      severity: share >= 15 ? "warning" : "info",
      icon: "store",
      primaryAction: {
        label: "Review transactions",
        type: "advisor",
        payload: `Break down my spending at ${name} this month.`,
      },
      secondaryAction: {
        label: "Ask Navi why",
        type: "advisor",
        payload: `Why is ${name} my top merchant this month?`,
      },
    });
  }

  // 3. Highest single transaction
  const highest = [...mayTxs].sort((a, b) => b.amount - a.amount)[0];
  if (highest) {
    digs.push({
      id: "dig-highest-tx",
      title: `Your largest purchase was AED ${highest.amount.toLocaleString()}.`,
      body: `${highest.merchant} on ${highest.date} (${highest.category}). One-off spikes like this can throw off monthly pacing — worth tagging or splitting across goals.`,
      severity: highest.amount >= 1000 ? "warning" : "info",
      icon: "receipt",
      primaryAction: {
        label: "Categorize differently",
        type: "advisor",
        payload: `Should my AED ${highest.amount} ${highest.merchant} purchase be categorized differently?`,
      },
      secondaryAction: {
        label: "Ask Navi why",
        type: "advisor",
        payload: `Explain my AED ${highest.amount} transaction at ${highest.merchant}.`,
      },
    });
  }

  // 4. Subscription waste
  const unused = mockSubscriptions.filter((s) =>
    s.lastUsed.toLowerCase().includes("not used")
  );
  const wasteTotal = Math.round(
    unused.reduce((s, u) => s + u.amount, 0) * 100
  ) / 100;
  if (unused.length > 0) {
    digs.push({
      id: "dig-sub-waste",
      title: `${unused.length} subscriptions look unused.`,
      body: `${unused.map((u) => u.name).join(", ")} haven't been touched recently. Pausing them frees AED ${wasteTotal}/mo.`,
      severity: "critical",
      icon: "repeat",
      primaryAction: {
        label: "Review subscriptions",
        type: "subscriptions",
      },
      secondaryAction: {
        label: "Ask Navi why",
        type: "advisor",
        payload: "Which subscriptions should I cancel or pause right now?",
      },
    });
  }

  // 5. Weekend spending pattern
  const weekend = mayTxs.filter((t) => {
    const dow = new Date(t.date).getDay();
    return dow === 0 || dow === 6;
  });
  const weekday = mayTxs.filter((t) => {
    const dow = new Date(t.date).getDay();
    return dow >= 1 && dow <= 5;
  });
  const weekendTotal = weekend.reduce((s, t) => s + t.amount, 0);
  const weekdayTotal = weekday.reduce((s, t) => s + t.amount, 0);
  const weekendDays = new Set(weekend.map((t) => t.date)).size || 1;
  const weekdayDays = new Set(weekday.map((t) => t.date)).size || 1;
  const weekendAvg = Math.round(weekendTotal / weekendDays);
  const weekdayAvg = Math.round(weekdayTotal / weekdayDays);
  const weekendLift = Math.round(((weekendAvg - weekdayAvg) / weekdayAvg) * 100);

  digs.push({
    id: "dig-weekend",
    title: `Weekend spending runs ${weekendLift}% higher per day.`,
    body: `You average AED ${weekendAvg}/day on Sat–Sun vs AED ${weekdayAvg} on weekdays. A Friday auto-save rule could capture the gap.`,
    severity: weekendLift >= 20 ? "warning" : "info",
    icon: "calendar",
    primaryAction: {
      label: "Enable Friday save",
      type: "savings",
    },
    secondaryAction: {
      label: "Ask Navi why",
      type: "advisor",
      payload: "Why do I spend more on weekends and how can I fix it?",
    },
  });

  // 6. Savings streak
  const emergency = mockGoals[0];
  const streak = getSavingsStreakWeeks();
  digs.push({
    id: "dig-streak",
    title: `You've saved for ${streak} weeks straight!`,
    body: `Emergency Fund is at AED ${emergency.current.toLocaleString()} of AED ${emergency.target.toLocaleString()}. Keep the streak alive — even AED 50 this week compounds.`,
    severity: "positive",
    icon: "flame",
    primaryAction: {
      label: "Boost Emergency Fund",
      type: "savings",
    },
    secondaryAction: {
      label: "Ask Navi why",
      type: "advisor",
      payload: "How am I doing on my savings streak and goals?",
    },
  });

  // Budget overspend dig from mock budgets
  const overBudget = mockBudgets
    .filter((b) => b.spent > b.budget)
    .sort((a, b) => b.spent / b.budget - a.spent / a.budget)[0];
  if (overBudget) {
    const pct = Math.round((overBudget.spent / overBudget.budget - 1) * 100);
    digs.push({
      id: `dig-budget-${overBudget.category}`,
      title: `${overBudget.category} is ${pct}% over budget.`,
      body: `Spent AED ${overBudget.spent.toLocaleString()} against AED ${overBudget.budget.toLocaleString()} cap. Navi can rebalance from categories with headroom.`,
      severity: pct >= 15 ? "critical" : "warning",
      icon: "receipt",
      primaryAction: {
        label: `Set a ${overBudget.category.toLowerCase()} cap`,
        type: "cap",
        category: overBudget.category,
      },
      secondaryAction: {
        label: "Ask Navi why",
        type: "advisor",
        payload: `Why am I over budget on ${overBudget.category}?`,
      },
    });
  }

  return digs;
}

export { CATEGORY_COLORS };
