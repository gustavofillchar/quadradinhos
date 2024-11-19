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
    
    if (body.type === 'payment' && 
        body.action === 'payment.updated' && 
        body.data?.id) {
      console.log('Processing payment:', body.data.id)
      const payment = new Payment(client)

      try {
        const paymentData = await payment.get({ id: body.data.id })
        
        if (paymentData.status === 'approved') {
          console.log('Payment data:', paymentData.status)
          
          // Primeiro, busca o purchase_group_id
          const { data: purchaseData } = await supabase
            .from('purchases')
            .select('purchase_group_id')
            .eq('payment_id', String(paymentData.id))
            .single()

          if (!purchaseData?.purchase_group_id) {
            throw new Error('Purchase group not found')
          }

          // Atualiza todos os registros do mesmo grupo
          const { error } = await supabase
            .from('purchases')
            .update({ status: 'completed' })
            .eq('purchase_group_id', purchaseData.purchase_group_id)

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