'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const DEFAULT_BANNERS = [
  { src: '/banner1.png', srcMobile: '/banner1.png', alt: 'Maribella - Coleção Especial' },
  { src: '/banner2.png', srcMobile: '/banner2.png', alt: 'Maribella - Novidades da Temporada' },
  { src: '/banner3.png', srcMobile: '/banner3.png', alt: 'Maribella - Estilos Exclusivos' },
]

export function HeroCarousel() {
  const [banners, setBanners] = useState<any[]>(DEFAULT_BANNERS)
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    async function loadBanners() {
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (error) throw error

        if (data && data.length > 0) {
          const mapped = data.map((b: any) => ({
            src: b.image_desktop,
            srcMobile: b.image_mobile || b.image_desktop,
            alt: b.alt || 'Maribella Banner',
          }))
          setBanners(mapped)
        }
      } catch (err) {
        console.warn('Erro ao carregar banners do Supabase, usando padrão.', err)
      }
    }
    loadBanners()
  }, [])

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrent(index)
    setTimeout(() => setIsTransitioning(false), 600)
  }, [isTransitioning])

  const prev = useCallback(() => {
    if (banners.length === 0) return
    goTo((current - 1 + banners.length) % banners.length)
  }, [current, goTo, banners.length])

  const next = useCallback(() => {
    if (banners.length === 0) return
    goTo((current + 1) % banners.length)
  }, [current, goTo, banners.length])

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (banners.length === 0) return
    const interval = setInterval(() => {
      setCurrent(c => (c + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  if (banners.length === 0) return null

  return (
    <section className="relative w-full overflow-hidden bg-[#f9a8cf] group">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner, i) => (
          <div
            key={i}
            className="relative w-full flex-shrink-0"
          >
            {/* Mobile — mesma proporcao do banner real */}
            <div className="relative w-full aspect-[16/9] sm:hidden">
              <Image
                src={banner.srcMobile}
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
          </div>
        ))}
      </div>

      {/* Prev / Next buttons */}
      {banners.length > 1 && (
        <>
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
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, i) => (
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
      )}
    </section>
  )
}
