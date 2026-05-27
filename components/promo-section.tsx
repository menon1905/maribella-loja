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
              <div className="group relative h-64 rounded-lg overflow-hidden cursor-pointer">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center space-y-3">
                  <h3 className="text-2xl md:text-3xl font-bold">{item.title}</h3>
                  <p className="text-sm md:text-base opacity-90">{item.description}</p>
                  <Button variant="outline" className="bg-white text-black hover:bg-white/90 mt-2">
                    Conferir Agora
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
