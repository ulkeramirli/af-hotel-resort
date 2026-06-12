import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const adminToken = request.headers.get("authorization");
    if (!adminToken || adminToken !== "Bearer af-hotel-super-secret-token") {
      return NextResponse.json({ error: "Giriş qadağandır!" }, { status: 401 });
    }

    // Параллельно собираем данные для анализа
    const [bookings, rooms, messages] = await Promise.all([
      prisma.booking.findMany({ include: { room: true } }),
      prisma.room.findMany(),
      prisma.message.findMany()
    ]);

    // Высчитываем реальный доход по типам комнат на основе бизнес-логики отеля
    const confirmedBookings = bookings.filter(b => b.status === "Təsdiqlənib");
    const totalRevenue = confirmedBookings.reduce((sum, b) => {
      let roomPrice = 140; // Дефолтная цена за стандартную комнату

      if (b.room) {
        const typeLower = b.room.type.toLowerCase();
        if (typeLower.includes("deluxe")) {
          roomPrice = 250;
        } else if (typeLower.includes("suite") || typeLower.includes("luks")) {
          roomPrice = 400;
        } else if (typeLower.includes("standart")) {
          roomPrice = 140;
        }
      }
      return sum + roomPrice;
    }, 0);

    // Считаем загруженность отеля в процентах
    const totalRoomsCount = rooms.length;
    const fullRoomsCount = rooms.filter(r => r.status === "Dolu").length;
    const occupancyRate = totalRoomsCount > 0 ? Math.round((fullRoomsCount / totalRoomsCount) * 100) : 0;

    // Распределяем комнаты по статусам для графиков
    const roomStats = {
      bos: rooms.filter(r => r.status === "Boş").length,
      dolu: fullRoomsCount,
      temizlenir: rooms.filter(r => r.status === "Təmizlənir").length,
    };

    // Считаем популярность типов номеров
    const typeCounts: Record<string, number> = {};
    confirmedBookings.forEach(b => {
      if (b.room) {
        typeCounts[b.room.type] = (typeCounts[b.room.type] || 0) + 1;
      }
    });

    const popularTypes = Object.entries(typeCounts).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);

    return NextResponse.json({
      totalRevenue,
      occupancyRate,
      roomStats,
      popularTypes,
      totalBookings: bookings.length,
      pendingBookings: bookings.filter(b => b.status === "Gözləyir").length,
      totalMessages: messages.length
    }, { status: 200 });

  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Statistika datası hazırlanan zaman xəta" }, { status: 500 });
  }
}