import { MapPin, Plane, Building, Utensils } from "lucide-react";

const services = [
  {
    icon: MapPin,
    title: "01 Travel plan",
    description: "Our travel experts craft personalized itineraries that match your interests, budget, and timeline for the perfect getaway experience."
  },
  {
    icon: Plane,
    title: "02 Flights booking", 
    description: "Find and book the best flights with our smart search technology. Compare prices across airlines and get exclusive deals."
  },
  {
    icon: Building,
    title: "03 Accommodation",
    description: "From luxury resorts to cozy boutique hotels, we'll find the perfect place to stay that matches your style and preferences."
  },
  {
    icon: Utensils,
    title: "04 Local dining",
    description: "Discover authentic local cuisine and hidden culinary gems with our restaurant recommendations and food tour arrangements."
  }
];

const Services = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <p className="text-primary font-medium mb-2">Our Services</p>
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Discover what we provide exclusively
              </h2>
              <p className="text-muted-foreground">
                We offer comprehensive travel services designed to make your journey seamless 
                and unforgettable. From planning to execution, we handle every detail.
              </p>
            </div>
            
            <div className="space-y-6">
              {services.map((service, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-travel-orange-light flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600"></div>
              <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-green-400 to-blue-500"></div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500"></div>
              <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;