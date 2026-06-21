'use client'

import { useState } from 'react'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { useProducts } from '@/components/products-context'
import { Category, Product } from '@/lib/mock-data'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'

interface CategoryContentProps {
  slug: string
  category: Category
}

const SORT_OPTIONS = [
  { label: 'Mais Relevantes', value: 'relevance' },
  { label: 'Menor Preço', value: 'price-asc' },
  { label: 'Maior Preço', value: 'price-desc' },
  { label: 'Novidades', value: 'new' },
]

export function CategoryContent({ slug, category }: CategoryContentProps) {
  const { products } = useProducts()
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [sortValue, setSortValue] = useState('relevance')
  const [selectedColors, setSelectedColors] = useState<string[]>([])

  const searchParams = useSearchParams()
  const sub = searchParams.get('sub')
  const filter = searchParams.get('filter')

  const handleColorToggle = (colorName: string) => {
    setSelectedColors(prev =>
      prev.includes(colorName)
        ? prev.filter(c => c !== colorName)
        : [...prev, colorName]
    )
  }

  const matchSubcategory = (product: Product, subParam: string): boolean => {
    const name = product.name.toLowerCase()
    const desc = product.description?.toLowerCase() || ''
    const s = subParam.toLowerCase()

    if (s === 'todas') return true
    if (s === 'blusas e jaquetas') {
      return name.includes('blusa') || name.includes('jaqueta') || name.includes('blazer') || name.includes('casaco') || desc.includes('blusa') || desc.includes('jaqueta')
    }
    if (s === 'camisas e croppeds') {
      return name.includes('camisa') || name.includes('cropped') || name.includes('camiseta') || name.includes('t-shirt')
    }
    if (s === 'bodys') {
      return name.includes('body')
    }
    if (s === 'calças') {
      return name.includes('calça') || name.includes('pants')
    }
    if (s === 'shorts') {
      return name.includes('short')
    }
    if (s === 'saias') {
      return name.includes('saia')
    }
    if (s === 'conjuntos') {
      return name.includes('conjunto')
    }
    if (s === 'macacões') {
      return name.includes('macacão') || name.includes('macacao') || name.includes('jumpsuit')
    }
    if (s === 'vestidos') {
      return name.includes('vestido')
    }
    if (s === 'biquínis') {
      return name.includes('biquíni') || name.includes('biquini') || name.includes('biquinis') || name.includes('biquínis')
    }
    return name.includes(s) || desc.includes(s)
  }

  // Filter category products
  let filteredProducts = products.filter(p => p.category === slug)

  // Filter by subcategory
  if (sub && sub !== 'todas') {
    filteredProducts = filteredProducts.filter(p => matchSubcategory(p, sub))
  }

  // Filter by quick filter
  if (filter) {
    if (filter === 'novidades') {
      filteredProducts = filteredProducts.filter(p => p.isNew)
    } else if (filter === 'mais vendidos') {
      filteredProducts = filteredProducts.filter(p => p.rating >= 4.7)
    } else if (filter === 'promoções') {
      filteredProducts = filteredProducts.filter(p => p.originalPrice && p.originalPrice > p.price)
    } else if (filter === 'exclusivos') {
      filteredProducts = filteredProducts.filter(p => p.isFeatured)
    }
  }

  // Filter by selected colors
  if (selectedColors.length > 0) {
    filteredProducts = filteredProducts.filter(p =>
      p.colors?.some(c => selectedColors.some(sc => c.toLowerCase() === sc.toLowerCase()))
    )
  }

  const sorted = [...filteredProducts].sort((a, b) => {
    if (sortValue === 'price-asc') return a.price - b.price
    if (sortValue === 'price-desc') return b.price - a.price
    if (sortValue === 'new') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
    return 0
  })

  const currentSort = SORT_OPTIONS.find(o => o.value === sortValue)!

  const renderFilters = (onClose?: () => void) => (
    <div className="space-y-8">
      {/* Category sub-navigation */}
      <div>
        <h3 className="font-semibold text-lg text-gray-900 uppercase tracking-wider mb-4">
          {category.name}
        </h3>
        <div className="flex flex-col gap-3 text-xs font-medium text-gray-500 uppercase tracking-widest">
          {category.slug === 'roupas' ? (
            ['todas', 'blusas e jaquetas', 'camisas e croppeds', 'bodys', 'calças', 'shorts', 'saias', 'conjuntos', 'macacões', 'vestidos', 'biquínis'].map((sub) => (
              <Link
                key={sub}
                href={`/categorias/roupas?sub=${sub}`}
                className="hover:text-[#ff9edb] transition-colors leading-none"
                onClick={() => onClose && onClose()}
              >
                {sub}
              </Link>
            ))
          ) : (
            ['novidades', 'mais vendidos', 'promoções', 'exclusivos'].map((sub) => (
              <Link
                key={sub}
                href={`/categorias/${category.slug}?filter=${sub}`}
                className="hover:text-[#ff9edb] transition-colors leading-none lowercase"
                onClick={() => onClose && onClose()}
              >
                {sub}
              </Link>
            ))
          )}
        </div>
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
                <input
                  type="checkbox"
                  checked={selectedColors.includes(item.name)}
                  onChange={() => handleColorToggle(item.name)}
                  className="rounded border-gray-300 text-[#ff9edb] focus:ring-[#ff9edb] cursor-pointer"
                />
                <span className="group-hover:text-gray-900 transition-colors">
                  {item.name} <span className="text-gray-400 text-[10px] font-normal">({item.count})</span>
                </span>
                <div className={`w-3.5 h-3.5 rounded-full ${item.colorClass} ml-auto shadow-xs`} />
              </label>
            ))}
          </div>

          <div className="flex gap-2 mt-5">
            <button className="border border-gray-300 text-[10px] font-bold tracking-widest text-gray-700 uppercase px-4 py-1.5 rounded-full hover:bg-gray-50 transition cursor-pointer">
              Ver Todos
            </button>
            {selectedColors.length > 0 && (
              <button
                onClick={() => setSelectedColors([])}
                className="border border-red-200 text-red-500 hover:bg-red-50 text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full transition cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-6 py-6 md:py-12">

      {/* ── Mobile top bar: count + filter + sort ── */}
      <div className="flex lg:hidden items-center justify-between w-full mb-4 gap-2">
        <p className="text-xs text-gray-400 font-medium">
          {sorted.length} produtos
        </p>

        <div className="flex items-center gap-2">
          {/* Sort dropdown (mobile) */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(v => !v)}
              className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3.5 py-2 text-[11px] font-semibold text-gray-700 bg-white hover:border-[#ff9edb] transition"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              {currentSort.label}
            </button>
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl z-50 min-w-[170px] overflow-hidden">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortValue(opt.value); setIsSortOpen(false) }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-medium transition ${sortValue === opt.value ? 'bg-pink-50 text-[#ff9edb]' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter button (mobile) */}
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex items-center gap-1.5 bg-[#ff9edb] hover:bg-[#ff80cb] text-white rounded-full px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider transition cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filtrar
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

        {/* Products Grid — always visible */}
        <div className="flex-1">
          {/* Desktop sort bar */}
          <div className="hidden lg:flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <p className="text-sm text-gray-500 font-medium">
              {sorted.length} produto{sorted.length !== 1 ? 's' : ''}
            </p>
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(v => !v)}
                className="flex items-center gap-1.5 border border-gray-200 rounded-full px-4 py-2 text-xs font-semibold text-gray-700 bg-white hover:border-[#ff9edb] transition"
              >
                <ChevronDown className="w-3.5 h-3.5" />
                {currentSort.label}
              </button>
              {isSortOpen && (
                <div className="absolute right-0 top-full mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl z-50 min-w-[170px] overflow-hidden">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortValue(opt.value); setIsSortOpen(false) }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition ${sortValue === opt.value ? 'bg-pink-50 text-[#ff9edb]' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {sorted.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {sorted.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum produto encontrado nesta categoria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
