'use client'

import Image from 'next/image'
import Link from 'next/link'

export function HeroCarousel() {
  return (
    <section className="relative w-full overflow-hidden bg-[#f9a8cf]">
      <Link href="/produtos" className="block w-full cursor-pointer">
        <div className="relative w-full aspect-[1280/520]">
          <Image
            src="/banner_frete_gratis.jpg"
            alt="Frete Grátis na Maribella"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
      </Link>
    </section>
  )
}
