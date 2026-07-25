'use client';

import { useAuthStore } from '@/src/store/authStore';
import SidebarLayout from '@/src/components/SidebarLayout';
import { useMatchmaking } from '@/src/hooks/useMatchmaking';

export default function HomeTemplate() {
  const { token } = useAuthStore();
  const { 
    matchStatus, joinQueue, handleStop, handleNext, 
    localVideoRef, remoteVideoRef, mediaError 
  } = useMatchmaking(token || undefined);

  return (
    <SidebarLayout>
      <div className="flex flex-col h-full min-h-[calc(100vh-6rem)] max-w-6xl mx-auto p-4 space-y-4">
        
        {/* Main Video Area */}
        <div className="relative flex-1 bg-zinc-950 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
          
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

          {/* Status Overlay */}
          {matchStatus === 'idle' && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-20">
              <div className="text-center p-8 bg-zinc-900/50 rounded-3xl border border-white/10 shadow-xl max-w-md w-full mx-4">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">👋</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Ready to Connect</h2>
                <p className="text-zinc-400 text-lg">Click start to meet people who share your interests.</p>
                {mediaError && (
                  <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm">
                    {mediaError}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {matchStatus === 'searching' && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-20">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                  <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-wide">Finding a match...</h2>
                <p className="text-zinc-500 mt-2">Looking for shared interests</p>
              </div>
            </div>
          )}
        </div>

        {/* Control Bar */}
        <div className="flex items-center justify-center gap-4 bg-zinc-900/40 p-4 rounded-3xl border border-white/5 backdrop-blur-md shrink-0">
          {matchStatus === 'idle' ? (
            <button 
              onClick={joinQueue}
              className="px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95"
            >
              Start Matching
            </button>
          ) : (
            <>
              <button 
                onClick={handleStop}
                className="px-8 py-4 bg-zinc-800 hover:bg-rose-500/90 text-white font-bold rounded-2xl transition-all border border-white/5 hover:border-transparent active:scale-95 min-w-[120px]"
              >
                Stop
              </button>
              <button 
                onClick={handleNext}
                className="px-10 py-4 bg-white hover:bg-zinc-200 text-zinc-950 text-lg font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 min-w-[140px]"
              >
                Next ➔
              </button>
            </>
          )}
        </div>
        
      </div>
    </SidebarLayout>
  );
}
