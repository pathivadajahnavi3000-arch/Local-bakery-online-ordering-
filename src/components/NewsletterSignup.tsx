import React, { useState } from 'react';
import { Mail, Check, Bell, Tag, Sparkles, Copy } from 'lucide-react';

interface NewsletterSignupProps {
  onApplyPromoCode: (code: string) => void;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ onApplyPromoCode }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [prefMorningBake, setPrefMorningBake] = useState(true);
  const [prefHolidayPreorders, setPrefHolidayPreorders] = useState(true);
  const [prefWorkshops, setPrefWorkshops] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const couponCode = 'FRESHCRUST10';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Save subscriber preference to localStorage
    const existing = JSON.parse(localStorage.getItem('maison_subscribers') || '[]');
    existing.push({
      email,
      name,
      prefMorningBake,
      prefHolidayPreorders,
      prefWorkshops,
      subscribedAt: new Date().toISOString()
    });
    localStorage.setItem('maison_subscribers', JSON.stringify(existing));

    setSubscribed(true);
  };

  const handleApplyCoupon = () => {
    onApplyPromoCode(couponCode);
    navigator.clipboard?.writeText(couponCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  return (
    <section className="py-16 sm:py-20 bg-[#F5EFEB] border-b border-stone-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-2xs">
          
          {subscribed ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                Welcome to the Maison Hearth, {name || 'Neighbor'}!
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                You'll receive oven alerts for fresh morning bakes and first-in-line access to holiday pre-orders. Here is your community welcome gift:
              </p>

              {/* Coupon Box */}
              <div className="max-w-sm mx-auto p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-3">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-[#A86D2C] tracking-wider block">
                    Welcome 10% Discount
                  </span>
                  <span className="font-mono text-base font-bold text-stone-900 tracking-wider">
                    {couponCode}
                  </span>
                </div>

                <button
                  onClick={handleApplyCoupon}
                  type="button"
                  className="px-3.5 py-1.5 rounded-lg bg-[#2A211B] text-amber-50 text-xs font-medium hover:bg-[#3D3027] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Applied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#C28E46]" />
                      <span>Apply to Cart</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-stone-500">
                Valid on your next online pickup or delivery order.
              </p>
            </div>
          ) : (
            <div>
              <div className="text-center max-w-xl mx-auto mb-8">
                <div className="flex items-center justify-center gap-2 text-xs font-medium tracking-wider uppercase text-[#A86D2C] mb-2">
                  <Bell className="w-3.5 h-3.5 text-[#C28E46]" />
                  <span>Customer Dispatch & Fresh Pull Alerts</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A211B] tracking-tight">
                  Never Miss a Hot Loaf or Holiday Pre-Order
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-2">
                  Sign up for gentle notifications when wild sourdough is pulled from the ovens, plus early-bird access to holiday pie reservations and baking classes. Receive 10% off your next order.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Your First Name
                    </label>
                    <input
                      type="text"
                      placeholder="Mathieu"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#A86D2C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="neighbor@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#A86D2C]"
                    />
                  </div>
                </div>

                {/* Notification preferences checkboxes */}
                <div className="pt-2 pb-1 space-y-2 text-xs text-stone-700">
                  <span className="block font-semibold text-stone-800">
                    What would you like to receive?
                  </span>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefMorningBake}
                      onChange={(e) => setPrefMorningBake(e.target.checked)}
                      className="rounded text-[#A86D2C] focus:ring-[#A86D2C]"
                    />
                    <span>Morning Hot Oven Alerts (Daily specials & bread schedule updates)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefHolidayPreorders}
                      onChange={(e) => setPrefHolidayPreorders(e.target.checked)}
                      className="rounded text-[#A86D2C] focus:ring-[#A86D2C]"
                    />
                    <span>Holiday Pre-Orders & Seasonal Discount Codes (Thanksgiving, Halloween, Christmas)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefWorkshops}
                      onChange={(e) => setPrefWorkshops(e.target.checked)}
                      className="rounded text-[#A86D2C] focus:ring-[#A86D2C]"
                    />
                    <span>Hands-on Baking Masterclass Seats & Starter Kit drops</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-lg bg-[#2A211B] hover:bg-[#3D3027] text-amber-50 font-medium text-xs sm:text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4 text-[#C28E46]" />
                  <span>Subscribe & Reveal 10% Welcome Coupon</span>
                </button>

                <p className="text-[11px] text-center text-stone-500">
                  Zero spam. Unsubscribe in 1 click at any time. We respect your morning peace.
                </p>
              </form>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
