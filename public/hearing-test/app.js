'use strict';

/* =====================================================================
 * CONFIGURATION — the only block audiologists / engineers need to edit.
 * Levels are attenuation in dB below full scale (0 = loudest).
 * ===================================================================== */
const CONFIG = {
  bookingUrl: '/',            // "Book a hearing test" link — change to your booking / WhatsApp page
  reportEmail: '',            // pre-filled recipient for "Email my result" (blank = user chooses)

  levels: { min: 0, max: 80, step: 5, startFirst: 30, start: 40 },

  // Warble tone: carrier ±5 %, 8 Hz modulation, 3 × 250 ms bursts with 20 ms fades.
  tone: { peakDbfs: -1, modDepth: 0.05, modRate: 8, burst: 0.25, fade: 0.02, gap: 0.25, bursts: 3, pause: 0.75 },

  // Per-frequency offsets added when converting to dB HL (spec section 4).
  offsets: {
    iso:    { 500: -6, 1000: -4, 2000: 0, 4000: 3, 6000: -7 },
    maxSpl: { 500: 0, 1000: 0, 2000: -5, 4000: -3, 6000: -2 },
    noise:  { 500: 0, 1000: 0, 2000: 0, 4000: 0, 6000: 0 },
    // PLACEHOLDERS — replace with values measured on a coupler / artificial ear.
    system:     { generic: { 500: 80, 1000: 80, 2000: 80, 4000: 80, 6000: 80, 8000: 80 } },
    headphones: { inEar: {}, onEar: {} },
    connection: { wired: {}, wireless: {} },
    volume:     { generic: {} },
  },
  calibrated: false,

  scoring: {
    goodMax: 25, fairMax: 40,      // worse-ear average, dB HL
    asymmetry: 15,                 // dB difference between ears at any frequency
    retestTolerance: 10,           // dB difference allowed on the repeated tone
    fastMs: 2000,                  // flag thresholds set this fast with no presses
    notHeardPenalty: 5,            // "not heard" = loudest level + 5 dB
    questionnaire: { noMax: 3, maybeMax: 7 },
  },

  roomNoisyDbfs: -50,             // uncalibrated mic level above which the room counts as noisy
};

const FREQS = [500, 1000, 2000, 4000];

// Inside an embedded viewer (e.g. a shared preview link) the microphone, printing, downloads and
// mailto: links are blocked, so those features switch to copy-to-clipboard.
const EMBEDDED = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();

// Right ear first; first tone of each ear starts loud. Last tone repeats the first as a reliability check.
const SEQUENCE = [
  { ear: 'right', freq: 1000, first: true },
  { ear: 'right', freq: 2000 },
  { ear: 'right', freq: 4000 },
  { ear: 'right', freq: 500 },
  { ear: 'left', freq: 1000, first: true },
  { ear: 'left', freq: 2000 },
  { ear: 'left', freq: 4000 },
  { ear: 'left', freq: 500 },
  { ear: 'right', freq: 1000, retest: true },
];

const AGES = [
  ['RANGE_18_29', '18–29'], ['RANGE_30_39', '30–39'], ['RANGE_40_49', '40–49'], ['RANGE_50_59', '50–59'],
  ['RANGE_60_69', '60–69'], ['RANGE_70_79', '70–79'], ['RANGE_80_89', '80–89'], ['RANGE_90_PLUS', '90+'],
];
const FREQUENCY_ANSWERS = [['ALWAYS', 'always', 4], ['OFTEN', 'often', 3], ['SOMETIMES', 'sometimes', 2], ['RARELY', 'rarely', 1], ['NEVER', 'never', 0]];
const LISTENING = [
  ['hardTimeHearingOthers', 'q1', 'q1Short'],
  ['loudEnoughButMumbled', 'q2', 'q2Short'],
  ['birdsChirping', 'q3', 'q3Short'],
  ['noisyEnvironment', 'q4', 'q4Short'],
];

/* =====================================================================
 * TEXT (English / Arabic)
 * ===================================================================== */
