import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'
import { generateEmailTemplate } from '@/lib/email-template'

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
})

const resend = new Resend(process.env.RESEND_API_KEY)

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
          console.log('Payment approved:', paymentData.status)
          
          // Buscar dados da compra
          const { data: purchase, error: purchaseError } = await supabase
            .from('purchases')
            .select('*')
            .eq('payment_id', String(paymentData.id))
            .single()

          if (purchaseError) {
            console.error('Error fetching purchase:', purchaseError)
            throw purchaseError
          }

          // Atualizar status no Supabase
          const { error: updateError } = await supabase
            .from('purchases')
            .update({ status: 'completed' })
            .eq('payment_id', String(paymentData.id))

          if (updateError) {
            console.error('Error updating purchase:', updateError)
            throw updateError
          }

          // Gerar link de compartilhamento
          const shareLink = `${process.env.NEXT_PUBLIC_SITE_URL}/square/${purchase.position}`

          // Enviar email
          try {
            await resend.emails.send({
              from: 'Quadradinho Premiado <hey@cupons.quadradinhos.online>',
              to: purchase.email,
              subject: 'Seus Cupons - Quadradinho Premiado',
              html: generateEmailTemplate({
                name: purchase.name || '',
                position: purchase.position,
                extraTickets: purchase.extra_tickets,
                shareLink: shareLink
              })
            })
            console.log('Email sent successfully')
          } catch (emailError) {
            console.error('Error sending email:', emailError)
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