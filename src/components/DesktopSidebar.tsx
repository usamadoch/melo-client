'use client';

import React from 'react';
import Link from 'next/link';
import { LogOut, LucideIcon } from 'lucide-react';

import type { User } from '@/src/store/authStore';

interface DesktopSidebarProps {
  user: User | null;
  navItems: Array<{ name: string; href: string; icon: LucideIcon }>;
  isLinkActive: (href: string) => boolean;
  handleLogout: () => Promise<void>;
}

export default function DesktopSidebar({
  user,
  navItems,
  isLinkActive,
  handleLogout,
}: DesktopSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-zinc-900/20 backdrop-blur-xl fixed h-screen top-0 left-0 z-30 p-6 justify-between">
      <div className="space-y-8">
        {/* Logo */}
        <div className="flex items-center px-2">
          <Link
            href="/"
            className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-rose-400 tracking-tight hover:opacity-90 transition-opacity"
          >
            melo.tv
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon size={20} className={active ? 'text-indigo-400' : 'text-zinc-400 transition-colors'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profile Card & Logout */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <Link
          href="/profile"
          className={`flex items-center space-x-3 p-3 rounded-2xl transition-all duration-200 border ${
            isLinkActive('/profile')
              ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
              : 'hover:bg-white/5 border-transparent'
          }`}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-white/10">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm font-bold uppercase">
                {user?.name?.[0]}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center space-x-2 w-full py-3 rounded-2xl text-sm font-medium text-zinc-400 hover:text-rose-400 hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 transition-all duration-200"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
