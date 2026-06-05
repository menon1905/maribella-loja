import type { Metadata } from 'next'
import { Montserrat, Playfair_Display, Playball } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { WelcomePopup } from '@/components/welcome-popup'
import { ProductsProvider } from '@/components/products-context'

const montserrat = Montserrat({ subsets: ["latin"], variable: '--font-montserrat' });
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});
const playball = Playball({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-playball',
});

export const metadata: Metadata = {
  title: 'Maribella | Roupas, Bolsas, Calçados e Jóias',
  description: 'Descubra as últimas tendências em roupas, bolsas, calçados e jóias na Maribella - seu destino de estilo online.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/favicon.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.png',
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="bg-background" suppressHydrationWarning>
      <body className={`${montserrat.className} ${playfairDisplay.variable} ${playball.variable} antialiased bg-background`} suppressHydrationWarning>
        <ProductsProvider>
          {children}
        </ProductsProvider>
        <WelcomePopup />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
