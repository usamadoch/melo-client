'use client';

import { useQuery } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/src/store/authStore';
import { AuthService } from '@/src/services/authService';
import { ProfileService } from '@/src/services/profileService';

export default function HomeTemplate() {
  const { user, logout } = useAuthStore();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: ProfileService.getMyProfile,
    enabled: !!user,
  });

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-rose-400 tracking-tight">
          melo.tv
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors"
        >
          <span>Sign Out</span>
          <LogOut size={18} />
        </button>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-zinc-900/60 border border-white/5 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-800 shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 text-3xl font-bold uppercase">
                  {user?.name?.[0]}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-1">{user?.name}</h2>
              {isLoading ? (
                <div className="h-6 w-48 bg-zinc-800 animate-pulse rounded-lg mt-1" />
              ) : (
                <p className="text-indigo-400 text-lg font-medium">{profile?.conversationTitle}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">About Me</h3>
                {isLoading ? (
                  <div className="h-24 w-full bg-zinc-800/30 animate-pulse rounded-2xl border border-zinc-800/50" />
                ) : (
                  <p className="text-zinc-400 leading-relaxed bg-zinc-800/30 p-4 rounded-2xl border border-zinc-800/50">
                    {profile?.bio || "No bio provided."}
                  </p>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Interests</h3>
                {isLoading ? (
                  <div className="flex flex-wrap gap-2">
                    <div className="h-8 w-20 bg-zinc-800/50 animate-pulse rounded-full border border-zinc-800/30" />
                    <div className="h-8 w-24 bg-zinc-800/50 animate-pulse rounded-full border border-zinc-800/30" />
                    <div className="h-8 w-16 bg-zinc-800/50 animate-pulse rounded-full border border-zinc-800/30" />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile?.interests?.map((interest) => (
                      <span
                        key={interest}
                        className="px-4 py-1.5 bg-indigo-500/10 text-indigo-300 rounded-full text-sm border border-indigo-500/20 font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-zinc-300 mb-3">Preferences</h3>
              {isLoading ? (
                <>
                  <div className="h-16 w-full bg-zinc-800/30 animate-pulse rounded-2xl border border-zinc-800/50" />
                  <div className="h-16 w-full bg-zinc-800/30 animate-pulse rounded-2xl border border-zinc-800/50" />
                </>
              ) : (
                <>
                  <div className="p-5 bg-zinc-800/30 rounded-2xl border border-zinc-800/50 flex justify-between items-center">
                    <span className="text-zinc-300 font-medium">Show on Explore</span>
                    <div className={`w-3 h-3 rounded-full ${profile?.showOnExplore ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]' : 'bg-red-500'}`} />
                  </div>
                  <div className="p-5 bg-zinc-800/30 rounded-2xl border border-zinc-800/50 flex justify-between items-center">
                    <span className="text-zinc-300 font-medium">Allow Random Matching</span>
                    <div className={`w-3 h-3 rounded-full ${profile?.allowRandomMatching ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]' : 'bg-red-500'}`} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
