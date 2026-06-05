'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PromoItem {
  title: string
  description: string
  image: string
  href: string
}

interface PromoSectionProps {
  items: PromoItem[]
}

export function PromoSection({ items }: PromoSectionProps) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item, idx) => (
            <Link key={idx} href={item.href}>
              <div className="group relative h-64 md:h-80 rounded-sm overflow-hidden cursor-pointer">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                  <h3 className="text-2xl md:text-3xl font-light tracking-[0.1em] uppercase mb-2">{item.title}</h3>
                  <p className="text-xs md:text-sm font-medium tracking-widest uppercase opacity-90 mb-6">{item.description}</p>
                  <Button variant="outline" className="rounded-none border-white text-white bg-transparent hover:bg-white hover:text-black transition-colors uppercase text-xs tracking-widest font-bold">
                    Comprar Agora
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
