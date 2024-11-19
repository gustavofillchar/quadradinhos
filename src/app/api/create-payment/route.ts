import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { supabase } from '@/lib/supabase'

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
});

export async function POST(request: Request) {
  try {
    const { name, email, link, imagePath } = await request.json()

    // Criar pagamento PIX
    const payment = new Payment(client);
    const paymentData = {
      transaction_amount: 1,
      description: 'Quadradinho de Um Real',
      payment_method_id: 'pix',
      payer: {
        email,
        first_name: name
      }
    }

    const response = await payment.create({ body: paymentData });

    // Verificar se temos o QR code do PIX
    if (!response.point_of_interaction?.transaction_data?.qr_code) {
      throw new Error('QR Code PIX não gerado');
    }

    // Salvar informações no Supabase
    const { data, error } = await supabase
      .from('purchases')
      .insert([
        {
          name,
          email,
          link,
          image_path: imagePath,
          payment_id: response.id,
          status: 'pending'
        }
      ])

    if (error) throw error

    return NextResponse.json({ 
        pixCode: response.point_of_interaction.transaction_data.qr_code,
        qrCodeBase64: response.point_of_interaction.transaction_data.qr_code_base64,
        pixCopyPaste: response.point_of_interaction.transaction_data.ticket_url,
        paymentId: response.id
      })

  } catch (error) {
    console.error('Erro ao criar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao processar pagamento' },
      { status: 500 }
    )
  }
}