import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { Heart, Users, Sparkles, Leaf } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quem Somos | Nossa História | Maribella',
  description: 'Conheça a história da Maribella, quem somos e o nosso compromisso com a sustentabilidade.',
}

export default function SobrePage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-pink-50/40 border-b border-pink-100/50 mt-14 md:mt-16">
        <div className="max-w-4xl mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#ff9edb] transition-colors">Início</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-800">Sobre Nós</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-gradient-to-b from-pink-50/60 to-background py-16 md:py-20 border-b border-pink-100/30">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#ff80cb] text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-current" />
            Conheça Nossa Essência
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Sobre a <span className="bg-gradient-to-r from-[#ff80cb] to-[#ffb5e4] bg-clip-text text-transparent">Maribella</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            Unindo sonhos, carinho e dedicação para oferecer moda que expressa elegância, delicadeza e autenticidade.
          </p>
        </div>
      </div>

      {/* Sections Wrapper */}
      <div className="flex-grow max-w-4xl mx-auto w-full px-4 py-16 space-y-20">
        
        {/* Quem Somos */}
        <section id="quem-somos" className="scroll-mt-28 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-pink-50 rounded-2xl text-[#ff80cb]">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Quem Somos</h2>
          </div>
          <div className="bg-white border border-pink-100/50 rounded-3xl p-6 md:p-10 shadow-[0_10px_35px_-10px_rgba(255,158,219,0.1)] space-y-4">
            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-normal">
              A <strong className="text-[#ff80cb] font-semibold">Maribella</strong> é uma loja de moda feminina criada para mulheres que valorizam elegância, delicadeza e autenticidade. Selecionamos cada peça com muito carinho, buscando oferecer qualidade, beleza e uma experiência especial em cada compra.
            </p>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-normal">
              Mais do que vender roupas, queremos fazer parte dos momentos que fazem você se sentir ainda mais confiante e encantadora.
            </p>
          </div>
        </section>

        {/* Nossa História */}
        <section id="nossa-historia" className="scroll-mt-28 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-pink-50 rounded-2xl text-[#ff80cb]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Nossa História</h2>
          </div>
          <div className="bg-white border border-pink-100/50 rounded-3xl p-6 md:p-10 shadow-[0_10px_35px_-10px_rgba(255,158,219,0.1)] space-y-4 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 text-[#ff80cb] pointer-events-none select-none">
              <Sparkles className="w-64 h-64" />
            </div>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-normal">
              O nome da nossa loja nasceu da junção de <strong className="text-gray-900 font-semibold">Mari</strong> e <strong className="text-gray-900 font-semibold">Bella</strong>, sogra e nora que uniram suas ideias, estilos e sonhos para criar uma marca única.
            </p>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-normal">
              A Maribella é fruto dessa parceria especial, construída com carinho, dedicação e o desejo de oferecer peças que transmitam elegância, feminilidade e significado. Cada detalhe da nossa trajetória carrega um pouco da nossa essência e do amor que colocamos neste sonho.
            </p>
          </div>
        </section>

        {/* Sustentabilidade */}
        <section id="sustentabilidade" className="scroll-mt-28 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-pink-50 rounded-2xl text-[#ff80cb]">
              <Leaf className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Sustentabilidade</h2>
          </div>
          <div className="bg-gradient-to-br from-white to-pink-50/20 border border-pink-100/50 rounded-3xl p-6 md:p-10 shadow-[0_10px_35px_-10px_rgba(255,158,219,0.1)] space-y-4">
            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-normal">
              Na <strong className="text-[#ff80cb] font-semibold">Maribella</strong>, acreditamos que consumir com consciência também é uma forma de cuidado. Por isso, valorizamos peças de qualidade, feitas para acompanhar você em diversos momentos e permanecer por muito mais tempo no seu guarda-roupa.
            </p>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-normal">
              Nosso compromisso é incentivar escolhas que unam beleza, durabilidade e propósito.
            </p>
          </div>
        </section>

      </div>

      <Footer />
    </main>
  )
}
