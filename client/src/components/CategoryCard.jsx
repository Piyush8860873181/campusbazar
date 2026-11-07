// components/CategoryCard.jsx - Interactive category card for home page
import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  FileText,
  Compass,
  Shirt,
  Laptop,
  Calculator,
  Award,
  Package,
} from 'lucide-react';

const iconMap = {
  BookOpen,
  GraduationCap,
  FileText,
  Compass,
  Shirt,
  Laptop,
  Calculator,
  Award,
  Package,
};

const CategoryCard = ({ category }) => {
  const IconComponent = iconMap[category.icon] || Package;

  return (
    <Link
      to={`/listings?category=${encodeURIComponent(category.name)}`}
      className="group relative bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      <div>
        <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm">
          <IconComponent className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {category.name}
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {category.description}
        </p>
      </div>

      <div className="mt-4 pt-3 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
        <span>Explore items</span>
        <span>→</span>
      </div>
    </Link>
  );
};

export default CategoryCard;
