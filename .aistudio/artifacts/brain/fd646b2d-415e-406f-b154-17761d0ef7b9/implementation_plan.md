# Vision Medical x Hansaton Patient Hearing Aid Guide & Recommendation Advisor

A clinical, bilingual (Arabic & English) interactive guide and decision advisor that empowers patients to understand hearing aid technology, input their personal profile (age, gender, headwear/lifestyle, occupation, and daily listening environments), and receive tailored Hansaton hearing aid recommendations with side-by-side comparisons and a printable clinical summary sheet.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and user experience decisions were confirmed through Phase 1 clarification and grounded in the official medical guide:

- **Confirmed Language Support**: Full bilingual toggle (Arabic `<html dir="rtl">` & English `<html dir="ltr">`), with Arabic terminology faithfully aligned with the provided clinical Hansaton document.
- **Confirmed Structure**: An interactive step-by-step patient advisor coupled with a comprehensive educational guide (covering device form factors, performance tiers 1–9, lifestyle analysis, and color selection).
- **Confirmed Additional Tools**: A multi-device side-by-side comparison matrix and a clean printable/PDF-ready patient recommendation sheet to take directly to the audiologist.
- **Branding & Visuals**: Incorporates the authentic Vision Medical bilingual colored logo (`/public/assets/aistudio/Vision_Logo_En_Ar_-_Horizontal_Colors-1_31408bb2.jpg`) alongside official Hansaton branding, utilizing medical deep navy (`#0B2545`), clinical cyan (`#00A3E0`), warm accent orange (`#F39200`), and clean slate neutral surfaces.

---

## 1. Overview & Core Concept

- **What It Does**: 
  1. **Interactive Step-by-Step Advisor**: Guides patients through a 4-step personalized assessment:
     - **Step 1: Patient Profile**: Age group (<18, 18–34, 35–54, 55–64, 65–74, 75+), gender, and headwear habits (Hijab, Niqab, Ghutra/Shemagh, glasses, helmets/headphones).
     - **Step 2: Occupation & Daily Environments**: Fieldwork/construction, healthcare/clinic, teaching, corporate executive/sales, desk/remote, homemaker/retired.
     - **Step 3: Lifestyle & Listening Scenarios**: 9 documented listening environments (home 1-on-1, phone/TV, family gatherings, cafes/markets, meetings/dining, lectures/places of worship, large events/sports, car conversations, frequent travel).
     - **Step 4: Personal Priorities & Ergonomics**: Rechargeability (sound E-R lithium-ion), physical invisibility (CIC), ease of handling/dexterity (BTE), budget consciousness, or advanced phone/Bluetooth streaming.
  2. **Personalized Clinical Recommendation Engine**: Evaluates answers against the official Hansaton decision tree (Essenz BTE/RIC/sound E-R, FOKUS / STRATOS ITE/CIC, and Performance Levels 1, 3, 5, 7, 9) to output primary and secondary recommendations with clear medical rationale.
  3. **Interactive Side-by-Side Comparison Tool**: Allows patients to compare any 2 or 3 models across channels (12 to 20), sound environments (1 to 8), features (StereoBeam, Dynamic SpeechBeam, Soft SpeechBoost, SphereSound Natural, Tap Control, IP68 rating, battery type).
  4. **Educational Knowledge Base**: Explains how hearing aids work, differences between BTE, RIC, ITE, and CIC, the 5 performance tiers, color matching (Sterling Silver, Carbon Black, Mocha Brown, Cashmere Beige, Metallic Anthracite), and the MarketTrak IX early intervention timeline.
  5. **Printable / Exportable Patient Summary**: Formatted clinical sheet ready for printing or saving as PDF, containing patient answers, recommended model and level, key rationale, and questions to ask their audiologist during appointment.

- **Target Audience / Persona**:
  - Patients experiencing hearing challenges and their family members seeking trustworthy, non-intimidating guidance.
  - Audiologists and hearing care professionals at Vision Medical guiding patients through product selection.

