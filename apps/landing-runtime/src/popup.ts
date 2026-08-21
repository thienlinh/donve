import type { RuntimeConfig } from "./config.js";

export interface PopupOrder {
  orderCode: string;
  qrUrl: string;
  amount: number;
  zaloLink: string | null;
}

// FR-D-07: poll for up to 10 minutes, then stop silently — the QR/manual-transfer UI already
// shown stays usable as the manual fallback, no separate "expired" screen needed.
const POLL_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 10 * 60_000;
const PAID_STATUSES = new Set(["paid", "fulfilled"]);

function ensureDialog(): HTMLDialogElement {
  const existing = document.querySelector<HTMLDialogElement>(
    'dialog[data-dv-popup="registered"]'
  );
  if (existing) return existing;
  const dialog = document.createElement("dialog");
  dialog.setAttribute("data-dv-popup", "registered");
  document.body.appendChild(dialog);
  return dialog;
}

function closeButton(): string {
  return '<button type="button" data-dv-popup-close autofocus>Đóng</button>';
}

function zaloLinkHtml(zaloLink: string | null): string {
  return zaloLink
    ? `<p><a href="${zaloLink}" target="_blank" rel="noopener">Tham gia nhóm Zalo</a></p>`
    : "";
}

/** FR-D-06: after the button click, order is `awaiting_confirmation` — no more auto-payment
 * to poll for, just point the customer at Zalo so sales can confirm from the bill. */
function renderAwaitingConfirmation(
  dialog: HTMLDialogElement,
  zaloLink: string | null
): void {
  dialog.innerHTML =
    "<p>Vui lòng tham gia nhóm Zalo và gửi bill để được kích hoạt.</p>" +
    zaloLinkHtml(zaloLink) +
    closeButton();
  dialog
    .querySelector("[data-dv-popup-close]")
    ?.addEventListener("click", () => dialog.close());
}

/** Nhánh A (auto): webhook match trong khi popup còn mở → poll thấy `paid`/`fulfilled`. */
function renderPaid(dialog: HTMLDialogElement, zaloLink: string | null): void {
  dialog.innerHTML =
    "<p>Thanh toán thành công! Cảm ơn bạn đã đăng ký.</p>" +
    zaloLinkHtml(zaloLink) +
    closeButton();
  dialog
    .querySelector("[data-dv-popup-close]")
    ?.addEventListener("click", () => dialog.close());
}

function pollOrderStatus(
  config: RuntimeConfig,
  order: PopupOrder,
  dialog: HTMLDialogElement
): void {
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  let stopped = false;
  dialog.addEventListener("close", () => (stopped = true), { once: true });

  const tick = async (): Promise<void> => {
    if (stopped || Date.now() >= deadline) return;
    try {
      const res = await fetch(
        `${config.apiUrl ?? ""}/public/orders/${order.orderCode}/status?orgId=${config.orgId}`
      );
      if (res.ok) {
        const data: { status: string } = await res.json();
        if (PAID_STATUSES.has(data.status)) {
          stopped = true;
          renderPaid(dialog, order.zaloLink);
          return;
        }
      }
    } catch {
      // best-effort poll — a dropped/failed check just retries next tick.
    }
    if (!stopped) setTimeout(() => void tick(), POLL_INTERVAL_MS);
  };
  setTimeout(() => void tick(), POLL_INTERVAL_MS);
}

async function confirmTransfer(
  config: RuntimeConfig,
  order: PopupOrder,
  dialog: HTMLDialogElement,
  button: HTMLButtonElement
): Promise<void> {
  button.disabled = true;
  try {
    const res = await fetch(
      `${config.apiUrl ?? ""}/public/orders/${order.orderCode}/confirm-transfer?orgId=${config.orgId}`,
      { method: "POST" }
    );
    if (!res.ok) throw new Error(`http_${res.status}`);
    const data: { zaloLink: string | null } = await res.json();
    renderAwaitingConfirmation(dialog, data.zaloLink);
  } catch {
    button.disabled = false;
  }
}

/** FR-D-04/06: renders the VietQR + order code popup, with the "Tôi đã chuyển khoản" button
 * that moves the order to `awaiting_confirmation`. Falls back to a plain thank-you dialog when
 * there's no order (campaign has no paid product) or the published HTML defines its own popup. */
export function showRegisteredPopup(
  config: RuntimeConfig,
  order: PopupOrder | null
): void {
  const existing = document.querySelector<HTMLDialogElement>(
    'dialog[data-dv-popup="registered"]'
  );
  if (existing && !order) {
    existing.showModal();
    return;
  }

  const dialog = ensureDialog();
  if (!order) {
    dialog.innerHTML =
      "<p>Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm.</p>" +
      closeButton();
  } else {
    dialog.innerHTML =
      "<p>Chúc mừng đăng ký thành công!</p>" +
      `<img src="${order.qrUrl}" alt="Mã QR chuyển khoản" />` +
      `<p>Số tiền: ${order.amount.toLocaleString("vi-VN")}đ — Nội dung CK: <strong>${order.orderCode}</strong></p>` +
      '<button type="button" data-dv-confirm-transfer>Tôi đã chuyển khoản</button>' +
      closeButton();
    dialog
      .querySelector<HTMLButtonElement>("[data-dv-confirm-transfer]")
      ?.addEventListener("click", (event) => {
        void confirmTransfer(
          config,
          order,
          dialog,
          event.currentTarget as HTMLButtonElement
        );
      });
    pollOrderStatus(config, order, dialog);
  }
  dialog
    .querySelector("[data-dv-popup-close]")
    ?.addEventListener("click", () => dialog.close());
  dialog.showModal();
}
