import { Card } from "@/components/ui/card";
import { Star, Heart } from "lucide-react";
import veniceImage from "@/assets/venice-destination.jpg";
import thailandImage from "@/assets/thailand-destination.jpg";
import londonImage from "@/assets/london-destination.jpg";

const destinations = [
  {
    id: 1,
    title: "Grand canal venice Italy",
    image: veniceImage,
    rating: 4.8,
    reviews: 6.8,
    description: "Venice's iconic waterways and stunning architecture make it a must-visit destination."
  },
  {
    id: 2,
    title: "Phi phi islands Thailand", 
    image: thailandImage,
    rating: 4.9,
    reviews: 8.1,
    description: "Crystal clear waters and dramatic limestone cliffs create paradise on Earth."
  },
  {
    id: 3,
    title: "Big ben clock tower london",
    image: londonImage,
    rating: 4.7,
    reviews: 12.8,
    description: "Historic landmarks and vibrant culture await in England's iconic capital city."
  }
];

const Destinations = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Explore top destination
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the world's most captivating destinations handpicked by our travel experts 
            to ensure unforgettable experiences and memories that last a lifetime.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <Card key={destination.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <img 
                  src={destination.image} 
                  alt={destination.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-foreground capitalize">
                  {destination.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {destination.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{destination.rating}</span>
                    <span className="text-sm text-muted-foreground">({destination.reviews}k Reviews)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">From</span>
                    <span className="text-lg font-bold text-primary">$299</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-4">
            <button className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center hover:border-primary transition-colors">
              <span className="text-lg">←</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <span className="text-lg">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Destinations;