import React, { useState } from 'react';
import { Tag, Check, X, ArrowRight } from 'lucide-react';

interface TopAnnouncementBarProps {
  onApplyPromoCode: (code: string) => void;
  onNavigateToOrder: () => void;
}

export const TopAnnouncementBar: React.FC<TopAnnouncementBarProps> = ({
  onApplyPromoCode,
  onNavigateToOrder
}) => {
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const promoCode = 'AUTUMN15';

  const handleCopy = () => {
    navigator.clipboard?.writeText(promoCode);
    setCopied(true);
    onApplyPromoCode(promoCode);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <aside aria-label="Seasonal Promotion" className="bg-[#2A211B] text-stone-200 text-xs py-2 px-4 border-b border-stone-800 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <Tag className="w-3.5 h-3.5 text-[#C28E46] shrink-0" />
          <span className="font-medium text-stone-100 shrink-0">Harvest Season Special:</span>
          <span className="truncate text-stone-300">
            Enjoy 15% off orders over ₹750 with holiday code <strong className="text-amber-300 font-mono tracking-wider">{promoCode}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            type="button"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded bg-stone-800 hover:bg-stone-700 text-amber-200 transition-colors whitespace-nowrap cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Copied & Applied!</span>
              </>
            ) : (
              <span>Copy & Apply</span>
            )}
          </button>

          <button
            onClick={onNavigateToOrder}
            type="button"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] text-stone-300 hover:text-white transition-colors"
          >
            <span>Order Now</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss announcement"
            className="text-stone-400 hover:text-stone-200 p-0.5 rounded transition-colors ml-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
