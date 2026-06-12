import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface SettingsBody {
  id?: number;
  themeColor: string;
  backgroundColor: string;
  hotelName: string;
  heroTitle: string;
  heroSubtitle: string;
  contactPhone: string;
  contactEmail: string;
}

interface PrismaDynamic {
  [key: string]: {
    findFirst: () => Promise<SettingsBody | null>;
    create: (args: { data: SettingsBody }) => Promise<SettingsBody>;
    update: (args: { where: { id?: number }; data: SettingsBody }) => Promise<SettingsBody>;
  };
}

export async function GET() {
  try {
    const dynamicPrisma = prisma as unknown as PrismaDynamic;
    const prismaModel = dynamicPrisma["systemSettings"];
    let settings = await prismaModel.findFirst();
    
    if (!settings) {
      settings = await prismaModel.create({
        data: { 
          themeColor: "#00b4d8", 
          backgroundColor: "#ffffff", 
          hotelName: "AF Hotel & Resort",
          heroTitle: "Lüks və Rahatlığın Ünvanı",
          heroSubtitle: "Xəzər dənizinin sahilində unudulmaz istirahət",
          contactPhone: "+994 (12) 447 00 00",
          contactEmail: "info@afhotel.az"
        }
      });
    }
    return NextResponse.json(settings, { status: 200 });
  } catch (errLog) {
    console.error(errLog);
    return NextResponse.json({ error: "Ayarları yükləmək olmadı" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as SettingsBody;
    const dynamicPrisma = prisma as unknown as PrismaDynamic;
    const prismaModel = dynamicPrisma["systemSettings"];
    const currentSettings = await prismaModel.findFirst();

    if (currentSettings) {
      const updated = await prismaModel.update({
        where: { id: currentSettings.id },
        data: body
      });
      return NextResponse.json(updated, { status: 200 });
    } else {
      const created = await prismaModel.create({ data: body });
      return NextResponse.json(created, { status: 201 });
    }
  } catch (errLog) {
    console.error(errLog);
    return NextResponse.json({ error: "Yadda saxlamaq mümkün olmadı" }, { status: 500 });
  }
}