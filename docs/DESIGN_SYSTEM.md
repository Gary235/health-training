# Health & Training App — Design System
## Calm & Clinical + AI First

A comprehensive design guide for transforming the existing health and training app into a trustworthy, low-cognitive-load personal health system.

---

## 1. Visual Language

### Color Palette

#### Foundation (Neutrals)
**Why these exist:** Create a calm, readable baseline. Health data should be easy to scan without visual fatigue.

```css
/* Light Mode */
--neutral-50: 250 250 250;    /* Page background */
--neutral-100: 244 244 245;   /* Card background */
--neutral-200: 228 228 231;   /* Dividers, disabled states */
--neutral-300: 212 212 216;   /* Borders */
--neutral-400: 161 161 170;   /* Meta text, placeholders */
--neutral-500: 113 113 122;   /* Helper text */
--neutral-600: 82 82 91;      /* Secondary text */
--neutral-700: 63 63 70;      /* Body text */
--neutral-800: 39 39 42;      /* Headings */
--neutral-900: 24 24 27;      /* Emphasis text */

/* Dark Mode */
--neutral-950: 9 9 11;        /* Page background */
--neutral-900: 24 24 27;      /* Card background */
--neutral-800: 39 39 42;      /* Elevated cards */
--neutral-700: 63 63 70;      /* Borders */
--neutral-600: 82 82 91;      /* Meta text */
--neutral-500: 113 113 122;   /* Helper text */
--neutral-400: 161 161 170;   /* Secondary text */
--neutral-300: 212 212 216;   /* Body text */
--neutral-200: 228 228 231;   /* Headings */
--neutral-100: 244 244 245;   /* Emphasis */
```

#### AI Accent (Restrained)
**Why it exists:** Mark AI-generated or AI-influenced content with subtle trust-building color.
**Where it's used:** AI badges, plan generation indicators, adaptive insights
**Where it's NOT used:** Navigation, primary actions, user-input areas

```css
/* Indigo — clinical, intelligent, not aggressive */
--ai-accent: 238 235 255;           /* AI badge background (light) */
--ai-accent-text: 79 70 229;        /* AI indicator text (light) */
--ai-accent-border: 199 193 255;    /* AI borders, subtle highlights */
--ai-accent-hover: 224 217 255;     /* Hover states */

/* Dark mode */
--ai-accent-dark: 37 33 79;         /* AI badge background */
--ai-accent-text-dark: 165 159 255; /* AI text */
--ai-accent-border-dark: 67 56 202; /* AI borders */
```

#### Semantic Colors
**Why these exist:** Communicate status without words. Restrained, not alarming.

```css
/* Success — adherence, completed actions */
--success-bg: 240 253 244;
--success-text: 22 101 52;
--success-border: 187 247 208;

/* Warning — needs attention, adjustment recommendations */
--warning-bg: 254 252 232;
--warning-text: 133 77 14;
--warning-border: 253 230 138;

/* Error — skipped, critical issues */
--error-bg: 254 242 242;
--error-text: 153 27 27;
--error-border: 254 202 202;

/* Info — neutral system messages */
--info-bg: 239 246 255;
--info-text: 29 78 216;
--info-border: 191 219 254;
```

#### Implementation in Tailwind Config

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        // Neutrals
        neutral: {
          50: 'rgb(250 250 250)',
          100: 'rgb(244 244 245)',
          200: 'rgb(228 228 231)',
          300: 'rgb(212 212 216)',
          400: 'rgb(161 161 170)',
          500: 'rgb(113 113 122)',
          600: 'rgb(82 82 91)',
          700: 'rgb(63 63 70)',
          800: 'rgb(39 39 42)',
          900: 'rgb(24 24 27)',
          950: 'rgb(9 9 11)',
        },
        // AI Accent
        ai: {
          DEFAULT: 'rgb(79 70 229)',
          light: 'rgb(238 235 255)',
          border: 'rgb(199 193 255)',
          hover: 'rgb(224 217 255)',
        },
        // Semantics
        success: {
          DEFAULT: 'rgb(22 101 52)',
          bg: 'rgb(240 253 244)',
          border: 'rgb(187 247 208)',
        },
        warning: {
          DEFAULT: 'rgb(133 77 14)',
          bg: 'rgb(254 252 232)',
          border: 'rgb(253 230 138)',
        },
        error: {
          DEFAULT: 'rgb(153 27 27)',
          bg: 'rgb(254 242 242)',
          border: 'rgb(254 202 202)',
        },
        info: {
          DEFAULT: 'rgb(29 78 216)',
          bg: 'rgb(239 246 255)',
          border: 'rgb(191 219 254)',
        },
      },
    },
  },
}
```

---

## 2. Typography System

### Font Stack

#### Primary UI Font
**Choice:** Inter or System UI stack
**Why:** Exceptional readability at all sizes, neutral, modern without being trendy

```css
font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
             'Segoe UI', Roboto, sans-serif;
