"use client";
import React, { useState, useEffect } from "react";
import {
  Star,
  Heart,
  CheckCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Editor {
  name: string;
  level: string;
  verified: boolean;
  pro: boolean;
  topRated: boolean;
  online: boolean;
  fastResponse: boolean;
  frenchSpeaker: boolean;
}

interface Media {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
}

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    editor: Editor;
    rating: number;
    reviewCount: number;
    startingPrice: number;
    isFavorited: boolean;
    videoType?: string;
    deliveryTime?: string;
    media: Media[];
    publishedDays?: number;
  };
  onFavoriteToggle?: (id: string) => void;
  showPublishedDays?: boolean;
  className?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onFavoriteToggle,
  showPublishedDays = true,
  className = "",
}) => {
  const [mediaState, setMediaState] = useState({
    currentIndex: 0,
    isPlaying: false,
    isMuted: true,
  });

  const getPublishedDaysText = () => {
    if (!service.publishedDays && service.publishedDays !== 0) return null;

    if (service.publishedDays === 0) return "Publié aujourd'hui";
    if (service.publishedDays === 1) return "Publié hier";
    if (service.publishedDays < 7)
      return `Publié il y a ${service.publishedDays} jours`;
    if (service.publishedDays < 30) {
      const weeks = Math.floor(service.publishedDays / 7);
      return `Publié il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
    }
    const months = Math.floor(service.publishedDays / 30);
    return `Publié il y a ${months} mois${months > 1 ? "s" : ""}`;
  };

  const updateMediaState = (updates: Partial<typeof mediaState>) => {
    setMediaState((prev) => ({ ...prev, ...updates }));
  };

  const nextMedia = () => {
    const newIndex =
      mediaState.currentIndex < service.media.length - 1
        ? mediaState.currentIndex + 1
        : 0;
    updateMediaState({ currentIndex: newIndex });
  };

  const prevMedia = () => {
    const newIndex =
      mediaState.currentIndex > 0
        ? mediaState.currentIndex - 1
        : service.media.length - 1;
    updateMediaState({ currentIndex: newIndex });
  };

  const togglePlay = () => {
    updateMediaState({ isPlaying: !mediaState.isPlaying });
  };

  const toggleMute = () => {
    updateMediaState({ isMuted: !mediaState.isMuted });
  };

  const handleFavoriteClick = () => {
    if (onFavoriteToggle) {
      onFavoriteToggle(service.id);
    }
  };

  const currentMedia = service.media[mediaState.currentIndex];

  return (
    <div
      className={`bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 ${className}`}
    >
      {/* Media Carousel */}
      <div className="relative h-48 bg-gray-900 overflow-hidden rounded-t-xl">
        {currentMedia?.type === "video" ? (
          <div className="relative h-full">
            <video
              className="w-full h-full object-cover"
              poster={currentMedia.thumbnail}
              muted={mediaState.isMuted}
              loop
            >
              <source src={currentMedia.url} type="video/mp4" />
            </video>

            {/* Contrôles vidéo */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
              <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                <button
                  onClick={togglePlay}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
                >
                  {mediaState.isPlaying ? (
                    <Pause className="h-4 w-4 text-white" />
                  ) : (
                    <Play className="h-4 w-4 text-white fill-current" />
                  )}
                </button>
                <button
                  onClick={toggleMute}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
                >
                  {mediaState.isMuted ? (
                    <VolumeX className="h-4 w-4 text-white" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <img
            src={
              currentMedia?.url ||
              `https://via.placeholder.com/400x225/6366f1/white?text=Service+Preview`
            }
            alt="Service preview"
            className="w-full h-full object-cover"
          />
        )}

        {/* Navigation du carrousel */}
        {service.media.length > 1 && (
          <>
            <button
              onClick={prevMedia}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-1.5 hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>
            <button
              onClick={nextMedia}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-1.5 hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>

            {/* Indicateurs */}
            <div className="absolute bottom-2 right-2 flex space-x-1">
              {service.media.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === mediaState.currentIndex
                      ? "bg-white"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Badge du type de média */}
        <div className="absolute top-2 left-2">
          <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {service.media.length > 1
              ? `${mediaState.currentIndex + 1}/${service.media.length}`
              : "1"}
          </span>
        </div>

        {/* Badge des jours de publication */}
        {showPublishedDays && service.publishedDays !== undefined && (
          <div className="absolute top-2 right-2">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm font-medium">
              {getPublishedDaysText()}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Editor Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full mr-3 border-2 flex items-center justify-center text-xs font-bold text-white ${
                service.editor.online
                  ? "bg-green-500 border-green-400"
                  : "bg-gray-400 border-gray-300"
              }`}
            >
              {service.editor.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-1">Par</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {service.editor.name}
                </span>
                {service.editor.verified && (
                  <CheckCircle className="h-3 w-3 text-green-500 ml-1" />
                )}
              </div>
              {service.editor.topRated && (
                <div className="flex items-center mt-1">
                  <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full font-semibold flex items-center">
                    Top Rated
                    <Star className="h-2 w-2 ml-1 fill-current" />
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleFavoriteClick}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                service.isFavorited
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400 group-hover:text-red-400"
              }`}
            />
          </button>
        </div>

        {/* Service Title */}
        <a
          href={`/services/${service.id}`}
          className="font-semibold text-gray-900 mb-4 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors group-hover:text-blue-600 leading-tight block"
        >
          {service.title}
        </a>

        {/* Rating & Starting Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center bg-yellow-50 rounded-lg px-2 py-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
            <span className="text-sm font-bold text-gray-900 mr-1">
              {service.rating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-600">
              ({service.reviewCount})
            </span>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-500">À partir de</div>
            <div className="text-lg font-bold text-gray-900">
              €{service.startingPrice}
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{service.deliveryTime || "Livraison rapide"}</span>
            {service.editor.fastResponse && (
              <span className="text-green-600 font-medium">Réponse rapide</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
