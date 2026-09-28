import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { CheckCircle2, Clock, MapPin, Printer, ChefHat } from 'lucide-react';
import { formatINR } from '../utils/currency';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
}) => {
  if (!order) return null;

  const [activeStep, setActiveStep] = useState<number>(1);

  // Simulate progress from received -> baking/packing -> ready
  useEffect(() => {
    const timer1 = setTimeout(() => setActiveStep(2), 6000);
    const timer2 = setTimeout(() => setActiveStep(3), 16000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-stone-200 p-6 sm:p-8 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Success Icon & Header */}
        <div className="text-center pb-6 border-b border-stone-100">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-wider text-[#A86D2C] font-semibold">
            Order Confirmed & Sent to Deck Oven
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Order {order.orderNumber}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Thank you, {order.customerName}. Confirmation sent to {order.customerEmail}.
          </p>
        </div>

        {/* Live Order Tracker */}
        <div className="py-6 border-b border-stone-100">
          <span className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-4">
            Live Kitchen & Pickup Progress
          </span>

          <div className="relative flex items-center justify-between">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-200 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-[#A86D2C] -translate-y-1/2 z-0 transition-all duration-500" 
              style={{ width: activeStep === 1 ? '15%' : activeStep === 2 ? '55%' : '100%' }}
            />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                activeStep >= 1 ? 'bg-[#A86D2C] text-white ring-4 ring-amber-100' : 'bg-stone-200 text-stone-500'
              }`}>
                1
              </div>
              <span className="text-[11px] font-medium text-stone-800 mt-1">Received</span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                activeStep >= 2 ? 'bg-[#A86D2C] text-white ring-4 ring-amber-100' : 'bg-stone-200 text-stone-500'
              }`}>
                2
              </div>
              <span className="text-[11px] font-medium text-stone-800 mt-1">Slicing & Packing</span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                activeStep >= 3 ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-stone-200 text-stone-500'
              }`}>
                3
              </div>
              <span className="text-[11px] font-medium text-stone-800 mt-1">Ready for Pick Up</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-stone-50 rounded-lg text-xs text-stone-600 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ChefHat className="w-4 h-4 text-[#A86D2C]" />
              {activeStep === 1 && 'Our bakers received your slip at the preparation station.'}
              {activeStep === 2 && 'Loaves are being sliced and wrapped in fresh bakery linen.'}
              {activeStep === 3 && 'Order is boxed and waiting at the counter!'}
            </span>
          </div>
        </div>

        {/* Pickup Details & Summary */}
        <div className="py-4 space-y-3 text-xs text-stone-700 border-b border-stone-100">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-[#A86D2C] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900 block">Scheduled Time</span>
                <span className="text-stone-600">{order.pickupDate} ({order.pickupTime})</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-right">
              <MapPin className="w-4 h-4 text-[#A86D2C] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900 block">
                  {order.orderType === 'pickup' ? 'Bakeshop Pickup' : 'Bicycle Delivery'}
                </span>
                <span className="text-stone-600">
                  {order.orderType === 'pickup' ? "482 Baker's Lane" : order.deliveryAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Items breakdown */}
          <div className="pt-2 space-y-1.5">
            <span className="font-semibold text-stone-900 block">Order Summary:</span>
            {order.items.map((i) => (
              <div key={i.cartItemId} className="flex justify-between text-stone-600">
                <span>
                  {i.quantity}x {i.menuItem.name} {i.slicingOption ? `(${i.slicingOption})` : ''}
                </span>
                <span className="font-mono tabular-nums text-stone-900">
                  {formatINR(i.menuItem.price * i.quantity)}
                </span>
              </div>
            ))}

            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Holiday Discount ({order.discountCode}):</span>
                <span className="font-mono tabular-nums">-{formatINR(order.discountAmount)}</span>
              </div>
            )}

            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>Bicycle Delivery Fee:</span>
                <span className="font-mono tabular-nums">{formatINR(order.deliveryFee)}</span>
              </div>
            )}

            {order.tip > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>Baker Tip:</span>
                <span className="font-mono tabular-nums">{formatINR(order.tip)}</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-100 text-sm">
              <span>Total Amount:</span>
              <span className="font-mono tabular-nums">{formatINR(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-6 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            type="button"
            className="px-4 py-2.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2.5 rounded-lg bg-stone-900 hover:bg-[#A86D2C] text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Back to Bakeshop
          </button>
        </div>

      </div>
    </div>
  );
};
