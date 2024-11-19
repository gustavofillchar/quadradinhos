import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
      
      <div className="prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Coleta de Dados</h2>
          <p>Coletamos os seguintes dados quando você utiliza nosso serviço:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Nome (opcional)</li>
            <li>Endereço de e-mail</li>
            <li>Imagem enviada</li>
            <li>Descrição (opcional)</li>
            <li>Links de redes sociais (opcional):
              <ul className="list-disc pl-6 mt-1">
                <li>Instagram</li>
                <li>TikTok</li>
                <li>Website</li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Uso dos Dados</h2>
          <p>Utilizamos seus dados para:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Exibir seu quadradinho na grade</li>
            <li>Processar seu pagamento</li>
            <li>Enviar comunicações relacionadas ao serviço</li>
            <li>Criar sua página individual de quadradinho</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Compartilhamento de Dados</h2>
          <p>Seus dados são exibidos publicamente em nosso site, incluindo:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>A imagem enviada</li>
            <li>Nome (se fornecido)</li>
            <li>Links de redes sociais (se fornecidos)</li>
            <li>Descrição (se fornecida)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Armazenamento de Dados</h2>
          <p>Seus dados são armazenados de forma segura em nossos servidores através do Supabase e podem ser removidos mediante solicitação.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Seus Direitos</h2>
          <p>Você tem o direito de:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Solicitar a exclusão dos seus dados</li>
            <li>Solicitar acesso aos seus dados</li>
            <li>Solicitar a correção dos seus dados</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Contato</h2>
          <p>Para questões relacionadas à privacidade, entre em contato através do email: gustavo.byorbit@gmail.com</p>
        </section>
      </div>
    </div>
  );
}