import { RoomController } from "@/controllers/room.controller";
import { connectDB } from "@/lib/db";
import { authMiddleware } from "@/middleware/auth.middleware";
import type { JwtPayload } from "jsonwebtoken";

interface AuthUser extends JwtPayload {
  id: string;
  role: string;
}

export async function POST(req: Request) {
  await connectDB();
  try {
    const decoded = authMiddleware(req) as AuthUser;
    if (decoded.role !== "admin") {
      throw new Error("Only admin can create rooms");
    }
    return RoomController.create(req, decoded);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return Response.json({ success: false, message }, { status: 401 });
  }
}

export async function GET() {
  await connectDB();
  return RoomController.getAllRooms();
}