import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  return NextResponse.json({ message: "Get brand mentions across the web", data: [] });
}
