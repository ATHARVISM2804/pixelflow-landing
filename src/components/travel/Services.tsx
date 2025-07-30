import { MapPin, Plane, Building } from "lucide-react";

const services = [
	{
		icon: MapPin,
		title: "01 Travel plan",
		description:
			"Travel plans aren’t destinations; they’re the gateways to new experiences, the energy to explore, and the path to unforgettable moments.",
	},
	{
		icon: Plane,
		title: "02 Flights booking",
		description:
			"Flight bookings aren’t just travel; they’re the first step of what you’ll live. The promise of places to chase, and adventures waiting to unfold.",
	},
	{
		icon: Building,
		title: "03 Accommodation",
		description:
			"Home isn’t a place, it’s where it’s elevated in your journey, the comfort in your adventure, and the backdrop to your memory.",
	},
];

const imageUrls = [
	"https://images.pexels.com/photos/1549323/pexels-photo-1549323.jpeg", // Airplane
	"https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg", // Girl w/ camera
	"https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg", // Mountain/lake
	"https://images.pexels.com/photos/3328051/pexels-photo-3328051.jpeg", // Parachute
];

const Services = () => {
	return (
		<section className="py-20 bg-white">
			<div className="container mx-auto px-6 lg:px-20">
				<div className="grid lg:grid-cols-2 gap-16 items-center">
					{/* Text & Services List */}
					<div className="space-y-10">
						<div>
							<p className="text-travel-orange font-semibold mb-2">
								Our Service —
							</p>
							<h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
								Discover what we <br /> provide exclusively
							</h2>
							<p className="text-muted-foreground text-base">
								Explore our unique offerings and experience services designed
								for you. Discover what we provide intentionally tailored to
								meet your every need.
							</p>
						</div>

						<div className="space-y-6">
							{services.map((service, index) => (
								<div
									key={index}
									className="bg-white shadow-sm rounded-xl p-5 flex items-start gap-4"
								>
									<div className="w-12 h-12 flex items-center justify-center rounded-full bg-travel-orange-light flex-shrink-0">
										<service.icon className="w-6 h-6 text-travel-orange" />
									</div>
									<div>
										<h4 className="text-md font-semibold text-foreground mb-1">
											{service.title}
										</h4>
										<p className="text-sm text-muted-foreground leading-relaxed">
											{service.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Circular Image Grid */}
					<div className="grid grid-cols-2 gap-2 justify-items-center">
						{imageUrls.map((url, idx) => (
							<div
								key={idx}
								className={`${
									idx === 1 || idx === 2 ? "w-60 h-60" : "w-40 h-40"
								} rounded-full overflow-hidden shadow-lg border-4 border-white`}
							>
								<img
									src={url}
									alt={`Service ${idx + 1}`}
									className="object-cover w-full h-full"
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Services;
