import React, { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { formatINR } from '../utils/currency';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Daily Specials', href: '#specials' },
    { label: 'Order Menu', href: '#menu' },
    { label: 'Events & Classes', href: '#events' },
    { label: 'Holiday Offers', href: '#holidays' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Our Story', href: '#about' }
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Zone 1: Single text element brand wordmark */}
        <a 
          href="#" 
          className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#2A211B] hover:text-[#A86D2C] transition-colors shrink-0"
        >
          Maison Dorée
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-700">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              type="button"
              className="hover:text-[#A86D2C] hover:underline underline-offset-8 transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCart}
            type="button"
            aria-label={`Shopping bag with ${cartCount} items`}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-[#2A211B] text-amber-50 hover:bg-[#3D3027] active:scale-95 transition-all text-xs font-medium cursor-pointer shadow-xs whitespace-nowrap"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-[#C28E46]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#A86D2C] text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="font-medium hidden sm:inline">Order Bag</span>
            {cartCount > 0 && (
              <span className="font-mono text-amber-200 text-xs pl-1 border-l border-stone-700 tabular-nums">
                {formatINR(cartTotal)}
              </span>
            )}
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation slide-out / dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              type="button"
              className="w-full text-left px-3 py-2.5 text-base font-medium text-stone-800 hover:bg-amber-100/60 rounded-md transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 mt-2 border-t border-stone-200/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCart();
              }}
              type="button"
              className="w-full py-2.5 px-4 bg-[#2A211B] text-amber-50 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-[#C28E46]" />
              <span>View Cart & Checkout ({cartCount})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
