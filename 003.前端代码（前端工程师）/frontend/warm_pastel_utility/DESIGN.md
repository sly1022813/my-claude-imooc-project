---
name: Warm Pastel Utility
colors:
  surface: '#fbf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#544245'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#877275'
  outline-variant: '#dac0c4'
  surface-tint: '#9b3f5a'
  primary: '#9b3f5a'
  on-primary: '#ffffff'
  primary-container: '#ff8fab'
  on-primary-container: '#79243f'
  inverse-primary: '#ffb1c2'
  secondary: '#884c5d'
  on-secondary: '#ffffff'
  secondary-container: '#fdb2c5'
  on-secondary-container: '#7a4151'
  tertiary: '#ac2a5d'
  on-tertiary: '#ffffff'
  tertiary-container: '#ff8eb0'
  on-tertiary-container: '#870442'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e0'
  primary-fixed-dim: '#ffb1c2'
  on-primary-fixed: '#3f0018'
  on-primary-fixed-variant: '#7d2742'
  secondary-fixed: '#ffd9e1'
  secondary-fixed-dim: '#fdb2c5'
  on-secondary-fixed: '#370a1b'
  on-secondary-fixed-variant: '#6c3546'
  tertiary-fixed: '#ffd9e1'
  tertiary-fixed-dim: '#ffb1c5'
  on-tertiary-fixed: '#3f001b'
  on-tertiary-fixed-variant: '#8c0a46'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
  income-mint: '#7ED7C1'
  expense-coral: '#FF6B6B'
  pending-amber: '#FFB347'
  surface-cream: '#FFF5F7'
  surface-card: '#FFFFFF'
  border-soft: '#FFE4E8'
  text-secondary: '#666666'
  text-muted: '#999999'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  caption-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  amount-display:
    fontFamily: Space Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
  amount-lg:
    fontFamily: Space Mono
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  amount-md:
    fontFamily: Space Mono
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  amount-sm:
    fontFamily: Space Mono
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

The design system is crafted specifically for solo entrepreneurs, small merchants, and everyday individuals who need financial clarity without bureaucratic intimidation. Traditional accounting software feels cold, audit-heavy, and rigid; this design system subverts that paradigm through a warm, approachable, and refreshing visual atmosphere centered around cherry blossom tones and clean, structured data hygiene.

The overarching design aesthetic fuses **Soft Modern Utility** with **Japanese/Nordic Warm Minimalism**:
- **Affable & De-stressing:** Soft pastel backgrounds (`#FFF5F7`) dissolve bookkeeping anxiety while maintaining absolute clarity and focus on key numbers.
- **Snappy Micro-interactions:** Tactile feedback on taps (`scale(0.96)`) and fast page transitions create the responsive, physical feeling of tapping on a physical pocket ledger.
- **Strict Data Hierarchy:** Gentle pastel surfaces cradle crisp, unmistakable semantic indicators for rapid balance, income, and expense recognition at a glance.

## Colors

The color system uses an intentionally comforting, blush-tinted canvas to counter financial stress, balanced by high-clarity semantic accents that ensure fast decision-making.

### Roles & Semantic Application
- **Primary (`#FF8FAB`)**: The signature Sakura Pink. Anchors primary navigation highlights, core brand badges, and positive active states.
- **Secondary (`#FFB3C6`)**: Muted Rose Pink. Used for secondary toggles, subtle pill outlines, and light progress indicator fills.
- **Tertiary / Accent (`#FF6B9D`)**: Deep Coral Pink. Reserved for primary call-to-action buttons ("Save Record", "Quick Add") and high-priority notices.
- **Functional Semantics**:
  - `income-mint` (`#7ED7C1`): Strict signifier for inflows, positive cash flow, and `+` value prefixes.
  - `expense-coral` (`#FF6B6B`): Immediate alert for outflows, losses, and `-` value prefixes.
  - `pending-amber` (`#FFB347`): Warning/attention indicator for unsettled accounts, payables, and receivables.
- **Canvas & Neutrals**:
  - The canvas uses `surface-cream` (`#FFF5F7`), avoiding stark pure-white glare on mobile screens.
  - Card modules rest cleanly on `surface-card` (`#FFFFFF`) with borders framed strictly by `border-soft` (`#FFE4E8`).
  - Text maintains a 3-tier hierarchy: primary reading text (`#333333`), secondary helper strings (`#666666`), and placeholder/disabled values (`#999999`).

## Typography

The type system pairs the soft, humanist curves of **Plus Jakarta Sans** for interfaces and narrative labels with the disciplined, fixed-width metrics of **Space Mono** for financial digits.

- **Monospace Tabular Numerals**: Every transaction row, monthly summary, and calculator pad input must render with tabular numeric properties or `Space Mono`. This eliminates horizontal shifting when digits increment and guarantees vertical alignment across cents and decimal points.
- **Micro-Copy Rules**: Timestamps, notes, and auxiliary categorization tags strictly rely on `caption-sm` colored in `text-muted` (`#999999`) to keep cards visually uncluttered.
- **Display Weights**: Bold weights are restricted to top-level card metrics and headers to sustain a light, breathable reading rhythm.

