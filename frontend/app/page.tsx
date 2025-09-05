import Navbar from "@/components/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Metrics from "@/components/landing/Metrics";
import Pricing from "@/components/landing/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Metrics />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
