import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  return NextResponse.json({ message: "List generated reports", data: [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ message: "Generate a new analytics report", data: body });
}