- **Key Value**:
  - Demystifies technical jargon into clear lifestyle benefits.
  - Aligns patient self-assessment with clinical audiology workflows (Lifestyle Analyzer / Hansaton Essenz & FOKUS portfolios).

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Discovery & Education Hub**:
   - Patient lands on the portal; can toggle between Arabic (RTL) and English (LTR) at any time.
   - Quick navigation to: *Interactive Advisor*, *Device Types Guide (BTE/RIC/ITE/CIC)*, *Performance Tiers (1–9)*, *Color Matching*, and *Comparison Matrix*.
2. **Interactive Advisor Flow**:
   - Progress bar with 4 clear milestones.
   - Interactive visual cards for age, headwear, occupation, and listening environments.
   - Real-time tally of lifestyle complexity score corresponding to levels 1, 3, 5, 7, or 9.
3. **Recommendation Result View**:
   - Best-match hearing aid card with performance level badge (e.g., Level 9 - Flagship / Level 7 - Business / Level 5 - Practical).
   - "Why this fits you" personalized breakdown based on their exact selections (e.g., "Recommended ITE/CIC because you wear Hijab/Ghutra to prevent friction", "Level 9 recommended because of frequent car conversations").
   - Action buttons: "Compare with Alternative", "Print Patient Summary", and "Retake Assessment".
4. **Side-by-Side Comparison Modal / View**:
   - Sticky header with selected devices.
   - Feature-by-feature matrix highlighting advantages and trade-offs.
5. **Printable Clinical Summary Sheet**:
   - Clean, high-contrast, black-and-white optimized layout with Vision Medical & Hansaton headers, patient selections summary, primary & alternative recommendations, and clinical notes section for the audiologist.

### Visual Identity & Theme

- **Aesthetic Direction**: Clinical clarity, reassuring warmth, and modern medical precision. No generic gradient "AI slop", no decorative floating dots, and no artificial tech buzzwords.
- **Color Palette**:
  - Dominant Neutral Canvas (60%): Crisp clinical slate-50 (`#F8FAFC`) and pure white (`#FFFFFF`) cards.
  - Structural Surfaces (30%): Deep medical navy (`#0B2545`) for primary headings, borders in hairline neutral (`#E2E8F0`), muted text in slate-600 (`#475569`).
  - Accent Budget (10%): Vision Medical Cyan (`#00A3E0`) and Hansaton Red/Burgundy (`#D0021B`) for active states, key CTAs, and verified markers.
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans` for English, native system Arabic font stack (`system-ui, -apple-system, 'Segoe UI', Tahoma, Arial`) with bold weights and balanced line-heights.
  - Body Text: High-legibility regular weights (`15px–16px`, `leading-relaxed`).
  - Tabular Numbers: `font-mono tabular-nums` for channels (12, 16, 20), battery life (16h), and environment count (1, 2, 4, 6, 8).
- **Zero-Pill Discipline**:
  - Metadata rendered as unboxed text separated by bullets (`·`) or quiet inline tags.
  - Buttons and segmented tabs are functional interactive elements with clear active states.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side State Management vs Server Database**
  - *Chosen Approach*: Reactive local state in React, allowing instant step navigation, dynamic filtering, session persistence via `localStorage`, and zero-latency recommendations without requiring cloud sign-in.
  - *Why*: Patients evaluating medical options prioritize privacy and instant results without creating accounts or waiting for backend round-trips.
- **Decision 2: Faithful Knowledge Alignment with Official Hansaton Documentation**
  - *Chosen Approach*: Ground every recommendation, environment count, channel specification, and lifestyle rule strictly in the shared PDF (Hansaton Essenz & FOKUS/stratos line).
  - *Why*: Medical guidelines require strict factual adherence; patients and audiologists need accurate specs (e.g., Tap Control, IP68, 16-hour rechargeable battery, SphereSound Natural, Dynamic SpeechBeam in car).
- **Decision 3: Dedicated Print Stylesheet (`@media print`)**
  - *Chosen Approach*: Integrated CSS print engine that strips out interactive navigation and buttons, rendering an official medical consultation referral sheet suitable for office printing or browser "Save as PDF".
  - *Why*: Patients can physically take their report to their local Vision Medical clinic or audiologist.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Navigation Bar                              │
│   [Vision Medical & Hansaton Logos] ── [Nav Links] ── [Language Toggle]│
└────────────────────────────────────────────────────────────────────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
┌─────────────────────────────────┐           ┌──────────────────────────────────┐
│      Interactive Advisor        │           │       Educational Guide Hub      │
│  - Step 1: Age & Headwear       │           │  - Device Types (BTE, RIC, ITE,  │
│  - Step 2: Profession & Noise   │           │    CIC, sound E-R rechargeable)  │
│  - Step 3: Listening Scenarios  │           │  - Performance Tiers (1,3,5,7,9) │
│  - Step 4: Priorities & Tech    │           │  - Color Matching System         │
│  - Real-time Scoring Logic      │           │  - MarketTrak Intervention Tips  │
└─────────────────────────────────┘           └──────────────────────────────────┘
                 │                                              │
                 ▼                                              ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Recommendation & Action View                      │
│   - Primary Recommended Model (Essenz / FOKUS) + Performance Tier      │
│   - Key Clinical Rationales (Headwear fit, Car SpeechBeam, IP68, etc.) │
│   - Alternative Option Comparison                                      │
└────────────────────────────────────────────────────────────────────────┘
                 │                                              │
                 ▼                                              ▼
┌─────────────────────────────────┐           ┌──────────────────────────────────┐
│   Side-by-Side Comparison Tool  │           │    Printable Clinical Summary    │
│  - Compare 2–3 Hansaton models  │           │  - Patient assessment summary    │
│  - Specs, Channels, Features    │           │  - Doctor consultation checklist │
└─────────────────────────────────┘           └──────────────────────────────────┘
```

