import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(
    "bg-white rounded-2xl overflow-hidden transition-all duration-200",
    "border border-slate-200/90 shadow-[0_2px_8px_rgba(15,23,42,0.04),0_1px_2px_rgba(15,23,42,0.06)]",
    "hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:border-slate-300/90",
    className
  )}>
    {children}
  </div>
);

export const DemoBadge = () => null;

export const StatusBadge = ({ status, pulse = false }: { status: string; pulse?: boolean }) => {
  let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
  let dotStyle = "bg-slate-400";

  const lower = (status || '').toLowerCase();
  if (lower.includes('normal') || lower.includes('good') || lower.includes('completed') || lower.includes('active') || lower.includes('optimal') || lower.includes('safe')) {
    badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200/80";
    dotStyle = "bg-emerald-500";
  } else if (lower.includes('high') || lower.includes('poor') || lower.includes('critical') || lower.includes('attention') || lower.includes('alert') || lower.includes('danger')) {
    badgeStyle = "bg-rose-50 text-rose-700 border-rose-200/80";
    dotStyle = "bg-rose-500";
  } else if (lower.includes('moderate') || lower.includes('warning') || lower.includes('caution') || lower.includes('in progress') || lower.includes('pending')) {
    badgeStyle = "bg-amber-50 text-amber-700 border-amber-200/80";
    dotStyle = "bg-amber-500";
  } else if (lower.includes('info') || lower.includes('armed') || lower.includes('scheduled')) {
    badgeStyle = "bg-blue-50 text-blue-700 border-blue-200/80";
    dotStyle = "bg-blue-500";
  }

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-xs tracking-tight",
      badgeStyle
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotStyle, pulse && "animate-ping")} />
      {status}
    </span>
  );
};
