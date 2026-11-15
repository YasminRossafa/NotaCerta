import { redirect } from "next/navigation";

// A home (/) abre direto na ferramenta de correção; esta rota existe só para
// não quebrar links antigos.
export default function PaginaCorrigir() {
  redirect("/");
}
