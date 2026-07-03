'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ShippingCalculator() {
  const [cep, setCep] = useState('')
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState('')

  const handleCalculate = () => {
    const cepClean = cep.replace(/\D/g, '')
    if (cepClean.length !== 8) {
      setError('CEP inválido. Digite 8 dígitos.')
      setResult('')
      return
    }

    setError('')
    const storeCep = 13056272
    const diff = Math.abs(parseInt(cepClean) - storeCep)
    const distance = diff / 1000
    const cost = 5 + Math.max(0, distance - 5) * 1

    setResult(`Frete: R$ ${cost.toFixed(2)} (Distância aproximada: ${distance.toFixed(1)} km)`)
  }

  return (
    <div className="bg-pink-50/50 border border-pink-100 rounded-2xl p-6 mt-6">
      <h3 className="font-bold text-gray-900 text-base mb-2">Simular Frete por Distância</h3>
      <p className="text-xs text-gray-500 mb-4">
        A partir do nosso endereço padrão: Rua Eliane Trabulsi Valente, 301 Jd. Ademar de Barros (CEP 13056-272)
      </p>
      
      <div className="flex flex-col sm:flex-row gap-2 max-w-md">
        <div className="flex-grow">
          <Input
            type="text"
            placeholder="Digite seu CEP (Ex: 13056272)"
            value={cep}
            onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
            onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
            className="w-full focus-visible:ring-[#ff9edb] bg-white"
            maxLength={8}
          />
        </div>
        <Button
          onClick={handleCalculate}
          className="bg-[#b83070] hover:bg-[#9e2860] text-white font-bold transition-colors cursor-pointer"
        >
          Calcular
        </Button>
      </div>

      {error && <p className="text-xs text-red-500 mt-2 font-medium">{error}</p>}
      {result && <p className="text-sm text-green-700 mt-3 font-semibold">{result}</p>}
    </div>
  )
}
