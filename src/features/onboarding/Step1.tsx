import { useState } from 'react';
import type { OnboardingData } from '@/src/templates/onboarding/OnboardingTemplate';
import { UserCircle } from 'lucide-react';

interface Props {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
}

export default function Step1({ data, updateData, onNext }: Props) {
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!data.displayName.trim()) {
      setError('Display name is required');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
          <UserCircle size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Welcome to melo.tv</h2>
          <p className="text-zinc-400">Let's start with the basics.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Display Name</label>
          <input
            type="text"
            value={data.displayName}
            onChange={(e) => updateData({ displayName: e.target.value })}
            className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder-zinc-600"
            placeholder="How should we call you?"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <button
          onClick={handleNext}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
