'use client';

import { useRouter } from 'next/navigation';
import SidebarLayout from '@/src/components/SidebarLayout';
import { useAuthStore } from '@/src/store/authStore';
import { useMatchmaking } from '@/src/hooks/useMatchmaking';
import { MOCK_CHAT_CONTEXT } from '@/src/constants/mockData';

export default function ChatTemplate({ conversationId }: { conversationId: string }) {
  const router = useRouter();
  const { token } = useAuthStore();

  // Reusing the matchmaking hook to quickly acquire local/remote media stream references
  // for the UI layout. In a real environment, a dedicated useCall hook would manage the connection.
  const { localVideoRef, remoteVideoRef } = useMatchmaking(token || undefined);

  const handleEndMatch = () => {
    // End the match and return to explore
    router.push('/explore');
  };

  const { discussionTitle, discussionTopics } = MOCK_CHAT_CONTEXT;

  return (
    <SidebarLayout>
      <div className="flex flex-col h-full min-h-[calc(100vh-6rem)] max-w-6xl mx-auto p-4 space-y-4">

        {/* Discussion Header */}
        <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white mb-2">{discussionTitle}</h1>
            <div className="flex flex-wrap gap-2">
              {discussionTopics.map(topic => (
                <span key={topic} className="px-2 py-1 bg-black/40 text-zinc-300 text-xs font-semibold rounded-md border border-white/5 shadow-sm">
                  #{topic}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-semibold">Active Match</span>
          </div>
        </div>

        {/* Main Video Area */}
        <div className="relative flex-1 bg-zinc-950 rounded-3xl overflow-hidden border border-white/5 shadow-2xl min-h-100">

          {/* Remote Video (Full Size) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Local Video (PIP) */}
          <div className="absolute bottom-6 right-6 w-48 sm:w-64 aspect-video bg-zinc-900 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl z-30">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100" // Mirror local video
            />
          </div>
        </div>

        {/* Control Bar */}
        <div className="flex items-center justify-center gap-6 bg-zinc-900/40 p-4 rounded-3xl border border-white/5 backdrop-blur-md shrink-0">
          <button
            onClick={handleEndMatch}
            className="px-10 py-4 bg-rose-600 hover:bg-rose-500 text-white text-lg font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] active:scale-95"
          >
            End Match
          </button>
        </div>

      </div>
    </SidebarLayout>
  );
}
