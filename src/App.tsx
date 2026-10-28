/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, PatientProfile, RecommendationResultData } from './types/hearingAid.ts';
import { Header } from './components/Header.tsx';
import { AdvisorQuiz } from './components/AdvisorQuiz.tsx';
import { RecommendationResult } from './components/RecommendationResult.tsx';
import { EducationalGuide } from './components/EducationalGuide.tsx';
import { ComparisonMatrix } from './components/ComparisonMatrix.tsx';
import { PrintableSummary } from './components/PrintableSummary.tsx';
import { calculateRecommendation } from './utils/recommendationEngine.ts';
import {
  Sparkles,
  BookOpen,
  SlidersHorizontal,
  ShieldCheck,
  BatteryCharging,
  Ear,
  PhoneCall,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const DEFAULT_INITIAL_PROFILE: PatientProfile = {
  ageGroup: '',
  gender: '',
  headwear: [],
  professionCategory: '',
  selectedSituations: [],
  priorities: []
};

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [activeTab, setActiveTab] = useState<'advisor' | 'devices' | 'levels' | 'compare' | 'colors' | 'print'>('advisor');
  const [quizSessionKey, setQuizSessionKey] = useState<number>(1);
  
  // Patient assessment state
  const [patientProfile, setPatientProfile] = useState<PatientProfile>(DEFAULT_INITIAL_PROFILE);

  const [recommendationResult, setRecommendationResult] = useState<RecommendationResultData | null>(null);
  const [comparisonModelIds, setComparisonModelIds] = useState<string[]>(['essenz-sound-er', 'stratos-ite', 'essenz-ric']);

  // Sync HTML direction attribute with selected language
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const isAr = lang === 'ar';

  const handleAssessmentComplete = (data: RecommendationResultData, profile: PatientProfile) => {
    setRecommendationResult(data);
    setPatientProfile(profile);
    setActiveTab('advisor');
  };

  const handleRetakeAssessment = () => {
    setRecommendationResult(null);
    setActiveTab('advisor');
  };

  const handleStartAgain = () => {
    setRecommendationResult(null);
    setPatientProfile(DEFAULT_INITIAL_PROFILE);
    setQuizSessionKey(prev => prev + 1);
    setActiveTab('advisor');
  };

  const handleOpenComparison = (modelId?: string) => {
    if (modelId && !comparisonModelIds.includes(modelId)) {
      setComparisonModelIds(prev => [modelId, ...prev.slice(0, 2)]);
    }
    setActiveTab('compare');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      
      {/* Universal Top Bar */}
      <Header
        lang={lang}
        onLanguageChange={setLang}
        activeTab={activeTab === 'print' ? 'advisor' : activeTab}
        onTabChange={(tab) => {
          if (activeTab === 'print') {
            setActiveTab(tab);
          } else {
            setActiveTab(tab);
          }
        }}
        onPrintClick={() => setActiveTab('print')}
        onStartAgain={handleStartAgain}
        hasRecommendation={Boolean(recommendationResult)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Welcome Hero Strip with Vision Medical Colors */}
        {activeTab !== 'print' && !recommendationResult && activeTab === 'advisor' && (
          <div className="mb-8 rounded-3xl bg-gradient-to-br from-[#06243E] via-[#083556] to-[#041B2D] p-6 sm:p-10 shadow-md border border-[#007CA6]/30 relative overflow-hidden text-white">
            {/* Ambient Vision Medical Glow Spots */}
            <div className="absolute -top-24 -end-24 w-72 h-72 rounded-full bg-[#007CA6]/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 start-1/3 w-64 h-64 rounded-full bg-[#F38B21]/15 blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
                  <div className="bg-white/95 rounded-lg px-2.5 py-1 flex items-center shadow-xs">
                    <img
                      src="/assets/aistudio/images__1__eff65cd3.png"
                      alt="HANSATON"
                      className="h-5 sm:h-6 w-auto object-contain"
                    />
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0099D8]/20 border border-[#0099D8]/40 text-[#A3DCF1] text-xs font-bold shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#F38B21] animate-pulse" />
                    <span>{isAr ? 'مستشار السمع الشخصي المعتمد من رؤية الطبية' : 'Vision Medical Official Hearing Aid Advisor'}</span>
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
                  {isAr ? 'دليلك لاختيار سماعة هانزاتون المناسبة لنمط حياتك' : 'Find Your Perfect HANSATON Hearing Device'}
                </h1>
                <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-xl">
                  {isAr
                    ? 'أدخل عمرك، مهنتك، أغطية رأسك، والمواقف اليومية التي تعيشها؛ لتحصل على توصية طبية فورية تحدد الطراز ومستوى الأداء (1 إلى 9) الأكثر راحة وجودة لأذنيك.'
                    : 'Input your age, profession, headwear, and weekly acoustic environments to receive an audiological match for the optimal HANSATON form factor and performance tier (1 to 9).'}
                </p>

                {/* Online hearing screening (static page in public/hearing-test) */}
                <a
                  href={`/hearing-test/?lang=${lang}`}
                  className="mt-5 inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#F38B21] hover:bg-[#E07A12] text-white text-sm sm:text-base font-bold shadow-md shadow-[#F38B21]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Ear className="w-5 h-5" />
                  <span>{isAr ? 'افحص سمعك مجانًا خلال 5 دقائق' : 'Take a free 5-minute hearing test'}</span>
                  {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </a>
              </div>

              {/* Quick Feature Badges with Vision Medical glass styling */}
              <div className="grid grid-cols-2 gap-3 shrink-0 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-[#0099D8]/50 transition-colors flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#0099D8]/25 text-[#70C9E8]">
                    <BatteryCharging className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{isAr ? 'شحن ليثيوم 16 س' : '16h Rechargeable'}</div>
                    <div className="text-[11px] text-slate-300">{isAr ? 'بدون بطاريات دقيقة' : 'Zero tiny batteries'}</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-[#0099D8]/50 transition-colors flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#007CA6]/30 text-[#70C9E8]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{isAr ? 'حماية IP68' : 'IP68 Ingress'}</div>
                    <div className="text-[11px] text-slate-300">{isAr ? 'مقاومة الماء والغبار' : 'Water & dust proof'}</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-[#F38B21]/50 transition-colors flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#F38B21]/25 text-[#F9B233]">
                    <Ear className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{isAr ? 'طرز داخلية مخصصة' : 'Custom In-The-Ear'}</div>
                    <div className="text-[11px] text-slate-300">{isAr ? 'مثالية مع الحجاب والنظارات' : 'Hijab & glasses friendly'}</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-[#F38B21]/50 transition-colors flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#F38B21]/25 text-[#F9B233]">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{isAr ? 'تحكم بالنقر' : 'Tap Control'}</div>
                    <div className="text-[11px] text-slate-300">{isAr ? 'رد فوري على المكالمات' : 'Double-tap ear calls'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Interactive Advisor (Assessment Quiz or Results View) */}
        {activeTab === 'advisor' && (
          <div>
            {recommendationResult ? (
              <RecommendationResult
                lang={lang}
                result={recommendationResult}
                profile={patientProfile}
                onRetake={handleRetakeAssessment}
                onStartAgain={handleStartAgain}
                onCompare={handleOpenComparison}
                onPrint={() => setActiveTab('print')}
              />
            ) : (
              <AdvisorQuiz
                key={quizSessionKey}
                lang={lang}
                onComplete={handleAssessmentComplete}
                initialProfile={patientProfile}
                onReset={handleStartAgain}
              />
            )}
          </div>
        )}

        {/* Tab 2: Educational Guide for Devices */}
        {activeTab === 'devices' && (
          <EducationalGuide lang={lang} onSelectForAdvisor={handleOpenComparison} />
        )}

        {/* Tab 3: Educational Guide for Performance Levels */}
        {activeTab === 'levels' && (
          <EducationalGuide lang={lang} onSelectForAdvisor={handleOpenComparison} />
        )}

        {/* Tab 4: Side-by-side Comparison Matrix */}
        {activeTab === 'compare' && (
          <ComparisonMatrix
            lang={lang}
            initialSelectedIds={comparisonModelIds}
            onSelectForAdvisor={handleOpenComparison}
          />
        )}

        {/* Tab 5: Color Matching Guide */}
        {activeTab === 'colors' && (
          <EducationalGuide lang={lang} onSelectForAdvisor={handleOpenComparison} />
        )}

        {/* Tab 6: Printable Patient Consultation Sheet */}
        {activeTab === 'print' && (
          <PrintableSummary
            lang={lang}
            result={
              recommendationResult || calculateRecommendation(patientProfile)
            }
            profile={patientProfile}
            onClose={() => setActiveTab('advisor')}
            onStartAgain={handleStartAgain}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/Vision_Logo_En_Ar_-_Horizontal_Colors-1_31408bb2.jpg"
                alt="Vision Medical"
                className="h-7 w-auto object-contain"
              />
              <div className="h-4 w-px bg-slate-200" />
              <img
                src="/assets/aistudio/images__1__eff65cd3.png"
                alt="HANSATON"
                className="h-5 w-auto object-contain"
              />
              <span className="text-slate-300">·</span>
              <span>{isAr ? 'وكيل وموزع معتمد لسماعات هانزاتون السويسرية' : 'Authorized Partner for HANSATON Swiss Hearing Systems'}</span>
            </div>
            <div>
              <span>{isAr ? 'جميع الحقوق محفوظة © 2026' : 'All Rights Reserved © 2026'}</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
