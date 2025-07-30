import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Taylor",
    role: "Travel Enthusiast",
    content: "Absolutely incredible experience! The team planned every detail perfectly and made our honeymoon in Italy absolutely magical. Highly recommend!",
    rating: 5,
    avatar: "AT"
  },
  {
    name: "Maria Garcia", 
    role: "Adventure Seeker",
    content: "From the moment I booked until I returned home, everything was seamless. The local guides were knowledgeable and the accommodations were perfect.",
    rating: 5,
    avatar: "MG"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            What people say about us
          </h2>
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-travel-coral border-2 border-background"></div>
              <div className="w-10 h-10 rounded-full bg-travel-warm border-2 border-background"></div>
              <div className="w-10 h-10 rounded-full bg-travel-orange border-2 border-background"></div>
              <div className="w-10 h-10 rounded-full bg-travel-orange-dark border-2 border-background"></div>
            </div>
            <span className="text-sm text-muted-foreground">2000+ Reviews</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8 bg-white border border-travel-orange/20 hover:border-travel-orange/40 transition-all duration-300">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-6 italic">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-travel-orange to-travel-coral flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;