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

## Architecture

This is an **Angular 21 Micro-frontend (MFE) CRM** using Webpack Module Federation. Two Angular projects live under `projects/` in an Angular workspace monorepo.

### Projects

| Project | Port | Role |
|---|---|---|
| `shell` | 4200 | Host/container app — layout, routing, dashboard |
| `tickets-mfe` | 4201 | Remote MFE — ticket CRUD feature |

The shell dynamically loads the tickets MFE at runtime via `@angular-architects/module-federation`. The remote entry is fetched from `http://localhost:4201/assets/remoteEntry.js`.

### Module Federation wiring

- **Shell** (`projects/shell/webpack.config.js`): declares `ticketsMfe` as a remote
- **Tickets MFE** (`projects/tickets-mfe/webpack.config.js`): exposes `./Module` → `TICKETS_ROUTES`
- Shell lazy-loads ticket routes by pointing to the exposed module path
- Shared singletons: `@angular/core`, `@angular/router`, `rxjs`, `zone.js`

### Routing

```
/dashboard         → shell (Dashboard component)
/tickets           → tickets-mfe (TicketList)
/tickets/create    → tickets-mfe (TicketForm)
/tickets/:id       → tickets-mfe (TicketDetail)
/tickets/:id/edit  → tickets-mfe (TicketForm)
```

### Key patterns

- **Standalone components** throughout — no NgModules
- **Angular Signals** for reactive state in services (not RxJS BehaviorSubject)
- **Angular Material 21** for all UI components
- **SCSS** for styling; global styles in each project's `src/styles.scss`
- `TicketService` holds mock data (no backend API yet); signals drive reactive data flow
- TypeScript strict mode, ES2022 target, bundler module resolution

### Project layout

```
projects/
├── shell/src/app/
│   ├── layout/         header, sidebar, footer components
│   ├── pages/          dashboard and other shell-owned pages
│   ├── app.routes.ts   shell routing (lazy-loads tickets-mfe)
│   └── app.config.ts   Angular application config
└── tickets-mfe/src/app/
    ├── tickets/
    │   ├── components/ ticket-list, ticket-form, ticket-detail
    │   ├── models/     ticket.model.ts
    │   ├── services/   ticket.service.ts (signals-based)
    │   └── tickets.routes.ts
    ├── app.routes.ts
    └── app.config.ts
```

Build tooling: `ngx-build-plus` extends `@angular-devkit/build-angular` to apply custom webpack configs per project.
