/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  HearingAidModel,
  PerformanceLevel,
  HearingAidColor,
  LifestyleSituation,
  BilingualText
} from '../types/hearingAid.ts';

export const HEARING_AID_MODELS: HearingAidModel[] = [
  {
    id: 'essenz-sound-er',
    code: 'sound E-R',
    name: {
      ar: 'هانزاتون إيسنز القابلة للشحن (sound E-R)',
      en: 'HANSATON Essenz sound E-R (Rechargeable)'
    },
    subtitle: {
      ar: 'حرية كاملة بدون بطاريات صغيرة وتقنية شحن ليثيوم أيون تدوم طوال اليوم',
      en: 'Lithium-ion rechargeable freedom with all-day battery life and seamless streaming'
    },
    family: 'Essenz',
    placement: {
      ar: 'خلف الأذن (طراز RIC أو BTE)',
      en: 'Behind-The-Ear (available in RIC and BTE)'
    },
    powerSource: {
      ar: 'بطارية ليثيوم أيون تدوم حتى 16 ساعة بشحنة واحدة',
      en: 'Lithium-ion rechargeable battery (up to 16h per single charge)'
    },
    isRechargeable: true,
    batteryLife: '16h (8h listening + 4h BT + 4h TV)',
    idealForDegree: {
      ar: 'ضعف السمع من البسيط إلى الشديد',
      en: 'Mild to severe hearing loss'
    },
    keyFeatures: [
      {
        ar: '16 ساعة استخدام (8 ساعات استماع + 4 ساعات بلوتوث + 4 ساعات بث تلفزيوني)',
        en: '16h total use (8h everyday hearing + 4h Bluetooth streaming + 4h TV audio)'
      },
      {
        ar: 'مقاومة الماء والغبار بمعيار IP68 العالمي',
        en: 'IP68 water and dust ingress protection'
      },
      {
        ar: 'التحكم بالنقر (Tap Control): الرد على المكالمات بنقرة مزدوجة على الأذن',
        en: 'Tap Control: Answer and end calls with a gentle double tap on the ear'
      },
      {
        ar: 'شاحن Easy Line مغناطيسي وعلبة ChargerGo للتنقل والسفر',
        en: 'Easy Line magnetic insertion charger and portable ChargerGo travel case'
      },
      {
        ar: 'تشغيل تلقائي فوري عند إخراجها من الشاحن وتوقف تلقائي عند إعادتها',
        en: 'Auto-activates when lifted from charger; automatically sleeps & charges when docked'
      }
    ],
    strengths: [
      { ar: 'لا حاجة لتغيير البطاريات الصغيرة نهائياً', en: 'No more fiddling with tiny button cell batteries' },
      { ar: 'مثالية للاستخدام المكثف للهاتف والمكالمات عبر البلوتوث', en: 'Ideal for power phone users and constant wireless streaming' },
      { ar: 'حماية ممتازة من العرق والرطوبة (IP68)', en: 'Outstanding protection from moisture, sweat, and dust' }
    ],
    suitableFor: [
      { ar: 'من يستخدم الهاتف وبث الصوت باستمرار', en: 'Frequent phone callers and media streamers' },
      { ar: 'من يجد صعوبة في تغيير البطاريات الدقيقة', en: 'Individuals with limited manual dexterity or tremors' },
      { ar: 'كثيرو السفر والتنقل اليومي', en: 'Active travelers and commuters' }
    ],
    waterRating: 'IP68',
    availableColors: ['sterling-silver', 'carbon-black', 'mocha-brown', 'cashmere-beige', 'metallic-anthracite'],
    imagePlaceholderCategory: 'ric',
    imageSrc: '/assets/aistudio/RIC_RECHARGABLE_4e248b6e.png',
    chargerImageSrc: '/assets/aistudio/hansaton-zubehor-zubehor-hansaton-egg-charger-29763703603361_1024x_d41ac2dd.webp',
    imageAlt: {
      ar: 'سماعة هانزاتون إيسنز sound E-R القابلة للشحن بتقنية ليثيوم أيون مع شاحن Easy Line البيضاوي',
      en: 'HANSATON Essenz sound E-R Rechargeable RIC hearing aid with HANSATON Egg Charger'
    },
    badgeLabel: {
      ar: 'سماعة قابلة للشحن (sound E-R)',
      en: 'Rechargeable Model (sound E-R)'
    }
  },
  {
    id: 'essenz-ric',
    code: 'RIC',
    name: {
      ar: 'سماعة هانزاتون إيسنز (Essenz RIC)',
      en: 'HANSATON Essenz RIC (Receiver-in-Canal)'
    },
    subtitle: {
      ar: 'أناقة غير ملحوظة وصوت طبيعي فائق الراحة طوال ساعات اليوم',
      en: 'Discreet ergonomics, open-fit natural sound, and all-day comfort'
    },
    family: 'Essenz',
    placement: {
      ar: 'جسم صغير خلف الأذن وسلك رفيع يصل للمستقبل داخل القناة',
      en: 'Ultra-small housing behind the ear with micro-wire to in-canal receiver'
    },
    powerSource: {
      ar: 'بطاريات زنك هوائية تقليدية (Zinc-Air)',
      en: 'Standard disposable zinc-air batteries'
    },
    isRechargeable: false,
    batteryLife: 'Standard Zinc-Air 312 (~5-7 days)',
    idealForDegree: {
      ar: 'ضعف السمع من البسيط إلى الشديد',
      en: 'Mild to severe hearing loss'
    },
    keyFeatures: [
      { ar: 'تصميم فائق الخفة والصغر لا يكاد يُرى خلف الأذن', en: 'Ultra-lightweight micro chassis barely visible behind ear' },
      { ar: 'صوت طبيعي مفتوح يقلل من شعور انسداد الأذن', en: 'Open-fit acoustic acoustics minimizing occlusion and echo' },
      { ar: 'اتصال بلوتوث متطور مع الهواتف الذكية عبر شريحة ERA', en: 'Advanced direct Bluetooth smartphone connectivity powered by ERA chip' },
      { ar: 'مكالمات دون استخدام اليدين وميزة BiPhone في كلتا السماعتين', en: 'Hands-free calls with BiPhone audio streamed to both ears' }
    ],
    strengths: [
      { ar: 'صغيرة جداً ومريحة طوال اليوم', en: 'Extremely lightweight and comfortable all day' },
      { ar: 'سعر اقتصادي ممتاز مقارنة بالموديلات القابلة للشحن', en: 'Budget-friendly alternative to rechargeable variants' },
      { ar: 'صوت طبيعي وتهوية طبيعية لقناة الأذن', en: 'Natural voice quality with natural ear aeration' }
    ],
    suitableFor: [
      { ar: 'البالغون النشطون والمعلمون والمهنيون', en: 'Active adults, educators, and working professionals' },
      { ar: 'من يبحث عن حل صغير بسعر مناسب', en: 'Cost-conscious patients seeking discreet appearance' },
      { ar: 'الأطباء والصيادلة (مع مناقشة استخدام السماعة الطبية)', en: 'Doctors & healthcare staff (stethoscope usage coordinated with specialist)' }
    ],
    waterRating: 'Water resistant coating',
    availableColors: ['sterling-silver', 'carbon-black', 'mocha-brown', 'cashmere-beige', 'metallic-anthracite'],
    imagePlaceholderCategory: 'ric',
    imageSrc: '/assets/aistudio/HT_Packshot_sound-FS-R-312_CBeige_c8e1958f.png',
    imageAlt: {
      ar: 'سماعة هانزاتون إيسنز RIC الصغيرة ببطارية زنك هوائية 312',
      en: 'HANSATON Essenz RIC Hearing Aid with 312 Battery'
    },
    badgeLabel: {
      ar: 'سماعة RIC صغيرة بمستقبل داخل القناة',
      en: 'Discreet Micro RIC Model'
    }
  },
  {
    id: 'essenz-bte',
    code: 'BTE',
    name: {
      ar: 'سماعة هانزاتون إيسنز (Essenz BTE)',
      en: 'HANSATON Essenz BTE (Behind-The-Ear)'
    },
    subtitle: {
      ar: 'قوة وتحمل عالي مع سهولة فائقة في المسك والتنظيف لكافة الأعمار',
      en: 'Robust, easy-to-handle power instrument with simple maintenance'
    },
    family: 'Essenz',
    placement: {
      ar: 'جسم السماعة خلف الأذن وأنبوب ينقل الصوت لقالب داخل الأذن',
      en: 'Chassis sits behind the ear with an acoustic elbow tube to an ear mold'
    },
    powerSource: {
      ar: 'بطاريات زنك هوائية متينة تدوم لفترات أطول',
      en: 'High-capacity standard disposable zinc-air batteries'
    },
    isRechargeable: false,
    batteryLife: 'Standard Zinc-Air 13 (~10-14 days)',
    idealForDegree: {
      ar: 'ضعف السمع من البسيط حتى الشديد والعميق',
      en: 'Mild to severe and profound hearing loss'
    },
    keyFeatures: [
      { ar: 'هيكل متين مقاوم للصدمات والاستخدام الشاق', en: 'Ruggedized high-durability housing resistant to impacts' },
      { ar: 'أزرار تحكم بارزة وسهلة اللمس والتعديل', en: 'Tactile, easy-to-feel rocker controls for volume and programs' },
      { ar: 'خاصية خافض صوت الهواء المتقدمة للأماكن المفتوحة', en: 'Integrated wind noise reduction for outdoor reliability' },
      { ar: 'قوالب أذن مخصصة محكمة تمنع الصفير وعود الصوت', en: 'Custom ear mold options preventing acoustic whistle and feedback' }
    ],
    strengths: [
      { ar: 'قوية ومتينة وتتحمل العرق والظروف البيئية', en: 'Sturdy build enduring sweat, dirt, and heavy outdoor use' },
      { ar: 'سهلة الإمساك والتنظيف للأيدي المرتجفة أو كبار السن', en: 'Effortless to hold and clean for seniors and caregivers' },
      { ar: 'آمنة للأطفال مع قوالب أذن قابلة للتجديد مع نمو الأذن', en: 'Safe for children with pediatric ear molds updated as ears grow' }
    ],
    suitableFor: [
      { ar: 'كبار السن الذين يحتاجون مساعدة الأهل أو سهولة التشغيل', en: 'Elderly patients needing simple tactile operation' },
      { ar: 'الأطفال تحت سن 18 عاماً تحت إشراف أخصائي سمعيات', en: 'Children under 18 under pediatric audiology supervision' },
      { ar: 'عمال المواقع والمصانع والمهن الميدانية', en: 'Industrial, site, and field workers in tough environments' }
    ],
    availableColors: ['sterling-silver', 'carbon-black', 'mocha-brown', 'cashmere-beige', 'metallic-anthracite'],
    imagePlaceholderCategory: 'bte',
    imageSrc: '/assets/aistudio/BTE_BATTERY_2abf3c05.webp',
    secondaryImageSrc: '/assets/aistudio/HT_Packshot_AQ-beat-FS-R_CBeige_135de757.png',
    imageAlt: {
      ar: 'سماعة هانزاتون إيسنز BTE التقليدية خلف الأذن المزودة بحجرة بطارية متينة وقالب',
      en: 'HANSATON Essenz BTE Behind-The-Ear Hearing Aid with Sturdy Battery Chassis'
    },
    badgeLabel: {
      ar: 'سماعة BTE متينة وموثوقة خلف الأذن',
      en: 'Heavy-Duty BTE Behind-The-Ear'
    }
  },
  {
    id: 'stratos-ite',
    code: 'ITE',
    name: {
      ar: 'سماعة هانزاتون ستراتوس (STRATOS ITE)',
      en: 'HANSATON STRATOS ITE (In-The-Ear)'
    },
    subtitle: {
      ar: 'سماعة مخصصة بالكامل لمقاس أذنك بدون أي جزء خلف الأذن',
      en: 'Custom-molded one-piece instrument with zero components behind the ear'
    },
    family: 'STRATOS',
    placement: {
      ar: 'تمأل صيوان الأذن وتُصنع بدقة متناهية حسب قالب أذنك',
      en: 'Fills the ear concha, custom fabricated to patient 3D ear impression'
    },
    powerSource: {
      ar: 'بطارية زنك هوائية مدمجة',
      en: 'Integrated disposable zinc-air battery'
    },
    isRechargeable: false,
    batteryLife: 'Standard Zinc-Air 312 (~6-8 days)',
    idealForDegree: {
      ar: 'ضعف السمع من البسيط إلى الشديد',
      en: 'Mild to severe hearing loss'
    },
    keyFeatures: [
      { ar: 'قطعة واحدة داخل الأذن بدون أي مكون خلف الأذن نهائياً', en: 'Zero behind-the-ear elements—single integrated unit' },
      { ar: 'لا تحتك بالحجاب أو النقاب ولا تسقط عند خلعه', en: 'No friction with hijab/niqab and zero risk of displacement when removing veil' },
      { ar: 'مثالية مع النظارات الطبية والخوذ وسماعات الرأس', en: 'Completely unhindered by eyeglasses, work helmets, or overhead gear' },
      { ar: 'أسهل في الإمساك والإدخال مقارنة بسماعات CIC المتناهية الصغر', en: 'Easier to insert and grip compared to ultra-tiny CIC aids' }
    ],
    strengths: [
      { ar: 'استقرار تام وثبات رائع مع أغطية الرأس والنظارات', en: 'Total stability under headscarves, turbans, ghutra, or eyewear' },
      { ar: 'تمنع تماماً صفير الاحتكاك بأقمشة الحجاب', en: 'Eliminates friction whistling from hijab fabrics' },
      { ar: 'تحكم سهل وحجم مناسب للإمساك بالأصابع', en: 'Comfortable balance between custom fit and handling size' }
    ],
    suitableFor: [
      { ar: 'السيدات المرتديات للحجاب أو النقاب', en: 'Women wearing hijab or niqab seeking whistle-free comfort' },
      { ar: 'من يرتدون النظارات الطبية طوال اليوم أو خوذ العمل', en: 'Patients wearing prescription glasses all day or construction/flight helmets' },
      { ar: 'العسكريون وموظفو الطيران والمطارات والمهندسون', en: 'Aviation, military, site engineers, and field specialists' }
    ],
    availableColors: ['skin-beige', 'skin-brown'],
    imagePlaceholderCategory: 'ite',
    imageSrc: '/assets/aistudio/HT_Packshot_jazz-ST-312_ITE-FrontLeftPink_SMALL_0ee1689a.png',
    imageAlt: {
      ar: 'سماعة هانزاتون ستراتوس ITE المصنوعة طبق مقاس صوان الأذن بلون البشرة الطبيعي',
      en: 'HANSATON STRATOS ITE Custom In-The-Ear Hearing Aid in Natural Flesh Tone'
    },
    badgeLabel: {
      ar: 'سماعة STRATOS ITE داخل صيوان الأذن (خالية من الاحتكاك)',
      en: 'STRATOS ITE Custom In-The-Ear (Zero Friction)'
    }
  },
  {
    id: 'stratos-cic',
    code: 'CIC',
    name: {
      ar: 'سماعة هانزاتون ستراتوس (STRATOS CIC)',
      en: 'HANSATON STRATOS CIC (Completely-In-Canal)'
    },
    subtitle: {
      ar: 'أقصى درجات الخفاء والسرية داخل قناة الأذن بالكامل',
      en: 'Maximum cosmetic invisibility nestled deep inside the ear canal'
    },
    family: 'STRATOS',
    placement: {
      ar: 'تستقر داخل قناة الأذن بالكامل مع خيط شفاف صغير للسحب',
      en: 'Deep in the ear canal with a tiny transparent extraction cord'
    },
    powerSource: {
      ar: 'بطارية صغيرة جداً مقاس 10',
      en: 'Miniature Size 10 zinc-air battery'
    },
    isRechargeable: false,
    batteryLife: 'Size 10 Zinc-Air (~3-5 days)',
    idealForDegree: {
      ar: 'ضعف السمع من البسيط إلى المتوسط',
      en: 'Mild to moderate hearing loss'
    },
    keyFeatures: [
      { ar: 'شبه غير مرئية حتى عند النظر مباشرة إلى الأذن', en: 'Virtually undetectable to others, even from close angles' },
      { ar: 'استفادة طبيعية من صوان الأذن لتحديد اتجاه الصوت', en: 'Leverages the natural pinna acoustic funneling for directional cues' },
      { ar: 'لا تتداخل إطلاقاً مع النظارات أو الهواتف أو أغطية الرأس', en: 'Completely exempt from interference with glasses, phones, and headwear' }
    ],
    strengths: [
      { ar: 'أعلى مستوى من الأناقة وعدم لفت الانتباه', en: 'Supreme cosmetic discretion and confidence' },
      { ar: 'تلقي طبيعي للصوت عبر صوان الأذن الحقيقي', en: 'Natural organic localization of sounds' }
    ],
    suitableFor: [
      { ar: 'مقدمو البرامج، المسؤولون التنفيذيون، المحامون', en: 'Broadcasters, executives, attorneys, and public figures' },
      { ar: 'من يهتم بأن تكون السماعة غير ملحوظة على الإطلاق', en: 'Anyone demanding complete cosmetic invisibility' },
      { ar: 'مرتدو الغترة أو الشماغ لتجنب أي لفت للانتباه', en: 'Men wearing Ghutra or Shemagh seeking zero visual imprint' }
    ],
    contraindications: [
      {
        ar: 'تحتاج قناة أذن بحجم مناسب وأصابع تتحرك بسهولة؛ لا تناسب الأطفال لأن الأذن ما زالت تنمو',
        en: 'Requires adequate canal anatomy and good finger dexterity; not suitable for children with growing ears'
      }
    ],
    availableColors: ['skin-beige', 'skin-brown'],
    imagePlaceholderCategory: 'cic',
    imageSrc: '/assets/aistudio/images__3__d7cfb434.jpeg',
    imageAlt: {
      ar: 'سماعة هانزاتون ستراتوس CIC المتناهية الصغر داخل قناة الأذن مع خيط سحب شفاف',
      en: 'HANSATON STRATOS CIC Miniature Completely-In-Canal Aid with Extraction Cord'
    },
    badgeLabel: {
      ar: 'سماعة STRATOS CIC متناهية الصغر وغير مرئية بالكامل',
      en: 'STRATOS CIC Completely-In-Canal Invisible Micro Aid'
    }
  }
];

