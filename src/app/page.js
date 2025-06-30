"use client";

import { useEffect, useState } from "react";
import Contact from "./Components/Contact/Contact";
import CTA from "./Components/CTA/CTA";
import HeroSection from "./Components/HeroSection/HeroSection";
import HowItWorks from "./Components/HowItWorks/HowItWorks";
import PageLoader from "./Components/PageLoader/PageLoader";
import TechStack from "./Components/TechStack/TechStack";
import styles from "./page.module.css";
import Features from "./Components/Features/Features";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  });

  return (
    <div className={styles.page}>
      {/* Page loader */}
      {isLoading && <PageLoader />}

      {/* Hero section */}
      <HeroSection />

      {/* Features */}
      <Features/>

      {/* How it works section */}
      <HowItWorks />

      {/* Tech stack section */}
      <TechStack />

      {/* CTA sectio */}
      <CTA />

      {/* Contact form */}
      <Contact />
    </div>
  );
}
