import {
  productListResponseSchema,
  productSchema,
  type CreateProductInput,
  type Product,
  type ProductListQuery,
  type ProductListResponse,
  type UpdateProductInput
} from "@dv/contracts";

import { createApiFetch } from "@/lib/api-client";

const productsFetch = createApiFetch("products");

export async function fetchProductsPage(
  query: ProductListQuery
): Promise<ProductListResponse> {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize)
  });
  const res = await productsFetch(`?${params.toString()}`);
  return productListResponseSchema.parse(await res.json());
}

/** ponytail: convenience wrapper for the campaign form's "attach products" checkbox list, which
 * wants the full org catalog, not a page — capped at the API's max pageSize (100). Add real
 * "load more" here if an org ever has more products than that. */
export async function fetchProducts(): Promise<Product[]> {
  const { products } = await fetchProductsPage({ page: 1, pageSize: 100 });
  return products;
}

export async function createProduct(
  input: CreateProductInput
): Promise<Product> {
  const res = await productsFetch("", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return productSchema.parse(await res.json());
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput
): Promise<Product> {
  const res = await productsFetch(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
  return productSchema.parse(await res.json());
}

export async function removeProduct(id: string): Promise<void> {
  await productsFetch(`/${id}`, { method: "DELETE" });
}
