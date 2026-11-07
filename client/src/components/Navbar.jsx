// components/Navbar.jsx - OLX-inspired student marketplace header & category bar
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  MapPin,
  Plus,
  Heart,
  Mail,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  Package,
  User as UserIcon,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CATEGORIES } from '../utils/constants';

const LOCATIONS = [
  'All Campuses / Cities',
  'Delhi (IIT, DTU, DU, DPS)',
  'Mumbai (IITB, VJTI, MU)',
  'Bengaluru (IISc, RVCE, PES)',
  'Pune (COEP, PICT)',
  'Surathkal (NITK)',
  'Chennai (IITM, Anna Univ)',
  'Hyderabad (IIT, BITS)',
];

const Navbar = () => {
  const { user, isAuthenticated, logout, wishlist } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Campuses / Cities');
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedLocation && selectedLocation !== 'All Campuses / Cities') {
      const cleanCity = selectedLocation.split('(')[0].trim();
      params.set('city', cleanCity);
    }
    navigate(`/listings?${params.toString()}`);
  };

  const handleLocationChange = (loc) => {
    setSelectedLocation(loc);
    const params = new URLSearchParams(window.location.search);
    if (loc && loc !== 'All Campuses / Cities') {
      const cleanCity = loc.split('(')[0].trim();
      params.set('city', cleanCity);
    } else {
      params.delete('city');
    }
    navigate(`/listings?${params.toString()}`);
  };

  const wishlistCount = wishlist ? wishlist.length : 0;

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      {/* 1. Main OLX Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white leading-none">
              Campus<span className="text-amber-500">Bazar</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mt-0.5">
              OLX FOR STUDENTS
            </span>
          </div>
        </Link>

        {/* Search & Location Bar (OLX Style) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 items-center max-w-3xl gap-2"
        >
          {/* Location Picker */}
          <div className="relative w-56 shrink-0">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select
              value={selectedLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-600 cursor-pointer truncate"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Main Keyword Search Input */}
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find Used Books, Notes, Mini Drafters, Casio fx-991EX, Laptops..."
              className="w-full pl-4 pr-12 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Dark Mode */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {isAuthenticated ? (
            <>
              {/* Wishlist */}
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Inquiries / Inbox */}
              <Link
                to="/inquiries"
                aria-label="Inbox"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700/60">
                      <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/my-listings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <Package className="w-4 h-4 text-indigo-500" />
                      <span>My Listings (Seller)</span>
                    </Link>

                    <Link
                      to="/inquiries"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <Mail className="w-4 h-4 text-indigo-500" />
                      <span>Inquiries Inbox</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Saved Wishlist</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <UserIcon className="w-4 h-4 text-indigo-500" />
                      <span>My Profile</span>
                    </Link>

                    <div className="border-t border-slate-100 dark:border-slate-700/60 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600 px-2 py-1"
              >
                Login
              </Link>
            </div>
          )}

          {/* 🌟 ICONIC OLX-STYLE "+ SELL" BUTTON 🌟 */}
          <Link
            to="/create"
            className="relative inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full font-black text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all hover:scale-105 active:scale-95 border-[3px] border-amber-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-amber-50 dark:hover:bg-slate-700"
            style={{
              boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.35)',
            }}
          >
            <Plus className="w-4 h-4 text-amber-500 stroke-[3]" />
            <span>SELL</span>
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 2. Horizontal OLX Category Sub-Navbar Strip */}
      <nav className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 overflow-x-auto py-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          {/* All Categories Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setCategoriesDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 font-bold text-slate-900 dark:text-white uppercase tracking-wider hover:text-indigo-600"
            >
              <span>ALL CATEGORIES</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {categoriesDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in"
                onMouseLeave={() => setCategoriesDropdownOpen(false)}
              >
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    to={`/listings?category=${encodeURIComponent(cat)}`}
                    onClick={() => setCategoriesDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Direct Category Links */}
          {CATEGORIES.slice(0, 8).map((cat) => (
            <Link
              key={cat}
              to={`/listings?category=${encodeURIComponent(cat)}`}
              className="shrink-0 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap"
            >
              {cat}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Search and Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search used books, notes, drafters..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl"
            >
              Search
            </button>
          </form>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <Link
              to="/listings"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 font-bold text-sm text-slate-900 dark:text-white"
            >
              All Marketplace Items
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/listings?category=${encodeURIComponent(cat)}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-xs text-slate-600 dark:text-slate-300"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
