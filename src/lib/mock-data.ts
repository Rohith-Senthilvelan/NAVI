export type TransactionCategory =
  | "Food"
  | "Groceries"
  | "Transport"
  | "Shopping"
  | "Bills"
  | "Subscriptions"
  | "Entertainment"
  | "Health"
  | "Travel"
  | "Other";

export type PaymentMethod = "Card" | "Apple Pay" | "Bank Transfer" | "Cash";

export interface MockTransaction {
  id: string;
  date: string;
  merchant: string;
  category: TransactionCategory;
  amount: number;
  method: PaymentMethod;
}

export interface MockBudget {
  category: TransactionCategory;
  budget: number;
  spent: number;
}

export interface MockGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
}

export interface MockSubscription {
  id: string;
  name: string;
  amount: number;
  lastUsed: string;
  category: string;
  status: "active" | "paused" | "cancelled";
}

export interface MockRoundUp {
  transactionId: string;
  date: string;
  merchant: string;
  originalAmount: number;
  roundedAmount: number;
  roundUp: number;
}

export type InsightSeverity = "info" | "warning" | "positive" | "critical";

export interface MockInsight {
  id: string;
  title: string;
  body: string;
  severity: InsightSeverity;
}

export interface MockCircleMember {
  name: string;
  initials: string;
  contributed?: number;
}

export interface CircleContribution {
  id: string;
  memberName: string;
  amount: number;
  date: string;
}

export interface CirclePayout {
  id: string;
  label: string;
  date: string;
  amount: number;
  status: "scheduled" | "completed";
}

export interface MockCircle {
  id: string;
  name: string;
  members: MockCircleMember[];
  monthlyContribution: number;
  totalSaved: number;
  target: number;
  contributionHistory: CircleContribution[];
  payoutSchedule: CirclePayout[];
}

export interface FinancialContext {
  availableBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  topCategories: { category: string; spent: number; budget: number }[];
  goals: MockGoal[];
  unusedSubscriptions: MockSubscription[];
  roundUpTotal: number;
  insights: MockInsight[];
}

