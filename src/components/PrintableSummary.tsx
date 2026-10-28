/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Language,
  RecommendationResultData,
  PatientProfile
} from '../types/hearingAid.ts';
import { Printer, ArrowLeft, ArrowRight, ShieldCheck, Stethoscope, Share2, RotateCcw } from 'lucide-react';
import { ShareModal } from './ShareModal.tsx';
import { LIFESTYLE_SITUATIONS } from '../data/hearingAidData.ts';

const AGE_LABELS: Record<string, { ar: string; en: string }> = {
  'under-18': { ar: 'أقل من 18 سنة', en: 'Under 18' },
  '18-34': { ar: '18–34 سنة', en: '18–34 Years' },
  '35-54': { ar: '35–54 سنة', en: '35–54 Years' },
  '55-64': { ar: '55–64 سنة', en: '55–64 Years' },
  '65-74': { ar: '65–74 سنة', en: '65–74 Years' },
  '75-plus': { ar: '75 سنة فأكثر', en: '75+ Years' }
};

const HEADWEAR_LABELS: Record<string, { ar: string; en: string }> = {
  hijab: { ar: 'الحجاب أو النقاب', en: 'Hijab or Niqab' },
  niqab: { ar: 'الحجاب أو النقاب', en: 'Hijab or Niqab' },
  ghutra: { ar: 'الغترة أو الشماغ', en: 'Ghutra or Shemagh' },
  glasses: { ar: 'النظارات', en: 'Eyeglasses' },
  helmet: { ar: 'الخوذة أو سماعات الرأس', en: 'Helmet or Headsets' },
  none: { ar: 'لا أرتدي شيئاً مما سبق', en: 'None of the above' }
};

const PROFESSION_LABELS: Record<string, { ar: string; en: string }> = {
  'sales-executive': { ar: 'المبيعات، الدعاية الطبية، الإدارة التنفيذية', en: 'Sales, Medical Reps & C-Suite Executives' },
  'driver-traveler': { ar: 'السائقون وكثيرو السفر', en: 'Drivers & Frequent Travelers' },
  'hospitality-events': { ar: 'الضيافة والمطاعم والفعاليات', en: 'Hospitality, Restaurants & Events' },
  'business-legal': { ar: 'رجال الأعمال، المحامون، الاستشارات، البنوك', en: 'Business, Legal, Consulting & Banking' },
  'education-teachers': { ar: 'المعلمون والأساتذة ومحاضرو الجامعات', en: 'Educators, Professors & Teachers' },
  'healthcare-clinics': { ar: 'الأطباء، الممرضون، الصيادلة، العيادات', en: 'Healthcare: Doctors, Nurses & Pharmacists' },
  'office-civil': { ar: 'موظفو المكاتب والجهات الحكومية والمحاسبون', en: 'Office Staff, Civil Service & Accountants' },
  'field-factory': { ar: 'عمال المواقع، المصانع، المهندسون، الفنيون', en: 'Site Engineers, Industrial & Field Techs' },
  'desk-remote': { ar: 'العمل المكتبي من المنزل، المبرمجون، الباحثون', en: 'Remote Work-from-Home, Programmers & Researchers' },
  'retired-homemaker': { ar: 'المتقاعدون، ربات البيوت', en: 'Retirees & Homemakers' }
};

interface PrintableSummaryProps {
  lang: Language;
  result: RecommendationResultData;
  profile: PatientProfile;
  onClose: () => void;
  onStartAgain?: () => void;
}