```

If not using Inter, use:
```css
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
             'Segoe UI', Roboto, sans-serif;
```

#### Numeric/Metric Font (Optional)
**Choice:** Tabular numbers variant of Inter or `font-variant-numeric: tabular-nums`
**Why:** Aligns metrics, calories, weights for easier scanning
**Where:** Body metrics tables, nutrition data, adherence percentages

```css
font-feature-settings: "tnum";
font-variant-numeric: tabular-nums;
```

### Type Scale

**Priorities:** Calm hierarchy, no oversized headings, scannable rhythm

```js
// tailwind.config.js
fontSize: {
  // Meta and helper text
  'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],     // 12px
  'sm': ['0.875rem', { lineHeight: '1.25rem' }],                           // 14px

  // Body text
  'base': ['0.9375rem', { lineHeight: '1.5rem' }],                         // 15px

  // Section labels, card titles
  'md': ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }],             // 16px

  // Subsection headers
  'lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '600' }],        // 18px

  // Page titles
  'xl': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],         // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],            // 24px

  // Large metrics (adherence %, weight)
  'metric-lg': ['2.25rem', { lineHeight: '1', fontWeight: '700' }],        // 36px
  'metric-xl': ['3rem', { lineHeight: '1', fontWeight: '700' }],           // 48px
}
```

### Usage Guide

```tsx
// Page title
<h1 className="text-xl text-neutral-900">Daily Plan</h1>

// Section header
<h2 className="text-lg text-neutral-800">Today's Meals</h2>

// Card title
<h3 className="text-md text-neutral-800">Breakfast</h3>

// Body text
<p className="text-base text-neutral-700">Oatmeal with berries and almonds</p>

// Meta text (time, status)
<span className="text-sm text-neutral-500">8:00 AM</span>

// Helper text
<span className="text-xs text-neutral-400">Optional</span>

// Large metric
<div className="text-metric-lg font-tabular text-neutral-900">85%</div>
```

---

## 3. Layout & Spacing Philosophy

### Vertical Rhythm
**Rule:** Consistent spacing creates scannable hierarchy without visual noise

```js
spacing: {
  // Tight grouping (label + value, icon + text)
  '1': '0.25rem',   // 4px
  '2': '0.5rem',    // 8px

  // Related elements (form field group, card internal spacing)
  '3': '0.75rem',   // 12px
  '4': '1rem',      // 16px
  '5': '1.25rem',   // 20px

  // Section spacing (cards, form sections)
  '6': '1.5rem',    // 24px
  '8': '2rem',      // 32px

  // Major sections (page regions)
  '10': '2.5rem',   // 40px
  '12': '3rem',     // 48px
}
```

### Spacing Patterns

```tsx
// Page container
<div className="p-4 md:p-6 space-y-8">

// Card stack
<div className="space-y-4">
  <Card />
  <Card />
</div>

// Form section
<div className="space-y-5">
  <div className="space-y-2"> {/* Label + input */}
    <Label />
    <Input />
  </div>
</div>

