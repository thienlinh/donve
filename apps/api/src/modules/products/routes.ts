import {
  createProductSchema,
  productListQuerySchema,
  productListResponseSchema,
  productSchema,
  updateProductSchema
} from "@dv/contracts";
import { auditLogsRepository, productsRepository } from "@dv/db";
import { Hono, type Context } from "hono";

import { createDbFromEnv } from "@/lib/db.js";
import { ApiError } from "@/lib/errors.js";
import type { AppEnv } from "@/types.js";

export const productsRoutes = new Hono<AppEnv>();

function requireOrgId(c: Context<AppEnv>): string {
  const orgId = c.get("orgId");
  if (!orgId) throw new ApiError(500, "missing_org_context");
  return orgId;
}

productsRoutes.get("/", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const query = productListQuerySchema.parse(c.req.query());

  const { rows, total } = await productsRepository.listPage(
    db,
    orgId,
    query.page,
    query.pageSize
  );
  return c.json(
    productListResponseSchema.parse({
      products: rows,
      total,
      page: query.page,
      pageSize: query.pageSize
    })
  );
});

productsRoutes.post("/", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const body = createProductSchema.parse(await c.req.json());

  const row = await productsRepository.insert(db, orgId, {
    ...body,
    price: String(body.price)
  });
  if (!row) throw new ApiError(500, "product_create_failed");
  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "product.create",
    targetType: "product",
    targetId: row.id,
    meta: { name: row.name }
  });
  return c.json(productSchema.parse(row), 201);
});

productsRoutes.patch("/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = updateProductSchema.parse(await c.req.json());

  const existing = await productsRepository.findById(db, orgId, id);
  if (!existing || existing.deletedAt) {
    throw new ApiError(404, "product_not_found");
  }

  const updated = await productsRepository.update(db, orgId, id, {
    ...body,
    price: body.price === undefined ? undefined : String(body.price)
  });
  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "product.update",
    targetType: "product",
    targetId: id,
    meta: { fields: Object.keys(body) }
  });
  return c.json(productSchema.parse(updated));
});

productsRoutes.delete("/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");

  const existing = await productsRepository.findById(db, orgId, id);
  if (!existing || existing.deletedAt) {
    throw new ApiError(404, "product_not_found");
  }

  await productsRepository.update(db, orgId, id, { deletedAt: new Date() });
  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "product.delete",
    targetType: "product",
    targetId: id,
    meta: {}
  });
  return c.body(null, 204);
});