const CATEGORIES: TransactionCategory[] = [
  "Food",
  "Groceries",
  "Transport",
  "Shopping",
  "Bills",
  "Subscriptions",
  "Entertainment",
  "Health",
  "Travel",
  "Other",
];

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function generateDeterministicTransactions(): MockTransaction[] {
  const seeds: {
    day: number;
    category: TransactionCategory;
    merchant: string;
    amount: number;
    method: PaymentMethod;
  }[] = [
    { day: 0, category: "Food", merchant: "Talabat", amount: 128, method: "Apple Pay" },
    { day: 0, category: "Transport", merchant: "Careem", amount: 45, method: "Card" },
    { day: 1, category: "Groceries", merchant: "Carrefour", amount: 342.5, method: "Card" },
    { day: 1, category: "Food", merchant: "Starbucks", amount: 34, method: "Apple Pay" },
    { day: 2, category: "Bills", merchant: "DEWA", amount: 485, method: "Bank Transfer" },
    { day: 2, category: "Subscriptions", merchant: "Netflix", amount: 39.99, method: "Card" },
    { day: 3, category: "Food", merchant: "Talabat", amount: 96, method: "Apple Pay" },
    { day: 3, category: "Transport", merchant: "Uber", amount: 62, method: "Card" },
    { day: 4, category: "Shopping", merchant: "Noon", amount: 289, method: "Card" },
    { day: 5, category: "Groceries", merchant: "Lulu Hypermarket", amount: 215, method: "Card" },
    { day: 5, category: "Food", merchant: "Deliveroo", amount: 78, method: "Apple Pay" },
    { day: 6, category: "Entertainment", merchant: "VOX Cinemas", amount: 110, method: "Card" },
    { day: 7, category: "Bills", merchant: "Etisalat", amount: 249, method: "Bank Transfer" },
    { day: 7, category: "Food", merchant: "Zomato", amount: 142, method: "Apple Pay" },
    { day: 8, category: "Transport", merchant: "Careem", amount: 38, method: "Apple Pay" },
    { day: 9, category: "Health", merchant: "Life Pharmacy", amount: 87, method: "Card" },
    { day: 10, category: "Subscriptions", merchant: "Spotify", amount: 19.99, method: "Card" },
    { day: 10, category: "Food", merchant: "Talabat", amount: 156, method: "Apple Pay" },
    { day: 11, category: "Shopping", merchant: "Amazon.ae", amount: 199, method: "Card" },
    { day: 12, category: "Groceries", merchant: "Spinneys", amount: 178, method: "Card" },
    { day: 13, category: "Transport", merchant: "ENOC", amount: 165, method: "Card" },
    { day: 14, category: "Food", merchant: "Paul Bakery", amount: 52, method: "Apple Pay" },
    { day: 14, category: "Bills", merchant: "ADCB", amount: 850, method: "Bank Transfer" },
    { day: 15, category: "Subscriptions", merchant: "iCloud+", amount: 12.99, method: "Card" },
    { day: 16, category: "Food", merchant: "Talabat", amount: 112, method: "Apple Pay" },
    { day: 17, category: "Shopping", merchant: "Namshi", amount: 340, method: "Card" },
    { day: 18, category: "Entertainment", merchant: "PlayStation Store", amount: 79, method: "Card" },
    { day: 19, category: "Groceries", merchant: "Carrefour", amount: 267, method: "Card" },
    { day: 20, category: "Transport", merchant: "RTA Salik", amount: 32, method: "Card" },
    { day: 21, category: "Food", merchant: "Starbucks", amount: 28, method: "Apple Pay" },
    { day: 22, category: "Health", merchant: "Aster Clinic", amount: 250, method: "Card" },
    { day: 23, category: "Travel", merchant: "Booking.com", amount: 420, method: "Card" },
    { day: 24, category: "Food", merchant: "Deliveroo", amount: 134, method: "Apple Pay" },
    { day: 25, category: "Subscriptions", merchant: "Adobe CC", amount: 89.99, method: "Card" },
    { day: 26, category: "Shopping", merchant: "Noon", amount: 156, method: "Card" },
    { day: 27, category: "Groceries", merchant: "Waitrose", amount: 198, method: "Card" },
    { day: 28, category: "Transport", merchant: "Careem", amount: 71, method: "Apple Pay" },
    { day: 29, category: "Food", merchant: "Talabat", amount: 189, method: "Apple Pay" },
    { day: 2, category: "Entertainment", merchant: "Platinumlist", amount: 220, method: "Card" },
    { day: 4, category: "Other", merchant: "Dubai Mall", amount: 95, method: "Card" },
    { day: 6, category: "Food", merchant: "Zomato", amount: 88, method: "Apple Pay" },
    { day: 8, category: "Shopping", merchant: "IKEA", amount: 540, method: "Card" },
    { day: 9, category: "Groceries", merchant: "Lulu Hypermarket", amount: 143, method: "Card" },
    { day: 11, category: "Transport", merchant: "Uber", amount: 54, method: "Card" },
    { day: 13, category: "Food", merchant: "Talabat", amount: 167, method: "Apple Pay" },
    { day: 15, category: "Health", merchant: "Fitness First", amount: 299, method: "Card" },
    { day: 17, category: "Bills", merchant: "DEWA", amount: 412, method: "Bank Transfer" },
    { day: 19, category: "Food", merchant: "Deliveroo", amount: 102, method: "Apple Pay" },
    { day: 21, category: "Subscriptions", merchant: "Netflix", amount: 39.99, method: "Card" },
    { day: 23, category: "Groceries", merchant: "Carrefour", amount: 312, method: "Card" },
    { day: 25, category: "Transport", merchant: "Careem", amount: 41, method: "Apple Pay" },
    { day: 27, category: "Shopping", merchant: "Amazon.ae", amount: 275, method: "Card" },
    { day: 28, category: "Food", merchant: "Starbucks", amount: 46, method: "Apple Pay" },
    { day: 29, category: "Travel", merchant: "Emirates", amount: 1850, method: "Card" },
    { day: 1, category: "Other", merchant: "Mashreq ATM", amount: 200, method: "Cash" },
    { day: 3, category: "Entertainment", merchant: "VOX Cinemas", amount: 88, method: "Card" },
    { day: 5, category: "Food", merchant: "Paul Bakery", amount: 64, method: "Apple Pay" },
    { day: 7, category: "Groceries", merchant: "Spinneys", amount: 156, method: "Card" },
    { day: 9, category: "Bills", merchant: "Etisalat", amount: 219, method: "Bank Transfer" },
    { day: 12, category: "Food", merchant: "Talabat", amount: 145, method: "Apple Pay" },
    { day: 16, category: "Transport", merchant: "ENOC", amount: 142, method: "Card" },
    { day: 18, category: "Shopping", merchant: "Noon", amount: 98, method: "Card" },
    { day: 20, category: "Subscriptions", merchant: "Spotify", amount: 19.99, method: "Card" },
    { day: 22, category: "Food", merchant: "Zomato", amount: 118, method: "Apple Pay" },
    { day: 24, category: "Health", merchant: "Life Pharmacy", amount: 62, method: "Card" },
    { day: 26, category: "Groceries", merchant: "Carrefour", amount: 228, method: "Card" },
    { day: 30, category: "Travel", merchant: "Airbnb", amount: 680, method: "Card" },
  ];

  const end = new Date("2026-05-14");
  return seeds.slice(0, 60).map((s, i) => {
    const date = new Date(end);
    date.setDate(end.getDate() - s.day);
    return {
      id: `tx-${String(i + 1).padStart(3, "0")}`,
      date: formatDate(date),
      merchant: s.merchant,
      category: s.category,
      amount: s.amount,
      method: s.method,
    };
  });
}

