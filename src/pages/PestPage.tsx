import React, { useState } from 'react';
import { 
  Bug, 
  Upload, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  Cpu, 
  Info,
  RefreshCw,
  Eye
} from 'lucide-react';
import { Language, PestAnalysis, SensorReadings, FarmerProfile } from '../types';
import { getTranslation } from '../lib/i18n';
import { apiService } from '../services/api';

interface Props {
  language: Language;
  initialAnalysis: PestAnalysis;
  readings: SensorReadings;
  profile: FarmerProfile;
}

export const PestPage: React.FC<Props> = ({
  language,
  initialAnalysis,
  readings,
  profile
}) => {
  const t = getTranslation(language);
  const [analysis, setAnalysis] = useState<PestAnalysis>(initialAnalysis);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedPresetKey, setSelectedPresetKey] = useState(initialAnalysis.condition_key || 'healthy');
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  const sampleLeaves = [
    {
      key: 'brown_plant_hopper',
      title: 'Brown Plant Hopper',
      sub: 'Hopper burn on plant base',
      emoji: '🦗',
      badge: 'High Risk'
    },
    {
      key: 'early_blight',
      title: 'Tomato Early Blight',
      sub: 'Concentric ring spots on leaves',
      emoji: '🍂',
      badge: 'Medium Risk'
    },
    {
      key: 'fall_armyworm',
      title: 'Fall Armyworm',
      sub: 'Ragged whorl feeding',
      emoji: '🐛',
      badge: 'Critical'
    },
    {
      key: 'leaf_curl',
      title: 'Leaf Curl Virus',
      sub: 'Whitefly viral vector',
      emoji: '🌿',
      badge: 'High Risk'
    },
    {
      key: 'healthy',
      title: 'Healthy Foliage',
      sub: 'Normal green venation',
      emoji: '🌱',
      badge: 'Optimal'
    }
  ];

  const handleSelectSample = async (key: string) => {
    setSelectedPresetKey(key);
    setAnalyzing(true);
    try {
      const res = await apiService.detectPest(key);
      setAnalysis(res);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedPreview(event.target?.result as string);
        // Run diagnosis on uploaded leaf
        handleSelectSample('early_blight');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-800">
              <Bug className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-mono text-purple-800 font-bold tracking-wider">
              PEST & FOLIAR INTELLIGENCE AGENT (AGENT 03)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            {t.pestIntelligence}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Computer Vision diagnostics for insect pests, fungal blights, and viral vectors in {profile.crop}
          </p>
        </div>

        {/* Model info badge */}
        <div className="flex items-center gap-2 bg-stone-900 text-stone-200 px-3.5 py-1.5 rounded-xl border border-stone-800 text-xs">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span className="font-mono">{analysis.model_used}</span>
        </div>
      </div>

      {/* Mandatory Transparency Notice Badge */}
      <div className="p-4 rounded-2xl bg-stone-900 text-stone-200 border border-purple-900/60 flex items-start gap-3 shadow-md">
        <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-semibold text-purple-300">
            AI TRANSPARENCY NOTICE (PROTOTYPE SIMULATION MODE)
          </div>
          <p className="text-stone-300 leading-relaxed">
            {analysis.transparency_notice} All detections are cross-referenced with current environmental microclimate indicators (Humidity {readings.humidity}%, Ambient Temp {readings.temperature}°C).
          </p>
        </div>
      </div>

      {/* Main Grid: Upload & Scanning (Left) + Diagnostics & Control (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Input & Curated Demo Samples */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upload / Camera Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-900 text-base">Crop Foliage Scanner</h3>

            {/* Upload Dropzone */}
            <div className="border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-2xl p-6 text-center space-y-3 transition-colors relative bg-stone-50/50">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Upload crop photo"
              />

              {uploadedPreview ? (
                <div className="space-y-2">
                  <img
                    src={uploadedPreview}
                    alt="Uploaded leaf"
                    className="max-h-48 mx-auto rounded-xl object-cover border border-stone-300 shadow-sm"
                  />
                  <div className="text-xs font-semibold text-emerald-800 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Leaf scan loaded. Click to replace.</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 mx-auto flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-800">
                      Tap to Upload or Take Crop Photo
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      Supports JPG, PNG from phone camera or gallery
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Preloaded Demo Leaf Samples */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Instant Field Test Samples
              </label>

              <div className="space-y-2">
                {sampleLeaves.map((sample) => (
                  <button
                    key={sample.key}
                    onClick={() => handleSelectSample(sample.key)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      selectedPresetKey === sample.key
                        ? 'bg-purple-50 border-purple-500 shadow-sm'
                        : 'bg-stone-50/80 border-stone-200/80 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{sample.emoji}</span>
                      <div>
                        <div className="text-xs font-bold text-stone-900">{sample.title}</div>
                        <div className="text-[11px] text-stone-500">{sample.sub}</div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      sample.badge === 'Optimal' ? 'bg-emerald-100 text-emerald-800' :
                      sample.badge === 'Critical' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {sample.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Diagnostics & Integrated Pest Management (IPM) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-base sm:text-lg">
                  Diagnostic Results & IPM Advisory
                </h3>
                <p className="text-xs text-stone-500">
                  Pattern matching against TNAU & ICAR crop protection indices
                </p>
              </div>

              {analyzing && (
                <div className="flex items-center gap-1.5 text-xs text-purple-700 font-medium">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning...</span>
                </div>
              )}
            </div>

            {/* Condition Banner */}
            <div className={`p-5 rounded-2xl border space-y-3 ${
              analysis.is_healthy
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-purple-50/80 border-purple-200 text-purple-950'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-purple-800 bg-purple-200/70 px-2 py-0.5 rounded">
                    {analysis.category}
                  </span>
                  <h4 className="text-lg sm:text-xl font-bold mt-1 text-stone-900">
                    {analysis.detected_condition}
                  </h4>
                </div>

                <div className="text-right">
                  <div className="text-xs text-stone-500 font-medium">AI Confidence</div>
                  <div className="text-2xl font-bold font-mono text-purple-800">
                    {analysis.confidence_percentage}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-purple-200/60 text-xs">
                <div>
                  <span className="text-stone-500">Severity: </span>
                  <strong className="text-stone-900">{analysis.severity}</strong>
                </div>
                <div>
                  <span className="text-stone-500">Outbreak Risk: </span>
                  <strong className={analysis.risk_level === 'High' ? 'text-rose-700' : 'text-stone-900'}>
                    {analysis.risk_level}
                  </strong>
                </div>
              </div>
            </div>

            {/* Symptoms Description */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Visual Symptoms Detected
              </label>
              <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200/80 leading-relaxed">
                {analysis.symptoms}
              </p>
            </div>

            {/* Immediate Action */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Immediate Action Required
              </label>
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-950 font-medium flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{analysis.immediate_action}</span>
              </div>
            </div>

            {/* Recommended Biological & IPM Control */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Safe Botanical & IPM Recommendations
              </label>
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-950 leading-relaxed">
                {analysis.recommended_control}
              </div>
            </div>

            {/* Officer Warning */}
            <div className="text-[11px] text-stone-500 bg-stone-100 p-3 rounded-xl border border-stone-200 leading-relaxed flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <span>
                <strong>Field Safety Notice:</strong> Do not apply unapproved chemical pesticides. If insect infestation exceeds threshold (&gt;15 hoppers/plant), submit a sample to your block Agricultural Officer.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
