/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PatientProfile,
  RecommendationResultData,
  HearingAidModel,
  PerformanceLevel,
  HearingAidColor,
  BilingualText
} from '../types/hearingAid.ts';
import {
  HEARING_AID_MODELS,
  PERFORMANCE_LEVELS,
  HEARING_AID_COLORS
} from '../data/hearingAidData.ts';

export function calculateRecommendation(profile: PatientProfile): RecommendationResultData {
  const {
    ageGroup,
    gender,
    headwear = [],
    professionCategory,
    selectedSituations = [],
    priorities = []
  } = profile;

  // 1. Determine Performance Level
  let calculatedLevelNumber: 1 | 3 | 5 | 7 | 9 = 5;
  const situationCount = selectedSituations.length;
  const hasCar = selectedSituations.includes('car-conversations');
  const hasParty = selectedSituations.includes('large-parties');

  if (situationCount >= 7 || hasCar || hasParty) {
    calculatedLevelNumber = 9;
  } else if (situationCount >= 5) {
    calculatedLevelNumber = 7;
  } else if (situationCount >= 3) {
    calculatedLevelNumber = 5;
  } else if (situationCount >= 1) {
    calculatedLevelNumber = 3;
  } else {
    calculatedLevelNumber = 1;
  }

  // Adjust for high-demand profession
  if (
    professionCategory === 'sales-executive' ||
    professionCategory === 'driver-traveler' ||
    professionCategory === 'hospitality-events'
  ) {
    calculatedLevelNumber = 9;
  } else if (professionCategory === 'business-legal' && calculatedLevelNumber < 7) {
    calculatedLevelNumber = 7;
  } else if (ageGroup === 'under-18' && calculatedLevelNumber < 5) {
    // School classroom environment needs at least level 5
    calculatedLevelNumber = 5;
  }

  const recommendedLevel: PerformanceLevel = PERFORMANCE_LEVELS[calculatedLevelNumber];

  // 2. Determine Primary and Alternative Model
  let primaryModelId = 'essenz-sound-er';
  let alternativeModelId = 'essenz-ric';
  const rationales: BilingualText[] = [];

  const wantsInvisibility = priorities.includes('invisibility');
  const wantsRechargeable = priorities.includes('rechargeable');
  const wantsBudget = priorities.includes('budget');
  const wantsDurability = priorities.includes('durability');
  const wearsHijab = headwear.includes('hijab') || headwear.includes('niqab');
  const wearsGlasses = headwear.includes('glasses');
  const wearsHelmet = headwear.includes('helmet');
  const wearsGhutra = headwear.includes('ghutra');
  const isSenior = ageGroup === '75-plus';
  const isChild = ageGroup === 'under-18';

  if (isChild) {
    primaryModelId = 'essenz-bte';
    alternativeModelId = 'essenz-sound-er';
    rationales.push({
      ar: 'للأطفال تحت سن 18 عاماً: يوصى طبياً بسماعة Essenz BTE مع قالب مخصص تحت إشراف أخصائي السمعيات، نظراً لأن قناة الأذن في طور النمو الطبيعي.',
      en: 'For pediatric patients under 18: Essenz BTE with custom mold is recommended under audiology supervision because the ear canal is continually growing.'
    });
    rationales.push({
      ar: 'يُنصح بتجنب السماعات الدقيقة داخل القناة (CIC) للأطفال حتى يكتمل نمو غضاريف الأذن.',
      en: 'In-the-canal (CIC) devices should be avoided for growing children until anatomical development stabilizes.'
    });
  } else if (isSenior) {
    if (wantsRechargeable) {
      primaryModelId = 'essenz-sound-er';
      alternativeModelId = 'essenz-bte';
      rationales.push({
        ar: 'لكبار السن: تقنية الشحن بدون بطاريات صغيرة تمنح راحة فائقة وتلغي الحاجة لتغيير البطاريات الدقيقة بالأصابع.',
        en: 'For seniors: Rechargeable lithium-ion eliminates the frustration of handling tiny button-cell batteries.'
      });
    } else {
      primaryModelId = 'essenz-bte';
      alternativeModelId = 'essenz-sound-er';
      rationales.push({
        ar: 'لسهولة الاستخدام لكبار السن: سماعة Essenz BTE تتميز بصلابة الهيكل وسهولة المسك والتنظيف.',
        en: 'For senior dexterity: Essenz BTE offers easy handling, durable casing, and simple maintenance.'
      });
    }
  } else if (wantsInvisibility) {
    primaryModelId = 'stratos-cic';
    alternativeModelId = 'stratos-ite';
    rationales.push({
      ar: 'نظراً لاختيارك الأولوية التجميلية وعدم لفت الانتباه: سماعة STRATOS CIC تستقر بالكامل داخل قناة الأذن وتكاد تكون شبه غير مرئية.',
      en: 'Cosmetic priority match: STRATOS CIC rests entirely deep within the canal, offering near-invisible discretion.'
    });
    if (wearsGhutra) {
      rationales.push({
        ar: 'مع لبس الغترة أو الشماغ: السماعات الداخلية هي الخيار الأنسب لعدم لفت الانتباه وتجنب احتكاك القماش بأعلى الأذن.',
        en: 'With Ghutra or Shemagh: In-canal models prevent visual protrusion and avoid any contact with traditional headwear.'
      });
    }
  } else if (wearsHijab) {
    primaryModelId = 'stratos-ite';
    alternativeModelId = 'essenz-sound-er';
    rationales.push({
      ar: 'لارتداء الحجاب أو النقاب: سماعة STRATOS ITE لا تحتوي على أي جزء خلف الأذن، فلا تحتك بطبقات الحجاب ولا تسقط عند خلعه، وتقلل من احتمالية الصفير.',
      en: 'Tailored for Hijab/Niqab: STRATOS ITE has zero parts behind the ear, eliminating fabric friction, displacement when removing veils, and whistle.'
    });
  } else if (wearsGlasses || wearsHelmet) {
    primaryModelId = 'stratos-ite';
    alternativeModelId = 'essenz-sound-er';
    rationales.push({
      ar: 'مع ارتداء النظارات طوال اليوم أو خوذة العمل: سماعة ITE المصنوعة حسب مقاس أذنك تترك منطقة خلف الأذن حرة تماماً بدون أي احتكاك مع أذرع النظارة.',
      en: 'Optimized for glasses & helmets: Custom ITE leaves the behind-the-ear region free from temple arm contact or helmet pressure.'
    });
  } else if (wantsRechargeable || selectedSituations.includes('phone-and-tv')) {
    primaryModelId = 'essenz-sound-er';
    alternativeModelId = 'essenz-ric';
    rationales.push({
      ar: 'وفقاً لاهتمامك بسهولة الشحن واستخدام الهاتف: سماعة sound E-R توفر بطارية ليثيوم أيون تدوم حتى 16 ساعة مع تحكم بالنقر المزدوج للرد على المكالمات.',
      en: 'Rechargeable & smartphone alignment: sound E-R gives you 16 hours of battery life and Tap Control to answer calls hands-free.'
    });
  } else if (wantsBudget) {
    primaryModelId = 'essenz-ric';
    alternativeModelId = 'essenz-bte';
    rationales.push({
      ar: 'لأفضل توازن بين الأناقة والسعر المناسب: سماعة Essenz RIC تقدم تصميماً صغيراً وأداءً صوتياً ممتازاً مع بطاريات اقتصادية سهلة الاستبدال.',
      en: 'Value & discretion balance: Essenz RIC delivers open-fit natural sound in a micro body at an economical price point.'
    });
  } else if (wantsDurability || professionCategory === 'field-factory') {
    primaryModelId = 'essenz-bte';
    alternativeModelId = 'essenz-sound-er';
    rationales.push({
      ar: 'للعمل الميداني والأنشطة الخارجية: سماعة Essenz BTE مصممة لتحمل العرق والغبار والاهتزازات مع خاصية خافض صوت الهواء.',
      en: 'Rugged site & outdoor suitability: Essenz BTE is engineered for durability against dust, sweat, and wind noise.'
    });
  } else {
    // Default optimal active recommendation
    primaryModelId = 'essenz-sound-er';
    alternativeModelId = 'essenz-ric';
    rationales.push({
      ar: 'الخيار الأكثر راحة وتطوراً: سماعة هانزاتون إيسنز القابلة للشحن (sound E-R) بمقاومة الماء IP68 وشاحن السفر المغناطيسي.',
      en: 'Modern daily champion: HANSATON Essenz sound E-R rechargeable with IP68 water resistance and magnetic charger.'
    });
  }

  // Add specific rationale for Level 9 if car or high crowd
  if (calculatedLevelNumber === 9) {
    if (hasCar) {
      rationales.push({
        ar: 'مستوى الأداء 9 (الأول): يتضمن ميزة Dynamic SpeechBeam في السيارة الحصرية، لتمكينك من سماع الركاب من جميع الاتجاهات أثناء القيادة بوضوح تام.',
        en: 'Level 9 Flagship: Features exclusive in-car Dynamic SpeechBeam to clarify speech from passengers in any seat while driving.'
      });
    } else {
      rationales.push({
        ar: 'مستوى الأداء 9 (الأول): يوفر 8 بيئات سمعية ذكية و20 قناة ضبط مع تقنية StereoBeam لعزل الكلام في أكثر التجمعات صخباً.',
        en: 'Level 9 Flagship: Delivers 8 automatic listening environments, 20 fine-tuning channels, and binaural StereoBeam for crowded venues.'
      });
    }
  } else if (calculatedLevelNumber === 7) {
    rationales.push({
      ar: 'مستوى الأداء 7 (رجال الأعمال): يدعم 6 بيئات استماع و20 قناة ضبط وميزة SpeechBeam للتركيز على الشخص المقابل في المطاعم والاجتماعات.',
      en: 'Level 7 Business: Features 6 environments, 20 channels, and SpeechBeam to focus on the person facing you in meetings and restaurants.'
    });
  } else if (calculatedLevelNumber === 5) {
    rationales.push({
      ar: 'مستوى الأداء 5 (العملي): يمنحك 4 بيئات استماع ذكية و16 قناة ضبط مع وضوح مريح في بيئات المكاتب والمحادثات العادية.',
      en: 'Level 5 Practical: Delivers 4 automatic environments and 16 channels, ideal for office spaces and everyday social interactions.'
    });
  }

  const primaryModel = HEARING_AID_MODELS.find(m => m.id === primaryModelId) || HEARING_AID_MODELS[0];
  const alternativeModel = HEARING_AID_MODELS.find(m => m.id === alternativeModelId) || HEARING_AID_MODELS[1];

  // Suggest colors based on family
  const suggestedColors: HearingAidColor[] = HEARING_AID_COLORS.filter(c =>
    primaryModel.family === 'Essenz' ? c.family === 'Essenz' : c.family === 'STRATOS'
  );

  return {
    primaryModel,
    alternativeModel,
    recommendedLevel,
    clinicalRationales: rationales,
    suggestedColors,
    lifestyleScore: situationCount
  };
}
