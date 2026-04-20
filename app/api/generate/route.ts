import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user || !user.isPaid) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    if (user.usageCount >= user.usageLimit) {
      return NextResponse.json({ error: "Usage limit reached" }, { status: 403 });
    }

    const body = await req.json();
    const { prompt } = body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "أنت مساعد متخصص في إنشاء محتوى عربي احترافي للتسويق والسوشيال ميديا.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    await prisma.user.update({
      where: { clerkId: userId },
      data: { usageCount: { increment: 1 } },
    });

    const result = completion.choices[0].message.content;

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
