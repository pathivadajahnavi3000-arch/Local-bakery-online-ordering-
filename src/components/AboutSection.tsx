import React from 'react';
import { Clock, MapPin, Sparkles, HeartHandshake, Wheat, ShieldCheck } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-24 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Grid: Philosophy & Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: The Craft */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-[#A86D2C]">
              <Wheat className="w-3.5 h-3.5 text-[#C28E46]" />
              <span>Philosophy of Grain & Time</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>Since 2014</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A211B] tracking-tight">
              Three ingredients. Thirty-six hours. No shortcuts.
            </h2>

            <div className="space-y-4 text-stone-600 text-sm sm:text-base leading-relaxed">
              <p>
                At Maison Dorée, we believe that true bread is a living transformation. We work exclusively with certified organic grains from regional family mills, stone-grinding a portion fresh each morning right beside our wood-deck ovens.
              </p>
              <p>
                Our wild sourdough mother starter—affectionately named <em>Céleste</em>—has been carefully fed twice daily for twelve years. Her balanced colony of wild lactobacilli and natural yeasts breaks down gluten and phytic acid slowly over 36 hours, yielding a loaf that is deeply digestible, caramelized, and fragrant.
              </p>
            </div>

            {/* Three Pillar Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/80 space-y-1">
                <span className="font-serif font-bold text-stone-900 text-base">Stoneground Grain</span>
                <p className="text-xs text-stone-600">Preserves vital grain germ, oils, and nutrient density.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/80 space-y-1">
                <span className="font-serif font-bold text-stone-900 text-base">36-Hour Cold Rest</span>
                <p className="text-xs text-stone-600">Complex organic lactic acidity and open custardy crumb.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/80 space-y-1">
                <span className="font-serif font-bold text-stone-900 text-base">84% Normandy Butter</span>
                <p className="text-xs text-stone-600">High butterfat lamination gives our viennoiserie supreme shatter.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Bakery Location, Hours & FAQ */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Opening Hours Box */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#A86D2C]" />
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Bakery Operating Hours
                </h3>
              </div>

              <div className="space-y-2 text-xs text-stone-700">
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="font-medium">Tuesday – Friday</span>
                  <span className="font-mono text-stone-900 font-semibold">7:00 AM – 3:30 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="font-medium">Saturday & Sunday</span>
                  <span className="font-mono text-stone-900 font-semibold">7:00 AM – 4:00 PM</span>
                </div>
                <div className="flex justify-between py-1 text-stone-500">
                  <span>Monday</span>
                  <span>Resting & Stone Milling Day (Closed)</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-stone-500 italic">
                * Fresh sourdough drops at 7:00 AM & 12:00 PM daily. Evening workshop schedule begins at 6:00 PM.
              </div>
            </div>

            {/* Address & Neighborhood Box */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#A86D2C]" />
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Find the Bakeshop
                </h3>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                482 Baker's Lane, Old Town Arts District<br />
                Just two blocks east of the Historic Market Square.
              </p>
              <p className="text-xs text-stone-500">
                Contact: (555) 234-BAKE · orders@maisondoree-bakery.com
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
