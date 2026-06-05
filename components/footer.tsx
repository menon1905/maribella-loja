'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Newsletter Section */}
      <div className="bg-primary text-primary-foreground py-12">
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
              <Button variant="outline" className="bg-white text-primary hover:bg-white/90 rounded-none uppercase text-xs tracking-widest font-semibold">
                Inscrever
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          {/* Sobre */}
          <div>
            <h4 className="text-xs font-semibold mb-5 text-white uppercase tracking-[0.2em]">Sobre Maribella</h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <Link href="/" className="hover:opacity-100 transition">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:opacity-100 transition">
                  Nossa História
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:opacity-100 transition">
                  Sustentabilidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="text-xs font-semibold mb-5 text-white uppercase tracking-[0.2em]">Categorias</h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <Link href="/categorias/bolsas" className="hover:opacity-100 transition">
                  Bolsas
                </Link>
              </li>
              <li>
                <Link href="/categorias/roupas" className="hover:opacity-100 transition">
                  Roupas
                </Link>
              </li>
              <li>
                <Link href="/categorias/calcados" className="hover:opacity-100 transition">
                  Calçados
                </Link>
              </li>
              <li>
                <Link href="/categorias/joias" className="hover:opacity-100 transition">
                  Jóias
                </Link>
              </li>
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h4 className="text-xs font-semibold mb-5 text-white uppercase tracking-[0.2em]">Atendimento</h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <a
                  href="https://wa.me/5519992394672"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-100 transition"
                >
                  Fale Conosco
                </a>
              </li>
              <li>
                <Link href="/duvidas-frequentes" className="hover:opacity-100 transition">
                  Dúvidas Frequentes
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className="hover:opacity-100 transition">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/trocas-e-devolucoes" className="hover:opacity-100 transition">
                  Termos e Condições
                </Link>
              </li>
            </ul>
          </div>

          {/* Compras */}
          <div>
            <h4 className="text-xs font-semibold mb-5 text-white uppercase tracking-[0.2em]">Compras</h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <Link href="/duvidas-frequentes" className="hover:opacity-100 transition">
                  Como Comprar
                </Link>
              </li>
              <li>
                <Link href="/prazos-e-entregas" className="hover:opacity-100 transition">
                  Frete e Entrega
                </Link>
              </li>
              <li>
                <Link href="/duvidas-frequentes" className="hover:opacity-100 transition">
                  Formas de Pagamento
                </Link>
              </li>
              <li>
                <Link href="/trocas-e-devolucoes" className="hover:opacity-100 transition">
                  Devoluções
                </Link>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h4 className="text-xs font-semibold mb-5 text-white uppercase tracking-[0.2em]">Siga a Gente</h4>
            <div className="flex gap-4">
              <Link href="https://instagram.com" target="_blank" className="hover:text-primary transition">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="https://facebook.com" target="_blank" className="hover:text-primary transition">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="https://twitter.com" target="_blank" className="hover:text-primary transition">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="mailto:contato@maribellaloja.com.br" className="hover:text-primary transition">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-xs opacity-75 mt-4">
              Email: contato@maribellaloja.com.br<br />
              WhatsApp: (19) 99239-4672
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-75">
          <p>&copy; {new Date().getFullYear()} Maribella. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <span>Métodos de Pagamento</span>
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
