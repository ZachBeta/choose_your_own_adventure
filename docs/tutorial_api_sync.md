# Keeping Frontend, Backend, and API Schema in Sync: A Mid-Level Engineer Tutorial

This guide explains how to reliably keep your frontend, backend, and API schema in sync using OpenAPI, TypeScript, and Express. It weighs common approaches and provides a step-by-step workflow for a robust, maintainable TypeScript project.

---

## Why This Matters

- **Manual API syncing leads to bugs and drift.**
- **Automated tooling ensures contracts are enforced** across your stack.

---

## Common Approaches: Pros & Cons

| Approach                     | Drift Risk | Runtime Safety | Dev Speed | Tooling Complexity |
|------------------------------|------------|---------------|-----------|--------------------|
| Manual Sync                  | High       | Low           | Fast      | Low                |
| Type Generation from OpenAPI | Low        | Medium        | Medium    | Medium             |
| OpenAPI Middleware           | Low        | High          | Medium    | Medium             |
| Code-First Schema            | Low        | High          | Fast      | High               |
| Contract Testing             | Low        | High          | Medium    | Medium             |

---

## Recommended Workflow (for TypeScript/Express/React)

### 1. Use OpenAPI as the Source of Truth
- Define all endpoints, request/response shapes, and error codes in `openapi.yaml`.

### 2. Generate Types for Frontend & Backend
- Use [`openapi-typescript`](https://github.com/drwpow/openapi-typescript) to generate TypeScript types from your OpenAPI spec:
  ```sh
  npx openapi-typescript openapi.yaml -o frontend/src/types/openapi.d.ts
  npx openapi-typescript openapi.yaml -o backend/src/types/openapi.d.ts
  ```
- Never hand-edit these files; always re-generate after spec changes.

### 3. Add OpenAPI Validation Middleware to Backend
- Use [`express-openapi-validator`](https://github.com/coinbase/express-openapi-validator) to enforce request/response validation:
  ```sh
  npm install express-openapi-validator
  ```
- In your Express app:
  ```ts
  import { OpenApiValidator } from 'express-openapi-validator';

  app.use(
    OpenApiValidator.middleware({
      apiSpec: path.join(__dirname, '../openapi.yaml'),
      validateRequests: true,
      validateResponses: true,
    })
  );
  ```

### 4. Add a Catch-All 404 Handler in Backend
- To catch and log unknown API paths:
  ```ts
  app.use('/api/*', (req, res) => {
    logError(`Unknown API endpoint: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Not found' });
  });
  ```

### 5. (Optional) Add Contract Tests
- Use [schemathesis](https://schemathesis.readthedocs.io/) or similar tools to automatically test your API against the OpenAPI spec.

---

## Best Practices
- **Always update and commit your OpenAPI spec with API changes.**
- **Automate type generation** as a pre-commit or CI step.
- **Use runtime validation** to catch errors early.
- **Document your workflow** so all contributors follow the same process.

---

## Example Project Structure
```
choose_your_own_adventure/
  openapi.yaml
  frontend/
    src/types/openapi.d.ts  # generated
    ...
  backend/
    src/types/openapi.d.ts  # generated
    src/index.ts
    ...
```

---

## Further Reading
- [OpenAPI Specification](https://swagger.io/specification/)
- [openapi-typescript](https://github.com/drwpow/openapi-typescript)
- [express-openapi-validator](https://github.com/coinbase/express-openapi-validator)
- [schemathesis](https://schemathesis.readthedocs.io/)

---

This workflow will help you keep your API, frontend, and backend in sync, reduce bugs, and improve maintainability as your project grows.
