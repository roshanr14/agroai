import React, { useState } from 'react';
import { 
  UserCheck, 
  Save, 
  Smartphone, 
  MapPin, 
  Sprout, 
  Droplet, 
  ShieldCheck, 
  Languages,
  CheckCircle2
} from 'lucide-react';
import { Language, FarmerProfile } from '../types';
import { getTranslation } from '../lib/i18n';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <UserCheck className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-mono text-emerald-800 font-bold tracking-wider">
              FARMER ONBOARDING & SETTINGS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            {t.myProfile}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Calibrate farm parameters, crop phenology, and SMS alert preferences
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal & Contact Section */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-700" />
            <span>Personal & Phone Notification Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Farmer Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-stone-50 text-stone-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Phone Number (for GSM SMS Alerts)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full bg-stone-50 text-stone-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600 font-mono"
                  required
                />
                <span className="absolute right-2.5 top-2.5 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  VERIFIED
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Preferred Interface & Voice Language
              </label>
              <select
                value={formData.preferredLanguage}
                onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value as Language })}
                className="w-full bg-stone-50 text-stone-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Location (District & State)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="District"
                  className="w-full bg-stone-50 text-stone-900 text-xs sm:text-sm px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600"
                />
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State"
                  className="w-full bg-stone-50 text-stone-900 text-xs sm:text-sm px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Farm & Crop Characteristics */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span>Farm & Crop Calibration</span>
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
                className="w-full bg-stone-50 text-stone-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600"
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
                className="w-full bg-stone-50 text-stone-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Soil Type
              </label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full bg-stone-50 text-stone-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600"
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
                className="w-full bg-stone-50 text-stone-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600"
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
                className="w-full bg-stone-50 text-stone-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Growth Stage
              </label>
              <select
                value={formData.cropStage}
                onChange={(e) => setFormData({ ...formData, cropStage: e.target.value })}
                className="w-full bg-stone-50 text-stone-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600"
              >
                <option value="Germination">Nursery / Germination</option>
                <option value="Vegetative Stage">Vegetative Stage</option>
                <option value="Flowering">Flowering Stage</option>
                <option value="Fruiting">Fruit Formation</option>
                <option value="Maturity">Maturity / Harvest</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Sowing Date
              </label>
              <input
                type="date"
                value={formData.sowingDate}
                onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
                className="w-full bg-stone-50 text-stone-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Irrigation System
              </label>
              <select
                value={formData.irrigationMethod}
                onChange={(e) => setFormData({ ...formData, irrigationMethod: e.target.value })}
                className="w-full bg-stone-50 text-stone-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600"
              >
                <option value="Drip Irrigation">Drip Irrigation (In-line)</option>
                <option value="Micro-sprinkler">Micro-sprinkler</option>
                <option value="Furrow Flood">Furrow Flood</option>
                <option value="Alternate Wetting & Drying">Alternate Wetting & Drying (AWD)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile & Farm parameters saved successfully!</span>
            </div>
          ) : (
            <span className="text-xs text-stone-400">
              Changes update multi-agent RAG calibration automatically
            </span>
          )}

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
