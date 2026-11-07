// components/Footer.jsx - Footer with student safety advice & navigation links
import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../utils/constants';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors mt-auto">
      {/* Student Safety Tip Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-amber-50 dark:from-slate-800 dark:to-slate-850 border-b border-indigo-100 dark:border-slate-800 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs text-slate-700 dark:text-slate-300 text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>Campus Safety Tip:</strong> Always meet in public campus spots (library, canteen, hostel gate) during daylight and inspect books or gadgets before paying.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 1. Brand & Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                Campus<span className="text-amber-500">Bazar</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The direct peer-to-peer marketplace for school and college students to buy and sell used textbooks, topper notes, lab instruments, uniform, and coding laptops without middleman fees.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              <span>for Indian Campuses</span>
            </div>
          </div>

          {/* 2. Popular Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/listings?category=${encodeURIComponent(cat)}`}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. More Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Campus Essentials
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              {CATEGORIES.slice(5).map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/listings?category=${encodeURIComponent(cat)}`}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Quick Links & Architecture */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Student Hub
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/listings" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  All Active Listings
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Sell Used Item
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/inquiries" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Inquiries Inbox
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} CampusBazar - Full-Stack MERN Project</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Vite • React • Node • Express • MongoDB</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
