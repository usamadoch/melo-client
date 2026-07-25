'use client';

import { useState } from 'react';

import SidebarLayout from '@/src/components/SidebarLayout';
import ExploreUserCard from '@/src/components/ExploreUserCard';
import { CATEGORIES, MOCK_USERS } from '@/src/constants/mockData';

export default function ExploreTemplate() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredUsers = activeCategory === 'All'
    ? MOCK_USERS
    : MOCK_USERS.filter(user => user.category === activeCategory);

  return (
    <SidebarLayout>
      <div className="flex flex-col h-full min-h-[calc(100vh-6rem)] max-w-7xl mx-auto px-2 md:px-6 py-6 space-y-6">

        {/* Categories Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide shrink-0">
          {CATEGORIES.map(category => (
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
          {filteredUsers.map(user => (
            <ExploreUserCard
              key={user.id}
              name={user.name}
              bio={user.bio}
              category={user.category}
              gradientClass={user.gradientClass}
            />
          ))}

          {filteredUsers.length === 0 && (
            <div className="col-span-full py-20 text-center text-zinc-500">
              No users found in this category.
            </div>
          )}
        </div>

      </div>
    </SidebarLayout>
  );
}
