'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { Product } from '@/lib/mock-data'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
}

const getColorHex = (colorName: string): string => {
  const cleanName = colorName.trim().toLowerCase()
  const mapping: Record<string, string> = {
    'preto': '#000000',
    'caramelo': '#c68e17',
    'rosa': '#ff9edb',
    'azul': '#1e40af',
    'branco': '#ffffff',
    'ouro': '#ffd700',
    'dourado': '#ffd700',
    'prata': '#c0c0c0',
    'rosa gold': '#b76e79',
    'rose gold': '#b76e79',
    'nude': '#e3bc9a',
    'rose': '#f43f5e',
    'cinza': '#9ca3af',
    'verde': '#10b981',
    'vermelho': '#ef4444',
    'amarelo': '#eab308',
    'laranja': '#f97316',
    'roxo': '#a855f7',
    'lilás': '#c084fc',
    'lilas': '#c084fc',
    'marrom': '#7b3f00',
    'vinho': '#800020',
    'bordô': '#800020',
    'bordo': '#800020',
    'bege': '#f5f5dc',
    'fúcsia': '#d946ef',
    'fucsia': '#d946ef',
    'turquesa': '#06b6d4',
  }
  
  if (mapping[cleanName]) {
    return mapping[cleanName]
  }

  if (cleanName.includes('listra') || cleanName.includes('listrado')) {
    return 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #888888 2px, #888888 4px)'
  }
  if (cleanName.includes('estampa') || cleanName.includes('estampado') || cleanName.includes('floral') || cleanName.includes('florido')) {
    return 'radial-gradient(circle, #ff9edb 30%, #ffd700 70%)'
  }

  return '#cccccc'
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const discount = product.discount || 0
  const hasDiscount = !!(product.originalPrice && product.originalPrice > product.price)

  // Load favorite status on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const favs = localStorage.getItem('maribella_favorites')
      if (favs) {
        const parsed = JSON.parse(favs)
        setIsFavorited(parsed.includes(product.id))
      }
    }
  }, [product.id])

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const favs = localStorage.getItem('maribella_favorites')
      let items = favs ? JSON.parse(favs) : []
      let newFavStatus = false

      if (items.includes(product.id)) {
        items = items.filter((id: string) => id !== product.id)
        toast.info(`${product.name} removido dos favoritos.`)
      } else {
        items.push(product.id)
        newFavStatus = true
        toast.success(`${product.name} adicionado aos favoritos!`)
      }

      localStorage.setItem('maribella_favorites', JSON.stringify(items))
      setIsFavorited(newFavStatus)
      window.dispatchEvent(new Event('favorites-updated'))
    } catch (err) {
      console.error(err)
    }
  }

  const handleQuickAdd = () => {
    try {
      const cart = localStorage.getItem('cart')
      let items = cart ? JSON.parse(cart) : []
      
      const defaultSize = product.sizes?.[0] || undefined
      const defaultColor = product.colors?.[0] || undefined

      const existingIndex = items.findIndex((item: any) => 
        item.id === product.id && 
        item.size === defaultSize && 
        item.color === defaultColor
      )
      
      if (existingIndex > -1) {
        items[existingIndex].quantity += 1
      } else {
        items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          size: defaultSize,
          color: defaultColor
        })
      }
      
      localStorage.setItem('cart', JSON.stringify(items))
      localStorage.setItem('maribella_cart', JSON.stringify(items))
      window.dispatchEvent(new Event('cart-updated'))
      toast.success(`${product.name} adicionado ao carrinho!`)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Link href={`/produto/${product.id}`} className="group block">
      <div className="flex flex-col">

        {/* Image Container — portrait, clean */}
        <div className="relative overflow-hidden aspect-[2/3] bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-103 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Slide Indicator Badge */}
          <div className="absolute top-2.5 right-2.5 z-10 bg-black/40 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
            1/{product.id === '1' ? '5' : product.id === '2' ? '4' : '3'}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-2.5 left-2.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-500 hover:text-primary flex items-center justify-center shadow transition duration-200 cursor-pointer"
            aria-label="Adicionar aos favoritos"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-primary text-primary' : ''}`} />
          </button>

          {/* Floating Quick Add shopping bag */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleQuickAdd()
            }}
            className="absolute bottom-2.5 right-2.5 z-10 w-9.5 h-9.5 rounded-full bg-[#c0397c] hover:bg-[#a02f68] text-white flex items-center justify-center shadow-lg transition duration-200 active:scale-90 cursor-pointer"
            aria-label="Adicionar rápido ao carrinho"
          >
            <ShoppingBag className="w-4.5 h-4.5 stroke-[2]" />
          </button>

          {/* Discount badge */}
          {hasDiscount && (
            <div className="absolute top-12 left-2.5 z-10 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow">
              -{discount}%
            </div>
          )}
        </div>

        {/* Text block */}
        <div className="pt-2 md:pt-3 pb-3 md:pb-4 border-b border-gray-200 flex flex-col items-center">
          {/* Color Dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center justify-center gap-1 md:gap-1.5 mb-1.5 md:mb-2.5">
              {product.colors.slice(0, 3).map((color) => (
                <div
                  key={color}
                  className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border border-gray-200 shadow-xs"
                  style={{ background: getColorHex(color) }}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[9px] md:text-[10px] text-gray-400 font-medium ml-0.5">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Name */}
          <h3 className="text-[11px] sm:text-[13px] text-gray-800 font-medium capitalize tracking-wide group-hover:text-[#ff9edb] transition-colors duration-200 line-clamp-2 text-center leading-tight px-1">
            {product.name}
          </h3>

          {/* Price row */}
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <span className="text-xs sm:text-base font-extrabold text-gray-900">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            {hasDiscount && (
              <span className="text-[10px] text-gray-400 line-through font-normal">
                R$ {product.originalPrice?.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>

          {/* Installments */}
          <p className="text-[9px] md:text-[10px] text-gray-400 font-light text-center mt-0.5">
            12x de R$ {(product.price / 12).toFixed(2).replace('.', ',')}
          </p>
        </div>

      </div>
    </Link>
  )
}