const I18N = {
  en: {
    brand: 'Vision Medical · Hearing Check',
    lang: 'العربية',
    home: 'Hearing aid guide',
    footer: 'This is a hearing screening, not a medical diagnosis. For adults aged 18 and over.',
    back: 'Back', next: 'Next', continue: 'Continue',

    welcomeEyebrow: 'Online hearing screening',
    welcomeTitle: 'Check your hearing in about 5 minutes',
    welcomeBody: 'Answer a few short questions, then listen to tones through your headphones. You will get a simple result and advice on what to do next.',
    needHeadphones: 'Headphones or earphones',
    needQuiet: 'A quiet room',
    needTime: 'About 5 minutes',
    disclaimer: 'This screening does not replace a hearing test by a professional and is not a diagnosis. It is intended for adults aged 18 and over. If you are worried about your hearing, please see a hearing care professional.',
    consent: 'I understand this is a screening, and I agree that my answers are used to calculate my result.',
    start: 'Start the check',

    aboutYou: 'About you',
    dailyLife: 'Your hearing in daily life',
    yourHeadphones: 'Your headphones',
    ageQ: 'What is your age range?',
    selfQ: 'How would you describe your hearing?',
    good: 'Good', poor: 'Poor', notSure: 'Not sure',
    always: 'Always', often: 'Often', sometimes: 'Sometimes', rarely: 'Rarely', never: 'Never',
    q1: 'In a one-on-one conversation, do you struggle to follow what is said, or feel that people mumble?',
    q2: 'Is it difficult for you to understand people on the phone?',
    q3: 'Do high-pitched sounds, such as birds singing, seem hard to hear?',
    q4: 'Do you struggle to follow conversations in noisy places like restaurants or gatherings?',
    q1Short: 'One-on-one conversations', q2Short: 'Phone calls', q3Short: 'High-pitched sounds', q4Short: 'Noisy places',
    questionOf: 'Question {n} of 4',
    phonesQ: 'What kind of headphones are you using?',
    inEar: 'In-ear (earbuds)', onEar: 'On-ear or over-ear',
    connQ: 'How are they connected?',
    wired: 'With a cable', wireless: 'Wireless (Bluetooth)',

    setupEyebrow: 'Before you start',
    setupTitle: 'Prepare your device',
    setup1: '<b>Set your device volume to 50%</b> and do not change it during the check.',
    setup2: '<b>Go to a quiet room</b> and put away anything that makes noise.',
    setup3: '<b>Turn off noise cancelling</b> and any sound enhancement or equaliser.',
    setup4: '<b>Check your headphones are on the right ears</b> with the buttons below.',
    playLeft: 'Left ear', playRight: 'Right ear',
    channelHint: 'You should hear the tone only in the ear shown on the button. If not, swap the sides of your headphones.',
    ready: "I'm ready",

    roomEyebrow: 'Optional',
    roomTitle: 'Is your room quiet enough?',
    roomBody: 'We can use your microphone for 5 seconds to check the background noise. Nothing is recorded or sent.',
    roomCheck: 'Check my room', roomSkip: 'Skip this step',
    roomListening: 'Listening… please stay quiet.',
    roomQuiet: 'Your room seems quiet enough.',
    roomNoisy: 'Your room seems noisy. For a reliable result, try to find a quieter place.',
    roomDenied: 'The microphone is not available. You can continue without this check.',

    toneOf: 'Tone {n} of {total}',
    earRight: 'Right ear', earLeft: 'Left ear',
    hz: 'Hz',
    firstHint: 'This first tone starts loud so you can check your headphones and learn the controls.',
    retestHint: 'Last tone: we repeat the first tone to check that your result is consistent.',
    instr1: 'Press <b>play</b> to start the tone.',
    instr2: 'Use <b>−</b> and <b>+</b> to change the volume until you can <b>only just</b> hear the tone. Then press <b>Next</b>.',
    play: 'Play tone', stop: 'Stop tone', playing: 'Playing…',
    louder: 'Louder', quieter: 'Quieter',
    maxReached: 'Maximum volume reached',
    minReached: 'Minimum volume reached',
    notHeard: "I didn't hear anything",
    tryAgain: 'Try again',
    nextTone: 'Next',
    playFirst: 'Play the tone first',

    resultsEyebrow: 'Your result',
    resultsTitle: 'Here is your hearing screening result',
    GOOD_title: 'Your hearing appears to be in the normal range',
    GOOD_body: 'At the tones we tested, your hearing seems fine. A regular hearing check every few years is still a good idea.',
    FAIR_title: 'You may have a mild hearing loss',
    FAIR_body: 'We recommend a full hearing test with a professional to find out more.',
    POOR_title: 'You are likely to have a hearing loss',
    POOR_body: 'We recommend booking a hearing test soon. Many types of hearing loss can be treated or helped.',
    INCONCLUSIVE_title: 'We could not get a reliable result',
    INCONCLUSIVE_body: 'Your answers were inconsistent or given very quickly. Please check your headphones and your room, then take the check again.',
    scaleGood: 'Good', scaleFair: 'Fair', scalePoor: 'Poor',
    asymNote: 'There is a clear difference between your two ears. We recommend a hearing test with a professional.',
    mismatchNote: 'You told us you notice hearing difficulties in daily life. Even with a good tone result, a full hearing test is recommended.',
    uncalNote: 'Your device has not been calibrated, so these values are an estimate.',
    earsTitle: 'Your hearing levels',
    average: 'average',
    dbhl: 'dB HL',
    audiogramY: 'Hearing level (dB HL)',
    audiogramX: 'Frequency (Hz)',
    normalRange: 'Normal range',
    answersTitle: 'What you told us',
    qResult: 'Questionnaire',
    qNO: 'No reported difficulty', qMAYBE: 'Some reported difficulty', qYES: 'Reported difficulty',
    book: 'Book a hearing test',
    email: 'Email my result',
    print: 'Print or save as PDF',
    download: 'Download data (JSON)',
    retake: 'Take the check again',
    copyResult: 'Copy my result', copyData: 'Copy data (JSON)', copied: 'Copied',
    copyManual: 'Copying is blocked here. Select the text below and copy it.',
    emailSubject: 'My hearing screening result',
    notHeardShort: 'not heard',
  },

  ar: {
    brand: 'رؤية الطبية · فحص السمع',
    lang: 'English',
    home: 'دليل السماعات',
    footer: 'هذا فحص مبدئي للسمع وليس تشخيصًا طبيًا. مخصص للبالغين من عمر 18 عامًا فأكثر.',
    back: 'رجوع', next: 'التالي', continue: 'متابعة',

    welcomeEyebrow: 'فحص سمع مبدئي عبر الإنترنت',
    welcomeTitle: 'افحص سمعك في حوالي 5 دقائق',
    welcomeBody: 'أجب عن بعض الأسئلة القصيرة، ثم استمع إلى نغمات عبر سماعاتك. ستحصل على نتيجة مبسطة ونصائح حول الخطوة التالية.',
    needHeadphones: 'سماعات رأس أو سماعات أذن',
    needQuiet: 'غرفة هادئة',
    needTime: 'حوالي 5 دقائق',
    disclaimer: 'لا يغني هذا الفحص عن فحص السمع لدى أخصائي، ولا يُعد تشخيصًا طبيًا. وهو مخصص للبالغين من عمر 18 عامًا فأكثر. إذا كانت لديك مخاوف بشأن سمعك، يُرجى مراجعة أخصائي سمع.',
    consent: 'أفهم أن هذا فحص مبدئي، وأوافق على استخدام إجاباتي لحساب نتيجتي.',
    start: 'ابدأ الفحص',

    aboutYou: 'معلومات عنك',
    dailyLife: 'سمعك في حياتك اليومية',
    yourHeadphones: 'سماعاتك',
    ageQ: 'ما فئتك العمرية؟',
    selfQ: 'كيف تصف سمعك؟',
    good: 'جيد', poor: 'ضعيف', notSure: 'لست متأكدًا',
    always: 'دائمًا', often: 'غالبًا', sometimes: 'أحيانًا', rarely: 'نادرًا', never: 'أبدًا',
    q1: 'في المحادثة مع شخص واحد، هل تجد صعوبة في متابعة الكلام، أو تشعر أن الآخرين يتمتمون؟',
    q2: 'هل تجد صعوبة في فهم الآخرين عبر الهاتف؟',
    q3: 'هل يصعب عليك سماع الأصوات الحادة مثل زقزقة العصافير؟',
    q4: 'هل تجد صعوبة في متابعة الأحاديث في الأماكن المزدحمة مثل المطاعم أو التجمعات؟',
    q1Short: 'المحادثات الفردية', q2Short: 'المكالمات الهاتفية', q3Short: 'الأصوات الحادة', q4Short: 'الأماكن المزدحمة',
    questionOf: 'السؤال {n} من 4',
    phonesQ: 'ما نوع السماعات التي تستخدمها؟',
    inEar: 'داخل الأذن', onEar: 'فوق الأذن أو حولها',
    connQ: 'كيف تتصل السماعات بجهازك؟',
    wired: 'بسلك', wireless: 'لاسلكي (بلوتوث)',

    setupEyebrow: 'قبل أن تبدأ',
    setupTitle: 'جهّز جهازك',
    setup1: '<b>اضبط مستوى صوت جهازك على 50%</b> ولا تغيّره أثناء الفحص.',
    setup2: '<b>انتقل إلى غرفة هادئة</b> وأبعد أي مصدر للضوضاء.',
    setup3: '<b>أوقف خاصية إلغاء الضوضاء</b> وأي تحسينات أو معادل للصوت.',
    setup4: '<b>تأكد من وضع كل سماعة على الأذن الصحيحة</b> باستخدام الزرين أدناه.',
    playLeft: 'الأذن اليسرى', playRight: 'الأذن اليمنى',
    channelHint: 'يجب أن تسمع النغمة في الأذن المذكورة على الزر فقط. إن لم يحدث ذلك، بدّل جهتي السماعتين.',
    ready: 'أنا جاهز',

    roomEyebrow: 'اختياري',
    roomTitle: 'هل غرفتك هادئة بما يكفي؟',
    roomBody: 'يمكننا استخدام الميكروفون لمدة 5 ثوانٍ لقياس الضوضاء المحيطة. لا يتم تسجيل أو إرسال أي شيء.',
    roomCheck: 'افحص غرفتي', roomSkip: 'تخطَّ هذه الخطوة',
    roomListening: 'جارٍ الاستماع… يُرجى التزام الهدوء.',
    roomQuiet: 'تبدو غرفتك هادئة بما يكفي.',
    roomNoisy: 'تبدو غرفتك صاخبة. للحصول على نتيجة موثوقة، حاول الانتقال إلى مكان أهدأ.',
    roomDenied: 'الميكروفون غير متاح. يمكنك المتابعة دون هذا الفحص.',

    toneOf: 'النغمة {n} من {total}',
    earRight: 'الأذن اليمنى', earLeft: 'الأذن اليسرى',
    hz: 'هرتز',
    firstHint: 'تبدأ هذه النغمة الأولى بصوت مرتفع لتتأكد من عمل السماعات وتتعرف على أزرار التحكم.',
    retestHint: 'النغمة الأخيرة: نعيد النغمة الأولى للتأكد من ثبات نتيجتك.',
    instr1: 'اضغط <b>تشغيل</b> لبدء النغمة.',
    instr2: 'استخدم <b>−</b> و<b>+</b> لتغيير مستوى الصوت حتى <b>تسمع النغمة بالكاد</b>، ثم اضغط <b>التالي</b>.',
    play: 'تشغيل النغمة', stop: 'إيقاف النغمة', playing: 'جارٍ التشغيل…',
    louder: 'أعلى', quieter: 'أخفض',
    maxReached: 'وصلت إلى أعلى مستوى للصوت',
    minReached: 'وصلت إلى أدنى مستوى للصوت',
    notHeard: 'لم أسمع شيئًا',
    tryAgain: 'أعد المحاولة',
    nextTone: 'التالي',
    playFirst: 'شغّل النغمة أولًا',

    resultsEyebrow: 'نتيجتك',
    resultsTitle: 'هذه نتيجة فحص سمعك المبدئي',
    GOOD_title: 'يبدو أن سمعك ضمن المعدل الطبيعي',
    GOOD_body: 'في النغمات التي اختبرناها، يبدو سمعك جيدًا. ومع ذلك يُنصح بإجراء فحص دوري للسمع كل بضع سنوات.',
    FAIR_title: 'قد يكون لديك ضعف سمع بسيط',
    FAIR_body: 'ننصحك بإجراء فحص سمع شامل لدى أخصائي لمعرفة المزيد.',
    POOR_title: 'من المرجح أن لديك ضعفًا في السمع',
    POOR_body: 'ننصحك بحجز موعد لفحص السمع قريبًا. يمكن علاج كثير من أنواع ضعف السمع أو التخفيف منها.',
    INCONCLUSIVE_title: 'لم نتمكن من الحصول على نتيجة موثوقة',
    INCONCLUSIVE_body: 'كانت إجاباتك غير متسقة أو سريعة جدًا. يُرجى التحقق من السماعات والغرفة ثم إعادة الفحص.',
    scaleGood: 'جيد', scaleFair: 'متوسط', scalePoor: 'ضعيف',
    asymNote: 'يوجد فرق واضح بين أذنيك. ننصحك بإجراء فحص سمع لدى أخصائي.',
    mismatchNote: 'ذكرت أنك تلاحظ صعوبات في السمع في حياتك اليومية. حتى مع نتيجة جيدة للنغمات، يُنصح بإجراء فحص سمع شامل.',
    uncalNote: 'لم تتم معايرة جهازك، لذا فهذه القيم تقديرية.',
    earsTitle: 'مستويات سمعك',
    average: 'المتوسط',
    dbhl: 'ديسيبل',
    audiogramY: 'مستوى السمع (ديسيبل)',
    audiogramX: 'التردد (هرتز)',
    normalRange: 'المعدل الطبيعي',
    answersTitle: 'ما أخبرتنا به',
    qResult: 'الاستبيان',
    qNO: 'لا توجد صعوبات مذكورة', qMAYBE: 'بعض الصعوبات المذكورة', qYES: 'صعوبات مذكورة',
    book: 'احجز فحص سمع',
    email: 'أرسل نتيجتي بالبريد',
    print: 'طباعة أو حفظ PDF',
    download: 'تنزيل البيانات (JSON)',
    retake: 'أعد الفحص',
    copyResult: 'انسخ نتيجتي', copyData: 'انسخ البيانات (JSON)', copied: 'تم النسخ',
    copyManual: 'النسخ غير متاح هنا. حدّد النص أدناه وانسخه.',
    emailSubject: 'نتيجة فحص سمعي المبدئي',
    notHeardShort: 'لم تُسمع',
  },
};

