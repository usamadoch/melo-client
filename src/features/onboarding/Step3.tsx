import { useState } from 'react';
import type { OnboardingData } from '@/src/templates/onboarding/OnboardingTemplate';
import { MessageSquare } from 'lucide-react';

interface Props {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step3({ data, updateData, onNext, onPrev }: Props) {
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!data.conversationTitle.trim()) {
      setError('Conversation title is required');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400">
          <MessageSquare size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Your Profile</h2>
          <p className="text-zinc-400">What's on your mind today?</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Conversation Title</label>
          <input
            type="text"
            value={data.conversationTitle}
            onChange={(e) => updateData({ conversationTitle: e.target.value })}
            maxLength={100}
            className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-zinc-600"
            placeholder="e.g. Building my first SaaS"
            autoFocus
          />
          <p className="text-zinc-500 text-xs mt-1">{data.conversationTitle.length}/100 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Short Bio (Optional)</label>
          <textarea
            value={data.bio}
            onChange={(e) => updateData({ bio: e.target.value })}
            maxLength={300}
            rows={4}
            className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-zinc-600 resize-none"
            placeholder="Tell others a bit about yourself..."
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      <div className="mt-10 flex justify-between">
        <button
          onClick={onPrev}
          className="text-zinc-400 hover:text-white font-medium py-3 px-6 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
