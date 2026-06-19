import { AboutController } from "@/controllers/about.controller";
import { connectDB } from "@/lib/db";
import { authMiddleware } from "@/middleware/auth.middleware";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  return AboutController.get();
}

export async function PATCH(req: Request) {
  await connectDB();

  try {
    const user = authMiddleware(req) as any;
    if (user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
        },
        {
          status: 403,
        },
      );
    }
    return AboutController.update(req);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 401,
      },
    );
  }
}
