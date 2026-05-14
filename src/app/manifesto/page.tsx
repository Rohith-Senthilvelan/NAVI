import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manifesto",
  description: "The Navi philosophy — money should be clear, kind, and on your side.",
};

const SECTIONS = [
  {
    lead: "Money is emotional.",
    body: "We built Navi because spreadsheets don't understand anxiety, ambition, or the quiet guilt of an unused subscription. Your finances aren't a math problem — they're a life problem. Navi meets you there.",
  },
  {
    lead: "Clarity before complexity.",
    body: "Most apps drown you in charts. Navi starts with one honest question: what do you need to know right now? We surface the signal — budget drift, savings momentum, subscriptions bleeding out — and bury the noise.",
  },
  {
    lead: "A coach, not a judge.",
    body: "Navi doesn't shame you for delivery orders or a missed transfer. It suggests, nudges, and celebrates small wins. Financial health is a practice, not a verdict. We're in your corner for the long game.",
  },
  {
    lead: "Built for where you live.",
    body: "From AED round-ups to family circles saving for Eid travel, Navi is designed for the Gulf — bilingual, culturally fluent, and respectful of how money moves in our communities.",
  },
  {
    lead: "Your data, your control.",
    body: "Insights are computed to help you, not to sell you. Export anytime. Delete anytime. Transparency isn't a feature — it's the foundation.",
  },
];

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-primary text-text-high">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
          <Link
            href="/"
            className="text-sm font-medium text-text-mid transition-colors hover:text-accent"
          >
            ← Back to Navi
          </Link>
          <span className="text-xs uppercase tracking-widest text-accent">Manifesto</span>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
          We believe money should be{" "}
          <span className="text-accent">clear, kind, and on your side.</span>
        </h1>
        <p className="mt-8 font-display text-xl leading-relaxed text-text-mid sm:text-2xl">
          Navi is an AI financial coach for people who are tired of guessing — and ready to grow with intention.
        </p>

        <div className="mt-16 space-y-12 border-t border-white/10 pt-16">
          {SECTIONS.map((section) => (
            <section key={section.lead}>
              <h2 className="font-display text-2xl text-text-high sm:text-3xl">
                {section.lead}
              </h2>
              <p className="mt-4 font-display text-lg leading-relaxed text-text-mid">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <footer className="mt-20 border-t border-white/10 pt-10 text-center">
          <p className="font-display text-lg text-text-mid">
            Ready to start?{" "}
            <Link href="/login" className="text-accent underline-offset-4 hover:underline">
              Open Navi
            </Link>
          </p>
          <p className="mt-4 text-xs text-text-mid">© 2026 Navi. Built in the UAE.</p>
        </footer>
      </article>
    </div>
  );
}
