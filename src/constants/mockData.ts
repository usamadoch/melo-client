import { ExploreUser } from '../types/explore';
import type { IncomingRequest } from '../types/requests';

export const CATEGORIES = ['All', 'AI', 'Startups', 'Movies', 'Fitness', 'Gaming', 'Books', 'Music', 'Travel'];

export const MOCK_USERS: ExploreUser[] = [
  {
    id: 1,
    name: 'Ahmed',
    category: 'Startups',
    gradientClass: 'bg-linear-to-br from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    name: 'Sarah',
    category: 'Movies',
    gradientClass: 'bg-linear-to-br from-purple-500 to-indigo-500'
  },
  {
    id: 3,
    name: 'Kenji',
    category: 'Gaming',
    gradientClass: 'bg-linear-to-br from-orange-500 to-rose-500'
  },
  {
    id: 4,
    name: 'Maya',
    category: 'Books',
    gradientClass: 'bg-linear-to-br from-emerald-400 to-teal-500'
  },
  {
    id: 5,
    name: 'David',
    category: 'AI',
    gradientClass: 'bg-linear-to-br from-slate-700 to-zinc-900'
  },
  {
    id: 6,
    name: 'Emma',
    category: 'Travel',
    gradientClass: 'bg-linear-to-br from-pink-500 to-rose-400'
  },
  {
    id: 7,
    name: 'Alex',
    category: 'Fitness',
    gradientClass: 'bg-linear-to-br from-blue-600 to-violet-600'
  },
  {
    id: 8,
    name: 'Lucas',
    category: 'Music',
    gradientClass: 'bg-linear-to-br from-amber-400 to-orange-500'
  }
];

export const MOCK_REQUESTS: IncomingRequest[] = [
  {
    id: 'req_1',
    name: 'Alex D.',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    info: 'Building an AI startup. Looking for feedback.',
    tags: ['Startups', 'AI'],
    availability: 'available',
  },
  {
    id: 'req_2',
    name: 'Sarah',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    info: 'React developer looking to chat about Next.js.',
    tags: ['React', 'WebDev'],
    availability: 'busy',
  },
  {
    id: 'req_3',
    name: 'James C.',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    info: 'Just chilling and listening to lofi.',
    tags: ['Music', 'Chill'],
    availability: 'offline',
  },
];

export const MOCK_CHAT_CONTEXT = {
  discussionTitle: 'Building an AI startup. Looking for feedback.',
  discussionTopics: ['Startups', 'AI']
};
