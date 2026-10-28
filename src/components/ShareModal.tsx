/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language, RecommendationResultData, PatientProfile } from '../types/hearingAid.ts';
import { X, Mail, Copy, Check, Share2, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  result: RecommendationResultData;
  profile: PatientProfile;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  lang,
  result,
  profile
}) => {
  const [copied, setCopied] = useState(false);
  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const { primaryModel, recommendedLevel, clinicalRationales } = result;

  // Build the formatted summary message
  const summaryText = isAr
    ? `🏥 *تقرير التوصية السمعية المخصصة - رؤية الطبية & HANSATON*
━━━━━━━━━━━━━━━━━━━━
سماعتك المقترحة: *${primaryModel.name.ar}* (${primaryModel.family} · ${primaryModel.code})
• الموضع: ${primaryModel.placement.ar}
• مصدر الطاقة: ${primaryModel.powerSource.ar}
• مستوى الأداء المقترح: *${recommendedLevel.title.ar}* (${recommendedLevel.environmentsCount} بيئات تلقائية · ${recommendedLevel.channels} قناة ضبط)

*أبرز مسوغات التوصية الطبية:*
${clinicalRationales.slice(0, 2).map((r, i) => `${i + 1}. ${r.ar}`).join('\n')}

رؤية الطبية · الموزع المعتمد لسماعات HANSATON السويسرية
${typeof window !== 'undefined' ? window.location.href : ''}`
    : `🏥 *Personalized Hearing Recommendation - Vision Medical & HANSATON*
━━━━━━━━━━━━━━━━━━━━
Recommended Device: *${primaryModel.name.en}* (${primaryModel.family} · ${primaryModel.code})
• Placement: ${primaryModel.placement.en}
• Power Source: ${primaryModel.powerSource.en}
• Recommended Performance Tier: *${recommendedLevel.title.en}* (${recommendedLevel.environmentsCount} Environments · ${recommendedLevel.channels} Channels)

*Clinical Highlights:*
${clinicalRationales.slice(0, 2).map((r, i) => `${i + 1}. ${r.en}`).join('\n')}

Vision Medical · Authorized Partner for HANSATON Swiss Hearing Systems
${typeof window !== 'undefined' ? window.location.href : ''}`;

  const emailSubject = isAr
    ? `تقرير استشارة سماعات هانزاتون (HANSATON) - رؤية الطبية`
    : `HANSATON Hearing Aid Consultation Report - Vision Medical`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(summaryText)}`;
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(summaryText)}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(summaryText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Brand Ribbon */}
        <div className="h-2 bg-gradient-to-r from-[#007CA6] via-[#0099D8] to-[#F38B21]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#E8F6FA] text-[#007CA6] border border-[#007CA6]/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                {isAr ? 'مشاركة نتائج التوصية السمعية' : 'Share Hearing Recommendation'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAr ? 'أرسل النتيجة إلى طبيبك أو شاركها عبر واتساب أو البريد' : 'Send results to your audiologist or share via WhatsApp/Email'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Device Summary Card Preview */}
          <div className="p-4 rounded-2xl bg-[#F8FBFC] border border-[#007CA6]/20 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white p-1 border border-slate-200 flex items-center justify-center shrink-0">
              <img
                src={primaryModel.imageSrc}
                alt={primaryModel.name[lang]}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-[#007CA6] uppercase tracking-wider block">
                {primaryModel.family} · {primaryModel.code}
              </span>
              <h4 className="font-extrabold text-sm text-slate-900 truncate">
                {primaryModel.name[lang]}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {recommendedLevel.title[lang]} · {recommendedLevel.environmentsCount} {isAr ? 'بيئات' : 'profiles'}
              </p>
            </div>
          </div>

          {/* Quick Share Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-sm shadow-[#25D366]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* WhatsApp SVG Icon */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>{isAr ? 'مشاركة عبر واتساب' : 'Share on WhatsApp'}</span>
            </a>

            {/* Email Button */}
            <a
              href={mailtoUrl}
              className="p-3.5 rounded-2xl bg-[#007CA6] hover:bg-[#00688C] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-sm shadow-[#007CA6]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Mail className="w-5 h-5" />
              <span>{isAr ? 'إرسال عبر البريد الإلكتروني' : 'Share via Email'}</span>
            </a>
          </div>

          {/* Copy Message Option */}
          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={handleCopy}
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-[#007CA6] bg-slate-50 hover:bg-[#E8F6FA]/50 text-slate-700 hover:text-[#007CA6] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">
                    {isAr ? 'تم نسخ التقرير بنجاح إلى الحافظة!' : 'Summary copied to clipboard!'}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>
                    {isAr ? 'نسخ نص التقرير بالكامل لمشاركته يدوياً' : 'Copy complete summary text to clipboard'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer info note */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500">
          <span>{isAr ? 'رؤية الطبية · الموزع المعتمد لسماعات HANSATON السويسرية' : 'Vision Medical · Authorized Partner for HANSATON Swiss Hearing Systems'}</span>
        </div>
      </div>
    </div>
  );
};
