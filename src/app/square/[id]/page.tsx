import { supabase } from '@/lib/supabase'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Props = {
  params?: any,
  searchParams?: any
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const position = Number(params.id)
  
  const { data: purchase } = await supabase
    .from('purchases')
    .select('name')
    .eq('position', position)
    .eq('status', 'completed')
    .single()

  return {
    title: purchase ? `Quadradinho #${position} - ${purchase.name}` : 'Quadradinho não encontrado',
    description: purchase ? `Veja o quadradinho #${position} comprado por ${purchase.name}` : undefined,
  }
}

export default async function SquarePage({ params }: Props) {
  const position = Number(params.id)
 
  const { data: purchase } = await supabase
    .from('purchases')
    .select('*')
    .eq('position', position)
    .eq('status', 'completed')
    .single()

  if (!purchase) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-64 sm:h-96">
          <img
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${purchase.image_path}`}
            alt={purchase.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Quadradinho #{purchase.position}</h1>
            <span className="text-gray-500">
              {new Date(purchase.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Proprietário</h2>
              <p className="text-gray-700">{purchase.name}</p>
            </div>

            {purchase.description && (
              <div>
                <h2 className="text-lg font-semibold">Sobre</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{purchase.description}</p>
              </div>
            )}
            
            <div>
              <h2 className="text-lg font-semibold">Redes Sociais</h2>
              <div className="flex flex-wrap gap-4 mt-2">
                {purchase.social_links?.instagram && (
                  <a 
                    href={`https://instagram.com/${purchase.social_links.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-pink-600 hover:underline"
                  >
                    <span>Instagram</span>
                  </a>
                )}
                {purchase.social_links?.tiktok && (
                  <a 
                    href={`https://tiktok.com/@${purchase.social_links.tiktok}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-black hover:underline"
                  >
                    <span>TikTok</span>
                  </a>
                )}
                {purchase.social_links?.website && (
                  <a 
                    href={purchase.social_links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-500 hover:underline"
                  >
                    <span>Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}