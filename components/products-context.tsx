'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product, PRODUCTS as initialProducts } from '@/lib/mock-data'

interface ProductsContextType {
  products: Product[]
  addProduct: (product: Omit<Product, 'id'>) => void
  deleteProduct: (id: string) => void
  updateProduct: (product: Product) => void
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('maribella_products')
    if (stored) {
      try {
        setProducts(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse products from localStorage, falling back to mock data.', e)
        localStorage.setItem('maribella_products', JSON.stringify(initialProducts))
      }
    } else {
      localStorage.setItem('maribella_products', JSON.stringify(initialProducts))
    }
    setIsLoaded(true)
  }, [])

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts)
    localStorage.setItem('maribella_products', JSON.stringify(newProducts))
  }

  const addProduct = (p: Omit<Product, 'id'>) => {
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
    saveProducts([...products, newProduct])
  }

  const deleteProduct = (id: string) => {
    saveProducts(products.filter(p => p.id !== id))
  }

  const updateProduct = (updated: Product) => {
    const discount = updated.originalPrice && updated.originalPrice > updated.price
      ? Math.round(((updated.originalPrice - updated.price) / updated.originalPrice) * 100)
      : undefined

    const updatedWithDiscount = {
      ...updated,
      discount
    }

    saveProducts(products.map(p => p.id === updated.id ? updatedWithDiscount : p))
  }

  return (
    <ProductsContext.Provider value={{ products, addProduct, deleteProduct, updateProduct }}>
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
