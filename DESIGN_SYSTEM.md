# Design System & Visual Guidelines
## Sports Week Management Tool

---

## 1. COLOR SYSTEM

### Primary Colors
```
Blue Palette:
├── 50:   #eff6ff  (Lightest - Backgrounds)
├── 100:  #dbeafe  
├── 200:  #bfdbfe  
├── 300:  #93c5fd  
├── 400:  #60a5fa  
├── 500:  #3b82f6  (Primary)
├── 600:  #2563eb  (Primary Dark)
├── 700:  #1d4ed8  
├── 800:  #1e40af  (Action Buttons) ✅
├── 900:  #1e3a8a  (Darkest)
└── 950:  #172554
```

### Semantic Colors
```
Success:  #10b981 (Green-500)    Used for: Confirmations, completed actions
Error:    #ef4444 (Red-500)      Used for: Errors, destructive actions
Warning:  #f59e0b (Amber-500)    Used for: Warnings, cautions
Info:     #3b82f6 (Blue-500)     Used for: Information, hints
```

### Neutral/Gray Palette
```
├── 50:   #f9fafb  (Lightest background)
├── 100:  #f3f4f6  (Light background)
├── 200:  #e5e7eb  (Borders)
├── 300:  #d1d5db  
├── 400:  #9ca3af  
├── 500:  #6b7280  (Secondary text)
├── 600:  #4b5563  
├── 700:  #374151  (Primary text)
├── 800:  #1f2937  
├── 900:  #111827  (Darkest - Headings)
└── 950:  #030712
```

### Status Badge Colors
```
UPCOMING:  bg-blue-100   text-blue-800   (Blue)
LIVE:      bg-red-100    text-red-800    (Red with pulse animation)
FINISHED:  bg-green-100  text-green-800  (Green)
```

---

## 2. TYPOGRAPHY SYSTEM

### Font Stack
```css
font-family: system-ui, -apple-system, sans-serif;
/* Fallback to system fonts for optimal performance */
```

### Font Sizes & Hierarchy
```
Display:     48px (3xl) - Page headings
Heading 1:   30px (2xl) - Section titles
Heading 2:   24px (xl)  - Subsection titles
Heading 3:   20px (lg)  - Card titles
Body Large:  18px (lg)  - Body text
Body:        16px (base)- Main content
Body Small:  14px (sm)  - Secondary text
Label:       12px (xs)  - Captions, labels
```

### Font Weights
```
Light:      300  (Not used - removed for clarity)
Regular:    400  - Default body text
Medium:     500  - Labels, secondary headings
Semibold:   600  - Section titles, buttons
Bold:       700  - Main headings, badges
Extrabold:  800  - Not typically used
```

### Line Heights
```
Display:    1.1   (48px)
Heading:    1.2   (30-24px)
Body:       1.5   (16px)
Caption:    1.4   (12px)
```

### Letter Spacing
```
Heading:  -0.5px (tighter)
Body:     0      (normal)
Label:    0.5px  (slightly wider)
```

---

## 3. SPACING & LAYOUT

### Spacing Scale (4px base unit)
```
0:   0px
1:   4px      (xs)
2:   8px      (sm)
3:   12px     (md)
4:   16px     (lg)   ← Default spacing between components
6:   24px     (xl)   ← Default padding in containers
8:   32px     (2xl)  ← Section spacing
12:  48px     (3xl)  ← Major section spacing
16:  64px     (4xl)
```

### Common Spacing Patterns
```
Button padding:         py-2 px-4    (8px × 16px)
Input padding:          py-2 px-4    (8px × 16px)
Card padding:           p-6          (24px all sides)
Container padding:      px-4 py-8    (16px × 32px)
Section margin:         mb-8         (32px)
Grid gap:               gap-6        (24px)
```

### Layout Grid
```
Desktop:  max-w-7xl (80rem / 1280px)
Tablet:   max-w-4xl (56rem / 896px)
Mobile:   Full width with px-4 padding
```

---

## 4. BORDER & CORNER RADIUS

### Border Radius Scale
```
None:      0px     (sharp)
Small:     2px     (sharp corners)
Default:   6px     (rounded) ← Most components
Medium:    8px     
Large:     12px    (cards, large modals)
Full:      9999px  (circles, avatars, pills)
```