// Card internal
<CardHeader className="space-y-1">
<CardContent className="space-y-4">
```

### Grid Usage

**Mobile (default):** Single column, full-width cards
**Tablet (md):** 2-column for metrics, single for forms
**Desktop (lg+):** Max 3 columns for data, 2 for forms

```tsx
// Metric grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Split layout (form + preview)
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
```

### Dividers vs Whitespace

**Rule:** Prefer whitespace. Use dividers only for dense data or complex cards.

```tsx
// Prefer this (whitespace)
<div className="space-y-6">
  <Section1 />
  <Section2 />
</div>

// Use dividers for dense cards
<Card>
  <CardHeader />
  <div className="border-t border-neutral-200" />
  <CardContent />
</Card>
```

---

## 4. Component Design

### Buttons

#### Variants

```tsx
// Primary — main actions (Save, Generate, Log)
<Button className="
  bg-neutral-900 text-white
  hover:bg-neutral-800
  active:bg-neutral-950
  h-10 px-5 rounded-lg
  font-medium text-sm
  transition-colors duration-150
  disabled:opacity-40 disabled:cursor-not-allowed
">
  Generate Plan
</Button>

// Secondary — alternative actions
<Button className="
  bg-neutral-100 text-neutral-800
  hover:bg-neutral-200
  active:bg-neutral-300
  h-10 px-5 rounded-lg
  font-medium text-sm
  border border-neutral-200
">
  View Details
</Button>

// Ghost — tertiary, inline actions
<Button className="
  text-neutral-700
  hover:bg-neutral-100
  active:bg-neutral-200
  h-9 px-3 rounded-md
  text-sm
">
  Edit
</Button>

// Destructive — delete, remove
<Button className="
  text-error bg-error-bg
  hover:bg-error/10
  border border-error-border
  h-10 px-5 rounded-lg
  text-sm font-medium
">
  Delete Plan
</Button>
```

#### Loading State

```tsx
<Button disabled className="relative">
  <span className="opacity-0">Generate Plan</span>
  <div className="absolute inset-0 flex items-center justify-center">
    <Spinner className="w-4 h-4" />
  </div>
</Button>
```

#### Touch Targets
**Minimum:** 44px height for mobile, 40px for desktop

```tsx
className="h-11 md:h-10 min-w-[44px]"
```

### Cards

#### Default Card (Data Display)

```tsx
<div className="
  bg-white
  border border-neutral-200
  rounded-xl
  overflow-hidden
  transition-shadow duration-200
">
  <div className="p-5 space-y-1">
    <h3 className="text-md text-neutral-800">Breakfast</h3>
    <p className="text-sm text-neutral-500">8:00 AM</p>
  </div>
  <div className="px-5 pb-5 space-y-4">
    {/* Content */}
  </div>
</div>
```

**Note:** No shadows by default. Borders create separation without visual weight.

#### Interactive Card (Clickable)

```tsx
<button className="
  w-full text-left
  bg-white border border-neutral-200
  rounded-xl
  hover:border-neutral-300
  hover:shadow-sm
  active:border-neutral-400
  transition-all duration-150
">
  {/* Content */}
</button>
```

#### AI-Generated Card

```tsx
<div className="
  bg-white
  border border-ai-border
  rounded-xl
  relative
">
  {/* AI Badge */}
  <div className="absolute top-3 right-3">
    <span className="
      inline-flex items-center gap-1
      px-2 py-1
      bg-ai-light text-ai-accent-text
      rounded-md text-xs font-medium
    ">
      <SparkleIcon className="w-3 h-3" />
      AI Generated
    </span>
  </div>

  {/* Card content */}
</div>
```

**Key principle:** AI badge is subtle, never dominates the card.

#### Adherence State Cards

```tsx
// Full adherence
<div className="bg-success-bg border border-success-border rounded-xl">

// Partial adherence
<div className="bg-warning-bg border border-warning-border rounded-xl">

// Skipped
<div className="bg-error-bg border border-error-border rounded-xl">
```

**Note:** Semantic backgrounds are very light. Text remains dark and readable.

### Forms & Inputs

#### Text Input

```tsx
<input className="
  w-full h-10 px-3
  bg-white
  border border-neutral-300
  rounded-lg
  text-base text-neutral-900
  placeholder:text-neutral-400
  focus:outline-none
  focus:ring-2 focus:ring-neutral-900 focus:ring-offset-0
  focus:border-neutral-900
  disabled:bg-neutral-50
  disabled:text-neutral-400
  disabled:cursor-not-allowed
  transition-colors duration-150
