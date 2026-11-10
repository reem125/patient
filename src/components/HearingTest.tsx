/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { Language } from '../types/hearingAid.ts';
import { mountHearingTest, HearingTestController } from '../hearing-test/screener.js';
import '../hearing-test/hearing-test.css';

interface HearingTestProps {
  lang: Language;
  onExit: () => void;
}

// Hosts the online hearing screener (src/hearing-test), which renders its own screens
// into this component's DOM and follows the site's language.
export const HearingTest: React.FC<HearingTestProps> = ({ lang, onExit }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<HearingTestController | null>(null);
  const onExitRef = useRef(onExit);
  onExitRef.current = onExit;

  useEffect(() => {
    if (!rootRef.current) return;
    controllerRef.current = mountHearingTest(rootRef.current, {
      lang,
      onExit: () => onExitRef.current(),
    });
    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
    // Mount once; language changes are passed in below without restarting the test.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    controllerRef.current?.setLang(lang);
  }, [lang]);

  return (
    <div ref={rootRef} className="hc-root">
      <div className="progress no-print" aria-hidden="true"><div data-hc="progress" /></div>
      <main data-hc="app" className="card" tabIndex={-1} />
      <footer className="footer"><p data-hc="footer" /></footer>
    </div>
  );
};
