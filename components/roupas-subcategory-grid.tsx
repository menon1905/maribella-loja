'use client'

import Image from 'next/image'
import Link from 'next/link'

const ROUPAS_SUBCATS = [
  {
    label: 'Todas',
    href: '/categorias/roupas?sub=todas',
    image: '/cat_roupas.png',
  },
  {
    label: 'Blusa',
    href: '/categorias/roupas?sub=blusa',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300&h=300&fit=crop',
  },
  {
    label: 'Body',
    href: '/categorias/roupas?sub=body',
    image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=300&h=300&fit=crop',
  },
  {
    label: 'Camisa e Kimono',
    href: '/categorias/roupas?sub=camisa e kimono',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop',
  },
  {
    label: 'Calça',
    href: '/categorias/roupas?sub=calça',
    image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=300&h=300&fit=crop',
  },
  {
    label: 'Conjunto',
    href: '/categorias/roupas?sub=conjunto',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop',
  },
  {
    label: 'Cropped',
    href: '/categorias/roupas?sub=cropped',
    image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=300&h=300&fit=crop',
  },
  {
    label: 'Jaqueta e Blazer',
    href: '/categorias/roupas?sub=jaqueta, casaco e blazer',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=300&fit=crop',
  },
  {
    label: 'Macacão',
    href: '/categorias/roupas?sub=macacão',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=300&fit=crop',
  },
  {
    label: 'Saia',
    href: '/categorias/roupas?sub=saia',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=300&h=300&fit=crop',
  },
  {
    label: 'Vestido',
    href: '/categorias/roupas?sub=vestido',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=300&fit=crop',
  },
  {
    label: 'Biquínis',
    href: '/categorias/roupas?sub=biquínis',
    image: 'https://images.unsplash.com/photo-1570976447640-ac859083963f?w=300&h=300&fit=crop',
  },
]

export function RoupasSubcategoryGrid() {
  return (
    <section className="py-12 md:py-16 bg-white flex-1">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 tracking-[0.2em] uppercase">
            Categorias
          </h2>
          <p className="text-sm text-gray-400 mt-2 tracking-wide">
            Encontre exatamente o que você procura
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 md:gap-8 justify-items-center">
          {ROUPAS_SUBCATS.map((sub) => (
            <Link
              key={sub.label}
              href={sub.href}
              className="group flex flex-col items-center gap-3 cursor-pointer select-none"
            >
              {/* Circle */}
              <div className="relative w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] md:w-[130px] md:h-[130px] rounded-full overflow-hidden border-4 border-transparent group-hover:border-[#ff9edb] transition-all duration-300 shadow-md group-hover:shadow-xl group-hover:shadow-pink-200/60">
                <Image
                  src={sub.image}
                  alt={sub.label}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  unoptimized
                />
                {/* Pink overlay on hover */}
                <div className="absolute inset-0 bg-[#ff9edb]/0 group-hover:bg-[#ff9edb]/15 transition-colors duration-300 rounded-full" />
              </div>

              {/* Label */}
              <span className="text-[11px] sm:text-xs font-bold text-gray-600 group-hover:text-[#ff9edb] tracking-widest uppercase transition-colors duration-200 text-center leading-tight">
                {sub.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
