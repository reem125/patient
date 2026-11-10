/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';

// Chrome / Edge fire `beforeinstallprompt` when the site can be installed as an app.
// It is captured as soon as this module loads, so an early event is not missed before React mounts.
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

// Whether the app is installed on this device. Chrome on Mac does not report it to the page,
// so the site remembers it itself: the installed app and the browser tab share this site's storage.
const INSTALLED_KEY = 'vm-app-installed';
const remember = (value: boolean) => {
  try {
    if (value) localStorage.setItem(INSTALLED_KEY, '1');
    else localStorage.removeItem(INSTALLED_KEY);
  } catch { /* storage blocked: fall back to what the browser reports */ }
};
const remembered = () => {
  try { return localStorage.getItem(INSTALLED_KEY) === '1'; } catch { return false; }
};

let deferred: BeforeInstallPromptEvent | null = null;
let installed = remembered();
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((fn) => fn());

// Opening the guide as the app proves it is installed.
if (isStandalone()) { installed = true; remember(true); }

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferred = e as BeforeInstallPromptEvent;
  // The browser only offers installation when the app is not installed (e.g. it was removed).
  installed = false;
  remember(false);
  notify();
});
window.addEventListener('appinstalled', () => {
  deferred = null;
  installed = true;
  remember(true);
  notify();
});

// Where supported (Android, Windows), the browser can also report the installed app directly
// (declared through related_applications in the manifest).
const nav = navigator as Navigator & { getInstalledRelatedApps?: () => Promise<unknown[]> };
nav.getInstalledRelatedApps?.()
  .then((apps) => { if (apps.length > 0) { installed = true; remember(true); notify(); } })
  .catch(() => { /* not supported */ });

/** iPhone / iPad (iPadOS reports itself as a Mac, so also check for a touch screen). */
export const isIOS = () =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);

/**
 * `canInstall`: the browser has offered installation, so `install()` opens its dialog.
 * `isInstalledApp`: the guide is already running as the installed app (no install button then).
 * `isInstalledElsewhere`: this is a browser tab, but the app is already installed on this device.
 */
export function useInstallPrompt() {
  const [, rerender] = useState(0);
  useEffect(() => {
    const fn = () => rerender((n) => n + 1);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);

  const install = async () => {
    if (!deferred) return;
    const event = deferred;
    await event.prompt();
    const { outcome } = await event.userChoice;
    deferred = null;
    if (outcome === 'accepted') { installed = true; remember(true); }
    notify();
  };

  return {
    canInstall: deferred !== null && !isStandalone(),
    isInstalledApp: isStandalone(),
    isInstalledElsewhere: installed && !isStandalone(),
    install,
  };
}
