"use client";

import { useId } from "react";
import { Campo } from "@/components/ui/Campo";
import { TEMAS_ENEM } from "@/lib/temas";

/**
 * Campo de tema com sugestões (temas oficiais do ENEM) e a opção
 * "Não sei o tema → detectar pelo texto".
 */
export function SeletorTema({
  tema,
  detectar,
  aoMudarTema,
  aoMudarDetectar,
  erro,
}: {
  tema: string;
  detectar: boolean;
  aoMudarTema: (v: string) => void;
  aoMudarDetectar: (v: boolean) => void;
  erro?: string;
}) {
  const listaId = useId();
  return (
    <div className="space-y-3">
      <Campo
        rotulo="Tema da redação"
        list={listaId}
        value={tema}
        disabled={detectar}
        onChange={(e) => aoMudarTema(e.target.value)}
        placeholder="Ex.: Desafios para a valorização da herança africana no Brasil"
        autoComplete="off"
        ajuda={
          detectar
            ? "Vamos identificar o tema a partir do texto."
            : "Digite ou escolha um tema oficial do ENEM nas sugestões."
        }
        erro={erro}
      />
      <datalist id={listaId}>
        {TEMAS_ENEM.map((t) => (
          <option key={t.tema} value={t.tema}>{`ENEM ${t.ano}`}</option>
        ))}
      </datalist>

      <label className="flex min-h-[44px] cursor-pointer items-center gap-3 text-sm text-navy">
        <input
          type="checkbox"
          checked={detectar}
          onChange={(e) => aoMudarDetectar(e.target.checked)}
          className="h-5 w-5 rounded border-borda accent-azul"
        />
        Não sei o tema — detectar pelo texto
      </label>
    </div>
  );
}
