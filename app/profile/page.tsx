import { Metadata } from 'next';

import ProfileTemplate from '@/src/templates/profile/ProfileTemplate';

export const metadata: Metadata = {
  title: 'Profile - melo.tv',
  description: 'Manage your public details and matchmaking preferences on melo.tv.',
};

export default function ProfilePage() {
  return <ProfileTemplate />;
}
