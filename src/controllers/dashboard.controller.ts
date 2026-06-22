import Booking from "@/models/Booking";
import Review from "@/models/Review";
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

    const totalReviews = await Review.countDocuments();

    const occupancyRate =
      totalBookings > 0
        ? Math.round((confirmedBookings / totalBookings) * 100)
        : 0;

    const recentBookings = await Booking.find()
      .populate("room")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    const confirmedRevenueBookings = await Booking.find({
      status: "confirmed",
    }).populate("room");

    const totalRevenue = confirmedRevenueBookings.reduce(
      (sum: number, booking: { room?: { price?: number } }) => sum + (booking.room?.price || 0),
      0,
    );

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );

    const monthlyBookings = await Booking.countDocuments({
      createdAt: {
        $gte: startOfMonth,
      },
    });

    const topRooms = await Booking.aggregate([
      {
        $group: {
          _id: "$room",
          bookings: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          bookings: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    await Room.populate(topRooms, {
      path: "_id",
      select: "name type price",
    });

    return NextResponse.json({
      success: true,

      stats: {
        totalRooms,

        totalBookings,

        pendingBookings,

        confirmedBookings,

        cancelledBookings,

        occupancyRate,

        totalRevenue,

        totalReviews,

        monthlyBookings,
      },

      recentBookings,

      topRooms,
    });
  }
}
