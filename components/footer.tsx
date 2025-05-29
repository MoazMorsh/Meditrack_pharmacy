import Link from "next/link"
import { Facebook, Twitter, Linkedin, Mail, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer id="footer" className="bg-dark-color text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-medium uppercase mb-6">about us</h3>
            <p className="text-md opacity-90 mb-6">
              Meditrack is more than a service—it's a commitment to your health. We ensure timely, reliable medicine
              deliveries, so you never have to worry about missing a dose!
            </p>
            <ul className="space-y-2">
              <li>Order Medicine</li>
              <li>HealthCare Products</li>
              <li>Health Blog</li>
            </ul>
          </div>

          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-medium uppercase mb-6">tags</h3>
            <ul className="flex flex-wrap justify-center lg:justify-start">
              {[
                "COVID Essentials",
                "Personal Care",
                "Health Food & Drinks",
                "Supplements",
                "Mother & Baby Care",
                "Home Care",
              ].map((tag, index) => (
                <li key={index} className="m-1 px-3 py-1 bg-[#3a3a3a] rounded">
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-medium uppercase mb-6">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#services" className="text-white hover:text-dark-gray transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="#package-service" className="text-white hover:text-dark-gray transition-colors">
                  Our Plan
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white hover:text-dark-gray transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-medium uppercase mb-6">Make your first Order</h3>
            <p className="text-md mb-4">Customer Support Here for You.</p>
            <ul className="space-y-2">
              <li>8:00 AM - 11:00 AM</li>
              <li>2:00 PM - 05:00 PM</li>
              <li>8:00 PM - 11:00 PM</li>
              <li className="flex items-center justify-center lg:justify-start">
                <Mail className="mr-2 h-4 w-4" />
                <span>meditrack@gmail.com</span>
              </li>
              <li className="flex items-center justify-center lg:justify-start">
                <Phone className="mr-2 h-4 w-4" />
                <span>+02 2411-5401</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 py-8">
          <ul className="flex justify-center space-x-6">
            <li>
              <Link
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white text-white hover:bg-white hover:text-fros-blue transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white text-white hover:bg-white hover:text-fros-blue transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white text-white hover:bg-white hover:text-fros-blue transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
