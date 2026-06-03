'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroSlide {
  id: number
  image: string
  title: string
  subtitle: string
  cta: string
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&h=700&fit=crop',
    title: 'Novidades',
    subtitle: 'Descubra os últimos lançamentos de moda',
    cta: 'Explorar'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1483389127117-b6a2102724ae?w=1600&h=700&fit=crop',
    title: 'Coleção Exclusiva',
    subtitle: 'Peças únicas para seu estilo',
    cta: 'Ver Coleção'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1488554347057-e989b6f1c22b?w=1600&h=700&fit=crop',
    title: 'Até 50% OFF',
    subtitle: 'Aproveite nossas promoções especiais',
    cta: 'Comprar Agora'
  }
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 8000)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 8000)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 8000)
  }

  const slide = HERO_SLIDES[currentSlide]

  return (
    <section className="relative w-full h-[600px] md:h-[750px] overflow-hidden mt-20 md:mt-24">
      {/* Slides */}
      <div className="relative w-full h-full">
        {HERO_SLIDES.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-start px-6 md:px-12">
        <div className="max-w-2xl">
          <h2 className="text-5xl md:text-6xl font-serif text-white mb-3 text-balance">
            {slide.title}
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-6 text-pretty">
            {slide.subtitle}
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base font-semibold rounded-full">
            {slide.cta}
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