export const PERFORMANCE_LEVELS: Record<number, PerformanceLevel> = {
  9: {
    level: 9,
    title: {
      ar: 'المستوى 9 — الأول (Flagship / Premium)',
      en: 'Level 9 — First / Flagship'
    },
    environmentsCount: 8,
    channels: 20,
    description: {
      ar: 'القمة التكنولوجية للمواقف السمعية المعقدة والضوضاء الشديدة والمحادثات داخل السيارة',
      en: 'The pinnacle of acoustic intelligence for extreme noise, crowd speech, and in-car dynamics'
    },
    bestForPersona: {
      ar: 'للشخص الاجتماعي جداً الذي يقضي وقته في مواقف كثيرة مع ضوضاء شديدة وسفر مستمر',
      en: 'For highly active social individuals who navigate crowded, noisy settings, car travel, and sports'
    },
    environmentsList: [
      { ar: 'المحادثة داخل السيارة (ميزة حصرية للمستوى 9)', en: 'Conversation in Car (Exclusive to Level 9)' },
      { ar: 'المحادثة وسط حشد كبير من الناس', en: 'Conversation in a large crowd' },
      { ar: 'المحادثة في بيئة صاخبة جداً', en: 'Conversation in heavy noise' },
      { ar: 'المحادثة وسط مجموعة صغيرة', en: 'Conversation in a small group' },
      { ar: 'بيئة الاستماع للموسيقى النقية', en: 'Rich live & recorded music appreciation' },
      { ar: 'المحادثة في الضجيج المعتدل', en: 'Conversation in moderate noise' },
      { ar: 'المحادثة في الهدوء التام', en: 'Conversation in quiet environments' },
      { ar: 'الهدوء الصامت والراحة السمعية', en: 'Quiet background relaxation' }
    ],
    highlightFeatures: [
      {
        name: 'Dynamic SpeechBeam in Car',
        description: {
          ar: 'توضح المحادثات داخل السيارة من كل الاتجاهات حولك تلقائياً (حصرية للمستوى 9)',
          en: 'Clarifies speech from passengers in all directions while driving (exclusive to Level 9)'
        },
        isExclusiveToNine: true
      },
      {
        name: 'Dynamic SpeechBeam',
        description: {
          ar: 'تلتقط الكلام بدقة من أي اتجاه في الأماكن المزدخمة والصاخبة',
          en: 'Actively tracks and captures speech from any direction in complex crowds'
        }
      },
      {
        name: 'StereoBeam',
        description: {
          ar: 'تنسيق لاسلكي فائق بين ميكروفونات السماعتين لتوضيح الكلام في أشد الأماكن صخباً',
          en: 'Binaural beamforming synchronizing both aids to isolate speech in loud noise'
        }
      },
      {
        name: 'SphereSound Natural',
        description: {
          ar: 'تحافظ على الإحساس الطبيعي ثلاثي الأبعاد باتجاه الصوت في كل البيئات',
          en: 'Preserves the organic 360-degree spatial localization of sounds across all settings'
        }
      },
      {
        name: 'ConversationOptimizer',
        description: {
          ar: 'تحسين ومعالجة إضافية متطورة لوضوح مخارج الحروف في المحادثات المعقدة',
          en: 'Advanced acoustic enhancement for ultra-sharp speech clarity in multifaceted interactions'
        }
      },
      {
        name: 'Intelligent NoiseReduction',
        description: {
          ar: 'تخفيف ذكي وفوري للضوضاء حسب البيئة المحيطة بك بدقة 20 قناة ضبط',
          en: 'Context-aware noise reduction operating continuously across 20 tuning channels'
        }
      }
    ],
    professionExamples: [
      { ar: 'مندوبو المبيعات والدعاية الطبية', en: 'Pharmaceutical and medical sales representatives' },
      { ar: 'المديرون التنفيذيون ورؤساء مجالس الإدارة', en: 'C-suite executives and corporate directors' },
      { ar: 'المعلمون والأساتذة في فصول ومدرجات مزدحمة', en: 'Educators in busy auditoriums and crowded classrooms' },
      { ar: 'مديرو المطاعم والفنادق ومنظمو الفعاليات', en: 'Hospitality managers and event directors' },
      { ar: 'السائقون وكثيرو السفر والتنقل اليومي', en: 'Professional drivers and frequent long-distance travelers' }
    ]
  },
  7: {
    level: 7,
    title: {
      ar: 'المستوى 7 — رجال الأعمال (Business / Advanced)',
      en: 'Level 7 — Business / Advanced'
    },
    environmentsCount: 6,
    channels: 20,
    description: {
      ar: 'أداء متقدم للأوساط المهنية والاجتماعية النشطة، غداء العمل والموسيقى واجتماعات المجموعات',
      en: 'Superior clarity for dynamic business meetings, dining out, live music, and social groups'
    },
    bestForPersona: {
      ar: 'للشخص الاجتماعي الذي يقدّر الجودة والوضوح مع ضوضاء معتادة واجتماعات متكررة',
      en: 'For socially active professionals who value acoustic fidelity in moderate noise'
    },
    environmentsList: [
      { ar: 'المحادثة وسط مجموعة صغيرة', en: 'Conversation in a small group' },
      { ar: 'بيئة الاستماع للموسيقى الحية والمسجلة', en: 'Music listening environment' },
      { ar: 'المحادثة في الضجيج', en: 'Conversation in noise' },
      { ar: 'المحادثة في الهدوء', en: 'Conversation in quiet' },
      { ar: 'بيئة الضجيج المحيط', en: 'General ambient noise' },
      { ar: 'البيئة الهادئة', en: 'Quiet environment' }
    ],
    highlightFeatures: [
      {
        name: 'SpeechBeam',
        description: {
          ar: 'تركز بدقة على المتحدث أمامك مباشرة في المطاعم والاجتماعات',
          en: 'Brings sharp focus to the speaker sitting right in front of you'
        }
      },
      {
        name: 'Intelligent NoiseReduction',
        description: {
          ar: 'تخفيف ذكي للضوضاء المحيطة لتقليل الإجهاد الذهني أثناء العمل',
          en: 'Adaptive noise suppression lowering listening fatigue throughout busy workdays'
        }
      },
      {
        name: 'StereoBeam (برنامج يدوي)',
        description: {
          ar: 'إمكانية تفعيل التنسيق بين السماعتين يدوياً عبر التطبيق في المواقف الصعبة',
          en: 'Manual StereoBeam program selectable via the remote app for challenging dining'
        }
      },
      {
        name: 'SphereSound',
        description: {
          ar: 'تعويض تأثير موضع السماعة لتسمع اتجاه الصوت بشكل متوازن وطبيعي',
          en: 'Compensates for microphone positioning to restore natural pinna cues'
        }
      },
      {
        name: 'Soft SpeechBoost',
        description: {
          ar: 'توضح الأصوات الهادئة والكلام الخافت لتقليل الإرهاق السمعي',
          en: 'Subtly boosts whispers and quiet speech without amplifying unwanted noise'
        }
      }
    ],
    professionExamples: [
      { ar: 'رجال وسيدات الأعمال والمستشارون القانونيون', en: 'Business executives and legal advisors' },
      { ar: 'المحامون والقضاة وممثلو الهيئات', en: 'Attorneys, legal consultants, and arbitrators' },
      { ar: 'موظفو البنوك والوسطاء الماليون والعقاريون', en: 'Bank officers, financial consultants, and real estate brokers' },
      { ar: 'المهندسون الذين يحضرون اجتماعات ومواقع العمل', en: 'Engineers balancing field discussions with conference rooms' }
    ]
  },
  5: {
    level: 5,
    title: {
      ar: 'المستوى 5 — العملي (Practical / Standard)',
      en: 'Level 5 — Practical / Standard'
    },
    environmentsCount: 4,
    channels: 16,
    description: {
      ar: 'توازن مثالي للحياة اليومية المعتدلة، المكاتب، المقاهي، المحادثات العائلية ومشاهدة التلفزيون',
      en: 'Well-rounded everyday balance for office spaces, family gatherings, and cafes'
    },
    bestForPersona: {
      ar: 'للشخص الاجتماعي أحياناً مع ضوضاء متقطعة ويقضي وقتاً في بيئات مألوفة',
      en: 'For intermittently social individuals experiencing occasional ambient noise'
    },
    environmentsList: [
      { ar: 'المحادثة في الضجيج المعتدل', en: 'Conversation in moderate noise' },
      { ar: 'المحادثة في الهدوء', en: 'Conversation in quiet' },
      { ar: 'بيئة الضجيج العام', en: 'General ambient noise attenuation' },
      { ar: 'البيئة الهادئة', en: 'Quiet home setting' }
    ],
    highlightFeatures: [
      {
        name: 'ConversationBoost',
        description: {
          ar: 'تعزيز فوري ومريح لوضوح الكلمات والمحادثات المباشرة',
          en: 'Comfortable speech clarity boost in standard conversations'
        }
      },
      {
        name: 'Soft SpeechBoost',
        description: {
          ar: 'مساعدة خاصة لسماع الأصوات الخافتة من الأطفال أو من خلف الكمامة',
          en: 'Clarifies gentle voices, grandchildren, and muffled speakers'
        }
      },
      {
        name: 'SphereSound',
        description: {
          ar: 'صوت طبيعي متوازن ومريح مع 16 قناة دقيقة للضبط',
          en: 'Natural acoustic spatial balance powered by 16 fine tuning channels'
        }
      },
      {
        name: 'NoiseReduction & Wind',
        description: {
          ar: 'تخفيف فعال للضوضاء المحيطة وصوت الرياح أثناء المشي في الهواء الطلق',
          en: 'Effective ambient noise and outdoor wind sound suppression'
        }
      }
    ],
    professionExamples: [
      { ar: 'موظفو المكاتب والجهات الحكومية', en: 'Civil service and government administrative officers' },
      { ar: 'المحاسبون والمحللون الماليون', en: 'Accountants and internal auditors' },
      { ar: 'الأطباء والممرضون في العيادات الخاصة', en: 'Outpatient clinic doctors, dentists, and nurses' },
      { ar: 'الصيادلة ومعلمات رياض الأطفال', en: 'Community pharmacists and early education teachers' }
    ]
  },
  3: {
    level: 3,
    title: {
      ar: 'المستوى 3 — الاقتصادي (Essential / Value)',
      en: 'Level 3 — Essential / Value'
    },
    environmentsCount: 2,
    channels: 12,
    description: {
      ar: 'أداء موثوق واقتصادي للبيئات الهادئة والجلسات العائلية المحدودة ومكالمات الهاتف',
      en: 'Cost-effective acoustic support for home comfort, small dinners, and phone calls'
    },
    bestForPersona: {
      ar: 'للشخص الهادئ الذي يقضي وقته في مواقف قليلة بلا ضوضاء تقريباً',
      en: 'For calm, home-oriented lifestyles with minimal exposure to intense background noise'
    },
    environmentsList: [
      { ar: 'المحادثة في الضجيج البسيط', en: 'Conversation in mild background noise' },
      { ar: 'المحادثة في الهدوء والمنزل', en: 'Conversation in calm household quiet' }
    ],
    highlightFeatures: [
      {
        name: 'BiPhone',
        description: {
          ar: 'سماع المكالمة الهاتفية في السماعتين معاً بوضوح ودون تشويش',
          en: 'Streams phone audio directly to both ears simultaneously for clear hearing'
        }
      },
      {
        name: 'SpeechBoost',
        description: {
          ar: 'تعزيز أساسي وواضح لمخارج الحروف والكلام المباشر',
          en: 'Essential enhancement for direct spoken communication'
        }
      },
      {
        name: 'NoiseReduction & Wind',
        description: {
          ar: 'تخفيف الضوضاء المستمرة وأصوات الرياح المفتوحة',
          en: 'Consistent background dampening and wind noise control'
        }
      }
    ],
    professionExamples: [
      { ar: 'العاملون عن بعد ومن المنزل', en: 'Remote work-from-home professionals' },
      { ar: 'المبرمجون ومطورو البرمجيات', en: 'Software developers and digital creators' },
      { ar: 'الباحثون والكتّاب ومحبو القراءة الهادئة', en: 'Academic researchers, writers, and book enthusiasts' }
    ]
  },
  1: {
    level: 1,
    title: {
      ar: 'المستوى 1 — الأساسي (Basic / Fundamental)',
      en: 'Level 1 — Basic / Fundamental'
    },
    environmentsCount: 1,
    channels: 12,
    description: {
      ar: 'الوظائف السمعية الأساسية للمحادثات الفردية داخل المنزل وراحة الأذن',
      en: 'Foundational amplification for one-on-one household communication'
    },
    bestForPersona: {
      ar: 'للوظائف السمعية الأساسية، لمن يقضي معظم وقته في المنزل مع أسرته',
      en: 'For basic home needs, quiet daily routines, and peaceful retirement'
    },
    environmentsList: [
      { ar: 'ميكروفون تلقائي (AutomaticMic) لبيئة استماع هادئة واحدة', en: 'AutomaticMic single quiet listening profile' }
    ],
    highlightFeatures: [
      {
        name: 'NoiseReduction',
        description: {
          ar: 'تخفيف الضوضاء المحيطة غير المرغوب فيها',
          en: 'Basic ambient background sound reduction'
        }
      },
      {
        name: 'ConversationLift',
        description: {
          ar: 'توضح الكلام بصوت عادي حتى في وجود القليل من الضوضاء',
          en: 'Clarifies natural speech when slight room noise is present'
        }
      },
      {
        name: 'معالجة الأصوات المفاجئة',
        description: {
          ar: 'حماية الأذن من الارتطامات الحادة كأبواب تغلق فجأة أو سقوط أدوات',
          en: 'Acoustic comfort shielding ears from abrupt loud slams or cutlery drops'
        }
      },
      {
        name: 'خافض صوت الهواء',
        description: {
          ar: 'يقلل صوت حركة الهواء والنسيم الخفيف',
          en: 'Reduces wind turbulence when sitting near open windows'
        }
      }
    ],
    professionExamples: [
      { ar: 'المتقاعدون الذين يقضون وقتهم في راحة المنزل', en: 'Retirees enjoying a serene home life' },
      { ar: 'ربات البيوت في الجلسات العائلية الودية', en: 'Homemakers in intimate family settings' }
    ]
  }
};

