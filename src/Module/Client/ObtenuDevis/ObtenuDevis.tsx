import React, { useState } from "react";
import { X, Paperclip, Edit, Lightbulb } from "lucide-react";

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ObtenuDevis: React.FC<QuoteRequestModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    description: "",
    timeline: "",
    customTimeline: "",
    budget: "",
    attachments: [] as File[],
  });

  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Ici vous pouvez ajouter la logique d'envoi
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(e.target.files || [])],
      }));
    }
  };

  const timelineOptions = [
    { value: "24h", label: "24 heures" },
    { value: "3d", label: "3 jours" },
    { value: "7d", label: "7 jours" },
    { value: "custom", label: "Autre" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">
            Demander un devis
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Formulaire principal */}
          <div className="flex-1 p-6">
            <div className="space-y-6">
              {/* Description du service */}
              <div className="relative">
                <label className="block text-gray-700 font-medium mb-2">
                  Décrivez le service que vous souhaitez acheter - veuillez
                  fournir le plus de détails possible :
                </label>
                <div className="relative">
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Je recherche..."
                    className="w-full p-4 border border-gray-300 rounded-lg resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onMouseEnter={() => setShowTooltip("description")}
                    onMouseLeave={() => setShowTooltip(null)}
                    required
                  />
                  <div className="absolute bottom-2 right-2 text-sm text-gray-400">
                    {formData.description.length}/2500
                  </div>

                  {showTooltip === "description" && (
                    <div className="absolute -top-16 left-0 bg-gray-800 text-white p-2 rounded text-sm z-10 max-w-xs">
                      Décrivez précisément vos besoins, objectifs et contraintes
                      pour obtenir un devis adapté
                    </div>
                  )}
                </div>
              </div>

              {/* Pièces jointes */}
              <div className="relative">
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Paperclip size={18} />
                  Pièces jointes
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onMouseEnter={() => setShowTooltip("attachments")}
                  onMouseLeave={() => setShowTooltip(null)}
                />

                {showTooltip === "attachments" && (
                  <div className="absolute -top-16 left-0 bg-gray-800 text-white p-2 rounded text-sm z-10 max-w-xs">
                    Ajoutez des documents, images ou références pour clarifier
                    votre demande
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="relative">
                <label className="block text-gray-700 font-medium mb-4">
                  Quand souhaitez-vous recevoir votre commande ?
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  {timelineOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          timeline: option.value,
                        }))
                      }
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        formData.timeline === option.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onMouseEnter={() => setShowTooltip("timeline")}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {formData.timeline === "custom" && (
                  <div className="flex items-center gap-2">
                    <Edit size={18} className="text-gray-400" />
                    <input
                      type="text"
                      value={formData.customTimeline}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customTimeline: e.target.value,
                        }))
                      }
                      placeholder="Précisez votre délai..."
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {showTooltip === "timeline" && (
                  <div className="absolute -top-16 left-0 bg-gray-800 text-white p-2 rounded text-sm z-10 max-w-xs">
                    Indiquez votre délai souhaité pour recevoir votre commande
                  </div>
                )}
              </div>

              {/* Budget */}
              <div className="relative">
                <label className="block text-gray-700 font-medium mb-2">
                  Quel est votre budget pour ce service ?
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        budget: e.target.value,
                      }))
                    }
                    placeholder="$US"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onMouseEnter={() => setShowTooltip("budget")}
                    onMouseLeave={() => setShowTooltip(null)}
                  />

                  {showTooltip === "budget" && (
                    <div className="absolute -top-16 left-0 bg-gray-800 text-white p-2 rounded text-sm z-10 max-w-xs">
                      Indiquez votre budget approximatif pour nous aider à
                      adapter notre proposition
                    </div>
                  )}
                </div>
              </div>

              {/* Bouton d'envoi */}
              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Envoyer la demande
                </button>
              </div>
            </div>
          </div>

          {/* Panneau d'aide */}
          <div className="lg:w-80 bg-blue-50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-blue-600" size={20} />
              <h3 className="font-semibold text-blue-800">
                Apportez des précisions
              </h3>
            </div>

            <p className="text-blue-700 mb-4">
              Incluez tous les détails nécessaires pour compléter votre demande.
            </p>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-blue-800 mb-1">
                  Par exemple :
                </h4>
                <p className="text-blue-600 text-sm">
                  Si vous recherchez un logo, vous pouvez préciser le nom de
                  votre entreprise, le type d'activité, la couleur préférée,
                  etc.
                </p>
              </div>

              <div className="bg-white/60 p-3 rounded">
                <h5 className="font-medium text-blue-800 text-sm mb-1">
                  Conseils pour un devis précis :
                </h5>
                <ul className="text-blue-600 text-xs space-y-1">
                  <li>• Décrivez vos objectifs clairement</li>
                  <li>• Mentionnez vos contraintes techniques</li>
                  <li>• Indiquez votre public cible</li>
                  <li>• Précisez le format de livraison souhaité</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObtenuDevis;
