'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, ClipboardList, Book, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const tabs = [
  { name: 'Home', href: '/', icon: LayoutGrid },
  { name: 'Assignments', href: '/assignments', icon: ClipboardList },
  { name: 'Library', href: '/library', icon: Book },
  { name: 'AI Toolkit', href: '/toolkit', icon: Sparkles },
];

export function BottomNav() {
  const pathname = usePathname();

  // Hide on output page only (dark bg)
  if (pathname.includes('/output')) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A] rounded-t-[20px] px-2 pt-2.5 pb-2 safe-area-bottom">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = tab.href === '/'
            ? pathname === '/'
            : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={clsx(
                "flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all min-w-[56px]",
                isActive
                  ? "text-white"
                  : "text-[#6B7280]"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.6} />
              <span className={clsx(
                "text-[9px]",
                isActive ? "font-bold" : "font-medium"
              )}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
