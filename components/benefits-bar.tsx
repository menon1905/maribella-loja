'use client'

import { Truck, CreditCard, Tag, MessageCircle, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function BenefitsBar() {
  const [copied, setCopied] = useState(false)

  const handleCopyCoupon = async () => {
    try {
      await navigator.clipboard.writeText('BEMVINDAS')
      setCopied(true)
      toast.success('Cupom "BEMVINDAS" copiado com sucesso!')
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      toast.error('Erro ao copiar o cupom.')
    }
  }

  return (
    <section className="bg-white border-y border-gray-100 py-5 md:py-8 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8">

          {/* Benefit 1: Envios Todo BR */}
          <div className="flex flex-col items-center text-center gap-2 px-2 py-3 md:flex-row md:text-left md:gap-4 md:px-4 md:py-2 hover:bg-pink-50/50 rounded-xl transition duration-200">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ff9edb] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
              <Truck className="w-4.5 h-4.5 md:w-5.5 md:h-5.5 stroke-[2]" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-[10px] md:text-xs tracking-[0.12em] uppercase leading-tight">
                Envios Todo BR
              </h4>
              <p className="text-[10px] md:text-xs text-gray-500 font-light mt-0.5 tracking-wide leading-tight">
                Receba onde estiver!
              </p>
            </div>
          </div>

          {/* Benefit 2: Parcele Até 12x */}
          <div className="flex flex-col items-center text-center gap-2 px-2 py-3 md:flex-row md:text-left md:gap-4 md:px-4 md:py-2 hover:bg-pink-50/50 rounded-xl transition duration-200">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ff9edb] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
              <CreditCard className="w-4.5 h-4.5 md:w-5.5 md:h-5.5 stroke-[2]" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-[10px] md:text-xs tracking-[0.12em] uppercase leading-tight">
                Parcele Até 12x
              </h4>
              <p className="text-[10px] md:text-xs text-gray-500 font-light mt-0.5 tracking-wide leading-tight">
                Nos cartões de crédito
              </p>
            </div>
          </div>

          {/* Benefit 3: 5% de Desconto (Copy Coupon) */}
          <div
            onClick={handleCopyCoupon}
            className="flex flex-col items-center text-center gap-2 px-2 py-3 md:flex-row md:text-left md:gap-4 md:px-4 md:py-2 hover:bg-pink-50/50 rounded-xl transition duration-200 cursor-pointer group"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ff9edb] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
              <Tag className="w-4.5 h-4.5 md:w-5.5 md:h-5.5 stroke-[2]" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-[10px] md:text-xs tracking-[0.12em] uppercase leading-tight">
                5% de Desconto
              </h4>
              <div className="flex items-center justify-center md:justify-start gap-1 mt-0.5">
                <p className="text-[10px] md:text-xs text-gray-500 font-semibold leading-tight">
                  <span className="text-[#ff9edb] font-bold">BEMVINDAS</span>
                </p>
                <button
                  className="text-gray-400 group-hover:text-[#ff9edb] transition-colors p-0.5 rounded-sm"
                  aria-label="Copiar cupom"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-green-500 stroke-[2.5]" />
                  ) : (
                    <Copy className="w-3 h-3 stroke-[2]" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Benefit 4: Suporte Maribella */}
          <a
            href="https://wa.me/5519992394672?text=Ol%C3%A1%2C%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20as%20roupas!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-center gap-2 px-2 py-3 md:flex-row md:text-left md:gap-4 md:px-4 md:py-2 hover:bg-pink-50/50 rounded-xl transition duration-200"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ff9edb] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
              <MessageCircle className="w-4.5 h-4.5 md:w-5.5 md:h-5.5 stroke-[2]" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-[10px] md:text-xs tracking-[0.12em] uppercase leading-tight">
                Suporte Maribella
              </h4>
              <p className="text-[10px] md:text-xs text-gray-500 font-semibold mt-0.5 hover:text-[#ff9edb] transition-colors leading-tight">
                Fale conosco
              </p>
            </div>
          </a>

        </div>
      </div>
    </section>
  )
}
