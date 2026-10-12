# AGENTS.md — Operational Directives for energeia.cy

## 1. Environment & Execution Bounds
- Node.js 20+ / pnpm for web and API layers.
- Python 3.12+ / Poetry for data pipelines and ingestion.
- Hydration: `pnpm install --frozen-lockfile` or `poetry install --no-interaction`
- Test Verification: `pnpm vitest run && pnpm typecheck` or `poetry run pytest -v`
- EXECUTION RESTRICTION: Never start persistent/long-running processes (no `pnpm dev`, `uvicorn`, or file watchers). Only run bounded build, lint, and test commands.

## 2. Cyprus Regulatory & Domain Invariants
- EAC / AHK: Electricity Authority of Cyprus (state utility and distribution system operator).
- CERA / RAEK: Cyprus Energy Regulatory Authority (independent market regulator).
- TSOC / DSM: Transmission System Operator of Cyprus.
- BESS: Battery Energy Storage Systems.
- Net Billing vs Net Metering: In Cyprus, Net Metering offsets physical kWh directly; Net Billing offsets generation value against wholesale market avoidance cost. Never conflate the two.
- Fuel Adjustment Clause: Billed tariffs depend on indexed heavy fuel oil pricing and variable fuel cost adjustments (αναπροσαρμογή καυσίμων).

## 3. Localization & Styling Rules
- Dictionaries are stored in `locales/{locale}.json`.
- When adding keys to `en.json`, identical keys must be populated across `el.json`, `ru.json`, and `he.json`.
- For Hebrew (`he`), strictly use CSS logical properties (`margin-inline-start`, `padding-inline-end`) rather than directional properties to preserve RTL layouts.

## 4. Code Modification & Testing
- Read existing file contents completely before generating patches.
- Never delete or comment out existing test assertions to bypass failures.
