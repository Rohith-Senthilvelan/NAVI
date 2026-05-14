import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  BudgetCategory,
  BudgetPeriod,
  MockCircle,
  RoundUpNearest,
  SavingsGoal,
  Subscription,
  Transaction,
  YearSavingsBreakdown,
} from "./mock-data";
import {
  BUDGET_ICONS,
  budgetCategories,
  mockCircles,
  savingsGoals,
  savingsYearBreakdown,
  subscriptions,
  transactions,
} from "./mock-data";

import type { RiskProfile } from "./invest";

export interface AdvisorActionCard {
  id: string;
  title: string;
  type: "move" | "cancel" | "save" | "generic";
  amount?: number;
  executed?: boolean;
}

export interface AdvisorMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  actionCard?: AdvisorActionCard;
}

export interface PastConversation {
  id: string;
  title: string;
  preview: string;
}

interface UserState {
  name: string;
  email: string;
  phone: string;
  initials: string;
  isOnboarded: boolean;
  riskProfile: RiskProfile | null;
  currency: string;
  language: "en" | "ar";
  notifications: {
    budgetAlerts: boolean;
    savingsMilestones: boolean;
    subscriptionReminders: boolean;
    weeklyDigest: boolean;
    marketing: boolean;
  };
  billingPlan: "free" | "plus" | "business";
  setUser: (name: string, email: string, initials?: string) => void;
  setPhone: (phone: string) => void;
  setCurrency: (currency: string) => void;
  setLanguage: (language: "en" | "ar") => void;
  setNotification: (key: keyof UserState["notifications"], value: boolean) => void;
  setBillingPlan: (plan: UserState["billingPlan"]) => void;
  setOnboarded: (value: boolean) => void;
  setRiskProfile: (profile: RiskProfile) => void;
  clearRiskProfile: () => void;
}

export interface ToastItem {
  id: string;
  message: string;
  variant?: "default" | "success" | "error";
}

interface ToastState {
  toasts: ToastItem[];
  toast: (message: string, variant?: ToastItem["variant"]) => void;
  dismissToast: (id: string) => void;
}

interface UIState {
  sidebarOpen: boolean;
  advisorDrawerOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setAdvisorDrawerOpen: (open: boolean) => void;
  toggleAdvisorDrawer: () => void;
}

interface AdvisorState {
  messages: AdvisorMessage[];
  isLoading: boolean;
  activeConversationId: string;
  addMessage: (
    role: "user" | "assistant",
    content: string,
    actionCard?: AdvisorActionCard
  ) => string;
  updateMessageContent: (id: string, content: string) => void;
  appendToMessage: (id: string, chunk: string) => void;
  finalizeAssistantMessage: (id: string, content: string) => void;
  setMessageActionExecuted: (messageId: string) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  loadConversation: (id: string) => void;
}

export interface RebalanceFix {
  id: string;
  label: string;
  type: "reduce" | "move" | "increase";
  sourceCategoryId?: string;
  targetCategoryId: string;
  amount: number;
  maxAmount: number;
}

