'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroCarousel } from '@/components/hero-carousel'
import { BenefitsBar } from '@/components/benefits-bar'
import { FloatingActions } from '@/components/floating-actions'
import { ProductCarousel } from '@/components/product-carousel'
import { CategoryGrid } from '@/components/category-grid'
import { PromoSection } from '@/components/promo-section'
import { NewsletterSection } from '@/components/newsletter-section'
import { PROMO_ITEMS } from '@/lib/mock-data'
import { useProducts } from '@/components/products-context'

export default function Page() {
  const { products } = useProducts()
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8)
  const newProducts = products.filter(p => p.isNew).slice(0, 8)

  return (
    <>
      <main className="min-h-screen flex flex-col bg-background pb-16">
        <Header />
        
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Benefits Bar */}
        <BenefitsBar />

        {/* Categories Circular List */}
        <CategoryGrid />

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

        {/* Newsletter */}
        <NewsletterSection />

        <Footer />
      </main>

      {/* Floating Buttons */}
      <FloatingActions />
    </>
  )
}
