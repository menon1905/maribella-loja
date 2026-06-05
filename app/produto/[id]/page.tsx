'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCarousel } from '@/components/product-carousel'
import { Button } from '@/components/ui/button'
import { Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react'
import { useProducts } from '@/components/products-context'
import { Product } from '@/lib/mock-data'

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = React.use(params)
  const { products } = useProducts()
  const product = products.find(p => p.id === id)

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-12 text-center my-20">
          <h1 className="text-3xl font-bold mb-4">Produto não encontrado</h1>
          <p className="text-muted-foreground mb-8">O produto que você está procurando não existe ou foi removido.</p>
          <Link href="/produtos">
            <Button className="bg-primary hover:bg-primary/90">Ver todos os produtos</Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const relatedProducts = products.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 8)

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-muted/50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Início</Link>
          <span className="mx-2">›</span>
          <Link href={`/categorias/${product.category}`} className="hover:text-foreground capitalize">
            {product.category}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="relative">
            <div className="relative bg-muted rounded-lg overflow-hidden aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.isNew && (
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded font-bold text-sm">
                  NOVO
                </div>
              )}
              {product.originalPrice && product.originalPrice > product.price && product.discount && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded font-bold text-sm">
                  -{product.discount}%
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="relative bg-muted rounded aspect-square cursor-pointer hover:ring-2 hover:ring-primary">
                  <Image
                    src={product.image}
                    alt={`View ${idx}`}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <ProductInfo product={product} />
        </div>

        {/* Product Details Tabs */}
        <div className="grid md:grid-cols-2 gap-12 py-12 border-t">
          <div>
            <h3 className="text-2xl font-bold mb-4">Descrição do Produto</h3>
            <p className="text-muted-foreground mb-4">{product.description}</p>
            
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Tamanhos disponíveis:</h4>
                <p className="text-sm text-muted-foreground">{product.sizes.join(', ')}</p>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Cores disponíveis:</h4>
                <p className="text-sm text-muted-foreground">{product.colors.join(', ')}</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Informações de Entrega</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Truck className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <p className="font-semibold">Frete Grátis</p>
                  <p className="text-sm text-muted-foreground">Em compras acima de R$ 150</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Shield className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <p className="font-semibold">Compra Segura</p>
                  <p className="text-sm text-muted-foreground">Certificado SSL e proteção ao comprador</p>
                </div>
              </div>
              <div className="flex gap-4">
                <RotateCcw className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <p className="font-semibold">Devolução Fácil</p>
                  <p className="text-sm text-muted-foreground">30 dias de garantia de satisfação</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="py-12 border-t">
          <h3 className="text-2xl font-bold mb-6">Avaliações</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="border-b pb-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">Cliente {idx}</p>
                    <div className="flex text-yellow-400 text-sm">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">há 2 semanas</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Produto excelente, superou minhas expectativas! Muito bom mesmo, recomendo.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <ProductCarousel
          products={relatedProducts}
          title="Produtos Relacionados"
        />
      )}

      <Footer />
    </main>
  )
}

function ProductInfo({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [isFavorited, setIsFavorited] = useState(false)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '')
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '')

  const handleAddToCart = () => {
    try {
      const cart = localStorage.getItem('cart')
      let items = cart ? JSON.parse(cart) : []
      
      const existingIndex = items.findIndex((item: any) => 
        item.id === product.id && 
        item.size === selectedSize && 
        item.color === selectedColor
      )
      
      if (existingIndex > -1) {
        items[existingIndex].quantity += quantity
      } else {
        items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image,
          size: selectedSize,
          color: selectedColor
        })
      }
      
      localStorage.setItem('cart', JSON.stringify(items))
      window.dispatchEvent(new Event('cart-updated'))
      
      alert('Produto adicionado ao carrinho!')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title and Rating */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>
        <div className="flex items-center gap-4">
          <div className="flex text-yellow-400">
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
          </div>
          <span className="text-muted-foreground">({product.reviews} avaliações)</span>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-xl text-muted-foreground line-through">
              R$ {product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        {product.discount && (
          <p className="text-sm text-red-600 font-medium">
            Economize R$ {(product.originalPrice! - product.price).toFixed(2)} ({product.discount}% OFF)
          </p>
        )}
      </div>

      {/* Stock Status */}
      <div>
        <p className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
          {product.inStock ? '✓ Em Estoque' : 'Fora de Estoque'}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-4 pt-4 border-t">
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <label className="font-medium mb-2 block">Selecione o Tamanho</label>
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border rounded py-2 px-3 text-sm font-medium transition ${
                    selectedSize === size
                      ? 'border-[#ff66b2] bg-[#ff66b2]/10 text-[#ff66b2] font-bold shadow-xs'
                      : 'hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.colors && product.colors.length > 0 && (
          <div>
            <label className="font-medium mb-2 block">Selecione a Cor</label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`border rounded py-2 px-4 text-sm font-medium transition ${
                    selectedColor === color
                      ? 'border-[#ff66b2] bg-[#ff66b2]/10 text-[#ff66b2] font-bold shadow-xs'
                      : 'hover:border-gray-400'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div>
          <label className="font-medium mb-2 block">Quantidade</label>
          <div className="flex items-center gap-2 border rounded w-fit">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 hover:bg-muted transition"
            >
              −
            </button>
            <span className="px-4 py-2 font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 hover:bg-muted transition"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          size="lg"
          className="flex-1 bg-primary hover:bg-primary/90 text-lg"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {product.inStock ? 'Adicionar ao Carrinho' : 'Indisponível'}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => setIsFavorited(!isFavorited)}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
        </Button>
      </div>

      {/* Share */}
      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition cursor-pointer">
        <Share2 className="w-4 h-4" />
        Compartilhar Produto
      </button>
    </div>
  )
}
