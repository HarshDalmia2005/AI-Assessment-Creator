'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, ArrowLeft, ChevronDown, LayoutGrid, Menu } from 'lucide-react';
import Image from 'next/image';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  let title = "Assignment";
  if (pathname.includes('/create')) {
    title = "Assignment";
  } else if (pathname.includes('/output')) {
    title = "Assignment";
  }

  const showBackButton = pathname !== '/';

  return (
    <header className="h-[60px] px-4 md:px-6 flex items-center justify-between shrink-0 z-10 w-full">
      {/* Desktop: back arrow + grid icon + title */}
      <div className="hidden md:flex items-center gap-3">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center text-[#303030] hover:text-[#1A1A1A] transition-colors bg-white rounded-full p-2"
          >
            <ArrowLeft size={24} strokeWidth={2} />
          </button>
        )}
        <div className="flex items-center gap-2">
          <LayoutGrid size={20} className="text-[#9CA3AF]" strokeWidth={2} />
          <h1 className="text-[16px] font-medium text-[#A9A9A9] font-bricolage align-middle">{title}</h1>
        </div>
      </div>

      {/* Mobile: VedaAI logo on left */}
      <div className="flex md:hidden items-center gap-2">
        <div className="rounded-full flex items-center justify-center">
          <Image src="/logo 2 copy.png" alt="Logo" width={36} height={36} />
        </div>
        <span className="font-bold text-[20px] tracking-[-0.04em] text-[#303030]">VedaAI</span>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {/* Bell icon */}
        <button className="relative bg-[#F6F6F6] p-2 rounded-full text-[#9CA3AF] hover:text-[#1A1A1A] transition-colors">
          <Bell size={20} className="md:w-6 md:h-6" strokeWidth={1.8} />
          <span className="absolute top-1 right-1 md:-top-0.5 md:-right-0.5 w-[6px] h-[6px] bg-[#F36B24] rounded-full"></span>
        </button>

        {/* User profile */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-[32px] h-[32px] rounded-full bg-[#F3F4F6] flex items-center justify-center overflow-hidden border border-[#E5E7EB]">
            <Image src="/P.jpg" alt="" width={32} height={32} />
          </div>
          {/* Name only on desktop */}
          <span className="hidden md:inline text-[16px] font-bricolage font-medium text-[#303030]">John Doe</span>
          <ChevronDown size={20} className="hidden md:block text-[#303030]" strokeWidth={2} />
        </div>

        {/* Hamburger menu - mobile only */}
        <button className="md:hidden text-[#303030] p-1">
          <Menu size={24} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
