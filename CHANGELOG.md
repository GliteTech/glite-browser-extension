# Changelog

All notable changes to this project are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com) and the
project adheres to Semantic Versioning.

## [2.0.0] – 2025‑04‑21

### Added

- **Table of Contents**: Added a new table of contents for easier navigation.
- **User‑facing UI**: Toolbar icon & popup, context‑menu commands,
  highlight‑mode tooltips, full settings page.
- **Performance guidance**: Web Workers for CPU‑heavy tasks, HTTP Keep‑Alive,
  explicit memory‑management rules within Important Principles.
- **Privacy by Design** principle + central **`applyOrSkip()`** decision hook
  within Important Principles.
- **Viewport‑aware processing** user story & logic.
- **Safeguards**: Ignore user‑editable regions; re‑render guard counter;
  per‑paragraph / per‑1000‑word density caps.
- **Blacklisting** (global + personal) and "seen" concept analytics with
  visibility tracking and new `/report_seen` endpoint.
- **Backend API Additions**: New `/api/v1/compatibility_check` endpoint and an
  API sequence diagram (Section 7).
- **Versioning and Update Strategy**: New section (Section 8) detailing API
  versioning, backward compatibility, and update handling.
- **Extension Architecture Overview**: New section (Section 10) with
  high-level component, augmentation flow, and UI/settings diagrams.
- **Required Permissions (Manifest V3)**: New section (Section 11) detailing
  necessary manifest permissions.
- **Development stack**: TypeScript mandate, Vite/Webpack option,
  Vitest/Playwright tests, ESLint + Prettier CI, Lighthouse budgets,
  WCAG 2.1 AA requirement.
- **Browser Compatibility and Standards Compliance**: New section (Section 13)
  detailing target browsers, store policies, Manifest V3 differences, and
  WCAG compliance.
- **Testing Strategy & Unit Coverage**: New section (Section 14) outlining
  required unit test coverage and performance testing metrics/conditions.
- **Security note**: Mandatory DOMPurify sanitisation of LLM responses.
- **Project requirements**: Explicitly require GitHub hosting, open-source
  license, detailed README.md, and GitHub Actions for building release
  artifacts.
- **Milestones**: New section (Section 16) outlining a phased development plan.

### Changed

- Expanded **User Stories** from 2 → 4 (adds viewport & privacy scenarios).
- Clarified **long‑text threshold** (≥ 30 words) and explicit node
  exclusions (navbars, sidebars, etc.).
- **Backend API General**: Added requirement for `X-Client-Version` header and
  note on general compatibility handling.
- **`GET /api/v1/concepts`** response now includes an `expire` timestamp.
- **`POST /api/v1/augment`** request format specified (batched, `request_id`);
  response format formalised (`<change>` tags with attributes, `impact_score`,
  parsing/safety guidance).
- **`/api/v1/report_seen`** analytics endpoint formally named and payload
  detailed.
- **`/api/v1/settings/global_blacklist`** endpoint specified with response
  format.
- Added extensive **Manifest V3** cross‑browser notes.
- Added detailed **Core Functionality Workflow** description and diagram
  (Section 9), replacing the previous empty section.
- Enlarged **Scope** tables (Section 15) to lock down out‑of‑scope items
  (mobile, store submission, streaming, etc.).
- Document retitled **"Glite Browser Extension Specification."**

### Fixed

- Corrected typos (e.g., "Dont'" → "Don't"), unified term "Highlight Mode,"
  and standardised CamelCase service names.

### Removed

- Redundant paragraphs duplicated across sections; folded legacy "event
  listener" warnings into main principles.

### Security

- Explicit requirement to sanitise any LLM‑derived HTML with **DOMPurify**
  before DOM insertion.
