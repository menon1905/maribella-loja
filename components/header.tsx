'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-border">
      {/* Top banner */}
      <div className="bg-primary text-primary-foreground py-2 text-center text-sm font-medium">
        Frete grátis em compras acima de R$ 150 🎁
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="text-2xl font-bold text-primary">
              Closet<span className="text-secondary">Twins</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/categorias/bolsas" className="text-sm font-medium hover:text-primary transition">
              Bolsas
            </Link>
            <Link href="/categorias/roupas" className="text-sm font-medium hover:text-primary transition">
              Roupas
            </Link>
            <Link href="/categorias/calcados" className="text-sm font-medium hover:text-primary transition">
              Calçados
            </Link>
            <Link href="/categorias/acessorios" className="text-sm font-medium hover:text-primary transition">
              Acessórios
            </Link>
            <Link href="/categorias/joias" className="text-sm font-medium hover:text-primary transition">
              Jóias
            </Link>
            <Link href="/categorias/maquiagem" className="text-sm font-medium hover:text-primary transition">
              Maquiagem
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Search */}
            <div className="hidden lg:flex items-center bg-muted rounded-full px-4 py-2">
              <Input
                type="text"
                placeholder="Buscar produtos..."
                className="bg-transparent border-0 focus-visible:ring-0 text-sm"
              />
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* User */}
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>

            {/* Cart */}
            <Link href="/carrinho">
              <Button variant="ghost" size="icon" className="relative">
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
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2 border-t pt-4">
            <Link
              href="/categorias/bolsas"
              className="block py-2 text-sm font-medium hover:text-primary"
            >
              Bolsas
            </Link>
            <Link
              href="/categorias/roupas"
              className="block py-2 text-sm font-medium hover:text-primary"
            >
              Roupas
            </Link>
            <Link
              href="/categorias/calcados"
              className="block py-2 text-sm font-medium hover:text-primary"
            >
              Calçados
            </Link>
            <Link
              href="/categorias/acessorios"
              className="block py-2 text-sm font-medium hover:text-primary"
            >
              Acessórios
            </Link>
            <Link
              href="/categorias/joias"
              className="block py-2 text-sm font-medium hover:text-primary"
            >
              Jóias
            </Link>
            <Link
              href="/categorias/maquiagem"
              className="block py-2 text-sm font-medium hover:text-primary"
            >
              Maquiagem
            </Link>
            <div className="pt-2">
              <div className="flex items-center bg-muted rounded-full px-4 py-2">
                <Input
                  type="text"
                  placeholder="Buscar..."
                  className="bg-transparent border-0 focus-visible:ring-0 text-sm"
                />
                <Search className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
