import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";

export class TicketController {
  static async create(req: Request) {
    const body = await req.json();

    const { name, price } = body;

    const ticket = await Ticket.create({
      name,
      price,
    });
    return NextResponse.json(
      {
        success: true,
        ticket,
      },
      {
        status: 201,
      },
    );
  }
  static async getAll() {
    const tickets = await Ticket.find().sort({
      createdAt: -1,
    });
    return NextResponse.json({
      success: true,
      tickets,
    });
  }
  static async getById(id: string) {
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }
    return NextResponse.json({
      success: true,
      ticket,
    });
  }
  static async update(id: string, body: Record<string, unknown>) {
    const ticket = await Ticket.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    return NextResponse.json({
      success: true,
      ticket,
    });
  }
  static async delete(id: string) {
    const ticket = await Ticket.findByIdAndDelete(id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    return NextResponse.json({
      success: true,
      message: "Ticket deleted successfully",
    });
  }
}
