'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você pode integrar com seu backend
    setSubmitted(true)
    setEmail('')
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section className="py-16 bg-gradient-to-r from-[#ff9edb]/10 to-[#ff9edb]/20">
      <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Não perca nossas promoções!
          </h2>
          <p className="text-muted-foreground">
            Receba ofertas exclusivas e dicas de estilo direto no seu e-mail
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" className="bg-[#ff9edb] hover:bg-[#ff80cb] whitespace-nowrap text-white">
            Inscrever
          </Button>
        </form>

        {submitted && (
          <p className="text-sm text-green-600 font-medium">
            ✓ Inscrição realizada com sucesso! Verifique seu e-mail.
          </p>
        )}
      </div>
    </section>
  )
}
