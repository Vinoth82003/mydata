import dynamic from "next/dynamic";

export const metadata = {
  title: "Sign In - MyData",
  description:
    "Securely sign in to MyData with email/password and optional 2FA OTP verification. Keep your data safe with modern authentication.",
  keywords: [
    "Sign In",
    "Login",
    "2FA Login",
    "OTP Verification",
    "MyData Platform",
    "Secure Access",
    "Email Login",
    "NextAuth",
  ],
  authors: [{ name: "Vinoth S", url: "https://github.com/Vinoth82003" }],
  creator: "Vinoth S",
  robots: "index, follow",
  openGraph: {
    title: "Sign In - MyData",
    description:
      "Access your MyData account securely with modern authentication, OTP verification, and stay signed in with JWT.",
    url: "https://mydata-xi.vercel.app/signin",
    siteName: "MyData",
    type: "website",
  },
};

export default function SignInPage() {
  const SigninForm = dynamic(() => import("./components/SigninForm"));
  return (
    <main style={{ padding: "2rem" }}>
      <SigninForm />
    </main>
  );
}
