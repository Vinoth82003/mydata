import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./Components/RootLayout/LayoutWrapper";

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
    "My Data is a personal project where I can manage my personal details, and also project details.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LayoutWrapper>{children}</LayoutWrapper>
        
      </body>
    </html>
  );
}
