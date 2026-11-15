import { Botao } from "@/components/ui/Botao";

export default function NaoEncontrado() {
  return (
    <div className="container-nc py-20">
      <div className="card mx-auto max-w-md p-8 text-center">
        <p className="text-azul font-serif text-6xl font-semibold">404</p>
        <h1 className="text-navy mt-2 font-serif text-2xl font-semibold">Página não encontrada</h1>
        <p className="text-slate mt-2">O endereço pode ter mudado. Que tal corrigir uma redação?</p>
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
