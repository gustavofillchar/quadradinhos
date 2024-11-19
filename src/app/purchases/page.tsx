import { supabase } from '@/lib/supabase'

export const revalidate = 0

async function PurchasesPage() {
  const { data: purchases } = await supabase
    .from('purchases')
    .select('*')
    .eq('status', 'completed')
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Quadradinhos Comprados</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {purchases?.map((purchase) => (
          <div key={purchase.id} className="border rounded-lg p-4">
            <img
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${purchase.image_path}`}
              alt={purchase.name}
              className="w-full h-48 object-cover rounded-md"
            />
            <h2 className="mt-2 font-bold">{purchase.name}</h2>
            <a href={purchase.link} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
              Ver link
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PurchasesPage