### Border Styles
```
Subtle:      1px border-gray-200 (light dividers)
Normal:      2px border-gray-300 (inputs)
Emphasis:    2px border-blue-500 (focus, active)
Thick:       4px border-blue-800  (important states)
```

---

## 5. SHADOW SYSTEM

### Shadow Elevation Levels
```
None:      box-shadow: none
Small:     0 1px 2px rgba(0,0,0,0.05)      (subtle)
Base:      0 1px 3px rgba(0,0,0,0.1)       (default)
Medium:    0 4px 6px rgba(0,0,0,0.1)       (cards)
Large:     0 10px 15px rgba(0,0,0,0.1)     (modals)
XL:        0 20px 25px rgba(0,0,0,0.1)     (floating)
```

### Usage Guidelines
```
Idle State:       shadow-md
Hover State:      shadow-lg
Active State:     shadow-lg (same or darker)
Modal:            shadow-xl
Floating Button:  shadow-lg
```

---

## 6. INTERACTION STATES

### Button States
```
Default:    bg-blue-800, shadow-md, cursor-pointer
Hover:      bg-blue-900 (darker), shadow-lg
Active:     bg-blue-900, scale-95 (slight compression)
Focus:      ring-2 ring-blue-500, outline-none
Disabled:   opacity-50, cursor-not-allowed
Loading:    spinner animation, disabled interaction
```

### Input States
```
Default:    border-gray-300, bg-white
Focus:      ring-2 ring-blue-500, border-blue-500
Filled:     border-gray-300, bg-white
Invalid:    border-red-500, text-red-600
Disabled:   bg-gray-100, text-gray-500, cursor-not-allowed
Success:    border-green-500, ring-green-200
```

### Link States
```
Default:    text-blue-600, cursor-pointer
Hover:      text-blue-800, underline
Active:     text-blue-900
Focus:      ring-2 ring-blue-500
Visited:    text-purple-600 (if needed)
```

---

## 7. COMPONENT SPECIFICATIONS

### Button Sizing
```
Small:    h-8 px-3 text-sm      (32px height)
Default:  h-10 px-4 text-base   (40px height) ← Recommended
Large:    h-12 px-6 text-lg     (48px height)
XL:       h-14 px-8 text-lg     (56px height)

Minimum Touch Target: 44px × 44px (accessibility)
```

### Input Sizing
```
Small:    h-8 px-2 text-sm      (32px height)
Default:  h-10 px-3 text-base   (40px height)
Large:    h-12 px-4 text-base   (48px height)
```

### Card Sizing
```
Default:  rounded-lg shadow-md p-6
Compact:  rounded-lg shadow-sm p-4
Spacious: rounded-lg shadow-lg p-8
Min Width: 280px (mobile consideration)
```

---

## 8. ANIMATION TIMING

### Duration Scale
```
Instant:    50ms   (not recommended for most cases)
Quick:      100ms  
Fast:       200ms  (most interactions) ← Default
Normal:     300ms  (page transitions)
Slow:       500ms  (important state changes)
Slower:     700ms+ (rare, special effects)
```

### Easing Functions
```
Linear:        cubic-bezier(0, 0, 1, 1)       (no easing)
In:            cubic-bezier(0.4, 0, 1, 1)     (accelerating)
Out:           cubic-bezier(0, 0, 0.2, 1)     (decelerating) ← Most used
In-Out:        cubic-bezier(0.4, 0, 0.2, 1)   (smooth both ends)
```

### Common Animation Patterns
```
Fade In/Out:        200ms ease-out
Slide:              300ms ease-out
Scale (button):     100ms ease-out
Loading Spinner:    1s linear (infinite)
Skeleton Pulse:     1.5s ease-in-out (infinite)
Modal Entrance:     300ms ease-out
Page Transition:    300ms ease-out
```

---

## 9. RESPONSIVE BREAKPOINTS

### Tailwind Breakpoints
```
sm:  640px    (small tablets)
md:  768px    (tablets)
lg:  1024px   (desktops)
xl:  1280px   (large desktops)
2xl: 1536px   (4K monitors)
```

### Mobile-First Approach
```
1. Base: Mobile layout (320px+)
2. sm:   Small devices (640px+)
3. md:   Tablets (768px+) ← Most breakpoint usage
4. lg:   Desktops (1024px+)
5. xl:   Large screens (1280px+)
```

