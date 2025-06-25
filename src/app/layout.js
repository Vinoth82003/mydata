import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Frame from "./Components/Frame/Frame";
import Navbar from "./Components/Navbar/Navbar";
import ThemeWrapper from "./Components/ThemeToggle/ThemeWrapper";
import ThemeToggle from "./Components/ThemeToggle/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "My Data",
  description:
    "My Data is a personal project where i can manage my personal details, and also project details.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeWrapper>
          <ThemeToggle />
          <Frame deg={"to bottom"} />
          <Navbar />
          {children}
        </ThemeWrapper>
      </body>
    </html>
  );
}
