const UNIT_SECONDS = {
  days: 86_400,
  hours: 3_600,
  minutes: 60,
  seconds: 1
} as const;

type Unit = keyof typeof UNIT_SECONDS;

/**
 * Ticks the `countdown_timer` catalog component (`@dv/studio-catalog`). Published HTML is
 * static, so the digits ship as `--` placeholders and the deadline travels in
 * `data-dv-countdown` — the remaining time depends on when the visitor loads the page, which
 * build-time SSR can't know. Same static-hook contract as `data-dv-form`/`data-dv-popup`.
 */
export function bindCountdowns(): void {
  for (const root of document.querySelectorAll<HTMLElement>(
    "[data-dv-countdown]"
  )) {
    bindOne(root);
  }
}

function bindOne(root: HTMLElement): void {
  const endsAt = Date.parse(root.dataset.dvCountdown ?? "");
  if (Number.isNaN(endsAt)) return;

  const digits = root.querySelector<HTMLElement>("[data-dv-countdown-digits]");
  const expired = root.querySelector<HTMLElement>(
    "[data-dv-countdown-expired]"
  );
  const cells = new Map(
    (Object.keys(UNIT_SECONDS) as Unit[]).map((unit) => [
      unit,
      root.querySelector<HTMLElement>(`[data-dv-countdown-unit="${unit}"]`)
    ])
  );

  function render(totalSeconds: number): void {
    let left = totalSeconds;
    for (const [unit, seconds] of Object.entries(UNIT_SECONDS) as [
      Unit,
      number
    ][]) {
      const value = Math.floor(left / seconds);
      left -= value * seconds;
      const cell = cells.get(unit);
      if (cell) cell.textContent = String(value).padStart(2, "0");
    }
  }

  const timer = setInterval(tick, 1000);
  function tick(): void {
    const remaining = endsAt - Date.now();
    if (remaining > 0) {
      render(Math.floor(remaining / 1000));
      return;
    }
    clearInterval(timer);
    render(0);
    // Falls back to a frozen 00:00:00:00 when the block has no "expired" copy to swap in.
    if (!expired) return;
    expired.hidden = false;
    if (digits) digits.hidden = true;
  }
  tick();
}
