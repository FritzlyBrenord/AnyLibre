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
  Plus,
  Minus,
} from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { useFreelances } from "@/Context/Freelance/FreelanceContext";
import { useServices, Package } from "@/Context/Freelance/ContextService";
import PoserUneQuestion from "../PoserUneQuestion/PoserUneQuestion";

// ==================== INTERFACES ====================

interface ServicePackageDisplay {
  id: string;
  name: string;
  price: number;
  deliveryTime: string;
  description: string;
  features: string[];
  highlights: string[];
  revisions: string;
  mostPopular: boolean;
  originalData: Package;
}

interface ServiceData {
  title: string;
  description: string;
  packages: ServicePackageDisplay[];
  category: string;
  subcategory: string;
  documents: Array<{ name: string; type: string; size: string; url: string }>;
  metadata: Record<string, any>;
  reviews: Array<{
    id: number;
    user: string;
    country: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
    helpful: number;
  }>;
  faqs: Array<{ question: string; answer: string }>;
  seller: {
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    isTopRated: boolean;
    level: string;
    responseTime: string;
    location: string;
    isOnline?: boolean;
  };
  images: string[];
}

// ==================== MODAL ORDER SUMMARY ====================

interface OrderSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: ServicePackageDisplay | null;
  serviceTitle: string;
  serviceId: string;
  packageId: string;
}

