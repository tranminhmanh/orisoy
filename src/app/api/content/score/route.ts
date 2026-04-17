import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ message: "Calculate dual SEO and GEO content score", data: body });
}
