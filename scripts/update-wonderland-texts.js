const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

async function run() {
  const uri = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/af-hotel';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('wonderlands');
    
    const w = await collection.findOne({});
    if (w) {
      const updateDoc = {
        $set: {
          smallAttractions: [
            {
              icon: '🎢',
              name: { az: 'Ekstremal Karusellər', en: 'Extreme Rides', ru: 'Экстремальные Карусели' },
              description: { az: '"Break Dance" və digər fırlanan attraksionlarla adrenalini hiss edin', en: 'Feel the adrenaline with "Break Dance" and other spinning rides', ru: 'Почувствуйте адреналин с "Break Dance" и другими вращающимися аттракционами' }
            },
            {
              icon: '🎠',
              name: { az: 'Ailəvi və Uşaq Zonası', en: 'Family & Kids Zone', ru: 'Семейная и Детская Зона' },
              description: { az: 'Zürafə karuselləri və uşaqlar üçün nağıl dünyası', en: 'Giraffe carousels and a fairy-tale world for children', ru: 'Карусели с жирафами и сказочный мир для детей' }
            },
            {
              icon: '🐊',
              name: { az: 'Tematik Dekorlar', en: 'Themed Decorations', ru: 'Тематические Декорации' },
              description: { az: 'Nəhəng timsahlar və heyvan fiqurları ilə bəzədilmiş füsunkar park', en: 'A fascinating park decorated with giant crocodiles and animal figures', ru: 'Очаровательный парк, украшенный огромными крокодилами и фигурами животных' }
            }
          ],
          bigAttractions: [
            {
              title: { az: 'Əsas Karusellər', en: 'Main Rides', ru: 'Главные Карусели' },
              items: [
                {
                  image: '/AF-aqua2.jpg',
                  name: { az: 'Break Dance', en: 'Break Dance', ru: 'Break Dance' },
                  description: { az: 'Sürətli və həyəcanverici fırlanan karusel', en: 'A fast and thrilling spinning carousel', ru: 'Быстрая и захватывающая вращающаяся карусель' }
                },
                {
                  image: '/AF-aqua.jpg',
                  name: { az: 'Kosmos Uçuşu', en: 'Space Flight', ru: 'Космический Полет' },
                  description: { az: 'Kosmik gəmi dizaynlı maraqlı fırlanan attraksion', en: 'An interesting spinning attraction with a spaceship design', ru: 'Интересный вращающийся аттракцион в виде космического корабля' }
                }
              ]
            },
            {
              title: { az: 'Uşaq Zonası', en: 'Kids Zone', ru: 'Детская Зона' },
              items: [
                {
                  image: '/AF-aqua.jpg',
                  name: { az: 'Zürafə Karuseli', en: 'Giraffe Carousel', ru: 'Карусель с Жирафами' },
                  description: { az: 'Balacaların sevimlisi olan rəngarəng və təhlükəsiz karusel', en: 'A colorful and safe carousel that is a favorite of the little ones', ru: 'Красочная и безопасная карусель - любимица малышей' }
                }
              ]
            },
            {
              title: { az: 'Tematik Zona', en: 'Themed Zone', ru: 'Тематическая Зона' },
              items: [
                {
                  image: '/AF-aqua.jpg',
                  name: { az: 'Safari Parkı', en: 'Safari Park', ru: 'Сафари-Парк' },
                  description: { az: 'Nəhəng timsah fiqurları ilə əhatə olunmuş fotogenik əyləncə sahəsi', en: 'A photogenic entertainment area surrounded by giant crocodile figures', ru: 'Фотогеничная развлекательная зона в окружении гигантских фигур крокодилов' }
                }
              ]
            }
          ]
        }
      };
      await collection.updateOne({ _id: w._id }, updateDoc);
      console.log('Successfully updated Wonderland data with real photos context.');
    } else {
      console.log('No Wonderland document found!');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}
run();
