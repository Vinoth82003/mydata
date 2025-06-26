
import SignupFlow from "./components/SignupFlow";

export const metadata = {
  title: "Sign Up - MyData ",
  description:
    "Create your account on MyData Platform to securely manage, share, and personalize your data experience. Fast. Secure. Simple.",
  keywords: [
    "signup",
    "register",
    "user registration",
    "MyData app",
    "secure signup",
    "data platform",
    "nextjs auth",
    "google signup",
    "otp verification",
    "multi-step signup",
  ],
  openGraph: {
    title: "Sign Up - MyData ",
    description:
      "Join MyData Platform to access powerful data tools and secure sharing. Sign up today with email or Google.",
    url: "https://mydata-xi.vercel.app/signup",
    type: "website",
  },
};

export default function SignupPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <SignupFlow />
    </main>
  );
}
