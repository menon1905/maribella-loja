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

import { useProducts } from '@/components/products-context'

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
  const { products } = useProducts()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [cep, setCep] = useState('')
  const [freteCalculado, setFreteCalculado] = useState<number | null>(null)
  const [cepError, setCepError] = useState('')
  const [distanciaKm, setDistanciaKm] = useState<number | null>(null)

  useEffect(() => {
    try {
      const cart = localStorage.getItem('maribella_cart') || localStorage.getItem('cart')
      if (cart) {
        setCartItems(JSON.parse(cart))
      }
      
      const hasOrdered = localStorage.getItem('has_ordered') === 'true'
      if (hasOrdered) {
        localStorage.removeItem('applied_coupon')
      } else {
        const storedCoupon = localStorage.getItem('applied_coupon')
        if (storedCoupon) {
          setAppliedCoupon(storedCoupon)
          setCoupon(storedCoupon)
        }
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
    if (localStorage.getItem('has_ordered') === 'true') {
      toast.error('O cupom BEMVINDAS só pode ser utilizado na primeira compra.')
      return
    }
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

  // Obter itens de carrinho sincronizados com os dados atualizados do banco
  const syncCartItems = cartItems.map(item => {
    const freshProduct = products.find(p => p.id === String(item.id))
    return {
      ...item,
      name: freshProduct ? freshProduct.name : item.name,
      price: freshProduct ? freshProduct.price : item.price,
      image: freshProduct ? freshProduct.image : item.image
    }
  })

  const subtotal = syncCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = appliedCoupon === 'BEMVINDAS' ? subtotal * 0.05 : 0

  // Se subtotal após desconto >= 400 e CEP for de Campinas, frete grátis. Caso contrário usa o valor calculado por CEP (ou null se não calculado)
  const isCampinasCep = (c: string) => {
    const clean = c.replace(/\D/g, '')
    if (clean.length !== 8) return false
    const num = parseInt(clean, 10)
    return num >= 13000000 && num <= 13139999
  }
  const isCampinas = isCampinasCep(cep)
  const shipping = subtotal > 0 && (subtotal - discount) >= 400 && isCampinas ? 0 : freteCalculado
  const total = subtotal - discount + (shipping ?? 0)

  const calcularFrete = () => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) {
      setCepError('CEP inválido. Digite 8 dígitos.')
      setFreteCalculado(null)
      setDistanciaKm(null)
      return
    }
    const storeCep = 13056272
    // Estimativa de distância baseada na diferença de CEP
    const diff = Math.abs(parseInt(cepLimpo) - storeCep)
    const km = diff / 1000

    // Frete por faixas de distância (R$20 a R$50)
    let custo: number
    if (km <= 15) {
      custo = 20 // Campinas e arredores imediatos
    } else if (km <= 30) {
      custo = 25 // Sumaré, Hortolândia, Valinhos, Vinhedo
    } else if (km <= 60) {
      custo = 35 // Americana, Santa Bárbara, Piracicaba, Jundiaí
    } else if (km <= 100) {
      custo = 42 // Sorocaba, São Paulo (região), Ribeirão Preto (região)
    } else if (km <= 150) {
      custo = 47 // Regiões mais distantes do interior
    } else {
      custo = 50 // Qualquer localidade mais distante — máximo R$50
    }

    setDistanciaKm(km)
    setFreteCalculado(custo)
    setCepError('')
  }


  return (
    <>
      <main className="min-h-screen flex flex-col bg-slate-50/50">
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
        ) : syncCartItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl font-semibold mb-4">Seu carrinho está vazio</p>
            <p className="text-muted-foreground mb-8">Comece a comprar e preencha seu carrinho com seus produtos favoritos!</p>
            <Link href="/produtos">
              <Button size="lg" className="bg-[#ff9edb] hover:bg-[#ff80cb] text-white font-bold transition-colors">
                Continuar Comprando
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {syncCartItems.map((item) => (
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

                {/* CEP Frete */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Calcular Frete</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Digite seu CEP"
                      value={cep}
                      onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      onKeyDown={(e) => e.key === 'Enter' && calcularFrete()}
                      className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      maxLength={8}
                    />
                    <Button variant="outline" className="px-4 cursor-pointer" onClick={calcularFrete}>
                      Calcular
                    </Button>
                  </div>
                  {cepError && <p className="text-xs text-red-500">{cepError}</p>}
                  {freteCalculado !== null && distanciaKm !== null && shipping !== 0 && (
                    <p className="text-xs text-green-700 font-medium">
                      📍 Distância estimada: {distanciaKm.toFixed(1)} km — Frete: R$ {freteCalculado.toFixed(2)}
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
                      Frete {shipping === 0 && subtotal > 0 ? '(Grátis)' : ''}
                    </span>
                    <span className={shipping === 0 && subtotal > 0 ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                      {shipping === null
                        ? 'A calcular'
                        : shipping === 0
                        ? 'Grátis'
                        : `R$ ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-3">
                    <span>Total</span>
                    <span className="text-primary">
                      {shipping === null ? `R$ ${(subtotal - discount).toFixed(2)} + frete` : `R$ ${total.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                {/* Info frete grátis */}
                {subtotal > 0 && (subtotal - discount) < 400 && (cep === '' || isCampinas) && (
                  <div className="bg-primary/10 text-sm text-primary p-3 rounded">
                    Frete grátis (Campinas) em compras acima de R$ 400. Adicione R$ {Math.max(0, 400 - (subtotal - discount)).toFixed(2)} para conseguir!
                  </div>
                )}

                {/* CTA */}
                <div className="flex flex-col gap-3 w-full">
                  <Link href="/checkout" className="w-full">
                    <Button size="lg" className="w-full bg-[#ff9edb] hover:bg-[#ff80cb] text-white font-bold transition-colors cursor-pointer">
                      Ir para Checkout
                    </Button>
                  </Link>

                  <Link href="/produtos" className="w-full">
                    <Button size="lg" variant="outline" className="w-full">
                      Continuar Comprando
                    </Button>
                  </Link>
                </div>

                {/* Info */}
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>✓ Frete grátis acima de R$ 400 (somente Campinas)</p>
                  <p>✓ Frete calculado por distância com base no seu CEP</p>
                  <p>✓ Compra segura com SSL</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

        <Footer />
      </main>
    </>
  )
}
