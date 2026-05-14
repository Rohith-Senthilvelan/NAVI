import {
  budgetCategories,
  mockCircles,
  savingsGoals,
  savingsYearBreakdown,
  subscriptions,
  transactions,
} from "./mock-data";
import { useAdvisorStore, useFinanceStore, useUserStore } from "./store";

const DEFAULT_USER = {
  name: "Rohith S",
  email: "user@navi.demo",
  phone: "+971 50 123 4567",
  initials: "RS",
  isOnboarded: false,
  riskProfile: null,
  currency: "AED",
  language: "en" as const,
  notifications: {
    budgetAlerts: true,
    savingsMilestones: true,
    subscriptionReminders: true,
    weeklyDigest: false,
    marketing: false,
  },
  billingPlan: "plus" as const,
};

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant" as const,
  content:
    "Hi Rohith — I'm Navi. Ask me anything about your money, goals, or subscriptions.",
};

/** Re-seed all mock stores to factory defaults — ideal for live demos. */
export function resetDemoData(options?: { skipTour?: boolean }) {
  useFinanceStore.setState({
    budgets: budgetCategories,
    transactions,
    savingsGoals,
    subscriptions,
    budgetViewPeriod: "monthly",
    autoRebalance: false,
    roundUpEnabled: true,
    roundUpNearest: 10,
    yearSavings: savingsYearBreakdown,
    circles: mockCircles,
  });

  useAdvisorStore.setState({
    messages: [WELCOME_MESSAGE],
    isLoading: false,
    activeConversationId: "current",
  });

  useUserStore.setState({
    ...DEFAULT_USER,
    isOnboarded: options?.skipTour === true,
  });

  if (typeof window !== "undefined") {
    sessionStorage.removeItem("navi-pitch-active");
    sessionStorage.removeItem("navi-pitch-paused");
  }
}
