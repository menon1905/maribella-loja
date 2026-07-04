'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useProducts } from '@/components/products-context'
import { Heart, ShoppingBag, User, Package, LogOut, ChevronRight } from 'lucide-react'
import { toast, Toaster } from 'sonner'

export default function ContaPage() {
  const router = useRouter()
  const { products } = useProducts()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'favoritos' | 'pedidos' | 'perfil'>('favoritos')
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/login')
        return
      }
      setUser(session.user)
      setLoading(false)
    }
    checkSession()

    // Load favorites from localStorage
    const favs = localStorage.getItem('maribella_favorites')
    if (favs) {
      try { setFavoriteIds(JSON.parse(favs)) } catch { /* ignore */ }
    }

    // Listen for favorites changes
    const onFavUpdate = () => {
      const favs = localStorage.getItem('maribella_favorites')
      if (favs) {
        try { setFavoriteIds(JSON.parse(favs)) } catch { /* ignore */ }
      } else {
        setFavoriteIds([])
      }
    }
    window.addEventListener('favorites-updated', onFavUpdate)
    return () => window.removeEventListener('favorites-updated', onFavUpdate)
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('maribella_cart')
    localStorage.removeItem('cart')
    window.dispatchEvent(new Event('cart-updated'))
    router.push('/')
    toast.success('Você saiu da sua conta.')
  }

  const removeFavorite = (productId: string) => {
    const updated = favoriteIds.filter(id => id !== productId)
    setFavoriteIds(updated)
    localStorage.setItem('maribella_favorites', JSON.stringify(updated))
    window.dispatchEvent(new Event('favorites-updated'))
    toast.info('Produto removido dos favoritos.')
  }

  const addFavToCart = (product: any) => {
    try {
      const cart = localStorage.getItem('cart')
      let items = cart ? JSON.parse(cart) : []
      const existingIndex = items.findIndex((item: any) => item.id === product.id)
      if (existingIndex > -1) {
        items[existingIndex].quantity += 1
      } else {
        items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          size: product.sizes?.[0],
          color: product.colors?.[0],
        })
      }
      localStorage.setItem('cart', JSON.stringify(items))
      localStorage.setItem('maribella_cart', JSON.stringify(items))
      window.dispatchEvent(new Event('cart-updated'))
      toast.success(`${product.name} adicionado ao carrinho!`)
    } catch (e) { console.error(e) }
  }

  const favoriteProducts = products.filter(p => favoriteIds.includes(p.id))

  // Sync: remove IDs from localStorage that no longer exist in products
  useEffect(() => {
    if (products.length === 0) return // wait for products to load
    const validIds = favoriteIds.filter(id => products.some(p => p.id === id))
    if (validIds.length !== favoriteIds.length) {
      setFavoriteIds(validIds)
      localStorage.setItem('maribella_favorites', JSON.stringify(validIds))
      window.dispatchEvent(new Event('favorites-updated'))
    }
  }, [products, favoriteIds])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50/30">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-7 h-7 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Carregando sua conta...</span>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />
      <Toaster position="top-right" richColors />

      {/* Page Header */}
      <div className="bg-pink-50/40 border-b border-pink-100/50 py-10">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-200 to-pink-400 flex items-center justify-center shadow">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Minha Conta</h1>
            <p className="text-gray-500 text-sm mt-0.5">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-5xl mx-auto w-full px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <aside className="md:w-56 flex-shrink-0">
            <nav className="space-y-1">
              {[
                { key: 'favoritos', label: 'Meus Favoritos', icon: Heart, badge: favoriteProducts.length },
                { key: 'pedidos',   label: 'Meus Pedidos',   icon: Package, badge: null },
                { key: 'perfil',    label: 'Perfil',         icon: User,    badge: null },
              ].map(({ key, label, icon: Icon, badge }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === key
                      ? 'bg-pink-100 text-pink-700 shadow-xs'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${activeTab === key ? 'text-pink-500' : 'text-gray-400'}`} />
                    {label}
                  </span>
                  <span className="flex items-center gap-1">
                    {badge !== null && badge > 0 && (
                      <span className="bg-pink-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {badge}
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  </span>
                </button>
              ))}

              <div className="pt-4 border-t border-gray-100 mt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sair da Conta
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">

            {/* Favoritos Tab */}
            {activeTab === 'favoritos' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                  <h2 className="text-xl font-bold text-gray-900">Meus Favoritos</h2>
                  <span className="text-sm text-gray-400 font-medium">({favoriteProducts.length} {favoriteProducts.length === 1 ? 'produto' : 'produtos'})</span>
                </div>

                {favoriteProducts.length === 0 ? (
                  <div className="text-center py-16 bg-pink-50/30 border border-pink-100 rounded-2xl">
                    <Heart className="w-12 h-12 text-pink-200 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum favorito ainda</h3>
                    <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
                      Quando você curtir um produto, ele vai aparecer aqui para você nunca perder de vista!
                    </p>
                    <Link href="/produtos">
                      <Button className="bg-[#b83070] hover:bg-[#9e2860] text-white font-bold">
                        Ver Produtos
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {favoriteProducts.map(product => (
                      <div key={product.id} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-xs hover:shadow-md transition-shadow group">
                        <Link href={`/produto/${product.id}`} className="block">
                          <div className="relative aspect-[3/4] bg-gray-50">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </Link>
                        <div className="p-3">
                          <Link href={`/produto/${product.id}`}>
                            <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 capitalize hover:text-pink-600 transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-sm font-bold text-gray-900 mt-1">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                          </p>
                          <div className="flex gap-1.5 mt-2.5">
                            <button
                              onClick={() => addFavToCart(product)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#b83070] hover:bg-[#9e2860] text-white text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              Carrinho
                            </button>
                            <button
                              onClick={() => removeFavorite(product.id)}
                              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
                              aria-label="Remover dos favoritos"
                            >
                              <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Pedidos Tab */}
            {activeTab === 'pedidos' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Package className="w-5 h-5 text-pink-500" />
                  <h2 className="text-xl font-bold text-gray-900">Meus Pedidos</h2>
                </div>
                <div className="text-center py-16 bg-gray-50 border border-gray-100 rounded-2xl">
                  <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum pedido encontrado</h3>
                  <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
                    Seus pedidos finalizados via WhatsApp aparecerão aqui em breve.
                  </p>
                  <Link href="/produtos">
                    <Button className="bg-[#b83070] hover:bg-[#9e2860] text-white font-bold">
                      Começar a Comprar
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Perfil Tab */}
            {activeTab === 'perfil' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-5 h-5 text-pink-500" />
                  <h2 className="text-xl font-bold text-gray-900">Meu Perfil</h2>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">E-mail</label>
                    <p className="text-gray-900 font-medium mt-1">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Membro desde</label>
                    <p className="text-gray-900 font-medium mt-1">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
                        : '—'}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-sm font-semibold text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair da conta
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
