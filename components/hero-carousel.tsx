'use client'

import Image from 'next/image'
import Link from 'next/link'

export function HeroCarousel() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FD9FC3]">
      <Link href="/produtos" className="block w-full cursor-pointer">
        <div className="relative w-full aspect-[1280/520] max-h-[380px] md:max-h-[420px] bg-[#FD9FC3]">
          <Image
            src="/banner_frete_gratis.jpg"
            alt="Frete Grátis na Maribella"
            fill
            priority
            className="object-contain object-center"
          />
        </div>
      </Link>
    </section>
  )
}
