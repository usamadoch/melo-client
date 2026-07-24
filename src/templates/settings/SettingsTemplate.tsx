'use client';

import { Settings, Shield, Bell, Eye, Volume2, Globe } from 'lucide-react';

import SidebarLayout from '@/src/components/SidebarLayout';
import { useAuthStore } from '@/src/store/authStore';

interface SettingItem {
  label: string;
  type: 'text' | 'toggle';
  value?: string;
  defaultChecked?: boolean;
}

interface SettingGroup {
  title: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  items: SettingItem[];
}

export default function SettingsTemplate() {
  const { user } = useAuthStore();

  const settingsGroups: SettingGroup[] = [
    {
      title: 'Account Settings',
      icon: Settings,
      iconColor: 'text-indigo-400',
      items: [
        { label: 'Display Name', value: user?.name || 'Loading...', type: 'text' },
        { label: 'Email Address', value: user?.email || 'Loading...', type: 'text' },
      ],
    },
    {
      title: 'Privacy & Discovery',
      icon: Shield,
      iconColor: 'text-emerald-400',
      items: [
        { label: 'Show Online Status', defaultChecked: true, type: 'toggle' },
        { label: 'Incognito Mode (Hide from searches)', defaultChecked: false, type: 'toggle' },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      iconColor: 'text-rose-400',
      items: [
        { label: 'Push Notifications on Matches', defaultChecked: true, type: 'toggle' },
        { label: 'Email Summaries & Newsletters', defaultChecked: false, type: 'toggle' },
      ],
    },
  ];

  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Settings className="text-indigo-400" size={32} />
            <span>Settings</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Manage your account preferences, system, and notifications.</p>
        </div>

        {/* Settings Groups */}
        <div className="space-y-6">
          {settingsGroups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div
                key={group.title}
                className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md"
              >
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <GroupIcon className={group.iconColor} size={20} />
                  <span>{group.title}</span>
                </h2>

                <div className="divide-y divide-white/5">
                  {group.items.map((item, idx) => (
                    <div
                      key={item.label}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between py-4 ${
                        idx === 0 ? 'pt-0' : ''
                      } ${idx === group.items.length - 1 ? 'pb-0' : ''}`}
                    >
                      <span className="text-zinc-300 font-medium text-sm sm:text-base">{item.label}</span>
                      
                      <div className="mt-2 sm:mt-0">
                        {item.type === 'text' && (
                          <span className="text-zinc-500 text-sm font-mono bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-white/5 inline-block">
                            {item.value}
                          </span>
                        )}
                        {item.type === 'toggle' && (
                          <button
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed items-center rounded-full transition-colors duration-200 focus:outline-none ${
                              item.defaultChecked ? 'bg-indigo-600' : 'bg-zinc-800'
                            }`}
                            disabled
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${
                                item.defaultChecked ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SidebarLayout>
  );
}
