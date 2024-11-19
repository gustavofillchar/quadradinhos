'use client'
import { useState } from 'react'
import GridSelection from "./components/grid-selection/grid.component"
import PurchaseForm from "./components/purchase-form/purchase-form.component"

export default function Home() {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

  return (
    <main className="container mx-auto p-4">
      {!selectedPosition ? (
        <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">
          Compre seu quadradinho por apenas <span className="text-orange-500">R$ 1,00 no PIX</span>
        </h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-lg mb-2">
            🎁 Ganhe automaticamente um cupom para concorrer a um <span className="font-semibold">iPhone 15</span>
          </p>
          <p className="text-gray-600 text-sm">
            Após a confirmação do pagamento, você receberá seu código do cupom por e-mail e as informações para concorrer ao sorteio.
          </p>
        </div>
        <GridSelection onPositionSelect={setSelectedPosition} />
      </div>
      ) : (
        <div>
          <button 
            onClick={() => setSelectedPosition(null)}
            className="mb-4 text-blue-500 hover:underline"
          >
            ← Voltar para seleção
          </button>
          <PurchaseForm selectedPosition={selectedPosition} />
        </div>
      )}
    </main>
  )
}