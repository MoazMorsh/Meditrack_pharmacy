"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

export function ProductFilter() {
  const [priceRange, setPriceRange] = useState([0, 100])

  const categories = [
    { id: "medications", label: "Medications" },
    { id: "vitamins", label: "Vitamins & Supplements" },
    { id: "personal-care", label: "Personal Care" },
    { id: "first-aid", label: "First Aid" },
    { id: "baby-care", label: "Baby Care" },
  ]

  const brands = [
    { id: "brand1", label: "Johnson & Johnson" },
    { id: "brand2", label: "Pfizer" },
    { id: "brand3", label: "Bayer" },
    { id: "brand4", label: "GlaxoSmithKline" },
    { id: "brand5", label: "Novartis" },
  ]

  const ratings = [
    { id: "5-stars", label: "5 Stars" },
    { id: "4-stars", label: "4 Stars & Up" },
    { id: "3-stars", label: "3 Stars & Up" },
    { id: "2-stars", label: "2 Stars & Up" },
    { id: "1-star", label: "1 Star & Up" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <Button variant="outline" size="sm" className="w-full">
          Clear All Filters
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["categories", "price", "brands", "ratings"]}>
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox id={category.id} />
                  <Label htmlFor={category.id}>{category.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider defaultValue={[0, 100]} max={100} step={1} value={priceRange} onValueChange={setPriceRange} />
              <div className="flex items-center justify-between">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brands">
          <AccordionTrigger>Brands</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox id={brand.id} />
                  <Label htmlFor={brand.id}>{brand.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ratings">
          <AccordionTrigger>Ratings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {ratings.map((rating) => (
                <div key={rating.id} className="flex items-center space-x-2">
                  <Checkbox id={rating.id} />
                  <Label htmlFor={rating.id}>{rating.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
