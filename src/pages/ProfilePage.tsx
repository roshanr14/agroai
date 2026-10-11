import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Save, 
  Smartphone, 
  Sprout, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  ShieldCheck, 
  Clock, 
  Bell, 
  RefreshCw,
  Radio,
  Flame,
  CloudRain,
  Bug
} from 'lucide-react';
import { Language, FarmerProfile } from '../types';
import { getTranslation } from '../lib/i18n';
import { apiService } from '../services/api';

interface Props {
  language: Language;
  profile: FarmerProfile;
  onUpdateProfile: (updated: FarmerProfile) => void;
}

export const ProfilePage: React.FC<Props> = ({
  language,
  profile,
  onUpdateProfile
}) => {
  const t = getTranslation(language);
  const [formData, setFormData] = useState<FarmerProfile>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // OTP Verification State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [demoOtpCode, setDemoOtpCode] = useState<string | null>(null);
  const [otpFeedback, setOtpFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  // Test SMS State
  const [testCategory, setTestCategory] = useState<'Soil' | 'Weather' | 'Pest'>('Weather');
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleInitiateOtp = async () => {
    if (!formData.phoneNumber || formData.phoneNumber.trim().length < 8) {
      setOtpFeedback({ type: 'error', message: 'Please enter a valid mobile number with country code.' });
      return;
    }

    setOtpLoading(true);
    setOtpFeedback(null);
    setIsOtpModalOpen(true);

    const res = await apiService.sendOtp(formData.phoneNumber);
    setOtpLoading(false);

    if (res.success) {
      setDemoOtpCode(res.demo_otp || null);
      setResendTimer(60);
      setOtpFeedback({ 
        type: 'success', 
        message: res.message || `Verification code sent to ${formData.phoneNumber}.` 
      });
    } else {
      setOtpFeedback({ type: 'error', message: res.message || 'Failed to dispatch verification SMS.' });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.trim().length < 4) {
      setOtpFeedback({ type: 'error', message: 'Please enter the complete 6-digit verification code.' });
      return;
    }

    setOtpLoading(true);
    setOtpFeedback(null);

    const res = await apiService.verifyOtp(formData.phoneNumber, otpCode);
    setOtpLoading(false);

    if (res.success) {
      const updated = {
        ...formData,
        phoneVerified: true,
        smsAlertsEnabled: true
      };
      setFormData(updated);
      onUpdateProfile(updated);
      setOtpFeedback({ type: 'success', message: 'Mobile number successfully connected to AgroAI!' });
      setTimeout(() => {
        setIsOtpModalOpen(false);
        setOtpCode('');
        setDemoOtpCode(null);
      }, 1800);
    } else {
      setOtpFeedback({ type: 'error', message: res.message || 'Invalid code. Please try again.' });
    }
  };

  const handleSendTestSms = async () => {
    setTestSending(true);
    setTestResult(null);

    let sampleMsg = "";
    if (testCategory === 'Soil') {
      sampleMsg = `AgroAI Alert: Low Nitrogen (28 mg/kg) detected in your ${formData.crop} field. Apply well-decomposed FYM (10 t/ha) or neem-coated urea as per soil test.`;
    } else if (testCategory === 'Weather') {
      sampleMsg = `AgroAI Advisory: High rain probability (72%) forecast in ${formData.district}. Delay drip irrigation by 24h to avoid waterlogging and root rot.`;
    } else {
      sampleMsg = `AgroAI Warning: Early Blight foliar symptoms flagged in ${formData.crop}. Prune infected lower foliage immediately and apply Trichoderma bio-agent.`;
    }

    const res = await apiService.sendTestSms(formData.phoneNumber, testCategory, sampleMsg);
    setTestSending(false);

    if (res.success) {
      setTestResult(`SMS dispatched via ${res.provider || 'Gateway'}. Check phone inbox for "${sampleMsg.slice(0, 40)}..."`);
      setTimeout(() => setTestResult(null), 8000);
    } else {
      setTestResult(`SMS Failed: ${res.reason || 'Could not send SMS.'}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 md:pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#eaf7ef] text-[#279e5a]">
              <UserCheck className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-mono text-[#279e5a] font-bold tracking-wider">
              FARMER ONBOARDING & GSM ALERT ENGINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            {t.myProfile}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Link your phone to receive real-time farming decisions via normal text messages on any phone
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* MOBILE CONNECTION & SMS ALERTS CARD */}
        <div className="bg-white rounded-[32px] border border-stone-200/80 p-7 sm:p-8 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.07)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#279e5a]" />
              <span>Mobile Phone Connection & Offline SMS Alerts</span>
            </h2>

            {/* Connection Status Badge */}
            {formData.phoneVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Connected to GSM Alerts</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Unverified • No SMS Delivered</span>
              </span>
            )}
          </div>

          {/* Explanation Box */}
          <div className="bg-[#f7faf8] rounded-2xl p-4 border border-[#e2ece5] text-xs text-stone-600 flex items-start gap-3">
            <Radio className="w-5 h-5 text-[#279e5a] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-stone-800">
                How SMS Crop Alerts Work (No Smartphone or Internet Needed)
              </p>
              <p className="mt-1 leading-relaxed">
                When you connect your mobile number, AgroAI's AI orchestrator continuously assesses your soil sensors and weather forecasts. If an emergency occurs (such as heavy rain requiring an irrigation pause or severe nitrogen drop), an autonomous <strong>plain SMS text message</strong> is sent directly to your phone carrier.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Farmer Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-[#f8faf9] text-stone-900 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:border-[#279e5a]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Mobile Number (Supports Indian +91 & International)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ 
                      ...formData, 
                      phoneNumber: val, 
                      phoneVerified: val === profile.phoneNumber ? profile.phoneVerified : false 
                    });
                  }}
                  placeholder="+919876543210"
                  className="w-full bg-[#f8faf9] text-stone-900 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:border-[#279e5a] font-mono"
                  required
                />
                
                {formData.phoneVerified ? (
                  <button
                    type="button"
                    onClick={handleInitiateOtp}
                    className="px-3.5 py-2.5 rounded-2xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-medium shrink-0 cursor-pointer"
                    title="Change / Re-verify Number"
                  >
                    Change
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleInitiateOtp}
                    className="px-4 py-2.5 rounded-2xl bg-[#279e5a] hover:bg-[#1f8249] text-white text-xs font-bold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify via OTP</span>
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Language for SMS Messages & AI Voice
              </label>
              <select
                value={formData.preferredLanguage}
                onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value as Language })}
                className="w-full bg-[#f8faf9] text-stone-900 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:border-[#279e5a] cursor-pointer"
              >
                <option value="en">English (GSM Latin)</option>
                <option value="ta">தமிழ் - Tamil (Unicode Carrier SMS)</option>
                <option value="hi">हिन्दी - Hindi (Unicode Carrier SMS)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Farm District & State
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="District"
                  className="w-full bg-[#f8faf9] text-stone-900 text-xs sm:text-sm px-3.5 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:border-[#279e5a]"
                />
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State"
                  className="w-full bg-[#f8faf9] text-stone-900 text-xs sm:text-sm px-3.5 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:border-[#279e5a]"
                />
              </div>
            </div>
          </div>

          {/* SMS ALERT CATEGORY PREFERENCES */}
          <div className="pt-3 border-t border-stone-100 space-y-3">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-[#279e5a]" />
              <span>Subscribe to Automated Field SMS Alerts</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-stone-200 bg-[#fbfdfc] hover:bg-white cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.smsAlertsEnabled}
                  onChange={(e) => setFormData({ ...formData, smsAlertsEnabled: e.target.checked })}
                  className="mt-0.5 rounded text-[#279e5a] focus:ring-[#279e5a]"
                />
                <div className="text-xs">
                  <span className="font-semibold text-stone-800 block">Severe Soil Deficits</span>
                  <span className="text-stone-500 text-[11px]">Nitrogen, Potassium drops below critical thresholds</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-stone-200 bg-[#fbfdfc] hover:bg-white cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.notificationsEnabled}
                  onChange={(e) => setFormData({ ...formData, notificationsEnabled: e.target.checked })}
                  className="mt-0.5 rounded text-[#279e5a] focus:ring-[#279e5a]"
                />
                <div className="text-xs">
                  <span className="font-semibold text-stone-800 block">Weather & Irrigation</span>
                  <span className="text-stone-500 text-[11px]">Rain forecast warnings to halt drip valve runs</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-stone-200 bg-[#fbfdfc] hover:bg-white cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.smsAlertsEnabled}
                  onChange={(e) => setFormData({ ...formData, smsAlertsEnabled: e.target.checked })}
                  className="mt-0.5 rounded text-[#279e5a] focus:ring-[#279e5a]"
                />
                <div className="text-xs">
                  <span className="font-semibold text-stone-800 block">Pest Surges</span>
                  <span className="text-stone-500 text-[11px]">High humidity triggers for Hopper & Blight</span>
                </div>
              </label>
            </div>
          </div>

          {/* LIVE TEST SMS DISPATCHER */}
          <div className="pt-3 border-t border-stone-100 bg-stone-50/70 -mx-7 sm:-mx-8 -mb-7 sm:-mb-8 p-6 sm:p-7 rounded-b-[32px] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-[#279e5a]" />
                  <span>Test Mobile SMS Delivery</span>
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Verify that SMS messages arrive reliably on your phone before autonomous triggers fire
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={testCategory}
                  onChange={(e) => setTestCategory(e.target.value as any)}
                  className="text-xs bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-700 font-medium cursor-pointer"
                >
                  <option value="Weather">Weather Alert Test</option>
                  <option value="Soil">Soil Deficit Test</option>
                  <option value="Pest">Pest Warning Test</option>
                </select>

                <button
                  type="button"
                  onClick={handleSendTestSms}
                  disabled={testSending || !formData.phoneVerified}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-black disabled:bg-stone-300 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-sm"
                >
                  {testSending ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>{testSending ? "Dispatching..." : "Send Test SMS"}</span>
                </button>
              </div>
            </div>

            {testResult && (
              <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs text-stone-700 shadow-sm flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-mono">{testResult}</span>
              </div>
            )}
          </div>
        </div>

        {/* FARM & CROP CHARACTERISTICS */}
        <div className="bg-white rounded-[32px] border border-stone-200/80 p-7 sm:p-8 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.07)] space-y-5">
          <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-[#279e5a]" />
            <span>Farm & Crop Parameters</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Farm Name
              </label>
              <input
                type="text"
                value={formData.farmName}
                onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                className="w-full bg-[#f8faf9] text-stone-900 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:border-[#279e5a]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Area (Acres)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.farmAcres}
                onChange={(e) => setFormData({ ...formData, farmAcres: parseFloat(e.target.value) || 1 })}
                className="w-full bg-[#f8faf9] text-stone-900 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:border-[#279e5a] font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Soil Type
              </label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full bg-[#f8faf9] text-stone-900 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:border-[#279e5a]"
              >
                <option value="Loamy">Loamy (Ideal Drainage)</option>
                <option value="Clayey">Black Clayey (High Retention)</option>
                <option value="Red Sandy">Red Sandy Loam</option>
                <option value="Alluvial">Alluvial</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Current Crop
              </label>
              <input
                type="text"
                value={formData.crop}
                onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                className="w-full bg-[#f8faf9] text-stone-900 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:border-[#279e5a]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Variety / Hybrid
              </label>
              <input
                type="text"
                value={formData.cropVariety}
                onChange={(e) => setFormData({ ...formData, cropVariety: e.target.value })}
                className="w-full bg-[#f8faf9] text-stone-900 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:border-[#279e5a]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Growth Stage
              </label>
              <select
                value={formData.cropStage}
                onChange={(e) => setFormData({ ...formData, cropStage: e.target.value })}
                className="w-full bg-[#f8faf9] text-stone-900 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:border-[#279e5a]"
              >
                <option value="Germination">Nursery / Germination</option>
                <option value="Vegetative Stage">Vegetative Stage</option>
                <option value="Flowering">Flowering Stage</option>
                <option value="Fruiting">Fruit Formation</option>
                <option value="Maturity">Maturity / Harvest</option>
              </select>
            </div>
          </div>
        </div>

        {/* SAVE PROFILE ACTION BAR */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <div className="flex items-center gap-1.5 text-xs text-[#279e5a] font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile & SMS configuration saved successfully!</span>
            </div>
          ) : (
            <span className="text-xs text-stone-400">
              Changes update multi-agent RAG calibration and SMS notification targets
            </span>
          )}

          <button
            type="submit"
            className="px-8 py-3.5 rounded-full bg-[#191c21] hover:bg-black text-white font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#34c775]" />
            <span>Save Profile & Settings</span>
          </button>
        </div>
      </form>

      {/* OTP VERIFICATION MODAL */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#eaf7ef] text-[#279e5a]">
                  <Smartphone className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Verify Mobile Number</h3>
                  <p className="text-xs text-stone-500">For autonomous offline GSM text alerts</p>
                </div>
              </div>
              <button
                onClick={() => setIsOtpModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-lg leading-none p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              We dispatched a 6-digit verification code to <span className="font-mono font-bold text-stone-900">{formData.phoneNumber}</span>.
            </p>

            {/* Quick Demo Helper Pill */}
            {demoOtpCode && (
              <div className="bg-[#f0f9f3] border border-[#d2edd9] p-3 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#279e5a]">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Instant Verification Code:</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpCode(demoOtpCode)}
                  className="font-mono font-bold bg-[#279e5a] text-white px-3 py-1 rounded-lg text-xs cursor-pointer hover:bg-[#1f8249]"
                >
                  Auto-fill {demoOtpCode}
                </button>
              </div>
            )}

            {/* OTP Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 block">
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3.5 rounded-2xl bg-stone-50 border border-stone-300 focus:outline-none focus:border-[#279e5a] font-bold"
                autoFocus
              />
            </div>

            {/* Feedback alert */}
            {otpFeedback && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                otpFeedback.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {otpFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                )}
                <span>{otpFeedback.message}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpLoading || otpCode.length < 4}
                className="flex-1 py-3.5 rounded-2xl bg-[#279e5a] hover:bg-[#1f8249] disabled:bg-stone-300 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {otpLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{otpLoading ? "Verifying..." : "Confirm & Link Number"}</span>
              </button>

              <button
                type="button"
                onClick={handleInitiateOtp}
                disabled={resendTimer > 0 || otpLoading}
                className="px-4 py-3.5 rounded-2xl border border-stone-200 text-stone-700 hover:bg-stone-50 disabled:opacity-50 text-xs font-semibold cursor-pointer"
              >
                {resendTimer > 0 ? `Resend (${resendTimer}s)` : "Resend OTP"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