export const HEARING_AID_COLORS: HearingAidColor[] = [
  {
    id: 'sterling-silver',
    name: { ar: 'فضي (Sterling Silver)', en: 'Sterling Silver' },
    hex: '#D1D5DB',
    borderHex: '#9CA3AF',
    bestFor: {
      ar: 'يناسب غالباً أصحاب الشعر الأبيض أو الرمادي',
      en: 'Blends seamlessly with silver, white, or grey hair'
    },
    family: 'Essenz'
  },
  {
    id: 'carbon-black',
    name: { ar: 'أسود كربوني (Carbon Black)', en: 'Carbon Black' },
    hex: '#1E293B',
    borderHex: '#0F172A',
    bestFor: {
      ar: 'يناسب الشعر الأسود، ومن يفضل مظهراً تقنياً عصرياً مثل سماعات الهاتف اللاسلكية',
      en: 'Matches dark hair, or provides a high-tech modern earbud appearance'
    },
    family: 'Essenz'
  },
  {
    id: 'mocha-brown',
    name: { ar: 'بني موكا (Mocha Brown)', en: 'Mocha Brown' },
    hex: '#78543E',
    borderHex: '#5C3E2C',
    bestFor: {
      ar: 'يناسب أصحاب الشعر البني والبشرة القمحية والبرونزية',
      en: 'Complements brown hair and warm, olive, or wheat skin tones'
    },
    family: 'Essenz'
  },
  {
    id: 'cashmere-beige',
    name: { ar: 'بيج كشمير (Cashmere Beige)', en: 'Cashmere Beige' },
    hex: '#EAD7C5',
    borderHex: '#D2BEAC',
    bestFor: {
      ar: 'يناسب الشعر الفاتح أو الأشقر والبشرة الفاتحة',
      en: 'Matches light blonde hair and fair skin complexions'
    },
    family: 'Essenz'
  },
  {
    id: 'metallic-anthracite',
    name: { ar: 'رمادي داكن معدني (Metallic Anthracite)', en: 'Metallic Anthracite' },
    hex: '#475569',
    borderHex: '#334155',
    bestFor: {
      ar: 'يناسب الشعر المختلط بالشيب، ومن يفضل مظهراً عصرياً جذاباً',
      en: 'Ideal for salt-and-pepper hair with an elegant metallic finish'
    },
    family: 'Essenz'
  },
  {
    id: 'skin-beige',
    name: { ar: 'بيج بلون البشرة (Skin Beige)', en: 'Skin Beige' },
    hex: '#E5C29F',
    borderHex: '#C9A37E',
    bestFor: {
      ar: 'للسماعات الداخلية (ITE / CIC) لتبقى غير ملحوظة داخل الأذن للبشرة الفاتحة',
      en: 'Custom ITE & CIC aids to remain discreet inside fair ear canals'
    },
    family: 'STRATOS'
  },
  {
    id: 'skin-brown',
    name: { ar: 'بني بلون البشرة (Skin Brown)', en: 'Skin Brown' },
    hex: '#966746',
    borderHex: '#734E33',
    bestFor: {
      ar: 'للسماعات الداخلية (ITE / CIC) للبشرة القمحية والداكنة',
      en: 'Custom ITE & CIC aids tailored for wheat, tan, and dark skin tones'
    },
    family: 'STRATOS'
  }
];

