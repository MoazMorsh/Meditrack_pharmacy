import Hero from "@/components/hero"
import AboutSection from "@/components/about-section"
import BannerOne from "@/components/banner-one"
import ServicesSection from "@/components/services-section"
import BannerTwo from "@/components/banner-two"
import PartnersSection from "@/components/partners-section"
import PackageService from "@/components/package-service"
import Testimonials from "@/components/testimonials"
import ContactSection from "@/components/contact-section"

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <BannerOne />
      <ServicesSection />
      <BannerTwo />
      <PartnersSection />
      <PackageService />
      <Testimonials />
      <ContactSection />
    </>
  )
}
