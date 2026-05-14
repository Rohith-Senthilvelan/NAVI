import { NextResponse } from "next/server";
import {
  mockGoals,
  mockRoundUps,
  mockRoundUpTotal,
} from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    goals: mockGoals,
    roundUps: mockRoundUps,
    roundUpTotal: mockRoundUpTotal,
    roundUpCount: mockRoundUps.length,
  });
}
