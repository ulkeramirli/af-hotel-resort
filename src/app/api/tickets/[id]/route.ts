import { TicketController } from "@/controllers/ticket.controller";
import { connectDB } from "@/lib/db";
import { authMiddleware } from "@/middleware/auth.middleware";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  return TicketController.getById(id);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  try {
    const user = authMiddleware(req) as any;
    if (user.role !== "admin") {
      throw new Error("Only admin can update ticket");
    }
    const { id } = await params;
    const body = await req.json();
    return TicketController.update(id, body);
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
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  try {
    const user = authMiddleware(req) as any;
    if (user.role !== "admin") {
      throw new Error("Only admin can delete ticket");
    }
    const { id } = await params;
    return TicketController.delete(id);
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
