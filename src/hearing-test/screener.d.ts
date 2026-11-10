export interface HearingTestController {
  setLang(lang: 'ar' | 'en'): void;
  destroy(): void;
}

export function mountHearingTest(
  root: HTMLElement,
  opts?: { lang?: 'ar' | 'en'; onExit?: () => void },
): HearingTestController;
