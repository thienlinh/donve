Deploy, seed, and Lighthouse CI scripts live here (per docs/architecture/architecture.md).

- `lighthouse-ci/` — NFR-01 gate (`bun run tooling/lighthouse-ci/run.ts <sample-landing-url>`), wired into `.github/workflows/deploy-staging.yml` once the `SAMPLE_LANDING_URL` repo variable is set (docs/runbooks/ci-cd-setup.md §7).
- Deploy/seed scripts: not implemented yet.
