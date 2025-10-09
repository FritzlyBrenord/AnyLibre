"use client";
import React, { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Play,
  HelpCircle,
  Lightbulb,
  Info,
  Upload,
  X,
  Plus,
  Save,
  AlertCircle,
} from "lucide-react";
import Header from "../Header/Header";

const AddServiceManagement = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    metadata: {},
    tags: [],
    packages: [
      {
        name: "Basic",
        price: "",
        deliveryDays: "",
        revisions: "",
        description: "",
      },
    ],
    description: "",
    faq: [],
    requirements: [],
    images: [],
    videoUrl: "",
    documents: [],
  });

  const steps = [
    { number: 1, title: "Aperçu", icon: "📋" },
    { number: 2, title: "Tarification", icon: "💰" },
    { number: 3, title: "Description", icon: "📝" },
    { number: 4, title: "FAQ", icon: "❓" },
    { number: 5, title: "Exigences", icon: "📑" },
    { number: 6, title: "Galerie", icon: "🖼️" },
    { number: 7, title: "Publier", icon: "🖼️" },
  ];

  // Structure hiérarchique des catégories avec métadonnées
  const categoriesData = {
    "programmation-tech": {
      label: "Programmation et Technologie",
      subcategories: {
        "dev-web": {
          label: "Développement de sites web",
          metadata: [
            {
              id: "website_type",
              label: "Type de site web",
              type: "select",
              required: true,
              options: [
                { value: "vitrine", label: "Site vitrine" },
                { value: "ecommerce", label: "E-commerce" },
                { value: "blog", label: "Blog" },
                { value: "portfolio", label: "Portfolio" },
                { value: "application", label: "Application web" },
                { value: "intranet", label: "Intranet/Extranet" },
                { value: "landing", label: "Landing page" },
              ],
            },
            {
              id: "website_features",
              label: "Caractéristiques du site web",
              type: "multiselect",
              required: false,
              options: [
                { value: "responsive", label: "Responsive (Mobile-friendly)" },
                { value: "cms", label: "Système de gestion de contenu (CMS)" },
                { value: "seo", label: "Optimisation SEO" },
                { value: "multilingual", label: "Multilingue" },
                { value: "payment", label: "Système de paiement" },
                { value: "admin", label: "Panel d'administration" },
                { value: "analytics", label: "Analytics intégré" },
              ],
            },
            {
              id: "industry",
              label: "Industrie",
              type: "select",
              required: true,
              options: [
                { value: "tech", label: "Technologie" },
                { value: "ecommerce", label: "E-commerce" },
                { value: "education", label: "Éducation" },
                { value: "health", label: "Santé" },
                { value: "finance", label: "Finance" },
                { value: "restaurant", label: "Restaurant/Food" },
                { value: "realestate", label: "Immobilier" },
                { value: "travel", label: "Voyage/Tourisme" },
                { value: "other", label: "Autre" },
              ],
            },
            {
              id: "platform",
              label: "Plateforme/Framework",
              type: "select",
              required: false,
              options: [
                { value: "wordpress", label: "WordPress" },
                { value: "shopify", label: "Shopify" },
                { value: "react", label: "React" },
                { value: "nextjs", label: "Next.js" },
                { value: "vue", label: "Vue.js" },
                { value: "laravel", label: "Laravel" },
                { value: "custom", label: "Code personnalisé" },
              ],
            },
          ],
        },
        "app-mobile": {
          label: "Application mobile",
          metadata: [
            {
              id: "app_platform",
              label: "Plateforme",
              type: "multiselect",
              required: true,
              options: [
                { value: "ios", label: "iOS" },
                { value: "android", label: "Android" },
                { value: "hybrid", label: "Hybride (iOS + Android)" },
              ],
            },
            {
              id: "app_type",
              label: "Type d'application",
              type: "select",
              required: true,
              options: [
                { value: "ecommerce", label: "E-commerce" },
                { value: "social", label: "Réseau social" },
                { value: "utility", label: "Utilitaire" },
                { value: "game", label: "Jeu" },
                { value: "education", label: "Éducation" },
                { value: "fitness", label: "Fitness/Santé" },
                { value: "business", label: "Business/Productivité" },
              ],
            },
            {
              id: "app_features",
              label: "Fonctionnalités",
              type: "multiselect",
              required: false,
              options: [
                { value: "auth", label: "Authentification utilisateur" },
                { value: "push", label: "Notifications push" },
                { value: "payment", label: "Paiement intégré" },
                { value: "maps", label: "Géolocalisation/Maps" },
                { value: "chat", label: "Chat/Messagerie" },
                { value: "camera", label: "Caméra/Photos" },
                { value: "offline", label: "Mode hors ligne" },
              ],
            },
          ],
        },
        "api-backend": {
          label: "API et Backend",
          metadata: [
            {
              id: "api_type",
              label: "Type d'API",
              type: "select",
              required: true,
              options: [
                { value: "rest", label: "REST API" },
                { value: "graphql", label: "GraphQL" },
                { value: "websocket", label: "WebSocket" },
                { value: "microservices", label: "Microservices" },
              ],
            },
            {
              id: "database",
              label: "Base de données",
              type: "multiselect",
              required: false,
              options: [
                { value: "mysql", label: "MySQL" },
                { value: "postgresql", label: "PostgreSQL" },
                { value: "mongodb", label: "MongoDB" },
                { value: "redis", label: "Redis" },
                { value: "firebase", label: "Firebase" },
              ],
            },
          ],
        },
      },
    },
    "design-graphique": {
      label: "Graphisme et Design",
      subcategories: {
        "logo-branding": {
          label: "Logo et Identité de marque",
          metadata: [
            {
              id: "logo_style",
              label: "Style de logo",
              type: "select",
              required: true,
              options: [
                { value: "modern", label: "Moderne" },
                { value: "minimalist", label: "Minimaliste" },
                { value: "vintage", label: "Vintage/Rétro" },
                { value: "elegant", label: "Élégant" },
                { value: "playful", label: "Ludique" },
                { value: "professional", label: "Professionnel" },
              ],
            },
            {
              id: "brand_industry",
              label: "Industrie de la marque",
              type: "select",
              required: true,
              options: [
                { value: "tech", label: "Technologie" },
                { value: "fashion", label: "Mode" },
                { value: "food", label: "Alimentation" },
                { value: "health", label: "Santé/Bien-être" },
                { value: "finance", label: "Finance" },
                { value: "education", label: "Éducation" },
                { value: "sports", label: "Sports" },
                { value: "other", label: "Autre" },
              ],
            },
            {
              id: "deliverables",
              label: "Livrables inclus",
              type: "multiselect",
              required: false,
              options: [
                { value: "vector", label: "Fichiers vectoriels (AI, EPS)" },
                { value: "png", label: "PNG haute résolution" },
                { value: "jpg", label: "JPG" },
                { value: "pdf", label: "PDF" },
                { value: "brandbook", label: "Guide de marque" },
                { value: "social", label: "Variantes réseaux sociaux" },
              ],
            },
          ],
        },
        "design-web": {
          label: "Design de site web (UI/UX)",
          metadata: [
            {
              id: "design_type",
              label: "Type de design",
              type: "select",
              required: true,
              options: [
                { value: "landing", label: "Landing page" },
                { value: "website", label: "Site web complet" },
                { value: "dashboard", label: "Dashboard/Admin" },
                { value: "mobile", label: "Application mobile" },
              ],
            },
            {
              id: "pages_count",
              label: "Nombre de pages",
              type: "select",
              required: true,
              options: [
                { value: "1-3", label: "1-3 pages" },
                { value: "4-7", label: "4-7 pages" },
                { value: "8-15", label: "8-15 pages" },
                { value: "15+", label: "Plus de 15 pages" },
              ],
            },
            {
              id: "design_tool",
              label: "Outil de design",
              type: "select",
              required: false,
              options: [
                { value: "figma", label: "Figma" },
                { value: "sketch", label: "Sketch" },
                { value: "xd", label: "Adobe XD" },
                { value: "photoshop", label: "Photoshop" },
              ],
            },
          ],
        },
      },
    },
    "redaction-traduction": {
      label: "Rédaction et Traduction",
      subcategories: {
        "redaction-articles": {
          label: "Rédaction d'articles",
          metadata: [
            {
              id: "article_type",
              label: "Type d'article",
              type: "select",
              required: true,
              options: [
                { value: "blog", label: "Article de blog" },
                { value: "seo", label: "Article SEO" },
                { value: "news", label: "Article de presse" },
                { value: "technical", label: "Article technique" },
                { value: "product", label: "Description de produit" },
              ],
            },
            {
              id: "word_count",
              label: "Nombre de mots",
              type: "select",
              required: true,
              options: [
                { value: "300-500", label: "300-500 mots" },
                { value: "500-800", label: "500-800 mots" },
                { value: "800-1200", label: "800-1200 mots" },
                { value: "1200-2000", label: "1200-2000 mots" },
                { value: "2000+", label: "Plus de 2000 mots" },
              ],
            },
            {
              id: "content_niche",
              label: "Niche/Domaine",
              type: "select",
              required: true,
              options: [
                { value: "tech", label: "Technologie" },
                { value: "health", label: "Santé" },
                { value: "finance", label: "Finance" },
                { value: "travel", label: "Voyage" },
                { value: "lifestyle", label: "Lifestyle" },
                { value: "business", label: "Business" },
                { value: "other", label: "Autre" },
              ],
            },
          ],
        },
        traduction: {
          label: "Traduction",
          metadata: [
            {
              id: "source_language",
              label: "Langue source",
              type: "select",
              required: true,
              options: [
                { value: "fr", label: "Français" },
                { value: "en", label: "Anglais" },
                { value: "es", label: "Espagnol" },
                { value: "de", label: "Allemand" },
                { value: "it", label: "Italien" },
                { value: "pt", label: "Portugais" },
              ],
            },
            {
              id: "target_language",
              label: "Langue cible",
              type: "select",
              required: true,
              options: [
                { value: "fr", label: "Français" },
                { value: "en", label: "Anglais" },
                { value: "es", label: "Espagnol" },
                { value: "de", label: "Allemand" },
                { value: "it", label: "Italien" },
                { value: "pt", label: "Portugais" },
              ],
            },
            {
              id: "translation_type",
              label: "Type de traduction",
              type: "select",
              required: true,
              options: [
                { value: "general", label: "Générale" },
                { value: "technical", label: "Technique" },
                { value: "legal", label: "Juridique" },
                { value: "medical", label: "Médicale" },
                { value: "marketing", label: "Marketing" },
              ],
            },
          ],
        },
      },
    },
    "video-animation": {
      label: "Vidéo et Animation",
      subcategories: {
        "montage-video": {
          label: "Montage vidéo",
          metadata: [
            {
              id: "video_type",
              label: "Type de vidéo",
              type: "select",
              required: true,
              options: [
                { value: "youtube", label: "Vidéo YouTube" },
                { value: "social", label: "Vidéo réseaux sociaux" },
                { value: "promo", label: "Vidéo promotionnelle" },
                { value: "tuto", label: "Tutoriel/Formation" },
                { value: "wedding", label: "Mariage/Événement" },
              ],
            },
            {
              id: "video_length",
              label: "Durée de la vidéo",
              type: "select",
              required: true,
              options: [
                { value: "0-2", label: "0-2 minutes" },
                { value: "2-5", label: "2-5 minutes" },
                { value: "5-10", label: "5-10 minutes" },
                { value: "10-30", label: "10-30 minutes" },
                { value: "30+", label: "Plus de 30 minutes" },
              ],
            },
            {
              id: "video_features",
              label: "Fonctionnalités incluses",
              type: "multiselect",
              required: false,
              options: [
                { value: "color", label: "Correction colorimétrique" },
                { value: "audio", label: "Mixage audio" },
                { value: "subtitles", label: "Sous-titres" },
                { value: "effects", label: "Effets spéciaux" },
                { value: "music", label: "Musique de fond" },
                { value: "transitions", label: "Transitions animées" },
              ],
            },
          ],
        },
      },
    },
    "marketing-digital": {
      label: "Marketing Digital",
      subcategories: {
        seo: {
          label: "SEO (Référencement)",
          metadata: [
            {
              id: "seo_type",
              label: "Type de SEO",
              type: "select",
              required: true,
              options: [
                { value: "onpage", label: "SEO On-Page" },
                { value: "offpage", label: "SEO Off-Page" },
                { value: "technical", label: "SEO Technique" },
                { value: "local", label: "SEO Local" },
                { value: "complete", label: "SEO Complet" },
              ],
            },
            {
              id: "website_size",
              label: "Taille du site",
              type: "select",
              required: true,
              options: [
                { value: "small", label: "Petit (1-10 pages)" },
                { value: "medium", label: "Moyen (11-50 pages)" },
                { value: "large", label: "Grand (51-200 pages)" },
                { value: "enterprise", label: "Entreprise (200+ pages)" },
              ],
            },
          ],
        },
        "social-media": {
          label: "Gestion réseaux sociaux",
          metadata: [
            {
              id: "platforms",
              label: "Plateformes",
              type: "multiselect",
              required: true,
              options: [
                { value: "facebook", label: "Facebook" },
                { value: "instagram", label: "Instagram" },
                { value: "twitter", label: "Twitter/X" },
                { value: "linkedin", label: "LinkedIn" },
                { value: "tiktok", label: "TikTok" },
                { value: "pinterest", label: "Pinterest" },
              ],
            },
            {
              id: "posts_per_week",
              label: "Publications par semaine",
              type: "select",
              required: true,
              options: [
                { value: "3", label: "3 publications" },
                { value: "5", label: "5 publications" },
                { value: "7", label: "7 publications (quotidien)" },
                { value: "10", label: "10+ publications" },
              ],
            },
          ],
        },
      },
    },
  };

  const handleCategoryChange = (categoryKey) => {
    setFormData({
      ...formData,
      category: categoryKey,
      subcategory: "",
      metadata: {},
    });
  };

  const handleSubcategoryChange = (subcategoryKey) => {
    setFormData({
      ...formData,
      subcategory: subcategoryKey,
      metadata: {},
    });
  };

  const handleMetadataChange = (metadataId, value) => {
    setFormData({
      ...formData,
      metadata: {
        ...formData.metadata,
        [metadataId]: value,
      },
    });
  };

  const getCurrentMetadata = () => {
    if (!formData.category || !formData.subcategory) return [];
    return (
      categoriesData[formData.category]?.subcategories[formData.subcategory]
        ?.metadata || []
    );
  };

  const videoGuides = {
    1: {
      title: "Comment créer un titre accrocheur",
      duration: "2:30",
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
      tips: [
        "Utilisez des mots-clés pertinents",
        "Soyez spécifique et clair",
        "Mentionnez le résultat final",
        "Maximum 80 caractères",
      ],
    },
    2: {
      title: "Définir vos forfaits de manière efficace",
      duration: "3:45",
      thumbnail:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400",
      tips: [
        "Offrez au moins 2 forfaits",
        "Créez une différence claire entre les niveaux",
        "Le forfait Premium doit offrir beaucoup plus de valeur",
        "Prix compétitifs mais justes",
      ],
    },
    3: {
      title: "Rédiger une description qui convertit",
      duration: "4:15",
      thumbnail:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400",
      tips: [
        "Présentez votre expérience",
        "Expliquez votre processus",
        "Listez ce qui est inclus",
        "Mentionnez vos garanties",
      ],
    },
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const handlePublishService = () => {
    // Validation finale
    if (!formData.title || !formData.category || !formData.subcategory) {
      alert(
        "Veuillez compléter les informations obligatoires (titre, catégorie, sous-catégorie)"
      );
      return;
    }

    if (
      formData.packages.some(
        (pkg) => !pkg.price || !pkg.deliveryDays || !pkg.description
      )
    ) {
      alert("Veuillez compléter tous les champs obligatoires de vos forfaits");
      return;
    }

    if (!formData.description) {
      alert("Veuillez ajouter une description à votre service");
      return;
    }

    // Simulation de l'envoi des données
    console.log("Service à publier:", formData);

    // Affichage de l'alerte de succès
    alert(
      "🎉 Félicitations ! Votre service a été publié avec succès !\n\n" +
        "Votre service est maintenant en cours de modération. " +
        "Vous recevrez une notification dès qu'il sera approuvé et visible par les acheteurs.\n\n" +
        "Vous pouvez suivre l'état de votre service dans votre tableau de bord."
    );

    // Redirection ou reset du formulaire
    // window.location.href = "/dashboard"; // Décommentez pour rediriger
  };

  const currentGuide = videoGuides[currentStep] || videoGuides[1];

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        {/* Progress Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Créer un nouveau service
              </h1>
              <button
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <X size={20} className="mr-1" />
                Annuler
              </button>
            </div>

            {/* Steps */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center flex-1">
                    <button
                      onClick={() => setCurrentStep(step.number)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-all ${
                        step.number < currentStep
                          ? "bg-green-600 text-white"
                          : step.number === currentStep
                          ? "bg-blue-600 text-white ring-4 ring-blue-200"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step.number < currentStep ? (
                        <Check size={24} />
                      ) : (
                        step.icon
                      )}
                    </button>
                    <span
                      className={`text-xs font-medium hidden md:block ${
                        step.number === currentStep
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step.number < currentStep
                          ? "bg-green-600"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
                {/* Step 1: Aperçu */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        1. Aperçu du Service
                      </h2>
                      <p className="text-gray-600">
                        Créez un titre accrocheur et choisissez la bonne
                        catégorie
                      </p>
                    </div>

                    {/* Alert Info */}
                    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                      <div className="flex">
                        <Info
                          className="text-blue-600 mr-3 flex-shrink-0 mt-0.5"
                          size={20}
                        />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Conseil important
                          </p>
                          <p className="text-sm text-blue-700 mt-1">
                            Un bon titre contient des mots-clés que vos clients
                            recherchent. Commencez par "Je vais..." pour être
                            plus personnel.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Titre du service *
                        <span className="text-gray-500 font-normal ml-2">
                          (max 80 caractères)
                        </span>
                      </label>
                      <input
                        type="text"
                        maxLength={80}
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Ex: Je vais créer un logo professionnel unique pour votre entreprise"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          Utilisez des mots-clés pertinents pour le
                          référencement
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            formData.title.length > 70
                              ? "text-red-600"
                              : "text-gray-500"
                          }`}
                        >
                          {formData.title.length}/80
                        </span>
                      </div>
                    </div>

                    {/* Catégorie */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Catégorie *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      >
                        <option value="">Sélectionnez une catégorie</option>
                        {Object.entries(categoriesData).map(([key, cat]) => (
                          <option key={key} value={key}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sous-catégorie */}
                    {formData.category && (
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Sous-catégorie *
                        </label>
                        <select
                          value={formData.subcategory}
                          onChange={(e) =>
                            handleSubcategoryChange(e.target.value)
                          }
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                        >
                          <option value="">
                            Sélectionnez une sous-catégorie
                          </option>
                          {Object.entries(
                            categoriesData[formData.category].subcategories
                          ).map(([key, subcat]) => (
                            <option key={key} value={key}>
                              {subcat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Métadonnées dynamiques */}
                    {formData.category &&
                      formData.subcategory &&
                      getCurrentMetadata().length > 0 && (
                        <div className="border-t-2 border-gray-200 pt-6 mt-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <AlertCircle
                              className="mr-2 text-blue-600"
                              size={20}
                            />
                            Métadonnées spécifiques
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Ces informations nous aident à mieux catégoriser
                            votre service
                          </p>

                          <div className="space-y-4">
                            {getCurrentMetadata().map((meta) => (
                              <div key={meta.id}>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                  {meta.label}{" "}
                                  {meta.required && (
                                    <span className="text-red-600">*</span>
                                  )}
                                </label>

                                {meta.type === "select" && (
                                  <select
                                    value={formData.metadata[meta.id] || ""}
                                    onChange={(e) =>
                                      handleMetadataChange(
                                        meta.id,
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    required={meta.required}
                                  >
                                    <option value="">Choisir...</option>
                                    {meta.options.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                )}

                                {meta.type === "multiselect" && (
                                  <div className="border-2 border-gray-300 rounded-lg p-4 space-y-2 max-h-64 overflow-y-auto">
                                    {meta.options.map((opt) => (
                                      <label
                                        key={opt.value}
                                        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={(
                                            formData.metadata[meta.id] || []
                                          ).includes(opt.value)}
                                          onChange={(e) => {
                                            const currentValues =
                                              formData.metadata[meta.id] || [];
                                            const newValues = e.target.checked
                                              ? [...currentValues, opt.value]
                                              : currentValues.filter(
                                                  (v) => v !== opt.value
                                                );
                                            handleMetadataChange(
                                              meta.id,
                                              newValues
                                            );
                                          }}
                                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-900">
                                          {opt.label}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Tags */}
                    <div className="border-t-2 border-gray-200 pt-6">
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Tags de recherche
                        <span className="text-gray-500 font-normal ml-2">
                          (max 5 tags)
                        </span>
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium flex items-center"
                          >
                            {tag}
                            <button
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  tags: formData.tags.filter(
                                    (_, i) => i !== index
                                  ),
                                })
                              }
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <X size={16} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Taper un tag et appuyer sur Entrée"
                        onKeyPress={(e) => {
                          if (
                            e.key === "Enter" &&
                            e.target.value &&
                            formData.tags.length < 5
                          ) {
                            setFormData({
                              ...formData,
                              tags: [
                                ...formData.tags,
                                e.target.value.toLowerCase(),
                              ],
                            });
                            e.target.value = "";
                            e.preventDefault();
                          }
                        }}
                        disabled={formData.tags.length >= 5}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Tarification - Reste inchangé */}
                {/* Step 2: Tarification */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        2. Tarification et Forfaits
                      </h2>
                      <p className="text-gray-600">
                        Créez jusqu'à 3 forfaits pour offrir plus de choix à vos
                        clients
                      </p>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
                      <div className="flex">
                        <Lightbulb
                          className="text-yellow-600 mr-3 flex-shrink-0 mt-0.5"
                          size={20}
                        />
                        <div>
                          <p className="text-sm font-medium text-yellow-900">
                            Stratégie de tarification
                          </p>
                          <p className="text-sm text-yellow-700 mt-1">
                            Offrez 3 forfaits pour maximiser vos ventes. La
                            plupart des clients choisissent le forfait Standard.
                            Le Premium doit offrir une valeur exceptionnelle.
                          </p>
                        </div>
                      </div>
                    </div>

                    {formData.packages.map((pkg, index) => (
                      <div
                        key={index}
                        className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold text-gray-900">
                            Forfait {pkg.name}
                          </h3>
                          {formData.packages.length > 1 && (
                            <button
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  packages: formData.packages.filter(
                                    (_, i) => i !== index
                                  ),
                                })
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                              Prix ($) *
                            </label>
                            <input
                              type="number"
                              min="5"
                              value={pkg.price}
                              onChange={(e) => {
                                const newPackages = [...formData.packages];
                                newPackages[index].price = e.target.value;
                                setFormData({
                                  ...formData,
                                  packages: newPackages,
                                });
                              }}
                              placeholder="50"
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                              Délai (jours) *
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="90"
                              value={pkg.deliveryDays}
                              onChange={(e) => {
                                const newPackages = [...formData.packages];
                                newPackages[index].deliveryDays =
                                  e.target.value;
                                setFormData({
                                  ...formData,
                                  packages: newPackages,
                                });
                              }}
                              placeholder="3"
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                              Révisions *
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={pkg.revisions}
                              onChange={(e) => {
                                const newPackages = [...formData.packages];
                                newPackages[index].revisions = e.target.value;
                                setFormData({
                                  ...formData,
                                  packages: newPackages,
                                });
                              }}
                              placeholder="2"
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-2">
                            Description du forfait *
                          </label>
                          <textarea
                            rows={3}
                            value={pkg.description}
                            onChange={(e) => {
                              const newPackages = [...formData.packages];
                              newPackages[index].description = e.target.value;
                              setFormData({
                                ...formData,
                                packages: newPackages,
                              });
                            }}
                            placeholder="Décrivez ce qui est inclus dans ce forfait..."
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    ))}

                    {formData.packages.length < 3 && (
                      <button
                        onClick={() => {
                          const names = ["Basic", "Standard", "Premium"];
                          setFormData({
                            ...formData,
                            packages: [
                              ...formData.packages,
                              {
                                name: names[formData.packages.length],
                                price: "",
                                deliveryDays: "",
                                revisions: "",
                                description: "",
                              },
                            ],
                          });
                        }}
                        className="w-full py-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center font-semibold"
                      >
                        <Plus size={20} className="mr-2" />
                        Ajouter un forfait{" "}
                        {["Standard", "Premium"][formData.packages.length - 1]}
                      </button>
                    )}
                  </div>
                )}

                {/* Step 3: Description */}
                {/* Step 3: Description */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        3. Description du Service
                      </h2>
                      <p className="text-gray-600">
                        Décrivez votre service en détail pour convaincre les
                        clients
                      </p>
                    </div>

                    {/* Promotion Card */}
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-5">
                      <div className="flex items-start gap-3">
                        <div className="bg-pink-500 text-white px-3 py-1 rounded-md text-sm font-bold">
                          Plus
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">
                            Prêt à créer des services remarquables ?
                          </h3>
                          <p className="text-sm text-gray-700 mb-3">
                            Avec Seller Plus Kickstart, vous pouvez optimiser
                            vos services en utilisant des retours basés sur l'IA
                            et apprendre des insights pour attirer plus de
                            clients.
                          </p>
                          <button className="text-sm text-pink-600 font-semibold hover:underline flex items-center">
                            En savoir plus →
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Info Card */}
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
                        </div>
                      </div>
                    </div>

                    {/* Section Title */}
                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-2">
                        Décrivez brièvement votre service
                      </label>
                    </div>

                    {/* Rich Text Editor Toolbar */}
                    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <div className="flex items-center gap-2 p-3 bg-gray-50 border-b border-gray-300">
                        <button
                          type="button"
                          onClick={() => {
                            document.execCommand("bold", false, null);
                          }}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Gras"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M11 5H7v10h4c2.21 0 4-1.79 4-4s-1.79-4-4-4zm-.5 6h-2v-2h2c.55 0 1 .45 1 1s-.45 1-1 1z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            document.execCommand("italic", false, null);
                          }}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Italique"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
                          </svg>
                        </button>

                        <div className="w-px h-6 bg-gray-300"></div>

                        <button
                          type="button"
                          onClick={() => {
                            document.execCommand(
                              "insertUnorderedList",
                              false,
                              null
                            );
                          }}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Liste à puces"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            document.execCommand(
                              "insertOrderedList",
                              false,
                              null
                            );
                          }}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Liste numérotée"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Editor Content */}
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onInput={(e) => {
                          const text = e.currentTarget.innerText || "";
                          if (text.length <= 1200) {
                            setFormData({
                              ...formData,
                              description: e.currentTarget.innerHTML,
                            });
                          } else {
                            e.currentTarget.innerText = text.substring(0, 1200);
                            // Placer le curseur à la fin
                            const range = document.createRange();
                            const sel = window.getSelection();
                            range.selectNodeContents(e.currentTarget);
                            range.collapse(false);
                            sel.removeAllRanges();
                            sel.addRange(range);
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const text = e.clipboardData.getData("text/plain");
                          document.execCommand("insertText", false, text);
                        }}
                        className="min-h-[400px] p-4 focus:outline-none text-gray-900"
                        style={{
                          lineHeight: "1.6",
                          fontSize: "15px",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: formData.description || "",
                        }}
                      />
                    </div>

                    {/* Character Count */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">
                        Une description détaillée augmente vos chances de vente
                      </span>
                      <span
                        className={`font-medium ${
                          (formData.description?.replace(/<[^>]*>/g, "")
                            .length || 0) < 120
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {formData.description?.replace(/<[^>]*>/g, "").length ||
                          0}
                        /1200 Caractères
                      </span>
                    </div>

                    {/* Template Suggestion */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Modèle de description recommandé
                          </h4>
                          <div className="text-sm text-gray-700 space-y-2 font-mono bg-white p-4 rounded border border-blue-200">
                            <p>
                              <strong>Bonjour !</strong> Je suis [Votre Nom],
                              [votre expertise] avec [X années] d'expérience.
                            </p>
                            <p className="mt-3">
                              <strong>
                                🎯 Ce que je vais faire pour vous :
                              </strong>
                            </p>
                            <p>• Point 1</p>
                            <p>• Point 2</p>
                            <p>• Point 3</p>
                            <p className="mt-3">
                              <strong>✅ Mon processus :</strong>
                            </p>
                            <p>1. Étape 1</p>
                            <p>2. Étape 2</p>
                            <p>3. Étape 3</p>
                            <p className="mt-3">
                              <strong>🌟 Pourquoi me choisir :</strong>
                            </p>
                            <p>• Avantage 1</p>
                            <p>• Avantage 2</p>
                            <p>• Garantie satisfaction</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const template = `<p><strong>Bonjour !</strong> Je suis [Votre Nom], [votre expertise] avec [X années] d'expérience.</p><br><p><strong>🎯 Ce que je vais faire pour vous :</strong></p><ul><li>Point 1</li><li>Point 2</li><li>Point 3</li></ul><br><p><strong>✅ Mon processus :</strong></p><ol><li>Étape 1</li><li>Étape 2</li><li>Étape 3</li></ol><br><p><strong>🌟 Pourquoi me choisir :</strong></p><ul><li>Avantage 1</li><li>Avantage 2</li><li>Garantie satisfaction</li></ul>`;
                              setFormData({
                                ...formData,
                                description: template,
                              });
                            }}
                            className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                              <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                            </svg>
                            Utiliser ce modèle
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: FAQ */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          Frequently Asked Questions
                        </h2>
                        <p className="text-gray-600">
                          Add Questions & Answers for Your Buyers.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          // Vérifier si une FAQ est en cours d'édition
                          const hasUnsaved = formData.faq.some(
                            (f) => f.isEditing
                          );
                          if (hasUnsaved) {
                            alert(
                              "Veuillez d'abord sauvegarder la FAQ en cours avant d'en ajouter une nouvelle"
                            );
                            return;
                          }
                          setFormData({
                            ...formData,
                            faq: [
                              ...formData.faq,
                              {
                                question: "",
                                answer: "",
                                isEditing: true,
                                isOpen: true,
                              },
                            ],
                          });
                        }}
                        className="text-green-600 hover:text-green-700 font-semibold flex items-center text-sm"
                      >
                        <svg
                          className="w-5 h-5 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Add FAQ
                      </button>
                    </div>

                    {/* Info Card */}
                    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                      <div className="flex">
                        <svg
                          className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
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
                          <p className="text-sm font-medium text-blue-900">
                            Anticipez les questions des clients
                          </p>
                          <p className="text-sm text-blue-700 mt-1">
                            Ajoutez 3-5 questions fréquentes pour rassurer vos
                            clients et réduire les messages de clarification.
                            Soyez transparent sur les délais, ce qui est inclus
                            et votre politique de révision.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FAQ List */}
                    {formData.faq && formData.faq.length > 0 ? (
                      <div className="space-y-3">
                        {formData.faq.map((item, index) => (
                          <div
                            key={index}
                            className="border-2 border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors"
                          >
                            {/* FAQ Header - Collapsed View */}
                            {!item.isEditing && (
                              <div
                                onClick={() => {
                                  const newFaq = [...formData.faq];
                                  newFaq[index].isOpen = !newFaq[index].isOpen;
                                  setFormData({ ...formData, faq: newFaq });
                                }}
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <svg
                                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                                      item.isOpen ? "rotate-90" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 truncate">
                                      {item.question || `FAQ #${index + 1}`}
                                    </h4>
                                    {!item.isOpen && item.answer && (
                                      <p className="text-sm text-gray-600 truncate mt-1">
                                        {item.answer}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-3">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newFaq = [...formData.faq];
                                      newFaq[index].isEditing = true;
                                      newFaq[index].isOpen = true;
                                      setFormData({ ...formData, faq: newFaq });
                                    }}
                                    className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition-colors"
                                    title="Modifier"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (
                                        window.confirm(
                                          "Êtes-vous sûr de vouloir supprimer cette FAQ ?"
                                        )
                                      ) {
                                        setFormData({
                                          ...formData,
                                          faq: formData.faq.filter(
                                            (_, i) => i !== index
                                          ),
                                        });
                                      }
                                    }}
                                    className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                                    title="Supprimer"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* FAQ Content - Expanded View */}
                            {item.isOpen && (
                              <div className="border-t border-gray-200">
                                {item.isEditing ? (
                                  // Mode Edition
                                  <div className="p-5 bg-gray-50">
                                    <div className="flex items-center justify-between mb-4">
                                      <h4 className="font-semibold text-gray-900 text-lg">
                                        {item.question
                                          ? "Modifier la FAQ"
                                          : `Nouvelle FAQ #${index + 1}`}
                                      </h4>
                                    </div>

                                    <div className="space-y-4">
                                      <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                          Question *
                                        </label>
                                        <input
                                          type="text"
                                          value={item.question}
                                          onChange={(e) => {
                                            const newFaq = [...formData.faq];
                                            newFaq[index].question =
                                              e.target.value;
                                            setFormData({
                                              ...formData,
                                              faq: newFaq,
                                            });
                                          }}
                                          placeholder="Ex: Combien de révisions sont incluses ?"
                                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                          Réponse *
                                        </label>
                                        <textarea
                                          rows={4}
                                          value={item.answer}
                                          onChange={(e) => {
                                            const newFaq = [...formData.faq];
                                            newFaq[index].answer =
                                              e.target.value;
                                            setFormData({
                                              ...formData,
                                              faq: newFaq,
                                            });
                                          }}
                                          placeholder="Votre réponse détaillée..."
                                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                          Soyez clair et précis dans votre
                                          réponse
                                        </p>
                                      </div>

                                      {/* Action Buttons */}
                                      <div className="flex items-center justify-end gap-3 pt-2">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (
                                              !item.question &&
                                              !item.answer
                                            ) {
                                              // Si vide, supprimer
                                              setFormData({
                                                ...formData,
                                                faq: formData.faq.filter(
                                                  (_, i) => i !== index
                                                ),
                                              });
                                            } else {
                                              // Annuler les modifications
                                              const newFaq = [...formData.faq];
                                              newFaq[index].isEditing = false;
                                              newFaq[index].isOpen = false;
                                              setFormData({
                                                ...formData,
                                                faq: newFaq,
                                              });
                                            }
                                          }}
                                          className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                        >
                                          Annuler
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (
                                              !item.question.trim() ||
                                              !item.answer.trim()
                                            ) {
                                              alert(
                                                "Veuillez remplir la question et la réponse"
                                              );
                                              return;
                                            }
                                            const newFaq = [...formData.faq];
                                            newFaq[index].isEditing = false;
                                            newFaq[index].isOpen = false;
                                            setFormData({
                                              ...formData,
                                              faq: newFaq,
                                            });
                                          }}
                                          className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium flex items-center"
                                        >
                                          <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                          Valider
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  // Mode Lecture
                                  <div className="p-5">
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                      {item.answer}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                        <svg
                          className="w-16 h-16 text-gray-400 mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Aucune FAQ ajoutée
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Commencez par ajouter votre première question
                          fréquente
                        </p>
                      </div>
                    )}

                    {/* Add FAQ Button (Bottom) */}
                    {formData.faq && !formData.faq.some((f) => f.isEditing) && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            faq: [
                              ...formData.faq,
                              {
                                question: "",
                                answer: "",
                                isEditing: true,
                                isOpen: true,
                              },
                            ],
                          });
                        }}
                        className="w-full py-4 border-2 border-dashed border-green-300 rounded-lg text-green-600 hover:bg-green-50 hover:border-green-400 transition-colors flex items-center justify-center font-semibold text-base"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Add FAQ
                      </button>
                    )}

                    {/* FAQ Examples Card */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-5">
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-3">
                            Exemples de questions fréquentes
                          </h4>

                          <div className="space-y-3 text-sm">
                            <div className="bg-white rounded-lg p-3 border border-purple-200">
                              <p className="font-semibold text-gray-900 mb-1">
                                Q: Combien de révisions sont incluses ?
                              </p>
                              <p className="text-gray-700">
                                R: Le forfait Basic inclut 2 révisions, Standard
                                5 révisions et Premium 10 révisions illimitées.
                              </p>
                            </div>

                            <div className="bg-white rounded-lg p-3 border border-purple-200">
                              <p className="font-semibold text-gray-900 mb-1">
                                Q: Quel est le délai de livraison ?
                              </p>
                              <p className="text-gray-700">
                                R: Le délai varie selon le forfait choisi.
                                Basic: 3 jours, Standard: 5 jours, Premium: 7
                                jours.
                              </p>
                            </div>

                            <div className="bg-white rounded-lg p-3 border border-purple-200">
                              <p className="font-semibold text-gray-900 mb-1">
                                Q: Que dois-je fournir pour commencer ?
                              </p>
                              <p className="text-gray-700">
                                R: J'aurai besoin de votre brief détaillé, vos
                                préférences de couleurs, et vos références
                                visuelles.
                              </p>
                            </div>

                            <div className="bg-white rounded-lg p-3 border border-purple-200">
                              <p className="font-semibold text-gray-900 mb-1">
                                Q: Proposez-vous un remboursement ?
                              </p>
                              <p className="text-gray-700">
                                R: Oui, je garantis 100% satisfaction. Si vous
                                n'êtes pas satisfait, je vous rembourse
                                intégralement.
                              </p>
                            </div>

                            <div className="bg-white rounded-lg p-3 border border-purple-200">
                              <p className="font-semibold text-gray-900 mb-1">
                                Q: Puis-je demander une livraison express ?
                              </p>
                              <p className="text-gray-700">
                                R: Oui, contactez-moi avant de commander pour
                                discuter des options de livraison express.
                              </p>
                            </div>
                          </div>

                          <p className="text-xs text-gray-600 mt-3 italic">
                            💡 Conseil: Répondez aux objections courantes avant
                            même qu'elles ne soient posées
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Best Practices */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Meilleures pratiques pour les FAQ
                          </h4>
                          <ul className="text-sm text-gray-700 space-y-2">
                            <li className="flex items-start">
                              <span className="text-green-600 mr-2">✓</span>
                              <span>
                                Répondez aux questions les plus posées en
                                premier
                              </span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-green-600 mr-2">✓</span>
                              <span>
                                Soyez transparent sur ce qui N'est PAS inclus
                              </span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-green-600 mr-2">✓</span>
                              <span>
                                Mentionnez votre politique de révision et de
                                remboursement
                              </span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-green-600 mr-2">✓</span>
                              <span>Expliquez votre processus de travail</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-green-600 mr-2">✓</span>
                              <span>Précisez les délais et disponibilités</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Exigences */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        VOS QUESTIONS
                      </h2>
                      <p className="text-gray-600">
                        C'est ici que vous pouvez demander tous les détails
                        nécessaires pour finaliser la commande.
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Il n'est pas nécessaire de répéter les questions
                        générales posées ci-dessus par Fiverr.
                      </p>
                    </div>

                    {/* Requirements List */}
                    {formData.requirements &&
                      formData.requirements.length > 0 && (
                        <div className="space-y-3">
                          {formData.requirements.map((req, index) => (
                            <div
                              key={index}
                              className="border-2 border-gray-200 rounded-lg bg-white"
                            >
                              {!req.isEditing ? (
                                // View Mode
                                <div
                                  onClick={() => {
                                    const newReqs = [...formData.requirements];
                                    newReqs[index].isOpen =
                                      !newReqs[index].isOpen;
                                    setFormData({
                                      ...formData,
                                      requirements: newReqs,
                                    });
                                  }}
                                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <svg
                                      className={`w-5 h-5 text-gray-500 transition-transform ${
                                        req.isOpen ? "rotate-90" : ""
                                      }`}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                      />
                                    </svg>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="font-semibold text-gray-900">
                                          {req.question ||
                                            `Question #${index + 1}`}
                                        </h4>
                                        {req.required && (
                                          <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                                            Obligatoire
                                          </span>
                                        )}
                                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                                          {req.type === "text"
                                            ? "Texte libre"
                                            : req.type === "choice"
                                            ? "Choix multiple"
                                            : "Fichier"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newReqs = [
                                          ...formData.requirements,
                                        ];
                                        newReqs[index].isEditing = true;
                                        newReqs[index].isOpen = true;
                                        setFormData({
                                          ...formData,
                                          requirements: newReqs,
                                        });
                                      }}
                                      className="text-blue-600 p-2 hover:bg-blue-50 rounded"
                                    >
                                      <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                      </svg>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (
                                          window.confirm(
                                            "Supprimer cette exigence ?"
                                          )
                                        ) {
                                          setFormData({
                                            ...formData,
                                            requirements:
                                              formData.requirements.filter(
                                                (_, i) => i !== index
                                              ),
                                          });
                                        }
                                      }}
                                      className="text-red-600 p-2 hover:bg-red-50 rounded"
                                    >
                                      <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                // Edit Mode
                                <div className="p-5 bg-gray-50">
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold text-lg">
                                      Ajouter une question
                                    </h4>
                                    <label className="flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={req.required}
                                        onChange={(e) => {
                                          const newReqs = [
                                            ...formData.requirements,
                                          ];
                                          newReqs[index].required =
                                            e.target.checked;
                                          setFormData({
                                            ...formData,
                                            requirements: newReqs,
                                          });
                                        }}
                                        className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black mr-2"
                                      />
                                      <span className="font-medium text-gray-900">
                                        Obligatoire
                                      </span>
                                    </label>
                                  </div>

                                  <div className="space-y-4">
                                    <div>
                                      <input
                                        type="text"
                                        value={req.question}
                                        onChange={(e) => {
                                          const newReqs = [
                                            ...formData.requirements,
                                          ];
                                          newReqs[index].question =
                                            e.target.value;
                                          setFormData({
                                            ...formData,
                                            requirements: newReqs,
                                          });
                                        }}
                                        placeholder="Ex: Quel est le nom de votre entreprise ?"
                                        maxLength={400}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                      />
                                      <p className="text-xs text-gray-500 text-right mt-1">
                                        {req.question?.length || 0}/400
                                      </p>
                                    </div>

                                    <div>
                                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Obtenez-le sous la forme de :
                                      </label>
                                      <select
                                        value={req.type}
                                        onChange={(e) => {
                                          const newReqs = [
                                            ...formData.requirements,
                                          ];
                                          newReqs[index].type = e.target.value;
                                          if (e.target.value !== "choice") {
                                            delete newReqs[index].options;
                                            delete newReqs[index]
                                              .multipleChoice;
                                          } else {
                                            newReqs[index].options = [""];
                                            newReqs[index].multipleChoice =
                                              false;
                                          }
                                          setFormData({
                                            ...formData,
                                            requirements: newReqs,
                                          });
                                        }}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                      >
                                        <option value="text">
                                          Texte libre
                                        </option>
                                        <option value="choice">
                                          Choix multiple
                                        </option>
                                        <option value="file">
                                          Attachement
                                        </option>
                                      </select>
                                    </div>

                                    {req.type === "choice" && (
                                      <div className="space-y-3">
                                        <label className="flex items-center cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={req.multipleChoice}
                                            onChange={(e) => {
                                              const newReqs = [
                                                ...formData.requirements,
                                              ];
                                              newReqs[index].multipleChoice =
                                                e.target.checked;
                                              setFormData({
                                                ...formData,
                                                requirements: newReqs,
                                              });
                                            }}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded mr-2"
                                          />
                                          <span className="text-sm text-gray-700">
                                            Permet de choisir plus d'1 option
                                          </span>
                                        </label>

                                        {req.options?.map((opt, optIdx) => (
                                          <div
                                            key={optIdx}
                                            className="flex gap-2"
                                          >
                                            <input
                                              type="text"
                                              value={opt}
                                              onChange={(e) => {
                                                const newReqs = [
                                                  ...formData.requirements,
                                                ];
                                                newReqs[index].options[optIdx] =
                                                  e.target.value;
                                                setFormData({
                                                  ...formData,
                                                  requirements: newReqs,
                                                });
                                              }}
                                              placeholder={`Option ${
                                                optIdx + 1
                                              }`}
                                              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const newReqs = [
                                                  ...formData.requirements,
                                                ];
                                                newReqs[index].options =
                                                  newReqs[index].options.filter(
                                                    (_, i) => i !== optIdx
                                                  );
                                                setFormData({
                                                  ...formData,
                                                  requirements: newReqs,
                                                });
                                              }}
                                              className="text-red-600 hover:text-red-700 p-2"
                                            >
                                              <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M6 18L18 6M6 6l12 12"
                                                />
                                              </svg>
                                            </button>
                                          </div>
                                        ))}

                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newReqs = [
                                              ...formData.requirements,
                                            ];
                                            newReqs[index].options = [
                                              ...newReqs[index].options,
                                              "",
                                            ];
                                            setFormData({
                                              ...formData,
                                              requirements: newReqs,
                                            });
                                          }}
                                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                        >
                                          + Ajouter une option
                                        </button>
                                      </div>
                                    )}

                                    <div className="flex justify-end gap-3 pt-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!req.question) {
                                            setFormData({
                                              ...formData,
                                              requirements:
                                                formData.requirements.filter(
                                                  (_, i) => i !== index
                                                ),
                                            });
                                          } else {
                                            const newReqs = [
                                              ...formData.requirements,
                                            ];
                                            newReqs[index].isEditing = false;
                                            newReqs[index].isOpen = false;
                                            setFormData({
                                              ...formData,
                                              requirements: newReqs,
                                            });
                                          }
                                        }}
                                        className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                      >
                                        Annuler
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!req.question.trim()) {
                                            alert(
                                              "Veuillez saisir une question"
                                            );
                                            return;
                                          }
                                          if (
                                            req.type === "choice" &&
                                            (!req.options ||
                                              req.options.filter((o) =>
                                                o.trim()
                                              ).length === 0)
                                          ) {
                                            alert(
                                              "Veuillez ajouter au moins une option"
                                            );
                                            return;
                                          }
                                          const newReqs = [
                                            ...formData.requirements,
                                          ];
                                          newReqs[index].isEditing = false;
                                          newReqs[index].isOpen = false;
                                          setFormData({
                                            ...formData,
                                            requirements: newReqs,
                                          });
                                        }}
                                        className="px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 font-medium"
                                      >
                                        Ajouter
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Add Button */}
                    {!formData.requirements?.some((r) => r.isEditing) && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            requirements: [
                              ...(formData.requirements || []),
                              {
                                question: "",
                                type: "text",
                                required: true,
                                isEditing: true,
                                isOpen: true,
                              },
                            ],
                          });
                        }}
                        className="w-full py-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 font-semibold flex items-center justify-center"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Ajouter une question
                      </button>
                    )}

                    {/* Examples */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
                      <h4 className="font-bold text-gray-900 mb-3">
                        💡 Exemples de questions
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• Quel est le nom de votre entreprise ?</li>
                        <li>• Avez-vous des couleurs préférées ?</li>
                        <li>
                          • Partagez vos références visuelles (logos, sites
                          web...)
                        </li>
                        <li>• Avez-vous un slogan ou message spécifique ?</li>
                        <li>• Quelle est votre date limite ?</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Step 6: Galerie */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        6. Galerie
                      </h2>
                      <p className="text-gray-600">
                        Ajoutez des visuels pour montrer la qualité de votre
                        travail
                      </p>
                    </div>

                    {/* Images Section */}
                    <div className="border-2 border-gray-200 rounded-lg p-6 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">
                          Images (jusqu'à 3)
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formData.images?.length || 0}/3
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">
                        Faites-vous remarquer par les bons acheteurs avec des
                        exemples visuels de vos services.
                      </p>

                      {/* Image Upload Area */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50">
                        <Upload
                          className="mx-auto text-gray-400 mb-3"
                          size={48}
                        />
                        <p className="text-gray-700 font-medium mb-1">
                          Glisser-déposer une photo ou parcourir
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG jusqu'à 5MB
                        </p>
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (
                              files.length + (formData.images?.length || 0) >
                              3
                            ) {
                              alert("Maximum 3 images autorisées");
                              return;
                            }
                            // Simuler l'upload des images
                            const newImages = files.map((file) => ({
                              id: Math.random().toString(36).substr(2, 9),
                              name: file.name,
                              url: URL.createObjectURL(file),
                              type: "image",
                            }));
                            setFormData({
                              ...formData,
                              images: [
                                ...(formData.images || []),
                                ...newImages,
                              ],
                            });
                          }}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium"
                        >
                          Parcourir les fichiers
                        </label>
                      </div>

                      {/* Preview Images */}
                      {formData.images && formData.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 mt-6">
                          {formData.images.map((image, index) => (
                            <div key={image.id} className="relative group">
                              <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    images: formData.images.filter(
                                      (_, i) => i !== index
                                    ),
                                  });
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Video Section */}
                    <div className="border-2 border-gray-200 rounded-lg p-6 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">
                          Vidéo (une seule)
                        </h3>
                        {formData.videoUrl && (
                          <span className="text-sm text-green-600 font-medium">
                            ✓ Vidéo ajoutée
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mb-4">
                        Attirez l'attention des acheteurs avec une vidéo qui
                        présente votre service.
                        <br />
                        <span className="text-sm text-gray-500">
                          Veuillez choisir une vidéo de moins de 75 secondes et
                          de moins de 50 Mo
                        </span>
                      </p>

                      {/* Video Upload Area */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50">
                        <Upload
                          className="mx-auto text-gray-400 mb-3"
                          size={48}
                        />
                        <p className="text-gray-700 font-medium mb-1">
                          Glisser-déposer une vidéo ou parcourir
                        </p>
                        <p className="text-sm text-gray-500">
                          MP4 jusqu'à 50MB, max 75 secondes
                        </p>
                        <input
                          type="file"
                          accept="video/mp4"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 50 * 1024 * 1024) {
                                alert("La vidéo doit faire moins de 50MB");
                                return;
                              }
                              // Simuler l'upload de la vidéo
                              setFormData({
                                ...formData,
                                videoUrl: URL.createObjectURL(file),
                              });
                            }
                          }}
                          className="hidden"
                          id="video-upload"
                        />
                        <label
                          htmlFor="video-upload"
                          className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium"
                        >
                          Parcourir les fichiers
                        </label>
                      </div>

                      {/* Video Preview */}
                      {formData.videoUrl && (
                        <div className="mt-6">
                          <div className="relative">
                            <video
                              src={formData.videoUrl}
                              controls
                              className="w-full rounded-lg"
                            />
                            <button
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  videoUrl: "",
                                });
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Documents Section */}
                    <div className="border-2 border-gray-200 rounded-lg p-6 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">
                          Documents (jusqu'à 2)
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formData.documents?.length || 0}/2
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">
                        Montrez certains des meilleurs travaux que vous avez
                        créés dans un document (PDF uniquement).
                      </p>

                      {/* Documents Upload Area */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50">
                        <Upload
                          className="mx-auto text-gray-400 mb-3"
                          size={48}
                        />
                        <p className="text-gray-700 font-medium mb-1">
                          Glisser-déposer un document ou parcourir
                        </p>
                        <p className="text-sm text-gray-500">
                          PDF uniquement, jusqu'à 10MB
                        </p>
                        <input
                          type="file"
                          accept=".pdf"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (
                              files.length + (formData.documents?.length || 0) >
                              2
                            ) {
                              alert("Maximum 2 documents autorisés");
                              return;
                            }
                            // Simuler l'upload des documents
                            const newDocuments = files.map((file) => ({
                              id: Math.random().toString(36).substr(2, 9),
                              name: file.name,
                              type: "pdf",
                              size:
                                (file.size / (1024 * 1024)).toFixed(1) + "MB",
                            }));
                            setFormData({
                              ...formData,
                              documents: [
                                ...(formData.documents || []),
                                ...newDocuments,
                              ],
                            });
                          }}
                          className="hidden"
                          id="document-upload"
                        />
                        <label
                          htmlFor="document-upload"
                          className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium"
                        >
                          Parcourir les fichiers
                        </label>
                      </div>

                      {/* Documents List */}
                      {formData.documents && formData.documents.length > 0 && (
                        <div className="space-y-3 mt-6">
                          {formData.documents.map((doc, index) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                  <span className="text-red-600 font-bold text-sm">
                                    PDF
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {doc.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {doc.size}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    documents: formData.documents.filter(
                                      (_, i) => i !== index
                                    ),
                                  });
                                }}
                                className="text-red-600 hover:text-red-700 p-2"
                              >
                                <X size={20} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tips Card */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
                      <div className="flex">
                        <Lightbulb
                          className="text-yellow-600 mr-3 flex-shrink-0 mt-0.5"
                          size={20}
                        />
                        <div>
                          <p className="text-sm font-medium text-yellow-900">
                            Conseil pour une galerie efficace
                          </p>
                          <p className="text-sm text-yellow-700 mt-1">
                            • Utilisez des images de haute qualité qui montrent
                            vos meilleurs travaux
                            <br />
                            • La première image sera utilisée comme miniature de
                            votre service
                            <br />
                            • Une vidéo de présentation peut augmenter votre
                            taux de conversion de 30%
                            <br />• Les documents PDF sont parfaits pour montrer
                            des études de cas détaillées
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 7: Récapitulatif et Publication */}
                {currentStep === 7 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        7. Récapitulatif et Publication
                      </h2>
                      <p className="text-gray-600">
                        Vérifiez les informations de votre service avant de le
                        publier
                      </p>
                    </div>

                    {/* Success Alert */}
                    <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                      <div className="flex">
                        <Check
                          className="text-green-600 mr-3 flex-shrink-0 mt-0.5"
                          size={20}
                        />
                        <div>
                          <p className="text-sm font-medium text-green-900">
                            Félicitations ! Votre service est prêt à être publié
                          </p>
                          <p className="text-sm text-green-700 mt-1">
                            Vérifiez une dernière fois toutes les informations
                            avant de publier votre service.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Service Summary */}
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">
                        Récapitulatif du Service
                      </h3>

                      <div className="space-y-6">
                        {/* Aperçu */}
                        <div className="border-b border-gray-200 pb-4">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-2">
                              1
                            </span>
                            Aperçu du Service
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Titre
                              </p>
                              <p className="text-gray-900">
                                {formData.title || "Non renseigné"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Catégorie
                              </p>
                              <p className="text-gray-900">
                                {formData.category
                                  ? categoriesData[formData.category]?.label
                                  : "Non renseigné"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Sous-catégorie
                              </p>
                              <p className="text-gray-900">
                                {formData.subcategory
                                  ? categoriesData[formData.category]
                                      ?.subcategories[formData.subcategory]
                                      ?.label
                                  : "Non renseigné"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Tags
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {formData.tags.length > 0 ? (
                                  formData.tags.map((tag, index) => (
                                    <span
                                      key={index}
                                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                                    >
                                      {tag}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-500 text-sm">
                                    Aucun tag
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tarification */}
                        <div className="border-b border-gray-200 pb-4">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-2">
                              2
                            </span>
                            Tarification et Forfaits
                          </h4>
                          <div className="ml-8 space-y-4">
                            {formData.packages.map((pkg, index) => (
                              <div
                                key={index}
                                className="border border-gray-200 rounded-lg p-4"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-semibold text-gray-900">
                                    {pkg.name}
                                  </h5>
                                  <span className="text-lg font-bold text-green-600">
                                    {pkg.price ? `$${pkg.price}` : "Non défini"}
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-600">
                                      Délai:
                                    </span>
                                    <span className="ml-1 text-gray-900">
                                      {pkg.deliveryDays
                                        ? `${pkg.deliveryDays} jours`
                                        : "Non défini"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">
                                      Révisions:
                                    </span>
                                    <span className="ml-1 text-gray-900">
                                      {pkg.revisions || "Non défini"}
                                    </span>
                                  </div>
                                </div>
                                {pkg.description && (
                                  <p className="text-sm text-gray-700 mt-2">
                                    {pkg.description}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Description */}
                        <div className="border-b border-gray-200 pb-4">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-2">
                              3
                            </span>
                            Description
                          </h4>
                          <div className="ml-8">
                            {formData.description ? (
                              <div
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                  __html: formData.description,
                                }}
                              />
                            ) : (
                              <p className="text-gray-500">
                                Aucune description fournie
                              </p>
                            )}
                          </div>
                        </div>

                        {/* FAQ */}
                        <div className="border-b border-gray-200 pb-4">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-2">
                              4
                            </span>
                            FAQ ({formData.faq?.length || 0})
                          </h4>
                          <div className="ml-8 space-y-3">
                            {formData.faq && formData.faq.length > 0 ? (
                              formData.faq.slice(0, 3).map((item, index) => (
                                <div
                                  key={index}
                                  className="border border-gray-200 rounded-lg p-3"
                                >
                                  <p className="font-semibold text-gray-900">
                                    {item.question}
                                  </p>
                                  <p className="text-sm text-gray-700 mt-1">
                                    {item.answer}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500">
                                Aucune FAQ ajoutée
                              </p>
                            )}
                            {formData.faq && formData.faq.length > 3 && (
                              <p className="text-sm text-gray-600">
                                + {formData.faq.length - 3} autres questions
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Exigences */}
                        <div className="border-b border-gray-200 pb-4">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-2">
                              5
                            </span>
                            Exigences ({formData.requirements?.length || 0})
                          </h4>
                          <div className="ml-8 space-y-2">
                            {formData.requirements &&
                            formData.requirements.length > 0 ? (
                              formData.requirements.map((req, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <span className="text-gray-900">
                                    {req.question}
                                  </span>
                                  {req.required && (
                                    <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                                      Obligatoire
                                    </span>
                                  )}
                                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                                    {req.type === "text"
                                      ? "Texte"
                                      : req.type === "choice"
                                      ? "Choix"
                                      : "Fichier"}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500">
                                Aucune exigence ajoutée
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Galerie */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-2">
                              6
                            </span>
                            Galerie
                          </h4>
                          <div className="ml-8">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-600">
                                  Images
                                </p>
                                <p className="text-gray-900">
                                  {formData.images?.length || 0}/3
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600">
                                  Vidéo
                                </p>
                                <p className="text-gray-900">
                                  {formData.videoUrl
                                    ? "✓ Ajoutée"
                                    : "Non ajoutée"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600">
                                  Documents
                                </p>
                                <p className="text-gray-900">
                                  {formData.documents?.length || 0}/2
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Final Actions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-bold text-gray-900 mb-3">
                        Prêt à publier ?
                      </h4>
                      <p className="text-sm text-gray-700 mb-4">
                        Une fois publié, votre service sera visible par tous les
                        acheteurs. Vous pourrez toujours le modifier
                        ultérieurement.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => setCurrentStep(6)}
                          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center"
                        >
                          <ChevronLeft size={20} className="mr-2" />
                          Retour à la galerie
                        </button>

                        <button
                          onClick={() => handlePublishService()}
                          className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold flex items-center justify-center text-lg"
                        >
                          <Save size={24} className="mr-2" />
                          Publier le service
                        </button>
                      </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
                      <div className="flex">
                        <AlertCircle
                          className="text-yellow-600 mr-3 flex-shrink-0 mt-0.5"
                          size={20}
                        />
                        <div>
                          <p className="text-sm font-medium text-yellow-900">
                            Important à savoir
                          </p>
                          <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside space-y-1">
                            <li>
                              Votre service sera soumis à modération avant
                              publication
                            </li>
                            <li>
                              Le temps de modération peut prendre jusqu'à 24
                              heures
                            </li>
                            <li>
                              Vous recevrez une notification une fois votre
                              service approuvé
                            </li>
                            <li>
                              Vous pouvez modifier votre service à tout moment
                              après publication
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center"
                  >
                    <ChevronLeft size={20} className="mr-1" />
                    Précédent
                  </button>

                  {/* Dans la section Navigation Buttons, remplacer l'ancien bouton Publier par : */}
                  {currentStep === steps.length ? (
                    <button
                      onClick={handlePublishService}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold flex items-center"
                    >
                      <Save size={20} className="mr-2" />
                      Publier le service
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold flex items-center"
                    >
                      Suivant
                      <ChevronRight size={20} className="ml-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Help & Guide */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Progress Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-3">Progression</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Complété</span>
                        <span className="font-bold text-gray-900">
                          {Math.round((currentStep / steps.length) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${(currentStep / steps.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Étape {currentStep} sur {steps.length}
                    </p>
                  </div>
                </div>
                {/* Video Guide */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="relative h-48 bg-gray-900 group cursor-pointer">
                    <img
                      src={currentGuide.thumbnail}
                      alt={currentGuide.title}
                      className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="text-blue-600 ml-1" size={28} />
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium">
                      {currentGuide.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2">
                      📹 {currentGuide.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Regardez ce tutoriel pour comprendre comment remplir cette
                      étape efficacement.
                    </p>
                  </div>
                </div>

                {/* Tips Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-5">
                  <div className="flex items-center mb-3">
                    <Lightbulb className="text-yellow-600 mr-2" size={24} />
                    <h3 className="font-bold text-gray-900">Conseils</h3>
                  </div>
                  <ul className="space-y-3">
                    {currentGuide.tips.map((tip, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="text-green-600 mr-2 flex-shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServiceManagement;
