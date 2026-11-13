# forclosureworkflow — Foreclosure Lead Scrub + CRM

Foreclosure notice ingestion, enrichment, and CRM pipeline for distressed-property prospecting. Parses weekly legal notices (Macomb/Bay County), enriches owners with contact data, and exports to external CRMs. Built as part of the RealEstateCRM project family for Excel Legacy Realty Group.

(The repo name is spelled `forclosureworkflow` — missing the second "e" in "foreclosure." That is the actual name, not a typo in this README.)

## Status

**In development; quiet since 2026-11-02.** Version 1.1.12 (per `VERSION.md` and `CHANGELOG.md`). Last commit 2026-11-02 (pinning the Turbopack workspace root). Recent work before that: real BS&A tax-assessor scraping with no simulated address resolution (Oct 21), LLM notice parsing via DeepSeek (Oct 21), and a README rewrite replacing the create-next-app boilerplate (Oct 21).

## What it does

- **Automated intake** — weekly foreclosure notice ingestion (`/api/intake`, cron-targeted) with `MacombCountyParser` / `LLMNoticeParser` (DeepSeek V4) extraction of owner, property address, sale date
- **Geocoding** — OpenStreetMap resolution of parsed addresses to map pins
- **Duplicate protection** — address/owner dedup on every intake pass
- **Contact enrichment** — CyberBackgroundChecks/Google quick-links + "Run MyPlus Leads Automation" (Playwright scrape of the data provider)
- **Tax-assessor lookup** — `TaxAssessorConnector` (Playwright/Browserless) resolves legal property descriptions into physical street addresses via headless tax-portal lookups
- **Lead scoring** — dynamic score bumps on phone/email discovery; equity and valuation (AVM) tracking
- **Data export** — push to HubSpot (native API key) or generic webhook (Zapier/Make)
- **CSV import** — legacy lead upload with geocode backfill batch tooling
- **Map view** — geocoded leads with pin-to-detail navigation
- **Voice monitoring** — real-time WebSocket (Socket.IO) call monitoring with Twilio Voice webhooks
- **Access control** — role-based auth (Admin, Manager, Agent) via NextAuth + bcrypt

## Architecture

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4
- **Database:** Prisma — SQLite for the MVP phase (the schema has also carried a Postgres shape; see `CHANGELOG.md` 1.1.8)
- **Auth:** NextAuth (JWT sessions, database-driven credentials)
- **Parsers:** `src/lib/parsers/` — regex heuristic (`core.ts`) + LLM (`llm_parser.ts`, DeepSeek via OpenAI-compatible SDK)
- **Exports:** `src/lib/webhook.ts` — generic REST push client
- **Documents:** AWS S3 upload adapter

## Routes

| Route | Purpose |
|---|---|
| `/leads` | CRM list view |
| `/leads/[id]` | Lead detail (enrichment, notes, relatives, tasks) |
| `/leads/new` | Manual lead creation |
| `/map` | Geospatial view |
| `/segments` | Saved lead segments |
| `/data-quality` | Completeness scoring |
| `/settings` | HubSpot key, webhook URL, import, geocode backfill, danger zone |

## What's working / what's not

- Intake, parsing (regex + LLM), enrichment, tax-assessor lookup, scoring, export, and the CRM views are implemented, per the changelog (v1.1.0–1.1.12). The Oct 21 work replaced simulated address resolution with real BS&A scraping.
- No production deployment is documented in this repo — `DEPLOY.md` describes a Hetzner deploy (port 3212), but there is no live URL, uptime, or user evidence in the repo itself. The app is built by the main RealEstateCRM repo's CI (foreclosureworkflow job), which was green as of Nov 12, 2026 (RealEstateCRM v0.63.6). Locally it runs on port 3002.
- Housekeeping: `package.json` still says `"name": "temp-app"` and version `0.1.0` — both stale placeholders; the real version is 1.1.12 per `VERSION.md`.
- Live-service behavior (real notice intake, real enrichment, real exports) depends on API keys configured via `.env` — no evidence in the repo that the full chain has run end-to-end against live services.

## Relationship to RealEstateCRM

This is a satellite service of [RealEstateCRM](https://github.com/RealEstateCRMLLC/RealEstateCRM) — the foreclosure pipeline (notice intake, enrichment, lead scrubbing) that feeds the main CRM. It is a separate service, not part of the main CRM codebase. The main CRM repo carries its own foreclosure parser tests and the Macomb County pipeline spec; this repo is the standalone workflow app.

## Running it

```bash
npm install --legacy-peer-deps
npx prisma generate && npx prisma db push
npm run dev
```

Environment: `DATABASE_URL`, `NEXTAUTH_SECRET`, `DEEPSEEK_API_KEY` (LLM notice parsing). See `DEPLOY.md` for deployment.

## Documentation

| File | Purpose |
|---|---|
| `ARCHITECTURE.md` | Full technical architecture |
| `MANUAL.md` | End-user manual (intake → enrich → export) |
| `docs/macomb-*.md` | County foreclosure pipeline specs + field maps |
| `DEPLOY.md` | Deployment (Hetzner, port 3212) |

## Links

- Main CRM: https://github.com/RealEstateCRMLLC/RealEstateCRM
- Org: https://github.com/RealEstateCRMLLC
