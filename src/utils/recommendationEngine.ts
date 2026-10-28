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
  STRATOS_PERFORMANCE_LEVELS,
  HEARING_AID_COLORS
} from '../data/hearingAidData.ts';

/**
 * Calculates the recommended performance level based on situations, profession, and age.
 */
export function calculateEstimatedLevel(
  situationCount: number,
  hasCarOrParty: boolean,
  professionCategory?: string,
  ageGroup?: string,
  isStratos?: boolean
): 1 | 3 | 5 | 7 | 9 {
  // 1. Base level from count: 0-1 -> 1, 2 -> 3, 3-4 -> 5, 5-6 -> 7, 7+ -> 9
  let level: 1 | 3 | 5 | 7 | 9 = 1;
  if (situationCount <= 1) {
    level = 1;
  } else if (situationCount === 2) {
    level = 3;
  } else if (situationCount <= 4) {
    level = 5;
  } else if (situationCount <= 6) {
    level = 7;
  } else {
    level = 9;
  }

  // 2. car-conversations or large-parties -> 9
  if (hasCarOrParty) {
    level = 9;
  }

  // 3. Profession minimum (sets a minimum only, never forces 9)
  let profMin: 1 | 3 | 5 | 7 | 9 = 1;
  if (
    professionCategory === 'sales-executive' ||
    professionCategory === 'driver-traveler' ||
    professionCategory === 'hospitality-events' ||
    professionCategory === 'education-teachers' ||
    professionCategory === 'business-legal'
  ) {
    profMin = 7;
  } else if (
    professionCategory === 'healthcare-clinics' ||
    professionCategory === 'office-civil' ||
    professionCategory === 'field-factory'
  ) {
    profMin = 5;
  } else if (professionCategory === 'desk-remote') {
    profMin = 3;
  }
  if (profMin > level) {
    level = profMin;
  }

  // 4. ageGroup under-18 -> minimum 5
  if (ageGroup === 'under-18' && level < 5) {
    level = 5;
  }

  // 5. If STRATOS and level is 1 -> use 3
  if (isStratos && level === 1) {
    level = 3;
  }

  return level;
}

