'use client'
import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import PaymentStatus from '../payment-status/payment-status.component'

interface PixData {
  pixCode: string;
  qrCodeBase64: string;
  pixCopyPaste: string;
  paymentId: string;
}

const PurchaseForm: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [link, setLink] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [pixData, setPixData] = useState<PixData | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const imagePath = image ? `purchases/${Date.now()}_${image.name}` : null
      if (image && imagePath) {
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(imagePath, image)
        
        if (uploadError) throw uploadError
      }

      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          link,
          imagePath
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setPixData(data)
      } else {
        throw new Error(data.error)
      }

    } catch (error) {
      console.error('Erro ao processar compra:', error)
      alert('Erro ao processar sua compra. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (pixData) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Pagamento PIX</h2>
        <div className="flex flex-col items-center space-y-4">
          <img 
            src={`data:image/jpeg;base64,${pixData.qrCodeBase64}`} 
            alt="QR Code PIX"
            className="w-48 h-48"
          />
          <button
            onClick={() => navigator.clipboard.writeText(pixData.pixCode)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Copiar código PIX
          </button>
          <a
            href={pixData.pixCopyPaste}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Abrir PIX no banco
          </a>
          <PaymentStatus paymentId={pixData.paymentId} />
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Link</label>
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="https://"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Imagem</label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          accept="image/*"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          A imagem será exibida em seu quadradinho
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Processando...' : 'Gerar PIX'}
      </button>
    </form>
  )
}

export default PurchaseForm