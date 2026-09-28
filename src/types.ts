export type MenuCategory = 
  | 'all'
  | 'sourdough'
  | 'viennoiserie'
  | 'daily_specials'
  | 'savory'
  | 'tarts_cakes'
  | 'pantry_drinks';

export interface MenuItem {
  id: string;
  name: string;
  category: 'sourdough' | 'viennoiserie' | 'daily_specials' | 'savory' | 'tarts_cakes' | 'pantry_drinks';
  price: number;
  description: string;
  image: string;
  allergens: string[];
  dietary: ('vegan' | 'vegetarian' | 'nut-free' | 'dairy-free' | 'sourdough')[];
  isDailySpecial?: boolean;
  bakeTime?: string;
  stockRemaining: number;
  allowSlicing?: boolean;
  bakersNote?: string;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  slicingOption?: 'whole' | 'sandwich' | 'thick';
  notes?: string;
}

export interface BakeryEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  category: 'workshop' | 'tasting' | 'holiday' | 'community';
  description: string;
  price: number; // 0 for free community events
  spotsTotal: number;
  spotsLeft: number;
  image: string;
  instructor?: string;
  holidayDiscountCode?: string;
  discountPercent?: number;
}

export interface HolidayDiscount {
  code: string;
  title: string;
  discountPercent: number;
  description: string;
  validUntil: string;
  minOrder?: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
  itemPurchased: string;
  neighborhood?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  deliveryFee: number;
  tip: number;
  total: number;
  orderType: 'pickup' | 'delivery';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress?: string;
  pickupDate: string;
  pickupTime: string;
  specialInstructions?: string;
  status: 'received' | 'baking' | 'ready';
}
