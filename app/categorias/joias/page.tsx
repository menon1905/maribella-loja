import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Breadcrumb } from '@/components/breadcrumb'
import Image from 'next/image'
import { MessageCircle, Sparkles, Gem, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jóias | Maribella',
  description: 'Conheça nossa coleção exclusiva Veridiana Joias. Peças sofisticadas sob encomenda e atendimento personalizado via WhatsApp.',
}

export default function JoiasCategoryPage() {
  const whatsappUrl = "https://wa.me/5519992394672?text=Olá!%20Gostaria%20de%20ver%20a%20maleta%20de%20joias%20ou%20fazer%20uma%20encomenda."

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Jóias', href: '/categorias/joias' },
        ]}
      />

      {/* Page Header */}
      <div className="bg-pink-50/40 py-12 border-b border-pink-100/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center md:text-left">
          <h1 className="text-3xl font-medium text-gray-900 uppercase tracking-[0.1em]">Jóias</h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">Coleções exclusivas e atendimento personalizado</p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image Showcase */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative group w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(255,158,219,0.25)] border-4 border-white transition-transform duration-500 hover:scale-[1.02]">
              {/* Golden/pink frame glow effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-300/20 via-yellow-200/10 to-pink-400/20 mix-blend-overlay z-10" />
              <Image
                src="/veridiana-quirino.jpg"
                alt="Veridiana Quirino - Revenda Autorizada"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right Column: Premium Text & CTA Card */}
          <div className="md:col-span-7 flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100/60 border border-pink-200 text-[#ff80cb] text-xs font-bold uppercase tracking-wider">
                <Gem className="w-3.5 h-3.5" />
                Revenda Autorizada Veridiana Joias
              </div>
              <h2 className="text-3xl md:text-4.5xl font-bold text-gray-900 tracking-tight leading-tight">
                Descubra a nossa <span className="text-[#ff80cb] bg-gradient-to-r from-[#ff80cb] to-[#ffb5e4] bg-clip-text text-transparent">Maleta de Jóias</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed font-normal">
                Trabalhamos com as semijoias exclusivas da <strong>Veridiana Joias</strong>! Peças selecionadas que unem sofisticação, brilho impecável e alta durabilidade para completar o seu visual em qualquer ocasião especial.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-pink-100/50 shadow-sm flex gap-4 items-start">
                <div className="p-3 bg-pink-50 rounded-xl text-[#ff80cb] flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Peças Exclusivas</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Design sofisticado com acabamento de alta joalheria.</p>
                </div>
              </div>
              
              <div className="p-5 rounded-2xl bg-white border border-pink-100/50 shadow-sm flex gap-4 items-start">
                <div className="p-3 bg-pink-50 rounded-xl text-[#ff80cb] flex-shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Atendimento Direto</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Agende uma visita da maleta ou faça sua encomenda online.</p>
                </div>
              </div>
            </div>

            {/* Premium Call to Action Area */}
            <div className="bg-gradient-to-br from-pink-50/70 to-pink-100/30 border border-pink-100/60 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 justify-between shadow-[0_10px_30px_-10px_rgba(255,158,219,0.15)]">
              <div className="text-center sm:text-left space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quer ver os modelos disponíveis?</p>
                <h3 className="text-lg font-bold text-gray-900">Solicite a maleta ou encomende a sua peça!</h3>
              </div>
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#ff9edb] to-[#ff7bcc] text-white hover:from-[#ff8cd0] hover:to-[#ff6ac2] rounded-full font-bold text-sm tracking-wider uppercase shadow-[0_10px_25px_-5px_rgba(255,123,204,0.4)] transition-all duration-300 hover:scale-[1.03] group flex-shrink-0"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                Fazer Encomenda
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
