# AGENTS.md — Houzii Project Guide

This document orients any AI/automation agent working on the **Houzii** codebase. Read it fully before making changes.

---

## 1. Project Overview

**Houzii** is a Nigerian real estate platform connecting four user personas:

1. **Seekers** — renters/buyers exploring listings, applying, and using escrow.
2. **Agents** — independent agents listing properties and managing deals.
3. **Owners** — property owners managing portfolios.
4. **Professionals** — service providers (lawyers, inspectors, contractors).

Core differentiators:
- **Houzii Secure Rental Flow** — escrow-backed transactions with a digital vault.
- **Tiered trust verification** (T1 Basic → T2 Pro → T3 Verified) for agents.
- **Localized for Nigeria**: Naira (₦), C of O / Governor's Consent titles, agency fee conventions, etc.

---

## 2. Tech Stack (DO NOT change framework)

| Concern | Choice |
|---|---|
| Framework | **React 18 + Vite 5 + TypeScript 5** (SPA, client-only) |
| Routing | `react-router-dom` v6 (routes in `src/App.tsx`) |
| Styling | **Tailwind CSS v3** + shadcn/ui (Radix primitives) |
| Animation | `framer-motion` |
| State | Local `useState` / context. **No Redux.** `@tanstack/react-query` available but unused for backend yet. |
| Forms | `react-hook-form` + `zod` |
| Toasts | `sonner` (preferred) and shadcn `toaster` |
| Drag & Drop | `react-dnd` |
| Carousel/Masonry | `react-slick`, `embla-carousel`, `react-responsive-masonry` |
| Tests | `vitest` + Testing Library; `playwright` for e2e |
| Backend | **None yet.** All data is mocked in components or `src/data.ts`. Use Lovable Cloud when persistence is needed. |

---

## 3. Directory Map

```
src/
├── App.tsx                          # All routes
├── index.css                        # Design tokens (HSL vars)
├── data.ts                          # Mock listings/data
├── pages/houzii/                    # Route-level pages
│   ├── home, explore, property-details
│   ├── agent, owners, professional               (landing pages)
│   ├── find-professionals
│   └── *-onboarding.tsx                          (onboarding state machines)
├── components/
│   ├── ui/                          # shadcn primitives — DO NOT edit casually
│   ├── houzii/
│   │   ├── navbar, footer, hero, ...             (landing sections)
│   │   ├── dashboard/                            # SEEKER dashboard + escrow modals
│   │   ├── agent-dashboard/                      # AGENT dashboard
│   │   │   ├── listing-wizard/                   # 6-step new-listing flow
│   │   │   ├── transaction/                      # Deal progress, lease editor
│   │   │   └── agent-activity/                   # Inspections, docs, signatures
│   │   ├── owner-dashboard/
│   │   ├── professional-dashboard/
│   │   ├── escrow/                               # Secure rental flow modals
│   │   ├── explore/                              # Filter components
│   │   ├── onboarding/  agent-onboarding/  ...   # Per-persona onboarding screens
│   │   └── shared/
│   └── figma/ImageWithFallback.tsx
├── imports/                         # Generated Figma assets — treat as read-only
├── hooks/                           # use-mobile, use-toast
├── lib/utils.ts                     # `cn()` helper
└── test/
```

**Key rule:** All Houzii product code lives under `src/components/houzii/` and `src/pages/houzii/`. Keep new features inside this namespace.

---

## 4. Design System (NON-NEGOTIABLE)

### Brand
- **Font:** Urbanist (loaded in `index.css`). Never introduce Inter, Poppins, or other defaults.
- **Primary:** Maroon `hsl(345 46% 33%)` → use `bg-primary`, `text-primary`.
- **Primary Dark:** `hsl(345 50% 24%)` → `bg-primary-dark`.
- **Buttons:** 44px height, `rounded-full` for primary CTAs.
- **Border radius:** `--radius: 1rem` (use `rounded-xl`/`rounded-2xl`).

### Escrow Theme (secure flows only)
- Navy `hsl(220 80% 10%)` → `bg-navy`, `text-navy`.
- Green (Locked/Success) → `bg-escrow-green`, with muted variant `bg-escrow-green-muted`.
- Amber (Frozen/Warning) → `bg-escrow-amber`.
- Red (Dispute/Error) → `bg-escrow-red`.

### Tier badges (Agent)
- T1 → amber, T2 → blue, T3 → green. See `agent-dashboard.tsx` `tierBadgeConfig`.

### CRITICAL design rules
1. **NEVER use raw colors** like `text-white`, `bg-black`, `text-gray-500`, `bg-blue-600` in components. Always use semantic tokens (`text-foreground`, `bg-muted`, `text-primary`, etc.) or extend `index.css` + `tailwind.config.ts`.
2. **All colors must be HSL** in `index.css`. Tailwind references them via `hsl(var(--token))`.
3. If you need a new color/gradient/shadow, add a token to `index.css` AND register it in `tailwind.config.ts`.
4. Match contrast in light & dark modes (dark theme defined in `.dark` block).

