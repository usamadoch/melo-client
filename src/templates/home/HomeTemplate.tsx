'use client';

import { useAuthStore } from '@/src/store/authStore';
import SidebarLayout from '@/src/components/SidebarLayout';

export default function HomeTemplate() {
  const { user } = useAuthStore();

  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Home</h1>
          <p className="text-zinc-500 text-sm mt-1">Welcome back, {user?.name || 'User'}!</p>
        </div>

        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center min-h-75 text-center">
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-bold text-white">Welcome to melo.tv</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Use the sidebar to search for matches, edit your profile settings, and connect with other users.
            </p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
