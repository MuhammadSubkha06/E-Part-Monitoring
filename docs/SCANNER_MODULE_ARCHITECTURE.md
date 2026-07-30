# Android Scanner Module — Architecture & Design Specification

Industrial-grade barcode/QR scanner module for **PCB Parts**, **IC Reel**, and **IC Tray**
material traceability. Built with React Native CLI + TypeScript, Repository Pattern, and a
Service Layer that isolates every screen from how data is fetched — so wiring a real REST API
later is a one-file change (`services/MaterialService.ts`).

---

## 1. Folder Structure

```
src/modules/scanner/
├── components/            # 16 reusable, presentation-only components
│   ├── StatusBadge.tsx
│   ├── SectionCard.tsx
│   ├── InfoCard.tsx
│   ├── MaterialSummary.tsx
│   ├── ExposureCard.tsx
│   ├── ShelfLifeCard.tsx
│   ├── HistoryTimeline.tsx
│   ├── TransactionFooter.tsx
│   ├── ScannerCamera.tsx
│   ├── ScannerFrame.tsx
│   ├── ScannerOverlay.tsx
│   ├── ConfirmationDialog.tsx
│   ├── LoadingOverlay.tsx
│   ├── SuccessDialog.tsx
│   ├── EmptyState.tsx
│   └── ErrorState.tsx
│
├── screens/                # 5 independent transaction modules
│   ├── StockInScreen.tsx
│   ├── StockOutScreen.tsx
│   ├── ReturnMcDryScreen.tsx
│   ├── HistoryScreen.tsx
│   └── InformationScreen.tsx
│
├── hooks/
│   └── useScannerFlow.ts   # drives the single linear scan->transaction flow
│
├── services/
│   └── MaterialService.ts  # <-- the ONLY import screens use to get data
│
├── repositories/
│   ├── MaterialRepository.ts       # interface (contract for REST impl)
│   ├── DummyMaterialRepository.ts  # in-memory implementation (current)
│   └── seedData.ts                # realistic dummy manufacturing data
│
├── utils/
│   ├── exposureCalculator.ts       # Reel/Tray exposure business rule
│   ├── shelfLifeCalculator.ts      # PCB shelf-life business rule
│   ├── materialDerivedState.ts     # combines both -> status badges
│   └── dateUtils.ts
│
├── types/
│   ├── material.types.ts
│   └── scanner.types.ts
│
└── constants/
    ├── theme.ts            # colors, spacing, typography, elevation
    ├── statusConfig.ts      # single source of truth for all 14 badges
    ├── businessRules.ts     # PCB 60-day rule, exposure warning %, baking limit
    └── demoQrCodes.ts        # quick-pick chips for demoing without hardware
```

**Layer rule:** Screens → Hooks → Service → Repository. A screen never imports a repository
directly. This is what makes "replace dummy data with REST API" a single-file change:

```ts
// services/MaterialService.ts
export const materialService = new MaterialService(new DummyMaterialRepository());
// becomes, later:
export const materialService = new MaterialService(new RestMaterialRepository(httpClient));
```

---

## 2. Component Hierarchy

```
StockInScreen / StockOutScreen / ReturnMcDryScreen / HistoryScreen / InformationScreen
│
├── (step: IDLE_SCANNING)
│   └── ScannerCamera
│       ├── ScannerOverlay
│       │   └── ScannerFrame
│       └── (permission-denied state, demo quick-pick chips)
│
├── (step: LOADING)
│   └── LoadingOverlay
│
├── (step: ERROR)
│   └── ErrorState -> StatusBadge (INVALID_QR / MASTER_DATA_NOT_FOUND)
│
└── (step: RESULT_READY / SUBMITTING / SUCCESS)
    ├── MaterialSummary -> StatusBadge (x N)
    ├── SectionCard "Master Data" -> InfoCard (x N)
    ├── ExposureCard (IC Reel/Tray only)
    ├── ShelfLifeCard (PCB only)
    ├── SectionCard "Event Timeline" -> HistoryTimeline   (History screen only)
    ├── TransactionFooter (Cancel / Confirm)               (transactional screens)
    └── SuccessDialog                                      (transactional screens)
```

