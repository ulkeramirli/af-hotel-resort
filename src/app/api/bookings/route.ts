import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Получаем данные для админки из реальной БД одним запросом
export async function GET(request: Request) {
  try {
    const { headers } = request;
    const adminToken = headers.get("authorization");

    // Временная проверка безопасности (в будущем заменим на сессию)
    if (!adminToken || adminToken !== "Bearer af-hotel-super-secret-token") {
      return NextResponse.json({ error: "Giriş qadağandır!" }, { status: 401 });
    }

    // Запрашиваем из базы параллельно бронирования, комнаты и сообщения
    const [bookings, rooms, messages] = await Promise.all([
      prisma.booking.findMany({
        include: { room: true, guest: true }, // Подтягиваем связанные данные о комнате и госте
        orderBy: { createdAt: "desc" }
      }),
      prisma.room.findMany({ orderBy: { id: "asc" } }),
      prisma.message.findMany({ orderBy: { createdAt: "desc" } })
    ]);

    // Безопасное форматирование бронирований под нужды фронтенда
    const formattedBookings = bookings.map((b) => {
      const bookingDate = b.createdAt ? b.createdAt.toISOString() : "";

      return {
        id: b.id,
        guest: (b.guest as { name: string } | null | undefined)?.name ?? "Qonaq məlumatı tapılmadı",
        room: b.room ? b.room.nameAz : "Otaq təyin edilməyib",
        date: bookingDate,
        status: b.status
      };
    });

    return NextResponse.json({ bookings: formattedBookings, rooms, messages }, { status: 200 });
  } catch (error) {
    console.error("Dashboard API GET Error:", error);
    return NextResponse.json({ error: "Verilənlər bazası ilə əlaqə xətası" }, { status: 500 });
  }
}

// PATCH: Обновление статусов (брони, комнаты или прочтения сообщения)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { type, id, newStatus } = body;

    if (!id || !type) {
      return NextResponse.json({ error: "ID və ya Tip tapılmadı" }, { status: 400 });
    }

    // Обновляем нужную таблицу в зависимости от типа операции
    if (type === "BOOKING") {
      await prisma.booking.update({
        where: { id: String(id) },
        data: { status: newStatus }
      });
    } else if (type === "ROOM") {
      await prisma.room.update({
        where: { id: String(id) },
        data: { status: newStatus }
      });
    } else if (type === "MESSAGE") {
      await prisma.message.update({
        where: { id: String(id) },
        data: { unread: false }
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Dashboard API PATCH Error:", error);
    return NextResponse.json({ error: "Yenilənmə zamanı xəta baş verdi" }, { status: 500 });
  }
}