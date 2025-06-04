import Image from "next/image"

export default function ServicesSection() {
  const services = [
    {
      icon: "/placeholder.svg?height=80&width=80",
      title: "Medicines",
      description:
        "Explore our wide range of medicines, including prescription and over-the-counter medications, to support your health and well-being. From pain relief and cold remedies to chronic condition treatments, we provide trusted pharmaceutical solutions to meet your needs. Shop safely and conveniently with us.",
    },
    {
      icon: "/placeholder.svg?height=80&width=80",
      title: "HealthCare",
      description:
        "Discover a wide range of skincare, personal care, and wellness products designed to nourish, protect, and enhance your daily routine for a healthier, more radiant you.",
    },
    {
      icon: "/placeholder.svg?height=80&width=80",
      title: "Health Blog",
      description:
        "Explore expert insights, wellness tips, and the latest health trends to help you make informed decisions about your well-being and live a healthier, more balanced life.",
    },
    {
      icon: "/placeholder.svg?height=80&width=80",
      title: "Supplements",
      description:
        "Boost your health with our wide selection of high-quality supplements, including essential vitamins, minerals, and nutritional support tailored to enhance your energy, immunity, and overall wellness.",
    },
  ]

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-medium mb-4">The Best Pharmacy makes all medicines available</h2>
          <p className="text-xl text-dark-gray">A perfect way to show your pharmacy services</p>
          <div className="flex items-center justify-center my-6">
            <div className="h-0.5 w-32 bg-light-gray"></div>
            <Image src="/placeholder.svg?height=20&width=20" alt="Dots" width={20} height={20} className="mx-4" />
            <div className="h-0.5 w-32 bg-light-gray"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-6">
                <Image src={service.icon || "/placeholder.svg"} alt={service.title} width={80} height={80} />
              </div>
              <h3 className="text-xl font-semibold mb-4 opacity-70">{service.title}</h3>
              <p className="text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
