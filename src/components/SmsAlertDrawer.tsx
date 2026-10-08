import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  Clock, 
  Send, 
  ShieldCheck, 
  Smartphone
} from 'lucide-react';
import { NotificationLog, FarmerProfile } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  logs: NotificationLog[];
  profile: FarmerProfile;
  onSendTestSms: (phone: string, category: string, msg: string) => Promise<void>;
}

export const SmsAlertDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  logs,
  profile,
  onSendTestSms
}) => {
  const [sending, setSending] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    setSending(true);
    setSentSuccess(false);
    try {
      const msg = customMsg || `AgriSense AI Alert\n\nNitrogen level is in marginal deficit (38 mg/kg). Consider light fertigation.\n\nOpen AgriSense AI for guidance.`;
      await onSendTestSms(profile.phoneNumber, "Soil", msg);
      setSentSuccess(true);
      setCustomMsg('');
      setTimeout(() => setSentSuccess(false), 3000);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-white border-l border-stone-200 w-full max-w-md h-full flex flex-col text-stone-900 shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-[#f8faf9]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#eaf7ef] text-[#279e5a] rounded-2xl">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Farmer GSM SMS Stream</h3>
              <p className="text-[11px] text-stone-500">Autonomous Direct Alerts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close SMS drawer"
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Farmer GSM Card */}
        <div className="p-5 bg-white border-b border-stone-100">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f8faf9] border border-stone-200/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#eaf7ef] text-[#279e5a]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5 font-mono">
                  {profile.phoneNumber}
                  <span className="text-[10px] bg-[#eaf7ef] text-[#279e5a] px-2 py-0.5 rounded-full font-bold">
                    VERIFIED
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">Recipient: {profile.fullName} ({profile.farmName})</div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px] text-stone-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Anti-spam cooldown active: Max 1 SMS / 2 hours per issue</span>
          </div>
        </div>

        {/* SMS Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
            Delivered SMS Messages ({logs.length})
          </div>

          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-[#f8faf9] border border-stone-200 rounded-2xl p-4 space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-[#279e5a] font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-[#279e5a]" />
                  {log.provider || 'Fast2SMS Gateway'} • Delivered
                </span>
                <span className="text-stone-400 font-mono">{log.timestamp}</span>
              </div>

              <div className="text-xs font-bold text-stone-900">{log.title}</div>

              <pre className="text-xs text-stone-700 bg-white p-3 rounded-xl font-sans whitespace-pre-wrap leading-relaxed border border-stone-200/80 shadow-xs">
                {log.message}
              </pre>

              <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1">
                <span>To: {log.phone}</span>
                <span className="bg-[#eaf7ef] text-[#166436] px-2 py-0.5 rounded-full font-semibold">{log.category}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Manual Test Dispatch with High-Contrast CTA */}
        <div className="p-5 bg-[#f8faf9] border-t border-stone-200 space-y-2.5">
          <label className="text-xs font-bold text-stone-700 block">
            Dispatch Live Test SMS to Farmer
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Custom message or leave blank for template..."
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="flex-1 bg-white text-stone-900 text-xs px-3.5 py-2.5 rounded-full border border-stone-300 focus:outline-none focus:border-[#279e5a]"
            />
            <button
              onClick={handleSend}
              disabled={sending}
              className="px-5 py-2.5 bg-[#191c21] hover:bg-black disabled:opacity-50 text-white font-bold rounded-full text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5 text-[#34c775]" />
              <span>{sending ? 'Sending...' : 'Send'}</span>
            </button>
          </div>
          {sentSuccess && (
            <div className="text-[11px] text-[#279e5a] flex items-center gap-1 font-bold">
              <CheckCircle className="w-3 h-3" />
              SMS dispatched and logged successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