" />
```

#### Select / Dropdown

```tsx
<select className="
  w-full h-10 px-3
  bg-white
  border border-neutral-300
  rounded-lg
  text-base text-neutral-900
  focus:outline-none
  focus:ring-2 focus:ring-neutral-900
  focus:border-neutral-900
  appearance-none
  bg-[url('data:image/svg+xml...')] bg-no-repeat bg-right
">
  <option>Option 1</option>
</select>
```

#### Checkbox / Radio

```tsx
<label className="flex items-center gap-3 cursor-pointer">
  <input type="checkbox" className="
    w-5 h-5
    border-2 border-neutral-300
    rounded
    text-neutral-900
    focus:ring-2 focus:ring-neutral-900 focus:ring-offset-0
  " />
  <span className="text-base text-neutral-700">Remember me</span>
</label>
```

#### Label Pattern

```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-neutral-700">
    Email address
  </label>
  <input className="..." />
  <p className="text-xs text-neutral-500">
    We'll never share your email
  </p>
</div>
```

#### Error State

```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-neutral-700">Email</label>
  <input className="
    border-error
    focus:ring-error
  " />
  <p className="text-xs text-error flex items-center gap-1">
    <AlertIcon className="w-3 h-3" />
    Please enter a valid email
  </p>
</div>
```

### Navigation

#### Bottom Navigation (Mobile)

```tsx
<nav className="
  fixed bottom-0 left-0 right-0
  bg-white
  border-t border-neutral-200
  md:hidden
  z-50
">
  <div className="flex justify-around h-16">
    <button className="
      flex flex-col items-center justify-center
      flex-1 gap-1
      min-w-[44px]
      text-neutral-500
      hover:text-neutral-900
      aria-[current=page]:text-neutral-900
    ">
      <HomeIcon className="w-6 h-6" />
      <span className="text-xs">Home</span>
    </button>
    {/* ... */}
  </div>
</nav>
```

**Icons:** Use simple, line-based icons (Lucide or Heroicons). NO emojis.

#### Side Navigation (Desktop)

```tsx
<aside className="
  hidden md:flex
  fixed left-0 top-0 bottom-0
  w-64
  bg-neutral-50
  border-r border-neutral-200
  flex-col
  z-40
">
  <div className="p-6 border-b border-neutral-200">
    <h1 className="text-lg font-semibold text-neutral-900">
      Health System
    </h1>
  </div>

  <nav className="flex-1 p-4 space-y-1">
    <a href="/" className="
      flex items-center gap-3
      px-3 py-2.5 rounded-lg
      text-sm font-medium
      text-neutral-700
      hover:bg-neutral-100
      aria-[current=page]:bg-neutral-900
      aria-[current=page]:text-white
    ">
      <HomeIcon className="w-5 h-5" />
      <span>Home</span>
    </a>
  </nav>
</aside>
```

---

## 5. AI-First UX Patterns

### Principle: Quiet Intelligence
AI should feel like a capable assistant working in the background, not a chatbot demanding attention.

### AI Suggestion Pattern

**Context:** Meal/training adjustments recommended by adaptive planning

```tsx
<div className="
  p-4 rounded-lg
  bg-ai-light
  border border-ai-border
  space-y-3
">
  {/* Header */}
  <div className="flex items-start gap-3">
    <div className="p-1.5 bg-white rounded-md">
      <SparkleIcon className="w-4 h-4 text-ai-accent-text" />
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-medium text-neutral-900">
        Suggested Adjustment
      </h4>
      <p className="text-xs text-neutral-600 mt-0.5">
        Based on your adherence patterns
      </p>
    </div>
  </div>

  {/* Suggestion content */}
  <p className="text-sm text-neutral-700 leading-relaxed">
    Your breakfast is often skipped on weekdays. Consider moving it
    30 minutes later or simplifying the meal.
  </p>

  {/* Actions */}
  <div className="flex gap-2">
    <button className="
      text-xs font-medium
      px-3 py-1.5 rounded-md
      bg-white border border-neutral-200
      hover:bg-neutral-50
    ">
      Apply Change
    </button>
    <button className="
      text-xs
      px-3 py-1.5
      text-neutral-600
      hover:text-neutral-900
    ">
      Dismiss
    </button>
  </div>
