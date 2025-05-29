"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight } from "lucide-react"

export default function ContactSection() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Thank you for your message! We'll get back to you soon.")
  }

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[400px] lg:h-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.1234567890!2d31.2134567890!3d30.0456789012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145846c123456789%3A0xabcdef1234567890!2sCairo+Opera+House!5e0!3m2!1sen!2seg!4v1616161616161"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="rounded-lg"
            ></iframe>
          </div>
          <div className="bg-fros-blue text-white p-8 rounded-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-medium mb-2">Contact Us</h3>
              <p className="text-lg">Have questions? We're here to help—reach out anytime!</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Your name"
                  className="bg-[#3373dd] border-none text-white placeholder:text-white"
                  required
                />
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-[#3373dd] border-none text-white placeholder:text-white"
                  required
                />
                <Textarea
                  rows={5}
                  placeholder="Your Message"
                  className="bg-[#3373dd] border-none text-white placeholder:text-white"
                  required
                />
                <Button type="submit" variant="outline" className="bg-white text-fros-blue hover:bg-gray-100 mt-6">
                  <ArrowRight className="mr-2 h-4 w-4" /> Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
