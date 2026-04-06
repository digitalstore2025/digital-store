# Digital Store E2E Proposal

This branch intentionally does **not** overwrite the current project on `main`.

## Why
The repository currently contains a different product. Replacing it directly would be destructive.

## What is ready now
A production-oriented starter has already been built offline and is ready to be pushed into a dedicated repository:

- Backend: Express + Prisma + PostgreSQL + JWT
- Frontend: Next.js storefront
- Infra: Docker Compose
- Core flows:
  - register / login
  - product listing / details
  - order creation
  - stock validation inside transaction

## Recommended path
Create a new repository:

`digitalstore2025/digital-store-platform`

Then push the prepared project there.

## Suggested immediate steps
1. Create the new repo
2. Push the prepared project archive contents
3. Add Stripe
4. Add admin dashboard
5. Add image upload
6. Add tests and CI/CD

## Why this is the highest-value safe move
- preserves existing work on `main`
- documents the intended migration cleanly
- gives a clear operational path for a real product repo

## Local artifact already prepared
A complete project archive was prepared in the working environment for upload and deployment.
