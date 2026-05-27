import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PromoTicker } from '@/components/promo-ticker'
import { ProductCard } from '@/components/product-card'
import { PRODUCTS } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Todos os Produtos | Closet Twins',
  description: 'Confira todos os produtos disponíveis na Closet Twins'
}

export default function ProductsPage() {
  return (
    <>
      <PromoTicker />
      <main className="min-h-screen flex flex-col bg-background">
        <Header />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-12 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Todos os Produtos</h1>
          <p className="text-muted-foreground">Navegue por nossa coleção completa de itens</p>
        </div>
      </div>

      {/* Filters and Products */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="space-y-6 sticky top-20">
              {/* Categories */}
              <div>
                <h3 className="font-bold mb-4">Categorias</h3>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>Bolsas</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>Roupas</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>Calçados</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>Acessórios</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>Jóias</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>Maquiagem</span>
                  </label>
                </div>
              </div>

              {/* Filters */}
              <div>
                <h3 className="font-bold mb-4">Filtros</h3>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>Mais Vendidos</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>Em Promoção</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>Novidades</span>
                  </label>
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="font-bold mb-4">Faixa de Preço</h3>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>Até R$ 100</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>R$ 100 - R$ 300</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>Acima de R$ 300</span>
                  </label>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-bold mb-4">Avaliação</h3>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>★★★★★ (5 estrelas)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>★★★★☆ e acima</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>★★★☆☆ e acima</span>
                  </label>
                </div>
              </div>

              {/* Stock */}
              <div>
                <h3 className="font-bold mb-4">Disponibilidade</h3>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>Em Estoque</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>Incluir Indisponíveis</span>
                  </label>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Limpar Filtros
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Mostrando {PRODUCTS.length} produtos
              </p>
              <select className="text-sm border rounded px-3 py-2">
                <option>Mais Relevantes</option>
                <option>Menor Preço</option>
                <option>Maior Preço</option>
                <option>Mais Vendidos</option>
                <option>Novidades</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex items-center justify-center gap-2">
              <Button variant="outline" disabled>
                Anterior
              </Button>
              <Button variant="outline" className="bg-primary text-primary-foreground hover:bg-primary/90">
                1
              </Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Próxima</Button>
            </div>
          </div>
        </div>
      </div>

        <Footer />
      </main>
    </>
  )
}