interface FinanceState {
  budgets: BudgetCategory[];
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  subscriptions: Subscription[];
  budgetViewPeriod: BudgetPeriod;
  autoRebalance: boolean;
  roundUpEnabled: boolean;
  roundUpNearest: RoundUpNearest;
  yearSavings: YearSavingsBreakdown;
  updateGoalProgress: (id: string, amount: number) => void;
  toggleSubscription: (id: string) => void;
  cancelSubscription: (id: string) => void;
  snoozeSubscription: (id: string) => void;
  setBudgetViewPeriod: (period: BudgetPeriod) => void;
  setAutoRebalance: (enabled: boolean) => void;
  addBudget: (name: string, allocated: number, period: BudgetPeriod) => void;
  applyRebalanceFix: (fix: RebalanceFix) => void;
  setRoundUpEnabled: (enabled: boolean) => void;
  setRoundUpNearest: (nearest: RoundUpNearest) => void;
  addGoal: (
    goal: Omit<SavingsGoal, "id" | "current" | "paused"> & { current?: number }
  ) => void;
  updateGoal: (id: string, patch: Partial<SavingsGoal>) => void;
  pauseGoal: (id: string) => void;
  deleteGoal: (id: string) => void;
  boostGoal: (id: string, amount: number) => void;
  circles: MockCircle[];
  addCircle: (
    circle: Omit<MockCircle, "id" | "totalSaved" | "contributionHistory" | "payoutSchedule"> & {
      inviteEmails?: string[];
    }
  ) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  toast: (message, variant = "default") => {
    const id = crypto.randomUUID();
    set((s) => ({
      toasts: [...s.toasts, { id, message, variant }],
    }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  dismissToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: "Rohith S",
      email: "user@navi.demo",
      phone: "+971 50 123 4567",
      initials: "RS",
      isOnboarded: false,
      riskProfile: null,
      currency: "AED",
      language: "en",
      notifications: {
        budgetAlerts: true,
        savingsMilestones: true,
        subscriptionReminders: true,
        weeklyDigest: false,
        marketing: false,
      },
      billingPlan: "plus",
      setUser: (name, email, initials) =>
        set({
          name,
          email,
          initials:
            initials ??
            name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase(),
        }),
      setPhone: (phone) => set({ phone }),
      setCurrency: (currency) => set({ currency }),
      setLanguage: (language) => set({ language }),
      setNotification: (key, value) =>
        set((s) => ({
          notifications: { ...s.notifications, [key]: value },
        })),
      setBillingPlan: (billingPlan) => set({ billingPlan }),
      setOnboarded: (value) => set({ isOnboarded: value }),
      setRiskProfile: (profile) => set({ riskProfile: profile }),
      clearRiskProfile: () => set({ riskProfile: null }),
    }),
    { name: "navi-user" }
  )
);

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  advisorDrawerOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setAdvisorDrawerOpen: (open) => set({ advisorDrawerOpen: open }),
  toggleAdvisorDrawer: () =>
    set((s) => ({ advisorDrawerOpen: !s.advisorDrawerOpen })),
}));

export const PAST_CONVERSATIONS: PastConversation[] = [
  {
    id: "weekly-review",
    title: "Weekly review",
    preview: "How am I doing on budget?",
  },
  {
    id: "bali-planning",
    title: "Bali planning",
    preview: "Can I afford the trip?",
  },
  {
    id: "cancel-netflix",
    title: "Cancel Netflix",
    preview: "Pause unused subscriptions",
  },
];

function parseActionCard(content: string): AdvisorActionCard | undefined {
  const actionMatch = content.match(/\*\*Action:\*\*\s*([^.]+(?:\.[^*]*)?)/i);
  if (!actionMatch) return undefined;

  const actionText = actionMatch[1].trim();
  const amountMatch = actionText.match(/AED\s*([\d,]+)/i);
  const amount = amountMatch
    ? Number(amountMatch[1].replace(/,/g, ""))
    : undefined;

  if (/move|reallocat|transfer/i.test(actionText)) {
    return {
      id: crypto.randomUUID(),
      title: actionText,
      type: "move",
      amount: amount ?? 200,
    };
  }
  if (/pause|cancel/i.test(actionText)) {
    return {
      id: crypto.randomUUID(),
      title: actionText,
      type: "cancel",
    };
  }
  if (/save|transfer|auto/i.test(actionText)) {
    return {
      id: crypto.randomUUID(),
      title: actionText,
      type: "save",
      amount,
    };
  }

  return {
    id: crypto.randomUUID(),
    title: actionText,
    type: "generic",
    amount,
  };
}

const WELCOME_MESSAGE: AdvisorMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi Rohith — I'm Navi. Ask me anything about your money, goals, or subscriptions.",
};

