import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { supabase } from '@/lib/supabase'

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Webhook received:', body)
    
    // Verifica tanto o type quanto a action
    if (body.type === 'payment' && 
        body.action === 'payment.updated' && 
        body.data?.id) {
      console.log('Processing payment:', body.data.id)
      const payment = new Payment(client)
      
      try {
        const paymentData = await payment.get({ id: body.data.id })
        console.log('Payment data:', paymentData)

        if (paymentData.status === 'approved') {
          console.log('Updating purchase status for payment:', paymentData.id)
          const { error } = await supabase
            .from('purchases')
            .update({ status: 'completed' })
            .eq('payment_id', paymentData.id)

          if (error) {
            console.error('Supabase error:', error)
            throw error
          }
        }
      } catch (paymentError) {
        console.error('Payment processing error:', paymentError)
        return NextResponse.json(
          { error: 'Payment processing failed' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}