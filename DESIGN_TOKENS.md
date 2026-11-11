# Design Tokens & Styling Guidelines

This document specifies the exact visual language, color palette, typography, component styling, and interactive states for Deligo Technologies ERP.

---

## 1. Color Palette

### Primary & Brand Colors
| Token Name | Hex Code | RGB | Tailwind Class Equivalent | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `color-brand-maroon` | `#8d2c24` | `rgb(141, 44, 36)` | `bg-[#8d2c24]`, `text-[#8d2c24]` | Primary brand accent, active navigation items, prominent submit buttons, section headers |
| `color-brand-maroon-dark`| `#6e211b` | `rgb(110, 33, 27)` | `bg-[#6e211b]` | Button hover, active tab borders |
| `color-brand-blue` | `#1877f2` | `rgb(24, 119, 242)` | `bg-[#1877f2]`, `text-[#1877f2]` | Login button, primary CTA, download actions |
| `color-gold-accent` | `#ffd700` | `rgb(255, 215, 0)` | `bg-[#ffd700]`, `text-[#ffd700]` | Gold stock pill, active tab bottom underline, high-purity badges |
| `color-gold-dark` | `#d4af37` | `rgb(212, 175, 55)` | `text-[#d4af37]` | Fine gold metrics, card header icons |

### Navigation & Neutrals
| Token Name | Hex Code | RGB | Tailwind Class Equivalent | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `color-nav-bg` | `#302929` | `rgb(48, 41, 41)` | `bg-[#302929]` | Sticky top navigation bar, footer bar |
| `color-nav-item-active`| `#8d2c24` | `rgb(141, 44, 36)` | `bg-[#8d2c24]` | Current active navigation tab |
| `color-surface-bg` | `#f4f6f9` | `rgb(244, 246, 249)`| `bg-slate-100` | Background of all dashboard and operational screens |
| `color-card-bg` | `#ffffff` | `rgb(255, 255, 255)`| `bg-white` | Card bodies, form containers, table wrappers |
| `color-text-main` | `#212529` | `rgb(33, 37, 41)` | `text-slate-800` | Primary headings, table text, input values |
| `color-text-muted` | `#6c757d` | `rgb(108, 117, 125)`| `text-slate-500` | Secondary labels, placeholders, timestamps |
| `color-border-light` | `#e5e5e5` | `rgb(229, 229, 229)`| `border-gray-200` | Input borders, card dividers |
| `color-border-dark` | `#dee2e6` | `rgb(222, 226, 230)`| `border-gray-300` | Table cell borders, modal borders |

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

