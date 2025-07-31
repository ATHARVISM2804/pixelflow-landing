import { Card } from "@/components/ui/card";
import { Package, Clock, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Package,
    title: "One Platform, Endless Possibilities",
    description:
      "Create the perfect document experience with our flexible editing tools. Mix and match features like ID card generation, resume building, and photo resizing to fit your personal or professional needs — all in one place, designed to save time and deliver quality.",
  },
  {
    icon: Clock,
    title: "Instant Downloads, Zero Hassle",
    description:
      "Get your ID cards, resumes, or passport photos instantly — no waiting, no hassle. As soon as you're done customizing, your document is ready to download in high quality. Whether it's for school, work, or official use, we ensure a smooth, fast, and reliable delivery process so you can move forward without delays.",
  },
 {
  icon: ShieldCheck,
  title: "Privacy First — Your Data Is Protected",
  description:
    "Your data security is our top priority — from ID cards to resumes and photos, every file you upload or generate stays private and protected. We never store your personal information or share it with third parties. All processing happens securely in real time, ensuring complete confidentiality at every step, so you can create with confidence and peace of mind.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-travel-orange-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Why Choose Us ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by thousands for fast, reliable, and professional ID solutions. We're
            not just a tool — we're your digital partner.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 text-center bg-white border border-travel-orange/20 hover:border-travel-orange/40 transition-all duration-300 hover:shadow-lg"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-travel-orange-light flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
