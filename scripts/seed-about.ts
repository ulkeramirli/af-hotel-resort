import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

const localizedString = {
  az: { type: String, default: "" },
  en: { type: String, default: "" },
  ru: { type: String, default: "" },
};

const aboutShcema = new mongoose.Schema(
  {
    title: localizedString,
    description: localizedString,
    images: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const About = mongoose.models.About || mongoose.model("About", aboutShcema);

async function seed() {
  const uri = process.env.DATABASE_URL || process.env.MONGO_URI;
  if (!uri) {
    console.error("No MongoDB URI found in " + path.join(__dirname, "../.env"));
    return;
  }
  await mongoose.connect(uri);
  
  let about = await About.findOne();
  if (!about) {
    about = new About({ images: [] });
  }

  about.title = {
    ru: "Найдите свое идеальное место для отдыха.",
    en: "Find your perfect stay.",
    az: "Mükəmməl istirahət yerinizi tapın."
  };

  about.description = {
    ru: "Откройте для себя комфорт и заботу в каждой детали. Будь то семейный отпуск, поездка с друзьями или расслабляющие выходные, мы создаем атмосферу, в которой вы можете просто быть собой. Отдохните, восстановите силы и наслаждайтесь моментом.",
    en: "Discover comfort and care in every detail. Whether it's a family vacation, a trip with friends, or a relaxing weekend getaway, we create an atmosphere where you can simply be yourself. Rest, recharge, and enjoy the moment.",
    az: "Hər bir detalda rahatlıq və qayğını kəşf edin. İstər ailə tətili, istərsə də istirahət üçün həftəsonu olsun, biz sizin sadəcə özünüz ola biləcəyiniz bir atmosfer yaradırıq. Dincəlin, güc toplayın və anın dadını çıxarın."
  };

  await about.save();
  console.log("About text updated successfully with Marriott/Hilton style text!");
  
  await mongoose.disconnect();
}

seed().catch(console.error);
