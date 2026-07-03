'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PromoTicker } from '@/components/promo-ticker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useProducts } from '@/components/products-context'

export default function CheckoutPage() {
  const { products } = useProducts()
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping')
  const [cartItems, setCartItems] = useState<any[]>([])
  const [orderNumber, setOrderNumber] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  })

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

  // Load cart items on mount
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
        }
      }
      // Generate a random order number
      const rand = Math.floor(100000 + Math.random() * 900000)
      setOrderNumber(`#MB-${new Date().getFullYear()}-${rand}`)
    } catch (e) {
      console.error(e)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 'shipping') {
      setStep('payment')
    }
  }

  // Obter itens de carrinho sincronizados com os preços/nomes em tempo real do banco de dados
  const syncCartItems = cartItems.map(item => {
    const freshProduct = products.find(p => p.id === String(item.id))
    return {
      ...item,
      name: freshProduct ? freshProduct.name : item.name,
      price: freshProduct ? freshProduct.price : item.price
    }
  })

  const handleFinalizeWhatsApp = () => {
    // Format WhatsApp message
    const formattedItems = syncCartItems
      .map(item => `- *${item.name}* ${item.size ? `(Tam: ${item.size})` : ''} ${item.color ? `(Cor: ${item.color})` : ''} x${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}`)
      .join('\n')

    const subtotal = syncCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discount = appliedCoupon === 'BEMVINDAS' ? subtotal * 0.05 : 0
    const cepLimpo = formData.zipCode.replace(/\D/g, '')
    let shipping = 15 // Fallback padrão caso cep não preenchido ou inválido
    if (subtotal > 0 && (subtotal - discount) >= 400) {
      shipping = 0
    } else if (cepLimpo.length === 8) {
      const storeCep = 13056272
      const diff = Math.abs(parseInt(cepLimpo) - storeCep)
      const km = diff / 1000
      const custo = km <= 5 ? 5 : 5 + (km - 5) * 1
      shipping = parseFloat(custo.toFixed(2))
    }
    const total = subtotal - discount + shipping

    const message = `Olá, Maribella! Gostaria de finalizar meu pedido.

*Número do Pedido:* ${orderNumber}

*Produtos:*
${formattedItems}

*Resumo Financeiro:*
- *Subtotal:* R$ ${subtotal.toFixed(2)}
${discount > 0 ? `- *Desconto (Cupom BEMVINDAS 5% OFF):* -R$ ${discount.toFixed(2)}\n` : ''}- *Frete:* ${shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}
- *Total Geral:* R$ ${total.toFixed(2)}

*Dados de Entrega:*
- *Nome:* ${formData.firstName} ${formData.lastName}
- *E-mail:* ${formData.email}
- *Telefone:* ${formData.phone}
- *CEP:* ${formData.zipCode}
- *Endereço:* ${formData.street}, Nº ${formData.number} ${formData.complement ? `(${formData.complement})` : ''}
- *Bairro:* ${formData.neighborhood}
- *Cidade/UF:* ${formData.city}/${formData.state}`

    // Redirect to WhatsApp
    const encodedText = encodeURIComponent(message)
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5519992394672&text=${encodedText}`
    
    window.open(whatsappUrl, '_blank')

    // Mark as ordered, clear cart/coupon and notify components
    localStorage.setItem('has_ordered', 'true')
    localStorage.removeItem('cart')
    localStorage.removeItem('maribella_cart')
    localStorage.removeItem('applied_coupon')
    window.dispatchEvent(new Event('cart-updated'))
    setCartItems([])

    // Move to confirmation step
    setStep('confirmation')
  }

  const subtotal = syncCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = appliedCoupon === 'BEMVINDAS' ? subtotal * 0.05 : 0

  const getShippingCost = () => {
    if (subtotal === 0) return 0
    if (subtotal - discount >= 400) return 0
    const cepLimpo = formData.zipCode.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return null
    const storeCep = 13056272
    const diff = Math.abs(parseInt(cepLimpo) - storeCep)
    const km = diff / 1000
    const custo = km <= 5 ? 5 : 5 + (km - 5) * 1
    return parseFloat(custo.toFixed(2))
  }

  const shipping = getShippingCost()
  const total = subtotal - discount + (shipping ?? 0)


  return (
    <>
      <section className="min-h-screen flex flex-col bg-background">
        <Header />

      {/* Steps */}
      <div className="bg-pink-50/20 border-b sticky top-[120px] z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-gray-500">
            <div className={`flex items-center gap-2 ${step === 'shipping' || step === 'payment' || step === 'confirmation' ? 'text-[#ff9edb] font-bold' : ''}`}>
              <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">1</div>
              <span className="hidden sm:inline">Endereço</span>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-4" />
            <div className={`flex items-center gap-2 ${step === 'payment' || step === 'confirmation' ? 'text-[#ff9edb] font-bold' : ''}`}>
              <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">2</div>
              <span className="hidden sm:inline">Finalização</span>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-4" />
            <div className={`flex items-center gap-2 ${step === 'confirmation' ? 'text-[#ff9edb] font-bold' : ''}`}>
              <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">3</div>
              <span className="hidden sm:inline">Confirmação</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === 'shipping' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 uppercase tracking-wider">Endereço de Entrega</h2>
                  
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        placeholder="Nome"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="focus-visible:ring-[#ff9edb]"
                      />
                      <Input
                        placeholder="Sobrenome"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="focus-visible:ring-[#ff9edb]"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        type="email"
                        placeholder="E-mail"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="focus-visible:ring-[#ff9edb]"
                      />
                      <Input
                        type="tel"
                        placeholder="Telefone / Celular (com DDD)"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="focus-visible:ring-[#ff9edb]"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <Input
                        placeholder="CEP"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className="col-span-2 focus-visible:ring-[#ff9edb]"
                      />
                      <Input
                        placeholder="Cidade"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="focus-visible:ring-[#ff9edb]"
                      />
                      <Input
                        placeholder="UF"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        maxLength={2}
                        required
                        className="focus-visible:ring-[#ff9edb]"
                      />
                    </div>

                    <Input
                      placeholder="Rua / Logradouro"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      required
                      className="focus-visible:ring-[#ff9edb]"
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        placeholder="Número"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        required
                        className="focus-visible:ring-[#ff9edb]"
                      />
                      <Input
                        placeholder="Complemento (opcional)"
                        name="complement"
                        value={formData.complement}
                        onChange={handleChange}
                        className="focus-visible:ring-[#ff9edb]"
                      />
                    </div>

                    <Input
                      placeholder="Bairro"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      required
                      className="focus-visible:ring-[#ff9edb]"
                    />
                  </div>

                  <div className="mt-8 flex gap-3">
                    <Link href="/carrinho">
                      <Button variant="outline" type="button" className="cursor-pointer">
                        Voltar
                      </Button>
                    </Link>
                    <Button type="submit" className="flex-1 bg-[#b83070] hover:bg-[#9e2860] text-white font-bold transition-colors cursor-pointer">
                      Continuar para Finalização
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {step === 'payment' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 uppercase tracking-wider">Finalização do Pedido</h2>
                  <p className="text-gray-500 mb-6 text-sm">
                    Revisamos as informações para envio. Ao clicar no botão abaixo, você será redirecionado para o WhatsApp da Maribella para finalizar a forma de pagamento e entrega.
                  </p>

                  <div className="bg-[#ff9edb]/10 border border-[#ff9edb]/20 rounded-lg p-6 space-y-4 text-sm text-gray-700 mb-8">
                    <h3 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Dados de Entrega cadastrados:</h3>
                    <p>
                      <strong>Destinatário:</strong> {formData.firstName} {formData.lastName}<br />
                      <strong>Contato:</strong> {formData.phone} ({formData.email})<br />
                      <strong>Endereço:</strong> {formData.street}, Nº {formData.number} {formData.complement ? `(${formData.complement})` : ''} - {formData.neighborhood}, {formData.city}/{formData.state} - CEP: {formData.zipCode}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setStep('shipping')}
                      className="cursor-pointer"
                    >
                      Editar Endereço
                    </Button>
                    <Button 
                      onClick={handleFinalizeWhatsApp} 
                      className="flex-1 bg-[#25d366] hover:bg-[#1ebd59] text-white font-bold flex items-center justify-center gap-2 cursor-pointer py-6 text-lg"
                    >
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.437 0 9.862-4.404 9.866-9.817.002-2.623-1.01-5.09-2.852-6.937C16.438 1.999 13.979 1.01 11.999 1.01c-5.444 0-9.873 4.406-9.877 9.82-.001 1.836.5 3.55 1.446 4.996L2.52 21.05l5.293-1.389c.001-.001.001-.001.002-.001z" />
                      </svg>
                      Finalizar Pedido via WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === 'confirmation' && (
              <div className="space-y-6">
                <div className="text-center py-12 bg-pink-50/50 border border-pink-100 rounded-lg">
                  <div className="text-6xl mb-4 text-[#ff9edb]">✓</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-wider">Pedido Recebido!</h2>
                  <p className="text-gray-600 text-sm max-w-md mx-auto">
                    Redirecionamos você para o WhatsApp. Por favor, envie a mensagem gerada para prosseguir com o pagamento e a entrega dos seus produtos.
                  </p>
                </div>

                <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Número do Pedido</p>
                    <p className="text-xl font-bold text-gray-900">{orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Status</p>
                    <p className="font-semibold text-amber-600">Aguardando atendimento no WhatsApp</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Data</p>
                    <p className="font-medium text-gray-700">{new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full cursor-pointer">
                      Voltar para Home
                    </Button>
                  </Link>
                  <Link href="/produtos" className="flex-1">
                    <Button className="w-full bg-[#ff9edb] hover:bg-[#ff80cb] text-white font-bold cursor-pointer">
                      Continuar Comprando
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 space-y-6 sticky top-40 bg-white">
              <h3 className="font-bold text-lg text-gray-900 uppercase tracking-wider border-b pb-4">Resumo do Pedido</h3>

              {syncCartItems.length > 0 ? (
                <div className="space-y-4 border-b pb-4">
                  {syncCartItems.map((item, idx) => (
                    <div key={idx} className="flex gap-3 text-sm justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 leading-tight">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.size ? `Tamanho: ${item.size}` : ''}
                          {item.size && item.color ? ' | ' : ''}
                          {item.color ? `Cor: ${item.color}` : ''}
                          {item.size || item.color ? ' | ' : ''} Qtd: {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium text-gray-700 flex-shrink-0">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Carrinho vazio ou finalizado.</p>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-700">R$ {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Desconto (BEMVINDAS)</span>
                    <span>- R$ {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Frete</span>
                  <span className={shipping === 0 && subtotal > 0 ? 'text-green-600 font-bold uppercase tracking-wider text-xs' : 'text-gray-700 font-medium'}>
                    {shipping === null
                      ? 'A calcular'
                      : shipping === 0
                      ? 'Grátis'
                      : `R$ ${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-3 mt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    {shipping === null ? `R$ ${(subtotal - discount).toFixed(2)} + frete` : `R$ ${total.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="bg-pink-50 border border-pink-100 rounded-lg p-4 text-xs text-gray-500 space-y-2">
                <p className="flex items-center gap-1.5">
                  <span className="text-[#ff9edb] font-bold">✓</span> Atendimento personalizado
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="text-[#ff9edb] font-bold">✓</span> Pagamento combinado via chat
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="text-[#ff9edb] font-bold">✓</span> Envio rápido para todo o Brasil
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

        <Footer />
      </section>
    </>
  )
}
