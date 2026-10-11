import React, { useState, useEffect } from 'react';
import { 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  Sparkles, 
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import { apiService } from '../services/api';
import { FarmerProfile } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: FarmerProfile;
  onUpdateProfile: (updated: FarmerProfile) => void;
}

export const TelegramConnectModal: React.FC<Props> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile
}) => {
  const [chatId, setChatId] = useState(profile.telegramChatId || '');
  const [botToken, setBotToken] = useState(profile.telegramBotToken || '');
  const [telegramUsername, setTelegramUsername] = useState(profile.telegramUsername || '');
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [botInfo, setBotInfo] = useState<{ connected: boolean; bot_name?: string; username?: string }>({
    connected: true,
    bot_name: 'AgroAI Advisory Bot',
    username: 'AgroAIBot'
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      apiService.getTelegramStatus().then((status) => {
        setBotInfo({
          connected: status.connected,
          bot_name: status.bot_name || 'AgroAI Advisory Bot',
          username: status.username || 'AgroAIBot'
        });
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndConnect = async () => {
    const updated: FarmerProfile = {
      ...profile,
      telegramChatId: chatId.trim(),
      telegramUsername: telegramUsername.trim(),
      telegramBotToken: botToken.trim() || undefined,
      telegramAlertsEnabled: true
    };
    onUpdateProfile(updated);
    await apiService.connectTelegram(chatId.trim(), botToken.trim() || undefined);
    setTestResult({
      success: true,
      message: 'Telegram Chat ID connected! Crop advisories will now stream to your Telegram.'
    });
  };

  const handleSendTestAdvisory = async () => {
    if (!chatId.trim()) {
      setTestResult({
        success: false,
        message: 'Please provide your Telegram Chat ID before sending a test advisory.'
      });
      return;
    }

    setTestSending(true);
    setTestResult(null);

    const testMsg = `🌾 Crop: ${profile.crop} (${profile.cropStage})\n📍 Farm: ${profile.farmName}, ${profile.district}\n\n⚠️ Advisory: Rain expected in your region (72% probability).\n💧 Action: Hold scheduled drip irrigation for the next 24 hours to conserve water and prevent root waterlogging.\n\n📊 Soil Health Score: 82/100 (Optimal)`;

    try {
      const res = await apiService.sendTelegramAlert(
        chatId.trim(),
        'Weather & Irrigation',
        testMsg,
        'AgroAI Autonomous Farm Alert',
        botToken.trim() || undefined
      );

      setTestResult({
        success: true,
        message: res.note || 'Test advisory dispatched successfully to Telegram!'
      });
    } catch (e: any) {
      setTestResult({
        success: false,
        message: e?.message || 'Failed to dispatch Telegram message. Check your Chat ID.'
      });
    } finally {
      setTestSending(false);
    }
  };

  const copyBotCommand = () => {
    navigator.clipboard.writeText('/start');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200/80 space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e3f2fd] text-[#0288d1] text-xs font-semibold">
            <Send className="w-3.5 h-3.5" />
            <span>100% FREE & UNLIMITED MESSAGING</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Connect Telegram Bot</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Receive instant, free alerts about soil deficits, rain forecasts, and pest outbreaks directly on Telegram without SMS carrier charges.
          </p>
        </div>

        {/* 3-Step Setup Instructions Card */}
        <div className="bg-[#f0f9ff] border border-[#b9e6fe] rounded-2xl p-4 sm:p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#026aa2] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#0288d1]" />
            <span>Quick 60-Second Setup</span>
          </h3>

          <ol className="space-y-2.5 text-xs text-stone-700">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#0288d1] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <span>Open Telegram and start our bot: </span>
                <a
                  href={`https://t.me/${botInfo.username || 'AgroAIBot'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#0288d1] underline hover:text-[#01579b] inline-flex items-center gap-1 ml-1"
                >
                  @{botInfo.username || 'AgroAIBot'}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#0288d1] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <span>To get your personal Chat ID, send </span>
                <button
                  type="button"
                  onClick={copyBotCommand}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-stone-300 font-mono text-[11px] text-stone-800 hover:bg-stone-50 cursor-pointer"
                >
                  /start {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-stone-400" />}
                </button>
                <span> to the bot, or check via </span>
                <a
                  href="https://t.me/userinfobot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#0288d1] underline inline-flex items-center gap-0.5"
                >
                  @userinfobot <ExternalLink className="w-2.5 h-2.5" />
                </a>.
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#0288d1] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                3
              </span>
              <div>
                <span>Paste your Chat ID below and click <strong>Connect & Save</strong>.</span>
              </div>
            </li>
          </ol>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Your Telegram Chat ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="e.g. 987654321"
              className="w-full bg-[#f8faf9] text-stone-900 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:border-[#279e5a] font-mono"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Numeric Chat ID provided by Telegram to route alerts directly to your private chat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Telegram Username (Optional)
              </label>
              <input
                type="text"
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
                placeholder="@farmer_username"
                className="w-full bg-[#f8faf9] text-stone-900 text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#279e5a]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Custom Bot Token (Optional)
              </label>
              <input
                type="password"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="From @BotFather (optional)"
                className="w-full bg-[#f8faf9] text-stone-900 text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#279e5a] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {testResult && (
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
              testResult.success
                ? 'bg-[#eaf7ef] text-[#166436] border border-[#c1e8cd]'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-[#279e5a] shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleSendTestAdvisory}
            disabled={testSending || !chatId.trim()}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#0288d1] hover:bg-[#0277bd] disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{testSending ? 'Sending to Telegram...' : 'Send Test Alert to Telegram'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-xs cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSaveAndConnect}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-[#279e5a] hover:bg-[#1f8249] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#279e5a]/25"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Connect & Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
