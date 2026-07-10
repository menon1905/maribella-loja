import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dúvidas Frequentes | Maribella',
  description: 'Encontre respostas para as perguntas mais comuns sobre compras, entrega e produtos Maribella.',
}

const faqs = [
  {
    question: 'Como faço para comprar?',
    answer:
      'É simples! Navegue pelas categorias, escolha os produtos que desejar, adicione ao carrinho e finalize o pedido. Você será redirecionada para o nosso WhatsApp para confirmar o pagamento e a entrega.',
  },
  {
    question: 'Quais são as formas de pagamento?',
    answer:
      'Aceitamos PIX (com desconto especial), transferência bancária, cartão de crédito e débito (via link de pagamento). Tudo combinado diretamente no nosso WhatsApp.',
  },
  {
    question: 'Como rastrear meu pedido?',
    answer:
      'Após o envio, você receberá o código de rastreamento pelo WhatsApp. Basta acessar o site dos Correios e inserir o código para acompanhar a entrega em tempo real.',
  },
  {
    question: 'Posso trocar o tamanho se não servir?',
    answer:
      'Sim! Aceitamos trocas em até 7 dias corridos após o recebimento. O produto deve estar sem uso e com as etiquetas originais. Entre em contato pelo WhatsApp para iniciar o processo.',
  },
  {
    question: 'Vocês têm loja física?',
    answer:
      'Por enquanto somos uma loja 100% online, o que nos permite oferecer preços melhores e uma experiência de compra prática e personalizada diretamente pelo WhatsApp.',
  },
  {
    question: 'O frete é grátis?',
    answer:
      'Sim! Oferecemos frete grátis via PAC para compras acima de R$ 400,00 exclusivamente para a cidade de Campinas/SP. Para as demais cidades ou compras de menor valor, o frete é calculado de acordo com o seu CEP.',
  },

  {
    question: 'Os produtos são originais?',
    answer:
      'Com certeza! Todos os nossos produtos são selecionados com muito cuidado, garantindo qualidade e autenticidade em cada peça.',
  },
  {
    question: 'Como entro em contato com a Maribella?',
    answer:
      'A forma mais rápida é pelo nosso WhatsApp, clicando no botão verde no canto da tela. Você também pode enviar um e-mail para contato@maribellaloja.com.br.',
  },
  {
    question: 'Posso cancelar meu pedido?',
    answer:
      'O cancelamento pode ser solicitado antes do envio do produto. Após o envio, siga nossa política de devoluções. Entre em contato imediatamente pelo WhatsApp caso precise cancelar.',
  },
]

export default function DuvidasFrequentesPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-pink-50/40 border-b border-pink-100/50">
        <div className="max-w-4xl mx-auto px-4 py-3 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#ff9edb] transition-colors">Início</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Dúvidas Frequentes</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow max-w-4xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Dúvidas Frequentes</h1>
        <p className="text-gray-500 mb-10">Encontre aqui as respostas para as perguntas mais comuns. Não encontrou o que procura? Fale conosco!</p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer bg-white hover:bg-pink-50/40 transition-colors duration-200 list-none">
                <span className="font-semibold text-gray-800 text-sm pr-4">{faq.question}</span>
                <span className="text-[#ff9edb] text-xl font-bold flex-shrink-0 transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6 pt-2 bg-white">
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-[#ff9edb] rounded-2xl p-8 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Ainda tem dúvidas?</h3>
          <p className="text-white/80 text-sm mb-5">Nossa equipe está sempre pronta para te ajudar!</p>
          <a
            href="https://wa.me/5519992394672?text=Ol%C3%A1%2C%20tenho%20uma%20d%C3%BAvida!"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#ff9edb] font-bold px-8 py-3 rounded-full hover:bg-pink-50 transition-colors duration-200 shadow-md"
          >
            💬 Falar no WhatsApp
          </a>
        </div>

        <p className="text-xs text-gray-400 mt-10 border-t pt-4">Última atualização: Junho de 2025</p>
      </div>

      <Footer />
    </main>
  )
}
