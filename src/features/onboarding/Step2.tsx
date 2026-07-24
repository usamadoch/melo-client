import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { OnboardingData } from '@/src/templates/onboarding/OnboardingTemplate';
import { Compass } from 'lucide-react';
import { ProfileService } from '@/src/services/profileService';

interface Props {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2({ data, updateData, onNext, onPrev }: Props) {
  const [error, setError] = useState('');

  const { data: categories = ['AI', 'Programming', 'Movies', 'Music', 'Gaming'], isLoading } = useQuery({
    queryKey: ['interests'],
    queryFn: ProfileService.getInterests,
  });

  const toggleInterest = (interest: string) => {
    const current = data.interests;
    if (current.includes(interest)) {
      updateData({ interests: current.filter((i: string) => i !== interest) });
    } else {
      updateData({ interests: [...current, interest] });
    }
  };

  const handleNext = () => {
    if (data.interests.length === 0) {
      setError('Select at least one interest');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
          <Compass size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Your Interests</h2>
          <p className="text-zinc-400">What do you want to talk about?</p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-zinc-500">Loading interests...</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => {
              const isSelected = data.interests.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleInterest(cat)}
                  className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                    isSelected
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
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
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
