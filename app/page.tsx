import HomeTemplate from '@/src/templates/home/HomeTemplate';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home - melo.tv',
  description: 'Connect with strangers who share your passions.',
};

export default function Home() {
  return <HomeTemplate />;
}

