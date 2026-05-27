'use client'

export function PromoTicker() {
  return (
    <div className="relative w-full overflow-hidden bg-primary text-primary-foreground py-2 text-xs sm:text-sm font-medium">
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
          gap: 2rem;
        }
        
        .ticker-text {
          animation: scroll-text 25s linear infinite;
          white-space: nowrap;
          display: inline-block;
          padding-right: 2rem;
        }
        
        .ticker-text:hover {
          animation-play-state: paused;
          cursor: pointer;
        }
      `}</style>
      
      <div className="ticker-wrapper">
        <span className="ticker-text">
          ✨ 5% OFF EM SUA PRIMEIRA COMPRA • USE: BEMVINDAS • Frete Grátis +R$150 • Parcelamos em 12x
        </span>
        <span className="ticker-text">
          ✨ 5% OFF EM SUA PRIMEIRA COMPRA • USE: BEMVINDAS • Frete Grátis +R$150 • Parcelamos em 12x
        </span>
      </div>
    </div>
  )
}
