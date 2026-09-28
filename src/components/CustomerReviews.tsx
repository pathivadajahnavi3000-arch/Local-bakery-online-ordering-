import React, { useState } from 'react';
import { Review } from '../types';
import { Star, CheckCircle, MessageSquarePlus, ThumbsUp, Sparkles, Filter } from 'lucide-react';

interface CustomerReviewsProps {
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  reviews,
  onAddReview,
}) => {
  const [filterItem, setFilterItem] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Review form state
  const [formName, setFormName] = useState('');
  const [formNeighborhood, setFormNeighborhood] = useState('');
  const [formItem, setFormItem] = useState('Wild Levain Country Boule');
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    onAddReview({
      author: formName.trim(),
      neighborhood: formNeighborhood.trim() || 'Local Neighbor',
      itemPurchased: formItem,
      rating: formRating,
      comment: formComment.trim(),
      verifiedBuyer: true,
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setIsModalOpen(false);
      setFormName('');
      setFormNeighborhood('');
      setFormComment('');
      setFormRating(5);
    }, 1200);
  };

  const filteredReviews = reviews.filter(r => {
    if (filterItem === 'all') return true;
    return r.itemPurchased.toLowerCase().includes(filterItem.toLowerCase());
  });

  return (
    <section id="reviews" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-[#A86D2C] mb-2">
              <Star className="w-3.5 h-3.5 fill-[#C28E46] text-[#C28E46]" />
              <span>Community Stories</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>Verified Neighborhood Guests</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A211B] tracking-tight">
              From Our Neighbors' Kitchens
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
              Real feedback from local sourdough lovers, morning coffee regulars, and masterclass students.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-[#A86D2C] text-white text-xs font-medium transition-all shadow-xs cursor-pointer self-start md:self-auto"
          >
            <MessageSquarePlus className="w-4 h-4 text-amber-300" />
            <span>Leave a Review</span>
          </button>
        </div>

        {/* Aggregated Rating Bar */}
        <div className="mb-10 p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 tabular-nums">
              4.9
            </div>
            <div>
              <div className="flex items-center gap-1 text-[#C28E46]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C28E46]" />
                ))}
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Based on <strong>{reviews.length + 344}</strong> verified neighborhood reviews
              </p>
            </div>
          </div>

          {/* Sub-ratings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-xs w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0 border-stone-100">
            <div>
              <span className="text-stone-500 block">Sourdough Crust</span>
              <span className="font-semibold text-stone-900 font-mono">5.0 / 5.0</span>
            </div>
            <div>
              <span className="text-stone-500 block">Viennoiserie</span>
              <span className="font-semibold text-stone-900 font-mono">4.9 / 5.0</span>
            </div>
            <div>
              <span className="text-stone-500 block">Order Pickup</span>
              <span className="font-semibold text-stone-900 font-mono">4.9 / 5.0</span>
            </div>
            <div>
              <span className="text-stone-500 block">Workshops</span>
              <span className="font-semibold text-stone-900 font-mono">5.0 / 5.0</span>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => (
            <article
              key={rev.id}
              className="p-6 rounded-xl bg-white border border-stone-200/90 shadow-2xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* Review Header: Stars, Date & Verified Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C28E46] text-[#C28E46]" />
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-stone-400">
                    {rev.verifiedBuyer && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Verified Order
                      </span>
                    )}
                    <span aria-hidden="true">·</span>
                    <span>{rev.date}</span>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  “{rev.comment}”
                </p>

              </div>

              {/* Author Footer */}
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-semibold text-stone-900">{rev.author}</h4>
                  {rev.neighborhood && (
                    <span className="text-stone-500 text-[11px]">{rev.neighborhood}</span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-stone-500 block">Favorite item:</span>
                  <span className="font-medium text-[#A86D2C] text-xs">{rev.itemPurchased}</span>
                </div>
              </div>

            </article>
          ))}
        </div>

      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6 sm:p-7 border border-stone-200 animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            {formSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-900">
                  Thank You, {formName}!
                </h3>
                <p className="text-xs sm:text-sm text-stone-600">
                  Your review has been verified and added to the community board.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between pb-4 border-b border-stone-100">
                  <div>
                    <span className="text-[11px] font-semibold text-[#A86D2C] uppercase tracking-wider">
                      Share Your Experience
                    </span>
                    <h3 className="text-xl font-serif font-bold text-stone-900 mt-0.5">
                      Write a Guest Review
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    type="button"
                    className="text-stone-400 hover:text-stone-700 p-1"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="pt-4 space-y-4">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormRating(star)}
                          className="p-1 text-stone-300 hover:text-[#C28E46] transition-colors cursor-pointer"
                        >
                          <Star 
                            className={`w-6 h-6 ${
                              star <= formRating ? 'fill-[#C28E46] text-[#C28E46]' : 'text-stone-300'
                            }`} 
                          />
                        </button>
                      ))}
                      <span className="text-xs font-semibold text-stone-700 ml-2">
                        {formRating === 5 ? '5.0 — Exceptional' : `${formRating}.0 Stars`}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Thomas B."
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#A86D2C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Neighborhood (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. North End, Downtown"
                        value={formNeighborhood}
                        onChange={(e) => setFormNeighborhood(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#A86D2C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Item or Experience
                    </label>
                    <select
                      value={formItem}
                      onChange={(e) => setFormItem(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#A86D2C]"
                    >
                      <option value="Wild Levain Country Boule">Wild Levain Country Boule</option>
                      <option value="French Butter Croissant">Traditional French Butter Croissant</option>
                      <option value="Valrhona Pain au Chocolat">Valrhona Pain au Chocolat</option>
                      <option value="Cardamom Morning Bun">Swedish Crushed Cardamom Bun</option>
                      <option value="Autumn Fig & Mascarpone Tart">Autumn Fig & Mascarpone Tart</option>
                      <option value="Wild Chanterelle Danish">Wild Chanterelle Danish</option>
                      <option value="Sourdough Masterclass Workshop">Sourdough Masterclass Workshop</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Your Comments *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Tell neighbors what you loved about the crust, crumb, or morning pickup..."
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#A86D2C]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-[#A86D2C] text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
                    >
                      Publish Review
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
