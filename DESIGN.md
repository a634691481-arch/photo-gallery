---
name: Home Album
description: A private, AI-powered family photo gallery preserving moments for generations.
colors:
  warm-cream: "#f5f1e8"
  warm-cream-dark: "#e8e0d2"
  ink: "#1a1714"
  ink-soft: "#3d3830"
  ink-muted: "#6b6358"
  terracotta: "#c17c53"
  terracotta-light: "#e6a87c"
  surface-white: "#ffffff"
  surface-dark: "#12100e"
typography:
  display:
    fontFamily: "Georgia, Noto Serif SC, STSong, SimSun, serif"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  body:
    fontFamily: "PingFang SC, Hiragino Sans GB, Microsoft YaHei, Microsoft JhengHei, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  pill: "9999px"
  card: "16px"
  field: "12px"
  thumb: "8px"
spacing:
  section-padding: "px-4 sm:px-6 pb-24"
  hero-padding: "pt-24 sm:pt-32 md:pt-40 pb-8 px-6"
  card-inner: "p-4 sm:p-6"
  button-primary: "px-4 py-2 sm:px-6 sm:py-3"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.warm-cream}"
    rounded: "{rounded.pill}"
  button-primary-hover:
    transform: "scale(1.05)"
  button-toggle-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.warm-cream}"
    rounded: "{rounded.pill}"
  button-toggle-inactive:
    backgroundColor: "{colors.warm-cream-dark}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.pill}"
  nav-container:
    backgroundColor: "{colors.surface-white}"
    rounded: "{rounded.pill}"
  photo-card:
    rounded: "{rounded.card}"
    backgroundColor: "{colors.warm-cream-dark}"
---

# Design System: Home Album

## Overview

**Creative North Star: "The Family Archive"**

A warm, tactile digital archive inspired by physical family albums: wood grain, linen texture, warm incandescent light. The interface recedes completely; photos are the only hero. Every surface, border, and shadow feels grounded in natural materials. The system is quiet, assured, and built for decades, not quarters. It moves with the slow, deliberate confidence of something handcrafted.

The design language deliberately avoids digital coldness: cream surfaces replace sterile white, warm brown ink replaces charcoal black, and the single accent (terracotta) appears sparingly like a wax seal on an envelope. Dark mode is the same archive at night — deeper browns, softer contrast, the same material warmth without the light.

**Key Characteristics:**
- Warm natural palette derived from paper, wood, and clay
- Photo-first layouts where UI recedes until needed
- Tactile interactions: scale and translate with weight, never snap
- Generous whitespace between sections; dense within cards
- Dual-radius language: fully round for interactive surfaces, softly rounded for containers
- Serif display type for emotional resonance; sans-serif body for readability

## Colors

A warm, natural palette anchored in three material families: cream (paper/linen), ink (walnut stain), and terracotta (baked clay).

