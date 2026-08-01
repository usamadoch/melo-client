import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { OnboardingData } from '@/src/templates/onboarding/OnboardingTemplate';
import { Settings, CheckCircle2 } from 'lucide-react';
import { ProfileService } from '@/src/services/profileService';
import { useAuthStore } from '@/src/store/authStore';
import { useRouter } from 'next/navigation';

interface Props {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onPrev: () => void;
}

export default function Step3({ data, updateData, onPrev }: Props) {
  const [error, setError] = useState('');
  const { setProfile, setOnboardingCompleted } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ProfileService.createProfile,
    onSuccess: (profile) => {
      setProfile(profile);
      setOnboardingCompleted();
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      router.push('/');
    },
    onError: (err) => {
      console.error(err);
      setError('Failed to create profile. Please try again.');
    },
  });

  const handleSubmit = () => {
    setError('');
    mutation.mutate(data);
  };

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-400">
          <Settings size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Preferences</h2>
          <p className="text-zinc-400">Finalizing your setup.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl">
          <div>
            <h3 className="text-white font-medium">Show on Explore</h3>
            <p className="text-sm text-zinc-400 mt-1">Allow others to find your profile on the explore page.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={data.showOnExplore}
              onChange={(e) => updateData({ showOnExplore: e.target.checked })}
            />
            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl">
          <div>
            <h3 className="text-white font-medium">Allow Random Matching</h3>
            <p className="text-sm text-zinc-400 mt-1">Join the pool for random one-on-one video chats.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={data.allowRandomMatching}
              onChange={(e) => updateData({ allowRandomMatching: e.target.checked })}
            />
            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      <div className="mt-10 flex justify-between">
        <button
          onClick={onPrev}
          disabled={mutation.isPending}
          className="text-zinc-400 hover:text-white font-medium py-3 px-6 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center space-x-2 disabled:opacity-70 disabled:hover:scale-100"
        >
          {mutation.isPending ? (
            <span>Saving...</span>
          ) : (
            <>
              <span>Finish Setup</span>
              <CheckCircle2 size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
