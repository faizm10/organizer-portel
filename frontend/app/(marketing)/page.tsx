import type { Metadata } from "next";
import { GradientBackground } from "@/components/marketing/background";
import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import {
  FAQSection,
  FeaturesGridSection,
  FinalCTASection,
  PricingSection,
  ProblemSolutionSection,
  ProductMockSection,
  SecuritySection,
  SocialProofSection,
  TestimonialsSection,
  Footer,
} from "@/components/marketing/sections";
import { MotionProvider } from "@/components/marketing/motion";

export const metadata: Metadata = {
  title: "HackPortal – The control room for serious hackathons",
  description:
    "HackPortal is the operations workspace for hackathon organizer teams: tasks, announcements, volunteers, incidents, and people all in one calm dashboard.",
};

export default function MarketingPage() {
  return (
    <MotionProvider>
      <div className="relative min-h-screen bg-background text-foreground">
        <GradientBackground />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Hero />
            <SocialProofSection />
            <ProblemSolutionSection />
            <FeaturesGridSection />
            <ProductMockSection />
            <SecuritySection />
            <PricingSection />
            <TestimonialsSection />
            <FAQSection />
            <FinalCTASection />
          </main>
          <Footer />
        </div>
      </div>
    </MotionProvider>
  );
}