</div>
```

**Key features:**
- Constrained width (never full-screen)
- Icon indicates AI, but doesn't shout
- Plain language explanation
- Clear, non-urgent actions

### Plan Adjustment Banner

**Context:** Adherence analysis suggests changes

```tsx
<div className="
  bg-warning-bg
  border-l-4 border-warning
  rounded-lg p-4
  space-y-3
">
  <div className="flex items-start gap-3">
    <TrendingIcon className="w-5 h-5 text-warning flex-shrink-0" />
    <div className="flex-1 space-y-1">
      <h4 className="text-sm font-semibold text-neutral-900">
        Plan Adjustment Available
      </h4>
      <p className="text-sm text-neutral-600">
        Analysis of your last 7 days shows 3 recurring patterns
      </p>
    </div>
  </div>

  <button className="
    text-sm font-medium
    text-neutral-900
    hover:underline
  ">
    View Analysis →
  </button>
</div>
```

**Note:** No emoji. Clinical tone. Passive suggestion.

### AI Generation Indicator

**Context:** While AI is generating a plan

```tsx
<div className="
  flex items-center gap-3
  p-6 rounded-xl
  bg-ai-light
  border border-ai-border
">
  <Spinner className="w-5 h-5 text-ai-accent-text" />
  <div>
    <p className="text-sm font-medium text-neutral-900">
      Generating your meal plan
    </p>
    <p className="text-xs text-neutral-600 mt-0.5">
      Analyzing your preferences and schedule...
    </p>
  </div>
</div>
```

### "Why This Changed" Explanation

**Context:** User sees a plan has been automatically adjusted

```tsx
<details className="group">
  <summary className="
    flex items-center gap-2
    text-xs text-neutral-600
    cursor-pointer
    hover:text-neutral-900
    select-none
  ">
    <InfoIcon className="w-3.5 h-3.5" />
    <span>Why was this adjusted?</span>
    <ChevronIcon className="
      w-3 h-3 ml-auto
      transition-transform
      group-open:rotate-180
    " />
  </summary>

  <div className="
    mt-2 pl-5
    text-xs text-neutral-600
    leading-relaxed
  ">
    <p>
      You skipped this meal 4 out of 7 days last week,
      typically due to time constraints. The new timing
      aligns with your actual schedule.
    </p>
  </div>
</details>
```

### Passive Intelligence Indicators

**Context:** Show AI is monitoring without being intrusive

```tsx
{/* Small badge on cards with AI-detected patterns */}
<div className="
  inline-flex items-center gap-1
  px-2 py-0.5
  rounded-full
  bg-neutral-100
  text-neutral-600
  text-xs
">
  <PulseIcon className="w-3 h-3" />
  <span>Tracking adherence</span>
</div>
```

---

## 6. Page-Level UX Improvements

### Onboarding Flow

#### Current Issues
- Too much at once
- No progress indication
- Heavy visual design

#### Redesign

```tsx
<div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
  <div className="w-full max-w-xl">
    {/* Progress indicator */}
    <div className="mb-8 space-y-2">
      <div className="flex justify-between text-xs text-neutral-500">
        <span>Step 2 of 4</span>
        <span>Body Specifications</span>
      </div>
      <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
        <div className="h-full bg-neutral-900 w-1/2 transition-all duration-300" />
      </div>
    </div>

    {/* Form card */}
    <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-neutral-900">
          Tell us about yourself
        </h2>
        <p className="text-sm text-neutral-600">
          This helps us create accurate nutrition and training plans
        </p>
      </div>

      {/* Form fields with calm spacing */}
      <div className="space-y-5">
        {/* ... */}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button variant="ghost" className="flex-1">
          Back
        </Button>
        <Button className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  </div>
