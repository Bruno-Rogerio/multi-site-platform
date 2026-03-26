import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/platform/brand";
import { getPlatformBrandingSettings } from "@/lib/platform/settings";

const ROOT = process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ?? "bsph.com.br";

export const metadata: Metadata = {
  title: "Termos de Uso da Plataforma BuildSphere",
  description:
    "Leia os termos e condições de uso da BuildSphere. Direitos, obrigações, política de pagamentos, cancelamento e reembolso da assinatura do criador de sites.",
  alternates: { canonical: `https://${ROOT}/termos` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Termos de Uso — BuildSphere",
    description:
      "Termos e condições de uso da plataforma BuildSphere. Saiba seus direitos e obrigações ao usar o criador de sites profissionais.",
    url: `https://${ROOT}/termos`,
  },
};

export default async function TermosPage() {
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
        <h1 className="mt-3 text-3xl font-black md:text-4xl">Termos de Uso</h1>
        <p className="mt-2 text-sm text-[#EAF0FF]/50">Última atualização: março de 2026</p>

        <div className="prose prose-invert mt-10 max-w-none space-y-8 text-sm leading-relaxed text-[#EAF0FF]/80 [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-[#EAF0FF] [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul>li]:mb-1.5">

          <p>
            Bem-vindo à <strong>BuildSphere</strong>. Ao acessar ou utilizar nossa plataforma, você concorda com estes Termos de Uso. Leia-os com atenção antes de criar sua conta.
          </p>

          <h2>1. Definições</h2>
          <ul>
            <li><strong>Plataforma:</strong> sistema BuildSphere, acessível via web, que permite a criação e hospedagem de sites profissionais.</li>
            <li><strong>Cliente / Usuário:</strong> pessoa física ou jurídica que contrata os serviços da BuildSphere.</li>
            <li><strong>Site do Cliente:</strong> site criado e hospedado pelo usuário dentro da plataforma.</li>
            <li><strong>Visitante:</strong> qualquer pessoa que acessa o site de um cliente.</li>
          </ul>

          <h2>2. Elegibilidade e cadastro</h2>
          <p>
            Para utilizar a plataforma, você deve ter ao menos 18 anos ou possuir representação legal válida. Ao criar uma conta, você declara que todas as informações fornecidas são verdadeiras e que você é responsável por mantê-las atualizadas.
          </p>
          <p>
            Cada conta é pessoal e intransferível. O compartilhamento de credenciais de acesso é proibido. Você é responsável por toda atividade realizada sob sua conta.
          </p>

          <h2>3. Descrição dos serviços</h2>
          <p>
            A BuildSphere oferece uma plataforma SaaS (Software como Serviço) para criação, personalização e hospedagem de sites profissionais. Os serviços incluem:
          </p>
          <ul>
            <li>Subdomínio personalizado no formato <em>seunome.bsph.com.br</em> (ou domínio configurado pela plataforma);</li>
            <li>Painel de administração para edição de conteúdo e configurações do site;</li>
            <li>Hospedagem e entrega do site ao público via CDN com SSL automático;</li>
            <li>Recursos conforme o plano contratado: o <strong>Plano Starter</strong> inclui seções essenciais e logo; o <strong>Plano Básico</strong> adiciona todas as seções, SEO básico e personalização expandida; o <strong>Plano Premium Full</strong> oferece blog, galeria, eventos, SEO avançado e personalização visual completa.</li>
          </ul>

          <h2>4. Planos e pagamentos</h2>
          <p>
            A BuildSphere oferece planos de assinatura mensal. Os valores vigentes estão disponíveis na página de preços. Não há taxa de setup ou contrato de fidelidade — você pode cancelar a qualquer momento.
          </p>
          <p>
            O pagamento é processado via Stripe, plataforma certificada PCI DSS. A BuildSphere não armazena dados de cartão de crédito. Em caso de falha no pagamento, o acesso poderá ser suspenso até a regularização.
          </p>
          <p>
            Os valores podem ser alterados mediante aviso prévio de 30 dias. Clientes com plano ativo continuarão pagando o valor vigente à época da contratação até o próximo ciclo de renovação após o aviso.
          </p>

          <h2>5. Cancelamento e reembolso</h2>
          <p>
            Você pode cancelar sua assinatura a qualquer momento pelo painel de configurações. O cancelamento interrompe a renovação automática e o serviço permanece ativo até o fim do período já pago. Não há reembolso proporcional de períodos utilizados, salvo em casos previstos pelo Código de Defesa do Consumidor (CDC).
          </p>
          <p>
            Em caso de arrependimento de compra dentro de 7 (sete) dias corridos após a contratação inicial, o usuário tem direito ao reembolso integral, conforme o Art. 49 do CDC. Para solicitar, entre em contato pelo e-mail indicado neste documento.
          </p>

          <h2>6. Conteúdo do usuário e responsabilidades</h2>
          <p>
            Você é integralmente responsável por todo o conteúdo publicado em seu site (textos, imagens, vídeos, informações de contato, etc.). É proibido utilizar a plataforma para:
          </p>
          <ul>
            <li>Publicar conteúdo ilegal, difamatório, discriminatório ou que viole direitos de terceiros;</li>
            <li>Praticar spam, phishing ou qualquer forma de fraude eletrônica;</li>
            <li>Violar direitos autorais, marcas registradas ou segredos industriais;</li>
            <li>Distribuir malware, vírus ou qualquer código malicioso;</li>
            <li>Coletar dados de visitantes sem consentimento adequado conforme a LGPD.</li>
          </ul>
          <p>
            A BuildSphere reserva-se o direito de suspender ou encerrar contas que violem estas regras, sem necessidade de aviso prévio em casos graves.
          </p>

          <h2>7. Propriedade intelectual</h2>
          <p>
            O conteúdo criado por você (textos, imagens, logotipos) permanece de sua propriedade. Ao publicar na plataforma, você concede à BuildSphere uma licença limitada, não exclusiva e não transferível para hospedar e exibir esse conteúdo exclusivamente para fins de prestação do serviço.
          </p>
          <p>
            Todo o código-fonte, interface, marca e materiais da BuildSphere são de propriedade exclusiva da empresa e protegidos por direitos autorais e demais legislações aplicáveis. É vedada a cópia, reprodução ou engenharia reversa sem autorização expressa.
          </p>

          <h2>8. Disponibilidade e SLA</h2>
          <p>
            A BuildSphere se esforça para manter a plataforma disponível 24/7, mas não garante disponibilidade ininterrupta. Manutenções programadas serão comunicadas com antecedência. Interrupções por fatores fora de nosso controle (ataques, falhas de terceiros, etc.) não geram direito a reembolso.
          </p>

          <h2>9. Limitação de responsabilidade</h2>
          <p>
            A BuildSphere não se responsabiliza por perdas indiretas, lucros cessantes ou danos decorrentes do uso ou impossibilidade de uso da plataforma, exceto nos casos previstos expressamente em lei. Nossa responsabilidade máxima em qualquer hipótese é limitada ao valor pago pelo usuário nos últimos 3 meses de serviço.
          </p>

          <h2>10. Privacidade e proteção de dados</h2>
          <p>
            O tratamento de dados pessoais realizado pela BuildSphere é descrito em nossa{" "}
            <Link href="/privacidade" className="text-[#22D3EE] hover:underline">
              Política de Privacidade
            </Link>
            , que integra estes Termos de Uso. Utilizamos e protegemos seus dados em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
          </p>

          <h2>11. Alterações nos termos</h2>
          <p>
            Podemos atualizar estes Termos periodicamente. Alterações relevantes serão comunicadas por e-mail com antecedência mínima de 10 dias. O uso continuado da plataforma após a entrada em vigor das alterações constitui aceite dos novos termos.
          </p>

          <h2>12. Foro e legislação aplicável</h2>
          <p>
            Estes Termos são regidos pelas leis brasileiras. Em caso de litígio não resolvido por acordo amigável, fica eleito o foro da Comarca de São Paulo/SP para dirimir eventuais controvérsias.
          </p>

          <h2>13. Contato</h2>
          <p>
            Dúvidas, solicitações ou reclamações relacionadas a estes Termos podem ser enviadas pelos canais abaixo:
          </p>
          <ul>
            <li>
              E-mail:{" "}
              <a href="mailto:contato@bsph.com.br" className="text-[#22D3EE] hover:underline">
                contato@bsph.com.br
              </a>
            </li>
            <li>
              WhatsApp:{" "}
              <a href="https://wa.me/5511915194173" className="text-[#22D3EE] hover:underline" target="_blank" rel="noreferrer">
                +55 (11) 91519-4173
              </a>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
