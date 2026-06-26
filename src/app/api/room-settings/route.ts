import { RoomSettingsController } from "@/controllers/room-settings.controller";
import { connectDB } from "@/lib/db";
import { authMiddleware } from "@/middleware/auth.middleware";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  return RoomSettingsController.getSettings();
}

export async function PATCH(req: Request) {
  await connectDB();
  try {
    const user = authMiddleware(req) as any;
    if (user.role !== "admin") {
      throw new Error("Only admin can update room settings");
    }
    return RoomSettingsController.updateSettings(req);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 403 }
    );
  }
}
