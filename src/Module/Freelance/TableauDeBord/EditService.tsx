"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Lightbulb,
  Info,
  Upload,
  X,
  Plus,
  Save,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Play,
} from "lucide-react";
import { useFreelances } from "@/Context/Freelance/FreelanceContext";
import {
  useServices,
  Package,
  FAQ,
  Requirement,
  ServiceImage,
  ServiceDocument,
} from "@/Context/Freelance/ContextService";
import {
  categoriesData,
  getCategoriesByOccupations,
  serviceTags,
} from "@/Component/Data/Service/Service";
import MarkdownEditor from "@/Component/Textarea/Textarea";

// ==================== INTERFACES ====================
interface LocalFormData {
  title: string;
  category: string;
  subcategory: string;
  metadata: Record<string, any>;
  tags: string[];
  packages: Package[];
  description: string;
  faq: FAQ[];
  requirements: Requirement[];
  images: ServiceImage[];
  videoUrl: string;
  documents: ServiceDocument[];
}
interface VideoGuide {
  title: string;
  duration: string;
  thumbnail: string;
  tips: string[];
}

interface VideoGuides {
  [key: number]: VideoGuide;
}

// ==================== COMPOSANT ====================
const EditService: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("id")?.split("&")[0];

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoadingService, setIsLoadingService] = useState<boolean>(true);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const FREELANCE_ID: any = searchParams.get("id")?.split("&")[1];

  const { getFreelanceById } = useFreelances();
  const {
    getServiceById,
    modifierService,
    uploadImage,
    deleteImage,
    uploadDocument,
    deleteDocument,
    uploadVideo,
    deleteVideo,
    isUploadingImage,
    isUploadingDocument,
    isUploadingVideo,
    isCompressingVideo,
    videoCompressionProgress,
    videoUploadProgress,
    videoUploadStep,
    error: contextError, // Ajouter cette ligne
  } = useServices();

  const freelance = getFreelanceById(FREELANCE_ID);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPath, setVideoPath] = useState<string>("");
  const [compressionStats, setCompressionStats] = useState<any>(null);

  const { selectedTags, addTag, removeTag } = serviceTags.useTagSelection(
    [],
    5
  );
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const { searchTerm, setSearchTerm, suggestedTags } =
    serviceTags.useTagSuggestions(selectedTags);

  const userCategories = useMemo(() => {
    if (!freelance?.occupations || freelance.occupations.length === 0) {
      return categoriesData;
    }
    const filtered = getCategoriesByOccupations(freelance.occupations);
    return Object.keys(filtered).length > 0 ? filtered : categoriesData;
  }, [freelance?.occupations]);

  const [formData, setFormData] = useState<LocalFormData>({
    title: "",
    category: "",
    subcategory: "",
    metadata: {},
    tags: [],
    packages: [],
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
    { number: 7, title: "Aperçu", icon: "👁️" },
  ];

  // ==================== CHARGEMENT DU SERVICE ====================
  useEffect(() => {
    // Ne charger qu'une seule fois
    if (isDataLoaded) return;

    const loadService = async () => {
      if (!serviceId) {
        alert("⚠️ Aucun ID de service fourni");
        router.push("/TableauDeBord");
        return;
      }

      setIsLoadingService(true);

      try {
        const service = getServiceById(serviceId);

        if (!service) {
          alert("⚠️ Service introuvable");
          router.push("/TableauDeBord");
          return;
        }

        // Pré-remplir le formulaire
        setFormData({
          title: service.title || "",
          category: service.category || "",
          subcategory: service.subcategory || "",
          metadata: service.metadata || {},
          tags: service.tags || [],
          packages: service.packages || [],
          description: service.description || "",
          faq: service.faq || [],
          requirements: service.requirements || [],
          images: service.images || [],
          videoUrl: service.video_url || "",
          documents: service.documents || [],
        });

        // Pré-remplir les tags directement ici
        if (service.tags && service.tags.length > 0) {
          service.tags.forEach((tag) => {
            if (!selectedTags.includes(tag)) {
              addTag(tag);
            }
          });
        }

        if (service.video_path) {
          setVideoPath(service.video_path);
        }

        setIsDataLoaded(true);
        setIsLoadingService(false);
      } catch (error) {
        console.error("Erreur:", error);
        alert("⚠️ Erreur lors du chargement du service");
        router.push("/TableauDeBord");
      }
    };

    loadService();
  }, [serviceId, isDataLoaded, router, getServiceById, selectedTags, addTag]); // Dépendances minimales

  // ==================== VALIDATION ====================
  const validateStep = (
    stepNumber: number
  ): { isValid: boolean; message: string } => {
    switch (stepNumber) {
      case 1:
        if (!formData.title.trim())
          return { isValid: false, message: "Le titre est obligatoire" };
        if (formData.title.length < 15)
          return {
            isValid: false,
            message: "Le titre doit contenir au moins 15 caractères",
          };
        if (!formData.category)
          return {
            isValid: false,
            message: "Veuillez sélectionner une catégorie",
          };
        if (!formData.subcategory)
          return {
            isValid: false,
            message: "Veuillez sélectionner une sous-catégorie",
          };
        return { isValid: true, message: "" };

      case 2:
        if (formData.packages.length === 0)
          return { isValid: false, message: "Ajoutez au moins un forfait" };

        for (const pkg of formData.packages) {
          if (!pkg.price || parseFloat(pkg.price) < 5) {
            return {
              isValid: false,
              message: `Le prix du forfait ${pkg.name} doit être d'au moins 5$`,
            };
          }
          if (!pkg.deliveryDays || parseInt(pkg.deliveryDays) < 1) {
            return {
              isValid: false,
              message: `Le délai du forfait ${pkg.name} est obligatoire`,
            };
          }
          if (!pkg.revisions) {
            return {
              isValid: false,
              message: `Les révisions du forfait ${pkg.name} sont obligatoires`,
            };
          }
          if (!pkg.description.trim() || pkg.description.length < 20) {
            return {
              isValid: false,
              message: `La description du forfait ${pkg.name} doit contenir au moins 20 caractères`,
            };
          }
        }

        // Validation prix croissants
        if (formData.packages.length >= 2) {
          const basicPrice = parseFloat(formData.packages[0].price);
          const standardPrice = parseFloat(formData.packages[1].price);
          if (standardPrice <= basicPrice) {
            return {
              isValid: false,
              message: "Le prix du Standard doit être supérieur au Basic",
            };
          }
        }
        if (formData.packages.length === 3) {
          const standardPrice = parseFloat(formData.packages[1].price);
          const premiumPrice = parseFloat(formData.packages[2].price);
          if (premiumPrice <= standardPrice) {
            return {
              isValid: false,
              message: "Le prix du Premium doit être supérieur au Standard",
            };
          }
        }
        return { isValid: true, message: "" };

      case 3:
        if (!formData.description.trim()) {
          return { isValid: false, message: "La description est obligatoire" };
        }
        const textLength = formData.description.replace(/<[^>]*>/g, "").length;
        if (textLength < 120) {
          return {
            isValid: false,
            message: `La description doit contenir au moins 120 caractères (${textLength}/120)`,
          };
        }
        return { isValid: true, message: "" };

      default:
        return { isValid: true, message: "" };
    }
  };

  const canProceedToNextStep = (): boolean => {
    const validation = validateStep(currentStep);
    return validation.isValid;
  };

  // ==================== HANDLERS ====================
  const getCurrentMetadata = () => {
    if (!formData.category || !formData.subcategory) return [];
    const category =
      userCategories[formData.category as keyof typeof userCategories];
    if (!category) return [];
    const subcategory = category.subcategories[
      formData.subcategory as keyof typeof category.subcategories
    ] as {
      metadata?: any[];
    };
    return subcategory?.metadata || [];
  };

  const handleCategoryChange = (categoryKey: string): void => {
    setFormData({
      ...formData,
      category: categoryKey,
      subcategory: "",
      metadata: {},
    });
  };

  const handleSubcategoryChange = (subcategoryKey: string): void => {
    setFormData({
      ...formData,
      subcategory: subcategoryKey,
      metadata: {},
    });
  };

  const handleMetadataChange = (metadataId: string, value: any): void => {
    setFormData({
      ...formData,
      metadata: {
        ...formData.metadata,
        [metadataId]: value,
      },
    });
  };

  const handleNext = async (): Promise<void> => {
    const validation = validateStep(currentStep);
    if (!validation.isValid) {
      alert(`⚠️ ${validation.message}`);
      return;
    }

    if (!serviceId) {
      alert("⚠️ ID du service introuvable");
      return;
    }

    try {
      setIsSaving(true);

      if (currentStep === 1) {
        await modifierService(serviceId, {
          title: formData.title,
          category: formData.category,
          subcategory: formData.subcategory,
          metadata: formData.metadata,
          tags: selectedTags,
        });
      } else if (currentStep === 2) {
        await modifierService(serviceId, { packages: formData.packages });
      } else if (currentStep === 3) {
        await modifierService(serviceId, { description: formData.description });
      } else if (currentStep === 4) {
        await modifierService(serviceId, {
          faq: formData.faq.map(({ isEditing, isOpen, ...faq }) => faq),
        });
      } else if (currentStep === 5) {
        await modifierService(serviceId, {
          requirements: formData.requirements.map(
            ({ isEditing, isOpen, ...req }) => req
          ),
        });
      } else if (currentStep === 6) {
        await modifierService(serviceId, {
          images: formData.images,
          videoUrl: formData.videoUrl,
          videoPath: videoPath,
          documents: formData.documents,
        });
      }

      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Erreur:", error);
      alert(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrevious = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveAndExit = async (): Promise<void> => {
    try {
      setIsSaving(true);
      if (!serviceId) {
        alert("Erreur : Service introuvable");
        return;
      }

      await modifierService(serviceId, {});
      alert("✅ Service modifié avec succès !");
      router.push("/TableauDeBord");
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue");
    } finally {
      setIsSaving(false);
    }
  };

  // ==================== UPLOAD HANDLERS ====================
  const handleImageUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    if (fileArray.length + formData.images.length > 3) {
      alert("Maximum 3 images autorisées");
      return;
    }
    for (const file of fileArray) {
      const result = await uploadImage(file, FREELANCE_ID);
      if (result) {
        setFormData({ ...formData, images: [...formData.images, result] });
      }
    }
  };

  const handleImageDelete = async (index: number) => {
    const image = formData.images[index];
    if (image.path) {
      const success = await deleteImage(image.path);
      if (success) {
        setFormData({
          ...formData,
          images: formData.images.filter((_, i) => i !== index),
        });
      }
    }
  };

  const handleDocumentUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    if (fileArray.length + formData.documents.length > 2) {
      alert("Maximum 2 documents");
      return;
    }
    for (const file of fileArray) {
      const result = await uploadDocument(file, FREELANCE_ID);
      if (result) {
        setFormData({
          ...formData,
          documents: [...formData.documents, result],
        });
      }
    }
  };

  const handleDocumentDelete = async (index: number) => {
    const document = formData.documents[index];
    if (document.path) {
      const success = await deleteDocument(document.path);
      if (success) {
        setFormData({
          ...formData,
          documents: formData.documents.filter((_, i) => i !== index),
        });
      }
    }
  };

  const handleVideoUpload = async (file: File) => {
    if (videoPath) await deleteVideo(videoPath);
    const result = await uploadVideo(file, FREELANCE_ID);
    if (result) {
      setFormData({ ...formData, videoUrl: result.url });
      setVideoPath(result.path);
      setVideoFile(file);
      setCompressionStats({
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        compressionRate: result.compressionRate,
      });
    }
  };

  const handleVideoDelete = async () => {
    if (videoPath) {
      const success = await deleteVideo(videoPath);
      if (success) {
        setFormData({ ...formData, videoUrl: "" });
        setVideoPath("");
        setVideoFile(null);
        setCompressionStats(null);
      }
    }
  };

  const formatSize = (bytes: number): string => {
    return (bytes / (1024 * 1024)).toFixed(2);
  };

  const videoGuides: VideoGuides = {
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

  const currentGuide: VideoGuide = videoGuides[currentStep] || videoGuides[1];

  // ==================== LOADING STATE ====================
  if (isLoadingService) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="animate-spin mx-auto mb-4 text-blue-600"
            size={48}
          />
          <p className="text-gray-600 text-lg">Chargement du service...</p>
        </div>
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER avec bouton retour */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/TableauDeBord")}
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <ArrowLeft size={20} className="mr-1" />
                Retour
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Modifier le service
              </h1>
            </div>
            <button
              onClick={() => router.push("/TableauDeBord")}
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <X size={20} className="mr-1" />
              Annuler
            </button>
          </div>

          {/* Steps Progress */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => {
                      if (step.number <= currentStep) {
                        setCurrentStep(step.number);
                      }
                    }}
                    disabled={step.number > currentStep}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-all ${
                      step.number < currentStep
                        ? "bg-green-600 text-white"
                        : step.number === currentStep
                        ? "bg-blue-600 text-white ring-4 ring-blue-200"
                        : "bg-gray-200 text-gray-600"
                    } ${
                      step.number > currentStep
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
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
                      step.number < currentStep ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
              {/* ==================== STEP 1: APERÇU ==================== */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      1. Aperçu du Service
                    </h2>
                    <p className="text-gray-600">
                      Créez un titre accrocheur et choisissez la bonne catégorie
                    </p>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                    <div className="flex">
                      <Info
                        className="text-blue-600 mr-3 shrink-0 mt-0.5"
                        size={20}
                      />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Conseil important
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          Un bon titre contient des mots-clés que vos clients
                          recherchent. Commencez par "Je vais..." pour être plus
                          personnel.
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
                        {formData.title.length < 15 &&
                          formData.title.length > 0 && (
                            <span className="text-red-600 font-medium">
                              Minimum 15 caractères requis
                            </span>
                          )}
                        {formData.title.length >= 15 &&
                          "Utilisez des mots-clés pertinents pour le référencement"}
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
                      {Object.entries(userCategories).map(([key, cat]) => (
                        <option key={key} value={key}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

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
                        {formData.category &&
                          Object.entries(
                            userCategories[
                              formData.category as keyof typeof userCategories
                            ]?.subcategories || {}
                          ).map(([key, subcat]: [string, any]) => (
                            <option key={key} value={key}>
                              {subcat.label}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

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
                          Ces informations nous aident à mieux catégoriser votre
                          service
                        </p>

                        <div className="space-y-4">
                          {getCurrentMetadata().map((meta: any) => (
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
                                  {meta.options.map((opt: any) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              )}

                              {meta.type === "multiselect" && (
                                <div className="border-2 border-gray-300 rounded-lg p-4 space-y-2 max-h-64 overflow-y-auto">
                                  {meta.options.map((opt: any) => (
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
                                                (v: string) => v !== opt.value
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

                  <div className="border-t-2 border-gray-200 pt-6">
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Tags de recherche
                      <span className="text-gray-500 font-normal ml-2">
                        (max 5 tags)
                      </span>
                    </label>

                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedTags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                              aria-label={`Retirer ${tag}`}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() =>
                          setTimeout(() => setShowSuggestions(false), 200)
                        }
                        placeholder="Rechercher un tag..."
                        disabled={selectedTags.length >= 5}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />

                      {showSuggestions &&
                        suggestedTags.length > 0 &&
                        selectedTags.length < 5 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {suggestedTags.map((tag) => (
                              <button
                                key={tag}
                                onClick={() => addTag(tag)}
                                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-sm text-gray-700"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      <span
                        className={
                          selectedTags.length >= 5
                            ? "text-orange-600 font-medium"
                            : ""
                        }
                      >
                        {selectedTags.length} / 5 tags
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== STEP 2: TARIFICATION ==================== */}
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
                        className="text-yellow-600 mr-3 shrink-0 mt-0.5"
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
                              newPackages[index].deliveryDays = e.target.value;
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
                      {/* Highlights */}
                      <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Points clés (un par ligne)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Ex: 20 photos&#10;Éclairage standard"
                          value={(pkg.highlights || []).join("\n")}
                          onChange={(e) => {
                            const newPackages = [...formData.packages];
                            newPackages[index].highlights = e.target.value
                              .split("\n")
                              .filter((h) => h.trim());
                            setFormData({ ...formData, packages: newPackages });
                          }}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      {/* Badge Popular */}
                      <div className="mb-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={pkg.popular || false}
                            onChange={(e) => {
                              const newPackages = [...formData.packages];
                              newPackages[index].popular = e.target.checked;
                              setFormData({
                                ...formData,
                                packages: newPackages,
                              });
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            Marquer comme populaire
                          </span>
                        </label>
                      </div>
                      {/* Features */}
                      <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Caractéristiques détaillées
                        </label>
                        <div className="space-y-2 bg-gray-100 p-3 rounded">
                          {(pkg.features || []).map((feature, fIdx) => (
                            <div
                              key={feature.id}
                              className="flex gap-2 text-sm"
                            >
                              <span>{feature.icon || "•"}</span>
                              <span className="text-gray-700">
                                {feature.label}
                              </span>
                              <span className="text-gray-500">
                                ({feature.value}
                                {feature.unit ? ` ${feature.unit}` : ""})
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Les features se remplissent automatiquement selon le
                          service
                        </p>
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
                            setFormData({ ...formData, packages: newPackages });
                          }}
                          placeholder="Décrivez ce qui est inclus dans ce forfait..."
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        {pkg.description && pkg.description.length < 20 && (
                          <p className="text-xs text-red-600 mt-1">
                            Minimum 20 caractères requis (
                            {pkg.description.length}/20)
                          </p>
                        )}
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
                              name: names[formData.packages.length] as
                                | "Basic"
                                | "Standard"
                                | "Premium",
                              price: "",
                              deliveryDays: "",
                              revisions: "",
                              description: "",
                              features: [],
                              highlights: [],
                              popular: false,
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

              {/* ==================== STEP 3: DESCRIPTION ==================== */}
              {currentStep === 3 && (
                <div>
                  <MarkdownEditor
                    value={formData.description}
                    onChange={(value) =>
                      setFormData({ ...formData, description: value })
                    }
                    maxLength={1200}
                    showTips={true}
                    required={true}
                  />
                </div>
              )}

              {/* ==================== STEP 4: FAQ ==================== */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        4. Frequently Asked Questions
                      </h2>
                      <p className="text-gray-600">
                        Add Questions & Answers for Your Buyers.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
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

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                    <div className="flex">
                      <svg
                        className="w-5 h-5 text-blue-600 mr-3 shrink-0 mt-0.5"
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
                        </p>
                      </div>
                    </div>
                  </div>

                  {formData.faq && formData.faq.length > 0 ? (
                    <div className="space-y-3">
                      {formData.faq.map((item, index) => (
                        <div
                          key={index}
                          className="border-2 border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors"
                        >
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
                                  className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${
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

                          {item.isOpen && (
                            <div className="border-t border-gray-200">
                              {item.isEditing ? (
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
                                          newFaq[index].answer = e.target.value;
                                          setFormData({
                                            ...formData,
                                            faq: newFaq,
                                          });
                                        }}
                                        placeholder="Votre réponse détaillée..."
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                                      />
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!item.question && !item.answer) {
                                            setFormData({
                                              ...formData,
                                              faq: formData.faq.filter(
                                                (_, i) => i !== index
                                              ),
                                            });
                                          } else {
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
                        Commencez par ajouter votre première question fréquente
                      </p>
                    </div>
                  )}

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
                </div>
              )}

              {/* ==================== STEP 5: EXIGENCES ==================== */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      5. VOS QUESTIONS
                    </h2>
                    <p className="text-gray-600">
                      C'est ici que vous pouvez demander tous les détails
                      nécessaires pour finaliser la commande.
                    </p>
                  </div>

                  {formData.requirements &&
                    formData.requirements.length > 0 && (
                      <div className="space-y-3">
                        {formData.requirements.map((req, index) => (
                          <div
                            key={index}
                            className="border-2 border-gray-200 rounded-lg bg-white"
                          >
                            {!req.isEditing ? (
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
                                        newReqs[index].type = e.target
                                          .value as Requirement["type"];
                                        if (e.target.value !== "choice") {
                                          delete newReqs[index].options;
                                          delete newReqs[index].multipleChoice;
                                        } else {
                                          newReqs[index].options = [""];
                                          newReqs[index].multipleChoice = false;
                                        }
                                        setFormData({
                                          ...formData,
                                          requirements: newReqs,
                                        });
                                      }}
                                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                      <option value="text">Texte libre</option>
                                      <option value="choice">
                                        Choix multiple
                                      </option>
                                      <option value="file">Attachement</option>
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
                                              if (newReqs[index].options) {
                                                newReqs[index].options![
                                                  optIdx
                                                ] = e.target.value;
                                              }
                                              setFormData({
                                                ...formData,
                                                requirements: newReqs,
                                              });
                                            }}
                                            placeholder={`Option ${optIdx + 1}`}
                                            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newReqs = [
                                                ...formData.requirements,
                                              ];
                                              newReqs[index].options = newReqs[
                                                index
                                              ].options?.filter(
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
                                          if (!newReqs[index].options) {
                                            newReqs[index].options = [];
                                          }
                                          newReqs[index].options!.push("");
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
                                          alert("Veuillez saisir une question");
                                          return;
                                        }
                                        if (
                                          req.type === "choice" &&
                                          (!req.options ||
                                            req.options.filter((o) => o.trim())
                                              .length === 0)
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
                </div>
              )}

              {/* ==================== STEP 6: GALERIE ==================== */}
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
                        accept="image/png, image/jpeg, image/webp"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            handleImageUpload(e.target.files);
                          }
                        }}
                        className="hidden"
                        id="image-upload"
                        disabled={isUploadingImage}
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium"
                      >
                        Parcourir les fichiers
                      </label>
                    </div>

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
                              onClick={() => handleImageDelete(index)}
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
                        Vidéo avec compression automatique
                      </h3>
                      {formData.videoUrl && (
                        <span className="text-sm text-green-600 font-medium flex items-center">
                          <Check size={16} className="mr-1" />
                          Vidéo ajoutée
                        </span>
                      )}
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mb-4">
                      <div className="flex">
                        <Info
                          className="text-blue-600 mr-3 shrink-0 mt-0.5"
                          size={20}
                        />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Compression intelligente activée
                          </p>
                          <p className="text-sm text-blue-700 mt-1">
                            Votre vidéo sera automatiquement compressée de
                            60-80% sans perte de qualité visible.
                          </p>
                        </div>
                      </div>
                    </div>

                    {!formData.videoUrl && !isUploadingVideo && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-gray-50">
                        <Upload
                          className="mx-auto text-gray-400 mb-3"
                          size={48}
                        />
                        <p className="text-gray-700 font-medium mb-1">
                          Glisser-déposer une vidéo ou parcourir
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          MP4, MOV, AVI, WebM jusqu'à 200MB
                        </p>
                        <p className="text-xs text-blue-600 font-medium">
                          ⚡ Compression automatique 60-80%
                        </p>

                        <input
                          type="file"
                          accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              await handleVideoUpload(file);
                            }
                          }}
                          className="hidden"
                          id="video-upload"
                          disabled={isUploadingVideo}
                        />

                        <label
                          htmlFor="video-upload"
                          className="inline-block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer font-medium"
                        >
                          Sélectionner une vidéo
                        </label>
                      </div>
                    )}

                    {isUploadingVideo && (
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            {videoUploadStep === "validating" && (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                                <span className="font-semibold text-blue-900">
                                  Validation...
                                </span>
                              </>
                            )}
                            {videoUploadStep === "compressing" && (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                                <span className="font-semibold text-blue-900">
                                  Compression en cours...
                                </span>
                              </>
                            )}
                            {videoUploadStep === "uploading" && (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                                <span className="font-semibold text-blue-900">
                                  Upload vers Supabase...
                                </span>
                              </>
                            )}
                            {videoUploadStep === "complete" && (
                              <>
                                <Check
                                  className="text-green-600 mr-3"
                                  size={20}
                                />
                                <span className="font-semibold text-green-900">
                                  Terminé !
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {isCompressingVideo && (
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">
                                Compression (60-80%)
                              </span>
                              <span className="font-bold text-blue-600">
                                {videoCompressionProgress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-linear-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                                style={{
                                  width: `${videoCompressionProgress}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {!isCompressingVideo && videoUploadProgress > 0 && (
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">
                                Upload vers Supabase
                              </span>
                              <span className="font-bold text-green-600">
                                {videoUploadProgress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-linear-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${videoUploadProgress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {videoFile && (
                          <p className="text-xs text-gray-500 text-center">
                            📹 {videoFile.name} ({formatSize(videoFile.size)}{" "}
                            MB)
                          </p>
                        )}
                      </div>
                    )}

                    {contextError && !isUploadingVideo && (
                      <div className="mt-4 bg-red-50 border-l-4 border-red-600 p-4 rounded">
                        <div className="flex">
                          <AlertCircle
                            className="text-red-600 mr-3 shrink-0"
                            size={20}
                          />
                          <div>
                            <p className="text-sm font-medium text-red-900">
                              Erreur
                            </p>
                            <p className="text-sm text-red-700 mt-1">
                              {contextError}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.videoUrl && !isUploadingVideo && (
                      <div className="space-y-4">
                        {compressionStats && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <Check
                                className="text-green-600 mr-2"
                                size={20}
                              />
                              <h4 className="font-semibold text-green-900">
                                Compression réussie !
                              </h4>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">
                                  Taille originale
                                </p>
                                <p className="font-bold text-gray-900">
                                  {formatSize(compressionStats.originalSize)} MB
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">
                                  Après compression
                                </p>
                                <p className="font-bold text-green-600">
                                  {formatSize(compressionStats.compressedSize)}{" "}
                                  MB
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Réduction</p>
                                <p className="font-bold text-green-600">
                                  {compressionStats.compressionRate.toFixed(0)}%
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="relative rounded-lg overflow-hidden bg-black">
                          <video
                            src={formData.videoUrl}
                            controls
                            className="w-full rounded-lg"
                            controlsList="nodownload"
                            preload="metadata"
                          />
                          <button
                            onClick={handleVideoDelete}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg z-10"
                            title="Supprimer la vidéo"
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
                      Montrez certains des meilleurs travaux que vous avez créés
                      dans un document (PDF uniquement).
                    </p>

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
                          if (e.target.files) {
                            handleDocumentUpload(e.target.files);
                          }
                        }}
                        className="hidden"
                        id="document-upload"
                        disabled={isUploadingDocument}
                      />
                      <label
                        htmlFor="document-upload"
                        className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium"
                      >
                        Parcourir les fichiers
                      </label>
                    </div>

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
                              onClick={() => handleDocumentDelete(index)}
                              className="text-red-600 hover:text-red-700 p-2"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ==================== STEP 7: RÉCAPITULATIF ==================== */}
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

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                    <div className="flex">
                      <Check
                        className="text-green-600 mr-3 shrink-0 mt-0.5"
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

                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Récapitulatif du Service
                    </h3>

                    <div className="space-y-6">
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
                                ? (userCategories as any)[formData.category]
                                    ?.label
                                : "Non renseigné"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Sous-catégorie
                            </p>
                            <p className="text-gray-900">
                              {formData.subcategory && formData.category
                                ? (userCategories as any)[formData.category]
                                    ?.subcategories?.[formData.subcategory]
                                    ?.label || "Non renseigné"
                                : "Non renseigné"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Tags
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedTags.length > 0 ? (
                                selectedTags.map((tag, index) => (
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
                                {pkg.popular && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-bold ml-2">
                                    ⭐ POPULAIRE
                                  </span>
                                )}
                                <span className="text-lg font-bold text-green-600">
                                  {pkg.price ? `${pkg.price}` : "Non défini"}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Délai:</span>
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
                                {pkg.highlights &&
                                  pkg.highlights.length > 0 && (
                                    <div className="text-sm text-gray-600 mt-2">
                                      <p className="font-medium mb-1">
                                        Points clés:
                                      </p>
                                      {pkg.highlights.map((h, idx) => (
                                        <p key={idx}>✓ {h}</p>
                                      ))}
                                    </div>
                                  )}
                                {pkg.features && pkg.features.length > 0 && (
                                  <div className="text-sm text-gray-600 mt-2">
                                    <p className="font-medium mb-1">
                                      Caractéristiques:
                                    </p>
                                    {pkg.features.map((f, idx) => (
                                      <p key={idx}>
                                        {f.icon || "•"} {f.label}: {f.value}
                                        {f.unit ? ` ${f.unit}` : ""}
                                      </p>
                                    ))}
                                  </div>
                                )}
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
                            <p className="text-gray-500">Aucune FAQ ajoutée</p>
                          )}
                          {formData.faq && formData.faq.length > 3 && (
                            <p className="text-sm text-gray-600">
                              + {formData.faq.length - 3} autres questions
                            </p>
                          )}
                        </div>
                      </div>

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

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-3">
                      Prêt à publier ?
                    </h4>
                    <p className="text-sm text-gray-700 mb-4">
                      Une fois publié, votre service sera visible par tous les
                      acheteurs. Vous pourrez toujours le modifier
                      ultérieurement.
                    </p>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
                    <div className="flex">
                      <AlertCircle
                        className="text-yellow-600 mr-3 shrink-0 mt-0.5"
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
            </div>
          </div>
          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
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

              <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-5">
                <div className="flex items-center mb-3">
                  <Lightbulb className="text-yellow-600 mr-2" size={24} />
                  <h3 className="font-bold text-gray-900">Conseils</h3>
                </div>
                <ul className="space-y-3">
                  {currentGuide.tips.map((tip: string, index: number) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="text-green-600 mr-2 shrink-0 mt-0.5">
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
      {/* Navigation Buttons */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1 || isSaving}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center"
            >
              <ChevronLeft size={20} className="mr-1" />
              Précédent
            </button>

            {currentStep === steps.length ? (
              <button
                onClick={handleSaveAndExit}
                disabled={isSaving}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save size={20} className="mr-2" />
                    Sauvegarder et Quitter
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={isSaving || !canProceedToNextStep()}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center ${
                  canProceedToNextStep() && !isSaving
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    Enregistrer et Continuer
                    <ChevronRight size={20} className="ml-1" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditService;
