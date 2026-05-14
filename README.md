<div align="center">

# Navi

### Money that thinks for you.

An AI-native financial coach for individuals and SMEs in the UAE — budgeting, savings, subscriptions, and investment guidance in one conversational experience.

<br />

[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI_API-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)

<br />

[**Try it**](#try-it) · [**Features**](#features) · [**Architecture**](#architecture) · [**Roadmap**](#roadmap)

</div>

---

## Overview

Most people in the Gulf manage money across several banking apps, subscription services, and informal savings goals. Information is fragmented; insight arrives too late.

**Navi** consolidates that picture into a single intelligent layer. Users see live financial KPIs, receive proactive alerts, and interact with an AI advisor that recommends concrete actions — rebalance a budget category, pause an unused subscription, or boost a savings goal — without switching contexts.

This repository is a **production-quality product prototype**: a full-stack Next.js application with a polished marketing site, authenticated dashboard, mock financial data layer, streaming AI advisor, and demo tooling built for live presentations and technical evaluation.

---

## Try it

### Demo credentials

| Field    | Value              |
| -------- | ------------------ |
| Email    | `user@navi.demo`   |
| Password | `Demo123!@#`       |

### Local setup

```bash
git clone https://github.com/Rohith-Senthilvelan/NAVI.git
cd NAVI
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign in with the credentials above, and explore the dashboard.

### Guided experiences

| Route | Purpose |
| ----- | ------- |
| `/` | Marketing landing page |
| `/login` | Authenticated entry to the product |
| `/demo` | 90-second auto-guided pitch tour (press **Space** to pause) |
| `/dashboard` | Financial command center |
| `/advisor` | Full-page AI coach |
| `/manifesto` | Product vision |

**Presenter tip:** use **Settings → Reset demo data** to restore factory mock state between walkthroughs.

---

## Features

| Module | What it does |
| ------ | ------------ |
| **Dashboard** | Balance, spend, savings, and round-up KPIs with spend breakdown and recent transactions |
| **Budget** | Category caps, vs-actual charts, rebalance suggestions, and overspend alerts |
| **Savings** | Goal tracking, round-ups, and one-tap goal boosts |
| **Insights** | Signature Digs feed — personalized spending insights with one-click actions |
| **Subscriptions** | Unused-subscription detection with pause and cancel flows |
| **Advisor** | Streaming AI financial coach with executable action cards |
| **Circles** | Group savings with contribution history and payout schedules |
| **Invest** | Risk profiler and illustrative portfolio allocation |
| **Onboarding** | Four-step first-login product tour |
| **Pitch mode** | Scripted auto-navigation for demos and investor meetings |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js 14 App Router                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Landing /    │  │ Dashboard    │  │ API Routes       │  │
│  │ Auth pages   │  │ (client UI)  │  │ /api/advisor …   │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
   Framer Motion         Zustand stores        OpenAI + Zod
   Radix UI + TW         (persisted state)     (validated AI I/O)
```

### Engineering highlights

- **App Router & TypeScript** — typed routes, server/client component split, middleware-protected dashboard
- **Zustand** — modular stores for user preferences, finance data, advisor chat, and UI shell state
- **Lazy-loaded charts** — Recharts split per route via `next/dynamic` to keep initial bundles lean
- **AI advisor** — streaming responses through `/api/advisor` with structured context and mock fallback when no API key is set
- **Accessibility** — focus-visible rings, aria labels on interactive controls, WCAG-minded contrast tokens
- **Performance** — `next/font` with `display: swap`, `content-visibility` on landing sections, bundle analyzer via `npm run analyze`
- **Demo tooling** — seed reset, onboarding tour, and scripted pitch orchestrator for repeatable presentations

### Tech stack

| Layer | Technologies |
| ----- | ------------ |
| Framework | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS, Radix UI, Framer Motion |
| State | Zustand (localStorage persistence for user + chat) |
| Data viz | Recharts (route-level code splitting) |
| AI | OpenAI API, Zod validation |
| Fonts | Geist (local), Instrument Serif via `next/font` |
| Tooling | ESLint, `@next/bundle-analyzer` |

### Project structure

```
src/
├── app/                  # Routes (landing, dashboard, API, OG image)
├── components/
│   ├── dashboard/        # Shell, sidebar, KPI cards, navigation
│   ├── landing/          # Marketing page sections
│   ├── charts/           # Lazy-loaded Recharts modules
│   └── shared/           # Command palette, toaster, tours, pitch mode
├── lib/                  # Store, mock data, AI, insights, invest helpers
├── hooks/                # Shared React hooks
└── styles/               # Font configuration
```

---

## Product narrative

**Problem.** Fragmented accounts and reactive budgeting leave users guessing — overspend is noticed after the fact, and subscriptions quietly drain cash flow.

**Solution.** Navi acts as a always-on financial coach: it surfaces what matters, explains trade-offs in plain language, and offers one-tap fixes grounded in the user's actual numbers.

**Vision.** Become the default money layer for the Gulf — personal finance today, Arabic-first experiences, open-banking connectivity, and an SME advisor tier tomorrow.

---

## Roadmap

| Phase | Focus |
| ----- | ----- |
| **Now** | Product prototype with mock data and AI advisor |
| **Next** | Multi-bank aggregation via UAE open-banking (Lean / Tarabut) |
| **Then** | Arabic-first UI, RTL layout, Gulf-dialect advisor |
| **Later** | Business advisor — VAT, cash flow, team seats for SMEs |

---

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run analyze` | Build with bundle size report |

---

## Author

**Rohith Senthilvelan**  
[github.com/Rohith-Senthilvelan](https://github.com/Rohith-Senthilvelan)

Built as a portfolio-grade fintech product prototype demonstrating full-stack engineering, product design, and AI integration.

---

## License

This project is provided for portfolio and evaluation purposes. All rights reserved.
