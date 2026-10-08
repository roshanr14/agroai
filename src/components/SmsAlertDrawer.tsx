import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Send, 
  ShieldCheck, 
  Smartphone,
  AlertCircle
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
      <div className="bg-stone-900 border-l border-stone-800 w-full max-w-md h-full flex flex-col text-stone-200 shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-lg">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-100 text-sm">Farmer SMS Notifications</h3>
              <p className="text-[11px] text-stone-400">Direct GSM Alerts with Cooldown Throttling</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close SMS drawer"
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Farmer GSM Registration Card */}
        <div className="p-4 bg-stone-950/50 border-b border-stone-800">
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-800/80 border border-stone-700">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-stone-100 flex items-center gap-1.5">
                  {profile.phoneNumber}
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-mono">
                    VERIFIED
                  </span>
                </div>
                <div className="text-[11px] text-stone-400">Recipient: {profile.fullName} ({profile.farmName})</div>
              </div>
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-2 text-[11px] text-stone-400">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Anti-spam cooldown active: Max 1 SMS / 2 hours per issue category</span>
          </div>
        </div>

        {/* SMS Delivery Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
            Delivered SMS Messages ({logs.length})
          </div>

          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-stone-800/90 border border-stone-700 rounded-xl p-3.5 space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  {log.provider || 'Fast2SMS Gateway'} • Delivered
                </span>
                <span className="text-stone-400">{log.timestamp}</span>
              </div>

              <div className="text-xs font-bold text-stone-100">{log.title}</div>

              <pre className="text-xs text-stone-300 bg-stone-950/70 p-2.5 rounded-lg font-sans whitespace-pre-wrap leading-relaxed border border-stone-800">
                {log.message}
              </pre>

              <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
                <span>To: {log.phone}</span>
                <span className="bg-stone-700 text-stone-300 px-1.5 py-0.5 rounded">{log.category}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Manual Test Dispatch Trigger */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 space-y-2.5">
          <label className="text-xs font-semibold text-stone-300 block">
            Dispatch Live Test SMS to Farmer
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Custom alert message or leave blank for default..."
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="flex-1 bg-stone-800 text-stone-200 text-xs px-3 py-2 rounded-lg border border-stone-700 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSend}
              disabled={sending}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-stone-950 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {sending ? 'Sending...' : 'Send SMS'}
            </button>
          </div>
          {sentSuccess && (
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle className="w-3 h-3" />
              SMS dispatched and logged successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
