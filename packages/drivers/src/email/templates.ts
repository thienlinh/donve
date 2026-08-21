import type {
  DataSubjectRequestSlaProps,
  InviteEmailProps,
  LeadDigestProps,
  OrderConfirmationProps,
  ResetPasswordProps,
  TrafficSpikeAlertProps,
  VerifyEmailProps
} from "./types.js";

/** FR-I-01 v1: plain HTML string per template, not React Email. */
function layout(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="vi">
  <body style="font-family:system-ui,sans-serif;background:#f4f4f5;padding:24px;">
    <table style="max-width:480px;margin:0 auto;background:#fff;border-radius:8px;padding:32px;">
      <tr><td>
        <h1 style="font-size:18px;margin:0 0 16px;">${title}</h1>
        ${bodyHtml}
        <p style="color:#71717a;font-size:12px;margin-top:32px;">Donve — gửi từ mail.donve.vn</p>
      </td></tr>
    </table>
  </body>
</html>`;
}

function button(url: string, label: string): string {
  return `<p><a href="${url}" style="display:inline-block;background:#18181b;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">${label}</a></p>`;
}

export function renderVerifyEmail(props: VerifyEmailProps): {
  subject: string;
  html: string;
} {
  return {
    subject: "Xác thực email của bạn",
    html: layout(
      "Xác thực email",
      `<p>Chào ${props.name},</p>
       <p>Nhấn nút bên dưới để xác thực email và hoàn tất đăng ký tài khoản Donve.</p>
       ${button(props.url, "Xác thực email")}`
    )
  };
}

export function renderResetPassword(props: ResetPasswordProps): {
  subject: string;
  html: string;
} {
  return {
    subject: "Đặt lại mật khẩu",
    html: layout(
      "Đặt lại mật khẩu",
      `<p>Chào ${props.name},</p>
       <p>Nhấn nút bên dưới để đặt lại mật khẩu. Nếu bạn không yêu cầu việc này, hãy bỏ qua email này.</p>
       ${button(props.url, "Đặt lại mật khẩu")}`
    )
  };
}

export function renderInviteEmail(props: InviteEmailProps): {
  subject: string;
  html: string;
} {
  return {
    subject: `Bạn được mời tham gia ${props.orgName} trên Donve`,
    html: layout(
      "Lời mời tham gia tổ chức",
      `<p>Bạn được mời tham gia <strong>${props.orgName}</strong> với vai trò <strong>${props.role}</strong>.</p>
       ${button(props.inviteUrl, "Chấp nhận lời mời")}
       <p style="color:#71717a;font-size:12px;">Lời mời hết hạn sau 7 ngày.</p>`
    )
  };
}

export function renderLeadDigest(props: LeadDigestProps): {
  subject: string;
  html: string;
} {
  const rows = props.leads
    .map(
      (lead) =>
        `<tr><td style="padding:4px 8px;border-top:1px solid #e4e4e7;">${lead.fullName}</td><td style="padding:4px 8px;border-top:1px solid #e4e4e7;">${lead.phone}</td></tr>`
    )
    .join("");
  return {
    subject: `${props.leads.length} lead mới trên ${props.orgName}`,
    html: layout(
      "Lead mới",
      `<p>Có <strong>${props.leads.length}</strong> lead mới được gộp lại từ khoảng thời gian gần nhất:</p>
       <table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>
       ${button(props.dashboardUrl, "Xem trong Donve")}`
    )
  };
}

export function renderTrafficSpikeAlert(props: TrafficSpikeAlertProps): {
  subject: string;
  html: string;
} {
  return {
    subject: `⚠️ ${props.hostname} tăng đột biến traffic (x${props.multiplier.toFixed(1)})`,
    html: layout(
      "Cảnh báo traffic bất thường",
      `<p>Hostname <strong>${props.hostname}</strong> đang nhận <strong>${props.todayCount.toLocaleString("vi-VN")}</strong> request hôm nay, gấp <strong>${props.multiplier.toFixed(1)}x</strong> trung bình 7 ngày trước (${props.trailingAverage.toLocaleString("vi-VN")}).</p>
       <p style="color:#71717a;font-size:12px;">Chỉ cảnh báo — traffic của tenant không bị tự động chặn (NFR-14).</p>`
    )
  };
}

export function renderDataSubjectRequestSla(
  props: DataSubjectRequestSlaProps
): {
  subject: string;
  html: string;
} {
  const overdueCount = props.requests.filter((r) => r.overdue).length;
  const rows = props.requests
    .map(
      (r) =>
        `<tr><td style="padding:4px 8px;border-top:1px solid #e4e4e7;">${r.leadFullName}</td><td style="padding:4px 8px;border-top:1px solid #e4e4e7;">${r.requestType === "delete" ? "Xoá dữ liệu" : "Xuất dữ liệu"}</td><td style="padding:4px 8px;border-top:1px solid #e4e4e7;color:${r.overdue ? "#dc2626" : "#18181b"};">${r.overdue ? "Quá hạn" : "Sắp đến hạn"}</td></tr>`
    )
    .join("");
  return {
    subject: `${overdueCount > 0 ? "⚠️ " : ""}${props.requests.length} yêu cầu dữ liệu cá nhân cần xử lý trên ${props.orgName}`,
    html: layout(
      "Yêu cầu xoá/xuất dữ liệu cá nhân (Nghị định 13/2023/NĐ-CP)",
      `<p>Có <strong>${props.requests.length}</strong> yêu cầu xoá/xuất dữ liệu cá nhân của lead đang quá hạn hoặc sắp đến hạn phản hồi (72 giờ):</p>
       <table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>
       ${button(props.dashboardUrl, "Xem trong Donve")}`
    )
  };
}

export function renderOrderConfirmation(props: OrderConfirmationProps): {
  subject: string;
  html: string;
} {
  const statusLabel =
    props.status === "paid" ? "đã xác nhận thanh toán" : "đã kích hoạt";
  return {
    subject: `Đơn hàng ${props.orderCode} ${statusLabel}`,
    html: layout(
      "Xác nhận đơn hàng",
      `<p>Đơn hàng <strong>${props.orderCode}</strong> (${props.amount.toLocaleString("vi-VN")}đ) của bạn ${statusLabel}.</p>
       <p>Cảm ơn bạn đã tin tưởng Donve!</p>`
    )
  };
}
