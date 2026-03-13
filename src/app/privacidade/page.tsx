import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/platform/brand";
import { getPlatformBrandingSettings } from "@/lib/platform/settings";

export const metadata: Metadata = {
  title: "Política de Privacidade — BuildSphere",
  description: "Como a BuildSphere coleta, usa e protege seus dados pessoais conforme a LGPD.",
};

export default async function PrivacidadePage() {
  const branding = await getPlatformBrandingSettings();

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#EAF0FF]" style={{ fontFamily: "var(--font-sora, Sora, sans-serif)" }}>
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0B1020]/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Brand compact settings={branding} />
          <Link href="/" className="text-sm text-[#EAF0FF]/60 hover:text-[#EAF0FF] transition">
            ← Voltar
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">Legal</p>
        <h1 className="mt-3 text-3xl font-black md:text-4xl">Política de Privacidade</h1>
        <p className="mt-2 text-sm text-[#EAF0FF]/50">Última atualização: março de 2025</p>

        <div className="prose prose-invert mt-10 max-w-none space-y-8 text-sm leading-relaxed text-[#EAF0FF]/80 [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-[#EAF0FF] [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul>li]:mb-1.5 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-white/20 [&_th]:bg-white/5 [&_th]:p-3 [&_th]:text-left [&_th]:text-xs [&_td]:border [&_td]:border-white/10 [&_td]:p-3 [&_td]:text-xs">

          <p>
            A <strong>BuildSphere</strong> leva a sério a privacidade dos seus dados. Esta Política descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais, em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD)</strong>.
          </p>

          <h2>1. Controlador dos dados</h2>
          <p>
            O controlador dos dados pessoais tratados nesta plataforma é a empresa responsável pela BuildSphere. Para fins de contato referente à proteção de dados, utilize o e-mail:{" "}
            <a href="mailto:contato@raizaconvento.com.br" className="text-[#22D3EE] hover:underline">
              contato@raizaconvento.com.br
            </a>{" "}
            (Encarregado / DPO).
          </p>

          <h2>2. Dados que coletamos</h2>
          <p>Coletamos os seguintes tipos de dados pessoais:</p>
          <ul>
            <li><strong>Dados de cadastro:</strong> nome, endereço de e-mail, dados de faturamento (nome legal, endereço, CPF/CNPJ).</li>
            <li><strong>Dados de uso:</strong> páginas acessadas, funcionalidades utilizadas, logs de acesso (IP, data e hora, navegador).</li>
            <li><strong>Dados de pagamento:</strong> processados diretamente pela Stripe — a BuildSphere não armazena números de cartão.</li>
            <li><strong>Dados do site criado:</strong> conteúdo inserido no site (textos, imagens, informações de contato do negócio).</li>
            <li><strong>Comunicações:</strong> mensagens trocadas com o suporte.</li>
          </ul>

          <h2>3. Finalidades e bases legais</h2>
          <table>
            <thead>
              <tr>
                <th>Finalidade</th>
                <th>Base legal (LGPD)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Prestação dos serviços contratados</td>
                <td>Execução de contrato (Art. 7º, V)</td>
              </tr>
              <tr>
                <td>Processamento de pagamentos</td>
                <td>Execução de contrato (Art. 7º, V)</td>
              </tr>
              <tr>
                <td>Envio de e-mails transacionais (confirmação, recibo)</td>
                <td>Execução de contrato (Art. 7º, V)</td>
              </tr>
              <tr>
                <td>Comunicações de marketing e novidades</td>
                <td>Consentimento (Art. 7º, I) — você pode revogar a qualquer momento</td>
              </tr>
              <tr>
                <td>Cumprimento de obrigações legais (e.g., emissão de notas fiscais)</td>
                <td>Obrigação legal (Art. 7º, II)</td>
              </tr>
              <tr>
                <td>Segurança, prevenção a fraudes e melhoria da plataforma</td>
                <td>Legítimo interesse (Art. 7º, IX)</td>
              </tr>
            </tbody>
          </table>

          <h2>4. Compartilhamento de dados</h2>
          <p>Seus dados podem ser compartilhados com:</p>
          <ul>
            <li><strong>Stripe Inc.:</strong> processamento seguro de pagamentos (política disponível em stripe.com/br/privacy).</li>
            <li><strong>Supabase Inc.:</strong> infraestrutura de banco de dados e autenticação, com servidores no Brasil ou EUA conforme configuração.</li>
            <li><strong>Vercel Inc.:</strong> hospedagem e entrega da aplicação (CDN global).</li>
            <li><strong>Resend:</strong> envio de e-mails transacionais.</li>
            <li><strong>Autoridades competentes:</strong> quando exigido por lei ou ordem judicial.</li>
          </ul>
          <p>Não vendemos, alugamos ou cedemos seus dados a terceiros para fins comerciais.</p>

          <h2>5. Cookies e tecnologias similares</h2>
          <p>Utilizamos cookies essenciais para o funcionamento da plataforma:</p>
          <ul>
            <li><strong>Cookies de sessão:</strong> mantêm você autenticado durante a navegação.</li>
            <li><strong>Cookies de preferência:</strong> armazenam configurações como consentimento de cookies.</li>
          </ul>
          <p>
            Não utilizamos cookies de rastreamento ou análise comportamental no momento. Você pode gerenciar ou recusar cookies nas configurações do seu navegador; isso pode afetar algumas funcionalidades da plataforma.
          </p>

          <h2>6. Retenção de dados</h2>
          <ul>
            <li><strong>Durante a vigência do contrato:</strong> todos os dados necessários à prestação do serviço.</li>
            <li><strong>Após cancelamento:</strong> dados de faturamento e logs são retidos por até 5 anos para cumprimento de obrigações legais e fiscais.</li>
            <li><strong>E-mails de marketing:</strong> até a revogação do consentimento.</li>
          </ul>
          <p>Após o prazo de retenção, os dados são anonimizados ou excluídos com segurança.</p>

          <h2>7. Seus direitos (LGPD)</h2>
          <p>Como titular de dados, você tem os seguintes direitos, que podem ser exercidos pelo e-mail indicado nesta política:</p>
          <ul>
            <li><strong>Confirmação e acesso:</strong> saber se tratamos seus dados e obter cópia.</li>
            <li><strong>Correção:</strong> solicitar a atualização de dados incompletos ou incorretos.</li>
            <li><strong>Anonimização, bloqueio ou eliminação:</strong> de dados desnecessários ou tratados em desconformidade com a LGPD.</li>
            <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado.</li>
            <li><strong>Revogação do consentimento:</strong> a qualquer momento, sem prejuízo do tratamento realizado anteriormente.</li>
            <li><strong>Oposição:</strong> ao tratamento realizado com base em legítimo interesse.</li>
            <li><strong>Informação sobre compartilhamento:</strong> com quem compartilhamos seus dados.</li>
            <li><strong>Petição à ANPD:</strong> direito de reclamar à Autoridade Nacional de Proteção de Dados.</li>
          </ul>

          <h2>8. Segurança dos dados</h2>
          <p>
            Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, perda ou destruição, incluindo: criptografia em trânsito (TLS/HTTPS), controle de acesso baseado em perfis (RLS), autenticação segura e backups regulares.
          </p>
          <p>
            Em caso de incidente de segurança que possa afetar seus direitos, notificaremos você e a ANPD nos prazos previstos em lei.
          </p>

          <h2>9. Transferência internacional de dados</h2>
          <p>
            Alguns de nossos fornecedores (Stripe, Vercel, Supabase) podem processar dados em servidores localizados fora do Brasil. Nesses casos, exigimos que os fornecedores adotem medidas equivalentes de proteção de dados, conforme o Art. 33 da LGPD.
          </p>

          <h2>10. Encarregado de proteção de dados (DPO)</h2>
          <p>
            Nosso Encarregado (DPO) pode ser contatado pelo e-mail:{" "}
            <a href="mailto:contato@raizaconvento.com.br" className="text-[#22D3EE] hover:underline">
              contato@raizaconvento.com.br
            </a>
          </p>

          <h2>11. Alterações nesta política</h2>
          <p>
            Esta Política pode ser atualizada periodicamente. Notificaremos alterações relevantes por e-mail. A versão vigente estará sempre disponível nesta página com a data da última atualização.
          </p>
        </div>
      </main>
    </div>
  );
}
