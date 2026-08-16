import { text, timestamp } from "drizzle-orm/pg-core"
import { ulid } from "ulid"

export const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => ulid())

export const timestamps = {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}

export const deletedAt = () => timestamp("deleted_at")
