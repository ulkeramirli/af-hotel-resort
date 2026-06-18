import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Получить только сообщения для страницы /admin/mesajlar
export async function GET(request: Request) {
  try {
    const adminToken = request.headers.get("authorization");
    if (!adminToken || adminToken !== "Bearer af-hotel-super-secret-token") {
      return NextResponse.json({ error: "Giriş qadağandır!" }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("Messages API GET Error:", error);
    return NextResponse.json({ error: "Mesajlar yüklənərkən xəta baş verdi" }, { status: 500 });
  }
}

// DELETE: Удаление сообщения из базы данных
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID tapılmadı" }, { status: 400 });
    }

    await prisma.message.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Mesaj silindi" }, { status: 200 });
  } catch (error) {
    console.error("Messages API DELETE Error:", error);
    return NextResponse.json({ error: "Mesajı silmək mümkün olmadı" }, { status: 500 });
  }
}