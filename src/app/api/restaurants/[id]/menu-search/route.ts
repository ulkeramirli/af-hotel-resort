import { RestaurantController } from "@/controllers/restaurant.controller";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query) {
      return NextResponse.json(
        { success: false, message: "Search query (q) is required" },
        { status: 400 },
      );
    }

    return RestaurantController.searchMenu(id, query);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 400,
      },
    );
  }
}