</div>
```

### Home Dashboard

#### Information Hierarchy

```tsx
<div className="min-h-screen bg-neutral-50">
  {/* Page header - restrained */}
  <header className="bg-white border-b border-neutral-200 px-4 py-5">
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-semibold text-neutral-900">
        Dashboard
      </h1>
      <p className="text-sm text-neutral-500 mt-1">
        {formatDate(new Date(), 'EEEE, MMMM d')}
      </p>
    </div>
  </header>

  <main className="max-w-5xl mx-auto p-4 space-y-6">
    {/* AI adaptive planning banner - only if needed */}
    {needsAdjustment && <AdaptivePlanningBanner />}

    {/* Primary action */}
    <TodaysSummaryCard />

    {/* Secondary grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <QuickMetricsCard />
      <RecentActivityCard />
    </div>
  </main>
</div>
```

**Key changes:**
- Single column on mobile
- Breathing room between sections
- Most important information first
- No cards unless they contain distinct sections

### Daily Plan & Logging

#### Progressive Disclosure

```tsx
{/* Collapsed state - scannable */}
<div className="bg-white border border-neutral-200 rounded-xl p-4">
  <button
    onClick={toggle}
    className="w-full flex items-center justify-between"
  >
    <div className="flex items-center gap-4">
      {/* Status indicator */}
      <div className="w-2 h-2 rounded-full bg-success" />

      <div className="text-left">
        <h3 className="text-md text-neutral-800">Breakfast</h3>
        <p className="text-sm text-neutral-500">8:00 AM • 520 cal</p>
      </div>
    </div>

    <ChevronIcon className="w-5 h-5 text-neutral-400" />
  </button>
</div>

{/* Expanded state - full logging interface */}
<div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
  {/* Header (same as above) */}

  {/* Expanded content */}
  <div className="px-4 pb-4 space-y-4 border-t border-neutral-100 pt-4">
    {/* Quick action */}
    <button className="
      w-full py-3
      bg-neutral-900 text-white
      rounded-lg text-sm font-medium
      hover:bg-neutral-800
    ">
      ✓ Completed as Planned
    </button>

    {/* Alternative actions */}
    <details className="group">
      <summary className="
        text-sm text-neutral-600
        hover:text-neutral-900
        cursor-pointer
      ">
        More options
      </summary>
      {/* Full logging form */}
    </details>
  </div>
</div>
```

**Principle:** Show only what's needed. Let users drill down.

### Metrics & History

#### Data Visualization

**Colors:**
- Chart lines: `stroke-neutral-700`
- Grid: `stroke-neutral-200`
- Data points: `fill-neutral-900`
- Trend lines (if AI-suggested): `stroke-ai-accent-text stroke-dasharray-4`

```tsx
<div className="bg-white border border-neutral-200 rounded-xl p-5">
  <div className="flex items-center justify-between mb-5">
    <h3 className="text-md font-medium text-neutral-800">
      Weight Trend
    </h3>
    <select className="text-xs border-neutral-200 rounded-md">
      <option>Last 30 days</option>
      <option>Last 90 days</option>
    </select>
  </div>

  {/* Chart - clean, minimal */}
  <LineChart
    data={data}
    className="h-48"
    strokeColor="rgb(63 63 70)"
    gridColor="rgb(228 228 231)"
    dotColor="rgb(24 24 27)"
  />

  {/* Summary stats */}
  <div className="
    grid grid-cols-3 gap-4
    mt-5 pt-5
    border-t border-neutral-100
  ">
    <div>
      <div className="text-xs text-neutral-500">Current</div>
      <div className="text-lg font-semibold text-neutral-900 tabular-nums">
        72.4 kg
      </div>
    </div>
    <div>
      <div className="text-xs text-neutral-500">Change</div>
      <div className="text-lg font-semibold text-success tabular-nums">
        -1.2 kg
      </div>
    </div>
    <div>
      <div className="text-xs text-neutral-500">Goal</div>
      <div className="text-lg font-semibold text-neutral-900 tabular-nums">
        70.0 kg
      </div>
    </div>
  </div>
