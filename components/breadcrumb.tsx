'use client'

import Link from 'next/link'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between py-4 max-w-7xl mx-auto px-4 w-full border-b border-border">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-primary hover:bg-primary/10"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Button>

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm">
        {items.map((item, index) => (
          <div key={item.href} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            {index === items.length - 1 ? (
              <span className="font-semibold text-foreground">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Spacer */}
      <div className="w-20" />
    </div>
  )
}
