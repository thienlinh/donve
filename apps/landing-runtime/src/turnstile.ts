import type { RuntimeConfig } from "./config.js";

interface TurnstileApi {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  execute(widgetId: string): void;
  reset(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const WIDGET_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js";

let scriptLoad: Promise<TurnstileApi | null> | null = null;
const widgetIdByForm = new WeakMap<HTMLFormElement, string>();
const resolverByWidget = new Map<string, (token: string) => void>();

function loadTurnstile(): Promise<TurnstileApi | null> {
  if (scriptLoad) return scriptLoad;
  scriptLoad = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = WIDGET_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.turnstile ?? null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
  return scriptLoad;
}

function settle(widgetId: string, token: string): void {
  const resolve = resolverByWidget.get(widgetId);
  resolverByWidget.delete(widgetId);
  resolve?.(token);
}

/**
 * Resolves a fresh invisible-Turnstile token for one form submit (FR-D-03). Renders one
 * hidden widget per form (reused across repeat submits via `execute`/`reset`, not re-created).
 * Resolves `""` — never rejects — whenever Turnstile isn't configured or fails to load, so a
 * misconfigured site key degrades to "server rejects the submit" rather than a JS crash.
 */
export async function getTurnstileToken(
  config: RuntimeConfig,
  form: HTMLFormElement
): Promise<string> {
  if (!config.turnstileSiteKey) return "";

  const turnstile = await loadTurnstile();
  if (!turnstile) return "";

  return new Promise<string>((resolve) => {
    const existingWidgetId = widgetIdByForm.get(form);
    if (existingWidgetId) {
      resolverByWidget.set(existingWidgetId, resolve);
      turnstile.reset(existingWidgetId);
      turnstile.execute(existingWidgetId);
      return;
    }

    const container = document.createElement("div");
    container.style.display = "none";
    form.appendChild(container);

    const widgetId = turnstile.render(container, {
      sitekey: config.turnstileSiteKey,
      size: "invisible",
      callback: (token: string) => settle(widgetId, token),
      "error-callback": () => settle(widgetId, ""),
      "expired-callback": () => settle(widgetId, "")
    });
    widgetIdByForm.set(form, widgetId);
    resolverByWidget.set(widgetId, resolve);
    // size:"invisible" auto-executes once on render — no manual `execute()` needed here.
  });
}
