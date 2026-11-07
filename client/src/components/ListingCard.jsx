// components/ListingCard.jsx - Authentic OLX-style marketplace card
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Tag } from 'lucide-react';
import { formatPrice, formatDate, getImageUrl, getCategorySvgFallback } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

const ListingCard = ({ listing }) => {
  const { isInWishlist, toggleWishlist } = useAuth();
  const isSaved = isInWishlist(listing._id);
  const [imgSrc, setImgSrc] = useState(() => {
    return listing.images && listing.images.length > 0
      ? getImageUrl(listing.images[0], listing.category)
      : getCategorySvgFallback(listing.category);
  });

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(listing._id);
  };

  return (
    <Link
      to={`/listings/${listing._id}`}
      className="group relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-750 hover:border-slate-400 dark:hover:border-slate-600 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* 1. Image Thumbnail Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-750">
        <img
          src={imgSrc}
          alt={listing.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300 ease-out"
          onError={() => {
            setImgSrc(getCategorySvgFallback(listing.category));
          }}
        />

        {/* Sold Out Banner */}
        {listing.isSold && (
          <div className="absolute inset-0 bg-slate-900/65 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-rose-600 text-white font-black text-xs tracking-widest uppercase px-3.5 py-1 rounded-full shadow-lg">
              SOLD OUT
            </span>
          </div>
        )}

        {/* Condition / Feature Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
          <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
            {listing.condition || 'VERIFIED'}
          </span>
          {listing.negotiable && (
            <span className="bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-slate-200 dark:border-slate-700">
              Neg.
            </span>
          )}
        </div>

        {/* OLX-Style Heart Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all shadow-md ${
            isSaved
              ? 'bg-rose-500 text-white scale-110'
              : 'bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:scale-110'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* 2. OLX-Style Details Section */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Price (Extra Bold OLX Style) */}
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {formatPrice(listing.price)}
            </span>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded truncate max-w-[110px]">
              {listing.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-medium text-slate-800 dark:text-slate-100 text-sm line-clamp-2 mt-1 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {listing.title}
          </h3>

          {/* Subcategory / Sem / Class */}
          {listing.subCategory && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {listing.subCategory}
            </p>
          )}
        </div>

        {/* Bottom Location & Date Bar (Iconic OLX format) */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
          <span className="flex items-center gap-1 truncate max-w-[130px]">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{listing.city}</span>
          </span>
          <span className="shrink-0">{formatDate(listing.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