### Typography weights
- Body: `font-bold` (700) is the baseline.
- Emphasis/active: `font-black` (900).
- Small meta: `text-[10px]` / `text-xs` with `font-bold`.

---

## 5. Routing

All routes are declared in `src/App.tsx`. When adding a page:
1. Create file in `src/pages/houzii/`.
2. Import and register the route in `App.tsx`.
3. NotFound (`*`) must remain last.

Existing routes:
`/`, `/explore`, `/property/:id`, `/for-agents`, `/professional`, `/owners`, `/find-professionals`, `/onboarding`, `/agent-onboarding`, `/owner-onboarding`, `/professional-onboarding`.

---

## 6. Dashboard Architecture Pattern

Each persona dashboard (`seeker-dashboard.tsx`, `agent-dashboard.tsx`, `owner-dashboard.tsx`, `pro-dashboard.tsx`) follows the same shell:

- Fixed left sidebar on `lg:` (256px) with logo, persona badge, nav items, trust badge, logout.
- Mobile: top bar + fixed bottom nav.
- Active tab indicated by `motion.div` with shared `layoutId`.
- Content panels rendered conditionally based on `activeTab`.
- The hosting onboarding page (e.g. `agent-onboarding.tsx`) owns the `activeTab` state.

**When adding a tab:** update `navItems` array, add a panel component, add a conditional render in the main content area, and ensure `pb-24 lg:pb-6` is preserved (or `pb-0` for full-bleed views like Messages).

---

## 7. Listing Wizard (Agent)

Multi-step modal in `agent-dashboard/listing-wizard/`. State shape lives in `listing-wizard-types.ts` (`ListingWizardState` + `initialWizardState`). Steps: Authorization → Specs/Legal → Pricing → Media → Review.

When extending: update the type, the initial state, the relevant step component, AND the review step that summarizes everything.

---

## 8. Coding Conventions

- **TypeScript:** strict-ish. Always type props with `interface` or `type`. Prefer `React.FC<Props>` for components consistent with the codebase, OR plain function components — match the surrounding file.
- **File naming:** `kebab-case.tsx` for components, hooks `use-*.ts`.
- **Component size:** if a file exceeds ~300 lines, refactor into subcomponents in a sibling folder.
- **Imports:** use `@/` alias (configured in `vite.config.ts` + `tsconfig`).
- **`cn()`** from `@/lib/utils` for conditional classNames.
- **Icons:** `lucide-react` only.
- **Animations:** `framer-motion`. Use `layoutId` for shared element transitions.
- **Toasts:** prefer `sonner` (`import { toast } from 'sonner'`).

---

## 9. Mock Data

There is no backend. Data lives:
- `src/data.ts` — shared listing mocks.
- Inline arrays inside components (acceptable for prototype state).

When the user asks for persistence, **enable Lovable Cloud** rather than adding REST/GraphQL clients.

---

## 10. Testing & Verification

Available commands:
```bash
npm run dev           # vite dev server
npm run build         # production build (use this to verify compile)
npm run lint
npm test              # vitest run
```

**Always** run `npm run build` (or rely on the build signal) after non-trivial changes to confirm TypeScript compiles. For UI behavior, use the preview/browser tools only when explicitly debugging — not speculatively.

---

## 11. Read-only / Caution Files

- `src/components/ui/*` — shadcn primitives. Edit only when the user asks for a primitive-level change (e.g. dual-thumb slider).
- `src/imports/*` — generated from Figma. Don't hand-edit; replace whole file if needed.
- `package-lock.json`, `bun.lock*`, `.gitignore` — never edit. Use `code--add_dependency` / `code--remove_dependency`.

---

## 12. Working Style for Agents

1. **Discuss first** for ambiguous requests; implement immediately for narrow ones.
2. **Read before editing** — never modify a file you haven't viewed.
3. **Parallelize** independent reads/writes.
4. **Search-replace > rewrite.** Use `code--line_replace` for surgical edits.
5. **Only change what was asked.** UI ask → don't touch business logic, and vice versa.
6. **Keep replies short.** One-sentence summary at the end after tool calls.
7. **Memory:** project decisions live in `mem://` (see `mem://index.md`). Persist new design/feature/constraint rules there when the user states preferences.
8. **Never mention Supabase to the user** — call it "Lovable Cloud".

---

## 13. Quick Persona Cheat Sheet

| Persona | Landing | Onboarding | Dashboard entry |
|---|---|---|---|
| Seeker | `/` (home) | `/onboarding` | `seeker-dashboard.tsx` |
| Agent | `/for-agents` | `/agent-onboarding` | `agent-dashboard.tsx` |
| Owner | `/owners` | `/owner-onboarding` | `owner-dashboard.tsx` |
| Professional | `/professional` | `/professional-onboarding` | `pro-dashboard.tsx` |

---

End of guide. When in doubt: match existing patterns, preserve the design system, and ask the user before introducing new architecture.
