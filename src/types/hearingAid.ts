/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'ar' | 'en';

export type HearingAidFamily = 'Essenz' | 'STRATOS';

export type PlacementType = 'BTE' | 'RIC' | 'ITE' | 'CIC';

export interface BilingualText {
  ar: string;
  en: string;
}

export interface HearingAidColor {
  id: string;
  name: BilingualText;
  hex: string;
  borderHex?: string;
  bestFor: BilingualText;
  family: 'Essenz' | 'STRATOS';
}

export interface HearingAidModel {
  id: string;
  code: PlacementType | 'sound E-R';
  name: BilingualText;
  subtitle: BilingualText;
  family: HearingAidFamily;
  placement: BilingualText;
  powerSource: BilingualText;
  isRechargeable: boolean;
  batteryLife: string;
  idealForDegree: BilingualText;
  keyFeatures: BilingualText[];
  strengths: BilingualText[];
  suitableFor: BilingualText[];
  contraindications?: BilingualText[];
  waterRating?: string;
  availableColors: string[];
  imagePlaceholderCategory: 'bte' | 'ric' | 'ite' | 'cic';
  imageSrc: string;
  secondaryImageSrc?: string;
  chargerImageSrc?: string;
  imageAlt: BilingualText;
  badgeLabel?: BilingualText;
}

export interface PerformanceLevel {
  level: 1 | 3 | 5 | 7 | 9;
  title: BilingualText;
  environmentsCount: number;
  channels: number;
  description: BilingualText;
  bestForPersona: BilingualText;
  environmentsList: BilingualText[];
  highlightFeatures: {
    name: string;
    description: BilingualText;
    isExclusiveToNine?: boolean;
  }[];
  professionExamples: BilingualText[];
}

export interface LifestyleSituation {
  id: string;
  label: BilingualText;
  description: BilingualText;
  iconName: string;
  isHighNoiseOrCar?: boolean;
}

export interface PatientProfile {
  ageGroup: string;
  gender: 'female' | 'male' | '';
  headwear: string[];
  professionCategory: string;
  selectedSituations: string[];
  priorities: string[];
  hearingLossDegree?: string;
}

export interface RecommendationResultData {
  primaryModel: HearingAidModel;
  alternativeModel: HearingAidModel;
  recommendedLevel: PerformanceLevel;
  clinicalRationales: BilingualText[];
  suggestedColors: HearingAidColor[];
  lifestyleScore: number;
}
