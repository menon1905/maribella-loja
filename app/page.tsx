import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroCarousel } from '@/components/hero-carousel'
import { ProductCarousel } from '@/components/product-carousel'
import { CategoryGrid } from '@/components/category-grid'
import { PromoSection } from '@/components/promo-section'
import { NewsletterSection } from '@/components/newsletter-section'
import { PromoTicker } from '@/components/promo-ticker'
import { PRODUCTS, CATEGORIES, PROMO_ITEMS } from '@/lib/mock-data'

export const metadata = {
  title: 'Closet Twins - Moda, Acessórios e Beleza',
  description: 'Descubra moda, acessórios e produtos de beleza na Closet Twins - seu destino de estilo.',
  openGraph: {
    title: 'Closet Twins',
    description: 'Sua loja de moda, acessórios e beleza online',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
      }
    ]
  }
}

export default function Page() {
  const featuredProducts = PRODUCTS.filter(p => p.isFeatured).slice(0, 8)
  const newProducts = PRODUCTS.filter(p => p.isNew).slice(0, 8)

  return (
    <>
      <PromoTicker />
      <main className="min-h-screen flex flex-col bg-background">
        <Header />
        
        {/* Hero Carousel */}
        <HeroCarousel />

      {/* Featured Products */}
      <ProductCarousel 
        products={featuredProducts} 
        title="Produtos em Destaque"
        viewAllHref="/produtos"
      />

      {/* Promo Section */}
      <PromoSection items={PROMO_ITEMS} />

      {/* New Arrivals */}
      <ProductCarousel 
        products={newProducts} 
        title="Novidades"
        viewAllHref="/produtos?filter=new"
      />

      {/* Categories */}
      <CategoryGrid categories={CATEGORIES} />

        {/* Newsletter */}
        <NewsletterSection />

        <Footer />
      </main>
    </>
  )
}
