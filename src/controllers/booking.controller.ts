import { adminBookingNotification } from "@/lib/emails/admin-nofication";
import { bookingCancelledEmail } from "@/lib/emails/booking-canceled";
import { bookingConfirmedEmail } from "@/lib/emails/booking-confirmed";
import { bookingCreatedEmail } from "@/lib/emails/booking-created";
import { sendMail } from "@/lib/send-email";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import { NextResponse } from "next/server";

export class BookingController {
  static async create(req: Request) {
    const body = await req.json();

    const { room, guestName, email, phone, checkIn, checkOut, notes } = body;

    const existingRoom = await Room.findById(room);

    if (!existingRoom) {
      throw new Error("Room not found");
    }

    const conflictBooking = await Booking.findOne({
      room,

      status: {
        $ne: "cancelled",
      },

      checkIn: {
        $lt: new Date(checkOut),
      },

      checkOut: {
        $gt: new Date(checkIn),
      },
    });

    if (conflictBooking) {
      throw new Error("This room is already booked for the selected dates");
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      throw new Error("Check-out date must be after check-in date");
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (new Date(checkIn) < today) {
      throw new Error("Check-in date cannot be in the past");
    }

    const booking = await Booking.create({
      room,
      guestName,
      email,
      phone,
      checkIn,
      checkOut,
      notes,
    });
    const mail = bookingCreatedEmail(
      guestName,
      (existingRoom.name as any)?.az || "Otaq",
      checkIn,
      checkOut,
    );
    try {
      await sendMail(email, mail.subject, mail.html);
    } catch (e) {
      console.warn("Could not send user email:", e);
    }
    
    const adminMail = adminBookingNotification(
      guestName,
      email,
      phone,
      (existingRoom.name as any)?.az || "Otaq",
      checkIn,
      checkOut,
    );

    try {
      await sendMail(process.env.HOTEL_EMAIL || "admin@example.com", adminMail.subject, adminMail.html);
    } catch (e) {
      console.warn("Could not send admin email:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  }

  static async getAll(req: Request) {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;
    const total = await Booking.countDocuments();
    const bookings = await Booking.find()
      .populate("room")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);
    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      bookings,
    });
  }

  static async getById(id: string) {
    const booking = await Booking.findById(id).populate("room");

    if (!booking) {
      throw new Error("Booking not found");
    }

    return NextResponse.json({
      success: true,

      booking,
    });
  }

  static async updateStatus(id: string, req: Request) {
    const body = await req.json();

    const { status, notes, room, checkIn, checkOut, guestName, email, phone } = body;

    const booking = await Booking.findById(id).populate("room");

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (status) {
      if (!["pending", "confirmed", "cancelled"].includes(status)) {
        throw new Error("Invalid status");
      }
      booking.status = status;
    }

    if (notes !== undefined) booking.notes = notes;
    if (room !== undefined) booking.room = room;
    if (checkIn !== undefined) booking.checkIn = new Date(checkIn);
    if (checkOut !== undefined) booking.checkOut = new Date(checkOut);
    if (guestName !== undefined) booking.guestName = guestName;
    if (email !== undefined) booking.email = email;
    if (phone !== undefined) booking.phone = phone;

    if (room || checkIn || checkOut) {
       const conflictBooking = await Booking.findOne({
         _id: { $ne: id },
         room: booking.room ? (typeof booking.room === "object" ? (booking.room as any)._id : booking.room) : null,
         status: { $ne: "cancelled" },
         checkIn: { $lt: booking.checkOut },
         checkOut: { $gt: booking.checkIn },
       });
       if (conflictBooking) throw new Error("Seçilmiş tarixlərdə bu otaq artıq doludur (Conflict)");
    }

    await booking.save();
    await booking.populate("room");
    
    const roomName = booking.room ? booking.room.name : "Silinmiş otaq";

    if (status === "confirmed") {
      const mail = bookingConfirmedEmail(
        booking.guestName,
        roomName,
        booking.checkIn,
        booking.checkOut,
      );
      await sendMail(booking.email, mail.subject, mail.html);
    }

    if (status === "cancelled") {
      const mail = bookingCancelledEmail(
        booking.guestName,
        roomName,
        booking.checkIn,
        booking.checkOut,
      );
      await sendMail(booking.email, mail.subject, mail.html);
    }

    return NextResponse.json({
      success: true,
      message: "Booking status updated",
      booking,
    });
  }

  static async delete(id: string) {
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      throw new Error("Booking not found");
    }

    return NextResponse.json({
      success: true,

      message: "Booking deleted successfully",
    });
  }

  static async getBookedDates(req: Request) {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");

    if (!roomId) {
      throw new Error("Room ID is required");
    }

    const bookings = await Booking.find({
      room: roomId,
      status: { $ne: "cancelled" }
    }).select("checkIn checkOut");

    const dates = bookings.map(b => ({
      checkIn: b.checkIn,
      checkOut: b.checkOut
    }));

    return NextResponse.json({
      success: true,
      dates
    });
  }
}
