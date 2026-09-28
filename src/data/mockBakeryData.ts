import { MenuItem, BakeryEvent, HolidayDiscount, Review } from '../types';

export const BAKERY_MENU: MenuItem[] = [
  {
    id: 'sourdough-country-boule',
    name: 'Wild Levain Country Boule',
    category: 'sourdough',
    price: 320,
    description: '36-hour slow cold fermentation with stoneground organic wheat, dark rye, and natural wild yeast starter. Blistered caramel crust with custard-like open crumb.',
    image: '/src/assets/images/artisan_sourdough_loaf_1790578391134.jpg',
    allergens: ['Wheat (Gluten)'],
    dietary: ['vegan', 'sourdough'],
    stockRemaining: 8,
    allowSlicing: true,
    isDailySpecial: true,
    bakeTime: '7:00 AM & 12:00 PM',
    bakersNote: 'Stoneground in-house at 82% hydration. Best toasted with salted butter or paired with aged sharp cheddar.'
  },
  {
    id: 'sourdough-roasted-garlic-rosemary',
    name: 'Roasted Garlic & Fresh Rosemary Batard',
    category: 'sourdough',
    price: 360,
    description: 'Slow-roasted confit garlic cloves and garden-grown rosemary folded into a hearty wild sourdough base. Aromatic, deeply savory, and tender.',
    image: '/src/assets/images/artisan_sourdough_loaf_1790578391134.jpg',
    allergens: ['Wheat (Gluten)'],
    dietary: ['vegan', 'sourdough'],
    stockRemaining: 5,
    allowSlicing: true,
    isDailySpecial: false,
    bakeTime: '7:30 AM',
    bakersNote: 'We roast 40 heads of fresh garlic daily in olive oil for this signature loaf.'
  },
  {
    id: 'sourdough-danish-seeded-rye',
    name: 'Danish Dark Seeded Rugbrød',
    category: 'sourdough',
    price: 340,
    description: 'Traditional Nordic dense 100% rye sourdough packed with cracked rye berries, toasted sunflower, pumpkin, and flax seeds. Fermented for 48 hours.',
    image: '/src/assets/images/artisan_sourdough_loaf_1790578391134.jpg',
    allergens: ['Rye (Gluten)'],
    dietary: ['vegan', 'sourdough'],
    stockRemaining: 6,
    allowSlicing: true,
    isDailySpecial: false,
    bakeTime: '6:30 AM',
    bakersNote: 'The ultimate smørrebrød foundation. Dense, nutty, stays fresh for up to a week.'
  },
  {
    id: 'french-butter-croissant',
    name: 'Traditional French Butter Croissant',
    category: 'viennoiserie',
    price: 180,
    description: '27 laminated layers of high-butterfat cultured butter. Ultra-crisp exterior with ethereal, featherlight honeycomb interior.',
    image: '/src/assets/images/french_pastry_croissant_1790578404688.jpg',
    allergens: ['Wheat (Gluten)', 'Milk', 'Eggs'],
    dietary: ['vegetarian'],
    stockRemaining: 14,
    allowSlicing: false,
    isDailySpecial: true,
    bakeTime: '8:00 AM & 1:30 PM',
    bakersNote: 'Baked in small batches twice a day so you always get them crisp and warm.'
  },
  {
    id: 'pain-au-chocolat',
    name: 'Valrhona Pain au Chocolat',
    category: 'viennoiserie',
    price: 210,
    description: 'Flaky golden laminated croissant dough enfolding twin batons of Valrhona 66% dark chocolate. Melts delicately at room temperature.',
    image: '/src/assets/images/french_pastry_croissant_1790578404688.jpg',
    allergens: ['Wheat (Gluten)', 'Milk', 'Eggs', 'Soy'],
    dietary: ['vegetarian'],
    stockRemaining: 9,
    allowSlicing: false,
    isDailySpecial: false,
    bakeTime: '8:15 AM',
    bakersNote: 'Single-origin French dark chocolate with bittersweet red fruit notes.'
  },
  {
    id: 'cardamom-morning-bun',
    name: 'Swedish Crushed Cardamom Bun',
    category: 'viennoiserie',
    price: 190,
    description: 'Enriched brioche dough woven with freshly ground green cardamom pods, sweet cultured butter, and crystallized pearl sugar.',
    image: '/src/assets/images/french_pastry_croissant_1790578404688.jpg',
    allergens: ['Wheat (Gluten)', 'Milk', 'Eggs'],
    dietary: ['vegetarian'],
    stockRemaining: 7,
    allowSlicing: false,
    isDailySpecial: true,
    bakeTime: '8:45 AM',
    bakersNote: 'We hand-grind whole green cardamom every morning. The signature scent of our bakery!'
  },
  {
    id: 'tart-autumn-fig-mascarpone',
    name: 'Autumn Black Mission Fig & Mascarpone Tart',
    category: 'tarts_cakes',
    price: 290,
    description: 'Pâte sablée butter crust filled with vanilla bean mascarpone mousse, sliced juicy Black Mission figs, honey drizzle, and roasted pistachios.',
    image: '/src/assets/images/holiday_seasonal_tart_1790578417223.jpg',
    allergens: ['Wheat (Gluten)', 'Milk', 'Eggs', 'Tree Nuts (Pistachio)'],
    dietary: ['vegetarian'],
    stockRemaining: 4,
    allowSlicing: false,
    isDailySpecial: true,
    bakeTime: '9:30 AM',
    bakersNote: 'Limited seasonal run during peak late-harvest fig season. Chef favorite.'
  },
  {
    id: 'tart-spiced-pear-frangipane',
    name: 'Spiced Bosc Pear & Almond Frangipane Tart',
    category: 'tarts_cakes',
    price: 280,
    description: 'Poached local pears with cinnamon and star anise, nestled into sweet almond cream inside a caramelized shortbread crust.',
    image: '/src/assets/images/holiday_seasonal_tart_1790578417223.jpg',
    allergens: ['Wheat (Gluten)', 'Milk', 'Eggs', 'Tree Nuts (Almond)'],
    dietary: ['vegetarian'],
    stockRemaining: 8,
    allowSlicing: false,
    isDailySpecial: false,
    bakeTime: '9:00 AM',
    bakersNote: 'Warmed gently in the oven for 3 minutes transforms this into dessert perfection.'
  },
  {
    id: 'savory-wild-mushroom-gruyere',
    name: 'Wild Chanterelle & Cave-Aged Gruyère Danish',
    category: 'savory',
    price: 260,
    description: 'Square flaky puff pastry topped with sautéed wild chanterelles, shallots, thyme, crème fraîche, and 12-month cave-aged Swiss Gruyère.',
    image: '/src/assets/images/french_pastry_croissant_1790578404688.jpg',
    allergens: ['Wheat (Gluten)', 'Milk', 'Eggs'],
    dietary: ['vegetarian'],
    stockRemaining: 6,
    allowSlicing: false,
    isDailySpecial: true,
    bakeTime: '11:00 AM',
    bakersNote: 'Savory lunch staple. Chanterelles foraged sustainably from coastal pine forests.'
  },
  {
    id: 'savory-heirloom-focaccia',
    name: 'Heritage Tomato & Herb Sea Salt Focaccia Slab',
    category: 'savory',
    price: 240,
    description: 'High-hydration Italian dough dimpled with early harvest Tuscan olive oil, sweet heirloom cherry tomatoes, fresh rosemary, and Maldon sea salt flakes.',
    image: '/src/assets/images/artisan_sourdough_loaf_1790578391134.jpg',
    allergens: ['Wheat (Gluten)'],
    dietary: ['vegan'],
    stockRemaining: 11,
    allowSlicing: false,
    isDailySpecial: true,
    bakeTime: '11:30 AM',
    bakersNote: 'Crisp bottom crust with an incredibly pillowy, olive-oil soaked crumb.'
  },
  {
    id: 'pantry-cultured-sea-salt-butter',
    name: 'Maison Cultured Salted Butter (200g)',
    category: 'pantry_drinks',
    price: 250,
    description: 'Slow-churned from organic grass-fed cream cultured for 48 hours, finished with hand-harvested Celtic grey salt crystals.',
    image: '/src/assets/images/artisan_sourdough_loaf_1790578391134.jpg',
    allergens: ['Milk'],
    dietary: ['vegetarian'],
    stockRemaining: 18,
    allowSlicing: false,
    isDailySpecial: false,
    bakersNote: 'Tangy, complex, and unctuous. Designed to elevate our warm wild sourdough.'
  },
  {
    id: 'drink-house-iced-cortado',
    name: 'Artisan Espresso Cortado / Flat White',
    category: 'pantry_drinks',
    price: 180,
    description: 'Double shot of locally roasted Ethiopian heirloom espresso, balanced with textured whole milk or organic oat milk.',
    image: '/src/assets/images/bakery_hero_artisan_1790578373661.jpg',
    allergens: ['Milk (Optional)'],
    dietary: ['vegetarian'],
    stockRemaining: 50,
    allowSlicing: false,
    isDailySpecial: false,
    bakersNote: 'Floral and berry tasting notes that pair cleanly with butter croissants.'
  }
];

