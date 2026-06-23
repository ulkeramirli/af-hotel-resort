import { BookingController } from "@/controllers/booking.controller";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();
  try {
    return await BookingController.getBookedDates(req);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
