import React, { useState } from 'react';
import { 
  Bell, 
  Smartphone, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Send, 
  CloudRain, 
  Sprout, 
  Bug, 
  Droplet 
} from 'lucide-react';
import { Language, NotificationLog, FarmerProfile, SensorReadings } from '../types';
import { getTranslation } from '../lib/i18n';
import { apiService } from '../services/api';

interface Props {
  language: Language;
  logs: NotificationLog[];
  profile: FarmerProfile;
  readings: SensorReadings;
  onSendSms: (phone: string, category: string, msg: string) => Promise<void>;
}

export const AlertsPage: React.FC<Props> = ({
  language,
  logs,
  profile,
  readings,
  onSendSms
}) => {
  const t = getTranslation(language);
  const [sending, setSending] = useState(false);
  const [sentMessage, setSentMessage] = useState(false);
  const [smsCategory, setSmsCategory] = useState<'Soil' | 'Weather' | 'Pest' | 'Irrigation'>('Soil');
  const [customText, setCustomText] = useState('');

  const activeAlerts = [
    {
      category: "Soil Alert",
      icon: Sprout,
      color: "text-amber-800 bg-amber-100",
      title: "Nitrogen level entering marginal threshold",
      desc: "Your soil nitrogen reading is 38 mg/kg, below the 40 mg/kg benchmark for vegetative stage tomato growth.",
      action: "Review nitrogen management within 2-3 days",
      time: "2 hours ago"
    },
    {
      category: "Weather Alert",
      icon: CloudRain,
      color: "text-sky-800 bg-sky-100",
      title: "Rain expected in Coimbatore (72% probability)",
      desc: "Scattered showers predicted within 24 hours. Hold drip irrigation to prevent root asphyxiation.",
      action: "Postpone irrigation valves for 24h",
      time: "4 hours ago"
    },
    {
      category: "Pest Watch",
      icon: Bug,
      color: "text-purple-800 bg-purple-100",
      title: "Humid microclimate favorable for early blight",
      desc: "Ambient humidity is 68% with canopy temperature 31°C. Inspect lower leaves across block 2.",
      action: "Inspect lower foliage before sunset",
      time: "5 hours ago"
    }
  ];

  const handleDispatch = async () => {
    setSending(true);
    setSentMessage(false);
    try {
      const msg = customText || (
        smsCategory === 'Soil'
          ? `AgriSense AI Alert\n\nYour farm soil analysis indicates low Nitrogen.\n\nNitrogen: 28 mg/kg\nStatus: Low\n\nRecommended action:\nConsider nitrogen management according to your crop requirements.\n\nOpen AgriSense AI for detailed recommendations.`
          : smsCategory === 'Weather'
          ? `AgriSense AI Advisory\n\nRain expected in your block (72% probability).\n\nAction: Delay drip irrigation to avoid waterlogging and conserve water.`
          : `AgriSense AI Alert\n\nPest risk elevated due to high humidity. Inspect your crop within 24 hours.`
      );

      await onSendSms(profile.phoneNumber, smsCategory, msg);
      setSentMessage(true);
      setCustomText('');
      setTimeout(() => setSentMessage(false), 4000);
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
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Bell className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-mono text-amber-800 font-bold tracking-wider">
              NOTIFICATION & GSM SMS DISPATCH
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            {t.alertsSMS}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Automated alerts sent directly to farmer phones without requiring app to be open
          </p>
        </div>

        {/* Verification Pill */}
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-xl border border-emerald-200 text-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>GSM Phone Verified: {profile.phoneNumber}</span>
        </div>
      </div>

      {/* Verified Phone Card */}
      <div className="bg-stone-900 text-stone-100 p-6 rounded-3xl border border-stone-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-stone-100 text-base">{profile.phoneNumber}</h3>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                  VERIFIED RECIPIENT
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Primary contact for {profile.fullName} ({profile.farmName})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-300 bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Anti-Spam Cooldown: 2 Hours per issue type</span>
          </div>
        </div>
      </div>

      {/* Active System Alerts */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-5">
        <h2 className="font-bold text-stone-900 text-base sm:text-lg">
          Current Active Farm Advisories
        </h2>

        <div className="space-y-3">
          {activeAlerts.map((alt, idx) => {
            const Icon = alt.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl ${alt.color} shrink-0 mt-0.5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">{alt.title}</span>
                      <span className="text-[10px] text-stone-400 font-mono">{alt.time}</span>
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{alt.desc}</p>
                    <div className="text-[11px] font-semibold text-emerald-800 mt-1">
                      Action: {alt.action}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivered GSM SMS Log Stream */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-stone-900 text-base sm:text-lg">
            Delivered SMS Delivery Records ({logs.length})
          </h2>
          <span className="text-xs font-mono text-stone-500">Fast2SMS / GSM Gateway Log</span>
        </div>

        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-700 font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  {log.status === 'delivered' ? 'SMS Delivered to GSM Network' : log.status}
                </span>
                <span className="text-stone-400 font-mono text-[11px]">{log.timestamp}</span>
              </div>

              <div className="text-xs font-bold text-stone-900">{log.title}</div>

              <pre className="text-xs text-stone-700 bg-white p-3 rounded-xl border border-stone-200 font-sans whitespace-pre-wrap leading-relaxed">
                {log.message}
              </pre>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                <span>Recipient: {log.phone}</span>
                <span className="bg-stone-200 text-stone-800 px-2 py-0.5 rounded font-mono text-[10px]">
                  Category: {log.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Manual SMS Trigger Box */}
        <div className="p-5 rounded-2xl bg-stone-900 text-stone-200 space-y-3 mt-4">
          <h3 className="font-bold text-stone-100 text-sm">
            Trigger Immediate Live Test SMS
          </h3>
          <p className="text-xs text-stone-400">
            Dispatches through the SMS abstraction layer directly into the farmer log and terminal.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={smsCategory}
              onChange={(e) => setSmsCategory(e.target.value as any)}
              className="bg-stone-800 text-stone-200 text-xs px-3 py-2 rounded-xl border border-stone-700"
            >
              <option value="Soil">Soil Nutrient Alert</option>
              <option value="Weather">Weather Advisory</option>
              <option value="Pest">Pest Inspection</option>
              <option value="Irrigation">Irrigation Decision</option>
            </select>

            <input
              type="text"
              placeholder="Custom alert message or leave empty for template..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="flex-1 bg-stone-800 text-stone-200 text-xs px-3 py-2 rounded-xl border border-stone-700 focus:outline-none focus:border-emerald-500"
            />

            <button
              onClick={handleDispatch}
              disabled={sending}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-stone-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sending ? 'Sending...' : 'Send SMS'}</span>
            </button>
          </div>

          {sentMessage && (
            <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium pt-1">
              <CheckCircle className="w-4 h-4" />
              <span>SMS dispatched and recorded in delivery stream!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
