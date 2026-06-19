import { TicketController } from "@/controllers/ticket.controller";
import { connectDB } from "@/lib/db";
import { authMiddleware } from "@/middleware/auth.middleware";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  return TicketController.getAll();
}
export async function POST(req: Request) {
  await connectDB();
  try {
    const user = authMiddleware(req) as any;
    if (user.role !== "admin") {
      throw new Error("Only admin create ticket");
    }
    return TicketController.create(req);
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

