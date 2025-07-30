import { Button } from "@/components/ui/button";
import heroTraveler from "@/assets/hero-traveler.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-travel-orange-light to-background overflow-hidden">
      <div className="absolute top-20 right-10 w-20 h-20 rounded-full bg-travel-coral opacity-60"></div>
      <div className="absolute bottom-40 right-20 w-12 h-12 rounded-full bg-travel-orange opacity-40"></div>
      <div className="absolute top-40 right-32 w-8 h-8 rounded-full bg-travel-warm opacity-50"></div>
      
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Explore the best{" "}
              <span className="text-primary">destinations</span> in the world
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Discover amazing places and create unforgettable memories with our curated travel experiences. 
              Your next adventure awaits with expert guides and seamless planning.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Start Trip
            </Button>
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-travel-coral border-2 border-background"></div>
                <div className="w-10 h-10 rounded-full bg-travel-warm border-2 border-background"></div>
                <div className="w-10 h-10 rounded-full bg-travel-orange border-2 border-background"></div>
              </div>
              <span className="text-sm text-muted-foreground">More than 20k</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-full h-full rounded-full bg-gradient-to-br from-travel-orange to-travel-coral opacity-20"></div>
          <div className="relative w-full max-w-lg mx-auto">
            <img 
              src={heroTraveler} 
              alt="Happy traveler with backpack" 
              className="w-full h-auto rounded-full object-cover"
            />
          </div>
          <div className="absolute top-10 -right-4 w-16 h-16 rounded-full bg-travel-orange opacity-80"></div>
          <div className="absolute bottom-20 -left-8 w-24 h-24 rounded-full bg-travel-coral opacity-60"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;