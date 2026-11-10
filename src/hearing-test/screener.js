import HearingEngine from './engine.js';

/* =====================================================================
 * Vision Medical online hearing screener — user interface.
 * Scoring lives in engine.js (HearingEngine). Edit CONFIG for the UI and
 * HearingEngine.CONFIG for calibration, σ, regression and cut-offs.
 * ===================================================================== */
const CONFIG = {
  paperUrl: 'https://doi.org/10.1177/23312165251317923',

  // Attenuation in dB below digital full scale. PAPER: start at −50 dB FS, 5 dB steps,
  // each next tone starts 15 dB louder than the previous threshold.
  levels: { min: 10, max: 110, step: 5, start: 50, nextOffset: 15 },
  tone: { burst: 0.4, fade: 0.03, gap: 0.25, bursts: 2, pause: 0.6 },

  askAsymmetryTone: true,     // extra left 4 kHz tone to catch one-sided loss
  micSeconds: 10,
  // Uncalibrated mic levels (dB re full scale). Noisy if the typical level is high (steady noise)
  // or loud moments add up to 3 % of the measurement, 0.3 s of 10 s (talking, coughing, doors).
  roomNoisyDbfs: -50,         // median level
  roomPeakDbfs: -45,          // a reading above this counts as a loud moment
  roomLoudShare: 0.03,
  micSilentDbfs: -95,         // loudest reading below this = no signal from that microphone
  micProbeMs: 700,            // how long a microphone may stay silent before the next one is tried
  fastMs: 2000,               // a tone set this fast with no +/- presses counts as rushed
};

const EMBEDDED = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();

// PAPER: right 2 kHz -> right 4 kHz -> left 1 kHz -> left 6 kHz.
const SEQUENCE = [
  { ear: 'right', freq: 2000 },
  { ear: 'right', freq: 4000 },
  { ear: 'left', freq: 1000 },
  { ear: 'left', freq: 6000 },
  ...(CONFIG.askAsymmetryTone ? [{ ear: 'left', freq: 4000, extra: true }] : []),
];

const AGES = [
  ['RANGE_18_29', '18–29'], ['RANGE_30_39', '30–39'], ['RANGE_40_49', '40–49'], ['RANGE_50_59', '50–59'],
  ['RANGE_60_69', '60–69'], ['RANGE_70_79', '70–79'], ['RANGE_80_89', '80–89'], ['RANGE_90_PLUS', '90+'],
];
const FREQUENCY_ANSWERS = [['ALWAYS', 'always'], ['OFTEN', 'often'], ['SOMETIMES', 'sometimes'], ['RARELY', 'rarely'], ['NEVER', 'never']];
// [storage key, paper item, question text key, short label key]
const LISTENING = [
  ['hardTimeHearingOthers', 'q3', 'q3', 'q3Short'],
  ['loudEnoughButMumbled', 'q4', 'q4', 'q4Short'],
  ['birdsChirping', 'q5', 'q5', 'q5Short'],
  ['noisyEnvironment', 'q6', 'q6', 'q6Short'],
];
const NOISE_RATINGS = [['VERY_SOFT', 'noiseVerySoft'], ['SOFT', 'noiseSoft'], ['MODERATE', 'noiseModerate'], ['LOUD', 'noiseLoud']];
const OUT_FREQS = [500, 1000, 2000, 4000, 6000, 8000];

/* =====================================================================
 * TEXT (English / Arabic)
 * ===================================================================== */
