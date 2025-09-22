import Navbar from "@/components/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Modules from "@/components/landing/Modules";
import Demo from "@/components/landing/Demo";
import Pricing from "@/components/landing/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Modules />
        <Demo />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
