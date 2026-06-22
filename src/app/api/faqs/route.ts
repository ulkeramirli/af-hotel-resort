import { FaqController } from "@/controllers/faq.controller";
import { connectDB } from "@/lib/db";
import { authMiddleware } from "@/middleware/auth.middleware";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  return FaqController.getAll();
}
export async function POST(req: Request) {
  await connectDB();
  try {
    const user = authMiddleware(req) as any;
    if (user.role !== "admin") {
      throw new Error("Only admin create FAQ");
    }
    return FaqController.create(req);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 403,
      },
    );
  }
}
