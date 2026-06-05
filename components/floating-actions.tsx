'use client'

import { useState } from 'react'
import { Tag, Copy, Check, X } from 'lucide-react'
import { toast } from 'sonner'

export function FloatingActions() {
  const [showCupons, setShowCupons] = useState(false)
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null)

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCoupon(code)
      toast.success(`Cupom "${code}" copiado com sucesso!`)
      setTimeout(() => setCopiedCoupon(null), 3000)
    } catch (e) {
      toast.error('Erro ao copiar o cupom.')
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 pointer-events-none z-40 p-4 sm:p-6 flex justify-between items-end">
      
      {/* Left: Floating Coupon Button & Popover */}
      <div className="pointer-events-auto relative flex flex-col items-start gap-3">
        {showCupons && (
          <div className="bg-white border border-pink-100 rounded-2xl p-4 shadow-2xl w-72 mb-2 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <h5 className="font-extrabold text-gray-900 text-sm tracking-wide uppercase flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#ff9edb]" />
                Cupons Ativos
              </h5>
              <button 
                onClick={() => setShowCupons(false)} 
                className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {/* Coupon 1 */}
              <div className="flex items-center justify-between bg-pink-50/50 p-2.5 rounded-xl border border-pink-100/50">
                <div>
                  <span className="font-extrabold text-gray-800 text-xs tracking-wider block">BEMVINDAS</span>
                  <span className="text-[10px] text-gray-500 font-medium">5% de desconto na 1ª compra</span>
                </div>
                <button
                  onClick={() => handleCopy('BEMVINDAS')}
                  className="bg-white hover:bg-pink-100/30 text-[#ff9edb] p-2 rounded-lg border border-pink-100 transition shadow-xs"
                >
                  {copiedCoupon === 'BEMVINDAS' ? (
                    <Check className="w-3.5 h-3.5 text-green-500 stroke-[2.5]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 stroke-[2]" />
                  )}
                </button>
              </div>

              {/* Coupon 2 */}
              <div className="flex items-center justify-between bg-pink-50/50 p-2.5 rounded-xl border border-pink-100/50">
                <div>
                  <span className="font-extrabold text-gray-800 text-xs tracking-wider block">FRETE200</span>
                  <span className="text-[10px] text-gray-500 font-medium">Frete Grátis acima de R$ 200</span>
                </div>
                <button
                  onClick={() => handleCopy('FRETE200')}
                  className="bg-white hover:bg-pink-100/30 text-[#ff9edb] p-2 rounded-lg border border-pink-100 transition shadow-xs"
                >
                  {copiedCoupon === 'FRETE200' ? (
                    <Check className="w-3.5 h-3.5 text-green-500 stroke-[2.5]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 stroke-[2]" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowCupons(!showCupons)}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-[#ff9edb] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer animate-pulse"
          aria-label="Cupons e descontos"
        >
          <Tag className="w-6 h-6 stroke-[2]" />
        </button>
      </div>

      {/* Right: Floating WhatsApp Button */}
      <div className="pointer-events-auto">
        <a
          href="https://wa.me/5519992394672?text=Ol%C3%A1%2C%20estou%20no%20site%20da%20Maribella%20e%20gostaria%20de%20ajuda!"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 sm:w-14 sm:h-14 bg-[#25d366] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer"
          aria-label="Fale conosco no WhatsApp"
        >
          {/* Custom WhatsApp Icon */}
          <svg
            className="w-6 h-6 fill-white"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>

    </div>
  )
}
