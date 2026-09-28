import React, { useState } from 'react';
import { MenuItem, MenuCategory } from '../types';
import { Search, Plus, Check, SlidersHorizontal } from 'lucide-react';
import { formatINR } from '../utils/currency';

interface OnlineOrderMenuProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem, slicing?: 'whole' | 'sandwich' | 'thick', notes?: string, quantity?: number) => void;
  onSelectItem: (item: MenuItem) => void;
}

export const OnlineOrderMenu: React.FC<OnlineOrderMenuProps> = ({
  menuItems,
  onAddToCart,
  onSelectItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<string>('all');
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'sourdough', label: 'Wild Sourdough' },
    { id: 'viennoiserie', label: 'Viennoiserie' },
    { id: 'savory', label: 'Savory & Danishes' },
    { id: 'tarts_cakes', label: 'Tarts & Cakes' },
    { id: 'pantry_drinks', label: 'Pantry & Coffee' },
  ];

  const dietaryFilters = [
    { id: 'all', label: 'All Diets' },
    { id: 'sourdough', label: 'Wild Sourdough' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'vegetarian', label: 'Vegetarian' },
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesDietary = selectedDietary === 'all' || item.dietary.includes(selectedDietary as any);
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.bakersNote && item.bakersNote.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesDietary && matchesSearch;
  });

  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.allowSlicing) {
      // For slicing bread, open customization so user can pick slice option
      onSelectItem(item);
    } else {
      onAddToCart(item, undefined, undefined, 1);
      setAddedItemMap(prev => ({ ...prev, [item.id]: true }));
      setTimeout(() => {
        setAddedItemMap(prev => ({ ...prev, [item.id]: false }));
      }, 1800);
    }
  };

  return (
    <section id="menu" className="py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-medium tracking-wider uppercase text-[#A86D2C] mb-2">
            <span>Online Ordering</span>
            <span aria-hidden="true" className="text-stone-400">·</span>
            <span>Same-Day Pickup & Next-Day Reserves</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A211B] tracking-tight">
            Order From The Bakeshop
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3">
            Select your breads, morning pastries, and seasonal tarts. Pick a convenient pickup time slot or bicycle delivery during checkout.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-4 mb-10">
          
          {/* Top Row: Search input & dietary buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search sourdough, croissants, tarts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white rounded-lg border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#A86D2C] focus:border-[#A86D2C] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Dietary Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-stone-500 font-medium hidden md:inline mr-1">Dietary:</span>
              {dietaryFilters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedDietary(filter.id)}
                  type="button"
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    selectedDietary === filter.id
                      ? 'bg-stone-800 text-white shadow-2xs'
                      : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/60 rounded-lg overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as MenuCategory)}
                type="button"
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Results Counter */}
        <div className="text-xs text-stone-500 mb-6 flex items-center justify-between">
          <span>Showing <strong className="text-stone-800 tabular-nums">{filteredItems.length}</strong> items</span>
          {searchQuery && (
            <span>Filtered by "{searchQuery}"</span>
          )}
        </div>

        {/* Product Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-stone-300 p-8">
            <p className="text-base font-serif text-stone-800">No bakery items matched your filters.</p>
            <p className="text-xs text-stone-500 mt-1">Try resetting the dietary filter or searching for another ingredient.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDietary('all');
                setSearchQuery('');
              }}
              type="button"
              className="mt-4 px-4 py-2 text-xs font-medium rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group cursor-pointer rounded-xl overflow-hidden bg-white border border-stone-200 hover:border-stone-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo Frame */}
                  <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    {/* Badge */}
                    {item.isDailySpecial && (
                      <div className="absolute top-3 left-3 bg-[#A86D2C] text-white text-[11px] font-medium px-2 py-0.5 rounded shadow-2xs">
                        Daily Special
                      </div>
                    )}

                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-amber-100 font-mono text-xs font-semibold px-2 py-1 rounded tabular-nums">
                      {formatINR(item.price)}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#A86D2C] transition-colors leading-snug">
                        {item.name}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Metadata line without pills */}
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                      {item.allowSlicing && (
                        <span>Custom Slicing Available</span>
                      )}
                      {item.allowSlicing && item.dietary.length > 0 && <span aria-hidden="true">·</span>}
                      {item.dietary.slice(0, 2).map((d) => (
                        <span key={d} className="capitalize">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <button
                    onClick={(e) => handleQuickAdd(item, e)}
                    type="button"
                    className={`w-full py-2.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      addedItemMap[item.id]
                        ? 'bg-emerald-700 text-white'
                        : 'bg-stone-900 text-amber-50 hover:bg-[#A86D2C]'
                    }`}
                  >
                    {addedItemMap[item.id] ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Added to Bag</span>
                      </>
                    ) : item.allowSlicing ? (
                      <>
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#C28E46]" />
                        <span>Select Slicing & Order</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-[#C28E46]" />
                        <span>Add to Order Bag</span>
                      </>
                    )}
                  </button>
                </div>

              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
