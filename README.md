# Closet Twins - Clone E-commerce

Uma réplica fiel do site de e-commerce **Closet Twins** (https://www.closettwins.com.br) construída com Next.js 16, React, Tailwind CSS e shadcn/ui.

## 🎨 Características

### Design Visual
- **Paleta de cores**: Rosa primária (#FF1493), Preto, Branco e Cinza
- **Layout responsivo**: Mobile-first design que funciona perfeitamente em todos os tamanhos de tela
- **Componentes modernos**: Carrosséis suaves, cards interativos, efeitos hover elegantes
- **Tipografia**: Máximo 2 fontes para manter a coesão visual

### Estrutura de Páginas

#### Homepage (`/`)
- Hero section com imagem de destaque
- Carrossel de "Produtos em Destaque"
- Seção de promoções (Coleção Verão, Bolsas em Promoção)
- Carrossel de "Novidades"
- Grid de categorias interativas
- Newsletter signup
- Footer com links e informações de contato

#### Categorias (`/categorias/[slug]`)
- Filtros laterais (Filtros, Preço, Avaliação)
- Grid de produtos por categoria
- 6 categorias: Bolsas, Roupas, Calçados, Acessórios, Jóias, Maquiagem

#### Detalhes do Produto (`/produto/[id]`)
- Galeria de imagens
- Informações completas do produto
- Seleção de tamanho/cor/quantidade
- Favoritos e compartilhamento
- Avaliações de clientes
- Produtos relacionados
- Informações de entrega e garantia

#### Listagem de Produtos (`/produtos`)
- Filtros avançados por categoria, preço, avaliação
- Grid responsivo de todos os produtos
- Ordenação (Relevância, Preço, Vendas, Novidades)
- Paginação

#### Carrinho (`/carrinho`)
- Listagem de produtos adicionados
- Ajuste de quantidade
- Remoção de itens
- Cupom de desconto
- Resumo com cálculo de frete
- Estimativa de frete grátis acima de R$ 150

#### Checkout (`/checkout`)
- Fluxo de 3 passos: Endereço → Pagamento → Confirmação
- Formulário de endereço completo
- Seleção de método de pagamento
- Confirmação de pedido com número de rastreamento

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes UI**: shadcn/ui
- **Ícones**: Lucide Icons
- **Validação de Formulários**: React Hook Form
- **Imagens**: Next.js Image Optimization

## 📁 Estrutura de Arquivos

```
src/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Homepage
│   ├── globals.css                   # Global styles com design tokens
│   ├── categorias/
│   │   └── [slug]/
│   │       └── page.tsx              # Página de categoria
│   ├── produto/
│   │   └── [id]/
│   │       └── page.tsx              # Detalhes do produto
│   ├── produtos/
│   │   └── page.tsx                  # Listagem de produtos
│   ├── carrinho/
│   │   └── page.tsx                  # Carrinho
│   └── checkout/
│       └── page.tsx                  # Checkout
├── components/
│   ├── header.tsx                    # Header com navegação
│   ├── footer.tsx                    # Footer
│   ├── hero-section.tsx              # Hero banner
│   ├── product-card.tsx              # Card de produto
│   ├── product-carousel.tsx          # Carrossel de produtos
│   ├── category-grid.tsx             # Grid de categorias
│   ├── promo-section.tsx             # Seção de promoções
│   ├── newsletter-section.tsx        # Newsletter signup
│   └── ui/                           # shadcn/ui components
├── lib/
│   ├── mock-data.ts                  # Dados fictícios de produtos
│   └── utils.ts                      # Funções utilitárias
├── hooks/
│   └── use-mobile.tsx                # Hook para detecção de mobile
└── public/                           # Assets estáticos
```

## 📊 Dados Mock

O arquivo `lib/mock-data.ts` contém estruturas TypeScript para:
- **Products**: 12 produtos exemplo com preços, avaliações, cores, tamanhos
- **Categories**: 6 categorias principais
- **Promo Items**: 2 itens promocionais
- **Blog Posts**: 3 posts de blog (estrutura preparada)

Todos os dados são facilmente substituíveis por dados reais de uma API ou banco de dados.

## 🎯 Funcionalidades Implementadas

### Navegação
- ✅ Menu principal com 6 categorias
- ✅ Buscador de produtos
- ✅ Menu mobile responsivo
- ✅ Breadcrumb em páginas de categoria e produto

### Produtos
- ✅ Cards de produto com badges (NOVO, desconto %)
- ✅ Avaliações com estrelas
- ✅ Preços com desconto visual
- ✅ Status de estoque
- ✅ Zoom ao hover
- ✅ Galeria de imagens no detalhe

### Carrinho
- ✅ Adicionar/remover itens
- ✅ Ajustar quantidade
- ✅ Cálculo de frete
- ✅ Cupom de desconto (estrutura)
- ✅ Estimativa de frete grátis

### Checkout
- ✅ Formulário de endereço
- ✅ Seleção de método de pagamento
- ✅ Confirmação de pedido
- ✅ Número de rastreamento

### Filtros e Ordenação
- ✅ Filtros por categoria, preço, avaliação
- ✅ Ordenação por relevância, preço, vendas

## 🎨 Design System

### Cores Principais
- **Primary (Rosa)**: `hsl(322 89% 55%)` - Botões CTA, links, destaque
- **Secondary (Preto)**: Footer e textos secundários
- **Muted (Cinza)**: Backgrounds e bordas
- **Background (Branco)**: Base
- **Foreground (Preto)**: Texto principal

### Tipografia
- **Sans**: Geist (default)
- **Mono**: Geist Mono (para código)

### Espaçamento
- Usa escala de espaçamento padrão do Tailwind
- Gaps de 4px para elementos próximos

## 📱 Responsividade

- **Mobile**: Layout em coluna única, menu hamburger
- **Tablet**: 2 colunas, navegação expandida
- **Desktop**: Layout completo com 3-4 colunas

Breakpoints Tailwind:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

## 🚀 Como Usar

### Instalação

```bash
# Clonar e instalar dependências
git clone <repository>
cd closet-twins
pnpm install
```

### Desenvolvimento

```bash
pnpm dev
```

Acesse em `http://localhost:3000`

### Build para Produção

```bash
pnpm build
pnpm start
```

## 🔄 Substituindo Dados Mock

### Conectar a uma API Real

1. **Criar um servidor de API** (por exemplo, Next.js API Routes)
2. **Modificar `lib/mock-data.ts`** para fazer requisições HTTP
3. **Atualizar componentes** para usar `useEffect` com SWR para cache automático

Exemplo:

```typescript
// lib/mock-data.ts
import useSWR from 'swr'

export function useProducts() {
  const { data, error } = useSWR('/api/products', fetcher)
  return { products: data || [], isLoading: !error && !data }
}
```

### Conectar a um Banco de Dados

1. **Neon PostgreSQL** (recomendado para esta stack)
2. **Drizzle ORM** para gerenciar schema
3. **Server Actions** no Next.js para mutations

## 📋 Próximos Passos

Para transformar este clone em uma aplicação completa:

1. **Integração de Backend**
   - API de produtos real
   - Banco de dados de usuários
   - Sistema de pedidos

2. **Autenticação**
   - Better Auth com Neon
   - Login/Logout
   - Perfil do usuário

3. **Pagamentos**
   - Integração Stripe
   - Processamento de cartão seguro

4. **Carrinho Persistente**
   - Salvar em banco de dados por usuário
   - Sincronizar com múltiplos dispositivos

5. **Email**
   - Confirmação de pedido
   - Newsletter real
   - Recuperação de senha

6. **Análitica**
   - PostHog para comportamento do usuário
   - Google Analytics
   - Conversão de vendas

## 📝 Notas

- Todas as imagens são de placeholder (Unsplash)
- Os preços e IDs são fictícios
- O carrinho usa estado local (não persiste em refresh)
- O checkout é um fluxo visual, sem processamento real
- Todos os dados podem ser facilmente migrados para uma fonte real

## 📄 Licença

Este projeto é uma réplica educacional apenas para fins de referência de design e arquitetura.

---

**Desenvolvido com v0 by Vercel** ✨
