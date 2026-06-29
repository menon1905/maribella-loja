'use client'

export function PromoTicker() {
  return (
    <div className="relative w-full overflow-hidden bg-black text-white py-2.5 text-xs sm:text-sm font-semibold tracking-wide">
      <style>{`
        @keyframes scroll-text {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .ticker-wrapper {
          display: flex;
          gap: 3rem;
        }
        
        .ticker-text {
          animation: scroll-text 28s linear infinite;
          white-space: nowrap;
          display: inline-block;
          padding-right: 3rem;
        }
        
        .ticker-text:hover {
          animation-play-state: paused;
          cursor: pointer;
        }
      `}</style>
      
      <div className="ticker-wrapper">
        <span className="ticker-text">
          5% OFF EM SUA PRIMEIRA COMPRA • USE O CUPOM: BEMVINDAS • FRETE GRÁTIS EM COMPRAS ACIMA DE R$ 400
        </span>
        <span className="ticker-text">
          5% OFF EM SUA PRIMEIRA COMPRA • USE O CUPOM: BEMVINDAS • FRETE GRÁTIS EM COMPRAS ACIMA DE R$ 400
        </span>
      </div>
    </div>
  )
}
