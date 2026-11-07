// pages/Inquiries.jsx - Inbox for buyer-seller inquiries and direct communication
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  MessageSquare,
  Phone,
  Clock,
  ExternalLink,
  Inbox,
  Send,
  User,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  formatDate,
  formatPrice,
  getImageUrl,
  createWhatsAppUrl,
  createTelUrl,
} from '../utils/formatters';

const Inquiries = () => {
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  const { showToast } = useToast();

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        const [receivedRes, sentRes] = await Promise.all([
          api.get('/inquiries/received'),
          api.get('/inquiries/sent'),
        ]);

        if (receivedRes.data.success) {
          setReceived(receivedRes.data.inquiries);
        }
        if (sentRes.data.success) {
          setSent(sentRes.data.inquiries);
        }
      } catch (err) {
        showToast('Failed to load inquiries', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [showToast]);

  const activeList = activeTab === 'received' ? received : sent;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Mail className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          <span>Inquiries Inbox</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Messages from students interested in your listings and replies to items you inquired about.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'received'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Received Inquiries ({received.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'sent'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent Inquiries ({sent.length})</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading inquiries...</p>
        </div>
      ) : activeList.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 space-y-3">
          <Mail className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
            No {activeTab} inquiries yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeTab === 'received'
              ? 'When buyers send you a message on any of your items, they will appear here.'
              : 'Browse marketplace items and use the inquiry form to message sellers!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeList.map((inq) => {
            const counterpart = activeTab === 'received' ? inq.fromUser : inq.toUser;
            const item = inq.listing;

            return (
              <div
                key={inq._id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-4 hover:border-indigo-300 transition-all"
              >
                {/* Header: Item & User Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-3">
                    {item?.images && item.images.length > 0 ? (
                      <img
                        src={getImageUrl(item.images[0])}
                        alt={item?.title || 'Listing item'}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                        <Mail className="w-5 h-5" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {activeTab === 'received' ? 'From Buyer:' : 'To Seller:'}
                        </span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {counterpart?.name || 'Student User'}
                        </span>
                        {counterpart?.role && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 capitalize">
                            {counterpart.role}
                          </span>
                        )}
                      </div>

                      {item ? (
                        <Link
                          to={`/listings/${item._id}`}
                          className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 flex items-center gap-1 mt-0.5"
                        >
                          <span className="truncate max-w-sm">{item.title}</span>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">
                            ({formatPrice(item.price)})
                          </span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Listing has been deleted
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-xs text-slate-400 flex items-center gap-1 self-start sm:self-center">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(inq.createdAt)}
                  </span>
                </div>

                {/* Message Body */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {inq.message}
                </div>

                {/* Contact Actions for Reply */}
                {counterpart?.phone && (
                  <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      <span>Phone: </span>
                      <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                        {counterpart.phone}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={createWhatsAppUrl(
                          counterpart.phone,
                          item?.title || 'Campus Item',
                          item?.price || 0
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply on WhatsApp</span>
                      </a>

                      <a
                        href={createTelUrl(counterpart.phone)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Inquiries;