/* =====================================================================
 * HELPERS
 * ===================================================================== */
const $ = (sel, root = document) => root.querySelector(sel);
const app = $('#app');

let lang = 'en';
const urlLang = new URLSearchParams(location.search).get('lang');
if (urlLang === 'ar' || urlLang === 'en') lang = urlLang;
else try { lang = localStorage.getItem('hc-lang') || 'ar'; } catch (e) { /* storage blocked */ }

function t(key, vars) {
  let s = I18N[lang][key] ?? I18N.en[key] ?? key;
  if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
  return s;
}
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'hc-' + Date.now().toString(36) + Math.random().toString(36).slice(2));

const ICONS = {
  headphones: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/></svg>',
  quiet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="m23 9-6 6M17 9l6 6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
};

/* =====================================================================
 * TONE ENGINE — warble tone generated live with the Web Audio API
 * ===================================================================== */
const Tone = {
  ctx: null, nodes: null, timer: 0,

  ensure() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },

  gainFor(att) { return Math.pow(10, (CONFIG.tone.peakDbfs - att) / 20); },

  start(freq, ear, att) {
    this.stop();
    const ctx = this.ensure();
    const c = CONFIG.tone;

    const osc = ctx.createOscillator();
    osc.frequency.value = freq;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = c.modRate;
    const depth = ctx.createGain();
    depth.gain.value = freq * c.modDepth;
    lfo.connect(depth).connect(osc.frequency);

    const env = ctx.createGain();
    env.gain.value = 0;
    const level = ctx.createGain();
    level.gain.value = this.gainFor(att);
    const merger = ctx.createChannelMerger(2);
    osc.connect(env).connect(level);
    level.connect(merger, 0, ear === 'left' ? 0 : 1);
    merger.connect(ctx.destination);

    const t0 = ctx.currentTime + 0.05;
    osc.start(t0);
    lfo.start(t0);

    const cycle = c.bursts * (c.burst + c.gap) + c.pause;
    let next = t0;
    const schedule = () => {
      while (next < ctx.currentTime + 0.5) {
        for (let b = 0; b < c.bursts; b++) {
          const s = next + b * (c.burst + c.gap);
          env.gain.setValueAtTime(0, s);
          env.gain.linearRampToValueAtTime(1, s + c.fade);
          env.gain.setValueAtTime(1, s + c.burst - c.fade);
          env.gain.linearRampToValueAtTime(0, s + c.burst);
        }
        next += cycle;
      }
    };
    schedule();
    this.timer = setInterval(schedule, 100);
    this.nodes = { osc, lfo, env, level, merger };
  },

  setLevel(att) {
    if (this.nodes) this.nodes.level.gain.setTargetAtTime(this.gainFor(att), this.ctx.currentTime, 0.015);
  },

  stop() {
    clearInterval(this.timer);
    this.timer = 0;
    const n = this.nodes;
    if (!n) return;
    this.nodes = null;
    const now = this.ctx.currentTime;
    const g = n.env.gain;
    if (g.cancelAndHoldAtTime) g.cancelAndHoldAtTime(now); else g.cancelScheduledValues(now);
    g.setTargetAtTime(0, now, 0.01);
    n.osc.stop(now + 0.1);
    n.lfo.stop(now + 0.1);
    n.osc.onended = () => n.merger.disconnect();
  },
};

