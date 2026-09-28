import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  Check, 
  Bike, 
  Store, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { formatINR } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  appliedPromoCode: string;
  onApplyPromoCode: (code: string) => void;
  onOrderPlaced: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  appliedPromoCode,
  onApplyPromoCode,
  onOrderPlaced,
}) => {
  const [promoInput, setPromoInput] = useState(appliedPromoCode || '');
  const [promoError, setPromoError] = useState('');
  const [promoSuccessMsg, setPromoSuccessMsg] = useState('');
  
  // Checkout fields
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pickupDate, setPickupDate] = useState('Today');
  const [pickupTime, setPickupTime] = useState('8:30 AM – 9:00 AM');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Subtotal calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  // Validate discount code
  let discountPercent = 0;
  const upperCode = appliedPromoCode.trim().toUpperCase();
  if (upperCode === 'AUTUMN15') discountPercent = 15;
  else if (upperCode === 'EARLYBIRD') discountPercent = 12;
  else if (upperCode === 'SWEETTREAT') discountPercent = 10;
  else if (upperCode === 'FRESHCRUST10') discountPercent = 10;
  else if (upperCode === 'SPOOKY10') discountPercent = 10;
  else if (upperCode === 'WORKSHOP10') discountPercent = 10;
  else if (upperCode === 'BAKERLAB') discountPercent = 10;

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  // Free delivery over ₹1,000, otherwise ₹99
  const deliveryFee = orderType === 'delivery' ? (subtotal >= 1000 ? 0 : 99) : 0;
  const tipAmount = Math.round(((subtotal - discountAmount) * tipPercent) / 100);
  const total = Math.max(0, subtotal - discountAmount + deliveryFee + tipAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccessMsg('');
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (['AUTUMN15', 'EARLYBIRD', 'SWEETTREAT', 'FRESHCRUST10', 'SPOOKY10', 'WORKSHOP10', 'BAKERLAB'].includes(code)) {
      onApplyPromoCode(code);
      setPromoSuccessMsg(`Coupon ${code} applied successfully!`);
      setTimeout(() => setPromoSuccessMsg(''), 3000);
    } else {
      setPromoError('Invalid coupon code. Try AUTUMN15, EARLYBIRD, or SWEETTREAT.');
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) {
      alert('Please fill in your name, email, and phone number for pickup notifications.');
      return;
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      alert('Please provide a delivery address for the bicycle courier.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderNumber = `MD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        orderNumber,
        createdAt: new Date().toISOString(),
        items: [...cartItems],
        subtotal,
        discountAmount,
        discountCode: appliedPromoCode || undefined,
        deliveryFee,
        tip: tipAmount,
        total,
        orderType,
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
        pickupDate,
        pickupTime,
        specialInstructions,
        status: 'received',
      };

      // Persist order in localStorage
      const orders = JSON.parse(localStorage.getItem('maison_orders') || '[]');
      orders.unshift(newOrder);
      localStorage.setItem('maison_orders', JSON.stringify(orders));

      setIsSubmitting(false);
      onOrderPlaced(newOrder);
      onClearCart();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-lg bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#A86D2C]" />
            <h2 id="cart-title" className="font-serif text-xl font-bold text-stone-900">
              Your Bakery Order Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            aria-label="Close bag"
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Cart Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
              <p className="font-serif text-lg text-stone-800">Your bag is empty</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore our wild sourdough loaves, morning croissants, and fresh daily specials.
              </p>
              <button
                onClick={onClose}
                type="button"
                className="mt-2 px-5 py-2.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors"
              >
                Browse The Bakery Menu
              </button>
            </div>
          ) : (
            <>
              {/* Itemized List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500 pb-1">
                  <span>Selected Bakes</span>
                  <button
                    onClick={onClearCart}
                    type="button"
                    className="text-stone-400 hover:text-red-700 font-normal normal-case"
                  >
                    Clear All
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs flex gap-3.5 items-center"
                  >
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0 bg-stone-100"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-stone-900 truncate font-serif">
                        {item.menuItem.name}
                      </h4>
                      
                      {item.slicingOption && (
                        <p className="text-[11px] text-[#A86D2C] capitalize">
                          Slice: {item.slicingOption === 'whole' ? 'Whole Loaf' : `${item.slicingOption} slice`}
                        </p>
                      )}

                      {item.notes && (
                        <p className="text-[11px] text-stone-500 italic truncate">
                          Note: “{item.notes}”
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-mono text-xs font-semibold text-stone-900 tabular-nums">
                          {formatINR(item.menuItem.price * item.quantity)}
                        </span>

                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                            type="button"
                            aria-label="Decrease quantity"
                            className="p-1 text-stone-600 hover:text-stone-900 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold font-mono tabular-nums text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                            type="button"
                            aria-label="Increase quantity"
                            className="p-1 text-stone-600 hover:text-stone-900 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.cartItemId)}
                      type="button"
                      aria-label="Remove item"
                      className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="p-4 rounded-xl bg-white border border-stone-200/90 space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
                  <Tag className="w-3.5 h-3.5 text-[#A86D2C]" />
                  <span>Holiday Promo / Discount Code</span>
                </label>
                
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. AUTUMN15, EARLYBIRD"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs uppercase font-mono tracking-wider bg-stone-50 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#A86D2C]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-stone-900 hover:bg-[#A86D2C] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {discountPercent > 0 && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 font-medium pt-1">
                    <span>Active: {appliedPromoCode} ({discountPercent}% OFF)</span>
                    <button
                      onClick={() => {
                        onApplyPromoCode('');
                        setPromoInput('');
                      }}
                      type="button"
                      className="text-[11px] text-stone-400 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {promoError && (
                  <p className="text-[11px] text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{promoError}</span>
                  </p>
                )}
                {promoSuccessMsg && (
                  <p className="text-[11px] text-emerald-700 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>{promoSuccessMsg}</span>
                  </p>
                )}
              </div>

              {/* Fulfillment Option */}
              <div className="p-4 rounded-xl bg-white border border-stone-200/90 space-y-3">
                <span className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Fulfillment Method
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      orderType === 'pickup'
                        ? 'border-[#A86D2C] bg-amber-50/70 text-stone-900 ring-1 ring-[#A86D2C]'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <Store className="w-4 h-4 text-[#A86D2C] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-semibold">Store Pickup</span>
                      <span className="block text-[11px] text-stone-500">Free · Ready fast</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      orderType === 'delivery'
                        ? 'border-[#A86D2C] bg-amber-50/70 text-stone-900 ring-1 ring-[#A86D2C]'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <Bike className="w-4 h-4 text-[#A86D2C] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-semibold">Bicycle Courier</span>
                      <span className="block text-[11px] text-stone-500">{subtotal >= 1000 ? 'Free (over ₹1,000)' : '₹99'}</span>
                    </div>
                  </button>
                </div>

                {/* Pickup Date & Slot */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Pickup / Delivery Day
                    </label>
                    <select
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-stone-50 rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#A86D2C]"
                    >
                      <option value="Today">Today (Fresh Pull)</option>
                      <option value="Tomorrow">Tomorrow Morning</option>
                      <option value="This Saturday">Saturday Weekend Drop</option>
                      <option value="This Sunday">Sunday Brunch Batch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Time Slot
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-stone-50 rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#A86D2C]"
                    >
                      <option value="7:30 AM – 8:00 AM">7:30 AM – 8:00 AM (Warm bread)</option>
                      <option value="8:30 AM – 9:00 AM">8:30 AM – 9:00 AM (Croissant drop)</option>
                      <option value="11:30 AM – 12:00 PM">11:30 AM – 12:00 PM (Lunch pull)</option>
                      <option value="1:30 PM – 2:00 PM">1:30 PM – 2:00 PM (Afternoon)</option>
                    </select>
                  </div>
                </div>

                {orderType === 'delivery' && (
                  <div className="pt-2 border-t border-stone-100">
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Local Delivery Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Street address, unit #, locality, pin code"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#A86D2C]"
                    />
                  </div>
                )}
              </div>

              {/* Customer Contact Information */}
              <div className="p-4 rounded-xl bg-white border border-stone-200/90 space-y-3">
                <span className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Contact Information
                </span>

                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#A86D2C]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Email Address *"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#A86D2C]"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Mobile Phone *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#A86D2C]"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Pickup instructions (e.g. Leave in gift box, bring bag)"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#A86D2C]"
                  />
                </div>

                {/* Baker Tip Selection */}
                <div className="pt-2 border-t border-stone-100">
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1.5">
                    Baker & Kitchen Staff Tip
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0, 5, 10, 15].map((percent) => (
                      <button
                        key={percent}
                        type="button"
                        onClick={() => setTipPercent(percent)}
                        className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                          tipPercent === percent
                            ? 'bg-[#2A211B] text-amber-50'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {percent === 0 ? 'None' : `${percent}%`}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}

        </div>

        {/* Footer: Totals & Place Order CTA */}
        {cartItems.length > 0 && (
          <div className="p-5 bg-white border-t border-stone-200 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono tabular-nums text-stone-900">{formatINR(subtotal)}</span>
              </div>
              
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Holiday Discount ({discountPercent}%):</span>
                  <span className="font-mono tabular-nums">-{formatINR(discountAmount)}</span>
                </div>
              )}

              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Bicycle Courier:</span>
                  <span className="font-mono tabular-nums">
                    {deliveryFee === 0 ? 'Free' : formatINR(deliveryFee)}
                  </span>
                </div>
              )}

              {tipAmount > 0 && (
                <div className="flex justify-between">
                  <span>Baker Tip ({tipPercent}%):</span>
                  <span className="font-mono tabular-nums">{formatINR(tipAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm sm:text-base font-bold text-stone-900 pt-2 border-t border-stone-100">
                <span>Total Amount:</span>
                <span className="font-mono tabular-nums">{formatINR(total)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              type="button"
              className="w-full py-3.5 px-4 rounded-lg bg-[#2A211B] hover:bg-[#3D3027] text-amber-50 font-medium text-sm transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Packing Order Bag...</span>
              ) : (
                <>
                  <span>Place Order for {pickupDate} · {formatINR(total)}</span>
                  <ArrowRight className="w-4 h-4 text-[#C28E46]" />
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-stone-500">
              Pay upon pickup at the counter or via contact-free bicycle delivery.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
