import { CreditCard } from "lucide-react";

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
                 <CreditCard className="text-travel-orange w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground">20+</div>
                  <div className="text-sm text-muted-foreground">Cards Available</div>
                </div>
              </div>
            </div>
          </div>

          {/* Text & Stats */}
          <div>
            <p className="text-travel-orange font-semibold mb-1">Stories —</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
              We are here to help  <br /> you at the most
            </h2>
            <p className="text-muted-foreground text-base mb-10">
              Whether you're creating important documents or navigating
urgent needs, our tools and support are designed to deliver simplicity, speed,
and peace of mind — exactly when you need them the most.
            </p>

            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
