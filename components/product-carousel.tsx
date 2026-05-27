'use client'

import { useRef } from 'react'
import { ProductCard } from './product-card'
import type { Product } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductCarouselProps {
  products: Product[]
  title: string
  viewAllHref?: string
}

export function ProductCarousel({ products, title, viewAllHref }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'prev' | 'next') => {
    if (scrollRef.current) {
      const scrollAmount = 320
      if (direction === 'prev') {
        scrollRef.current.scrollLeft -= scrollAmount
      } else {
        scrollRef.current.scrollLeft += scrollAmount
      }
    }
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          {viewAllHref && (
            <Button variant="outline" asChild>
              <a href={viewAllHref}>Ver Todos</a>
            </Button>
          )}
        </div>

        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide" ref={scrollRef} style={{ scrollBehavior: 'smooth' }}>
            <div className="flex gap-4 min-w-min">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            size="icon"
            variant="outline"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white hover:bg-white"
            onClick={() => scroll('prev')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white hover:bg-white"
            onClick={() => scroll('next')}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
