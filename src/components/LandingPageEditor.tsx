import React, { useState } from 'react';
import { Sparkles, Save, RotateCcw, AlertCircle, FileText, CheckCircle } from 'lucide-react';
import { LandingPageTexts } from '../types';

interface LandingPageEditorProps {
  currentTexts: LandingPageTexts;
  onSave: (texts: LandingPageTexts) => void;
  isDarkMode: boolean;
}

const DEFAULT_TEXTS: LandingPageTexts = {
  badgeText: "Insurance Broker Multi-Agent Workstation",
  heroTitle: "The Insurance Boss",
  heroSubtitle: "Agency Management System",
  heroDescription: "A premium collaborative workspace built specifically for insurance broker networks, multi-agent offices, and underwriters. Setup your agency account instantly to start blank, invite agents, create agent teams, register leads in the specialized CRM pipeline, and manage niche tasks.",
  footerText: "Engineered to coordinate high-tier elite insurance client acquisition and distribution strategies with absolute precision."
};

export function LandingPageEditor({ currentTexts, onSave, isDarkMode }: LandingPageEditorProps) {
  const [badgeText, setBadgeText] = useState(currentTexts.badgeText || DEFAULT_TEXTS.badgeText);
  const [heroTitle, setHeroTitle] = useState(currentTexts.heroTitle || DEFAULT_TEXTS.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(currentTexts.heroSubtitle || DEFAULT_TEXTS.heroSubtitle);
  const [heroDescription, setHeroDescription] = useState(currentTexts.heroDescription || DEFAULT_TEXTS.heroDescription);
  const [footerText, setFooterText] = useState(currentTexts.footerText || DEFAULT_TEXTS.footerText);
  const [showNotification, setShowNotification] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      badgeText: badgeText.trim(),
      heroTitle: heroTitle.trim(),
      heroSubtitle: heroSubtitle.trim(),
      heroDescription: heroDescription.trim(),
      footerText: footerText.trim()
    });
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all texts back to original default layout?')) {
      setBadgeText(DEFAULT_TEXTS.badgeText);
      setHeroTitle(DEFAULT_TEXTS.heroTitle);
      setHeroSubtitle(DEFAULT_TEXTS.heroSubtitle);
      setHeroDescription(DEFAULT_TEXTS.heroDescription);
      setFooterText(DEFAULT_TEXTS.footerText);
      onSave(DEFAULT_TEXTS);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6" id="landing-page-editor-container">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Banner header */}
        <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
          isDarkMode 
            ? 'bg-gradient-to-r from-yellow-500/5 via-yellow-500/1 to-transparent border-gray-850' 
            : 'bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent border-yellow-100'
        }`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FAC000]" />
              <h2 className="text-lg font-black tracking-tight uppercase">Landing Page Copywriting</h2>
            </div>
            <p className="text-xs text-gray-400">
              Customize the front-facing landing page text, titles, subtitles, and footers for your brokerage network in real time.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                isDarkMode 
                  ? 'border-gray-800 bg-gray-900/50 hover:bg-gray-850 text-gray-300' 
                  : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {showNotification && (
          <div className="bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Success! The Landing Page texts have been updated instantly. Sign out to preview the changes.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Editor column */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
            <div className={`p-5 rounded-2xl border ${
              isDarkMode ? 'bg-[#0f1016]/90 border-gray-850' : 'bg-white border-gray-200'
            } space-y-4 shadow-xs`}>
              
              {/* Badge Text */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] uppercase font-black text-gray-400 tracking-wider">
                    Hero Badge Header
                  </label>
                  <span className="text-[10px] text-gray-500 font-mono">{badgeText.length}/60 chars</span>
                </div>
                <input
                  type="text"
                  maxLength={60}
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className={`w-full text-xs font-semibold px-3 py-2 rounded-xl outline-none border transition-all ${
                    isDarkMode 
                      ? 'bg-[#181a25] border-gray-800 focus:border-[#FAC000] text-white' 
                      : 'bg-gray-50 border-gray-250 focus:bg-white focus:border-[#FAC000] text-gray-800'
                  }`}
                  placeholder="e.g. Multi-Agent Workstation"
                />
              </div>

              {/* Hero Title */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] uppercase font-black text-gray-400 tracking-wider">
                    Primary Headline (Bold Title)
                  </label>
                  <span className="text-[10px] text-gray-500 font-mono">{heroTitle.length}/50 chars</span>
                </div>
                <input
                  type="text"
                  maxLength={50}
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className={`w-full text-xs font-bold px-3 py-2 rounded-xl outline-none border transition-all ${
                    isDarkMode 
                      ? 'bg-[#181a25] border-gray-800 focus:border-[#FAC000] text-white' 
                      : 'bg-gray-50 border-gray-250 focus:bg-white focus:border-[#FAC000] text-gray-800'
                  }`}
                  placeholder="e.g. The Insurance Boss"
                />
              </div>

              {/* Hero Subtitle */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] uppercase font-black text-gray-400 tracking-wider">
                    Secondary Headline (Branded Highlight)
                  </label>
                  <span className="text-[10px] text-gray-500 font-mono">{heroSubtitle.length}/60 chars</span>
                </div>
                <input
                  type="text"
                  maxLength={60}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className={`w-full text-xs font-bold px-3 py-2 rounded-xl outline-none border transition-all ${
                    isDarkMode 
                      ? 'bg-[#181a25] border-gray-800 focus:border-[#FAC000] text-white' 
                      : 'bg-gray-50 border-gray-250 focus:bg-white focus:border-[#FAC000] text-gray-800'
                  }`}
                  placeholder="e.g. Agency Management System"
                />
              </div>

              {/* Hero Description */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] uppercase font-black text-gray-400 tracking-wider">
                    Introductory Subtext / Description
                  </label>
                  <span className="text-[10px] text-gray-500 font-mono">{heroDescription.length}/400 chars</span>
                </div>
                <textarea
                  rows={4}
                  maxLength={400}
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                  className={`w-full text-xs font-medium px-3 py-2 rounded-xl outline-none border transition-all leading-relaxed resize-none ${
                    isDarkMode 
                      ? 'bg-[#181a25] border-gray-800 focus:border-[#FAC000] text-white' 
                      : 'bg-gray-50 border-gray-250 focus:bg-white focus:border-[#FAC000] text-gray-800'
                  }`}
                  placeholder="Enter a descriptive overview for broker agents, managers and prospective leads..."
                />
              </div>

              {/* Footer Text */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] uppercase font-black text-gray-400 tracking-wider">
                    Footer Mission Quote
                  </label>
                  <span className="text-[10px] text-gray-500 font-mono">{footerText.length}/250 chars</span>
                </div>
                <textarea
                  rows={2}
                  maxLength={250}
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  className={`w-full text-xs font-medium px-3 py-2 rounded-xl outline-none border transition-all leading-relaxed resize-none ${
                    isDarkMode 
                      ? 'bg-[#181a25] border-gray-800 focus:border-[#FAC000] text-white' 
                      : 'bg-gray-50 border-gray-250 focus:bg-white focus:border-[#FAC000] text-gray-800'
                  }`}
                  placeholder="Brokerage mission statements or regional authority disclaimers..."
                />
              </div>

              {/* Save trigger */}
              <button
                type="submit"
                className="w-full py-2.5 bg-[#FAC000] hover:bg-[#e0ab00] text-black font-black uppercase tracking-wider text-xs rounded-xl transition-all shadow-md shadow-yellow-500/5 flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                <Save className="w-4 h-4" />
                <span>Apply & Save Copywriting</span>
              </button>

            </div>
          </form>

          {/* Visual mock card column */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`p-4 rounded-2xl border select-none ${
              isDarkMode ? 'bg-[#11121a] border-gray-850' : 'bg-gray-50 border-gray-200'
            } space-y-3 shadow-xs`}>
              <h4 className="text-[10px] uppercase font-black text-gray-500 tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#FAC000]" />
                <span>Live Hero Preview Mockup</span>
              </h4>

              <div className="p-4 rounded-xl bg-[#0c0d12] border border-gray-850 text-white space-y-4 font-sans text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#FAC000]/5 rounded-full blur-2xl" />
                
                {/* Mock badge */}
                <div className="inline-block bg-[#FAC000]/10 text-[#FAC000] border border-[#FAC000]/25 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase truncate max-w-full">
                  ⚡ {badgeText || "No badge text"}
                </div>

                {/* Mock headline */}
                <h3 className="text-lg font-black tracking-tight leading-tight text-white">
                  {heroTitle || "Title"} <br />
                  <span className="text-[#FAC000]">{heroSubtitle || "Subtitle"}</span>
                </h3>

                {/* Mock Description */}
                <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-4">
                  {heroDescription || "No description text has been written yet."}
                </p>

                {/* Mock bottom footer preview */}
                <div className="pt-2 border-t border-gray-900 text-[8px] text-gray-600 font-mono">
                  &copy; 2026 The Insurance Boss • {footerText || "No footer text"}
                </div>
              </div>

              <div className="flex items-start gap-1.5 text-[10px] text-gray-500 p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                <AlertCircle className="w-3.5 h-3.5 text-[#FAC000] shrink-0 mt-0.5" />
                <span>
                  The landing page is fully dynamic. When you sign out, you'll immediately see this copy applied to the live portal.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
