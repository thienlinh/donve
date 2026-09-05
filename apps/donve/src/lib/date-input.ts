/** Bridges a `Date | null` RHF field value to/from a native `<input type="date">`'s string value. */
export function toDateInputValue(date?: Date | null): string {
  return date ? date.toISOString().slice(0, 10) : "";
}

export function fromDateInputValue(value: string): Date | null {
  return value ? new Date(value) : null;
}
