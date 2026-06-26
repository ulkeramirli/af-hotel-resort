import RoomType from "@/models/RoomType";
import { NextResponse } from "next/server";

export class RoomTypeController {
  static async create(req: Request) {
    const body = await req.json();

    const roomType = await RoomType.create({
      name: body.name,
    });

    return NextResponse.json(
      {
        success: true,
        roomType,
      },
      {
        status: 201,
      },
    );
  }

  static async getAll() {
    const roomTypes = await RoomType.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      roomTypes,
    });
  }

  static async getById(id: string) {
    const roomType = await RoomType.findById(id);

    if (!roomType) {
      throw new Error("Room type not found");
    }

    return NextResponse.json({
      success: true,
      roomType,
    });
  }

  static async update(id: string, body: Record<string, unknown>) {
    const roomType = await RoomType.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!roomType) {
      throw new Error("Room type not found");
    }

    return NextResponse.json({
      success: true,
      roomType,
    });
  }

  static async delete(id: string) {
    const roomType = await RoomType.findByIdAndDelete(id);

    if (!roomType) {
      throw new Error("Room type not found");
    }

    return NextResponse.json({
      success: true,
      message: "Room type deleted successfully",
    });
  }
}
