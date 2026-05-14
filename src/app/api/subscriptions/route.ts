import { NextResponse } from "next/server";
import { isSubscriptionUnused, mockSubscriptions } from "@/lib/mock-data";

export async function GET() {
  const subs = mockSubscriptions.map((sub) => ({
    ...sub,
    unused: isSubscriptionUnused(sub),
  }));

  const unusedCount = subs.filter((s) => s.unused).length;
  const monthlyTotal = subs.reduce((s, sub) => s + sub.amount, 0);
  const unusedMonthly = subs
    .filter((s) => s.unused)
    .reduce((s, sub) => s + sub.amount, 0);

  return NextResponse.json({
    subscriptions: subs,
    unusedCount,
    monthlyTotal: Math.round(monthlyTotal * 100) / 100,
    unusedMonthly: Math.round(unusedMonthly * 100) / 100,
  });
}
