import { getLocale } from "@/paraglide/runtime.js";

const relativeTimeFormatter = new Intl.RelativeTimeFormat(getLocale(), {
  numeric: "auto"
});

export function formatRelativeTime(date: Date): string {
  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const thresholds: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60]
  ];
  for (const [unit, secondsInUnit] of thresholds) {
    if (Math.abs(diffSeconds) >= secondsInUnit) {
      return relativeTimeFormatter.format(
        Math.round(diffSeconds / secondsInUnit),
        unit
      );
    }
  }
  return relativeTimeFormatter.format(diffSeconds, "second");
}
