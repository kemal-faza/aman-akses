---
version: alpha
name: AmanAkses-design-system
description: A friendly, accessibility-first dashboard design system anchored on a clean white canvas with teal-green primary (#2a9d8f), soft-rounded cards (~12px), and Inter display typography. The system reads as a supportive, modern social-service platform — generous whitespace, colored icon cards, sidebar navigation, and prominent emergency CTAs. Brand voltage comes from the teal primary and from diverse human illustrations that signal inclusivity. Designed for trauma-informed UX: calm colors, clear hierarchy, and immediate access to help.

colors:
  primary: "#2a9d8f"
  primary-active: "#238579"
  primary-disabled: "#a8d5ce"
  primary-soft: "#e8f5f3"
  ink: "#1a1a1a"
  body: "#374151"
  muted: "#6b7280"
  muted-soft: "#9ca3af"
  hairline: "#e5e7eb"
  hairline-soft: "#f3f4f6"
  canvas: "#ffffff"
  surface-soft: "#f9fafb"
  surface-card: "#f5f5f5"
  surface-strong: "#e5e7eb"
  surface-dark: "#1f2937"
  surface-dark-elevated: "#374151"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  on-dark-soft: "#d1d5db"
  # brand-accent: untuk decorative elements & icon accents (semantic alias of primary)
  brand-accent: "#2a9d8f"
  primary-text: "#1a7a6e"
  success: "#10b981"
  warning: "#f59e0b"
  error: "#ef4444"
  emergency: "#dc2626"
  emergency-hover: "#b91c1c"
  badge-orange: "#fb923c"
  badge-pink: "#ec4899"
  badge-violet: "#8b5cf6"
  badge-emerald: "#34d399"
  badge-blue: "#3b82f6"
  badge-teal: "#14b8a6"

typography:
  display-xl:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -1.5px
  display-lg:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -1px
  display-md:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.5px
  display-sm:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.3px
  title-lg:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.2px
  title-md:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  title-sm:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  code:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  button:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0
  nav-link:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  nav-link-active:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 20px
  # pill: untuk badge/label pills
  pill: 9999px
  # full: untuk circular elements (avatars, icon buttons)
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 64px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 12px 20px
    height: 40px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-primary-disabled:
    backgroundColor: "{colors.primary-disabled}"
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 12px 20px
    height: 40px
    border: "1px solid {colors.hairline}"
  button-emergency:
    backgroundColor: "{colors.emergency}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 12px 20px
    height: 44px
  button-emergency-active:
    backgroundColor: "{colors.emergency-hover}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-icon-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 36px
  text-link:
    backgroundColor: transparent
    textColor: "{colors.primary-text}"
    typography: "{typography.button}"
  sidebar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    width: 260px
    height: "100vh"
  sidebar-item:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  sidebar-item-active:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-text}"
    typography: "{typography.nav-link-active}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  top-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    height: 64px
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: 48px
  feature-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 24px
    border: "1px solid {colors.hairline}"
  feature-icon-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-sm}"
    rounded: "{rounded.lg}"
    padding: 20px
    border: "1px solid {colors.hairline}"
  accessibility-card:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.title-sm}"
    rounded: "{rounded.lg}"
    padding: 20px
  emergency-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 24px
    border: "2px solid {colors.emergency}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 10px 14px
    height: 40px
    border: "1px solid {colors.hairline}"
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    border: "2px solid {colors.primary}"
  badge-pill:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 4px 12px
  avatar-circle:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 36px
  illustration-hero:
    backgroundColor: transparent
    rounded: "{rounded.xl}"
  footer:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.muted}"
    typography: "{typography.body-sm}"
    padding: 32px
  mood-button:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline}"
    padding: "8px 12px"
    typography: "{typography.body-sm}"
  mood-button-active:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    border: "2px solid {colors.primary}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    typography: "{typography.body-sm}"
  voice-recorder-widget:
    backgroundColor: "{colors.surface-soft}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline}"
    padding: "12px 16px"
  timeline-builder-item:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline}"
    padding: "16px 20px"
  timeline-connector:
    backgroundColor: "{colors.primary}"
    width: "2px"
  timeline-summary-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.hairline}"
    padding: 24px
  vault-file-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline}"
    padding: "12px"
  vault-file-thumbnail-encrypted:
    backgroundColor: "{colors.surface-strong}"
    rounded: "{rounded.sm}"
    filter: "blur(4px)"
    overlay: "lock-icon-centered"
  vault-upload-dashed-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    border: "1px dashed {colors.primary}"
    padding: "16px"
  companion-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.hairline}"
    padding: "20px"
  status-badge:
    backgroundColor: "{colors.success}"
    textColor: "#064e3b"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
    typography: "{typography.caption}"
  stepper-wizard:
    backgroundColor: transparent
    height: "40px"
  stepper-step:
    typography: "{typography.caption}"
    textColor: "{colors.muted}"
  stepper-step-active:
    typography: "{typography.caption}"
    textColor: "{colors.primary}"
  report-preview-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.hairline}"
    padding: "24px"
  recipient-checkbox-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    border: "1px solid {colors.hairline}"
  recipient-checkbox-card-checked:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    border: "2px solid {colors.primary}"
  accessibility-control-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.hairline}"
    padding: "20px"
---

## Overview