const I18N = {
  en: {
    footer: 'This is a hearing screening, not a medical diagnosis. For adults aged 18 and over.',
    back: 'Back', next: 'Next', continue: 'Continue',

    welcomeEyebrow: 'Online hearing screening',
    welcomeTitle: 'Check your hearing in about 4 minutes',
    welcomeBody: 'Answer a few short questions, then find the softest tone you can hear in each ear. You will get an estimate of your hearing and advice on what to do next.',
    needHeadphones: 'Wired headphones or earphones',
    needQuiet: 'A quiet room',
    needTime: 'About 4 minutes',
    disclaimer: 'This screening does not replace a hearing test by a professional and is not a diagnosis. It is intended for adults aged 18 and over. If you are worried about your hearing, please see a hearing care professional.',
    consent: 'I understand this is a screening, and I agree that my answers are used to calculate my result.',
    start: 'Start the check',

    aboutYou: 'About you',
    dailyLife: 'Your hearing in daily life',
    ageQ: 'What is your age range?',
    selfQ: 'How would you describe your hearing?',
    good: 'Good', poor: 'Poor', notSure: 'Not sure',
    always: 'Always', often: 'Often', sometimes: 'Sometimes', rarely: 'Rarely', never: 'Never',
    q3: 'In a one-on-one conversation, do you struggle to follow what is said, or feel that people mumble?',
    q4: 'Is it difficult for you to have a conversation on the phone?',
    q5: 'Do high-pitched sounds, such as birds singing, seem hard to hear?',
    q6: 'Do you struggle to follow conversations in noisy places like busy restaurants?',
    q3Short: 'One-on-one conversations', q4Short: 'Phone calls', q5Short: 'High-pitched sounds', q6Short: 'Noisy places',
    questionOf: 'Question {n} of 4',

    setupEyebrow: 'Before you start',
    setupTitle: 'Prepare your device',
    setup1: '<b>Plug in wired headphones</b> and put them on: the right side on your right ear.',
    setup2: '<b>Set your device volume to 100%</b> and do not change it during the check.',
    setup3: '<b>Turn off noise cancelling</b> and any sound enhancement or equaliser.',
    setup4: '<b>Check the sides</b> with the buttons below.',
    playLeft: 'Left ear', playRight: 'Right ear',
    channelHint: 'You should hear the tone only in the ear shown on the button. If not, swap the sides of your headphones.',
    ready: "I'm ready",

    quietEyebrow: 'Your surroundings',
    quietTitle: 'Is your room quiet enough?',
    micBody: 'We listen through your microphone for {s} seconds to check the background noise. Nothing is recorded or sent.',
    micStart: 'Measure background noise',
    micAgain: 'Measure again',
    micListening: 'Measuring… please stay silent.',
    micQuiet: 'Your room is quiet enough.',
    micNoisy: 'We heard noise during the measurement. Stay silent or move to a quieter place, then measure again.',
    micDenied: 'The microphone is not available. Answer the question below to continue.',
    noiseQ: 'How loud is the background noise right now?',
    noiseVerySoft: 'Very soft', noiseSoft: 'Soft', noiseModerate: 'Moderate', noiseLoud: 'Loud',
    loudWarn: 'A loud room makes the result unreliable. Move to a quieter place before you continue.',

    toneOf: 'Tone {n} of {total}',
    earRight: 'Right ear', earLeft: 'Left ear',
    hz: 'Hz',
    firstHint: 'The first tone starts quiet. Press + until you hear it, then turn it down until you can only just hear it.',
    extraHint: 'One extra tone: it helps us notice if one ear hears differently from the other.',
    instr: 'Press <b>play</b> to start the tone. Use <b>−</b> and <b>+</b> to find the <b>softest</b> sound you can still hear. Then press <b>Next</b>.',
    play: 'Play tone', stop: 'Pause tone', playing: 'Playing…',
    louder: 'Louder', quieter: 'Quieter',
    maxReached: 'This is the loudest level',
    minReached: 'This is the softest level',
    notHeard: "I can't hear it at any level",
    tryAgain: 'Start this tone again',
    nextTone: 'Next',
    playFirst: 'Play the tone first',

    safetyEyebrow: 'Almost done',
    safetyTitle: 'Turn your volume back down',
    safetyBody: 'You set your device to 100% for the check. Please lower it to your usual level now, before you play anything else.',
    showResults: 'Show my result',

    resultsEyebrow: 'Your result',
    GOOD_title: 'Your hearing appears to be in the normal range',
    GOOD_short: 'At the tones we tested, your hearing seems fine.',
    GOOD_mean: 'People with this result usually follow conversations without difficulty in everyday situations.',
    FAIR_title: 'Your result is borderline',
    FAIR_short: 'You may have the beginning of a hearing loss.',
    FAIR_mean: 'People with this result can miss some soft or high-pitched sounds, especially in noisy places.',
    POOR_title: 'You may have a hearing loss',
    POOR_short: 'The screening suggests your hearing is below the normal range.',
    POOR_mean: 'People with this result often find conversations hard to follow, on the phone, in groups and in noisy places.',
    INCONCLUSIVE_title: 'We could not get a reliable result',
    INCONCLUSIVE_short: 'Something during the check made the result unreliable.',
    INCONCLUSIVE_mean: 'Background noise, a rushed answer or a headphone problem can all change the tones you hear.',
    reasonNOISE: 'Your room was too noisy for a reliable result.',
    reasonTOO_FAST: 'Most tones were answered very quickly without adjusting the volume.',
    asymNote: 'Your two ears heard the 4,000 Hz tone quite differently. A difference between ears should always be checked by a professional.',
    mismatchNote: 'You told us you notice hearing difficulties in daily life. Even with this result, a full hearing test is a good idea.',
    uncalNote: 'This check has not been calibrated for your headphones yet, so the values are estimates.',
    whatMeans: 'What does this mean?',
    learn: 'Learn about hearing aids',
    retake: 'Do the test again',
    detailed: 'Detailed results',
    detailTitle: 'Your estimated hearing levels',
    estimateOnly: 'Estimates only, not a clinical audiogram.',
    method: 'Method: Vercammen & Strelcyk (2025), Trends in Hearing.',
    bandGOOD: 'Good', bandMILD: 'Mild', bandMODERATE: 'Moderate', bandSEVERE: 'Severe',
    dbhl: 'dB HL',
    freqCol: 'Frequency',
    answersTitle: 'What you told us',
    print: 'Save as PDF',
    copyResult: 'Copy my result', copyData: 'Copy data (JSON)', copied: 'Copied',
    copyManual: 'Copying is blocked here. Select the text below and copy it.',
    download: 'Download data (JSON)',
    close: 'Close',
  },

  ar: {
    footer: 'هذا فحص مبدئي للسمع وليس تشخيصًا طبيًا. مخصص للبالغين من عمر 18 عامًا فأكثر.',
    back: 'رجوع', next: 'التالي', continue: 'متابعة',

    welcomeEyebrow: 'فحص سمع مبدئي عبر الإنترنت',
    welcomeTitle: 'افحص سمعك في حوالي 4 دقائق',
    welcomeBody: 'أجب عن بعض الأسئلة القصيرة، ثم حدّد أخفض نغمة تستطيع سماعها في كل أذن. ستحصل على تقدير لمستوى سمعك ونصائح حول الخطوة التالية.',
    needHeadphones: 'سماعات رأس أو أذن سلكية',
    needQuiet: 'غرفة هادئة',
    needTime: 'حوالي 4 دقائق',
    disclaimer: 'لا يغني هذا الفحص عن فحص السمع لدى أخصائي، ولا يُعد تشخيصًا طبيًا. وهو مخصص للبالغين من عمر 18 عامًا فأكثر. إذا كانت لديك مخاوف بشأن سمعك، يُرجى مراجعة أخصائي سمع.',
    consent: 'أفهم أن هذا فحص مبدئي، وأوافق على استخدام إجاباتي لحساب نتيجتي.',
    start: 'ابدأ الفحص',

    aboutYou: 'معلومات عنك',
    dailyLife: 'سمعك في حياتك اليومية',
    ageQ: 'ما فئتك العمرية؟',
    selfQ: 'كيف تصف سمعك؟',
    good: 'جيد', poor: 'ضعيف', notSure: 'لست متأكدًا',
    always: 'دائمًا', often: 'غالبًا', sometimes: 'أحيانًا', rarely: 'نادرًا', never: 'أبدًا',
    q3: 'في المحادثة مع شخص واحد، هل تجد صعوبة في متابعة الكلام، أو تشعر أن الآخرين يتمتمون؟',
    q4: 'هل تجد صعوبة في إجراء محادثة عبر الهاتف؟',
    q5: 'هل يصعب عليك سماع الأصوات الحادة مثل زقزقة العصافير؟',
    q6: 'هل تجد صعوبة في متابعة الأحاديث في الأماكن المزدحمة مثل المطاعم؟',
    q3Short: 'المحادثات الفردية', q4Short: 'المكالمات الهاتفية', q5Short: 'الأصوات الحادة', q6Short: 'الأماكن المزدحمة',
    questionOf: 'السؤال {n} من 4',

    setupEyebrow: 'قبل أن تبدأ',
    setupTitle: 'جهّز جهازك',
    setup1: '<b>صِل سماعات سلكية</b> وضعها على أذنيك: الجهة اليمنى على أذنك اليمنى.',
    setup2: '<b>اضبط مستوى صوت جهازك على 100%</b> ولا تغيّره أثناء الفحص.',
    setup3: '<b>أوقف خاصية إلغاء الضوضاء</b> وأي تحسينات أو معادل للصوت.',
    setup4: '<b>تحقّق من الجهتين</b> باستخدام الزرين أدناه.',
    playLeft: 'الأذن اليسرى', playRight: 'الأذن اليمنى',
    channelHint: 'يجب أن تسمع النغمة في الأذن المذكورة على الزر فقط. إن لم يحدث ذلك، بدّل جهتي السماعتين.',
    ready: 'أنا جاهز',

    quietEyebrow: 'المكان من حولك',
    quietTitle: 'هل غرفتك هادئة بما يكفي؟',
    micBody: 'نستمع عبر الميكروفون لمدة {s} ثوانٍ لقياس الضوضاء المحيطة. لا يتم تسجيل أو إرسال أي شيء.',
    micStart: 'قِس الضوضاء المحيطة',
    micAgain: 'قِس مرة أخرى',
    micListening: 'جارٍ القياس… يُرجى التزام الصمت.',
    micQuiet: 'غرفتك هادئة بما يكفي.',
    micNoisy: 'سمعنا ضوضاء أثناء القياس. التزم الصمت أو انتقل إلى مكان أهدأ، ثم أعد القياس.',
    micDenied: 'الميكروفون غير متاح. أجب عن السؤال أدناه للمتابعة.',
    noiseQ: 'ما مستوى الضوضاء المحيطة بك الآن؟',
    noiseVerySoft: 'منخفضة جدًا', noiseSoft: 'منخفضة', noiseModerate: 'متوسطة', noiseLoud: 'مرتفعة',
    loudWarn: 'الغرفة الصاخبة تجعل النتيجة غير موثوقة. انتقل إلى مكان أهدأ قبل المتابعة.',

    toneOf: 'النغمة {n} من {total}',
    earRight: 'الأذن اليمنى', earLeft: 'الأذن اليسرى',
    hz: 'هرتز',
    firstHint: 'تبدأ النغمة الأولى بصوت منخفض. اضغط + حتى تسمعها، ثم اخفض الصوت حتى تسمعها بالكاد.',
    extraHint: 'نغمة إضافية: تساعدنا على ملاحظة ما إذا كانت إحدى أذنيك تسمع بشكل مختلف عن الأخرى.',
    instr: 'اضغط <b>تشغيل</b> لبدء النغمة. استخدم <b>−</b> و<b>+</b> للوصول إلى <b>أخفض</b> صوت ما زلت تسمعه، ثم اضغط <b>التالي</b>.',
    play: 'تشغيل النغمة', stop: 'إيقاف مؤقت', playing: 'جارٍ التشغيل…',
    louder: 'أعلى', quieter: 'أخفض',
    maxReached: 'هذا أعلى مستوى للصوت',
    minReached: 'هذا أخفض مستوى للصوت',
    notHeard: 'لا أسمعها في أي مستوى',
    tryAgain: 'ابدأ هذه النغمة من جديد',
    nextTone: 'التالي',
    playFirst: 'شغّل النغمة أولًا',

    safetyEyebrow: 'أوشكت على الانتهاء',
    safetyTitle: 'أعِد مستوى الصوت إلى وضعه المعتاد',
    safetyBody: 'ضبطت جهازك على 100% من أجل الفحص. يُرجى خفض الصوت الآن إلى مستواك المعتاد قبل تشغيل أي شيء آخر.',
    showResults: 'اعرض نتيجتي',

    resultsEyebrow: 'نتيجتك',
    GOOD_title: 'يبدو أن سمعك ضمن المعدل الطبيعي',
    GOOD_short: 'في النغمات التي اختبرناها، يبدو سمعك جيدًا.',
    GOOD_mean: 'عادةً ما يتابع أصحاب هذه النتيجة المحادثات دون صعوبة في المواقف اليومية.',
    FAIR_title: 'نتيجتك على الحد الفاصل',
    FAIR_short: 'قد تكون لديك بداية ضعف في السمع.',
    FAIR_mean: 'قد يفوت أصحاب هذه النتيجة بعض الأصوات المنخفضة أو الحادة، خاصة في الأماكن الصاخبة.',
    POOR_title: 'قد يكون لديك ضعف في السمع',
    POOR_short: 'تشير نتيجة الفحص إلى أن سمعك أقل من المعدل الطبيعي.',
    POOR_mean: 'غالبًا ما يجد أصحاب هذه النتيجة صعوبة في متابعة المحادثات، عبر الهاتف وفي المجموعات وفي الأماكن الصاخبة.',
    INCONCLUSIVE_title: 'لم نتمكن من الحصول على نتيجة موثوقة',
    INCONCLUSIVE_short: 'حدث أمر أثناء الفحص جعل النتيجة غير موثوقة.',
    INCONCLUSIVE_mean: 'قد تؤثر الضوضاء المحيطة أو الإجابة السريعة أو مشكلة في السماعات على النغمات التي تسمعها.',
    reasonNOISE: 'كانت غرفتك صاخبة جدًا للحصول على نتيجة موثوقة.',
    reasonTOO_FAST: 'تمت الإجابة على معظم النغمات بسرعة كبيرة دون تعديل مستوى الصوت.',
    asymNote: 'سمعت أذناك نغمة 4000 هرتز بشكل مختلف بوضوح. يجب أن يفحص أخصائي أي اختلاف بين الأذنين.',
    mismatchNote: 'ذكرت أنك تلاحظ صعوبات في السمع في حياتك اليومية. حتى مع هذه النتيجة، يُستحسن إجراء فحص سمع شامل.',
    uncalNote: 'لم تتم معايرة هذا الفحص لسماعاتك بعد، لذا فالقيم تقديرية.',
    whatMeans: 'ماذا تعني هذه النتيجة؟',
    learn: 'تعرّف على السماعات',
    retake: 'أعد الفحص',
    detailed: 'النتائج التفصيلية',
    detailTitle: 'مستويات سمعك التقديرية',
    estimateOnly: 'قيم تقديرية فقط، وليست مخطط سمع سريريًا.',
    method: 'المنهجية: Vercammen & Strelcyk (2025)، مجلة Trends in Hearing.',
    bandGOOD: 'جيد', bandMILD: 'بسيط', bandMODERATE: 'متوسط', bandSEVERE: 'شديد',
    dbhl: 'ديسيبل',
    freqCol: 'التردد',
    answersTitle: 'ما أخبرتنا به',
    print: 'حفظ PDF',
    copyResult: 'انسخ نتيجتي', copyData: 'انسخ البيانات (JSON)', copied: 'تم النسخ',
    copyManual: 'النسخ غير متاح هنا. حدّد النص أدناه وانسخه.',
    download: 'تنزيل البيانات (JSON)',
    close: 'إغلاق',
  },
};