const OrderSummaryModal: React.FC<OrderSummaryModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  serviceTitle,
  serviceId,
  packageId,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!selectedPackage) return null;

  const totalPrice = selectedPackage.price * quantity;
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Modal - Slide from right */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200 z-10">
          <h3 className="text-xl font-bold text-gray-900">Récapitulatif</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Service Title */}
          <div>
            <h4 className="text-sm text-gray-500 mb-2">Service</h4>
            <p className="font-semibold text-gray-900">{serviceTitle}</p>
          </div>

          {/* Package Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-bold text-lg text-gray-900">
                  {selectedPackage.name}
                </h5>
                <p className="text-sm text-gray-600 mt-1">
                  Livraison: {selectedPackage.deliveryTime}
                </p>
              </div>
              <span className="text-2xl font-bold text-green-600">
                €{selectedPackage.price}
              </span>
            </div>

            {/* Description */}
            {selectedPackage.description && (
              <div className="p-3 bg-white rounded border border-gray-200">
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {selectedPackage.description}
                </p>
              </div>
            )}

            {/* Highlights */}
            {selectedPackage.highlights.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Points clés:
                </p>
                <div className="space-y-1">
                  {selectedPackage.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Revisions */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center text-sm text-blue-700">
                <RotateCcw className="h-4 w-4 mr-2" />
                <span>{selectedPackage.revisions} révisions incluses</span>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Quantité</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={decreaseQuantity}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Minus className="h-4 w-4 text-gray-600" />
                </button>
                <span className="font-bold text-lg w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg text-gray-900">Total</span>
              <span className="text-3xl font-bold text-green-600">
                €{totalPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-white p-6 border-t border-gray-200 space-y-3">
          <button
            onClick={() =>
              (window.location.href = `/Commande?serviceId=${serviceId}&packageId=${packageId}`)
            }
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
          >
            Commander (€{totalPrice})
          </button>
        </div>
      </div>
    </>
  );
};

// ==================== MAIN COMPONENT ====================

const ServiceDetailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { services, getServiceById, isLoading } = useServices();
  const { freelances, getPhotoProfileUrl } = useFreelances();
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const serviceId = searchParams.get("id");

  // State Management
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);

  // Data fetching
  const service = useMemo(() => {
    if (!serviceId) return null;
    return getServiceById(serviceId);
  }, [serviceId, getServiceById]);

  const freelance = useMemo(() => {
    if (!service) return null;
    return freelances.find((f) => f.id === service.freelance_id);
  }, [service, freelances]);
  const UserFreelance = freelance?.id_user;
  const UserCompteFreelance = freelance?.id;
  // ==================== PACKAGES TRANSFORMATION ====================

  const transformPackages = (
    servicePackages: Package[]
  ): ServicePackageDisplay[] => {
    if (!servicePackages || servicePackages.length === 0) {
      return [
        {
          id: "default",
          name: "Standard",
          price: 100,
          deliveryTime: "3 jours",
          description: "Package standard",
          features: ["Service essentiel", "Livraison standard"],
          highlights: [],
          revisions: "1",
          mostPopular: true,
          originalData: {} as Package,
        },
      ];
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

  // ==================== SERVICE DATA MEMOIZATION ====================

  const serviceData = useMemo((): ServiceData | null => {
    if (!service) return null;

    const packages = transformPackages(service.packages || []);

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
          avatar: freelance?.photo_url
            ? getPhotoProfileUrl(freelance?.photo_url)
            : "",
          rating: 4.9,
          date: "Il y a 2 jours",
          comment:
            "Excellent service, professionnel et rapide ! Je recommande vivement.",
          helpful: 12,
        },
        ...(service.faq ? [] : []),
      ],
      faqs:
        service.faq?.map((faq: any) => ({
          question: faq.question,
          answer: faq.answer,
        })) || [],
      seller: {
        name: freelance
          ? `${freelance.prenom} ${freelance.nom}`
          : "Freelance Professionnel",
        avatar: freelance?.photo_url
          ? getPhotoProfileUrl(freelance?.photo_url)
          : "",
        rating: 4.9,
        reviewCount: freelance ? Math.floor(Math.random() * 500) + 100 : 0,
        isTopRated: true,
        level: "Level 2",
        responseTime: "1 heure",
        location: freelance?.pays || "France",
        isOnline: true,
      },
      images: service.images?.map((img: any) => img.url) || [],
    };
  }, [service, freelance, getPhotoProfileUrl]);

  const currentPackage = serviceData?.packages[selectedPackageIndex];

  // ==================== MEDIA HANDLING ====================

  const medias = useMemo(() => {
    if (!service) return [];
    const mediaArray: any[] = [];

    if (service.video_url) {
      mediaArray.push({ type: "video", url: service.video_url, id: "video" });
    }

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

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % totalMedias);
    if (currentMediaIndex === 0 && service?.video_url) {
      setShowVideo(false);
    }
  };

  const prevMedia = () => {
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

  // ==================== RESET ON SERVICE CHANGE ====================

  useEffect(() => {
    setCurrentMediaIndex(0);
    setShowVideo(true);
    setIsPlaying(false);
    setSelectedPackageIndex(0);
  }, [service]);

  // ==================== LOADING & ERROR STATES ====================

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

  if (!serviceId || !service || !serviceData || !currentPackage) {
    return (
      <div className="min-h-screen bg-gray-50 mt-32 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Service non trouvé
          </h1>
          <p className="text-gray-600 mb-8">Le service demandé n'existe pas.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-32">
      {/* Breadcrumb */}
      <div className="bg-white border-b shadow-sm sticky top-32 z-20">
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
            <span className="capitalize">{service.category}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="capitalize">{service.subcategory}</span>
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
          {/* Left Column - Media & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Media Carousel */}
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
                            <button className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl">
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
                  </div>
                )}

                {/* Navigation */}
                {hasMultipleMedias && (
                  <>
                    <button
                      onClick={prevMedia}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-3 hover:bg-white transition-all shadow-lg"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <button
                      onClick={nextMedia}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-3 hover:bg-white transition-all shadow-lg"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                  </>
                )}

                {/* Dots */}
                {hasMultipleMedias && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {medias.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentMediaIndex(index);
                          if (index === 0 && service.video_url) {
                            setShowVideo(true);
                          } else if (index > 0) {
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
                  className="absolute top-4 right-4 bg-white/90 rounded-full p-3 hover:bg-white transition-all shadow-lg"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
                    }`}
                  />
                </button>

                {/* Video/Image Toggle */}
                {service.video_url &&
                  service.images &&
                  service.images.length > 0 && (
                    <div className="absolute top-4 left-4 flex gap-2">
                      <button
                        onClick={switchToVideo}
                        className={`px-3 py-2 text-sm rounded-full backdrop-blur-sm transition-all flex items-center gap-2 ${
                          showVideo
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-white/90 text-gray-700 hover:bg-white"
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
                            : "bg-white/90 text-gray-700 hover:bg-white"
                        }`}
                      >
                        <ImageIcon className="w-4 h-4" />
                        Images
                      </button>
                    </div>
                  )}
              </div>
            </div>

            {/* Title and Seller Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
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
              </div>
            </div>

            {/* About Service */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                À propos de ce service
              </h2>
              <div
                className="text-gray-700 text-lg mb-6 max-w-full break-words"
                dangerouslySetInnerHTML={{ __html: serviceData.description }}
              />

              <hr className="my-6" />

              <div className="flex items-center space-x-2 mb-6">
                <span className="capitalize">{serviceData.category}</span>
                <ChevronRight className="h-4 w-4" />
                <span className="capitalize">{serviceData.subcategory}</span>
              </div>

              {/* Metadata */}
              {serviceData.metadata &&
                Object.keys(serviceData.metadata).length > 0 && (
                  <>
                    <hr className="my-6" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Informations supplémentaires
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      {Object.entries(serviceData.metadata).map(
                        ([key, value], index) => (
                          <div
                            key={index}
                            className="flex justify-between py-2 border-b border-gray-200 last:border-b-0"
                          >
                            <span className="font-medium text-gray-700 capitalize">
                              {key.replace(/_/g, " ")}:
                            </span>
                            <span className="text-gray-600 text-right">
                              {Array.isArray(value)
                                ? value.map((v, i) => (
                                    <span
                                      key={i}
                                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1"
                                    >
                                      {v}
                                    </span>
                                  ))
                                : typeof value === "object"
                                ? JSON.stringify(value)
                                : String(value)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                    <hr className="my-6" />
                  </>
                )}

              {/* Documents */}
              <div className="space-y-4">
                {serviceData.documents.length > 0 ? (
                  serviceData.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300"
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
                        <button
                          onClick={() => window.open(doc.url, "_blank")}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs font-medium"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Voir</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FolderOpen className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>Aucun document disponible.</p>
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
                            <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700">
                              <ThumbsUp className="h-4 w-4" />
                              <span>Utile ({review.helpful})</span>
                            </button>
                            <button className="text-sm text-gray-500 hover:text-gray-700">
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
                      className="border border-gray-200 rounded-xl"
                    >
                      <details className="group">
                        <summary className="p-6 cursor-pointer list-none">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-gray-900">
                              {faq.question}
                            </span>
                            <ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" />
                          </div>
                        </summary>
                        <div className="px-6 pb-6 text-gray-700 leading-relaxed border-t border-gray-200">
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
            <div className="sticky top-40 space-y-6">
              {/* Package Selection */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                {/* Tabs */}
                {serviceData.packages.length > 1 && (
                  <div className="flex border-b">
                    {serviceData.packages.map((pkg, index) => (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPackageIndex(index)}
                        className={`flex-1 py-4 px-3 text-sm font-semibold transition-colors relative ${
                          selectedPackageIndex === index
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
                )}

                {/* Package Content */}
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900">
                      €{currentPackage.price}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {currentPackage.deliveryTime}
                    </span>
                  </div>

                  <p className="text-gray-600 text-lg whitespace-pre-line">
                    {currentPackage.description}
                  </p>

                  {/* Highlights */}
                  {currentPackage.highlights.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">
                        Points clés inclus:
                      </h4>
                      {currentPackage.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Revisions */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center text-sm text-blue-700">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      <span>{currentPackage.revisions} révisions incluses</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-3 pt-4">
                    <button
                      onClick={() => setIsOrderSummaryOpen(true)}
                      className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                      Commander (€{currentPackage.price})
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
                      {freelance?.langues
                        ?.map((l: any) => l.langue)
                        .join(", ") || "Français"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setIsMessagingOpen(true)}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Contacter
                  </button>
                  <button
                    onClick={() =>
                      (window.location.href = `/Profil/?id=${UserCompteFreelance}`)
                    }
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
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
      <OrderSummaryModal
        isOpen={isOrderSummaryOpen}
        onClose={() => setIsOrderSummaryOpen(false)}
        selectedPackage={currentPackage}
        serviceTitle={serviceData.title}
        serviceId={service.id}
        packageId={currentPackage.id}
      />
      <PoserUneQuestion
        open={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
        id={UserFreelance}
      />
    </div>
  );
};

export default ServiceDetailPage;
