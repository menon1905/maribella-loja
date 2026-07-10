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
import { Product, CATEGORIES as defaultCategories } from '@/lib/mock-data'
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
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

const TAMANHOS_PADRAO = ['P', 'M', 'G', 'GG', '34', '35', '36', '37', '38', '39', '40', 'U']
const CORES_PADRAO = ['Preto', 'Branco', 'Cinza', 'Nude', 'Rosa', 'Azul', 'Verde', 'Caramelo', 'Ouro', 'Prata', 'Vermelho', 'Rose Gold']

const DEFAULT_ROUPAS_SUBCATS = [
  { label: 'Todas', image: '/subcats/todas.jpeg', objectPosition: 'center' },
  { label: 'Blusas e Jaquetas', image: '/subcats/blusas e jaquetas.jfif', objectPosition: 'center' },
  { label: 'Camisas e Croppeds', image: '/subcats/camisas e croppeds.jfif', objectPosition: 'center' },
  { label: 'Bodys', image: '/subcats/bodys.jfif', objectPosition: 'center' },
  { label: 'Calças', image: '/subcats/calça.jfif', objectPosition: 'center' },
  { label: 'Shorts', image: '/subcats/shorts.jfif', objectPosition: 'center' },
  { label: 'Saias', image: '/subcats/saias.jfif', objectPosition: 'center' },
  { label: 'Conjuntos', image: '/subcats/conjuntos.jfif', objectPosition: 'center 42%' },
  { label: 'Macacões', image: '/subcats/macacoes.jfif', objectPosition: 'center' },
  { label: 'Vestidos', image: '/subcats/vestidos.jfif', objectPosition: 'center' },
  { label: 'Biquínis', image: '/subcats/biquinis.jfif', objectPosition: 'center' },
]

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

