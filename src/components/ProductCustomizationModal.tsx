import React, { useState } from 'react';
import { MenuItem } from '../types';
import { X, Check, Plus, Minus, AlertCircle } from 'lucide-react';
import { formatINR } from '../utils/currency';

interface ProductCustomizationModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, slicing?: 'whole' | 'sandwich' | 'thick', notes?: string, quantity?: number) => void;
}

export const ProductCustomizationModal: React.FC<ProductCustomizationModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [slicing, setSlicing] = useState<'whole' | 'sandwich' | 'thick'>('whole');
  const [specialNotes, setSpecialNotes] = useState('');
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(item, item.allowSlicing ? slicing : undefined, specialNotes.trim() ? specialNotes : undefined, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 700);
  };

  const totalPrice = item.price * quantity;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Photo Header */}
        <div className="relative aspect-16/9 bg-stone-100 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="text-xs uppercase tracking-wider text-amber-200 font-medium">
              {item.category.replace('_', ' ')}
            </span>
            <h2 id="modal-headline" className="text-2xl sm:text-3xl font-serif font-bold text-white mt-0.5">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Price & Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xl font-serif font-semibold text-[#2A211B] font-mono tabular-nums">
                {formatINR(item.price)} each
              </span>
              {item.bakeTime && (
                <span className="text-xs text-stone-500 font-medium">
                  Baked: {item.bakeTime}
                </span>
              )}
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Baker's Tasting Note */}
          {item.bakersNote && (
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200 text-xs text-stone-700 space-y-1">
              <p className="font-semibold text-stone-900 font-serif">Baker's Tasting Note & Guidance:</p>
              <p className="italic text-stone-600">“{item.bakersNote}”</p>
            </div>
          )}

          {/* Allergens & Dietary */}
          <div className="space-y-2 text-xs text-stone-600">
            <div className="flex items-center gap-1 font-semibold text-stone-800">
              <AlertCircle className="w-3.5 h-3.5 text-[#A86D2C]" />
              <span>Allergens & Dietary:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span>Allergens: {item.allergens.join(', ')}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{item.dietary.join(', ')}</span>
            </div>
          </div>

          {/* Slicing Selection (if allowed for bread) */}
          {item.allowSlicing && (
            <div className="space-y-2.5 pt-2 border-t border-stone-100">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Loaf Slicing Preference
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'whole', label: 'Whole Loaf', desc: 'Preserves crust crispness' },
                  { id: 'sandwich', label: 'Sandwich Slice', desc: '12mm even slices' },
                  { id: 'thick', label: 'Thick Toast', desc: '18mm hearty breakfast cut' },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSlicing(option.id as any)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      slicing === option.id
                        ? 'border-[#A86D2C] bg-amber-50/70 text-stone-900 ring-1 ring-[#A86D2C]'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <span className="block text-xs font-semibold">{option.label}</span>
                    <span className="block text-[11px] text-stone-500 mt-0.5 leading-snug">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            <label htmlFor="baker-notes" className="block text-xs font-semibold text-stone-700">
              Baker's Notes / Special Request (Optional)
            </label>
            <input
              id="baker-notes"
              type="text"
              placeholder="e.g. Leave crust extra dark, pack separately for a gift..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#A86D2C]"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-[#FAF8F5] border-t border-stone-200 flex items-center justify-between gap-4">
          
          {/* Quantity Stepper */}
          <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden shadow-2xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              type="button"
              aria-label="Decrease quantity"
              className="p-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3.5 text-sm font-semibold font-mono tabular-nums text-stone-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(item.stockRemaining, quantity + 1))}
              type="button"
              aria-label="Increase quantity"
              className="p-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            type="button"
            className={`flex-1 py-3 px-5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
              added
                ? 'bg-emerald-700 text-white'
                : 'bg-[#2A211B] text-amber-50 hover:bg-[#3D3027] active:scale-98'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Added to Order</span>
              </>
            ) : (
              <span>Add to Order · {formatINR(totalPrice)}</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
