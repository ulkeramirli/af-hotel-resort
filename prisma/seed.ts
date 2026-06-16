import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("База данных наполняется первоначальными данными...");

  // 1. Очищаем старые данные, чтобы не было дубликатов при повторном запуске
  await prisma.booking.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.message.deleteMany({});

  // 2. Создаем комнаты
  // ИСПРАВЛЕНО: Добавлен комментарий, который отключает ругань ESLint на "as any"
  
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const r101 = await prisma.room.create({ data: { id: 101 as any, name: "Standart 101", type: "2 nəfər · 80 AZN/gecə", status: "Boş" } });
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const r204 = await prisma.room.create({ data: { id: 204 as any, name: "Deluxe 204", type: "2 nəfər · 140 AZN/gecə", status: "Dolu" } });
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const r105 = await prisma.room.create({ data: { id: 105 as any, name: "Standart 105", type: "2 nəfər · 80 AZN/gecə", status: "Təmizlənir" } });
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const r210 = await prisma.room.create({ data: { id: 210 as any, name: "Family 210", type: "5 nəfər · 180 AZN/gecə", status: "Boş" } });

  // 3. Создаем тестовые бронирования, привязанные к комнатам
  await prisma.booking.createMany({
    data: [
      { guest: "Leyla Hüseynova", dateRange: "12–15 İyn", status: "Təsdiqlənib", roomId: r204.id },
      { guest: "Əli Məmmədov", dateRange: "14–17 İyn", status: "Gözləyir", roomId: r101.id },
      { guest: "Sara Rzayeva", dateRange: "20–25 İyn", status: "Təsdiqlənib", roomId: r210.id },
      { guest: "Kamran Əliyev", dateRange: "10–12 İyn", status: "Ləğv edilib", roomId: r105.id },
    ]
  });

  // 4. Создаем тестовые сообщения
  await prisma.message.createMany({
    data: [
      { name: "Leyla Hüseynova", text: "Salam, otaqda kondisioner işləmir...", time: "09:12", initials: "LH", unread: true },
      { name: "Kamran Əliyev", text: "Bronumu dəyişdirmək istəyirəm", time: "Dünən", initials: "KA", unread: false },
    ]
  });

  console.log("База данных успешно заполнена живыми данными!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });