"use client";
import React, { useState, useMemo, useEffect } from "react";
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
  Filter,
  SlidersHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MoreHorizontal,
  Home,
} from "lucide-react";

const ServiceByCategory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("best_selling");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedVideoType, setSelectedVideoType] = useState("");
  const [durationFilter, setDurationFilter] = useState("1_minute");

  // Filtres avec état complet
  const [selectedFilters, setSelectedFilters] = useState({
    serviceOptions: [],
    sellerDetails: [],
    budget: "",
    deliveryTime: "",
    proServices: false,
    instantResponse: false,
  });

  // Dropdowns ouverts/fermés pour desktop
  const [openDropdowns, setOpenDropdowns] = useState({
    serviceOptions: false,
    sellerDetails: false,
    budget: false,
    deliveryTime: false,
    sort: false,
    duration: false,
  });

  // Types de vidéos
  const videoTypes = [
    {
      id: "ads-social",
      name: "Ads & social",
      icon: "📱",
      description: "Publicités et contenu pour réseaux sociaux",
    },
    {
      id: "youtube",
      name: "YouTube videos",
      icon: "▶️",
      description: "Contenu optimisé pour YouTube",
    },
    {
      id: "corporate",
      name: "Corporate videos",
      icon: "🏢",
      description: "Vidéos d'entreprise et institutionnelles",
    },
    {
      id: "gaming",
      name: "Gaming videos",
      icon: "🎮",
      description: "Montage pour contenus gaming",
    },
    {
      id: "family-travel",
      name: "Family & travel",
      icon: "✈️",
      description: "Souvenirs familiaux et voyages",
    },
    {
      id: "music",
      name: "Music videos",
      icon: "🎵",
      description: "Clips musicaux et concerts",
    },
    {
      id: "educational",
      name: "Educational",
      icon: "📚",
      description: "Contenu éducatif et tutoriels",
    },
    {
      id: "promotional",
      name: "Promotional",
      icon: "📢",
      description: "Vidéos promotionnelles",
    },
  ];

  // Options des filtres
  const serviceOptions = [
    { id: "color-grading", name: "Étalonnage couleur", count: 1543 },
    { id: "motion-graphics", name: "Motion Graphics", count: 987 },
    { id: "sound-design", name: "Design sonore", count: 654 },
    { id: "subtitles", name: "Sous-titres", count: 432 },
    { id: "transitions", name: "Transitions personnalisées", count: 298 },
    { id: "vfx", name: "Effets visuels (VFX)", count: 876 },
    { id: "thumbnails", name: "Miniatures YouTube", count: 543 },
    { id: "intro-outro", name: "Intro/Outro", count: 765 },
  ];

  const sellerDetails = [
    { id: "top-rated", name: "Top Rated", count: 3421 },
    { id: "verified", name: "Vendeurs vérifiés", count: 2876 },
    { id: "pro-sellers", name: "Vendeurs Pro", count: 1234 },
    { id: "french-speakers", name: "Parlent français", count: 2987 },
    { id: "online-now", name: "En ligne maintenant", count: 543 },
    { id: "fast-response", name: "Réponse rapide", count: 765 },
  ];

  const budgetRanges = [
    { id: "under-25", name: "Moins de 25€", count: 987 },
    { id: "25-75", name: "25€ - 75€", count: 1876 },
    { id: "75-150", name: "75€ - 150€", count: 2345 },
    { id: "150-300", name: "150€ - 300€", count: 1654 },
    { id: "300-600", name: "300€ - 600€", count: 987 },
    { id: "600-1500", name: "600€ - 1500€", count: 543 },
    { id: "over-1500", name: "Plus de 1500€", count: 298 },
  ];

  const deliveryTimes = [
    { id: "24h", name: "24 heures", count: 432 },
    { id: "3-days", name: "3 jours", count: 1876 },
    { id: "7-days", name: "7 jours", count: 2341 },
    { id: "14-days", name: "14 jours", count: 1234 },
    { id: "30-days", name: "30 jours", count: 654 },
  ];

  const durationOptions = [
    { id: "30_seconds", name: "30 secondes" },
    { id: "1_minute", name: "1 minute" },
    { id: "2_minutes", name: "2 minutes" },
    { id: "5_minutes", name: "5 minutes" },
    { id: "10_minutes", name: "10+ minutes" },
  ];

  const sortOptions = [
    { value: "best_selling", label: "Best selling" },
    { value: "recommended", label: "Recommandé" },
    { value: "newest", label: "Plus récents" },
    { value: "price_low", label: "Prix croissant" },
    { value: "price_high", label: "Prix décroissant" },
    { value: "rating", label: "Mieux notés" },
  ];

  // Génération des données de test pour les services vidéo
  const generateVideoServices = () => {
    const editors = [
      "Lahcen",
      "Reda Elmangalichi",
      "Scaler Studios",
      "Nevena D",
      "Alex VideoPro",
      "Sarah Motion",
      "David Cinematic",
      "Maria Edits",
      "Tom Creative",
      "Luna Films",
      "Max Productions",
      "Zoe Visual",
      "Ryan Digital",
      "Emma Studio",
      "Leo Graphics",
      "Mia Creative",
    ];

    const serviceTitles = [
      "I will do viral video editing for youtube shorts and tiktok",
      "I will do engaging video editing for youtube videos with transitions",
      "Our agency will do professional video editing and post production",
      "I will be your youtube and social media video editor with fast delivery",
      "I will create stunning music video edits with professional effects",
      "I will do corporate video editing with motion graphics and branding",
      "I will edit your gaming videos with epic effects and transitions",
      "I will create promotional videos for your business with call to action",
      "I will do wedding and family video editing with emotional storytelling",
      "I will create educational video content with animations and graphics",
      "I will edit travel vlogs with cinematic color grading",
      "I will do podcast video editing with dynamic visuals",
      "I will create product demo videos with professional presentation",
      "I will edit fitness and workout videos with motivational elements",
      "I will do real estate video editing with drone footage integration",
      "I will create fashion and beauty video content with style",
      "I will edit cooking videos with appetizing close-ups and effects",
      "I will do sports video editing with slow motion and replays",
      "I will create explainer videos with custom animations",
      "I will edit testimonial videos with professional interview setup",
    ];

    const mediaAssets = [
      // Vidéos d'exemple
      {
        type: "video",
        url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        thumbnail: "https://picsum.photos/400/225?random=1",
      },
      {
        type: "video",
        url: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
        thumbnail: "https://picsum.photos/400/225?random=2",
      },
      // Images d'exemple
      { type: "image", url: "https://picsum.photos/400/225?random=3" },
      { type: "image", url: "https://picsum.photos/400/225?random=4" },
      { type: "image", url: "https://picsum.photos/400/225?random=5" },
      { type: "image", url: "https://picsum.photos/400/225?random=6" },
      { type: "image", url: "https://picsum.photos/400/225?random=7" },
      { type: "image", url: "https://picsum.photos/400/225?random=8" },
      { type: "image", url: "https://picsum.photos/400/225?random=9" },
      { type: "image", url: "https://picsum.photos/400/225?random=10" },
    ];

    const services = [];

    for (let i = 1; i <= 180; i++) {
      const randomEditor = editors[Math.floor(Math.random() * editors.length)];
      const randomTitle =
        serviceTitles[Math.floor(Math.random() * serviceTitles.length)];
      const randomVideoType =
        videoTypes[Math.floor(Math.random() * videoTypes.length)].id;
      const randomDeliveryTime =
        deliveryTimes[Math.floor(Math.random() * deliveryTimes.length)].id;

      // Générer 1 à 5 médias par service
      const mediaCount = Math.floor(Math.random() * 5) + 1;
      const serviceMedia = [];
      for (let j = 0; j < mediaCount; j++) {
        const randomMedia =
          mediaAssets[Math.floor(Math.random() * mediaAssets.length)];
        serviceMedia.push({
          ...randomMedia,
          id: `${i}-${j}`,
          url:
            randomMedia.type === "image"
              ? `https://picsum.photos/400/225?random=${i * 10 + j}`
              : randomMedia.url,
        });
      }

      services.push({
        id: i,
        title: randomTitle,
        editor: {
          name: randomEditor,
          level: Math.random() > 0.7 ? "Level 2" : "Level 1",
          verified: Math.random() > 0.3,
          pro: Math.random() > 0.8,
          topRated: Math.random() > 0.7,
          online: Math.random() > 0.5,
          fastResponse: Math.random() > 0.6,
          frenchSpeaker: Math.random() > 0.3,
        },
        rating: Number((4.2 + Math.random() * 0.8).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 500) + 10,
        startingPrice: Math.floor(Math.random() * 800) + 25,
        isFavorited: Math.random() > 0.95,
        videoType: randomVideoType,
        deliveryTime: randomDeliveryTime,
        media: serviceMedia,
        // Options de service
        hasColorGrading: Math.random() > 0.6,
        hasMotionGraphics: Math.random() > 0.7,
        hasSoundDesign: Math.random() > 0.8,
        hasSubtitles: Math.random() > 0.5,
        hasTransitions: Math.random() > 0.4,
        hasVFX: Math.random() > 0.8,
        hasThumbnails: Math.random() > 0.6,
        hasIntroOutro: Math.random() > 0.7,
      });
    }

    return services;
  };

  const allServices = useMemo(() => generateVideoServices(), []);

  // Fonction de filtrage
  const filteredServices = useMemo(() => {
    let filtered = allServices;

    // Filtrage par type de vidéo
    if (selectedVideoType) {
      filtered = filtered.filter(
        (service) => service.videoType === selectedVideoType
      );
    }

    // Filtrage par options de service
    if (selectedFilters.serviceOptions.length > 0) {
      filtered = filtered.filter((service) => {
        return selectedFilters.serviceOptions.every((option) => {
          switch (option) {
            case "color-grading":
              return service.hasColorGrading;
            case "motion-graphics":
              return service.hasMotionGraphics;
            case "sound-design":
              return service.hasSoundDesign;
            case "subtitles":
              return service.hasSubtitles;
            case "transitions":
              return service.hasTransitions;
            case "vfx":
              return service.hasVFX;
            case "thumbnails":
              return service.hasThumbnails;
            case "intro-outro":
              return service.hasIntroOutro;
            default:
              return true;
          }
        });
      });
    }

    // Filtrage par détails vendeur
    if (selectedFilters.sellerDetails.length > 0) {
      filtered = filtered.filter((service) => {
        return selectedFilters.sellerDetails.some((detail) => {
          switch (detail) {
            case "top-rated":
              return service.editor.topRated;
            case "verified":
              return service.editor.verified;
            case "pro-sellers":
              return service.editor.pro;
            case "french-speakers":
              return service.editor.frenchSpeaker;
            case "online-now":
              return service.editor.online;
            case "fast-response":
              return service.editor.fastResponse;
            default:
              return true;
          }
        });
      });
    }

    // Filtrage par budget
    if (selectedFilters.budget) {
      filtered = filtered.filter((service) => {
        const price = service.startingPrice;
        switch (selectedFilters.budget) {
          case "under-25":
            return price < 25;
          case "25-75":
            return price >= 25 && price <= 75;
          case "75-150":
            return price >= 75 && price <= 150;
          case "150-300":
            return price >= 150 && price <= 300;
          case "300-600":
            return price >= 300 && price <= 600;
          case "600-1500":
            return price >= 600 && price <= 1500;
          case "over-1500":
            return price > 1500;
          default:
            return true;
        }
      });
    }

    // Filtrage par délai de livraison
    if (selectedFilters.deliveryTime) {
      filtered = filtered.filter(
        (service) => service.deliveryTime === selectedFilters.deliveryTime
      );
    }

    // Filtres booléens
    if (selectedFilters.proServices) {
      filtered = filtered.filter((service) => service.editor.pro);
    }

    if (selectedFilters.instantResponse) {
      filtered = filtered.filter((service) => service.editor.fastResponse);
    }

    return filtered;
  }, [allServices, selectedVideoType, selectedFilters]);

  // Fonction de tri
  const sortedServices = useMemo(() => {
    const sorted = [...filteredServices];

    switch (sortBy) {
      case "recommended":
        return sorted.sort(
          (a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount
        );
      case "newest":
        return sorted.sort((a, b) => b.id - a.id);
      case "price_low":
        return sorted.sort((a, b) => a.startingPrice - b.startingPrice);
      case "price_high":
        return sorted.sort((a, b) => b.startingPrice - a.startingPrice);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      default: // best_selling
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [filteredServices, sortBy]);

  const resultsPerPage = 12;
  const totalResults = sortedServices.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  // Résultats paginés
  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return sortedServices.slice(startIndex, endIndex);
  }, [sortedServices, currentPage, resultsPerPage]);

  // État pour les carrousels de médias
  const [mediaStates, setMediaStates] = useState({});

  const updateMediaState = (serviceId, updates) => {
    setMediaStates((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], ...updates },
    }));
  };

  // Composant Carrousel de médias
  const MediaCarousel = ({ media, serviceId }) => {
    const currentIndex = mediaStates[serviceId]?.currentIndex || 0;
    const isPlaying = mediaStates[serviceId]?.isPlaying || false;
    const isMuted = mediaStates[serviceId]?.isMuted ?? true;

    useEffect(() => {
      if (!mediaStates[serviceId]) {
        updateMediaState(serviceId, {
          currentIndex: 0,
          isPlaying: false,
          isMuted: true,
        });
      }
    }, [serviceId]);

    const nextMedia = () => {
      const newIndex = currentIndex < media.length - 1 ? currentIndex + 1 : 0;
      updateMediaState(serviceId, { currentIndex: newIndex });
    };

    const prevMedia = () => {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : media.length - 1;
      updateMediaState(serviceId, { currentIndex: newIndex });
    };

    const togglePlay = () => {
      updateMediaState(serviceId, { isPlaying: !isPlaying });
    };

    const toggleMute = () => {
      updateMediaState(serviceId, { isMuted: !isMuted });
    };

    const currentMedia = media[currentIndex];

    return (
      <div className="relative h-48 bg-gray-900 overflow-hidden rounded-t-xl">
        {currentMedia?.type === "video" ? (
          <div className="relative h-full">
            <video
              className="w-full h-full object-cover"
              poster={currentMedia.thumbnail}
              muted={isMuted}
              loop
              onLoadedMetadata={(e) => {
                if (isPlaying) {
                  e.target.play();
                }
              }}
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
                  {isPlaying ? (
                    <Pause className="h-4 w-4 text-white" />
                  ) : (
                    <Play className="h-4 w-4 text-white fill-current" />
                  )}
                </button>
                <button
                  onClick={toggleMute}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
                >
                  {isMuted ? (
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
            src={currentMedia?.url}
            alt="Service preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/400x225/6366f1/white?text=Service+Preview`;
            }}
          />
        )}

        {/* Navigation du carrousel */}
        {media.length > 1 && (
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
              {media.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Badge du type de média */}
        <div className="absolute top-2 left-2">
          <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {media.length > 1 ? `${currentIndex + 1}/${media.length}` : "1"}
          </span>
        </div>
      </div>
    );
  };

  // Gestion des changements de page
  const handlePageChange = (page) => {
    setIsLoading(true);
    setCurrentPage(page);
    setTimeout(() => {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  // Reset pagination quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters, sortBy, selectedVideoType]);

  // Gestion des dropdowns desktop
  const toggleDropdown = (dropdown) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const closeAllDropdowns = () => {
    setOpenDropdowns({
      serviceOptions: false,
      sellerDetails: false,
      budget: false,
      deliveryTime: false,
      sort: false,
      duration: false,
    });
  };

  // Fermer dropdowns si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = () => closeAllDropdowns();
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Gestion des filtres
  const handleFilterChange = (filterType, value) => {
    if (filterType === "serviceOptions" || filterType === "sellerDetails") {
      setSelectedFilters((prev) => {
        const currentArray = prev[filterType];
        const newArray = currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value];
        return { ...prev, [filterType]: newArray };
      });
    } else {
      setSelectedFilters((prev) => ({
        ...prev,
        [filterType]: prev[filterType] === value ? "" : value,
      }));
    }
    closeAllDropdowns();
  };

  const toggleFavorite = (id) => {
    console.log(`Toggle favorite for service ${id}`);
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      serviceOptions: [],
      sellerDetails: [],
      budget: "",
      deliveryTime: "",
      proServices: false,
      instantResponse: false,
    });
    setSelectedVideoType("");
    setShowMobileFilters(false);
  };

  // Vérification si des filtres sont actifs
  const hasActiveFilters =
    selectedVideoType ||
    selectedFilters.serviceOptions.length > 0 ||
    selectedFilters.sellerDetails.length > 0 ||
    selectedFilters.budget ||
    selectedFilters.deliveryTime ||
    selectedFilters.proServices ||
    selectedFilters.instantResponse;

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedVideoType) count++;
    count += selectedFilters.serviceOptions.length;
    count += selectedFilters.sellerDetails.length;
    if (selectedFilters.budget) count++;
    if (selectedFilters.deliveryTime) count++;
    if (selectedFilters.proServices) count++;
    if (selectedFilters.instantResponse) count++;
    return count;
  };

  // Fonctions utilitaires pour récupérer les noms
  const getServiceOptionName = (optionId) => {
    return serviceOptions.find((o) => o.id === optionId)?.name || optionId;
  };

  const getSellerDetailName = (detailId) => {
    return sellerDetails.find((d) => d.id === detailId)?.name || detailId;
  };

  const getBudgetName = (budgetId) => {
    return budgetRanges.find((b) => b.id === budgetId)?.name || budgetId;
  };

  const getDeliveryTimeName = (deliveryId) => {
    return deliveryTimes.find((d) => d.id === deliveryId)?.name || deliveryId;
  };

  const getVideoTypeName = (typeId) => {
    return videoTypes.find((t) => t.id === typeId)?.name || typeId;
  };

  // Composant Modal pour les filtres mobile
  const MobileFiltersModal = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
        showMobileFilters ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`fixed inset-x-0 bottom-0 bg-white rounded-t-2xl transition-transform duration-300 max-h-[95vh] overflow-hidden ${
          showMobileFilters ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
          <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
          <button
            onClick={() => setShowMobileFilters(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div
          className="overflow-y-auto p-4"
          style={{ maxHeight: "calc(95vh - 140px)" }}
        >
          {/* Type de vidéo */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Type de vidéo</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedVideoType("")}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  !selectedVideoType
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-sm font-medium">Tous les types</div>
              </button>
              {videoTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedVideoType(type.id)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    selectedVideoType === type.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-lg mb-1">{type.icon}</div>
                  <div className="text-sm font-medium">{type.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Options de service */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">
              Options de service
            </h4>
            <div className="space-y-2">
              {serviceOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.serviceOptions.includes(option.id)}
                    onChange={() =>
                      handleFilterChange("serviceOptions", option.id)
                    }
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700 flex-1">
                    {option.name}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {option.count}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Détails vendeur */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">
              Détails vendeur
            </h4>
            <div className="space-y-2">
              {sellerDetails.map((detail) => (
                <label
                  key={detail.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.sellerDetails.includes(detail.id)}
                    onChange={() =>
                      handleFilterChange("sellerDetails", detail.id)
                    }
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span className="text-sm text-gray-700 flex-1">
                    {detail.name}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {detail.count}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Budget</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="radio"
                  name="budget"
                  checked={!selectedFilters.budget}
                  onChange={() => handleFilterChange("budget", "")}
                  className="w-4 h-4 text-yellow-600"
                />
                <span className="text-sm font-medium">Tous les budgets</span>
              </label>
              {budgetRanges.map((budget) => (
                <label
                  key={budget.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="radio"
                    name="budget"
                    checked={selectedFilters.budget === budget.id}
                    onChange={() => handleFilterChange("budget", budget.id)}
                    className="w-4 h-4 text-yellow-600"
                  />
                  <span className="text-sm text-gray-700 flex-1">
                    {budget.name}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {budget.count}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Délai de livraison */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">
              Délai de livraison
            </h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="radio"
                  name="deliveryTime"
                  checked={!selectedFilters.deliveryTime}
                  onChange={() => handleFilterChange("deliveryTime", "")}
                  className="w-4 h-4 text-red-600"
                />
                <span className="text-sm font-medium">Tous les délais</span>
              </label>
              {deliveryTimes.map((time) => (
                <label
                  key={time.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="radio"
                    name="deliveryTime"
                    checked={selectedFilters.deliveryTime === time.id}
                    onChange={() => handleFilterChange("deliveryTime", time.id)}
                    className="w-4 h-4 text-red-600"
                  />
                  <span className="text-sm text-gray-700 flex-1">
                    {time.name}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {time.count}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Options spéciales */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">
              Options spéciales
            </h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                <span className="text-sm font-medium text-gray-900">
                  Services Pro uniquement
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedFilters.proServices}
                    onChange={(e) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        proServices: e.target.checked,
                      }))
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors ${
                      selectedFilters.proServices
                        ? "bg-purple-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full mt-1 mx-1 transition-transform ${
                        selectedFilters.proServices ? "translate-x-5" : ""
                      }`}
                    ></div>
                  </div>
                </div>
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Réponse instantanée
                  </span>
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    New
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedFilters.instantResponse}
                    onChange={(e) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        instantResponse: e.target.checked,
                      }))
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors ${
                      selectedFilters.instantResponse
                        ? "bg-green-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full mt-1 mx-1 transition-transform ${
                        selectedFilters.instantResponse ? "translate-x-5" : ""
                      }`}
                    ></div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t p-4">
          <div className="flex space-x-3">
            <button
              onClick={clearAllFilters}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Effacer tout
            </button>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="flex-2 py-3 px-6 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Voir {totalResults} résultats</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-20 sm:mt-32 bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Home className="h-4 w-4" />
          <ChevronRight className="h-4 w-4" />
          <span>Vidéo & Animation</span>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Montage Vidéo
          </h1>
          <div className="flex flex-col sm:flex-row items-center space-x-4 text-gray-600">
            <p>
              Créez ou améliorez vos vidéos avec des services de montage et
              post-production professionnels.
            </p>
            <button className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>Comment Anylibre fonctionne</span>
            </button>
          </div>
        </div>

        {/* Select Video Type */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-between">
            <span>Sélectionnez le type de vidéo</span>
            <div className="hidden md:flex items-center space-x-2">
              <button className="p-1 rounded hover:bg-gray-100">
                <ChevronLeft className="h-5 w-5 text-gray-400" />
              </button>
              <button className="p-1 rounded hover:bg-gray-100">
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-2">
            {videoTypes.slice(0, 6).map((type) => (
              <button
                key={type.id}
                onClick={() =>
                  setSelectedVideoType(
                    selectedVideoType === type.id ? "" : type.id
                  )
                }
                className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                  selectedVideoType === type.id
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="text-sm font-medium text-gray-900">
                  {type.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          {/* Mobile Filter Button */}
          <div className="flex items-center justify-between lg:hidden">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Filtres</span>
              {hasActiveFilters && (
                <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Service Options */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("serviceOptions");
                }}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                  selectedFilters.serviceOptions.length > 0
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <span className="text-sm font-medium">
                  Service options{" "}
                  {selectedFilters.serviceOptions.length > 0 &&
                    `(${selectedFilters.serviceOptions.length})`}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {openDropdowns.serviceOptions && (
                <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-20 min-w-72 max-h-80 overflow-y-auto">
                  <div className="py-2">
                    {serviceOptions.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters.serviceOptions.includes(
                            option.id
                          )}
                          onChange={() =>
                            handleFilterChange("serviceOptions", option.id)
                          }
                          className="w-4 h-4 text-blue-600 rounded mr-3"
                        />
                        <span className="text-sm text-gray-700 flex-1">
                          {option.name}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {option.count}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Seller Details */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("sellerDetails");
                }}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                  selectedFilters.sellerDetails.length > 0
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <span className="text-sm font-medium">
                  Seller details{" "}
                  {selectedFilters.sellerDetails.length > 0 &&
                    `(${selectedFilters.sellerDetails.length})`}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {openDropdowns.sellerDetails && (
                <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-20 min-w-64 max-h-80 overflow-y-auto">
                  <div className="py-2">
                    {sellerDetails.map((detail) => (
                      <label
                        key={detail.id}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters.sellerDetails.includes(
                            detail.id
                          )}
                          onChange={() =>
                            handleFilterChange("sellerDetails", detail.id)
                          }
                          className="w-4 h-4 text-purple-600 rounded mr-3"
                        />
                        <span className="text-sm text-gray-700 flex-1">
                          {detail.name}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {detail.count}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Budget */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("budget");
                }}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                  selectedFilters.budget
                    ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <span className="text-sm font-medium">
                  {selectedFilters.budget
                    ? getBudgetName(selectedFilters.budget)
                    : "Budget"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {openDropdowns.budget && (
                <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-20 min-w-56">
                  <div className="py-2">
                    <button
                      onClick={() => handleFilterChange("budget", "")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Tous les budgets
                    </button>
                    {budgetRanges.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleFilterChange("budget", option.id)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex justify-between ${
                          selectedFilters.budget === option.id
                            ? "text-yellow-600 bg-yellow-50 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        <span>{option.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {option.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Time */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("deliveryTime");
                }}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                  selectedFilters.deliveryTime
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <span className="text-sm font-medium">
                  {selectedFilters.deliveryTime
                    ? getDeliveryTimeName(selectedFilters.deliveryTime)
                    : "Delivery time"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {openDropdowns.deliveryTime && (
                <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-20 min-w-48">
                  <div className="py-2">
                    <button
                      onClick={() => handleFilterChange("deliveryTime", "")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Tous les délais
                    </button>
                    {deliveryTimes.map((option) => (
                      <button
                        key={option.id}
                        onClick={() =>
                          handleFilterChange("deliveryTime", option.id)
                        }
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex justify-between ${
                          selectedFilters.deliveryTime === option.id
                            ? "text-red-600 bg-red-50 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        <span>{option.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {option.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Toggle Switches */}
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedFilters.proServices}
                    onChange={(e) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        proServices: e.target.checked,
                      }))
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-6 rounded-full transition-colors ${
                      selectedFilters.proServices
                        ? "bg-green-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full mt-1 mx-1 transition-transform shadow ${
                        selectedFilters.proServices ? "translate-x-4" : ""
                      }`}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Pro services
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedFilters.instantResponse}
                    onChange={(e) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        instantResponse: e.target.checked,
                      }))
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-6 rounded-full transition-colors ${
                      selectedFilters.instantResponse
                        ? "bg-green-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full mt-1 mx-1 transition-transform shadow ${
                        selectedFilters.instantResponse ? "translate-x-4" : ""
                      }`}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-gray-700">
                    Instant response
                  </span>
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    New
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
            <div className="flex items-start justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-semibold text-blue-800 mr-2 flex items-center">
                  <Filter className="h-4 w-4 mr-1" />
                  Filtres actifs:
                </span>

                {selectedVideoType && (
                  <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full border border-green-200">
                    <span className="font-medium">
                      {getVideoTypeName(selectedVideoType)}
                    </span>
                    <button
                      onClick={() => setSelectedVideoType("")}
                      className="ml-2 text-green-600 hover:text-green-800 hover:bg-green-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {selectedFilters.serviceOptions.map((option) => (
                  <span
                    key={option}
                    className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full border border-blue-200"
                  >
                    <span className="font-medium">
                      {getServiceOptionName(option)}
                    </span>
                    <button
                      onClick={() =>
                        handleFilterChange("serviceOptions", option)
                      }
                      className="ml-2 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                {selectedFilters.sellerDetails.map((detail) => (
                  <span
                    key={detail}
                    className="inline-flex items-center bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full border border-purple-200"
                  >
                    <span className="font-medium">
                      {getSellerDetailName(detail)}
                    </span>
                    <button
                      onClick={() =>
                        handleFilterChange("sellerDetails", detail)
                      }
                      className="ml-2 text-purple-600 hover:text-purple-800 hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                {selectedFilters.budget && (
                  <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full border border-yellow-200">
                    <span className="font-medium">
                      {getBudgetName(selectedFilters.budget)}
                    </span>
                    <button
                      onClick={() => handleFilterChange("budget", "")}
                      className="ml-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {selectedFilters.deliveryTime && (
                  <span className="inline-flex items-center bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full border border-red-200">
                    <span className="font-medium">
                      {getDeliveryTimeName(selectedFilters.deliveryTime)}
                    </span>
                    <button
                      onClick={() => handleFilterChange("deliveryTime", "")}
                      className="ml-2 text-red-600 hover:text-red-800 hover:bg-red-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {selectedFilters.proServices && (
                  <span className="inline-flex items-center bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full border border-indigo-200">
                    <Star className="h-3 w-3 mr-1" />
                    <span className="font-medium">Services Pro</span>
                    <button
                      onClick={() =>
                        setSelectedFilters((prev) => ({
                          ...prev,
                          proServices: false,
                        }))
                      }
                      className="ml-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {selectedFilters.instantResponse && (
                  <span className="inline-flex items-center bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full border border-emerald-200">
                    <Clock className="h-3 w-3 mr-1" />
                    <span className="font-medium">Réponse instantanée</span>
                    <button
                      onClick={() =>
                        setSelectedFilters((prev) => ({
                          ...prev,
                          instantResponse: false,
                        }))
                      }
                      className="ml-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={clearAllFilters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors"
              >
                Effacer tout
              </button>
            </div>
          </div>
        )}

        {/* Results Summary and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">
              <span className="font-semibold text-lg">
                {totalResults.toLocaleString()}+
              </span>{" "}
              résultats
            </p>

            {/* Duration Filter */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Affichage des prix pour:</span>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("duration");
                  }}
                  className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded hover:border-gray-400 transition-colors"
                >
                  <span className="font-medium">
                    {durationOptions.find((d) => d.id === durationFilter)
                      ?.name || "1 minute"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {openDropdowns.duration && (
                  <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-20 min-w-40">
                    <div className="py-2">
                      {durationOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setDurationFilter(option.id);
                            closeAllDropdowns();
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                            durationFilter === option.id
                              ? "text-green-600 bg-green-50 font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 font-medium">Sort by:</span>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("sort");
                }}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 bg-white transition-colors"
              >
                <span className="text-sm font-medium">
                  {sortOptions.find((option) => option.value === sortBy)?.label}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {openDropdowns.sort && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-20 min-w-52">
                  <div className="py-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          closeAllDropdowns();
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          sortBy === option.value
                            ? "text-green-600 bg-green-50 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
                >
                  {/* Media Carousel */}
                  <MediaCarousel media={service.media} serviceId={service.id} />

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
                            <span className="text-sm text-gray-600 mr-1">
                              Ad by
                            </span>
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
                                <Star className="h-2 w-2 fill-current" />
                                <Star className="h-2 w-2 fill-current" />
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFavorite(service.id)}
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
                      href="/DetailService"
                      className="font-semibold text-gray-900 mb-4 line-clamp-2 hover:text-green-600 cursor-pointer transition-colors group-hover:text-green-600 leading-tight"
                    >
                      {service.title}
                    </a>

                    {/* Rating & Starting Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-yellow-50 rounded-lg px-2 py-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-sm font-bold text-gray-900 mr-1">
                          {service.rating}
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
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalResults > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mb-8">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-300"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {[...Array(Math.min(7, totalPages))].map((_, index) => {
                  let pageNum;
                  if (totalPages <= 7) {
                    pageNum = index + 1;
                  } else if (currentPage <= 4) {
                    pageNum = index + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + index;
                  } else {
                    pageNum = currentPage - 3 + index;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoading}
                      className={`px-4 py-2 rounded-lg transition-colors border ${
                        currentPage === pageNum
                          ? "bg-green-600 text-white border-green-600 shadow-lg"
                          : "hover:bg-gray-100 text-gray-700 border-gray-300 disabled:opacity-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 7 && currentPage < totalPages - 3 && (
                  <>
                    <span className="px-2 text-gray-500">...</span>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={isLoading}
                      className="px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 disabled:opacity-50 transition-colors border border-gray-300"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages || isLoading}
                  className="px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-300"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Results Info Footer */}
            {totalResults > 0 && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-4 text-sm text-gray-600 bg-gray-100 rounded-full px-6 py-3">
                  <span>
                    Page <span className="font-semibold">{currentPage}</span>{" "}
                    sur <span className="font-semibold">{totalPages}</span>
                  </span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>
                    Affichage de{" "}
                    <span className="font-semibold">
                      {(currentPage - 1) * resultsPerPage + 1}
                    </span>
                    -
                    <span className="font-semibold">
                      {Math.min(currentPage * resultsPerPage, totalResults)}
                    </span>{" "}
                    sur{" "}
                    <span className="font-semibold">
                      {totalResults.toLocaleString()}+
                    </span>{" "}
                    résultats
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile Filters Modal */}
      <MobileFiltersModal />
    </div>
  );
};

export default ServiceByCategory;
