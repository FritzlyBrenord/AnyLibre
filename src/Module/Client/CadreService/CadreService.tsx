import getDefaultServiceImage from "@/Component/Data/ImageDefault/ImageParDefaut";
import {
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

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

export const ServiceCard: React.FC<ServiceCardProps> = ({
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
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
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
