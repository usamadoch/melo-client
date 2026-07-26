'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import type { Availability } from '../types/requests';
import { useRequestsStore } from '../store/requestsStore';
import { useChatRequestsSocket } from '../hooks/useChatRequestsSocket';

const getRingColor = (availability: Availability) => {
  switch (availability) {
    case 'available':
      return 'ring-emerald-500';
    case 'busy':
      return 'ring-amber-500';
    case 'offline':
      return 'ring-zinc-600';
    default:
      return 'ring-zinc-600';
  }
};

export default function IncomingRequestsSidebar() {
  const incomingRequests = useRequestsStore(state => state.incomingRequests);
  const { acceptChatRequest } = useChatRequestsSocket();

  const handleAccept = (requesterUserId: string) => {
    acceptChatRequest(requesterUserId);
  };

  return (
    <aside className="hidden xl:flex flex-col w-80 border-l border-white/5 bg-zinc-900/20 backdrop-blur-xl fixed h-screen top-0 right-0 z-30 overflow-y-auto">
      <div className="p-6 pb-2 border-b border-white/5 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-10">
        <h2 className="text-lg font-bold text-white flex items-center justify-between">
          <span>Incoming Requests</span>
          <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {incomingRequests.length}
          </span>
        </h2>
        <p className="text-zinc-500 text-xs mt-1">People who want to talk to you</p>
      </div>

      <div className="p-4 space-y-4">
        {incomingRequests.map((req) => (
          <div key={req.id} className="bg-zinc-800/40 border border-white/5 rounded-2xl p-4 hover:bg-zinc-800/60 transition-colors">
            <div className="flex items-start gap-3">
              <div className="relative shrink-0 mt-1">
                <img 
                  src={req.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(req.name)}`} 
                  alt={req.name} 
                  className={`w-12 h-12 rounded-full object-cover ring-2 ring-offset-2 ring-offset-zinc-900 ${getRingColor(req.availability)}`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-white truncate">{req.name}</h3>
                <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">{req.info}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {req.tags.map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 bg-black/40 text-zinc-300 text-[10px] font-semibold rounded-md border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => handleAccept(req.id)}
              className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.2)] active:scale-95"
            >
              Accept
            </button>
          </div>
        ))}
        
        {incomingRequests.length === 0 && (
          <div className="text-center text-zinc-500 text-sm py-8">
            No incoming requests.
          </div>
        )}
      </div>
    </aside>
  );
}
