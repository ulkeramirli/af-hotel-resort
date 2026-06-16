import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const adminToken = request.headers.get("authorization");
    if (!adminToken || adminToken !== "Bearer af-hotel-super-secret-token") {
      return NextResponse.json({ error: "Giriş qadağandır!" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      include: { room: true },
      orderBy: { createdAt: "desc" }
    });

    // Избавились от any, приведя массив к Record<string, unknown>[]
    const formattedBookings = (bookings as unknown as Record<string, unknown>[]).map((b) => ({
      id: b.id,
      guest: b.guest,
      room: b.room ? (b.room as Record<string, unknown>).name : "Otaq təyin edilməyib",
      roomType: b.room ? (b.room as Record<string, unknown>).type : "Bilinmir",
      date: b.dateRange,
      status: b.status,
      createdAt: b.createdAt
    }));

    return NextResponse.json(formattedBookings, { status: 200 });
  } catch (error) {
    console.error("Admin Bookings GET Error:", error);
    return NextResponse.json({ error: "Bronların siyahısını yükləmək mümkün olmadı" }, { status: 500 });
  }
}