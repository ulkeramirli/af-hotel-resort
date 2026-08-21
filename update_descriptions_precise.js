const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const descriptions = {
  "Ağ pendir": {
    az: "Səhər süfrəniz və qəlyanaltı üçün ləziz, təbii inək südündən ağ pendir",
    en: "Delicious, natural cow milk white cheese for breakfast and appetizers",
    ru: "Вкусный, натуральный белый сыр из коровьего молока для завтрака и закусок"
  },
  "Motal pendir": {
    az: "Dağ otlaqlarından əldə edilmiş xüsusi dada malik ənənəvi motal pendiri",
    en: "Traditional motal cheese with a special taste obtained from mountain pastures",
    ru: "Традиционный сыр мотал с особым вкусом, полученный с горных пастбищ"
  },
  "Tərəvəz buketi": {
    az: "Mövsümi təzə xiyar, pomidor, bibər və göyərtilərdən ibarət təravətli tərəvəz tabağı",
    en: "Fresh vegetable platter consisting of seasonal cucumbers, tomatoes, peppers, and greens",
    ru: "Тарелка свежих овощей, состоящая из сезонных огурцов, помидоров, перца и зелени"
  },
  "Turşu assorti": {
    az: "Ev üsulu ilə hazırlanmış ağız dadınızı dəyişəcək qarışıq turşular",
    en: "Homemade mixed pickles that will change your taste buds",
    ru: "Домашние ассорти солений, которые изменят ваш вкус"
  },
  "Süzmə": {
    az: "Təbii qatıqdan hazırlanmış qatı və ləzzətli süzmə",
    en: "Thick and delicious suzma made from natural yogurt",
    ru: "Густая и вкусная сузма из натурального йогурта"
  },
  "Acika": {
    az: "Acı bibər, sarımsaq və pomidordan ibarət xüsusi ədviyyatlı sous",
    en: "Special spicy sauce consisting of hot pepper, garlic, and tomato",
    ru: "Особый острый соус из острого перца, чеснока и помидоров"
  },
  "Limon": {
    az: "Dilimlənmiş təzə limon",
    en: "Sliced fresh lemon",
    ru: "Нарезанный свежий лимон"
  },
  "Paytaxt salatı": {
    az: "Klassik reseptlə hazırlanmış, xüsusi souslu ənənəvi paytaxt salatı",
    en: "Traditional capital salad prepared with a classic recipe and special sauce",
    ru: "Традиционный столичный салат, приготовленный по классическому рецепту с особым соусом"
  },
  "Manqal salatı": {
    az: "Közdə bişmiş badımcan, pomidor, bibər və qırmızı soğandan ibarət əsl manqal salatı",
    en: "Authentic barbecue salad consisting of fire-roasted eggplant, tomato, pepper, and red onion",
    ru: "Настоящий мангал-салат из запеченных на углях баклажанов, помидоров, перца и красного лука"
  },
  "Toyuq salatı": {
    az: "Zərif toyuq filesi, tərəvəzlər və yüngül sous ilə hazırlanmış doyumlu salat",
    en: "Hearty salad made with tender chicken fillet, vegetables, and light dressing",
    ru: "Сытный салат из нежного куриного филе, овощей и легкой заправки"
  },
  "Vişnəli pomidor salatı": {
    az: "Çerri pomidorları və albalı sousu ilə hazırlanmış fərqli və şirin-turş salat",
    en: "Different and sweet-sour salad made with cherry tomatoes and cherry sauce",
    ru: "Необычный кисло-сладкий салат из помидоров черри и вишневого соуса"
  },
  "Çoban salatı sadə": {
    az: "Təzə pomidor, xiyar, soğan və göyərtilərdən ibarət sadə, təravətli salat",
    en: "Simple, refreshing salad of fresh tomatoes, cucumbers, onions, and greens",
    ru: "Простой освежающий салат из свежих помидоров, огурцов, лука и зелени"
  },
  "Çoban salatı pendirli": {
    az: "Ağ pendir qırıntıları ilə zənginləşdirilmiş, klassik çoban salatı",
    en: "Classic choban salad enriched with white cheese crumbles",
    ru: "Классический чобан салат, обогащенный кусочками белого сыра"
  },
  "Toyuq şorbası": {
    az: "Kənd toyuğu, tərəvəzlər və zərif ədviyyatlarla zənginləşdirilmiş ev üsulu şorba",
    en: "Homemade soup enriched with village chicken, vegetables, and delicate spices",
    ru: "Домашний суп, обогащенный деревенской курицей, овощами и тонкими специями"
  },
  "Mərci şorbası": {
    az: "Qırmızı mərci, quru nanə və kərə yağı ilə bişirilmiş ənənəvi isti şorba",
    en: "Traditional hot soup cooked with red lentils, dried mint, and butter",
    ru: "Традиционный горячий суп из красной чечевицы, сушеной мяты и сливочного масла"
  },
  "Kartof fri": {
    az: "Xırtıldayan qızıl rəngli kartof çubuqları",
    en: "Crispy golden potato sticks",
    ru: "Хрустящие золотистые картофельные палочки"
  },
  "Toyuq nuggets": {
    az: "Xüsusi sousla təqdim edilən, xırtıldayan çörək qırıntılarında bişmiş toyuq filesi",
    en: "Chicken fillet fried in crispy breadcrumbs, served with special sauce",
    ru: "Куриное филе в хрустящей панировке, подается со специальным соусом"
  },
  "Şaurma": {
    az: "İncə lavaşda qızardılmış toyuq əti, xüsusi sous və tərəvəzlərlə",
    en: "Grilled chicken, special sauce, and vegetables wrapped in thin lavash",
    ru: "Жареная курица, особый соус и овощи в тонком лаваше"
  },
  "Pizza (qarışıq)": {
    az: "Müxtəlif kolbasa, sosiska, göbələk və bol pendirli ləziz qarışıq pizza",
    en: "Delicious mixed pizza with assorted sausages, mushrooms, and plenty of cheese",
    ru: "Вкусная смешанная пицца с разными колбасами, грибами и обилием сыра"
  },
  "Pizza (toyuqlu)": {
    az: "Xüsusi sous, zərif toyuq filesi və mozzarella pendirindən toyuqlu pizza",
    en: "Chicken pizza with special sauce, tender chicken fillet, and mozzarella cheese",
    ru: "Куриная пицца с особым соусом, нежным куриным филе и сыром моцарелла"
  },
  "Pizza (margarita)": {
    az: "Klassik italyan resepti: pomidor sousu, təzə reyhan və mozzarella",
    en: "Classic Italian recipe: tomato sauce, fresh basil, and mozzarella",
    ru: "Классический итальянский рецепт: томатный соус, свежий базилик и моцарелла"
  },
  "Ət qutabı": {
    az: "Sacda qızardılmış, ləziz çəkilmiş ətlə doldurulmuş ənənəvi qutab",
    en: "Traditional qutab stuffed with delicious minced meat and fried on a saj",
    ru: "Традиционный кутаб с вкусным мясным фаршем, жареный на садже"
  },
  "Göy qutabı": {
    az: "Mövsümi göyərtilərlə zəngin, sacda bişmiş dietik qutab",
    en: "Dietary qutab rich in seasonal greens, cooked on a saj",
    ru: "Диетический кутаб с зеленью, приготовленный на садже"
  },
  "Qarın qutabı": {
    az: "Xüsusi dad axtaranlar üçün ləzzətli qarın qutabı",
    en: "Delicious stomach qutab for those looking for a special taste",
    ru: "Вкусный кутаб из требухи для ищущих особый вкус"
  },
  "Qazlı su (0.5 l)": { az: "Sərinləşdirici qazlı su", en: "Refreshing sparkling water", ru: "Освежающая газированная вода" },
  "Qazsızı su (0.5 l)": { az: "Təmiz və təbii içməli su", en: "Clean and natural drinking water", ru: "Чистая и натуральная питьевая вода" },
  "Kola (0.5 l)": { az: "Sərinləşdirici Coca-Cola içkisi", en: "Refreshing Coca-Cola drink", ru: "Освежающий напиток Кока-Кола" },
  "Kompot (1 l)": {
    az: "Təbii meyvələrdən ev üsulu hazırlanmış ləziz kompot",
    en: "Delicious homemade compote made from natural fruits",
    ru: "Вкусный домашний компот из натуральных фруктов"
  },
  "Meyvə şirəsi (1 l)": {
    az: "Təzə sıxılmış qablaşdırılmış meyvə şirəsi",
    en: "Freshly squeezed packaged fruit juice",
    ru: "Свежевыжатый пакетированный фруктовый сок"
  },
  "Limonad (0.5 l)": {
    az: "Təzə limon və nanə ilə canlandırıcı içki",
    en: "Revitalizing drink with fresh lemon and mint",
    ru: "Бодрящий напиток со свежим лимоном и мятой"
  },
  "Kola (1 l)": { az: "Ailəvi boy sərinləşdirici Coca-Cola", en: "Family-sized refreshing Coca-Cola", ru: "Освежающая Кока-Кола семейного размера" },
  "Ayran qrafin": { az: "Qatıq və nanə ilə hazırlanmış böyük qrafin ayran", en: "Large carafe of ayran made with yogurt and mint", ru: "Большой графин айрана из йогурта и мяты" },
  "Ayran bakal": { az: "Sərinləşdirici nanəli ayran (1 stəkan)", en: "Refreshing mint ayran (1 glass)", ru: "Освежающий мятный айран (1 стакан)" },
  "Sac çolpa": {
    az: "Kənd çolpası və bol tərəvəzlə köz üzərində bişirilmiş möhtəşəm sac",
    en: "Magnificent saj cooked over coals with village chicken and plenty of vegetables",
    ru: "Великолепный садж, приготовленный на углях с деревенской курицей и овощами"
  },
  "Sac quzu": {
    az: "Zərif quzu əti və mövsümi tərəvəzlərlə köz üzərində sac yeməyi",
    en: "Saj dish over coals with tender lamb and seasonal vegetables",
    ru: "Садж на углях с нежной бараниной и сезонными овощами"
  },
  "Sac mal əti": {
    az: "Yumşaq mal əti tikələri və qızardılmış tərəvəzlərlə sac",
    en: "Saj with soft beef chunks and roasted vegetables",
    ru: "Садж с мягкими кусочками говядины и жареными овощами"
  },
  "Sac qarışıq": {
    az: "Müxtəlif ət növlərinin və tərəvəzlərin mükəmməl uyğunluğu ilə sac qarışıq",
    en: "Mixed saj with a perfect harmony of different meats and vegetables",
    ru: "Смешанный садж с идеальным сочетанием разных видов мяса и овощей"
  },
  "Çolpa soyutma": {
    az: "Öz bulyonunda bişmiş, zərif və pəhrizlik kənd çolpası",
    en: "Tender and dietary village chicken cooked in its own broth",
    ru: "Нежная и диетическая деревенская курица, приготовленная в собственном бульоне"
  },
  "Pomidor yumurta": {
    az: "Təzə kənd yumurtası və şirəli pomidordan hazırlanmış klassik yemək",
    en: "Classic dish made from fresh village eggs and juicy tomatoes",
    ru: "Классическое блюдо из свежих деревенских яиц и сочных помидоров"
  },
  "Pomidor yumurta sacda": {
    az: "Köz üzərində xüsusi dadda qızardılmış kənd yumurtası və pomidor",
    en: "Village eggs and tomatoes fried with a special taste over coals",
    ru: "Деревенские яйца и помидоры, жареные с особым вкусом на углях"
  },
  "Çolpa çığırtma": {
    az: "Soğan, pomidor və kənd yumurtası ilə xüsusi qaydada bişirilmiş çolpa",
    en: "Chicken specially cooked with onions, tomatoes, and village eggs",
    ru: "Курица, специально приготовленная с луком, помидорами и деревенскими яйцами"
  },
  "Toyuq tabaka kartofla": {
    az: "Sarımsaqlı sousla qızardılmış bütöv toyuq tabaka və ev kartofu fri",
    en: "Whole chicken tabaka fried with garlic sauce and home fries",
    ru: "Целая курица табака, жаренная с чесночным соусом и домашним картофелем фри"
  },
  "Toyuq langet": {
    az: "Qızılı qabığa qədər bişirilmiş zərif toyuq filesi (langet)",
    en: "Tender chicken fillet (langet) cooked to a golden crust",
    ru: "Нежное куриное филе (лангет), запеченное до золотистой корочки"
  },
  "Farel": {
    az: "Közdə və ya tavada qızardılmış təzə nərə fareli",
    en: "Fresh trout fried on coals or in a pan",
    ru: "Свежая форель, жаренная на углях или на сковороде"
  },
  "Kifal": {
    az: "Ləziz və yağlı kifal balığı, xüsusi sousla",
    en: "Delicious and fatty mullet fish with a special sauce",
    ru: "Вкусная и жирная кефаль с особым соусом"
  },
  "Sudak": {
    az: "Sümüksüz və zərif ətə malik, közdə bişmiş sudak balığı",
    en: "Boneless and tender meat, charcoal-grilled pike perch",
    ru: "Судак без костей с нежным мясом, приготовленный на углях"
  },
  "Kütüm": {
    az: "Xəzər dənizinin məşhur ləzzəti: qızardılmış kütüm balığı",
    en: "Famous delicacy of the Caspian Sea: fried kutum fish",
    ru: "Знаменитый деликатес Каспийского моря: жареный кутум"
  },
  "Lülə kabab": {
    az: "Xüsusi çəkilmiş quzu ətindən hazırlanmış şirəli lülə kabab",
    en: "Juicy lule kebab made from specially minced lamb meat",
    ru: "Сочный люля-кебаб из специально измельченной баранины"
  },
  "Tikə kabab": {
    az: "Yumşaq quzu ətinin tikələrindən hazırlanmış möhtəşəm kabab",
    en: "Magnificent kebab made from chunks of soft lamb meat",
    ru: "Великолепный шашлык из кусочков мягкой баранины"
  },
  "Antrikot": {
    az: "Sümüklü quzu ətindən közdə mükəmməl qızardılmış antrikot",
    en: "Perfectly grilled entrecote from bone-in lamb meat",
    ru: "Идеально прожаренный антрекот из баранины на кости"
  },
  "Toyuq kabab": {
    az: "Xüsusi marinad edilmiş, zərif toyuq tikələrindən kabab",
    en: "Kebab made from specially marinated, tender chicken pieces",
    ru: "Шашлык из специально маринованных нежных кусочков курицы"
  },
  "Dana basdırma": {
    az: "Xüsusi ədviyyatlarla uzun müddət marinad olunmuş dana əti kababı",
    en: "Veal kebab marinated for a long time with special spices",
    ru: "Шашлык из телятины, долго мариновавшийся в особых специях"
  },
  "Ciyər quyruq": {
    az: "Təzə ciyər və quyruq tikələrinin mükəmməl ahəngi",
    en: "Perfect harmony of fresh liver and tail fat pieces",
    ru: "Идеальное сочетание кусочков свежей печени и курдюка"
  },
  "Quyruq kababı": {
    az: "Közdə qızardılmış, ağızda əriyən təmiz quzu quyruğu",
    en: "Charcoal-grilled, melt-in-the-mouth pure lamb tail fat",
    ru: "Жареный на углях, тающий во рту чистый бараний курдюк"
  },
  "Ciyər kabab": {
    az: "Təzə quzu ciyərindən şirəli və ləziz kabab",
    en: "Juicy and delicious kebab made from fresh lamb liver",
    ru: "Сочный и вкусный шашлык из свежей бараньей печени"
  },
  "Tərəvəz kababı": {
    az: "Közdə qızardılmış pomidor, badımcan və acı bibər",
    en: "Charcoal-grilled tomatoes, eggplants, and hot peppers",
    ru: "Запеченные на углях помидоры, баклажаны и острый перец"
  },
  "Kartof külləmə": {
    az: "Közdə bişmiş, ləzzətli kənd kartofu (külləmə)",
    en: "Delicious village potatoes baked in ashes (kulleme)",
    ru: "Вкусный деревенский картофель, запеченный в золе"
  },
  "Kartof quyruq": {
    az: "Közdə kartof və quzu quyruğu",
    en: "Potatoes and lamb tail fat on coals",
    ru: "Картофель и бараний курдюк на углях"
  },
  "Çay çanik": {
    az: "Təzə dəmlənmiş ətirli qara çay",
    en: "Freshly brewed aromatic black tea",
    ru: "Свежезаваренный ароматный черный чай"
  },
  "Mürəbbə": {
    az: "Təbii meyvələrdən ev üsulu hazırlanmış ləziz mürəbbə (çeşidlər fərqli ola bilər)",
    en: "Delicious homemade jam from natural fruits (varieties may differ)",
    ru: "Вкусное домашнее варенье из натуральных фруктов (виды могут отличаться)"
  },
  "Mürəbbə özəl": {
    az: "Mövsümə uyğun xüsusi meyvələrdən, ağız dadınıza layiq premium mürəbbə",
    en: "Premium jam worthy of your taste, made from special seasonal fruits",
    ru: "Премиальное варенье из особых сезонных фруктов, достойное вашего вкуса"
  },
  "Çay dəstgahı": {
    az: "Samovar çayı, mürəbbələr, ləbləbi, şirniyyatlar və ləziz quru meyvələrdən ibarət bütöv çay masası",
    en: "A complete tea table consisting of samovar tea, jams, nuts, sweets, and delicious dried fruits",
    ru: "Полный чайный стол с самоварным чаем, вареньем, орехами, сладостями и вкусными сухофруктами"
  },
  "Çay samovar": {
    az: "Odun közündə qaynayan sudan dəmlənmiş əsl kənd samovar çayı",
    en: "Authentic village samovar tea brewed from water boiling on wood coals",
    ru: "Настоящий деревенский самоварный чай, заваренный на дровяных углях"
  },
  "Alpen Gold": {
    az: "Alpen Gold markalı ləziz şokolad piltəsi",
    en: "Delicious Alpen Gold brand chocolate bar",
    ru: "Вкусная шоколадная плитка Alpen Gold"
  },
  "Snickers": {
    az: "Fıstıq və karamelli enerji dolu Snickers şokoladı",
    en: "Energy-filled Snickers chocolate with peanuts and caramel",
    ru: "Энергетический шоколад Сникерс с арахисом и карамелью"
  },
  "Şirniyyat": {
    az: "Çay süfrəniz üçün təzə və ləzzətli şirniyyat çeşidləri",
    en: "Fresh and delicious pastry varieties for your tea table",
    ru: "Свежие и вкусные сладости для вашего чайного стола"
  },
  "Meyvə mövsümə görə": {
    az: "Mövsümün ən təzə və şirəli meyvələrindən ibarət meyvə tabağı",
    en: "Fruit platter consisting of the freshest and juiciest fruits of the season",
    ru: "Фруктовая тарелка из самых свежих и сочных фруктов сезона"
  },
  "Yemiş": {
    az: "Bal kimi şirin, sərin və dilimlənmiş təzə yemiş",
    en: "Honey-sweet, cool, and sliced fresh melon",
    ru: "Сладкая как мед, прохладная и нарезанная свежая дыня"
  },
  "Qarpız": {
    az: "Buz kimi sərinləşdirici, şirəli və şirin dilimlənmiş qarpız",
    en: "Ice-cold refreshing, juicy, and sweet sliced watermelon",
    ru: "Ледяной освежающий, сочный и сладкий нарезанный арбуз"
  }
};

async function run() {
  const uri = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/af-hotel';
  console.log("Connecting to", uri);
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  const restaurants = await db.collection('restaurants').find({}).toArray();

  let totalUpdated = 0;

  for (let r of restaurants) {
    let changed = false;

    const processCategories = (categories) => {
      if (!categories) return;
      categories.forEach(cat => {
        if (!cat.items) return;
        cat.items.forEach(item => {
          const itemName = item.name?.az || item.name || '';
          const preciseDesc = descriptions[itemName];
          
          if (preciseDesc) {
            item.description = preciseDesc;
            changed = true;
            totalUpdated++;
          }
        });
      });
    };

    processCategories(r.menu);
    processCategories(r.menuCategories);

    if (changed) {
      console.log('Updating descriptions for restaurant:', r.name?.az || r.name?.en || r.name);
      await db.collection('restaurants').updateOne(
        { _id: r._id },
        { $set: { menu: r.menu, menuCategories: r.menuCategories } }
      );
    }
  }

  console.log(`Successfully updated ${totalUpdated} menu items with precise descriptions!`);
  await client.close();
}

run().catch(console.error);
