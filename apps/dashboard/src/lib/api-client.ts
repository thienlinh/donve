/**
 * Shared fetch wrapper for `features/*\/api.ts` modules — cookie session lives on the API
 * origin (Vite dev origin and prod CF Pages both differ from it), so every call needs
 * `credentials: "include"`.
 */
export function createApiFetch(
  baseSegment: string,
  errorLabel: string = baseSegment
): (path: string, init?: RequestInit) => Promise<Response> {
  return async function apiFetch(
    path: string,
    init?: RequestInit
  ): Promise<Response> {
    const headers = new Headers(init?.headers);
    if (!(init?.body instanceof FormData)) {
      headers.set("content-type", "application/json");
    }
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/${baseSegment}${path}`,
      { ...init, credentials: "include", headers }
    );
    if (!res.ok) {
      throw new Error(`${errorLabel} api ${path} failed: ${res.status}`);
    }
    return res;
  };
}
