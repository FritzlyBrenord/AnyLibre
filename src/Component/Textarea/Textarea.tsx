"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
  title?: string;
  subtitle?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  showTips?: boolean;
  required?: boolean;
}

export default function MarkdownEditor({
  title = "3. Description du Service",
  subtitle = "Décrivez votre service en détail pour convaincre les clients",
  label = "Décrivez brièvement votre service",
  value,
  onChange,
  maxLength = 1200,
  showTips = true,
  required = true,
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const characterCount = value.length;
  const isUnderMin = characterCount < 120;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const insertFormatting = (syntax: string) => {
    const textarea = document.getElementById(
      "markdown-editor"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let newValue = value;
    let newCursorPos = start + syntax.length;

    if (selectedText) {
      // Si du texte est sélectionné, l'entourer avec la syntaxe
      newValue =
        value.substring(0, start) +
        syntax +
        selectedText +
        syntax +
        value.substring(end);
      newCursorPos = end + syntax.length * 2;
    } else {
      // Si aucun texte n'est sélectionné, insérer la syntaxe
      newValue =
        value.substring(0, start) + syntax + syntax + value.substring(start);
      newCursorPos = start + syntax.length;
    }

    if (newValue.length <= maxLength) {
      onChange(newValue);

      // Restaurer la position du curseur
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const insertList = (type: "bullet" | "number") => {
    const textarea = document.getElementById(
      "markdown-editor"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const prefix = type === "bullet" ? "- " : "1. ";

    const newValue =
      value.substring(0, start) + prefix + value.substring(start);

    if (newValue.length <= maxLength) {
      onChange(newValue);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + prefix.length,
          start + prefix.length
        );
      }, 0);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      {/* Conseils */}
      {showTips && (
        <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
          <div className="flex">
            <svg
              className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-green-900">
                Structure recommandée
              </p>
              <ul className="text-sm text-green-700 mt-2 space-y-1 list-disc list-inside">
                <li>Introduction : Qui êtes-vous ?</li>
                <li>Ce que vous offrez : Détails du service</li>
                <li>Votre processus : Comment travaillez-vous ?</li>
                <li>Pourquoi vous choisir : Vos avantages</li>
              </ul>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  <strong>Formatage :</strong> **gras** *italique*
                </p>
                <p>
                  <strong>Listes :</strong> - puces 1. numérotées
                </p>
                <p>
                  <strong>Titres :</strong> # Titre ## Sous-titre
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Label */}
      <div>
        <label className="block text-base font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      {/* Boutons de formatage */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => insertFormatting("**")}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
          title="Gras"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 5H7v10h4c2.21 0 4-1.79 4-4s-1.79-4-4-4zm-.5 6h-2v-2h2c.55 0 1 .45 1 1s-.45 1-1 1z" />
          </svg>
          Gras
        </button>

        <button
          type="button"
          onClick={() => insertFormatting("*")}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
          title="Italique"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
          </svg>
          Italique
        </button>

        <button
          type="button"
          onClick={() => insertList("bullet")}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
          title="Liste à puces"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Liste
        </button>

        <button
          type="button"
          onClick={() => insertList("number")}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
          title="Liste numérotée"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Liste numérotée
        </button>

        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors ml-auto"
        >
          {isPreview ? "Éditer" : "Aperçu"}
        </button>
      </div>

      {/* Zone d'édition/Aperçu */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        {isPreview ? (
          <div className="min-h-[400px] p-4 prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {value || "*Tapez votre description ici...*"}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            id="markdown-editor"
            value={value}
            onChange={handleTextChange}
            className="w-full min-h-[400px] p-4 focus:outline-none text-gray-900 resize-none"
            style={{
              lineHeight: "1.6",
              fontSize: "15px",
            }}
            placeholder="Utilisez le format Markdown pour formater votre texte...
            
Exemple :
**Service de développement web** professionnel

*Développement sur mesure* incluant :
- Sites vitrine
- Applications web
- E-commerce

1. Consultation initiale
2. Développement
3. Livraison et support"
          />
        )}
      </div>

      {/* Compteur de caractères */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">
          Une description détaillée augmente vos chances de vente
        </span>
        <span
          className={`font-medium ${
            isUnderMin ? "text-red-600" : "text-gray-600"
          }`}
        >
          {characterCount}/{maxLength} Caractères
          {isUnderMin && " (Minimum 120 recommandé)"}
        </span>
      </div>
    </div>
  );
}
