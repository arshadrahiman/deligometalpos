# Deligo Metal POS (बदला / पलटा व उधार बहीखाता)

[![Deploy to Firebase Hosting](https://github.com/arshadrahiman/deligometalpos/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/arshadrahiman/deligometalpos/actions/workflows/firebase-hosting-merge.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Firebase%20Hosting-ffca28?style=flat&logo=firebase)](https://deligometalpos.web.app/)
[![Tests](https://img.shields.io/badge/Vitest-69%20passed-22c55e?style=flat)](https://github.com/arshadrahiman/deligometalpos)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

**Deligo Metal POS** is a pixel-accurate, high-performance Bullion & Jewellery ERP Point-of-Sale (POS) and accounting web application built with **React 18**, **Vite**, **TypeScript**, and **Tailwind CSS**, hosted on **Firebase Hosting**.

---

## 🚀 Live Demo & Access

- **Live URL**: [https://deligometalpos.web.app/](https://deligometalpos.web.app/) (or [https://deligometalpos.firebaseapp.com/](https://deligometalpos.firebaseapp.com/))
- **Demo Login**:
  - **Mobile No**: `9645808999` (or `7879404501`)
  - **Password**: `12345`

---

## ✨ Key Capabilities & Modules

### 1. Global Gold & Silver Dual Metal Switch
- Real-time toggle switch in navigation bar: `[ Gold  O ]` / `[ O  Silver ]`.
- Seamlessly re-binds rates, purity standards, sample types, and units across all operational modules:
  - **Gold**: Quoted in `₹/10gm`, milligram weight standard (`gm`).
  - **Silver**: Quoted in `₹/1kg`, standard samples (`Chandi Sil`, `Pata`, `Chandi Katori`, `Silver Bar 999`, etc.).

### 2. Exchange POS (बदला / पलटा)
- Rapid purity computation: `Gross Weight × Touch (%) ÷ 100 = Fine Metal`.
- Testing and handling charge subtraction: `Diff Amount - Charges = Final Cash`.
- Multi-channel split settlement: Physical Cash, Online / RTGS, Self Bank 2.
- 3-inch thermal slip generation matching bullion industry trade standards.

### 3. Udhari & Loan Ledger (उधार खाता बही)
- Two-tier multi-column running ledger matrix: Gold/Silver debits & credits alongside Cash balances.
- Real-time inline Bhavcut conversion:
  - Cash to Gold (`Amount × 10 ÷ Rate`) / Silver (`Amount × 1000 ÷ Rate`).
  - Metal to Cash (`Weight × Rate ÷ 10` or `Weight × Rate ÷ 1000`).
- Direct WhatsApp statement dispatch (`https://api.whatsapp.com/send?phone=...`).

### 4. Vault Stock View (स्टॉक सारांश)
- High-visibility yellow navbar Stock indicator opening live inventory overview.
- Fine in Stock, Daily Buy / Sell turnover, Kacha Stock recovery, and Metal Dues.
- Capital overview: Cash Capital, Gold Capital, and Silver Capital.

### 5. Metallurgical Utilities
- **Touch Testing Form**: Hallmarking and assay certification slips.
- **Khar / Mel Calculator**: Precise alloy addition/removal formula for melting to target purity:
  $$\text{Alloy Weight} = \frac{\text{Current Weight} \times |\text{Current Purity} - \text{Target Purity}|}{|\text{Target Purity} - \text{Alloy Purity}|}$$

### 6. Executive Navy Blue & Yellow Design Theme
- **Navy Blue (`#0f2744`)** & **Bullion Yellow (`#ffd700`)** styling.
- **Extra Settings Dynamic Theme Config**: Real-time color palette selector with 6 pre-tuned presets (Navy Blue & Yellow, Royal Navy, Deep Ocean, Midnight, Classic Maroon, Custom) with live CSS variable injection.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | React 18, TypeScript, Vite 5 |
| **Routing** | React Router v6 with SPA 404 fallback routing for GitHub Pages |
| **Styling** | Tailwind CSS with dynamic CSS variables & opacity helpers |
| **State Management** | Zustand (persistent stores for Auth, UI, Metal Mode, Theme) |
| **Icons** | Lucide React |
| **Testing** | Vitest (62 pure calculation unit tests with 100% mathematical parity) |
| **Deployment** | GitHub Pages via GitHub Actions (`actions/deploy-pages@v4`) |

---

## 💻 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/arshadrahiman/deligometalpos.git
cd deligometalpos

# 2. Install dependencies
npm install

# 3. Start local Vite development server
npm run dev

# 4. Run calculation test suite
npm test

# 5. Build for production
npm run build
```

---

## 📄 License & Attribution

- **Developed for**: Deligo Technologies
- **Support Helpline**: `+91 9645808999`
- **Software by**: Deligo Technologies ®