const MOCK_CONVERSATION_MESSAGES: Record<string, AdvisorMessage[]> = {
  "weekly-review": [
    WELCOME_MESSAGE,
    {
      id: "wr-u",
      role: "user",
      content: "How am I doing on my budget this week?",
    },
    {
      id: "wr-a",
      role: "assistant",
      content:
        "Food is running 18% over cap, but Transport has headroom. You're net-positive if you skip two delivery orders. **Action:** Move AED 150 from Entertainment to Food for the rest of May.",
      actionCard: {
        id: "wr-act",
        title: "Move AED 150 from Entertainment to Food",
        type: "move",
        amount: 150,
      },
    },
  ],
  "bali-planning": [
    WELCOME_MESSAGE,
    {
      id: "bp-u",
      role: "user",
      content: "Can I afford Bali in March?",
    },
    {
      id: "bp-a",
      role: "assistant",
      content:
        "Bali goal is at AED 1,850 / 6,000. With AED 500/mo redirected from Shopping, you hit target before March 2027 comfortably. **Action:** Move AED 200 from Shopping to Savings for Bali.",
      actionCard: {
        id: "bp-act",
        title: "Move AED 200 from Shopping to Bali goal",
        type: "move",
        amount: 200,
      },
    },
  ],
  "cancel-netflix": [
    WELCOME_MESSAGE,
    {
      id: "cn-u",
      role: "user",
      content: "Should I cancel Netflix?",
    },
    {
      id: "cn-a",
      role: "assistant",
      content:
        "Netflix was used 4 days ago — keep it. Adobe CC hasn't been opened in 47 days. **Action:** Pause Adobe CC and route AED 90/mo to savings.",
      actionCard: {
        id: "cn-act",
        title: "Pause Adobe CC",
        type: "cancel",
      },
    },
  ],
};

export const useAdvisorStore = create<AdvisorState>()(
  persist(
    (set) => ({
      messages: [WELCOME_MESSAGE],
      isLoading: false,
      activeConversationId: "current",
      addMessage: (role, content, actionCard) => {
        const id = crypto.randomUUID();
        const card =
          actionCard ?? (role === "assistant" ? parseActionCard(content) : undefined);
        set((s) => ({
          messages: [
            ...s.messages,
            { id, role, content, actionCard: card },
          ],
        }));
        return id;
      },
      updateMessageContent: (id, content) =>
        set((s) => ({
          messages: s.messages.map((m) =>
            m.id === id ? { ...m, content } : m
          ),
        })),
      appendToMessage: (id, chunk) =>
        set((s) => ({
          messages: s.messages.map((m) =>
            m.id === id ? { ...m, content: m.content + chunk } : m
          ),
        })),
      finalizeAssistantMessage: (id, content) =>
        set((s) => ({
          messages: s.messages.map((m) =>
            m.id === id
              ? { ...m, content, actionCard: parseActionCard(content) }
              : m
          ),
        })),
      setMessageActionExecuted: (messageId) =>
        set((s) => ({
          messages: s.messages.map((m) =>
            m.id === messageId && m.actionCard
              ? { ...m, actionCard: { ...m.actionCard, executed: true } }
              : m
          ),
        })),
      setLoading: (loading) => set({ isLoading: loading }),
      clearMessages: () =>
        set({ messages: [WELCOME_MESSAGE], activeConversationId: "current" }),
      loadConversation: (id) =>
        set({
          activeConversationId: id,
          messages: MOCK_CONVERSATION_MESSAGES[id] ?? [WELCOME_MESSAGE],
        }),
    }),
    { name: "navi-advisor-chat" }
  )
);

