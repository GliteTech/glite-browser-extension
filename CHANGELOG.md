# Changelog
All notable changes to this project are documented in this file.  
The format follows [Keep a Changelog](https://keepachangelog.com) and the project adheres to Semantic Versioning.

## [2.0.0] – 2025‑04‑21

### Added
- **User‑facing UI**: toolbar icon & popup, context‑menu commands, highlight‑mode tooltips, full settings page.  
- **Performance guidance**: Web Workers for CPU‑heavy tasks, HTTP Keep‑Alive, explicit memory‑management rules.  
- **Privacy by Design** principle + central **`applyOrSkip()`** decision hook.  
- **Viewport‑aware processing** user story & logic.  
- **Safeguards**: ignore user‑editable regions; re‑render guard counter; per‑paragraph / per‑1000‑word density caps.  
- **Blacklisting** (global + personal) and "seen" concept analytics with visibility tracking and new `/report_seen` endpoint.  
- **Development stack**: TypeScript mandate, Vite/Webpack option, Vitest/Playwright tests, ESLint + Prettier CI, Lighthouse budgets, WCAG 2.1 AA requirement.  
- **Security note**: mandatory DOMPurify sanitisation of LLM responses.
- **Project requirements**: Explicitly require GitHub hosting, open-source license, detailed README.md, and GitHub Actions for building release artifacts.

### Changed
- Expanded **User Stories** from 2 → 4 (adds viewport & privacy scenarios).  
- Clarified **long‑text threshold** (≥ 30 words) and explicit node exclusions (navbars, sidebars, etc.).  
- **`GET /api/v1/concepts`** now returns an expiry timestamp.  
- Formalised **`POST /api/v1/augment`** response: `<change>` tags, `impact_score`, parsing/safety guidance.  
- Analytics endpoint renamed to **`/api/v1/report_seen`** with detailed payload.  
- Added extensive **Manifest V3** cross‑browser notes and an implementation workflow section.  
- Enlarged **Scope** tables to lock down out‑of‑scope items (mobile, store submission, streaming, etc.).  
- Document retitled **"Glite Browser Extension Specification."**

### Fixed
- Corrected typos (e.g., "Dont'" → "Don't"), unified term "Highlight Mode," and standardised CamelCase service names.

### Removed
- Redundant paragraphs duplicated across sections; folded legacy "event listener" warnings into main principles.

### Security
- Explicit requirement to sanitise any LLM‑derived HTML with **DOMPurify** before DOM insertion.
