import React, { useState } from "react";
import { X, Plus, Minus, ChevronUp, ChevronDown, Monitor } from "lucide-react";

interface OrderOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderOptionsModal: React.FC<OrderOptionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isOfferExpanded, setIsOfferExpanded] = useState(true);

  const basePrice = 395;
  const totalPrice = basePrice * quantity;

  if (!isOpen) return null;

  const handleQuantityChange = (increment: boolean) => {
    setQuantity((prev) => {
      const newQuantity = increment ? prev + 1 : prev - 1;
      return Math.max(1, newQuantity);
    });
  };

  const handleContinue = () => {
    console.log("Continuing with order:", { quantity, totalPrice });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Options de la commande
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Package Card */}
          <div className="border-2 border-gray-900 rounded-lg p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Basique
              </h3>
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                {basePrice} $US
              </span>
            </div>

            <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
              Page de destination professionnelle de vais construire,
              reconstruire le développement de sites Web en tant que développeur
              full stack, développeur front-end
            </p>

            {/* Quantity Selector */}
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">
                Nombre de services
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(false)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(true)}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="text-center space-y-2">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              {totalPrice} $US
            </div>
            <div className="text-gray-600">Une seule commande</div>
          </div>

          {/* Offer Details */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setIsOfferExpanded(!isOfferExpanded)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Monitor className="text-gray-600" size={20} />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">
                    Offre Basique
                  </div>
                  <div className="text-gray-600 text-sm">
                    Site web fonctionnel
                  </div>
                </div>
              </div>
              {isOfferExpanded ? (
                <ChevronUp className="text-gray-400" size={20} />
              ) : (
                <ChevronDown className="text-gray-400" size={20} />
              )}
            </button>

            {isOfferExpanded && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <ul className="space-y-3 mt-4">
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    1 page
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Téléchargement du contenu
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    3 plugins / extensions
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Fonctionnalité e-commerce
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Intégration de paiement
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Configuration de l'hébergement
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 space-y-3">
          <button
            onClick={handleContinue}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 sm:py-4 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Continuer ({totalPrice} $US)
          </button>
          <p className="text-center text-gray-500 text-sm">
            Vous ne serez pas facturé immédiatement
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderOptionsModal;
