import { Card } from "@/components/ui/card";
import { Package, Clock, MapPin } from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Dynamic Packaging",
    description: "Create your perfect trip with our flexible packaging options. Mix and match flights, hotels, and activities to suit your travel style and budget perfectly."
  },
  {
    icon: Clock,
    title: "Instant Delivery",
    description: "Get your travel confirmations instantly. Our streamlined booking process ensures you receive all necessary documents and information without delay."
  },
  {
    icon: MapPin,
    title: "Multiple Verticals",
    description: "From adventure tours to luxury retreats, we cover every type of travel experience. Discover destinations across multiple categories and travel styles."
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-travel-orange-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Why travelers choose us?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover why thousands of travelers trust us with their dream vacations. 
            We're more than just a booking platform - we're your travel partner.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 text-center bg-white border border-travel-orange/20 hover:border-travel-orange/40 transition-all duration-300 hover:shadow-lg">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-travel-orange-light flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;