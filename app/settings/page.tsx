import { Metadata } from 'next';

import SettingsTemplate from '@/src/templates/settings/SettingsTemplate';

export const metadata: Metadata = {
  title: 'Settings - melo.tv',
  description: 'Manage your melo.tv profile settings, privacy, and preferences.',
};

export default function SettingsPage() {
  return <SettingsTemplate />;
}
