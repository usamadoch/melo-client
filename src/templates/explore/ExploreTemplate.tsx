'use client';

import { Compass, Search, Flame, Users, ArrowRight } from 'lucide-react';

import SidebarLayout from '@/src/components/SidebarLayout';

export default function ExploreTemplate() {
  const trendingInterests = ['AI', 'React', 'Startups', 'Design', 'Music', 'Gaming', 'Fitness'];

  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Compass className="text-indigo-400" size={32} />
            <span>Explore</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Discover new connections based on common passions.</p>
        </div>

        {/* Search Bar Mockup */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-zinc-500" size={20} />
          <input
            type="text"
            placeholder="Search interests, topics, or keywords..."
            className="w-full pl-12 pr-4 py-3.5 bg-zinc-900/30 border border-white/5 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:bg-zinc-900/50 transition-all duration-300"
            disabled
          />
        </div>

        {/* Start Matchmaking Banner */}
        <div className="relative overflow-hidden bg-linear-to-br from-indigo-900/40 via-purple-900/20 to-zinc-900/60 border border-indigo-500/20 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
          {/* Decorative glowing blobs */}
          <div className="absolute top-[-50%] right-[-20%] w-[60%] h-[150%] rounded-full bg-indigo-500/10 blur-[100px]" />
          <div className="absolute bottom-[-50%] left-[-20%] w-[60%] h-[150%] rounded-full bg-rose-500/5 blur-[100px]" />

          <div className="relative z-10 max-w-lg space-y-4">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-xs font-semibold border border-indigo-500/20">
              Matchmaking Active
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              Ready to find someone who shares your interests?
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              Our matching algorithm pairs you with online users in real-time based on mutual passions.
            </p>
            <button className="flex items-center space-x-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 group cursor-not-allowed opacity-80">
              <span>Find a Partner</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Interests Grid and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Trending interests block */}
          <div className="md:col-span-2 bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Flame className="text-rose-400" size={18} />
              <span>Trending Interests</span>
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {trendingInterests.map((interest) => (
                <button
                  key={interest}
                  className="px-4 py-2 bg-zinc-800/30 hover:bg-indigo-500/10 text-zinc-400 hover:text-indigo-300 rounded-2xl text-sm border border-white/5 hover:border-indigo-500/25 font-medium transition-all duration-200"
                  disabled
                >
                  #{interest}
                </button>
              ))}
            </div>
          </div>

          {/* Quick stats mockup */}
          <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Users className="text-emerald-400" size={18} />
              <span>Online Now</span>
            </h3>
            <div className="my-auto py-4">
              <span className="text-4xl font-extrabold text-white tracking-tight">1,248</span>
              <p className="text-xs text-zinc-500 mt-1">Users actively chatting and exploring</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Network health optimal</span>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
