'use client'

import Link from 'next/link'
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

  const logoColor = isScrolled ? 'text-primary' : 'text-white'
  const textColor = isScrolled ? 'text-foreground' : 'text-white'
  const navColor = isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
  const bgColor = isScrolled
    ? 'bg-white border-b border-border shadow-md'
    : 'bg-transparent border-transparent'

  return (
    <header className={`fixed top-0 z-40 w-full transition-all duration-300 ${bgColor}`}>
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className={`text-2xl font-bold transition-colors ${logoColor}`}>
              Closet<span className={isScrolled ? 'text-secondary' : 'text-white'}>Twins</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/categorias/bolsas"
              className={`text-sm font-medium transition ${navColor}`}
            >
              Bolsas
            </Link>
            <Link
              href="/categorias/roupas"
              className={`text-sm font-medium transition ${navColor}`}
            >
              Roupas
            </Link>
            <Link
              href="/categorias/calcados"
              className={`text-sm font-medium transition ${navColor}`}
            >
              Calçados
            </Link>
            <Link
              href="/categorias/acessorios"
              className={`text-sm font-medium transition ${navColor}`}
            >
              Acessórios
            </Link>
            <Link
              href="/categorias/joias"
              className={`text-sm font-medium transition ${navColor}`}
            >
              Jóias
            </Link>
            <Link
              href="/categorias/maquiagem"
              className={`text-sm font-medium transition ${navColor}`}
            >
              Maquiagem
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Search */}
            <div
              className={`hidden lg:flex items-center rounded-full px-4 py-2 transition-colors ${
                isScrolled ? 'bg-muted' : 'bg-white/20'
              }`}
            >
              <Input
                type="text"
                placeholder="Buscar produtos..."
                className={`bg-transparent border-0 focus-visible:ring-0 text-sm ${
                  isScrolled
                    ? 'placeholder:text-muted-foreground'
                    : 'text-white placeholder:text-white/60'
                }`}
              />
              <Search className={`w-4 h-4 ${isScrolled ? 'text-muted-foreground' : 'text-white'}`} />
            </div>

            {/* User */}
            <Button
              variant="ghost"
              size="icon"
              className={isScrolled ? 'text-foreground' : 'text-white hover:bg-white/10'}
            >
              <User className="w-5 h-5" />
            </Button>

            {/* Cart */}
            <Link href="/carrinho">
              <Button
                variant="ghost"
                size="icon"
                className={`relative ${isScrolled ? 'text-foreground' : 'text-white hover:bg-white/10'}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden ${isScrolled ? 'text-foreground' : 'text-white hover:bg-white/10'}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav
            className={`md:hidden mt-4 space-y-2 border-t pt-4 ${
              isScrolled ? 'border-border text-foreground' : 'border-white/20 text-white'
            }`}
          >
            <Link
              href="/categorias/bolsas"
              className={`block py-2 text-sm font-medium ${navColor}`}
            >
              Bolsas
            </Link>
            <Link
              href="/categorias/roupas"
              className={`block py-2 text-sm font-medium ${navColor}`}
            >
              Roupas
            </Link>
            <Link
              href="/categorias/calcados"
              className={`block py-2 text-sm font-medium ${navColor}`}
            >
              Calçados
            </Link>
            <Link
              href="/categorias/acessorios"
              className={`block py-2 text-sm font-medium ${navColor}`}
            >
              Acessórios
            </Link>
            <Link
              href="/categorias/joias"
              className={`block py-2 text-sm font-medium ${navColor}`}
            >
              Jóias
            </Link>
            <Link
              href="/categorias/maquiagem"
              className={`block py-2 text-sm font-medium ${navColor}`}
            >
              Maquiagem
            </Link>
            <div className="pt-2">
              <div
                className={`flex items-center rounded-full px-4 py-2 transition-colors ${
                  isScrolled ? 'bg-muted' : 'bg-white/20'
                }`}
              >
                <Input
                  type="text"
                  placeholder="Buscar..."
                  className={`bg-transparent border-0 focus-visible:ring-0 text-sm ${
                    isScrolled
                      ? 'placeholder:text-muted-foreground'
                      : 'text-white placeholder:text-white/60'
                  }`}
                />
                <Search
                  className={`w-4 h-4 ${isScrolled ? 'text-muted-foreground' : 'text-white'}`}
                />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
