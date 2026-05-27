"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ArrowLeft, ChevronDown, LayoutGrid, Menu, Check, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useNotificationStore } from "@/store/useNotificationStore";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const { notifications, getUnreadCount, markAsRead, removeNotification, clearAll } = useNotificationStore();
  
  // To avoid hydration mismatch from persisted store
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const unreadCount = isMounted ? getUnreadCount() : 0;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let title = "Assignment";
  if (pathname.includes("/create")) {
    title = "Assignment";
  } else if (pathname.includes("/output")) {
    title = "Assignment";
  }

  const showBackButton = pathname !== "/";

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
          <h1 className="text-[16px] font-medium text-[#A9A9A9] font-bricolage align-middle">
            {title}
          </h1>
        </div>
      </div>

      {/* Mobile: VedaAI logo on left */}
      <div className="flex md:hidden items-center gap-2">
        <div className="rounded-full flex items-center justify-center">
          <Image src="/logo 2 copy.png" alt="Logo" width={36} height={36} />
        </div>
        <span className="font-bold text-[20px] tracking-[-0.04em] text-[#303030]">
          VedaAI
        </span>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {/* Bell icon with Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2 rounded-full transition-colors ${
              isNotifOpen ? "bg-[#E5E7EB] text-[#1A1A1A]" : "bg-[#F6F6F6] text-[#9CA3AF] hover:text-[#1A1A1A]"
            }`}
          >
            <Bell size={20} className="md:w-6 md:h-6" strokeWidth={1.8} />
            {isMounted && unreadCount > 0 && (
              <span className="absolute top-0 right-0 md:-top-1 md:-right-1 bg-[#F36B24] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown Panel */}
          {isMounted && isNotifOpen && (
            <div className="fixed top-[60px] left-4 right-4 md:absolute md:top-full md:left-auto md:right-0 md:mt-2 md:w-[380px] bg-white rounded-[16px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#F3F4F6] z-50 overflow-hidden flex flex-col max-h-[400px]">
              <div className="p-4 border-b border-[#F3F4F6] flex items-center justify-between bg-white shrink-0">
                <h3 className="font-bold text-[#303030] text-[16px] font-bricolage">Notifications</h3>
                {notifications.length > 0 && (
                  <button 
                    onClick={() => clearAll()}
                    className="text-[12px] text-[#EF4444] hover:text-red-600 font-medium transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="overflow-y-auto flex-1 p-2">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-[#A9A9A9] text-[13px]">
                    No notifications yet.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        className={`p-3 rounded-[12px] flex items-start gap-3 transition-colors ${
                          notif.isRead ? "bg-white hover:bg-[#F9FAFB]" : "bg-[#F3F4F6] hover:bg-[#E5E7EB]"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] leading-relaxed ${notif.isRead ? "text-[#5E5E5E]" : "text-[#1A1A1A] font-medium"}`}>
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-[#A9A9A9] mt-1 block">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0 pt-0.5">
                          {!notif.isRead && (
                            <button 
                              onClick={() => markAsRead(notif.id)}
                              className="text-[#4BC26D] hover:text-green-600 p-1 rounded-full hover:bg-white transition-colors"
                              title="Mark as read"
                            >
                              <Check size={14} strokeWidth={3} />
                            </button>
                          )}
                          <button 
                            onClick={() => removeNotification(notif.id)}
                            className="text-[#A9A9A9] hover:text-[#EF4444] p-1 rounded-full hover:bg-white transition-colors"
                            title="Remove notification"
                          >
                            <X size={14} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-[32px] h-[32px] rounded-full bg-[#F3F4F6] flex items-center justify-center overflow-hidden border border-[#E5E7EB]">
            <Image src="/P.jpg" alt="" width={32} height={32} />
          </div>
          {/* Name only on desktop */}
          <span className="hidden md:inline text-[16px] font-bricolage font-medium text-[#303030]">
            John Doe
          </span>
          <ChevronDown
            size={20}
            className="hidden md:block text-[#303030]"
            strokeWidth={2}
          />
        </div>

        {/* Hamburger menu - mobile only */}
        <button className="md:hidden text-[#303030] p-1">
          <Menu size={24} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
