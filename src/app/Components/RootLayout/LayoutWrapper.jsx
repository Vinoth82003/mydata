"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import ThemeWrapper from "../ThemeToggle/ThemeWrapper";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import Frame from "../Frame/Frame";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.includes("/dashboard");

  return (
    <ThemeWrapper>
      <ThemeToggle />
      <Frame deg="to bottom" isPartical={!isDashboard} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            border: "1px solid var(--accent)",
          },
        }}
      />
      {!isDashboard && <Navbar />}
      {children}
      {!isDashboard && <Footer />}
    </ThemeWrapper>
  );
}
