"use client";
import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="border rounded p-4 bg-gray-50 dark:bg-gray-800">Cargando editor...</div>
});

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Escriba aquí...",
  disabled = false,
  className = ""
}: RichTextEditorProps) {

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
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
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
        className={disabled ? 'opacity-50 cursor-not-allowed' : ''}
      />
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        💡 Use el botón de imagen (📷) en la barra de herramientas para insertar imágenes
      </p>
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