### Data Model & Entities

- `HearingAidModel`:
  - `id`: string (`essenz-bte`, `essenz-ric`, `essenz-sound-er`, `fokus-ite`, `fokus-cic`)
  - `name`: bilingual string (Arabic & English)
  - `family`: `'Essenz'` | `'FOKUS / STRATOS'`
  - `placement`: string (`Behind-the-ear`, `Receiver-in-canal`, `In-the-ear`, `Completely-in-canal`)
  - `powerSource`: `'Battery'` | `'Rechargeable Lithium-ion'`
  - `idealHearingLoss`: string (`Mild to Severe`, `Mild to Moderate`)
  - `keyFeatures`: list of feature keys
  - `colors`: list of available color variants
  - `bestFor`: criteria (seniors, active adults, glasses/hijab wearers, phone users)
- `PerformanceLevel`:
  - `level`: `1` | `3` | `5` | `7` | `9`
  - `nameAr`: string (`الأساسي`, `الاقتصادي`, `العملي`, `رجال الأعمال`, `الأول`)
  - `nameEn`: string (`Basic`, `Essential`, `Practical`, `Business`, `First / Flagship`)
  - `environmentsCount`: number (`1`, `2`, `4`, `6`, `8`)
  - `channels`: number (`12`, `16`, `20`)
  - `features`: array of feature names with bilingual descriptions
- `PatientProfile`:
  - `age`: string
  - `gender`: string
  - `headwear`: string[] (hijab, niqab, ghutra, glasses, helmet, none)
  - `profession`: string
  - `selectedEnvironments`: string[] (from the 9 documented scenarios)
  - `priorities`: string[] (invisibility, noBatteryChange, budget, durability, phoneCalls)

---

## Verification & Compilation Plan

1. Verify all types, state models, and translations.
2. Build interactive quiz transitions and ensure all buttons have active handlers.
3. Validate RTL/LTR dynamic direction switching and bilingual rendering.
4. Test print preview rendering.
5. Run `compile_applet` to ensure zero compilation or TypeScript errors.
