import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trocas e Devoluções | Maribella',
  description: 'Conheça nossa política de trocas e devoluções. Sua satisfação é nossa prioridade.',
}

export default function TrocasDevolucoesPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-pink-50/40 border-b border-pink-100/50">
        <div className="max-w-4xl mx-auto px-4 py-3 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#ff66b2] transition-colors">Início</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Trocas e Devoluções</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow max-w-4xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Trocas e Devoluções</h1>

        <div className="bg-pink-50 border border-pink-100 rounded-2xl p-6 mb-8">
          <p className="text-gray-700 text-sm leading-relaxed">
            Na <strong className="text-[#ff66b2]">Maribella</strong>, queremos que sua experiência de compra seja sempre incrível. Por isso, desenvolvemos uma política de trocas e devoluções que garante sua satisfação e tranquilidade.
          </p>
        </div>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Trocas</h2>
            <p className="mb-3">
              As trocas podem ser solicitadas em até <strong>7 (sete) dias corridos</strong> após o recebimento do produto.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>A peça deve estar com etiquetas originais e sem sinais de uso</li>
              <li>A embalagem original deve ser preservada</li>
              <li>Os custos de envio para trocas por <strong>motivo de tamanho, cor ou modelo</strong> são de responsabilidade do cliente</li>
              <li>Em caso de defeito de fabricação, o frete da troca é por nossa conta</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Devoluções</h2>
            <p className="mb-3">
              Aceitamos devoluções em até <strong>7 (sete) dias corridos</strong> após o recebimento, conforme o Código de Defesa do Consumidor.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>O produto deve estar em perfeito estado, sem uso e com todas as etiquetas</li>
              <li>Após análise e aprovação, o reembolso será realizado em até 10 dias úteis</li>
              <li>O reembolso será feito via PIX ou estorno no cartão, a combinar</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Como Solicitar</h2>
            <p className="mb-3">Para solicitar uma troca ou devolução, entre em contato conosco:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Via WhatsApp:{' '}
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#ff66b2] hover:underline font-medium"
                >
                  Clique aqui para nos chamar
                </a>
              </li>
              <li>
                Via e-mail:{' '}
                <a href="mailto:contato@maribellaloja.com.br" className="text-[#ff66b2] hover:underline">
                  contato@maribellaloja.com.br
                </a>
              </li>
            </ul>
            <p className="mt-3 text-sm text-gray-500">
              Informe o número do pedido, o motivo da solicitação e fotos do produto (se houver defeito).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Produtos que NÃO Aceitamos Troca</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Produtos usados ou lavados</li>
              <li>Produtos sem etiqueta original</li>
              <li>Produtos danificados pelo cliente</li>
            </ul>
          </section>
        </div>

        <p className="text-xs text-gray-400 mt-10 border-t pt-4">Última atualização: Junho de 2025</p>
      </div>

      <Footer />
    </main>
  )
}
