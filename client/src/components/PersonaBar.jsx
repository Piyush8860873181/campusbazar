// components/PersonaBar.jsx - Top bar allowing instant switching between Seller and Buyer personas
import React from 'react';
import { UserCheck, ShoppingBag, Store, GraduationCap, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PersonaBar = () => {
  const { user, isAuthenticated, switchPersona, logout } = useAuth();

  const isSeller = user?.email === 'rahul@campusbazar.com';
  const isBuyer = user?.email === 'priya@campusbazar.com';
  const isSchool = user?.email === 'aman@campusbazar.com';

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Persona Switcher controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-amber-400 flex items-center gap-1 shrink-0">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Simulate Roles:</span>
          </span>

          {/* 1. Seller Persona (Rahul) */}
          <button
            type="button"
            onClick={() => switchPersona('seller')}
            className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
              isSeller
                ? 'bg-amber-400 text-slate-950 shadow-sm ring-1 ring-amber-300 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title="Switch to Seller account (Rahul: owns textbooks, laptops, calculators)"
          >
            <Store className="w-3 h-3 text-amber-500" />
            <span>Seller (Rahul)</span>
          </button>

          {/* 2. Buyer Persona (Priya) */}
          <button
            type="button"
            onClick={() => switchPersona('buyer')}
            className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
              isBuyer
                ? 'bg-emerald-500 text-white shadow-sm ring-1 ring-emerald-300 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title="Switch to Buyer account (Priya: contacts sellers via WhatsApp/Call/Inquiries)"
          >
            <ShoppingBag className="w-3 h-3 text-emerald-300" />
            <span>Buyer (Priya)</span>
          </button>

          {/* 3. School Student Persona (Aman) */}
          <button
            type="button"
            onClick={() => switchPersona('school')}
            className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
              isSchool
                ? 'bg-indigo-500 text-white shadow-sm ring-1 ring-indigo-300 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title="Switch to School Student account (Aman: NCERT books, uniforms)"
          >
            <GraduationCap className="w-3 h-3 text-indigo-300" />
            <span>School (Aman)</span>
          </button>

          {/* 4. Guest / Logged Out */}
          {isAuthenticated && (
            <button
              type="button"
              onClick={logout}
              className="px-2 py-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors flex items-center gap-1"
              title="Log out to view as unauthenticated guest"
            >
              <LogOut className="w-3 h-3" />
              <span>Guest</span>
            </button>
          )}
        </div>

        {/* Right: Active Role State & Verified Badge */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active:</span>
            <strong className="text-white font-semibold">
              {isAuthenticated ? user.name : 'Guest (Not Logged In)'}
            </strong>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-400 border-l border-slate-700 pl-3">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Zero-Fee Student Exchange</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PersonaBar;
