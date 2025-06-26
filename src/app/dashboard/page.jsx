import Dashboard from "../Components/Dashboard/Dashboard";

export const metadata = {
  title: "Dashboard | MyData",
  description:
    "Access your personalized dashboard with real-time insights, account activity, and settings in MyApp.",
  keywords: [
    "dashboard",
    "user panel",
    "account",
    "MyData",
    "settings",
    "activity",
  ],
  authors: [{ name: "Vinoth S", url: "https://github.com/Vinoth82003" }],
  openGraph: {
    title: "Your Dashboard | MyData",
    description:
      "Manage your account, see activity, and customize your settings on MyApp.",
    url: "https://mydata-xi.vercel.app//dashboard",
    siteName: "MyApp",
    type: "website",
  },
};

export default function DashboardPage() {
  return <Dashboard />;
}
