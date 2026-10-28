/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Language } from '../types/hearingAid.ts';
import { Globe, Printer, Sparkles, BookOpen, SlidersHorizontal, Palette, RotateCcw } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: 'advisor' | 'devices' | 'levels' | 'compare' | 'colors';
  onTabChange: (tab: 'advisor' | 'devices' | 'levels' | 'compare' | 'colors') => void;
  onPrintClick?: () => void;
  onStartAgain?: () => void;
  hasRecommendation?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  activeTab,
  onTabChange,
  onPrintClick,
  onStartAgain,
  hasRecommendation = false
}) => {
  const isAr = lang === 'ar';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs no-print">
      {/* Vision Medical Brand Accent Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-[#007CA6] via-[#0099D8] via-[#F38B21] to-[#007CA6]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-20">
          
          {/* Zone 1: Brand Wordmark & Official Logos */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* Vision Medical Logo */}
            <div className="flex items-center">
              <img
                src="/assets/aistudio/Vision_Logo_En_Ar_-_Horizontal_Colors-1_31408bb2.jpg"
                alt="Vision Medical - رؤية الطبية"
                className="h-9 sm:h-11 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="h-7 w-px bg-slate-200 mx-0.5 sm:mx-1 hidden xs:block" />

            {/* Official HANSATON Logo Image */}
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center shadow-2xs">
                <img
                  src="/assets/aistudio/images__1__eff65cd3.png"
                  alt="HANSATON"
                  className="h-5 sm:h-6 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="hidden xl:inline text-[10px] font-bold text-[#007CA6] bg-[#E8F6FA] px-2 py-0.5 rounded-full border border-[#007CA6]/20">
                {isAr ? 'شريك معتمد' : 'Authorized Partner'}
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onTabChange('advisor')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'advisor'
                  ? 'bg-[#E8F6FA] text-[#007CA6] font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-[#007CA6] hover:bg-[#F0F9FC]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#F38B21]" />
              <span>{isAr ? 'المستشار الذكي' : 'Smart Advisor'}</span>
            </button>

            <button
              onClick={() => onTabChange('devices')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'devices'
                  ? 'bg-[#E8F6FA] text-[#007CA6] font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-[#007CA6] hover:bg-[#F0F9FC]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#007CA6]" />
              <span>{isAr ? 'أنواع السماعات' : 'Hearing Aid Types'}</span>
            </button>

            <button
              onClick={() => onTabChange('levels')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'levels'
                  ? 'bg-[#E8F6FA] text-[#007CA6] font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-[#007CA6] hover:bg-[#F0F9FC]'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-[#007CA6]" />
              <span>{isAr ? 'مستويات الأداء (1-9)' : 'Performance Levels (1-9)'}</span>
            </button>

            <button
              onClick={() => onTabChange('compare')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'compare'
                  ? 'bg-[#E8F6FA] text-[#007CA6] font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-[#007CA6] hover:bg-[#F0F9FC]'
              }`}
            >
              <span>{isAr ? 'مقارنة الموديلات' : 'Compare Models'}</span>
            </button>

            <button
              onClick={() => onTabChange('colors')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'colors'
                  ? 'bg-[#E8F6FA] text-[#007CA6] font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-[#007CA6] hover:bg-[#F0F9FC]'
              }`}
            >
              <Palette className="w-4 h-4 text-[#F38B21]" />
              <span>{isAr ? 'دليل الألوان' : 'Color Guide'}</span>
            </button>
          </nav>

          {/* Zone 3: Actions & Language Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {hasRecommendation && onStartAgain && (
              <button
                onClick={onStartAgain}
                className="px-3 py-1.5 text-xs font-bold text-amber-950 bg-[#FEF6EE] hover:bg-[#FEEAD4] border border-[#F38B21]/40 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-2xs"
                title={isAr ? 'مسح النتائج والبدء من جديد' : 'Clear results and start again'}
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#F38B21]" />
                <span className="hidden sm:inline">{isAr ? 'البدء من جديد' : 'Start Again'}</span>
              </button>
            )}

            {hasRecommendation && onPrintClick && (
              <button
                onClick={onPrintClick}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                title={isAr ? 'طباعة تقرير المريض' : 'Print Patient Summary'}
              >
                <Printer className="w-3.5 h-3.5 text-[#007CA6]" />
                <span className="hidden sm:inline">{isAr ? 'طباعة التقرير' : 'Print Report'}</span>
              </button>
            )}

            <button
              onClick={() => onLanguageChange(isAr ? 'en' : 'ar')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-300 hover:border-[#007CA6] hover:text-[#007CA6] bg-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Globe className="w-3.5 h-3.5 text-[#007CA6]" />
              <span>{isAr ? 'English' : 'العربية'}</span>
            </button>

            <button
              onClick={() => onTabChange('advisor')}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#007CA6] to-[#0099D8] hover:from-[#00688C] hover:to-[#0085BD] rounded-xl shadow-sm shadow-[#007CA6]/25 transition-all whitespace-nowrap shrink-0 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isAr ? 'اختر سماعتك المناسبة' : 'Choose Your Hearing Aid'}
            </button>
          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 gap-2 border-t border-slate-100 scrollbar-none">
          <button
            onClick={() => onTabChange('advisor')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'advisor' ? 'bg-sky-100 text-sky-900 font-bold' : 'text-slate-600 bg-slate-50'
            }`}
          >
            {isAr ? 'المستشار الذكي' : 'Advisor'}
          </button>
          <button
            onClick={() => onTabChange('devices')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'devices' ? 'bg-sky-100 text-sky-900 font-bold' : 'text-slate-600 bg-slate-50'
            }`}
          >
            {isAr ? 'الأنواع' : 'Devices'}
          </button>
          <button
            onClick={() => onTabChange('levels')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'levels' ? 'bg-sky-100 text-sky-900 font-bold' : 'text-slate-600 bg-slate-50'
            }`}
          >
            {isAr ? 'المستويات' : 'Levels'}
          </button>
          <button
            onClick={() => onTabChange('compare')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'compare' ? 'bg-sky-100 text-sky-900 font-bold' : 'text-slate-600 bg-slate-50'
            }`}
          >
            {isAr ? 'المقارنة' : 'Compare'}
          </button>
          <button
            onClick={() => onTabChange('colors')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'colors' ? 'bg-sky-100 text-sky-900 font-bold' : 'text-slate-600 bg-slate-50'
            }`}
          >
            {isAr ? 'الألوان' : 'Colors'}
          </button>
        </div>
      </div>
    </header>
  );
};
