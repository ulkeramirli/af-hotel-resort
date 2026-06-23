import { connectDB } from "@/lib/db";
import RoomType from "@/models/RoomType";
import Room from "@/models/Room";
import ActivityCategory from "@/models/ActivityCategory";
import Activity from "@/models/Activity";
import Restaurant from "@/models/Restaurant";
import Wonderland from "@/models/Wonderland";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    // 1. Wipe collections
    await RoomType.deleteMany({});
    await Room.deleteMany({});
    await ActivityCategory.deleteMany({});
    await Activity.deleteMany({});
    await Restaurant.deleteMany({});
    await Wonderland.deleteMany({});

    // 2. Room Types
    const rtSingle = await RoomType.create({ name: { az: "Tək Nəfərlik", en: "Single", ru: "Одноместный" } });
    const rtDouble = await RoomType.create({ name: { az: "Cüt Nəfərlik", en: "Double", ru: "Двухместный" } });
    const rtFamily = await RoomType.create({ name: { az: "Ailəvi", en: "Family", ru: "Семейный" } });
    const rtCottage = await RoomType.create({ name: { az: "Koteclər", en: "Cottages", ru: "Коттеджи" } });

    // 3. Rooms
    await Room.create({
      name: { az: "Standart Tək Nəfərlik Otaq", en: "Standard Single Room", ru: "Стандартный Одноместный Номер" },
      type: rtSingle._id,
      description: {
        az: "Rahat və sakit bir istirahət üçün mükəmməl seçimdir.",
        en: "Perfect choice for a comfortable and quiet rest.",
        ru: "Идеальный выбор для комфортного и тихого отдыха."
      },
      price: 150,
      capacity: 1,
      images: ["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80"],
      amenities: [
        { az: "Kondisioner", en: "Air Conditioner", ru: "Кондиционер" },
        { az: "Ödənişsiz Wi-Fi", en: "Free Wi-Fi", ru: "Бесплатный Wi-Fi" },
      ],
      beds: 1,
      baths: 1,
      sqft: 250,
    });

    await Room.create({
      name: { az: "Lüks Cüt Nəfərlik Otaq", en: "Deluxe Double Room", ru: "Люкс Двухместный Номер" },
      type: rtDouble._id,
      description: {
        az: "Dəniz mənzərəli lüks otaq, ailə və cütlüklər üçün əla seçimdir.",
        en: "Luxury room with a sea view, an excellent choice for couples and families.",
        ru: "Роскошный номер с видом на море, отличный выбор для пар и семей."
      },
      price: 250,
      capacity: 2,
      images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80"],
      amenities: [
        { az: "Kondisioner", en: "Air Conditioner", ru: "Кондиционер" },
        { az: "Ödənişsiz Wi-Fi", en: "Free Wi-Fi", ru: "Бесплатный Wi-Fi" },
        { az: "Mini bar", en: "Mini bar", ru: "Мини-бар" }
      ],
      beds: 1,
      baths: 1,
      sqft: 400,
    });

    // 4. Activity Categories (Aquapark)
    const acSlides = await ActivityCategory.create({
      name: { az: "Slaydlar", en: "Slides", ru: "Горки" },
      description: { az: "Ekstremal slaydlar", en: "Extreme slides", ru: "Экстремальные горки" },
      emoji: "🎢"
    });
    const acPools = await ActivityCategory.create({
      name: { az: "Hovuzlar", en: "Pools", ru: "Бассейны" },
      description: { az: "Rahatladıcı hovuzlar", en: "Relaxing pools", ru: "Расслабляющие бассейны" },
      emoji: "🏊‍♂️"
    });

    // 5. Activities (Aquapark items)
    await Activity.create({
      title: { az: "Kamikadze", en: "Kamikaze", ru: "Камикадзе" },
      description: {
        az: "Yüksək sürətli ekstremal slayd.",
        en: "High-speed extreme slide.",
        ru: "Скоростная экстремальная горка."
      },
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80",
      category: acSlides._id
    });

    await Activity.create({
      title: { az: "Olimpik Hovuz", en: "Olympic Pool", ru: "Олимпийский Бассейн" },
      description: {
        az: "25 metrlik böyük hovuz.",
        en: "25-meter large pool.",
        ru: "Большой 25-метровый бассейн."
      },
      image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80",
      category: acPools._id
    });

    // 6. Restaurants
    await Restaurant.create({
      name: { az: "Əsas Restoran", en: "Main Restaurant", ru: "Главный Ресторан" },
      description: {
        az: "Dünya mətbəxindən ləziz təamlar.",
        en: "Delicious dishes from world cuisine.",
        ru: "Вкусные блюда мировой кухни."
      },
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      menu: [
        {
          name: { az: "Səhər Yeməyi", en: "Breakfast", ru: "Завтрак" },
          items: [
            {
              name: { az: "Pendir Boşqabı", en: "Cheese Plate", ru: "Сырная Тарелка" },
              price: 15
            }
          ]
        }
      ]
    });

    await Restaurant.create({
      name: { az: "Lounge Bar", en: "Lounge Bar", ru: "Лаунж Бар" },
      description: {
        az: "Gözəl mənzərə və kokteyllər.",
        en: "Beautiful view and cocktails.",
        ru: "Прекрасный вид и коктейли."
      },
      image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80",
      menu: []
    });

    // 7. Wonderland
    await Wonderland.create({
      title: { az: "Əyləncə Mərkəzi", en: "Wonderland", ru: "Парк Развлечений" },
      description: { az: "Bütün yaş qrupları üçün əyləncələr", en: "Entertainment for all ages", ru: "Развлечения для всех возрастов" },
      tag: { az: "YENİ", en: "NEW", ru: "НОВЫЙ" },
      smallAttractions: [
        {
          name: { az: "Gündəlik Şoular", en: "Daily Shows", ru: "Ежедневные шоу" },
          description: { az: "Maraqlı canlı şoular", en: "Exciting live shows", ru: "Захватывающие живые шоу" },
          icon: "🎭"
        },
        {
          name: { az: "Oyun Aparatları", en: "Arcade Games", ru: "Игровые автоматы" },
          description: { az: "Uşaqlar üçün əyləncə", en: "Fun for kids", ru: "Веселье для детей" },
          icon: "👾"
        }
      ],
      bigAttractions: [
        {
          title: { az: "Uşaq Zonası", en: "Kids Zone", ru: "Детская зона" },
          games: [
            {
              name: { az: "Karousel", en: "Carousel", ru: "Карусель" },
              description: { az: "Ənənəvi at karuseli", en: "Traditional horse carousel", ru: "Традиционная карусель с лошадками" },
              image: "https://images.unsplash.com/photo-1536640712-4d4c36ef0e52?w=800&q=80"
            }
          ]
        },
        {
          title: { az: "Virtual Reallıq", en: "Virtual Reality", ru: "Виртуальная реальность" },
          games: [
            {
              name: { az: "VR Simulyator", en: "VR Simulator", ru: "VR Симулятор" },
              description: { az: "Realistik VR təcrübəsi", en: "Realistic VR experience", ru: "Реалистичный VR опыт" },
              image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800&q=80"
            }
          ]
        }
      ],
      tickets: [
        {
          name: { az: "Standart Bilet", en: "Standard Ticket", ru: "Стандартный билет" },
          price: "20"
        }
      ]
    });

    return NextResponse.json({ success: true, message: "DB seeded with 3 languages" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
