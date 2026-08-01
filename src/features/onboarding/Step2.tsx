import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { OnboardingData } from '@/src/templates/onboarding/OnboardingTemplate';
import { Compass } from 'lucide-react';
import { ProfileService, type CategoryDef } from '@/src/services/profileService';

interface Props {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2({ data, updateData, onNext, onPrev }: Props) {
  const [error, setError] = useState('');

  const { data: categories = [], isLoading } = useQuery<CategoryDef[]>({
    queryKey: ['categories'],
    queryFn: ProfileService.getCategories,
  });

  const toggleCategory = (categoryName: string) => {
    const current = data.categories;
    if (current.includes(categoryName)) {
      // Removing a category — also remove its subcategories
      const categoryDef = categories.find((c) => c.name === categoryName);
      const subNames = categoryDef?.subcategories.map((s) => s.name) || [];
      updateData({
        categories: current.filter((c: string) => c !== categoryName),
        subcategories: data.subcategories.filter((s: string) => !subNames.includes(s)),
      });
    } else {
      updateData({ categories: [...current, categoryName] });
    }
  };

  const toggleSubcategory = (subcategoryName: string) => {
    const current = data.subcategories;
    if (current.includes(subcategoryName)) {
      updateData({ subcategories: current.filter((s: string) => s !== subcategoryName) });
    } else {
      updateData({ subcategories: [...current, subcategoryName] });
    }
  };

  const handleNext = () => {
    if (data.categories.length === 0) {
      setError('Select at least one category');
      return;
    }
    setError('');
    onNext();
  };

  // Get all subcategories for the currently selected categories
  const activeSubcategories = categories
    .filter((cat) => data.categories.includes(cat.name))
    .flatMap((cat) => cat.subcategories.map((sub) => sub.name));

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
          <Compass size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Your Interests</h2>
          <p className="text-zinc-400">Pick categories, then refine with subcategories.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Categories */}
        <div>
          <h3 className="text-sm font-medium text-zinc-300 mb-3">Categories</h3>
          {isLoading ? (
            <p className="text-zinc-500 text-sm">Loading categories...</p>
          ) : (
            <div className="flex flex-wrap gap-2 animate-in fade-in duration-300">
              {categories.map((cat) => {
                const isSelected = data.categories.includes(cat.name);
                return (
                  <button
                    key={cat.name}
                    onClick={() => toggleCategory(cat.name)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-300 ${
                      isSelected
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                        : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Subcategories (only show if any category is selected) */}
        {activeSubcategories.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-sm font-medium text-zinc-300 mb-3">Refine your selections</h3>
            <div className="flex flex-wrap gap-2 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
              {activeSubcategories.map((subName) => {
                const isSubSelected = data.subcategories.includes(subName);
                return (
                  <button
                    key={subName}
                    onClick={() => toggleSubcategory(subName)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-all duration-200 ${
                      isSubSelected
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                        : 'bg-zinc-800/30 border-zinc-700/50 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {subName}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Free text field */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Anything specific? <span className="text-zinc-500">(optional)</span>
          </label>
          <input
            type="text"
            value={data.freeTextInterest}
            onChange={(e) => updateData({ freeTextInterest: e.target.value })}
            maxLength={200}
            className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-zinc-600"
            placeholder="e.g. roguelike deckbuilders, SaaS for dentists..."
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

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