/* =====================================================================
 * ROOM CHECK — 5 s microphone level (uncalibrated, indicative only)
 * ===================================================================== */
const RoomCheck = {
  stream: null, raf: 0, src: null,

  async run(onLevel, onDone) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
    } catch (e) {
      onDone(null);
      return;
    }
    const ctx = Tone.ensure();
    this.src = ctx.createMediaStreamSource(this.stream);
    const an = ctx.createAnalyser();
    an.fftSize = 2048;
    this.src.connect(an);
    const buf = new Float32Array(an.fftSize);
    const samples = [];
    const t0 = performance.now();
    const tick = () => {
      an.getFloatTimeDomainData(buf);
      let sum = 0;
      for (const v of buf) sum += v * v;
      const db = 10 * Math.log10(sum / buf.length + 1e-12);
      samples.push(db);
      const p = (performance.now() - t0) / 5000;
      onLevel(db, p);
      if (p < 1) { this.raf = requestAnimationFrame(tick); return; }
      this.stop();
      samples.sort((a, b) => a - b);
      onDone(samples[Math.floor(samples.length / 2)]);
    };
    tick();
  },

  stop() {
    cancelAnimationFrame(this.raf);
    if (this.src) { this.src.disconnect(); this.src = null; }
    if (this.stream) { this.stream.getTracks().forEach((tr) => tr.stop()); this.stream = null; }
  },
};

/* =====================================================================
 * STATE & FLOW
 * ===================================================================== */
const SCREENS = ['welcome', 'age', 'self', 'q0', 'q1', 'q2', 'q3', 'phones', 'conn', 'setup', ...(EMBEDDED ? [] : ['room']),
  ...SEQUENCE.map((_, i) => 'tone' + i), 'results'];

let state;
let screenEnteredAt = 0;
let tone = null;          // live state of the current tone screen
let channelTimer = 0;     // setup-screen channel check
let room = null;          // room-check UI state

function newState() {
  return {
    id: uid(),
    startedAt: new Date().toISOString(),
    endedAt: null,
    language: lang,
    completed: false,
    index: 0,
    consent: false,
    answers: {},
    answerTimesMs: {},
    device: { userAgent: navigator.userAgent, platform: navigator.platform || '' },
    room: null,
    measurements: {},
    screenTimesMs: {},
    results: null,
  };
}

function go(i) {
  Tone.stop();
  RoomCheck.stop();
  clearTimeout(channelTimer);
  const prev = SCREENS[state.index];
  state.screenTimesMs[prev] = (state.screenTimesMs[prev] || 0) + Math.round(performance.now() - screenEnteredAt);

  state.index = Math.max(0, Math.min(SCREENS.length - 1, i));
  const name = SCREENS[state.index];
  if (name.startsWith('tone')) resetTone();
  if (name === 'room') room = { status: null, level: 0, progress: 0 };
  screenEnteredAt = performance.now();
  render();
  window.scrollTo(0, 0);
  app.focus({ preventScroll: true });
}

function resetTone() {
  const s = SEQUENCE[toneIndex()];
  tone = {
    att: s.first || s.retest ? CONFIG.levels.startFirst : CONFIG.levels.start,
    presses: [], firstPlay: 0, played: false, playing: false, msg: '',
  };
}
const toneIndex = () => Number(SCREENS[state.index].slice(4));

/* =====================================================================
 * RENDERING
 * ===================================================================== */
