import { Metadata } from 'next';

import ExploreTemplate from '@/src/templates/explore/ExploreTemplate';

export const metadata: Metadata = {
  title: 'Explore - melo.tv',
  description: 'Explore matching options and connect with people who share your passions.',
};

export default function ExplorePage() {
  return <ExploreTemplate />;
}
