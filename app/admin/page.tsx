'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProducts } from '@/components/products-context'
import { Product, CATEGORIES } from '@/lib/mock-data'
import { supabase, getUserRole } from '@/lib/supabase'
import { Toaster, toast } from 'sonner'
import {
  Trash2,
  Edit3,
  Plus,
  ArrowLeft,
  Image as ImageIcon,
  Search,
  Package,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  X,
  Eye,
} from 'lucide-react'

const TAMANHOS_PADRAO = ['P', 'M', 'G', 'GG', '34', '35', '36', '37', '38', '39', '40', 'U']
const CORES_PADRAO = ['Preto', 'Branco', 'Cinza', 'Nude', 'Rosa', 'Azul', 'Verde', 'Caramelo', 'Ouro', 'Prata', 'Vermelho', 'Rose Gold']

// ─── Auth Guard Wrapper ────────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const role = await getUserRole(session.user.id)
        if (role === 'admin') {
          setIsAuthorized(true)
        } else {
          router.replace('/login')
        }
      } else {
        router.replace('/login')
      }
      setAuthChecked(true)
    }
    checkAuth()
  }, [router])

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-7 h-7 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Verificando acesso...</span>
        </div>
      </div>
    )
  }

  if (!isAuthorized) return null

  return <AdminDashboard />
}

