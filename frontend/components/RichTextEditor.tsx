"use client";
import React, { useMemo, useRef } from 'react';
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
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Escriba aquí...",
  disabled = false,
  className = ""
}: RichTextEditorProps) {
  
  const quillRef = useRef<any>(null);

  // Handler para pegar imágenes desde clipboard
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', e.target?.result);
          }
        };
        reader.readAsDataURL(file);
      }
    };
  };

  // Configuración de módulos de Quill con soporte completo de imágenes
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
      // Permitir pegar imágenes desde clipboard
      matchers: [
        ['img', (node: any, delta: any) => {
          return delta;
        }]
      ]
    }
  }), []);

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
        ref={quillRef}
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
