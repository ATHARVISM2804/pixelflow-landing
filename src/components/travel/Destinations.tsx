import { Card } from "@/components/ui/card";
import Slider from "react-slick";
import veniceImage from "@/assets/venice-destination.jpg";
import thailandImage from "@/assets/thailand-destination.jpg";
import londonImage from "@/assets/london-destination.jpg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const destinations = [
  {
    id: 1,
    title: "Create Resumes Effortlessly",
    image: veniceImage,
    description:
      "Craft stunning resumes effortlessly with our easy-to-use builder — professional templates, zero hassle.",
  },
  {
    id: 2,
    title: "Create Passport Size Images with Perfection",
    image: thailandImage,
    description:
      "Upload your photo, adjust the frame, and download high-quality passport-size images instantly — ready for print or online use.",
  },
  {
    id: 3,
    title: "Edit Images According to your Requirnment",
    image: londonImage,
    description:
      "Crop, resize, and enhance images with precision — no design skills needed.",
  },
  {
    id: 4,
    title: "Free Kundli Downloader",
    image: londonImage,
    description:
      "Generate your Vedic horoscope in seconds — accurate, personalized, and downloadable.",
  },
  {
    id: 5,
    title: "Create School IDs",
    image: londonImage,
    description:
      "Design and download school ID cards for students, teachers, and staff in minutes",
  },
];

const Destinations = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 2500,
    slidesToShow: 3,
    slidesToScroll: 1,
    pauseOnHover: true,
    cssEase: "ease-in-out",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            All Your ID Cards in One Place — Fast, Easy, Professional.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate Aadhaar, PAN, Voter, Ayushman, and other government-style
            cards in just a few clicks.
          </p>
        </div>

        <Slider {...sliderSettings}>
          {destinations.map((destination) => (
            <div key={destination.id} className="px-3 group">
              <Card className="rounded-2xl overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-[100%] min-h-[400px] flex flex-col justify-between">
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <img
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6 space-y-4 flex flex-col justify-between flex-grow">
                  <h3 className="text-xl font-semibold text-foreground capitalize">
                    {destination.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {destination.description}
                  </p>
                </div>
              </Card>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Destinations;