/* =====================================================================
 * HELPERS
 * ===================================================================== */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'hc-' + Date.now().toString(36) + Math.random().toString(36).slice(2));
const earKey = (ear) => (ear === 'right' ? 'RIGHT' : 'LEFT');

const ICONS = {
  headphones: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/></svg>',
  quiet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="m23 9-6 6M17 9l6 6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  volume: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M19 12h-6"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
};


/* =====================================================================
 * TONE ENGINE — pulsed pure tone, Web Audio API
 * ===================================================================== */
const Tone = {
  ctx: null, nodes: null, timer: 0,

  ensure() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },

  // Level in dB re full scale = −attenuation; a sine at amplitude 1 is full scale.
  gainFor(att) { return Math.pow(10, -att / 20); },

  start(freq, ear, att) {
    this.stop();
    const ctx = this.ensure();
    const c = CONFIG.tone;

    const osc = ctx.createOscillator();
    osc.frequency.value = freq;
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

    const cycle = c.bursts * (c.burst + c.gap) + c.pause;
    let next = t0;
    const schedule = () => {
      while (next < ctx.currentTime + 0.6) {
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
    this.nodes = { osc, env, level, merger };
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
    n.osc.onended = () => n.merger.disconnect();
  },
};

/* =====================================================================
 * ROOM CHECK — microphone level (uncalibrated, indicative only)
 * ===================================================================== */
const MIC_CONSTRAINTS = { echoCancellation: false, noiseSuppression: false, autoGainControl: false };
const BLUETOOTH_MIC = /bluetooth|airpods|hands-?free|headset|\bbt\b|tune\d+bt/i;
const BUILT_IN_MIC = /built-?in|internal|macbook|imac|مدمج|integrated/i;

const RoomCheck = {
  stream: null, raf: 0, src: null, sink: null, run_id: 0,

  // Microphones to try, best first: the device's built-in mic, then other wired mics, Bluetooth last.
  // A Bluetooth headset mic is avoided: it is often silent in the browser, and opening it switches
  // the headset into low-quality call mode, which would spoil the tones.
  async candidates() {
    let granted = false;
    try { granted = (await navigator.permissions.query({ name: 'microphone' })).state === 'granted'; } catch (e) { /* not supported */ }
    if (!granted) {
      // Labels are hidden until permission is given, so ask once and close straight away.
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      s.getTracks().forEach((tr) => tr.stop());
    }
    const inputs = (await navigator.mediaDevices.enumerateDevices())
      .filter((d) => d.kind === 'audioinput' && d.deviceId && d.deviceId !== 'default' && d.deviceId !== 'communications');
    const rank = (d) => (BUILT_IN_MIC.test(d.label) ? 0 : BLUETOOTH_MIC.test(d.label) ? 2 : 1);
    const list = inputs.sort((a, b) => rank(a) - rank(b));
    return list.length ? list : [{ deviceId: '', label: '' }];
  },

  // Call from a click handler: the audio context is started before anything is awaited,
  // while the click still counts as a user gesture.
  async run(onLevel, onDone) {
    const id = ++this.run_id;
    const ctx = Tone.ensure();
    let devices;
    try {
      devices = await this.candidates();
      await ctx.resume();
    } catch (e) {
      onDone(null);
      return;
    }

    for (const dev of devices) {
      if (id !== this.run_id) return;
      const stats = await this.measure(ctx, dev, onLevel, id);
      if (stats === 'ABORTED') return;
      if (stats && !stats.silent) { stats.device = dev.label || 'default'; onDone(stats); return; }
    }
    onDone(null);
  },

  // Listens to one microphone. Gives up early (null) if it is still digitally silent after the probe time.
  async measure(ctx, dev, onLevel, id) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: dev.deviceId ? { ...MIC_CONSTRAINTS, deviceId: { exact: dev.deviceId } } : MIC_CONSTRAINTS,
      });
    } catch (e) {
      return null;
    }
    if (id !== this.run_id) { this.stop(); return 'ABORTED'; }
    this.src = ctx.createMediaStreamSource(this.stream);
    const an = ctx.createAnalyser();
    an.fftSize = 2048;
    // Keep the analyser in the rendered graph (silently) so every browser keeps feeding it.
    this.sink = ctx.createGain();
    this.sink.gain.value = 0;
    this.src.connect(an).connect(this.sink).connect(ctx.destination);

    const buf = new Float32Array(an.fftSize);
    const samples = [];
    const dur = CONFIG.micSeconds * 1000;
    return new Promise((resolve) => {
      const t0 = performance.now();
      const tick = () => {
        if (id !== this.run_id) { this.stop(); resolve('ABORTED'); return; }
        an.getFloatTimeDomainData(buf);
        let sum = 0;
        for (const v of buf) sum += v * v;
        const db = 10 * Math.log10(sum / buf.length + 1e-12);
        samples.push(db);
        const elapsed = performance.now() - t0;
        if (elapsed > CONFIG.micProbeMs && Math.max(...samples) < CONFIG.micSilentDbfs) {
          this.stop();
          resolve(null);
          return;
        }
        onLevel(db, elapsed / dur);
        if (elapsed < dur) { this.raf = requestAnimationFrame(tick); return; }
        this.stop();
        resolve(roomStats(samples));
      };
      tick();
    });
  },

  stop() {
    cancelAnimationFrame(this.raf);
    if (this.src) { this.src.disconnect(); this.src = null; }
    if (this.sink) { this.sink.disconnect(); this.sink = null; }
    if (this.stream) { this.stream.getTracks().forEach((tr) => tr.stop()); this.stream = null; }
  },

  cancel() {
    this.run_id++;
    this.stop();
  },
};

