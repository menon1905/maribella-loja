import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { AlertCircle, RefreshCw, AlertTriangle, ShieldCheck, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Trocas e Devoluções | Maribella',
  description: 'Conheça a nossa política de trocas e devoluções da Maribella. Regras claras, justas e transparentes.',
}

export default function TrocasDevolucoesPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-pink-50/40 border-b border-pink-100/50 mt-14 md:mt-16">
        <div className="max-w-4xl mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#ff9edb] transition-colors">Início</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-800">Trocas e Devoluções</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow max-w-4xl mx-auto w-full px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">Política de Trocas e Devoluções</h1>
        <p className="text-gray-500 mb-8 font-medium">Por favor, leia atentamente as nossas diretrizes abaixo.</p>

        {/* Highlight Card */}
        <div className="bg-pink-50/50 border border-pink-100/80 rounded-3xl p-6 mb-10 flex gap-4 items-start shadow-sm">
          <div className="p-2.5 bg-pink-100 rounded-xl text-[#ff80cb] flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Na <strong className="text-[#ff80cb]">Maribella</strong>, buscamos sempre oferecer transparência e qualidade em todas as etapas da sua compra. Para garantir a higiene das peças e a satisfação de todas as nossas clientes, adotamos uma política de trocas clara e objetiva.
            </p>
          </div>
        </div>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          
          {/* Section 1 */}
          <section className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-[#ff80cb] rounded-full" />
              1. Peças Experimentadas e Decisão de Compra
            </h2>
            <div className="text-sm space-y-3">
              <p>
                Caso a cliente experimente a peça e decida ficar com ela, <strong>não será realizada troca posteriormente</strong> por motivo de tamanho, modelo ou preferência pessoal.
              </p>
              <p className="text-gray-500">
                Recomendamos sempre provar a roupa com cuidado e certificar-se do caimento no momento do recebimento antes de retirar a etiqueta original ou decidir pela permanência da peça.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-[#ff80cb] rounded-full" />
              2. Troca por Tamanho (Apenas Peças NÃO Provadas)
            </h2>
            <div className="text-sm space-y-3">
              <p>
                Se a peça <strong>não serviu e não foi provada</strong> (ou seja, foi mantida exatamente como entregue, com a etiqueta original intacta, sem qualquer odor, marca de uso, desodorante ou maquiagem), a troca poderá ser realizada nas seguintes condições:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-500">
                <li>O prazo para solicitação é de até <strong>7 (sete) dias corridos</strong> após o recebimento.</li>
                <li>A peça deve estar com a etiqueta original afixada e sem sinais de uso ou lavagem.</li>
                <li>Os custos de envio e reenvio de frete para trocas por tamanho, cor ou preferência são de <strong>responsabilidade da cliente</strong>.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-[#ff80cb] rounded-full" />
              3. Defeito de Fabricação
            </h2>
            <div className="text-sm space-y-3">
              <p>
                Realizamos trocas em casos de <strong>defeito de fabricação</strong> comprovado, mediante análise prévia da peça por nossa equipe.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-500">
                <li>Para solicitar a análise por defeito de fabricação, a peça <strong>deve estar com a etiqueta original afixada</strong> e sem sinais de uso, lavagem ou mau uso.</li>
                <li>Constatado o defeito de fabricação, os custos de frete são de responsabilidade da Maribella.</li>
              </ul>
            </div>
          </section>

          {/* Warning Section - STRICT NO EXCHANGES */}
          <section className="bg-amber-50/40 border border-amber-200/60 rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2.5">
              <AlertTriangle className="w-5.5 h-5.5 text-amber-600" />
              4. Peças que NÃO possuem Direito a Troca (Sem Exceção)
            </h2>
            <p className="text-sm text-amber-950 font-medium">
              Por questões de higiene, proteção contra danos ao tecido e natureza promocional, **não efetuamos trocas** dos seguintes itens:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mt-2">
              <div className="p-3.5 bg-white border border-amber-100 rounded-2xl text-xs font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Peças Brancas
              </div>
              <div className="p-3.5 bg-white border border-amber-100 rounded-2xl text-xs font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Peças Íntimas
              </div>
              <div className="p-3.5 bg-white border border-amber-100 rounded-2xl text-xs font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Peças Promocionais / Outlet
              </div>
              <div className="p-3.5 bg-white border border-amber-100 rounded-2xl text-xs font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Peças com aplicações de Brilho
              </div>
            </div>
            <div className="text-xs text-amber-800 space-y-1 pt-2">
              <p>• Também não realizamos trocas de peças experimentadas, usadas, lavadas, sem etiqueta ou com indícios de mau uso.</p>
            </div>
          </section>

          {/* Section 5 - How to Request */}
          <section className="bg-gradient-to-br from-pink-50/40 to-pink-100/20 border border-pink-100/50 rounded-3xl p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2.5 mb-2">
                <RefreshCw className="w-5.5 h-5.5 text-[#ff80cb]" />
                5. Como Solicitar a Troca?
              </h2>
              <p className="text-sm text-gray-600">
                Se o seu pedido atende a todas as condições acima, entre em contato direto pelo nosso WhatsApp de atendimento:
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="https://wa.me/5519992394672?text=Olá!%20Preciso%20de%20ajuda%20com%20uma%20troca%20ou%20devolução."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-sm tracking-wider uppercase shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] transition-all duration-300 hover:scale-[1.02]"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                Falar no WhatsApp
              </a>
              <div className="text-xs text-gray-400 text-center sm:text-left">
                Lembre-se de nos informar o <strong>número do pedido</strong>, o nome cadastrado e o motivo detalhado.
              </div>
            </div>
          </section>

        </div>

        <p className="text-xs text-gray-400 mt-12 border-t border-gray-100 pt-4">
          Última atualização: Junho de 2026
        </p>
      </div>

      <Footer />
    </main>
  )
}