export const PrintableSummary: React.FC<PrintableSummaryProps> = ({
  lang,
  result,
  profile,
  onClose,
  onStartAgain
}) => {
  const isAr = lang === 'ar';
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { primaryModel, alternativeModel, recommendedLevel, clinicalRationales, suggestedColors } = result;

  const handlePrint = () => {
    window.print();
  };

  const todayDate = new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* On-screen control bar (hidden in print) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <button
          onClick={onClose}
          className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isAr ? 'الرجوع للنتائج' : 'Back to Results'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          {onStartAgain && (
            <button
              onClick={onStartAgain}
              className="px-4 py-2.5 text-xs sm:text-sm font-bold text-amber-950 bg-[#FEF6EE] hover:bg-[#FEEAD4] border border-[#F38B21]/40 rounded-xl transition-all flex items-center gap-2 shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
              title={isAr ? 'مسح النتائج والبدء من جديد' : 'Clear results and start again'}
            >
              <RotateCcw className="w-4 h-4 text-[#F38B21]" />
              <span>{isAr ? 'البدء من جديد' : 'Start Again'}</span>
            </button>
          )}

          <button
            onClick={() => setIsShareOpen(true)}
            className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Share2 className="w-4 h-4 text-white" />
            <span>{isAr ? 'مشاركة (واتساب / إيميل)' : 'Share (WhatsApp / Email)'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-[#007CA6] via-[#0092C7] to-[#F38B21] hover:brightness-105 rounded-xl shadow-sm shadow-[#007CA6]/30 transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>{isAr ? 'طباعة التقرير الطبي' : 'Print Medical Sheet'}</span>
          </button>
        </div>
      </div>

      {/* The Printable Document */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md print:border-none print:shadow-none print:p-0 max-w-4xl mx-auto text-slate-900 overflow-hidden">
        {/* Branded Vision Medical top ribbon */}
        <div className="h-2.5 bg-gradient-to-r from-[#007CA6] via-[#0099D8] to-[#F38B21]" />
        
        <div className="p-8 sm:p-12">
          {/* Document Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <img
                src="/assets/aistudio/Vision_Logo_En_Ar_-_Horizontal_Colors-1_31408bb2.jpg"
                alt="Vision Medical"
                className="h-12 w-auto object-contain"
              />
              <div className="h-8 w-px bg-slate-200" />
              <img
                src="/assets/aistudio/images__1__eff65cd3.png"
                alt="HANSATON"
                className="h-8 w-auto object-contain"
              />
            </div>

            <div className="text-end">
              <div className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#007CA6] bg-[#E8F6FA] px-2.5 py-0.5 rounded-full mb-1">
                {isAr ? 'تقرير استشارة سمعية مخصصة' : 'Preliminary Hearing Consultation'}
              </div>
              <div className="text-base font-extrabold text-slate-900">
                {isAr ? 'رؤية الطبية × هانزاتون' : 'Vision Medical × HANSATON'}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 font-mono">{todayDate}</div>
            </div>
          </div>

          {/* Patient Profile Summary Grid */}
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#F0F9FC] to-[#FEF6EE] border border-[#007CA6]/20">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#007CA6] uppercase tracking-wider mb-2.5">
              <span className="w-2 h-2 rounded-full bg-[#F38B21]" />
              <span>{isAr ? 'ملخص بيانات ونمط حياة المريض:' : 'Patient Profile & Lifestyle Summary:'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">{isAr ? 'الفئة العمرية:' : 'Age Group:'}</span>
                <span className="font-bold text-slate-900">
                  {profile.ageGroup ? (AGE_LABELS[profile.ageGroup]?.[lang] || profile.ageGroup) : (isAr ? 'غير محدد' : 'Unspecified')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">{isAr ? 'المهنة / النشاط:' : 'Profession / Activity:'}</span>
                <span className="font-bold text-slate-900">
                  {profile.professionCategory ? (PROFESSION_LABELS[profile.professionCategory]?.[lang] || profile.professionCategory) : (isAr ? 'غير محدد' : 'Unspecified')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">{isAr ? 'أغطية الرأس/النظارات:' : 'Headwear / Glasses:'}</span>
                <span className="font-bold text-slate-900">
                  {profile.headwear.length > 0
                    ? profile.headwear.map(h => HEADWEAR_LABELS[h]?.[lang] || h).join(isAr ? '، ' : ', ')
                    : (isAr ? 'لا يوجد' : 'None')}
                </span>
              </div>
            </div>

            {/* Situations list */}
            <div className="mt-3 pt-3 border-t border-[#007CA6]/15 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-500 font-semibold">{isAr ? 'المواقف والبيئات الصوتية المختارة:' : 'Selected Acoustic Environments:'}</span>
                <span className="font-bold text-[#007CA6] font-mono">
                  {profile.selectedSituations.length} {isAr ? 'مواقف' : 'scenarios'}
                </span>
              </div>
              {profile.selectedSituations.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {profile.selectedSituations.map(id => {
                    const sit = LIFESTYLE_SITUATIONS.find(s => s.id === id);
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-white text-slate-700 border border-slate-200 shadow-2xs"
                      >
                        {sit ? sit.label[lang] : id}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <span className="text-slate-500 text-xs italic">{isAr ? 'لم يتم تحديد مواقف' : 'No scenarios selected'}</span>
              )}
            </div>
          </div>

        {/* Primary Recommendation Section */}
        <div className="border border-[#007CA6]/30 rounded-2xl p-6 mb-6 print-break-inside-avoid bg-white shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-[#007CA6] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#007CA6]" />
              {isAr ? 'الطراز الموصى به أولاً' : 'Primary Recommended Instrument'}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E8F6FA] text-[#007CA6] border border-[#007CA6]/20">
              {primaryModel.family} · {primaryModel.code}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <div className="w-20 h-20 bg-[#F8FBFC] border border-slate-200 rounded-xl p-1.5 flex items-center justify-center shrink-0">
              <img
                src={primaryModel.imageSrc}
                alt={primaryModel.imageAlt[lang]}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-1">
                {primaryModel.name[lang]}
              </h2>
              <p className="text-xs text-slate-600">{primaryModel.subtitle[lang]}</p>
            </div>
          </div>

          <div className={`grid grid-cols-2 ${recommendedLevel.channels !== undefined ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-2 text-xs border-y border-slate-100 py-3 mb-4`}>
            <div>
              <span className="text-slate-500 block">{isAr ? 'الموضع:' : 'Placement:'}</span>
              <span className="font-bold text-slate-800">{primaryModel.placement[lang]}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{isAr ? 'مستوى الأداء:' : 'Performance Tier:'}</span>
              <span className="font-extrabold text-[#007CA6]">{recommendedLevel.title[lang]}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{isAr ? 'البيئات التلقائية:' : 'Environments:'}</span>
              <span className="font-bold text-slate-800 font-mono">{recommendedLevel.environmentsCount} {isAr ? 'بيئات' : 'profiles'}</span>
            </div>
            {recommendedLevel.channels !== undefined && (
              <div>
                <span className="text-slate-500 block">{isAr ? 'قنوات الضبط:' : 'Channels:'}</span>
                <span className="font-bold text-slate-800 font-mono">{recommendedLevel.channels} {isAr ? 'قناة' : 'channels'}</span>
              </div>
            )}
          </div>

          {/* Clinical Rationales */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700">
              {isAr ? 'مسوغات التوصية الطبية والارتباط بنمط الحياة:' : 'Clinical Rationale & Lifestyle Alignment:'}
            </div>
            {clinicalRationales.map((rat, i) => (
              <div key={i} className="text-xs text-slate-600 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#007CA6] mt-1.5 shrink-0" />
                <span>{rat[lang]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alternative Option & Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 print-break-inside-avoid">
          <div className="p-4 rounded-xl border border-slate-200 text-xs bg-slate-50/50">
            <span className="font-bold text-slate-500 uppercase block mb-1">
              {isAr ? 'الخيار البديل للمناقشة' : 'Alternative Considered'}
            </span>
            <div className="font-bold text-slate-900 text-sm mb-1">{alternativeModel.name[lang]}</div>
            <p className="text-slate-600">{alternativeModel.subtitle[lang]}</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 text-xs bg-slate-50/50">
            <span className="font-bold text-slate-500 uppercase block mb-1">
              {isAr ? 'الألوان المقترحة' : 'Suggested Finish / Colors'}
            </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {suggestedColors.slice(0, 3).map(c => (
                <span key={c.id} className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white text-slate-800 font-medium border border-slate-200 shadow-2xs">
                  <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ backgroundColor: c.hex }} />
                  <span>{c.name[lang]}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Doctor & Audiologist Notes Box */}
        <div className="border border-[#007CA6]/30 rounded-2xl p-6 bg-[#F8FBFC] print-break-inside-avoid">
          <div className="flex items-center gap-2 mb-3">
            <Stethoscope className="w-4 h-4 text-[#007CA6]" />
            <h3 className="text-xs font-extrabold text-[#06243E] uppercase tracking-wider">
              {isAr ? 'ملاحظات وتوصيات أخصائي السمعيات بالعيادة:' : 'Clinical Evaluation & Fitting Notes (For Audiologist):'}
            </h3>
          </div>

          <div className="h-24 border border-dashed border-[#007CA6]/40 rounded-lg bg-white mb-4 p-3 text-xs text-slate-400">
            {isAr ? 'تدوين نتائج فحص السمع (Audiogram) ومقاس الأذن وتفضيل المريض...' : 'Audiogram PTA, ear impression notes, and REM verification details...'}
          </div>

          <div className="grid grid-cols-2 gap-8 text-xs pt-2">
            <div>
              <span className="text-slate-500 block mb-1">{isAr ? 'اسم أخصائي السمعيات:' : 'Audiologist Name:'}</span>
              <div className="border-b border-slate-300 h-6" />
            </div>
            <div>
              <span className="text-slate-500 block mb-1">{isAr ? 'توقيع وختم العيادة:' : 'Signature & Clinic Stamp:'}</span>
              <div className="border-b border-slate-300 h-6" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
          <span>{isAr ? 'رؤية الطبية · الموزع والشريك المعتمد لسماعات هانزاتون (HANSATON) السويسرية' : 'Vision Medical · Authorized Partner for HANSATON Swiss Hearing Systems'}</span>
        </div>

      </div>
    </div>

    {/* Share Modal Dialog */}
    <ShareModal
      isOpen={isShareOpen}
      onClose={() => setIsShareOpen(false)}
      lang={lang}
      result={result}
      profile={profile}
    />
  </div>
  );
};