function roomStats(samples) {
  const s = [...samples].sort((a, b) => a - b);
  const pick = (q) => s[Math.min(s.length - 1, Math.floor(q * s.length))];
  const median = pick(0.5);
  const loudShare = s.filter((v) => v > CONFIG.roomPeakDbfs).length / s.length;
  const max = s[s.length - 1];
  return {
    median, p90: pick(0.9), max, loudShare,
    noisy: median > CONFIG.roomNoisyDbfs || loudShare >= CONFIG.roomLoudShare,
  };
}


/**
 * Mounts the hearing screener inside `root`, which must contain
 * [data-hc="app"], [data-hc="progress"] and [data-hc="footer"].
 * Returns { setLang(lang), destroy() }.
 */
export function mountHearingTest(root, opts = {}) {
  const $ = (sel) => root.querySelector(sel);
  const app = $('[data-hc="app"]');
  let lang = opts.lang === 'en' ? 'en' : 'ar';

  function t(key, vars) {
    let s = I18N[lang][key] ?? I18N.en[key] ?? key;
    if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
    return s;
  }

  /* =====================================================================
   * STATE & FLOW
   * ===================================================================== */
  const SCREENS = ['welcome', 'age', 'self', 'q0', 'q1', 'q2', 'q3', 'setup', 'quiet',
    ...SEQUENCE.map((_, i) => 'tone' + i), 'safety', 'results'];

  let state;
  let screenEnteredAt = 0;
  let tone = null;
  let channelTimer = 0;
  let mic = null;
  let detailsOpen = false;

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
      system: {
        phones: 'WIRED_HEADPHONES',
        userAgent: navigator.userAgent,
        platform: navigator.platform || '',
        mobile: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent),
        volumeInstruction: 100,
      },
      environment: { micDevice: null, micMedianDbfs: null, micP90Dbfs: null, micMaxDbfs: null, micStatus: null, selfRating: null, noiseMasked: false },
      measurements: { RIGHT: {}, LEFT: {}, BOTH: {} },
      screenTimesMs: {},
      results: null,
    };
  }

  function go(i) {
    Tone.stop();
    RoomCheck.cancel();
    clearTimeout(channelTimer);
    const prev = SCREENS[state.index];
    state.screenTimesMs[prev] = (state.screenTimesMs[prev] || 0) + Math.round(performance.now() - screenEnteredAt);

    state.index = Math.max(0, Math.min(SCREENS.length - 1, i));
    const name = SCREENS[state.index];
    if (name.startsWith('tone')) resetTone();
    if (name === 'quiet' && !mic) mic = { status: EMBEDDED ? 'denied' : null };
    detailsOpen = false;
    screenEnteredAt = performance.now();
    render();
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  }

  const toneIndex = () => Number(SCREENS[state.index].slice(4));

  // PAPER: the first tone starts at −50 dB FS; each next tone starts 15 dB louder than the previous threshold.
  function startLevel(i) {
    const L = CONFIG.levels;
    if (i === 0) return L.start;
    const prev = SEQUENCE[i - 1];
    const m = state.measurements[earKey(prev.ear)]['hz' + prev.freq];
    const base = m ? m.dbFullScale : L.start;
    return Math.max(L.min, Math.min(L.max, base - L.nextOffset));
  }

  function resetTone() {
    tone = { att: startLevel(toneIndex()), presses: [], firstPlay: 0, played: false, playing: false, msg: '' };
  }

  /* =====================================================================
   * RENDERING
   * ===================================================================== */
  function render() {
    // Page language, direction and title belong to the host app.
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    $('[data-hc="footer"]').textContent = t('footer');
    $('[data-hc="progress"]').style.width = (state.index / (SCREENS.length - 1)) * 100 + '%';

    const name = SCREENS[state.index];
    app.classList.toggle('wide', name === 'results');
    if (name === 'welcome') app.innerHTML = viewWelcome();
    else if (name === 'age') app.innerHTML = viewChoice({
      eyebrow: 'aboutYou', q: 'ageQ', key: 'age', grid: true,
      options: AGES.map(([v, label]) => ({ v, raw: label })),
    });
    else if (name === 'self') app.innerHTML = viewChoice({
      eyebrow: 'aboutYou', q: 'selfQ', key: 'overallRating',
      options: [{ v: 'GOOD', l: 'good' }, { v: 'NOT_SURE', l: 'notSure' }, { v: 'POOR', l: 'poor' }],
    });
    else if (/^q\d$/.test(name)) {
      const n = Number(name[1]);
      const [key, , q] = LISTENING[n];
      app.innerHTML = viewChoice({
        eyebrow: 'dailyLife', sub: t('questionOf', { n: n + 1 }), q, key,
        options: FREQUENCY_ANSWERS.map(([v, l]) => ({ v, l })),
      });
    }
    else if (name === 'setup') app.innerHTML = viewSetup();
    else if (name === 'quiet') app.innerHTML = viewQuiet();
    else if (name.startsWith('tone')) { app.innerHTML = viewTone(); updateToneUI(); }
    else if (name === 'safety') app.innerHTML = viewSafety();
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
    const cur = state.answers[def.key];
    const opts = def.options.map((o) => `
      <button type="button" class="option ${cur === o.v ? 'selected' : ''}" data-action="choose"
        data-key="${def.key}" data-value="${o.v}">${esc(o.raw ?? t(o.l))}</button>`).join('');
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

  function viewQuiet() {
    const env = state.environment;
    let status = '';
    if (mic.status === 'listening') status = `<div class="status info">${esc(t('micListening'))}</div>`;
    else if (mic.status === 'quiet') status = `<div class="status ok">${esc(t('micQuiet'))}</div>`;
    else if (mic.status === 'noisy') status = `<div class="status warn">${esc(t('micNoisy'))}</div>`;
    else if (mic.status === 'denied') status = `<div class="status info">${esc(t('micDenied'))}</div>`;
    const ratingWarn = mic.status === 'denied' && env.selfRating === 'LOUD'
      ? `<div class="status warn">${esc(t('loudWarn'))}</div>` : '';

    const micDone = ['quiet', 'noisy', 'denied'].includes(mic.status);
    const canGo = micDone && env.selfRating;
    const micButton = mic.status === 'denied' ? '' : mic.status === 'listening'
      ? `<button type="button" class="btn btn-secondary btn-block" disabled>${esc(t('micListening'))}</button>`
      : micDone
        ? `<button type="button" class="btn btn-text" data-action="mic">↺ ${esc(t('micAgain'))}</button>`
        : `<button type="button" class="btn btn-primary btn-block" data-action="mic">${esc(t('micStart'))}</button>`;

    const rating = NOISE_RATINGS.map(([v, l]) => `
      <button type="button" class="option ${env.selfRating === v ? 'selected' : ''}" data-action="noiseRating" data-value="${v}">${esc(t(l))}</button>`).join('');

    return `
      <p class="eyebrow">${esc(t('quietEyebrow'))}</p>
      <h1>${esc(t('quietTitle'))}</h1>
      ${mic.status === 'denied' ? '' : `<p class="lead">${esc(t('micBody', { s: CONFIG.micSeconds }))}</p>
      <div class="mic-meter"><div id="micBar"></div></div>`}
      ${status}
      <div class="mic-actions">${micButton}</div>
      <h2>${esc(t('noiseQ'))}</h2>
      <div class="options grid">${rating}</div>
      ${ratingWarn}
      ${navRow(`<button type="button" class="btn btn-primary" data-action="next" ${canGo ? '' : 'disabled'}>${esc(t('continue'))}</button>`)}`;
  }

  function viewTone() {
    const i = toneIndex();
    const s = SEQUENCE[i];
    const hint = i === 0 ? t('firstHint') : s.extra ? t('extraHint') : '';
    const L = CONFIG.levels;
    const segs = (L.max - L.min) / L.step + 1;
    const bars = Array.from({ length: segs }, (_, k) => `<i style="height:${20 + (80 * k) / (segs - 1)}%"></i>`).join('');
    const dots = SEQUENCE.map((_, k) => `<span class="${k < i ? 'done' : k === i ? 'now' : ''}"></span>`).join('');
    return `
      <div class="tone-head">
        <span class="ear-badge ${s.ear}"><span class="dot"></span>${esc(t(s.ear === 'right' ? 'earRight' : 'earLeft'))} · ${s.freq} ${esc(t('hz'))}</span>
        <span class="counter">${esc(t('toneOf', { n: i + 1, total: SEQUENCE.length }))}</span>
      </div>
      ${hint ? `<div class="hint">${esc(hint)}</div>` : ''}
      <p class="instr">${t('instr')}</p>

      <div class="player">
        <div class="volume">
          <button type="button" class="vol-btn" data-action="quieter" aria-label="${esc(t('quieter'))}"><div><div class="sym">−</div><span>${esc(t('quieter'))}</span></div></button>
          <button type="button" class="play-btn" id="playBtn" data-action="play" aria-label="${esc(t('play'))}"></button>
          <button type="button" class="vol-btn" data-action="louder" aria-label="${esc(t('louder'))}"><div><div class="sym">+</div><span>${esc(t('louder'))}</span></div></button>
        </div>
        <div class="play-label" id="playLabel"></div>
        <div class="meter" id="meter" aria-hidden="true">${bars}</div>
        <div class="vol-msg" id="volMsg" role="status"></div>
        <div class="dots" aria-hidden="true">${dots}</div>
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
    pb.innerHTML = tone.playing ? ICONS.pause : ICONS.play;
    pb.classList.toggle('playing', tone.playing);
    pb.setAttribute('aria-label', t(tone.playing ? 'stop' : 'play'));
    $('#playLabel').textContent = t(tone.playing ? 'playing' : 'play');
    $('#volMsg').textContent = tone.msg;
    const nb = $('#nextBtn');
    nb.disabled = !tone.played;
    nb.title = tone.played ? '' : t('playFirst');
  }

  function viewSafety() {
    return `
      <div class="safety">
        <span class="safety-ico">${ICONS.volume}</span>
        <p class="eyebrow">${esc(t('safetyEyebrow'))}</p>
        <h1>${esc(t('safetyTitle'))}</h1>
        <p class="lead">${esc(t('safetyBody'))}</p>
        <button type="button" class="btn btn-primary btn-block" data-action="showResults">${esc(t('showResults'))}</button>
      </div>`;
  }

  /* =====================================================================
   * RESULTS
   * ===================================================================== */
  function computeResults() {
    const flat = Object.values(state.measurements.RIGHT).concat(Object.values(state.measurements.LEFT));
    const rushed = flat.filter((m) => m.measurementStatus === 'COMPLETED' && m.durationInMilliseconds < CONFIG.fastMs && m.volumeOperationsSequence.length === 0).length;
    const qualityFlags = rushed >= Math.ceil(flat.length / 2) ? ['TOO_FAST'] : [];
    const a = state.answers;
    return HearingEngine.run({
      ageBand: a.age,
      answers: { q2: a.overallRating, q4: a.loudEnoughButMumbled, q5: a.birdsChirping },
      measurements: state.measurements,
      noiseMasked: state.environment.noiseMasked,
      qualityFlags,
    });
  }

  function bandsLegend() {
    const bands = [['GOOD', 0, 15], ['MILD', 15, 35], ['MODERATE', 35, 65], ['SEVERE', 65, 90]];
    return bands;
  }

  function chartSVG(r) {
    const W = 560, rowH = 34, top = 40, left = 78, right = 16, bottom = 30;
    const pw = W - left - right;
    const H = top + OUT_FREQS.length * rowH + bottom;
    const x = (v) => left + (Math.max(0, Math.min(90, v)) / 90) * pw;
    let g = '';
    for (const [b, lo, hi] of bandsLegend()) {
      g += `<rect x="${x(lo)}" y="${top - 26}" width="${x(hi) - x(lo)}" height="${OUT_FREQS.length * rowH + 26}" class="band band-${b}"/>`;
      g += `<text x="${(x(lo) + x(hi)) / 2}" y="${top - 10}" text-anchor="middle" class="band-label band-label-${b}">${esc(t('band' + b))}</text>`;
    }
    for (let v = 0; v <= 90; v += 15) {
      g += `<line x1="${x(v)}" x2="${x(v)}" y1="${top}" y2="${top + OUT_FREQS.length * rowH}" class="grid"/>`;
      g += `<text x="${x(v)}" y="${top + OUT_FREQS.length * rowH + 18}" text-anchor="middle" class="axis">${v}</text>`;
    }
    OUT_FREQS.forEach((f, k) => {
      const y0 = top + k * rowH;
      g += `<text x="${left - 10}" y="${y0 + rowH / 2 + 4}" text-anchor="end" class="axis">${f >= 1000 ? f / 1000 + ' k' : f} ${esc(t('hz'))}</text>`;
      // A 0 dB HL threshold still gets a short visible bar, and every bar is labelled with its value.
      [['R', 6, 'bar-right'], ['L', 18, 'bar-left']].forEach(([ear, dy, cls]) => {
        const v = r.audiogram[ear][f];
        const w = Math.max(8, x(v) - x(0));
        g += `<rect x="${x(0)}" y="${y0 + dy}" width="${w}" height="10" rx="3" class="${cls}"/>`;
        g += `<text x="${x(0) + w + 5}" y="${y0 + dy + 9}" class="bar-value">${v}</text>`;
      });
    });
    return `<svg viewBox="0 0 ${W} ${H}" direction="ltr" role="img" aria-label="${esc(t('detailTitle'))}">${g}</svg>`;
  }

  function viewDetails(r) {
    const rows = OUT_FREQS.map((f) => `<tr><td>${f} ${esc(t('hz'))}</td><td>${r.audiogram.R[f]}</td><td>${r.audiogram.L[f]}</td></tr>`).join('');
    return `
      <div class="details-panel" id="detailsPanel">
        <h2>${esc(t('detailTitle'))}</h2>
        <div class="chart">${chartSVG(r)}
          <div class="legend">
            <span><i class="sw sw-right"></i>${esc(t('earRight'))}</span>
            <span><i class="sw sw-left"></i>${esc(t('earLeft'))}</span>
          </div>
        </div>
        <p class="small muted"><b>${esc(t('estimateOnly'))}</b> <a href="${esc(CONFIG.paperUrl)}" target="_blank" rel="noopener">${esc(t('method'))}</a></p>
        <div class="table-wrap">
          <table class="db-table">
            <thead><tr><th>${esc(t('freqCol'))}</th><th>${esc(t('earRight'))} (${esc(t('dbhl'))})</th><th>${esc(t('earLeft'))} (${esc(t('dbhl'))})</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div class="row-actions">
          ${EMBEDDED
            ? `<button type="button" class="btn btn-secondary" data-action="copyResult">${esc(t('copyResult'))}</button>
               <button type="button" class="btn btn-secondary" data-action="copyData">${esc(t('copyData'))}</button>`
            : `<button type="button" class="btn btn-secondary" data-action="print">${esc(t('print'))}</button>
               <button type="button" class="btn btn-secondary" data-action="download">${esc(t('download'))}</button>`}
        </div>
        <p class="muted small" id="copyMsg" hidden>${esc(t('copyManual'))}</p>
        <textarea id="copyBox" class="copy-box" rows="6" readonly hidden></textarea>
      </div>`;
  }

  function viewResults() {
    const r = state.results;
    const v = r.verdict;
    const icon = { GOOD: '✓', FAIR: '!', POOR: '!', INCONCLUSIVE: '?' }[v];

    const notes = [];
    if (v === 'INCONCLUSIVE') notes.push(`<div class="note">${esc(t('reason' + r.reason))}</div>`);
    if (r.asymmetry && r.asymmetry.flagged && v !== 'INCONCLUSIVE') notes.push(`<div class="note">${esc(t('asymNote'))}</div>`);
    const difficulty = ['ALWAYS', 'OFTEN'].includes(state.answers.loudEnoughButMumbled) || ['ALWAYS', 'OFTEN'].includes(state.answers.birdsChirping) || state.answers.overallRating === 'POOR';
    if (v === 'GOOD' && difficulty) notes.push(`<div class="note">${esc(t('mismatchNote'))}</div>`);
    if (!r.calibrated && v !== 'INCONCLUSIVE') notes.push(`<div class="note info">${esc(t('uncalNote'))}</div>`);

    const freqLabel = Object.fromEntries(FREQUENCY_ANSWERS.map(([val, key]) => [val, t(key)]));
    const answers = LISTENING.map(([key, , , short]) =>
      `<li><span>${esc(t(short))}</span><b>${esc(freqLabel[state.answers[key]] || '—')}</b></li>`).join('');

    return `
      <p class="eyebrow">${esc(t('resultsEyebrow'))}</p>
      <div class="verdict ${v}">
        <div class="icon">${icon}</div>
        <div><h1>${esc(t(v + '_title'))}</h1><p>${esc(t(v + '_short'))}</p></div>
      </div>
      <div class="notes">${notes.join('')}</div>

      <details class="more" open>
        <summary>${esc(t('whatMeans'))}</summary>
        <p>${esc(t(v + '_mean'))}</p>
      </details>

      <div class="cta">
        ${v === 'INCONCLUSIVE'
          ? `<button type="button" class="btn btn-primary btn-block" data-action="retake">${esc(t('retake'))}</button>`
          : `<div class="row">
               <button type="button" class="btn btn-primary" data-action="toggleDetails" aria-expanded="${detailsOpen}">${esc(t('detailed'))}</button>
               <button type="button" class="btn btn-secondary" data-action="exit">${esc(t('learn'))}</button>
             </div>
             <button type="button" class="btn btn-text" data-action="retake">↺ ${esc(t('retake'))}</button>`}
      </div>

      ${v !== 'INCONCLUSIVE' && detailsOpen ? viewDetails(r) : ''}

      <h2>${esc(t('answersTitle'))}</h2>
      <ul class="answers">${answers}</ul>`;
  }

  function summaryText() {
    const r = state.results;
    const lines = [t(r.verdict + '_title'), t(r.verdict + '_short'), ''];
    if (r.verdict !== 'INCONCLUSIVE') {
      for (const ear of ['R', 'L']) {
        lines.push(`${t(ear === 'R' ? 'earRight' : 'earLeft')} (${t('dbhl')}): ` + OUT_FREQS.map((f) => `${f} ${t('hz')} ${r.audiogram[ear][f]}`).join(', '));
      }
      lines.push('', t('estimateOnly'));
    }
    lines.push('', t('footer'));
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
      state.answers[el.dataset.key] = el.dataset.value;
      state.answerTimesMs[el.dataset.key] = Math.round(performance.now() - screenEnteredAt);
      el.parentElement.querySelectorAll('.option').forEach((b) => b.classList.toggle('selected', b === el));
      setTimeout(() => go(state.index + 1), 220);
    },

    channel(el) {
      const ear = el.dataset.value;
      root.querySelectorAll('.ear-btn').forEach((b) => b.classList.toggle('active', b === el));
      clearTimeout(channelTimer);
      Tone.start(1000, ear, CONFIG.levels.start - 10);
      channelTimer = setTimeout(() => { Tone.stop(); el.classList.remove('active'); }, 2300);
    },

    mic() {
      mic.status = 'listening';
      render();
      RoomCheck.run(
        (db) => {
          const bar = $('#micBar');
          if (bar) bar.style.width = Math.max(2, Math.min(100, (db + 90) * (100 / 70))) + '%';
        },
        (stats) => {
          if (SCREENS[state.index] !== 'quiet') return;
          const env = state.environment;
          if (stats == null) { mic.status = 'denied'; env.micStatus = 'UNAVAILABLE'; }
          else {
            env.micMedianDbfs = Math.round(stats.median);
            env.micP90Dbfs = Math.round(stats.p90);
            env.micMaxDbfs = Math.round(stats.max);
            env.micLoudShare = Math.round(stats.loudShare * 100) / 100;
            env.micDevice = stats.device;
            mic.status = stats.noisy ? 'noisy' : 'quiet';
            env.micStatus = mic.status.toUpperCase();
          }
          updateNoise();
          render();
        },
      );
    },

    noiseRating(el) {
      state.environment.selfRating = el.dataset.value;
      updateNoise();
      render();
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

    showResults() {
      state.results = computeResults();
      state.completed = true;
      state.endedAt = new Date().toISOString();
      go(state.index + 1);
    },

    toggleDetails() {
      detailsOpen = !detailsOpen;
      render();
      if (detailsOpen) $('#detailsPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    print() { window.print(); },
    copyResult(el) { copyText(summaryText(), el); },
    copyData(el) { copyText(JSON.stringify(state, null, 2), el); },
    download() {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `hearing-check-${state.id}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    },
    exit() { if (opts.onExit) opts.onExit(); },
    retake() {
      state = newState();
      state.consent = true;
      mic = null;
      go(1);
    },
  };

  // A completed microphone measurement decides; the self-rating only decides when the mic is unavailable.
  function updateNoise() {
    const env = state.environment;
    const measured = mic.status === 'quiet' || mic.status === 'noisy';
    env.noiseSource = measured ? 'MICROPHONE' : 'SELF_RATING';
    env.noiseMasked = measured ? mic.status === 'noisy' : env.selfRating === 'LOUD';
  }

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
    tone.presses.push({ op: delta < 0 ? 'UP' : 'DOWN', atMs: Math.round(performance.now() - tone.firstPlay), dbFullScale: target });
    Tone.setLevel(tone.att);
    updateToneUI();
  }

  // Stored like the live screener: dbFullScale is the attenuation in dB below full scale.
  function recordTone(status) {
    const s = SEQUENCE[toneIndex()];
    const rec = {
      dbFullScale: status === 'NOT_HEARD' ? CONFIG.levels.min : tone.att,
      measurementStatus: status,
      noiseMasked: state.environment.noiseMasked,
      durationInMilliseconds: Math.round(performance.now() - screenEnteredAt),
      volumeOperationsSequence: tone.presses,
    };
    state.measurements[earKey(s.ear)]['hz' + s.freq] = rec;
    state.measurements.BOTH[(s.ear === 'right' ? 'R' : 'L') + s.freq] = rec;
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

  function onKey(e) {
    if (!SCREENS[state.index].startsWith('tone') || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === '+' || e.key === '=' || e.key === 'ArrowUp') { e.preventDefault(); actions.louder(); }
    else if (e.key === '-' || e.key === '_' || e.key === 'ArrowDown') { e.preventDefault(); actions.quieter(); }
  }
  document.addEventListener('keydown', onKey);

  state = newState();
  screenEnteredAt = performance.now();
  render();

  return {
    setLang(next) {
      if (next === lang || (next !== 'ar' && next !== 'en')) return;
      lang = next;
      state.language = next;
      render();
    },
    destroy() {
      Tone.stop();
      RoomCheck.cancel();
      clearTimeout(channelTimer);
      document.removeEventListener('keydown', onKey);
    },
  };
}
