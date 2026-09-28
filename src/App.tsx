/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MenuItem, CartItem, Order, Review } from './types';
import { 
  BAKERY_MENU, 
  BAKERY_EVENTS, 
  HOLIDAY_DISCOUNTS, 
  CUSTOMER_REVIEWS 
} from './data/mockBakeryData';

import { TopAnnouncementBar } from './components/TopAnnouncementBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DailySpecialsGallery } from './components/DailySpecialsGallery';
import { OnlineOrderMenu } from './components/OnlineOrderMenu';
import { EventsCalendar } from './components/EventsCalendar';
import { CustomerReviews } from './components/CustomerReviews';
import { NewsletterSignup } from './components/NewsletterSignup';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductCustomizationModal } from './components/ProductCustomizationModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { MobileQuickCart } from './components/MobileQuickCart';

export default function App() {
  // Cart state persisted in localStorage and synced with current prices
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('maison_cart');
      if (!saved) return [];
      const parsed: CartItem[] = JSON.parse(saved);
      return parsed.map(ci => {
        const fresh = BAKERY_MENU.find(m => m.id === ci.menuItem.id);
        return fresh ? { ...ci, menuItem: fresh } : ci;
      });
    } catch {
      return [];
    }
  });

  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('AUTUMN15');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reviews state persisted in localStorage
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('maison_reviews');
      return saved ? JSON.parse(saved) : CUSTOMER_REVIEWS;
    } catch {
      return CUSTOMER_REVIEWS;
    }
  });

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem('maison_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Save reviews changes
  useEffect(() => {
    try {
      localStorage.setItem('maison_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.error('Failed to save reviews to localStorage', e);
    }
  }, [reviews]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Add item to bag with customization
  const handleAddToCart = (
    item: MenuItem, 
    slicing?: 'whole' | 'sandwich' | 'thick', 
    notes?: string, 
    quantity = 1
  ) => {
    setCartItems(prev => {
      // Find if identical item with same slicing and notes exists
      const existingIndex = prev.findIndex(
        i => i.menuItem.id === item.id && i.slicingOption === slicing && i.notes === notes
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          menuItem: item,
          quantity,
          slicingOption: slicing,
          notes
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added ${quantity}x ${item.name} to your order bag`);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems(prev => prev.map(i => i.cartItemId === cartItemId ? { ...i, quantity: newQty } : i));
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleApplyPromoCode = (code: string) => {
    setAppliedPromoCode(code);
    if (code) {
      showToast(`Promo code ${code} applied to order bag!`);
    }
  };

  const handleAddReview = (newRev: Omit<Review, 'id' | 'date'>) => {
    const fullReview: Review = {
      ...newRev,
      id: `rev_${Date.now()}`,
      date: 'Just now'
    };
    setReviews(prev => [fullReview, ...prev]);
    showToast('Your review has been verified and published! Thank you.');
  };

  const handleScrollToMenu = () => {
    const menuEl = document.getElementById('menu');
    if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToSpecials = () => {
    const specialsEl = document.getElementById('specials');
    if (specialsEl) specialsEl.scrollIntoView({ behavior: 'smooth' });
  };

  // Calculate totals
  const totalItemCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const rawSubtotal = cartItems.reduce((acc, i) => acc + i.menuItem.price * i.quantity, 0);

  // Daily specials
  const dailySpecials = BAKERY_MENU.filter(item => item.isDailySpecial);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      
      {/* 1. Top Seasonal Announcement */}
      <TopAnnouncementBar
        onApplyPromoCode={handleApplyPromoCode}
        onNavigateToOrder={handleScrollToMenu}
      />

      {/* 2. Top Bar Navigation */}
      <Header
        cartCount={totalItemCount}
        cartTotal={rawSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        activeSection="home"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-[#2A211B] text-amber-50 px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium border border-stone-700/80 flex items-center gap-2 animate-in slide-in-from-top-2 duration-150">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Sections */}
      <main className="flex-1">
        
        {/* 3. Hero Section */}
        <Hero
          onOrderClick={handleScrollToMenu}
          onExploreSpecials={handleScrollToSpecials}
        />

        {/* 4. Daily Specials Gallery */}
        <DailySpecialsGallery
          specials={dailySpecials}
          onAddToCart={(item) => handleAddToCart(item, undefined, undefined, 1)}
          onSelectItem={(item) => setSelectedProduct(item)}
        />

        {/* 5. Online Order Menu */}
        <OnlineOrderMenu
          menuItems={BAKERY_MENU}
          onAddToCart={handleAddToCart}
          onSelectItem={(item) => setSelectedProduct(item)}
        />

        {/* 6. Events Calendar & Holiday Discounts */}
        <EventsCalendar
          events={BAKERY_EVENTS}
          discounts={HOLIDAY_DISCOUNTS}
          onApplyPromoCode={handleApplyPromoCode}
          onOrderClick={handleScrollToMenu}
        />

        {/* 7. Customer Reviews Section */}
        <CustomerReviews
          reviews={reviews}
          onAddReview={handleAddReview}
        />

        {/* 8. Newsletter Sign Up Form */}
        <NewsletterSignup
          onApplyPromoCode={handleApplyPromoCode}
        />

        {/* 9. Craftsmanship & Operating Hours */}
        <AboutSection />

      </main>

      {/* 10. Footer */}
      <Footer />

      {/* Mobile Floating Quick Cart (Respects 15% Mobile Sticky Cap) */}
      <MobileQuickCart
        cartCount={totalItemCount}
        cartTotal={rawSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Product Customization Modal */}
      <ProductCustomizationModal
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-out Cart Drawer & Checkout Flow */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        appliedPromoCode={appliedPromoCode}
        onApplyPromoCode={handleApplyPromoCode}
        onOrderPlaced={(order) => {
          setIsCartOpen(false);
          setCompletedOrder(order);
        }}
      />

      {/* Post-Order Confirmation & Live Tracker Modal */}
      <OrderConfirmationModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />

    </div>
  );
}
