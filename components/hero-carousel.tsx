'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const BANNERS = [
  { src: '/banner1.png', alt: 'Maribella - Coleção Especial', href: '/produtos' },
  { src: '/banner2.png', alt: 'Maribella - Novidades da Temporada', href: '/produtos' },
  { src: '/banner3.png', alt: 'Maribella - Estilos Exclusivos', href: '/produtos' },
]

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrent(index)
    setTimeout(() => setIsTransitioning(false), 600)
  }, [isTransitioning])

  const prev = useCallback(() => {
    goTo((current - 1 + BANNERS.length) % BANNERS.length)
  }, [current, goTo])

  const next = useCallback(() => {
    goTo((current + 1) % BANNERS.length)
  }, [current, goTo])

  // Auto-advance every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(c => (c + 1) % BANNERS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative w-full overflow-hidden bg-[#f9a8cf] group">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {BANNERS.map((banner, i) => (
          <Link
            key={i}
            href={banner.href}
            className="relative w-full flex-shrink-0 cursor-pointer"
          >
            {/* Mobile — mesma proporcao do banner real */}
            <div className="relative w-full aspect-[16/9] sm:hidden">
              <Image
                src={banner.src}
                alt={banner.alt}
                fill
                priority={i === 0}
                className="object-cover object-center"
              />
            </div>
            {/* Tablet/Desktop — proporção exata 1580×700 */}
            <div className="relative hidden sm:block w-full" style={{ aspectRatio: '1580/700' }}>
              <Image
                src={banner.src}
                alt={banner.alt}
                fill
                priority={i === 0}
                className="object-cover object-center"
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Prev / Next buttons */}
      <button
        onClick={prev}
        aria-label="Banner anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        aria-label="Próximo banner"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Ir para banner ${i + 1}`}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === current
                ? 'w-6 h-2.5 bg-white'
                : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
