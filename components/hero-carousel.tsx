'use client'

import Image from 'next/image'
import Link from 'next/link'

export function HeroCarousel() {
  return (
    <section className="relative w-full overflow-hidden bg-[#f9a8cf]">
      <Link href="/produtos" className="block w-full cursor-pointer">
        {/* Mobile: show full image via object-contain so nothing gets cut */}
        <div className="relative w-full aspect-[4/3] sm:hidden">
          <Image
            src="/banner_frete_gratis.jpg"
            alt="Frete Grátis na Maribella"
            fill
            priority
            className="object-contain object-center"
          />
        </div>

        {/* Tablet / Desktop: tall fixed height, object-cover centered */}
        <div className="relative hidden sm:block w-full h-[500px] md:h-[620px]">
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
