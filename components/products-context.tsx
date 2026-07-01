'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product, PRODUCTS as initialProducts } from '@/lib/mock-data'
import { supabase } from '@/lib/supabase'

interface ProductsContextType {
  products: Product[]
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  updateProduct: (product: Product) => Promise<void>
  isLoading: boolean
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

function mapFromDB(row: any): Product {
  return {
    id: String(row.id),
    name: row.name,
    description: row.description,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    image: row.image,
    images: row.images || [],
    category: row.category,
    rating: Number(row.rating ?? 5),
    reviews: Number(row.reviews ?? 0),
    inStock: row.in_stock ?? true,
    sizes: row.sizes || [],
    colors: row.colors || [],
    isNew: row.is_new ?? false,
    isFeatured: row.is_featured ?? false,
    discount: row.discount ? Number(row.discount) : undefined,
  }
}

function mapToDB(p: Product) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    original_price: p.originalPrice || null,
    image: p.image,
    images: p.images || [],
    category: p.category,
    rating: p.rating,
    reviews: p.reviews,
    in_stock: p.inStock,
    sizes: p.sizes || [],
    colors: p.colors || [],
    is_new: p.isNew || false,
    is_featured: p.isFeatured || false,
    discount: p.discount || null,
  }
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function loadProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error

      if (data && data.length > 0) {
        const mapped = data.map(mapFromDB)
        setProducts(mapped)
        localStorage.setItem('maribella_products', JSON.stringify(mapped))
      } else {
        // Table is empty, seed it with mock-data
        console.log('Supabase table is empty. Seeding initial products...')
        const seedData = initialProducts.map((p) => {
          const discount = p.originalPrice && p.originalPrice > p.price
            ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
            : null
          return {
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            original_price: p.originalPrice || null,
            image: p.image,
            images: p.images || [p.image], // Initialize with at least main image
            category: p.category,
            rating: p.rating,
            reviews: p.reviews,
            in_stock: p.inStock,
            sizes: p.sizes || [],
            colors: p.colors || [],
            is_new: p.isNew || false,
            is_featured: p.isFeatured || false,
            discount
          }
        })

        const { error: seedError } = await supabase.from('products').insert(seedData)
        if (seedError) {
          console.error('Failed to seed Supabase table:', seedError)
        }

        setProducts(initialProducts)
        localStorage.setItem('maribella_products', JSON.stringify(initialProducts))
      }
    } catch (err) {
      console.warn('Could not load from Supabase, falling back to localStorage.', err)
      const stored = localStorage.getItem('maribella_products')
      if (stored) {
        try {
          setProducts(JSON.parse(stored))
        } catch (e) {
          setProducts(initialProducts)
        }
      } else {
        setProducts(initialProducts)
        localStorage.setItem('maribella_products', JSON.stringify(initialProducts))
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch products from Supabase and listen to changes in real-time
  useEffect(() => {
    loadProducts()

    // Realtime channel setup
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newProd = mapFromDB(payload.new)
            setProducts((prev) => {
              const exists = prev.some((p) => p.id === newProd.id)
              if (exists) return prev
              return [...prev, newProd]
            })
          } else if (payload.eventType === 'UPDATE') {
            const updatedProd = mapFromDB(payload.new)
            setProducts((prev) =>
              prev.map((p) => (p.id === updatedProd.id ? updatedProd : p))
            )
          } else if (payload.eventType === 'DELETE') {
            const deletedId = String(payload.old.id)
            setProducts((prev) => prev.filter((p) => p.id !== deletedId))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const addProduct = async (p: Omit<Product, 'id'>) => {
    const newId = Math.random().toString(36).substring(2, 9)
    const discount = p.originalPrice && p.originalPrice > p.price
      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      : undefined

    const newProduct: Product = {
      ...p,
      id: newId,
      rating: 5,
      reviews: 0,
      discount
    }

    // Optimistic Update
    const updatedList = [...products, newProduct]
    setProducts(updatedList)
    localStorage.setItem('maribella_products', JSON.stringify(updatedList))

    // DB Update
    try {
      const dbRow = mapToDB(newProduct)
      const { error } = await supabase.from('products').insert([dbRow])
      if (error) throw error
    } catch (err) {
      console.error('Error adding product to Supabase:', err)
      await loadProducts() // revert optimistic update
      throw err
    }
  }

  const deleteProduct = async (id: string) => {
    // Optimistic Update
    const updatedList = products.filter(p => p.id !== id)
    setProducts(updatedList)
    localStorage.setItem('maribella_products', JSON.stringify(updatedList))

    // DB Update
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('Error deleting product from Supabase:', err)
      await loadProducts() // revert optimistic update
      throw err
    }
  }

  const updateProduct = async (updated: Product) => {
    const discount = updated.originalPrice && updated.originalPrice > updated.price
      ? Math.round(((updated.originalPrice - updated.price) / updated.originalPrice) * 100)
      : undefined

    const updatedWithDiscount = {
      ...updated,
      discount
    }

    // Optimistic Update
    const updatedList = products.map(p => p.id === updated.id ? updatedWithDiscount : p)
    setProducts(updatedList)
    localStorage.setItem('maribella_products', JSON.stringify(updatedList))

    // DB Update
    try {
      const dbRow = mapToDB(updatedWithDiscount)
      const { error } = await supabase.from('products').update(dbRow).eq('id', updated.id)
      if (error) throw error
    } catch (err) {
      console.error('Error updating product in Supabase:', err)
      await loadProducts() // revert optimistic update
      throw err
    }
  }

  return (
    <ProductsContext.Provider value={{ products, addProduct, deleteProduct, updateProduct, isLoading }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return context
}
