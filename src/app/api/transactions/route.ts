import { NextRequest, NextResponse } from "next/server";
import { mockTransactions } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let results = [...mockTransactions];

  if (category) {
    results = results.filter(
      (t) => t.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (from) {
    results = results.filter((t) => t.date >= from);
  }

  if (to) {
    results = results.filter((t) => t.date <= to);
  }

  return NextResponse.json({
    transactions: results,
    total: results.length,
    totalAmount: Math.round(results.reduce((s, t) => s + t.amount, 0) * 100) / 100,
  });
}