export const LIFESTYLE_SITUATIONS: LifestyleSituation[] = [
  {
    id: 'car-conversations',
    label: {
      ar: 'محادثات أثناء القيادة أو داخل السيارة',
      en: 'Conversations while driving or inside cars'
    },
    description: {
      ar: 'سماع الركاب من الخلف أو الجانب مع صوت المحرك والشارع (تتطلب ميزة السيارة الحصرية بالمستوى 9)',
      en: 'Listening to passengers in the back/passenger seats against engine & road noise (requires Level 9 in-car feature)'
    },
    iconName: 'Car',
    isHighNoiseOrCar: true
  },
  {
    id: 'large-parties',
    label: {
      ar: 'حفلات ومناسبات كبيرة، زواجات، أو مباريات صاخبة',
      en: 'Large celebrations, weddings, stadiums, or sporting events'
    },
    description: {
      ar: 'أماكن حاشدة وموسيقى صاخبة تتطلب أقوى درجات عزل الكلام وتوجيه الميكروفونات',
      en: 'Massive crowd chatter requiring top-tier binaural beamforming'
    },
    iconName: 'PartyPopper',
    isHighNoiseOrCar: true
  },
  {
    id: 'business-meetings',
    label: {
      ar: 'اجتماعات عمل، مطاعم مزدحمة، أو غداء عمل',
      en: 'Business meetings, busy restaurants, or executive dining'
    },
    description: {
      ar: 'مجموعات نقاش متوسطة مع ضوضاء الصحون وحركة الناس حول الطاولة',
      en: 'Medium boardroom discussion alongside dining clatter and room acoustics'
    },
    iconName: 'Briefcase',
    isHighNoiseOrCar: false
  },
  {
    id: 'cafes-and-markets',
    label: {
      ar: 'مقاهي، أسواق تجارية، أو وسائل مواصلات عامة',
      en: 'Coffee shops, shopping malls, or public transit'
    },
    description: {
      ar: 'حركة مستمرة وأصوات محيطة متقطعة أثناء التسوق والتنقل',
      en: 'Dynamic ambient movement, background music, and retail bustle'
    },
    iconName: 'ShoppingBag',
    isHighNoiseOrCar: false
  },
  {
    id: 'music-and-lectures',
    label: {
      ar: 'موسيقى، محاضرات، أو مساجد وقاعات كبيرة',
      en: 'Music appreciation, academic lectures, or places of worship'
    },
    description: {
      ar: 'استماع نقي لمكبرات الصوت أو أصوات الخطباء دون صدى مشوش',
      en: 'High acoustic dynamic range for resonant halls, prayers, and concerts'
    },
    iconName: 'Music',
    isHighNoiseOrCar: false
  },
  {
    id: 'family-gatherings',
    label: {
      ar: 'جلسات عائلية أو عشاء مع مجموعة صغيرة من الأقارب',
      en: 'Family living room gatherings or dinner with a small group'
    },
    description: {
      ar: 'محادثات ممتعة في أجواء دافئة تضم الأبناء والأحفاد',
      en: 'Warm social gatherings with multiple family members conversing together'
    },
    iconName: 'Users',
    isHighNoiseOrCar: false
  },
  {
    id: 'phone-and-tv',
    label: {
      ar: 'مكالمات هاتفية متكررة ومشاهدة التلفزيون',
      en: 'Frequent telephone calls and television entertainment'
    },
    description: {
      ar: 'الرغبة في سماع صوت التلفزيون بوضوح والمكالمات في كلتا الأذنين عبر البلوتوث',
      en: 'Direct streaming of phone audio and TV dialogue without turning volume too high'
    },
    iconName: 'Tv',
    isHighNoiseOrCar: false
  },
  {
    id: 'frequent-travel',
    label: {
      ar: 'سفر متكرر ومطارات ومحطات قطار',
      en: 'Frequent travel, airports, and train terminals'
    },
    description: {
      ar: 'تغيرات بيئية مستمرة وسرعة التنقل بين الأماكن الهادئة والصاخبة',
      en: 'Constant transitions across terminals, boarding gates, and transit'
    },
    iconName: 'Plane',
    isHighNoiseOrCar: false
  },
  {
    id: 'home-conversations',
    label: {
      ar: 'محادثات هادئة في المنزل مع شخص أو اثنين',
      en: 'Quiet conversations at home with one or two people'
    },
    description: {
      ar: 'أجواء منزلية مريحة تركز على وضوح الصوت الفردي بدون إجهاد',
      en: 'Relaxed intimate domestic talks without significant background noise'
    },
    iconName: 'Home',
    isHighNoiseOrCar: false
  }
];