export const mockTransactions = generateDeterministicTransactions();

const BUDGET_CAPS: Record<TransactionCategory, number> = {
  Food: 1500,
  Groceries: 800,
  Transport: 400,
  Shopping: 1000,
  Bills: 1200,
  Subscriptions: 300,
  Entertainment: 500,
  Health: 400,
  Travel: 1500,
  Other: 200,
};

function sumByCategory(txs: MockTransaction[]): Record<TransactionCategory, number> {
  const totals = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<
    TransactionCategory,
    number
  >;
  for (const tx of txs) {
    totals[tx.category] = Math.round((totals[tx.category] + tx.amount) * 100) / 100;
  }
  return totals;
}

const categorySpent = sumByCategory(mockTransactions);

export const mockBudgets: MockBudget[] = CATEGORIES.filter(
  (c) => BUDGET_CAPS[c] > 0
).map((category) => ({
  category,
  budget: BUDGET_CAPS[category],
  spent: categorySpent[category],
}));

export const mockGoals: MockGoal[] = [
  {
    id: "goal-1",
    name: "Emergency Fund",
    target: 10000,
    current: 4200,
    deadline: "2026-12-31",
    color: "#00E0B8",
  },
  {
    id: "goal-2",
    name: "Travel — Bali",
    target: 6000,
    current: 1850,
    deadline: "2027-03-01",
    color: "#5BFFCC",
  },
  {
    id: "goal-3",
    name: "iPhone 17 Pro",
    target: 4800,
    current: 900,
    deadline: "2026-09-15",
    color: "#D4AF37",
  },
];

export const mockSubscriptions: MockSubscription[] = [
  {
    id: "sub-1",
    name: "Netflix",
    amount: 39.99,
    lastUsed: "2026-05-10",
    category: "Entertainment",
    status: "active",
  },
  {
    id: "sub-2",
    name: "Spotify",
    amount: 19.99,
    lastUsed: "2026-05-12",
    category: "Entertainment",
    status: "active",
  },
  {
    id: "sub-3",
    name: "Adobe Creative Cloud",
    amount: 89.99,
    lastUsed: "Not used in 47 days",
    category: "Productivity",
    status: "active",
  },
  {
    id: "sub-4",
    name: "iCloud+",
    amount: 12.99,
    lastUsed: "2026-05-08",
    category: "Cloud",
    status: "active",
  },
  {
    id: "sub-5",
    name: "Amazon Prime",
    amount: 140,
    lastUsed: "Not used in 62 days",
    category: "Shopping",
    status: "active",
  },
  {
    id: "sub-6",
    name: "Fitness First",
    amount: 299,
    lastUsed: "2026-05-11",
    category: "Health",
    status: "active",
  },
  {
    id: "sub-7",
    name: "Du Home Internet",
    amount: 349,
    lastUsed: "2026-05-01",
    category: "Bills",
    status: "active",
  },
  {
    id: "sub-8",
    name: "Canva Pro",
    amount: 45,
    lastUsed: "Not used in 31 days",
    category: "Productivity",
    status: "paused",
  },
];

