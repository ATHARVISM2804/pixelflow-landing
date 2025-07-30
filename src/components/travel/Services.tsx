import React from "react";
import { CheckCircle2, Zap, Rocket } from "lucide-react";

const plans = [
  {
    title: "Free Forever",
    price: "₹0",
    icon: <Zap className="text-white" />,
    features: ["Image Editor", "Kundli", "Page Maker", "Cards"],
    buttonStyle: "bg-[#F97316] hover:bg-[#fb8c3c] text-white",
    cardStyle: "bg-[#FFF6F2] border border-[#FCD9B8]",
  },
  {
    title: "Professional Plan",
    price: "₹2.2",
    subtext: "/ Per card",
    icon: <Rocket className="text-white" />,
    features: [
      "All paid cards",
      "All cards slip",
      "Premium support",
      "Custom service request",
      "Passport size photo",
      "Unlimited updates",
      "All from free plan",
    ],
    buttonStyle: "bg-[#F97316] hover:bg-[#fb8c3c] text-white",
    cardStyle: "bg-[#FFF6F2] border-2 border-[#F97316]",
  },
];

const PricingSection = () => {
  return (
    <section className="min-h-screen bg-white text-[#1F2937] py-20 px-6 flex flex-col items-center">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          Simple and affordable{" "}
          <span className="relative inline-block text-[#F97316]">
            Pricing
            <span className="absolute -bottom-1 left-0 w-full h-[8px] bg-[#F97316] opacity-30 rounded-full blur-md" />
          </span>
        </h1>
        <p className="text-[#6B7280] mt-4 text-lg">
          Clear and cost-effective pricing packages to match any budget.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`rounded-2xl p-8 shadow-md transition-all duration-300 hover:scale-[1.02] ${plan.cardStyle}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">{plan.title}</h3>
              <div className="w-10 h-10 rounded-full bg-[#F97316] flex items-center justify-center">
                {plan.icon}
              </div>
            </div>

            <div className="text-4xl font-bold mb-6 text-[#1F2937]">
              {plan.price}
              <span className="text-base font-normal text-[#6B7280] ml-1">
                {plan.subtext}
              </span>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center text-[#4B5563]">
                  <CheckCircle2 className="text-[#10B981] mr-3 w-5 h-5" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`${plan.buttonStyle} font-semibold py-3 w-full rounded-xl transition-all shadow hover:shadow-lg`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;

