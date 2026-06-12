import { Template, syncDatabase } from '../models/index.js';

const templates = [
  { id: 1, title: 'Fitness Reel', category: 'Fitness', tags: ['gym', 'workout', 'health'], thumbnail: 'https://picsum.photos/seed/fitness1/400/500', description: 'Modern fitness reel template with bold typography and energetic transitions.' },
  { id: 2, title: 'Gym Promotion', category: 'Fitness', tags: ['gym', 'trainer', 'promo'], thumbnail: 'https://picsum.photos/seed/fitness2/400/500', description: 'Promote your gym membership with this high-impact carousel template.' },
  { id: 3, title: 'Morning Workout', category: 'Fitness', tags: ['workout', 'morning', 'routine'], thumbnail: 'https://picsum.photos/seed/fitness3/400/500', description: 'Share your morning workout routine with clean, motivational slides.' },
  { id: 4, title: 'Yoga Flow Story', category: 'Fitness', tags: ['yoga', 'health', 'wellness'], thumbnail: 'https://picsum.photos/seed/fitness4/400/500', description: 'Calm yoga story template with soft gradients and mindful captions.' },
  { id: 5, title: 'Protein Recipe Reel', category: 'Fitness', tags: ['nutrition', 'health', 'food'], thumbnail: 'https://picsum.photos/seed/fitness5/400/500', description: 'Showcase high-protein meals for your fitness audience.' },
  { id: 6, title: 'Startup Pitch Deck', category: 'Business', tags: ['startup', 'pitch', 'investor'], thumbnail: 'https://picsum.photos/seed/business1/400/500', description: 'Professional carousel for pitching your startup on social media.' },
  { id: 7, title: 'LinkedIn Growth Tips', category: 'Business', tags: ['linkedin', 'career', 'tips'], thumbnail: 'https://picsum.photos/seed/business2/400/500', description: 'Share actionable LinkedIn growth tips in a swipeable format.' },
  { id: 8, title: 'Freelancer Portfolio', category: 'Business', tags: ['freelance', 'portfolio', 'creative'], thumbnail: 'https://picsum.photos/seed/business3/400/500', description: 'Highlight your freelance work with a sleek portfolio reel.' },
  { id: 9, title: 'Product Launch Announcement', category: 'Business', tags: ['launch', 'product', 'marketing'], thumbnail: 'https://picsum.photos/seed/business4/400/500', description: 'Build hype for your product launch with countdown-style slides.' },
  { id: 10, title: 'Remote Work Guide', category: 'Business', tags: ['remote', 'productivity', 'tips'], thumbnail: 'https://picsum.photos/seed/business5/400/500', description: 'Educate your audience on remote work best practices.' },
  { id: 11, title: 'Street Style Lookbook', category: 'Fashion', tags: ['streetwear', 'outfit', 'style'], thumbnail: 'https://picsum.photos/seed/fashion1/400/500', description: 'Showcase street style outfits in a trendy lookbook reel.' },
  { id: 12, title: 'Summer Collection Drop', category: 'Fashion', tags: ['summer', 'collection', 'brand'], thumbnail: 'https://picsum.photos/seed/fashion2/400/500', description: 'Announce your summer collection with vibrant fashion slides.' },
  { id: 13, title: 'OOTD Carousel', category: 'Fashion', tags: ['outfit', 'daily', 'style'], thumbnail: 'https://picsum.photos/seed/fashion3/400/500', description: 'Share your outfit of the day with minimal, chic layouts.' },
  { id: 14, title: 'Sustainable Fashion Tips', category: 'Fashion', tags: ['sustainable', 'eco', 'tips'], thumbnail: 'https://picsum.photos/seed/fashion4/400/500', description: 'Promote sustainable fashion with earthy tones and clean design.' },
  { id: 15, title: 'Accessories Showcase', category: 'Fashion', tags: ['accessories', 'jewelry', 'brand'], thumbnail: 'https://picsum.photos/seed/fashion5/400/500', description: 'Highlight accessories with close-up product-focused frames.' },
  { id: 16, title: 'Brunch Menu Reel', category: 'Food', tags: ['brunch', 'restaurant', 'menu'], thumbnail: 'https://picsum.photos/seed/food1/400/500', description: 'Display your brunch menu in a mouth-watering reel format.' },
  { id: 17, title: 'Recipe Tutorial', category: 'Food', tags: ['recipe', 'cooking', 'tutorial'], thumbnail: 'https://picsum.photos/seed/food2/400/500', description: 'Step-by-step recipe tutorial with numbered slide transitions.' },
  { id: 18, title: 'Coffee Shop Promo', category: 'Food', tags: ['coffee', 'cafe', 'promo'], thumbnail: 'https://picsum.photos/seed/food3/400/500', description: 'Warm, cozy template for promoting your coffee shop specials.' },
  { id: 19, title: 'Vegan Meal Prep', category: 'Food', tags: ['vegan', 'mealprep', 'health'], thumbnail: 'https://picsum.photos/seed/food4/400/500', description: 'Share weekly vegan meal prep ideas with fresh green aesthetics.' },
  { id: 20, title: 'Dessert Showcase', category: 'Food', tags: ['dessert', 'baking', 'sweet'], thumbnail: 'https://picsum.photos/seed/food5/400/500', description: 'Show off your baked goods with indulgent close-up slides.' },
  { id: 21, title: 'Beach Vacation Vlog', category: 'Travel', tags: ['beach', 'vacation', 'vlog'], thumbnail: 'https://picsum.photos/seed/travel1/400/500', description: 'Capture beach vacation memories in a cinematic reel template.' },
  { id: 22, title: 'City Guide Carousel', category: 'Travel', tags: ['city', 'guide', 'explore'], thumbnail: 'https://picsum.photos/seed/travel2/400/500', description: 'Create a city travel guide with map pins and location tags.' },
  { id: 23, title: 'Mountain Adventure Reel', category: 'Travel', tags: ['mountain', 'adventure', 'hiking'], thumbnail: 'https://picsum.photos/seed/travel3/400/500', description: 'Epic mountain adventure template with dramatic transitions.' },
  { id: 24, title: 'Budget Travel Tips', category: 'Travel', tags: ['budget', 'tips', 'backpack'], thumbnail: 'https://picsum.photos/seed/travel4/400/500', description: 'Share budget travel hacks in an easy-to-read carousel.' },
  { id: 25, title: 'Luxury Hotel Review', category: 'Travel', tags: ['hotel', 'luxury', 'review'], thumbnail: 'https://picsum.photos/seed/travel5/400/500', description: 'Review luxury hotels with elegant gold-accented layouts.' },
  { id: 26, title: 'Study With Me Reel', category: 'Education', tags: ['study', 'productivity', 'student'], thumbnail: 'https://picsum.photos/seed/education1/400/500', description: 'Motivate students with a cozy study-with-me reel template.' },
  { id: 27, title: 'Online Course Promo', category: 'Education', tags: ['course', 'online', 'learning'], thumbnail: 'https://picsum.photos/seed/education2/400/500', description: 'Promote your online course with clear benefit-driven slides.' },
  { id: 28, title: 'Book Review Carousel', category: 'Education', tags: ['books', 'reading', 'review'], thumbnail: 'https://picsum.photos/seed/education3/400/500', description: 'Share book reviews with quote highlights and ratings.' },
  { id: 29, title: 'Language Learning Tips', category: 'Education', tags: ['language', 'learning', 'tips'], thumbnail: 'https://picsum.photos/seed/education4/400/500', description: 'Teach language learning strategies in bite-sized slides.' },
  { id: 30, title: 'Exam Prep Checklist', category: 'Education', tags: ['exam', 'study', 'checklist'], thumbnail: 'https://picsum.photos/seed/education5/400/500', description: 'Help students prepare for exams with a checklist carousel.' },
  { id: 31, title: 'CrossFit Challenge', category: 'Fitness', tags: ['crossfit', 'challenge', 'workout'], thumbnail: 'https://picsum.photos/seed/fitness6/400/500', description: 'Launch a 30-day CrossFit challenge with progress tracking slides.' },
  { id: 32, title: 'Minimalist Wardrobe', category: 'Fashion', tags: ['minimalist', 'capsule', 'style'], thumbnail: 'https://picsum.photos/seed/fashion6/400/500', description: 'Build a capsule wardrobe guide with clean minimalist design.' },
  { id: 33, title: 'Food Truck Launch', category: 'Food', tags: ['foodtruck', 'launch', 'streetfood'], thumbnail: 'https://picsum.photos/seed/food6/400/500', description: 'Announce your food truck launch with bold street-food vibes.' },
  { id: 34, title: 'Digital Nomad Life', category: 'Travel', tags: ['nomad', 'remote', 'lifestyle'], thumbnail: 'https://picsum.photos/seed/travel6/400/500', description: 'Document digital nomad lifestyle across stunning locations.' },
  { id: 35, title: 'Side Hustle Ideas', category: 'Business', tags: ['sidehustle', 'income', 'tips'], thumbnail: 'https://picsum.photos/seed/business6/400/500', description: 'Share side hustle ideas for aspiring entrepreneurs.' },
];

async function seed() {
  await syncDatabase();
  await Template.bulkCreate(templates, { ignoreDuplicates: true });
  console.log('Seeded 35 templates successfully');
  process.exit(0);
}

seed();
