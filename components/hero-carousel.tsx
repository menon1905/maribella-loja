'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroSlide {
  id: number
  image: string
  bgText: string
  badgeText: string
  cta: string
  href: string
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: '/hero_banner_twins.png',
    bgText: 'NOVIDADES',
    badgeText: 'TODA SEMANA!',
    cta: 'COMPRE AGORA',
    href: '/produtos'
  },
  {
    id: 2,
    image: '/hero_banner_bags.png',
    bgText: 'BOLSAS',
    badgeText: 'LOOK PREMIUM',
    cta: 'COMPRAR AGORA',
    href: '/categorias/bolsas'
  }
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [autoPlay])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 10000)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 10000)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 10000)
  }

  return (
    <section className="relative w-full h-[380px] sm:h-[500px] md:h-[620px] overflow-hidden bg-gradient-to-r from-[#ffd3e5] via-[#ffbcd9] to-[#ffd3e5]">
      
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 flex items-center justify-center ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Giant Background Text */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
                <span className="text-white font-extrabold text-[12vw] sm:text-[14vw] tracking-wider leading-none opacity-80 uppercase font-sans whitespace-nowrap">
                  {slide.bgText}
                </span>
              </div>

              {/* Models / Main Image */}
              <div className="relative w-[85%] sm:w-[70%] md:w-[60%] h-[90%] flex items-center justify-center z-10">
                <Image
                  src={slide.image}
                  alt={slide.bgText}
                  fill
                  priority={index === 0}
                  className="object-contain"
                />
              </div>

              {/* Black Badge/Pill on the Right */}
              <div className="absolute right-[5%] sm:right-[10%] md:right-[15%] top-[40%] md:top-[45%] z-20 transform -translate-y-1/2">
                <div className="bg-black text-white text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-lg tracking-[0.2em] uppercase shadow-xl border border-white/10 animate-bounce">
                  {slide.badgeText}
                </div>
              </div>

              {/* Centered CTA Button at the bottom */}
              <div className="absolute bottom-[8%] sm:bottom-[10%] z-20 left-1/2 -translate-x-1/2">
                <Link href={slide.href}>
                  <Button className="bg-white hover:bg-gray-50 text-black hover:text-black font-semibold text-xs sm:text-sm px-6 sm:px-10 py-5 sm:py-6 rounded-sm shadow-2xl transition-transform hover:scale-105 uppercase tracking-[0.2em] border border-gray-100 cursor-pointer">
                    {slide.cta}
                  </Button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Arrows */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 text-black/60 hover:text-black hover:bg-white/30 rounded-full cursor-pointer h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center animate-in fade-in"
        onClick={prevSlide}
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5]" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 text-black/60 hover:text-black hover:bg-white/30 rounded-full cursor-pointer h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center animate-in fade-in"
        onClick={nextSlide}
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5]" />
      </Button>

      {/* Pagination Dots */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-black w-5'
                : 'bg-black/35 hover:bg-black/50'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
