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
          href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20estou%20no%20site%20da%20Maribella%20e%20gostaria%20de%20ajuda!"
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
            <path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.764.456 3.48 1.332 5.004L2 22l5.124-1.308a9.988 9.988 0 0 0 4.888 1.32c5.532 0 10.012-4.48 10.012-10.012C22.024 6.48 17.544 2 12.012 2zm6.276 14.196c-.276.78-1.392 1.428-2.28 1.524-.768.084-1.764.12-3.156-.444-5.952-2.424-9.804-8.508-9.804-8.916 0-.408-.072-2.436 1.488-3.996.648-.648 1.284-.816 1.728-.816.324 0 .612.012.876.024.276.012.648-.108 1.02.792.384.924 1.308 3.192 1.428 3.432.12.24.204.516.036.84-.156.324-.348.516-.54.744-.192.216-.408.456-.576.624-.192.18-.396.384-.168.78.228.384 1.02 1.68 2.184 2.712 1.5 1.332 2.76 1.752 3.156 1.944.396.192.624.156.864-.12.24-.276 1.02-1.188 1.296-1.596.276-.408.552-.336.924-.204.384.132 2.424 1.14 2.532 1.2.108.06.18.276.096.528z" />
          </svg>
        </a>
      </div>

    </div>
  )
}
