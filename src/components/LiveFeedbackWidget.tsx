'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/src/store/authStore';

type FeedbackState = 'LIKE' | 'DISLIKE' | 'NONE';

interface LiveFeedbackWidgetProps {
  matchId: string;
  remotePeerId: string;
  source: 'RANDOM' | 'EXPLORE';
}

const DISLIKE_REASONS = [
  { code: 'NUDITY_INAPPROPRIATE', label: 'Nudity/Inappropriate Content' },
  { code: 'HARASSMENT', label: 'Harassment/Abuse' },
  { code: 'DIFFERENT_INTERESTS', label: 'Different Interests' },
  { code: 'CONNECTION_ISSUE', label: 'Connection Issue' },
] as const;

export default function LiveFeedbackWidget({ matchId, remotePeerId, source }: LiveFeedbackWidgetProps) {
  const { token } = useAuthStore();
  const [feedback, setFeedback] = useState<FeedbackState>('NONE');
  const [showReasons, setShowReasons] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Close reason dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setShowReasons(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const submitFeedback = async (newState: FeedbackState, reasonCode: string | null = null) => {
    // Optimistic UI update
    setFeedback(newState);
    setShowReasons(false);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/feedback/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          matchId,
          toUserId: remotePeerId,
          source,
          currentState: newState,
          reasonCode,
        }),
      });
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  const handleLike = () => {
    const newState = feedback === 'LIKE' ? 'NONE' : 'LIKE';
    submitFeedback(newState);
  };

  const handleDislikeClick = () => {
    if (feedback === 'DISLIKE') {
      submitFeedback('NONE');
    } else {
      setShowReasons(!showReasons);
    }
  };

  const handleReasonSelect = (reasonCode: string) => {
    submitFeedback('DISLIKE', reasonCode);
  };

  return (
    <div ref={widgetRef} className="absolute top-6 left-6 z-30 flex flex-col items-start gap-2">
      <div className="flex bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-1">
        <button
          onClick={handleLike}
          className={`p-3 rounded-xl transition-all ${feedback === 'LIKE' ? 'bg-emerald-500 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
          title="Like"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 9h3v12H2a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1zm5.293-1.293l6.4-6.4a1 1 0 0 1 1.414 0l.5.5a1 1 0 0 1 .253 1.055L14.2 6.5H21a2 2 0 0 1 2 2v2a2.006 2.006 0 0 1-1.042 1.763L16 19.5a2 2 0 0 1-1 .25H8a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
          </svg>
        </button>
        <div className="w-px bg-white/10 my-2 mx-1"></div>
        <button
          onClick={handleDislikeClick}
          className={`p-3 rounded-xl transition-all ${feedback === 'DISLIKE' ? 'bg-rose-500 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'} ${showReasons ? 'bg-zinc-800 text-white' : ''}`}
          title="Dislike"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 15h-3V3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zm-5.293 1.293l-6.4 6.4a1 1 0 0 1-1.414 0l-.5-.5a1 1 0 0 1-.253-1.055L9.8 17.5H3a2 2 0 0 1-2-2v-2a2.006 2.006 0 0 1 1.042-1.763L8 4.5a2 2 0 0 1 1-.25h7a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1z" />
          </svg>
        </button>
      </div>

      {showReasons && (
        <div className="bg-zinc-900/95 backdrop-blur-md rounded-2xl border border-white/10 p-2 shadow-2xl min-w-50 animate-in fade-in slide-in-from-top-2">
          <div className="text-xs font-semibold text-zinc-500 px-3 py-2 uppercase tracking-wider">
            Why dislike?
          </div>
          {DISLIKE_REASONS.map((reason) => (
            <button
              key={reason.code}
              onClick={() => handleReasonSelect(reason.code)}
              className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl transition-colors"
            >
              {reason.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
