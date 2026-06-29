'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X, ArrowUpDown, SearchX } from 'lucide-react'
import { toast } from 'sonner'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useProducts } from '@/components/products-context'

// Normalize text: lowercase + remove accents
function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function ProductsContent() {
  const { products } = useProducts()
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products

    const normalizedQuery = normalize(searchQuery.trim())
    const queryWords = normalizedQuery.split(/\s+/)

    return products.filter((product) => {
      const searchableText = normalize(
        `${product.name} ${product.description} ${product.category} ${(product.colors || []).join(' ')} ${(product.sizes || []).join(' ')}`
      )
      // All words must match somewhere in the searchable text
      return queryWords.every((word) => searchableText.includes(word))
    })
  }, [products, searchQuery])

  const renderFilters = (onClose?: () => void) => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-[0.15em] mb-4">
          roupas
        </h3>
        <div className="flex flex-col gap-3 text-xs font-medium text-gray-500 uppercase tracking-widest">
          {['blusa', 'body', 'camisa e kimono', 'calça', 'conjunto', 'cropped', 'jaqueta, casaco e blazer', 'macacão'].map((sub) => (
            <Link 
              key={sub} 
              href={`/produtos?sub=${sub}`} 
              className="hover:text-[#ff9edb] transition-colors leading-none"
              onClick={() => onClose && onClose()}
            >
              {sub}
            </Link>
          ))}
        </div>
        <button className="border border-gray-300 text-[10px] font-bold tracking-widest text-gray-700 uppercase px-4 py-1.5 rounded-full hover:bg-gray-50 transition cursor-pointer mt-5">
          Ver Mais
        </button>
      </div>

      {/* Filtrar por */}
      <div className="border-t border-gray-100 pt-6">
        <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-[0.15em] mb-5">
          Filtrar por
        </h3>
        
        <div>
          <h4 className="font-medium text-xs text-gray-900 uppercase tracking-widest mb-3.5">Cor</h4>
          <div className="space-y-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
            {[
              { name: 'Preto', count: 128, colorClass: 'bg-black' },
              { name: 'Marrom', count: 110, colorClass: 'bg-[#8B4513]' },
              { name: 'Marsala', count: 4, colorClass: 'bg-[#722F37]' },
              { name: 'Bordô', count: 2, colorClass: 'bg-[#800020]' },
              { name: 'Amarelo', count: 6, colorClass: 'bg-yellow-400' },
              { name: 'Gelo', count: 1, colorClass: 'bg-[#e5e4e2] border border-gray-200' },
              { name: 'Caramelo', count: 2, colorClass: 'bg-[#c68e17]' },
              { name: 'Vinho', count: 2, colorClass: 'bg-[#58111a]' },
            ].map((item) => (
              <label key={item.name} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-gray-300 text-[#ff9edb] focus:ring-[#ff9edb] cursor-pointer" />
                <span className="group-hover:text-gray-900 transition-colors">
                  {item.name} <span className="text-gray-400 text-xs font-normal">({item.count})</span>
                </span>
                <div className={`w-3.5 h-3.5 rounded-full ${item.colorClass} ml-auto shadow-xs`} />
              </label>
            ))}
          </div>
          
          <button className="border border-gray-300 text-[10px] font-bold tracking-widest text-gray-700 uppercase px-4 py-1.5 rounded-full hover:bg-gray-50 transition cursor-pointer mt-5">
            Ver Todos
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <main className="min-h-screen flex flex-col bg-background">
        <Header />

      {/* Page Header */}
      <div className="bg-pink-50/40 py-12 border-b border-pink-100/50 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {searchQuery ? (
            <>
              <h1 className="text-3xl font-medium text-gray-900 uppercase tracking-[0.1em]">
                Resultados para &ldquo;{searchQuery}&rdquo;
              </h1>
              <p className="text-gray-500 mt-1 text-sm tracking-wide">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-medium text-gray-900 uppercase tracking-[0.1em]">Todos os Produtos</h1>
              <p className="text-gray-500 mt-1 text-sm tracking-wide">{"Navegue por nossa coleção completa de itens"}</p>
            </>
          )}
        </div>
      </div>

      {/* Filters and Products */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-6 py-12">
        {/* Mobile Title + Product Count Header */}
        <div className="flex justify-between items-end w-full mb-4 px-1 lg:hidden">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-400 font-bold tracking-widest uppercase">
              Início &gt; {searchQuery ? `Busca: "${searchQuery}"` : 'Todos os Produtos'}
            </span>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">
              {searchQuery ? `"${searchQuery}"` : 'Todos os Produtos'}
            </h1>
          </div>
          <span className="text-xs text-gray-500 font-bold tracking-wider whitespace-nowrap">{filteredProducts.length} produtos</span>
        </div>

        {/* Search active banner */}
        {searchQuery && (
          <div className="flex items-center gap-3 bg-pink-50/60 border border-pink-100 rounded-2xl px-5 py-3 mb-6">
            <span className="text-sm text-gray-600">
              Buscando por: <strong className="text-gray-900">&ldquo;{searchQuery}&rdquo;</strong>
            </span>
            <Link
              href="/produtos"
              className="ml-auto text-xs font-bold text-[#ff9edb] hover:text-[#ff80cb] uppercase tracking-wider transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Limpar busca
            </Link>
          </div>
        )}

        {/* Mobile Filter & Order Bar */}
        <div className="grid grid-cols-2 border border-gray-200 lg:hidden mb-8 text-sm bg-white divide-x divide-gray-200 rounded-sm">
          <button 
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex items-center justify-center gap-2 py-4 font-bold text-gray-800 uppercase tracking-widest text-[10px] hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-600 stroke-[2.5]" />
            Filtrar
          </button>
          
          <div className="relative flex items-center justify-center">
            <select 
              onChange={(e) => {
                const val = e.target.value
                toast.info(`Ordenado por: ${val}`)
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            >
              <option value="relevant">Mais vendidos</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="newest">Novidades</option>
            </select>
            <button className="w-full h-full flex flex-col items-center justify-center py-2.5 font-bold text-gray-800 uppercase tracking-wider text-[9px]">
              <span className="flex items-center gap-1 text-[9px] text-gray-400 font-semibold uppercase tracking-widest">
                <ArrowUpDown className="w-3 h-3 text-gray-400" /> Ordenar por:
              </span>
              <span className="text-[10px] font-extrabold text-gray-900 leading-tight">
                Mais vendidos
              </span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="space-y-8 sticky top-28">
              {renderFilters()}
            </div>
          </div>

          {/* Sidebar Filters - Mobile Drawer */}
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 z-[100] flex lg:hidden">
              {/* Overlay */}
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
                onClick={() => setIsMobileFiltersOpen(false)}
              />
              {/* Drawer Content */}
              <div className="relative flex w-full max-w-xs flex-col bg-white py-6 px-6 pb-12 shadow-2xl animate-in slide-in-from-left duration-300 overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#ff9edb]" />
                    Filtros
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full hover:bg-gray-100 text-gray-500"
                    onClick={() => setIsMobileFiltersOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                {renderFilters(() => setIsMobileFiltersOpen(false))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground hidden lg:block">
                Mostrando {filteredProducts.length} produtos
              </p>
              <select className="text-sm border rounded px-3 py-2 hidden lg:block">
                <option>Mais Relevantes</option>
                <option>Menor Preço</option>
                <option>Maior Preço</option>
                <option>Mais Vendidos</option>
                <option>Novidades</option>
              </select>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <SearchX className="w-16 h-16 text-gray-200 mb-4" />
                <h3 className="text-lg font-bold text-gray-700 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-sm text-gray-400 max-w-md mb-6">
                  Não encontramos resultados para &ldquo;{searchQuery}&rdquo;. Tente buscar com outras palavras ou navegue por nossas categorias.
                </p>
                <Link href="/produtos">
                  <Button className="bg-[#ff9edb] hover:bg-[#ff80cb] text-white rounded-full px-8">
                    Ver todos os produtos
                  </Button>
                </Link>
              </div>
            )}

            {/* Pagination - only show when not searching and has results */}
            {!searchQuery && filteredProducts.length > 0 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button variant="outline" disabled>
                  Anterior
                </Button>
                <Button variant="outline" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  1
                </Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Próxima</Button>
              </div>
            )}
          </div>
        </div>
      </div>

        <Footer />
      </main>
    </>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ff9edb]" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
