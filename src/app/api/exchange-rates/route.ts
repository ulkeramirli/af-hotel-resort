import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ExchangeRate from "@/models/ExchangeRate";

export async function GET() {
  await connectDB();
  try {
    let rate = await ExchangeRate.findOne();
    if (!rate) {
      rate = await ExchangeRate.create({});
    }
    return NextResponse.json({ success: true, data: rate });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST() {
  await connectDB();
  try {
    let xmlData = "";

    // Mərkəzi bank şənbə/bazar günləri bəzən yeni XML yayımlamır,
    // ona görə də ən son 7 günü yoxlayırıq.
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      const dateStr = `${dd}.${mm}.${yyyy}`;

      const cbarUrl = `https://www.cbar.az/currencies/${dateStr}.xml`;
      const response = await fetch(cbarUrl);
      const text = await response.text();

      if (response.ok && text.includes("ValCurs")) {
        xmlData = text;
        break;
      }
    }

    if (!xmlData) {
      throw new Error("Mərkəzi Bankdan son 7 gün üçün məlumat çəkilə bilmədi");
    }

    const usdMatch = xmlData.match(
      /<Valute Code="USD">[\s\S]*?<Value>([\d.]+)<\/Value>/,
    );
    const eurMatch = xmlData.match(
      /<Valute Code="EUR">[\s\S]*?<Value>([\d.]+)<\/Value>/,
    );

    if (!usdMatch || !eurMatch) {
      throw new Error("XML faylından USD və ya EUR məzənnələri oxuna bilmədi");
    }

    const usdRate = parseFloat(usdMatch[1]);
    const eurRate = parseFloat(eurMatch[1]);

    let rate = await ExchangeRate.findOne();
    if (rate) {
      rate.usd = usdRate;
      rate.eur = eurRate;
      rate.lastUpdated = new Date();
      await rate.save();
    } else {
      rate = await ExchangeRate.create({
        usd: usdRate,
        eur: eurRate,
        lastUpdated: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      data: rate,
      message: "Məzənnələr uğurla yeniləndi!",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
