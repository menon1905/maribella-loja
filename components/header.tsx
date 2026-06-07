'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Search, ShoppingBag, Menu, X, User, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const ROUPA_SUBCATS = [
  { label: 'Todas', href: '/categorias/roupas' },
  { label: 'Blusa', href: '/categorias/roupas?sub=blusa' },
  { label: 'Body', href: '/categorias/roupas?sub=body' },
  { label: 'Camisa e Kimono', href: '/categorias/roupas?sub=camisa e kimono' },
  { label: 'Calça', href: '/categorias/roupas?sub=calça' },
  { label: 'Conjunto', href: '/categorias/roupas?sub=conjunto' },
  { label: 'Cropped', href: '/categorias/roupas?sub=cropped' },
  { label: 'Jaqueta, Casaco e Blazer', href: '/categorias/roupas?sub=jaqueta, casaco e blazer' },
  { label: 'Macacão', href: '/categorias/roupas?sub=macacão' },
  { label: 'Saia', href: '/categorias/roupas?sub=saia' },
  { label: 'Vestido', href: '/categorias/roupas?sub=vestido' },
  { label: 'Biquínis', href: '/categorias/roupas?sub=biquínis' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isRoupasOpen, setIsRoupasOpen] = useState(false)
  const [isMobileRoupasOpen, setIsMobileRoupasOpen] = useState(false)
  const roupasRef = useRef<HTMLDivElement>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartCount, setCartCount] = useState(0)

  const announcements = [
    "5% OFF na sua primeira compra • Use o cupom: BEMVINDAS",
    "Brindes em todas as compras",
    "Frete grátis em compras acima de R$ 200"
  ]
  const [announcementIndex, setAnnouncementIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Listen to cart changes in localStorage if client-side
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = localStorage.getItem('cart')
        if (cart) {
          const items = JSON.parse(cart)
          const total = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)
          setCartCount(total)
        }
      } catch (e) {
        console.error(e)
      }
    }

    updateCartCount()
    window.addEventListener('storage', updateCartCount)
    // Add custom event listener for in-app cart updates
    window.addEventListener('cart-updated', updateCartCount)
    
    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cart-updated', updateCartCount)
    }
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#ff9edb] shadow-md flex flex-col">
        {/* Top Announcement Bar */}
        <div className="bg-white text-gray-900 py-2 text-center text-[10px] md:text-xs font-semibold tracking-wider h-9 overflow-hidden flex items-center justify-center relative border-b border-[#ff9edb]/20">
          <div className="transition-all duration-500 ease-in-out transform uppercase tracking-widest text-[#ff9edb] px-4">
            {announcements[announcementIndex]}
          </div>
        </div>

        {/* Main Header Area */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 h-[80px] md:h-[100px] flex items-center justify-between relative">
          
          {/* Left Side: Menu & Search Icons */}
          <div className="flex items-center gap-1 md:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-900 hover:bg-white/30 rounded-full h-11 w-11 flex items-center justify-center cursor-pointer"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6 stroke-[2]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-900 hover:bg-white/30 rounded-full h-11 w-11 flex items-center justify-center cursor-pointer"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Buscar produtos"
            >
              <Search className="w-5.5 h-5.5 stroke-[2]" />
            </Button>
          </div>

          {/* Center: Logo Image */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <Link href="/" className="flex items-center justify-center select-none h-16 w-24 md:h-20 md:w-32 relative">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain scale-[1.5] md:scale-[1.7] transform hover:scale-[1.6] md:hover:scale-[1.8] transition-transform duration-300"
                priority
              />
            </Link>
          </div>

          {/* Right Side: User & Cart Icons */}
          <div className="flex items-center gap-1 md:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-900 hover:bg-white/30 rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
              aria-label="Perfil do usuário"
            >
              <User className="w-5.5 h-5.5 stroke-[2]" />
            </Button>
            
            <Link href="/carrinho" className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-900 hover:bg-white/30 rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
                aria-label="Ver carrinho"
              >
                <ShoppingBag className="w-5.5 h-5.5 stroke-[2]" />
                <span className="absolute top-0.5 right-0.5 bg-gray-900 text-white text-[9px] font-extrabold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              </Button>
            </Link>
          </div>

        </div>

        {/* Desktop Categories Bar */}
        <div className="hidden md:flex border-t border-gray-900/10 w-full">
          <nav className="max-w-5xl mx-auto w-full flex items-center justify-center gap-8 lg:gap-12 py-3.5">
            <Link href="/" className="text-sm font-bold text-gray-900 hover:text-gray-600 transition-colors uppercase tracking-widest">
              Início
            </Link>

            {/* Roupas with dropdown */}
            <div
              ref={roupasRef}
              className="relative"
              onMouseEnter={() => setIsRoupasOpen(true)}
              onMouseLeave={() => setIsRoupasOpen(false)}
            >
              <button
                className="flex items-center gap-1 text-sm font-bold text-gray-900 hover:text-gray-600 transition-colors uppercase tracking-widest cursor-pointer"
                onClick={() => setIsRoupasOpen(v => !v)}
              >
                Roupas
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isRoupasOpen ? 'rotate-180' : ''}`} />
              </button>

              {isRoupasOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-[200] w-72">
                  {/* Invisible bridge — fills the gap so mouse doesn't trigger onMouseLeave */}
                  <div className="absolute top-0 left-0 right-0 h-3" />
                  <div className="bg-white border border-pink-100 rounded-2xl shadow-[0_20px_60px_-10px_rgba(255,158,219,0.35)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">

                  {/* Pink header */}
                  <Link
                    href="/categorias/roupas"
                    onClick={() => setIsRoupasOpen(false)}
                    className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#ff9edb] to-[#ffb5e4] text-white group"
                  >
                    <span className="text-xs font-extrabold uppercase tracking-[0.15em]">Ver Todas as Roupas</span>
                    <span className="text-white/80 group-hover:translate-x-0.5 transition-transform text-sm">→</span>
                  </Link>

                  {/* 2-column subcategory grid */}
                  <div className="grid grid-cols-2 gap-px bg-pink-50/50 p-3">
                    {ROUPA_SUBCATS.filter(s => s.label !== 'Todas').map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setIsRoupasOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-semibold text-gray-600 uppercase tracking-wider hover:bg-pink-50 hover:text-[#ff9edb] transition-all duration-150 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-200 group-hover:bg-[#ff9edb] transition-colors flex-shrink-0" />
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                  </div>{/* end white card */}
                </div>
              )}
            </div>

            <Link href="/categorias/bolsas" className="text-sm font-bold text-gray-900 hover:text-gray-600 transition-colors uppercase tracking-widest">
              Bolsas
            </Link>
            <Link href="/categorias/calcados" className="text-sm font-bold text-gray-900 hover:text-gray-600 transition-colors uppercase tracking-widest">
              Calçados
            </Link>
            <Link href="/categorias/joias" className="text-sm font-bold text-gray-900 hover:text-gray-600 transition-colors uppercase tracking-widest">
              Jóias
            </Link>
          </nav>
        </div>

        {/* Expandable Search Input Bar */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 px-4 py-3 shadow-md animate-in slide-in-from-top duration-200">
            <form action="/produtos" method="GET" className="max-w-3xl mx-auto flex gap-2">
              <Input
                name="q"
                type="text"
                placeholder="O que você está procurando hoje?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 rounded-full border-gray-200 focus-visible:ring-[#ff9edb]"
                autoFocus
              />
              <Button type="submit" className="bg-[#ff9edb] hover:bg-[#ff80cb] text-white rounded-full px-6">
                Buscar
              </Button>
            </form>
          </div>
        )}
      </header>

      {/* Sidebar Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Drawer Content */}
          <div className="relative flex w-full max-w-xs flex-col bg-white py-4 pb-12 shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between px-5 pb-4 border-b border-gray-100">
              <div className="flex flex-col items-start justify-center h-12 w-24 relative overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain scale-[1.5]"
                  priority
                />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-gray-100 text-gray-500"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            
            <div className="mt-4 px-4">
              <form action="/produtos" method="GET" className="relative">
                <Input
                  name="q"
                  type="text"
                  placeholder="Buscar no site..."
                  className="w-full rounded-full border-gray-200 pr-10 focus-visible:ring-[#ff9edb]"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
              <Link
                href="/"
                className="flex items-center rounded-lg px-4 py-3 text-base font-semibold text-gray-700 hover:bg-[#ff9edb]/10 hover:text-[#ff9edb] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>

              {/* Roupas accordion */}
              <div>
                <button
                  onClick={() => setIsMobileRoupasOpen(v => !v)}
                  className="w-full flex items-center justify-between rounded-lg px-4 py-3 text-base font-semibold text-gray-700 hover:bg-[#ff9edb]/10 hover:text-[#ff9edb] transition-colors cursor-pointer"
                >
                  Roupas
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileRoupasOpen ? 'rotate-180 text-[#ff9edb]' : ''}`} />
                </button>
                {isMobileRoupasOpen && (
                  <div className="ml-4 border-l-2 border-pink-100 pl-3 pb-1 flex flex-col gap-0.5">
                    {ROUPA_SUBCATS.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          sub.label === 'Todas'
                            ? 'text-[#ff9edb] font-bold'
                            : 'text-gray-500 hover:text-[#ff9edb] hover:bg-pink-50'
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {[
                { name: 'Bolsas', href: '/categorias/bolsas' },
                { name: 'Calçados', href: '/categorias/calcados' },
                { name: 'Jóias', href: '/categorias/joias' },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center rounded-lg px-4 py-3 text-base font-semibold text-gray-700 hover:bg-[#ff9edb]/10 hover:text-[#ff9edb] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            <div className="px-5 border-t border-gray-100 pt-4 text-xs text-gray-400 text-center">
              © {new Date().getFullYear()} Maribella. Todos os direitos reservados.
            </div>
          </div>
        </div>
      )}
    </>
  )
}
