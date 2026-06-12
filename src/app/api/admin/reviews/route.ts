import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface ReviewPayload {
  userName: string;
  userEmail: string;
  userImage: string;
  rating: number;
  comment: string;
}

interface PrismaDynamic {
  [key: string]: {
    findMany: (args?: { orderBy?: Record<string, string> }) => Promise<unknown[]>;
    create: (args: { data: ReviewPayload }) => Promise<unknown>;
  };
}

export async function GET() {
  try {
    const dynamicPrisma = prisma as unknown as PrismaDynamic;
    const reviews = await dynamicPrisma["review"].findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(reviews, { status: 200 });
  } catch (logError) {
    console.error(logError);
    return NextResponse.json({ error: "Xəta baş verdi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userName, userEmail, userImage, rating, comment } = await request.json();
    const dynamicPrisma = prisma as unknown as PrismaDynamic;
    
    const newReview = await dynamicPrisma["review"].create({
      data: {
        userName,
        userEmail,
        userImage,
        rating: Number(rating),
        comment
      }
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (logError) {
    console.error(logError);
    return NextResponse.json({ error: "Yadda saxlamaq olmadı" }, { status: 500 });
  }
}