// ─── Admin Dashboard (all hooks safe here) ────────────────────────────────────
function AdminDashboard() {
  const { products, addProduct, updateProduct, deleteProduct, isLoading } = useProducts()

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('todos')
  const [stockFilter, setStockFilter] = useState('todos')
  const [featuredFilter, setFeaturedFilter] = useState('todos')

  // Modal states
  const [isOpen, setIsOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    category: CATEGORIES[0]?.slug || 'roupas',
    inStock: true,
    isNew: false,
    isFeatured: false,
  })

  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [subImagesInput, setSubImagesInput] = useState<string[]>([])
  const [newSubImageUrl, setNewSubImageUrl] = useState('')
  const [customSizeInput, setCustomSizeInput] = useState('')
  const [customColorInput, setCustomColorInput] = useState('')

  // Statistics
  const stats = useMemo(() => ({
    total: products.length,
    outOfStock: products.filter(p => !p.inStock).length,
    featured: products.filter(p => p.isFeatured).length,
    newArrivals: products.filter(p => p.isNew).length,
  }), [products])

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === 'todos' || p.category === categoryFilter
      const matchesStock = stockFilter === 'todos' ||
                           (stockFilter === 'ativo' && p.inStock) ||
                           (stockFilter === 'esgotado' && !p.inStock)
      const matchesFeatured = featuredFilter === 'todos' ||
                              (featuredFilter === 'destaque' && p.isFeatured) ||
                              (featuredFilter === 'novidade' && p.isNew)
      return matchesSearch && matchesCategory && matchesStock && matchesFeatured
    })
  }, [products, searchTerm, categoryFilter, stockFilter, featuredFilter])

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      image: '',
      category: CATEGORIES[0]?.slug || 'roupas',
      inStock: true,
      isNew: false,
      isFeatured: false,
    })
    setSelectedSizes([])
    setSelectedColors([])
    setSubImagesInput([])
    setNewSubImageUrl('')
    setCustomSizeInput('')
    setCustomColorInput('')
    setEditingProduct(null)
  }

  const handleOpenAdd = () => {
    resetForm()
    setIsOpen(true)
  }

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p)
    setFormData({
      name: p.name,
      description: p.description,
      price: p.price.toString(),
      originalPrice: p.originalPrice ? p.originalPrice.toString() : '',
      image: p.image,
      category: p.category,
      inStock: p.inStock,
      isNew: p.isNew || false,
      isFeatured: p.isFeatured || false,
    })
    setSelectedSizes(p.sizes || [])
    setSelectedColors(p.colors || [])
    setSubImagesInput(p.images || [])
    setNewSubImageUrl('')
    setIsOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o produto "${name}"?`)) {
      try {
        await deleteProduct(id)
        toast.success(`Produto "${name}" excluído com sucesso!`)
      } catch {
        toast.error('Erro ao excluir produto.')
      }
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])
  }

  const toggleColor = (color: string) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color])
  }

  const addCustomSize = () => {
    const val = customSizeInput.trim().toUpperCase()
    if (!val) return
    if (!selectedSizes.includes(val)) setSelectedSizes(prev => [...prev, val])
    setCustomSizeInput('')
  }

  const addCustomColor = () => {
    const val = customColorInput.trim()
    if (!val) return
    const cap = val.charAt(0).toUpperCase() + val.slice(1)
    if (!selectedColors.includes(cap)) setSelectedColors(prev => [...prev, cap])
    setCustomColorInput('')
  }

  const handleAddSubImage = () => {
    if (!newSubImageUrl.trim()) return
    if (subImagesInput.includes(newSubImageUrl.trim())) {
      toast.warning('Esta imagem já foi adicionada.')
      return
    }
    setSubImagesInput(prev => [...prev, newSubImageUrl.trim()])
    setNewSubImageUrl('')
  }

  const handleRemoveSubImage = (index: number) => {
    setSubImagesInput(prev => prev.filter((_, idx) => idx !== index))
  }

  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMainImage: boolean) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]

    try {
      setIsUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
      const filePath = `${fileName}`

      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      if (isMainImage) {
        setFormData(prev => ({ ...prev, image: publicUrl }))
        toast.success('Imagem principal carregada com sucesso!')
      } else {
        setSubImagesInput(prev => [...prev, publicUrl])
        toast.success('Imagem adicionada à galeria secundária!')
      }
    } catch (err: any) {
      console.error(err)
      toast.error(`Falha no upload: ${err.message || 'Erro desconhecido'}`)
    } finally {
      setIsUploading(false)
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.image.trim()) {
      toast.error('A imagem principal é obrigatória.')
      return
    }
    const productPayload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      image: formData.image,
      images: subImagesInput.length > 0 ? subImagesInput : [formData.image],
      category: formData.category,
      inStock: formData.inStock,
      isNew: formData.isNew,
      isFeatured: formData.isFeatured,
      sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
      colors: selectedColors.length > 0 ? selectedColors : undefined,
      rating: 5,
      reviews: 0,
    }
    try {
      if (editingProduct) {
        await updateProduct({ ...editingProduct, ...productPayload })
        toast.success('Produto atualizado com sucesso!')
      } else {
        await addProduct(productPayload)
        toast.success('Produto adicionado com sucesso!')
      }
      setIsOpen(false)
      resetForm()
    } catch {
      toast.error('Erro ao salvar produto.')
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      <Toaster position="top-right" richColors />

      {/* Hero Header */}
      <div className="bg-white border-b border-pink-100/60 py-8 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-pink-500 font-bold uppercase tracking-wider mb-2">
              <Link href="/" className="hover:text-pink-600 flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar à Loja
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Painel de Administração</h1>
            <p className="text-gray-500 text-sm mt-0.5">Gerenciamento completo do catálogo de produtos em tempo real.</p>
          </div>
          <Button
            onClick={handleOpenAdd}
            className="bg-primary hover:bg-[#ffbfe7] hover:text-[#db459b] text-white font-bold tracking-wide uppercase text-xs px-6 py-6 rounded-full flex items-center gap-2 cursor-pointer shadow-sm self-start md:self-center transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" /> Adicionar Produto
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Produtos Totais', value: stats.total, icon: Package, color: 'blue' },
            { label: 'Fora de Estoque', value: stats.outOfStock, icon: AlertTriangle, color: 'yellow' },
            { label: 'Novidades', value: stats.newArrivals, icon: Sparkles, color: 'pink' },
            { label: 'Em Destaque', value: stats.featured, icon: TrendingUp, color: 'purple' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
              <div className={`p-3 bg-${color}-50 text-${color}-600 rounded-xl`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-0.5">{isLoading ? '...' : value}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden">

          {/* Filters */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="relative flex-grow max-w-lg">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome ou descrição..."
                className="pl-9 bg-white border-gray-200 focus-visible:ring-[#ff9edb]"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 lg:flex lg:items-center">
              {[
                { value: categoryFilter, setter: setCategoryFilter, options: [{ v: 'todos', l: 'Todas Categorias' }, ...CATEGORIES.map(c => ({ v: c.slug, l: c.name }))] },
                { value: stockFilter, setter: setStockFilter, options: [{ v: 'todos', l: 'Todos Estoques' }, { v: 'ativo', l: 'Em Estoque' }, { v: 'esgotado', l: 'Esgotado' }] },
                { value: featuredFilter, setter: setFeaturedFilter, options: [{ v: 'todos', l: 'Todos Destaques' }, { v: 'destaque', l: 'Destaque' }, { v: 'novidade', l: 'Novidade' }] },
              ].map(({ value, setter, options }, idx) => (
                <select key={idx} value={value} onChange={e => setter(e.target.value)}
                  className="h-10 px-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ff9edb] cursor-pointer">
                  {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              ))}
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  <th className="py-4 px-6">Produto</th>
                  <th className="py-4 px-6">Categoria</th>
                  <th className="py-4 px-6">Preço</th>
                  <th className="py-4 px-6">Propriedades</th>
                  <th className="py-4 px-6">Estoque</th>
                  <th className="py-4 px-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                        <span>Carregando catálogo...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-400 italic">
                      Nenhum produto corresponde aos filtros aplicados.
                    </td>
                  </tr>
                ) : filteredProducts.map((p, idx) => (
                  <tr 
                    key={p.id} 
                    className={`transition-colors hover:bg-pink-100/50 border-b border-gray-200 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-100'
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                          <Image src={p.image} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 leading-tight">{p.name}</p>
                          <p className="text-xs text-gray-400 mt-1 max-w-[260px] truncate">{p.description}</p>
                          {p.images && p.images.length > 1 && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded mt-1.5 font-medium">
                              <ImageIcon className="w-2.5 h-2.5" /> +{p.images.length - 1} sub-imagens
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 capitalize font-semibold text-gray-500">{p.category}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">R$ {p.price.toFixed(2)}</span>
                        {p.originalPrice && <span className="text-xs text-gray-400 line-through">R$ {p.originalPrice.toFixed(2)}</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6 space-y-1">
                      {p.isFeatured && <span className="inline-block mr-1 bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-purple-100">Destaque</span>}
                      {p.isNew && <span className="inline-block mr-1 bg-pink-50 text-pink-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-pink-100">Novo</span>}
                      {!p.isFeatured && !p.isNew && <span className="text-xs text-gray-400">Sem destaque</span>}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${p.inStock ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                        {p.inStock ? 'Ativo' : 'Esgotado'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link href={`/produto/${p.id}`} target="_blank">
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full h-8 w-8" title="Visualizar na Loja">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(p)} className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full h-8 w-8" title="Editar">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id, p.name)} className="text-rose-500 hover:text-rose-700 hover:bg-rose-50/50 rounded-full h-8 w-8" title="Excluir">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-3xl my-8 overflow-hidden z-10 animate-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
                  {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Preencha os campos para salvar no catálogo.</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1.5 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

              {/* Informações Básicas */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#ff80cb] uppercase tracking-widest border-b border-gray-100 pb-1">Informações Básicas</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Nome do Produto</label>
                    <Input name="name" value={formData.name} onChange={handleFormChange} placeholder="Ex: Vestido Fleur Pink" required className="focus-visible:ring-[#ff9edb] border-gray-200" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Categoria</label>
                    <select name="category" value={formData.category} onChange={handleFormChange}
                      className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ff9edb] cursor-pointer">
                      {CATEGORIES.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Descrição</label>
                  <textarea name="description" value={formData.description} onChange={handleFormChange}
                    placeholder="Descreva os detalhes do produto..." rows={3} required
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9edb]" />
                </div>
              </div>

              {/* Preço & Estoque */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-[#ff80cb] uppercase tracking-widest border-b border-gray-100 pb-1">Preço & Estoque</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Preço de Venda (R$)</label>
                    <Input name="price" value={formData.price} onChange={handleFormChange} placeholder="149.90" type="number" step="0.01" required className="focus-visible:ring-[#ff9edb] border-gray-200" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Preço Riscado (Opcional)</label>
                    <Input name="originalPrice" value={formData.originalPrice} onChange={handleFormChange} placeholder="199.90" type="number" step="0.01" className="focus-visible:ring-[#ff9edb] border-gray-200" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Disponibilidade</label>
                    <div className="flex h-10 items-center">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                        <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleFormChange} className="rounded w-4 h-4 border-gray-300 cursor-pointer" />
                        Em Estoque
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Galeria */}
              <div className="space-y-6 pt-2">
                <h4 className="text-xs font-bold text-[#ff80cb] uppercase tracking-widest border-b border-gray-100 pb-1">Galeria de Imagens</h4>
                
                {/* Imagem Principal */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Imagem Principal do Produto</label>
                  <div className="grid sm:grid-cols-2 gap-4 items-start">
                    <div className="space-y-3">
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors relative cursor-pointer group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, true)}
                          disabled={isUploading}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center text-center gap-1.5 pointer-events-none">
                          <Plus className="w-5 h-5 text-gray-400 group-hover:text-[#ff80cb] transition-colors" />
                          <span className="text-xs font-semibold text-gray-600">Upload de Arquivo</span>
                          <span className="text-[10px] text-gray-400">Arraste ou clique para selecionar</span>
                        </div>
                      </div>
                      <div className="relative flex items-center justify-center">
                        <span className="absolute bg-white px-2 text-[10px] uppercase font-bold text-gray-400">ou insira a URL</span>
                        <div className="w-full border-t border-gray-100" />
                      </div>
                      <Input 
                        name="image" 
                        value={formData.image} 
                        onChange={handleFormChange} 
                        placeholder="https://exemplo.com/imagem.png" 
                        required 
                        className="focus-visible:ring-[#ff9edb] border-gray-200" 
                      />
                    </div>

                    {formData.image && (
                      <div className="relative w-full aspect-square max-w-[150px] sm:max-w-none rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                        <Image src={formData.image} alt="Preview Principal" fill className="object-cover" />
                        <span className="absolute bottom-0 inset-x-0 text-[9px] bg-black/60 text-white text-center py-1 font-bold uppercase tracking-wider">Principal</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Galeria Secundária */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Galeria Secundária (Sub-imagens)</label>
                  <div className="grid sm:grid-cols-2 gap-4 items-start">
                    <div className="space-y-3">
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors relative cursor-pointer group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, false)}
                          disabled={isUploading}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center text-center gap-1.5 pointer-events-none">
                          <Plus className="w-5 h-5 text-gray-400 group-hover:text-[#ff80cb] transition-colors" />
                          <span className="text-xs font-semibold text-gray-600">Upload para Galeria</span>
                          <span className="text-[10px] text-gray-400">Adicione múltiplas sub-imagens</span>
                        </div>
                      </div>
                      <div className="relative flex items-center justify-center">
                        <span className="absolute bg-white px-2 text-[10px] uppercase font-bold text-gray-400">ou adicione via URL</span>
                        <div className="w-full border-t border-gray-100" />
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          value={newSubImageUrl} 
                          onChange={e => setNewSubImageUrl(e.target.value)}
                          placeholder="Link da imagem..."
                          className="focus-visible:ring-[#ff9edb] border-gray-200"
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubImage() } }}
                        />
                        <Button type="button" onClick={handleAddSubImage} className="bg-slate-800 hover:bg-slate-900 text-white font-bold cursor-pointer text-xs shrink-0 px-4">
                          Adicionar
                        </Button>
                      </div>
                    </div>

                    <div>
                      {subImagesInput.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2.5 max-h-[160px] overflow-y-auto p-1 border border-gray-100 rounded-2xl bg-gray-50/50">
                          {subImagesInput.map((url, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white group">
                              <Image src={url} alt={`Sub ${idx}`} fill className="object-cover" />
                              <button 
                                type="button" 
                                onClick={() => handleRemoveSubImage(idx)}
                                className="absolute -top-1 -right-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow-sm cursor-pointer opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full min-h-[120px] flex items-center justify-center border border-gray-100 rounded-2xl bg-gray-50/50 text-center p-4">
                          <p className="text-[11px] text-gray-400 italic">Nenhuma sub-imagem adicionada ainda.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>


              {/* Atributos */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-[#ff80cb] uppercase tracking-widest border-b border-gray-100 pb-1">Atributos & Destaques</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <label className={`flex items-start gap-3 cursor-pointer rounded-xl border p-3 transition-all ${formData.isNew ? 'border-pink-300 bg-pink-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleFormChange} className="mt-0.5 rounded w-4 h-4 border-gray-300 cursor-pointer accent-[#ff9edb]" />
                    <div>
                      <p className="text-sm font-bold text-gray-800">Marcar como Novidade</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Aparece na seção &quot;Novidades&quot; da home</p>
                    </div>
                  </label>
                  <label className={`flex items-start gap-3 cursor-pointer rounded-xl border p-3 transition-all ${formData.isFeatured ? 'border-[#ff9edb] bg-[#fff0fa]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleFormChange} className="mt-0.5 rounded w-4 h-4 border-gray-300 cursor-pointer accent-[#ff9edb]" />
                    <div>
                      <p className="text-sm font-bold text-gray-800">Destacar na Home ⭐</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Aparece em &quot;Produtos em Destaque&quot;</p>
                    </div>
                  </label>
                </div>

                {/* Tamanhos */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Tamanhos Disponíveis</label>
                  <div className="flex flex-wrap gap-1.5">
                    {TAMANHOS_PADRAO.map(size => (
                      <button key={size} type="button" onClick={() => toggleSize(size)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border transition-all cursor-pointer ${selectedSizes.includes(size) ? 'bg-[#ff9edb] text-white border-[#ff9edb]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                  {selectedSizes.filter(s => !TAMANHOS_PADRAO.includes(s)).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {selectedSizes.filter(s => !TAMANHOS_PADRAO.includes(s)).map(size => (
                        <span key={size} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#ff9edb] text-white">
                          {size}
                          <button type="button" onClick={() => setSelectedSizes(prev => prev.filter(s => s !== size))} className="hover:opacity-70 cursor-pointer ml-0.5 font-black">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <Input
                      value={customSizeInput}
                      onChange={e => setCustomSizeInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSize() } }}
                      placeholder="Tamanho personalizado (ex: 46, G/GG, 100cm)..."
                      className="focus-visible:ring-[#ff9edb] border-gray-200 text-xs h-9"
                    />
                    <Button type="button" onClick={addCustomSize} className="bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer shrink-0 h-9 px-4">
                      + Add
                    </Button>
                  </div>
                </div>

                {/* Cores */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Cores Disponíveis</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CORES_PADRAO.map(color => (
                      <button key={color} type="button" onClick={() => toggleColor(color)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${selectedColors.includes(color) ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                        {color}
                      </button>
                    ))}
                  </div>
                  {selectedColors.filter(c => !CORES_PADRAO.includes(c)).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {selectedColors.filter(c => !CORES_PADRAO.includes(c)).map(color => (
                        <span key={color} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-white">
                          {color}
                          <button type="button" onClick={() => setSelectedColors(prev => prev.filter(c => c !== color))} className="hover:opacity-70 cursor-pointer ml-0.5 font-black">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <Input
                      value={customColorInput}
                      onChange={e => setCustomColorInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomColor() } }}
                      placeholder="Cor personalizada (ex: Dourado, Listrado, Tie-dye)..."
                      className="focus-visible:ring-[#ff9edb] border-gray-200 text-xs h-9"
                    />
                    <Button type="button" onClick={addCustomColor} className="bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer shrink-0 h-9 px-4">
                      + Add
                    </Button>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="border-t border-gray-100 pt-5 mt-6 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-100">Cancelar</Button>
                <Button type="submit" className="bg-[#b83070] hover:bg-[#9e2860] text-white font-bold cursor-pointer px-6 shadow-sm transition-colors">
                  {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
