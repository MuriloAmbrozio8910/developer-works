import { useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
  context?: string; // Contexto para organização das pastas (ex: 'tasks', 'wiki')
  folderPrefix?: string; // Prefixo opcional para subpastas adicionais
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder, 
  className, 
  minHeight = 120, 
  context = 'global',
  folderPrefix = ''
}: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill | null>(null);
  // Não é mais necessário o useAuth, usaremos session do Supabase

  const handleImageUpload = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ALLOWED_MIME_TYPES.join(',');
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        // Validação de tipo MIME
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          toast.error(`Tipo de arquivo não suportado. Use: ${ALLOWED_MIME_TYPES.join(', ')}`);
          return;
        }

        // Validação de tamanho
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`Imagem muito grande. Tamanho máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
          return;
        }

        const quill = quillRef.current?.getEditor();
        const range = quill?.getSelection(true);

        toast.message("Enviando imagem...", { description: file.name });

        try {
          const bucket = "rte-images";
          const extension = file.name.split('.').pop() || 'png';
          // Usa o ID do usuário da sessão atual ou 'anonymous'
          const { data: { session } } = await supabase.auth.getSession();
          const userId = session?.user?.id || 'anonymous';
          const timestamp = Date.now();
          const randomId = Math.random().toString(36).slice(2, 8);
          
          // Estrutura de pastas: {context}/{folderPrefix}/{userId}/{timestamp}-{randomId}.{ext}
          const folderPath = [context, folderPrefix, userId].filter(Boolean).join('/');
          const filePath = `${folderPath}/${timestamp}-${randomId}.${extension}`;

          const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
              contentType: file.type,
              upsert: false, // Não sobrescreve arquivos existentes
              cacheControl: '3600', // Cache de 1 hora
            });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

          if (!publicUrl) {
            throw new Error("Não foi possível obter a URL pública da imagem");
          }

          if (quill && range) {
            quill.insertEmbed(range.index, "image", publicUrl, "user");
            quill.setSelection(range.index + 1, 0, "user");
          }

          toast.success("Imagem enviada com sucesso!");
        } catch (error) {
          console.error("Erro no upload:", error);
          toast.error(`Falha no envio: ${error.message}`);
        }
      };
      input.click();
    } catch (err) {
      console.error("Erro inesperado:", err);
      toast.error("Erro inesperado ao processar a imagem");
    }
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: handleImageUpload,
      },
    },
    clipboard: { matchVisual: false },
  }), [context, folderPrefix]);

  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
      "video",
      "color",
      "background",
      "align",
      "code-block",
    ],
    []
  );

  // Estilos globais para o editor
  const editorStyles = `
    .rich-text-editor .ql-toolbar.ql-snow {
      border: 1px solid hsl(var(--border));
      border-bottom: none;
      border-top-left-radius: 0.375rem;
      border-top-right-radius: 0.375rem;
      background-color: hsl(var(--muted)/0.2);
    }
    
    .rich-text-editor .ql-container.ql-snow {
      border: 1px solid hsl(var(--border));
      border-top: none;
      border-bottom-left-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
      background-color: hsl(var(--background));
    }
    
    .rich-text-editor .ql-editor {
      min-height: ${minHeight}px;
      color: hsl(var(--foreground));
    }
    
    .rich-text-editor .ql-snow .ql-stroke {
      stroke: hsl(var(--muted-foreground));
    }
    
    .rich-text-editor .ql-snow .ql-fill {
      fill: hsl(var(--muted-foreground));
    }
    
    .rich-text-editor .ql-snow .ql-picker {
      color: hsl(var(--muted-foreground));
    }
    
    .rich-text-editor .ql-snow .ql-picker-options {
      background-color: hsl(var(--popover));
      border-color: hsl(var(--border));
    }
    
    .rich-text-editor .ql-snow .ql-picker-item.ql-selected {
      color: hsl(var(--primary));
    }
    
    .rich-text-editor .ql-snow .ql-tooltip {
      background-color: hsl(var(--popover));
      border-color: hsl(var(--border));
      color: hsl(var(--foreground));
    }
    
    .rich-text-editor .ql-snow .ql-tooltip input[type=text] {
      background-color: hsl(var(--muted));
      border-color: hsl(var(--border));
      color: hsl(var(--foreground));
    }
    
    .rich-text-editor .ql-editor.ql-blank::before {
      color: hsl(var(--muted-foreground));
      font-style: normal;
    }
  `;

  return (
    <div className={`rich-text-editor ${className}`}>
      <style>{editorStyles}</style>
      <div className="rounded-md overflow-hidden">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{ minHeight: '100%' }}
          ref={quillRef}
          className="text-foreground"
        />
      </div>
    </div>
  );
}

export default RichTextEditor;
