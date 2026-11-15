import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const ULTIMA_ATUALIZACAO = new Date("2026-11-15");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE.url}/`,
      lastModified: ULTIMA_ATUALIZACAO,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE.url}/corrigir`,
      lastModified: ULTIMA_ATUALIZACAO,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/estrutura`,
      lastModified: ULTIMA_ATUALIZACAO,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/repertorios`,
      lastModified: ULTIMA_ATUALIZACAO,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/precos`,
      lastModified: ULTIMA_ATUALIZACAO,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE.url}/privacidade`,
      lastModified: ULTIMA_ATUALIZACAO,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