function AdminDashboard() {
  const { products, addProduct, updateProduct, deleteProduct, isLoading: isProductsLoading } = useProducts()

  // Tabs
  const [activeTab, setActiveTab] = useState<'produtos' | 'categorias' | 'banners' | 'colecoes'>('produtos')

  // Loaded state for Categories and Banners
  const [categories, setCategories] = useState<any[]>([])
  const [mainCategories, setMainCategories] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
  const [isBannersLoading, setIsBannersLoading] = useState(true)
  const [isCollectionsLoading, setIsCollectionsLoading] = useState(true)

  // Fetch Categories
  const loadCategories = async () => {
    setIsCategoriesLoading(true)
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) {
        console.warn('Erro ao carregar categorias do Supabase.', error.message)
        setCategories([])
        return
      }

      // Sempre respeita o banco — mesmo que vazio
      const cats = data ?? []
      setCategories(cats)
      const dbMain = cats.filter((c: any) => !c.parent_slug)
      if (dbMain.length > 0) {
        setMainCategories(dbMain)
      }
    } catch (err) {
      console.warn('Erro inesperado ao carregar categorias.', err)
      setCategories([])
    } finally {
      setIsCategoriesLoading(false)
    }
  }


  // Fetch Banners
  const loadBanners = async () => {
    try {
      setIsBannersLoading(true)
      setIsCollectionsLoading(true)
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error

      // Sempre respeita o banco — mesmo que vazio
      const allBanners = data ?? []
      const normalBanners = allBanners.filter((b: any) => !b.alt?.startsWith('[COLECAO]'))
      const collectionItems = allBanners.filter((b: any) => b.alt?.startsWith('[COLECAO]'))
      setBanners(normalBanners)
      setCollections(collectionItems)
    } catch (err) {
      console.warn('Erro ao carregar banners do Supabase.', err)
      setBanners([])
      setCollections([])
    } finally {
      setIsBannersLoading(false)
      setIsCollectionsLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
    loadBanners()
  }, [])

  // ----------------------- PRODUCTS TAB STATES & LOGIC -----------------------
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('todos')
  const [stockFilter, setStockFilter] = useState('todos')
  const [featuredFilter, setFeaturedFilter] = useState('todos')
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    category: '',
    inStock: true,
    isNew: false,
    isFeatured: false,
  })

  const orderedCategoriesForSelect = useMemo(() => {
    const list: any[] = []
    const mainCats = categories.filter(c => !c.parent_slug)
    mainCats.forEach(main => {
      list.push({ ...main, displayName: main.name })
      const subs = categories.filter(c => c.parent_slug === main.slug)
      subs.forEach(sub => {
        list.push({ ...sub, displayName: `  ↳ ${sub.name}` })
      })
    })

    categories.forEach(c => {
      if (c.parent_slug && !list.some(item => item.slug === c.slug)) {
        list.push({ ...c, displayName: `  ↳ ${c.name}` })
      }
    })

    if (list.length === 0) {
      return mainCategories.map(c => ({ ...c, displayName: c.name }))
    }
    return list
  }, [categories, mainCategories])

  // Set default category on load
  useEffect(() => {
    if (orderedCategoriesForSelect.length > 0 && !productFormData.category) {
      setProductFormData(prev => ({ ...prev, category: orderedCategoriesForSelect[0].slug }))
    }
  }, [orderedCategoriesForSelect, productFormData.category])

  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [subImagesInput, setSubImagesInput] = useState<string[]>([])
  const [newSubImageUrl, setNewSubImageUrl] = useState('')
  const [customSizeInput, setCustomSizeInput] = useState('')
  const [customColorInput, setCustomColorInput] = useState('')

  const productStats = useMemo(() => ({
    total: products.length,
    outOfStock: products.filter(p => !p.inStock).length,
    featured: products.filter(p => p.isFeatured).length,
    newArrivals: products.filter(p => p.isNew).length,
  }), [products])

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

  const handleOpenAddProduct = () => {
    setProductFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      image: '',
      category: orderedCategoriesForSelect[0]?.slug || 'roupas',
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
    setIsProductModalOpen(true)
  }

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p)
    setProductFormData({
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
    setIsProductModalOpen(true)
  }

  const handleDeleteProduct = async (p: Product) => {
    if (!confirm(`Tem certeza que deseja excluir "${p.name}"? Esta ação não pode ser desfeita.`)) return
    try {
      await deleteProduct(p.id)
      toast.success(`Produto "${p.name}" excluído com sucesso.`)
    } catch (err: any) {
      toast.error(`Erro ao excluir produto: ${err?.message || 'Erro desconhecido'}`)
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productFormData.image.trim()) {
      toast.error('A imagem principal é obrigatória.')
      return
    }
    const productPayload = {
      name: productFormData.name,
      description: productFormData.description,
      price: parseFloat(productFormData.price) || 0,
      originalPrice: productFormData.originalPrice ? parseFloat(productFormData.originalPrice) : undefined,
      image: productFormData.image,
      images: subImagesInput.length > 0 ? subImagesInput : [productFormData.image],
      category: productFormData.category,
      inStock: productFormData.inStock,
      isNew: productFormData.isNew,
      isFeatured: productFormData.isFeatured,
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
      setIsProductModalOpen(false)
    } catch {
      toast.error('Erro ao salvar produto.')
    }
  }

  // ----------------------- CATEGORIES TAB STATES & LOGIC -----------------------
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any | null>(null)
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    imagePosition: 'center',
    display_order: 0,
    parent_slug: null as string | null,
  })

  const handleOpenAddCategory = (parentSlug: string | null = null) => {
    const subset = parentSlug
      ? categories.filter((c: any) => c.parent_slug === parentSlug)
      : categories.filter((c: any) => !c.parent_slug)
    setCategoryFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      imagePosition: 'center',
      display_order: subset.length,
      parent_slug: parentSlug,
    })
    setEditingCategory(null)
    setIsCategoryModalOpen(true)
  }

  const handleOpenEditCategory = (cat: any) => {
    setEditingCategory(cat)
    setCategoryFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      image: cat.image || '',
      imagePosition: cat.image_position || 'center',
      display_order: cat.display_order || 0,
      parent_slug: cat.parent_slug ?? null,
    })
    setIsCategoryModalOpen(true)
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryFormData.name || !categoryFormData.slug || !categoryFormData.image) {
      toast.error('Preencha Nome, Slug e Imagem de Capa.')
      return
    }

    const targetOrder = Number(categoryFormData.display_order)
    const targetParentSlug = categoryFormData.parent_slug ?? null

    const duplicate = categories.find((c: any) => 
      Number(c.display_order) === targetOrder && 
      ((c.parent_slug === null && targetParentSlug === null) || (c.parent_slug === targetParentSlug)) &&
      (!editingCategory || c.id !== editingCategory.id)
    )

    const currentOrder = editingCategory 
      ? Number(editingCategory.display_order) 
      : (targetParentSlug 
          ? categories.filter(c => c.parent_slug === targetParentSlug).length 
          : categories.filter(c => !c.parent_slug).length)

    const payload = {
      name: categoryFormData.name,
      slug: categoryFormData.slug.toLowerCase().trim().replace(/\s+/g, '-'),
      description: categoryFormData.description,
      image: categoryFormData.image,
      image_position: categoryFormData.imagePosition,
      display_order: targetOrder,
      parent_slug: targetParentSlug,
    }

    try {
      if (duplicate) {
        const confirmSwap = confirm(
          `Deseja trocar a posição do "${duplicate.name}" ordem ${targetOrder} por "${categoryFormData.name}" ordem ${currentOrder}?`
        )
        if (!confirmSwap) {
          toast.error('A ordem informada já está em uso. Por favor, escolha outro número.')
          return
        }

        const { error: dupError } = await supabase
          .from('categories')
          .update({ display_order: currentOrder })
          .eq('id', duplicate.id)

        if (dupError) throw dupError
      }

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', editingCategory.id)

        if (error) throw error
        toast.success('Categoria atualizada com sucesso!')
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([payload])

        if (error) throw error
        toast.success('Categoria criada com sucesso!')
      }
      setIsCategoryModalOpen(false)
      loadCategories()
    } catch (err: any) {
      toast.error(`Erro ao salvar categoria: ${err.message || 'Erro desconhecido'}`)
    }
  }

  const handleDeleteCategory = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir a categoria "${name}"? Os produtos associados não serão apagados, mas ficarão sem categoria correspondente.`)) {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', id)
        if (error) throw error
        toast.success(`Categoria "${name}" excluída.`)
        loadCategories()
      } catch (err: any) {
        toast.error(`Erro ao excluir: ${err.message}`)
      }
    }
  }

  // ----------------------- BANNERS TAB STATES & LOGIC -----------------------
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<any | null>(null)
  const [bannerFormData, setBannerFormData] = useState({
    imageDesktop: '',
    imageMobile: '',
    alt: '',
    display_order: 0,
    is_active: true,
    href: '',
    mobileRatio: '1080x1080'
  })

  const handleOpenAddBanner = () => {
    setBannerFormData({
      imageDesktop: '',
      imageMobile: '',
      alt: '',
      display_order: banners.length,
      is_active: true,
      href: '',
      mobileRatio: '1080x1080'
    })
    setEditingBanner(null)
    setIsBannerModalOpen(true)
  }

  const handleOpenEditBanner = (ban: any) => {
    setEditingBanner(ban)

    let ratio = '1080x1080'
    const imgMob = ban.image_mobile || ''
    if (imgMob.includes('#1080x1350')) {
      ratio = '1080x1350'
    } else if (imgMob.includes('#16:9')) {
      ratio = '16:9'
    } else if (imgMob.includes('#1080x1080')) {
      ratio = '1080x1080'
    }

    setBannerFormData({
      imageDesktop: ban.image_desktop || '',
      imageMobile: imgMob.split('#')[0] || '',
      alt: ban.alt || '',
      display_order: ban.display_order || 0,
      is_active: ban.is_active ?? true,
      href: ban.href || '',
      mobileRatio: ratio
    })
    setIsBannerModalOpen(true)
  }

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bannerFormData.imageDesktop) {
      toast.error('A Imagem Desktop é obrigatória.')
      return
    }

    let mobileUrl = bannerFormData.imageMobile || null
    if (mobileUrl && bannerFormData.mobileRatio) {
      mobileUrl = mobileUrl.split('#')[0] + '#' + bannerFormData.mobileRatio
    }

    const targetOrder = Number(bannerFormData.display_order)

    const duplicate = banners.find((b: any) => 
      Number(b.display_order) === targetOrder &&
      (!editingBanner || b.id !== editingBanner.id)
    )

    const currentOrder = editingBanner
      ? Number(editingBanner.display_order)
      : banners.length

    const payload = {
      image_desktop: bannerFormData.imageDesktop,
      image_mobile: mobileUrl,
      alt: bannerFormData.alt,
      display_order: targetOrder,
      is_active: bannerFormData.is_active,
      href: bannerFormData.href || null
    }

    try {
      if (duplicate) {
        const duplicateName = duplicate.alt || `Banner #${duplicate.display_order}`
        const currentName = bannerFormData.alt || `Novo Banner`

        const confirmSwap = confirm(
          `Deseja trocar a posição do "${duplicateName}" ordem ${targetOrder} por "${currentName}" ordem ${currentOrder}?`
        )
        if (!confirmSwap) {
          toast.error('A ordem informada já está em uso. Por favor, escolha outro número.')
          return
        }

        const { error: dupError } = await supabase
          .from('banners')
          .update({ display_order: currentOrder })
          .eq('id', duplicate.id)

        if (dupError) throw dupError
      }

      if (editingBanner) {
        const { error } = await supabase
          .from('banners')
          .update(payload)
          .eq('id', editingBanner.id)

        if (error) throw error
        toast.success('Banner updated with success!')
      } else {
        const { error } = await supabase
          .from('banners')
          .insert([payload])

        if (error) throw error
        toast.success('Banner created with success!')
      }
      setIsBannerModalOpen(false)
      loadBanners()
    } catch (err: any) {
      toast.error(`Erro ao salvar banner: ${err.message || 'Erro desconhecido'}`)
    }
  }

  const handleDeleteBanner = async (id: string) => {
    if (confirm('Deseja realmente excluir este banner?')) {
      try {
        const { error } = await supabase.from('banners').delete().eq('id', id)
        if (error) throw error
        toast.success('Banner excluído.')
        loadBanners()
      } catch (err: any) {
        toast.error(`Erro ao excluir: ${err.message}`)
      }
    }
  }

  // ----------------------- COLLECTIONS TAB STATES & LOGIC -----------------------
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState<any | null>(null)
  const [collectionFormData, setCollectionFormData] = useState({
    title: '',
    description: '',
    button_text: '',
    image: '',
    href: '',
    display_order: 0,
    is_active: true
  })

  const handleOpenAddCollection = () => {
    setCollectionFormData({
      title: '',
      description: '',
      button_text: 'Comprar Agora',
      image: '',
      href: '',
      display_order: collections.length,
      is_active: true
    })
    setEditingCollection(null)
    setIsCollectionModalOpen(true)
  }

  const handleOpenEditCollection = (coll: any) => {
    setEditingCollection(coll)
    const cleanAlt = coll.alt.replace('[COLECAO]', '').trim()
    const parts = cleanAlt.split('|').map((p: string) => p.trim())
    const title = parts[0] || ''
    const description = parts[1] || ''
    const buttonText = parts[2] || 'Comprar Agora'
    setCollectionFormData({
      title,
      description,
      button_text: buttonText,
      image: coll.image_desktop || '',
      href: coll.href || '',
      display_order: coll.display_order || 0,
      is_active: coll.is_active ?? true
    })
    setIsCollectionModalOpen(true)
  }

  const handleCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!collectionFormData.title) {
      toast.error('O Título é obrigatório.')
      return
    }
    if (!collectionFormData.image) {
      toast.error('A Imagem é obrigatória.')
      return
    }

    const targetOrder = Number(collectionFormData.display_order)

    const duplicate = collections.find((c: any) => 
      Number(c.display_order) === targetOrder &&
      (!editingCollection || c.id !== editingCollection.id)
    )

    const currentOrder = editingCollection
      ? Number(editingCollection.display_order)
      : collections.length

    const btnText = collectionFormData.button_text.trim() || 'Comprar Agora'
    const combinedAlt = `[COLECAO] ${collectionFormData.title} | ${collectionFormData.description} | ${btnText}`

    const payload = {
      image_desktop: collectionFormData.image,
      image_mobile: collectionFormData.image,
      alt: combinedAlt,
      display_order: targetOrder,
      is_active: collectionFormData.is_active,
      href: collectionFormData.href || null
    }

    try {
      if (duplicate) {
        const cleanDupAlt = duplicate.alt.replace('[COLECAO]', '').trim()
        const dupParts = cleanDupAlt.split('|').map((p: string) => p.trim())
        const duplicateName = dupParts[0] || `Coleção #${duplicate.display_order}`
        const currentName = collectionFormData.title || `Nova Coleção`

        const confirmSwap = confirm(
          `Deseja trocar a posição do "${duplicateName}" ordem ${targetOrder} por "${currentName}" ordem ${currentOrder}?`
        )
        if (!confirmSwap) {
          toast.error('A ordem informada já está em uso. Por favor, escolha outro número.')
          return
        }

        const { error: dupError } = await supabase
          .from('banners')
          .update({ display_order: currentOrder })
          .eq('id', duplicate.id)

        if (dupError) throw dupError
      }

      if (editingCollection) {
        const { error } = await supabase
          .from('banners')
          .update(payload)
          .eq('id', editingCollection.id)

        if (error) throw error
        toast.success('Coleção atualizada com sucesso!')
      } else {
        const { error } = await supabase
          .from('banners')
          .insert([payload])

        if (error) throw error
        toast.success('Coleção criada com sucesso!')
      }
      setIsCollectionModalOpen(false)
      loadBanners()
    } catch (err: any) {
      toast.error(`Erro ao salvar coleção: ${err.message || 'Erro desconhecido'}`)
    }
  }

  const handleDeleteCollection = async (id: string) => {
    if (confirm('Deseja realmente excluir esta coleção?')) {
      try {
        const { error } = await supabase.from('banners').delete().eq('id', id)
        if (error) throw error
        toast.success('Coleção excluída.')
        loadBanners()
      } catch (err: any) {
        toast.error(`Erro ao excluir: ${err.message}`)
      }
    }
  }

  // Generic File Upload helper
  const [isUploading, setIsUploading] = useState(false)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, onUploadSuccess: (url: string) => void) => {
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

      onUploadSuccess(publicUrl)
      toast.success('Upload realizado com sucesso!')
    } catch (err: any) {
      console.error(err)
      toast.error(`Falha no upload: ${err.message || 'Erro desconhecido'}`)
    } finally {
      setIsUploading(false)
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
            <p className="text-gray-500 text-sm mt-0.5">Gerenciamento completo da Maribella em tempo real.</p>
          </div>
          
          <div className="flex gap-2">
            {activeTab === 'produtos' && (
              <Button
                onClick={handleOpenAddProduct}
                className="bg-primary hover:bg-[#ffbfe7] hover:text-[#db459b] text-white font-bold tracking-wide uppercase text-xs px-6 py-6 rounded-full flex items-center gap-2 cursor-pointer shadow-sm transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" /> Adicionar Produto
              </Button>
            )}

            {activeTab === 'banners' && (
              <Button
                onClick={handleOpenAddBanner}
                className="bg-primary hover:bg-[#ffbfe7] hover:text-[#db459b] text-white font-bold tracking-wide uppercase text-xs px-6 py-6 rounded-full flex items-center gap-2 cursor-pointer shadow-sm transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" /> Novo Banner
              </Button>
            )}

            {activeTab === 'colecoes' && (
              <Button
                onClick={handleOpenAddCollection}
                className="bg-primary hover:bg-[#ffbfe7] hover:text-[#db459b] text-white font-bold tracking-wide uppercase text-xs px-6 py-6 rounded-full flex items-center gap-2 cursor-pointer shadow-sm transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" /> Nova Coleção
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Admin Section with Sidebar */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-6 py-6 md:py-8 flex flex-col md:flex-row gap-6 md:gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl p-3 md:p-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible shadow-xs static md:sticky md:top-24">
            <p className="hidden md:block text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Painel de Controle</p>
            <button
              onClick={() => setActiveTab('produtos')}
              className={`flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-2.5 md:py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'produtos' ? 'bg-pink-100 text-pink-700 font-bold' : 'text-gray-600 hover:bg-slate-50'}`}
            >
              <Package className="w-4 h-4" />
              <span>Produtos</span>
              <span className="ml-1 md:ml-auto text-[10px] bg-slate-100 text-gray-550 py-0.5 px-2 rounded-full font-bold">{products.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('categorias')}
              className={`flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-2.5 md:py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'categorias' ? 'bg-pink-100 text-pink-700 font-bold' : 'text-gray-600 hover:bg-slate-50'}`}
            >
              <Layers className="w-4 h-4" />
              <span>Categorias</span>
              <span className="ml-1 md:ml-auto text-[10px] bg-slate-100 text-gray-550 py-0.5 px-2 rounded-full font-bold">{categories.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('banners')}
              className={`flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-2.5 md:py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'banners' ? 'bg-pink-100 text-pink-700 font-bold' : 'text-gray-600 hover:bg-slate-50'}`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Banners Slides</span>
              <span className="ml-1 md:ml-auto text-[10px] bg-slate-100 text-gray-550 py-0.5 px-2 rounded-full font-bold">{banners.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('colecoes')}
              className={`flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-2.5 md:py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'colecoes' ? 'bg-pink-100 text-pink-700 font-bold' : 'text-gray-600 hover:bg-slate-50'}`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Coleções</span>
              <span className="ml-1 md:ml-auto text-[10px] bg-slate-100 text-gray-550 py-0.5 px-2 rounded-full font-bold">{collections.length}</span>
            </button>
          </div>
        </aside>

        {/* Tab Contents */}
        <section className="flex-grow min-w-0">
          
          {/* 1. PRODUCTS TAB */}
          {activeTab === 'produtos' && (
            <div className="space-y-6">
              {/* Statistics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Produtos Totais', value: productStats.total, icon: Package, color: 'blue' },
                  { label: 'Fora de Estoque', value: productStats.outOfStock, icon: AlertTriangle, color: 'yellow' },
                  { label: 'Novidades', value: productStats.newArrivals, icon: Sparkles, color: 'pink' },
                  { label: 'Em Destaque', value: productStats.featured, icon: TrendingUp, color: 'purple' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-white p-3 sm:p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-2.5 sm:gap-4">
                    <div className={`p-2.5 sm:p-3 bg-${color}-50 text-${color}-600 rounded-xl flex-shrink-0`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider truncate">{label}</p>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mt-0.5">{isProductsLoading ? '...' : value}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Table */}
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
                  <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                    {[
                      { value: categoryFilter, setter: setCategoryFilter, options: [{ v: 'todos', l: 'Todas Categorias' }, ...orderedCategoriesForSelect.map(c => ({ v: c.slug, l: c.displayName }))] },
                      { value: stockFilter, setter: setStockFilter, options: [{ v: 'todos', l: 'Todos Estoques' }, { v: 'ativo', l: 'Em Estoque' }, { v: 'esgotado', l: 'Esgotado' }] },
                      { value: featuredFilter, setter: setFeaturedFilter, options: [{ v: 'todos', l: 'Todos Destaques' }, { v: 'destaque', l: 'Destaque' }, { v: 'novidade', l: 'Novidade' }] },
                    ].map(({ value, setter, options }, idx) => (
                      <select key={idx} value={value} onChange={e => setter(e.target.value)}
                        className="h-10 w-full sm:w-auto px-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ff9edb] cursor-pointer">
                        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                      </select>
                    ))}
                  </div>
                </div>

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
                      {isProductsLoading ? (
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
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 capitalize font-semibold text-gray-500">{p.category}</td>
                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900">R$ {p.price.toFixed(2)}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 space-y-1">
                            {p.isFeatured && <span className="inline-block mr-1 bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-purple-100">Destaque</span>}
                            {p.isNew && <span className="inline-block mr-1 bg-pink-50 text-pink-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-pink-100">Novo</span>}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${p.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                              {p.inStock ? 'Ativo' : 'Esgotado'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-1.5">
                              <Button variant="ghost" size="icon" onClick={() => handleOpenEditProduct(p)} className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full h-8 w-8" title="Editar">
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(p)} className="text-rose-500 hover:text-rose-700 hover:bg-rose-50/50 rounded-full h-8 w-8" title="Excluir">
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
          )}

          {/* 2. CATEGORIES TAB */}
          {activeTab === 'categorias' && (() => {
            const mainCats = categories.filter((c: any) => !c.parent_slug)
            const subcats = categories.filter((c: any) => c.parent_slug === 'roupas')

            const CategoryCard = ({ cat }: { cat: any }) => (
              <div key={cat.id || cat.slug} className="border border-gray-150 rounded-2xl overflow-hidden bg-white shadow-xs relative group flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video bg-slate-50 w-full overflow-hidden border-b border-gray-100">
                    <Image
                      src={cat.image || '/home_roupas.jpeg'}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      style={{ objectPosition: cat.image_position || 'center' }}
                      unoptimized
                    />
                    <div className="absolute top-2 left-2 bg-black/60 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-full tracking-wider">
                      {cat.parent_slug ? `sub: ${cat.name}` : `/${cat.slug}`}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-base text-gray-800">{cat.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{cat.description || 'Sem descrição cadastrada.'}</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-450 uppercase">Ordem: {cat.display_order ?? 0}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEditCategory(cat)} className="h-8 w-8 text-gray-600 hover:text-black rounded-full" title="Editar">
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id, cat.name)} className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50/50 rounded-full" title="Excluir">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )

            return (
              <div className="space-y-8">
                {/* MAIN CATEGORIES */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-xs p-6">
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Categorias Principais</h2>
                      <p className="text-gray-500 text-xs mt-0.5">Aparecem na home e na navegação principal da loja.</p>
                    </div>
                    <Button onClick={() => handleOpenAddCategory(null)}
                      className="bg-primary hover:bg-[#ffbfe7] hover:text-[#db459b] text-white font-bold tracking-wide uppercase text-xs px-5 py-2 rounded-full flex items-center gap-2 cursor-pointer shadow-sm transition-all hover:scale-[1.02]">
                      <Plus className="w-3.5 h-3.5" /> Nova
                    </Button>
                  </div>
                  {isCategoriesLoading ? (
                    <div className="py-12 flex justify-center"><div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" /></div>
                  ) : mainCats.length === 0 ? (
                    <p className="text-center py-8 text-gray-400 italic">Nenhuma categoria principal cadastrada.</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {mainCats.map((cat: any) => <CategoryCard key={cat.id || cat.slug} cat={cat} />)}
                    </div>
                  )}
                </div>

                {/* ROUPAS SUBCATEGORIES */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-xs p-6">
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Subcategorias de Roupas</h2>
                      <p className="text-gray-500 text-xs mt-0.5">Aparecem na grade circular dentro de /categorias/roupas.</p>
                    </div>
                    <Button onClick={() => handleOpenAddCategory('roupas')}
                      className="bg-primary hover:bg-[#ffbfe7] hover:text-[#db459b] text-white font-bold tracking-wide uppercase text-xs px-5 py-2 rounded-full flex items-center gap-2 cursor-pointer shadow-sm transition-all hover:scale-[1.02]">
                      <Plus className="w-3.5 h-3.5" /> Nova Sub
                    </Button>
                  </div>
                  {isCategoriesLoading ? (
                    <div className="py-12 flex justify-center"><div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" /></div>
                  ) : subcats.length === 0 ? (
                    <p className="text-center py-8 text-gray-400 italic">Nenhuma subcategoria cadastrada.</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {subcats.map((cat: any) => <CategoryCard key={cat.id || cat.slug} cat={cat} />)}
                    </div>
                  )}
                </div>
              </div>
            )
          })()}

          {/* 3. BANNERS TAB */}
          {activeTab === 'banners' && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-xs p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">Banners do Slide Principal (Hero)</h2>
                <p className="text-gray-500 text-xs mt-0.5">Gerencie os slides de imagem que mudam automaticamente na Home. Recomenda-se imagens na proporção de 1580x700 para Desktop e 1080x1080 (Quadrado) para Mobile.</p>
              </div>

              {isBannersLoading ? (
                <div className="py-12 flex justify-center items-center">
                  <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : banners.length === 0 ? (
                <div className="text-center py-12 text-gray-400 italic">
                  Nenhum banner cadastrado. Usando banners padrão.
                </div>
              ) : (
                <div className="space-y-4">
                  {banners.map((ban, index) => (
                    <div key={ban.id} className="border border-gray-150 rounded-2xl p-4 bg-white shadow-xs flex flex-col md:flex-row gap-6 items-center justify-between">
                      <div className="flex flex-col sm:flex-row gap-4 items-center flex-grow w-full md:w-auto">
                        <div className="flex gap-2 items-center">
                          <div className="relative w-28 aspect-[16/7] rounded-lg overflow-hidden border border-gray-100 bg-gray-55/30" title="Banner Desktop">
                            <Image src={ban.image_desktop} alt="Desktop Preview" fill className="object-cover" />
                            <span className="absolute bottom-1 right-1 bg-black/60 text-white font-black text-[7px] uppercase px-1 rounded">Desk</span>
                          </div>
                          <div className={`relative rounded-lg overflow-hidden border border-gray-100 bg-gray-55/30 ${
                            ban.image_mobile?.includes('#1080x1350')
                              ? 'w-12 h-15 aspect-[4/5]'
                              : ban.image_mobile?.includes('#16:9')
                              ? 'w-16 h-9 aspect-video'
                              : 'w-14 h-14 aspect-square'
                          }`} title="Banner Mobile">
                            {ban.image_mobile ? (
                              <Image src={ban.image_mobile.split('#')[0]} alt="Mobile Preview" fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-[8px] font-bold text-center">Desk Fallback</div>
                            )}
                            <span className="absolute bottom-1 right-1 bg-pink-600/75 text-white font-black text-[7px] uppercase px-1 rounded">Mob</span>
                          </div>
                        </div>

                        <div className="flex-grow text-center sm:text-left">
                          <p className="text-sm font-bold text-gray-800 line-clamp-1">{ban.alt || 'Slide sem texto alternativo'}</p>
                          {ban.href && <p className="text-xs text-gray-450 font-semibold mt-1">Link: {ban.href}</p>}
                          <div className="flex gap-2 items-center justify-center sm:justify-start mt-2">
                            <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${ban.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                              {ban.is_active ? 'Ativo' : 'Inativo'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold">Ordem: {ban.display_order ?? 0}</span>
                            <span className="text-[10px] text-pink-500 font-bold">
                              Proporção Mob: {
                                ban.image_mobile?.includes('#1080x1350')
                                  ? '1080x1350'
                                  : ban.image_mobile?.includes('#16:9')
                                  ? '16:9'
                                  : '1080x1080 (Quadrado)'
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1.5 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEditBanner(ban)} className="h-8 w-8 text-gray-600 hover:text-black rounded-full" title="Editar">
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteBanner(ban.id)} className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50/50 rounded-full" title="Excluir">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. COLLECTIONS TAB */}
          {activeTab === 'colecoes' && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-xs p-6">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Coleções e Promoções da Home</h2>
                  <p className="text-gray-500 text-xs mt-0.5">Gerencie os dois blocos promocionais que aparecem logo abaixo dos produtos em destaque na Home.</p>
                </div>
              </div>

              {isCollectionsLoading ? (
                <div className="py-12 flex justify-center items-center">
                  <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : collections.length === 0 ? (
                <div className="text-center py-12 text-gray-400 italic">
                  Nenhuma coleção cadastrada.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {collections.map((coll) => {
                    const cleanAlt = coll.alt.replace('[COLECAO]', '').trim()
                    const parts = cleanAlt.split('|').map((p: string) => p.trim())
                    const title = parts[0] || ''
                    const description = parts[1] || ''
                    const buttonText = parts[2] || 'Comprar Agora'

                    return (
                      <div key={coll.id} className="border border-gray-150 rounded-2xl overflow-hidden bg-white shadow-xs relative group flex flex-col justify-between">
                        <div>
                          <div className="relative aspect-video bg-slate-50 w-full overflow-hidden border-b border-gray-100">
                            <Image
                              src={coll.image_desktop}
                              alt={title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            <div className="absolute top-2 left-2 bg-black/60 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-full tracking-wider">
                              Coleção
                            </div>
                            <div className="absolute top-2 right-2 bg-pink-500 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-full tracking-wider">
                              Ordem: {coll.display_order ?? 0}
                            </div>
                          </div>
                          <div className="p-5">
                            <h3 className="font-bold text-lg text-gray-800">{title}</h3>
                            <p className="text-xs text-pink-600 font-bold uppercase tracking-wider mt-1">{description || 'Sem descrição/cupom'}</p>
                            <p className="text-xs text-gray-400 font-semibold mt-1">Texto do Botão: <span className="text-gray-700 font-extrabold">{buttonText}</span></p>
                            {coll.href && (
                              <p className="text-[11px] text-gray-400 font-medium mt-3 bg-slate-50 p-2 rounded truncate">
                                Link: <span className="font-bold text-slate-600">{coll.href}</span>
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                          <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${coll.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-105 text-gray-500'}`}>
                            {coll.is_active ? 'Ativo na Home' : 'Inativo'}
                          </span>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenEditCollection(coll)} className="h-8 w-8 text-gray-650 hover:text-black rounded-full" title="Editar">
                              <Edit3 className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCollection(coll.id)} className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50/50 rounded-full" title="Excluir">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

        </section>
      </div>

      {/* ──────────────── PRODUCT MODAL ──────────────── */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-3xl my-8 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
                  {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
                </h3>
              </div>
              <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1.5 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#ff80cb] uppercase tracking-widest border-b border-gray-100 pb-1">Informações Básicas</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Nome do Produto</label>
                    <Input value={productFormData.name} onChange={e => setProductFormData(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Vestido Fleur Pink" required className="focus-visible:ring-[#ff9edb] border-gray-200" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Categoria</label>
                    <select value={productFormData.category} onChange={e => setProductFormData(p => ({ ...p, category: e.target.value }))}
                      className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ff9edb] cursor-pointer">
                      {orderedCategoriesForSelect.map(c => <option key={c.id || c.slug} value={c.slug}>{c.displayName}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Descrição</label>
                  <textarea value={productFormData.description} onChange={e => setProductFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder="Descreva os detalhes do produto..." rows={3} required
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9edb]" />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-[#ff80cb] uppercase tracking-widest border-b border-gray-100 pb-1">Preço & Estoque</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Preço de Venda (R$)</label>
                    <Input value={productFormData.price} onChange={e => setProductFormData(p => ({ ...p, price: e.target.value }))} placeholder="149.90" type="number" step="0.01" required className="focus-visible:ring-[#ff9edb] border-gray-200" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Preço Riscado (Opcional)</label>
                    <Input value={productFormData.originalPrice} onChange={e => setProductFormData(p => ({ ...p, originalPrice: e.target.value }))} placeholder="199.90" type="number" step="0.01" className="focus-visible:ring-[#ff9edb] border-gray-200" />
                  </div>
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Configurações</label>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-1 min-h-10">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                        <input type="checkbox" checked={productFormData.inStock} onChange={e => setProductFormData(p => ({ ...p, inStock: e.target.checked }))} className="rounded w-4 h-4 border-gray-300 cursor-pointer" />
                        Em Estoque
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                        <input type="checkbox" checked={productFormData.isFeatured} onChange={e => setProductFormData(p => ({ ...p, isFeatured: e.target.checked }))} className="rounded w-4 h-4 border-gray-300 cursor-pointer" />
                        Destaque
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                        <input type="checkbox" checked={productFormData.isNew} onChange={e => setProductFormData(p => ({ ...p, isNew: e.target.checked }))} className="rounded w-4 h-4 border-gray-300 cursor-pointer" />
                        Novidade
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-2">
                <h4 className="text-xs font-bold text-[#ff80cb] uppercase tracking-widest border-b border-gray-100 pb-1">Galeria de Imagens</h4>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Imagem Principal</label>
                  <div className="grid sm:grid-cols-2 gap-4 items-start">
                    <div className="space-y-3">
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors relative cursor-pointer group">
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setProductFormData(prev => ({ ...prev, image: url })))} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="flex flex-col items-center text-center gap-1.5 pointer-events-none">
                          <Plus className="w-5 h-5 text-gray-400 group-hover:text-[#ff80cb] transition-colors" />
                          <span className="text-xs font-semibold text-gray-600">Upload de Arquivo</span>
                        </div>
                      </div>
                      <Input value={productFormData.image} onChange={e => setProductFormData(prev => ({ ...prev, image: e.target.value }))} placeholder="Ou insira a URL da imagem..." required className="focus-visible:ring-[#ff9edb] border-gray-200" />
                    </div>
                    {productFormData.image && (
                      <div className="relative w-full aspect-square max-w-[150px] rounded-2xl overflow-hidden border border-gray-200">
                        <Image src={productFormData.image} alt="Preview Principal" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Sub-imagens</label>
                  <div className="grid sm:grid-cols-2 gap-4 items-start">
                    <div className="space-y-3">
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors relative cursor-pointer group">
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setSubImagesInput(prev => [...prev, url]))} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="flex flex-col items-center text-center gap-1.5 pointer-events-none">
                          <Plus className="w-5 h-5 text-gray-400 group-hover:text-[#ff80cb] transition-colors" />
                          <span className="text-xs font-semibold text-gray-600">Upload para Galeria</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input value={newSubImageUrl} onChange={e => setNewSubImageUrl(e.target.value)} placeholder="Link da imagem..." className="focus-visible:ring-[#ff9edb] border-gray-200" />
                        <Button type="button" onClick={() => { if(newSubImageUrl.trim()) { setSubImagesInput(p => [...p, newSubImageUrl.trim()]); setNewSubImageUrl('') } }} className="bg-slate-800 text-white text-xs shrink-0 px-4">Adicionar</Button>
                      </div>
                    </div>
                    <div>
                      <div className="grid grid-cols-3 gap-2 max-h-[160px] overflow-y-auto p-1">
                        {subImagesInput.map((url, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white">
                            <Image src={url} alt={`Sub ${idx}`} fill className="object-cover" />
                            <button type="button" onClick={() => setSubImagesInput(p => p.filter((_, i) => i !== idx))} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-1"><X className="w-3 h-3" /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-[#ff80cb] uppercase tracking-widest border-b border-gray-100 pb-1">Tamanhos e Cores</h4>
                
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Tamanhos</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {TAMANHOS_PADRAO.map(size => (
                      <button key={size} type="button" onClick={() => setSelectedSizes(p => p.includes(size) ? p.filter(s => s !== size) : [...p, size])}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedSizes.includes(size) ? 'bg-[#ff9edb] text-white border-[#ff9edb]' : 'bg-white text-gray-600 border-gray-200'}`}>
                        {size}
                      </button>
                    ))}
                    {selectedSizes.filter(s => !TAMANHOS_PADRAO.includes(s)).map(size => (
                      <button key={size} type="button" onClick={() => setSelectedSizes(p => p.filter(s => s !== size))}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all bg-[#ff9edb] text-white border-[#ff9edb]">
                        {size}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 max-w-[280px]">
                    <Input
                      value={customSizeInput}
                      onChange={e => setCustomSizeInput(e.target.value)}
                      placeholder="Novo tamanho (ex: GGG)"
                      className="h-9 text-xs focus-visible:ring-[#ff9edb] border-gray-200"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const trimmed = customSizeInput.trim().toUpperCase()
                        if (trimmed && !selectedSizes.includes(trimmed)) {
                          setSelectedSizes(p => [...p, trimmed])
                          setCustomSizeInput('')
                        }
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 h-9 shrink-0"
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Cores</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {CORES_PADRAO.map(color => (
                      <button key={color} type="button" onClick={() => setSelectedColors(p => p.includes(color) ? p.filter(c => c !== color) : [...p, color])}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedColors.includes(color) ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-gray-600 border-gray-205'}`}>
                        {color}
                      </button>
                    ))}
                    {selectedColors.filter(c => !CORES_PADRAO.includes(c)).map(color => (
                      <button key={color} type="button" onClick={() => setSelectedColors(p => p.filter(c => c !== color))}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all bg-slate-800 text-white border-slate-800">
                        {color}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 max-w-[280px]">
                    <Input
                      value={customColorInput}
                      onChange={e => setCustomColorInput(e.target.value)}
                      placeholder="Nova cor (ex: Azul Marinho)"
                      className="h-9 text-xs focus-visible:ring-[#ff9edb] border-gray-200"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const trimmed = customColorInput.trim()
                        if (trimmed && !selectedColors.includes(trimmed)) {
                          setSelectedColors(p => [...p, trimmed])
                          setCustomColorInput('')
                        }
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 h-9 shrink-0"
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5 mt-6 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-[#ff9edb] hover:bg-[#ff80cb] text-white font-bold transition-colors">Salvar Alterações</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────── CATEGORY MODAL ──────────────── */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsCategoryModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg my-8 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-650 p-1.5"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCategorySubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Nome da Categoria</label>
                <Input value={categoryFormData.name} onChange={e => {
                  const val = e.target.value;
                  setCategoryFormData(p => ({
                    ...p, 
                    name: val,
                    slug: val.toLowerCase()
                             .normalize("NFD")
                             .replace(/[\u0300-\u036f]/g, "")
                             .replace(/[^a-z0-9\s-]/g, "")
                             .trim()
                             .replace(/\s+/g, '-')
                  }))
                }} placeholder="Ex: Blusas e Jaquetas" required />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Tipo</label>
                <select
                  value={categoryFormData.parent_slug ?? ''}
                  onChange={e => setCategoryFormData(p => ({ ...p, parent_slug: e.target.value || null }))}
                  disabled={!!editingCategory}
                  className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ff9edb] disabled:opacity-50"
                >
                  <option value="">Categoria Principal</option>
                  <option value="roupas">Subcategoria de Roupas</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Ordem Visual</label>
                <Input type="number" value={categoryFormData.display_order} onChange={e => setCategoryFormData(p => ({ ...p, display_order: Number(e.target.value) }))} />
              </div>

              {/* Cover Image Desktop */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Imagem de Capa (Desktop)</label>
                <div className="flex gap-2 items-center">
                  <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl p-3 bg-gray-50 hover:bg-gray-100 relative cursor-pointer flex-1 text-center">
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setCategoryFormData(prev => ({ ...prev, image: url })))} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <span className="text-xs text-gray-500">Upload Imagem</span>
                  </div>
                  <Input value={categoryFormData.image} onChange={e => setCategoryFormData(p => ({ ...p, image: e.target.value }))} placeholder="Link da imagem..." className="flex-[2]" required />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsCategoryModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-[#ff9edb] hover:bg-[#ff80cb] text-white font-bold transition-colors">Salvar Categoria</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────── BANNER MODAL ──────────────── */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsBannerModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg my-8 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
                {editingBanner ? 'Editar Slide' : 'Novo Banner'}
              </h3>
              <button onClick={() => setIsBannerModalOpen(false)} className="text-gray-400 hover:text-gray-655 p-1.5"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleBannerSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Texto Alternativo (Alt Text)</label>
                <Input value={bannerFormData.alt} onChange={e => setBannerFormData(p => ({ ...p, alt: e.target.value }))} placeholder="Ex: Nova Coleção de Inverno" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Link de Redirecionamento (Opcional)</label>
                <Input value={bannerFormData.href} onChange={e => setBannerFormData(p => ({ ...p, href: e.target.value }))} placeholder="Ex: /produtos ou /categorias/roupas" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Ordem Visual</label>
                  <Input type="number" value={bannerFormData.display_order} onChange={e => setBannerFormData(p => ({ ...p, display_order: Number(e.target.value) }))} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Status</label>
                  <div className="flex h-10 items-center">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                      <input type="checkbox" checked={bannerFormData.is_active} onChange={e => setBannerFormData(p => ({ ...p, is_active: e.target.checked }))} className="rounded w-4 h-4 border-gray-300" />
                      Ativo
                    </label>
                  </div>
                </div>
              </div>

              {/* Mobile Ratio Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Proporção Mobile (Caso possua imagem mobile)</label>
                <select
                  value={bannerFormData.mobileRatio}
                  onChange={e => setBannerFormData(p => ({ ...p, mobileRatio: e.target.value }))}
                  className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ff9edb]"
                >
                  <option value="1080x1080">1080x1080 (Quadrado) - Padrão</option>
                  <option value="1080x1350">1080x1350 (Retrato / 4:5)</option>
                  <option value="16:9">16:9 (Paisagem / Tradicional)</option>
                </select>
              </div>

              {/* Desktop Banner Image */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block font-semibold">Imagem Desktop (1580x700 recomendada)</label>
                <div className="flex gap-2 items-center">
                  <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl p-3 bg-gray-50 hover:bg-gray-100 relative cursor-pointer flex-1 text-center">
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setBannerFormData(prev => ({ ...prev, imageDesktop: url })))} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <span className="text-xs text-gray-500">Upload Desk</span>
                  </div>
                  <Input value={bannerFormData.imageDesktop} onChange={e => setBannerFormData(p => ({ ...p, imageDesktop: e.target.value }))} placeholder="Link da imagem..." className="flex-[2]" required />
                </div>
              </div>

              {/* Mobile Banner Image */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block font-semibold">Imagem Mobile (Opcional - Usará Desk se vazio)</label>
                <div className="flex gap-2 items-center">
                  <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl p-3 bg-gray-50 hover:bg-gray-100 relative cursor-pointer flex-1 text-center">
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setBannerFormData(prev => ({ ...prev, imageMobile: url })))} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <span className="text-xs text-gray-500">Upload Mob</span>
                  </div>
                  <Input value={bannerFormData.imageMobile} onChange={e => setBannerFormData(p => ({ ...p, imageMobile: e.target.value }))} placeholder="Link da imagem..." className="flex-[2]" />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsBannerModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-[#ff9edb] hover:bg-[#ff80cb] text-white font-bold transition-colors">Salvar Banner</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────── COLLECTION MODAL ──────────────── */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsCollectionModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg my-8 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
                {editingCollection ? 'Editar Coleção' : 'Nova Coleção'}
              </h3>
              <button onClick={() => setIsCollectionModalOpen(false)} className="text-gray-400 hover:text-gray-655 p-1.5"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCollectionSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Título da Coleção</label>
                <Input value={collectionFormData.title} onChange={e => setCollectionFormData(p => ({ ...p, title: e.target.value }))} placeholder="Ex: Coleção Verão" required />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Descrição / Desconto</label>
                <Input value={collectionFormData.description} onChange={e => setCollectionFormData(p => ({ ...p, description: e.target.value }))} placeholder="Ex: Até 50% de desconto" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Texto do Botão</label>
                <Input value={collectionFormData.button_text} onChange={e => setCollectionFormData(p => ({ ...p, button_text: e.target.value }))} placeholder="Ex: Comprar Agora" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Link de Redirecionamento</label>
                <Input value={collectionFormData.href} onChange={e => setCollectionFormData(p => ({ ...p, href: e.target.value }))} placeholder="Ex: /categorias/roupas" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Ordem Visual</label>
                  <Input type="number" value={collectionFormData.display_order} onChange={e => setCollectionFormData(p => ({ ...p, display_order: Number(e.target.value) }))} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Status</label>
                  <div className="flex h-10 items-center">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                      <input type="checkbox" checked={collectionFormData.is_active} onChange={e => setCollectionFormData(p => ({ ...p, is_active: e.target.checked }))} className="rounded w-4 h-4 border-gray-300" />
                      Ativo na Home
                    </label>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block font-semibold">Imagem de Capa (Proporção Retangular)</label>
                <div className="flex gap-2 items-center">
                  <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl p-3 bg-gray-50 hover:bg-gray-100 relative cursor-pointer flex-1 text-center">
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setCollectionFormData(prev => ({ ...prev, image: url })))} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <span className="text-xs text-gray-500">Upload Imagem</span>
                  </div>
                  <Input value={collectionFormData.image} onChange={e => setCollectionFormData(p => ({ ...p, image: e.target.value }))} placeholder="Link da imagem..." className="flex-[2]" required />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsCollectionModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-[#ff9edb] hover:bg-[#ff80cb] text-white font-bold transition-colors">Salvar Coleção</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
