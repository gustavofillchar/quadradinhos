import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { supabase } from '@/lib/supabase'

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (body.type === 'payment' && body.data.id) {
      const payment = new Payment(client)
      const paymentData = await payment.get({ id: body.data.id })

      if (paymentData.status === 'approved') {
        const { error } = await supabase
          .from('purchases')
          .update({ status: 'completed' })
          .eq('payment_id', paymentData.id)

        if (error) throw error
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}