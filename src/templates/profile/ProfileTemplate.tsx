'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/src/store/authStore';
import { ProfileService } from '@/src/services/profileService';
import SidebarLayout from '@/src/components/SidebarLayout';

export default function ProfileTemplate() {
  const { user } = useAuthStore();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: ProfileService.getMyProfile,
    enabled: !!user,
  });

  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage your public information and search preferences.</p>
        </div>

        {/* Profile Details Card */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 text-center sm:text-left">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-white/10 shadow-lg">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-3xl font-bold uppercase">
                  {user?.name?.[0]}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-1">{user?.name}</h2>
              {isLoading ? (
                <div className="h-6 w-48 bg-zinc-800/50 animate-pulse rounded-lg mt-1 mx-auto sm:mx-0" />
              ) : (
                <p className="text-indigo-400 text-lg font-medium">
                  {profile?.conversationTitle || "No conversation title set."}
                </p>
              )}
              <p className="text-sm text-zinc-500 mt-1">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">About Me</h3>
                {isLoading ? (
                  <div className="h-24 w-full bg-zinc-800/30 animate-pulse rounded-2xl border border-zinc-800/50" />
                ) : (
                  <p className="text-zinc-400 leading-relaxed bg-zinc-800/30 p-4 rounded-2xl border border-zinc-800/50 min-h-24">
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
                    {profile?.interests && profile.interests.length > 0 ? (
                      profile.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-4 py-1.5 bg-indigo-500/10 text-indigo-300 rounded-full text-sm border border-indigo-500/20 font-medium"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span className="text-zinc-500 text-sm">No interests listed.</span>
                    )}
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
                    <div
                      className={`w-3 h-3 rounded-full ${profile?.showOnExplore
                          ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                          : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                        }`}
                    />
                  </div>
                  <div className="p-5 bg-zinc-800/30 rounded-2xl border border-zinc-800/50 flex justify-between items-center">
                    <span className="text-zinc-300 font-medium">Allow Random Matching</span>
                    <div
                      className={`w-3 h-3 rounded-full ${profile?.allowRandomMatching
                          ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                          : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                        }`}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
