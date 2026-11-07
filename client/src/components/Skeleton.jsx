// components/Skeleton.jsx - Loading placeholder skeletons
import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm animate-pulse">
    <div className="h-48 bg-slate-200 dark:bg-slate-700 w-full" />
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
      </div>
      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
      <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-750">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
      </div>
    </div>
  </div>
);

export const DetailSkeleton = () => (
  <div className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
    <div className="space-y-4">
      <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-2xl w-full" />
      <div className="flex gap-3">
        <div className="h-20 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg" />
        <div className="h-20 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg" />
        <div className="h-20 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg" />
      </div>
    </div>
    <div className="space-y-6">
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
      <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
      <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded w-full" />
      <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-xl w-full" />
    </div>
  </div>
);

export default CardSkeleton;
