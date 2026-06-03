'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import type { Product } from '@/lib/mock-data'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
}

const PRODUCT_COLORS = [
  '#000000', // Preto
  '#FFFFFF', // Branco
  '#FF1493', // Rosa
  '#FFB6C1', // Rosa claro
  '#1E90FF', // Azul
  '#FFA500', // Laranja
]

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState(0)
  const discount = product.discount || 0
  const hasDiscount = product.originalPrice && product.originalPrice > product.price

  return (
    <div className="w-full">
      <div className="group cursor-pointer">
        {/* Image Container with Floating Button */}
        <div className="relative bg-muted rounded-md overflow-hidden mb-4 aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              -{discount}%
            </div>
          )}

          {/* Floating Add to Cart Button */}
          <Button
            size="icon"
            className="absolute bottom-3 right-3 rounded-full w-12 h-12 bg-primary hover:bg-primary/90 shadow-lg opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            <ShoppingCart className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* Color Selector */}
        <div className="flex gap-2 mb-3">
          {PRODUCT_COLORS.map((color, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault()
                setSelectedColor(idx)
              }}
              className={`w-5 h-5 rounded-full transition border-2 ${
                selectedColor === idx ? 'border-primary scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        {/* Product Name */}
        <Link href={`/produto/${product.id}`}>
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400 text-xs">
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-primary">R$ {product.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                R$ {product.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>

          {/* Installment Info */}
          <p className="text-xs text-muted-foreground">
            12 x de R$ {(product.price / 12).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
