import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProcessStrip from "@/components/ProcessStrip";
import HowItWorks from "@/components/HowItWorks";
import IndustryCards from "@/components/IndustryCards";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <ProcessStrip />
      <HowItWorks />
      <IndustryCards />
      <Footer />
    </>
  );
}
