'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SidebarLayout from '@/src/components/SidebarLayout';
import { useAuthStore } from '@/src/store/authStore';
import { useWebRTC } from '@/src/hooks/useWebRTC';
import { ProfileService } from '@/src/services/profileService';
import { useDirectCallSocket } from '@/src/hooks/useDirectCallSocket';
import LiveFeedbackWidget from '@/src/components/LiveFeedbackWidget';
import LiveChatPanel from '@/src/components/LiveChatPanel';

export default function ChatTemplate({ conversationId }: { conversationId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuthStore();

  const remoteUserId = searchParams.get('remoteUserId');
  const initiator = searchParams.get('initiator') === 'true';

  const webrtc = useWebRTC();
  const [remoteUser, setRemoteUser] = useState<{ name: string, categories: string[], subcategories: string[] } | null>(null);

  useEffect(() => {
    if (!token || !remoteUserId) return;

    const fetchRemoteProfile = async () => {
      try {
        const data = await ProfileService.getPublicProfile(remoteUserId);
        if (data) {
          setRemoteUser(data);
        } else {
          setRemoteUser({ name: 'Unknown User', categories: [], subcategories: [] });
        }
      } catch (err) {
        setRemoteUser({ name: 'Unknown User', categories: [], subcategories: [] });
      }
    };
    fetchRemoteProfile();
  }, [token, remoteUserId]);

  const { endCall, socket } = useDirectCallSocket({
    token,
    remoteUserId,
    initiator,
    conversationId,
    webrtc
  });



  return (
    <SidebarLayout>
      <div className="flex flex-col h-full min-h-[calc(100vh-6rem)] max-w-6xl mx-auto p-4 space-y-4">

        {/* Discussion Header */}
        <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white mb-2">{remoteUser ? remoteUser.name : 'Connecting...'}</h1>

            <div className="flex flex-wrap gap-2">
              {[...(remoteUser?.categories || []), ...(remoteUser?.subcategories || [])].map(topic => (
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

        <div className="flex flex-col lg:flex-row gap-4 flex-1 h-full min-h-0">
          {/* Main Video Area */}
          <div className="relative flex-1 bg-zinc-950 rounded-3xl overflow-hidden border border-white/5 shadow-2xl min-h-100">

          {remoteUserId && (
            <LiveFeedbackWidget
              matchId={conversationId}
              remotePeerId={remoteUserId}
              source="EXPLORE"
            />
          )}

          {/* Remote Video (Full Size) */}
          <video
            ref={webrtc.remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Local Video (PIP) */}
          <div className="absolute bottom-6 right-6 w-48 sm:w-64 aspect-video bg-zinc-900 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl z-30">
            <video
              ref={webrtc.localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100" // Mirror local video
            />
          </div>
        </div>

          {/* Chat Panel */}
          {remoteUserId && (
            <div className="w-full lg:w-80 h-64 lg:h-auto shrink-0">
              <LiveChatPanel 
                socket={socket} 
                matchId={conversationId} 
                remoteUserId={remoteUserId} 
              />
            </div>
          )}
        </div>

        {/* Control Bar */}
        <div className="flex items-center justify-center gap-6 bg-zinc-900/40 p-4 rounded-3xl border border-white/5 backdrop-blur-md shrink-0">
          <button
            onClick={endCall}
            className="px-10 py-4 bg-rose-600 hover:bg-rose-500 text-white text-lg font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] active:scale-95"
          >
            End Match
          </button>
        </div>

      </div>
    </SidebarLayout>
  );
}
