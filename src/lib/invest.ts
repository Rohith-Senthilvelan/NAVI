export type RiskProfile = "conservative" | "balanced" | "aggressive";

export interface ProfilerQuestion {
  id: string;
  question: string;
  options: { label: string; score: number }[];
}

export interface AssetMixSlice {
  name: string;
  value: number;
  color: string;
}

export interface AssetClassDetail {
  id: string;
  name: string;
  pros: string[];
  cons: string[];
}

export interface PortfolioInstrument {
  ticker: string;
  name: string;
  allocation: number;
  returnRange: string;
  risk: "Low" | "Medium" | "High";
}

export interface LearnLesson {
  id: string;
  title: string;
  subtitle: string;
  readMinutes: number;
  body: string;
}

export const PROFILER_QUESTIONS: ProfilerQuestion[] = [
  {
    id: "horizon",
    question: "How long can you keep this money invested?",
    options: [
      { label: "Under 2 years", score: 0 },
      { label: "2–5 years", score: 1 },
      { label: "5–10 years", score: 2 },
      { label: "10+ years", score: 3 },
    ],
  },
  {
    id: "drawdown",
    question: "If your portfolio dropped 20% in a month, you would…",
    options: [
      { label: "Sell to stop losses", score: 0 },
      { label: "Reduce risk exposure", score: 1 },
      { label: "Hold and wait", score: 2 },
      { label: "Invest more while prices are lower", score: 3 },
    ],
  },
  {
    id: "income",
    question: "How stable is your monthly income?",
    options: [
      { label: "Highly variable", score: 0 },
      { label: "Mostly stable", score: 1 },
      { label: "Very stable salary", score: 2 },
    ],
  },
  {
    id: "experience",
    question: "What's your investing experience?",
    options: [
      { label: "Just getting started", score: 0 },
      { label: "Savings & fixed deposits", score: 1 },
      { label: "ETFs or mutual funds", score: 2 },
      { label: "Active stocks & alternatives", score: 3 },
    ],
  },
  {
    id: "goal",
    question: "What's your primary goal?",
    options: [
      { label: "Preserve capital", score: 0 },
      { label: "Steady, low-drama growth", score: 1 },
      { label: "Beat inflation over time", score: 2 },
      { label: "Maximum long-term growth", score: 3 },
    ],
  },
];

export function scoreToProfile(total: number): RiskProfile {
  if (total <= 5) return "conservative";
  if (total <= 10) return "balanced";
  return "aggressive";
}

const PROFILE_LABELS: Record<RiskProfile, string> = {
  conservative: "Conservative",
  balanced: "Balanced",
  aggressive: "Aggressive",
};

export function getProfileLabel(profile: RiskProfile) {
  return PROFILE_LABELS[profile];
}

export function getProfileExplanation(profile: RiskProfile): string {
  const explanations: Record<RiskProfile, string> = {
    conservative:
      "You prefer stability over excitement. Navi suggests keeping more in bonds and cash so a market wobble doesn't derail near-term plans — growth still happens, just gently.",
    balanced:
      "You're comfortable with some ups and downs for better long-term returns. A mix of global index funds, bonds, and a slice of UAE equities fits how you think about money.",
    aggressive:
      "You have time and temperament to ride volatility. Navi tilts toward equities — especially diversified index ETFs and UAE growth — with a thin cushion of cash for opportunities.",
  };
  return explanations[profile];
}

const MIXES: Record<RiskProfile, AssetMixSlice[]> = {
  conservative: [
    { name: "Bonds", value: 40, color: "#6366F1" },
    { name: "Cash", value: 30, color: "#64748B" },
    { name: "Index ETFs", value: 20, color: "#6E56FF" },
    { name: "UAE Equities", value: 10, color: "#F5C453" },
  ],
  balanced: [
    { name: "Index ETFs", value: 50, color: "#6E56FF" },
    { name: "Bonds", value: 25, color: "#6366F1" },
    { name: "UAE Equities", value: 15, color: "#F5C453" },
    { name: "Cash", value: 10, color: "#64748B" },
  ],
  aggressive: [
    { name: "Index ETFs", value: 55, color: "#6E56FF" },
    { name: "UAE Equities", value: 30, color: "#F5C453" },
    { name: "Bonds", value: 10, color: "#6366F1" },
    { name: "Cash", value: 5, color: "#64748B" },
  ],
};

