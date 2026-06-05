'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PromoTicker } from '@/components/promo-ticker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Plus, Minus } from 'lucide-react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  size?: string
  color?: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

  useEffect(() => {
    try {
      const cart = localStorage.getItem('maribella_cart') || localStorage.getItem('cart')
      if (cart) {
        setCartItems(JSON.parse(cart))
      }
      const storedCoupon = localStorage.getItem('applied_coupon')
      if (storedCoupon) {
        setAppliedCoupon(storedCoupon)
        setCoupon(storedCoupon)
      }
    } catch (e) {
      console.error(e)
    }
    setIsLoaded(true)
  }, [])

  const saveCart = (newItems: CartItem[]) => {
    setCartItems(newItems)
    localStorage.setItem('cart', JSON.stringify(newItems))
    localStorage.setItem('maribella_cart', JSON.stringify(newItems))
    window.dispatchEvent(new Event('cart-updated'))
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
    } else {
      const updated = cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
      saveCart(updated)
    }
  }

  const removeItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id)
    saveCart(updated)
    toast.success('Produto removido do carrinho.')
  }

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'BEMVINDAS') {
      setAppliedCoupon('BEMVINDAS')
      localStorage.setItem('applied_coupon', 'BEMVINDAS')
      toast.success('Cupom BEMVINDAS aplicado! 5% de desconto.')
    } else {
      toast.error('Cupom inválido. Tente BEMVINDAS.')
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCoupon('')
    localStorage.removeItem('applied_coupon')
    toast.info('Cupom removido.')
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = appliedCoupon === 'BEMVINDAS' ? subtotal * 0.05 : 0
  const shipping = subtotal > 0 && (subtotal - discount) > 200 ? 0 : (subtotal === 0 ? 0 : 15)
  const total = subtotal - discount + shipping

  return (
    <>
      <PromoTicker />
      <section className="min-h-screen flex flex-col bg-background">
        <Header />

      {/* Page Title */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-8 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Seu Carrinho</h1>
        </div>
      </div>

      {/* Cart Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        {!isLoaded ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground animate-pulse">Carregando seu carrinho...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl font-semibold mb-4">Seu carrinho está vazio</p>
            <p className="text-muted-foreground mb-8">Comece a comprar e preencha seu carrinho com seus produtos favoritos!</p>
            <Link href="/produtos">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Continuar Comprando
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          {item.color && <span>{item.color}</span>}
                          {item.color && item.size && <span> • </span>}
                          {item.size && <span>Tamanho: {item.size}</span>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border rounded w-fit">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-muted transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-muted transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="font-semibold text-primary text-lg">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 space-y-6 sticky top-20">
                <h2 className="text-xl font-bold">Resumo do Pedido</h2>

                {/* Coupon */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cupom de Desconto</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite o cupom"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="text-sm"
                      disabled={!!appliedCoupon}
                    />
                    {appliedCoupon ? (
                      <Button variant="outline" className="px-4 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer" onClick={handleRemoveCoupon}>
                        Remover
                      </Button>
                    ) : (
                      <Button variant="outline" className="px-4 cursor-pointer" onClick={handleApplyCoupon}>
                        Aplicar
                      </Button>
                    )}
                  </div>
                  {appliedCoupon && (
                    <p className="text-xs text-green-600 font-semibold">
                      ✓ Cupom ativo: 5% de desconto aplicado!
                    </p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Desconto (BEMVINDAS 5% OFF)</span>
                      <span>- R$ {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Frete {shipping === 0 && subtotal > 0 && '(Grátis)'}
                    </span>
                    <span className={shipping === 0 && subtotal > 0 ? 'text-green-600 font-medium' : ''}>
                      {shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-3">
                    <span>Total</span>
                    <span className="text-primary">R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Info */}
                {shipping > 0 && (
                  <div className="bg-primary/10 text-sm text-primary p-3 rounded">
                    Frete grátis em compras acima de R$ 200. Adicione R$ {(200 - (subtotal - discount)).toFixed(2)} para conseguir!
                  </div>
                )}

                {/* CTA */}
                <Link href="/checkout" className="w-full">
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90 cursor-pointer">
                    Ir para Checkout
                  </Button>
                </Link>

                <Link href="/produtos" className="w-full">
                  <Button size="lg" variant="outline" className="w-full">
                    Continuar Comprando
                  </Button>
                </Link>

                {/* Info */}
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>✓ Frete grátis acima de R$ 200</p>
                  <p>✓ Compra segura com SSL</p>
                  <p>✓ 30 dias para devolver</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

        <Footer />
      </section>
    </>
  )
}
