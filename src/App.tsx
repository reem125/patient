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
import { HearingTest } from './components/HearingTest.tsx';
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
  ChevronLeft,
  CheckCircle2,
  Home,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkle,
  Award
} from 'lucide-react';

type Tab = 'home' | 'advisor' | 'devices' | 'levels' | 'compare' | 'colors' | 'hearing' | 'print';

// Direct link to the hearing test: /#hearing-test (optionally with ?lang=en).
const HEARING_HASH = '#hearing-test';
const initialTab = (): Tab => (window.location.hash === HEARING_HASH ? 'hearing' : 'home');
const initialLang = (): Language => (new URLSearchParams(window.location.search).get('lang') === 'en' ? 'en' : 'ar');

const DEFAULT_INITIAL_PROFILE: PatientProfile = {
  ageGroup: '',
  gender: '',
  headwear: [],
  professionCategory: '',
  selectedSituations: [],
  priorities: []
};

export default function App() {
  const [lang, setLang] = useState<Language>(initialLang);
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
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

  // Keep the address bar in step with the hearing test page, so it can be bookmarked or shared.
  useEffect(() => {
    const url = window.location.pathname + window.location.search + (activeTab === 'hearing' ? HEARING_HASH : '');
    if (url !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.replaceState(null, '', url);
    }
  }, [activeTab]);

  const isAr = lang === 'ar';

  const openHearingTest = () => {
    setActiveTab('hearing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAdvisorGuide = () => {
    setActiveTab('advisor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAssessmentComplete = (data: RecommendationResultData, profile: PatientProfile) => {
    setRecommendationResult(data);
    setPatientProfile(profile);
    setActiveTab('advisor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetakeAssessment = () => {
    setRecommendationResult(null);
    setActiveTab('advisor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartAgain = () => {
    setRecommendationResult(null);
    setPatientProfile(DEFAULT_INITIAL_PROFILE);
    setQuizSessionKey(prev => prev + 1);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        showAdvisorActions={activeTab === 'advisor' || activeTab === 'print'}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Tab 0: Home Opening Portal (Both Pathways: Hearing Test & Choose Your Hearing Aid Guide) */}
        {activeTab === 'home' && (
          <div>
            <div className="mb-8 rounded-3xl bg-gradient-to-br from-[#0B3B63] via-[#0E4C7C] to-[#082E4F] p-6 sm:p-9 shadow-xl border border-[#0099D8]/40 relative overflow-hidden text-white">
              {/* Ambient Vision Medical Glow Spots */}
              <div className="absolute -top-24 -end-24 w-80 h-80 rounded-full bg-[#0099D8]/25 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 start-1/3 w-80 h-80 rounded-full bg-[#F38B21]/20 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Header Badge & Title */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-5 mb-7">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/95 rounded-lg px-2.5 py-1 flex items-center shadow-xs">
                      <img
                        src="/assets/aistudio/images__1__eff65cd3.png"
                        alt="HANSATON"
                        className="h-5 sm:h-6 w-auto object-contain"
                      />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0099D8]/30 border border-[#0099D8]/50 text-white text-xs font-bold shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-[#F38B21] animate-pulse" />
                      <span>{isAr ? 'المنصة الطبية الذكية لرعاية السمع · رؤية الطبية' : 'Vision Medical Intelligent Hearing Care Platform'}</span>
                    </div>
                  </div>

                  <div className="text-xs text-sky-100 font-medium">
                    {isAr ? 'الموزع المعتمد لسماعات هانزاتون السويسرية' : 'Authorized Partner for Swiss HANSATON Systems'}
                  </div>
                </div>

                {/* Title & Introduction */}
                <div className="max-w-3xl mb-7">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2.5 drop-shadow-xs">
                    {isAr
                      ? 'اختر مسارك السمعي: فحص السمع المبدئي أو دليل اختيار سماعتك الطبية'
                      : 'Choose Your Hearing Path: Online Screening or Hearing Aid Guide'}
                  </h1>
                  <p className="text-xs sm:text-base text-sky-100 leading-relaxed font-normal">
                    {isAr
                      ? 'منصة تفاعلية تمكنك من فحص سمعك عبر الإنترنت خلال 4 دقائق، أو استخدام مستشار هانزاتون الذكي لاختيار السماعة ومستوى الأداء (1 إلى 9) الأنسب لاحتياجاتك ونمط حياتك.'
                      : 'An interactive platform allowing you to screen your hearing online in ~4 minutes, or use our smart advisor to choose the ideal hearing aid form factor and performance tier (1 to 9).'}
                  </p>
                </div>

                {/* Large Product Family Showcase Photo */}
                <div className="mb-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0E4976] via-[#1B649E] to-[#0E4976] border border-[#38BDF8]/40 p-2.5 sm:p-3.5 shadow-2xl shadow-[#007CA6]/30 relative overflow-hidden group">
                  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#0B3E67]/60 flex items-center justify-center backdrop-blur-xs">
                    <img
                      src="/assets/aistudio/Untitled_Design__31__1de09875.png"
                      alt={
                        isAr
                          ? 'تشكيلة سماعات هانزاتون السويسرية الطبية - عائلة Essenz و STRATOS كاملة'
                          : 'Swiss HANSATON Hearing Systems Lineup - Complete Essenz & STRATOS Portfolio'
                      }
                      className="w-full h-auto max-h-[340px] sm:max-h-[440px] lg:max-h-[500px] object-contain mx-auto transition-transform duration-700 group-hover:scale-[1.01]"
                      loading="eager"
                    />
                  </div>

                  {/* Descriptive Strip with Model Highlights & Specs link */}
                  <div className="mt-2.5 px-3 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs border-t border-white/20 text-sky-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-2 h-2 rounded-full bg-[#38BDF8] shrink-0" />
                      <span className="font-bold text-white">
                        {isAr ? 'عائلة هانزاتون المعتمدة لدى رؤية الطبية:' : 'HANSATON Family at Vision Medical:'}
                      </span>
                      <span className="text-sky-100">
                        {isAr
                          ? 'سماعات داخل الأذن STRATOS (المخفية ITE / CIC) · سماعات خلف الأذن Essenz (القابلة للشحن RIC / BTE)'
                          : 'In-Ear STRATOS (Discreet ITE / CIC) · Behind-Ear Essenz (Rechargeable RIC / BTE)'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('devices');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-[#E0F2FE] hover:text-white hover:underline font-bold text-xs flex items-center gap-1 shrink-0 transition-colors bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg"
                    >
                      <span>{isAr ? 'تصفح مواصفات الأنواع' : 'View Device Specs'}</span>
                      {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* The Two Primary Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                  
                  {/* Pathway 1: Online Hearing Test Card */}
                  <div className="rounded-2xl p-5 sm:p-6 bg-white text-slate-900 border border-slate-200/90 shadow-md hover:shadow-xl transition-all relative flex flex-col justify-between">
                    <div>
                      {/* Top Tag & Status */}
                      <div className="flex items-center justify-between gap-2 mb-3.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#FEF6EE] text-[#C2620A] border border-[#F38B21]/30">
                          <Ear className="w-3.5 h-3.5 text-[#F38B21]" />
                          <span>{isAr ? 'فحص السمع أونلاين' : 'Online Hearing Test'}</span>
                          <span className="text-slate-400">·</span>
                          <span>{isAr ? '4 دقائق' : '4 mins'}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {isAr ? 'مجاني بالكامل' : '100% Free'}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                        <span>{isAr ? '1. اختبار فحص السمع السريع' : '1. Quick Hearing Screening'}</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        {isAr
                          ? 'فحص تفاعلي لنغمات السمع باستخدام سماعات الرأس السلكية في بيئة هادئة، مع قياس هدوء الغرفة بالميكروفون ورسم بياني تقديري فوري لمستوى سمعك (dB HL).'
                          : 'Interactive pure-tone check using wired headphones in a quiet room, with background noise microphone verification and instant estimated audiogram (dB HL).'}
                      </p>

                      {/* Steps / Details Included */}
                      <div className="mb-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-2">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#F38B21]" />
                          <span>{isAr ? 'ما تتضمنه خطوات وتفاصيل الفحص:' : 'Screening Steps & What You Get:'}</span>
                        </div>
                        <ul className="space-y-1.5 text-slate-600 ps-1">
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F38B21] shrink-0" />
                            <span>{isAr ? 'تجهيز وضبط السماعات والتأكد من جهتي الأذن' : 'Wired headphones channel & volume setup'}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F38B21] shrink-0" />
                            <span>{isAr ? 'قياس ذكي للضوضاء المحيطة عبر ميكروفون الجهاز' : 'Microphone ambient room quietness measurement'}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F38B21] shrink-0" />
                            <span>{isAr ? 'قياس نغمات السمع للأذن اليمنى واليسرى بالتتابع' : 'Tone evaluation across frequencies (both ears)'}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F38B21] shrink-0" />
                            <span>{isAr ? 'رسم بياني تقديري، تقرير مفصّل، ونصائح للخطوة التالية' : 'Estimated audiogram chart, details & next steps'}</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Button to open details and steps */}
                    <button
                      type="button"
                      onClick={openHearingTest}
                      className="w-full py-3.5 px-5 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md bg-[#FEF6EE] hover:bg-[#F38B21] text-[#C2620A] hover:text-white border border-[#F38B21]/40 hover:border-transparent hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <Ear className="w-5 h-5 shrink-0" />
                      <span>{isAr ? 'افحص سمعك الآن (الخطوات والتفاصيل)' : 'Start Hearing Test (Steps & Details)'}</span>
                      {isAr ? <ChevronLeft className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
                    </button>
                  </div>

                  {/* Pathway 2: Choose Your Hearing Aid Guide Card */}
                  <div className="rounded-2xl p-5 sm:p-6 bg-white text-slate-900 border border-slate-200/90 shadow-md hover:shadow-xl transition-all relative flex flex-col justify-between">
                    <div>
                      {/* Top Tag & Status */}
                      <div className="flex items-center justify-between gap-2 mb-3.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#E8F6FA] text-[#007CA6] border border-[#007CA6]/30">
                          <SlidersHorizontal className="w-3.5 h-3.5 text-[#007CA6]" />
                          <span>{isAr ? 'دليل اختيار السماعة' : 'Hearing Aid Guide'}</span>
                          <span className="text-slate-400">·</span>
                          <span>{isAr ? '4 خطوات' : '4 Steps'}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {isAr ? 'توصية فورية' : 'Instant Match'}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                        <span>{isAr ? '2. دليل اختيار سماعتك الطبية' : '2. Choose Your Hearing Aid Guide'}</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        {isAr
                          ? 'مستشار متخصص يحلل عمرك، مهنتك، أغطية رأسك (الحجاب أو الغترة أو النظارات)، وبيئاتك الأسبوعية ليرشح لك الطراز ومستوى الأداء (1 إلى 9) الأنسب.'
                          : 'A clinical advisor evaluating age, profession, headwear (hijab, ghutra, glasses), and weekly environments to recommend the ideal model & level (1 to 9).'}
                      </p>

                      {/* Steps / Details Included */}
                      <div className="mb-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-2">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#007CA6]" />
                          <span>{isAr ? 'ما تتضمنه خطوات وتفاصيل الدليل:' : 'Guide Steps & What You Get:'}</span>
                        </div>
                        <ul className="space-y-1.5 text-slate-600 ps-1">
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#007CA6] shrink-0" />
                            <span>{isAr ? 'الخطوة 1: العمر، أغطية الرأس، والحجاب والغترة والنظارات' : 'Step 1: Age profile & headwear/eyewear'}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#007CA6] shrink-0" />
                            <span>{isAr ? 'الخطوة 2: بيئة العمل ومتطلبات المحادثات المهنية' : 'Step 2: Workplace environment & listening demands'}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#007CA6] shrink-0" />
                            <span>{isAr ? 'الخطوة 3: المواقف الصوتية الأسبوعية وتقدير المستوى' : 'Step 3: Weekly acoustic lifestyle scenarios'}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#007CA6] shrink-0" />
                            <span>{isAr ? 'الخطوة 4: التفضيلات والتقنيات مع اقتراح مبدئي فوري' : 'Step 4: Priorities, instant report & WhatsApp booking'}</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Button to open details and steps */}
                    <button
                      type="button"
                      onClick={openAdvisorGuide}
                      className="w-full py-3.5 px-5 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md bg-gradient-to-r from-[#007CA6] via-[#0092C7] to-[#0099D8] hover:brightness-105 text-white shadow-[#007CA6]/30 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <Sparkles className="w-5 h-5 shrink-0" />
                      <span>{isAr ? 'اختر سماعتك الطبية (الخطوات والتفاصيل)' : 'Choose Your Hearing Aid (Steps & Details)'}</span>
                      {isAr ? <ChevronLeft className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
                    </button>
                  </div>

                </div>
              </div>
            </div>

            {/* Why Choose HANSATON with Vision Medical */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F6FA] text-[#007CA6] text-xs font-bold mb-3 border border-[#007CA6]/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isAr ? 'معايير الجودة والرعاية' : 'Quality & Care Standards'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
                  {isAr ? 'لماذا تختار سماعات هانزاتون مع رؤية الطبية؟' : 'Why Choose HANSATON with Vision Medical?'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  {isAr
                    ? 'نجمع بين التميز السويسري في هندسة الصوتيات وخبرة رؤية الطبية في تقديم رعاية سمعية متكاملة في المملكة العربية السعودية.'
                    : 'Combining Swiss precision acoustic engineering with Vision Medical clinical audiology care across the Kingdom of Saudi Arabia.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#007CA6]/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#007CA6]/10 text-[#007CA6] flex items-center justify-center mb-3.5">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1.5">
                    {isAr ? 'هندسة سويسرية عريقة' : 'Swiss Acoustic Precision'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isAr
                      ? 'وضوح استثنائي للكلام في الضوضاء بفضل معالجات Sonova العالمية ومستويات أداء من 1 إلى 9.'
                      : 'Exceptional speech clarity in background noise powered by Sonova technology and tiers 1 to 9.'}
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#007CA6]/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#0099D8]/10 text-[#0099D8] flex items-center justify-center mb-3.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1.5">
                    {isAr ? 'توافق الحجاب والغترة' : 'Hijab & Ghutra Ergonomics'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isAr
                      ? 'حلول مصممة خصيصاً للثقافة المحلية بدون احتكاك بالأقمشة، مثل طرازات STRATOS ITE وCIC وسماعات RIC الرقيقة.'
                      : 'Comfortable solutions designed for local headwear with zero fabric friction, including STRATOS ITE and slim RIC.'}
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#F38B21]/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#F38B21]/10 text-[#F38B21] flex items-center justify-center mb-3.5">
                    <BatteryCharging className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1.5">
                    {isAr ? 'شحن سريع وبلوتوث مباشر' : 'Fast Rechargeable & Bluetooth'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isAr
                      ? 'شحن يدوم طوال اليوم واتصال مباشر بكافة أجهزة آيفون وأندرويد والتلفاز للمكالمات والاستماع.'
                      : 'All-day rechargeable battery and direct Bluetooth streaming for iOS, Android, and TV.'}
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#007CA6]/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#06243E]/10 text-[#06243E] flex items-center justify-center mb-3.5">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1.5">
                    {isAr ? 'رعاية وضمان رؤية الطبية' : 'Vision Medical Warranty & Care'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isAr
                      ? 'فحص سريري معتمد، برمجة دقيقة، متابعة دورية، وتواجد في كافة مدن المملكة لخدمتك.'
                      : 'Accredited audiology evaluations, customized fitting, ongoing follow-ups, and nationwide care.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Interactive Advisor (Choose Your Hearing Aid) */}
        {activeTab === 'advisor' && (
          <div>
            {/* Top Navigation & Return to Home Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('home')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-[#007CA6] hover:text-white transition-colors shrink-0"
                  title={isAr ? 'العودة للصفحة الرئيسية' : 'Back to Home'}
                >
                  <Home className="w-4 h-4" />
                  <span>{isAr ? 'الرئيسية' : 'Home'}</span>
                </button>
                <div className="h-6 w-px bg-slate-200" />
                <div className="p-2 rounded-xl bg-[#E8F6FA] text-[#007CA6] border border-[#007CA6]/30 shrink-0">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {recommendationResult
                      ? (isAr ? 'اقتراحك المبدئي من سماعات هانزاتون' : 'Your initial HANSATON suggestion')
                      : (isAr ? 'دليل اختيار سماعتك الطبية (4 خطوات)' : 'Choose Your Hearing Aid: 4 Simple Steps')}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {recommendationResult
                      ? (isAr ? 'بناءً على إجاباتك، هذا هو الطراز ومستوى الأداء الأقرب لاحتياجاتك. يحدد أخصائي السمعيات الاختيار النهائي بعد فحص السمع.' : 'Based on your answers, this model and level fit your needs best. An audiologist confirms the final choice after a hearing test.')
                      : (isAr ? 'أجب عن الأسئلة أدناه لتحصل على توصية فورية ومطابقة لاحتياجاتك' : 'Complete the steps below for your instant personalized recommendation')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={openHearingTest}
                  className="text-xs font-bold text-[#C2620A] hover:text-[#9A4E08] flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FEF6EE] hover:bg-[#FEEAD4] border border-[#F38B21]/30 transition-colors"
                >
                  <Ear className="w-3.5 h-3.5 text-[#F38B21]" />
                  <span>{isAr ? 'التبديل إلى فحص السمع' : 'Switch to Hearing Test'}</span>
                </button>
              </div>
            </div>

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
          <EducationalGuide lang={lang} onSelectForAdvisor={handleOpenComparison} initialSection="models" />
        )}

        {/* Tab 3: Educational Guide for Performance Levels */}
        {activeTab === 'levels' && (
          <EducationalGuide lang={lang} onSelectForAdvisor={handleOpenComparison} initialSection="levels" />
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
          <EducationalGuide lang={lang} onSelectForAdvisor={handleOpenComparison} initialSection="colors" />
        )}

        {/* Tab 6: Online hearing test */}
        {activeTab === 'hearing' && (
          <div>
            {/* Top Navigation & Return to Home Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('home')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-[#007CA6] hover:text-white transition-colors shrink-0"
                  title={isAr ? 'العودة للصفحة الرئيسية' : 'Back to Home'}
                >
                  <Home className="w-4 h-4" />
                  <span>{isAr ? 'الرئيسية' : 'Home'}</span>
                </button>
                <div className="h-6 w-px bg-slate-200" />
                <div className="p-2 rounded-xl bg-[#FEF6EE] text-[#F38B21] border border-[#F38B21]/30 shrink-0">
                  <Ear className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {isAr ? 'خطوات وتفاصيل اختبار فحص السمع أونلاين' : 'Online Hearing Test: Steps & Details'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {isAr ? 'اتبع الخطوات أدناه لتجهيز السماعات، فحص الغرفة، وقياس النغمات' : 'Follow the steps below for headphone setup, quietness check, and tone testing'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={openAdvisorGuide}
                  className="text-xs font-bold text-[#007CA6] hover:text-[#005f80] flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#E8F6FA] hover:bg-[#d6f0f7] border border-[#007CA6]/30 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F38B21]" />
                  <span>{isAr ? 'التبديل إلى دليل اختيار السماعة' : 'Switch to Hearing Aid Guide'}</span>
                </button>
              </div>
            </div>

            <HearingTest lang={lang} onExit={() => setActiveTab('home')} />
          </div>
        )}

        {/* Tab 7: Printable Patient Consultation Sheet */}
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
