import { RoomController } from "@/controllers/room.controller";
import { connectDB } from "@/lib/db";
import { authMiddleware } from "@/middleware/auth.middleware";
import { NextResponse } from "next/server";
import type { JwtPayload } from "jsonwebtoken";

interface AuthUser extends JwtPayload {
  id: string;
  role: string;
}

function getAuthUser(req: Request): AuthUser {
  const decoded = authMiddleware(req);
  if (!decoded || typeof decoded === "string") {
    throw new Error("Unauthorized");
  }
  return decoded as AuthUser;
}

// GET /api/rooms/[id]
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    // Вызываем метод напрямую из контроллера
    return await RoomController.getById(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// PUT /api/rooms/[id]
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const decoded = getAuthUser(req);
    
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admin can update rooms" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    // Вызываем обновление с id и телом запроса
    return await RoomController.update(id, body);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ success: false, message }, { status: 401 });
  }
}

// DELETE /api/rooms/[id]
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const decoded = getAuthUser(req);

    if (decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admin can delete rooms" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Вызываем удаление
    return await RoomController.delete(id);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ success: false, message }, { status: 401 });
  }
}