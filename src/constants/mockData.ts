




import { ExploreUser } from '../types/explore';
import type { IncomingRequest } from '../types/requests';

export const CATEGORIES = ['All', 'AI', 'Startups', 'Movies', 'Fitness', 'Gaming', 'Books', 'Music', 'Travel'];

export const MOCK_USERS: ExploreUser[] = [
  {
    id: 1,
    name: 'Ahmed',
    bio: 'Building my first SaaS — roast my landing page',
    category: 'Startups',
    gradientClass: 'bg-linear-to-br from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    name: 'Sarah',
    bio: 'Just finished a film, need someone who gets sad endings',
    category: 'Movies',
    gradientClass: 'bg-linear-to-br from-purple-500 to-indigo-500'
  },
  {
    id: 3,
    name: 'Kenji',
    bio: 'Deep in a roguelike run, send tips',
    category: 'Gaming',
    gradientClass: 'bg-linear-to-br from-orange-500 to-rose-500'
  },
  {
    id: 4,
    name: 'Maya',
    bio: 'Reading three books at once, unhinged behavior',
    category: 'Books',
    gradientClass: 'bg-linear-to-br from-emerald-400 to-teal-500'
  },
  {
    id: 5,
    name: 'David',
    bio: 'Anyone wanna chat about the new AI models?',
    category: 'AI',
    gradientClass: 'bg-linear-to-br from-slate-700 to-zinc-900'
  },
  {
    id: 6,
    name: 'Emma',
    bio: 'Planning a solo trip to Japan next year!',
    category: 'Travel',
    gradientClass: 'bg-linear-to-br from-pink-500 to-rose-400'
  },
  {
    id: 7,
    name: 'Alex',
    bio: 'Looking for a workout accountability buddy.',
    category: 'Fitness',
    gradientClass: 'bg-linear-to-br from-blue-600 to-violet-600'
  },
  {
    id: 8,
    name: 'Lucas',
    bio: 'Producing some lo-fi beats, let me know what you think',
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
