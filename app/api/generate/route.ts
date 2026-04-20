import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Placeholder AI logic (replace with OpenAI later)
    const result = `تمت معالجة النص: ${prompt}`;

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
