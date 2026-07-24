import OnboardingTemplate from '@/src/templates/onboarding/OnboardingTemplate';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onboarding - melo.tv',
  description: 'Complete your profile setup to start connecting with others.',
};

export default function OnboardingPage() {
  return <OnboardingTemplate />;
}

export type { OnboardingData } from '@/src/templates/onboarding/OnboardingTemplate';

