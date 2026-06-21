import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Breadcrumb } from '@/components/breadcrumb'
import { CATEGORIES } from '@/lib/mock-data'
import { notFound } from 'next/navigation'
import { CategoryContent } from '@/components/category-content'
import { Suspense } from 'react'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = CATEGORIES.find(c => c.slug === slug)
  return {
    title: `${category?.name} | Maribella`,
    description: category?.description
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = CATEGORIES.find(c => c.slug === slug)

  if (!category) {
    notFound()
  }

  return (
    <>
      <main className="min-h-screen flex flex-col bg-background">
        <Header />

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: category.name, href: `/categorias/${category.slug}` }
          ]}
        />

        {/* Category Header */}
        <div className="bg-pink-50/40 py-12 border-b border-pink-100/50">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h1 className="text-3xl font-medium text-gray-900 uppercase tracking-[0.1em]">{category.name}</h1>
            <p className="text-gray-500 mt-1 font-medium text-sm">{category.description}</p>
          </div>
        </div>

        {/* Category products dynamically rendered */}
        <Suspense fallback={<div className="text-center py-12">Carregando produtos...</div>}>
          <CategoryContent slug={slug} category={category} />
        </Suspense>

        <Footer />
      </main>
    </>
  )
}