function render() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = t('brand');
  $('#brandName').textContent = t('brand');
  $('#langToggle').textContent = t('lang');
  $('#footerText').textContent = t('footer');
  const home = $('#homeLink');
  if (home) home.textContent = t('home');
  $('#progressBar').style.width = (state.index / (SCREENS.length - 1)) * 100 + '%';

  const name = SCREENS[state.index];
  app.classList.toggle('wide', name === 'results');
  if (name === 'welcome') app.innerHTML = viewWelcome();
  else if (name === 'age') app.innerHTML = viewChoice({
    eyebrow: 'aboutYou', q: 'ageQ', key: 'ageRange', grid: true,
    options: AGES.map(([v, label]) => ({ v, raw: label })),
  });
  else if (name === 'self') app.innerHTML = viewChoice({
    eyebrow: 'aboutYou', q: 'selfQ', key: 'selfRating',
    options: [{ v: 'NO', l: 'good' }, { v: 'YES', l: 'poor' }, { v: 'NOT_SURE', l: 'notSure' }],
  });
  else if (/^q\d$/.test(name)) {
    const [key, q] = LISTENING[Number(name[1])];
    app.innerHTML = viewChoice({
      eyebrow: 'dailyLife', sub: t('questionOf', { n: Number(name[1]) + 1 }), q, key,
      options: FREQUENCY_ANSWERS.map(([v, l]) => ({ v, l })),
    });
  }
  else if (name === 'phones') app.innerHTML = viewChoice({
    eyebrow: 'yourHeadphones', q: 'phonesQ', key: 'headphoneType', device: true,
    options: [{ v: 'inEar', l: 'inEar' }, { v: 'onEar', l: 'onEar' }],
  });
  else if (name === 'conn') app.innerHTML = viewChoice({
    eyebrow: 'yourHeadphones', q: 'connQ', key: 'connection', device: true,
    options: [{ v: 'wired', l: 'wired' }, { v: 'wireless', l: 'wireless' }],
  });
  else if (name === 'setup') app.innerHTML = viewSetup();
  else if (name === 'room') app.innerHTML = viewRoom();
  else if (name.startsWith('tone')) { app.innerHTML = viewTone(); updateToneUI(); }
  else if (name === 'results') app.innerHTML = viewResults();
}

function navRow(nextHtml = '') {
  return `<div class="nav-row">
    ${state.index > 0 ? `<button type="button" class="btn btn-text" data-action="back">${lang === 'ar' ? '→' : '←'} ${esc(t('back'))}</button>` : ''}
    <span class="spacer"></span>${nextHtml}</div>`;
}

function viewWelcome() {
  return `
    <p class="eyebrow">${esc(t('welcomeEyebrow'))}</p>
    <h1>${esc(t('welcomeTitle'))}</h1>
    <p class="lead">${esc(t('welcomeBody'))}</p>
    <ul class="need-list">
      <li><span class="ico">${ICONS.headphones}</span>${esc(t('needHeadphones'))}</li>
      <li><span class="ico">${ICONS.quiet}</span>${esc(t('needQuiet'))}</li>
      <li><span class="ico">${ICONS.clock}</span>${esc(t('needTime'))}</li>
    </ul>
    <div class="notice">${esc(t('disclaimer'))}</div>
    <label class="consent"><input type="checkbox" id="consent" ${state.consent ? 'checked' : ''}><span>${esc(t('consent'))}</span></label>
    <button type="button" class="btn btn-primary btn-block" data-action="start" ${state.consent ? '' : 'disabled'}>${esc(t('start'))}</button>`;
}

function viewChoice(def) {
  const store = def.device ? state.device : state.answers;
  const cur = store[def.key];
  const opts = def.options.map((o) => `
    <button type="button" class="option ${cur === o.v ? 'selected' : ''}" data-action="choose"
      data-key="${def.key}" data-value="${o.v}" ${def.device ? 'data-device="1"' : ''}>${esc(o.raw ?? t(o.l))}</button>`).join('');
  return `
    <p class="eyebrow">${esc(t(def.eyebrow))}${def.sub ? ' · ' + esc(def.sub) : ''}</p>
    <h1>${esc(t(def.q))}</h1>
    <div class="options ${def.grid ? 'grid' : ''}">${opts}</div>
    ${navRow(cur ? `<button type="button" class="btn btn-primary" data-action="next">${esc(t('next'))}</button>` : '')}`;
}

function viewSetup() {
  return `
    <p class="eyebrow">${esc(t('setupEyebrow'))}</p>
    <h1>${esc(t('setupTitle'))}</h1>
    <ol class="steps">
      <li><span>${t('setup1')}</span></li>
      <li><span>${t('setup2')}</span></li>
      <li><span>${t('setup3')}</span></li>
      <li><span>${t('setup4')}</span></li>
    </ol>
    <div class="check-row">
      <button type="button" class="ear-btn left" data-action="channel" data-value="left"><span class="dot"></span>${esc(t('playLeft'))}</button>
      <button type="button" class="ear-btn right" data-action="channel" data-value="right"><span class="dot"></span>${esc(t('playRight'))}</button>
    </div>
    <p class="muted small">${esc(t('channelHint'))}</p>
    ${navRow(`<button type="button" class="btn btn-primary" data-action="next">${esc(t('ready'))}</button>`)}`;
}

function viewRoom() {
  let status = '';
  if (room.status === 'listening') status = `<div class="status info">${esc(t('roomListening'))}</div>`;
  else if (room.status === 'quiet') status = `<div class="status ok">${esc(t('roomQuiet'))}</div>`;
  else if (room.status === 'noisy') status = `<div class="status warn">${esc(t('roomNoisy'))}</div>`;
  else if (room.status === 'denied') status = `<div class="status info">${esc(t('roomDenied'))}</div>`;
  const done = room.status && room.status !== 'listening';
  return `
    <p class="eyebrow">${esc(t('roomEyebrow'))}</p>
    <h1>${esc(t('roomTitle'))}</h1>
    <p class="lead">${esc(t('roomBody'))}</p>
    <div class="mic-meter"><div id="micBar" style="width:${room.status === 'listening' ? 0 : 0}%"></div></div>
    ${status}
    ${navRow(done
      ? `<button type="button" class="btn btn-primary" data-action="next">${esc(t('continue'))}</button>`
      : `<button type="button" class="btn btn-secondary" data-action="next">${esc(t('roomSkip'))}</button>
         <button type="button" class="btn btn-primary" data-action="room" ${room.status === 'listening' ? 'disabled' : ''}>${esc(t('roomCheck'))}</button>`)}`;
}

