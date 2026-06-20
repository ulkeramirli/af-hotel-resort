import { SettingsController } from "@/controllers/settings.controller";
import { connectDB } from "@/lib/db";
import { authMiddleware } from "@/middleware/auth.middleware";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  return SettingsController.get();
}

export async function PATCH(req: Request) {
  await connectDB();

  try {
    const user = authMiddleware(req) as any;

    if (user.role !== "admin") {
      throw new Error("Only admin can update settings");
    }

    return SettingsController.update(req);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 403,
      },
    );
  }
}
