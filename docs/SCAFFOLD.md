# Project Scaffold & Integration Points

This document describes the recommended folder structure and integration points for the Cyberpunk Disco Elysium-Style Choose-Your-Own-Adventure Game. It is designed to clarify ownership and enable parallel work across roles.

---

## Folder Structure

```
choose_your_own_adventure/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Route handlers (API logic)
│   │   ├── models/            # DB models and ORM logic
│   │   ├── routes/            # Express route definitions
│   │   ├── services/          # AI integration, business logic
│   │   ├── utils/             # Helpers, validation, logging
│   │   └── index.ts           # App entrypoint
│   ├── tests/                 # Backend unit/integration tests
│   ├── migrations/            # DB migration scripts
│   ├── swagger/               # API documentation
│   ├── .env.example           # Backend env vars template
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # UI components (Map, Dialog, etc.)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Top-level views (if using React Router)
│   │   ├── state/             # State management (store, slices, etc.)
│   │   ├── styles/            # CSS/SCSS files
│   │   ├── api/               # API client logic (fetch, axios, etc.)
│   │   └── App.tsx            # Main app component
│   ├── tests/                 # Frontend unit/component tests
│   ├── .env.example           # Frontend env vars template
│   ├── Dockerfile
│   └── package.json
├── shared/
│   ├── types/                 # Shared TypeScript types/interfaces
│   └── utils/                 # Shared utilities (if needed)
├── docs/
│   ├── PROJECT_PLAN.md
│   ├── ARCHITECTURE.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── BACKEND_PLAN.md
│   ├── FRONTEND_PLAN.md
│   ├── FULLSTACK_PLAN.md
│   ├── QA_PLAN.md
│   └── PM_PLAN.md
├── .gitignore
├── README.md
└── docker-compose.yml         # For local multi-service dev
```

---

## Integration Points by Role

- **Backend:**  
  - Owns `backend/src/`, DB models, API logic, AI integration, and migrations.
  - Exposes REST API via `backend/src/routes/` and `controllers/`.
  - Documents endpoints in `swagger/` for frontend and integration teams.

- **Frontend:**  
  - Owns `frontend/src/`, builds UI, state management, and effects.
  - Consumes backend APIs via `frontend/src/api/`.
  - Implements visual polish and UX in `components/` and `styles/`.

- **Full Stack/Integration:**  
  - Owns `shared/types/` (TypeScript interfaces for API, DB, etc.).
  - Ensures API contracts match between frontend and backend.
  - Writes integration/e2e tests (`backend/tests/`, `frontend/tests/`).
  - Manages docker-compose and shared utils.

- **QA:**  
  - Adds/maintains tests in both `backend/tests/` and `frontend/tests/`.
  - Documents test cases and coverage.

- **PM/Tech Lead:**  
  - Maintains `docs/` directory, updates plans, changelogs, and architecture.
  - Coordinates with all teams for documentation and process.

---

This scaffold is intended to enable efficient parallel development and clear integration between all roles.

_Last updated: 2025-04-16_
