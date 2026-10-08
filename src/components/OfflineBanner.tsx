import React, { useState, useEffect } from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';
import { getTranslation } from '../lib/i18n';
import { Language } from '../types';

interface Props {
  language: Language;
}

export const OfflineBanner: React.FC<Props> = ({ language }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [justReconnected, setJustReconnected] = useState(false);
  const t = getTranslation(language);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setJustReconnected(true);
      const timer = setTimeout(() => setJustReconnected(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setJustReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !justReconnected) return null;

  if (justReconnected) {
    return (
      <div className="bg-emerald-600 text-white text-xs sm:text-sm py-2 px-4 flex items-center justify-center gap-2 shadow-sm transition-all duration-300">
        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
        <span>Connected back online. Farm data synchronized with Supabase & IoT stream.</span>
      </div>
    );
  }

  return (
    <div className="bg-amber-600 text-white text-xs sm:text-sm py-2 px-4 flex items-center justify-center gap-2 shadow-sm animate-pulse">
      <WifiOff className="w-4 h-4 text-amber-200" />
      <span>{t.offlineNotice}</span>
    </div>
  );
};
