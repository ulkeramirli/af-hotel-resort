import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
const uri = process.env.MONGO_URI || "";

async function run() {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const LocalizedStringSchema = new mongoose.Schema({
    az: { type: String, default: "" },
    en: { type: String, default: "" },
    ru: { type: String, default: "" }
  }, { _id: false });

  const MenuItemSchema = new mongoose.Schema({
    name: LocalizedStringSchema,
    description: LocalizedStringSchema,
    price: Number,
    image: String
  }, { _id: false });

  const MenuCategorySchema = new mongoose.Schema({
    name: LocalizedStringSchema,
    items: [MenuItemSchema]
  }, { _id: false });

  const RestaurantSchema = new mongoose.Schema({
    name: LocalizedStringSchema,
    menu: [MenuCategorySchema]
  });

  const Restaurant = mongoose.models.Restaurant || mongoose.model("Restaurant", RestaurantSchema);

  let rest = await Restaurant.findOne({ "name.en": "AF Beach" });
  if (!rest) {
    rest = await Restaurant.findOne({});
  }
  if (!rest) {
    console.log("No restaurant found");
    process.exit(1);
  }

  const menuData = [
    {
      name: { az: "SOYUQ QƏLYANALTILAR", en: "Cold Appetizers", ru: "Холодные закуски" },
      items: [
        { name: { az: "Ağ pendir", en: "White cheese", ru: "Белый сыр" }, price: 5.00 },
        { name: { az: "Motal pendir", en: "Motal cheese", ru: "Сыр мотал" }, price: 6.00 },
        { name: { az: "Tərəvəz buketi", en: "Vegetable bouquet", ru: "Овощной букет" }, price: 6.00 },
        { name: { az: "Turşu assorti", en: "Pickles assortment", ru: "Ассорти солений" }, price: 5.00 },
        { name: { az: "Süzmə", en: "Suzma", ru: "Сюзьма" }, price: 3.00 },
        { name: { az: "Acika", en: "Adjika", ru: "Аджика" }, price: 2.00 },
        { name: { az: "Limon", en: "Lemon", ru: "Лимон" }, price: 2.00 },
      ]
    },
    {
      name: { az: "SALATLAR", en: "Salads", ru: "Салаты" },
      items: [
        { name: { az: "Paytaxt salatı", en: "Capital salad", ru: "Столичный салат" }, price: 5.00 },
        { name: { az: "Manqal salatı", en: "Mangal salad", ru: "Мангал салат" }, price: 5.00 },
        { name: { az: "Toyuq salatı", en: "Chicken salad", ru: "Куриный салат" }, price: 5.00 },
        { name: { az: "Vişnəli pomidor salatı", en: "Cherry tomato salad", ru: "Салат из помидоров черри" }, price: 7.00 },
        { name: { az: "Çoban salatı sadə", en: "Choban salad (simple)", ru: "Салат Чобан (простой)" }, price: 5.00 },
        { name: { az: "Çoban salatı pendirli", en: "Choban salad with cheese", ru: "Салат Чобан (с сыром)" }, price: 6.00 },
      ]
    },
    {
      name: { az: "ŞORBALAR", en: "Soups", ru: "Супы" },
      items: [
        { name: { az: "Toyuq şorbası", en: "Chicken soup", ru: "Куриный суп" }, price: 5.00 },
        { name: { az: "Mərci şorbası", en: "Lentil soup", ru: "Чечевичный суп" }, price: 4.00 },
      ]
    },
    {
      name: { az: "FAST FOOD", en: "Fast Food", ru: "Фаст Фуд" },
      items: [
        { name: { az: "Kartof fri", en: "French fries", ru: "Картофель фри" }, price: 4.00 },
        { name: { az: "Toyuq nuggets", en: "Chicken nuggets", ru: "Куриные наггетсы" }, price: 5.00 },
        { name: { az: "Şaurma", en: "Shawarma", ru: "Шаурма" }, price: 6.00 },
        { name: { az: "Pizza (qarışıq)", en: "Pizza (mixed)", ru: "Пицца (ассорти)" }, price: 17.00 },
        { name: { az: "Pizza (toyuqlu)", en: "Pizza (chicken)", ru: "Пицца (с курицей)" }, price: 15.00 },
        { name: { az: "Pizza (margarita)", en: "Pizza (margarita)", ru: "Пицца (маргарита)" }, price: 13.00 },
      ]
    },
    {
      name: { az: "QUTABLAR", en: "Qutabs", ru: "Кутабы" },
      items: [
        { name: { az: "Ət qutabı", en: "Meat qutab", ru: "Кутаб с мясом" }, price: 1.20 },
        { name: { az: "Göy qutabı", en: "Herb qutab", ru: "Кутаб с зеленью" }, price: 1.20 },
        { name: { az: "Qarın qutabı", en: "Tripe qutab", ru: "Кутаб с требухой" }, price: 1.20 },
      ]
    },
    {
      name: { az: "SƏRİN İÇKİLƏR", en: "Cold Drinks", ru: "Прохладительные напитки" },
      items: [
        { name: { az: "Qazlı su (0.5 l)", en: "Sparkling water (0.5 l)", ru: "Газированная вода (0.5 л)" }, price: 3.00 },
        { name: { az: "Qazsızı su (0.5 l)", en: "Still water (0.5 l)", ru: "Вода без газа (0.5 л)" }, price: 3.00 },
        { name: { az: "Kola (0.5 l)", en: "Cola (0.5 l)", ru: "Кола (0.5 л)" }, price: 3.00 },
        { name: { az: "Kompot (1 l)", en: "Compote (1 l)", ru: "Компот (1 л)" }, price: 5.00 },
        { name: { az: "Meyvə şirəsi (1 l)", en: "Fruit juice (1 l)", ru: "Фруктовый сок (1 л)" }, price: 5.00 },
        { name: { az: "Limonad (0.5 l)", en: "Lemonade (0.5 l)", ru: "Лимонад (0.5 л)" }, price: 3.00 },
        { name: { az: "Kola (1 l)", en: "Cola (1 l)", ru: "Кола (1 л)" }, price: 5.00 },
        { name: { az: "Ayran qrafin", en: "Ayran (carafe)", ru: "Айран (графин)" }, price: 6.00 },
        { name: { az: "Ayran bakal", en: "Ayran (glass)", ru: "Айран (бокал)" }, price: 2.00 },
      ]
    },
    {
      name: { az: "SAC YEMƏKLƏRİ", en: "Saj Meals", ru: "Блюда на садже" },
      items: [
        { name: { az: "Sac çolpa", en: "Saj chicken", ru: "Садж с курицей" }, price: 28.00 },
        { name: { az: "Sac quzu", en: "Saj lamb", ru: "Садж с бараниной" }, price: 30.00 },
        { name: { az: "Sac mal əti", en: "Saj beef", ru: "Садж с говядиной" }, price: 30.00 },
        { name: { az: "Sac qarışıq", en: "Saj mixed", ru: "Садж ассорти" }, price: 35.00 },
        { name: { az: "Çolpa soyutma", en: "Boiled chicken", ru: "Отварная курица" }, price: 22.00 },
        { name: { az: "Pomidor yumurta", en: "Tomato and egg", ru: "Помидоры с яйцом" }, price: 6.00 },
        { name: { az: "Pomidor yumurta sacda", en: "Tomato and egg on saj", ru: "Помидоры с яйцом на садже" }, price: 16.00 },
        { name: { az: "Çolpa çığırtma", en: "Chicken chigirtma", ru: "Куриная чыхыртма" }, price: 25.00 },
        { name: { az: "Toyuq tabaka kartofla", en: "Chicken tabaka with potatoes", ru: "Цыпленок табака с картофелем" }, price: 22.00 },
        { name: { az: "Toyuq langet", en: "Chicken langet", ru: "Куриный лангет" }, price: 11.00 },
      ]
    },
    {
      name: { az: "BALIQ YEMƏKLƏRİ", en: "Fish Meals", ru: "Рыбные блюда" },
      items: [
        { name: { az: "Farel", en: "Trout", ru: "Форель" }, price: 25.00 },
        { name: { az: "Kifal", en: "Mullet", ru: "Кефаль" }, price: 25.00 },
        { name: { az: "Sudak", en: "Pike perch", ru: "Судак" }, price: 25.00 },
        { name: { az: "Kütüm", en: "Kutum", ru: "Кутум" }, price: 25.00 },
      ]
    },
    {
      name: { az: "KABABLAR", en: "Kebabs", ru: "Кебабы" },
      items: [
        { name: { az: "Lülə kabab", en: "Lula kebab", ru: "Люля-кебаб" }, price: 9.00 },
        { name: { az: "Tikə kabab", en: "Tika kebab", ru: "Тика-кебаб" }, price: 10.00 },
        { name: { az: "Antrikot", en: "Entrecote", ru: "Антрекот" }, price: 11.00 },
        { name: { az: "Toyuq kabab", en: "Chicken kebab", ru: "Куриный кебаб" }, price: 6.00 },
        { name: { az: "Dana basdırma", en: "Veal basdirma", ru: "Бастурма из телятины" }, price: 10.00 },
        { name: { az: "Ciyər quyruq", en: "Liver with tail fat", ru: "Печень с курдюком" }, price: 9.00 },
        { name: { az: "Quyruq kababı", en: "Tail fat kebab", ru: "Кебаб из курдюка" }, price: 9.00 },
        { name: { az: "Ciyər kabab", en: "Liver kebab", ru: "Кебаб из печени" }, price: 6.00 },
        { name: { az: "Tərəvəz kababı", en: "Vegetable kebab", ru: "Овощной кебаб" }, price: 4.00 },
        { name: { az: "Kartof külləmə", en: "Roasted potatoes", ru: "Картофель запеченный" }, price: 4.00 },
        { name: { az: "Kartof quyruq", en: "Potato with tail fat", ru: "Картофель с курдюком" }, price: 6.00 },
      ]
    },
    {
      name: { az: "ÇAY DƏSTGAHI", en: "Tea Set", ru: "Чайный стол" },
      items: [
        { name: { az: "Çay çanik", en: "Teapot", ru: "Чайник чая" }, price: 5.00 },
        { name: { az: "Mürəbbə", en: "Jam", ru: "Варенье" }, price: 5.00 },
        { name: { az: "Mürəbbə özəl", en: "Special jam", ru: "Особое варенье" }, price: 8.00 },
        { name: { az: "Çay dəstgahı", en: "Full tea set", ru: "Чайный сет" }, price: 35.00 },
        { name: { az: "Çay samovar", en: "Samovar tea", ru: "Чай из самовара" }, price: 20.00 },
        { name: { az: "Alpen Gold", en: "Alpen Gold chocolate", ru: "Шоколад Alpen Gold" }, price: 5.00 },
        { name: { az: "Snickers", en: "Snickers chocolate", ru: "Шоколад Snickers" }, price: 3.00 },
        { name: { az: "Şirniyyat", en: "Sweets", ru: "Сладости" }, price: 4.00 },
        { name: { az: "Meyvə mövsümə görə", en: "Seasonal fruits", ru: "Фрукты по сезону" }, price: 20.00 },
        { name: { az: "Yemiş", en: "Melon", ru: "Дыня" }, price: 5.00 },
        { name: { az: "Qarpız", en: "Watermelon", ru: "Арбуз" }, price: 5.00 },
      ]
    }
  ];

  rest.menu = menuData;
  await rest.save();
  console.log("Menu successfully injected");
  process.exit(0);
}

run().catch(console.error);