export function deriveRoundUps(txs: MockTransaction[]): MockRoundUp[] {
  return txs
    .filter((tx) => tx.amount > 0 && tx.amount % 10 !== 0)
    .map((tx) => {
      const roundedAmount = Math.ceil(tx.amount / 10) * 10;
      return {
        transactionId: tx.id,
        date: tx.date,
        merchant: tx.merchant,
        originalAmount: tx.amount,
        roundedAmount,
        roundUp: Math.round((roundedAmount - tx.amount) * 100) / 100,
      };
    });
}

export const mockRoundUps = deriveRoundUps(mockTransactions);

export const mockRoundUpTotal = Math.round(
  mockRoundUps.reduce((sum, r) => sum + r.roundUp, 0) * 100
) / 100;

export const mockInsights: MockInsight[] = [
  {
    id: "ins-1",
    title: "Food spending is 18% over budget",
    body: "You've spent AED 1,770 on Food against a AED 1,500 cap — mostly Talabat and Deliveroo. Cutting two delivery orders per week could save ~AED 280/month.",
    severity: "warning",
  },
  {
    id: "ins-2",
    title: "3 subscriptions unused this month",
    body: "Adobe CC, Amazon Prime, and Canva Pro haven't been used recently. Pausing them frees up AED 274.99/month without affecting your day-to-day.",
    severity: "critical",
  },
  {
    id: "ins-3",
    title: "Emergency Fund is 42% complete",
    body: "You're at AED 4,200 of AED 10,000. At your current round-up pace (AED " +
      mockRoundUpTotal +
      "/month), redirecting unused sub savings gets you there 2 months sooner.",
    severity: "positive",
  },
  {
    id: "ins-4",
    title: "Transport under budget",
    body: "Careem and Uber total AED " +
      categorySpent.Transport +
      " against AED 400 budgeted — you're on track with AED " +
      (400 - categorySpent.Transport).toFixed(0) +
      " remaining.",
    severity: "info",
  },
  {
    id: "ins-5",
    title: "Bali goal needs a boost",
    body: "Travel — Bali is at AED 1,850 / AED 6,000. Shifting AED 200/month from Shopping would hit your March 2027 deadline comfortably.",
    severity: "info",
  },
];

export const mockCircles: MockCircle[] = [
  {
    id: "circle-1",
    name: "Dubai Trip Fund",
    members: [
      { name: "Rohith S", initials: "RS", contributed: 1500 },
      { name: "Aisha K", initials: "AK", contributed: 1500 },
      { name: "Omar H", initials: "OH", contributed: 1500 },
    ],
    monthlyContribution: 500,
    totalSaved: 4500,
    target: 12000,
    contributionHistory: [
      { id: "ch-1", memberName: "Rohith S", amount: 500, date: "2026-05-01" },
      { id: "ch-2", memberName: "Aisha K", amount: 500, date: "2026-05-01" },
      { id: "ch-3", memberName: "Omar H", amount: 500, date: "2026-05-01" },
      { id: "ch-4", memberName: "Rohith S", amount: 500, date: "2026-04-01" },
      { id: "ch-5", memberName: "Aisha K", amount: 500, date: "2026-04-01" },
    ],
    payoutSchedule: [
      {
        id: "po-1",
        label: "Hotel deposit",
        date: "2026-11-15",
        amount: 4000,
        status: "scheduled",
      },
      {
        id: "po-2",
        label: "Flights",
        date: "2026-12-01",
        amount: 5500,
        status: "scheduled",
      },
    ],
  },
  {
    id: "circle-2",
    name: "Emergency Pool",
    members: [
      { name: "Rohith S", initials: "RS", contributed: 1050 },
      { name: "Layla M", initials: "LM", contributed: 1050 },
    ],
    monthlyContribution: 300,
    totalSaved: 2100,
    target: 6000,
    contributionHistory: [
      { id: "ch-6", memberName: "Rohith S", amount: 300, date: "2026-05-01" },
      { id: "ch-7", memberName: "Layla M", amount: 300, date: "2026-05-01" },
      { id: "ch-8", memberName: "Rohith S", amount: 300, date: "2026-04-01" },
    ],
    payoutSchedule: [
      {
        id: "po-3",
        label: "Reserve milestone",
        date: "2026-09-01",
        amount: 3000,
        status: "scheduled",
      },
    ],
  },
];