### Common Responsive Patterns
```
Single Column:      Stacked (0px - 767px)
Two Column:         md:grid-cols-2 (768px+)
Three Column:       lg:grid-cols-3 (1024px+)
Navigation:         Hamburger (0px-639px), Horizontal (640px+)
Sidebar:            Hidden (0px-1023px), Visible (1024px+)
```

---

## 10. ACCESSIBILITY SPECIFICATIONS

### Color Contrast Requirements
```
WCAG AA (Minimum):
├── Large text (18px+):    3:1 ratio
└── Normal text:           4.5:1 ratio

WCAG AAA (Enhanced):
├── Large text:            4.5:1 ratio
└── Normal text:           7:1 ratio

Current Implementation: ✅ WCAG AA (All elements)
```

### Focus States
```
Default:  No visible outline (outline: none)
Focused:  ring-2 ring-blue-500 focus:ring-offset-0
Focus Visible: outline-2 outline-offset-2 (keyboard users)
High Contrast Mode: Respected via @media (prefers-contrast)
```

### Motion & Animation
```
Reduced Motion:
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Text Sizing
```
Minimum Font Size:  12px (rarely used)
Comfortable Size:   16px (body text, inputs)
Large Text:         18px+ (headings)
Mobile Text:        16px (prevents iOS zoom)
```

---

## 11. DARK MODE PREPARATION (Future)

### Color Mappings (for future implementation)
```
Light Mode → Dark Mode Mapping:

Backgrounds:
├── bg-white        → bg-gray-900
├── bg-gray-50      → bg-gray-800
├── bg-gray-100     → bg-gray-700
└── bg-gray-200     → bg-gray-600

Text:
├── text-gray-900   → text-white
├── text-gray-700   → text-gray-100
├── text-gray-600   → text-gray-300
└── text-gray-500   → text-gray-400

Borders:
├── border-gray-200 → border-gray-700
└── border-gray-300 → border-gray-600
```

---

## 12. IMPLEMENTATION CHECKLIST

### Visual Quality
- ✅ Consistent spacing (4px grid system)
- ✅ Proper typography hierarchy
- ✅ Adequate color contrast (WCAG AA)
- ✅ Smooth transitions (200-300ms)
- ✅ Shadow elevation system
- ✅ Border radius consistency

### Responsive Quality
- ✅ Mobile-first approach
- ✅ Touch-friendly sizing (44px minimum)
- ✅ Proper breakpoint usage
- ✅ Readable text on all sizes
- ✅ Optimized images

### Interaction Quality
- ✅ Hover states on interactive elements
- ✅ Focus states for keyboard navigation
- ✅ Loading states
- ✅ Error states
- ✅ Success confirmations
- ✅ Disabled states

### Accessibility
- ✅ WCAG 2.1 AA compliance
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Color contrast requirements
- ✅ Semantic HTML
- ✅ ARIA labels

---

## 13. QUICK REFERENCE

### Most Common Classes
```
Spacing:      px-4 py-2 / mb-6 / gap-4
Rounded:      rounded-lg (6px) ← Default
Shadows:      shadow-md (cards) / shadow-lg (hover)
Text Colors:  text-gray-700 (body) / text-gray-900 (heading)
Borders:      border border-gray-300 / border-2 border-blue-500
Buttons:      bg-blue-800 hover:bg-blue-900 text-white
Focus:        focus:ring-2 focus:ring-blue-500 focus:outline-none
Transitions:  transition-colors duration-200
```

---

## 14. DESIGN TOKENS EXPORT

### CSS Variables (for consistency)
```css
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-primary-dark: #1e40af;
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  --spacing-2xl: 32px;

  /* Typography */
  --font-family: system-ui, -apple-system, sans-serif;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;

  /* Shadow */
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  /* Border Radius */
  --radius: 6px;
  --radius-lg: 12px;

  /* Transitions */
  --transition: 200ms ease-out;
}
```

---

## Summary

✅ **Complete Design System** covering:
- Color system with semantic meanings
- Typography hierarchy
- Spacing & layout grid
- Border and shadow elevation
- Interaction states
- Responsive design
- Accessibility standards
- Animation timing
- Component specifications

**Status**: Production Ready
**WCAG Compliance**: AA Level ✅
**Responsive**: Mobile-First Approach ✅
**Performance**: Optimized ✅

---

**Design System Version**: 1.0
**Last Updated**: January 23, 2026
**Maintained By**: UX Development Team
