import { Hono } from "hono";

import type { AppEnv } from "@/types.js";

import { architectureRoutes } from "./routes/architecture.routes.js";
import { assetsRoutes } from "./routes/assets.routes.js";
import { auditRoutes } from "./routes/audit.routes.js";
import { businessRoutes } from "./routes/business.routes.js";
import { crudRoutes } from "./routes/crud.routes.js";
import { customImportRoutes } from "./routes/custom-import.routes.js";
import { generateRoutes } from "./routes/generate.routes.js";
import { optimizationRoutes } from "./routes/optimization.routes.js";
import { publishRoutes } from "./routes/publish.routes.js";
import { strategyRoutes } from "./routes/strategy.routes.js";
import { versionsRoutes } from "./routes/versions.routes.js";

// This module was originally one ~3,200-line file with ~44 route handlers concatenated
// together (each self-contained, sharing only `requireOrgId`/`requireLandingPage` — see
// `./shared.ts`). Split into sub-routers by domain, purely a reorganization: every route path,
// handler body, and middleware ordering is unchanged from before the split.
export const landingsRoutes = new Hono<AppEnv>();

landingsRoutes.route("/", crudRoutes);
landingsRoutes.route("/", businessRoutes);
landingsRoutes.route("/", strategyRoutes);
landingsRoutes.route("/", architectureRoutes);
landingsRoutes.route("/", auditRoutes);
landingsRoutes.route("/", optimizationRoutes);
landingsRoutes.route("/", customImportRoutes);
landingsRoutes.route("/", generateRoutes);
landingsRoutes.route("/", versionsRoutes);
landingsRoutes.route("/", assetsRoutes);
landingsRoutes.route("/", publishRoutes);
