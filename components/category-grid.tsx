'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Category } from '@/lib/mock-data'

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-lg md:text-2xl font-semibold text-black tracking-[0.2em] uppercase">
            Compre por Categorias
          </h2>
        </div>

        {/* Circular Categories */}
        <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center justify-items-center gap-6 md:gap-8 lg:gap-10">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categorias/${category.slug}`}
              className="group flex flex-col items-center gap-3 cursor-pointer select-none w-full md:w-auto"
            >
              {/* Circle */}
              <div className="relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] rounded-full overflow-hidden border-4 border-transparent group-hover:border-[#ff66b2] transition-all duration-300 shadow-md group-hover:shadow-xl group-hover:shadow-pink-200/60">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-[#ff66b2]/0 group-hover:bg-[#ff66b2]/10 transition-colors duration-300 rounded-full" />
              </div>

              {/* Label */}
              <span className="text-xs sm:text-sm font-bold text-gray-700 group-hover:text-[#ff66b2] tracking-widest uppercase transition-colors duration-200 text-center">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
