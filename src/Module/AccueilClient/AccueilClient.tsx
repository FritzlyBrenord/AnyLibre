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
  CheckCircle2,
  Award,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useFreelances } from "@/Context/Freelance/FreelanceContext";
import { useServices } from "@/Context/Freelance/ContextService";
import { useAuth } from "@/Context/ContextUser";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";

// Types définis
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
  subtitle?: string;
  services: Service[];
  onSeeAll: () => void;
}

const categories = [
  "Développement Web",
  "Design Graphique",
  "Montage Vidéo",
  "Marketing Digital",
  "Rédaction",
  "Animation",
  "SEO",
  "Mobile Apps",
];

// Composant Card de Service amélioré
const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onFavorite,
  isFavorited,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);
  const [showVideo, setShowVideo] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Préparer les médias: vidéo en premier si disponible, puis images
  const medias = React.useMemo(() => {
    const mediaArray: Array<{ type: string; url: string; id: string }> = [];

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
      service.images.forEach((image: ServiceImage, index: number) => {
        mediaArray.push({
          type: "image",
          url: image.url,
          id: `image-${index}`,
        });
      });
    }

    return mediaArray;
  }, [service.video_url, service.images]);

  const totalMedias = medias.length;

  // Gérer la lecture/pause de la vidéo
  useEffect(() => {
    if (videoRef.current) {
      if (
        isPlaying &&
        showVideo &&
        currentMediaIndex === 0 &&
        service.video_url
      ) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, showVideo, currentMediaIndex, service.video_url]);

  const nextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMediaIndex === 0 && service.video_url && isPlaying) {
      setIsPlaying(false);
    }
    setCurrentMediaIndex((prev) => (prev + 1) % totalMedias);
    // Si on passe à une image après la vidéo, désactiver le mode vidéo
    if (currentMediaIndex === 0 && service.video_url) {
      setShowVideo(false);
    }
  };

  const prevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMediaIndex === 0 && service.video_url && isPlaying) {
      setIsPlaying(false);
    }
    setCurrentMediaIndex((prev) => (prev - 1 + totalMedias) % totalMedias);
    // Si on revient à la vidéo, réactiver le mode vidéo
    if (
      (currentMediaIndex - 1 + totalMedias) % totalMedias === 0 &&
      service.video_url
    ) {
      setShowVideo(true);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMediaIndex === 0 && service.video_url) {
      setIsPlaying(!isPlaying);
      setShowVideo(true);
    }
  };

  const switchToImages = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowVideo(false);
    setIsPlaying(false);
    // Si on est sur la vidéo, passer à la première image
    if (currentMediaIndex === 0 && service.video_url && medias.length > 1) {
      setCurrentMediaIndex(1);
    }
  };

  const switchToVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowVideo(true);
    setCurrentMediaIndex(0);
  };

  const currentMedia = medias[currentMediaIndex];
  const isVideo = currentMedia?.type === "video" && showVideo;
  const hasMultipleMedias = totalMedias > 1;

  return (
    <div
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPlaying(false);
      }}
    >
      {/* Carousel Image/Vidéo amélioré */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {currentMedia && (
          <>
            {isVideo ? (
              <video
                ref={videoRef}
                src={currentMedia.url}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                onClick={togglePlay}
              />
            ) : (
              <img
                src={currentMedia.url}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
          </>
        )}

        {/* Overlay de contrôle vidéo */}
        {isVideo && isHovered && (
          <div
            className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300"
            onClick={togglePlay}
          >
            <button className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
              {isPlaying ? (
                <Pause className="w-6 h-6 text-gray-900" />
              ) : (
                <Play className="w-6 h-6 text-gray-900 ml-1" />
              )}
            </button>
          </div>
        )}

        {/* Boutons de navigation carousel - visible au hover */}
        {hasMultipleMedias && isHovered && (
          <>
            <button
              onClick={prevMedia}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md z-10"
            >
              <ChevronLeft className="w-5 h-5 text-gray-900" />
            </button>
            <button
              onClick={nextMedia}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md z-10"
            >
              <ChevronRight className="w-5 h-5 text-gray-900" />
            </button>
          </>
        )}

        {/* Indicateurs de carousel */}
        {hasMultipleMedias && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {medias.map((_, index: number) => (
              <button
                key={index}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  if (
                    currentMediaIndex === 0 &&
                    service.video_url &&
                    isPlaying
                  ) {
                    setIsPlaying(false);
                  }
                  setCurrentMediaIndex(index);
                  if (index === 0 && service.video_url) {
                    setShowVideo(true);
                  } else if (index > 0 && service.video_url) {
                    setShowVideo(false);
                  }
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentMediaIndex
                    ? "bg-white w-4"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}

        {/* Boutons de switch vidéo/images */}
        {service.video_url &&
          service.images &&
          service.images.length > 0 &&
          isHovered && (
            <div className="absolute top-3 left-3 flex gap-2 z-10">
              <button
                onClick={switchToVideo}
                className={`px-2 py-1 text-xs rounded-full backdrop-blur-sm transition-all ${
                  showVideo
                    ? "bg-blue-500 text-white"
                    : "bg-white/90 text-gray-700 hover:bg-white"
                }`}
              >
                Vidéo
              </button>
              <button
                onClick={switchToImages}
                className={`px-2 py-1 text-xs rounded-full backdrop-blur-sm transition-all ${
                  !showVideo
                    ? "bg-blue-500 text-white"
                    : "bg-white/90 text-gray-700 hover:bg-white"
                }`}
              >
                Images
              </button>
            </div>
          )}

        {/* Bouton favori */}
        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onFavorite(service.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md z-10"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorited ? "fill-red-500 text-red-500" : "text-gray-700"
            }`}
          />
        </button>

        {/* Badge online */}
        {service.seller.isOnline && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-green-600 flex items-center gap-1 z-10">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            En ligne
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Vendeur avec photo réelle */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
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
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <a
                href={`/Profil/?id=${service.freelance_id}`}
                className="text-sm hover:underline font-semibold text-gray-900 truncate"
              >
                {service.seller.name}
              </a>
              {service.seller.isTopRated && (
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Top
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {service.seller.level}
            </span>
          </div>
        </div>

        {/* Titre */}
        <a
          href={`/DetailService/?id=${service.id}`}
          className="text-sm font-medium text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors"
        >
          {service.title}
        </a>

        {/* Badges */}
        {service.badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {service.badges.map((badge: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Note et Prix */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-gray-900">
              {service.rating}
            </span>
            <span className="text-sm text-gray-500">
              (
              {service.reviews > 1000
                ? `${Math.floor(service.reviews / 1000)}k+`
                : service.reviews}
              )
            </span>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">À partir de</div>
            <div className="text-lg font-bold text-gray-900">
              {service.price} $US
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Carousel amélioré
const Carousel: React.FC<CarouselProps> = ({
  title,
  subtitle,
  services,
  onSeeAll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentGroup, setCurrentGroup] = useState<number>(0);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const itemsPerGroup = 4;

  // Calculer les groupes de services
  const totalGroups = Math.ceil(services.length / itemsPerGroup);
  const currentServices = services.slice(
    currentGroup * itemsPerGroup,
    (currentGroup + 1) * itemsPerGroup
  );

  const nextGroup = () => {
    setCurrentGroup((prev) => (prev + 1) % totalGroups);
  };

  const prevGroup = () => {
    setCurrentGroup((prev) => (prev - 1 + totalGroups) % totalGroups);
  };

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

  return (
    <div className="mb-12">
      {/* En-tête */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4">
          {/* Indicateur de pagination */}
          {totalGroups > 1 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Groupe {currentGroup + 1} sur {totalGroups}
              </span>
            </div>
          )}
          {onSeeAll && (
            <button
              onClick={onSeeAll}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 group"
            >
              Tout afficher
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Carousel avec navigation */}
      <div className="relative">
        {/* Bouton précédent */}
        {totalGroups > 1 && currentGroup > 0 && (
          <button
            onClick={prevGroup}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}

        {/* Grille des services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {currentServices.map((service: Service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onFavorite={toggleFavorite}
              isFavorited={favorites.has(service.id)}
            />
          ))}
        </div>

        {/* Bouton suivant */}
        {totalGroups > 1 && currentGroup < totalGroups - 1 && (
          <button
            onClick={nextGroup}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>

      {/* Indicateurs de groupe */}
      {totalGroups > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalGroups }, (_, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentGroup(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentGroup
                  ? "bg-blue-600 w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Composant principal
export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { services, isLoading, error } = useServices();
  const { freelances, getPhotoProfileUrl } = useFreelances();
  const { currentSession } = useAuth();
  const isLoggedIn =
    currentSession.isAuthenticated && currentSession.userProfile;
  // Récupérer le nom de l'utilisateur connecté
  const userName = currentSession.userProfile?.nom_utilisateur || "Utilisateur";

  // Transformer les données du contexte pour correspondre à l'interface
  const transformedServices = React.useMemo(() => {
    return services.map((service: any) => {
      // Trouver le freelance correspondant
      const freelance = freelances.find(
        (f: any) => f.id === service.freelance_id
      );

      return {
        id: service.id,
        title: service.title,
        description: service.description,
        category: service.category,
        price: service.packages?.[0]?.price
          ? parseFloat(service.packages[0].price)
          : 0,
        rating: 4.8, // Valeur par défaut, à adapter selon vos besoins
        reviews: Math.floor(Math.random() * 1000) + 100, // Valeur par défaut
        images: service.images || [],
        video_url: service.video_url,
        hasVideo: !!service.video_url,
        freelance_id: service.freelance_id,
        seller: {
          name: freelance ? `${freelance.prenom} ${freelance.nom}` : "Anonyme",
          level: "Level 2", // À adapter selon votre logique
          isTopRated: Math.random() > 0.5, // À adapter
          isOnline: Math.random() > 0.3, // À adapter
          photo_url: freelance?.photo_url
            ? getPhotoProfileUrl(freelance?.photo_url)
            : "",
        },
        badges: service.tags?.slice(0, 2) || [], // Utiliser les tags comme badges
      };
    });
  }, [services, freelances, getPhotoProfileUrl]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Erreur: {error}</p>
        </div>
      </div>
    );
  }

  // Filtrer les services par catégorie
  const developmentServices = transformedServices.filter(
    (s: Service) =>
      s.category.toLowerCase().includes("développement") ||
      s.category.toLowerCase().includes("development")
  );

  const videoServices = transformedServices.filter(
    (s: Service) =>
      s.category.toLowerCase().includes("vidéo") ||
      s.category.toLowerCase().includes("video")
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-yellow-50 via-white to-blue-50 relative overflow-hidden">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20 py-16">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-gray-900">
                Bon retour, <span className="text-blue-600">{userName}</span> 👋
              </h1>

              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Trouvez le talent parfait parmi nos
                <span className="font-semibold text-gray-900">
                  {" "}
                  {freelances.length}+ freelances vérifiés
                </span>
                pour concrétiser vos projets.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Trouver un expert
                </button>
                <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-gray-50 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Voir mes missions
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommandations */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20 py-16">
        {/* Basé sur vos recherches */}
        {transformedServices.length > 0 && (
          <Carousel
            title="Services recommandés"
            services={transformedServices.slice(0, 10)}
            onSeeAll={() => console.log("Voir tout")}
          />
        )}

        {/* Services Pro vérifiés en Développement */}
        {developmentServices.length > 0 && (
          <Carousel
            title="Services Pro vérifiés en Développement Web"
            subtitle="Des talents sélectionnés manuellement pour répondre au mieux à vos besoins professionnels."
            services={developmentServices}
            onSeeAll={() => console.log("Voir tout développement")}
          />
        )}

        {/* Montage vidéo populaire */}
        {videoServices.length > 0 && (
          <Carousel
            title="Montage vidéo populaire"
            services={videoServices}
            onSeeAll={() => console.log("Voir tout vidéo")}
          />
        )}

        {transformedServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucun service disponible pour le moment.
            </p>
          </div>
        )}
      </section>

      {/* Section Catégories */}
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20 py-5">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Explorer par catégorie
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category: string) => (
              <button
                key={category}
                className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left group border border-gray-200"
              >
                <div className="text-4xl mb-3">💼</div>
                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi Anylibre */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Pourquoi choisir Anylibre ?
        </h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          La plateforme qui connecte les talents aux opportunités
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Qualité garantie
            </h3>
            <p className="text-gray-600">
              Tous nos freelancers sont vérifiés pour vous garantir une
              excellence constante.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Livraison rapide
            </h3>
            <p className="text-gray-600">
              Des délais respectés et une communication fluide tout au long du
              projet.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Support 24/7
            </h3>
            <p className="text-gray-600">
              Notre équipe est disponible pour vous accompagner à chaque étape.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
