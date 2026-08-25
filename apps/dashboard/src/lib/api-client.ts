/**
 * Every API error response is `{ error: { code, message, requestId } }`
 * (`apps/api/src/middleware/error-handler.ts`) — `code` is the stable, machine-readable field
 * meant for the frontend to `switch` on. Thrown alongside the generic `Error` (never replacing
 * it) so existing `onError` handlers that only read `.message` keep working unchanged; callers
 * that want a specific message per error code can catch `ApiClientError` and read `.code`.
 */
export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly apiMessage: string;

  constructor(status: number, code: string, apiMessage: string) {
    super(apiMessage);
    this.status = status;
    this.code = code;
    this.apiMessage = apiMessage;
  }
}

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
      const body: unknown = await res.json().catch(() => null);
      const error =
        body &&
        typeof body === "object" &&
        "error" in body &&
        body.error &&
        typeof body.error === "object" &&
        "code" in body.error
          ? (body.error as { code: string; message?: string })
          : null;
      if (error) {
        throw new ApiClientError(
          res.status,
          error.code,
          error.message ?? error.code
        );
      }
      throw new Error(`${errorLabel} api ${path} failed: ${res.status}`);
    }
    return res;
  };
}
