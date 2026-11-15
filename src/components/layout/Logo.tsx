import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, tamanho = "md" }: { className?: string; tamanho?: "md" | "lg" }) {
  const dim = tamanho === "lg" ? 36 : 28;
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2 font-semibold text-navy", className)}
      aria-label="NotaCerta — página inicial"
    >
      <svg width={dim} height={dim} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="28" height="28" rx="8" fill="#2563EB" />
        <path
          d="M9 17.5l4.5 4.5L23 11"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={cn("tracking-tight", tamanho === "lg" ? "text-2xl" : "text-lg")}>
        Nota<span className="text-azul">Certa</span>
      </span>
    </Link>
  );
}
