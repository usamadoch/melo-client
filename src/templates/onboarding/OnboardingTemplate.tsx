'use client';

import { useState } from 'react';
import Step1 from '@/src/features/onboarding/Step1';
import Step2 from '@/src/features/onboarding/Step2';
import Step3 from '@/src/features/onboarding/Step3';
import Step4 from '@/src/features/onboarding/Step4';
import { motion, AnimatePresence } from 'framer-motion';

export type OnboardingData = {
  displayName: string;
  interests: string[];
  bio: string;
  conversationTitle: string;
  showOnExplore: boolean;
  allowRandomMatching: boolean;
};

export default function OnboardingTemplate() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    displayName: '',
    interests: [],
    bio: '',
    conversationTitle: '',
    showOnExplore: true,
    allowRandomMatching: true,
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  const updateData = (newData: Partial<OnboardingData>) => setData({ ...data, ...newData });

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6 overflow-hidden relative">
      <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-emerald-600/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[150px] pointer-events-none" />

      <div className="z-10 w-full max-w-2xl bg-zinc-900/80 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 w-12 rounded-full transition-colors duration-500 ${
                  i <= step ? 'bg-emerald-500' : 'bg-zinc-800'
                }`}
              />
            ))}
          </div>
          <span className="text-zinc-500 text-sm">Step {step} of 4</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && <Step1 data={data} updateData={updateData} onNext={nextStep} />}
            {step === 2 && <Step2 data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} />}
            {step === 3 && <Step3 data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} />}
            {step === 4 && <Step4 data={data} updateData={updateData} onPrev={prevStep} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
