# Navi

**The AI financial coach that thinks before you spend.**

Navi is an AI-native money app for the UAE — budgeting, savings, subscriptions, and investment guidance in one polished, conversational experience.

![Dashboard preview](docs/screenshots/dashboard.png)

> Screenshot placeholder — add captures after your next demo run.

---

## Quick start

```bash
git clone https://github.com/Rohith-Senthilvelan/NAVI.git
cd NAVI
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo credentials

| Field    | Value            |
| -------- | ---------------- |
| Email    | `user@navi.demo` |
| Password | `Demo123!@#`     |

---

## What you get

| Area | Highlights |
| ---- | ---------- |
| **Landing** | Magnetic CTAs, custom cursor, Lenis smooth scroll, pinned advisor showcase |
| **Dashboard** | KPI cards, spend breakdown, budget health, weekly recommendations |
| **Budget** | Category caps, vs-actual charts, one-tap rebalance |
| **Savings** | Goals, round-ups, boost flows |
| **Insights** | Signature Digs, heatmaps, trends |
| **Subscriptions** | Unused detection, cancel & negotiate templates |
| **Advisor** | Streaming AI coach with action cards |
| **Circles** | Group savings pots |

Guided tour: `/demo` (90 seconds, press **Space** to pause).  
Reset mock data: **Settings → Reset demo data**.

---

## Tech stack

- **Framework:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS, Framer Motion, Lenis smooth scroll
- **Charts:** Recharts
- **State:** Zustand
- **AI:** OpenAI API (advisor streaming)

---

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |

---

## Roadmap

- [ ] Live bank feeds (UAE open banking)
- [ ] SME payroll & VAT modules
- [ ] Arabic localization
- [ ] Native iOS / Android shells
- [ ] Production auth & compliance hardening

---

Built with care in the UAE.
