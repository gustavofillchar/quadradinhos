export function generateEmailTemplate({
  name,
  position,
  extraTickets,
  shareLink
}: {
  name: string;
  position: number;
  extraTickets: number;
  shareLink: string;
}) {
  const baseCoupon = `C-${position}`;
  const additionalCoupons = Array.from(
    { length: extraTickets },
    (_, index) => `${baseCoupon}-${index + 1}`
  );

  const couponsHtml = additionalCoupons.length > 0
    ? `<p>Seus cupons adicionais:<br/>${additionalCoupons.join('<br/>')}</p>`
    : '';

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Olá ${name || 'participante'}!</h2>
      
      <p>Obrigado por participar e comprar seu quadradinho!</p>

      <p>Seu link para divulgar nas redes sociais é:<br/>
      <a href="${shareLink}">${shareLink}</a></p>

      <p>Seu cupom principal:<br/>
      ${baseCoupon}</p>

      ${couponsHtml}

      <p>Guarde bem seus cupons!</p>
      <p>O sorteio será realizado até o dia 30/01/2025 ou assim que todos os quadradinhos forem vendidos. Você receberá novidades sobre o sorteio por e-mail.</p>

      <p style="color: #666; font-size: 0.9em; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
        Não responda este e-mail. Para qualquer dúvida ou suporte, entre em contato através do e-mail: gustavo.byorbit@gmail.com
      </p>
    </div>
  `;
}