'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Search, ShoppingBag, Menu, X, User, ChevronDown, LogOut, ShieldCheck, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase, getUserRole } from '@/lib/supabase'
import { useProducts } from '@/components/products-context'

const ROUPA_SUBCATS = [
  { label: 'Todas', href: '/categorias/roupas' },
  { label: 'Blusas e Jaquetas', href: '/categorias/roupas?sub=blusas e jaquetas' },
  { label: 'Camisas e Croppeds', href: '/categorias/roupas?sub=camisas e croppeds' },
  { label: 'Bodys', href: '/categorias/roupas?sub=bodys' },
  { label: 'Calças', href: '/categorias/roupas?sub=calças' },
  { label: 'Shorts', href: '/categorias/roupas?sub=shorts' },
  { label: 'Saias', href: '/categorias/roupas?sub=saias' },
  { label: 'Conjuntos', href: '/categorias/roupas?sub=conjuntos' },
  { label: 'Macacões', href: '/categorias/roupas?sub=macacões' },
  { label: 'Vestidos', href: '/categorias/roupas?sub=vestidos' },
  { label: 'Biquínis', href: '/categorias/roupas?sub=biquínis' },
]

export function Header() {
  const { products } = useProducts()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isRoupasOpen, setIsRoupasOpen] = useState(false)
  const [isMobileRoupasOpen, setIsMobileRoupasOpen] = useState(false)
  const roupasRef = useRef<HTMLDivElement>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const announcements = [
    "5% OFF na sua primeira compra • Use o cupom: BEMVINDAS",
    "Brindes em todas as compras",
    "Frete grátis acima de R$ 400 somente para Campinas"
  ]
  const [announcementIndex, setAnnouncementIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Auth state
  // Inicializa com cache do localStorage para evitar flash com categorias erradas
  const getCachedCategories = () => {
    if (typeof window === 'undefined') return []
    try {
      const cached = localStorage.getItem('maribella_nav_categories')
      return cached ? JSON.parse(cached) : []
    } catch { return [] }
  }
  const [dbCategories, setDbCategories] = useState<any[]>(getCachedCategories)

  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email) {
        setUserEmail(session.user.email)
        const role = await getUserRole(session.user.id)
        setIsAdmin(role === 'admin')
      }
    }
    loadSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email)
        const role = await getUserRole(session.user.id)
        setIsAdmin(role === 'admin')
      } else {
        setUserEmail(null)
        setIsAdmin(false)
      }
    })

    // Fetch dynamic categories
    const fetchCats = async () => {
      try {
        const { data } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true })
        if (data && data.length > 0) {
          setDbCategories(data)
          localStorage.setItem('maribella_nav_categories', JSON.stringify(data))
        } else if (data) {
          // Banco respondeu mas está vazio — limpa o cache e o estado
          setDbCategories([])
          localStorage.removeItem('maribella_nav_categories')
        }
      } catch (err) {
        console.warn('Erro ao carregar categorias dinâmicas no Header:', err)
      }
    }
    fetchCats()

    return () => subscription.unsubscribe()
  }, [])

  // Close user dropdown and search suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false)
      }
      
      const target = e.target as HTMLElement
      if (!target.closest('.search-container')) {
        setSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('user_email')
    setUserEmail(null)
    setIsAdmin(false)
    setIsUserMenuOpen(false)
  }

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

  // Listen to favorites changes in localStorage
  useEffect(() => {
    const updateFavoritesCount = () => {
      try {
        const favs = localStorage.getItem('maribella_favorites')
        if (favs) {
          const ids: string[] = JSON.parse(favs)
          if (products.length > 0) {
            // Validate IDs against real products and clean stale ones
            const validIds = ids.filter(id => products.some(p => p.id === id))
            if (validIds.length !== ids.length) {
              localStorage.setItem('maribella_favorites', JSON.stringify(validIds))
            }
            setFavoritesCount(validIds.length)
          } else {
            // Products not loaded yet — don't show badge to avoid phantom count
            setFavoritesCount(0)
          }
        } else {
          setFavoritesCount(0)
        }
      } catch (e) {
        console.error(e)
      }
    }

    updateFavoritesCount()
    window.addEventListener('storage', updateFavoritesCount)
    window.addEventListener('favorites-updated', updateFavoritesCount)

    return () => {
      window.removeEventListener('storage', updateFavoritesCount)
      window.removeEventListener('favorites-updated', updateFavoritesCount)
    }
  }, [products])

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
              className="text-gray-900 hover:bg-white/15 rounded-full h-11 w-11 flex items-center justify-center cursor-pointer"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6 stroke-[2]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-gray-900 hover:bg-white/15 rounded-full h-11 w-11 items-center justify-center cursor-pointer"
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
            
            {/* User Menu */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => userEmail ? setIsUserMenuOpen(v => !v) : null}
                className="text-gray-900 hover:bg-white/15 rounded-full h-10 w-10 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Perfil do usuário"
              >
                {userEmail ? (
                  <div className="w-8 h-8 rounded-full bg-[#d672a9] text-white flex items-center justify-center text-xs font-bold border border-white/20 shadow-sm">
                    {userEmail[0].toUpperCase()}
                  </div>
                ) : (
                  <Link href="/login">
                    <User className="w-5.5 h-5.5 stroke-[2]" />
                  </Link>
                )}
              </button>

              {/* Dropdown */}
              {isUserMenuOpen && userEmail && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-[200] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-slate-50">
                    <p className="text-xs font-bold text-gray-900 truncate">{userEmail}</p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded mt-1">
                        <ShieldCheck className="w-3 h-3" /> Admin
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <Link
                      href="/conta"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-pink-50 hover:text-primary transition-colors"
                    >
                      <Heart className="w-4 h-4" /> Minha Conta
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-pink-50 hover:text-primary transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" /> Painel Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Sair da Conta
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link href="/conta" className="relative hidden md:block">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-900 hover:bg-white/15 rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
                aria-label="Ver favoritos"
              >
                <Heart className="w-5.5 h-5.5 stroke-[2]" />
                {favoritesCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-primary text-white text-[9px] font-extrabold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-sm">
                    {favoritesCount}
                  </span>
                )}
              </Button>
            </Link>
            
            <Link href="/carrinho" className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-900 hover:bg-white/15 rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
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

            {/* Special Roupas Dropdown if exists */}
            {dbCategories.some(c => c.slug === 'roupas') && (
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
                    <div className="absolute top-0 left-0 right-0 h-3" />
                    <div className="bg-white border border-pink-100 rounded-2xl shadow-[0_20px_60px_-10px_rgba(255,158,219,0.35)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link
                        href="/categorias/roupas"
                        onClick={() => setIsRoupasOpen(false)}
                        className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#ff9edb] to-[#ffb5e4] text-white group"
                      >
                        <span className="text-xs font-extrabold uppercase tracking-[0.15em]">Ver Todas as Roupas</span>
                        <span className="text-white/80 group-hover:translate-x-0.5 transition-transform text-sm">→</span>
                      </Link>

                      <div className="grid grid-cols-2 gap-px bg-pink-50/50 p-3">
                        {dbCategories
                          .filter((c) => c.parent_slug === 'roupas')
                          .map((sub) => (
                            <Link
                              key={sub.slug}
                              href={`/categorias/roupas?sub=${encodeURIComponent(sub.name.toLowerCase())}`}
                              onClick={() => setIsRoupasOpen(false)}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-semibold text-gray-600 uppercase tracking-wider hover:bg-pink-50 hover:text-[#ff9edb] transition-all duration-150 group"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-pink-200 group-hover:bg-[#ff9edb] transition-colors flex-shrink-0" />
                              {sub.name}
                            </Link>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Other Main Categories from DB */}
            {dbCategories
              .filter((c) => !c.parent_slug && c.slug !== 'roupas')
              .map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categorias/${cat.slug}`}
                  className="text-sm font-bold text-gray-900 hover:text-gray-600 transition-colors uppercase tracking-widest"
                >
                  {cat.name}
                </Link>
              ))}
          </nav>
        </div>

        {/* Expandable Search Input Bar */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 px-4 py-3 shadow-md animate-in slide-in-from-top duration-200 z-[250]">
            <div className="max-w-3xl mx-auto relative search-container">
              <form action="/produtos" method="GET" className="flex gap-2">
                <Input
                  name="q"
                  type="text"
                  placeholder="O que você está procurando hoje?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 rounded-full border-gray-200 focus-visible:ring-[#ff9edb]"
                  autoFocus
                  autoComplete="off"
                />
                <Button type="submit" className="bg-[#ff9edb] hover:bg-[#ff80cb] text-white rounded-full px-6">
                  Buscar
                </Button>
              </form>

              {/* Suggestions Dropdown */}
              {searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-100 mt-2 rounded-2xl shadow-xl z-[300] overflow-hidden max-h-96 overflow-y-auto animate-in fade-in-50 duration-150">
                  <div className="p-3 bg-pink-50/30 border-b border-pink-100/50 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Sugestões de Produtos</span>
                    <span className="text-[10px] font-semibold text-[#ff9edb]">
                      {(() => {
                        const q = searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                        const filtered = products.filter(p => 
                          p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q) ||
                          p.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q)
                        );
                        return `${filtered.length} encontrados`;
                      })()}
                    </span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {(() => {
                      const q = searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                      const filtered = products.filter(p => 
                        p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q) ||
                        p.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q)
                      ).slice(0, 5); // Limit to 5 results for clarity

                      if (filtered.length === 0) {
                        return (
                          <div className="p-6 text-center text-sm text-gray-400">
                            Nenhum produto encontrado para &ldquo;{searchQuery}&rdquo;
                          </div>
                        );
                      }

                      return filtered.map((product) => (
                        <Link
                          key={product.id}
                          href={`/produto/${product.id}`}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-pink-50/30 transition-colors group"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-[#ff9edb] transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                              {product.category}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-sm font-black text-gray-900">
                              R$ {product.price.toFixed(2)}
                            </span>
                            {product.originalPrice && (
                              <p className="text-[10px] text-gray-400 line-through">
                                R$ {product.originalPrice.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </Link>
                      ));
                    })()}
                  </div>
                  <div className="p-2.5 bg-slate-50 border-t border-gray-100 text-center">
                    <Link
                      href={`/produtos?q=${encodeURIComponent(searchQuery)}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="text-[11px] font-bold text-[#ff9edb] hover:text-[#ff80cb] uppercase tracking-wider transition-colors inline-block w-full"
                    >
                      Ver todos os resultados
                    </Link>
                  </div>
                </div>
              )}
            </div>
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

              <Link
                href="/conta"
                className="flex items-center rounded-lg px-4 py-3 text-base font-semibold text-gray-700 hover:bg-[#ff9edb]/10 hover:text-[#ff9edb] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Minha Conta
              </Link>

              <Link
                href="/conta"
                className="flex items-center justify-between rounded-lg px-4 py-3 text-base font-semibold text-gray-700 hover:bg-[#ff9edb]/10 hover:text-[#ff9edb] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Meus Favoritos</span>
                {favoritesCount > 0 && (
                  <span className="bg-[#ff9edb] text-white text-[10px] font-extrabold rounded-full px-2 py-0.5">
                    {favoritesCount}
                  </span>
                )}
              </Link>

              {/* Roupas accordion (mobile) */}
              {dbCategories.some(c => c.slug === 'roupas') && (
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
                      <Link
                        href="/categorias/roupas"
                        onClick={() => setIsMenuOpen(false)}
                        className="block rounded-md px-3 py-2 text-sm font-bold text-[#ff9edb]"
                      >
                        Todas as Roupas
                      </Link>
                      {dbCategories
                        .filter(c => c.parent_slug === 'roupas')
                        .map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/categorias/roupas?sub=${encodeURIComponent(sub.name.toLowerCase())}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="block rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-[#ff9edb] hover:bg-pink-50"
                          >
                            {sub.name}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Other categories (mobile) */}
              {dbCategories
                .filter(c => !c.parent_slug && c.slug !== 'roupas')
                .map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/categorias/${cat.slug}`}
                    className="flex items-center rounded-lg px-4 py-3 text-base font-semibold text-gray-700 hover:bg-[#ff9edb]/10 hover:text-[#ff9edb] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {cat.name}
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
