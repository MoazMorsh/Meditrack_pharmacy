import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="bg-fros-blue text-white min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-light mb-2">
              Your Most Trusted
              <br />
              <span className="font-bold text-5xl md:text-6xl uppercase">Health PARTNER</span>
            </h1>
            <p className="text-2xl mb-4">The Best Match Services For You</p>
            <p className="text-lg opacity-90 my-8 max-w-lg mx-auto md:mx-0">
              Meditrack, revolutionizing online pharmacy access with trust and efficiency. Seamless connections, secure
              healthcare, and effortless medicine delivery at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" variant="outline" className="bg-white text-fros-blue hover:bg-gray-100">
                <Link href="#about">Learn More</Link>
              </Button>
              <Button asChild size="lg" className="bg-light-blue text-white hover:bg-light-blue/90">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <Image
              src="/placeholder.svg?height=600&width=600"
              alt="Pharmacy services"
              width={600}
              height={600}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      
    </section>
  )
}
