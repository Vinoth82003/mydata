import HeroSection from "./Components/HeroSection/HeroSection";
import HowItWorks from "./Components/HowItWorks/HowItWorks";
import TechStack from "./Components/TechStack/TechStack";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero section */}
      <HeroSection />

      {/* How it works section */}
      <HowItWorks />

      {/* Tech stack section */}
      <TechStack />
    </div>
  );
}
