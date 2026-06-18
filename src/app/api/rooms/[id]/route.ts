import { RoomController } from "@/controllers/room.controller";
import { connectDB } from "@/lib/db";
import { authMiddleware } from "@/middleware/auth.middleware";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  return RoomController.getById(id);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const user = authMiddleware(req);
  if (user.role !== "admin") {
    return NextResponse.json(
      {
        success: false,
        message: "Only admin can update ",
      },
      {
        status: 403,
      },
    );
  }
  const body = await req.json();
  const { id } = await params;
  return RoomController.update(id, body);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const user = authMiddleware(req);
  if (user.role !== "admin") {
    return NextResponse.json(
      {
        success: false,
        message: "Only admin can delete room",
      },
      {
        status: 403,
      },
    );
  }
  const { id } = await params;
  return RoomController.delete(id);
}
