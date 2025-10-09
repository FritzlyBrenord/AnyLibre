"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Send, User, Sparkles, Copy, CheckCircle } from "lucide-react";
import { Formation } from "@/Context/Freelance/FreelanceContext";

interface AIPersonalAssistantProps {
  open: boolean;
  onClose: () => void;
  onResponseGenerated: (response: string) => void;
  currentDescription?: string;
  prenom?: string;
  nom?: string;
  occupations?: string[];
  competences?: string[];
  formations?: Formation[];
  phraseAutomatique?: string;
}

const AIPersonalAssistant: React.FC<AIPersonalAssistantProps> = ({
  open,
  onClose,
  onResponseGenerated,
  currentDescription = "",
  phraseAutomatique,
}) => {
  const [userInput, setUserInput] = useState(currentDescription);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (phraseAutomatique && !userInput) {
      setUserInput(phraseAutomatique);
    }
  }, [phraseAutomatique, open, userInput]);
  useEffect(() => {
    if (currentDescription) {
      setUserInput(currentDescription);
    }
  }, [currentDescription]);

  useEffect(() => {
    if (responseRef.current && aiResponse) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [aiResponse]);

  const generateDescription = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    setIsGenerating(true);
    setAiResponse("");

    try {
      console.log("Envoi de la requête avec:", userInput);

      const response = await fetch("/api/generate-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: userInput.trim(),
        }),
      });

      console.log("Statut réponse:", response.status);

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;

        // Essayez de lire le message d'erreur
        try {
          const errorText = await response.text();
          console.error("Texte erreur:", errorText);

          if (errorText) {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorData.details || errorText;
          }
        } catch (parseError) {
          console.error("Erreur parsing erreur:", parseError);
          errorMessage = `Erreur ${response.status} - ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Données reçues:", data);

      if (!data.description) {
        throw new Error("Aucune description reçue du serveur");
      }

      // Animation lettre par lettre
      let index = 0;
      const text = data.description;

      const typeWriter = () => {
        if (index < text.length) {
          setAiResponse((prev) => prev + text.charAt(index));
          index++;
          setTimeout(typeWriter, 20);
        } else {
          setIsGenerating(false);
        }
      };

      typeWriter();
    } catch (error) {
      console.error("Erreur complète:", error);
      const errorMsg = (error as Error).message;

      if (errorMsg.includes("500") || errorMsg.includes("Erreur API")) {
        setAiResponse(
          "❌ Erreur de connexion avec le service IA. Vérifiez votre clé API OpenAI."
        );
      } else if (errorMsg.includes("429")) {
        setAiResponse(
          "❌ Trop de requêtes. Veuillez réessayer dans quelques instants."
        );
      } else {
        setAiResponse(`❌ Erreur: ${errorMsg}`);
      }

      setIsGenerating(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(aiResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur de copie:", err);
    }
  };

  const handleUseDescription = () => {
    onResponseGenerated(aiResponse);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      generateDescription();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Assistant IA Profil
              </h2>
              <p className="text-sm text-gray-600">
                Améliorez votre description avec l'IA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Zone de saisie */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              <User className="w-4 h-4 inline mr-2" />
              Parlez-moi de vous et de vos compétences
            </label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ex: Je suis développeur web fullstack avec 5 ans d'expérience en React et Node.js. J'ai travaillé sur des projets e-commerce et applications SaaS. Passionné par les technologies modernes et les UX innovantes..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{userInput.length} caractères</span>
              <span className="text-xs">Ctrl + Enter pour générer</span>
            </div>
          </div>

          {/* Bouton de génération */}
          <button
            onClick={generateDescription}
            disabled={isLoading || !userInput.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Génération en cours...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>✨ Générer mon profil optimisé</span>
              </>
            )}
          </button>

          {/* Réponse de l'IA */}
          {aiResponse && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Votre profil optimisé :</span>
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copier le texte"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div
                ref={responseRef}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[200px] max-h-[300px] overflow-y-auto"
              >
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {aiResponse}
                    {isGenerating && (
                      <span className="inline-block w-2 h-4 bg-blue-600 ml-1 animate-pulse" />
                    )}
                  </p>
                </div>

                {/* Statistiques */}
                {!isGenerating && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-4 text-xs text-gray-600">
                      <span>{aiResponse.length} caractères</span>
                      <span>{aiResponse.split(" ").length} mots</span>
                      <span className="flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Optimisé par IA</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton d'utilisation */}
              {!isGenerating && (
                <button
                  onClick={handleUseDescription}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Utiliser cette description</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="text-xs text-gray-600 text-center">
            <p>
              L'IA va réorganiser et améliorer votre texte pour attirer plus de
              clients
            </p>
            <p className="text-gray-500">
              Longueur recommandée : 250-500 caractères
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPersonalAssistant;
