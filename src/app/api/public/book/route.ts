import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, roomType, dateRange } = body;

    // 1. Валидация входящих данных
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Ad və Soyad düzgün daxil edilməyib" }, { status: 400 });
    }
    if (!phone || phone.trim().length < 6) {
      return NextResponse.json({ error: "Telefon nömrəsi düzgün daxil edilməyib" }, { status: 400 });
    }
    if (!roomType || !dateRange) {
      return NextResponse.json({ error: "Otaq tipi və ya tarix seçilməyib" }, { status: 400 });
    }

    // 2. Ищем свободную комнату нужного типа (например, Standart, Deluxe, Suite)
    const availableRoom = await prisma.room.findFirst({
      where: {
        status: "Boş",
        type: {
          contains: roomType,
          mode: "insensitive", // Регистронезависимый поиск
        },
      },
    });

    let selectedRoomId: number;

    if (availableRoom) {
      selectedRoomId = availableRoom.id;
      
      // Сразу меняем статус комнаты на "Dolu"
      await prisma.room.update({
        where: { id: selectedRoomId },
        data: { status: "Dolu" }
      });
    } else {
      // Если все комнаты этого типа заняты (овербукинг), привязываем к любой комнате этого типа
      const fallbackRoom = await prisma.room.findFirst({
        where: {
          type: { contains: roomType, mode: "insensitive" }
        }
      });

      if (!fallbackRoom) {
        return NextResponse.json({ error: "Bu kateqoriyada otaq sistemdə tapılmadı" }, { status: 404 });
      }
      selectedRoomId = fallbackRoom.id;
    }

    // 3. Создаем запись бронирования
    const newBooking = await prisma.booking.create({
      data: {
        guest: name.trim(),
        dateRange: dateRange,
        status: "Gözləyir", // По умолчанию бронь падает в статус ожидания
        roomId: selectedRoomId,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Rezervasiya uğurla tamamlandı", 
      bookingId: newBooking.id 
    }, { status: 201 });

  } catch (error) {
    console.error("Public booking API error:", error);
    return NextResponse.json({ error: "Daxili server xətası baş verdi" }, { status: 500 });
  }
}