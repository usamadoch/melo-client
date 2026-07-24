'use client';

import React from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

interface MobileHeaderProps {
  handleLogout: () => Promise<void>;
}

export default function MobileHeader({ handleLogout }: MobileHeaderProps) {
  return (
    <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <Link href="/" className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-rose-400 tracking-tight">
        melo.tv
      </Link>
      <button
        onClick={handleLogout}
        className="p-2 text-zinc-400 hover:text-rose-400 rounded-xl hover:bg-white/5 transition-colors"
        title="Sign Out"
      >
        <LogOut size={20} />
      </button>
    </header>
  );
}
