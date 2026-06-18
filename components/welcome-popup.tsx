'use client'

import { useState, useEffect } from 'react'
import { X, Heart, Copy, Check } from 'lucide-react'

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Show popup after 3 seconds
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])

  const closePopup = () => {
    setIsOpen(false)
  }

  const copyCoupon = async () => {
    try {
      await navigator.clipboard.writeText('BEMVINDAS')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closePopup}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#ff9edb] rounded-[2rem] p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button 
          onClick={closePopup}
          className="absolute top-4 right-4 text-gray-800 hover:text-black transition-colors rounded-full p-1 hover:bg-black/5"
          aria-label="Fechar"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        {/* Header */}
        <div className="mt-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-black text-black text-center uppercase tracking-wide flex items-center justify-center gap-2">
            SEJA BEM-VINDA <Heart className="w-6 h-6 stroke-[1.5]" />
          </h2>
          <p className="text-center text-gray-800 text-sm md:text-base font-medium mt-3 px-2">
            Temos um cupom exclusivo para a sua primeira compra!
          </p>
        </div>

        {/* Ticket Container */}
        <div className="bg-white rounded-2xl relative overflow-hidden shadow-sm mx-2">
          {/* Left Cutout */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-[#ff9edb] rounded-full" />
          {/* Right Cutout */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-[#ff9edb] rounded-full" />
          
          {/* Top Half */}
          <div className="text-center pt-8 pb-5 border-b-2 border-dashed border-gray-100 mx-6">
             <span className="text-5xl font-black text-primary tracking-tighter">5%</span>
          </div>
          
          {/* Bottom Half */}
          <div className="text-center pt-5 pb-8 px-6">
             <p className="text-gray-500 text-sm mb-3 font-medium">Copie o cupom</p>
             
             <button 
               onClick={copyCoupon} 
               className="border-2 border-dashed border-gray-300 rounded-xl py-3 px-6 flex items-center justify-center gap-3 mx-auto hover:bg-gray-50 active:scale-95 transition-all w-full max-w-[240px]"
             >
               <span className="text-primary font-black text-xl tracking-widest">BEMVINDAS</span>
               {copied ? (
                 <Check className="w-5 h-5 text-green-500" />
               ) : (
                 <Copy className="w-5 h-5 text-gray-500" />
               )}
             </button>
             
             <p className="text-gray-400 text-xs mt-4">Válido para a sua primeira compra</p>
          </div>
        </div>
      </div>
    </div>
  )
}
