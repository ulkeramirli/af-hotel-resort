import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("База данных наполняется первоначальными данными...");

  await prisma.booking.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.message.deleteMany({});

  // Передаем id как ЧИСЛА (101, 204 и т.д.), так как в схеме указано Int
  const r101 = await prisma.room.create({ data: { id: 101, name: "Standart 101", type: "2 nəfər · 80 AZN/gecə", status: "Boş" } });
  const r204 = await prisma.room.create({ data: { id: 204, name: "Deluxe 204", type: "2 nəfər · 140 AZN/gecə", status: "Dolu" } });
  const r105 = await prisma.room.create({ data: { id: 105, name: "Standart 105", type: "2 nəfər · 80 AZN/gecə", status: "Təmizlənir" } });
  const r210 = await prisma.room.create({ data: { id: 210, name: "Family 210", type: "5 nəfər · 180 AZN/gecə", status: "Boş" } });

  await prisma.booking.createMany({
    data: [
      { guest: "Leyla Hüseynova", dateRange: "12–15 İyn", status: "Təsdiqlənib", roomId: r204.id as never },
      { guest: "Əli Məmmədov", dateRange: "14–17 İyn", status: "Gözləyir", roomId: r101.id as never },
      { guest: "Sara Rzayeva", dateRange: "20–25 İyn", status: "Təsdiqlənib", roomId: r210.id as never },
      { guest: "Kamran Əliyev", dateRange: "10–12 İyn", status: "Ləğv edilib", roomId: r105.id as never },
    ]
  });

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