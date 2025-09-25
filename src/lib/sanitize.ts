import DOMPurify from "dompurify";

export function sanitizeHtml(html: string | undefined | null): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
}

export function stripHtml(html: string | undefined | null): string {
  if (!html) return "";
  // Remove todas as tags mantendo apenas texto
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

// Converte quebras de linha em <br> APENAS quando o conteúdo parece ser texto puro (sem tags)
export function formatAndSanitizeHtml(html: string | undefined | null): string {
  if (!html) return "";
  const hasHtmlTags = /<[^>]+>/.test(html);
  const prepared = hasHtmlTags ? html : html.replace(/\n/g, "<br />");
  return sanitizeHtml(prepared);
}