export function calculateRecommendation(profile: PatientProfile): RecommendationResultData {
  const {
    ageGroup,
    gender,
    headwear = [],
    professionCategory,
    selectedSituations = [],
    priorities = []
  } = profile;

  const situationCount = selectedSituations.length;
  const hasCar = selectedSituations.includes('car-conversations');
  const hasParty = selectedSituations.includes('large-parties');
  const hasCarOrParty = hasCar || hasParty;

  // 1. Model selection order (Check in order; the first match wins. "75plus" means ageGroup "75-plus")
  let primaryModelId = 'essenz-sound-er';
  let alternativeModelId = 'essenz-ric';
  const rationales: BilingualText[] = [];

  const is75Plus = ageGroup === '75-plus';
  const isUnder18 = ageGroup === 'under-18';
  const hasInvisibility = priorities.includes('invisibility');
  const hasHijab = headwear.includes('hijab') || headwear.includes('niqab');
  const hasNoBehindEar = priorities.includes('no-behind-ear');
  const hasGlasses = headwear.includes('glasses');
  const hasHelmet = headwear.includes('helmet');
  const hasGhutra = headwear.includes('ghutra');
  const hasRechargeable = priorities.includes('rechargeable');
  const hasPhoneConnectivity = priorities.includes('phone-connectivity');
  const hasPhoneAndTv = selectedSituations.includes('phone-and-tv');
  const hasBudget = priorities.includes('budget');
  const hasDurability = priorities.includes('durability');
  const isFieldFactory = professionCategory === 'field-factory';

  // Rule 1: ageGroup "under-18" -> primary essenz-bte, alternative essenz-sound-er
  if (isUnder18) {
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
  }
  // Rule 2: Priority "invisibility" -> if 75plus: primary stratos-ite. Otherwise: primary stratos-cic, alternative stratos-ite.
  else if (hasInvisibility) {
    if (is75Plus) {
      primaryModelId = 'stratos-ite';
      alternativeModelId = 'stratos-cic';
      rationales.push({
        ar: 'سماعة CIC صغيرة جداً وتحتاج أصابع مرنة، لذلك نقترح ITE لسهولة المسك',
        en: 'CIC is very small and needs fine finger dexterity, so ITE is suggested for easier handling'
      });
    } else {
      primaryModelId = 'stratos-cic';
      alternativeModelId = 'stratos-ite';
      rationales.push({
        ar: 'نظراً لاختيارك الأولوية التجميلية وعدم لفت الانتباه: سماعة STRATOS CIC تستقر بالكامل داخل قناة الأذن وتكاد تكون شبه غير مرئية.',
        en: 'Cosmetic priority match: STRATOS CIC rests entirely deep within the canal, offering near-invisible discretion.'
      });
    }
  }
  // Rule 3: Headwear "hijab", or priority "no-behind-ear", or headwear "glasses", or headwear "helmet" -> primary stratos-ite, alternative essenz-sound-er. (Applies to every age, including 75plus)
  else if (hasHijab || hasNoBehindEar || hasGlasses || hasHelmet) {
    primaryModelId = 'stratos-ite';
    alternativeModelId = 'essenz-sound-er';
    if (hasHijab) {
      rationales.push({
        ar: 'لارتداء الحجاب أو النقاب: سماعة STRATOS ITE لا تحتوي على أي جزء خلف الأذن، فلا تحتك بطبقات الحجاب ولا تسقط عند خلعه، وتقلل من احتمالية الصفير.',
        en: 'Tailored for Hijab/Niqab: STRATOS ITE has zero parts behind the ear, eliminating fabric friction, displacement when removing veils, and whistle.'
      });
    } else if (hasNoBehindEar) {
      rationales.push({
        ar: 'اخترت ألا يكون هناك أي جزء خلف الأذن: سماعة STRATOS ITE قطعة واحدة داخل صيوان الأذن',
        en: 'You chose nothing behind the ear: STRATOS ITE is a single custom piece inside the ear'
      });
    } else {
      rationales.push({
        ar: 'مع ارتداء النظارات طوال اليوم أو خوذة العمل: سماعة ITE المصنوعة حسب مقاس أذنك تترك منطقة خلف الأذن حرة تماماً بدون أي احتكاك مع أذرع النظارة.',
        en: 'Optimized for glasses & helmets: Custom ITE leaves the behind-the-ear region free from temple arm contact or helmet pressure.'
      });
    }
  }
  // Rule 4: 75plus -> if priority "rechargeable": primary essenz-sound-er, alternative essenz-bte. Otherwise: primary essenz-bte, alternative essenz-sound-er.
  else if (is75Plus) {
    if (hasRechargeable) {
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
  }
  // Rule 5: Priority "rechargeable", or priority "phone-connectivity", or situation "phone-and-tv" -> primary essenz-sound-er, alternative essenz-ric.
  else if (hasRechargeable || hasPhoneConnectivity || hasPhoneAndTv) {
    primaryModelId = 'essenz-sound-er';
    alternativeModelId = 'essenz-ric';
    rationales.push({
      ar: 'وفقاً لاهتمامك بسهولة الشحن واستخدام الهاتف: سماعة sound E-R توفر بطارية ليثيوم أيون تدوم حتى 16 ساعة مع تحكم بالنقر المزدوج للرد على المكالمات.',
      en: 'Rechargeable & smartphone alignment: sound E-R gives you 16 hours of battery life and Tap Control to answer calls hands-free.'
    });
  }
  // Rule 6: Priority "budget" -> primary essenz-ric, alternative essenz-bte.
  else if (hasBudget) {
    primaryModelId = 'essenz-ric';
    alternativeModelId = 'essenz-bte';
    rationales.push({
      ar: 'لأفضل توازن بين الأناقة والسعر المناسب: سماعة Essenz RIC تقدم تصميماً صغيراً وأداءً صوتياً ممتازاً مع بطاريات اقتصادية سهلة الاستبدال.',
      en: 'Value & discretion balance: Essenz RIC delivers open-fit natural sound in a micro body at an economical price point.'
    });
  }
  // Rule 7: Priority "durability", or profession "field-factory" -> primary essenz-bte, alternative essenz-sound-er.
  else if (hasDurability || isFieldFactory) {
    primaryModelId = 'essenz-bte';
    alternativeModelId = 'essenz-sound-er';
    rationales.push({
      ar: 'للعمل الميداني والأنشطة الخارجية: سماعة Essenz BTE مصممة لتحمل العرق والغبار والاهتزازات مع خاصية خافض صوت الهواء.',
      en: 'Rugged site & outdoor suitability: Essenz BTE is engineered for durability against dust, sweat, and wind noise.'
    });
  }
  // Rule 8: Default -> primary essenz-sound-er, alternative essenz-ric.
  else {
    primaryModelId = 'essenz-sound-er';
    alternativeModelId = 'essenz-ric';
    rationales.push({
      ar: 'الخيار الأكثر راحة وتطوراً: سماعة هانزاتون إيسنز القابلة للشحن (sound E-R) بمقاومة الماء IP68 وشاحن السفر المغناطيسي.',
      en: 'Modern daily champion: HANSATON Essenz sound E-R rechargeable with IP68 water resistance and magnetic charger.'
    });
  }

  const primaryModel = HEARING_AID_MODELS.find(m => m.id === primaryModelId) || HEARING_AID_MODELS[0];
  const alternativeModel = HEARING_AID_MODELS.find(m => m.id === alternativeModelId) || HEARING_AID_MODELS[1];
  const isStratos = primaryModel.family === 'STRATOS';

  // Ghutra rationale: whenever headwear "ghutra" is selected, ALWAYS add a rationale.
  if (hasGhutra) {
    if (isStratos) {
      rationales.push({
        ar: 'مع لبس الغترة أو الشماغ: السماعات الداخلية لا تلفت الانتباه ولا تحتك بالقماش',
        en: 'With Ghutra or Shemagh: in-ear models stay discreet and avoid fabric contact'
      });
    } else {
      rationales.push({
        ar: 'مع لبس الغترة أو الشماغ: يمكنك أيضاً مناقشة السماعات الداخلية STRATOS مع الأخصائي',
        en: 'With Ghutra or Shemagh: you may also discuss STRATOS in-ear models with your audiologist'
      });
    }
  }

  // If the primary model is stratos-cic, also add CIC confirmation note:
  if (primaryModelId === 'stratos-cic') {
    rationales.push({
      ar: 'يتأكد الأخصائي من ملاءمة CIC بعد فحص السمع وأخذ مقاس الأذن',
      en: 'The audiologist confirms CIC suitability after the hearing test and ear impression'
    });
  }

  // 2. Level calculation (rules 1-5)
  const calculatedLevelNumber = calculateEstimatedLevel(
    situationCount,
    hasCarOrParty,
    professionCategory,
    ageGroup,
    isStratos
  );

  // 3. Select performance level object from STRATOS or Essenz table
  let recommendedLevel: PerformanceLevel;
  if (isStratos) {
    recommendedLevel = STRATOS_PERFORMANCE_LEVELS[calculatedLevelNumber] || STRATOS_PERFORMANCE_LEVELS[3];
    // Level rationales for STRATOS
    if (calculatedLevelNumber === 9) {
      rationales.push({
        ar: 'مستوى الأداء 9 (الفئة الأولى): 7 بيئات سمعية ذكية مع شعاع الكلام الديناميكي والتخفيف الذكي للضوضاء وتحديد الإشارات الصوتية.',
        en: 'Level 9 First Class: 7 intelligent listening environments with Dynamic SpeechBeam, Intelligent NoiseReduction, and spatial acoustic cues.'
      });
    } else if (calculatedLevelNumber === 7) {
      rationales.push({
        ar: 'مستوى الأداء 7 (فئة رجال الأعمال): 6 بيئات استماع ذكية مع التخفيف الذكي للضوضاء وتحديد الإشارات الصوتية والاتصال اللاسلكي.',
        en: 'Level 7 Business Class: 6 listening environments with Intelligent NoiseReduction, spatial cues, and wireless connectivity.'
      });
    } else if (calculatedLevelNumber === 5) {
      rationales.push({
        ar: 'مستوى الأداء 5 (الفئة العملية): 4 بيئات استماع ذكية مع تحديد الإشارات الصوتية والاتصال اللاسلكي.',
        en: 'Level 5 Practical Class: 4 listening environments with spatial acoustic cues and wireless connectivity.'
      });
    } else {
      rationales.push({
        ar: 'مستوى الأداء 3 (الفئة الاقتصادية): بيئتان استماع ذكيتان للمحادثات الهادئة والجماعية مع الاتصال اللاسلكي.',
        en: 'Level 3 Economy Class: 2 listening environments for quiet and crowd conversations with wireless connectivity.'
      });
    }
  } else {
    recommendedLevel = PERFORMANCE_LEVELS[calculatedLevelNumber] || PERFORMANCE_LEVELS[5];
    // Level rationales for Essenz
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
    } else if (calculatedLevelNumber === 3) {
      rationales.push({
        ar: 'مستوى الأداء 3 (الاقتصادي): بيئتان سمعيتان تلقائيتان و12 قناة ضبط مع ميزة BiPhone لسماع المكالمات في الأذنين',
        en: 'Level 3 Essential: 2 automatic environments, 12 channels and BiPhone for calls in both ears'
      });
    } else {
      rationales.push({
        ar: 'مستوى الأداء 1 (الأساسي): ميكروفون تلقائي لبيئة استماع واحدة مع تخفيف الضوضاء وخافض صوت الهواء، مناسب للمحادثات الهادئة في المنزل',
        en: 'Level 1 Basic: automatic microphone for one listening environment with noise reduction and wind noise reduction, suited to quiet conversations at home'
      });
    }
  }

  // Suggest colors based on family
  const suggestedColors: HearingAidColor[] = HEARING_AID_COLORS.filter(c =>
    isStratos ? c.family === 'STRATOS' : c.family === 'Essenz'
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