---

## 3. Screen Wireframe (text description)

Every transactional screen shares the same skeleton:

```
┌─────────────────────────────────────┐
│ Header: Screen Title + subtitle     │  <- flat white header, thin bottom border
├─────────────────────────────────────┤
│                                     │
│         CAMERA VIEWFINDER          │  <- ~65% of screen height
│        (bracketed scan frame,      │
│         animated scan line,        │
│         torch button, connection   │
│         indicator)                 │
│                                     │
├─────────────────────────────────────┤
│ Part Number / Part Name / Lot      │  <- MaterialSummary
│ [STATUS] [EXPOSURE WARNING] ...    │  <- badge row
├─────────────────────────────────────┤
│ MASTER DATA                        │  <- SectionCard, 2-col InfoCard grid
│  Maker        Quantity             │
│  Category     Packaging            │
│  ...                               │
├─────────────────────────────────────┤
│ EXPOSURE  (Reel/Tray only)         │  <- progress bar + banner
│ or SHELF LIFE (PCB only)           │
├─────────────────────────────────────┤
│ [ Cancel ]      [ Confirm Action ] │  <- sticky bottom TransactionFooter
└─────────────────────────────────────┘
```

History and Information screens replace the sticky footer with a single
"Back to Scanner" / "Scan Another" button, since they perform no transaction.

---

## 4. Navigation Flow

```
Dashboard
 ├─ Stock In        -> ModuleStockIn        -> (auto) back to Dashboard-level scanner
 ├─ Stock Out       -> ModuleStockOut       -> (auto) back to scanner
 ├─ Return MC Dry   -> ModuleReturnMcDry    -> (auto) back to scanner
 ├─ History         -> ModuleHistory        -> Back to Scanner (manual)
 └─ Information     -> ModuleInformation    -> Scan Another (manual)
```

Within every module screen the internal flow is identical and linear:

```
QR Scan -> Loading -> Validate QR -> Read Master Data -> Read Material State
   -> Display Result -> Perform Transaction (if applicable) -> Success
   -> Automatically return to Scanner
```

This is implemented once, generically, in `hooks/useScannerFlow.ts` — each screen
only supplies which repository action (if any) `confirm()` should call.

---

## 5. UI Design Specification

**Visual language:** SAP Fiori / Denso MES / Siemens Industrial / Honeywell & Zebra
scanner UIs — flat, high-contrast, thin borders, no gradients, no glassmorphism, no
neumorphism, very small shadows, compact spacing, large glove-friendly touch targets
(min 52dp).

### Color Palette (`constants/theme.ts`)

| Token | Hex | Usage |
|---|---|---|
| primary | `#1068EC` | Primary actions, links, category label |
| primaryLight | `#E6F0FE` | Selected/info surfaces |
| background | `#F5F7FA` | Screen background |
| surface | `#FFFFFF` | Cards, headers, footers |
| border | `#E2E5EA` | Card/section hairlines |
| borderStrong | `#C7CDD6` | Secondary button borders |
| textPrimary | `#111827` | Headings, primary values |
| textSecondary | `#4B5563` | Body copy |
| textMuted | `#8A94A6` | Labels, captions |
| success / successBg | `#15803D` / `#DCFCE7` | AVAILABLE, BAKING COMPLETED |
| warning / warningBg | `#B45309` / `#FEF3C7` | EXPOSURE RUNNING |
| danger / dangerBg | `#B91C1C` / `#FEE2E2` | EXPIRED, INVALID_QR, errors |
| info / infoBg | `#0369A1` / `#E0F2FE` | STOCK IN, MC DRY, paused banners |
| amber / amberBg | `#D97706` / `#FEF3C7` | EXPOSURE WARNING |
| purple / purpleBg | `#6D28D9` / `#EDE9FE` | NEED BAKING |
| scanLine | `#22D3EE` | Animated scanner line + frame brackets |

