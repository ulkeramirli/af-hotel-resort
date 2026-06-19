import Booking from "@/models/Booking";
import Room from "@/models/Room";
import "@/models/User";
import { NextResponse } from "next/server";

interface UserPayload {
  id: string;
  role: string;
  [key: string]: unknown;
}

export class RoomController {
  static async create(req: Request, user: UserPayload) {
    try {
      const { name, type, description, price, capacity, images, amenities } =
        await req.json();

      const room = await Room.create({
        name,
        type,
        description,
        price,
        capacity,
        images,
        amenities,
        createdBy: user.id,
      });

      return NextResponse.json(
        {
          success: true,
          room,
        },
        {
          status: 201,
        },
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        {
          success: false,
          message,
        },
        {
          status: 400,
        },
      );
    }
  }

  static async getAllRooms() {
    try {
      const rooms = await Room.find().populate("createdBy", "name email");

      return NextResponse.json(
        {
          success: true,
          rooms,
        },
        {
          status: 200,
        },
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        {
          success: false,
          message,
        },
        {
          status: 400,
        },
      );
    }
  }

  static async getById(id: string) {
    try {
      const room = await Room.findById(id).populate("createdBy", "name email");
      if (!room) {
        return NextResponse.json(
          {
            success: false,
            message: "Room not found",
          },
          {
            status: 404,
          },
        );
      }
      return NextResponse.json(
        {
          success: true,
          room,
        },
        {
          status: 200,
        },
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        {
          success: false,
          message,
        },
        {
          status: 400,
        },
      );
    }
  }

  static async update(id: string, body: Record<string, unknown>) {
    try {
      const room = await Room.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
      if (!room) {
        return NextResponse.json(
          {
            success: false,
            message: "Room not found",
          },
          {
            status: 404,
          },
        );
      }
      return NextResponse.json({
        success: true,
        room,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        {
          success: false,
          message,
        },
        {
          status: 400,
        },
      );
    }
  }

  static async delete(id: string) {
    try {
      const room = await Room.findByIdAndDelete(id);
      if (!room) {
        return NextResponse.json(
          {
            success: false,
            message: "Room not found",
          },
          {
            status: 404,
          },
        );
      }
      return NextResponse.json(
        {
          success: true,
          message: "Room deleted successfully",
        },
        {
          status: 200,
        },
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        {
          success: false,
          message,
        },
        {
          status: 400,
        },
      );
    }
  }

  static async getAvailability(roomId: string) {
    const room = await Room.findById(roomId);

    if (!room) {
      throw new Error("Room not found");
    }
    const bookings = await Booking.find({
      room: roomId,
      status: {
        $ne: "cancelled",
      },
    }).select("checkIn checkOut");

    return NextResponse.json({
      success: true,
      room: {
        id: room._id,
        name: room.name,
      },
      unavailableDates: bookings,
    });
  }
}
