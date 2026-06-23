import { BookingController } from "@/controllers/booking.controller";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  try {
    return await BookingController.create(req);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 400,
      },
    );
  }
}

import { authMiddleware } from "@/middleware/auth.middleware";

export async function GET(req: Request) {
  await connectDB();
  try {
    const user = authMiddleware(req) as any;
    if (user.role !== "admin") {
      throw new Error("Only admin can view all bookings");
    }
    return BookingController.getAll(req);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 403 }
    );
  }
}
