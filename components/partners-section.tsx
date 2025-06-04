import Image from "next/image"

export default function PartnersSection() {
  const partners = [
    {
      name: "Hatem Amer",
      role: "Associate Minister of Health",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      name: "Riad Armanious",
      role: "chief executive officer, Eva Pharma",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      name: "Ahmed Elsobky",
      role: "Chairman of Board of Directors",
      image: "/placeholder.svg?height=400&width=300",
    },
  ]

  return (
    <section id="doc-panel" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-center">Our Partners</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <div key={index} className="relative group">
              <div className="relative h-[440px] bg-light-gray overflow-hidden flex items-end">
                <Image src={partner.image || "/placeholder.svg"} alt={partner.name} fill className="object-cover" />
                <div className="absolute bottom-0 left-0 w-full h-[100px] bg-fros-blue text-white text-center flex flex-col justify-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xl font-medium">{partner.name}</p>
                  <p className="text-lg">{partner.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
