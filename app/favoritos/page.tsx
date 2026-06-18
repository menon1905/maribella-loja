'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { useProducts } from '@/components/products-context'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Toaster } from 'sonner'

export default function FavoritosPage() {
  const { products, isLoading } = useProducts()
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const loadFavorites = () => {
    try {
      const favs = localStorage.getItem('maribella_favorites')
      if (favs) {
        setFavoriteIds(JSON.parse(favs))
      } else {
        setFavoriteIds([])
      }
    } catch (e) {
      console.error(e)
    }
  };

  useEffect(() => {
    loadFavorites()
    setIsLoaded(true)

    // Listen to updates from other components
    window.addEventListener('favorites-updated', loadFavorites)
    return () => {
      window.removeEventListener('favorites-updated', loadFavorites)
    }
  }, [])

  // Filtrar os produtos favoritados baseando-se nos IDs salvos
  const favoriteProducts = products.filter(p => favoriteIds.includes(p.id))

  return (
    <main className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      <Toaster position="top-right" richColors />

      {/* Title Header */}
      <div className="bg-white border-b border-pink-100/60 py-8 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 text-xs text-pink-500 font-bold uppercase tracking-wider mb-2">
            <Link href="/" className="hover:text-pink-600 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Início
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <Heart className="w-8 h-8 text-primary fill-primary" /> Meus Favoritos
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Sua lista de desejos e peças salvas para comprar depois.</p>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-6 py-12">
        {!isLoaded || isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <div className="w-7 h-7 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-semibold">Carregando seus favoritos...</span>
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-xs max-w-md mx-auto p-8 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#db459b]">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sua lista está vazia</h2>
            <p className="text-gray-500 text-sm mb-8">Navegue pelas nossas coleções e salve os seus produtos favoritos clicando no ícone de coração.</p>
            <Link href="/produtos">
              <Button className="bg-primary hover:bg-[#ffbfe7] hover:text-[#db459b] text-white font-bold px-6 py-5 rounded-xl uppercase tracking-wider text-xs transition-all">
                Ver Coleções
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
