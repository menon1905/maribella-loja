// Mock data for Closet Twins e-commerce store
// Replace with real data from your database/API

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
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
    image: '/icon_bolsas.png',
    description: 'Bolsas e acessórios para todos os estilos'
  },
  {
    id: '2',
    name: 'Roupas',
    slug: 'roupas',
    image: '/icon_roupas.png',
    description: 'Looks incríveis para qualquer ocasião'
  },
  {
    id: '3',
    name: 'Calçados',
    slug: 'calcados',
    image: '/icon_calcados.png',
    description: 'Sapatos e tênis de primeira qualidade'
  },
  {
    id: '4',
    name: 'Jóias',
    slug: 'joias',
    image: '/icon_joias.png',
    description: 'Joias e bijuterias elegantes'
  },
]

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Bolsa Tote Premium',
    description: 'Bolsa de couro legítimo, espaçosa e elegante para o dia a dia',
    price: 189.90,
    originalPrice: 249.90,
    image: '/cat_bolsas.png',
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
    name: 'Vestido Chic Casual',
    description: 'Lindo vestido em corte tradicional, perfeita para looks casuais',
    price: 149.90,
    originalPrice: 199.90,
    image: '/cat_roupas.png',
    category: 'roupas',
    rating: 4.6,
    reviews: 89,
    inStock: true,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Azul', 'Rosa'],
    isNew: true,
    isFeatured: true,
    discount: 25
  },
  {
    id: '3',
    name: 'Sapatilha Esportiva Rosa',
    description: 'Tênis super confortável com tecnologia de amortecimento',
    price: 299.90,
    originalPrice: 399.90,
    image: '/cat_calcados.png',
    category: 'calcados',
    rating: 4.9,
    reviews: 234,
    inStock: true,
    sizes: ['34', '35', '36', '37', '38', '39', '40', '41'],
    colors: ['Branco', 'Rosa'],
    isNew: false,
    isFeatured: true,
    discount: 25
  },
  {
    id: '4',
    name: 'Bolsa Clutch Metalizada',
    description: 'Bolsa pequena em material metalizado, ideal para festas',
    price: 89.90,
    image: '/cat_bolsas.png',
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
    image: '/cat_roupas.png',
    category: 'roupas',
    rating: 4.7,
    reviews: 112,
    inStock: true,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto', 'Nude', 'Rosa'],
    isNew: false,
    isFeatured: true,
    discount: 20
  },
  {
    id: '8',
    name: 'Pulseira Ouro Rosé',
    description: 'Pulseira delicada em ouro rosé com certificado',
    price: 449.90,
    image: '/cat_joias.png',
    category: 'joias',
    rating: 4.9,
    reviews: 42,
    inStock: true,
    isNew: true,
    isFeatured: true
  },
  {
    id: '10',
    name: 'Camiseta Premium',
    description: 'Camiseta em algodão puro, confortável e durável',
    price: 79.90,
    originalPrice: 129.90,
    image: '/cat_roupas.png',
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
    image: '/cat_calcados.png',
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
    image: '/cat_bolsas.png',
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
    image: '/cat_roupas.png',
    href: '/categorias/roupas'
  },
  {
    title: 'Bolsas em Promoção',
    description: 'A partir de R$ 89,90',
    image: '/cat_bolsas.png',
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
