'use client'

import Link from 'next/link'
import { Instagram, Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 text-gray-600">
      {/* Newsletter Section */}
      <div className="bg-[#ff9edb] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-2 tracking-wide">Fique por dentro das novidades</h3>
              <p className="text-sm opacity-80 tracking-wide">Receba ofertas exclusivas e dicas de moda diretamente no seu email</p>
            </div>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Seu e-mail"
                className="bg-white text-foreground placeholder:text-muted-foreground"
              />
              <Button variant="outline" className="bg-white text-[#ff9edb] hover:bg-white/90 hover:text-[#ff80cb] rounded-none uppercase text-xs tracking-widest font-semibold">
                Inscrever
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Sobre */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-wider">ENCANTO MARIBELLA</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Moda feminina selecionada com amor, unindo elegância, delicadeza e as últimas tendências para o seu dia a dia.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-xs font-semibold mb-5 text-gray-900 uppercase tracking-[0.2em]">Menu</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/produtos" className="hover:text-primary transition">
                  Todos os Produtos
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-primary transition">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/prazos-e-entregas" className="hover:text-primary transition">
                  Prazos e Entregas
                </Link>
              </li>
              <li>
                <Link href="/trocas-e-devolucoes" className="hover:text-primary transition">
                  Trocas e Devoluções
                </Link>
              </li>
            </ul>
          </div>

          {/* Dúvidas */}
          <div>
            <h4 className="text-xs font-semibold mb-5 text-gray-900 uppercase tracking-[0.2em]">Ajuda</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/duvidas-frequentes" className="hover:text-primary transition">
                  Como Comprar
                </Link>
              </li>
              <li>
                <Link href="/duvidas-frequentes" className="hover:text-primary transition">
                  Dúvidas Frequentes
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className="hover:text-primary transition">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h4 className="text-xs font-semibold mb-5 text-gray-900 uppercase tracking-[0.2em]">Siga a Gente</h4>
            <div className="flex gap-4 text-gray-700">
              <Link href="https://instagram.com/encanto_maribella" target="_blank" className="hover:text-primary transition">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="mailto:encantomaribella@gmail.com" className="hover:text-primary transition">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
              Email: encantomaribella@gmail.com<br />
              WhatsApp: (19) 99239-4672
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Maribella. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <span className="text-gray-400">Métodos de Pagamento</span>
            <div className="flex gap-2">
              <span>💳</span>
              <span>🏦</span>
              <span>📱</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
