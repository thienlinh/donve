import { sendEvent } from "./beacon.js";
import type { RuntimeConfig } from "./config.js";
import { normalizeVnPhone } from "./phone.js";
import { showRegisteredPopup, type PopupOrder } from "./popup.js";
import { getTurnstileToken } from "./turnstile.js";

const KNOWN_FIELDS = new Set([
  "fullName",
  "phone",
  "email",
  "persona",
  "consent",
  "_hp"
]);

function str(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

function utmFromLocation(): Record<string, string> {
  const utm: Record<string, string> = {};
  for (const [key, value] of new URL(location.href).searchParams) {
    if (key.startsWith("utm_")) utm[key] = value;
  }
  return utm;
}

function errorSlot(form: HTMLFormElement): HTMLElement {
  const existing = form.querySelector<HTMLElement>("[data-dv-form-error]");
  if (existing) return existing;
  const el = document.createElement("p");
  el.setAttribute("data-dv-form-error", "");
  el.setAttribute("role", "alert");
  form.appendChild(el);
  return el;
}

async function submitLead(
  config: RuntimeConfig,
  form: HTMLFormElement
): Promise<void> {
  const error = errorSlot(form);
  error.textContent = "";

  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const honeypot = str(data.get("_hp"));
  // ponytail: silently pretend success on a filled honeypot — no need to tell the bot why. The
  // server re-checks `honeypot` itself (FR-D-03) for submits that skip this JS entirely.
  if (honeypot.length > 0) {
    form.reset();
    showRegisteredPopup(config, null);
    return;
  }

  const consentInput = form.elements.namedItem("consent");
  if (!(consentInput instanceof HTMLInputElement) || !consentInput.checked) {
    if (consentInput instanceof HTMLInputElement) {
      consentInput.setCustomValidity(
        "Vui lòng đồng ý để chúng tôi thu thập dữ liệu cá nhân"
      );
      consentInput.reportValidity();
      consentInput.addEventListener(
        "input",
        () => consentInput.setCustomValidity(""),
        { once: true }
      );
    }
    return;
  }

  const phone = normalizeVnPhone(str(data.get("phone")));
  const phoneInput = form.elements.namedItem("phone");
  if (!phone) {
    if (phoneInput instanceof HTMLInputElement) {
      phoneInput.setCustomValidity("Số điện thoại không hợp lệ");
      phoneInput.reportValidity();
      phoneInput.addEventListener(
        "input",
        () => phoneInput.setCustomValidity(""),
        {
          once: true
        }
      );
    }
    return;
  }

  const customFields: Record<string, string> = {};
  for (const [key, value] of data) {
    if (!KNOWN_FIELDS.has(key)) customFields[key] = str(value);
  }

  const submitter = form.querySelector<HTMLButtonElement>('[type="submit"]');
  if (submitter) submitter.disabled = true;

  try {
    const turnstileToken = await getTurnstileToken(config, form);
    const res = await fetch(`${config.apiUrl ?? ""}/public/leads`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        orgId: config.orgId,
        campaignId: config.campaignId,
        fullName: str(data.get("fullName")),
        phone,
        email: str(data.get("email")) || null,
        persona: str(data.get("persona")) || null,
        customFields,
        utm: utmFromLocation(),
        consent: true,
        honeypot,
        turnstileToken
      })
    });
    if (!res.ok) throw new Error(`http_${res.status}`);
    const result: { order: PopupOrder | null } = await res.json();

    form.reset();
    showRegisteredPopup(config, result.order);
    sendEvent(config, "submit", { campaignId: config.campaignId });
  } catch {
    error.textContent = "Không gửi được, vui lòng thử lại.";
  } finally {
    if (submitter) submitter.disabled = false;
  }
}

export function bindLeadForms(config: RuntimeConfig): void {
  for (const form of document.querySelectorAll<HTMLFormElement>(
    'form[data-dv-form="lead"]'
  )) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      void submitLead(config, form);
    });
  }
}
