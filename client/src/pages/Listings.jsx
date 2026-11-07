// pages/Listings.jsx - OLX-style marketplace discovery with search, multi-filters, sorting and pagination
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  Search,
  MapPin,
  ChevronRight as ArrowRight,
} from 'lucide-react';
import api from '../services/api';
import ListingCard from '../components/ListingCard';
import FilterSidebar from '../components/FilterSidebar';
import { CardSkeleton } from '../components/Skeleton';

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || 'All',
    condition: searchParams.get('condition') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10),
  });

  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    hasMore: false,
  });
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.category && filters.category !== 'All') params.set('category', filters.category);
    if (filters.condition) params.set('condition', filters.condition);
    if (filters.city) params.set('city', filters.city);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.sort && filters.sort !== 'newest') params.set('sort', filters.sort);
    if (filters.page && filters.page > 1) params.set('page', filters.page.toString());

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Fetch listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (filters.q) queryParams.set('q', filters.q);
        if (filters.category && filters.category !== 'All') queryParams.set('category', filters.category);
        if (filters.condition) queryParams.set('condition', filters.condition);
        if (filters.city) queryParams.set('city', filters.city);
        if (filters.minPrice) queryParams.set('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice);
        if (filters.sort) queryParams.set('sort', filters.sort);
        queryParams.set('page', filters.page.toString());
        queryParams.set('limit', '12');

        const res = await api.get(`/listings?${queryParams.toString()}`);
        if (res.data.success) {
          setListings(res.data.listings || []);
          setPagination({
            total: res.data.total || 0,
            page: res.data.page || 1,
            pages: res.data.pages || 1,
            hasMore: res.data.hasMore || false,
          });
        }
      } catch (err) {
        console.error('Failed to load listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [filters]);

  const resetFilters = () => {
    setFilters({
      q: '',
      category: 'All',
      condition: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
      page: 1,
    });
  };

  const removeChip = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: key === 'category' ? 'All' : '',
      page: 1,
    }));
  };

  const activeChipCount = [
    filters.q,
    filters.category !== 'All' ? filters.category : '',
    filters.condition,
    filters.city,
    filters.minPrice || filters.maxPrice ? 'Price' : '',
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* OLX Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <ArrowRight className="w-3 h-3" />
        <Link to="/listings" className="hover:text-indigo-600">All Marketplace Ads</Link>
        {filters.category && filters.category !== 'All' && (
          <>
            <ArrowRight className="w-3 h-3" />
            <span className="font-bold text-slate-800 dark:text-slate-200">{filters.category}</span>
          </>
        )}
      </nav>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {filters.category && filters.category !== 'All' ? filters.category : 'All Student Items'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Showing {listings.length} of {pagination.total} ads available for hand-to-hand campus meetup
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter Ads {activeChipCount > 0 && `(${activeChipCount})`}</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeChipCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Active filters:</span>

          {filters.q && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg border border-indigo-200 dark:border-indigo-800">
              <span>"{filters.q}"</span>
              <button onClick={() => removeChip('q')} className="hover:text-rose-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {filters.category && filters.category !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg border border-indigo-200 dark:border-indigo-800">
              <span>{filters.category}</span>
              <button onClick={() => removeChip('category')} className="hover:text-rose-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {filters.condition && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg border border-indigo-200 dark:border-indigo-800">
              <span>Condition: {filters.condition}</span>
              <button onClick={() => removeChip('condition')} className="hover:text-rose-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {filters.city && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg border border-indigo-200 dark:border-indigo-800">
              <span>City: {filters.city}</span>
              <button onClick={() => removeChip('city')} className="hover:text-rose-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          <button
            onClick={resetFilters}
            className="text-xs font-bold text-rose-500 hover:underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid: Sidebar + Listings */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden md:block md:col-span-1">
          <div className="sticky top-28">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onReset={resetFilters}
            />
          </div>
        </aside>

        {/* Listings Result Grid */}
        <main className="md:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 space-y-3">
              <PackageOpen className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                No ads found matching your search
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for "NCERT", "Drafter", "Casio", or reset the category filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                disabled={filters.page <= 1}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))
                }
                className="flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-xs font-medium text-slate-500">
                Page {pagination.page} of {pagination.pages}
              </span>

              <button
                disabled={!pagination.hasMore}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                className="flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xs bg-white dark:bg-slate-800 h-full overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <span className="font-bold text-base text-slate-900 dark:text-white">
                Filter Ads
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onReset={resetFilters}
              isMobile={true}
              onCloseMobile={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Listings;
