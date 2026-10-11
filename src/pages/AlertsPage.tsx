import React, { useState } from 'react';
import { 
  Bell, 
  Smartphone, 
  CheckCircle, 
  ShieldCheck, 
  Send, 
  CloudRain, 
  Sprout, 
  Bug,
  Bot
} from 'lucide-react';
import { Language, NotificationLog, FarmerProfile, SensorReadings } from '../types';
import { getTranslation } from '../lib/i18n';
import { TelegramConnectModal } from '../components/TelegramConnectModal';

interface Props {
  language: Language;
  logs: NotificationLog[];
  profile: FarmerProfile;
  readings: SensorReadings;
  onSendSms: (phone: string, category: string, msg: string) => Promise<void>;
  onSendTelegram?: (chatId: string, category: string, msg: string) => Promise<void>;
  onUpdateProfile?: (updated: FarmerProfile) => void;
}

export const AlertsPage: React.FC<Props> = ({
  language,
  logs,
  profile,
  readings: _readings,
  onSendSms,
  onSendTelegram,
  onUpdateProfile
}) => {
  const t = getTranslation(language);
  const [sending, setSending] = useState(false);
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [alertCategory, setAlertCategory] = useState<'Soil' | 'Weather' | 'Pest' | 'Irrigation'>('Weather');
  const [dispatchChannel, setDispatchChannel] = useState<'Telegram' | 'SMS' | 'Both'>('Telegram');
  const [customText, setCustomText] = useState('');
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

  const activeAlerts = [
    {
      category: "Soil Alert",
      icon: Sprout,
      color: "text-[#279e5a] bg-[#eaf7ef]",
      title: "Nitrogen level entering marginal threshold",
      desc: "Your soil nitrogen reading is 38 mg/kg, below the 40 mg/kg benchmark for vegetative stage tomato growth.",
      action: "Review nitrogen management within 2-3 days",
      time: "2 hours ago"
    },
    {
      category: "Weather Alert",
      icon: CloudRain,
      color: "text-sky-700 bg-sky-100",
      title: "Rain expected in Coimbatore (72% probability)",
      desc: "Scattered showers predicted within 24 hours. Hold drip irrigation to prevent root asphyxiation.",
      action: "Postpone irrigation valves for 24h",
      time: "4 hours ago"
    },
    {
      category: "Pest Watch",
      icon: Bug,
      color: "text-purple-700 bg-purple-100",
      title: "Humid microclimate favorable for early blight",
      desc: "Ambient humidity is 68% with canopy temperature 31°C. Inspect lower leaves across block 2.",
      action: "Inspect lower foliage before sunset",
      time: "5 hours ago"
    }
  ];

  const handleDispatch = async () => {
    setSending(true);
    setSentMessage(null);
    try {
      const msg = customText || (
        alertCategory === 'Soil'
          ? `AgroAI Alert\n\nYour farm soil analysis indicates low Nitrogen.\n\nNitrogen: 28 mg/kg\nStatus: Low\n\nRecommended action:\nConsider nitrogen management according to your crop requirements.\n\nOpen AgroAI for detailed recommendations.`
          : alertCategory === 'Weather'
          ? `AgroAI Advisory\n\nRain expected in your block (72% probability).\n\nAction: Delay drip irrigation to avoid waterlogging and conserve water.`
          : `AgroAI Alert\n\nPest risk elevated due to high humidity. Inspect your crop within 24 hours.`
      );

      const dispatches: Promise<any>[] = [];

      if ((dispatchChannel === 'SMS' || dispatchChannel === 'Both') && profile.phoneNumber) {
        dispatches.push(onSendSms(profile.phoneNumber, alertCategory, msg));
      }

      if ((dispatchChannel === 'Telegram' || dispatchChannel === 'Both') && onSendTelegram) {
        const targetChatId = profile.telegramChatId || '987654321';
        dispatches.push(onSendTelegram(targetChatId, alertCategory, msg));
      }

      await Promise.all(dispatches);
      setSentMessage(
        dispatchChannel === 'Both'
          ? 'Alert dispatched to both SMS and Telegram!'
          : `Alert dispatched to ${dispatchChannel} successfully!`
      );
      setCustomText('');
      setTimeout(() => setSentMessage(null), 4000);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#eaf7ef] text-[#279e5a]">
              <Bell className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-mono text-[#279e5a] font-bold tracking-wider">
              MULTI-CHANNEL CROP ADVISORY DISPATCH
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            {t.alertsSMS}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Automated alerts sent directly to farmer devices via free Telegram Bot API and GSM SMS
          </p>
        </div>

        {/* Channel Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Telegram Status Badge */}
          <button
            onClick={() => setIsTelegramModalOpen(true)}
            className="flex items-center gap-2 bg-[#e3f2fd] hover:bg-[#bbdefb] text-[#0277bd] px-4 py-2 rounded-full border border-[#90caf9] text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            title="Configure Telegram Bot"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {profile.telegramChatId
                ? `Telegram: Active (${profile.telegramChatId})`
                : 'Connect Free Telegram Bot'}
            </span>
          </button>

          {/* GSM Verification Badge */}
          <div className="flex items-center gap-2 bg-[#eaf7ef] text-[#166436] px-4 py-2 rounded-full border border-[#c1e8cd] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#279e5a]" />
            <span>GSM: {profile.phoneNumber}</span>
          </div>
        </div>
      </div>

      {/* Telegram Spotlight Banner (Highlighting Free & Unlimited Access) */}
      <div className="bg-gradient-to-r from-[#0288d1] to-[#0277bd] text-white p-7 rounded-[32px] shadow-[0_20px_48px_-12px_rgba(2,136,209,0.35)] relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-white text-[#0288d1] shadow-sm">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-lg">Telegram Bot Advisory Stream</h3>
                <span className="text-[10px] font-mono bg-white/20 text-white px-2.5 py-0.5 rounded-full font-bold">
                  100% FREE FOREVER
                </span>
              </div>
              <p className="text-xs text-white/90 mt-0.5 max-w-xl leading-relaxed">
                Receive unlimited, instant crop warnings, rain radars, and soil health reports without SMS carrier fees or network restrictions.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTelegramModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-[#0277bd] font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>{profile.telegramChatId ? 'Manage Telegram Bot' : 'Connect Telegram in 60s'}</span>
          </button>
        </div>
      </div>

      {/* Active System Alerts */}
      <div className="bg-white rounded-[32px] border border-stone-200/80 p-7 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.07)] space-y-5">
        <h2 className="font-bold text-stone-900 text-base sm:text-lg">
          Current Active Farm Advisories
        </h2>

        <div className="space-y-3.5">
          {activeAlerts.map((alt, idx) => {
            const Icon = alt.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#f8faf9] border border-stone-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl ${alt.color} shrink-0 mt-0.5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">{alt.title}</span>
                      <span className="text-[10px] text-stone-400 font-mono">{alt.time}</span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{alt.desc}</p>
                    <div className="text-[11px] font-semibold text-[#279e5a] mt-1.5">
                      Action: {alt.action}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivered Notification Records Stream */}
      <div className="bg-white rounded-[32px] border border-stone-200/80 p-7 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.07)] space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-stone-900 text-base sm:text-lg">
            Delivered Notification Records ({logs.length})
          </h2>
          <span className="text-xs font-mono text-stone-500">Telegram Bot & GSM Multi-Channel Log</span>
        </div>

        <div className="space-y-3.5">
          {logs.map((log) => {
            const isTelegram = log.channel === 'Telegram' || log.id.startsWith('TG-');
            return (
              <div
                key={log.id}
                className="p-5 rounded-2xl bg-[#f8faf9] border border-stone-200/80 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold flex items-center gap-1.5">
                    {isTelegram ? (
                      <>
                        <Send className="w-3.5 h-3.5 text-[#0288d1]" />
                        <span className="text-[#0288d1]">Delivered via Telegram Cloud API</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-[#279e5a]" />
                        <span className="text-[#279e5a]">Delivered via GSM Network</span>
                      </>
                    )}
                  </span>
                  <span className="text-stone-400 font-mono text-[11px]">{log.timestamp}</span>
                </div>

                <div className="text-xs font-bold text-stone-900">{log.title}</div>

                <pre className="text-xs text-stone-700 bg-white p-3.5 rounded-xl border border-stone-200 font-sans whitespace-pre-wrap leading-relaxed shadow-xs">
                  {log.message}
                </pre>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span>Recipient: {log.phone}</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-mono text-[10px]">
                      {log.channel || 'SMS'}
                    </span>
                    <span className="bg-[#eaf7ef] text-[#166436] px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold">
                      Category: {log.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Manual Multi-Channel Trigger */}
        <div className="p-6 rounded-[28px] bg-stone-100 border border-stone-200 space-y-3 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                Trigger Live Test Advisory
              </h3>
              <p className="text-xs text-stone-500">
                Dispatches an instant message to test your Telegram Bot and mobile SMS routes.
              </p>
            </div>

            {/* Channel Selection Toggle */}
            <div className="inline-flex rounded-xl bg-white p-1 border border-stone-200 text-xs font-medium self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setDispatchChannel('Telegram')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  dispatchChannel === 'Telegram'
                    ? 'bg-[#0288d1] text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Send className="w-3 h-3" />
                <span>Telegram (Free)</span>
              </button>
              <button
                type="button"
                onClick={() => setDispatchChannel('SMS')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  dispatchChannel === 'SMS'
                    ? 'bg-[#279e5a] text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>GSM SMS</span>
              </button>
              <button
                type="button"
                onClick={() => setDispatchChannel('Both')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  dispatchChannel === 'Both'
                    ? 'bg-stone-900 text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>Both Channels</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <select
              value={alertCategory}
              onChange={(e) => setAlertCategory(e.target.value as any)}
              className="bg-white text-stone-800 text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 font-semibold cursor-pointer"
            >
              <option value="Weather">Weather Advisory (Rain/Irrigation)</option>
              <option value="Soil">Soil Nutrient Alert (Nitrogen)</option>
              <option value="Pest">Pest Warning (Early Blight)</option>
              <option value="Irrigation">Irrigation Schedule</option>
            </select>

            <input
              type="text"
              placeholder="Custom advisory message or leave blank for default template..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="flex-1 bg-white text-stone-800 text-xs px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#279e5a]"
            />

            <button
              onClick={handleDispatch}
              disabled={sending}
              className={`px-6 py-2.5 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer shrink-0 disabled:opacity-50 ${
                dispatchChannel === 'Telegram'
                  ? 'bg-[#0288d1] hover:bg-[#0277bd]'
                  : dispatchChannel === 'SMS'
                  ? 'bg-[#279e5a] hover:bg-[#1f8249]'
                  : 'bg-[#191c21] hover:bg-black'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sending ? 'Sending...' : `Send to ${dispatchChannel}`}</span>
            </button>
          </div>

          {sentMessage && (
            <div className="text-xs text-[#279e5a] flex items-center gap-1.5 font-bold pt-1">
              <CheckCircle className="w-4 h-4" />
              <span>{sentMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Telegram Connect Modal */}
      {onUpdateProfile && (
        <TelegramConnectModal
          isOpen={isTelegramModalOpen}
          onClose={() => setIsTelegramModalOpen(false)}
          profile={profile}
          onUpdateProfile={onUpdateProfile}
        />
      )}
    </div>
  );
};