export function getSuggestedMix(profile: RiskProfile) {
  return MIXES[profile];
}

export const ASSET_CLASS_DETAILS: AssetClassDetail[] = [
  {
    id: "etfs",
    name: "Index ETFs",
    pros: [
      "Instant diversification across hundreds of companies",
      "Low fees compared to active funds",
      "Easy to buy on UAE platforms like Sarwa or international brokers",
    ],
    cons: [
      "Still moves with global markets — not risk-free",
      "Currency exposure if denominated in USD",
      "Doesn't beat the market; it tracks it",
    ],
  },
  {
    id: "bonds",
    name: "Bonds",
    pros: [
      "Smoother ride when stocks fall",
      "Predictable income from coupons",
      "Useful ballast for conservative portfolios",
    ],
    cons: [
      "Lower long-term returns than equities",
      "Sensitive to interest-rate changes",
      "Inflation can erode real purchasing power",
    ],
  },
  {
    id: "uae",
    name: "UAE Equities",
    pros: [
      "Home-market exposure in AED",
      "Dividend culture on ADX / DFM names",
      "Potential tailwinds from regional growth",
    ],
    cons: [
      "Concentrated in banks, real estate, and telecom",
      "Less diversified than global indices",
      "Liquidity varies by stock",
    ],
  },
  {
    id: "cash",
    name: "Cash",
    pros: [
      "Zero volatility — AED is ready when you need it",
      "Dry powder for dips or emergencies",
      "High-yield savings can earn 4–5% in UAE",
    ],
    cons: [
      "Historically loses to inflation over decades",
      "Opportunity cost when markets rally",
      "Not a wealth-building engine on its own",
    ],
  },
];

const PORTFOLIOS: Record<RiskProfile, PortfolioInstrument[]> = {
  conservative: [
    { ticker: "VFITX", name: "Vanguard Short-Term Bond", allocation: 25, returnRange: "3–5%", risk: "Low" },
    { ticker: "SUKUK", name: "UAE Government Sukuk ETF", allocation: 15, returnRange: "4–6%", risk: "Low" },
    { ticker: "IWDA", name: "iShares MSCI World", allocation: 15, returnRange: "6–8%", risk: "Medium" },
    { ticker: "FAB", name: "First Abu Dhabi Bank", allocation: 8, returnRange: "5–7%", risk: "Medium" },
    { ticker: "EMIRATESNBD", name: "Emirates NBD", allocation: 7, returnRange: "5–8%", risk: "Medium" },
    { ticker: "CASH-AED", name: "AED High-Yield Savings", allocation: 30, returnRange: "4–5%", risk: "Low" },
  ],
  balanced: [
    { ticker: "VWRA", name: "Vanguard FTSE All-World", allocation: 35, returnRange: "7–9%", risk: "Medium" },
    { ticker: "AGGU", name: "iShares Global Aggregate Bond", allocation: 20, returnRange: "4–6%", risk: "Low" },
    { ticker: "ADX:EMAAR", name: "Emaar Properties", allocation: 8, returnRange: "6–10%", risk: "Medium" },
    { ticker: "ADX:FAB", name: "First Abu Dhabi Bank", allocation: 7, returnRange: "5–8%", risk: "Medium" },
    { ticker: "S&P500", name: "SPDR S&P 500 ETF", allocation: 15, returnRange: "8–10%", risk: "Medium" },
    { ticker: "CASH-AED", name: "AED Money Market", allocation: 15, returnRange: "4–5%", risk: "Low" },
  ],
  aggressive: [
    { ticker: "VWCE", name: "Vanguard FTSE All-World", allocation: 30, returnRange: "8–11%", risk: "High" },
    { ticker: "QQQ", name: "Invesco QQQ Trust", allocation: 15, returnRange: "10–14%", risk: "High" },
    { ticker: "ADX:ALDAR", name: "Aldar Properties", allocation: 12, returnRange: "8–14%", risk: "High" },
    { ticker: "ADX:TAQA", name: "TAQA", allocation: 10, returnRange: "7–12%", risk: "High" },
    { ticker: "EM", name: "iShares MSCI Emerging Markets", allocation: 8, returnRange: "7–11%", risk: "High" },
    { ticker: "CASH-AED", name: "AED Liquidity Buffer", allocation: 5, returnRange: "4–5%", risk: "Low" },
  ],
};

