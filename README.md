# Navi

**Money that thinks for you.**

Navi is an AI-powered financial coach built for individuals and SMEs in the UAE. It unifies budgeting, savings, subscriptions, and investment guidance into one conversational interface — so you always know what to do next with your money, without opening five banking apps.

---

## Demo credentials

| Field    | Value            |
| -------- | ---------------- |
| Email    | `user@navi.demo` |
| Password | `Demo123!@#`     |

**Pitch mode:** visit [`/demo`](http://localhost:3000/demo) for a 90-second auto-guided tour (press **SPACE** to pause).

**Reset during a live demo:** Settings → **Reset demo data**.

---

## Quick start

```bash
npm install && npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Log in with the demo credentials above.

### Bundle analysis

```bash
npm run analyze
```

Opens an interactive bundle report after build.

---

## Tech stack

| Layer      | Tools                                              |
| ---------- | -------------------------------------------------- |
| Framework  | Next.js 14 (App Router), React 18, TypeScript      |
| Styling    | Tailwind CSS, Radix UI, Framer Motion              |
| State      | Zustand (persisted user + advisor chat)            |
| Charts     | Recharts (lazy-loaded per route)                   |
| AI         | OpenAI API (advisor route with mock fallback)    |
| Fonts      | Geist (local), Instrument Serif via `next/font`    |

---

## Features

| Feature | Description |
| ------- | ----------- |
| Dashboard | Live KPIs, spend breakdown, budget health, recent transactions |
| Budget | Category caps, rebalance suggestions, vs-actual charts |
| Savings | Goals, round-ups, one-tap boosts |
| Insights | Signature Digs feed, spending heatmap, category trends |
| Subscriptions | Unused-sub detection, pause/cancel flows |
| Advisor | Streaming AI coach with actionable cards |
| Circles | Group savings with payout schedules |
| Invest | Risk profiler + suggested allocation |
| Onboarding | 4-step first-login product tour |

### Screenshots

> _Add screenshots here before the pitch._

| Screen | Placeholder |
| ------ | ----------- |
| Landing | `![Landing](./docs/screenshots/landing.png)` |
| Dashboard | `![Dashboard](./docs/screenshots/dashboard.png)` |
| Advisor | `![Advisor](./docs/screenshots/advisor.png)` |
| Insights | `![Insights](./docs/screenshots/insights.png)` |

---

## Roadmap

- **Multi-bank aggregation** — live feeds from UAE banks via open banking
- **Real APIs** — production Plaid/Lean/Tarabut integrations, not mock data
- **Arabic-first** — RTL layout, Gulf dialect advisor, localized insights
- **Business advisor** — SME cash-flow coach, VAT reminders, team seats

---

## Pitch story

### Problem

People in the Gulf juggle multiple accounts, subscriptions, and savings goals across apps that never talk to each other. By the time they notice overspending, the month is already gone.

### Solution

Navi is a single AI coach that reads your financial picture, surfaces what matters, and proposes one-tap fixes — rebalance a budget, pause a unused sub, boost a goal.

### Demo flow

1. **Dashboard** — KPIs and spend at a glance  
2. **Ask Navi** — natural-language budget review with an action card  
3. **Budget alert** — category crossing 80% cap  
4. **Savings boost** — one-tap goal top-up  
5. **Insights feed** — personalized Signature Digs  

Run the full sequence automatically at `/demo`.

### Vision

Navi becomes the default money layer for the Gulf — personal finance today, business CFO tomorrow, Arabic-first and bank-connected at scale.

---

## License

Private — hackathon demo build.