export const monthlySummary = {
  income: 18500,
  expenses: Math.round(mockTransactions.reduce((s, t) => s + t.amount, 0)),
  savings: 6070,
  netWorth: 142500,
  availableBalance: 12480,
};

export function buildFinancialContext(): FinancialContext {
  const topCategories = [...mockBudgets]
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5)
    .map((b) => ({
      category: b.category,
      spent: b.spent,
      budget: b.budget,
    }));

  const unusedSubscriptions = mockSubscriptions.filter((s) =>
    s.lastUsed.toLowerCase().includes("not used")
  );

  return {
    availableBalance: monthlySummary.availableBalance,
    monthlyIncome: monthlySummary.income,
    monthlyExpenses: monthlySummary.expenses,
    topCategories,
    goals: mockGoals,
    unusedSubscriptions,
    roundUpTotal: mockRoundUpTotal,
    insights: mockInsights,
  };
}

export function isSubscriptionUnused(sub: MockSubscription): boolean {
  return sub.lastUsed.toLowerCase().includes("not used");
}

// Legacy aliases for client store
export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "debit" | "credit";
  merchant?: string;
}

export type BudgetPeriod = "weekly" | "monthly";

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  icon: string;
  period?: BudgetPeriod;
}

export interface BudgetMonthSnapshot {
  month: string;
  budget: number;
  actual: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
  monthlyContribution: number;
  paused: boolean;
}

export type RoundUpNearest = 1 | 5 | 10;

export interface YearSavingsBreakdown {
  total: number;
  roundUps: number;
  autoSave: number;
  manual: number;
}

export const savingsYearBreakdown: YearSavingsBreakdown = {
  total: 1847,
  roundUps: 412,
  autoSave: 1200,
  manual: 235,
};

export type SubscriptionStatus =
  | "active"
  | "unused"
  | "trial"
  | "negotiable";

export interface SubscriptionAlternative {
  name: string;
  price: number;
}

export interface Subscription {
  id: string;
  name: string;
  plan: string;
  amount: number;
  billingCycle: "monthly" | "yearly";
  nextBilling: string;
  category: string;
  lastUsed: string;
  status: SubscriptionStatus;
  logoColor: string;
  active: boolean;
  snoozed: boolean;
  customerMonths: number;
  competitor?: string;
  competitorPrice?: number;
  alternatives?: SubscriptionAlternative[];
}

export const BUDGET_ICONS: Record<string, string> = {
  Food: "utensils",
  Groceries: "shopping-cart",
  Transport: "car",
  Shopping: "bag",
  Bills: "file-text",
  Subscriptions: "repeat",
  Entertainment: "tv",
  Health: "heart",
  Travel: "plane",
  Other: "circle",
};

export const transactions: Transaction[] = mockTransactions.map((t) => ({
  id: t.id,
  date: t.date,
  description: t.merchant,
  category: t.category,
  amount: -t.amount,
  type: "debit" as const,
  merchant: t.merchant,
}));

export const budgetCategories: BudgetCategory[] = mockBudgets.map((b, i) => ({
  id: `b-${i + 1}`,
  name: b.category,
  allocated: b.budget,
  spent: b.spent,
  icon: BUDGET_ICONS[b.category] ?? "circle",
  period: "monthly" as const,
}));

