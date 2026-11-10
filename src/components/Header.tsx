/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Language } from '../types/hearingAid.ts';
import { Globe, Printer, Sparkles, BookOpen, SlidersHorizontal, Palette, RotateCcw, Ear, Home, Download, X, CheckCircle2 } from 'lucide-react';
import { useInstallPrompt, isIOS } from '../utils/installPrompt.ts';

// iPhone / iPad cannot install from a button on a website: Apple only allows Share > Add to Home Screen.
const IOS_INSTALL_STEPS = {
  ar: ['اضغط زر المشاركة (□↑) بجانب العنوان أو أسفل الشاشة', 'اختر «إضافة إلى الشاشة الرئيسية»', 'اضغط «إضافة»، وستظهر أيقونة رؤية الطبية على شاشتك'],
  en: ['Tap the Share button (□↑) next to the address or at the bottom of the screen', 'Choose “Add to Home Screen”', 'Tap “Add”: the Vision Medical icon appears on your home screen'],
};

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: 'home' | 'advisor' | 'devices' | 'levels' | 'compare' | 'colors' | 'hearing';
  onTabChange: (tab: 'home' | 'advisor' | 'devices' | 'levels' | 'compare' | 'colors' | 'hearing') => void;
  onPrintClick?: () => void;
  onStartAgain?: () => void;
  hasRecommendation?: boolean;
  // Start Again / Print belong to the advisor result; hide them elsewhere.
  showAdvisorActions?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  activeTab,
  onTabChange,
  onPrintClick,
  onStartAgain,
  hasRecommendation = false,
  showAdvisorActions = true
}) => {
  const isAr = lang === 'ar';
  // Install control: always shown until the app is installed. One click installs when the browser is
  // ready; Chrome / Edge only become ready after a click on the page and about 30 seconds, so before
  // that a one-line note says so. A plain label once installed; the Share steps on iPhone / iPad.
  const { canInstall, isInstalledApp, isInstalledElsewhere, install } = useInstallPrompt();
  const showIosSteps = !isInstalledElsewhere && !isInstalledApp && isIOS();
  const showInstallButton = !isInstalledElsewhere && !isInstalledApp && !isIOS();
  const [installNote, setInstallNote] = useState<string | null>(null);

  useEffect(() => {
    if (!installNote) return;
    const timer = setTimeout(() => setInstallNote(null), 6000);
    return () => clearTimeout(timer);
  }, [installNote]);
  useEffect(() => { if (canInstall) setInstallNote(null); }, [canInstall]);

  const onInstallClick = () => {
    if (canInstall) { install(); return; }
    const ua = navigator.userAgent;
    if (/Chrome\/|Edg\//.test(ua)) {
      setInstallNote(isAr ? 'يجهّز المتصفح التثبيت… حاول مرة أخرى بعد لحظات' : 'Your browser is getting the install ready… try again in a moment');
    } else if (/Safari\//.test(ua)) {
      setInstallNote(isAr ? 'من قائمة «ملف» اختر «إضافة إلى Dock»' : 'From the File menu choose “Add to Dock”');
    } else {
      setInstallNote(isAr ? 'افتح الموقع في Chrome أو Edge لتثبيته كتطبيق' : 'Open the site in Chrome or Edge to install it as an app');
    }
  };
  const [iosHelpOpen, setIosHelpOpen] = useState(false);
  const iosHelpRef = useRef<HTMLDivElement>(null);

  // Close the iPhone steps when tapping anywhere else.
  useEffect(() => {
    if (!iosHelpOpen) return;
    const close = (e: MouseEvent | TouchEvent) => {
      if (iosHelpRef.current && !iosHelpRef.current.contains(e.target as Node)) setIosHelpOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('touchstart', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('touchstart', close);
    };
  }, [iosHelpOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs no-print">
      {/* Vision Medical Brand Accent Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-[#007CA6] via-[#0099D8] via-[#F38B21] to-[#007CA6]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-16 sm:h-20">
          
          {/* Zone 1: Brand Wordmark & Official Logos (Click to return to Home Portal) */}
          <button
            type="button"
            onClick={() => onTabChange('home')}
            className="flex items-center gap-2 sm:gap-3.5 shrink-0 text-start hover:opacity-90 transition-opacity cursor-pointer group"
            title={isAr ? 'الصفحة الرئيسية' : 'Home'}
          >
            {/* Vision Medical Logo */}
            <div className="flex items-center">
              <img
                src="/assets/aistudio/Vision_Logo_En_Ar_-_Horizontal_Colors-1_31408bb2.jpg"
                alt="Vision Medical - رؤية الطبية"
                className="h-11 sm:h-14 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="h-8 sm:h-10 w-px bg-slate-200 mx-0.5 sm:mx-1 hidden xs:block" />

            {/* Official HANSATON Logo Image */}
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center shadow-2xs group-hover:border-[#007CA6]/40 transition-colors">
                <img
                  src="/assets/aistudio/images__1__eff65cd3.png"
                  alt="HANSATON"
                  className="h-5 sm:h-6 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="hidden 2xl:inline text-[10px] font-bold text-[#007CA6] bg-[#E8F6FA] px-2.5 py-0.5 rounded-full border border-[#007CA6]/25 whitespace-nowrap">
                {isAr ? 'رؤية الطبية وكيل وموزع معتمد لهانزاتون' : 'Vision Medical — Authorized Agent & Distributor for HANSATON'}
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-0.5 min-w-0">
            <button
              onClick={() => onTabChange('home')}
              className={`px-2.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-[#E8F6FA] text-[#007CA6] font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-[#007CA6] hover:bg-[#F0F9FC]'
              }`}
            >
              <Home className="w-4 h-4 text-[#007CA6]" />
              <span>{isAr ? 'الرئيسية' : 'Home'}</span>
            </button>

            <button
              onClick={() => onTabChange('advisor')}
              className={`px-2.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'advisor'
                  ? 'bg-[#E8F6FA] text-[#007CA6] font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-[#007CA6] hover:bg-[#F0F9FC]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#007CA6]" />
              <span>{isAr ? 'اختر سماعتك' : 'Choose Your Aid'}</span>
            </button>

            <button
              onClick={() => onTabChange('devices')}
              className={`px-2.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'devices'
                  ? 'bg-[#E8F6FA] text-[#007CA6] font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-[#007CA6] hover:bg-[#F0F9FC]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#007CA6]" />
              <span>{isAr ? 'أنواع السماعات' : 'Types'}</span>
            </button>

            <button
              onClick={() => onTabChange('levels')}
              className={`px-2.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'levels'
                  ? 'bg-[#E8F6FA] text-[#007CA6] font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-[#007CA6] hover:bg-[#F0F9FC]'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-[#007CA6]" />
              <span>{isAr ? 'مستويات الأداء' : 'Levels 1-9'}</span>
            </button>

            <button
              onClick={() => onTabChange('compare')}
              className={`px-2.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'compare'
                  ? 'bg-[#E8F6FA] text-[#007CA6] font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-[#007CA6] hover:bg-[#F0F9FC]'
              }`}
            >
              <span>{isAr ? 'المقارنة' : 'Compare'}</span>
            </button>

            <button
              onClick={() => onTabChange('colors')}
              className={`px-2.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'colors'
                  ? 'bg-[#E8F6FA] text-[#007CA6] font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-[#007CA6] hover:bg-[#F0F9FC]'
              }`}
            >
              <Palette className="w-4 h-4 text-[#007CA6]" />
              <span>{isAr ? 'الألوان' : 'Colors'}</span>
            </button>

            <button
              onClick={() => onTabChange('hearing')}
              className={`px-2.5 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-[#C2620A] border border-[#F38B21]/30 ${
                activeTab === 'hearing' ? 'bg-[#FEEAD4] shadow-2xs' : 'bg-[#FEF6EE] hover:bg-[#FEEAD4]'
              }`}
            >
              <Ear className="w-4 h-4 text-[#F38B21]" />
              <span>{isAr ? 'اختبار السمع' : 'Hearing Test'}</span>
            </button>
          </nav>

          {/* Zone 3: Actions & Language Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {showAdvisorActions && hasRecommendation && onStartAgain && (
              <button
                onClick={onStartAgain}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-2xs"
                title={isAr ? 'مسح النتائج والبدء من جديد' : 'Clear results and start again'}
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">{isAr ? 'البدء من جديد' : 'Start Again'}</span>
              </button>
            )}

            {showAdvisorActions && hasRecommendation && onPrintClick && (
              <button
                onClick={onPrintClick}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                title={isAr ? 'طباعة تقرير المريض' : 'Print Patient Summary'}
              >
                <Printer className="w-3.5 h-3.5 text-[#007CA6]" />
                <span className="hidden sm:inline">{isAr ? 'طباعة التقرير' : 'Print Report'}</span>
              </button>
            )}

            {showInstallButton && (
              <div className="relative">
                <button
                  onClick={onInstallClick}
                  className="px-3 py-1.5 text-xs font-semibold text-[#007CA6] border border-[#007CA6]/40 hover:bg-[#E8F6FA] bg-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  title={isAr ? 'ثبّت الدليل كتطبيق على جهازك' : 'Install the guide as an app on this device'}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isAr ? 'تثبيت التطبيق' : 'Install app'}</span>
                </button>
                {installNote && (
                  <div role="status" className="absolute top-full mt-1.5 end-0 whitespace-nowrap max-w-[calc(100vw-2rem)] truncate px-2.5 py-1 rounded-md bg-slate-800 text-white text-[11px] shadow-md z-50">
                    {installNote}
                  </div>
                )}
              </div>
            )}

            {isInstalledElsewhere && (
              <span
                className="px-3 py-1.5 text-xs font-semibold text-[#00688C] bg-[#E8F6FA] border border-[#007CA6]/25 rounded-lg flex items-center gap-1.5 whitespace-nowrap"
                title={isAr ? 'افتحه من «فتح في التطبيق» في شريط العنوان أو من أيقونته' : 'Open it from “Open in app” in the address bar or from its icon'}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? 'التطبيق مثبّت' : 'App installed'}</span>
              </span>
            )}

            {showIosSteps && (
              <div ref={iosHelpRef} className="relative">
                <button
                  onClick={() => setIosHelpOpen((open) => !open)}
                  aria-expanded={iosHelpOpen}
                  className="px-3 py-1.5 text-xs font-semibold text-[#007CA6] border border-[#007CA6]/40 hover:bg-[#E8F6FA] bg-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  title={isAr ? 'أضف الدليل إلى الشاشة الرئيسية' : 'Add the guide to your home screen'}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isAr ? 'تثبيت التطبيق' : 'Install app'}</span>
                </button>

                {iosHelpOpen && (
                  <div className="absolute top-full mt-2 end-0 w-72 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-xl shadow-lg p-4 z-50 text-start">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="font-bold text-sm text-slate-900">{isAr ? 'أضف الدليل إلى الشاشة الرئيسية' : 'Add the guide to your home screen'}</div>
                      <button onClick={() => setIosHelpOpen(false)} className="text-slate-500 hover:text-slate-700" aria-label={isAr ? 'إغلاق' : 'Close'}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <ol className="list-decimal ps-5 space-y-1.5 text-xs text-slate-600 leading-relaxed">
                      {IOS_INSTALL_STEPS[isAr ? 'ar' : 'en'].map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
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
              className="hidden 2xl:inline-flex px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#007CA6] to-[#0099D8] hover:from-[#00688C] hover:to-[#0085BD] rounded-xl shadow-sm shadow-[#007CA6]/25 transition-all whitespace-nowrap shrink-0 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isAr ? 'اختر سماعتك المناسبة' : 'Choose Your Hearing Aid'}
            </button>
          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex xl:hidden overflow-x-auto py-2.5 gap-2 border-t border-slate-100 scrollbar-none">
          <button
            onClick={() => onTabChange('home')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'home' ? 'bg-[#007CA6] text-white font-bold' : 'text-slate-600 bg-slate-50'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            {isAr ? 'الرئيسية' : 'Home'}
          </button>
          <button
            onClick={() => onTabChange('advisor')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'advisor' ? 'bg-sky-100 text-sky-900 font-bold' : 'text-slate-600 bg-slate-50'
            }`}
          >
            {isAr ? 'اختر سماعتك' : 'Choose Aid'}
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
          <button
            onClick={() => onTabChange('hearing')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md whitespace-nowrap flex items-center gap-1 text-[#C2620A] border border-[#F38B21]/30 ${
              activeTab === 'hearing' ? 'bg-[#FEEAD4]' : 'bg-[#FEF6EE]'
            }`}
          >
            <Ear className="w-3.5 h-3.5 text-[#F38B21]" />
            {isAr ? 'اختبار السمع' : 'Hearing Test'}
          </button>
        </div>
      </div>
    </header>
  );
};
