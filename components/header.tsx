'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed top-0 z-40 w-full bg-primary border-b border-primary shadow-md">
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 md:py-6">
        <div className="flex items-center justify-between gap-6 md:gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 h-12">
            <Image
              src="/logo.png"
              alt="Closet Twins"
              width={150}
              height={60}
              className="h-full w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/categorias/bolsas" className="text-sm font-medium text-white hover:text-white/80 transition">
              Bolsas
            </Link>
            <Link href="/categorias/roupas" className="text-sm font-medium text-white hover:text-white/80 transition">
              Roupas
            </Link>
            <Link href="/categorias/calcados" className="text-sm font-medium text-white hover:text-white/80 transition">
              Calçados
            </Link>
            <Link href="/categorias/acessorios" className="text-sm font-medium text-white hover:text-white/80 transition">
              Acessórios
            </Link>
            <Link href="/categorias/joias" className="text-sm font-medium text-white hover:text-white/80 transition">
              Jóias
            </Link>
            <Link href="/categorias/maquiagem" className="text-sm font-medium text-white hover:text-white/80 transition">
              Maquiagem
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-5 md:gap-6 ml-auto">
            {/* Search */}
            <div className="hidden lg:flex items-center rounded-full px-5 py-3 bg-white/20">
              <Input
                type="text"
                placeholder="Buscar produtos..."
                className="bg-transparent border-0 focus-visible:ring-0 text-sm text-white placeholder:text-white/60"
              />
              <Search className="w-4 h-4 text-white" />
            </div>

            {/* User */}
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <User className="w-5 h-5" />
            </Button>

            {/* Cart */}
            <Link href="/carrinho">
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2 border-t border-white/20 pt-4 text-white">
            <Link href="/categorias/bolsas" className="block py-2 text-sm font-medium hover:text-white/80">
              Bolsas
            </Link>
            <Link href="/categorias/roupas" className="block py-2 text-sm font-medium hover:text-white/80">
              Roupas
            </Link>
            <Link href="/categorias/calcados" className="block py-2 text-sm font-medium hover:text-white/80">
              Calçados
            </Link>
            <Link href="/categorias/acessorios" className="block py-2 text-sm font-medium hover:text-white/80">
              Acessórios
            </Link>
            <Link href="/categorias/joias" className="block py-2 text-sm font-medium hover:text-white/80">
              Jóias
            </Link>
            <Link href="/categorias/maquiagem" className="block py-2 text-sm font-medium hover:text-white/80">
              Maquiagem
            </Link>
            <div className="pt-4 mt-4 border-t border-white/20">
              <div className="flex items-center rounded-full px-5 py-3 bg-white/20">
                <Input
                  type="text"
                  placeholder="Buscar..."
                  className="bg-transparent border-0 focus-visible:ring-0 text-sm text-white placeholder:text-white/60"
                />
                <Search className="w-4 h-4 text-white" />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
