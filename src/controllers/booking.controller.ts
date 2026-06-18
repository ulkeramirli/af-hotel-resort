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

    const { room, guestName, email, phone, checkIn, checkOut } = body;

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
    });
    const mail = bookingCreatedEmail(
      guestName,
      existingRoom.name,
      checkIn,
      checkOut,
    );
    await sendMail(email, mail.subject, mail.html);
    const adminMail = adminBookingNotification(
      guestName,
      email,
      phone,
      existingRoom.name,
      checkIn,
      checkOut,
    );
    
    await sendMail(process.env.HOTEL_EMAIL!, adminMail.subject, adminMail.html);
    return NextResponse.json({
      success: true,

      message: "Booking created successfully",

      booking,
    });
  }

  static async getAll() {
    const bookings = await Booking.find().populate("room");

    return NextResponse.json({
      success: true,

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

    const { status } = body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      throw new Error("Invalid status");
    }

    const booking = await Booking.findById(id).populate("room");

    if (!booking) {
      throw new Error("Booking not found");
    }

    booking.status = status;
    await booking.save();

    if (status === "confirmed") {
      const mail = bookingConfirmedEmail(
        booking.guestName,
        booking.room.name,
        booking.checkIn,
        booking.checkOut,
      );
      await sendMail(booking.email, mail.subject, mail.html);
    }

    if (status === "cancelled") {
      const mail = bookingCancelledEmail(
        booking.guestName,
        booking.room.name,
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
}
