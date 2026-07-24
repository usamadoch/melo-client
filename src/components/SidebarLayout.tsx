'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Home, Compass, Settings } from 'lucide-react';

import { useAuthStore } from '@/src/store/authStore';
import { AuthService } from '@/src/services/authService';
import DesktopSidebar from './DesktopSidebar';
import MobileHeader from './MobileHeader';
import MobileBottomNav from './MobileBottomNav';

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      logout();
    }
  };

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white font-sans">
      {/* Desktop Left Sidebar */}
      <DesktopSidebar
        user={user}
        navItems={navItems}
        isLinkActive={isLinkActive}
        handleLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        {/* Mobile Header */}
        <MobileHeader handleLogout={handleLogout} />

        {/* Content Wrapper */}
        <main className="flex-1 p-6 md:p-10 pb-24 md:pb-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav isLinkActive={isLinkActive} />
    </div>
  );
}
