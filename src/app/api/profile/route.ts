import { authMiddleware } from "@/middleware/auth.middleware";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const user = authMiddleware(req);
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 },
    );
  }
}