export const DAILY_OVEN_SCHEDULE = [
  { time: '07:00 AM', items: 'Wild Levain Country Boules & Danish Rugbrød', badge: 'Fresh out of the oven' },
  { time: '08:00 AM', items: 'Butter Croissants, Pain au Chocolat & Kouign-Amann', badge: 'Hot & Golden' },
  { time: '09:00 AM', items: 'Cardamom Buns, Fruit Tarts & Almond Brioche', badge: 'Morning Sweet Drop' },
  { time: '11:30 AM', items: 'Tomato Focaccia & Wild Chanterelle Danishes', badge: 'Midday Lunch Drop' },
  { time: '02:00 PM', items: 'Afternoon Tea Pastries & Second Sourdough Pull', badge: 'Afternoon Refresh' },
];

export const BAKERY_EVENTS: BakeryEvent[] = [
  {
    id: 'event-sourdough-masterclass',
    title: 'Wild Sourdough: Starter to Loaf Masterclass',
    date: '2026-10-08',
    time: '6:00 PM – 8:30 PM',
    category: 'workshop',
    description: 'An intimate, hands-on workshop led by head baker Mathieu. Master hydration management, dough fermentation signs, scoring techniques, and take home a jar of our 12-year-old starter "Céleste" and a proofing basket.',
    price: 2499,
    spotsTotal: 10,
    spotsLeft: 3,
    image: '/src/assets/images/bakery_workshop_event_1790578430928.jpg',
    instructor: 'Mathieu Laurent (Head Baker)',
    holidayDiscountCode: 'WORKSHOP10',
    discountPercent: 10
  },
  {
    id: 'event-autumn-harvest-tasting',
    title: 'Autumn Harvest Pastry Preview & Spiced Tea Tasting',
    date: '2026-10-15',
    time: '10:00 AM – 1:00 PM',
    category: 'tasting',
    description: 'Sample our upcoming autumn and holiday menu: spiced pear tarts, pumpkin brioche buns, and hazelnut galettes paired with warm spiced orchard tea. Walk-ins welcome, reservations include a pastry sampler box.',
    price: 799,
    spotsTotal: 40,
    spotsLeft: 12,
    image: '/src/assets/images/holiday_seasonal_tart_1790578417223.jpg',
    instructor: 'Pastry Chef Emilie Chen',
    holidayDiscountCode: 'AUTUMN15',
    discountPercent: 15
  },
  {
    id: 'event-croissant-lamination',
    title: 'Weekend French Viennoiserie & Lamination Lab',
    date: '2026-10-24',
    time: '8:30 AM – 12:00 PM',
    category: 'workshop',
    description: 'Discover the exact physics of butter folding, temperature windows, and proofing that yield 27 razor-thin flaky layers. Roll, shape, bake, and eat fresh hot croissants straight from the deck oven.',
    price: 2899,
    spotsTotal: 8,
    spotsLeft: 2,
    image: '/src/assets/images/bakery_workshop_event_1790578430928.jpg',
    instructor: 'Mathieu Laurent',
    holidayDiscountCode: 'BAKERLAB',
    discountPercent: 10
  },
  {
    id: 'event-halloween-family-baking',
    title: 'Little Bakers: Spooky Brioche & Cookie Decorating',
    date: '2026-10-31',
    time: '2:00 PM – 4:00 PM',
    category: 'holiday',
    description: 'A festive community afternoon for families. Kids and parents shape pumpkin brioche monsters, decorate spooky spiced butter cookies with natural plant dyes, and enjoy hot cocoa.',
    price: 999,
    spotsTotal: 25,
    spotsLeft: 7,
    image: '/src/assets/images/bakery_workshop_event_1790578430928.jpg',
    instructor: 'Claire & The Maison Team',
    holidayDiscountCode: 'SPOOKY10',
    discountPercent: 10
  },
  {
    id: 'event-thanksgiving-pie-kickoff',
    title: 'Holiday Pie & Stollen Pre-Order Tasting',
    date: '2026-11-12',
    time: '11:00 AM – 3:00 PM',
    category: 'holiday',
    description: 'Reserve your holiday dinner centerpiece! Complimentary slice tastings of our signature Salted Caramel Honey Apple Pie, Bourbon Pecan Tart, and Traditional Dresden Stollen with rum-soaked fruit.',
    price: 0,
    spotsTotal: 100,
    spotsLeft: 46,
    image: '/src/assets/images/holiday_seasonal_tart_1790578417223.jpg',
    instructor: 'Chef Emilie Chen',
    holidayDiscountCode: 'EARLYBIRD',
    discountPercent: 12
  }
];

