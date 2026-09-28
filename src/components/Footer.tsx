import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2A211B] text-stone-300 text-xs py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-stone-800">
          
          {/* Brand */}
          <div className="space-y-3">
            <span className="text-xl font-serif font-bold text-white block">
              Maison Dorée
            </span>
            <p className="text-stone-400 text-xs leading-relaxed">
              Artisanal stoneground sourdough, French viennoiserie, and community baking masterclasses.
            </p>
          </div>

          {/* Quick Nav */}
          <div>
            <span className="text-stone-200 font-semibold uppercase tracking-wider text-[11px] block mb-3">
              Explore
            </span>
            <ul className="space-y-2 text-stone-400">
              <li><a href="#specials" className="hover:text-amber-200 transition-colors">Daily Hot Specials</a></li>
              <li><a href="#menu" className="hover:text-amber-200 transition-colors">Online Bakery Menu</a></li>
              <li><a href="#events" className="hover:text-amber-200 transition-colors">Events & Workshops</a></li>
              <li><a href="#holidays" className="hover:text-amber-200 transition-colors">Holiday Pre-Orders</a></li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <span className="text-stone-200 font-semibold uppercase tracking-wider text-[11px] block mb-3">
              Bakeshop Hours
            </span>
            <p className="text-stone-400 leading-relaxed">
              Tue – Fri: 7:00 AM – 3:30 PM<br />
              Sat – Sun: 7:00 AM – 4:00 PM<br />
              Mon: Closed for stone milling
            </p>
          </div>

          {/* Contact */}
          <div>
            <span className="text-stone-200 font-semibold uppercase tracking-wider text-[11px] block mb-3">
              Visit Us
            </span>
            <p className="text-stone-400 leading-relaxed">
              482 Baker's Lane<br />
              Old Town Arts District<br />
              (555) 234-BAKE
            </p>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <p>© {new Date().getFullYear()} Maison Dorée Artisan Bakery. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-300">Stoneground Flour</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-stone-300">Wild Levain</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-stone-300">Local Sustainable Grain</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
