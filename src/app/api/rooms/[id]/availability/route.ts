import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const bookings = await Booking.find({
    room: id,
    status: {
      $ne: "cancelled",
    },
  }).select("checkIn checkOut");
  return NextResponse.json({
    success: true,
    bookings,
  });
}
