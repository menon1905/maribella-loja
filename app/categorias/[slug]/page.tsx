import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Breadcrumb } from '@/components/breadcrumb'
import { CATEGORIES } from '@/lib/mock-data'
import { CategoryContent } from '@/components/category-content'
import { Suspense } from 'react'
import { createClient } from '@supabase/supabase-js'

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

// Fetch category from Supabase (server-side, no auth needed for public data)
async function getCategoryBySlug(slug: string) {
  // First check static data
  const staticCat = CATEGORIES.find(c => c.slug === slug)
  if (staticCat) return staticCat

  // Then check Supabase
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) return null

    const client = createClient(supabaseUrl, supabaseKey)
    const { data } = await client
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .is('parent_slug', null)
      .single()

    if (data) {
      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        image: data.image || '/home_roupas.jpeg',
        imagePosition: data.image_position || 'center',
        description: data.description || '',
        display_order: data.display_order || 0,
      }
    }
  } catch {
    // Silently fail, will show empty category page
  }

  return null
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  return {
    title: `${category?.name ?? slug} | Maribella`,
    description: category?.description ?? `Confira os produtos da categoria ${slug} na Maribella.`
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  // If category not found anywhere, show a graceful "empty" page instead of 404
  const displayCategory = category ?? {
    id: slug,
    name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
    slug,
    image: '/home_roupas.jpeg',
    description: '',
  }

  return (
    <>
      <main className="min-h-screen flex flex-col bg-background">
        <Header />

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: displayCategory.name, href: `/categorias/${displayCategory.slug}` }
          ]}
        />

        {/* Category Header */}
        <div className="bg-pink-50/40 py-12 border-b border-pink-100/50">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h1 className="text-3xl font-medium text-gray-900 uppercase tracking-[0.1em]">{displayCategory.name}</h1>
            <p className="text-gray-500 mt-1 font-medium text-sm">{displayCategory.description}</p>
          </div>
        </div>

        {/* Category products dynamically rendered */}
        <Suspense fallback={<div className="text-center py-12">Carregando produtos...</div>}>
          <CategoryContent slug={slug} category={displayCategory} />
        </Suspense>

        <Footer />
      </main>
    </>
  )
}
