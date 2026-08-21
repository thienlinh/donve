const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** FR-D-03 anti-spam gate — verifies the invisible-widget token server-side before any write. */
export async function verifyTurnstileToken(
  secretKey: string,
  token: string,
  remoteIp?: string
): Promise<boolean> {
  const body = new URLSearchParams({ secret: secretKey, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  const res = await fetch(SITEVERIFY_URL, { method: "POST", body });
  if (!res.ok) return false;

  const result = (await res.json()) as { success: boolean };
  return result.success;
}
