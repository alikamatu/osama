import "server-only";

export function magicLinkEmail({
  url,
  email,
  expiresInMinutes,
}: {
  url: string;
  email: string;
  expiresInMinutes: number;
}) {
  const subject = "Your Cairn sign-in link";

  const text = [
    `Hi,`,
    ``,
    `Click the link below to sign in to Cairn as ${email}.`,
    `This link expires in ${expiresInMinutes} minutes and can only be used once.`,
    ``,
    url,
    ``,
    `If you didn't request this email, you can safely ignore it.`,
    ``,
    `— Cairn`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#16181f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#e7e8ec;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#16181f;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#1e2029;border-radius:16px;padding:32px;">
            <tr>
              <td style="padding-bottom:24px;">
                <div style="display:inline-flex;align-items:center;gap:10px;">
                  <span style="display:inline-block;width:28px;height:28px;border-radius:50%;background:#a78bfa;"></span>
                  <span style="font-size:15px;font-weight:600;letter-spacing:-0.01em;color:#fff;">Cairn</span>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;font-weight:600;color:#fff;letter-spacing:-0.01em;">
                  Sign in to your account
                </h1>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.55;color:#b6b9c2;">
                  Click the button below to sign in as <strong style="color:#fff;">${email}</strong>.
                  This link expires in ${expiresInMinutes} minutes and can only be used once.
                </p>
                <a href="${url}"
                   style="display:inline-block;background:#a78bfa;color:#15121f;text-decoration:none;padding:14px 22px;border-radius:12px;font-weight:600;font-size:14px;">
                  Sign in to Cairn
                </a>
                <p style="margin:28px 0 0;font-size:13px;line-height:1.55;color:#7d808a;">
                  Or paste this link into your browser:
                </p>
                <p style="margin:6px 0 0;font-size:12px;line-height:1.5;color:#a0a3ad;word-break:break-all;">
                  ${url}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding-top:32px;">
                <p style="margin:0;font-size:12px;line-height:1.5;color:#6c6f78;">
                  If you didn't request this email, you can safely ignore it.
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0;font-size:11px;color:#6c6f78;">© ${new Date().getFullYear()} Cairn</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}
