import Hero from "@/components/sections/Hero";
import WhyUs from "@/components/sections/WhyUs";
import About from "@/components/sections/About";
import Programs from "@/components/sections/Programs";
import Coaches from "@/components/sections/Coaches";
import Schedule from "@/components/sections/Schedule";
import Gallery from "@/components/sections/Gallery";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import Contacts from "@/components/sections/Contacts";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyUs />
      <About />
      <Programs />
      <Coaches />
      <Schedule />
      <Gallery />
      <Testimonials />
      <FAQ />
      <Contacts />
    </>
  );
}
