"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

interface ProductFilterProps {
  categories: string[]
  selectedCategories: string[]
  onCategoryChange: (cat: string) => void
  selectedRating: number | null
  onRatingChange: (n: number) => void
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
  onClear: () => void
}

export function ProductFilter({
  categories,
  selectedCategories,
  onCategoryChange,
  selectedRating,
  onRatingChange,
  priceRange,
  onPriceChange,
  onClear,
}: ProductFilterProps) {
  const ratings = [
    { id: 5, label: "5 Stars" },
    { id: 4, label: "4 Stars & Up" },
    { id: 3, label: "3 Stars & Up" },
    { id: 2, label: "2 Stars & Up" },
    { id: 1, label: "1 Star & Up" },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <Button variant="outline" size="sm" className="w-full" onClick={onClear}>
          Clear All Filters
        </Button>
      </div>
      <Accordion type="multiple" defaultValue={["categories", "price", "ratings"]}>
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox id={category} checked={selectedCategories.includes(category)} onCheckedChange={() => onCategoryChange(category)} />
                  <Label htmlFor={category}>{category}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider value={priceRange} onValueChange={onPriceChange} max={100} step={1} />
              <div className="flex items-center justify-between">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="ratings">
          <AccordionTrigger>Ratings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {ratings.map((rating) => (
                <div key={rating.id} className="flex items-center space-x-2">
                  <Checkbox id={`rating-${rating.id}`} checked={selectedRating === rating.id} onCheckedChange={() => onRatingChange(rating.id)} />
                  <Label htmlFor={`rating-${rating.id}`}>{rating.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
