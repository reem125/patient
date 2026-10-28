/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language, HearingAidModel } from '../types/hearingAid.ts';
import { HEARING_AID_MODELS } from '../data/hearingAidData.ts';
import {
  Check,
  X,
  Battery,
  Shield,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface ComparisonMatrixProps {
  lang: Language;
  initialSelectedIds?: string[];
  onSelectForAdvisor?: (modelId: string) => void;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  lang,
  initialSelectedIds = ['essenz-sound-er', 'essenz-ric', 'stratos-ite'],
  onSelectForAdvisor
}) => {
  const isAr = lang === 'ar';
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);

  const toggleModelSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(x => x !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      } else {
        // Replace the last one
        setSelectedIds([selectedIds[0], selectedIds[1], id]);
      }
    }
  };

  const selectedModels: HearingAidModel[] = selectedIds
    .map(id => HEARING_AID_MODELS.find(m => m.id === id))
    .filter((m): m is HearingAidModel => Boolean(m));

  return (
    <div className="space-y-6">
      {/* Title & Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isAr ? 'مقارنة مواصفات سماعات هانزاتون جنباً إلى جنب' : 'Side-by-Side HANSATON Model Comparison'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr ? 'اختر حتى 3 طرز للمقارنة المباشرة في الخصائص الفيزيائية ومصدر الطاقة والراحة' : 'Compare up to 3 models across physical ergonomics, power, and lifestyle suitability'}
            </p>
          </div>

          <div className="text-xs font-bold text-[#007CA6] bg-[#E8F6FA] px-3 py-1.5 rounded-xl border border-[#A3DCF1]/60 shrink-0">
            {isAr ? `محدد (${selectedIds.length}/3)` : `Selected (${selectedIds.length}/3)`}
          </div>
        </div>

        {/* Model Chips to toggle */}
        <div className="flex flex-wrap gap-2">
          {HEARING_AID_MODELS.map(model => {
            const isSelected = selectedIds.includes(model.id);
            return (
              <button
                key={model.id}
                onClick={() => toggleModelSelection(model.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'border-[#007CA6] bg-[#E8F6FA] text-[#007CA6] ring-1 ring-[#007CA6]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#F38B21]' : 'bg-slate-300'}`} />
                <span>{model.name[lang]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#F0F9FC] to-white border-b border-slate-200">
                <th className="p-4 font-bold text-slate-700 w-48 text-start">
                  {isAr ? 'المعيار / الخاصية' : 'Specification / Criteria'}
                </th>
                {selectedModels.map(model => (
                  <th key={model.id} className="p-4 font-extrabold text-slate-900 text-start min-w-[220px]">
                    <div className="w-full h-28 bg-gradient-to-b from-white via-[#F0F9FC] to-white rounded-2xl border border-[#A3DCF1]/70 p-2 flex items-center justify-center mb-3 shadow-2xs">
                      <img
                        src={model.imageSrc}
                        alt={model.imageAlt[lang]}
                        className="max-h-full max-w-full object-contain drop-shadow-xs"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[11px] font-bold text-[#007CA6] bg-[#E8F6FA] px-2 py-0.5 rounded-md border border-[#A3DCF1]/60">
                        {model.family} · {model.code}
                      </span>
                      {model.isRechargeable && (
                        <span className="text-[11px] font-bold text-[#D97312] bg-[#FEF3E7] px-1.5 py-0.5 rounded-md border border-[#F38B21]/30">
                          {isAr ? 'شحن ليثيوم' : 'Li-ion Recharge'}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 leading-snug">{model.name[lang]}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* Row: Placement */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  {isAr ? 'أين توضع؟' : 'Placement & Fit'}
                </td>
                {selectedModels.map(model => (
                  <td key={model.id} className="p-4 text-slate-700">
                    <span className="font-semibold text-slate-900 block mb-0.5">{model.placement[lang]}</span>
                  </td>
                ))}
              </tr>

              {/* Row: Power Source */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  {isAr ? 'مصدر الطاقة والبطارية' : 'Power & Battery'}
                </td>
                {selectedModels.map(model => (
                  <td key={model.id} className="p-4 text-slate-700">
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      {model.isRechargeable ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {isAr ? 'قابلة للشحن (ليثيوم أيون)' : 'Rechargeable Li-ion'}
                        </span>
                      ) : (
                        <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {isAr ? 'بطارية هوائية تقليدية' : 'Standard Zinc-Air'}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono block">{model.batteryLife}</span>
                  </td>
                ))}
              </tr>

              {/* Row: Water & Dust Protection */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  {isAr ? 'مقاومة الماء والغبار' : 'Ingress Protection'}
                </td>
                {selectedModels.map(model => (
                  <td key={model.id} className="p-4 text-slate-700">
                    {model.waterRating ? (
                      <span className="font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                        {model.waterRating}
                      </span>
                    ) : (
                      <span className="text-slate-500">{isAr ? 'مقاومة الرطوبة العادية' : 'Standard moisture barrier'}</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row: Headwear & Glasses Compatibility */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  {isAr ? 'التوافق مع الحجاب والنظارات' : 'Headwear & Glasses Fit'}
                </td>
                {selectedModels.map(model => {
                  const isInternal = model.family === 'STRATOS';
                  return (
                    <td key={model.id} className="p-4 text-slate-700">
                      {isInternal ? (
                        <div className="text-emerald-700 font-semibold flex items-center gap-1.5">
                          <Check className="w-4 h-4 shrink-0" />
                          <span>{isAr ? 'مثالي جداً (لا شيء خلف الأذن)' : 'Ideal (Zero behind ear)'}</span>
                        </div>
                      ) : (
                        <div className="text-slate-600">
                          <span>{isAr ? 'جيد (يتطلب ترتيب بسيط مع النظارات)' : 'Good (rests behind the ear)'}</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Row: Tap Control (التحكم بالنقر) */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  {isAr ? 'التحكم بالنقر (Tap Control)' : 'Tap Control on Ear'}
                </td>
                {selectedModels.map(model => (
                  <td key={model.id} className="p-4 text-slate-700">
                    {model.code === 'sound E-R' ? (
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>{isAr ? 'مدعوم (نقرة مزدوجة للرد)' : 'Supported (Double-tap)'}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1">
                        <X className="w-4 h-4" />
                        <span>{isAr ? 'غير مدعوم' : 'Not available'}</span>
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row: Degree of Hearing Loss */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  {isAr ? 'درجات ضعف السمع المناسبة' : 'Fitting Range'}
                </td>
                {selectedModels.map(model => (
                  <td key={model.id} className="p-4 text-slate-700 font-medium">
                    {model.idealForDegree[lang]}
                  </td>
                ))}
              </tr>

              {/* Row: Handling & Ease of Cleaning */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  {isAr ? 'سهولة المسك والتنظيف' : 'Handling & Cleaning'}
                </td>
                {selectedModels.map(model => {
                  let textAr = 'سهل ومريح';
                  let textEn = 'Easy & comfortable';
                  if (model.id === 'essenz-bte') {
                    textAr = 'أسهل طراز للمسك ومناسب لكبار السن والأطفال';
                    textEn = 'Easiest grip for seniors and pediatric care';
                  } else if (model.id === 'stratos-cic') {
                    textAr = 'صغيرة جداً، تحتاج أصابع مرنة وقناة أذن مناسبة';
                    textEn = 'Requires fine dexterity and adequate canal size';
                  }
                  return (
                    <td key={model.id} className="p-4 text-slate-700">
                      {isAr ? textAr : textEn}
                    </td>
                  );
                })}
              </tr>

              {/* Row: Invisibility Level */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  {isAr ? 'درجة السرية وعدم الظهور' : 'Cosmetic Discretion'}
                </td>
                {selectedModels.map(model => {
                  let rating = isAr ? 'غير ملحوظة وصغيرة' : 'Discreet & compact';
                  if (model.id === 'stratos-cic') {
                    rating = isAr ? 'أعلى درجات الخفاء (شبه غير مرئية)' : 'Highest (Virtually invisible)';
                  } else if (model.id === 'essenz-bte') {
                    rating = isAr ? 'ظاهرة خلف الأذن، تركيز على المتانة' : 'Visible behind ear, focus on power';
                  }
                  return (
                    <td key={model.id} className="p-4 font-semibold text-slate-900">
                      {rating}
                    </td>
                  );
                })}
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
