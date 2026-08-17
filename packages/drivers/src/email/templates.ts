import type {
  InviteEmailProps,
  ResetPasswordProps,
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
