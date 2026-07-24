'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Compass, User, Settings, LucideIcon } from 'lucide-react';

interface MobileBottomNavProps {
  isLinkActive: (href: string) => boolean;
}

interface BottomNavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export default function MobileBottomNav({ isLinkActive }: MobileBottomNavProps) {
  const bottomNavItems: BottomNavItem[] = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/90 backdrop-blur-lg border-t border-white/5 flex items-center justify-around px-4 z-40 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
      {bottomNavItems.map((item) => {
        const Icon = item.icon;
        const active = isLinkActive(item.href);
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-xl transition-colors ${
              active ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon size={20} className={active ? 'scale-110 transition-transform' : ''} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
