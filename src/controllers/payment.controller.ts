import { createEpointPayment } from "@/lib/epoint";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import { NextResponse } from "next/server";
import { generateSignature } from "@/lib/signature";
import { bookingCreatedEmail } from "@/lib/emails/booking-created";
import { adminBookingNotification } from "@/lib/emails/admin-nofication";
import { sendMail } from "@/lib/send-email";
export class PaymentController {
  static async create(req: Request) {
    const body = await req.json();
    const { room, guestName, email, phone, checkIn, checkOut, notes, currency = "AZN" } = body;
    const existingRoom = await Room.findById(room);
    const conflictBooking = await Booking.findOne({
      room,
      paymentStatus: "paid",
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
    if (!existingRoom) {
      throw new Error("Room not found");
    }
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const unitPrice = currency === "USD" ? (existingRoom.priceUsd || 0) : existingRoom.price;
    const amount = unitPrice * nights;
    
    if (amount <= 0) {
      throw new Error("Invalid total amount");
    }

    const booking = await Booking.create({
      room,
      guestName,
      email,
      phone,
      checkIn,
      checkOut,
      notes,
      amount,
      currency,
      paymentStatus: "pending",
      status: "pending",
    });
    try {
      const payment = await createEpointPayment({
        amount,
        orderId: booking._id.toString(),
        description: `Booking #${booking._id}`,
        currency,
      });

      console.log("EPOINT RESPONSE:", payment);

      return NextResponse.json({
        success: true,
        bookingId: booking._id,
        amount,
        payment,
      });
    } catch (error) {
      await Booking.findByIdAndDelete(booking._id);

      throw error;
    }
  }
  static async callback(req: Request) {
    const body = await req.formData();

    const data = body.get("data")?.toString();
    const signature = body.get("signature")?.toString();

    if (!data || !signature) {
      throw new Error("Invalid callback");
    }

    const expectedSignature = generateSignature(
      data,
      process.env.EPOINT_PRIVATE_KEY!,
    );

    if (signature !== expectedSignature) {
      throw new Error("Signature is invalid");
    }

    const decoded = JSON.parse(Buffer.from(data, "base64").toString("utf8"));

    console.log("CALLBACK", decoded);

    const booking = await Booking.findById(decoded.order_id);

    if (!booking) {
      throw new Error("Booking not found");
    }
    if (decoded.status === "success") {
      if (booking.paymentStatus === "paid") {
        return NextResponse.json({
          success: true,
          message: "Payment already processed",
        });
      }
      booking.paymentStatus = "paid";
      booking.status = "pending"; // Admin will manually approve
      booking.paymentTransaction = decoded.transaction || "";
      await booking.save();

      await booking.populate("room");

      const roomName = (booking.room as any)?.name?.az || "Otaq";

      const formatDate = (dateInput: any) => {
        if (!dateInput) return "";
        const d = new Date(dateInput);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}.${month}.${year}`;
      };

      const mail = bookingCreatedEmail(
        booking.guestName,
        roomName,
        formatDate(booking.checkIn),
        formatDate(booking.checkOut),
      );

      await sendMail(booking.email, mail.subject, mail.html);

      const adminMail = adminBookingNotification(
        booking.guestName,
        booking.email,
        booking.phone,
        roomName,
        formatDate(booking.checkIn),
        formatDate(booking.checkOut),
      );

      await sendMail(
        process.env.HOTEL_EMAIL!,
        adminMail.subject,
        adminMail.html,
      );
    } else if (decoded.status === "refunded") {
      booking.paymentStatus = "refunded";
      booking.status = "cancelled";
      await booking.save();
    } else {
      booking.paymentStatus = "failed";
      booking.status = "cancelled";
      await booking.save();
    }

    return NextResponse.json({
      success: true,
    });
  }
}
