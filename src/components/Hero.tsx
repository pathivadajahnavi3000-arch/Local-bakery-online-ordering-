import React from 'react';
import { ArrowDown, Clock, MapPin, Sparkles } from 'lucide-react';

interface HeroProps {
  onOrderClick: () => void;
  onExploreSpecials: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderClick, onExploreSpecials }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Quiet metadata line without pills */}
            <div className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-[#A86D2C]">
              <span>Stoneground Flours</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>Wild Yeast Fermentation</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>Est. 2014</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2A211B] leading-[1.12] tracking-tight text-balance">
              Bread born of time, wild levain, and woodsmoke.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl font-normal">
              Every loaf ferments for 36 quiet hours. We mill organic heritage grains in-house and pull crusty sourdough boules and golden laminated pastries from our deck ovens starting at 7:00 AM.
            </p>

            {/* Practical trust markers & live status */}
            <div className="pt-2 pb-1 border-y border-stone-200/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-stone-600">
              <div>
                <span className="block text-stone-900 font-semibold">Morning Pull</span>
                <span className="text-stone-500">7:00 AM & 12:00 PM</span>
              </div>
              <div>
                <span className="block text-stone-900 font-semibold">Pickup Window</span>
                <span className="text-stone-500">Ready in 15–20 mins</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-stone-900 font-semibold">Local Delivery</span>
                <span className="text-stone-500">Bicycle courier radius</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOrderClick}
                type="button"
                className="px-6 py-3.5 rounded-lg bg-[#2A211B] hover:bg-[#3D3027] text-amber-50 font-medium text-sm transition-all shadow-sm active:scale-98 cursor-pointer whitespace-nowrap"
              >
                Order for Today's Pickup
              </button>

              <button
                onClick={onExploreSpecials}
                type="button"
                className="px-5 py-3.5 rounded-lg border border-stone-300 hover:border-stone-800 text-stone-800 hover:bg-stone-50 font-medium text-sm transition-all cursor-pointer whitespace-nowrap"
              >
                View Fresh Daily Specials
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs text-stone-500 pt-2">
              <MapPin className="w-4 h-4 text-[#A86D2C] shrink-0" />
              <span>482 Baker's Lane, Old Town Arts District · Open Tuesday–Sunday</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden bg-stone-100 shadow-md aspect-16/10 lg:aspect-4/3">
              <img
                src="/src/assets/images/bakery_hero_artisan_1790578373661.jpg"
                alt="Artisan bakery counter filled with golden sourdough boules and delicate French pastries bathed in morning sunlight"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              {/* Measured contrast scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Quiet caption badge on photo */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                <div>
                  <p className="font-serif text-sm font-semibold tracking-wide text-amber-100">Deck Oven Batch #1</p>
                  <p className="text-stone-300 text-[11px]">Pulled fresh this morning at 7:00 AM</p>
                </div>
                <span className="font-mono text-[11px] text-amber-200/90 bg-black/40 px-2 py-1 rounded backdrop-blur-xs">
                  82% Hydration
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