export const useFinanceStore = create<FinanceState>(() => ({
  budgets: budgetCategories,
  transactions,
  savingsGoals,
  subscriptions,
  budgetViewPeriod: "monthly",
  autoRebalance: false,
  roundUpEnabled: true,
  roundUpNearest: 10,
  yearSavings: savingsYearBreakdown,
  updateGoalProgress: (id, amount) =>
    useFinanceStore.setState((s) => ({
      savingsGoals: s.savingsGoals.map((g) =>
        g.id === id ? { ...g, current: g.current + amount } : g
      ),
    })),
  toggleSubscription: (id) =>
    useFinanceStore.setState((s) => ({
      subscriptions: s.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, active: !sub.active } : sub
      ),
    })),
  cancelSubscription: (id) =>
    useFinanceStore.setState((s) => ({
      subscriptions: s.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, active: false, status: "unused" as const } : sub
      ),
    })),
  snoozeSubscription: (id) =>
    useFinanceStore.setState((s) => ({
      subscriptions: s.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, snoozed: !sub.snoozed } : sub
      ),
    })),
  setBudgetViewPeriod: (period) =>
    useFinanceStore.setState({ budgetViewPeriod: period }),
  setAutoRebalance: (enabled) =>
    useFinanceStore.setState({ autoRebalance: enabled }),
  addBudget: (name, allocated, period) =>
    useFinanceStore.setState((s) => {
      const existing = s.budgets.find((b) => b.name === name);
      if (existing) {
        return {
          budgets: s.budgets.map((b) =>
            b.name === name ? { ...b, allocated, period } : b
          ),
        };
      }
      const icon = BUDGET_ICONS[name] ?? "circle";
      return {
        budgets: [
          ...s.budgets,
          {
            id: `b-${crypto.randomUUID().slice(0, 8)}`,
            name,
            allocated,
            spent: 0,
            icon,
            period,
          },
        ],
      };
    }),
  applyRebalanceFix: (fix) =>
    useFinanceStore.setState((s) => {
      const next = s.budgets.map((b) => ({ ...b }));
      const target = next.find((b) => b.id === fix.targetCategoryId);
      const source = fix.sourceCategoryId
        ? next.find((b) => b.id === fix.sourceCategoryId)
        : undefined;

      if (fix.type === "reduce" && source) {
        source.allocated = Math.max(0, source.allocated - fix.amount);
      } else if (fix.type === "move" && source && target) {
        source.allocated = Math.max(0, source.allocated - fix.amount);
        target.allocated += fix.amount;
      } else if (fix.type === "increase" && target) {
        target.allocated += fix.amount;
      } else {
        return s;
      }

      return { budgets: next };
    }),
  setRoundUpEnabled: (enabled) =>
    useFinanceStore.setState({ roundUpEnabled: enabled }),
  setRoundUpNearest: (nearest) =>
    useFinanceStore.setState({ roundUpNearest: nearest }),
  addGoal: (goal) =>
    useFinanceStore.setState((s) => ({
      savingsGoals: [
        ...s.savingsGoals,
        {
          ...goal,
          id: `goal-${crypto.randomUUID().slice(0, 8)}`,
          current: goal.current ?? 0,
          paused: false,
        },
      ],
    })),
  updateGoal: (id, patch) =>
    useFinanceStore.setState((s) => ({
      savingsGoals: s.savingsGoals.map((g) =>
        g.id === id ? { ...g, ...patch } : g
      ),
    })),
  pauseGoal: (id) =>
    useFinanceStore.setState((s) => ({
      savingsGoals: s.savingsGoals.map((g) =>
        g.id === id ? { ...g, paused: !g.paused } : g
      ),
    })),
  deleteGoal: (id) =>
    useFinanceStore.setState((s) => ({
      savingsGoals: s.savingsGoals.filter((g) => g.id !== id),
    })),
  boostGoal: (id, amount) =>
    useFinanceStore.setState((s) => ({
      savingsGoals: s.savingsGoals.map((g) =>
        g.id === id ? { ...g, current: g.current + amount } : g
      ),
      yearSavings: {
        ...s.yearSavings,
        total: s.yearSavings.total + amount,
        manual: s.yearSavings.manual + amount,
      },
    })),
  circles: mockCircles,
  addCircle: (circle) =>
    useFinanceStore.setState((s) => {
      const inviteMembers = (circle.inviteEmails ?? [])
        .filter(Boolean)
        .map((email) => ({
          name: email.split("@")[0],
          initials: email.slice(0, 2).toUpperCase(),
          contributed: 0,
        }));
      const newCircle: MockCircle = {
        id: `circle-${crypto.randomUUID().slice(0, 8)}`,
        name: circle.name,
        members: [
          { name: "Rohith S", initials: "RS", contributed: 0 },
          ...inviteMembers,
        ],
        monthlyContribution: circle.monthlyContribution,
        totalSaved: 0,
        target: circle.target,
        contributionHistory: [],
        payoutSchedule: [
          {
            id: `po-${crypto.randomUUID().slice(0, 6)}`,
            label: "Goal payout",
            date: "2026-12-31",
            amount: circle.target,
            status: "scheduled",
          },
        ],
      };
      return { circles: [...s.circles, newCircle] };
    }),
}));