export const HOLIDAY_DISCOUNTS: HolidayDiscount[] = [
  {
    code: 'AUTUMN15',
    title: 'Autumn Harvest Kickoff',
    discountPercent: 15,
    description: '15% off all online orders over ₹750 during our seasonal pastry debut.',
    validUntil: 'October 31, 2026',
    minOrder: 750
  },
  {
    code: 'EARLYBIRD',
    title: 'Holiday Pies & Breads Pre-Order',
    discountPercent: 12,
    description: '12% off any pre-order over ₹900 placed in advance for upcoming holidays and family gatherings.',
    validUntil: 'November 20, 2026',
    minOrder: 900
  },
  {
    code: 'SWEETTREAT',
    title: 'Viennoiserie Box Discount',
    discountPercent: 10,
    description: '10% off your morning pastry bundle on orders over ₹450.',
    validUntil: 'November 30, 2026',
    minOrder: 450
  },
  {
    code: 'FRESHCRUST10',
    title: 'Newsletter Welcome Perk',
    discountPercent: 10,
    description: 'Exclusive 10% coupon given instantly to community newsletter subscribers.',
    validUntil: 'December 31, 2026'
  }
];

export const CUSTOMER_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Elena Rostova',
    rating: 5,
    date: 'Yesterday',
    comment: 'The Wild Levain Country Boule has ruined all grocery store bread for me permanently. The crust is blistered and sings when it cools down, and the open crumb has that clean sourdough tang you can only get from real stoneground grain.',
    verifiedBuyer: true,
    itemPurchased: 'Wild Levain Country Boule',
    neighborhood: 'North End'
  },
  {
    id: 'rev-2',
    author: 'Marcus Vance',
    rating: 5,
    date: '3 days ago',
    comment: 'I attended the Sourdough Starter Masterclass last weekend. Mathieu is extraordinarily generous with his knowledge. The starter I took home is bubbling on my kitchen counter, and my family loved the loaves. Worth every single rupee!',
    verifiedBuyer: true,
    itemPurchased: 'Sourdough Masterclass Workshop',
    neighborhood: 'Highland Park'
  },
  {
    id: 'rev-3',
    author: 'Sophia Lin',
    rating: 5,
    date: '1 week ago',
    comment: 'Online pickup ordering was seamless. Ordered at 7:15 AM on my phone, walked over at 8:05 AM, and my box of warm croissants and the fig mascarpone tart were boxed with a handwritten note. The cardamom bun is truly out of this world.',
    verifiedBuyer: true,
    itemPurchased: 'Cardamom Bun & Fig Tart',
    neighborhood: 'Old Town'
  },
  {
    id: 'rev-4',
    author: 'David & Hannah K.',
    rating: 5,
    date: '2 weeks ago',
    comment: 'We used the AUTUMN15 discount to order a dozen pastries and two batards for our family brunch. The chanterelle Danish was devoured in minutes. Support this bakery—they are an absolute gem for our neighborhood.',
    verifiedBuyer: true,
    itemPurchased: 'Chanterelle Danish & Croissants',
    neighborhood: 'Riverside'
  }
];
