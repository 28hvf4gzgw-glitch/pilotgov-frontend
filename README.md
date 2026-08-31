# PilotGov — Frontend

**Smart India Hackathon 2026 · Problem Statement SIH26136**
Startup-friendly public procurement — turning a government "need" into a real, scaled contract through a transparent Identify → Discover → Pilot → Scale pipeline.

Live site: [`pilotgov-frontend.vercel.app`](https://pilotgov-frontend.vercel.app)
Backend API: [`pilotgov-backend-production.up.railway.app`](https://pilotgov-backend-production.up.railway.app)

---

## What this is

Government procurement is slow and opaque for startups, and departments rarely get a clear view of whether a pilot is actually working. PilotGov's frontend is the interface for a four-stage pipeline that's backed by a real database end-to-end — not a mockup:

1. **Identify** — a department posts a need through a form with department-name autocomplete
2. **Discover** — startups are matched against that need, each with a match-percent score and an explanation tooltip showing exactly why
3. **Pilot** — an active pilot moves across a kanban tracker (`Applied → Piloting → Scaling → Completed`)
4. **Scale** — a completed pilot becomes a real, downloadable procurement contract

Available in **English, Hindi, and Marathi** via `react-i18next`.

## Tech stack

- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **i18n:** react-i18next (English / Hindi / Marathi)
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Hosting:** Vercel

## Pages & key components

| Route | Component | Purpose |
|---|---|---|
| `/` | `HomePage` | Landing page — hero, how-it-works, trust section, impact calculator |
| `/impact` | `ImpactDashboard` | Live public dashboard pulling real counts from the backend: needs posted, active pilots, contracts scaled, total scaled value, and the pipeline funnel |
| `/domains/:slug` | `DomainPage` | Domain-specific view (AgriTech, CleanTech, HealthTech, etc.) |

| Component | Purpose |
|---|---|
| `PostNeed` | The Identify form, with department-name autocomplete |
| `StartupDiscovery` | The Discover view — startup cards with a match-percent tooltip explaining the score |
| `PilotTracker` | The Pilot kanban board |
| `ImpactDashboard` | Public transparency dashboard fed by `/impact/summary` |
| `AnimatedBackground` | Site-wide persistent background, rendered once at the app root |
| `AssistantWidget` | Floating in-app assistant, rendered once at the app root |
| `LanguageSwitcher` | English / Hindi / Marathi toggle |

## Local setup

```bash
git clone <this-repo>
cd frontend
npm install
npm run dev          # http://localhost:5173
```

By default the app talks to the live Railway backend (see `src/lib/api.ts` for the base URL). To point it at a local backend instead, update that base URL or set the relevant `VITE_*` env var if one is used — check `src/lib/api.ts` for the exact convention before changing it.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | TypeScript check with no emit |
| `npm run lint` | ESLint |

## Internationalization

Translation strings live in `src/i18n/locales/en.json`, `hi.json`, and `mr.json`. When adding a new UI string, add the key to all three files — the app falls back to English for any key missing in another locale, but full coverage keeps the Hindi/Marathi experience consistent.

## Deployment

Deployed on **Vercel**, connected to this GitHub repo — every push to `main` triggers an automatic rebuild and redeploy. Vercel builds with `npm run build` and serves the `dist/` output.

---

Built for SIH26136 · see the backend repo for the API and database schema.