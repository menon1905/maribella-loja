'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PromoTicker } from '@/components/promo-ticker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function CheckoutPage() {
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping')
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
    paymentMethod: 'credit-card'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 'shipping') {
      setStep('payment')
    } else if (step === 'payment') {
      setStep('confirmation')
    }
  }

  const subtotal = 489.80
  const shipping = 0
  const total = subtotal + shipping

  return (
    <>
      <PromoTicker />
      <section className="min-h-screen flex flex-col bg-background">
        <Header />

      {/* Steps */}
      <div className="bg-muted/50 border-b sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className={`flex items-center gap-2 ${step === 'shipping' || step === 'payment' || step === 'confirmation' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">1</div>
              <span className="hidden sm:inline">Endereço</span>
            </div>
            <div className="flex-1 h-0.5 bg-border mx-2" />
            <div className={`flex items-center gap-2 ${step === 'payment' || step === 'confirmation' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">2</div>
              <span className="hidden sm:inline">Pagamento</span>
            </div>
            <div className="flex-1 h-0.5 bg-border mx-2" />
            <div className={`flex items-center gap-2 ${step === 'confirmation' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">3</div>
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
                  <h2 className="text-2xl font-bold mb-6">Endereço de Entrega</h2>
                  
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        placeholder="Nome"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        placeholder="Sobrenome"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
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
                      />
                      <Input
                        type="tel"
                        placeholder="Telefone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <Input
                        placeholder="CEP"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className="col-span-2"
                      />
                      <Input
                        placeholder="Cidade"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        placeholder="UF"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        maxLength={2}
                        required
                      />
                    </div>

                    <Input
                      placeholder="Rua"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      required
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        placeholder="Número"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        placeholder="Complemento (opcional)"
                        name="complement"
                        value={formData.complement}
                        onChange={handleChange}
                      />
                    </div>

                    <Input
                      placeholder="Bairro"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link href="/carrinho">
                      <Button variant="outline" type="button">
                        Voltar
                      </Button>
                    </Link>
                    <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                      Continuar para Pagamento
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {step === 'payment' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Método de Pagamento</h2>

                  <div className="space-y-3">
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition">
                      <input type="radio" name="payment" value="credit-card" defaultChecked className="mr-3" />
                      <span className="font-medium">Cartão de Crédito</span>
                    </label>
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition">
                      <input type="radio" name="payment" value="debit" className="mr-3" />
                      <span className="font-medium">Cartão de Débito</span>
                    </label>
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition">
                      <input type="radio" name="payment" value="pix" className="mr-3" />
                      <span className="font-medium">Pix</span>
                    </label>
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition">
                      <input type="radio" name="payment" value="installments" className="mr-3" />
                      <span className="font-medium">Parcelado (até 12x)</span>
                    </label>
                  </div>

                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-4 text-sm">
                    <p className="text-blue-900">
                      ℹ️ Esta é uma demonstração. Não será processado nenhum pagamento real.
                    </p>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setStep('shipping')}
                    >
                      Voltar
                    </Button>
                    <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                      Revisar Pedido
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {step === 'confirmation' && (
              <div className="space-y-6">
                <div className="text-center py-12 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-6xl mb-4">✓</div>
                  <h2 className="text-2xl font-bold text-green-900 mb-2">Pedido Confirmado!</h2>
                  <p className="text-green-700">Seu pedido foi realizado com sucesso</p>
                </div>

                <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Número do Pedido</p>
                    <p className="text-xl font-bold">#CT-2024-001234</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Data</p>
                    <p className="font-medium">{new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tempo de Entrega</p>
                    <p className="font-medium">3-7 dias úteis</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Voltar para Home
                    </Button>
                  </Link>
                  <Link href="/produtos" className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Continuar Comprando
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 space-y-6 sticky top-40">
              <h3 className="font-bold text-lg">Resumo do Pedido</h3>

              <div className="space-y-3 border-b pb-4">
                <div className="flex justify-between text-sm">
                  <span>Bolsa Tote Premium x1</span>
                  <span>R$ 189,90</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tênis Esportivo x1</span>
                  <span>R$ 299,90</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span className="text-muted-foreground">Frete</span>
                  <span>Grátis</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-primary">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              {step === 'confirmation' && (
                <div className="bg-green-50 text-green-900 text-sm p-3 rounded">
                  ✓ Sua compra foi confirmada e seu código de rastreamento foi enviado para o email cadastrado.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

        <Footer />
      </section>
    </>
  )
}
