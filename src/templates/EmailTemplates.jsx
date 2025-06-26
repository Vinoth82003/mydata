const MFA = (name, otp) => ({
  subject: "Your 2FA Login OTP",
  html: `
      <h2>Hello ${name},</h2>
      <p>Your one-time login code is:</p>
      <h1>${otp}</h1>
      <p>This code expires in <strong>5 minutes</strong>.</p>
    `,
});

const VerifyEmail = () => ({
  subject: "Your 2FA Login OTP",
  html: `
        <h2>Hello ${name},</h2>
        <p>Your one-time login code is:</p>
        <h1>${otp}</h1>
        <p>This code expires in <strong>5 minutes</strong>.</p>
      `,
});

export { MFA, VerifyEmail };