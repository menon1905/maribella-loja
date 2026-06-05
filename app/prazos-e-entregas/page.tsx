import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prazos e Entregas | Maribella',
  description: 'Informações sobre prazos de entrega, frete e rastreamento dos seus pedidos.',
}

export default function PrazosEntregasPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-pink-50/40 border-b border-pink-100/50">
        <div className="max-w-4xl mx-auto px-4 py-3 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#ff9edb] transition-colors">Início</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Prazos e Entregas</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow max-w-4xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Prazos e Entregas</h1>

        {/* Info Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-pink-50 border border-pink-100 rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">🚚</div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Entrega em Todo BR</h3>
            <p className="text-xs text-gray-500">Enviamos para todo o Brasil via Correios</p>
          </div>
          <div className="bg-pink-50 border border-pink-100 rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">🎁</div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Frete Grátis</h3>
            <p className="text-xs text-gray-500">Compras acima de R$ 150,00</p>
          </div>
          <div className="bg-pink-50 border border-pink-100 rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">📦</div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Embalagem Especial</h3>
            <p className="text-xs text-gray-500">Seus produtos chegam com cuidado e carinho</p>
          </div>
        </div>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Prazos de Envio</h2>
            <p className="mb-4">
              Após a confirmação do seu pedido pelo WhatsApp, preparamos e enviamos em até <strong>2 dias úteis</strong>.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-[#ff9edb] text-white">
                  <tr>
                    <th className="py-3 px-5 text-left font-semibold">Região</th>
                    <th className="py-3 px-5 text-left font-semibold">Prazo Estimado</th>
                    <th className="py-3 px-5 text-left font-semibold">Frete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-pink-50/30">
                    <td className="py-3 px-5">São Paulo (Capital)</td>
                    <td className="py-3 px-5">2 a 5 dias úteis</td>
                    <td className="py-3 px-5 text-green-600 font-medium">A calcular</td>
                  </tr>
                  <tr className="hover:bg-pink-50/30">
                    <td className="py-3 px-5">Sudeste</td>
                    <td className="py-3 px-5">3 a 7 dias úteis</td>
                    <td className="py-3 px-5 text-green-600 font-medium">A calcular</td>
                  </tr>
                  <tr className="hover:bg-pink-50/30">
                    <td className="py-3 px-5">Sul e Centro-Oeste</td>
                    <td className="py-3 px-5">5 a 10 dias úteis</td>
                    <td className="py-3 px-5 text-green-600 font-medium">A calcular</td>
                  </tr>
                  <tr className="hover:bg-pink-50/30">
                    <td className="py-3 px-5">Nordeste e Norte</td>
                    <td className="py-3 px-5">7 a 15 dias úteis</td>
                    <td className="py-3 px-5 text-green-600 font-medium">A calcular</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">* Os prazos são estimados e podem variar de acordo com a região e período de alta demanda.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Rastreamento do Pedido</h2>
            <p>
              Após o envio, você receberá o código de rastreamento pelo WhatsApp. Acompanhe pelo site dos{' '}
              <a
                href="https://www.correios.com.br/rastreamento"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff9edb] hover:underline font-medium"
              >
                Correios
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Formas de Frete</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>PAC</strong> — Econômico, prazo maior</li>
              <li><strong>SEDEX</strong> — Expresso, entrega mais rápida</li>
              <li><strong>Frete Grátis</strong> — Em compras acima de R$ 150,00 (PAC)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Dúvidas?</h2>
            <p>
              Entre em contato via{' '}
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff9edb] hover:underline font-medium"
              >
                WhatsApp
              </a>{' '}
              ou pelo e-mail{' '}
              <a href="mailto:contato@maribellaloja.com.br" className="text-[#ff9edb] hover:underline">
                contato@maribellaloja.com.br
              </a>
              .
            </p>
          </section>
        </div>

        <p className="text-xs text-gray-400 mt-10 border-t pt-4">Última atualização: Junho de 2025</p>
      </div>

      <Footer />
    </main>
  )
}
