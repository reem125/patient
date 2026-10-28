/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language } from '../types/hearingAid.ts';
import {
  HEARING_AID_MODELS,
  PERFORMANCE_LEVELS,
  HEARING_AID_COLORS,
  UNIVERSAL_ESSENZ_FEATURES
} from '../data/hearingAidData.ts';
import {
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Ear,
  SlidersHorizontal,
  Palette,
  Clock,
  Sparkles,
  Info,
  ChevronDown,
  Layers,
  Battery,
  AlertTriangle
} from 'lucide-react';

interface EducationalGuideProps {
  lang: Language;
  onSelectForAdvisor?: (modelId: string) => void;
}

export const EducationalGuide: React.FC<EducationalGuideProps> = ({ lang, onSelectForAdvisor }) => {
  const isAr = lang === 'ar';
  const [activeSection, setActiveSection] = useState<'basics' | 'models' | 'levels' | 'features' | 'colors'>('basics');
  const [selectedLevelTab, setSelectedLevelTab] = useState<number>(9);

  return (
    <div className="space-y-8">
      {/* Educational Hero Banner with Vision Medical Colors */}
      <div className="bg-gradient-to-br from-[#06243E] via-[#093557] to-[#041A2E] rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden border border-[#007CA6]/30">
        {/* Ambient Vision Medical Brand Glows */}
        <div className="absolute -top-24 -end-24 w-80 h-80 rounded-full bg-[#007CA6]/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 start-1/4 w-72 h-72 rounded-full bg-[#F38B21]/15 blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
            <div className="bg-white/95 rounded-lg px-2.5 py-1 flex items-center shadow-xs">
              <img
                src="/assets/aistudio/images__1__eff65cd3.png"
                alt="HANSATON"
                className="h-5 sm:h-6 w-auto object-contain"
              />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0099D8]/20 border border-[#0099D8]/40 text-[#A3DCF1] text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#F38B21]" />
              <BookOpen className="w-3.5 h-3.5 text-[#F38B21]" />
              <span>{isAr ? 'الدليل الطبي التثقيفي الشامل من رؤية الطبية' : 'Comprehensive Clinical Patient Guide by Vision Medical'}</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-3">
            {isAr ? 'دليل اختيار سماعة هانزاتون (HANSATON) المناسبة لك' : 'Patient Guide to Choosing the Right HANSATON Hearing Aid'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            {isAr
              ? 'صُمم هذا الدليل لمساعدتك على فهم أحدث التقنيات السمعية من عائلتي Essenz و STRATOS، وكيف تختار السماعة ومستوى الأداء المناسبين لنمط حياتك اليومي.'
              : 'Designed to help you navigate modern hearing technology across HANSATON Essenz and STRATOS families, matching optimal form factors and performance tiers to your lifestyle.'}
          </p>

          {/* 3 Core Questions Pill Strip with Vision Glass */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="font-bold text-[#70C9E8] block mb-1">
                {isAr ? '1. أي نوع؟' : '1. Which Type?'}
              </span>
              <span className="text-slate-300">
                {isAr ? 'حسب درجة ضعف السمع، شكل الأذن، وسهولة الاستخدام' : 'Based on hearing loss degree, ear shape & handling ease'}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="font-bold text-[#F9B233] block mb-1">
                {isAr ? '2. أي مستوى أداء؟' : '2. Which Level?'}
              </span>
              <span className="text-slate-300">
                {isAr ? 'من 1 إلى 9 حسب عدد البيئات السمعية ومدى الضوضاء' : 'From 1 to 9 depending on daily acoustic environments'}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="font-bold text-[#70C9E8] block mb-1">
                {isAr ? '3. أي لون؟' : '3. Which Color?'}
              </span>
              <span className="text-slate-300">
                {isAr ? 'حسب لون الشعر والبشرة أو الرغبة في مظهر تقني عصري' : 'Matching hair, skin tone, or modern earbud look'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Section Segmented Tabs with Vision Medical Active State */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#E8F6FA]/70 border border-[#A3DCF1]/50 rounded-2xl overflow-x-auto scrollbar-none shadow-2xs">
        {[
          { id: 'basics', label: isAr ? 'نظرة عامة والعائلات' : 'Overview & Families' },
          { id: 'models', label: isAr ? 'طرز السماعات (BTE / RIC / ITE / CIC)' : 'Device Models (BTE/RIC/ITE/CIC)' },
          { id: 'levels', label: isAr ? 'مستويات الأداء (1 إلى 9)' : 'Performance Tiers (1 to 9)' },
          { id: 'features', label: isAr ? 'ميزات Essenz الشاملة' : 'Universal Essenz Features' },
          { id: 'colors', label: isAr ? 'دليل الألوان والمظهر' : 'Color & Aesthetics' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeSection === tab.id
                ? 'bg-[#007CA6] text-white shadow-sm shadow-[#007CA6]/30'
                : 'text-slate-700 hover:text-[#007CA6] hover:bg-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: BASICS & FAMILIES */}
      {activeSection === 'basics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Essenz Family */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                  {isAr ? 'عائلة السماعات الخارجية' : 'External Aids Family'}
                </span>
                <span className="text-xs font-mono text-slate-400">HearIntelligence 6.0</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">
                {isAr ? 'عائلة هانزاتون إيسنز (HANSATON Essenz)' : 'HANSATON Essenz Family'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                {isAr
                  ? 'سماعات حديثة توضع خلف الأذن (BTE و RIC)، وتتضمن الطراز المتطور القابل للشحن sound E-R ببطارية ليثيوم أيون تدوم حتى 16 ساعة مع شريحة ERA الثورية واتصال بلوتوث سلس مع الهواتف الذكية والتلفزيون.'
                  : 'Modern behind-the-ear instruments (BTE and RIC), featuring the flagship sound E-R rechargeable model with 16h lithium-ion runtime, ERA chip architecture, and direct smartphone connectivity.'}
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isAr ? 'متوفرة بطراز RIC فائق الخفة والصغر، وطراز BTE القوي' : 'Available in ultra-light RIC and rugged BTE form factors'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isAr ? 'مقاومة الماء والغبار بمعيار IP68 العالمي' : 'IP68 water and dust ingress protection'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isAr ? 'التحكم بالنقر المزدوج (Tap Control) على الأذن للرد على المكالمات' : 'Tap Control: gentle ear tap to answer and finish calls'}</span>
                </li>
              </ul>
            </div>

            {/* STRATOS Family */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                  {isAr ? 'عائلة السماعات الداخلية المخصصة' : 'Custom In-Ear Family'}
                </span>
                <span className="text-xs font-mono text-slate-400">Custom 3D Fit</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">
                {isAr ? 'عائلة هانزاتون ستراتوس (HANSATON STRATOS)' : 'HANSATON STRATOS Family'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                {isAr
                  ? 'سماعات تصنع خصيصاً بنسبة 100% حسب بصمة وقالب أذنك (ITE و CIC). لا يوجد أي مكون خلف الأذن، مما يجعلها الخيار المثالي لمن يرتدون الحجاب أو النقاب أو النظارات والخوذات طوال اليوم.'
                  : 'Individually fabricated 100% to patient ear impressions (ITE and CIC). Zero components behind the ear, making them the gold standard for hijab, niqab, glasses, and helmet wearers.'}
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isAr ? 'طراز CIC يستقر في عمق القناة ويكون شبه غير مرئي تماماً' : 'CIC rests deep inside canal for near-complete invisibility'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isAr ? 'طراز ITE لا يحتك بالحجاب ولا يسقط عند خلع غطاء الرأس' : 'ITE will never catch on hijab layers or drop during veil removal'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isAr ? 'تأتي بألوان قريبة من لون البشرة لتبقى سرية وغير ملحوظة' : 'Finished in skin-matching tones for natural blending'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* MarketTrak IX Insight Callout */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#E8F6FA] to-[#FEF6EE] border border-[#007CA6]/25 shadow-2xs">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#007CA6] to-[#0099D8] text-white shrink-0 shadow-sm shadow-[#007CA6]/25">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F38B21] uppercase tracking-wider">
                  <span>MarketTrak IX Global Study</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {isAr ? 'لا تنتظر: التدخل السمعي المبكر يحمي قدرات الدماغ' : 'Do Not Wait: Early Hearing Intervention Preserves Cognitive Acuity'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isAr
                    ? 'وفقاً لدراسة MarketTrak IX العالمية: متوسط ما ينتظره الشخص منذ ملاحظة ضعف السمع حتى استخدام السماعة الأولى هو 13 سنة تقريباً! العلاج المبكر يجعل التأقلم مع السماعة أسهل بكثير، ويحافظ على مسارات معالجة الكلام في الدماغ نشطة وقوية.'
                    : 'According to the international MarketTrak IX study, patients typically wait an average of ~13 years from first noticing hearing decline before wearing their first hearing aid. Early adoption significantly eases acclimatization and preserves cerebral speech recognition neural pathways.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: DEVICE MODELS BREAKDOWN */}
      {activeSection === 'models' && (
        <div className="space-y-8">
          {/* Visual Category Explanation Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#06243E] via-[#083556] to-[#007CA6] text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
            <div className="absolute -top-12 -end-12 w-48 h-48 rounded-full bg-[#0099D8]/20 blur-2xl pointer-events-none" />
            <div className="space-y-1 relative z-10">
              <span className="text-xs font-extrabold text-[#F38B21] uppercase tracking-wider block">
                {isAr ? 'معرض صور وطرز سماعات هانزاتون الرسمية' : 'Official HANSATON Hearing Instrument Showcase'}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {isAr ? 'تعرف على شكل وحجم كل سماعة وميزاتها الهندسية' : 'Explore Form Factors, Ergonomics & Physical Appearance'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                {isAr
                  ? 'اختر بين السماعات الخارجية المريحة خلف الأذن (BTE و RIC) أو السماعات الداخلية المصممة بالكامل حسب مقاس أذنك (ITE و CIC)، بالإضافة للشاحن الذكي.'
                  : 'Compare behind-the-ear instruments (BTE and RIC) and custom in-ear instruments (ITE and CIC), engineered by HANSATON.'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 relative z-10">
              <span className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-bold text-white shadow-xs">
                {isAr ? '5 طرز معتمدة' : '5 Clinical Models'}
              </span>
            </div>
          </div>

          {/* Model Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {HEARING_AID_MODELS.map(model => (
              <div
                key={model.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Display Card with clean studio pedestal */}
                  <div className="relative bg-gradient-to-b from-slate-50 to-slate-100/70 p-6 flex items-center justify-center min-h-[260px] border-b border-slate-100 group">
                    {/* Top Badges */}
                    <div className="absolute top-4 start-4 flex flex-wrap gap-2 z-10">
                      <span className="text-xs font-bold text-sky-900 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full shadow-2xs border border-sky-100">
                        {model.family} · {model.code}
                      </span>
                      {model.isRechargeable ? (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1 shadow-2xs">
                          <Battery className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{isAr ? 'قابلة للشحن' : 'Rechargeable'}</span>
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-700 bg-white/90 px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
                          {isAr ? 'بطارية هوائية' : 'Zinc-Air'}
                        </span>
                      )}
                    </div>

                    {/* Water rating badge if available */}
                    {model.waterRating && (
                      <div className="absolute top-4 end-4 z-10">
                        <span className="text-xs font-semibold text-blue-900 bg-blue-50/90 px-2.5 py-1 rounded-full border border-blue-200 shadow-2xs flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>{model.waterRating}</span>
                        </span>
                      </div>
                    )}

                    {/* Main Hearing Aid Product Image */}
                    <div className="relative z-0 max-w-[200px] h-[190px] flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={model.imageSrc}
                        alt={model.imageAlt[lang]}
                        className="max-h-full max-w-full object-contain drop-shadow-md"
                        loading="lazy"
                      />
                    </div>

                    {/* In-ear / accessory secondary teaser */}
                    {model.secondaryImageSrc && (
                      <div className="absolute bottom-3 end-3 bg-white/95 p-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1.5 text-[11px] text-slate-700">
                        <img
                          src={model.secondaryImageSrc}
                          alt="BTE Power Option"
                          className="w-9 h-9 object-contain"
                        />
                        <span className="font-semibold pe-1">{isAr ? 'طراز BTE الفائق' : 'Power BTE'}</span>
                      </div>
                    )}

                    {model.chargerImageSrc && (
                      <div className="absolute bottom-3 end-3 bg-white/95 p-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1.5 text-[11px] text-slate-700">
                        <img
                          src={model.chargerImageSrc}
                          alt="HANSATON Egg Charger"
                          className="w-10 h-10 object-contain"
                        />
                        <span className="font-semibold pe-1">{isAr ? 'شاحن Easy Line البيضاوي' : 'Egg Charger'}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="text-xs font-bold text-sky-800 mb-1">
                      {model.badgeLabel ? model.badgeLabel[lang] : model.code}
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                      {model.name[lang]}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
                      {model.subtitle[lang]}
                    </p>

                    {/* Detailed Spec Strip */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5 space-y-2 text-xs">
                      <div className="flex items-start gap-2 text-slate-700">
                        <span className="font-bold text-slate-900 shrink-0">{isAr ? 'الموضع والتثبيت:' : 'Placement & Fit:'}</span>
                        <span>{model.placement[lang]}</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-700">
                        <span className="font-bold text-slate-900 shrink-0">{isAr ? 'نوع الطاقة والبطارية:' : 'Power System:'}</span>
                        <span>{model.powerSource[lang]}</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-700">
                        <span className="font-bold text-slate-900 shrink-0">{isAr ? 'درجة ضعف السمع المناسبة:' : 'Target Hearing Loss:'}</span>
                        <span className="font-semibold text-slate-900">{model.idealForDegree[lang]}</span>
                      </div>
                    </div>

                    {/* Key Strengths & Features */}
                    <div className="space-y-2 mb-5 text-xs">
                      <div className="font-bold text-slate-900">{isAr ? 'أبرز مميزات هذا الطراز:' : 'Key Engineering Highlights:'}</div>
                      {model.keyFeatures.slice(0, 3).map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                          <span>{feat[lang]}</span>
                        </div>
                      ))}
                    </div>

                    {/* Clinical contraindication if any */}
                    {model.contraindications && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 mb-5 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <span>{model.contraindications[0][lang]}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer with Ideal Persona */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-0.5">{isAr ? 'الأنسب لمن:' : 'Best suited for:'}</span>
                    <span className="font-bold text-slate-900">{model.suitableFor[0][lang]}</span>
                  </div>

                  {onSelectForAdvisor && (
                    <button
                      onClick={() => onSelectForAdvisor(model.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shrink-0"
                    >
                      {isAr ? 'اختر في المستشار السمعي' : 'Select in Advisor'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Dedicated BTE Deep-Dive Box */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-md">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="w-full lg:w-48 h-48 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center p-4 shrink-0">
                <img
                  src="/assets/aistudio/BTE_BATTERY_2abf3c05.webp"
                  alt="HANSATON BTE Hearing Aid"
                  className="max-h-full max-w-full object-contain drop-shadow"
                />
              </div>
              <div className="space-y-3 flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                  <span>{isAr ? 'تركيز خاص: سماعات BTE خلف الأذن التقليدية' : 'Special Spotlight: Behind-The-Ear (BTE) Models'}</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  {isAr ? 'لماذا يفضل الكثيرون طراز BTE فائق القوة والمتانة؟' : 'Why Patients and Audiologists Value the Sturdy BTE Model'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {isAr
                    ? 'تعتبر سماعة هانزاتون BTE الخيار الأول والموثوق لحالات ضعف السمع الشديد حتى العميق، وكذلك لكبار السن والأطفال والمهن الميدانية الشاقة. يتميز بهيكل متين يتحمل الصدمات والرطوبة، وأزرار تحكم بارزة سهلة اللمس، وحجرة بطارية بسيطة الفتح والاستبدال، مع أنبوب ينقل الصوت لقالب أذن مخصص يمنع الصفير وعود الصوت تماماً.'
                    : 'The HANSATON BTE is the premier heavy-duty workhorse instrument, ideally suited for severe-to-profound loss, seniors requiring easy manual controls, children with growing ear molds, and industrial workers. Its sturdy chassis resists impact and moisture with tactile controls and reliable battery longevity.'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block">{isAr ? 'درجات السمع:' : 'Hearing Loss:'}</span>
                    <span className="font-bold text-white">{isAr ? 'بسيط حتى شديد وعميق' : 'Mild to Profound'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block">{isAr ? 'التحكم اليدوي:' : 'Manual Controls:'}</span>
                    <span className="font-bold text-white">{isAr ? 'أزرار بارزة ومريحة' : 'Tactile Rocker Button'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block">{isAr ? 'الأماكن المفتوحة:' : 'Outdoor Wind:'}</span>
                    <span className="font-bold text-white">{isAr ? 'خافض لصوت الهواء' : 'Wind Noise Canceller'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block">{isAr ? 'الصيانة:' : 'Maintenance:'}</span>
                    <span className="font-bold text-white">{isAr ? 'سهولة تامة في التنظيف' : 'Easy to Clean & Dry'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: PERFORMANCE LEVELS (1 to 9) */}
      {activeSection === 'levels' && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-900">{isAr ? 'قاعدة الأداء التصاعدية: ' : 'Cumulative Feature Rule: '}</span>
            {isAr
              ? 'كل مستوى أداء أعلى يتضمن جميع ميزات المستويات الأقل منه بالكامل، بالإضافة إلى بيئات استماع وميزات معالجة جديدة ومتقدمة.'
              : 'Every higher performance level inherently includes all capabilities of the tiers below it, adding more automatic acoustic profiles and advanced directional algorithms.'}
          </div>

          {/* Level Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[9, 7, 5, 3, 1].map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedLevelTab(lvl)}
                className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
                  selectedLevelTab === lvl
                    ? 'border-[#007CA6] bg-[#007CA6] text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>{isAr ? `المستوى ${lvl}` : `Level ${lvl}`}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded font-mono ${
                  selectedLevelTab === lvl ? 'bg-[#06243E] text-sky-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {lvl === 9 ? (isAr ? 'الأول' : 'Flagship') : lvl === 7 ? (isAr ? 'رجال الأعمال' : 'Business') : lvl === 5 ? (isAr ? 'العملي' : 'Practical') : lvl === 3 ? (isAr ? 'الاقتصادي' : 'Essential') : (isAr ? 'الأساسي' : 'Basic')}
                </span>
              </button>
            ))}
          </div>

          {/* Selected Level Card */}
          {PERFORMANCE_LEVELS[selectedLevelTab] && (() => {
            const levelData = PERFORMANCE_LEVELS[selectedLevelTab];
            return (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <span className="text-xs font-bold text-[#007CA6] uppercase tracking-widest block mb-1">
                      HearIntelligence 6.0 & ERA Chip
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {levelData.title[lang]}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs shrink-0">
                    <div className="px-3.5 py-2 rounded-xl bg-[#E8F6FA] border border-[#007CA6]/20 text-center">
                      <span className="font-mono font-extrabold text-[#007CA6] text-lg block">{levelData.environmentsCount}</span>
                      <span className="text-slate-600 font-medium">{isAr ? 'بيئات تلقائية' : 'Environments'}</span>
                    </div>
                    <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="font-mono font-extrabold text-slate-800 text-lg block">{levelData.channels}</span>
                      <span className="text-slate-600 font-medium">{isAr ? 'قنوات ضبط' : 'Channels'}</span>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900">{isAr ? 'لمن هذا المستوى؟ ' : 'Ideal Persona: '}</span>
                  {levelData.bestForPersona[lang]}
                </div>

                {/* Sound Environments list */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    {isAr ? 'البيئات السمعية التي تتعرف عليها السماعة تلقائياً (Intelligent AutoSurround):' : 'Automatic Sound Environments (Intelligent AutoSurround):'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {levelData.environmentsList.map((env, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 text-xs text-slate-700 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>{env[lang]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlight Features */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    {isAr ? 'الميزات الصوتية والتقنية المفعلة:' : 'Acoustic Processing Algorithms:'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {levelData.highlightFeatures.map(feat => (
                      <div key={feat.name} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="font-bold text-slate-900 flex items-center justify-between mb-1">
                          <span>{feat.name}</span>
                          {feat.isExclusiveToNine && (
                            <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded font-semibold">
                              {isAr ? 'حصرية بالمستوى 9' : 'Level 9 Exclusive'}
                            </span>
                          )}
                        </div>
                        <div className="text-slate-600 leading-snug">{feat.description[lang]}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Examples of Professions */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-900 mb-1.5">
                    {isAr ? 'أمثلة من المهن المناسبة لهذا المستوى:' : 'Typical professions matching this level:'}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {levelData.professionExamples.map((prof, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {prof[lang]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* SECTION 4: UNIVERSAL ESSENZ FEATURES */}
      {activeSection === 'features' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {isAr ? 'الميزات المتوفرة في جميع مستويات عائلة Essenz' : 'Features Standard Across All Essenz Models'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {isAr ? 'تأتي هذه الابتكارات مدمجة قياسياً في كافة طرز إيسنز من المستوى 1 حتى المستوى 9' : 'Standard innovations engineered into every Essenz model from Level 1 through Level 9'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {UNIVERSAL_ESSENZ_FEATURES.map((feat, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 mb-1">
                      {feat.title[lang]}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {feat.description[lang]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: COLOR MATCHING GUIDE */}
      {activeSection === 'colors' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {isAr ? 'دليل الألوان: كيف تختار لون السماعة المناسب؟' : 'Color Matching Guide: Choosing the Natural Shade'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {isAr ? 'اختر لون السماعة الخارجية حسب لون شعرك وبشرتك لتكون أقل ظهوراً، أو اختر مظهراً تقنياً جريئاً' : 'Select an external color matching hair and complexion for subtle discretion, or choose modern tech accents'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {HEARING_AID_COLORS.map(color => (
                <div
                  key={color.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-start gap-3.5"
                >
                  <span
                    className="w-8 h-8 rounded-full shrink-0 shadow-sm border mt-0.5"
                    style={{ backgroundColor: color.hex, borderColor: color.borderHex || '#CBD5E1' }}
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      {color.family}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{color.name[lang]}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">{color.bestFor[lang]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
