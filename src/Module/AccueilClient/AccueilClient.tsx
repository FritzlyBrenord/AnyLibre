"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Star,
  ChevronRight,
  ChevronLeft,
  Heart,
  Play,
  Pause,
  Filter,
  X,
  Sparkles,
  Users,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useFreelances } from "@/Context/Freelance/FreelanceContext";
import { useServices } from "@/Context/Freelance/ContextService";
import { useAuth } from "@/Context/ContextUser";
import { useRouter } from "next/router";
import getDefaultServiceImage from "@/Component/Data/ImageDefault/ImageParDefaut";

// Types
interface ServiceImage {
  id: string;
  name: string;
  url: string;
  path: string;
  type: string;
}

interface Seller {
  name: string;
  level: string;
  isTopRated: boolean;
  isOnline: boolean;
  photo_url?: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  rating: number;
  reviews: number;
  images: ServiceImage[];
  video_url?: string;
  hasVideo?: boolean;
  freelance_id: string;
  seller: Seller;
  badges: string[];
}

interface ServiceCardProps {
  service: Service;
  onFavorite: (serviceId: string) => void;
  isFavorited: boolean;
}

interface CarouselProps {
  title: string;
  services: Service[];
  onSeeAll: () => void;
  maxItems?: number;
}

const heroImages = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop", // Équipe qui travaille
  "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&h=600&fit=crop", // Freelance sur ordinateur
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop", // Business meeting
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop", // Design work
  "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop", // Creative workspace
];

interface HeroSectionProps {
  userName: string;
  servicesCount: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  userName,
  servicesCount,
}) => {
  const [currentImage, setCurrentImage] = useState<string>("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    // Sélectionner une image aléatoire à chaque chargement
    const randomIndex = Math.floor(Math.random() * heroImages.length);
    setCurrentImage(heroImages[randomIndex]);
    setIsImageLoaded(false);
  }, []);

  return (
    <section className="relative bg-gradient-to-r from-yellow-100 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Colonne gauche - Texte */}
          <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mt-5">
              Bienvenue,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 animate-gradient">
                {userName}
              </span>{" "}
              👋
            </h1>

            <p className="text-xl text-gray-700 leading-relaxed">
              Découvrez{" "}
              <span className="font-bold text-gray-900">{servicesCount}</span>{" "}
              services exceptionnels pour donner vie à vos projets
            </p>

            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {servicesCount}+
                </div>
                <div className="text-xs text-gray-600">Services</div>
              </div>

              <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center mb-1">
                  <Zap className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">24h</div>
                <div className="text-xs text-gray-600">Réponse</div>
              </div>

              <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">4.9</div>
                <div className="text-xs text-gray-600">Note moy.</div>
              </div>
            </div>
          </div>

          {/* Colonne droite - Image avec animations */}
          <div className="relative lg:block hidden">
            <div className="relative">
              {/* Cercles décoratifs animés */}
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

              {/* Image principale */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div
                  className={`transition-opacity duration-700 ${
                    isImageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={currentImage}
                    alt="Services Anylibre"
                    className="w-full h-[300px] object-cover rounded-2xl"
                    onLoad={() => setIsImageLoaded(true)}
                  />
                </div>

                {/* Overlay avec gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>

                {/* Badge flottant */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">
                        En ligne maintenant
                      </div>
                      <div className="text-xs text-gray-600">
                        250+ freelances disponibles
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles CSS pour les animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};
// Composant ServiceCard simplifié
const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onFavorite,
  isFavorited,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const medias = React.useMemo(() => {
    const mediaArray: Array<{ type: string; url: string; id: string }> = [];

    if (service.video_url && service.video_url.trim() !== "") {
      mediaArray.push({
        type: "video",
        url: service.video_url,
        id: "video",
      });
    }

    if (service.images && service.images.length > 0) {
      service.images.forEach((image: ServiceImage, index: number) => {
        const imageUrl =
          image.url && image.url.trim() !== ""
            ? image.url
            : getDefaultServiceImage(service.category, service.subcategory);

        mediaArray.push({
          type: "image",
          url: imageUrl,
          id: `image-${index}`,
        });
      });
    }

    if (mediaArray.length === 0) {
      mediaArray.push({
        type: "image",
        url: getDefaultServiceImage(service.category, service.subcategory),
        id: "default-image",
      });
    }

    return mediaArray;
  }, [
    service.video_url,
    service.images,
    service.category,
    service.subcategory,
  ]);

  const currentMedia = medias[currentMediaIndex];
  const isVideo = currentMedia?.type === "video";

  const nextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMediaIndex((prev) => (prev + 1) % medias.length);
  };

  const prevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMediaIndex((prev) => (prev - 1 + medias.length) % medias.length);
  };

  return (
    <div
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image/Vidéo */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {isVideo ? (
          <video
            ref={videoRef}
            src={currentMedia.url}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={currentMedia.url}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getDefaultServiceImage(
                service.category,
                service.subcategory
              );
            }}
          />
        )}

        {/* Navigation */}
        {medias.length > 1 && isHovered && (
          <>
            <button
              onClick={prevMedia}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMedia}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Indicateurs */}
        {medias.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {medias.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${
                  index === currentMediaIndex ? "bg-white w-3" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Bouton favori */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(service.id);
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-md z-10"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorited ? "fill-red-500 text-red-500" : "text-gray-700"
            }`}
          />
        </button>
      </div>

      {/* Contenu */}
      <div className="p-3">
        {/* Vendeur */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 overflow-hidden">
            {service.seller.photo_url ? (
              <img
                src={service.seller.photo_url}
                alt={service.seller.name}
                className="w-full h-full object-cover"
              />
            ) : (
              service.seller.name.charAt(0).toUpperCase()
            )}
          </div>
          <a
            href={`/Profil/?id=${service.freelance_id}`}
            className="text-xs font-semibold text-gray-900 hover:underline truncate"
          >
            {service.seller.name}
          </a>
        </div>

        {/* Titre */}
        <a
          href={`/DetailService/?id=${service.id}`}
          className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors mb-2 block"
        >
          {service.title}
        </a>

        {/* Note et Prix */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-gray-900">
              {service.rating}
            </span>
            <span className="text-xs text-gray-500">({service.reviews})</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-gray-900">
              ${service.price}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Carousel
const Carousel: React.FC<CarouselProps> = ({
  title,
  services,
  onSeeAll,
  maxItems = 8,
}) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const displayServices = services.slice(0, maxItems);

  const toggleFavorite = (serviceId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(serviceId)) {
        newFavorites.delete(serviceId);
      } else {
        newFavorites.add(serviceId);
      }
      return newFavorites;
    });
  };

  if (displayServices.length === 0) return null;

  return (
    <div className="mb-10">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <button
          onClick={onSeeAll}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
        >
          Voir tout
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grille de services */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {displayServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onFavorite={toggleFavorite}
            isFavorited={favorites.has(service.id)}
          />
        ))}
      </div>
    </div>
  );
};

