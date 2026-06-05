'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative w-full h-screen md:h-[700px] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&h=900&fit=crop"
        alt="Hero Banner"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40" />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white space-y-6 px-4 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-balance">
            Descobra Seu Estilo
          </h1>
          <p className="text-lg md:text-xl text-balance opacity-95">
            A melhor seleção de moda, acessórios e beleza para você brilhar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/categorias/roupas">
              <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                Explorar Roupas
              </Button>
            </Link>
            <Link href="/categorias/bolsas">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/20 border-white text-white hover:bg-white/30 w-full sm:w-auto"
              >
                Ver Bolsas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
