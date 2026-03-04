import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { ToolsShowcase } from "../components/ToolsShowcase";
import { HowItWorks } from "../components/HowItWorks";
import { CodeExample } from "../components/CodeExample";
import { PricingSection } from "../components/PricingSection";
import { Footer } from "../components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-subtle/60 to-bg">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <HeroSection />
        <FeaturesSection />
        <ToolsShowcase />
        <HowItWorks />
        <CodeExample />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}


