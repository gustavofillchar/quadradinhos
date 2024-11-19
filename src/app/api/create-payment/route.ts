import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { supabase } from '@/lib/supabase'

// Certifique-se de que a variável de ambiente está definida corretamente
const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN
if (!MERCADOPAGO_ACCESS_TOKEN) {
  throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurado')
}

const client = new MercadoPagoConfig({ 
  accessToken: MERCADOPAGO_ACCESS_TOKEN
});

export async function POST(request: Request) {
  try {
    const { 
      name, 
      email, 
      imagePath, 
      position, // Agora recebemos position ao invés de positions
      extraTickets, 
      reservedAt, 
      description, 
      socialLinks 
    } = await request.json()
  
    const { data: existingPosition } = await supabase
      .from('purchases')
      .select('position')
      .eq('position', position)
      .or('status.eq.completed,and(status.eq.pending,reserved_at.gte.' + 
          new Date(Date.now() - 10 * 60 * 1000).toISOString() + ')')

    if (existingPosition?.length) {
      return NextResponse.json(
        { error: 'Esta posição já está ocupada' },
        { status: 400 }
      )
    }

    // Criar pagamento PIX
    const payment = new Payment(client);
    const paymentData = {
      transaction_amount: 1 + extraTickets,
      description: `Quadradinho #${position} ${extraTickets > 0 ? `+ ${extraTickets} cupons extras` : ''} - Um Real`,
      payment_method_id: 'pix',
      payer: {
        email,
        first_name: name,
        identification: {
          type: 'CPF',
          number: '00000000000'
        }
      },
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`
    }
    const response = await payment.create({ body: paymentData });
    const paymentId = response.id?.toString();

    // Criar registro único no Supabase
    const purchaseRecord = {
      name,
      email,
      image_path: imagePath,
      payment_id: paymentId,
      status: 'pending',
      position: position,
      reserved_at: reservedAt,
      description,
      social_links: socialLinks,
      extra_tickets: extraTickets
    }

    const { error: insertError } = await supabase
      .from('purchases')
      .insert([purchaseRecord])

    if (insertError) {
      throw insertError
    }

    // Retornar dados do PIX
    return NextResponse.json({
      pixCode: response.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: response.point_of_interaction?.transaction_data?.qr_code_base64,
      pixCopyPaste: response.point_of_interaction?.transaction_data?.qr_code,
      paymentId: paymentId
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}