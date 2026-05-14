import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BudgetCategory, SavingsGoal, Subscription, Transaction } from "./mock-data";
import {
  budgetCategories,
  savingsGoals,
  subscriptions,
  transactions,
} from "./mock-data";

export interface AdvisorMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface UserState {
  name: string;
  email: string;
  initials: string;
  isOnboarded: boolean;
  setUser: (name: string, email: string, initials?: string) => void;
  setOnboarded: (value: boolean) => void;
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
  addMessage: (role: "user" | "assistant", content: string) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

interface FinanceState {
  budgets: BudgetCategory[];
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  subscriptions: Subscription[];
  updateGoalProgress: (id: string, amount: number) => void;
  toggleSubscription: (id: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: "Rohith S",
      email: "user@navi.demo",
      initials: "RS",
      isOnboarded: true,
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
      setOnboarded: (value) => set({ isOnboarded: value }),
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

export const useAdvisorStore = create<AdvisorState>((set) => ({
  messages: [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi Rohith — I'm Navi. Ask me anything about your money, goals, or subscriptions.",
    },
  ],
  isLoading: false,
  addMessage: (role, content) =>
    set((s) => ({
      messages: [
        ...s.messages,
        { id: crypto.randomUUID(), role, content },
      ],
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  clearMessages: () => set({ messages: [] }),
}));

export const useFinanceStore = create<FinanceState>(() => ({
  budgets: budgetCategories,
  transactions,
  savingsGoals,
  subscriptions,
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
}));
