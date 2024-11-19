'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import PaymentStatus from '../payment-status/payment-status.component'
import ImageUpload from '../image-upload/image-upload.component'

interface PurchaseFormProps {
  selectedPosition: number;
}

interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  website?: string;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({ selectedPosition }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [showDescription, setShowDescription] = useState(false)
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({})
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [pixData, setPixData] = useState<any>(null)
  const [showInstagram, setShowInstagram] = useState(false)
  const [showTiktok, setShowTiktok] = useState(false)
  const [showWebsite, setShowWebsite] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [availablePositions, setAvailablePositions] = useState<number[]>([])
  const [extraTickets, setExtraTickets] = useState(0)
 
  useEffect(() => {
    const checkPositionAvailable = async () => {
      const { data: occupiedPositions } = await supabase
        .from('purchases')
        .select('position')
        .eq('position', selectedPosition)
        .or('status.eq.completed,and(status.eq.pending,reserved_at.gte.' +
          new Date(Date.now() - 10 * 60 * 1000).toISOString() + ')')
  
      if (occupiedPositions && occupiedPositions.length > 0) {
        alert('Esta posição já está ocupada. Por favor, escolha outra posição.');
        setAvailablePositions([]);
      } else {
        setAvailablePositions([selectedPosition]);
      }
    }
  
    checkPositionAvailable();
  }, [selectedPosition]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Image is now optional
      let fileName = null;
      if (image) {
        const fileExt = image.name.split('.').pop();
        fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, image);
    
        if (uploadError) {
          throw uploadError;
        }
      }
  
      if (availablePositions.length === 0) {
        throw new Error('Não há posições disponíveis. Por favor, selecione outra posição inicial.');
      }
  
      if (availablePositions.length < quantity) {
        throw new Error(`Só existem ${availablePositions.length} posições disponíveis a partir da posição selecionada.`);
      }
  
      // Usar as posições disponíveis já verificadas
      const selectedPositions = availablePositions.slice(0, quantity);
  
      // Criar pagamento
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          socialLinks,
          description,
          imagePath: fileName, // This will be null if no image was uploaded
          position: selectedPosition,
          extraTickets,
          reservedAt: new Date().toISOString()
        }),
      });

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pagamento')
      }

      setPixData(data)

    } catch (error) {
      console.error('Erro:', error)
      alert(error instanceof Error ? error.message : 'Erro ao processar sua compra')
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
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Quadradinho #{selectedPosition}</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Quadradinho #{selectedPosition}</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Valor:</div>
            <div className="text-lg font-bold">R$ 1,00</div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Cupons extras:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setExtraTickets(t => Math.max(0, t - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-8 text-center">{extraTickets}</span>
              <button
                type="button"
                onClick={() => setExtraTickets(t => t + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Subtotal:</div>
            <div className="text-lg font-bold">R$ {(extraTickets * 1).toFixed(2)}</div>
          </div>
        </div>

      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          🎁 Você receberá {1 + extraTickets} {1 + extraTickets === 1 ? 'cupom' : 'cupons'} para concorrer ao iPhone 16 Pro Max!
        </p>
        <p className="text-xs text-yellow-700 mt-1">
          • 1 cupom incluso com o quadradinho
          {extraTickets > 0 && ` + ${extraTickets} ${extraTickets === 1 ? 'cupom extra' : 'cupons extras'}`}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nome <span className="text-gray-400 text-xs">(opcional)</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      {!showDescription && (
        <button
          type="button"
          onClick={() => setShowDescription(true)}
          className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
        >
          + Adicionar Descrição
        </button>
      )}

      {showDescription && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descrição <span className="text-gray-400 text-xs">(opcional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Descreva o que você quer divulgar..."
            rows={3}
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Redes Sociais <span className="text-gray-400 text-xs">(opcional)</span>
        </label>

        <div className="flex flex-wrap gap-2">
          {!showInstagram && (
            <button
              type="button"
              onClick={() => setShowInstagram(true)}
              className="text-sm px-3 py-1 bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200"
            >
              + Adicionar Instagram
            </button>
          )}

          {!showTiktok && (
            <button
              type="button"
              onClick={() => setShowTiktok(true)}
              className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
            >
              + Adicionar TikTok
            </button>
          )}

          {!showWebsite && (
            <button
              type="button"
              onClick={() => setShowWebsite(true)}
              className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
            >
              + Adicionar Website
            </button>
          )}
        </div>

        {showInstagram && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">@</span>
            </div>
            <input
              type="text"
              value={socialLinks.instagram || ''}
              onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
              className="pl-8 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="seu.instagram"
            />
          </div>
        )}

        {showTiktok && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">@</span>
            </div>
            <input
              type="text"
              value={socialLinks.tiktok || ''}
              onChange={(e) => setSocialLinks(prev => ({ ...prev, tiktok: e.target.value }))}
              className="pl-8 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="seu.tiktok"
            />
          </div>
        )}

        {showWebsite && (
          <input
            type="url"
            value={socialLinks.website || ''}
            onChange={(e) => setSocialLinks(prev => ({ ...prev, website: e.target.value }))}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="https://seusite.com"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Imagem <span className="text-red-500">*</span>
        </label>
        <ImageUpload onImageChange={setImage} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white font-bold px-4 py-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? 'Processando...' :
          `Comprar por R$ ${(1 + extraTickets).toFixed(2)}`}
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          ✨ Ao comprar seu quadradinho, você ganha um link personalizado para divulgar sua imagem e suas redes sociais!
        </p>
      </div>
    </form>
  )
}

export default PurchaseForm