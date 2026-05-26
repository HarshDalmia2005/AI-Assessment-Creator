'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutGrid,
  ContactRound,
  ClipboardList,
  Settings,
  Book,
  ChartPie
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Home', href: '/', icon: LayoutGrid },
  { name: 'My Groups', href: '/groups', icon: ContactRound },
  { name: 'Assignments', href: '/assignments', icon: ClipboardList, badge: '10' },
  { name: 'AI Teacher\'s Toolkit', href: '/toolkit', icon: Book },
  { name: 'My Library', href: '/library', icon: ChartPie },
];

const multiLayerShadow =
  "0 32px 48px rgba(255, 255, 255, 0.20), " +
  "0 16px 48px rgba(255, 255, 255, 0.12), " +
  "inset 0 0 34.5px rgba(255, 255, 255, 0.25), " +
  "inset 0 -1px 3.5px rgba(177, 177, 177, 0.60)";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[304px] h-full flex flex-col pt-7 pb-5 shrink-0 z-10 relative ">
      <div className='flex flex-col gap-[56px] h-fit '>
        {/* Logo */}
        <div className="px-7 flex">
          <div className="rounded-full flex items-center justify-center align-middle">
            <Image src="/logo 2 copy.png" alt="Logo" width={80} height={80} />
          </div>
          <span className="mt-0.5 w-[88px] h-[20px] font-bold text-[28px] tracking-[-0.06em] align-middle text-[#303030]">
            VedaAI
          </span>
        </div>

        {/* Create Assignment Button */}
        <div className='text-center'>
          <Link
            href="/assignments/create" // Change this to your desired route
            className="inline-flex items-center justify-center gap-[10px]  h-[42px] px-[43px] py-[16px] rounded-[100px] border-4 border-transparent bg-[#272727] text-white text-sm  transition-all select-none"
            style={{
              boxShadow: multiLayerShadow,
              backgroundImage: 'linear-gradient(#272727, #272727), linear-gradient(to bottom, #FF7950, #C0350A)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box'
            }}
          >
            <Image
              src="/Frame 1618872409.png" alt="Create Assignment" width={18} height={18} />

            <span className="font-inter tracking-wide text-[16px] line-height-[28px]">
              Create Assignment
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3">
          <ul className="space-y-[8px]">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/');
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "flex items-center justify-between px-4 py-2.5 rounded-[12px] transition-all duration-200",
                      isActive
                        ? "bg-[#F3F4F6] text-[#1A1A1A] font-semibold"
                        : "text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F9FAFB] font-medium"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={24} className={isActive ? "text-[#1A1A1A]" : "text-[#9CA3AF]"} strokeWidth={isActive ? 2.2 : 1.8} />
                      <span className="font-bricolage text-[16px]">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-[#F36B24] text-white text-[10px] font-bold min-w-[20px] h-[20px] px-1.5 rounded-full flex items-center justify-center leading-none">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="px-3 mt-auto">
        {/* Settings */}
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-2.5 text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F9FAFB] rounded-[12px] transition-colors mb-3 font-medium"
        >
          <Settings size={20} className="text-[#9CA3AF]" strokeWidth={1.8} />
          <span className="text-[16px]">Settings</span>
        </Link>

        {/* School Profile Card */}
        <div className="mx-2 px-3 py-3 bg-[#F0F0F0] rounded-[16px] flex items-center gap-3 border border-[#F3F4F6]">
          <div className="w-[59px] h-[56px] rounded-full bg-[#FEF3C7] flex items-center justify-center overflow-hidden shrink-0">
            <Image src="/P.jpg" alt="" width={59} height={56} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[16px] font-bold text-[#303030] truncate">Delhi Public School</h4>
            <p className="text-[14px] text-[#5E5E5E] truncate">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
