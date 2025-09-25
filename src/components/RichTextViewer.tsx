import { cn } from "@/lib/utils";

interface RichTextViewerProps {
  content: string;
  className?: string;
}

export function RichTextViewer({ content, className }: RichTextViewerProps) {
  // Estilos para o conteúdo HTML gerado pelo Quill
  const richTextStyles = `
    .rich-text-content {
      font-family: inherit;
      line-height: 1.6;
      color: hsl(var(--foreground));
    }
    
    .rich-text-content h1 {
      font-size: 2rem;
      font-weight: 600;
      margin: 1.5rem 0 1rem;
      line-height: 1.2;
      color: hsl(var(--foreground));
    }
    
    .rich-text-content h2 {
      font-size: 1.75rem;
      font-weight: 600;
      margin: 1.25rem 0 0.875rem;
      line-height: 1.3;
      color: hsl(var(--foreground));
    }
    
    .rich-text-content h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 1.1rem 0 0.75rem;
      line-height: 1.4;
      color: hsl(var(--foreground));
    }
    
    .rich-text-content p {
      margin: 0.75rem 0;
      color: hsl(var(--foreground));
    }
    
    .rich-text-content ul,
    .rich-text-content ol {
      margin: 0.75rem 0;
      padding-left: 1.5rem;
    }
    
    .rich-text-content li {
      margin: 0.25rem 0;
    }
    
    .rich-text-content a {
      color: hsl(var(--primary));
      text-decoration: underline;
    }
    
    .rich-text-content a:hover {
      text-decoration: none;
    }
    
    .rich-text-content blockquote {
      border-left: 4px solid hsl(var(--border));
      margin: 1rem 0;
      padding: 0.5rem 0 0.5rem 1rem;
      color: hsl(var(--muted-foreground));
      font-style: italic;
    }
    
    .rich-text-content .ql-align-center {
      text-align: center;
    }
    
    .rich-text-content .ql-align-right {
      text-align: right;
    }
    
    .rich-text-content .ql-align-justify {
      text-align: justify;
    }
    
    .rich-text-content img {
      max-width: 100%;
      height: auto;
      margin: 1rem 0;
      border-radius: 0.375rem;
    }
    
    .rich-text-content pre {
      background-color: hsl(var(--muted));
      padding: 1rem;
      border-radius: 0.375rem;
      overflow-x: auto;
      margin: 1rem 0;
    }
    
    .rich-text-content code {
      font-family: monospace;
      background-color: hsl(var(--muted));
      padding: 0.2em 0.4em;
      border-radius: 0.25rem;
      font-size: 0.9em;
    }
  `;

  return (
    <div className={cn("rich-text-content", className)}>
      <style>{richTextStyles}</style>
      <div 
        dangerouslySetInnerHTML={{ __html: content }} 
        className="[&_*]:!m-0 [&_*+*]:mt-4"
      />
    </div>
  );
}