AmanAkses is a trauma-informed, accessibility-first dashboard for survivors of violence. The design system uses a clean white canvas (`{colors.canvas}` — #ffffff) with teal-green primary (`{colors.primary}` — #2a9d8f), soft-rounded cards (`{rounded.lg}` — 12px), and **Inter** typography. The system reads as supportive and calm — every element is designed to reduce cognitive load and provide immediate access to help.

The layout features a **left sidebar navigation** (260px wide) with menu items for different sections (Dashboard, Pahami Kekerasan, Jurnal Aman, etc.), a main content area with card-based feature grid, and prominent emergency CTAs. The hero section includes diverse human illustrations showing people of different abilities, signaling inclusivity.

**Key Characteristics:**

- Teal-green primary (`{colors.primary}` — #2a9d8f) — calm, trustworthy, associated with healing and safety
- White canvas with light-gray cards (`{colors.surface-card}` — #f5f5f5) for feature cards
- Left sidebar navigation (260px) with active state highlighting in teal-soft background
- Card-based feature grid (3 columns desktop, 2 tablet, 1 mobile)
- Colored icons on cards (orange, blue, violet, pink, teal, emerald) for visual differentiation
- Emergency CTA button in red (`{colors.emergency}` — #dc2626) for immediate help access
- Accessibility features section with specialized cards (Screen Reader, Caption, Sign Language, High Contrast)
- Diverse human illustrations in hero section showing inclusivity
- Generous whitespace and clear hierarchy for trauma-informed UX

## Colors

### Brand & Primary

- **Teal Primary** (`{colors.primary}` — #2a9d8f): The dominant brand color. Used for primary CTAs, active navigation, links, and icon accents. Conveys calm, safety, and trust.
- **Primary Active** (`{colors.primary-active}` — #238579): Pressed/hover state for primary buttons.
- **Primary Soft** (`{colors.primary-soft}` — #e8f5f3): Background for active sidebar items and subtle highlights.
- **Brand Accent** (`{colors.brand-accent}` — #2a9d8f): Same as primary, used for icon accents and decorative elements.

### Emergency

- **Emergency Red** (`{colors.emergency}` — #dc2626): Reserved for emergency CTAs ("Telepon Darurat 112"). High contrast, immediate attention.
- **Emergency Hover** (`{colors.emergency-hover}` — #b91c1c): Pressed state for emergency buttons.

### Surface

- **Canvas** (`{colors.canvas}` — #ffffff): Default page background and card surfaces.
- **Surface Soft** (`{colors.surface-soft}` — #f9fafb): Accessibility cards, subtle section backgrounds.
- **Surface Card** (`{colors.surface-card}` — #f5f5f5): Badge pills, avatar fills, secondary surfaces.
- **Surface Strong** (`{colors.surface-strong}` — #e5e7eb): Borders, disabled states.
- **Surface Dark** (`{colors.surface-dark}` — #1f2937): Dark mode surfaces (optional).
- **Hairline** (`{colors.hairline}` — #e5e7eb): 1px borders on cards and inputs.
- **Hairline Soft** (`{colors.hairline-soft}` — #f3f4f6): Subtle dividers.

### Text

- **Ink** (`{colors.ink}` — #1a1a1a): Headlines and primary text.
- **Body** (`{colors.body}` — #374151): Default running text.
- **Muted** (`{colors.muted}` — #6b7280): Secondary text, sidebar inactive items.
- **Muted Soft** (`{colors.muted-soft}` — #9ca3af): Tertiary text, placeholders.
- **On Primary** (`{colors.on-primary}` — #ffffff): Text on primary buttons.
- **On Dark** (`{colors.on-dark}` — #ffffff): Text on dark surfaces.

### Semantic

- **Success** (`{colors.success}` — #10b981): Confirmation states, success indicators.
- **Warning** (`{colors.warning}` — #f59e0b): Warning callouts.
- **Error** (`{colors.error}` — #ef4444): Validation errors.

### Icon Colors (for feature cards)

- **Badge Orange** (`{colors.badge-orange}` — #fb923c): Icon color for "Pahami Kekerasan"
- **Badge Blue** (`{colors.badge-blue}` — #3b82f6): Icon color for "Jurnal Aman"
- **Badge Violet** (`{colors.badge-violet}` — #8b5cf6): Icon color for "Kronologi Kejadian"
- **Badge Pink** (`{colors.badge-pink}` — #ec4899): Icon color for "Brankas Bukti"
- **Badge Teal** (`{colors.badge-teal}` — #14b8a6): Icon color for "Pendamping Tepercaya"
- **Badge Emerald** (`{colors.badge-emerald}` — #34d399): Icon color for "Laporan Awal"

## Typography

### Font Family

The system uses **Inter** across every UI surface. Inter is a highly legible, open-source sans-serif typeface designed for computer screens. It provides excellent readability at all sizes and supports multiple languages.

Fallback stack: `Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

### Hierarchy

| Token                          | Size | Weight | Line Height | Letter Spacing | Use                                    |
| ------------------------------ | ---- | ------ | ----------- | -------------- | -------------------------------------- |
| `{typography.display-xl}`      | 48px | 700    | 1.1         | -1.5px         | Page titles (rare)                     |
| `{typography.display-lg}`      | 36px | 700    | 1.15        | -1px           | Hero headlines ("Dashboard AmanAkses") |
| `{typography.display-md}`      | 28px | 700    | 1.2         | -0.5px         | Section headlines                      |
| `{typography.display-sm}`      | 24px | 700    | 1.25        | -0.3px         | Card titles (large)                    |
| `{typography.title-lg}`        | 22px | 600    | 1.3         | -0.2px         | Feature card titles                    |
| `{typography.title-md}`        | 18px | 600    | 1.4         | 0              | Card titles, subtitles                 |
| `{typography.title-sm}`        | 16px | 600    | 1.4         | 0              | Small card titles, nav items           |
| `{typography.body-md}`         | 16px | 400    | 1.5         | 0              | Default body text                      |
| `{typography.body-sm}`         | 14px | 400    | 1.5         | 0              | Secondary text, captions               |
| `{typography.caption}`         | 13px | 500    | 1.4         | 0              | Badge labels, meta text                |
| `{typography.button}`          | 14px | 600    | 1.0         | 0              | Button labels                          |
| `{typography.nav-link}`        | 14px | 500    | 1.4         | 0              | Sidebar nav items (inactive)           |
| `{typography.nav-link-active}` | 14px | 600    | 1.4         | 0              | Sidebar nav items (active)             |

### Principles

- **Weight-based hierarchy**: 700 for headlines, 600 for titles/buttons, 500 for nav/medium emphasis, 400 for body.
- **Negative letter-spacing on display**: -1.5px to -0.3px for headlines to create tight, confident typography.
- **Generous line-height on body**: 1.5 for readability, especially important for trauma-informed content.
- **Inter for everything**: Single typeface family, no display/body split. Simplifies implementation and maintains consistency.

## Layout

### Spacing System

- **Base unit**: 4px.
- **Tokens**: `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 64px.
- **Section padding**: `{spacing.section}` (64px) between major sections.
- **Card internal padding**: `{spacing.lg}` (24px) for feature cards, `{spacing.md}` (16px) for smaller cards.
- **Sidebar width**: 260px fixed.
- **Content max-width**: ~1200px centered.

### Grid & Container

- **Sidebar**: 260px fixed width, full height, left-aligned.
- **Main content**: Flex-grow, padding `{spacing.xl}` (32px).
- **Feature card grid**: 3-up at desktop (>1024px), 2-up at tablet (768-1024px), 1-up at mobile (<768px).
- **Accessibility card grid**: 4-up at desktop, 2-up at tablet, 1-up at mobile.
- **Gutters**: `{spacing.lg}` (24px) between cards.

### Whitespace Philosophy

AmanAkses uses generous whitespace to create a calm, non-overwhelming experience. Section padding is 64px (slightly tighter than marketing sites at 96px) to maintain dashboard density while preserving breathing room. Cards have 24px internal padding for comfortable content spacing.

## Elevation & Depth

| Level              | Treatment                                      | Use                                |
| ------------------ | ---------------------------------------------- | ---------------------------------- |
| Flat               | No shadow, no border                           | Body sections, sidebar background  |
| Soft hairline      | 1px `{colors.hairline}` border                 | Cards, inputs, dividers            |
| Card surface       | `{colors.canvas}` background + hairline border | Feature cards, accessibility cards |
| Emergency emphasis | 2px `{colors.emergency}` border                | Emergency CTA card                 |
| Active nav         | `{colors.primary-soft}` background             | Active sidebar item                |

The elevation philosophy is **flat and calm** — no drop shadows, no neumorphism. Depth is communicated through borders and background color changes only. This reduces visual complexity and cognitive load.

## Shapes

### Border Radius Scale

| Token            | Value  | Use                                                |
| ---------------- | ------ | -------------------------------------------------- |
| `{rounded.xs}`   | 4px    | Small chips, status indicators                     |
| `{rounded.sm}`   | 6px    | Small buttons, dropdown items                      |
| `{rounded.md}`   | 8px    | Standard buttons, inputs, sidebar items            |
| `{rounded.lg}`   | 12px   | Content cards (feature cards, accessibility cards) |
| `{rounded.xl}`   | 16px   | Hero illustration container                        |
| `{rounded.xxl}`  | 20px   | Large panels                                       |
| `{rounded.pill}` | 9999px | Badge pills                                        |
| `{rounded.full}` | 9999px | Avatars, circular icon buttons                     |

### Photography & Illustration Geometry

- **Hero illustration**: Diverse human figures (including wheelchair user) in a friendly, flat illustration style. Container uses `{rounded.xl}` (16px).
- **Card icons**: 48x48px colored icons at top of feature cards. Each icon uses a distinct color from the badge palette.
- **Avatar circles**: 36px diameter, `{rounded.full}`, used in user profiles.

## Components

### Sidebar Navigation

**`sidebar`** — Left navigation panel, 260px wide, full viewport height.

- Background `{colors.canvas}`, text `{colors.body}`.
- Contains logo at top ("AmanAkses" with shield icon in teal).
- Menu items: Dashboard, Pahami Kekerasan, Jurnal Aman, Kronologi Kejadian, Brankas Bukti, Pendamping Tepercaya, Laporan Awal, Aksesibilitas, Pusat Bantuan.
- Each item uses `{typography.nav-link}` (Inter 14px / 500).

**`sidebar-item`** — Individual nav item.

- Background transparent, text `{colors.body}`, padding `10px 16px`, rounded `{rounded.md}`.
- Icon on left (20x20px), label on right.

**`sidebar-item-active`** — Active nav item state.

- Background `{colors.primary-soft}` (#e8f5f3), text `{colors.primary}`, typography `{typography.nav-link-active}` (weight 600).
- Same padding and radius as inactive.

### Top Bar

**`top-bar`** — Header bar above main content.

- Background `{colors.canvas}`, height 64px.
- Left: Page title ("Dashboard AmanAkses") in `{typography.display-lg}`.
- Right: User profile, settings, logout.
- Bottom border: 1px `{colors.hairline}`.

### Buttons

**`button-primary`** — Primary CTA (teal).

- Background `{colors.primary}` (#2a9d8f), text `{colors.on-primary}`, type `{typography.button}`, padding `12px 20px`, height 40px, rounded `{rounded.md}`.
- Active state: `{colors.primary-active}` (#238579).

**`button-secondary`** — Outlined button.

- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, same padding/height/radius as primary.

**`button-emergency`** — Emergency CTA (red).

- Background `{colors.emergency}` (#dc2626), text `{colors.on-primary}`, type `{typography.button}`, padding `12px 20px`, height 44px (slightly larger for emphasis), rounded `{rounded.md}`.
- Active state: `{colors.emergency-hover}` (#b91c1c).
- **Usage**: Only for "Telepon Darurat 112" and similar emergency actions.

**`button-icon-circular`** — 36x36px circular icon button.

- Background `{colors.canvas}`, hairline border, ink icon. Used for settings, help.

**`text-link`** — Inline text link in teal (merged from `button-text-link`).

- Background transparent, text `{colors.primary-text}` (#1a7a6e, WCAG AA compliant), no underline by default, underline on hover.

### Cards & Containers

**`hero-band`** — Welcome section with illustration.

- Background `{colors.canvas}`, padding `{spacing.xxl}` (48px).
- Layout: Left side has headline ("Kamu tidak sendirian.") + description. Right side has hero illustration.
- Illustration shows diverse people (including wheelchair user) in friendly, flat style.

**`feature-card`** — Main feature cards (6 cards in grid).

- Background `{colors.canvas}`, border `1px solid {colors.hairline}`, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px).
- Top: Colored icon (48x48px) — each card uses different badge color.
- Middle: Title in `{typography.title-md}` + description in `{typography.body-sm}`.
- Bottom: "Pelajari lebih lanjut →" link in `{colors.primary}`.

**`feature-icon-card`** — Smaller variant for secondary features.

- Background `{colors.canvas}`, border `1px solid {colors.hairline}`, rounded `{rounded.lg}`, padding `{spacing.md}` (16px).
- Icon + title + short description.

**`accessibility-card`** — Accessibility feature cards (4 cards).

- Background `{colors.surface-soft}` (#f9fafb), rounded `{rounded.lg}`, padding `{spacing.md}` (16px).
- Icon + title + short description.
- Cards: Screen Reader, Caption Suara, Bahasa Isyarat, Mode Kontras Tinggi.

**`emergency-card`** — Emergency help card.

- Background `{colors.canvas}`, border `2px solid {colors.emergency}`, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px).
- Title: "Butuh bantuan segera?" in `{typography.title-md}`.
- Description text.
- `button-emergency` "Telepon Darurat 112".
- Link: "Lihat layanan darurat lainnya" in `{colors.primary}`.

### Inputs & Forms

**`text-input`** — Standard text input.

- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, rounded `{rounded.md}`, padding `10px 14px`, height 40px.

**`text-input-focused`** — Focus state.

- Border switches to `2px solid {colors.primary}`.

### Tags & Badges

**`badge-pill`** — Small pill label.

- Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.caption}`, rounded `{rounded.pill}`, padding `4px 12px`.

**`avatar-circle`** — 36px diameter avatar.

- Background `{colors.surface-card}`, rounded `{rounded.full}`.

### Footer

**`footer`** — Bottom section.

- Background `{colors.surface-soft}`, text `{colors.muted}`, padding `{spacing.xl}` (32px).
- Contains: Privacy policy, terms, contact info.
- Simple, non-intrusive design.

### Jurnal Aman Components

**`mood-button`** — Emoji-based feeling selectors.

- Background `{colors.canvas}`, border `1px solid {colors.hairline}`, rounded `{rounded.md}`, padding `8px 12px`.
- Active state (`mood-button-active`): Background `{colors.primary-soft}`, text `{colors.primary}`, border `2px solid {colors.primary}`.

**`voice-recorder-widget`** — Inline voice memo recorder container.

- Background `{colors.surface-soft}`, border `1px solid {colors.hairline}`, rounded `{rounded.md}`, padding `12px 16px`.
- Displays waveform preview, record/play status, timeline counter, and delete option.

### Kronologi Kejadian Components

**`timeline-builder-item`** — Draggable row representing a chronological fact.

- Background `{colors.canvas}`, border `1px solid {colors.hairline}`, rounded `{rounded.md}`, padding `16px 20px`.
- Layout: Left side has a drag handle (6 dots icon) and sequence number circle. Center has categorical icon, title, and detail text. Right side has edit pencil icon.

**`timeline-connector`** — Vertical line connecting timeline events.

- Color `{colors.primary}` (teal), width `2px` or `3px`, running vertically behind sequence numbers.

**`timeline-summary-card`** — Right panel summary listing current chronological order.

- Background `{colors.canvas}`, border `1px solid {colors.hairline}`, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px).

### Brankas Bukti Components

**`vault-file-card`** — Grid item for a stored file evidence.

- Background `{colors.canvas}`, border `1px solid {colors.hairline}`, rounded `{rounded.md}`, padding `12px`.

**`vault-file-thumbnail-encrypted`** — Overlay for encrypted thumbnails.

- Applies to photo previews: image is blurred (`filter: blur(4px)`) or replaced with secure placeholder, featuring a lock icon in the center.

**`vault-upload-dashed-card`** — Placeholder action box for uploading files.

- Background `{colors.canvas}`, border `1px dashed {colors.primary}`, rounded `{rounded.md}`, padding `16px`, text-align center.

### Pendamping Tepercaya Components

**`companion-card`** — Grid card for trusted contact options.

- Background `{colors.canvas}`, border `1px solid {colors.hairline}`, rounded `{rounded.lg}`, padding `20px`.
- Top: Avatar/logo + status badge. Center: Name, role, contact (WhatsApp/Telepon), and custom permission scope. Bottom: "Hubungi Sekarang" action button.

**`status-badge`** — Circular pill displaying availability.

- Background `{colors.success}` (#10b981) for "Aktif" or "Tersedia", text `#064e3b` (dark green, WCAG AA compliant), rounded `{rounded.pill}`, padding `2px 8px`.

### Laporan Awal Components

**`stepper-wizard`** — Navigation progress bar at the top of report form.

- Custom horizontal layout displaying steps (1 to 5) with thin connectors. Active state uses `{colors.primary}`.

**`report-preview-card`** — Real-time document preview showing how the generated report will look.

- Background `{colors.canvas}`, border `1px solid {colors.hairline}`, rounded `{rounded.lg}`, padding `24px`. Employs decorative green leaf watermark in the bottom corner.

**`recipient-checkbox-card`** — Large selectable checklist cards in the right sidebar.

- Background `{colors.canvas}`, border `1px solid {colors.hairline}` or `2px solid {colors.primary}` when checked, rounded `{rounded.md}`, padding `12px 16px`.

### Aksesibilitas Components

**`accessibility-control-card`** — Standard card enclosing individual accessibility controls.

- Background `{colors.canvas}`, border `1px solid {colors.hairline}`, rounded `{rounded.lg}`, padding `20px`.
- Controls inside include toggles, custom sliders (range inputs), custom dropdowns, color palette circles, and interpreter video players.

## Do's and Don'ts

### Do

- Use `{colors.primary}` (teal) for primary CTAs, active nav, and links.
- Reserve `{colors.emergency}` (red) ONLY for emergency actions ("Telepon Darurat 112").
- Use colored icons on feature cards for visual differentiation (orange, blue, violet, pink, teal, emerald).
- Apply `{rounded.lg}` (12px) to all content cards.
- Maintain generous whitespace — section padding at 64px, card padding at 24px.
- Use Inter typeface across all surfaces.
- Show diverse, inclusive illustrations in hero section.
- Keep sidebar navigation clear with active state highlighting.
- Use flat design — no drop shadows, only borders for depth.
- Blur or overlay lock icons on photo thumbnails in Brankas Bukti until user enters PIN.
- Keep identity fields in Laporan Awal completely optional to protect survivors.
- Implement a real-time live preview of Laporan Awal so users see exactly what they will share.
- Support instant page-hiding shortcut keys like Ctrl+Shift+X for Discreet Mode / Mode Keluar Cepat.

### Don't

- Don't use red/emergency color for non-emergency CTAs.
- Don't add drop shadows to cards — use borders only.
- Don't use more than 6 colors for card icons (maintain consistency).
- Don't make sidebar wider than 260px or narrower than 220px.
- Don't use display weight below 700 for headlines.
- Don't clutter the interface — maintain calm, supportive aesthetic.
- Don't use dark mode by default (optional feature only).
- Don't automatically submit or share reports; keep the process strictly human-in-the-loop.
- Don't render sensitive evidence inline without secure preview states.

## Responsive Behavior

### Breakpoints

| Name    | Width       | Key Changes                                                                                                               |
| ------- | ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| Mobile  | < 768px     | Sidebar collapses to hamburger menu; hero illustration stacks below text; feature grids 1-up; emergency button full-width |
| Tablet  | 768–1024px  | Sidebar remains visible (may reduce to 220px); feature cards 2-up; accessibility cards 2-up                               |
| Desktop | 1024–1440px | Full sidebar (260px); feature cards 3-up; accessibility cards 4-up                                                        |
| Wide    | > 1440px    | Same as desktop with more outer breathing room; max content width caps at 1200px                                          |

### Touch Targets

- `{component.button-primary}` minimum 40x40px.
- `{component.button-emergency}` minimum 44x44px (larger for emergency).
- `{component.sidebar-item}` minimum 44px height.
- `{component.text-input}` height 40px.

### Collapsing Strategy

- **Sidebar**: Collapses to hamburger menu at < 768px. Menu opens as overlay.
- **Hero band**: 2-column layout (text + illustration) collapses to single column on mobile — text first, illustration below.
- **Feature grids**: 3-up → 2-up → 1-up. Cards maintain padding, don't scale down.
- **Accessibility cards**: 4-up → 2-up → 1-up.
- **Emergency card**: Button becomes full-width on mobile.

## Accessibility Guidelines

### WCAG Compliance

- **Contrast ratios**: All text meets WCAG AA (4.5:1 for normal text using `{colors.ink}`/`{colors.body}`, 3:1 for large text and interactive elements using `{colors.primary}`). Links use `{colors.primary-text}` (#1a7a6e) to achieve 4.5:1 contrast on white.
- **Focus indicators**: All interactive elements have visible focus states (2px teal outline).
- **Keyboard navigation**: Full keyboard accessibility for sidebar, cards, buttons.
- **Screen reader support**: Semantic HTML, ARIA labels for icons, alt text for illustrations.

### Trauma-Informed Design

- **Calm colors**: Teal primary avoids aggressive reds/blues (except emergency).
- **Clear hierarchy**: Users can quickly find what they need without cognitive overload.
- **Immediate help access**: Emergency CTA always visible (sidebar or top-right).
- **Inclusive imagery**: Diverse illustrations showing different abilities, ethnicities, ages.
- **Simple language**: Body text uses clear, non-technical language.
- **No surprises**: Consistent navigation, predictable interactions.

### Accessibility Features (Built-in)

- **Screen Reader**: Full compatibility with NVDA, JAWS, VoiceOver.
- **Caption Suara**: Audio descriptions for visual content.
- **Bahasa Isyarat**: Sign language video support for key content.
- **Mode Kontras Tinggi**: High contrast mode toggle for visual impairments.

## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key directly (`{component.feature-card}`, `{component.sidebar-item-active}`).
2. Variants of an existing component (`-active`, `-disabled`) live as separate entries in `components:`.
3. Use `{token.refs}` everywhere — never inline hex.
4. Default to `{typography.body-md}` for body text.
5. Emergency color is sacred — only use for life-safety CTAs.
6. When in doubt about emphasis: bigger headline before bolder headline.
7. Test with screen readers and keyboard navigation before shipping.

## Implementation Guide: Tailwind CSS v4 + shadcn/ui

This section documents how the AmanAkses design system maps to **Tailwind CSS v4** and **shadcn/ui** component library. The implementation follows shadcn's three-layer theming architecture:

### Architecture

```
CSS Variables (:root)  -->  Tailwind @theme inline  -->  shadcn components
  (raw color values)        (utility class tokens)       (CVA variants)
```

### CSS Variable Scaffold

Convert hex colors to OKLCH for shadcn compatibility. Below is the complete `:root` + `.dark` scaffold with the `@theme inline` mapping block:

```css
@import 'tailwindcss';
@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));

:root {
	/* Surface */
	--background: oklch(1 0 0); /* #ffffff */
	--foreground: oklch(0.13 0.01 240); /* #1a1a1a */
	--card: oklch(0.96 0.01 240); /* #f5f5f5 */
	--card-foreground: oklch(0.13 0.01 240); /* #1a1a1a */
	--popover: oklch(1 0 0);
	--popover-foreground: oklch(0.13 0.01 240);

	/* Primary (teal) */
	--primary: oklch(0.65 0.09 175); /* #2a9d8f */
	--primary-foreground: oklch(1 0 0); /* #ffffff */

	/* Primary text (WCAG AA compliant on white) */
	--primary-text: oklch(0.48 0.09 178); /* #1a7a6e */

	/* Secondary & Accent */
	--secondary: oklch(0.97 0.01 240); /* #f3f4f6 */
	--secondary-foreground: oklch(0.23 0.02 240); /* #374151 */
	--muted: oklch(0.72 0.01 240); /* #6b7280 */
	--muted-foreground: oklch(0.55 0.02 240); /* #9ca3af */
	--accent: oklch(0.97 0.01 240); /* #f9fafb */
	--accent-foreground: oklch(0.13 0.01 240); /* #1a1a1a */

	/* Semantic */
	--destructive: oklch(0.58 0.22 25); /* #ef4444 */
	--destructive-foreground: oklch(1 0 0); /* #ffffff */
	--warning: oklch(0.79 0.16 85); /* #f59e0b */
	--success: oklch(0.62 0.16 145); /* #10b981 */

	/* Emergency (life-safety only) */
	--emergency: oklch(0.52 0.22 25); /* #dc2626 */
	--emergency-hover: oklch(0.46 0.22 25); /* #b91c1c */

	/* Borders & Inputs */
	--border: oklch(0.92 0.01 240); /* #e5e7eb */
	--input: oklch(0.92 0.01 240); /* #e5e7eb */
	--ring: var(--primary);
	--radius: 0.5rem; /* 8px base */

	/* Sidebar */
	--sidebar: oklch(1 0 0); /* #ffffff */
	--sidebar-foreground: oklch(0.23 0.02 240); /* #374151 */
	--sidebar-primary: var(--primary);
	--sidebar-primary-foreground: var(--primary-foreground);
	--sidebar-accent: oklch(0.96 0.02 170); /* #e8f5f3 */
	--sidebar-accent-foreground: var(--primary-text);
	--sidebar-border: var(--border);
	--sidebar-ring: var(--primary);
	--sidebar-width: 260px;

	/* Badge / Icon accent colors */
	--badge-orange: oklch(0.72 0.17 50); /* #fb923c */
	--badge-blue: oklch(0.55 0.19 260); /* #3b82f6 */
	--badge-violet: oklch(0.53 0.22 290); /* #8b5cf6 */
	--badge-pink: oklch(0.59 0.22 340); /* #ec4899 */
	--badge-teal: oklch(0.65 0.16 175); /* #14b8a6 */
	--badge-emerald: oklch(0.69 0.16 155); /* #34d399 */
}

.dark {
	/* --background: oklch(...); — optional, add when implementing dark mode */
}

@theme inline {
	--color-background: var(--background);
	--color-foreground: var(--foreground);
	--color-card: var(--card);
	--color-card-foreground: var(--card-foreground);
	--color-popover: var(--popover);
	--color-popover-foreground: var(--popover-foreground);
	--color-primary: var(--primary);
	--color-primary-foreground: var(--primary-foreground);
	--color-primary-text: var(--primary-text);
	--color-secondary: var(--secondary);
	--color-secondary-foreground: var(--secondary-foreground);
	--color-muted: var(--muted);
	--color-muted-foreground: var(--muted-foreground);
	--color-accent: var(--accent);
	--color-accent-foreground: var(--accent-foreground);
	--color-destructive: var(--destructive);
	--color-destructive-foreground: var(--destructive-foreground);
	--color-warning: var(--warning);
	--color-success: var(--success);
	--color-emergency: var(--emergency);
	--color-emergency-hover: var(--emergency-hover);
	--color-border: var(--border);
	--color-input: var(--input);
	--color-ring: var(--ring);
	--color-sidebar: var(--sidebar);
	--color-sidebar-foreground: var(--sidebar-foreground);
	--color-sidebar-primary: var(--sidebar-primary);
	--color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
	--color-sidebar-accent: var(--sidebar-accent);
	--color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
	--color-sidebar-border: var(--sidebar-border);
	--color-sidebar-ring: var(--sidebar-ring);
	--color-badge-orange: var(--badge-orange);
	--color-badge-blue: var(--badge-blue);
	--color-badge-violet: var(--badge-violet);
	--color-badge-pink: var(--badge-pink);
	--color-badge-teal: var(--badge-teal);
	--color-badge-emerald: var(--badge-emerald);

	/* Spacing: 4px base unit */
	--spacing: 4px;

	/* Radius scale override — explicit values from DESIGN.md */
	--radius-xs: 4px;
	--radius-sm: 6px;
	--radius-md: 8px;
	--radius-lg: 12px;
	--radius-xl: 16px;
	--radius-2xl: 20px;
	--radius-pill: 9999px;
	--radius-full: 9999px;

	/* Remove default shadows (flat design) */
	--shadow-*: initial;

	/* Typography tokens */
	--font-sans:
		'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
		Roboto, 'Helvetica Neue', Arial, sans-serif;
	--font-mono: 'JetBrains Mono', ui-monospace, monospace;

	--text-display-xl: 48px;
	--text-display-lg: 36px;
	--text-display-md: 28px;
	--text-display-sm: 24px;
	--text-title-lg: 22px;
	--text-title-md: 18px;
	--text-title-sm: 16px;
	--text-body-md: 16px;
	--text-body-sm: 14px;
	--text-caption: 13px;
	--text-button: 14px;
	--text-nav-link: 14px;
	--text-nav-link-active: 14px;

	--font-weight-thin: 100;
	--font-weight-extralight: 200;
	--font-weight-light: 300;
	--font-weight-normal: 400;
	--font-weight-medium: 500;
	--font-weight-semibold: 600;
	--font-weight-bold: 700;
	--font-weight-extrabold: 800;
	--font-weight-black: 900;

	--tracking-display-xl: -1.5px;
	--tracking-display-lg: -1px;
	--tracking-display-md: -0.5px;
	--tracking-display-sm: -0.3px;
	--tracking-title-lg: -0.2px;

	--leading-display-xl: 1.1;
	--leading-display-lg: 1.15;
	--leading-display-md: 1.2;
	--leading-display-sm: 1.25;
	--leading-title-lg: 1.3;
	--leading-title-md: 1.4;
	--leading-title-sm: 1.4;
	--leading-body-md: 1.5;
	--leading-body-sm: 1.5;
	--leading-caption: 1.4;
	--leading-button: 1.2;
	--leading-nav-link: 1.4;
	--leading-nav-link-active: 1.4;

	/* Animation */
	--animate-accordion-down: accordion-down 0.2s ease-out;
	--animate-accordion-up: accordion-up 0.2s ease-out;
}

@layer base {
	* {
		@apply border-border outline-ring/50;
	}
	body {
		@apply bg-background text-foreground;
	}
	button {
		cursor: pointer;
	}
}

@layer utilities {
	@keyframes accordion-down {
		from {
			height: 0;
		}
		to {
			height: var(--radix-accordion-content-height);
		}
	}
	@keyframes accordion-up {
		from {
			height: var(--radix-accordion-content-height);
		}
		to {
			height: 0;
		}
	}
}
```

### Token Mapping Table

| DESIGN.md Token         | Tailwind v4 Utility Class                        | How to Use              |
| ----------------------- | ------------------------------------------------ | ----------------------- |
| `{colors.canvas}`       | `bg-background`                                  | Page & card backgrounds |
| `{colors.primary}`      | `bg-primary` / `text-primary` / `border-primary` | CTAs, active borders    |
| `{colors.primary-text}` | `text-primary-text`                              | Links, active nav text  |
| `{colors.primary-soft}` | `bg-sidebar-accent`                              | Active sidebar bg       |
| `{colors.emergency}`    | `bg-emergency`                                   | Emergency button        |
| `{colors.body}`         | `text-foreground`                                | Default body text       |
| `{rounded.md}`          | `rounded-md`                                     | Buttons, inputs         |
| `{rounded.lg}`          | `rounded-lg`                                     | Cards                   |
| `{spacing.md}`          | `p-4` (4 \* 4px)                                 | 16px padding            |
| `{spacing.lg}`          | `p-6` (6 \* 4px)                                 | 24px padding            |
| `{spacing.section}`     | `p-16` (16 \* 4px)                               | 64px section padding    |

### CVA Variant Definitions

#### Button (extend with emergency + mood variants)

```tsx
const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default:
					'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive:
					'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline:
					'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
				secondary:
					'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary-text underline-offset-4 hover:underline',
				emergency:
					'bg-emergency text-primary-foreground hover:bg-emergency-hover h-11',
				mood: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
				'mood-active':
					'bg-sidebar-accent text-primary-text border-2 border-primary',
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'h-8 rounded-md px-3 text-xs',
				lg: 'h-10 rounded-md px-8',
				xl: 'h-11 rounded-md px-10' /* emergency CTA (44px) */,
				icon: 'h-9 w-9',
				'icon-sm': 'h-8 w-8' /* circular icon button */,
			},
		},
		defaultVariants: { variant: 'default', size: 'default' },
	},
);
```

#### Badge (extend with 6 color variants)

```tsx
const badgeVariants = cva(
	'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
	{
		variants: {
			variant: {
				default:
					'border-transparent bg-primary text-primary-foreground',
				secondary:
					'border-transparent bg-secondary text-secondary-foreground',
				destructive:
					'border-transparent bg-destructive text-destructive-foreground',
				outline: 'text-foreground',
				pill: 'rounded-full border-transparent bg-card text-foreground px-3 py-0.5',
				status: 'rounded-full border-transparent bg-success text-[#064e3b] px-2 py-0.5 text-[11px]',
				orange: 'border-transparent bg-badge-orange text-white',
				blue: 'border-transparent bg-badge-blue text-white',
				violet: 'border-transparent bg-badge-violet text-white',
				pink: 'border-transparent bg-badge-pink text-white',
				teal: 'border-transparent bg-badge-teal text-white',
				emerald: 'border-transparent bg-badge-emerald text-white',
			},
		},
		defaultVariants: { variant: 'default' },
	},
);
```

#### Sidebar (use shadcn's Sidebar component)

Override CSS variables to match your design tokens:

- `--sidebar-width: 260px` (already defined in `:root`)
- Active item: uses `--sidebar-accent` + `--sidebar-accent-foreground`

```tsx
<Sidebar>
	<SidebarHeader>{/* Logo: "AmanAkses" with shield icon */}</SidebarHeader>
	<SidebarContent>
		<SidebarGroup>
			<SidebarMenu>
				{/* Use SidebarMenuButton with isActive prop */}
				<SidebarMenuItem>
					<SidebarMenuButton isActive>
						<LayoutDashboard />
						<span>Dashboard</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	</SidebarContent>
	<SidebarFooter>{/* Profile, settings */}</SidebarFooter>
</Sidebar>
```

### Custom Components (No shadcn Equivalent)

Build these following shadcn's copy-paste pattern (CVA + Radix primitives where applicable):

| Component        | Base                | Accessibility Primitive            | Recommended Approach                        |
| ---------------- | ------------------- | ---------------------------------- | ------------------------------------------- |
| Timeline builder | `div` + drag handle | `@dnd-kit/core` (Radix-compatible) | Custom compound component with CVA variants |
| Vault file card  | `Card`              | —                                  | Extend Card, add encrypted state via CVA    |
| Companion card   | `Card`              | —                                  | Extend Card with avatar + status badge      |
| Stepper wizard   | `nav` + `ol`        | Radix Navigation                   | Custom with numbered steps + connectors     |

### Animation

```css
/* Already defined in @theme above */
```

All interactions use `200ms ease` transitions. Apply via:

```css
@theme {
	--ease-default: cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

### Tailwind v4 Gotchas Specific to This Design

1. **Flat design enforcement**: `--shadow-*: initial` must be added to `@theme` to suppress all shadow utilities. Without this, shadcn's default Card component includes a shadow (`shadow` class).
2. **Spacing mapping**: With `--spacing: 4px`, utility classes scale as: `p-1`=4px, `p-2`=8px, `p-3`=12px, `p-4`=16px, `p-6`=24px, `p-8`=32px, `p-12`=48px, `p-16`=64px.
3. **Emergency button height**: Standard shadcn Button only goes up to `h-10`. Add the `xl` size variant with `h-11` for the 44px emergency CTA.
4. **OKLCH conversion**: All hex-to-OKLCH values above are approximate. Verify visually before shipping. Use a color conversion tool for precision.
5. **Font weight utilities**: With `--font-weight-*` defined, use `font-bold` (700), `font-semibold` (600), `font-medium` (500), `font-normal` (400) as usual.
6. **Line-height utilities**: Use `leading-*` classes (e.g., `leading-display-xl`, `leading-body-md`) for specific typography tokens, or use Tailwind shorthand (`leading-tight`, `leading-normal`) for common values.

## Known Gaps

- Dark mode tokens are defined but not fully documented — implementation is optional.
- Animation/transition timings: 200ms ease for all interactions, implemented via `@theme` (see Implementation Guide section).
- Form validation states beyond `{component.text-input-focused}` need user testing.
- Sign language video integration specs not detailed — requires separate accessibility audit.
- Multi-language support (Bahasa Indonesia primary) needs RTL considerations for future expansion.
- Timeline builder, vault file card, companion card, and stepper wizard have no shadcn/ui equivalent — custom components needed (see Implementation Guide).
- Sign language video player component not yet designed — requires vendor-specific integration specs.
