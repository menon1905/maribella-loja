import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Breadcrumb } from '@/components/breadcrumb'
import { RoupasSubcategoryGrid } from '@/components/roupas-subcategory-grid'
import { CategoryContent } from '@/components/category-content'
import { CATEGORIES } from '@/lib/mock-data'
import { Suspense } from 'react'

export const metadata = {
  title: 'Roupas | Maribella',
  description: 'Looks incríveis para qualquer ocasião',
}

interface RoupasPageProps {
  searchParams: Promise<{ sub?: string }>
}

export default async function RoupasPage({ searchParams }: RoupasPageProps) {
  const { sub } = await searchParams
  const category = CATEGORIES.find((c) => c.slug === 'roupas')!

  /* ── No sub param → show the subcategory circle grid ── */
  if (!sub) {
    return (
      <main className="min-h-screen flex flex-col bg-white">
        <Header />
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Roupas', href: '/categorias/roupas' },
          ]}
        />

        {/* Page header */}
        <div className="bg-pink-50/50 py-10 border-b border-pink-100/50">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h1 className="text-3xl font-medium text-gray-900 uppercase tracking-[0.1em]">
              Roupas
            </h1>
            <p className="text-gray-500 mt-1 font-medium text-sm">
              Escolha uma categoria para começar
            </p>
          </div>
        </div>

        <RoupasSubcategoryGrid />

        <Footer />
      </main>
    )
  }

  /* ── Sub param present → show filtered product list ── */
  const subLabel = sub === 'todas' ? 'Todas as Roupas' : sub

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Roupas', href: '/categorias/roupas' },
          { label: subLabel, href: `/categorias/roupas?sub=${sub}` },
        ]}
      />

      <div className="bg-pink-50/40 py-12 border-b border-pink-100/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-medium text-gray-900 uppercase tracking-[0.1em]">
            {subLabel}
          </h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">
            {category.description}
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="text-center py-12">Carregando produtos...</div>}>
        <CategoryContent slug="roupas" category={category} />
      </Suspense>

      <Footer />
    </main>
  )
}
