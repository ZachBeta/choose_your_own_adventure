# API Sync Best Practices Checklist

Use this checklist to ensure your frontend, backend, and API schema stay in sync and robust. Each step is derived from the recommended workflow in the tutorial.

---

## 1. OpenAPI as Source of Truth
- [ ] All endpoints, request/response shapes, and errors are defined in `openapi.yaml`.
- [ ] `openapi.yaml` is updated and committed with every API change.

## 2. Type Generation
- [ ] `openapi-typescript` is installed as a dev dependency.
- [ ] TypeScript types are generated for both frontend and backend:
    - [ ] `npx openapi-typescript openapi.yaml -o frontend/src/types/openapi.d.ts`
    - [ ] `npx openapi-typescript openapi.yaml -o backend/src/types/openapi.d.ts`
- [ ] Type generation is automated (e.g., pre-commit hook or CI step).
- [ ] Never hand-edit generated type files.

## 3. Backend Validation
- [ ] `express-openapi-validator` is installed in the backend.
- [ ] Validation middleware is added to Express:
    - [ ] Requests are validated against the OpenAPI spec.
    - [ ] Responses are validated against the OpenAPI spec.
- [ ] All endpoints are described in the OpenAPI spec.

## 4. Catch-All 404 Handler
- [ ] Backend has a catch-all handler for unknown `/api/*` paths.
- [ ] Unknown endpoint accesses are logged as errors.
- [ ] 404 JSON error responses are returned for unknown endpoints.

## 5. Contract Testing (Optional but Recommended)
- [ ] Contract testing tool (e.g., schemathesis) is set up.
- [ ] Automated tests verify backend implementation matches the OpenAPI spec.

## 6. Best Practices
- [ ] Team is trained to always update `openapi.yaml` with API changes.
- [ ] Type generation and validation steps are documented in the README or onboarding docs.
- [ ] Workflow is reviewed periodically for gaps or improvements.

---

Keep this checklist in your project docs and review it regularly to maintain API contract integrity and developer velocity.
