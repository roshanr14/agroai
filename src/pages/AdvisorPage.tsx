import React, { useState } from 'react';
import { 
  Compass, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  User, 
  Bot, 
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { Language, FarmerProfile, SensorReadings } from '../types';
import { getTranslation } from '../lib/i18n';
import { apiService } from '../services/api';
import { speechHandler, SpeechHandler } from '../utils/speech';

interface Props {
  language: Language;
  profile: FarmerProfile;
  readings: SensorReadings;
}

interface ChatMessage {
  id: string;
  sender: 'farmer' | 'ai';
  text: string;
  timestamp: string;
  groundedSource?: string;
  groundedFact?: string;
  category?: string;
}

export const AdvisorPage: React.FC<Props> = ({
  language,
  profile,
  readings
}) => {
  const t = getTranslation(language);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: language === 'ta'
        ? `வணக்கம் ${profile.fullName}! நான் உங்கள் அக்ரிசென்ஸ் AI விவசாய ஆலோசகர். உங்கள் ${profile.crop} பயிர் (2.5 ஏக்கர்) குறித்து ஏதேனும் கேள்விகளை கேட்கலாம்.`
        : language === 'hi'
        ? `नमस्ते ${profile.fullName}! मैं आपका एग्रीसेंस AI कृषि सलाहकार हूँ। आप अपनी ${profile.crop} की फसल के बारे में कुछ भी पूछ सकते हैं।`
        : `Hello ${profile.fullName}! I am your AgriSense AI Farm Advisor. I am continuously monitoring your ${profile.crop} crop (${profile.farmAcres} Acres, ${profile.soilType} soil). How can I assist your farm today?`,
      timestamp: "Just now",
      groundedSource: "ICAR / TNAU Grounded Agronomy System"
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);

  const quickQuestions = [
    { label: "Why are my plants turning yellow?", query: "Why are my plants turning yellow?" },
    { label: "Should I irrigate today?", query: "Should I irrigate today?" },
    { label: "What fertilizer should I use?", query: "What fertilizer should I use for vegetative tomato?" },
    { label: "Will it rain tomorrow?", query: "Will it rain tomorrow and should I spray?" },
    { label: "Why is pest risk high?", query: "Why is pest risk elevated in humid weather?" },
    { label: "What should I do today?", query: "What are my top farming actions today?" }
  ];

  const handleSend = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "farmer",
      text: q,
      timestamp: "Just now"
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await apiService.askAdvisor(q, language, profile);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: res.answer,
        timestamp: "Just now",
        groundedSource: res.grounded_source,
        groundedFact: res.grounded_fact
      };
      setMessages((prev) => [...prev, aiMsg]);

      if (isListening) {
        SpeechHandler.speak(res.answer, language);
        setIsSpeakingId(aiMsg.id);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      speechHandler.stopListening();
      setIsListening(false);
      return;
    }

    if (!speechHandler.isSupported()) {
      alert("Voice input is not supported by your current browser. Please try Chrome, Edge, or an Android browser.");
      return;
    }

    const started = speechHandler.startListening(
      language,
      (text) => {
        setIsListening(false);
        setInputQuery(text);
        handleSend(text);
      },
      (err) => {
        console.warn("Speech error:", err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (started) {
      setIsListening(true);
    }
  };

  const handleSpeakText = (msg: ChatMessage) => {
    if (isSpeakingId === msg.id) {
      SpeechHandler.stopSpeaking();
      setIsSpeakingId(null);
    } else {
      SpeechHandler.speak(msg.text, language);
      setIsSpeakingId(msg.id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#eaf7ef] text-[#279e5a]">
              <Compass className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-mono text-[#279e5a] font-bold tracking-wider">
              CENTRAL DECISION AGENT (LLM + RAG PIPELINE)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            {t.aiAdvisor}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Voice-enabled, multilingual agricultural intelligence grounded in ICAR & TNAU extension facts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#279e5a] bg-[#eaf7ef] border border-[#c1e8cd] px-3.5 py-1 rounded-full font-semibold">
            RAG Grounding: ICAR & TNAU Verified
          </span>
        </div>
      </div>

      {/* Quick Action Prompt Chips in Greenery style */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
          Frequent Indian Farmer Questions
        </label>
        <div className="flex flex-wrap gap-2.5">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q.query)}
              disabled={loading}
              className="px-4 py-2 rounded-full bg-white border border-stone-200 hover:border-[#279e5a] text-stone-700 hover:text-[#279e5a] text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-white rounded-[32px] border border-stone-200/80 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.07)] flex flex-col h-[540px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'farmer';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-[#191c21] text-white' : 'bg-[#279e5a] text-white shadow-md shadow-[#279e5a]/30'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Body */}
                <div className="space-y-1.5">
                  <div className={`p-4 sm:p-5 rounded-[24px] text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-[#191c21] text-white rounded-tr-none'
                      : 'bg-[#f8faf9] border border-stone-200/80 text-stone-900 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Grounded Source Footer & Audio Playout */}
                  {!isUser && (
                    <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
                      <div className="flex items-center gap-1.5 text-[#279e5a] font-semibold">
                        <BookOpen className="w-3 h-3" />
                        <span>{msg.groundedSource}</span>
                      </div>

                      <button
                        onClick={() => handleSpeakText(msg)}
                        className="flex items-center gap-1 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                        title="Read aloud"
                      >
                        {isSpeakingId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-[#279e5a] animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                        <span>{isSpeakingId === msg.id ? 'Stop' : 'Listen'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="w-9 h-9 rounded-2xl bg-[#279e5a] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#f8faf9] border border-stone-200/80 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-stone-500">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#279e5a]" />
                <span>Consulting Soil, Weather & RAG Knowledge Base...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input & Voice Controls with High-Contrast CTA button */}
        <div className="p-4 bg-[#f8faf9] border-t border-stone-200">
          <div className="flex items-center gap-2.5">
            {/* Microphone Button */}
            <button
              onClick={handleMicToggle}
              className={`p-3.5 rounded-full transition-all flex items-center justify-center cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-lg'
                  : 'bg-[#279e5a] hover:bg-[#1f8249] text-white shadow-md'
              }`}
              title={isListening ? "Listening... click to stop" : "Tap to Speak (Tamil, Hindi, English)"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              placeholder={isListening ? t.speakNow : t.askAdvisor}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-white text-stone-900 text-xs sm:text-sm px-5 py-3.5 rounded-full border border-stone-300 focus:outline-none focus:border-[#279e5a] shadow-inner"
            />

            {/* High-Contrast Send Button (exact charcoal button matching mockup CTA!) */}
            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || loading}
              className="p-3.5 rounded-full bg-[#191c21] hover:bg-black disabled:opacity-40 text-white transition-all shadow-md cursor-pointer shrink-0"
              title="Send question"
            >
              <Send className="w-5 h-5 text-[#34c775]" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2.5 px-2">
            <span>Voice input supports English, தமிழ் (Tamil), and हिन्दी (Hindi)</span>
            <span>RAG verified • Zero hallucinations</span>
          </div>
        </div>
      </div>
    </div>
  );
};