</div>
```

---

## 7. Motion & Feedback

### Motion Principles

1. **Short**: Max 200ms for most transitions
2. **Purposeful**: Motion should communicate state change
3. **Never decorative**: No bounce, no spring, no wobble

### Transition Patterns

```css
/* Standard transition (color, background) */
transition-colors duration-150

/* Layout changes (expand/collapse) */
transition-all duration-200 ease-out

/* Fade in/out */
transition-opacity duration-150

/* Slide in (modals, sheets) */
transition-transform duration-200 ease-out
```

### Loading States

**Principle:** Show loading immediately. No skeletons unless >1s expected.

```tsx
{/* Button loading */}
<Button disabled className="relative">
  <span className="invisible">Generate Plan</span>
  <div className="absolute inset-0 flex items-center justify-center">
    <Spinner className="w-4 h-4" />
  </div>
</Button>

{/* Card loading (use sparingly) */}
<div className="bg-white border border-neutral-200 rounded-xl p-5">
  <div className="space-y-3 animate-pulse">
    <div className="h-4 bg-neutral-100 rounded w-1/3" />
    <div className="h-3 bg-neutral-100 rounded w-2/3" />
  </div>
</div>
```

### Offline Indicator

```tsx
{!isOnline && (
  <div className="
    fixed top-0 left-0 right-0
    bg-neutral-900 text-white
    py-2 px-4
    text-sm text-center
    z-50
  ">
    <span className="inline-flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-yellow-400" />
      You're offline. Changes will sync when reconnected.
    </span>
  </div>
)}
```

### AI Recalculation Feedback

```tsx
{isRecalculating && (
  <div className="
    inline-flex items-center gap-2
    px-3 py-1.5
    bg-ai-light
    border border-ai-border
    rounded-full
    text-xs text-ai-accent-text
  ">
    <Spinner className="w-3 h-3" />
    <span>Updating plan...</span>
  </div>
)}
```

---

## 8. Accessibility & Ergonomics

### Touch Targets

**Minimum sizes:**
- Mobile: 44px × 44px
- Desktop: 40px × 40px minimum, 44px preferred

```tsx
// Mobile button
className="h-11 px-5 min-w-[44px]"

// Navigation items
className="h-12 px-4 min-w-[44px]"
```

### One-Handed Reach Zones

**Mobile layout priorities:**
- Primary actions: Bottom 1/3 of screen
- Navigation: Fixed bottom bar
- Secondary actions: Top right (harder to reach)

```tsx
{/* Primary action - bottom */}
<div className="fixed bottom-20 left-4 right-4 md:static">
  <Button className="w-full">Log Meal</Button>
</div>

{/* Secondary - top right */}
<div className="absolute top-4 right-4">
  <Button variant="ghost" size="icon">
    <MoreIcon />
  </Button>
</div>
```

### Keyboard Navigation

```tsx
// Ensure focus states are visible
className="
  focus:outline-none
  focus-visible:ring-2
  focus-visible:ring-neutral-900
  focus-visible:ring-offset-2
"

// Skip to main content
<a
  href="#main"
  className="
    sr-only
    focus:not-sr-only
    focus:absolute
    focus:top-4 focus:left-4
    focus:z-50
    focus:px-4 focus:py-2
    focus:bg-neutral-900
    focus:text-white
    focus:rounded-lg
  "
>
  Skip to main content
</a>
```

### Color Contrast

**All text must meet WCAG AA:**
- Normal text (< 18px): 4.5:1 contrast ratio
- Large text (≥ 18px): 3:1 contrast ratio

**Verified pairings:**
- `text-neutral-700` on white: ✓ 4.5:1
- `text-neutral-600` on white: ✓ 4.5:1
- `text-neutral-500` on white: ✗ 3.2:1 (use for non-essential text only)

### Screen Reader Support

```tsx
{/* Icon buttons need labels */}
<button aria-label="Close dialog">
  <XIcon className="w-5 h-5" />
</button>

{/* Loading states */}
<div role="status" aria-live="polite">
  {isLoading && <span>Loading your plan...</span>}
</div>

