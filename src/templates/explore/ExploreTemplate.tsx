'use client';

import { useState, useEffect } from 'react';

import SidebarLayout from '@/src/components/SidebarLayout';
import ExploreUserCard from '@/src/components/ExploreUserCard';
import { ProfileService, type ExploreDataResponse } from '@/src/services/profileService';

export default function ExploreTemplate() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [exploreData, setExploreData] = useState<ExploreDataResponse>({ users: [], categories: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await ProfileService.getExploreProfiles();
        setExploreData(data);
      } catch (err) {
        console.error('Failed to load explore data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredUsers = activeCategory === 'All'
    ? exploreData.users
    : exploreData.users.filter(user => user.interests.includes(activeCategory));

  const allCategories = ['All', ...exploreData.categories];

  return (
    <SidebarLayout>
      <div className="flex flex-col h-full min-h-[calc(100vh-6rem)] max-w-7xl mx-auto px-2 md:px-6 py-6 space-y-6">

        {/* Categories Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide shrink-0">
          {allCategories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeCategory === category
                  ? 'bg-zinc-100 text-black'
                  : 'bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-white/5'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Instagram-style Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0.5 rounded-2xl overflow-hidden bg-black/20 border border-white/5">
          {isLoading ? (
            <div className="col-span-full py-20 text-center text-zinc-500">
              Loading explore...
            </div>
          ) : filteredUsers.map((user, idx) => {
            const gradients = [
              'bg-linear-to-br from-blue-500 to-cyan-500',
              'bg-linear-to-br from-purple-500 to-indigo-500',
              'bg-linear-to-br from-orange-500 to-rose-500',
              'bg-linear-to-br from-emerald-400 to-teal-500',
            ];
            const gradientClass = gradients[idx % gradients.length];
            
            return (
              <ExploreUserCard
                key={user.id}
                id={user.id}
                name={user.name}
                bio={user.bio || 'No bio'}
                conversationTitle={user.conversationTitle}
                category={user.interests[0] || 'New'}
                gradientClass={gradientClass}
                exploreThumbnail={user.exploreThumbnail}
                avatar={user.avatar}
              />
            );
          })}

          {!isLoading && filteredUsers.length === 0 && (
            <div className="col-span-full py-20 text-center text-zinc-500">
              No users found in this category.
            </div>
          )}
        </div>

      </div>
    </SidebarLayout>
  );
}
