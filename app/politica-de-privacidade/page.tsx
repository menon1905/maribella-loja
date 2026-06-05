import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade | Maribella',
  description: 'Saiba como a Maribella coleta, usa e protege seus dados pessoais.',
}

export default function PoliticaPrivacidadePage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-pink-50/40 border-b border-pink-100/50">
        <div className="max-w-4xl mx-auto px-4 py-3 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#ff9edb] transition-colors">Início</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Política de Privacidade</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow max-w-4xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Privacidade</h1>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
          <p>
            Na <strong className="text-[#ff9edb]">Maribella</strong>, sua privacidade é nossa prioridade. Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais quando você utiliza nosso site e serviços.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8">1. Informações que Coletamos</h2>
          <p>Coletamos as seguintes informações quando você realiza uma compra ou se cadastra:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Nome completo</li>
            <li>Endereço de e-mail</li>
            <li>Número de telefone</li>
            <li>Endereço de entrega</li>
            <li>Dados de navegação no site (cookies)</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mt-8">2. Como Usamos suas Informações</h2>
          <p>Suas informações são utilizadas para:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Processar e entregar seus pedidos</li>
            <li>Enviar atualizações sobre seus pedidos</li>
            <li>Melhorar nossa experiência de compra</li>
            <li>Enviar ofertas e promoções (apenas com seu consentimento)</li>
            <li>Cumprir obrigações legais</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mt-8">3. Compartilhamento de Dados</h2>
          <p>
            Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto quando necessário para processar pagamentos ou realizar entregas, sempre com parceiros confiáveis que seguem as mesmas práticas de privacidade.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8">4. Cookies</h2>
          <p>
            Utilizamos cookies para melhorar sua experiência de navegação. Você pode desativar os cookies nas configurações do seu navegador, porém isso pode afetar algumas funcionalidades do site.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8">5. Seus Direitos</h2>
          <p>Você tem o direito de:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Acessar seus dados pessoais</li>
            <li>Solicitar a correção de dados incorretos</li>
            <li>Solicitar a exclusão de seus dados</li>
            <li>Revogar seu consentimento a qualquer momento</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mt-8">6. Contato</h2>
          <p>
            Para dúvidas sobre esta política, entre em contato conosco pelo e-mail{' '}
            <a href="mailto:contato@maribellaloja.com.br" className="text-[#ff9edb] hover:underline">
              contato@maribellaloja.com.br
            </a>{' '}
            ou pelo WhatsApp.
          </p>

          <p className="text-xs text-gray-400 mt-10 border-t pt-4">Última atualização: Junho de 2025</p>
        </div>
      </div>

      <Footer />
    </main>
  )
}
