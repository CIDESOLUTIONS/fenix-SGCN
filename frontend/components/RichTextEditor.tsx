"use client";
import React, { useMemo, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// Importar ReactQuill dinámicamente para evitar errores de SSR
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    
    // Configurar el manejador de pegado de imágenes
    const Quill = (await import('react-quill')).Quill;
    
    return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />;
  },
  { ssr: false }
);

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Escriba aquí...",
  disabled = false,
  className = ""
}: RichTextEditorProps) {
  
  const reactQuillRef = useRef<any>(null);

  // Handler para insertar imágenes desde el botón
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const editor = reactQuillRef.current?.getEditor();
          if (editor) {
            const range = editor.getSelection(true);
            editor.insertEmbed(range.index, 'image', e.target?.result);
          }
        };
        reader.readAsDataURL(file);
      }
    };
  }, []);

  // Configurar el manejador de pegado de imágenes
  useEffect(() => {
    if (!reactQuillRef.current) return;

    const editor = reactQuillRef.current.getEditor();
    if (!editor) return;

    const handlePaste = (event: ClipboardEvent) => {
      const clipboardData = event.clipboardData;
      if (!clipboardData) return;

      // Buscar imágenes en el clipboard
      const items = Array.from(clipboardData.items);
      const imageItem = items.find(item => item.type.indexOf('image') !== -1);

      if (imageItem) {
        event.preventDefault();
        const file = imageItem.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const range = editor.getSelection(true);
            if (range) {
              editor.insertEmbed(range.index, 'image', e.target?.result);
              editor.setSelection(range.index + 1, 0);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    };

    const editorElement = editor.root;
    editorElement.addEventListener('paste', handlePaste);

    return () => {
      editorElement.removeEventListener('paste', handlePaste);
    };
  }, [reactQuillRef.current]);

  // Configuración de módulos de Quill
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), [imageHandler]);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  return (
    <div className={className}>
      <ReactQuill
        forwardedRef={reactQuillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
        className={disabled ? 'opacity-50 cursor-not-allowed' : ''}
      />
      <style jsx global>{`
        .quill {
          background: white;
        }
        .dark .quill {
          background: rgb(55, 65, 81);
        }
        .dark .ql-toolbar {
          background: rgb(55, 65, 81);
          border-color: rgb(75, 85, 99);
        }
        .dark .ql-container {
          border-color: rgb(75, 85, 99);
        }
        .dark .ql-editor {
          color: white;
        }
        .dark .ql-stroke {
          stroke: rgb(156, 163, 175);
        }
        .dark .ql-fill {
          fill: rgb(156, 163, 175);
        }
        .dark .ql-picker-label {
          color: rgb(156, 163, 175);
        }
        .dark .ql-picker-options {
          background: rgb(55, 65, 81);
          border-color: rgb(75, 85, 99);
        }
        .ql-editor {
          min-height: 300px;
        }
        .ql-editor img {
          max-width: 100%;
          height: auto;
          cursor: pointer;
        }
        .ql-editor p {
          margin-bottom: 0.5em;
        }
      `}</style>
    </div>
  );
}
