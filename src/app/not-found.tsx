import { Botao } from "@/components/ui/Botao";

export default function NaoEncontrado() {
  return (
    <div className="container-nc py-20">
      <div className="card mx-auto max-w-md p-8 text-center">
        <p className="font-serif text-6xl font-semibold text-azul">404</p>
        <h1 className="mt-2 font-serif text-2xl font-semibold text-navy">Página não encontrada</h1>
        <p className="mt-2 text-slate">O endereço pode ter mudado. Que tal corrigir uma redação?</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Botao href="/corrigir">Corrigir redação</Botao>
          <Botao href="/" variante="secundario">
            Ir para o início
          </Botao>
        </div>
      </div>
    </div>
  );
}
