import Booking from "@/models/Booking";
import Room from "@/models/Room";
import { NextResponse } from "next/server";

export class DashboardController {
  static async getStats() {
    const totalRooms = await Room.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({
      status: "pending",
    });
    const confirmedBookings = await Booking.countDocuments({
      status: "confirmed",
    });
    const cancelledBookings = await Booking.countDocuments({
      status: "cancelled",
    });
    const occupancyRate =
      totalBookings > 0
        ? Math.round((confirmedBookings / totalBookings) * 100)
        : 0;

    const recentBookings = await Booking.find()
      .populate("room")
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({
      success: true,
      stats: {
        totalRooms,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        occupancyRate,
      },
      recentBookings,
    });
  }
}
