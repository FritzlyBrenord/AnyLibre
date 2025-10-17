"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Menu,
  X,
  Star,
  Heart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  Globe,
  Play,
  Home,
  Shield,
  RotateCcw,
  MessageCircle,
  Share,
  MoreHorizontal,
  ThumbsUp,
  User,
  Video,
  Image as ImageIcon,
  Info,
  FolderOpen,
  Download,
  Eye,
  FileText,
} from "lucide-react";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import ObtenuDevis from "../ObtenuDevis/ObtenuDevis";
import PoserUneQuestion from "../PoserUneQuestion/PoserUneQuestion";
import OrderOptionsModal from "../Commande/Commande";
import { useFreelances } from "@/Context/Freelance/FreelanceContext";
import { useServices } from "@/Context/Freelance/ContextService";

const ServiceDetailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { services, getServiceById, isLoading } = useServices();
  const { freelances } = useFreelances();

  // Récupérer l'ID depuis les paramètres d'URL
  const serviceId = searchParams.get("id");

  const [selectedPackage, setSelectedPackage] = useState("standard");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Debug: afficher les valeurs pour le diagnostic
  console.log("Service ID from URL:", serviceId);
  console.log("All services:", services);
  console.log("Service found:", serviceId ? getServiceById(serviceId) : null);

  // Récupérer le service actuel
  const service = useMemo(() => {
    if (!serviceId) return null;
    return getServiceById(serviceId);
  }, [serviceId, getServiceById]);

  // Récupérer les informations du freelance
  const freelance = useMemo(() => {
    if (!service) return null;
    return freelances.find((f) => f.id === service.freelance_id);
  }, [service, freelances]);

  // Préparer les médias: vidéo en premier si disponible, puis images
  const medias = useMemo(() => {
    if (!service) return [];

    const mediaArray = [];

    // Ajouter la vidéo en premier si disponible
    if (service.video_url) {
      mediaArray.push({
        type: "video",
        url: service.video_url,
        id: "video",
      });
    }

    // Ajouter les images
    if (service.images && service.images.length > 0) {
      service.images.forEach((image, index) => {
        mediaArray.push({
          type: "image",
          url: image.url,
          id: image.id || `image-${index}`,
        });
      });
    }

    return mediaArray;
  }, [service]);

  const totalMedias = medias.length;
  const currentMedia = medias[currentMediaIndex];
  const isVideo = currentMedia?.type === "video" && showVideo;
  const hasMultipleMedias = totalMedias > 1;

  // Navigation des médias
  const nextMedia = () => {
    if (currentMediaIndex === 0 && service?.video_url && isPlaying) {
      setIsPlaying(false);
    }
    setCurrentMediaIndex((prev) => (prev + 1) % totalMedias);
    if (currentMediaIndex === 0 && service?.video_url) {
      setShowVideo(false);
    }
  };

  const prevMedia = () => {
    if (currentMediaIndex === 0 && service?.video_url && isPlaying) {
      setIsPlaying(false);
    }
    setCurrentMediaIndex((prev) => (prev - 1 + totalMedias) % totalMedias);
    if (
      (currentMediaIndex - 1 + totalMedias) % totalMedias === 0 &&
      service?.video_url
    ) {
      setShowVideo(true);
    }
  };

  const togglePlay = () => {
    if (currentMediaIndex === 0 && service?.video_url) {
      setIsPlaying(!isPlaying);
      setShowVideo(true);
    }
  };

  const switchToImages = () => {
    setShowVideo(false);
    setIsPlaying(false);
    if (currentMediaIndex === 0 && service?.video_url && medias.length > 1) {
      setCurrentMediaIndex(1);
    }
  };

  const switchToVideo = () => {
    setShowVideo(true);
    setCurrentMediaIndex(0);
  };

  // Transformer les données du service pour l'affichage
  const serviceData = useMemo(() => {
    if (!service) return null;

    // Transformer les packages
    const packages = service.packages?.reduce((acc, pkg, index) => {
      const key = index === 0 ? "basic" : index === 1 ? "standard" : "premium";
      acc[key] = {
        name:
          pkg.name ||
          (index === 0 ? "Basique" : index === 1 ? "Standard" : "Premium"),
        price:
          parseFloat(pkg.price) ||
          (index === 0 ? 100 : index === 1 ? 200 : 300),
        deliveryTime: `${pkg.deliveryDays || index + 3} jours`,
        description: pkg.description || `Package ${key} pour ${service.title}`,
        features: pkg.description
          ? pkg.description.split(". ").filter(Boolean)
          : [
              "Service de qualité professionnelle",
              "Livraison dans les délais",
              "Support client dédié",
            ],
        mostPopular: index === 1,
      };
      return acc;
    }, {}) || {
      basic: {
        name: "Basique",
        price: 100,
        deliveryTime: "3 jours",
        description: "Package basique",
        features: [
          "Service essentiel",
          "Livraison standard",
          "Support de base",
        ],
        mostPopular: false,
      },
      standard: {
        name: "Standard",
        price: 200,
        deliveryTime: "4 jours",
        description: "Package standard",
        features: [
          "Service complet",
          "Livraison prioritaire",
          "Support premium",
        ],
        mostPopular: true,
      },
      premium: {
        name: "Premium",
        price: 300,
        deliveryTime: "5 jours",
        description: "Package premium",
        features: ["Service VIP", "Livraison express", "Support 24/7"],
        mostPopular: false,
      },
    };

    return {
      title: service.title,
      description: service.description,
      packages,
      category: service.category,
      subcategory: service.subcategory,
      documents: service.documents || [],
      metadata: service.metadata || {},
      reviews: [
        {
          id: 1,
          user: freelance?.username || "Client satisfait",
          country: freelance?.pays || "France",
          avatar: freelance?.photo_url || "",
          rating: 4.9,
          date: "Il y a 2 jours",
          comment:
            "Excellent service, professionnel et rapide ! Je recommande vivement.",
          helpful: 12,
        },
        {
          id: 2,
          user: "Client régulier",
          country: "Canada",
          avatar: "",
          rating: 5,
          date: "Il y a 1 semaine",
          comment:
            "Toujours un travail de qualité. Ce freelance est très fiable.",
          helpful: 8,
        },
      ],

      faqs: service.faq?.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      })) || [
        {
          question: "Quels sont les délais de livraison ?",
          answer:
            "Les délais varient selon le package choisi, généralement entre 3 et 5 jours ouvrés.",
        },
        {
          question: "Proposez-vous des révisions ?",
          answer:
            "Oui, tous nos packages incluent des révisions pour garantir votre satisfaction.",
        },
      ],
      seller: {
        name: freelance
          ? `${freelance.prenom} ${freelance.nom}`
          : "Freelance Professionnel",
        avatar: freelance?.photo_url || "",
        rating: 4.9,
        reviewCount: freelance ? Math.floor(Math.random() * 500) + 100 : 0,
        isTopRated: true,
        level: "Level 2",
        responseTime: "1 heure",
        location: freelance?.pays || "France",
      },
      images: service.images?.map((img) => img.url) || [],
    };
  }, [service, freelance]);

  // Effet pour réinitialiser l'index média quand le service change
  useEffect(() => {
    setCurrentMediaIndex(0);
    setShowVideo(true);
    setIsPlaying(false);
  }, [service]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 mt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du service...</p>
        </div>
      </div>
    );
  }

  if (!serviceId) {
    return (
      <div className="min-h-screen bg-gray-50 mt-32 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ID de service manquant
          </h1>
          <p className="text-gray-600 mb-8">
            L'identifiant du service n'a pas été spécifié.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 mt-32 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Service non trouvé
          </h1>
          <p className="text-gray-600 mb-8">
            Le service avec l'ID "{serviceId}" n'existe pas ou a été supprimé.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => router.push("/")}
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour à l'accueil
            </button>
            <button
              onClick={() => router.back()}
              className="block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Retour en arrière
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen bg-gray-50 mt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Préparation des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-32">
      {/* Breadcrumb amélioré */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20">
          <nav className="flex items-center space-x-2 py-4 text-sm text-gray-600">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Accueil</span>
            </button>
            <ChevronRight className="h-4 w-4" />
            <span className="capitalize">
              {service.category || "Catégorie"}
            </span>
            <ChevronRight className="h-4 w-4" />
            <span className="capitalize">
              {service.subcategory || "Sous-catégorie"}
            </span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium truncate max-w-xs">
              {service.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Media Carousel amélioré */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="relative">
                {currentMedia ? (
                  <>
                    {isVideo ? (
                      <div className="relative aspect-video bg-black">
                        <video
                          src={currentMedia.url}
                          className="w-full h-full object-contain"
                          muted
                          loop
                          playsInline
                          autoPlay={isPlaying}
                        />
                        {!isPlaying && (
                          <div
                            className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
                            onClick={togglePlay}
                          >
                            <button className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl">
                              <Play className="w-8 h-8 text-gray-900 ml-1" />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <img
                        src={currentMedia.url}
                        alt={service.title}
                        className="w-full aspect-video object-cover"
                      />
                    )}
                  </>
                ) : (
                  <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-gray-400" />
                    <span className="ml-2 text-gray-500">
                      Aucun média disponible
                    </span>
                  </div>
                )}

                {/* Navigation Arrows */}
                {hasMultipleMedias && (
                  <>
                    <button
                      onClick={prevMedia}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all shadow-lg"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <button
                      onClick={nextMedia}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all shadow-lg"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                  </>
                )}

                {/* Media Type Switcher */}
                {service.video_url &&
                  service.images &&
                  service.images.length > 0 && (
                    <div className="absolute top-4 left-4 flex gap-2">
                      <button
                        onClick={switchToVideo}
                        className={`px-3 py-2 text-sm rounded-full backdrop-blur-sm transition-all flex items-center gap-2 ${
                          showVideo
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-white/90 text-gray-700 hover:bg-white shadow-md"
                        }`}
                      >
                        <Video className="w-4 h-4" />
                        Vidéo
                      </button>
                      <button
                        onClick={switchToImages}
                        className={`px-3 py-2 text-sm rounded-full backdrop-blur-sm transition-all flex items-center gap-2 ${
                          !showVideo
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-white/90 text-gray-700 hover:bg-white shadow-md"
                        }`}
                      >
                        <ImageIcon className="w-4 h-4" />
                        Images
                      </button>
                    </div>
                  )}

                {/* Dots Indicator */}
                {hasMultipleMedias && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {medias.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentMediaIndex(index);
                          if (index === 0 && service.video_url) {
                            setShowVideo(true);
                          } else if (index > 0 && service.video_url) {
                            setShowVideo(false);
                          }
                        }}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentMediaIndex
                            ? "bg-white shadow-lg"
                            : "bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all shadow-lg"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Title and Seller Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                {serviceData.title}
              </h1>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                      {serviceData.seller.avatar ? (
                        <img
                          src={serviceData.seller.avatar}
                          alt={serviceData.seller.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6" />
                      )}
                    </div>
                    {serviceData.seller.isTopRated && (
                      <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-1">
                        <Star className="h-3 w-3 text-white fill-current" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="font-semibold text-lg">
                        {serviceData.seller.name}
                      </span>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-semibold text-gray-900">
                          {serviceData.seller.rating}
                        </span>
                        <span>({serviceData.seller.reviewCount})</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {serviceData.seller.level}
                      </span>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Réponse: {serviceData.seller.responseTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowContactModal(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contacter
                </button>
              </div>
            </div>

            {/* About This Service */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                À propos de ce service
              </h2>
              <div className="prose max-w-none">
                <div
                  className="text-gray-700 leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ __html: serviceData.description }}
                />
              </div>
              <hr className="my-6 border-gray-200" />
              <div className="flex items-center space-x-2">
                <span className="capitalize">{serviceData.category}</span>
                <ChevronRight className="h-4 w-4" />
                <span className="capitalize">{serviceData.subcategory}</span>
              </div>
              <hr className="my-6 border-gray-200" />
              {/* Métadonnées */}
              {serviceData.metadata &&
                Object.keys(serviceData.metadata).length > 0 && (
                  <div className="mt-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {/* Métadonnées */}
                        {serviceData.metadata &&
                          Object.keys(serviceData.metadata).length > 0 && (
                            <div className="mt-6">
                              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                Informations supplémentaires
                              </h3>
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="space-y-3">
                                  {Object.entries(serviceData.metadata).map(
                                    ([key, value], index) => (
                                      <div
                                        key={index}
                                        className="flex items-start justify-between py-2 border-b border-gray-200 last:border-b-0"
                                      >
                                        <span className="font-medium text-gray-700 capitalize flex-shrink-0 mr-4">
                                          {key.replace(/_/g, " ")}:
                                        </span>
                                        <span className="text-gray-600 text-right break-words">
                                          {Array.isArray(value) ? (
                                            <div className="flex flex-wrap gap-1 justify-end">
                                              {value.map((item, itemIndex) => (
                                                <span
                                                  key={itemIndex}
                                                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                                                >
                                                  {item}
                                                </span>
                                              ))}
                                            </div>
                                          ) : typeof value === "object" ? (
                                            JSON.stringify(value)
                                          ) : (
                                            String(value)
                                          )}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                      </pre>
                    </div>
                  </div>
                )}

              <hr className="my-6 border-gray-200" />

              <div className="space-y-4">
                {serviceData.documents.length > 0 ? (
                  serviceData.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-blue-500" />
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {doc.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {doc.type} • {doc.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => window.open(doc.url, "_blank")}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs font-medium"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Voir</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FolderOpen className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>Aucun document disponible pour ce service.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews */}
            {serviceData.reviews.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Avis ({serviceData.reviews.length})
                  </h2>
                  <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-400 fill-current mr-2" />
                    <span className="text-xl font-bold">
                      {serviceData.seller.rating}
                    </span>
                    <span className="text-gray-600 ml-2">
                      ({serviceData.seller.reviewCount} avis)
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {serviceData.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-100 pb-6 last:border-b-0"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold overflow-hidden">
                          {review.avatar ? (
                            <img
                              src={review.avatar}
                              alt={review.user}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <span className="font-semibold text-lg">
                                {review.user}
                              </span>
                              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {review.country}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {review.date}
                            </span>
                          </div>

                          <div className="flex items-center mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${
                                  star <= review.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>

                          <p className="text-gray-700 text-lg leading-relaxed mb-4">
                            {review.comment}
                          </p>

                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                              <ThumbsUp className="h-4 w-4" />
                              <span>Utile ({review.helpful})</span>
                            </button>
                            <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                              Répondre
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
            {serviceData.faqs.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  Questions fréquentes
                </h2>
                <div className="space-y-4">
                  {serviceData.faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                    >
                      <details className="group">
                        <summary className="p-6 cursor-pointer list-none">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-gray-900 pr-4">
                              {faq.question}
                            </span>
                            <ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                          </div>
                        </summary>
                        <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                          {faq.answer}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Package Selection */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Package Selection Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                {/* Package Tabs */}
                <div className="flex border-b">
                  {Object.entries(serviceData.packages).map(([key, pkg]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPackage(key)}
                      className={`flex-1 py-4 px-3 text-sm font-semibold transition-colors relative ${
                        selectedPackage === key
                          ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pkg.name}
                      {pkg.mostPopular && (
                        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                          Populaire
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Package Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      €{serviceData.packages[selectedPackage].price}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {serviceData.packages[selectedPackage].deliveryTime}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-6 text-lg">
                    {serviceData.packages[selectedPackage].description}
                  </p>

                  <div className="space-y-4 mb-8">
                    {serviceData.packages[selectedPackage].features.map(
                      (feature, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      )
                    )}
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                      Commander (€{serviceData.packages[selectedPackage].price})
                    </button>
                    <button
                      onClick={() => setIsQuoteModalOpen(true)}
                      className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors"
                    >
                      Obtenir un devis
                    </button>
                  </div>
                </div>
              </div>

              {/* Seller Info Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                      {serviceData.seller.avatar ? (
                        <img
                          src={serviceData.seller.avatar}
                          alt={serviceData.seller.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8" />
                      )}
                    </div>
                    {serviceData.seller.isOnline && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-bold text-lg">
                        {serviceData.seller.name}
                      </span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-900">
                        {serviceData.seller.rating}
                      </span>
                      <span className="text-gray-500">
                        ({serviceData.seller.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Localisation:</span>
                    <span className="font-semibold text-gray-900">
                      {serviceData.seller.location}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Temps de réponse:</span>
                    <span className="font-semibold text-gray-900">
                      {serviceData.seller.responseTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500">Langues:</span>
                    <span className="font-semibold text-gray-900">
                      {freelance?.langues?.map((l) => l.langue).join(", ") ||
                        "Français"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Contacter
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    Profil
                  </button>
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="font-semibold text-blue-900">
                      Paiement sécurisé
                    </div>
                    <div className="text-sm text-blue-700">
                      Garantie de remboursement sous 14 jours
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ObtenuDevis
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
      <PoserUneQuestion
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        contact={{
          name: serviceData.seller.name,
          avatar: serviceData.seller.avatar,
          isOnline: true,
          averageResponseTime: serviceData.seller.responseTime,
        }}
      />
      <OrderOptionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={service}
        selectedPackage={serviceData.packages[selectedPackage]}
      />
    </div>
  );
};

export default ServiceDetailPage;
