import { RoomController } from "@/controllers/room.controller";
import { connectDB } from "@/lib/db";
import { authMiddleware } from "@/middleware/auth.middleware";

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await connectDB();
  try {
    const user = authMiddleware(req) as any;

    if (user.role !== "admin") {
      throw new Error("Only admin can create rooms");
    }
    return RoomController.create(req, user);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 401,
      },
    );
  }
}

export async function GET() {
  await connectDB();
  return RoomController.getAllRooms();
}
