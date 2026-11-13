# Design Tokens & Dynamic Theme Guidelines

This document specifies the visual language, dynamic color palette, typography, component styling, and interactive states for Deligo Technologies ERP.

---

## 1. Dynamic Color Architecture (Navy Blue & Yellow Theme)

The application features an executive **Navy Blue & Yellow** design system powered by CSS Custom Properties (`:root`) and live synchronization with Extra Settings.

### Primary Brand Palette (Default Theme)
| Token Name | Hex Code | RGB | Tailwind Class Equivalent | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `color-brand-primary` | `#0f2744` | `rgb(15, 39, 68)` | `bg-brand-primary`, `text-brand-primary` | Primary brand identity, active navigation buttons, submit CTAs, section headers |
| `color-brand-primary-dark` | `#0a192f` | `rgb(10, 25, 47)` | `bg-brand-primary-dark` | Hover states, active borders, sticky top navigation bar |
| `color-brand-primary-light` | `#1e3a5f` | `rgb(30, 58, 95)` | `bg-brand-primary-light` | Secondary headers, card borders, interactive focus rings |
| `color-brand-secondary` (Yellow) | `#ffd700` | `rgb(255, 215, 0)` | `bg-brand-secondary`, `bg-brand-yellow` | Yellow Stock button, bullion accents, Gold mode indicators, active underlines |
| `color-brand-secondary-dark` | `#eab308` | `rgb(234, 179, 8)` | `bg-brand-secondary-dark` | Yellow hover states, active borders |
| `color-brand-nav` | `#0a192f` | `rgb(10, 25, 47)` | `bg-brand-nav` | Sticky top navigation bar, modal headers, footer |
| `color-brand-surface` | `#f0f4f9` | `rgb(240, 244, 249)` | `bg-brand-surface` | Application background canvas, slate contrast |

### Dynamic Theme Presets Available in Extra Settings
1. **Navy Blue & Yellow (Default)**: `#0f2744` primary, `#ffd700` yellow accent, `#0a192f` deep nav.
2. **Royal Navy & Canary Yellow**: `#1e3a8a` primary, `#facc15` sharp canary yellow, `#172554` midnight nav.
3. **Deep Ocean & Amber Gold**: `#0c4a6e` primary, `#fbbf24` amber gold, `#082f49` ocean nav.
4. **Midnight Navy & Cyber Yellow**: `#111827` primary, `#eab308` high-vis yellow, `#030712` black nav.
5. **Classic Maroon & Gold (Legacy)**: `#8d2c24` primary, `#ffd700` gold accent, `#302929` dark nav.
6. **Custom Palette**: User-defined 6-color palette with native color pickers and instant DOM injection.

### Semantic & Status Colors
| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `color-success` | `#28a745` | Positive balances (Jama / In), WhatsApp share button, success toast |
| `color-danger` | `#dc3545` | Negative balances (Udhar / Out), delete actions, error toast, cancellation |
| `color-warning` | `#ffc107` | Due dates, pending Bhavcut settlements, stock alert indicators |
| `color-info` | `#17a2b8` | Customer detail links, print preview buttons, XRF test tags |

---

## 2. Typography