## Layout & Spacing

This design system is tailored for a mobile-first, vertical viewport (target base width: 375px–428px). When rendered on wider tablet or desktop viewports, the application canvas locks to a centered shell with a max-width of `430px`, flanked by soft ambient outer gutters.

- **Grid & Safe Frame**:
  - Global outer margin: `margin` (`16px / 1rem`).
  - Column gutter: `gutter` (`12px / 0.75rem`).
  - Section vertical rhythm: `space-xl` (`24px`) between card groups and analytical blocks.
- **Rhythm Multiples**:
  - `space-xs` (4px): Metric-to-currency symbol gaps, badge internal padding.
  - `space-sm` (8px): Icon-to-label gaps, chip container padding, row item compact spacing.
  - `space-md` (12px): Standard form element gap, vertical separation within composite list items.
  - `space-lg` (16px): Internal padding for white container cards.
  - `space-xl` (24px): Boundary spacing between macro dashboard zones.

## Elevation & Depth

To maintain a clean, lightweight, and modern feel, the design system avoids heavy, muddy drop shadows. Visual depth is established primarily through **Surface Tiers** and **Delicate Rose-Tinted Ghost Borders**:

- **Tier 0 (Base Canvas)**: Flat `#FFF5F7`. Continuous foundation for scrollable H5 views.
- **Tier 1 (Surface Cards & Floating Panes)**: Crisp `#FFFFFF` surface bounded by a crisp `1px solid #FFE4E8` stroke. When extra separation is required over the canvas, an ultra-soft tinted ambient shadow is introduced:
  `box-shadow: 0 4px 16px -2px rgba(255, 143, 171, 0.12)`.
- **Tier 2 (Bottom Sheet / Numeric Keypad Modal)**: Solid `#FFFFFF` elevated via `box-shadow: 0 -8px 24px -4px rgba(255, 107, 157, 0.08)` and separated by a subtle top border `#FFE4E8`.
- **Tier 3 (Floating Feedback / Toast)**: Semi-translucent dark neutral `#333333` with 90% opacity or a primary blush pill with 4px backdrop blur, elevated above all application flows.

## Shapes

The shape architecture relies on a friendly, organic curvature (`roundedness: 2`) that reinforces the approachable nature of the brand:

- **Interactive Controls (Buttons, Inputs, Date Selectors)**: `8px` (`0.5rem`) corner radius. Fits the thumb profile without feeling pill-exaggerated.
- **Content Cards & Summary Dashboards**: `12px` to `16px` (`rounded-lg` to `rounded-xl`) corner radius, creating a comfortable visual boundary for ledger entries.
- **Chips, Category Avatars & Floating Add Action**: Pill shape (`9999px` / `50%`) to denote instantaneous tap targets and tactile interaction points.

## Components

### Buttons
- **Primary CTA ("记一笔" / "确认")**: Solid `#FF6B9D` fill with `#FFFFFF` text. Micro-transition active state: `transform: scale(0.96)` for 80ms. Height: `44px` on mobile for thumb accessibility.
- **Secondary Action**: Border `1.5px solid #FF8FAB`, text `#FF6B9D`, background `transparent`.
- **Ghost Action**: Background `transparent`, text `#666666`, hover/active background `#FFF5F7`.

### Cards & Ledger Containers
- Pure white background (`#FFFFFF`) with a continuous border of `1px solid #FFE4E8`.
- Inner padding: `space-lg` (`16px`).
- Header row contains the category grouping and aggregate day total formatted via `Space Mono`.

### Chips (Transaction Categories)
- Unselected: Background `#FFF5F7`, text `#666666`, border `1px solid transparent`.
- Selected: Background `#FFE4E8`, text `#FF6B9D`, border `1px solid #FF8FAB`.
- Displays pre-configured emoji icons (`🍜`, `📦`, `💰`) aligned 6px to the left of the label text.

### Form Inputs & Numeric Keypad
- **Amount Input**: Monospace headline display (`32px`), zero border, baseline anchored with `#FFE4E8` divider. Prefix `¥` in muted red or mint depending on current ledger tab.
- **Standard Inputs (Note / Payee)**: Height `44px`, background `#FFFFFF`, border `1px solid #FFE4E8`, rounded `8px`, text `#333333`. Placeholder in `#999999`.

### Lists & Transaction Entries
- Flush lists with border separators of `0.5px solid #FFE4E8`.
- Left slot: `40px` circular category avatar with soft pastel background.
- Center slot: Primary note title with secondary date/time underneath (`caption-sm`).
- Right slot: Monospace value (`Space Mono`, `amount-md`). Positive income in `#7ED7C1` prefixed with `+`, expense in `#FF6B6B` prefixed with `-`.

### Checkboxes & Segmented Tabs
- **Segmented Segment Control (支出 / 收入 / 待收)**:
  Contained within a pill frame `#FFF5F7`. The active tab transitions with a white sliding card, soft shadow, and bold text colored to match the respective functional role.