function viewTone() {
  const i = toneIndex();
  const s = SEQUENCE[i];
  const hint = s.retest ? t('retestHint') : s.first ? t('firstHint') : '';
  const segs = (CONFIG.levels.max - CONFIG.levels.min) / CONFIG.levels.step + 1;
  const bars = Array.from({ length: segs }, (_, k) => `<i style="height:${20 + (80 * k) / (segs - 1)}%"></i>`).join('');
  return `
    <div class="tone-head">
      <span class="ear-badge ${s.ear}"><span class="dot"></span>${esc(t(s.ear === 'right' ? 'earRight' : 'earLeft'))} · ${s.freq} ${esc(t('hz'))}</span>
      <span class="counter">${esc(t('toneOf', { n: i + 1, total: SEQUENCE.length }))}</span>
    </div>
    ${hint ? `<div class="hint">${esc(hint)}</div>` : ''}
    <ul class="instructions"><li>1. <span>${t('instr1')}</span></li><li>2. <span>${t('instr2')}</span></li></ul>

    <div class="player">
      <button type="button" class="play-btn" id="playBtn" data-action="play" aria-label="${esc(t('play'))}"></button>
      <div class="play-label" id="playLabel"></div>
      <div class="volume">
        <button type="button" class="vol-btn" data-action="quieter" aria-label="${esc(t('quieter'))}"><div><div class="sym">−</div><span>${esc(t('quieter'))}</span></div></button>
        <div class="meter" id="meter" aria-hidden="true">${bars}</div>
        <button type="button" class="vol-btn" data-action="louder" aria-label="${esc(t('louder'))}"><div><div class="sym">+</div><span>${esc(t('louder'))}</span></div></button>
      </div>
      <div class="vol-msg" id="volMsg" role="status"></div>
    </div>

    <div class="tone-actions">
      <button type="button" class="btn btn-primary btn-block" id="nextBtn" data-action="toneNext">${esc(t('nextTone'))}</button>
      <div class="row">
        <button type="button" class="btn btn-text" data-action="retry">↺ ${esc(t('tryAgain'))}</button>
        <button type="button" class="btn btn-text" data-action="notHeard">${esc(t('notHeard'))}</button>
      </div>
    </div>`;
}

function updateToneUI() {
  const L = CONFIG.levels;
  const filled = (L.max - tone.att) / L.step + 1;
  [...$('#meter').children].forEach((el, k) => el.classList.toggle('on', k < filled));
  const pb = $('#playBtn');
  pb.innerHTML = tone.playing ? ICONS.stop : ICONS.play;
  pb.classList.toggle('playing', tone.playing);
  pb.setAttribute('aria-label', t(tone.playing ? 'stop' : 'play'));
  $('#playLabel').textContent = t(tone.playing ? 'playing' : 'play');
  $('#volMsg').textContent = tone.msg;
  const nb = $('#nextBtn');
  nb.disabled = !tone.played;
  nb.title = tone.played ? '' : t('playFirst');
}

/* =====================================================================
 * SCORING (spec section 6)
 * ===================================================================== */
function offsetSum(f) {
  const o = CONFIG.offsets;
  const d = state.device;
  const pick = (tbl, k) => (tbl[k] && tbl[k][f]) || 0;
  return (o.iso[f] || 0) + (o.maxSpl[f] || 0) + (o.noise[f] || 0)
    + pick(o.system, 'generic') + pick(o.headphones, d.headphoneType)
    + pick(o.connection, d.connection) + pick(o.volume, 'generic');
}

function toHL(m) {
  const notHeard = m.status === 'NOT_HEARD';
  const att = notHeard ? CONFIG.levels.min : m.attenuation;
  return -att + offsetSum(m.frequency) + (notHeard ? CONFIG.scoring.notHeardPenalty : 0);
}

function computeResults() {
  const S = CONFIG.scoring;
  const ears = { right: {}, left: {} };
  let fast = 0, total = 0, first = null, retest = null;

  SEQUENCE.forEach((s, i) => {
    const m = state.measurements[i];
    if (!m) return;
    m.dbHL = toHL(m);
    if (s.retest) { retest = m; return; }
    if (s.first && s.ear === 'right') first = m;
    ears[s.ear][s.freq] = m.dbHL;
    total++;
    if (m.status === 'COMPLETED' && m.timeMs < S.fastMs && m.presses.length === 0) fast++;
  });

  const avg = (o) => { const v = Object.values(o); return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : 0; };
  const rightAvg = avg(ears.right);
  const leftAvg = avg(ears.left);
  const worse = Math.max(rightAvg, leftAvg);
  const toneClass = worse <= S.goodMax ? 'GOOD' : worse <= S.fairMax ? 'FAIR' : 'POOR';

  const asymmetry = FREQS.some((f) => ears.right[f] != null && ears.left[f] != null && Math.abs(ears.right[f] - ears.left[f]) >= S.asymmetry);

  const qualityFlags = [];
  const retestDiff = first && retest ? Math.abs(retest.dbHL - first.dbHL) : null;
  if (retestDiff != null && retestDiff > S.retestTolerance) qualityFlags.push('RETEST_MISMATCH');
  if (total && fast >= Math.ceil(total / 2)) qualityFlags.push('TOO_FAST');

  const score = Object.fromEntries(FREQUENCY_ANSWERS.map(([v, , n]) => [v, n]));
  const qSum = LISTENING.reduce((sum, [key]) => sum + (score[state.answers[key]] || 0), 0);
  const qClass = qSum <= S.questionnaire.noMax ? 'NO' : qSum <= S.questionnaire.maybeMax ? 'MAYBE' : 'YES';

  const verdict = qualityFlags.length ? 'INCONCLUSIVE' : toneClass;
  return {
    ears, rightAvg, leftAvg, worseEarAvg: worse, toneClass, asymmetry, retestDiff, fastCount: fast,
    qualityFlags, questionnaireScore: qSum, questionnaireClass: qClass, verdict,
    referral: verdict !== 'GOOD' || asymmetry || qClass === 'YES',
    calibrated: CONFIG.calibrated,
  };
}

/* =====================================================================
 * RESULTS
 * ===================================================================== */
