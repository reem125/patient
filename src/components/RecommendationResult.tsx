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
import {
  CheckCircle2,
  Sparkles,
  Printer,
  RotateCcw,
  SlidersHorizontal,
  Battery,
  Shield,
  Layers,
  Volume2,
  AlertCircle,
  HelpCircle,
  Share2
} from 'lucide-react';
import { ShareModal } from './ShareModal.tsx';

interface RecommendationResultProps {
  lang: Language;
  result: RecommendationResultData;
  profile: PatientProfile;
  onRetake: () => void;
  onCompare: (modelId?: string) => void;
  onPrint: () => void;
}

export const RecommendationResult: React.FC<RecommendationResultProps> = ({
  lang,
  result,
  profile,
  onRetake,
  onCompare,
  onPrint
}) => {
  const isAr = lang === 'ar';
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const { primaryModel, alternativeModel, recommendedLevel, clinicalRationales, suggestedColors } = result;

  return (
    <div className="space-y-8">
      {/* Hero Recommendation Card with Vision Medical Palette */}
      <div className="bg-gradient-to-b from-[#F0F9FC]/90 via-white to-white rounded-3xl border border-[#007CA6]/30 shadow-sm p-6 sm:p-8 lg:p-10 relative overflow-hidden">
        
        {/* Subtle accent corner in Vision Medical Teal & Amber */}
        <div className="absolute top-0 end-0 bg-gradient-to-r from-[#007CA6] to-[#F38B21] text-white px-5 py-2 rounded-es-2xl text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>{isAr ? 'الخيار الأنسب لنمط حياتك' : 'Top Lifestyle Match'}</span>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          {/* Device Product Photography Showcase with Vision Pedestal */}
          <div className="w-full sm:w-64 lg:w-72 shrink-0 flex flex-col items-center">
            <div className="w-full bg-gradient-to-b from-white via-[#F0F9FC] to-white rounded-3xl p-6 border border-[#A3DCF1]/80 shadow-xs flex flex-col items-center justify-center relative group">
              <span className="absolute top-3 start-3 text-[11px] font-bold text-[#007CA6] bg-white px-2.5 py-0.5 rounded-full border border-[#A3DCF1] shadow-2xs">
                {primaryModel.code}
              </span>
              <img
                src={primaryModel.imageSrc}
                alt={primaryModel.imageAlt[lang]}
                className="h-48 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <div className="text-center mt-2">
                <span className="text-xs font-bold text-slate-800 block">
                  {primaryModel.badgeLabel ? primaryModel.badgeLabel[lang] : primaryModel.name[lang]}
                </span>
              </div>
            </div>

            {/* Optional Charger / Secondary preview */}
            {primaryModel.chargerImageSrc && (
              <div className="mt-3 w-full bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3 text-xs text-slate-700">
                <img
                  src={primaryModel.chargerImageSrc}
                  alt="HANSATON Egg Charger"
                  className="w-12 h-12 object-contain shrink-0"
                />
                <div>
                  <span className="font-bold text-slate-900 block">{isAr ? 'شاحن Easy Line الذكي' : 'Easy Line Charger'}</span>
                  <span className="text-[11px] text-slate-500">{isAr ? 'شحن مغناطيسي سريع وسلس' : 'Magnetic contact induction'}</span>
                </div>
              </div>
            )}
            {primaryModel.secondaryImageSrc && (
              <div className="mt-3 w-full bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3 text-xs text-slate-700">
                <img
                  src={primaryModel.secondaryImageSrc}
                  alt="BTE Power Option"
                  className="w-12 h-12 object-contain shrink-0"
                />
                <div>
                  <span className="font-bold text-slate-900 block">{isAr ? 'خيار BTE فائق القدرة' : 'Power BTE Option'}</span>
                  <span className="text-[11px] text-slate-500">{isAr ? 'للدرجات الشديدة والعميقة' : 'For severe to profound loss'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Details & Badges */}
          <div className="flex-1">
            <div className="text-xs font-bold text-[#007CA6] tracking-wider uppercase mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F38B21]" />
              <span>{isAr ? 'نتائج المستشار السمعي المعتمد' : 'Clinical Assessment Result'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-2">
              {primaryModel.name[lang]}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-5">
              {primaryModel.subtitle[lang]}
            </p>

            {/* Key Quick Badges */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-slate-700 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F6FA] text-[#007CA6] border border-[#007CA6]/20">
                <Layers className="w-4 h-4 text-[#007CA6]" />
                <span>{primaryModel.placement[lang]}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Battery className="w-4 h-4 text-emerald-600" />
                <span>{primaryModel.powerSource[lang]}</span>
              </span>

              {primaryModel.waterRating && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F0F9FC] text-[#007CA6] border border-[#007CA6]/20">
                  <Shield className="w-4 h-4 text-[#007CA6]" />
                  <span>{primaryModel.waterRating}</span>
                </span>
              )}

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FEF6EE] text-[#D97312] border border-[#F38B21]/25">
                <Volume2 className="w-4 h-4 text-[#F38B21]" />
                <span>{primaryModel.idealForDegree[lang]}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Recommended Performance Tier Spotlight with Vision Colors */}
        <div className="mt-6 p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#06243E] via-[#093557] to-[#041A2E] text-white border border-[#007CA6]/30 relative overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-[11px] font-bold text-[#70C9E8] uppercase tracking-widest block mb-1">
                {isAr ? 'مستوى الأداء المقترح' : 'Recommended Performance Tier'}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {recommendedLevel.title[lang]}
              </h2>
            </div>

            <div className="flex items-center gap-4 text-xs shrink-0">
              <div className="text-center px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="text-xl font-bold font-mono text-[#F9B233]">{recommendedLevel.environmentsCount}</div>
                <div className="text-slate-300 text-[11px]">{isAr ? 'بيئات سمعية تلقائية' : 'Sound Environments'}</div>
              </div>

              <div className="text-center px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="text-xl font-bold font-mono text-[#70C9E8]">{recommendedLevel.channels}</div>
                <div className="text-slate-300 text-[11px]">{isAr ? 'قنوات ضبط دقيقة' : 'Tuning Channels'}</div>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            {recommendedLevel.description[lang]}
          </p>

          {/* Highlight acoustic features */}
          <div className="border-t border-white/15 pt-4">
            <div className="text-xs font-semibold text-slate-400 mb-2">
              {isAr ? 'أبرز الميزات الصوتية المفعلة في هذا المستوى:' : 'Core acoustic features enabled in this tier:'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {recommendedLevel.highlightFeatures.slice(0, 4).map(feat => (
                <div key={feat.name} className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-xs">
                  <div className="font-bold text-[#A3DCF1] flex items-center justify-between">
                    <span>{feat.name}</span>
                    {feat.isExclusiveToNine && (
                      <span className="text-[10px] text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded font-normal">
                        {isAr ? 'حصرية بالمستوى 9' : 'Level 9 Exclusive'}
                      </span>
                    )}
                  </div>
                  <div className="text-slate-300 text-[11px] mt-1 leading-snug">
                    {feat.description[lang]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Personalized Medical Rationales (Why this fits you) */}
        <div className="mt-8">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{isAr ? 'لماذا يناسبك هذا الخيار تحديداً؟ (التحليل الطبي)' : 'Why this fits your profile (Clinical Rationale):'}</span>
          </h3>

          <div className="space-y-3">
            {clinicalRationales.map((rationale, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm text-slate-700 leading-relaxed flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-[#E8F6FA] text-[#007CA6] font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#007CA6]/20">
                  {idx + 1}
                </div>
                <div>{rationale[lang]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Color Match */}
        {suggestedColors.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 mb-2">
              {isAr ? 'الألوان الموصى بها لهذا الطراز لتتناسب مع مظهرك:' : 'Recommended Color Matching Options:'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {suggestedColors.map(color => (
                <div
                  key={color.id}
                  className="p-3 rounded-xl border border-slate-200 bg-white flex items-center gap-3 text-xs"
                >
                  <span
                    className="w-6 h-6 rounded-full shrink-0 shadow-2xs border"
                    style={{ backgroundColor: color.hex, borderColor: color.borderHex || '#CBD5E1' }}
                  />
                  <div>
                    <div className="font-bold text-slate-900">{color.name[lang]}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{color.bestFor[lang]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsShareOpen(true)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#25D366] via-[#20bd5a] to-[#007CA6] hover:brightness-105 transition-all flex items-center gap-2 shadow-sm shadow-[#25D366]/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Share2 className="w-4 h-4 text-white" />
              <span>{isAr ? 'مشاركة النتيجة (واتساب / إيميل)' : 'Share Result (WhatsApp / Email)'}</span>
            </button>

            <button
              onClick={onPrint}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#007CA6] to-[#0099D8] hover:from-[#00688C] hover:to-[#0085BD] transition-all flex items-center gap-2 shadow-sm shadow-[#007CA6]/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Printer className="w-4 h-4 text-white" />
              <span>{isAr ? 'طباعة تقرير المريض' : 'Print Patient Sheet'}</span>
            </button>

            <button
              onClick={() => onCompare(primaryModel.id)}
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-[#007CA6] bg-[#E8F6FA] hover:bg-[#D5F0FA] border border-[#A3DCF1]/60 transition-colors flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#007CA6]" />
              <span>{isAr ? 'مقارنة مع باقي الموديلات' : 'Compare with Other Models'}</span>
            </button>
          </div>

          <button
            onClick={onRetake}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-[#007CA6] transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'إعادة الإجابة على الأسئلة' : 'Retake Assessment'}</span>
          </button>
        </div>
      </div>

      {/* Alternative Recommendation Option Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-200 p-2 flex items-center justify-center shrink-0">
              <img
                src={alternativeModel.imageSrc}
                alt={alternativeModel.imageAlt[lang]}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                {isAr ? 'الخيار البديل المقترح' : 'Alternative Option Considered'}
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {alternativeModel.name[lang]}
              </h3>
            </div>
          </div>

          <button
            onClick={() => onCompare(alternativeModel.id)}
            className="px-4 py-2 text-xs font-bold text-[#007CA6] bg-[#E8F6FA] hover:bg-[#D5F0FA] rounded-xl transition-colors border border-[#007CA6]/25 shrink-0 self-start sm:self-auto"
          >
            {isAr ? 'مقارنة هذا البديل' : 'Compare Alternative'}
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
          {alternativeModel.subtitle[lang]}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <div className="text-slate-500 mb-0.5">{isAr ? 'الموضع:' : 'Placement:'}</div>
            <div className="font-semibold text-slate-800">{alternativeModel.placement[lang]}</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <div className="text-slate-500 mb-0.5">{isAr ? 'مصدر الطاقة:' : 'Power Source:'}</div>
            <div className="font-semibold text-slate-800">{alternativeModel.powerSource[lang]}</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <div className="text-slate-500 mb-0.5">{isAr ? 'أبرز ميزة:' : 'Key Advantage:'}</div>
            <div className="font-semibold text-slate-800">{alternativeModel.strengths[0][lang]}</div>
          </div>
        </div>
      </div>

      {/* Official Audiology Medical Notice */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FEF6EE] to-[#FFF9F2] border border-[#F38B21]/30 flex items-start gap-3.5 shadow-2xs">
        <AlertCircle className="w-5 h-5 text-[#D97312] shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 leading-relaxed">
          <div className="font-bold text-[#D97312] mb-1">
            {isAr ? 'إرشاد طبي هام من رؤية الطبية:' : 'Important Clinical Notice from Vision Medical:'}
          </div>
          <p className="text-slate-700">
            {isAr
              ? 'هذا الدليل استرشادي لتثقيف المريض وتسهيل الحوار مع الطبيب. يحدد أخصائي السمعيات المعتمد الطراز والمستوى الدقيقين بعد إجراء فحص قياس السمع الشامل وتطبيق أداة محلل نمط الحياة (Lifestyle Analyzer).'
              : 'This digital guide is for educational patient consultation. Certified Vision Medical audiologists determine final device specifications following comprehensive clinical audiometry and Lifestyle Analyzer assessment.'}
          </p>
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