{/* Form errors */}
<input
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && (
  <p id="email-error" role="alert" className="text-error text-xs">
    Please enter a valid email
  </p>
)}
```

---

## 9. Implementation Checklist

### Phase 1: Color & Typography
- [ ] Update CSS variables in `index.css`
- [ ] Update `tailwind.config.js` with new color palette
- [ ] Add Inter font or configure system font stack
- [ ] Update type scale
- [ ] Enable tabular nums for metrics

### Phase 2: Base Components
- [ ] Redesign Button component (all variants)
- [ ] Redesign Card component
- [ ] Update Input, Select, Checkbox
- [ ] Update Label pattern
- [ ] Remove shadows from cards, use borders

### Phase 3: Layout
- [ ] Update AppLayout spacing
- [ ] Redesign BottomNav (replace emojis with line icons)
- [ ] Redesign SideNav
- [ ] Update page container max-widths
- [ ] Implement vertical rhythm (space-y-* classes)

### Phase 4: AI Patterns
- [ ] Redesign AdaptivePlanningBanner (remove emoji, use icon)
- [ ] Add AI suggestion component
- [ ] Add AI generation indicator
- [ ] Add "why this changed" disclosure pattern
- [ ] Update all AI-related colors to ai-accent palette

### Phase 5: Pages
- [ ] Redesign Onboarding flow (add progress, reduce visual weight)
- [ ] Redesign DailyPage (progressive disclosure)
- [ ] Redesign MealLogCard (cleaner actions)
- [ ] Redesign TrainingLogCard
- [ ] Update Home dashboard hierarchy

### Phase 6: Metrics & Charts
- [ ] Update chart colors (neutral palette)
- [ ] Redesign metric cards
- [ ] Apply tabular nums to all numeric displays
- [ ] Simplify data visualizations

### Phase 7: Polish
- [ ] Update all transitions (max 200ms)
- [ ] Ensure 44px touch targets on mobile
- [ ] Test keyboard navigation
- [ ] Verify color contrast (WCAG AA)
- [ ] Add focus-visible states
- [ ] Test dark mode readiness

---

## 10. Before/After Examples

### Button: Primary Action

**Before:**
```tsx
className="bg-primary text-primary-foreground shadow hover:bg-primary/90"
// Bright blue, shadowed, generic
```

**After:**
```tsx
className="bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-950"
// Calm, neutral, trustworthy
```

### AI Banner

**Before:**
```tsx
<Card className="border-yellow-500 bg-yellow-500/5">
  <CardTitle className="flex items-center gap-2 text-lg">
    <span>⚠️</span> Plan Adjustment Recommended
  </CardTitle>
```

**After:**
```tsx
<div className="bg-warning-bg border-l-4 border-warning rounded-lg p-4">
  <div className="flex items-center gap-3">
    <TrendingIcon className="w-5 h-5 text-warning" />
    <h4 className="text-sm font-semibold text-neutral-900">
      Plan Adjustment Available
    </h4>
  </div>
```

### Progress Indicator

**Before:**
```tsx
<div className="w-full bg-secondary rounded-full h-3">
  <div className={`h-3 rounded-full bg-green-500`} style={{width: '85%'}} />
</div>
```

**After:**
```tsx
<div className="w-full bg-neutral-100 rounded-full h-2">
  <div
    className="h-2 rounded-full bg-success transition-all duration-300"
    style={{width: '85%'}}
  />
</div>
```

### Card Adherence States

**Before:**
```tsx
className="bg-green-500/10 text-green-700"  // Bright, loud
```

**After:**
```tsx
className="bg-success-bg border-success-border text-neutral-900"  // Calm, scannable
```

---

## Final Notes

**This is a design system for daily use over years.**

- Every color has a reason
- Every spacing value creates rhythm
- Every component prioritizes clarity over personality
- AI is helpful but never hyped
- The user's data and decisions are central, not the interface

**When in doubt:**
- Choose the calmer option
- Remove rather than add
- Trust whitespace
- Let data breathe

**References for inspiration:**
- Apple Health: Data density without clutter
- Notion: Calm hierarchy, clear affordances
- Linear: Purposeful motion, neutral palette
- Clinical software: Trust through restraint

Build this app to feel like **a tool the user controls**, not a product selling them on AI.
