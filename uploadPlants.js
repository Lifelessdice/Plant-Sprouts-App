import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase.js';

const popularPlants = [
  {
    name: 'Monstera',
    image: 'monstera.jpg',
    generalInfo: 'Monstera prefers bright, indirect sunlight and weekly watering',
    preferredSoilMoisture: { min: 40, max: 60 },
    preferredHumidity: { min: 60, max: 80 },
    preferredTemperature: { min: 18, max: 27 },
    preferredLight: { min: 1000, max: 2500, unit: 'lux' },
    difficulty: 'medium.png',
    lightRecommendation: 'partial_sun.png',
    humidityRecommendation: 'high_humidity.png',
    toxicity: 'toxic.png',
    watering: 'weekly.png',
  },
  {
    name: 'Zamioculcas',
    image: 'zamioculcas.jpg',
    generalInfo: 'Zamioculcas thrives in low to medium light and tolerates dry soil',
    preferredSoilMoisture: { min: 20, max: 40 },
    preferredHumidity: { min: 40, max: 60 },
    preferredTemperature: { min: 15, max: 30 },
    preferredLight: { min: 300, max: 800, unit: 'lux' },
    difficulty: 'easy.png',
    lightRecommendation: 'partial_shade.png',
    humidityRecommendation: 'moderate_humidity.png',
    toxicity: 'toxic.png',
    watering: 'weekly.png',
  },
  {
    name: 'Orchid',
    image: 'orchid.jpg',
    generalInfo: 'Orchids need high humidity, warm temps, and indirect light',
    preferredSoilMoisture: { min: 50, max: 70 },
    preferredHumidity: { min: 60, max: 80 },
    preferredTemperature: { min: 18, max: 30 },
    preferredLight: { min: 1500, max: 3000, unit: 'lux' },
    difficulty: 'hard.png',
    lightRecommendation: 'partial_sun.png',
    humidityRecommendation: 'high_humidity.png',
    toxicity: 'non-toxic.png',
    watering: 'weekly.png',
  },
  {
    name: 'Coleus',
    image: 'coleus.jpg',
    generalInfo: 'Coleus enjoys moist soil and thrives in partial shade or indirect light',
    preferredSoilMoisture: { min: 40, max: 60 },
    preferredHumidity: { min: 50, max: 70 },
    preferredTemperature: { min: 16, max: 24 },
    preferredLight: { min: 1000, max: 2000, unit: 'lux' },
    difficulty: 'easy.png',
    lightRecommendation: 'partial_sun.png',
    humidityRecommendation: 'moderate_humidity.png',
    toxicity: 'toxic.png',
    watering: 'weekly.png',
  },
  {
    name: 'Snake Plant',
    image: 'snake_plant.jpg',
    generalInfo: 'Very tolerant plant that thrives in a variety of light and needs infrequent watering',
    preferredSoilMoisture: { min: 10, max: 30 },
    preferredHumidity: { min: 30, max: 50 },
    preferredTemperature: { min: 15, max: 29 },
    preferredLight: { min: 200, max: 1200, unit: 'lux' },
    difficulty: 'easy.png',
    lightRecommendation: 'partial_shade.png',
    humidityRecommendation: 'low_humidity.png',
    toxicity: 'toxic.png',
    watering: 'weekly.png',
  }
];

const uploadPlants = async () => {
  const plantsCollection = collection(db, 'plants');

  for (const plant of popularPlants) {
    await addDoc(plantsCollection, plant);
    console.log(`Uploaded: ${plant.name}`);
  }

  console.log('✅ All plants uploaded!');
};

uploadPlants();