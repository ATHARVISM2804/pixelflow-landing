import { MapPin } from "lucide-react";

const Stats = () => {
  return (
    <section className="py-20 bg-travel-orange-light">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="w-full max-w-md mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-travel-orange to-travel-coral rounded-full opacity-20"></div>
              <div className="relative w-80 h-80 rounded-full bg-gradient-to-br from-travel-orange to-travel-coral p-8 flex items-center justify-center mx-auto">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <div className="text-lg">Destinations</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Our stories have adventures
              </h2>
              <p className="text-muted-foreground">
                Every journey tells a story, and we've been privileged to be part of thousands 
                of incredible adventures. From romantic getaways to family expeditions, 
                our travelers create memories that last a lifetime.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">12k+</div>
                <div className="text-muted-foreground">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">16+</div>
                <div className="text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">20+</div>
                <div className="text-muted-foreground">Expert Guides</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;