### Typography

| Style | Size / Weight | Usage |
|---|---|---|
| h1 | 22 / 700 | Screen titles |
| h2 | 18 / 700 | Dialog titles |
| h3 | 15 / 700 | Metric values |
| body | 14 / 400 | Descriptions |
| bodyStrong | 14 / 600 | Emphasized values, buttons |
| label | 12 / 600 | Section titles, badges (uppercase) |
| caption | 11 / 500 | Field labels, timestamps |
| mono | 14 / 600, monospace | Part numbers, lot numbers |

### Spacing System

`xxs 2 · xs 4 · sm 8 · md 12 · lg 16 · xl 20 · xxl 24 · xxxl 32` (pixels) — every
component pulls from this scale; no ad-hoc magic numbers.

### Status Badge System (`constants/statusConfig.ts`)

Single lookup table, 14 entries, each with `{ label, color, background }`:
`AVAILABLE, STOCK_IN, STOCK_OUT, MC_DRY, EXPOSURE_RUNNING, EXPOSURE_PAUSED,
EXPOSURE_WARNING, EXPOSURE_EXPIRED, PCB_EXPIRED, NEED_BAKING, BAKING_COMPLETED,
BAKING_LIMIT_REACHED, MASTER_DATA_NOT_FOUND, INVALID_QR`. Adding a new status is a
one-line addition here — `StatusBadge.tsx` itself never changes.

---

## 6. Industrial Design Guideline (summary)

1. **White background, thin gray borders** — `Colors.surface` + `Colors.border`, 1px hairlines, radius 6–10dp, shadow opacity ≤ 0.1.
2. **No gradients / neumorphism / glassmorphism** — every surface is a flat fill.
3. **Large scan area** — camera occupies 65% of viewport height; bracketed frame at ~78% width, capped at 300dp, so it reads clearly at arm's length under factory lighting.
4. **Compact but legible spacing** — 12–16dp card padding, 2-column info grids to keep information dense without crowding.
5. **High contrast status communication** — every badge pairs a solid dot + colored label on a tinted (not saturated) background, readable in bright/dim factory lighting alike.
6. **Glove-friendly touch targets** — all primary buttons ≥ 52dp height.
7. **Sticky bottom action bar** — Cancel/Confirm never scrolls out of reach.
8. **Predictable return-to-scan** — every transaction ends the same way: a large SuccessDialog that auto-dismisses back to the camera, minimizing operator taps per cycle.

---

## 7. Business Rules Reference

**PCB rule** — Shelf life starts at Manufacturing Date, duration from Master Data.
Once opened, if the part is Flux Type 3, remaining shelf life is force-reset to a
fixed 60-day window from Open Package Date (`utils/shelfLifeCalculator.ts`).

**Reel/Tray rule** — Exposure begins at Open Package. Entering MC Dry freezes
`currentExposureHours` (paused); leaving MC Dry resumes accrual from the frozen
value (`utils/exposureCalculator.ts`). Stock Out also freezes/stops the timer per
the Stock Out workflow.

---

## 8. Swapping in a Real Camera

`components/ScannerCamera.tsx` is the single seam for hardware integration. Replace
its placeholder viewfinder `<View>` with a `<Camera />` from
`react-native-vision-camera` (+ an ML Kit or ZXing barcode frame processor) and call
`onScan(decodedPayload)` when a code resolves. No other file in the module needs to
change — the flow, repository, and every screen already only depend on `onScan`.

## 9. Swapping in the Real Backend

Implement `RestMaterialRepository implements MaterialRepository` in
`repositories/`, calling your REST/GraphQL endpoints for `findByQrCode`,
`getHistory`, `isFluxType3`, `stockIn`, `stockOut`, and `returnToMcDry`. Update the
one line in `services/MaterialService.ts` that constructs `materialService`. No
screen, hook, or component changes required.
