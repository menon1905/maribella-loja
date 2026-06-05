'use client'

import { useRef } from 'react'
import { ProductCard } from './product-card'
import type { Product } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

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
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-3 md:px-4">
        {/* Section header */}
        <div className="flex items-center justify-between mb-5 md:mb-8">
          <h2 className="text-base md:text-2xl font-semibold text-black tracking-[0.1em] uppercase">
            {title}
          </h2>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-[#ff66b2] transition-colors border-b border-gray-300 hover:border-[#ff66b2] pb-0.5"
            >
              Ver Todos
            </Link>
          )}
        </div>

        {/* ── Mobile: 2-column grid ── */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* ── Desktop: horizontal scroll carousel ── */}
        <div className="relative hidden md:block">
          <div className="overflow-x-auto scrollbar-hide" ref={scrollRef} style={{ scrollBehavior: 'smooth' }}>
            <div className="flex gap-5 min-w-min">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-56 lg:w-64"
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
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white hover:bg-white"
            onClick={() => scroll('prev')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white hover:bg-white"
            onClick={() => scroll('next')}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile "Ver Todos" link below grid */}
        {viewAllHref && (
          <div className="mt-5 flex justify-center md:hidden">
            <Link
              href={viewAllHref}
              className="border border-gray-300 text-[10px] font-bold tracking-widest text-gray-700 uppercase px-6 py-2 rounded-full hover:bg-gray-50 hover:border-[#ff66b2] hover:text-[#ff66b2] transition"
            >
              Ver Todos os Produtos
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
