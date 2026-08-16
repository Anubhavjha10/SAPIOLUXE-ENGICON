---
name: Architectural Precision
colors:
  surface: '#faf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#faf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e8'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3031'
  inverse-on-surface: '#f2f0f0'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5e5f5d'
  on-secondary: '#ffffff'
  secondary-container: '#e0e0dd'
  on-secondary-container: '#626361'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#261900'
  on-tertiary-container: '#a17f3b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e3e2e0'
  secondary-fixed-dim: '#c7c6c4'
  on-secondary-fixed: '#1a1c1a'
  on-secondary-fixed-variant: '#464745'
  tertiary-fixed: '#ffdea5'
  tertiary-fixed-dim: '#e9c176'
  on-tertiary-fixed: '#261900'
  on-tertiary-fixed-variant: '#5d4201'
  background: '#faf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e3e2e2'
typography:
  display-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 80px
    fontWeight: '700'
    lineHeight: 96px
    letterSpacing: -0.02em
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 64px
    fontWeight: '600'
    lineHeight: 72px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  mono-technical:
    fontFamily: Courier Prime
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 128px
---

## Brand & Style
The design system is built upon a foundation of **Structural Minimalism** and **High-End Editorial** aesthetics. It targets a sophisticated clientele—investors, high-net-worth individuals, and urban developers—who value precision, heritage, and modern innovation.

The UI should evoke a sense of "Unshakable Quality." Drawing inspiration from architectural blueprints and luxury lifestyle journals, the design utilizes heavy whitespace, razor-sharp geometric alignment, and a cinematic approach to imagery. Elements are treated with a "built" quality—nothing is decorative without being functional. The emotional response is one of calm confidence and technical mastery.

## Colors
The palette is rooted in materials found on a high-end construction site: steel, stone, and gold detailing.

- **Primary (Deep Charcoal):** Used for primary text, deep-contrast sections (The Sapioluxe Standard), and structural borders. It represents strength and permanence.
- **Secondary (Warm Off-White):** The canvas for the entire system. It prevents the clinical feel of pure white, adding a gallery-like warmth.
- **Tertiary (Premium Gold/Bronze):** Reserved strictly for high-priority calls to action, highlights, and status indicators. It should never exceed 5% of the total screen real estate.
- **Neutral (Muted Concrete Gray):** Used for technical metadata, secondary labels, and subtle dividers.

The design system toggles between high-light (Warm Off-White base) and high-dark (Deep Charcoal base) sections to create visual rhythm.

## Typography
Typography is the primary vehicle for the "Engineering" feel. 

- **Headlines:** Plus Jakarta Sans provides a clean, geometric structure that mimics modern architectural signage. Use `display-xl` for hero sections with tight tracking to create impact.
- **Body:** Inter is used for all long-form content to ensure maximum legibility at smaller sizes.
- **Metadata:** Use `label-caps` for section overlines and technical categories.
- **Technical Accents:** Occasionally use `mono-technical` (Courier Prime) for project IDs, dimensions, or coordinates to reinforce the blueprint aesthetic.

## Layout & Spacing
The layout follows a **Rigid 12-Column Grid** with generous vertical breathing room. 

- **Sectioning:** Vertical gaps between major content blocks should be aggressive (`128px` or more) to maintain an editorial, high-end feel.
- **Alignment:** All text and components must snap to the grid. Use "Technical Lines"—thin 1px borders in Muted Concrete Gray—to separate sections or highlight alignment axes, similar to a drafting board.
- **Responsive Behavior:** On tablet, margins reduce to 40px. On mobile, the grid collapses to 4 columns with 20px margins, and display type scales down to `headline-lg-mobile`.

## Elevation & Depth
In this design system, depth is achieved through **Tonal Layering** rather than traditional shadows.

- **The Layering Model:** Surfaces are flat. Higher elevation is indicated by a change in background color (e.g., a Concrete Gray card on a Warm Off-White surface).
- **Glassmorphism:** Reserved exclusively for the Sticky Navbar. Use a `20px` backdrop blur with a `10%` white or charcoal tint to create a sophisticated "frosted glass" look that keeps the focus on the content flowing underneath.
- **Borders:** Instead of shadows, use "Ghost Borders"—1px solid strokes in `rgba(0,0,0,0.08)`—to define cards and input fields. This maintains the clean, architectural silhouette.

## Shapes
The shape language is **Strictly Geometric**.

All buttons, cards, and input fields utilize a **Sharp (0px)** corner radius. This choice reflects the hard edges of civil engineering, steel beams, and stone blocks. The only exception is the use of circular icons or "Pill-shaped" status tags when indicating "Active" or "Live" project states, providing a singular point of organic contrast against the rigid grid.

## Components

### Buttons
- **Primary:** Solid Deep Charcoal background, Warm Off-White text. Sharp corners. Subtle hover state: background shifts to Premium Gold.
- **Secondary:** Transparent background, 1px Deep Charcoal border. 
- **Tertiary/CTA:** Solid Premium Gold. Reserved for "Request Quote" or "Invest."

### Editorial Cards
Used for Services and Project Portfolio. Cards should have no background or shadow by default—only a thin bottom border. Images should be high-contrast, professional architectural photography. Typography inside cards should use `label-caps` for the category and `headline-md` for the title.

### Interactive Cost Estimator
- **Segmented Controls:** A Charcoal track with a Gold sliding indicator. 
- **Inputs:** Underlined only (1px charcoal stroke), no box, using `headline-md` for the input value to feel like a high-end form.

### Project Portfolio (Masonry)
A precise grid where images vary in aspect ratio (1:1, 4:5, 16:9) but always align perfectly to the 12-column gutter system. 

### The Sapioluxe Standard Section
Full-width, Deep Charcoal background. All text in Warm Off-White. Use a 3-column layout within this section to list technical specifications or firm values, separated by vertical 1px Muted Concrete Gray lines.