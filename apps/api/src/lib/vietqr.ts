/**
 * FR-D-04 v1: direct VietQR quick-link image URL, no EMVCo rendering/library
 * (tech-stack.md — `qrcode` is only a future fallback if third-party uptime becomes an issue).
 */
export function buildVietQrUrl(input: {
  bankBin: string;
  accountNumber: string;
  amount: number;
  addInfo: string;
  accountName?: string;
}): string {
  const params = new URLSearchParams({
    amount: String(input.amount),
    addInfo: input.addInfo
  });
  if (input.accountName) params.set("accountName", input.accountName);
  const bankBin = encodeURIComponent(input.bankBin);
  const accountNumber = encodeURIComponent(input.accountNumber);
  return `https://img.vietqr.io/image/${bankBin}-${accountNumber}-compact2.png?${params.toString()}`;
}
