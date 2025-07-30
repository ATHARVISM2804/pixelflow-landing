import Header from "@/components/travel/Header";
import Hero from "@/components/travel/Hero";
import Destinations from "@/components/travel/Destinations";
import WhyChooseUs from "@/components/travel/WhyChooseUs";
import Services from "@/components/travel/Services";
import Stats from "@/components/travel/Stats";
import Testimonials from "@/components/travel/Testimonials";
import Footer from "@/components/travel/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Destinations />
      <WhyChooseUs />
      <Services />
      <Stats />
      {/* <Testimonials /> */}
      <Footer />
    </div>
  );
};

export default Index;