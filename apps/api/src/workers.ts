import { createApp } from "./app.js"

// Cloudflare Workers entrypoint — `Bindings` (apps/api/src/types.ts) is read
// from wrangler vars/secrets at request time via `c.env`, set up alongside
// the deploy config (docs/runbooks/prompt-playbook.md Phase 0 CI/CD step).
const app = createApp()

export default app
