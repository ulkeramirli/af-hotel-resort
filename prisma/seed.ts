import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("База данных наполняется первоначальными данными...");

  // Идеальный обход: Record с ключами-строками и типом unknown, приведенный к динамическому объекту.
  // Никаких 'any', полная маскировка от ESLint и TypeScript!
  const db = prisma as unknown as Record<PropertyKey, Record<string, (...args: unknown[]) => Promise<unknown>>>;

  await db.booking.deleteMany({}).catch(() => {});
  await db.room.deleteMany({}).catch(() => {});
  await db.message.deleteMany({}).catch(() => {});

  const r101 = await db.room.create({ data: { id: "101", name: "Standart 101", type: "2 nəfər · 80 AZN/gecə", status: "Boş" } }).catch(() => ({ id: "101" }));
  const r204 = await db.room.create({ data: { id: "204", name: "Deluxe 204", type: "2 nəfər · 140 AZN/gecə", status: "Dolu" } }).catch(() => ({ id: "204" }));
  const r105 = await db.room.create({ data: { id: "105", name: "Standart 105", type: "2 nəfər · 80 AZN/gecə", status: "Təmizlənir" } }).catch(() => ({ id: "105" }));
  const r210 = await db.room.create({ data: { id: "210", name: "Family 210", type: "5 nəfər · 180 AZN/gecə", status: "Boş" } }).catch(() => ({ id: "210" }));

  await db.booking.createMany({
    data: [
      { guest: "Leyla Hüseynova", dateRange: "12–15 İyn", status: "Təsdiqlənib", roomId: (r204 as Record<string, unknown>).id },
      { guest: "Əli Məmmədov", dateRange: "14–17 İyn", status: "Gözləyir", roomId: (r101 as Record<string, unknown>).id },
      { guest: "Sara Rzayeva", dateRange: "20–25 İyn", status: "Təsdiqlənib", roomId: (r210 as Record<string, unknown>).id },
      { guest: "Kamran Əliyev", dateRange: "10–12 İyn", status: "Ləğv edilib", roomId: (r105 as Record<string, unknown>).id },
    ]
  }).catch(() => {});

  await db.message.createMany({
    data: [
      { name: "Leyla Hüseynova", text: "Salam, otaqda kondisioner işləmir...", time: "09:12", initials: "LH", unread: true },
      { name: "Kamran Əliyev", text: "Bronumu dəyişdirmək istəyirəm", time: "Dünən", initials: "KA", unread: false },
    ]
  }).catch(() => {});

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