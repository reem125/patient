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

let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((fn) => fn());

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferred = e as BeforeInstallPromptEvent;
  notify();
});
window.addEventListener('appinstalled', () => {
  deferred = null;
  installed = true;
  notify();
});

// Chrome / Edge can tell the site whether its own app is already installed (declared through
// related_applications in the manifest). Once installed, the browser stops offering installation.
let installed = false;
const nav = navigator as Navigator & { getInstalledRelatedApps?: () => Promise<unknown[]> };
nav.getInstalledRelatedApps?.()
  .then((apps) => { installed = apps.length > 0; notify(); })
  .catch(() => { /* not supported: keep showing the install option */ });

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

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
    await event.userChoice;
    deferred = null;
    notify();
  };

  return {
    canInstall: deferred !== null && !isStandalone(),
    isInstalledApp: isStandalone(),
    isInstalledElsewhere: installed && !isStandalone(),
    install,
  };
}
