'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const FALLBACK_SUBCATS = [
  { label: 'Todas', href: '/categorias/roupas?sub=todas', image: '/subcats/todas.jpeg', objectPosition: 'center' },
  { label: 'Blusas e Jaquetas', href: '/categorias/roupas?sub=blusas e jaquetas', image: '/subcats/blusas e jaquetas.jfif', objectPosition: 'center' },
  { label: 'Camisas e Croppeds', href: '/categorias/roupas?sub=camisas e croppeds', image: '/subcats/camisas e croppeds.jfif', objectPosition: 'center' },
  { label: 'Bodys', href: '/categorias/roupas?sub=bodys', image: '/subcats/bodys.jfif', objectPosition: 'center' },
  { label: 'Calças', href: '/categorias/roupas?sub=calças', image: '/subcats/calça.jfif', objectPosition: 'center' },
  { label: 'Shorts', href: '/categorias/roupas?sub=shorts', image: '/subcats/shorts.jfif', objectPosition: 'center' },
  { label: 'Saias', href: '/categorias/roupas?sub=saias', image: '/subcats/saias.jfif', objectPosition: 'center' },
  { label: 'Conjuntos', href: '/categorias/roupas?sub=conjuntos', image: '/subcats/conjuntos.jfif', objectPosition: 'center 42%' },
  { label: 'Macacões', href: '/categorias/roupas?sub=macacões', image: '/subcats/macacoes.jfif', objectPosition: 'center' },
  { label: 'Vestidos', href: '/categorias/roupas?sub=vestidos', image: '/subcats/vestidos.jfif', objectPosition: 'center' },
  { label: 'Biquínis', href: '/categorias/roupas?sub=biquínis', image: '/subcats/biquinis.jfif', objectPosition: 'center' },
]

interface SubcatItem {
  label: string
  href: string
  image: string
  objectPosition?: string
}

export function RoupasSubcategoryGrid() {
  const [subcats, setSubcats] = useState<SubcatItem[]>(FALLBACK_SUBCATS)

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('parent_slug', 'roupas')
          .order('display_order', { ascending: true })

        if (error || !data || data.length === 0) return

        setSubcats(
          data.map((row: any) => ({
            label: row.name,
            href: `/categorias/roupas?sub=${encodeURIComponent(row.name.toLowerCase())}`,
            image: row.image,
            objectPosition: row.image_position || 'center',
          }))
        )
      } catch {
        // silently fall back
      }
    }
    load()
  }, [])

  return (
    <section className="py-12 md:py-16 bg-white flex-1">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 tracking-[0.2em] uppercase">
            Categorias
          </h2>
          <p className="text-sm text-gray-400 mt-2 tracking-wide">
            Encontre exatamente o que você procura
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 md:gap-8 justify-items-center">
          {subcats.map((sub) => (
            <Link
              key={sub.label}
              href={sub.href}
              className="group flex flex-col items-center gap-3 cursor-pointer select-none"
            >
              {/* Circle */}
              <div className="relative w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] md:w-[130px] md:h-[130px] rounded-full overflow-hidden border-4 border-transparent group-hover:border-[#ff9edb] transition-all duration-300 shadow-md group-hover:shadow-xl group-hover:shadow-pink-200/60">
                <Image
                  src={sub.image}
                  alt={sub.label}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  style={{ objectPosition: sub.objectPosition || 'center' }}
                  unoptimized
                />
                {/* Pink overlay on hover */}
                <div className="absolute inset-0 bg-[#ff9edb]/0 group-hover:bg-[#ff9edb]/15 transition-colors duration-300 rounded-full" />
              </div>

              {/* Label */}
              <span className="text-[11px] sm:text-xs font-bold text-gray-600 group-hover:text-[#ff9edb] tracking-widest uppercase transition-colors duration-200 text-center leading-tight">
                {sub.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
