import {
  productListResponseSchema,
  productSchema,
  type CreateProductInput,
  type Product,
  type ProductListQuery,
  type ProductListResponse,
  type UpdateProductInput
} from "@dv/contracts";

/** Same fetch pattern as `features/ai-connections/api.ts` — cookie session lives on the API origin. */
async function productsFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json");
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/products${path}`,
    { ...init, credentials: "include", headers }
  );
  if (!res.ok) throw new Error(`products api ${path} failed: ${res.status}`);
  return res;
}

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
