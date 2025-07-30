import { Card } from "@/components/ui/card";
import { Plus, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Alex Taylor",
    role: "Travel Enthusiast",
    content:
      "Absolutely incredible experience! The team planned every detail perfectly and made our honeymoon in Italy absolutely magical. Highly recommend!",
    avatar: "AT",
  },
  {
    name: "Maria Garcia",
    role: "Adventure Seeker",
    content:
      "From the moment I booked until I returned home, everything was seamless. The local guides were knowledgeable and the accommodations were perfect.",
    avatar: "MG",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-background to-travel-warm/10">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-16">
          <div>
            <p className="text-travel-orange font-semibold mb-2 tracking-wide uppercase">
              Testimonial —
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              What people say about us
            </h2>
          </div>

          <div className="flex items-center space-x-5 mt-8 md:mt-0">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-travel-coral border-2 border-white ring-2 ring-white shadow-md" />
              <div className="w-10 h-10 rounded-full bg-travel-warm border-2 border-white ring-2 ring-white shadow-md" />
              <div className="w-10 h-10 rounded-full bg-travel-orange border-2 border-white ring-2 ring-white shadow-md" />
              <div className="w-10 h-10 rounded-full bg-travel-orange-dark border-2 border-white ring-2 ring-white shadow-md" />
            </div>
            <button className="flex items-center space-x-2 text-sm text-foreground font-medium hover:underline">
              <Plus className="w-4 h-4" />
              <span>See More</span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="relative group p-8 rounded-3xl bg-white border border-transparent hover:border-travel-orange/40 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 text-travel-orange/10 w-10 h-10" />

              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-travel-orange to-travel-coral flex items-center justify-center text-white font-semibold text-lg shadow-lg ring-2 ring-travel-orange/20 mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-lg text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>

              <p className="text-base text-muted-foreground leading-relaxed">
                {testimonial.content}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