### Primary
- **Terracotta** (#c17c53): The single accent color. Used only for selection highlights, focus rings, hover states, and the rare call-to-action that demands attention. Appears on less than 5% of any given screen. In dark mode, warms to terracotta-light (#e6a87c).

### Neutral
- **Warm Cream** (#f5f1e8): Page background. The color of aged paper. In dark mode, deepens to warm ink (#1a1714) — the same material, no light.
- **Warm Cream Dark** (#e8e0d2): Card and card-hover background. Slightly darker cream for subtle differentiation.
- **Ink** (#1a1714): Primary text and filled-button background. The color of walnut ink on paper.
- **Ink Soft** (#3d3830): Secondary text and dark-mode card backgrounds.
- **Ink Muted** (#6b6358): Tertiary text, placeholders, disabled states, dividers.
- **Surface White** (#ffffff): Modal and dropdown backgrounds in light mode. **Surface Dark** (#12100e) in dark mode. Always the lightest or darkest surface for maximum contrast with ambient content.

### Named Rules
**The 5% Rule.** Terracotta is the only accent. It appears on less than 5% of any screen — selection, focus, and rare emphasis only. If it appears six times in one viewport, something is wrong.

**The Same-Material Rule.** Light and dark mode use the same palette, inverted. Cream becomes ink. Ink becomes cream. The relationship is a mirror, not a new palette. No color is added or removed in dark mode.

## Typography

**Display Font:** Georgia (with Noto Serif SC, STSong, SimSun fallback)
**Body Font:** PingFang SC (with Hiragino Sans GB, Microsoft YaHei, Microsoft JhengHei fallback)

**Character:** A warm editorial pairing. The serif display evokes the gravitas of a published book; the sans-serif body keeps extended reading effortless across Chinese and English. The contrast is subtle — not a period newspaper, a thoughtful family record.

### Hierarchy
- **Display** (600, clamp(2.5rem, 5vw, 5rem), 1.05): Page hero titles only. Tight tracking, generous container width, never exceeds 3 lines. Applied with `[text-wrap:balance]`.
- **Title** (600, 1.5rem–1.875rem, 1.2): Section headers in sticky scroll positions. Lighter weight than Display to maintain hierarchy.
- **Body** (400, 0.875rem–1rem, 1.6): Prose, descriptions, form labels. Max line width implicitly constrained by narrow containers.
- **Label** (500, 0.75rem–0.875rem): Button text, navigation, chips, metadata. Tracking relaxed.

## Layout

**Container model:** Centered max-width containers (max-w-6xl for text, max-w-7xl for media grids) with generous horizontal padding (px-4 sm:px-6). No edge-to-edge content except full-bleed media.

**Hero spacing:** Everything clears the floating nav first. Heroes use pt-24 sm:pt-32 md:pt-40 pb-8 for breathing room. Section vertical rhythms are py-24 md:py-32 for major divisions, py-16 md:py-24 for secondary.

**Responsive behavior:** Desktop-first with mobile as first-class. Masonry adjusts column count: 2 on mobile, 3 on tablet, 4 on desktop, 5 on wide. Nav collapses to hamburger below `md`. Form inputs go full-width on mobile.

**The Gutter Rule.** Every masonry grid uses gap-3 sm:gap-4. Every card grid uses gap-4 sm:gap-6. Photo cards use gap-2 sm:gap-3. Gutters tighten as content density increases.

## Elevation & Depth

The system is fundamentally flat. Elevation is tonal, not shadow-based. Cards differentiate from the page background with a slightly darker cream layer (bg-cream-dark/20) rather than box-shadow. The floating navbar is the only element that uses both shadow (shadow-sm) and backdrop blur — a deliberate exception that communicates navigation separation.

### Shadow Vocabulary
- **Ambient Nav** (shadow-sm + backdrop-blur-xl): The floating nav only. Purpose: separate navigation from content; communicate interactivity.
- **Modal Layering** (shadow-xl): ShareDialog and notification dropdown only. Purpose: differentiate floating UI from the page plane.
- **Photo Cards:** Zero shadow. Tonal differentiation only.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadow appears only as a response to state: hover elevation on CTAs and modals that float above the content plane. Cards, inputs, and sections use tonal differentiation, not shadow.

## Shapes

**Dual-Radius Language:** Interactive, clickable surfaces use fully rounded pill shapes (rounded-full). Content containers — cards, images, modals, inputs — use softly rounded corners (rounded-2xl for cards, rounded-xl for inputs and list items). This creates a clear visual signal: if it's perfectly round, you can press it; if it's softly rounded, it holds content.

**Borders:** Applied minimally. Subtle 1px borders on floating panels (navbar, modals, dropdowns) at low opacity. Cards, inputs, and sections use background color for differentiation instead of borders. Dividers between content blocks use the same subtle border with lower opacity.

## Components

### Buttons
- **Shape:** Fully rounded pill (rounded-full).
- **Primary:** Ink background with cream text (dark mode: cream background with ink text). Padding px-4 py-2 on mobile, px-6 py-3 on desktop.
- **Hover:** scale(1.05) with duration-500 ease-out. Gentle upward lift, not a snap.
- **Active:** scale(0.95). Slight press-in feedback.
- **Disabled:** opacity-50, no hover effect, cursor not-allowed.
- **Secondary:** No background, subtle border on hover. Used for less-prominent actions.
- **Icon-only:** Circular (p-2.5), transparent background, cream-dark hover.

### Chips / Filter Pills
- **Style:** Same fully rounded pill shape as buttons. Active state uses filled ink/cream. Inactive state uses subtle background tint.
- **Active:** `bg-ink text-cream dark:bg-cream dark:text-ink`
- **Inactive:** `bg-cream-dark/30 dark:bg-ink-soft/10 text-ink-muted`
- **Hover:** Background intensifies slightly, text darkens toward ink.

### Cards / Containers
- **Corner Style:** rounded-2xl (16px) for content cards, rounded-xl (12px) for list items.
- **Background:** cream-dark/20 in light mode, ink-soft/10 in dark mode — always a subtle shift from the page background.
- **Photo Cards:** Transparent background until hover, then gradient overlay (from-ink/60 to transparent) for metadata reveal.
- **Shadow Strategy:** None at rest (see Elevation section).

### Inputs / Fields
- **Style:** rounded-xl (12px), single 1px border (cream-dark/30), transparent background. Padding px-4 py-3 or px-3 py-2 depending on context.
- **Focus:** Border shifts to terracotta (focus:border-accent). No glow, no ring expansion.
- **Error / Disabled:** Standard opacity-50 pattern.

### Navigation
- **Container:** Floating pill (rounded-full), centered horizontally, fixed top-5. Uses glass treatment: bg-surface/60 with backdrop-blur-xl and shadow-sm.
- **Links:** Rounded-full buttons with text-ink-muted default, text-ink on hover and active. Background tint on hover and active states.
- **CTA:** The only filled button in the nav — ink/cream for upload/login.
- **Mobile:** Hamburger toggle; nav becomes dropdown panel below the main pill with border-top divider.

### Photo Masonry
- **Layout:** CSS columns (columns-2 to columns-5 by breakpoint) with gap-3 to gap-4.
- **Items:** break-inside-avoid with bottom margin to prevent column breaks.
- **Images:** w-full h-auto for natural aspect ratio. object-cover with hover scale(1.05) and duration-700 ease-out.
- **Skeleton:** Matching masonry layout with animate-pulse placeholders at varying aspect ratios.

### Lightbox
- **Overlay:** Nearly opaque dark (#0a0806/96) — warm black, not pure black.
- **Image:** Centered, max 88vw x 84vh, object-contain, rounded-lg.
- **Controls:** Translucent white rounded-full buttons. Bottom bar with metadata, bookmark, download, autoplay.
- **Navigation:** Left/right arrow buttons + keyboard (ArrowLeft/ArrowRight/Escape). Autoplay toggle at 3s intervals.

## Do's and Don'ts

### Do:
- **Do** use the dual-radius language: rounded-full for buttons and interactive surfaces, rounded-2xl/rounded-xl for containers and cards.
- **Do** keep terracotta accent below 5% of any screen. One focus ring, one selection highlight, one subtle decoration.
- **Do** prefer tonal differentiation (slightly darker/lighter background) over borders and shadows to separate elements.
- **Do** use the marquee-track utility for continuous motion — exactly two copies of the content strip.
- **Do** apply [text-wrap:balance] on every display/page-level H1 heading.
- **Do** respect the 500ms-700ms transition range for image reveals and hover states.

### Don't:
- **Don't** use pure black (#000000) or pure white (#ffffff) for backgrounds. Always tint toward cream or ink.
- **Don't** add a second accent color. The terracotta slot is the only accent.
- **Don't** use box-shadow on cards or sections at rest. Elevation is tonal.
- **Don't** add borders when a background tint already separates two elements.
- **Don't** use aspect-square or forced equal-height grids for photo galleries. Let photos keep their natural aspect ratio via masonry.
- **Don't** apply gridRowEnd span hacks. Use CSS columns with break-inside-avoid for natural masonry.