export function getSamplePortfolio(profile: RiskProfile) {
  return PORTFOLIOS[profile];
}

export const LEARN_LESSONS: LearnLesson[] = [
  {
    id: "compounding",
    title: "Compounding",
    subtitle: "Why time is your superpower",
    readMinutes: 3,
    body: `Here's the thing about compounding — it's boring until it isn't. When you reinvest returns, your money starts earning on itself. AED 1,000/month at 7% becomes roughly AED 520,000 in 20 years, even if you never increase contributions. The first decade feels slow; the second decade feels like a slope. Navi's tip: start with whatever you can automate on payday, then raise it 1% each year. You won't feel the pinch, but your future self will feel the difference. Compounding rewards patience more than brilliance — and in the UAE, where many of us are building from scratch, patience is the one asset nobody can tax away.`,
  },
  {
    id: "etfs",
    title: "ETFs vs Stocks",
    subtitle: "Diversification without the homework",
    readMinutes: 4,
    body: `Picking individual stocks is fun — until one earnings miss wipes out a month of savings. ETFs bundle hundreds of companies into one ticker, so you're not betting on a single CEO's mood. For most people in Dubai, a global ETF like VWRA or IWDA plus a UAE slice is enough equity exposure for years. Single stocks make sense when you understand the business and can tolerate a 40% drawdown. Navi generally suggests ETFs as the engine and stocks as optional satellite positions — never the whole car. Fees matter too: 0.2% vs 1.5% over 30 years is literally a holiday home. Keep it simple, keep costs low, and let the market do the heavy lifting while you focus on earning more AED.`,
  },
  {
    id: "uae-tax",
    title: "UAE Tax Basics",
    subtitle: "What expats actually owe",
    readMinutes: 3,
    body: `Good news first: the UAE has no personal income tax on salary for most residents. That means your investable surplus is higher than friends in London or Mumbai — use that edge. Corporate tax (9% on profits above AED 375k) applies to businesses, not your paycheck. VAT at 5% is real but indirect. If you're American or from a country with citizenship-based tax, home-country rules may still apply — Navi can't replace a cross-border accountant, but we flag it early. For UAE residents investing via local platforms, there's typically no capital gains tax on listed equities. Inheritance and estate planning are the gaps worth discussing with a licensed adviser once your portfolio crosses meaningful thresholds.`,
  },
  {
    id: "sharia",
    title: "Sharia-Compliant Options",
    subtitle: "Ethical screens that still grow",
    readMinutes: 4,
    body: `Sharia-compliant investing excludes interest-based income, excessive debt, and certain industries like alcohol and gambling. In practice that means sukuk instead of conventional bonds, and equity funds that pass Sharia screens — many UAE banks offer these. Returns won't mirror a full global index because the universe is smaller, but plenty of compliant funds have kept pace over long periods. Platforms like Sarwa Sharia portfolios or bank-managed funds make this accessible without building your own filter. Navi's role is educational: understand what you're excluding and why, then check that a fund's certification matches your standards. Ethical alignment and diversification can coexist — you don't have to choose between values and a plan.`,
  },
];
