"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Lock,
  Shield,
  Star,
  AlertCircle,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useServices } from "@/Context/Freelance/ContextService";
import { useFreelances } from "@/Context/Freelance/FreelanceContext";
import { useAuth } from "@/Context/ContextUser";

// Fonction de transformation identique à celle de ServiceDetailPage
const transformPackages = (servicePackages) => {
  if (!servicePackages || servicePackages.length === 0) {
    return [];
  }

  return servicePackages.map((pkg, index) => {
    const formattedDescription = pkg.description
      ? pkg.description.replace(/\\n/g, "\n")
      : `Package ${pkg.name}`;

    const allFeatures = [
      ...(pkg.highlights || []),
      ...(pkg.features?.map((f) => f.label) || []),
    ];

    return {
      id: pkg.id || `pkg-${index}`,
      name: pkg.name,
      price: parseFloat(pkg.price) || 50,
      deliveryTime: `${pkg.deliveryDays || 3} jours`,
      description: formattedDescription,
      features: allFeatures,
      highlights: pkg.highlights || [],
      revisions: pkg.revisions || "1",
      mostPopular: pkg.popular || index === 0,
      originalData: pkg,
    };
  });
};

export default function CommandePage() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const packageId = searchParams.get("packageId");

  // Récupérer les contextes
  const {
    services,
    getServiceById,
    isLoading: servicesLoading,
  } = useServices();
  const {
    freelances,
    getPhotoProfileUrl,
    isLoading: freelancesLoading,
  } = useFreelances();
  const { currentSession } = useAuth();

  // State pour gérer l'état de chargement global
  const [isInitializing, setIsInitializing] = useState(true);

  // Récupérer le service
  const service = useMemo(() => {
    if (!serviceId) return null;
    return getServiceById(serviceId);
  }, [serviceId, getServiceById, services]);

  // Transformer les packages de la même manière que ServiceDetailPage
  const transformedPackages = useMemo(() => {
    if (!service?.packages) return [];
    return transformPackages(service.packages);
  }, [service]);

  // Récupérer le forfait sélectionné avec la même logique d'ID
  const selectedPackage = useMemo(() => {
    if (!packageId) return null;
    return transformedPackages.find((pkg) => pkg.id === packageId);
  }, [packageId, transformedPackages]);

  // Récupérer les infos du prestataire
  const provider = useMemo(() => {
    if (!service) return null;
    return freelances.find((f) => f.id === service.freelance_id);
  }, [service, freelances]);

  // State pour le formulaire
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientInfo, setClientInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
  });

  // Initialiser les données client une fois que currentSession est disponible
  useEffect(() => {
    if (currentSession?.user) {
      setClientInfo({
        fullName: currentSession.user.name || "",
        email: currentSession.user.email || "",
        phone: currentSession.user.phone || "",
        country: currentSession.user.country || "",
        city: currentSession.user.city || "",
        address: currentSession.user.address || "",
      });
    }
  }, [currentSession]);

  // Vérifier quand les données sont complètement chargées
  useEffect(() => {
    if (!servicesLoading && !freelancesLoading) {
      const timer = setTimeout(() => {
        setIsInitializing(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [servicesLoading, freelancesLoading]);

  // Calcul des prix
  const basePrice = selectedPackage ? selectedPackage.price : 0;
  const platformFees = 5.5;
  const subTotal = basePrice * quantity;
  const total = subTotal + platformFees;

  const handleClientInfoChange = (field, value) => {
    setClientInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async () => {
    try {
      setIsSubmitting(true);

      // Validation minimale
      if (!clientInfo.fullName || !clientInfo.email) {
        alert("Veuillez remplir tous les champs obligatoires");
        return;
      }

      // Appel API pour créer la commande
      const response = await fetch("/api/create-commande", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId,
          packageId,
          quantity,
          paymentMethod,
          clientInfo,
          total,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la commande");
      }

      const result = await response.json();

      alert(`Commande créée! Total: €${total.toFixed(2)}`);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de la création de la commande");
    } finally {
      setIsSubmitting(false);
    }
  };

  // États de chargement et erreur
  if (isInitializing || servicesLoading || freelancesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la commande...</p>
        </div>
      </div>
    );
  }

  // Vérification des données après le chargement
  if (!serviceId || !packageId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-32">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Paramètres manquants
          </h1>
          <p className="text-gray-600 mb-8">
            Les paramètres serviceId et packageId sont requis dans l'URL.
          </p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-32">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Service introuvable
          </h1>
          <p className="text-gray-600 mb-8">
            Le service avec l'ID "{serviceId}" n'a pas été trouvé.
          </p>
        </div>
      </div>
    );
  }

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-32">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Forfait introuvable
          </h1>
          <p className="text-gray-600 mb-8">
            Le forfait avec l'ID "{packageId}" n'a pas été trouvé dans ce
            service.
          </p>
        </div>
      </div>
    );
  }

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-32">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Connexion requise
          </h1>
          <p className="text-gray-600">
            Veuillez vous connecter pour continuer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Passer une commande
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service et Prestataire */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Service commandé
              </h2>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {service.description.substring(0, 80) + "..."}
                  </p>

                  {/* Prestataire */}
                  {provider && (
                    <div className="flex items-center gap-3 pt-4 border-t">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                        {provider.photo_url ? (
                          <img
                            src={getPhotoProfileUrl(provider.photo_url)}
                            alt={provider.prenom}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          provider.prenom?.[0]?.toUpperCase()
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {provider.prenom} {provider.nom}
                        </p>
                        <p className="text-xs text-gray-600">
                          {provider.ville}, {provider.pays}
                        </p>
                        <div className="flex items-center gap-1 text-sm mt-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-gray-600">4.9 (248 avis)</span>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200">
                        Voir profil
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Forfait sélectionné */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Forfait sélectionné
              </h2>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {selectedPackage.name}
                </h3>
                <p className="text-gray-700 mb-3 text-sm">
                  {selectedPackage.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span>⏱️ Livraison: {selectedPackage.deliveryTime}</span>
                  <span>🔄 Révisions: {selectedPackage.revisions}</span>
                </div>

                {/* Highlights */}
                {selectedPackage.highlights &&
                  selectedPackage.highlights.length > 0 && (
                    <div className="space-y-2 pt-4 border-t border-blue-100">
                      <p className="text-sm font-semibold text-gray-900">
                        Inclus:
                      </p>
                      {selectedPackage.highlights.map((highlight, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="text-green-600 flex-shrink-0">
                            ✓
                          </span>
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            {/* Informations personnelles */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Vos informations personnelles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    label: "Nom complet",
                    key: "fullName",
                    disabled: true,
                    icon: User,
                  },
                  { label: "Email", key: "email", disabled: true, icon: Mail },
                  {
                    label: "Téléphone",
                    key: "phone",
                    disabled: false,
                    icon: Phone,
                  },
                  {
                    label: "Pays",
                    key: "country",
                    disabled: false,
                    icon: MapPin,
                  },
                  {
                    label: "Ville",
                    key: "city",
                    disabled: false,
                    icon: MapPin,
                  },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <field.icon className="w-4 h-4" />
                        {field.label}{" "}
                        {field.disabled && (
                          <span className="text-gray-400">(auto)</span>
                        )}
                      </div>
                    </label>
                    <input
                      type="text"
                      value={clientInfo[field.key]}
                      onChange={(e) =>
                        handleClientInfoChange(field.key, e.target.value)
                      }
                      disabled={field.disabled}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        field.disabled ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Adresse complète
                    </div>
                  </label>
                  <input
                    type="text"
                    value={clientInfo.address}
                    onChange={(e) =>
                      handleClientInfoChange("address", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Rue, numéro, code postal..."
                  />
                </div>
              </div>
            </div>

            {/* Mode de paiement */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Mode de paiement
              </h2>
              <div className="space-y-3 mb-6">
                {[
                  {
                    id: "card",
                    label: "Carte bancaire (Visa, Mastercard, Amex)",
                    icon: "💳",
                    description: "Paiement sécurisé instantané",
                  },
                  {
                    id: "paypal",
                    label: "PayPal",
                    icon: "🅿️",
                    description: "Paiement via votre compte PayPal",
                  },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 mt-1"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{method.icon}</span>
                        <div>
                          <span className="text-gray-900 font-medium">
                            {method.label}
                          </span>
                          <p className="text-sm text-gray-600 mt-1">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Badges de sécurité */}
              <div className="space-y-3">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-1">
                        Paiement sécurisé
                      </h3>
                      <p className="text-sm text-green-800">
                        Chiffrement SSL 256 bits • Conforme PCI-DSS • Données
                        non stockées
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex gap-3">
                    <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">
                        Protection acheteur
                      </h3>
                      <p className="text-sm text-blue-800">
                        Garantie d'escrow • Remboursement garanti • Support 24/7
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions spéciales */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Instructions spéciales (Optionnel)
              </h2>
              <textarea
                placeholder="Avez-vous des exigences particulières pour ce service ? Des instructions spécifiques pour le prestataire ?"
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                Ces informations seront transmises au prestataire après
                confirmation de la commande.
              </p>
            </div>
          </div>

          {/* Récapitulatif à droite */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 sticky top-40 space-y-6">
              <h2 className="text-lg font-bold text-gray-900">Récapitulatif</h2>

              {/* Forfait */}
              <div className="pb-6 border-b space-y-2">
                <p className="text-sm text-gray-600">Forfait</p>
                <p className="font-semibold text-gray-900">
                  {selectedPackage.name}
                </p>
                <p className="text-sm text-gray-600">
                  €{basePrice.toFixed(2)} × {quantity}
                </p>
              </div>

              {/* Quantité */}
              <div className="pb-6 border-b">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Quantité
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="flex-1 text-center py-2 border-0 focus:outline-none bg-transparent"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Calcul des prix */}
              <div className="space-y-3 pb-6 border-b text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Sous-total</span>
                  <span className="font-medium">€{subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Frais plateforme</span>
                  <span className="font-medium">
                    €{platformFees.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700 text-xs">
                  <span className="text-gray-500">TVA incluse</span>
                  <span className="text-gray-500">Incluse</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6 text-lg">
                <span className="font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <span className="font-bold text-2xl text-blue-600 block">
                    €{total.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    dont {platformFees.toFixed(2)}€ de frais
                  </span>
                </div>
              </div>

              {/* Garanties */}
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2 text-gray-600">
                  <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Garantie satisfait ou remboursé 14 jours</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600">
                  <Lock className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Paiement sécurisé crypté</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Support client 24h/24</span>
                </div>
              </div>

              {/* Bouton de paiement */}
              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <CreditCard className="w-5 h-5" />
                {isSubmitting
                  ? "Traitement en cours..."
                  : `Payer €${total.toFixed(2)}`}
              </button>

              <p className="text-xs text-gray-600 text-center">
                En confirmant, vous acceptez nos{" "}
                <a href="/conditions" className="text-blue-600 hover:underline">
                  conditions d'utilisation
                </a>{" "}
                et la{" "}
                <a
                  href="/confidentialite"
                  className="text-blue-600 hover:underline"
                >
                  politique de confidentialité
                </a>
                .
              </p>

              {/* Méthodes de paiement acceptées */}
              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 mb-2 text-center">
                  Paiements sécurisés acceptés
                </p>
                <div className="flex justify-center gap-3">
                  <span className="text-lg">💳</span>
                  <span className="text-lg">🅿️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
