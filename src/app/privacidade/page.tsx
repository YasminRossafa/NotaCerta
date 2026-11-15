import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aviso de privacidade (LGPD)",
  description:
    "Como o NotaCerta trata sua redação e seus dados: não armazenamos redações, pedimos e-mail só com consentimento e não temos vínculo com o INEP/MEC.",
  alternates: { canonical: "/privacidade" },
};

export default function PaginaPrivacidade() {
  return (
    <div className="container-nc py-10 md:py-14">
      <article className="prose-nc mx-auto max-w-2xl">
        <h1 className="text-navy text-3xl font-semibold sm:text-4xl">
          Aviso de privacidade
        </h1>
        <p className="text-slate mt-3">
          Este aviso explica, em linguagem simples, o que acontece com a sua redação e os seus dados
          ao usar o NotaCerta, conforme a Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018).
        </p>

        <Secao titulo="Sua redação">
          <p>
            O texto ou a foto que você envia é transmitido ao nosso servidor e repassado ao provedor
            de inteligência artificial apenas para gerar a correção. Não gravamos a redação em banco
            de dados nem em registros do servidor. O resultado fica salvo somente no seu navegador,
            nesta aba, até você fechá-la.
          </p>
        </Secao>

        <Secao titulo="Dados pessoais">
          <p>
            A primeira correção não exige cadastro. Se você informar seu e-mail, pedimos
            consentimento explícito e o usamos só para enviar a correção, novidades e informações
            sobre o Plano Fundador. Você pode pedir a exclusão a qualquer momento pelo e-mail de
            contato.
          </p>
          <p>
            Usamos um identificador anônimo (cookie) para aplicar o limite mensal gratuito. Ele não
            contém nome, e-mail ou qualquer dado que identifique você.
          </p>
        </Secao>

        <Secao titulo="Menores de idade">
          <p>
            Sabemos que parte do público é menor de 18 anos. Por isso coletamos o mínimo necessário
            e não exigimos dados pessoais para usar a ferramenta. Responsáveis podem solicitar
            informações ou exclusão pelo contato abaixo.
          </p>
        </Secao>

        <Secao titulo="Nota estimada">
          <p>
            A nota apresentada é uma estimativa gerada por inteligência artificial com base em um
            método de correção. Ela não é a nota oficial do ENEM. O NotaCerta não tem vínculo com o
            INEP ou com o MEC.
          </p>
        </Secao>

        <Secao titulo="Contato">
          <p>
            Dúvidas, pedidos de acesso ou exclusão de dados:{" "}
            <a href={`mailto:${SITE.contatoEmail}`} className="text-azul font-semibold underline">
              {SITE.contatoEmail}
            </a>
            .
          </p>
          {/* TODO(claudia): revisar este aviso com responsável legal e incluir razão social/CNPJ. */}
        </Secao>
      </article>
    </div>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="text-navy mt-8 space-y-3 text-[15.5px] leading-relaxed">
      <h2 className="text-navy text-2xl font-semibold">{titulo}</h2>
      {children}
    </section>
  );
}
