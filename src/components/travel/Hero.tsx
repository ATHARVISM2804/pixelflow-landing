import { Button } from "@/components/ui/button";
import heroTraveler from "@/assets/hero-traveler.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-gray-950 to-black overflow-hidden">
      {/* Darker accent blobs */}
      <div className="absolute top-10 sm:top-20 right-5 sm:right-10 w-12 sm:w-20 h-12 sm:h-20 rounded-full bg-indigo-900 opacity-40"></div>
      <div className="absolute bottom-20 sm:bottom-40 right-10 sm:right-20 w-8 sm:w-12 h-8 sm:h-12 rounded-full bg-indigo-800 opacity-30"></div>
      <div className="absolute top-20 sm:top-40 right-16 sm:right-32 w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-indigo-700 opacity-30"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Image Section - Appears first on mobile */}
        <div className="relative order-1 lg:order-2">
          <div className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 w-full h-full rounded-full bg-gradient-to-br from-indigo-900 to-indigo-700 opacity-20"></div>
          <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
            <img 
              src={heroTraveler} 
              alt="Happy traveler with backpack" 
              className="w-full h-auto rounded-full object-cover border-4 border-gray-800"
            />
          </div>
          <div className="absolute top-5 sm:top-10 -right-2 sm:-right-4 w-10 sm:w-16 h-10 sm:h-16 rounded-full bg-indigo-800 opacity-60"></div>
          <div className="absolute bottom-10 sm:bottom-20 -left-4 sm:-left-8 w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-indigo-900 opacity-40"></div>
        </div>

        {/* Text Section - Appears second on mobile */}
        <div className="space-y-6 lg:space-y-8 text-center lg:text-left order-2 lg:order-1">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
              Instant ID Cards{" "}
              <span className="block sm:inline text-indigo-300">Aadhaar, PAN, Voter, Vaccine & More</span>
            </h1>
            <ul className="text-base sm:text-lg text-gray-300 max-w-lg mx-auto lg:mx-0 list-disc pl-5 space-y-2 text-left">
              <li>
                <strong className="text-indigo-200">Fast & user-friendly:</strong> Generate multiple ID types in one place.
              </li>
              <li>
                <strong className="text-indigo-200">Designed for everyone:</strong> No prior design skills needed.
              </li>
              <li>
                <strong className="text-indigo-200">Reliable & secure:</strong> Supports Aadhaar, PAN, Voter, Ayushman, Sambal 2.0 & more.
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" onClick={() => window.location.href = "/dashboard"} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto shadow-lg shadow-indigo-900/30">
             Get Started
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;