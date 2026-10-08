import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Sprout, 
  CloudRain, 
  Bug, 
  MessageSquare, 
  Bell, 
  User 
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../lib/i18n';

interface Props {
  language: Language;
  unreadCount: number;
}

export const MobileBottomNav: React.FC<Props> = ({ language, unreadCount }) => {
  const location = useLocation();
  const t = getTranslation(language);

  const tabs = [
    { to: '/dashboard', label: 'Home', icon: Home },
    { to: '/soil', label: 'Farm', icon: Sprout },
    { to: '/advisor', label: 'AI Advisor', icon: MessageSquare, highlight: true },
    { to: '/alerts', label: 'Alerts', icon: Bell, badge: unreadCount },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-stone-900/95 backdrop-blur-lg border-t border-stone-800 px-2 py-1.5 shadow-2xl safe-area-inset-bottom">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                tab.highlight
                  ? isActive
                    ? 'text-white bg-emerald-700/80 -mt-3 p-2.5 shadow-lg shadow-emerald-950/60 rounded-2xl border border-emerald-500'
                    : 'text-emerald-400 bg-stone-800 -mt-3 p-2.5 shadow-md rounded-2xl border border-stone-700'
                  : isActive
                  ? 'text-emerald-400 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className="relative">
                <Icon className={tab.highlight ? 'w-6 h-6' : 'w-5 h-5'} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-stone-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${tab.highlight ? 'font-medium' : ''}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
