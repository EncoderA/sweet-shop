import Header from "../components/landingPage/Header";
import HeroSection from "../components/landingPage/HeroSection";
import PopularSweets from "../components/landingPage/PopularSweets";
import WhyChooseUs from "../components/landingPage/WhyChooseUs";
import ContactSection from "../components/landingPage/ContactSection";
import CTASection from "../components/landingPage/CTASection";
import Footer from "../components/landingPage/Footer";

export default function Home() {
  return (
    <div className=" bg-background ">
      {/* <div className="flex h-auto min-h-screen w-full flex-col overflow-x-hidden"> */}
          <Header />
        
        <main className="flex-1">
          <HeroSection />
          <PopularSweets />
          <WhyChooseUs />
          <ContactSection />
          <CTASection />
        </main>
        
        <Footer />
      </div>
    // </div>
  );
}