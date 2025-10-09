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
  });

  const steps = [
    { number: 1, title: "Aperçu", icon: "📋" },
    { number: 2, title: "Tarification", icon: "💰" },
    { number: 3, title: "Description", icon: "📝" },
    { number: 4, title: "FAQ", icon: "❓" },
    { number: 5, title: "Exigences", icon: "📑" },
    { number: 6, title: "Galerie", icon: "🖼️" },
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

                    <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                      <div className="flex">
                        <Check
                          className="text-green-600 mr-3 flex-shrink-0 mt-0.5"
                          size={20}
                        />
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

                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Description complète *
                        <span className="text-gray-500 font-normal ml-2">
                          (min 120 caractères)
                        </span>
                      </label>
                      <textarea
                        rows={15}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Présentez-vous et décrivez votre service en détail...
              
              Exemple:
              Bonjour ! Je suis [Votre Nom], [votre expertise] avec [X années] d'expérience.
              
              🎯 Ce que je vais faire pour vous:
              - Point 1
              - Point 2
              - Point 3
              
              ✅ Mon processus:
              1. Étape 1
              2. Étape 2
              3. Étape 3
              
              🌟 Pourquoi me choisir:
              - Avantage 1
              - Avantage 2
              - Garantie satisfaction"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          Une description détaillée augmente vos chances de
                          vente
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            formData.description.length < 120
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {formData.description.length} caractères
                        </span>
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

                  {currentStep < steps.length ? (
                    <button
                      onClick={handleNext}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold flex items-center"
                    >
                      Suivant
                      <ChevronRight size={20} className="ml-1" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        console.log("Service Data:", formData);
                        alert("Service créé avec succès !");
                      }}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold flex items-center"
                    >
                      <Save size={20} className="mr-2" />
                      Publier le service
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
