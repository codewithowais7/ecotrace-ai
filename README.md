# 🌱 EcoTrace AI — Carbon Footprint Awareness Platform

> **[Challenge 3] Carbon Footprint Awareness Platform** — Hack2Skill GSA Challenge 2026

**Live Demo:** [your-vercel-url]  
**GitHub:** [your-repo-url]

---

## Overview

EcoTrace AI is an intelligent carbon footprint tracking platform that helps individuals understand, monitor, and reduce their environmental impact through real-time tracking and AI-powered personalized insights.

**Chosen Vertical:** Individual Carbon Footprint Awareness & Reduction

---

## Features

- **Real-time tracking** — Log activities across transport, food, home energy, and shopping
- **CO₂ Calculator** — Real emission factors from IPCC AR6, EPA, and CEA India 2023
- **AI Insights** — Personalized reduction tips via Google Gemini 1.5 Flash
- **Progress Dashboard** — Visual charts, goal tracking, daily breakdown
- **WCAG 2.1 AA** — Fully accessible: keyboard navigation, screen reader support, high contrast

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| AI | Google Gemini 1.5 Flash |
| Charts | Recharts |
| Testing | Vitest + React Testing Library + jest-axe |
| Deployment | Vercel |

---

## Architecture

Feature-based folder structure for maximum maintainability:
src/
├── components/ui/        # Reusable accessible UI primitives
├── components/charts/    # Data visualization (React.memo optimized)
├── components/forms/     # Form components with validation
├── components/layout/    # Header, Footer, SkipLink
├── features/             # Onboarding, Dashboard, Insights, Calculator
├── hooks/                # useGemini, useCalculator, useAccessibility, useDebounce
├── utils/                # Calculator, validators, sanitizers, security
├── constants/            # Emission factors, categories, app constants
└── context/              # AppContext — global state with localStorage persistence
---

## How It Works

1. **Onboarding** — User sets up profile with name, location, and daily CO₂ goal
2. **Log Activities** — Add transport, food, energy, or shopping activities
3. **Calculate** — Real emission factors compute accurate CO₂e values
4. **Visualize** — Dashboard shows totals, goal progress, and category breakdown
5. **Reduce** — Gemini AI generates personalized, data-driven reduction tips

---

## Setup & Run

```bash
git clone https://github.com/codewithowais7/ecotrace-ai.git
cd ecotrace-ai
npm install
cp .env.example .env
# Add your Gemini API key to .env
npm run dev
```

### Environment Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | [aistudio.google.com](https://aistudio.google.com/app/apikey) |

---

## Testing

```bash
npm test           # Run all tests
npm run coverage   # Coverage report (threshold: 70%)
npm run lint       # ESLint (zero warnings allowed)
```

**Test coverage includes:**
- Unit tests for all calculation functions
- Validator and sanitizer edge cases
- Component interaction tests (React Testing Library)
- Automated accessibility checks (jest-axe / axe-core)

---

## Security Measures

- API key stored in `.env` only — never hardcoded or committed
- User inputs sanitized with DOMPurify before processing
- AI responses sanitized before display (no `dangerouslySetInnerHTML`)
- Rate limiting on Gemini API calls (minimum 3s between requests)
- Content Security Policy meta tag in HTML
- Safe localStorage wrapper with try/catch
- ESLint with security-relevant rules enforced

---

## Emission Factors

All CO₂e values sourced from peer-reviewed data:

| Category | Source |
|----------|--------|
| Transport | EPA GHG Emission Factors (2023) |
| Food | Poore & Nemecek, Science (2018) / IPCC AR6 |
| Energy | CEA India Grid Emission Factor (2023) — 0.708 kgCO₂e/kWh |
| Shopping | Carbon Trust Product Footprint Benchmarks |

---

## Assumptions

- Default daily goal set to India's average (13.4 kg CO₂e/day per CEA India)
- Emission factors are average values — actual values vary by location/supplier
- Food weights are per kg unless noted as "per meal" (~500g assumed)
- Shopping items represent typical manufacturing footprint, excluding use phase

---

## Deployment

Deployed on Vercel. To deploy your own instance:

```bash
npm run build
# Then connect GitHub repo to Vercel — auto-deploys on push
```

Set `VITE_GEMINI_API_KEY` in Vercel Environment Variables dashboard.

---

*Built for Hack2Skill GSA Challenge 2026 — Challenge 3: Carbon Footprint Awareness Platform*
