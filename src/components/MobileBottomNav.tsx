import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Sprout, 
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-stone-200/90 px-3 py-2 shadow-2xl safe-area-inset-bottom">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
                tab.highlight
                  ? isActive
                    ? 'text-white bg-[#279e5a] -mt-4 p-3 shadow-lg shadow-[#279e5a]/40 rounded-full border-2 border-white'
                    : 'text-white bg-[#191c21] -mt-4 p-3 shadow-lg rounded-full border-2 border-white'
                  : isActive
                  ? 'text-[#279e5a] font-bold'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <div className="relative">
                <Icon className={tab.highlight ? 'w-5 h-5' : 'w-5 h-5'} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2 bg-[#191c21] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${tab.highlight ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
