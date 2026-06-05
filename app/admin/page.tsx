'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProducts } from '@/components/products-context'
import { Product, CATEGORIES } from '@/lib/mock-data'
import { Trash2, Edit3, Plus, ArrowLeft, Image as ImageIcon } from 'lucide-react'

export default function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  
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
    sizes: '',
    colors: ''
  })

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
      sizes: '',
      colors: ''
    })
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
      sizes: p.sizes ? p.sizes.join(', ') : '',
      colors: p.colors ? p.colors.join(', ') : ''
    })
    setIsOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(id)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement
      setFormData(prev => ({ ...prev, [name]: target.checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Parse sizes and colors
    const sizesArr = formData.sizes.split(',').map(s => s.trim()).filter(s => s !== '')
    const colorsArr = formData.colors.split(',').map(c => c.trim()).filter(c => c !== '')

    const productPayload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      image: formData.image || '/cat_roupas.png',
      category: formData.category,
      inStock: formData.inStock,
      isNew: formData.isNew,
      isFeatured: formData.isFeatured,
      sizes: sizesArr.length > 0 ? sizesArr : undefined,
      colors: colorsArr.length > 0 ? colorsArr : undefined
    }

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...productPayload
      })
      alert('Produto atualizado com sucesso!')
    } else {
      addProduct(productPayload)
      alert('Produto adicionado com sucesso!')
    }

    setIsOpen(false)
    resetForm()
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Admin Header */}
      <div className="bg-pink-50/40 py-10 border-b border-pink-100/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-widest mb-1.5">
              <Link href="/" className="hover:text-gray-900 flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao site
              </Link>
            </div>
            <h1 className="text-3xl font-medium text-gray-900 uppercase tracking-[0.1em]">Painel de Controle</h1>
            <p className="text-gray-500 mt-1 text-sm tracking-wide">{"Gerencie os produtos da sua loja Maribella"}</p>
          </div>

          <Button 
            onClick={handleOpenAdd}
            className="bg-[#ff9edb] hover:bg-[#ff80cb] text-white font-bold tracking-wide uppercase text-xs px-5 py-5 rounded-full flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-center"
          >
            <Plus className="w-4 h-4" /> Adicionar Produto
          </Button>
        </div>
      </div>

      {/* Main List */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-6 py-10">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  <th className="py-4 px-6">Produto</th>
                  <th className="py-4 px-6">Categoria</th>
                  <th className="py-4 px-6">Preço</th>
                  <th className="py-4 px-6">Estoque</th>
                  <th className="py-4 px-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400 italic">
                      Nenhum produto cadastrado no momento.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-pink-50/5 transition-colors">
                      <td className="py-4 px-6 flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-400 max-w-xs truncate">{p.description}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 capitalize font-medium text-gray-500">
                        {p.category}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">R$ {p.price.toFixed(2)}</span>
                          {p.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">R$ {p.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          p.inStock 
                            ? 'bg-green-50 text-green-700 border border-green-100' 
                            : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                          {p.inStock ? 'Ativo' : 'Esgotado'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleOpenEdit(p)}
                            className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full h-8 w-8 cursor-pointer"
                            title="Editar Produto"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(p.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full h-8 w-8 cursor-pointer"
                            title="Excluir Produto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
                {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Product Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Nome do Produto</label>
                  <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Ex: Vestido Fleur Pink"
                    required
                    className="focus-visible:ring-[#ff9edb]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Categoria</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full h-10 px-3 border border-input rounded-md text-sm bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#ff9edb] cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Descrição</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Ex: Vestido confeccionado em viscose, leve e romântico com detalhes..."
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-input rounded-md text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#ff9edb]"
                />
              </div>

              {/* Price Row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Preço de Venda (R$)</label>
                  <Input 
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="Ex: 149.90"
                    type="number"
                    step="0.01"
                    required
                    className="focus-visible:ring-[#ff9edb]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Preço Original / De (R$ - Opcional)</label>
                  <Input 
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleFormChange}
                    placeholder="Ex: 199.90"
                    type="number"
                    step="0.01"
                    className="focus-visible:ring-[#ff9edb]"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Caminho da Imagem ou URL</label>
                <div className="flex gap-2">
                  <Input 
                    name="image"
                    value={formData.image}
                    onChange={handleFormChange}
                    placeholder="Ex: /cat_roupas.png ou URL da imagem"
                    className="flex-grow focus-visible:ring-[#ff9edb]"
                  />
                </div>
                <p className="text-[10px] text-gray-400">
                  Valores válidos: `/cat_roupas.png`, `/cat_bolsas.png`, `/cat_calcados.png`, `/cat_joias.png` ou qualquer link do Unsplash.
                </p>
              </div>

              {/* Sizes & Colors */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Tamanhos (Separados por vírgula)</label>
                  <Input 
                    name="sizes"
                    value={formData.sizes}
                    onChange={handleFormChange}
                    placeholder="Ex: P, M, G, GG"
                    className="focus-visible:ring-[#ff9edb]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Cores (Separadas por vírgula)</label>
                  <Input 
                    name="colors"
                    value={formData.colors}
                    onChange={handleFormChange}
                    placeholder="Ex: Preto, Nude, Rosa"
                    className="focus-visible:ring-[#ff9edb]"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <input 
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleFormChange}
                    className="rounded border-gray-300 text-[#ff9edb] focus:ring-[#ff9edb]"
                  />
                  Em Estoque
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <input 
                    type="checkbox"
                    name="isNew"
                    checked={formData.isNew}
                    onChange={handleFormChange}
                    className="rounded border-gray-300 text-[#ff9edb] focus:ring-[#ff9edb]"
                  />
                  Novidade
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <input 
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleFormChange}
                    className="rounded border-gray-300 text-[#ff9edb] focus:ring-[#ff9edb]"
                  />
                  Destaque
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="border-t border-gray-100 pt-5 mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-[#ff9edb] hover:bg-[#ff80cb] text-white font-bold cursor-pointer"
                >
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