function audiogramSVG(r) {
  const W = 560, H = 330, l = 58, rgt = 20, top = 16, bot = 48;
  const pw = W - l - rgt, ph = H - top - bot;
  const yMin = -10, yMax = 100;
  const x = (f) => l + (FREQS.indexOf(f) + 0.5) * (pw / FREQS.length);
  const y = (v) => top + ((Math.max(yMin, Math.min(yMax, v)) - yMin) / (yMax - yMin)) * ph;

  let g = `<rect x="${l}" y="${y(yMin)}" width="${pw}" height="${y(CONFIG.scoring.goodMax) - y(yMin)}" fill="var(--good-soft)"/>`;
  g += `<text x="${l + pw - 8}" y="${y(CONFIG.scoring.goodMax) - 7}" text-anchor="end" font-size="12" fill="var(--good)" font-weight="600">${esc(t('normalRange'))}</text>`;
  for (let v = yMin; v <= yMax; v += 10) {
    g += `<line x1="${l}" x2="${l + pw}" y1="${y(v)}" y2="${y(v)}" stroke="var(--border)" stroke-width="1"/>`;
    g += `<text x="${l - 10}" y="${y(v) + 4}" text-anchor="end" font-size="12" fill="var(--muted)">${v}</text>`;
  }
  FREQS.forEach((f) => {
    g += `<line x1="${x(f)}" x2="${x(f)}" y1="${top}" y2="${top + ph}" stroke="var(--border)" stroke-dasharray="3 4"/>`;
    g += `<text x="${x(f)}" y="${top + ph + 20}" text-anchor="middle" font-size="12" fill="var(--muted)">${f}</text>`;
  });
  g += `<text x="${l + pw / 2}" y="${H - 6}" text-anchor="middle" font-size="12" fill="var(--muted)" font-weight="600">${esc(t('audiogramX'))}</text>`;
  g += `<text transform="translate(14 ${top + ph / 2}) rotate(-90)" text-anchor="middle" font-size="12" fill="var(--muted)" font-weight="600">${esc(t('audiogramY'))}</text>`;

  for (const ear of ['right', 'left']) {
    const color = ear === 'right' ? 'var(--right)' : 'var(--left)';
    const pts = FREQS.filter((f) => r.ears[ear][f] != null).map((f) => [x(f) + (ear === 'right' ? -3 : 3), y(r.ears[ear][f])]);
    if (pts.length > 1) g += `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="2.2"/>`;
    for (const [px, py] of pts) {
      g += ear === 'right'
        ? `<circle cx="${px}" cy="${py}" r="7" fill="var(--surface)" stroke="${color}" stroke-width="2.6"/>`
        : `<path d="M${px - 6} ${py - 6}L${px + 6} ${py + 6}M${px + 6} ${py - 6}L${px - 6} ${py + 6}" stroke="${color}" stroke-width="2.8" stroke-linecap="round"/>`;
    }
  }
  return `<svg viewBox="0 0 ${W} ${H}" direction="ltr" role="img" aria-label="${esc(t('earsTitle'))}">${g}</svg>`;
}

function viewResults() {
  const r = state.results;
  const v = r.verdict;
  const icon = { GOOD: '✓', FAIR: '!', POOR: '!', INCONCLUSIVE: '?' }[v];

  const notes = [];
  if (v !== 'INCONCLUSIVE' && r.asymmetry) notes.push(`<div class="note">${esc(t('asymNote'))}</div>`);
  if (v === 'GOOD' && r.questionnaireClass === 'YES') notes.push(`<div class="note">${esc(t('mismatchNote'))}</div>`);
  if (!r.calibrated) notes.push(`<div class="note info">${esc(t('uncalNote'))}</div>`);

  const scale = ['GOOD', 'FAIR', 'POOR'].map((c) =>
    `<div class="${c} ${c === v ? 'current' : ''}">${esc(t('scale' + c[0] + c.slice(1).toLowerCase()))}</div>`).join('');

  const tile = (ear, val) => `
    <div class="tile ${ear}">
      <div class="label"><span class="dot"></span>${esc(t(ear === 'right' ? 'earRight' : 'earLeft'))}</div>
      <div class="value">${val} <small>${esc(t('dbhl'))} · ${esc(t('average'))}</small></div>
    </div>`;

  const freqLabel = Object.fromEntries(FREQUENCY_ANSWERS.map(([val, key]) => [val, t(key)]));
  const answers = LISTENING.map(([key, , short]) =>
    `<li><span>${esc(t(short))}</span><b>${esc(freqLabel[state.answers[key]] || '—')}</b></li>`).join('');

  return `
    <p class="eyebrow">${esc(t('resultsEyebrow'))}</p>
    <h1>${esc(t('resultsTitle'))}</h1>

    <div class="verdict ${v}">
      <div class="icon">${icon}</div>
      <div><h2>${esc(t(v + '_title'))}</h2><p>${esc(t(v + '_body'))}</p></div>
    </div>
    ${v !== 'INCONCLUSIVE' ? `<div class="scale">${scale}</div>` : ''}
    <div class="notes">${notes.join('')}</div>

    ${v !== 'INCONCLUSIVE' ? `
      <h2>${esc(t('earsTitle'))}</h2>
      <div class="ear-tiles">${tile('right', r.rightAvg)}${tile('left', r.leftAvg)}</div>
      <div class="audiogram">
        ${audiogramSVG(r)}
        <div class="legend">
          <span><svg width="14" height="14"><circle cx="7" cy="7" r="5" fill="none" stroke="var(--right)" stroke-width="2.4"/></svg>${esc(t('earRight'))}</span>
          <span><svg width="14" height="14"><path d="M2 2L12 12M12 2L2 12" stroke="var(--left)" stroke-width="2.4" stroke-linecap="round"/></svg>${esc(t('earLeft'))}</span>
        </div>
      </div>` : ''}

    <h2>${esc(t('answersTitle'))} <span class="chip ${r.questionnaireClass}">${esc(t('q' + r.questionnaireClass))}</span></h2>
    <ul class="answers">${answers}</ul>

    <div class="cta">
      ${v === 'INCONCLUSIVE'
        ? `<button type="button" class="btn btn-primary btn-block" data-action="retake">${esc(t('retake'))}</button>`
        : `<a class="btn btn-primary btn-block" href="${esc(CONFIG.bookingUrl)}">${esc(t('book'))}</a>`}
      ${EMBEDDED ? `
      <div class="row">
        <button type="button" class="btn btn-secondary" data-action="copyResult">${esc(t('copyResult'))}</button>
        <button type="button" class="btn btn-secondary" data-action="copyData">${esc(t('copyData'))}</button>
      </div>
      <p class="muted small" id="copyMsg" hidden>${esc(t('copyManual'))}</p>
      <textarea id="copyBox" class="copy-box" rows="6" readonly hidden></textarea>` : `
      <div class="row">
        <button type="button" class="btn btn-secondary" data-action="email">${esc(t('email'))}</button>
        <button type="button" class="btn btn-secondary" data-action="print">${esc(t('print'))}</button>
      </div>
      <div class="row">
        <button type="button" class="btn btn-secondary" data-action="download">${esc(t('download'))}</button>
      </div>`}
      ${v === 'INCONCLUSIVE' ? '' : `<button type="button" class="btn btn-text" data-action="retake">↺ ${esc(t('retake'))}</button>`}
    </div>`;
}

