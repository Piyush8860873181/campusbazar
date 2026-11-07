// pages/Home.jsx - OLX-style marketplace home with multi-category showcases & recommendations
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Calculator,
  Compass,
  FileText,
  Laptop,
  Shirt,
  Award,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import api from '../services/api';
import ListingCard from '../components/ListingCard';
import { CardSkeleton } from '../components/Skeleton';
import { CATEGORIES, CATEGORY_DETAILS } from '../utils/constants';

const Home = () => {
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/listings?limit=24&sort=newest');
        if (res.data.success) {
          setAllListings(res.data.listings || []);
        }
      } catch (err) {
        console.error('Failed to load listings:', err);
        setError('Could not connect to backend server. Please verify port 5000 is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Split listings into rich OLX sections
  const freshRecommendations = allListings.slice(0, 8);
  const collegeBooks = allListings.filter((item) => item.category === 'College Books');
  const instrumentsAndCalcs = allListings.filter(
    (item) => item.category === 'Scientific Calculators' || item.category === 'Drawing Equipment'
  );
  const topperNotes = allListings.filter((item) => item.category === 'Notes');
  const gadgetsAndUniform = allListings.filter(
    (item) => item.category === 'Laptops and Computers' || item.category === 'School Uniform' || item.category === 'Other'
  );

  return (
    <div className="space-y-10 pb-16">
      {/* 1. OLX-Style Hero Banner */}
      <section className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-900 text-white py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Campus Direct Exchange</span>
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Buy & Sell Used Items <br />
              <span className="text-amber-400">Directly On Campus</span>
            </h1>
            <p className="text-sm sm:text-base text-indigo-100 leading-relaxed">
              Find used NCERT & B.Tech books, drafters, Casio calculators, and topper notes.
              Chat on WhatsApp with sellers and collect items at the college library or canteen.
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 grid grid-cols-2 gap-4 shrink-0 text-center">
            <div className="p-3 bg-white/10 rounded-xl">
              <p className="text-2xl sm:text-3xl font-black text-amber-400">0%</p>
              <p className="text-[11px] font-semibold text-indigo-100 uppercase tracking-wider">
                Commission Fee
              </p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <p className="text-2xl sm:text-3xl font-black text-amber-400">21+</p>
              <p className="text-[11px] font-semibold text-indigo-100 uppercase tracking-wider">
                Items Available
              </p>
            </div>
            <div className="col-span-2 pt-1 text-center">
              <Link
                to="/create"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Post Free Ad in 60 Seconds</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Horizontal Category Quick-Links Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">
            All Categories
          </h2>
          <Link
            to="/listings"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>See all items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
          {CATEGORY_DETAILS.map((cat) => (
            <Link
              key={cat.id}
              to={`/listings?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center text-center p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {cat.name.includes('School') && '📖'}
                {cat.name.includes('College') && '🎓'}
                {cat.name.includes('Notes') && '📝'}
                {cat.name.includes('Drawing') && '📐'}
                {cat.name.includes('Uniform') && '👔'}
                {cat.name.includes('Laptops') && '💻'}
                {cat.name.includes('Calculators') && '🔢'}
                {cat.name.includes('Competitive') && '🏆'}
                {cat.name.includes('Other') && '🎒'}
              </div>
              <span className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 line-clamp-2">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Backend connection warning if server was not running */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-xs font-medium flex items-center justify-between">
            <span>⚠️ {error}</span>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* 3. SECTION 1: Fresh Recommendations (Primary OLX Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Fresh Recommendations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest items listed across all campuses
            </p>
          </div>
          <Link
            to="/listings"
            className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View all ({allListings.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : freshRecommendations.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">No items found</h3>
            <p className="text-xs text-slate-500">Click below to post the first item!</p>
            <Link
              to="/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Post Listing</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {freshRecommendations.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* 4. SECTION 2: B.Tech & College Textbooks */}
      {collegeBooks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>🎓 College & Engineering Books</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                DSA Cormen, B.S. Grewal Math, Galvin Operating Systems
              </p>
            </div>
            <Link
              to="/listings?category=College+Books"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              See all
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {collegeBooks.slice(0, 4).map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      {/* 5. SECTION 3: Calculators & Drawing Equipment */}
      {instrumentsAndCalcs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>🔢 Calculators & Drawing Kits</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Casio fx-991EX, Mini Drafters, Drawing sheet holders, Technical Compass Boxes
              </p>
            </div>
            <Link
              to="/listings?category=Scientific+Calculators"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              See all
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {instrumentsAndCalcs.slice(0, 4).map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      {/* 6. SECTION 4: Topper Notes & Placement Cheatsheets */}
      {topperNotes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>📝 Topper Handwritten Notes & Cheatsheets</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Handwritten placement notes, Organic mechanisms, Microprocessor diagrams
              </p>
            </div>
            <Link
              to="/listings?category=Notes"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              See all
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {topperNotes.slice(0, 4).map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      {/* 7. SECTION 5: Laptops, Uniforms & Hostel Essentials */}
      {gadgetsAndUniform.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>💻 Laptops, Uniforms & Hostel Gear</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Coding ThinkPads, DPS Winter Blazers, Bed study tables
              </p>
            </div>
            <Link
              to="/listings?category=Laptops+and+Computers"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              See all
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {gadgetsAndUniform.slice(0, 4).map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      {/* 8. Bottom OLX "+ SELL" Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-400 text-slate-950 rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Have books, notes or gadgets you don't need?
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-900 max-w-lg">
              Sell them directly to juniors on campus. 100% free, zero listing fee, and instant cash directly in hand.
            </p>
          </div>
          <Link
            to="/create"
            className="px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-black text-sm rounded-2xl shadow-xl transition-transform hover:scale-105 shrink-0 flex items-center gap-2 uppercase tracking-wider"
          >
            <Plus className="w-5 h-5 text-amber-400 stroke-[3]" />
            <span>START SELLING NOW</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
