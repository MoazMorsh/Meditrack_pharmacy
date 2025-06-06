import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function AboutSection() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-6">About Us</h2>
              <div className="h-1 w-full lg:w-[405px] bg-light-gray relative mx-auto lg:mx-0">
                <div className="absolute top-0 left-1/2 lg:left-0 transform -translate-x-1/2 lg:translate-x-0 h-full w-[102px] bg-light-blue"></div>
              </div>
            </div>
            <p className="text-lg my-12 leading-relaxed">
              MediTrack revolutionizes the way you access medicine in Cairo, EG. Our innovative search engine connects
              you with local pharmacies, allowing you to check the availability of your required medications
              effortlessly. If your medicine is out of stock, we provide substitute suggestions to ensure you never miss
              a dose. Experience the convenience of MediTrack and take control of your health today!
            </p>
            <Button variant="outline" className="text-dark-gray">
              Learn More
            </Button>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[537px]">
              <div className="relative bg-[#3983fe] z-10">
                <Image
                  src="https://res.cloudinary.com/dzj5xj6sq/image/upload/v1749208557/about2_gzsj90.jpg?height=500&width=500"
                  alt="About Meditrack"
                  width={537}
                  height={500}
                  className="transform scale-x-[1.03]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