export const TRANSACTION_CATEGORIES = CATEGORIES;

export function getBudgetVsActualHistory(
  budgets: Pick<BudgetCategory, "allocated" | "spent">[]
): BudgetMonthSnapshot[] {
  const totalBudget = budgets.reduce((s, b) => s + b.allocated, 0);
  const mayActual = budgets.reduce((s, b) => s + b.spent, 0);
  return [
    { month: "Mar", budget: totalBudget, actual: Math.round(totalBudget * 0.91) },
    { month: "Apr", budget: totalBudget, actual: Math.round(totalBudget * 1.03) },
    { month: "May", budget: totalBudget, actual: mayActual },
  ];
}

export const savingsGoals: SavingsGoal[] = mockGoals.map((g, i) => ({
  ...g,
  monthlyContribution: [400, 250, 350][i] ?? 200,
  paused: false,
}));
function deriveSubStatus(
  lastUsed: string,
  name: string
): SubscriptionStatus {
  if (lastUsed.toLowerCase().includes("not used")) return "unused";
  if (name === "iCloud+") return "trial";
  if (
    ["Netflix", "Spotify", "Du Home Internet", "Fitness First"].includes(name)
  ) {
    return "negotiable";
  }
  return "active";
}

const SUB_PLANS: Record<string, string> = {
  Netflix: "Standard",
  Spotify: "Premium",
  "Adobe Creative Cloud": "All Apps",
  "iCloud+": "50 GB",
  "Amazon Prime": "Annual",
  "Fitness First": "Gold",
  "Du Home Internet": "Home Ultra",
  "Canva Pro": "Pro",
};

const SUB_COLORS: Record<string, string> = {
  Netflix: "#E50914",
  Spotify: "#1DB954",
  "Adobe Creative Cloud": "#FF0000",
  "iCloud+": "#007AFF",
  "Amazon Prime": "#FF9900",
  "Fitness First": "#00E0B8",
  "Du Home Internet": "#00A0D2",
  "Canva Pro": "#00C4CC",
};

const SUB_ALTERNATIVES: Record<string, SubscriptionAlternative[]> = {
  Netflix: [
    { name: "Shahid", price: 19 },
    { name: "OSN+", price: 35 },
  ],
  Spotify: [
    { name: "Anghami", price: 15 },
    { name: "Apple Music", price: 19.99 },
  ],
  "Du Home Internet": [
    { name: "Etisalat eLife", price: 299 },
    { name: "Virgin Mobile Home", price: 279 },
  ],
  "Fitness First": [
    { name: "GymNation", price: 199 },
    { name: "Fitness 360", price: 229 },
  ],
  "Adobe Creative Cloud": [
    { name: "Affinity V2", price: 0 },
    { name: "Canva Pro", price: 45 },
  ],
};

export const subscriptions: Subscription[] = mockSubscriptions.map((s) => ({
  id: s.id,
  name: s.name,
  plan: SUB_PLANS[s.name] ?? "Standard",
  amount: s.amount,
  billingCycle: "monthly" as const,
  nextBilling: "2026-06-01",
  category: s.category,
  lastUsed: s.lastUsed,
  status: deriveSubStatus(s.lastUsed, s.name),
  logoColor: SUB_COLORS[s.name] ?? "#6366F1",
  active: s.status === "active",
  snoozed: s.status === "paused",
  customerMonths:
    s.name === "Netflix"
      ? 14
      : s.name === "Du Home Internet"
        ? 22
        : s.name === "Spotify"
          ? 9
          : 6,
  competitor:
    s.name === "Netflix"
      ? "Shahid"
      : s.name === "Spotify"
        ? "Anghami"
        : s.name === "Du Home Internet"
          ? "Etisalat eLife"
          : undefined,
  competitorPrice:
    s.name === "Netflix"
      ? 19
      : s.name === "Spotify"
        ? 15
        : s.name === "Du Home Internet"
          ? 299
          : undefined,
  alternatives: SUB_ALTERNATIVES[s.name],
}));
