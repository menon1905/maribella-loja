'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import type { Product } from '@/lib/mock-data'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const discount = product.discount || 0
  const hasDiscount = product.originalPrice && product.originalPrice > product.price

  if (variant === 'compact') {
    return (
      <Link href={`/produto/${product.id}`}>
        <div className="group cursor-pointer">
          <div className="relative bg-muted rounded-lg overflow-hidden mb-3 aspect-square">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {product.isNew && (
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                NOVO
              </div>
            )}
            {hasDiscount && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{discount}%
              </div>
            )}
          </div>
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition">
            {product.name}
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">R$ {product.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                R$ {product.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <div className="flex text-yellow-400 text-xs">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/produto/${product.id}`}>
      <div className="group cursor-pointer h-full">
        <div className="relative bg-muted rounded-lg overflow-hidden mb-4 aspect-square mb-4">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Badges */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
          {product.isNew && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded">
              NOVO
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded">
              -{discount}%
            </div>
          )}

          {/* Actions on Hover */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0">
            <Button
              size="sm"
              className="w-full bg-white text-black hover:bg-white/90 font-medium"
              onClick={(e) => {
                e.preventDefault()
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition">
            {product.name}
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex text-yellow-400 text-xs">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-2">
            <span className="text-lg font-bold text-primary">R$ {product.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                R$ {product.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <p className="text-xs font-medium text-green-600 pt-1">
            {product.inStock ? '✓ Em Estoque' : 'Fora de Estoque'}
          </p>
        </div>
      </div>
    </Link>
  )
}
