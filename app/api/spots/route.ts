import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Don't cache — counter must reflect real-time state
export const dynamic = "force-dynamic";
export const revalidate = 0;

const TOTAL_FOUNDING_SPOTS = 1000;

export async function GET() {
  try {
    // Every row is a verified signup — unconfirmed ones are never stored.
    const claimed = await prisma.signup.count();

    return NextResponse.json({
      claimed,
      total: TOTAL_FOUNDING_SPOTS,
    });
  } catch (err) {
    console.error("[spots] db error:", err);
    // Graceful fallback so the banner doesn't break the page
    return NextResponse.json(
      { claimed: 0, total: TOTAL_FOUNDING_SPOTS },
      { status: 200 }
    );
  }
}
