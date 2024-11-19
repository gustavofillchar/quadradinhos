import React from 'react';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Termos de Serviço</h1>
      
      <div className="prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
          <p>Ao utilizar o serviço Quadradinhos de Um Real, você concorda com estes termos de serviço em sua totalidade.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Descrição do Serviço</h2>
          <p>O Quadradinhos de Um Real é um projeto experimental e recreativo que permite aos usuários comprarem espaços virtuais ("quadradinhos") por R$ 1,00 cada.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Autorização de Uso de Dados e Imagem</h2>
          <p>Ao adquirir um quadradinho, você expressamente autoriza:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>A exibição pública da imagem enviada</li>
            <li>A exibição pública dos dados cadastrados, incluindo:
              <ul className="list-disc pl-6 mt-1">
                <li>Nome (quando fornecido)</li>
                <li>Redes sociais vinculadas (Instagram, TikTok, Website)</li>
                <li>Descrição fornecida</li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Pagamentos e Reembolsos</h2>
          <p>Por se tratar de um projeto experimental e recreativo:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Não realizamos estornos ou reembolsos dos valores pagos</li>
            <li>O pagamento é processado via PIX através do Mercado Pago</li>
            <li>O valor é fixo em R$ 1,00 por quadradinho</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Remoção de Conteúdo</h2>
          <p>Caso deseje remover seu quadradinho e os dados associados, você pode solicitar a exclusão através do email gustavo.byorbit@gmail.com com o assunto "excluir meu quadradinho".</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Limitações de Responsabilidade</h2>
          <p>O serviço é fornecido "como está", sem garantias de qualquer tipo. Não nos responsabilizamos por:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Indisponibilidade temporária do serviço</li>
            <li>Perda de dados</li>
            <li>Problemas técnicos</li>
          </ul>
        </section>
      </div>
    </div>
  );
}