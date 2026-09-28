import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatINR } from '../utils/currency';

interface MobileQuickCartProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export const MobileQuickCart: React.FC<MobileQuickCartProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
}) => {
  if (cartCount === 0) return null;

  return (
    <div className="fixed bottom-3 inset-x-3 z-30 lg:hidden animate-in slide-in-from-bottom-2 duration-150">
      <button
        onClick={onOpenCart}
        type="button"
        className="w-full h-12 px-4 rounded-xl bg-[#2A211B] text-amber-50 shadow-xl flex items-center justify-between border border-stone-700/80 active:scale-98 transition-all cursor-pointer"
        aria-label={`View order bag with ${cartCount} items, total ${formatINR(cartTotal)}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <ShoppingBag className="w-4 h-4 text-[#C28E46]" />
            <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#A86D2C] text-white text-[10px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          </div>
          <span className="text-xs font-semibold">View Order Bag</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-amber-200 tabular-nums">
            {formatINR(cartTotal)}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-[#C28E46]" />
        </div>
      </button>
    </div>
  );
};
