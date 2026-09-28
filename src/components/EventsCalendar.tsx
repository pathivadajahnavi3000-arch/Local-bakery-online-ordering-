import React, { useState } from 'react';
import { BakeryEvent, HolidayDiscount } from '../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Tag, 
  Copy, 
  Check, 
} from 'lucide-react';
import { formatINR } from '../utils/currency';

interface EventsCalendarProps {
  events: BakeryEvent[];
  discounts: HolidayDiscount[];
  onApplyPromoCode: (code: string) => void;
  onOrderClick: () => void;
}

export const EventsCalendar: React.FC<EventsCalendarProps> = ({
  events,
  discounts,
  onApplyPromoCode,
  onOrderClick,
}) => {
  const [viewMode, setViewMode] = useState<'calendar' | 'agenda'>('agenda');
  const [selectedEvent, setSelectedEvent] = useState<BakeryEvent | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // RSVP Form State
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpTickets, setRsvpTickets] = useState(1);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [ticketConfirmationId, setTicketConfirmationId] = useState('');

  const handleCopyDiscount = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    onApplyPromoCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName || !rsvpEmail) return;
    const conf = `MD-EVT-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketConfirmationId(conf);
    setRsvpSuccess(true);
    if (selectedEvent) {
      selectedEvent.spotsLeft = Math.max(0, selectedEvent.spotsLeft - rsvpTickets);
    }
  };

  const closeRsvpModal = () => {
    setSelectedEvent(null);
    setRsvpSuccess(false);
    setRsvpName('');
    setRsvpEmail('');
    setRsvpTickets(1);
  };

  const downloadIcs = (event: BakeryEvent) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Maison Doree Bakery//Events//EN
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:Maison Doree Bakery, 482 Baker's Lane
DTSTART:20261008T180000Z
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="events" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-[#A86D2C] mb-2">
              <CalendarIcon className="w-3.5 h-3.5 text-[#C28E46]" />
              <span>Flour & Community</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>Workshops & Holiday Gatherings</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A211B] tracking-tight">
              Bakery Events & Masterclasses
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
              Learn sourdough fermentation, croissant lamination, and join our seasonal holiday tastings. Small batches, genuine knowledge sharing.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-lg self-start md:self-auto">
            <button
              onClick={() => setViewMode('agenda')}
              type="button"
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                viewMode === 'agenda'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              type="button"
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Calendar Grid
            </button>
          </div>
        </div>

        {/* Holiday Discounts & Pre-order Banner Hub */}
        <div id="holidays" className="mb-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#2A211B] to-[#3B2D24] text-amber-50 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-700">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#C28E46] font-semibold">
                Upcoming Holidays & Seasonal Pre-Orders
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Autumn Harvest & Holiday Specials
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 mt-2 max-w-2xl leading-relaxed">
                Planning holiday tables or festive gatherings? Apply our seasonal discount codes to online pickup orders or secure your holiday artisan bakes before reservation windows close.
              </p>
            </div>

            <button
              onClick={onOrderClick}
              type="button"
              className="px-5 py-3 rounded-lg bg-[#C28E46] hover:bg-[#D49E53] text-stone-950 font-medium text-xs sm:text-sm transition-all shadow-xs self-start lg:self-auto cursor-pointer whitespace-nowrap"
            >
              Start Holiday Order
            </button>
          </div>

          {/* Active Promo Codes Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            {discounts.slice(0, 3).map((disc) => (
              <div 
                key={disc.code}
                className="p-4 rounded-xl bg-black/25 border border-stone-700/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-300 tracking-wider bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
                      {disc.code}
                    </span>
                    <span className="text-xs font-semibold text-[#C28E46] tabular-nums">
                      {disc.discountPercent}% OFF
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mt-2.5 font-serif">{disc.title}</h4>
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed">{disc.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">Valid until {disc.validUntil}</span>
                  <button
                    onClick={() => handleCopyDiscount(disc.code)}
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-medium text-amber-200 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedCode === disc.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Applied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Apply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View Mode: Agenda / List */}
        {viewMode === 'agenda' ? (
          <div className="space-y-6">
            {events.map((event) => (
              <article
                key={event.id}
                className="bg-white rounded-xl border border-stone-200 hover:border-stone-300 shadow-2xs hover:shadow-sm transition-all overflow-hidden flex flex-col lg:flex-row items-stretch"
              >
                {/* Event Photo Frame */}
                <div className="lg:w-80 shrink-0 relative aspect-16/9 lg:aspect-auto bg-stone-100">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-amber-100 text-xs px-2.5 py-1 rounded capitalize font-medium">
                    {event.category}
                  </div>
                </div>

                {/* Event Info */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                      <div className="flex items-center gap-1.5 font-medium text-stone-800">
                        <CalendarIcon className="w-3.5 h-3.5 text-[#A86D2C]" />
                        <span>{new Date(event.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <span aria-hidden="true">·</span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{event.time}</span>
                      </div>
                      {event.instructor && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>With {event.instructor}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 leading-snug">
                      {event.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
                      {event.description}
                    </p>

                    {event.holidayDiscountCode && (
                      <div className="flex items-center gap-2 text-xs text-[#A86D2C] pt-1">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Includes {event.discountPercent}% holiday discount voucher on future orders (Code: <strong className="font-mono">{event.holidayDiscountCode}</strong>)</span>
                      </div>
                    )}
                  </div>

                  {/* Actions & Remaining spots */}
                  <div className="pt-6 mt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="font-mono text-base font-bold text-stone-900 tabular-nums">
                        {event.price === 0 ? 'Complimentary RSVP' : `${formatINR(event.price)} / person`}
                      </span>
                      <div className="flex items-center gap-1 text-stone-500">
                        <Users className="w-3.5 h-3.5" />
                        <span>
                          <strong className="text-stone-800">{event.spotsLeft}</strong> of {event.spotsTotal} spots left
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        type="button"
                        disabled={event.spotsLeft <= 0}
                        className={`px-4 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          event.spotsLeft <= 0
                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            : 'bg-stone-900 hover:bg-[#A86D2C] text-white'
                        }`}
                      >
                        {event.spotsLeft <= 0 ? 'Fully Booked' : 'Reserve Spot / Tickets'}
                      </button>
                    </div>
                  </div>

                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Calendar Grid View */
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                October 2026 Schedule
              </h3>
              <div className="text-xs text-stone-500">
                Click any scheduled date to view workshop details & RSVP
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-stone-500 mb-2 uppercase">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-24 p-2 rounded-lg bg-stone-50/50 border border-transparent" />
              ))}

              {Array.from({ length: 31 }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `2026-10-${dayNum.toString().padStart(2, '0')}`;
                const dayEvent = events.find(e => e.date === dateStr);

                return (
                  <div
                    key={dayNum}
                    onClick={() => dayEvent && setSelectedEvent(dayEvent)}
                    className={`min-h-24 p-2 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      dayEvent
                        ? 'bg-amber-50/70 border-[#C28E46] cursor-pointer hover:shadow-xs'
                        : 'bg-white border-stone-100 text-stone-600'
                    }`}
                  >
                    <span className={`text-xs font-semibold ${dayEvent ? 'text-[#A86D2C]' : 'text-stone-400'}`}>
                      {dayNum}
                    </span>

                    {dayEvent && (
                      <div className="mt-1">
                        <p className="text-[11px] font-semibold text-stone-900 line-clamp-2 leading-tight">
                          {dayEvent.title}
                        </p>
                        <span className="text-[10px] text-[#A86D2C] font-mono mt-0.5 block">
                          {dayEvent.time.split('–')[0]}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* RSVP Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-150 p-6 sm:p-7"
            role="dialog"
            aria-modal="true"
          >
            {rsvpSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-900">
                  You're On The Guestlist!
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
                  Confirmation <strong className="font-mono text-stone-900">{ticketConfirmationId}</strong> has been issued for <strong>{rsvpName}</strong>. We sent calendar details to <strong>{rsvpEmail}</strong>.
                </p>

                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-left text-xs text-stone-700 space-y-1">
                  <p className="font-semibold text-stone-900">{selectedEvent.title}</p>
                  <p className="text-stone-600">Date: {selectedEvent.date} · {selectedEvent.time}</p>
                  <p className="text-stone-600">Location: Maison Dorée Bakeshop, 482 Baker's Lane</p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => downloadIcs(selectedEvent)}
                    type="button"
                    className="px-4 py-2.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-medium cursor-pointer"
                  >
                    Add to Calendar (.ics)
                  </button>
                  <button
                    onClick={closeRsvpModal}
                    type="button"
                    className="px-5 py-2.5 rounded-lg bg-stone-900 text-white hover:bg-stone-800 text-xs font-medium cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between pb-4 border-b border-stone-100">
                  <div>
                    <span className="text-[11px] font-semibold text-[#A86D2C] uppercase tracking-wider">
                      Event Reservation
                    </span>
                    <h3 className="text-xl font-serif font-bold text-stone-900 mt-0.5">
                      {selectedEvent.title}
                    </h3>
                  </div>
                  <button
                    onClick={closeRsvpModal}
                    type="button"
                    className="text-stone-400 hover:text-stone-700 p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="py-4 space-y-3 text-xs text-stone-600 border-b border-stone-100">
                  <div className="flex items-center justify-between">
                    <span>Date & Time:</span>
                    <strong className="text-stone-900">{selectedEvent.date} · {selectedEvent.time}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Admission:</span>
                    <strong className="text-stone-900 font-mono">
                      {selectedEvent.price === 0 ? 'Free RSVP' : `${formatINR(selectedEvent.price)} / seat`}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Remaining capacity:</span>
                    <strong className="text-[#A86D2C] font-semibold">{selectedEvent.spotsLeft} seats available</strong>
                  </div>
                </div>

                <form onSubmit={handleRsvpSubmit} className="pt-4 space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#A86D2C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={rsvpEmail}
                      onChange={(e) => setRsvpEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#A86D2C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Number of Guests / Tickets
                    </label>
                    <select
                      value={rsvpTickets}
                      onChange={(e) => setRsvpTickets(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#A86D2C]"
                    >
                      {[1, 2, 3, 4].map(n => (
                        <option key={n} value={n} disabled={n > selectedEvent.spotsLeft}>
                          {n} Guest{n > 1 ? 's' : ''} {selectedEvent.price > 0 ? `(${formatINR(selectedEvent.price * n)})` : '(Free)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeRsvpModal}
                      className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-[#A86D2C] text-white text-xs font-medium cursor-pointer transition-colors shadow-xs"
                    >
                      Confirm Reservation
                    </button>
                  </div>
                </form>

              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
};
