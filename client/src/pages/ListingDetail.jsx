// pages/ListingDetail.jsx - Detailed listing view with optimized OLX layout for all screen sizes
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  MapPin,
  Clock,
  Tag,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Trash2,
  Edit,
  Check,
  Send,
  Lock,
  ExternalLink,
  ShoppingBag,
  Store,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  formatPrice,
  formatDate,
  getImageUrl,
  getCategorySvgFallback,
  createWhatsAppUrl,
  createTelUrl,
} from '../utils/formatters';
import { DetailSkeleton } from '../components/Skeleton';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isInWishlist, toggleWishlist, switchPersona } = useAuth();
  const { showToast } = useToast();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [togglingSold, setTogglingSold] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/listings/${id}`);
        if (res.data.success) {
          setListing(res.data.listing);
        }
      } catch (err) {
        showToast(err.response?.data?.message || 'Listing not found', 'error');
        navigate('/listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, navigate, showToast]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!listing) return null;

  const isOwner =
    user && listing.seller && (listing.seller._id === user._id || listing.seller === user._id);
  const isSaved = isInWishlist(listing._id);

  // Send inquiry message to seller
  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!inquiryMessage.trim()) return;

    try {
      setSendingInquiry(true);
      const res = await api.post('/inquiries', {
        listingId: listing._id,
        message: inquiryMessage.trim(),
      });
      if (res.data.success) {
        setInquirySent(true);
        setInquiryMessage('');
        showToast('Inquiry sent to seller successfully! Check your Inquiries page.', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send inquiry', 'error');
    } finally {
      setSendingInquiry(false);
    }
  };

  const handleToggleSold = async () => {
    try {
      setTogglingSold(true);
      const res = await api.patch(`/listings/${listing._id}/sold`);
      if (res.data.success) {
        setListing((prev) => ({ ...prev, isSold: res.data.listing.isSold }));
        showToast(res.data.message, 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setTogglingSold(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/listings/${listing._id}`);
      if (res.data.success) {
        showToast('Listing removed successfully', 'info');
        navigate('/my-listings');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete listing', 'error');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Listing link copied to clipboard!', 'info');
  };

  const images =
    listing.images && listing.images.length > 0
      ? listing.images
      : [getCategorySvgFallback(listing.category)];

  const currentImage = getImageUrl(images[activeImageIndex] || images[0], listing.category);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 🌟 DUAL ROLE SIMULATION BANNER 🌟 */}
      <div className="bg-indigo-50 dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-900/60 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          {isOwner ? (
            <span className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1">
              <Store className="w-3.5 h-3.5" />
              <span>You are viewing as SELLER ({user?.name || 'Rahul'})</span>
            </span>
          ) : isAuthenticated ? (
            <span className="p-1.5 rounded-lg bg-emerald-500 text-white font-bold text-xs flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>You are viewing as a BUYER ({user?.name})</span>
            </span>
          ) : (
            <span className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Viewing in Guest Mode (Contact masked)</span>
            </span>
          )}

          <span className="text-xs text-slate-600 dark:text-slate-400 hidden sm:inline">
            {isOwner
              ? 'Test how buyers see and contact you:'
              : 'Test seller controls to edit or mark sold:'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isOwner ? (
            <button
              type="button"
              onClick={() => switchPersona('buyer')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Switch to Buyer (Priya)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => switchPersona('seller')}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Store className="w-3.5 h-3.5 text-slate-950" />
              <span>Switch to Seller (Rahul)</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation & Actions Row */}
      <div className="flex items-center justify-between">
        <Link
          to="/listings"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleWishlist(listing._id)}
            className={`p-2 rounded-xl border transition-colors ${
              isSaved
                ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:text-rose-500'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Responsive 2-column or stacked layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image Gallery & Description (7 Cols on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <img
              src={currentImage}
              alt={listing.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = getCategorySvgFallback(listing.category);
              }}
            />

            {listing.isSold && (
              <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[1px] flex items-center justify-center">
                <span className="bg-rose-600 text-white font-black text-sm tracking-widest uppercase px-6 py-2 rounded-full shadow-2xl">
                  ITEM SOLD OUT
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-indigo-600 scale-105 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={getImageUrl(img, listing.category)}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = getCategorySvgFallback(listing.category);
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Item Description (Shown here on desktop) */}
          <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Description & Campus Notes
            </h2>
            <div className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-line leading-relaxed">
              {listing.description}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Category</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{listing.category}</span>
              </div>
              {listing.subCategory && (
                <div>
                  <span className="text-slate-400 block font-medium">Sub-Category</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{listing.subCategory}</span>
                </div>
              )}
              <div>
                <span className="text-slate-400 block font-medium">Condition</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{listing.condition}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Campus</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{listing.city}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Listed</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{formatDate(listing.createdAt)}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Negotiable</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{listing.negotiable ? 'Yes' : 'Fixed Price'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Seller Info & Contact (5 Cols on desktop) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Price & Title Card (OLX Format) */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {formatPrice(listing.price)}
              </span>
              {listing.negotiable && (
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg">
                  Price Negotiable
                </span>
              )}
            </div>

            <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {listing.title}
            </h1>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-700">
              <span className="flex items-center gap-1 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{listing.city}</span>
              </span>
              <span>{formatDate(listing.createdAt)}</span>
            </div>
          </div>

          {/* Seller Dashboard Controls (If current user is owner) */}
          {isOwner && (
            <div className="bg-amber-50 dark:bg-slate-800 rounded-2xl p-5 border-2 border-amber-300 dark:border-amber-600/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-amber-300">
                  Seller Ad Controls
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                  Your Ad
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={handleToggleSold}
                  disabled={togglingSold}
                  className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                    listing.isSold
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{listing.isSold ? 'Re-open Ad' : 'Mark as Sold'}</span>
                </button>

                <Link
                  to={`/edit/${listing._id}`}
                  className="py-2 px-3 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Edit Ad</span>
                </Link>
              </div>

              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="w-full py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete this ad permanently</span>
              </button>
            </div>
          )}

          {/* Seller Profile & Direct Contact Box */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Seller Profile & Contact
            </h2>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-black text-base flex items-center justify-center shadow-md">
                {listing.seller?.name ? listing.seller.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white truncate">
                  {listing.seller?.name || 'Student Seller'}
                </h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold capitalize">
                  {listing.seller?.role || 'College Student'} • {listing.seller?.city || listing.city}
                </p>
              </div>
            </div>

            {/* Contact Channels */}
            {isAuthenticated ? (
              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-700">
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mobile Phone:</span>
                    <strong className="text-slate-900 dark:text-white font-bold">
                      {listing.seller?.phone || '9876543210'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <strong className="text-slate-900 dark:text-white font-medium truncate max-w-[180px]">
                      {listing.seller?.email || 'seller@campusbazar.com'}
                    </strong>
                  </div>
                </div>

                {/* WhatsApp & Call Buttons (OLX Highlight Action) */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <a
                    href={createWhatsAppUrl(listing.seller?.phone || '9876543210', listing.title, listing.price)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-[1.02]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat WhatsApp</span>
                  </a>

                  <a
                    href={createTelUrl(listing.seller?.phone || '9876543210')}
                    className="py-3 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-[1.02]"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Seller</span>
                  </a>
                </div>

                {/* In-App Direct Message Form */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Send Instant Note to Seller Inbox
                  </span>

                  {inquirySent ? (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center space-y-1">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                      <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        Inquiry Delivered to Seller!
                      </p>
                      <button
                        type="button"
                        onClick={() => setInquirySent(false)}
                        className="text-[11px] text-emerald-700 underline"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSendInquiry} className="space-y-2">
                      <textarea
                        rows={2}
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        placeholder="Hi, is this available? Can we meet on campus tomorrow?"
                        className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                      <button
                        type="submit"
                        disabled={sendingInquiry || !inquiryMessage.trim()}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{sendingInquiry ? 'Sending...' : 'Send to Inbox'}</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              /* Contact Masked for Guests */
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-center space-y-3">
                <Lock className="w-8 h-8 text-indigo-600 mx-auto" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Contact Details Protected
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Log in with a student account to view seller phone, chat on WhatsApp, or send inquiries.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => switchPersona('buyer')}
                    className="py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                  >
                    1-Click Buyer
                  </button>
                  <Link
                    to="/login"
                    state={{ from: { pathname: `/listings/${listing._id}` } }}
                    className="py-2 px-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center"
                  >
                    Login / Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Item Description (Shown here on mobile/narrow screens below contact) */}
          <div className="block lg:hidden bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Description & Campus Notes
            </h2>
            <div className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-line leading-relaxed">
              {listing.description}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Category:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{listing.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Condition:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{listing.condition}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Delete this listing?
              </h3>
              <p className="text-xs text-slate-500">
                This item will be permanently removed from CampusBazar.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md"
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

export default ListingDetail;
