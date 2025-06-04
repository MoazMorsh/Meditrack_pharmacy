import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">About Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            At Online Pharmacy, our mission is to provide accessible, affordable, and high-quality pharmaceutical
            products and services to our customers. We strive to improve the health and wellbeing of our community
            through excellent customer service and professional pharmaceutical care.
          </p>
          <p className="text-gray-700">
            Founded in 2010, we have grown to become one of the most trusted online pharmacies, serving thousands of
            customers nationwide.
          </p>
        </div>
        <div className="relative h-80 w-full rounded-lg overflow-hidden">
          <Image src="/placeholder.svg?height=400&width=600" alt="Pharmacy team" fill className="object-cover" />
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { title: "Quality", description: "We ensure all our products meet the highest quality standards" },
            { title: "Integrity", description: "We operate with honesty and transparency in all our dealings" },
            { title: "Customer Care", description: "We put our customers' needs at the center of everything we do" },
            { title: "Accessibility", description: "We make healthcare products accessible to everyone" },
            { title: "Innovation", description: "We continuously improve our services through innovation" },
            { title: "Community", description: "We are committed to giving back to the communities we serve" },
          ].map((value, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-700">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Dr. Sarah Johnson", role: "Chief Pharmacist", image: "/placeholder.svg?height=300&width=300" },
            { name: "Michael Chen", role: "Operations Manager", image: "/placeholder.svg?height=300&width=300" },
            { name: "Emily Rodriguez", role: "Customer Service Lead", image: "/placeholder.svg?height=300&width=300" },
            { name: "David Kim", role: "Logistics Coordinator", image: "/placeholder.svg?height=300&width=300" },
          ].map((member, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="relative h-40 w-40 mx-auto mb-4 rounded-full overflow-hidden">
                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
