// pages/Wishlist.jsx - Saved favorites collection for students
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, PackageOpen, Sparkles } from 'lucide-react';
import api from '../services/api';
import ListingCard from '../components/ListingCard';
import { CardSkeleton } from '../components/Skeleton';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { wishlist } = useAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const res = await api.get('/wishlist');
        if (res.data.success) {
          // Filter out any null/deleted listings
          setItems((res.data.listings || []).filter(Boolean));
        }
      } catch (err) {
        console.error('Failed to load wishlist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [wishlist]); // Re-fetch or sync when wishlist changes

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Heart className="w-7 h-7 text-rose-500 fill-current" />
            <span>Saved Wishlist</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Items you bookmarked for later purchase or price comparison.
          </p>
        </div>

        <Link
          to="/listings"
          className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse More Items</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 space-y-4">
          <Heart className="w-16 h-16 text-rose-200 dark:text-rose-950/60 mx-auto" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            Your wishlist is empty
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            See something you like on the marketplace? Click the heart icon on any item card to save it here.
          </p>
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Explore Campus Items</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
