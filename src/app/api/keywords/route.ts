import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  return NextResponse.json({ message: "List all keywords with metrics", data: [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ message: "Create a new keyword entry", data: body });
}
