# Quiet Method — AI Attention Shield

> An AI-powered Chrome extension that detects digital overload and silently prevents burnout. Built by WEDGE METHOD LLC.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-blue)](https://chrome.google.com/webstore/detail/quiet-method)
[![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)](CHANGELOG.md)

---

## What Is Quiet Method?

Quiet Method is a Chrome extension that watches your browser behavior — keystroke timing, scroll velocity, tab switching frequency — and detects when you're entering a digital overload spiral before you lose the next two hours.

When it detects the pattern, it sends one quiet nudge. No alarm. No popup. No productivity lecture.

**What makes it different:**

- **100% local processing on the free tier.** Behavioral data never leaves your machine. No accounts, no servers, no behavioral profiles.
- **On-device AI.** Inference runs via TensorFlow.js in a service worker. Fast, private, and auditable.
- **Silent intervention.** A single browser notification at the right moment — then out of the way.
- **Learns your baseline.** No generic thresholds. Guard calibrates to your specific behavioral patterns before detecting anomalies.

---

## Installation (Users)

Install from the [Chrome Web Store](https://chrome.google.com/webstore/detail/quiet-method).

That's it. No account required. Guard begins calibrating immediately.

---

## Development Setup

### Prerequisites

- Node.js 20+
- npm 9+ or pnpm 8+
- Chrome or Chromium browser

### Clone and Install

```bash
git clone https://github.com/wedgemethod/quiet-method.git
cd quiet-method
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

```env
# Required for Premium features only
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Required for payment processing (use Stripe test keys in dev)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# PostHog (analytics — use test project in dev)
VITE_POSTHOG_KEY=phc_...
VITE_POSTHOG_HOST=https://eu.posthog.com

# Feature flags
VITE_ENABLE_PREMIUM=true
VITE_ENABLE_SYNC=false  # Set true only with valid Supabase config
```

### Build for Development

```bash
# Development build with hot reload (service worker reloads automatically)
npm run dev

# Production build
npm run build

# Run tests
npm run test

# Lint
npm run lint
```

### Loading the Extension in Chrome

1. Run `npm run build` (or `npm run dev` for development)
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the `dist/` directory

The extension icon will appear in your Chrome toolbar.

### Running Tests

```bash
# Unit tests
npm run test

# Unit tests with coverage
npm run test:coverage

# End-to-end tests (requires Chrome)
npm run test:e2e

# Type checking
npm run typecheck
```

---

## Architecture Overview

```
quiet-method/
├── src/
│   ├── background/          # Service worker (runs persistently)
│   │   ├── index.ts         # Service worker entry point
│   │   ├── detector.ts      # Overload detection engine
│   │   ├── model.ts         # TensorFlow.js model loading + inference
│   │   └── notifications.ts # Notification dispatch
│   │
│   ├── content/             # Content scripts (injected per-tab)
│   │   ├── index.ts         # Content script entry point
│   │   ├── collectors/
│   │   │   ├── keystrokes.ts   # Keystroke timing collection
│   │   │   └── scroll.ts       # Scroll velocity collection
│   │   └── bridge.ts           # chrome.runtime message bridge
│   │
│   ├── popup/               # Extension popup UI (React)
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── DailySummary.tsx
│   │   │   ├── CalibrationProgress.tsx
│   │   │   └── Settings.tsx
│   │   └── index.html
│   │
│   ├── shared/              # Shared utilities and types
│   │   ├── types.ts
│   │   ├── storage.ts       # localStorage abstraction
│   │   ├── crypto.ts        # Client-side encryption for Premium sync
│   │   └── constants.ts
│   │
│   └── premium/             # Premium-only features (lazy loaded)
│       ├── sync.ts          # Supabase encrypted sync
│       ├── reports/         # Weekly report generation
│       └── analytics/       # Focus Fingerprint analytics
│
├── model/                   # ML model artifacts
│   ├── model.json           # TensorFlow.js SavedModel
│   └── weights.bin          # Model weights
│
├── public/                  # Static assets
│   ├── manifest.json        # Chrome extension manifest (MV3)
│   └── icons/
│
├── tests/
│   ├── unit/
│   └── e2e/
│
└── docs/                    # Extended documentation
```

### Core Data Flow

```
Content Script (per-tab)
    │
    │  Keystroke timing events
    │  Scroll velocity events
    │
    ▼
Service Worker (background)
    │
    ├─► Behavioral Signal Aggregator
    │       Combines signals with tab switch events from chrome.tabs API
    │
    ├─► Baseline Model (localStorage)
    │       Compares current signals against calibrated personal baseline
    │
    ├─► TensorFlow.js Inference
    │       Runs overload classification against aggregated signals
    │
    └─► Notification Dispatcher
            Sends browser notification when overload threshold exceeded
            Respects cooldown periods (no repeated nudges within N minutes)
```

### Manifest Permissions

```json
{
  "permissions": ["tabs", "storage", "notifications", "activeTab"],
  "host_permissions": []
}
```

No broad host permissions. No `<all_urls>`. No content reading. The extension detects timing and velocity — not content.

### Privacy Architecture

**Free tier:**
- All behavioral data written to `chrome.storage.local` only
- Service worker makes zero external network requests for core detection
- Model inference: TensorFlow.js running in service worker, no remote API

**Premium sync:**
- Encryption: AES-256-GCM via Web Crypto API
- Key derivation: PBKDF2 from user passphrase, 100,000 iterations, SHA-256
- Key never transmitted to WEDGE METHOD infrastructure
- Encrypted payload transmitted to Supabase via TLS 1.3
- Supabase RLS policies enforce user-level data isolation

---

## Key Dependencies

| Dependency | Version | Purpose |
|---|---|---|
| `@tensorflow/tfjs` | ^4.x | On-device ML inference |
| `react` | ^18.x | Popup UI |
| `@supabase/supabase-js` | ^2.x | Premium sync (optional) |
| `vite` | ^5.x | Build tooling |
| `@crxjs/vite-plugin` | ^2.x | Chrome extension Vite integration |
| `typescript` | ^5.x | Type safety |
| `vitest` | ^1.x | Unit testing |
| `playwright` | ^1.x | E2E testing |

---

## Contributing

We welcome contributions from the community. Please read this section before opening a PR.

### Areas Where Contributions Are Most Welcomed

- **Detection improvements:** Better behavioral signal processing, edge case handling for different keyboard types and input methods
- **Accessibility:** Making the popup and notifications accessible (screen reader support, keyboard navigation)
- **Firefox port:** Adapting the manifest and APIs for Firefox Manifest V3 support
- **Localization (i18n):** Translations for non-English speakers
- **Test coverage:** Increasing unit and E2E coverage, especially for the detection engine

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Add tests for any new behavior
5. Ensure all tests pass: `npm run test`
6. Ensure the extension loads and functions correctly in Chrome
7. Submit a pull request with a clear description of the change and why

### Code Style

- TypeScript strict mode enabled
- ESLint config in `.eslintrc.json`
- Prettier config in `.prettierrc`
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)

### Reporting Bugs

Open a GitHub Issue. Include:
- Browser version
- Extension version (visible in `chrome://extensions`)
- Steps to reproduce
- Expected vs. actual behavior
- Relevant console errors (if any — check the service worker console at `chrome://extensions` → Quiet Method → "Service worker")

### Security Disclosures

Do NOT open a public issue for security vulnerabilities. Email security@wedgemethod.com with details. We will respond within 48 hours and coordinate a responsible disclosure timeline.

### Pull Request Review Time

We aim to review PRs within 7 days. Large or complex PRs may take longer. We'll acknowledge receipt within 48 hours.

---

## Roadmap

### v1.1 (Near-term)
- [ ] Improved first-run onboarding experience with demo intervention
- [ ] Configurable nudge sensitivity (low / medium / high)
- [ ] Nudge snooze option (1hr, rest of day, this site only)
- [ ] Better handling of video content (YouTube detection so scroll behavior is interpreted correctly)

### v1.2
- [ ] Weekly "Your Week in Calm" PDF report (Premium)
- [ ] Focus Fingerprint visualization (Premium)
- [ ] Keyboard shortcut to pause/resume Guard temporarily

### v1.3
- [ ] Cross-device encrypted sync (Premium)
- [ ] Goal setting and streak tracking (Premium)
- [ ] Smart scheduling suggestions (Premium)

### v2.0
- [ ] Firefox support
- [ ] Safari support (via Safari Web Extension wrapper)
- [ ] Team features (organization licenses, anonymized team reports)
- [ ] API for integration with time-tracking and calendar tools

### Ongoing
- [ ] Model retraining with expanded behavioral dataset (opt-in, privacy-preserving federated approach)
- [ ] Accessibility improvements
- [ ] Localization (starting with Spanish, French, German, Japanese)

---

## License

The Quiet Method extension codebase is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 WEDGE METHOD LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**Note:** The trained ML model (`model/model.json` and `model/weights.bin`) is proprietary and is **not** covered by the MIT license. All other rights reserved.

---

## Support

- **Documentation:** https://quietguard.app/docs
- **Bug reports:** GitHub Issues
- **General support:** support@wedgemethod.com
- **Security disclosures:** security@wedgemethod.com
- **Privacy:** privacy@wedgemethod.com

**WEDGE METHOD LLC**
8977 S 1300 W Unit #615
West Jordan, UT 84088

---

*Built with care in Utah. Quiet Method is not a medical device and is not intended to diagnose, treat, or prevent clinical burnout or any other medical condition.*
