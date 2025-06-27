// lib/emailTemplates.js

const generateOTPTemplate = (title, message, color, code) => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f9f9f9" style="font-family: Arial, sans-serif; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); padding: 30px;">
          <tr>
            <td align="left" style="color: #333;">
              <h2 style="color: ${color};">${title}</h2>
              <p style="margin: 0 0 15px;">${message}</p>
              <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 20px auto;">
                <tr>
                  <td align="center" bgcolor="${color}" style="padding: 12px 24px; border-radius: 6px;">
                    <span style="font-size: 24px; color: #ffffff; letter-spacing: 4px; font-weight: bold;">${code}</span>
                  </td>
                </tr>
              </table>
              <p>This code expires in <strong>5 minutes</strong>.</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
              <p style="font-size: 0.9rem; text-align: center; color: #777;">MyData Security • Chennai</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

const getMailTemplate = (type, code, name = "") => {
  switch (type) {
    case "verification":
      return {
        subject: "🔐 Your OTP for MyData Verification",
        html: generateOTPTemplate(
          "Verify Your Email",
          `Here is your One-Time Password (OTP) to verify your email for <strong>MyData</strong>:`,
          "#2e89ff",
          code
        ),
      };
    case "passwordReset":
      return {
        subject: "🔁 Reset Your MyData Password",
        html: generateOTPTemplate(
          "Password Reset Request",
          `We received a request to reset your password for <strong>MyData</strong>. Use the code below to continue:`,
          "#e63946",
          code
        ),
      };
    case "changeEmail":
      return {
        subject: "✉️ OTP to Change Your Email",
        html: generateOTPTemplate(
          "Change Email Verification",
          `You're trying to update your email address on <strong>MyData</strong>. Please confirm with the OTP below:`,
          "#f59e0b",
          code
        ),
      };
    case "changePassword":
      return {
        subject: "🔐 OTP to Change Your Password",
        html: generateOTPTemplate(
          "Change Password Request",
          `You're trying to change your password on <strong>MyData</strong>. Use the OTP below to continue:`,
          "#6366f1",
          code
        ),
      };
    case "mfa":
      return {
        subject: "🔒 Your 2FA Login OTP",
        html: generateOTPTemplate(
          "2FA Login Code",
          `Hi ${name}, here’s your one-time code to complete login:`,
          "#10b981",
          code
        ),
      };
    default:
      return null;
  }
};

export { getMailTemplate };