// Page principale
export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const { services, isLoading, error } = useServices();
  const { freelances, getPhotoProfileUrl } = useFreelances();
  const { currentSession } = useAuth();

  const userName = currentSession.userProfile?.nom_utilisateur || "Utilisateur";

  // Transformer les services
  const transformedServices = React.useMemo(() => {
    return services.map((service: any) => {
      const freelance = freelances.find(
        (f: any) => f.id === service.freelance_id
      );

      return {
        id: service.id,
        title: service.title,
        description: service.description,
        category: service.category,
        subcategory: service.subcategory,
        price: service.packages?.[0]?.price
          ? parseFloat(service.packages[0].price)
          : 0,
        rating: 4.8,
        reviews: Math.floor(Math.random() * 500) + 50,
        images: service.images || [],
        video_url: service.video_url,
        freelance_id: service.freelance_id,
        seller: {
          name: freelance ? `${freelance.prenom} ${freelance.nom}` : "Anonyme",
          level: "Level 2",
          isTopRated: Math.random() > 0.5,
          isOnline: Math.random() > 0.5,
          photo_url: freelance?.photo_url
            ? getPhotoProfileUrl(freelance?.photo_url)
            : "",
        },
        badges: service.tags?.slice(0, 2) || [],
      };
    });
  }, [services, freelances, getPhotoProfileUrl]);

  // Obtenir les catégories avec services
  const categoriesWithServices = React.useMemo(() => {
    const categoryMap = new Map<string, number>();
    transformedServices.forEach((service: Service) => {
      const count = categoryMap.get(service.category) || 0;
      categoryMap.set(service.category, count + 1);
    });

    return Array.from(categoryMap.entries())
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));
  }, [transformedServices]);

  // Filtrer les services
  const filteredServices = React.useMemo(() => {
    let filtered = transformedServices;

    // Filtre par catégorie
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (s: Service) => s.category === selectedCategory
      );
    }

    // Filtre par prix
    if (priceFilter === "low") {
      filtered = filtered.filter((s: Service) => s.price < 500);
    } else if (priceFilter === "medium") {
      filtered = filtered.filter(
        (s: Service) => s.price >= 500 && s.price < 1500
      );
    } else if (priceFilter === "high") {
      filtered = filtered.filter((s: Service) => s.price >= 1500);
    }

    return filtered;
  }, [transformedServices, selectedCategory, priceFilter]);

  // Services par catégorie (pour les sections)
  const servicesByCategory = React.useMemo(() => {
    const map = new Map<string, Service[]>();
    categoriesWithServices.forEach(({ category }) => {
      const categoryServices = transformedServices.filter(
        (s: Service) => s.category === category
      );
      map.set(category, categoryServices);
    });
    return map;
  }, [transformedServices, categoriesWithServices]);

  // Recommandations (8 services max)
  const recommendedServices = transformedServices.slice(0, 8);

  // Services par prix
  const budgetFriendlyServices = transformedServices
    .filter((s: Service) => s.price < 500)
    .slice(0, 8);

  const premiumServices = transformedServices
    .filter((s: Service) => s.price >= 1500)
    .slice(0, 8);

  const handleSeeAll = (category?: string) => {
    if (category) {
      setSelectedCategory(category);
      setShowFilters(true);
    }
    // Scroll vers les filtres
    window.scrollTo({ top: 500, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero simple */}
      <HeroSection
        userName={userName}
        servicesCount={transformedServices.length}
      />

      {/* Catégories rapides */}
      <section className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tous les services
            </button>
            {categoriesWithServices.map(({ category, count }) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category} ({count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filtres avancés */}
      {showFilters && (
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Prix:</span>
                <button
                  onClick={() => setPriceFilter("all")}
                  className={`px-3 py-1 rounded text-sm ${
                    priceFilter === "all"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setPriceFilter("low")}
                  className={`px-3 py-1 rounded text-sm ${
                    priceFilter === "low"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Moins de $500
                </button>
                <button
                  onClick={() => setPriceFilter("medium")}
                  className={`px-3 py-1 rounded text-sm ${
                    priceFilter === "medium"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  $500 - $1500
                </button>
                <button
                  onClick={() => setPriceFilter("high")}
                  className={`px-3 py-1 rounded text-sm ${
                    priceFilter === "high"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Plus de $1500
                </button>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Contenu principal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Affichage filtré */}
        {(selectedCategory !== "all" || priceFilter !== "all") && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Résultats filtrés ({filteredServices.length})
              </h2>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setPriceFilter("all");
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Réinitialiser les filtres
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredServices.slice(0, 12).map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onFavorite={() => {}}
                  isFavorited={false}
                />
              ))}
            </div>
            {filteredServices.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Aucun service trouvé avec ces filtres
              </div>
            )}
          </div>
        )}

        {/* Sections par défaut */}
        {selectedCategory === "all" && priceFilter === "all" && (
          <>
            {/* Recommandations */}
            <Carousel
              title="Recommandé pour vous"
              services={recommendedServices}
              onSeeAll={() => handleSeeAll()}
              maxItems={8}
            />

            {/* Budget friendly */}
            {budgetFriendlyServices.length > 0 && (
              <Carousel
                title="Services abordables (moins de $500)"
                services={budgetFriendlyServices}
                onSeeAll={() => setPriceFilter("low")}
                maxItems={8}
              />
            )}

            {/* Par catégorie */}
            {Array.from(servicesByCategory.entries())
              .slice(0, 3)
              .map(([category, services]) => (
                <Carousel
                  key={category}
                  title={category}
                  services={services}
                  onSeeAll={() => handleSeeAll(category)}
                  maxItems={8}
                />
              ))}

            {/* Services premium */}
            {premiumServices.length > 0 && (
              <Carousel
                title="Services Premium (plus de $1500)"
                services={premiumServices}
                onSeeAll={() => setPriceFilter("high")}
                maxItems={8}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}
