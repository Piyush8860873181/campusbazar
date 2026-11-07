// pages/MyListings.jsx - Seller dashboard to manage own listings, toggle sold status and delete
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  ExternalLink,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatPrice, formatDate, getImageUrl } from '../utils/formatters';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'sold'
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const { showToast } = useToast();

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/listings/mine');
      if (res.data.success) {
        setListings(res.data.listings);
      }
    } catch (err) {
      showToast('Failed to load your listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleToggleSold = async (id) => {
    try {
      const res = await api.patch(`/listings/${id}/sold`);
      if (res.data.success) {
        setListings((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, isSold: res.data.listing.isSold } : item
          )
        );
        showToast(res.data.message, 'success');
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await api.delete(`/listings/${deleteTargetId}`);
      if (res.data.success) {
        setListings((prev) => prev.filter((item) => item._id !== deleteTargetId));
        showToast('Listing removed successfully', 'info');
      }
    } catch (err) {
      showToast('Failed to delete listing', 'error');
    } finally {
      setDeleteTargetId(null);
    }
  };

  const activeCount = listings.filter((l) => !l.isSold).length;
  const soldCount = listings.filter((l) => l.isSold).length;

  const filteredListings = listings.filter((l) => {
    if (activeTab === 'active') return !l.isSold;
    if (activeTab === 'sold') return l.isSold;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            My Listings Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your posted items, edit prices, and mark items as sold.
          </p>
        </div>

        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" />
          <span>+ Sell New Item</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm text-center sm:text-left">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Posted
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {listings.length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm text-center sm:text-left">
          <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">
            Active For Sale
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {activeCount}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm text-center sm:text-left">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Marked as Sold
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-600 dark:text-slate-300 mt-1">
            {soldCount}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { key: 'all', label: `All (${listings.length})` },
          { key: 'active', label: `Active (${activeCount})` },
          { key: 'sold', label: `Sold (${soldCount})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Listings Table / Cards */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading your items...</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 space-y-3">
          <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
            No listings in this view
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeTab === 'sold'
              ? 'None of your items are marked as sold yet.'
              : 'Post your textbooks, notes, or gadgets to get inquiries from peers!'}
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl mt-2"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>Create a Listing</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredListings.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-indigo-300 transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={
                    item.images && item.images.length > 0
                      ? getImageUrl(item.images[0])
                      : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={item.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        item.isSold
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      }`}
                    >
                      {item.isSold ? 'Sold' : 'Active'}
                    </span>
                  </div>

                  <Link
                    to={`/listings/${item._id}`}
                    className="font-bold text-slate-900 dark:text-white text-sm sm:text-base hover:text-indigo-600 dark:hover:text-indigo-400 truncate block max-w-md"
                  >
                    {item.title}
                  </Link>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatPrice(item.price)}
                    </span>
                    <span>•</span>
                    <span>{formatDate(item.createdAt)}</span>
                    <span>•</span>
                    <span>{item.city}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => handleToggleSold(item._id)}
                  title={item.isSold ? 'Mark as available' : 'Mark as sold'}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    item.isSold
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-100 hover:text-emerald-700'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{item.isSold ? 'Re-open' : 'Mark Sold'}</span>
                </button>

                <Link
                  to={`/edit/${item._id}`}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  title="Edit listing"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                <Link
                  to={`/listings/${item._id}`}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  title="View live ad"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setDeleteTargetId(item._id)}
                  className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Delete this listing?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to delete this listing? It will be removed immediately.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;
