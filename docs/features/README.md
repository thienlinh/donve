# docs/features — feature-slice index

One folder per feature area. Each folder holds that feature's spec/runbook/examples together, instead of flat top-level files.

```
docs/features/
├── leads/
│   ├── integrations.md   — Facebook/Zalo/landing-page/Zapier lead ingestion (BYOK), technical appendix
│   ├── runbook.md        — day-2 ops runbook for the leads module
│   └── examples/
│       └── zalo-miniapp-bridge-worker.ts
├── ai-integration/
│   └── byok.md           — BYOK model for AI provider keys
└── studio/
    └── builder-spec.md   — landing page studio builder spec
```

New feature docs go in their own `docs/features/<feature>/` folder, not as a loose top-level file.