function emailBody() {
  const r = state.results;
  const lines = [t(r.verdict + '_title'), ''];
  if (r.verdict !== 'INCONCLUSIVE') {
    lines.push(`${t('earRight')}: ${r.rightAvg} ${t('dbhl')} (${t('average')})`);
    lines.push(`${t('earLeft')}: ${r.leftAvg} ${t('dbhl')} (${t('average')})`);
    for (const ear of ['right', 'left']) {
      lines.push(`${t(ear === 'right' ? 'earRight' : 'earLeft')} — ` + FREQS.map((f) => `${f} ${t('hz')}: ${r.ears[ear][f]}`).join(', '));
    }
  }
  lines.push('', `${t('qResult')}: ${t('q' + r.questionnaireClass)}`, '', t('footer'));
  return lines.join('\n');
}

/* =====================================================================
 * EVENTS
 * ===================================================================== */
const actions = {
  start() { go(state.index + 1); },
  next() { go(state.index + 1); },
  back() { go(state.index - 1); },

  choose(el) {
    const store = el.dataset.device ? state.device : state.answers;
    store[el.dataset.key] = el.dataset.value;
    if (!el.dataset.device) state.answerTimesMs[el.dataset.key] = Math.round(performance.now() - screenEnteredAt);
    el.parentElement.querySelectorAll('.option').forEach((b) => b.classList.toggle('selected', b === el));
    setTimeout(() => go(state.index + 1), 220);
  },

  channel(el) {
    const ear = el.dataset.value;
    document.querySelectorAll('.ear-btn').forEach((b) => b.classList.toggle('active', b === el));
    clearTimeout(channelTimer);
    Tone.start(1000, ear, 25);
    channelTimer = setTimeout(() => { Tone.stop(); el.classList.remove('active'); }, 2300);
  },

  room() {
    room.status = 'listening';
    render();
    RoomCheck.run(
      (db, p) => {
        const bar = $('#micBar');
        if (bar) bar.style.width = Math.max(2, Math.min(100, (db + 90) * (100 / 70))) + '%';
      },
      (median) => {
        if (SCREENS[state.index] !== 'room') return;
        state.room = median == null ? { status: 'unavailable' } : { medianDbfs: Math.round(median), noisy: median > CONFIG.roomNoisyDbfs };
        room.status = median == null ? 'denied' : median > CONFIG.roomNoisyDbfs ? 'noisy' : 'quiet';
        render();
      },
    );
  },

  play() {
    if (tone.playing) {
      Tone.stop();
      tone.playing = false;
    } else {
      const s = SEQUENCE[toneIndex()];
      Tone.start(s.freq, s.ear, tone.att);
      tone.playing = true;
      tone.played = true;
      if (!tone.firstPlay) tone.firstPlay = performance.now();
    }
    updateToneUI();
  },

  louder() { changeLevel(-CONFIG.levels.step); },
  quieter() { changeLevel(CONFIG.levels.step); },

  retry() {
    Tone.stop();
    resetTone();
    updateToneUI();
  },

  toneNext() { if (tone.played) recordTone('COMPLETED'); },
  notHeard() { recordTone('NOT_HEARD'); },

  email() {
    const href = `mailto:${encodeURIComponent(CONFIG.reportEmail)}?subject=${encodeURIComponent(t('emailSubject'))}&body=${encodeURIComponent(emailBody())}`;
    window.location.href = href;
  },
  print() { window.print(); },
  copyResult(el) { copyText(emailBody(), el); },
  copyData(el) { copyText(JSON.stringify(state, null, 2), el); },
  download() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `hearing-check-${state.id}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  },
  retake() {
    const device = state.device;
    state = newState();
    state.consent = true;
    state.device = device;
    go(1);
  },
};

function copyText(text, el) {
  const label = el.textContent;
  const fallback = () => {
    const box = $('#copyBox');
    $('#copyMsg').hidden = false;
    box.hidden = false;
    box.value = text;
    box.focus();
    box.select();
  };
  try {
    navigator.clipboard.writeText(text).then(() => {
      el.textContent = '✓ ' + t('copied');
      setTimeout(() => { el.textContent = label; }, 1800);
    }, fallback);
  } catch (e) {
    fallback();
  }
}

function changeLevel(delta) {
  const L = CONFIG.levels;
  const target = tone.att + delta;
  if (target < L.min) { tone.msg = t('maxReached'); updateToneUI(); return; }
  if (target > L.max) { tone.msg = t('minReached'); updateToneUI(); return; }
  tone.att = target;
  tone.msg = '';
  if (!tone.playing) actions.play();
  tone.presses.push({ dir: delta < 0 ? '+' : '-', atMs: Math.round(performance.now() - tone.firstPlay), attenuation: target });
  Tone.setLevel(tone.att);
  updateToneUI();
}

function recordTone(status) {
  const i = toneIndex();
  const s = SEQUENCE[i];
  const att = status === 'NOT_HEARD' ? CONFIG.levels.min : tone.att;
  state.measurements[i] = {
    ear: s.ear, frequency: s.freq, retest: !!s.retest,
    attenuation: att, dbFullScale: CONFIG.tone.peakDbfs - att,
    status, timeMs: tone.firstPlay ? Math.round(performance.now() - tone.firstPlay) : 0,
    presses: tone.presses,
  };
  if (SCREENS[state.index + 1] === 'results') {
    state.results = computeResults();
    state.completed = true;
    state.endedAt = new Date().toISOString();
  }
  go(state.index + 1);
}

app.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el || el.disabled) return;
  const fn = actions[el.dataset.action];
  if (fn) fn(el);
});

app.addEventListener('change', (e) => {
  if (e.target.id === 'consent') {
    state.consent = e.target.checked;
    $('[data-action="start"]').disabled = !state.consent;
  }
});

document.addEventListener('keydown', (e) => {
  if (!SCREENS[state.index].startsWith('tone') || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === '+' || e.key === '=' || e.key === 'ArrowUp') { e.preventDefault(); actions.louder(); }
  else if (e.key === '-' || e.key === '_' || e.key === 'ArrowDown') { e.preventDefault(); actions.quieter(); }
});

$('#langToggle').addEventListener('click', () => {
  lang = lang === 'en' ? 'ar' : 'en';
  state.language = lang;
  try { localStorage.setItem('hc-lang', lang); } catch (e) { /* storage blocked */ }
  render();
});

state = newState();
screenEnteredAt = performance.now();
render();
