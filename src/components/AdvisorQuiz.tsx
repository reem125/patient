/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language, PatientProfile, RecommendationResultData } from '../types/hearingAid.ts';
import { LIFESTYLE_SITUATIONS } from '../data/hearingAidData.ts';
import { calculateRecommendation, calculateEstimatedLevel } from '../utils/recommendationEngine.ts';
import {
  Car,
  PartyPopper,
  Briefcase,
  ShoppingBag,
  Music,
  Users,
  Tv,
  Plane,
  Home,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Glasses,
  HardHat,
  BatteryCharging,
  EyeOff,
  ShieldCheck,
  Smartphone,
  Coins,
  HeartPulse,
  Info,
  RotateCcw
} from 'lucide-react';

interface AdvisorQuizProps {
  lang: Language;
  onComplete: (data: RecommendationResultData, profile: PatientProfile) => void;
  initialProfile?: PatientProfile;
  onReset?: () => void;
}

export const AdvisorQuiz: React.FC<AdvisorQuizProps> = ({
  lang,
  onComplete,
  initialProfile,
  onReset
}) => {
  const isAr = lang === 'ar';

  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<PatientProfile>(
    initialProfile || {
      ageGroup: '',
      gender: '',
      headwear: [],
      professionCategory: '',
      selectedSituations: [],
      priorities: []
    }
  );

  const situationIcons: Record<string, React.ReactNode> = {
    'car-conversations': <Car className="w-5 h-5 text-amber-600" />,
    'large-parties': <PartyPopper className="w-5 h-5 text-indigo-600" />,
    'business-meetings': <Briefcase className="w-5 h-5 text-sky-600" />,
    'cafes-and-markets': <ShoppingBag className="w-5 h-5 text-teal-600" />,
    'music-and-lectures': <Music className="w-5 h-5 text-purple-600" />,
    'family-gatherings': <Users className="w-5 h-5 text-emerald-600" />,
    'phone-and-tv': <Tv className="w-5 h-5 text-blue-600" />,
    'frequent-travel': <Plane className="w-5 h-5 text-orange-600" />,
    'home-conversations': <Home className="w-5 h-5 text-slate-600" />
  };

  const handleHeadwearToggle = (item: string) => {
    setProfile(prev => {
      if (item === 'none') {
        const isSelected = prev.headwear.includes('none');
        return {
          ...prev,
          headwear: isSelected ? [] : ['none']
        };
      } else {
        const withoutNone = prev.headwear.filter(x => x !== 'none');
        const exists = withoutNone.includes(item);
        return {
          ...prev,
          headwear: exists ? withoutNone.filter(x => x !== item) : [...withoutNone, item]
        };
      }
    });
  };

  const handleSituationToggle = (id: string) => {
    setProfile(prev => {
      const exists = prev.selectedSituations.includes(id);
      return {
        ...prev,
        selectedSituations: exists
          ? prev.selectedSituations.filter(x => x !== id)
          : [...prev.selectedSituations, id]
      };
    });
  };

  const handlePriorityToggle = (id: string) => {
    setProfile(prev => {
      const exists = prev.priorities.includes(id);
      return {
        ...prev,
        priorities: exists
          ? prev.priorities.filter(x => x !== id)
          : [...prev.priorities, id]
      };
    });
  };

  const handleFinish = () => {
    const recommendation = calculateRecommendation(profile);
    onComplete(recommendation, profile);
  };

  // Preview performance level using the unified calculateEstimatedLevel
  const currentSituationCount = profile.selectedSituations.length;
  const hasCarOrParty =
    profile.selectedSituations.includes('car-conversations') ||
    profile.selectedSituations.includes('large-parties');
  const estimatedLevel = calculateEstimatedLevel(
    currentSituationCount,
    hasCarOrParty,
    profile.professionCategory,
    profile.ageGroup
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Progress Header with Vision Medical styling */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-[#F0F9FC] via-[#F8FBFC] to-[#FEF6EE] p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007CA6] tracking-wider uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-[#F38B21]" />
              <span>{isAr ? `الخطوة ${step} من 4` : `Step ${step} of 4`}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              {step === 1 && (isAr ? '1. البيانات الشخصية وأغطية الرأس' : '1. Personal Profile & Headwear')}
              {step === 2 && (isAr ? '2. طبيعة العمل والبيئة المهنية' : '2. Occupation & Workplace Environment')}
              {step === 3 && (isAr ? '3. مواقف ونمط الحياة الأسبوعي' : '3. Weekly Lifestyle Scenarios')}
              {step === 4 && (isAr ? '4. أولوياتك التفضيلية والتقنية' : '4. Personal Preferences & Priorities')}
            </h2>
          </div>

          {/* Step Indicators with Vision Medical highlights */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => setStep(num)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold transition-all ${
                  step === num
                    ? 'bg-[#007CA6] text-white shadow-sm ring-2 ring-[#007CA6]/30'
                    : step > num
                    ? 'bg-[#FEF3E7] text-[#D97312] border border-[#F38B21]/30 font-bold'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {step > num ? '✓' : num}
              </button>
            ))}

            <button
              onClick={() => {
                if (onReset) {
                  onReset();
                } else {
                  setStep(1);
                  setProfile({
                    ageGroup: '35-54',
                    gender: '',
                    headwear: [],
                    professionCategory: '',
                    selectedSituations: [],
                    priorities: []
                  });
                }
              }}
              className="ms-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#007CA6] hover:bg-slate-100 transition-colors flex items-center gap-1.5 border border-slate-200 shadow-2xs"
              title={isAr ? 'إعادة ضبط الاستبيان والبدء من جديد' : 'Reset quiz and start again'}
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#F38B21]" />
              <span className="hidden sm:inline">{isAr ? 'البدء من جديد' : 'Start Again'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* STEP 1: Age, Gender, Headwear */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                {isAr ? 'الفئة العمرية للمريض:' : 'Patient Age Group:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'under-18', label: isAr ? 'أقل من 18 سنة (أطفال/طلاب)' : 'Under 18 (Pediatric/Youth)', hint: isAr ? 'تتطلب BTE مع قالب متجدد' : 'BTE recommended' },
                  { id: '18-34', label: isAr ? '18 – 34 سنة (شباب نشط)' : '18 – 34 (Active Youth)', hint: isAr ? 'تركيز على البث والمظهر' : 'Streaming & aesthetics' },
                  { id: '35-54', label: isAr ? '35 – 54 سنة (مهني وعائلي)' : '35 – 54 (Career & Family)', hint: isAr ? 'اجتماعات، قيادة، سرية' : 'Meetings & driving' },
                  { id: '55-64', label: isAr ? '55 – 64 سنة (نضج مهني)' : '55 – 64 (Senior Pro)', hint: isAr ? 'توازن العمل والعائلة' : 'Balanced lifestyle' },
                  { id: '65-74', label: isAr ? '65 – 74 سنة' : '65 – 74 Years', hint: isAr ? 'أحفاد، تلفزيون، سهولة شحن' : 'Family & ease of use' },
                  { id: '75-plus', label: isAr ? '75 سنة فأكثر' : '75+ Years', hint: isAr ? 'سهولة المسك وتجنب البطاريات الدقيقة' : 'Ergonomic handling' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProfile({ ...profile, ageGroup: item.id })}
                    className={`p-3.5 rounded-xl border text-start transition-all ${
                      profile.ageGroup === item.id
                        ? 'border-[#007CA6] bg-[#E8F6FA]/80 ring-1 ring-[#007CA6]/60 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-semibold text-sm text-slate-900">{item.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{item.hint}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Headwear & Accessories */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-900">
                  {isAr ? 'أغطية الرأس والنظارات (حدد كل ما ينطبق عليك):' : 'Headwear, Veils & Eyewear (Select all that apply):'}
                </label>
                <span className="text-xs text-slate-500">
                  {isAr ? 'تؤثر مباشرة على شكل السماعة المريح' : 'Critical for physical comfort'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'hijab',
                    label: isAr ? 'ارتداء الحجاب أو النقاب' : 'Wearing Hijab or Niqab',
                    desc: isAr
                      ? 'السماعات الداخلية ITE أو CIC تمنع صفير الاحتكاك ولا تسقط عند خلع الحجاب'
                      : 'In-ear models prevent fabric friction, whistling & accidental drop'
                  },
                  {
                    id: 'ghutra',
                    label: isAr ? 'ارتداء الغترة أو الشماغ' : 'Wearing Ghutra or Shemagh',
                    desc: isAr
                      ? 'السماعات الداخلية تمنع أي لفت للانتباه وتستقر بهدوء داخل الأذن'
                      : 'Custom discreet aids ensure zero visible protrusion'
                  },
                  {
                    id: 'glasses',
                    label: isAr ? 'ارتداء النظارات الطبية أو الشمسية يومياً' : 'Wearing Eyeglasses daily',
                    desc: isAr
                      ? 'سماعة ITE المصنوعة حسب مقاس أذنك تبقي خلف الأذن حراً بدون ضغط'
                      : 'Leaves behind-ear area free of temple arm friction'
                  },
                  {
                    id: 'helmet',
                    label: isAr ? 'ارتداء خوذة عمل، دراجة، أو سماعات رأس' : 'Wearing Work Helmets or Headsets',
                    desc: isAr
                      ? 'المهندسون، العسكريون، وموظفو الطيران: لا احتكاك مع غطاء الرأس'
                      : 'Aviation, site engineers & security: zero headgear whistle'
                  },
                  {
                    id: 'none',
                    label: isAr ? 'لا أرتدي شيئاً مما سبق' : 'None of the above',
                    desc: isAr
                      ? 'لا أستخدم غطاء رأس أو نظارات تؤثر على موضع السماعة'
                      : 'No headwear or glasses affecting hearing aid position'
                  }
                ].map(item => {
                  const selected = profile.headwear.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleHeadwearToggle(item.id)}
                      className={`p-3.5 rounded-xl border text-start transition-all flex items-start gap-3 ${
                        item.id === 'none' ? 'sm:col-span-2' : ''
                      } ${
                        selected
                          ? 'border-[#007CA6] bg-[#E8F6FA]/80 ring-1 ring-[#007CA6]/60 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        selected ? 'bg-[#007CA6] border-[#007CA6] text-white' : 'border-slate-300'
                      }`}>
                        {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-900">{item.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Profession & Work Environment */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-bold text-slate-900">
                  {isAr ? 'ما هو مجال عملك أو نشاطك اليومي الأبرز؟' : 'What is your primary profession or daily role?'}
                </label>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                {isAr
                  ? 'كلما زادت المواقف الصاخبة والمحادثات الجماعية في عملك، زادت الحاجة إلى مستوى أداء أعلى (المستوى 7 أو 9).'
                  : 'More group interactions and louder workspaces require higher performance tiers (Level 7 or 9).'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    id: 'sales-executive',
                    title: isAr ? 'المبيعات، الدعاية الطبية، الإدارة التنفيذية' : 'Sales, Medical Reps & C-Suite Executives',
                    desc: isAr ? 'محادثات مستمرة مع عملاء، مطاعم صاخبة، تنقل بين سيارات واجتماعات' : 'Continuous client talks, noisy lunches, car calls & meetings',
                    suggestedLevel: isAr ? 'المستوى 7 أو 9' : 'Level 7 or 9'
                  },
                  {
                    id: 'driver-traveler',
                    title: isAr ? 'السائقون وكثيرو السفر' : 'Drivers & Frequent Travelers',
                    desc: isAr ? 'محادثات داخل السيارة، مطارات، تنقل مستمر' : 'In-car conversations, airports, constant travel',
                    suggestedLevel: isAr ? 'المستوى 7 أو 9' : 'Level 7 or 9'
                  },
                  {
                    id: 'hospitality-events',
                    title: isAr ? 'الضيافة والمطاعم والفعاليات' : 'Hospitality, Restaurants & Events',
                    desc: isAr ? 'ضيوف ومجموعات وضوضاء مستمرة' : 'Guests, groups and constant noise',
                    suggestedLevel: isAr ? 'المستوى 7 أو 9' : 'Level 7 or 9'
                  },
                  {
                    id: 'business-legal',
                    title: isAr ? 'رجال الأعمال، المحامون، الاستشارات، البنوك' : 'Business, Legal, Consulting & Banking',
                    desc: isAr ? 'اجتماعات عمل مكثفة، غداء عمل، مكالمات متعددة، تركيز على المتحدث' : 'High-stakes boardroom meetings, client dining, focus on speaker',
                    suggestedLevel: isAr ? 'المستوى 7 أو 9' : 'Level 7 or 9'
                  },
                  {
                    id: 'education-teachers',
                    title: isAr ? 'المعلمون والأساتذة ومحاضرو الجامعات' : 'Educators, Professors & Teachers',
                    desc: isAr ? 'فصول دراسية صاخبة، أصوات طلاب من زوايا مختلفة، قاعات ومدرجات' : 'Noisy classrooms, multi-directional student voices, lecture halls',
                    suggestedLevel: isAr ? 'المستوى 7 أو 9' : 'Level 7 or 9'
                  },
                  {
                    id: 'healthcare-clinics',
                    title: isAr ? 'الأطباء، الممرضون، الصيادلة، العيادات' : 'Healthcare: Doctors, Nurses & Pharmacists',
                    desc: isAr ? 'محادثات من خلف الكمامة، بيئة عيادات هادئة غالباً مع ضوضاء متقطعة' : 'Muffled speech behind masks, clinic outpatient rooms',
                    suggestedLevel: isAr ? 'المستوى 5' : 'Level 5'
                  },
                  {
                    id: 'office-civil',
                    title: isAr ? 'موظفو المكاتب والجهات الحكومية والمحاسبون' : 'Office Staff, Civil Service & Accountants',
                    desc: isAr ? 'بيئة مكتبية هادئة، محادثات مع زملاء بجوارك، تركيز على المهام' : 'Quiet desk environments, coworker check-ins, steady workflow',
                    suggestedLevel: isAr ? 'المستوى 5' : 'Level 5'
                  },
                  {
                    id: 'field-factory',
                    title: isAr ? 'عمال المواقع، المصانع، المهندسون، الفنيون' : 'Site Engineers, Industrial & Field Techs',
                    desc: isAr ? 'أتربة، عرق، رياح، حركة آلات وضوضاء تتطلب هيكل متين وخافض رياح' : 'Dust, sweat, heavy machinery, outdoor wind noise reduction',
                    suggestedLevel: isAr ? 'المستوى 5' : 'Level 5'
                  },
                  {
                    id: 'desk-remote',
                    title: isAr ? 'العمل المكتبي من المنزل، المبرمجون، الباحثون' : 'Remote Work-from-Home, Programmers & Researchers',
                    desc: isAr ? 'مواقف هادئة ومحدودة، مكالمات هاتف، شخص أو اثنان' : 'Calm focused environment, telephone calls, minimal noise',
                    suggestedLevel: isAr ? 'المستوى 3' : 'Level 3'
                  },
                  {
                    id: 'retired-homemaker',
                    title: isAr ? 'المتقاعدون، ربات البيوت' : 'Retirees & Homemakers',
                    desc: isAr ? 'محادثات عائلية في المنزل، تلفزيون، جلسات ودية هادئة' : 'Family conversations at home, TV, calm visits',
                    suggestedLevel: isAr ? 'المستوى 1 أو 3' : 'Level 1 or 3'
                  }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProfile({ ...profile, professionCategory: item.id })}
                    className={`p-4 rounded-xl border text-start transition-all ${
                      profile.professionCategory === item.id
                        ? 'border-[#007CA6] bg-[#E8F6FA]/80 ring-1 ring-[#007CA6]/60 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-900">{item.title}</span>
                      <span className="text-[11px] font-bold text-[#007CA6] bg-[#E8F6FA] px-2 py-0.5 rounded border border-[#007CA6]/20">
                        {item.suggestedLevel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Weekly Lifestyle Scenarios */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isAr ? 'حدد المواقف السمعية التي تعيشها أسبوعياً:' : 'Select the listening scenarios you encounter weekly:'}
                  </h3>
                </div>

                <div className="inline-flex items-center gap-2 bg-[#F8FBFC] border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 shrink-0">
                  <span>{isAr ? 'عدد المواقف:' : 'Selected:'}</span>
                  <span className="font-mono text-[#007CA6] font-extrabold text-sm">{currentSituationCount}</span>
                  <span>·</span>
                  <span className="font-bold text-[#06243E]">{isAr ? `يقترح المستوى ${estimatedLevel}` : `Suggests Level ${estimatedLevel}`}</span>
                </div>
              </div>

              {/* Guide scoring banner */}
              <div className="mb-4 p-3.5 bg-gradient-to-r from-[#E8F6FA] to-[#FEF6EE] border border-[#007CA6]/25 rounded-xl flex items-start gap-2.5 text-xs text-slate-800">
                <Info className="w-4 h-4 text-[#007CA6] shrink-0 mt-0.5" />
                <div>
                  {isAr
                    ? 'طريقة تقدير مبدئية من رؤية الطبية: (0–1 موقف: المستوى 1) · (2 مواقف: المستوى 3) · (3–4: المستوى 5) · (5–6: المستوى 7) · (7 فأكثر أو القيادة/الحفلات: المستوى 9). المستوى النهائي يحدده أخصائي السمعيات.'
                    : 'Vision Medical preliminary estimate: (0–1: Level 1) · (2: Level 3) · (3–4: Level 5) · (5–6: Level 7) · (7+ or driving/parties: Level 9). Final level is set by the audiologist.'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {LIFESTYLE_SITUATIONS.map(item => {
                  const selected = profile.selectedSituations.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSituationToggle(item.id)}
                      className={`p-3.5 rounded-xl border text-start transition-all flex items-start gap-3 ${
                        selected
                          ? 'border-[#007CA6] bg-[#E8F6FA]/80 ring-1 ring-[#007CA6]/60 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                        {situationIcons[item.id] || <Home className="w-5 h-5 text-slate-600" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-bold text-sm text-slate-900 leading-tight">
                            {item.label[lang]}
                          </span>
                          {item.isHighNoiseOrCar && (
                            <span className="text-[10px] font-bold text-[#D97312] bg-[#FEF3E7] border border-[#F38B21]/30 px-1.5 py-0.5 rounded shrink-0">
                              {isAr ? 'مستوى 9' : 'Level 9'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1">
                          {item.description[lang]}
                        </p>
                      </div>

                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-1 ${
                        selected ? 'bg-[#007CA6] border-[#007CA6] text-white' : 'border-slate-300'
                      }`}>
                        {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Personal Priorities & Ergonomics */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {isAr ? 'ما الذي يهمك أكثر في جهاز السمع الخاص بك؟' : 'What matters most to you in your hearing instrument?'}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                {isAr ? 'اختر أولوياتك الأساسية لمطابقتها مع أنسب طراز من عائلات هانزاتون (HANSATON)' : 'Select your primary priorities to match the ideal HANSATON form factor'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    id: 'rechargeable',
                    icon: <BatteryCharging className="w-5 h-5 text-emerald-600" />,
                    title: isAr ? 'سماعة قابلة للشحن (sound E-R)' : 'Rechargeable Freedom (sound E-R)',
                    desc: isAr ? 'لا أريد تغيير البطاريات الصغيرة، شحن ليثيوم أيون سريع يدوم حتى 16 ساعة مع علبة متنقلة' : 'Zero tiny disposable batteries; 16h lithium-ion power with travel case',
                    modelHint: isAr ? 'هانزاتون إيسنز sound E-R' : 'HANSATON Essenz sound E-R'
                  },
                  {
                    id: 'invisibility',
                    icon: <EyeOff className="w-5 h-5 text-purple-600" />,
                    title: isAr ? 'سماعة شبه غير مرئية (STRATOS CIC)' : 'Maximum Invisibility (STRATOS CIC)',
                    desc: isAr ? 'تستقر بالكامل داخل قناة الأذن، سرية تامة ولا يلاحظها أحد في العمل أو المناسبات' : 'Rests completely deep in the ear canal for undetectable discretion',
                    modelHint: isAr ? 'هانزاتون ستراتوس CIC' : 'HANSATON STRATOS CIC'
                  },
                  {
                    id: 'no-behind-ear',
                    icon: <Glasses className="w-5 h-5 text-sky-600" />,
                    title: isAr ? 'لا شيء خلف الأذن (STRATOS ITE)' : 'Zero Behind-The-Ear (STRATOS ITE)',
                    desc: isAr ? 'قطعة واحدة داخل صيوان الأذن، لا تحتك بالحجاب ولا تتداخل مع النظارات أو الخوذة' : 'Single custom piece: no friction with hijab, glasses or helmets',
                    modelHint: isAr ? 'هانزاتون ستراتوس ITE' : 'HANSATON STRATOS ITE'
                  },
                  {
                    id: 'durability',
                    icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
                    title: isAr ? 'متانة عالية وسهولة مسك (Essenz BTE)' : 'Rugged Build & Easy Grip (Essenz BTE)',
                    desc: isAr ? 'هيكل قوي يتحمل الاستخدام الشاق والعرق، وأزرار واضحة سهلة الضبط لكبار السن' : 'Heavy-duty durability against sweat, impact, with tactile buttons',
                    modelHint: isAr ? 'هانزاتون إيسنز BTE' : 'HANSATON Essenz BTE'
                  },
                  {
                    id: 'budget',
                    icon: <Coins className="w-5 h-5 text-teal-600" />,
                    title: isAr ? 'سماعة صغيرة وأنيقة بسعر اقتصادي' : 'Discreet & Budget-Friendly',
                    desc: isAr ? 'سماعة Essenz RIC بالبطارية العادية، صوت طبيعي فائق النقاء وتكلفة مناسبة' : 'Essenz RIC with standard battery: natural acoustics at a friendly price',
                    modelHint: isAr ? 'هانزاتون إيسنز RIC' : 'HANSATON Essenz RIC'
                  },
                  {
                    id: 'phone-connectivity',
                    icon: <Smartphone className="w-5 h-5 text-blue-600" />,
                    title: isAr ? 'مكالمات هاتفية وبث بلوتوث مكثف' : 'Power Phone Streaming & Hands-Free',
                    desc: isAr ? 'الرد على المكالمات بنقرة على الأذن (Tap Control) وسماع المتحدث في الأذنين معاً' : 'Tap Control to answer calls & BiPhone binaural audio streaming',
                    modelHint: isAr ? 'إيسنز sound E-R' : 'Essenz sound E-R'
                  }
                ].map(item => {
                  const selected = profile.priorities.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handlePriorityToggle(item.id)}
                      className={`p-4 rounded-xl border text-start transition-all flex items-start gap-3.5 ${
                        selected
                          ? 'border-[#007CA6] bg-[#E8F6FA]/80 ring-1 ring-[#007CA6]/60 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                        {item.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-sm text-slate-900">{item.title}</span>
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                            {item.modelHint}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>

                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-1 ${
                        selected ? 'bg-[#007CA6] border-[#007CA6] text-white' : 'border-slate-300'
                      }`}>
                        {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation Actions */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{isAr ? 'السابق' : 'Previous'}</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <div className="flex items-center gap-3">
              {step === 1 && !profile.ageGroup && (
                <span className="text-xs text-amber-700 font-semibold">
                  {isAr ? 'اختر الفئة العمرية للمتابعة' : 'Select an age group to continue'}
                </span>
              )}
              <button
                type="button"
                disabled={step === 1 && !profile.ageGroup}
                onClick={() => setStep(step + 1)}
                className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                  step === 1 && !profile.ageGroup
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70 shadow-none'
                    : 'text-white bg-gradient-to-r from-[#007CA6] to-[#0099D8] hover:from-[#00688C] hover:to-[#0085BD] shadow-sm shadow-[#007CA6]/25 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                <span>{isAr ? 'التالي' : 'Next Step'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-7 py-3 text-sm font-extrabold text-white bg-gradient-to-r from-[#007CA6] via-[#0092C7] to-[#F38B21] hover:brightness-105 rounded-xl shadow-md shadow-[#007CA6]/30 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <HeartPulse className="w-4 h-4 text-white" />
              <span>{isAr ? 'عرض التوصية الطبية المخصصة' : 'Generate Personalized Recommendation'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