export const UNIVERSAL_ESSENZ_FEATURES: { title: BilingualText; description: BilingualText }[] = [
  {
    title: { ar: 'الاتصال اللاسلكي عبر البلوتوث', en: 'Hands-Free Bluetooth Connectivity' },
    description: {
      ar: 'مكالمات دون استخدام اليدين، بث الموسيقى والفيديو مباشرة من الهواتف الذكية مع شريحة ERA المتطورة ونطاق أبعد.',
      en: 'Hands-free calling and direct audio streaming from iOS/Android with high-speed ERA chip architecture.'
    }
  },
  {
    title: { ar: 'التحكم بالنقر (Tap Control)', en: 'Tap Control Sensor' },
    description: {
      ar: 'الرد على المكالمات الهاتفية أو إيقاف البث بنقرة مزدوجة لطيفة على الأذن دون لمس الهاتف.',
      en: 'Answer phone calls or pause playback with a quick, gentle double-tap on your outer ear.'
    }
  },
  {
    title: { ar: 'ميزة BiPhone السمعية', en: 'BiPhone Binaural Streaming' },
    description: {
      ar: 'سماع المكالمة الهاتفية في السماعتين معاً تلقائياً مما يضاعف وضوح المتحدث ويفصل ضجيج الغرفة.',
      en: 'Streams phone caller voices into both hearing aids simultaneously for effortless clarity.'
    }
  },
  {
    title: { ar: 'تطبيق هانزاتون Remote الذكي', en: 'HANSATON Remote App' },
    description: {
      ar: 'تخصيص نغمات الصوت من هاتفك بسهولة، وميزة العثور على السماعة في حال فقدانها.',
      en: 'Fine-tune volume and programs from your phone, plus GPS-assisted "Find My Hearing Aids".'
    }
  },
  {
    title: { ar: 'تقنية SoundRestore', en: 'SoundRestore High-Frequency Audibility' },
    description: {
      ar: 'إعادة معالجة الترددات الصوتية العالية كأصوات الطيور والأطفال وجعلها أسهل في السماع.',
      en: 'Restores compressed high-frequency speech consonants and subtle environmental cues.'
    }
  },
  {
    title: { ar: 'راحة تامة في الضجيج والطنين', en: 'Comfort in Noise & Tinnitus Care' },
    description: {
      ar: 'معالجة ذكية للأصوات المرتفعة المفاجئة، منع الصفير الإلكتروني تماماً، وبرامج علاج طنين الأذن.',
      en: 'Instant shock-sound softening, 100% feedback whistle cancellation, and integrated tinnitus relief.'
    }
  }
];
