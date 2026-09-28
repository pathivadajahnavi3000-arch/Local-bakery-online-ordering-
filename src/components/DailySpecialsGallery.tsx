import React, { useState } from 'react';
import { MenuItem } from '../types';
import { DAILY_OVEN_SCHEDULE } from '../data/mockBakeryData';
import { Clock, Flame, Plus, Check, Info } from 'lucide-react';
import { formatINR } from '../utils/currency';

interface DailySpecialsGalleryProps {
  specials: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  onSelectItem: (item: MenuItem) => void;
}

export const DailySpecialsGallery: React.FC<DailySpecialsGalleryProps> = ({
  specials,
  onAddToCart,
  onSelectItem,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'sourdough' | 'viennoiserie' | 'savory' | 'tarts_cakes'>('all');
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  const filteredSpecials = specials.filter(item => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(item);
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1800);
  };

  return (
    <section id="specials" className="py-16 sm:py-20 bg-[#F5EFEB]/60 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-[#A86D2C] mb-2">
              <Flame className="w-3.5 h-3.5 text-[#C28E46]" />
              <span>Pulled Hot Today</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>Updated Live</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A211B] tracking-tight">
              Fresh Daily Specials
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
              Limited morning batches crafted with seasonal produce, cultured butter, and spontaneous wild starters. When they're gone, they're gone until tomorrow's bake.
            </p>
          </div>

          {/* Filter button tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/80 rounded-lg self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveFilter('all')}
              type="button"
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Specials
            </button>
            <button
              onClick={() => setActiveFilter('sourdough')}
              type="button"
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === 'sourdough'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sourdough
            </button>
            <button
              onClick={() => setActiveFilter('viennoiserie')}
              type="button"
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === 'viennoiserie'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Viennoiserie
            </button>
            <button
              onClick={() => setActiveFilter('savory')}
              type="button"
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === 'savory'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Savory
            </button>
            <button
              onClick={() => setActiveFilter('tarts_cakes')}
              type="button"
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === 'tarts_cakes'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tarts & Pastry
            </button>
          </div>
        </div>

        {/* Oven Pull Schedule Timeline Banner */}
        <div className="mb-10 p-4 sm:p-5 rounded-xl bg-white border border-stone-200/90 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-900 mb-3 uppercase tracking-wider">
            <Clock className="w-4 h-4 text-[#A86D2C]" />
            <span>Today's Oven Schedule & Warm Drop Times</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {DAILY_OVEN_SCHEDULE.map((schedule, idx) => (
              <div 
                key={schedule.time} 
                className="p-3 rounded-lg bg-[#FAF8F5] border border-stone-200/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#A86D2C] tabular-nums">
                      {schedule.time}
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium">Batch 0{idx + 1}</span>
                  </div>
                  <p className="text-xs font-medium text-stone-800 mt-1 line-clamp-2">
                    {schedule.items}
                  </p>
                </div>
                <span className="text-[11px] text-stone-500 mt-2">
                  {schedule.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Specials Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredSpecials.map((item) => (
            <article
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="group cursor-pointer rounded-xl overflow-hidden bg-white border border-stone-200 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Product Image Frame */}
                <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Scrim overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                  {/* Clean unboxed metadata on image */}
                  <div className="absolute top-3 left-3 text-white text-[11px] font-medium bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded">
                    <span>Oven: {item.bakeTime || 'Daily 7:30 AM'}</span>
                  </div>

                  <div className="absolute top-3 right-3 text-white text-[11px] font-medium bg-[#A86D2C] px-2.5 py-1 rounded">
                    <span>{item.stockRemaining} remaining</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs">
                    <span className="capitalize text-stone-200 font-medium">{item.category.replace('_', ' ')}</span>
                    <span className="font-mono text-sm font-semibold text-amber-200 tabular-nums">
                      {formatINR(item.price)}
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-[#A86D2C] transition-colors leading-snug">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Baker's Tasting Note */}
                  {item.bakersNote && (
                    <div className="pt-2 text-xs text-stone-500 italic border-t border-stone-100 line-clamp-2">
                      “{item.bakersNote}”
                    </div>
                  )}

                  {/* Quiet unboxed dietary & allergen metadata */}
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
                    {item.dietary.map((d, i) => (
                      <React.Fragment key={d}>
                        <span className="capitalize">{d}</span>
                        {i < item.dietary.length - 1 && <span aria-hidden="true">·</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-5 pb-5 pt-2 flex items-center gap-2">
                <button
                  onClick={(e) => handleQuickAdd(item, e)}
                  type="button"
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    addedItemId === item.id
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-900 text-amber-50 hover:bg-[#A86D2C]'
                  }`}
                >
                  {addedItemId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 text-[#C28E46]" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onSelectItem(item)}
                  type="button"
                  aria-label="View item details"
                  className="p-2.5 rounded-lg border border-stone-300 hover:border-stone-400 text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
