import { MapPin } from "lucide-react";

const Stats = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Circle BG with Overflowing Image */}
          <div className="relative flex justify-center">
            <div className="relative w-[350px] h-[350px] rounded-full bg-travel-orange-light flex items-center justify-center">
              {/* Overflowing Image */}
              <img
                src="https://res.cloudinary.com/dmhabztbf/image/upload/v1753871472/ladki-removebg-preview_gb5bqp.png"
                alt="Traveler"
                className="absolute w-[600px] h-[400px] object-cover  z-10"
                style={{ bottom: '40px', left: '20px' }}
              />

              {/* Floating Stat Card */}
              <div className="absolute -bottom-4 -left-8 z-20 shadow-lg rounded-xl bg-white px-6 py-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-travel-orange-light rounded-full flex items-center justify-center">
                  <MapPin className="text-travel-orange w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground">500+</div>
                  <div className="text-sm text-muted-foreground">Destinations</div>
                </div>
              </div>
            </div>
          </div>

          {/* Text & Stats */}
          <div>
            <p className="text-travel-orange font-semibold mb-1">Stories —</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
              Our stories have <br /> adventures
            </h2>
            <p className="text-muted-foreground text-base mb-10">
              In the journeys we take and the memories we create, every adventure adds a new chapter to our travelers’ lives.
            </p>

            {/* Horizontal Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">12k+</div>
                <div className="text-sm text-muted-foreground">Happy Travelers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">16+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">20+</div>
                <div className="text-sm text-muted-foreground">Expert Guides</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
