# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start shell only (port 4200)
npm run start

# Start tickets MFE only (port 4201)
npm run start:tickets

# Start both shell + tickets MFE concurrently
npm run start:all

# Build all projects
npm run build:all

# Build individual projects
npm run build          # shell only
npm run build:tickets  # tickets-mfe only

# Test and lint
npm test
npm run lint
```

Node >= 22.0.0 and npm >= 10.0.0 are required.

## Project identity

**FarmEasy CRM** — Angular 21 Micro-frontend CRM for the FarmSiddhi agri-commerce platform.
Backend: Nexxus CRM FastAPI (`/api/v1/*`). Workspace name: `farmeasy-crm-fe`.

## Current state

Angular workspace (not Nx) with two projects under `projects/`:

| Project | Port | Role |
|---|---|---|
| `shell` | 4200 | Host — auth, layout, routing, MFE orchestration |
| `tickets-mfe` | 4201 | Remote MFE — ticket CRUD |

Build tooling: `ngx-build-plus` extends `@angular-devkit/build-angular` to apply custom webpack configs per project.

## Target monorepo structure (Nx 18+)

```
apps/
  shell/               ← Host: auth, layout, routing, MFE orchestration
  mfe-dashboard/       ← KPI cards, pipeline summary, alerts feed
  mfe-leads/           ← Lead list, inbox, chat panel, stage funnel
  mfe-opportunities/   ← Kanban pipeline (drag-drop), deal detail
  mfe-orders/          ← Order tracker, POD upload, logistics status
  mfe-buyers/          ← Buyer directory, GMV, deal history
  mfe-farmers/         ← Farmer network, supply map, commodity links
  mfe-commodities/     ← Mandi prices, grade catalog, price trends
  mfe-tickets/         ← Reuse from existing tickets-mfe (minimal changes)
  mfe-analytics/       ← Supply/demand charts, funnel, revenue trends
  mfe-settings/        ← Tenant config, users, pipeline stages, roles

libs/
  ui-kit/              ← DataTableComponent, KanbanBoardComponent, badges, metric cards, chat panel, ToastService
  shared-auth/         ← AuthService, JwtInterceptor, TenantInterceptor, AuthGuard, authStore
  shared-api/          ← BaseApiService, ApiResponse<T>, PaginatedResponse<T> types
  shared-state/        ← NgRx Signal Store: currentUser, tenant, notifications, ws connection
  shared-utils/        ← Pipes (currency-inr, kg-format), validators, date helpers
```

Each new MFE scaffold must include: `routes.ts`, `pages/`, `components/`, `services/`, `models/`.

## Module Federation wiring

- Shell (`projects/shell/webpack.config.js`) declares remotes; tickets MFE is at `http://localhost:4201/assets/remoteEntry.js`
- Tickets MFE (`projects/tickets-mfe/webpack.config.js`) exposes `./Module` → `TICKETS_ROUTES`
- All routes are lazy-loaded via `loadRemoteModule()` — never eager-import across MFE boundaries
- Shared singletons: `@angular/core`, `@angular/router`, `rxjs`, `zone.js` with `singleton: true, strictVersion: true`
- MFEs communicate **only** via `shared-state` NgRx Signal Store or router navigation — never direct imports between MFEs

## Backend API contract

```
Base URL:    /api/v1
Auth:        Authorization: Bearer <JWT>
JWT payload: { sub: userId, tenant_id, role, exp }
WebSocket:   /ws/notifications?token=<JWT>

Response shapes:
  Single:     { data: T, meta: PaginationMeta }
  Collection: { items: T[], total, page, size }
```

API modules: `/auth`, `/leads`, `/opportunities`, `/orders`, `/buyers`, `/farmers`, `/commodities`, `/analytics/dashboard`, `/analytics/supply-demand`, `/tickets`

## Coding rules

### Components
- **Standalone components only** — no NgModules anywhere
- **OnPush** change detection on all display/dumb components
- **Smart/Dumb pattern**: page components (smart) inject services and pass `data$` observables down; display components are pure
- No HTTP calls inside components — service layer only

### State & reactivity
- **Angular Signals** within each MFE for local reactive state
- **NgRx Signal Store** (`shared-state`) for cross-MFE shared state
- Services expose signals (`readonly`) or `Observable<T>` — never raw `BehaviorSubject` as public API

### HTTP
- Every HTTP service method returns `Observable<T>` or `Observable<ApiResponse<T>>`
- Global error handling via `JwtInterceptor` in `shared-auth` (401 → silent refresh → retry)
- Toast notifications via `ToastService` from `ui-kit`

### Forms
- **Reactive Forms only** — no template-driven forms
- Every form has: `loading = signal(false)`, `error = signal<string | null>(null)`, success redirect

### Typing
- **No `any`** — all API shapes typed via interfaces in `models/`
- Strict TypeScript throughout

### Styling
- **SCSS** with CSS custom properties — no hardcoded color values in component files
- Global styles per project in `src/styles.scss`

### UI components
- Tables → `DataTableComponent` from `ui-kit` (pass `columns` config + `data$` observable)
- Kanban → `KanbanBoardComponent` from `ui-kit` (pass `lanes$` observable + drag-drop handler)
- All UI via Angular Material 21

## Current tickets-mfe patterns (reference implementation)

- `TicketService` uses `signal<Ticket[]>` + `computed()` for filtering — replicate this pattern in new MFE services
- `TicketFilter` / `CreateTicketDto` / `UpdateTicketDto` interfaces show the DTO pattern to follow
- Currently uses mock data; HTTP migration will follow `BaseApiService` from `shared-api`
- Shell lazy-loads tickets via `loadRemoteModule({ type: 'module', remoteEntry, exposedModule: './Module' })`