### Font Families
- **Primary Interface**: `'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
- **Branding Headings**: `'Lobster', cursive` (Used on login title banner)
- **Monospace & Receipts**: `'Courier New', Courier, monospace` (Used for 3-inch POS thermal slips)

### Font Scale & Hierarchy
| Level | Font Size | Line Height | Weight | Tailwind Class |
| :--- | :--- | :--- | :--- | :--- |
| Hero Banner | `28px` | `36px` | 700 Bold | `text-3xl font-bold` |
| Page / Modal Title | `20px` | `28px` | 600 Semi-Bold | `text-xl font-semibold` |
| Card Header | `16px` | `24px` | 600 Semi-Bold | `text-base font-semibold` |
| Table Header | `13px` | `18px` | 600 Semi-Bold | `text-xs font-semibold uppercase tracking-wider` |
| Table Cell / Body | `13px` | `20px` | 400 Regular / 500 Medium | `text-sm font-normal` |
| Form Label | `13px` | `18px` | 500 Medium | `text-xs font-medium text-slate-700` |
| Caption / Help Text| `11px` | `16px` | 400 Regular | `text-xs text-slate-400` |

---

## 3. Spacing & Elevation

### Spacing Scale
- `space-1`: `4px`
- `space-2`: `8px`
- `space-3`: `12px`
- `space-4`: `16px`
- `space-6`: `24px`
- `space-8`: `32px`

### Shadows & Elevation
- **Card Shadow**: `0 0 1px rgba(0,0,0,.125), 0 1px 3px rgba(0,0,0,.2)` (Bootstrap card elevation)
- **Modal Overlay**: `rgba(0, 0, 0, 0.5)` with backdrop blur `2px`
- **Dropdown / Floating Action**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`

### Border Radius
- `radius-sm`: `4px` (Form fields in tables, small buttons)
- `radius-md`: `8px` (Standard cards, modal containers)
- `radius-lg`: `15px` (Login inputs, quick launch tiles)
- `radius-pill`: `9999px` (Status badges, pill buttons)

---

## 4. Component Styles

### Buttons
- **Primary Action (Brand)**:
  - Background: `#8d2c24`, Text: `#ffffff`
  - Hover: `#6e211b`, Active scale: `0.98`
  - Padding: `8px 18px`, Radius: `6px`
- **Login CTA**:
  - Background: `#1877f2`, Text: `#ffffff`
  - Padding: `12px 40px`, Radius: `20px`, Weight: `700`
- **WhatsApp Share Action**:
  - Background: `#25D366`, Text: `#ffffff`
  - Padding: `4px 10px`, Radius: `4px`
- **Thermal Print Action**:
  - Background: `#17a2b8`, Text: `#ffffff`
  - Padding: `4px 10px`, Radius: `4px`

### Form Inputs
- **Height**: `38px` (Standard form inputs), `46px` (Login inputs)
- **Border**: `1px solid #ced4da`
- **Focus State**: `border-color: #8d2c24; box-shadow: 0 0 0 0.2rem rgba(141, 44, 36, 0.25); outline: none;`
- **Numeric Fields**: Right-aligned text for weights (`gm`), rates (`₹`), and touch percentages (`%`).

### Data Tables
- **Header**: Background `#f8f9fa` or `#302929` (depending on view), text `#495057` or `#ffffff`, font size `12px`, padding `10px 12px`.
- **Alternating Rows**: Zebra striping with `#fdfdfd` and `#ffffff`.
- **Row Hover**: `background-color: #f1f5f9`.
- **Summary Footers**: Distinct background `#e9ecef`, bold text, aligned with column data types.

### Iconography
- **Library**: `FontAwesome 6 Free` (solid and brand sets).
- **Icons Used**: `fa-scale-balanced` (Gold weight), `fa-calculator` (Bhavcut), `fa-receipt` (Invoice), `fa-whatsapp` (WhatsApp messaging), `fa-print` (Thermal slip), `fa-user` (Customer), `fa-gear` (Settings).

### Charts & Visuals
- The application uses **No Canvas/SVG chart libraries** (no Chart.js or ApexCharts).
- High-visibility metrics are presented as **Flip-clock style digit counters**, **Stat Cards with gradient borders**, and **Custom summary tables**.

---

## 5. Responsive Breakpoints

| Breakpoint | Width | Behavior |
| :--- | :--- | :--- |
| Mobile (`sm`) | `< 768px` | Full width stacked layouts, side-scrolling tables, sticky bottom actions, collapsible navigation drawer |
| Tablet (`md`) | `768px - 1024px` | 2-column form grids, condensed table columns |
| Desktop (`lg`/`xl`) | `>= 1024px` | Multi-pane POS terminal, dual-column Buy/Sell side-by-side, full sticky header navigation |

