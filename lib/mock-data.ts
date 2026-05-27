// Mock data for Closet Twins e-commerce store
// Replace with real data from your database/API

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
  sizes?: string[]
  colors?: string[]
  isNew?: boolean
  isFeatured?: boolean
  discount?: number
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
  description?: string
}

export const CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Bolsas',
    slug: 'bolsas',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop',
    description: 'Bolsas e acessórios para todos os estilos'
  },
  {
    id: '2',
    name: 'Roupas',
    slug: 'roupas',
    image: 'https://images.unsplash.com/photo-1595777707802-41d339d16b85?w=500&h=500&fit=crop',
    description: 'Looks incríveis para qualquer ocasião'
  },
  {
    id: '3',
    name: 'Calçados',
    slug: 'calcados',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    description: 'Sapatos e tênis de primeira qualidade'
  },
  {
    id: '4',
    name: 'Acessórios',
    slug: 'acessorios',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
    description: 'Complementos perfeitos para seu visual'
  },
  {
    id: '5',
    name: 'Jóias',
    slug: 'joias',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
    description: 'Joias e bijuterias elegantes'
  },
  {
    id: '6',
    name: 'Maquiagem',
    slug: 'maquiagem',
    image: 'https://images.unsplash.com/photo-1596462502278-af07bdc34194?w=500&h=500&fit=crop',
    description: 'Produtos de beleza e cuidados pessoais'
  }
]

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Bolsa Tote Premium',
    description: 'Bolsa de couro legítimo, espaçosa e elegante para o dia a dia',
    price: 189.90,
    originalPrice: 249.90,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop',
    category: 'bolsas',
    rating: 4.8,
    reviews: 156,
    inStock: true,
    colors: ['Preto', 'Caramelo', 'Rosa'],
    isNew: false,
    isFeatured: true,
    discount: 24
  },
  {
    id: '2',
    name: 'Jaqueta Jeans Clássica',
    description: 'Jaqueta jeans em corte tradicional, perfeita para looks casuais',
    price: 149.90,
    originalPrice: 199.90,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop',
    category: 'roupas',
    rating: 4.6,
    reviews: 89,
    inStock: true,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Azul', 'Preto'],
    isNew: true,
    isFeatured: true,
    discount: 25
  },
  {
    id: '3',
    name: 'Tênis Esportivo Branco',
    description: 'Tênis confortável com tecnologia de amortecimento',
    price: 299.90,
    originalPrice: 399.90,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    category: 'calcados',
    rating: 4.9,
    reviews: 234,
    inStock: true,
    sizes: ['34', '35', '36', '37', '38', '39', '40', '41'],
    colors: ['Branco', 'Preto', 'Rosa'],
    isNew: false,
    isFeatured: true,
    discount: 25
  },
  {
    id: '4',
    name: 'Bolsa Clutch Metalizada',
    description: 'Bolsa pequena em material metalizado, ideal para festas',
    price: 89.90,
    image: 'https://images.unsplash.com/photo-1591553895911-0055eca6402d?w=500&h=500&fit=crop',
    category: 'bolsas',
    rating: 4.5,
    reviews: 67,
    inStock: true,
    colors: ['Ouro', 'Prata', 'Rosa Gold'],
    isNew: true,
    isFeatured: false
  },
  {
    id: '5',
    name: 'Vestido Longo Elegante',
    description: 'Vestido longo em crepe, perfeito para ocasiões especiais',
    price: 279.90,
    originalPrice: 349.90,
    image: 'https://images.unsplash.com/photo-1595777707802-41d339d16b85?w=500&h=500&fit=crop',
    category: 'roupas',
    rating: 4.7,
    reviews: 112,
    inStock: true,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto', 'Nude', 'Vinho'],
    isNew: false,
    isFeatured: true,
    discount: 20
  },
  {
    id: '6',
    name: 'Óculos de Sol Vintage',
    description: 'Óculos com armação em acetato, estilo retrô e moderno',
    price: 199.90,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
    category: 'acessorios',
    rating: 4.6,
    reviews: 89,
    inStock: true,
    colors: ['Preto', 'Marrom', 'Rosa'],
    isNew: true,
    isFeatured: false
  },
  {
    id: '7',
    name: 'Cinto de Couro Genuíno',
    description: 'Cinto de couro legítimo com fivela dourada',
    price: 119.90,
    originalPrice: 159.90,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
    category: 'acessorios',
    rating: 4.4,
    reviews: 54,
    inStock: true,
    colors: ['Preto', 'Caramelo', 'Branco'],
    isNew: false,
    isFeatured: false,
    discount: 25
  },
  {
    id: '8',
    name: 'Pulseira Ouro 18K',
    description: 'Pulseira delicada em ouro 18 quilates com certificado',
    price: 449.90,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
    category: 'joias',
    rating: 4.9,
    reviews: 42,
    inStock: true,
    isNew: true,
    isFeatured: true
  },
  {
    id: '9',
    name: 'Batom Vermelho Clássico',
    description: 'Batom de longa duração com acabamento mate',
    price: 59.90,
    image: 'https://images.unsplash.com/photo-1596462502278-af07bdc34194?w=500&h=500&fit=crop',
    category: 'maquiagem',
    rating: 4.7,
    reviews: 178,
    inStock: true,
    colors: ['Vermelho Clássico', 'Nude', 'Rosa Nude', 'Berry'],
    isNew: false,
    isFeatured: false
  },
  {
    id: '10',
    name: 'Camiseta Premium',
    description: 'Camiseta em algodão puro, confortável e durável',
    price: 79.90,
    originalPrice: 129.90,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    category: 'roupas',
    rating: 4.5,
    reviews: 203,
    inStock: true,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto', 'Branco', 'Cinza', 'Rosa'],
    isNew: false,
    isFeatured: true,
    discount: 38
  },
  {
    id: '11',
    name: 'Sandália Slide Confortável',
    description: 'Sandália slide com solado macio e antiderrapante',
    price: 129.90,
    image: 'https://images.unsplash.com/photo-1568152950566-c1bf43f0a86d?w=500&h=500&fit=crop',
    category: 'calcados',
    rating: 4.6,
    reviews: 145,
    inStock: true,
    sizes: ['34', '35', '36', '37', '38', '39', '40'],
    colors: ['Preto', 'Branco', 'Rose'],
    isNew: false,
    isFeatured: false
  },
  {
    id: '12',
    name: 'Bolsa Crossbody Mini',
    description: 'Bolsa pequena ideal para levar o essencial',
    price: 149.90,
    originalPrice: 199.90,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
    category: 'bolsas',
    rating: 4.8,
    reviews: 92,
    inStock: true,
    colors: ['Preto', 'Caramelo', 'Rosa'],
    isNew: true,
    isFeatured: false,
    discount: 25
  }
]

export const PROMO_ITEMS = [
  {
    title: 'Coleção Verão',
    description: 'Até 50% de desconto',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=400&fit=crop',
    href: '/categorias/roupas'
  },
  {
    title: 'Bolsas em Promoção',
    description: 'A partir de R$ 89,90',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=400&fit=crop',
    href: '/categorias/bolsas'
  }
]

export const BLOG_POSTS = [
  {
    id: '1',
    title: '5 tendências de moda para este verão',
    excerpt: 'Confira as tendências mais quentes da estação',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=300&fit=crop',
    date: '15 de maio, 2024'
  },
  {
    id: '2',
    title: 'Como combinar bolsas com diferentes looks',
    excerpt: 'Guia completo para acertar sempre',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop',
    date: '12 de maio, 2024'
  },
  {
    id: '3',
    title: 'Cuidados essenciais com seus acessórios',
    excerpt: 'Mantenha seus itens favoritos sempre lindos',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
    date: '10 de maio, 2024'
  }
]
