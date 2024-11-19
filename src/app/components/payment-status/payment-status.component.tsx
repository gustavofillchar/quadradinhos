'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface PaymentStatusProps {
  paymentId: string;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ paymentId }) => {
  const router = useRouter()
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const { data, error } = await supabase
        .from('purchases')
        .select('status')
        .eq('payment_id', paymentId)
        .single()

      if (data?.status === 'completed') {
        setIsCompleted(true)
        router.push('/purchases')
      }
    }

    const interval = setInterval(checkPaymentStatus, 3000)
    return () => clearInterval(interval)
  }, [paymentId, router])

  return (
    <div className="mt-4 text-center">
      <p className="text-sm text-gray-600">
        {isCompleted 
          ? 'Pagamento confirmado! Redirecionando...'
          : 'Aguardando confirmação do pagamento...'}
      </p>
    </div>
  )
}

export default PaymentStatus