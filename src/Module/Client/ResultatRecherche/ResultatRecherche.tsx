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
} from "lucide-react";

const SearchResultsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("site web");
  const [sortBy, setSortBy] = useState("relevance");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filtres avec état complet
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    serviceOptions: [],
    sellerDetails: [],
    budget: "",
    deliveryTime: "",
    proServices: false,
    instantResponse: false,
  });

  // Dropdowns ouverts/fermés pour desktop
  const [openDropdowns, setOpenDropdowns] = useState({
    category: false,
    serviceOptions: false,
    sellerDetails: false,
    budget: false,
    deliveryTime: false,
    sort: false,
  });

  // Listes par défaut pour les filtres
  const defaultCategories = [
    { id: "web-dev", name: "Développement Web", count: 2843 },
    { id: "graphic-design", name: "Design Graphique", count: 1923 },
    { id: "digital-marketing", name: "Marketing Digital", count: 1654 },
    { id: "writing", name: "Rédaction", count: 1234 },
    { id: "video", name: "Vidéo & Animation", count: 987 },
    { id: "business", name: "Business", count: 876 },
    { id: "finance", name: "Finance", count: 543 },
    { id: "ai-services", name: "Services IA", count: 432 },
    { id: "personal-growth", name: "Croissance Personnelle", count: 321 },
    { id: "consulting", name: "Consultation", count: 298 },
    { id: "data", name: "Data", count: 234 },
    { id: "photography", name: "Photographie", count: 198 },
  ];

  const defaultServiceOptions = [
    { id: "unlimited-revisions", name: "Révisions illimitées", count: 1543 },
    { id: "fast-delivery", name: "Livraison rapide (24-48h)", count: 987 },
    { id: "support-24-7", name: "Support 24/7", count: 654 },
    { id: "source-code", name: "Code source inclus", count: 432 },
    { id: "training", name: "Formation incluse", count: 298 },
    { id: "money-back", name: "Garantie satisfait ou remboursé", count: 876 },
    { id: "commercial-use", name: "Utilisation commerciale", count: 543 },
    { id: "express-delivery", name: "Livraison express", count: 321 },
  ];

  const defaultSellerDetails = [
    { id: "verified", name: "Vendeurs vérifiés", count: 3421 },
    { id: "new-sellers", name: "Nouveaux vendeurs", count: 876 },
    { id: "pro-sellers", name: "Vendeurs Pro", count: 1234 },
    { id: "french-speakers", name: "Parlent français", count: 2987 },
    { id: "online-now", name: "En ligne maintenant", count: 543 },
    { id: "top-rated", name: "Mieux notés (4.8+)", count: 765 },
    { id: "certified", name: "Certifiés", count: 432 },
  ];

  const defaultBudgetRanges = [
    { id: "under-25", name: "Moins de 25€", count: 987 },
    { id: "25-50", name: "25€ - 50€", count: 1876 },
    { id: "50-100", name: "50€ - 100€", count: 2345 },
    { id: "100-250", name: "100€ - 250€", count: 1654 },
    { id: "250-500", name: "250€ - 500€", count: 987 },
    { id: "500-1000", name: "500€ - 1000€", count: 543 },
    { id: "over-1000", name: "Plus de 1000€", count: 298 },
  ];

  const defaultDeliveryTimes = [
    { id: "express", name: "Express (24h)", count: 432 },
    { id: "1-day", name: "1 jour", count: 654 },
    { id: "3-days", name: "3 jours", count: 1876 },
    { id: "7-days", name: "7 jours", count: 2341 },
    { id: "14-days", name: "14 jours", count: 1234 },
    { id: "30-days", name: "30 jours", count: 654 },
    { id: "flexible", name: "Flexible", count: 321 },
  ];

  const sortOptions = [
    { value: "relevance", label: "Pertinence" },
    { value: "rating", label: "Mieux notés" },
    { value: "price_low", label: "Prix croissant" },
    { value: "price_high", label: "Prix décroissant" },
    { value: "delivery", label: "Livraison rapide" },
    { value: "reviews", label: "Plus d'avis" },
    { value: "recent", label: "Plus récents" },
  ];

  // Tags suggérés par défaut
  const defaultSuggestedTags = [
    "site web portfolio",
    "ecommerce",
    "sécurité cyber",
    "google ads",
    "design graphique",
    "logo professionnel",
    "site wordpress",
    "marketing digital",
    "application mobile",
    "shopify",
    "seo optimization",
    "réseaux sociaux",
    "vidéo marketing",
  ];

  // Génération des données de test
  const generateMockData = () => {
    const freelancerNames = [
      "Yahya N",
      "Marcello C",
      "Gaurav P",
      "Eloise T",
      "Marie Laurent",
      "Ahmed Benali",
      "Sophie Dubois",
      "Jean-Luc Martin",
      "Amina Khoury",
      "Pierre Rousseau",
      "Fatima Zahra",
      "Lucas Girard",
      "Nadia Hassan",
      "Thomas Bernard",
      "Samira Ahmed",
      "Nicolas Petit",
      "Leila Moreau",
      "David Lefebvre",
      "Rachid Tounsi",
      "Camille Vincent",
      "Omar Slimani",
      "Julie Fournier",
      "Karim Nasser",
      "Alice Robert",
      "Youssef Chakir",
      "Emma Durand",
      "Hassan Mouloud",
      "Chloe Blanchard",
      "Mehdi Khalil",
      "Sarah Joly",
    ];

    const serviceTitles = [
      "Je vais créer un site web Shopify professionnel pour votre boutique en ligne",
      "Je vais développer un site WordPress responsive sur mesure avec SEO optimisé",
      "Je vais upgrader et moderniser votre site Joomla avec un design contemporain",
      "Je vais créer un site web Wix professionnel et attractif pour votre entreprise",
      "Je vais développer une application web React complète et performante",
      "Je vais créer un site e-commerce complet avec Django et Python",
      "Je vais designer votre logo professionnel et votre identité visuelle en 24h",
      "Je vais optimiser votre site web pour le référencement SEO Google",
      "Je vais créer votre identité visuelle complète (logo, charte graphique, supports)",
      "Je vais développer votre application mobile iOS et Android native",
      "Je vais rédiger vos contenus web professionnels et optimisés SEO",
      "Je vais créer et gérer vos campagnes Google Ads et Facebook Ads performantes",
      "Je vais monter et éditer vos vidéos avec des effets professionnels",
      "Je vais développer votre chatbot ou bot Discord personnalisé et intelligent",
      "Je vais créer votre site vitrine professionnel avec WordPress et Elementor",
      "Je vais optimiser la vitesse et les performances de votre site web",
      "Je vais traduire vos contenus web en plusieurs langues avec précision",
      "Je vais créer vos templates et campagnes email marketing professionnels",
      "Je vais développer votre extension Chrome ou Firefox sur mesure",
      "Je vais créer vos présentations PowerPoint et Keynote professionnelles et percutantes",
      "Je vais développer votre API REST ou GraphQL sécurisée et documentée",
      "Je vais créer votre système de gestion de contenu (CMS) personnalisé",
      "Je vais intégrer des solutions de paiement sécurisées sur votre site",
      "Je vais créer vos infographies et visuels pour les réseaux sociaux",
      "Je vais développer votre marketplace ou plateforme e-commerce complexe",
    ];

    const results = [];

    for (let i = 1; i <= 250; i++) {
      const randomName =
        freelancerNames[Math.floor(Math.random() * freelancerNames.length)];
      const randomTitle =
        serviceTitles[Math.floor(Math.random() * serviceTitles.length)];
      const randomCategory =
        defaultCategories[Math.floor(Math.random() * defaultCategories.length)]
          .id;
      const randomDeliveryTime =
        defaultDeliveryTimes[
          Math.floor(Math.random() * defaultDeliveryTimes.length)
        ].id;

      results.push({
        id: i,
        title: randomTitle,
        freelancer: {
          name: randomName,
          level:
            Math.random() > 0.7
              ? "Level 2"
              : Math.random() > 0.4
              ? "Level 1"
              : "Nouveau vendeur",
          verified: Math.random() > 0.3,
          pro: Math.random() > 0.8,
          online: Math.random() > 0.5,
          instantResponse: Math.random() > 0.6,
          frenchSpeaker: Math.random() > 0.3,
          isNew: Math.random() > 0.85,
          certified: Math.random() > 0.7,
        },
        rating: Number((3.8 + Math.random() * 1.2).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 200) + 1,
        startingPrice: Math.floor(Math.random() * 1500) + 15,
        isFavorited: Math.random() > 0.95,
        category: randomCategory,
        deliveryTime: randomDeliveryTime,
        // Options de service
        hasUnlimitedRevisions: Math.random() > 0.6,
        fastDelivery: Math.random() > 0.7,
        support247: Math.random() > 0.8,
        includesSource: Math.random() > 0.5,
        includesTraining: Math.random() > 0.85,
        moneyBackGuarantee: Math.random() > 0.7,
        commercialUse: Math.random() > 0.6,
        expressDelivery: Math.random() > 0.8,
      });
    }

    return results;
  };

  const allResults = useMemo(() => generateMockData(), []);

  // Fonction de filtrage avancée
  const filteredResults = useMemo(() => {
    let filtered = allResults.filter((result) =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filtrage par catégorie
    if (selectedFilters.category) {
      filtered = filtered.filter(
        (result) => result.category === selectedFilters.category
      );
    }

    // Filtrage par options de service (ET logique - toutes les options sélectionnées doivent être présentes)
    if (selectedFilters.serviceOptions.length > 0) {
      filtered = filtered.filter((result) => {
        return selectedFilters.serviceOptions.every((option) => {
          switch (option) {
            case "unlimited-revisions":
              return result.hasUnlimitedRevisions;
            case "fast-delivery":
              return result.fastDelivery;
            case "support-24-7":
              return result.support247;
            case "source-code":
              return result.includesSource;
            case "training":
              return result.includesTraining;
            case "money-back":
              return result.moneyBackGuarantee;
            case "commercial-use":
              return result.commercialUse;
            case "express-delivery":
              return result.expressDelivery;
            default:
              return true;
          }
        });
      });
    }

    // Filtrage par détails vendeur (OU logique - au moins une des options sélectionnées)
    if (selectedFilters.sellerDetails.length > 0) {
      filtered = filtered.filter((result) => {
        return selectedFilters.sellerDetails.some((detail) => {
          switch (detail) {
            case "verified":
              return result.freelancer.verified;
            case "new-sellers":
              return result.freelancer.isNew;
            case "pro-sellers":
              return result.freelancer.pro;
            case "french-speakers":
              return result.freelancer.frenchSpeaker;
            case "online-now":
              return result.freelancer.online;
            case "top-rated":
              return result.rating >= 4.8;
            case "certified":
              return result.freelancer.certified;
            default:
              return true;
          }
        });
      });
    }

    // Filtrage par budget
    if (selectedFilters.budget) {
      filtered = filtered.filter((result) => {
        const price = result.startingPrice;
        switch (selectedFilters.budget) {
          case "under-25":
            return price < 25;
          case "25-50":
            return price >= 25 && price <= 50;
          case "50-100":
            return price >= 50 && price <= 100;
          case "100-250":
            return price >= 100 && price <= 250;
          case "250-500":
            return price >= 250 && price <= 500;
          case "500-1000":
            return price >= 500 && price <= 1000;
          case "over-1000":
            return price > 1000;
          default:
            return true;
        }
      });
    }

    // Filtrage par délai de livraison
    if (selectedFilters.deliveryTime) {
      filtered = filtered.filter(
        (result) => result.deliveryTime === selectedFilters.deliveryTime
      );
    }

    // Filtres booléens
    if (selectedFilters.proServices) {
      filtered = filtered.filter((result) => result.freelancer.pro);
    }

    if (selectedFilters.instantResponse) {
      filtered = filtered.filter((result) => result.freelancer.instantResponse);
    }

    return filtered;
  }, [allResults, searchQuery, selectedFilters]);

  // Fonction de tri
  const sortedResults = useMemo(() => {
    const sorted = [...filteredResults];

    switch (sortBy) {
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "price_low":
        return sorted.sort((a, b) => a.startingPrice - b.startingPrice);
      case "price_high":
        return sorted.sort((a, b) => b.startingPrice - a.startingPrice);
      case "delivery":
        const deliveryOrder = {
          express: 1,
          "1-day": 2,
          "3-days": 3,
          "7-days": 4,
          "14-days": 5,
          "30-days": 6,
          flexible: 7,
        };
        return sorted.sort(
          (a, b) =>
            deliveryOrder[a.deliveryTime] - deliveryOrder[b.deliveryTime]
        );
      case "reviews":
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      case "recent":
        return sorted.sort((a, b) => b.id - a.id); // Plus récents en premier
      default: // relevance
        return sorted;
    }
  }, [filteredResults, sortBy]);

  const resultsPerPage = 16;
  const totalResults = sortedResults.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  // Résultats paginés
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return sortedResults.slice(startIndex, endIndex);
  }, [sortedResults, currentPage, resultsPerPage]);

  // Gestion des changements de page
  const handlePageChange = (page) => {
    setIsLoading(true);
    setCurrentPage(page);
    setTimeout(() => {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 400);
  };

  // Reset pagination quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters, sortBy, searchQuery]);

  // Gestion des dropdowns desktop
  const toggleDropdown = (dropdown) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const closeAllDropdowns = () => {
    setOpenDropdowns({
      category: false,
      serviceOptions: false,
      sellerDetails: false,
      budget: false,
      deliveryTime: false,
      sort: false,
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
      category: "",
      serviceOptions: [],
      sellerDetails: [],
      budget: "",
      deliveryTime: "",
      proServices: false,
      instantResponse: false,
    });
    setShowMobileFilters(false);
  };

  // Vérification si des filtres sont actifs
  const hasActiveFilters =
    selectedFilters.category ||
    selectedFilters.serviceOptions.length > 0 ||
    selectedFilters.sellerDetails.length > 0 ||
    selectedFilters.budget ||
    selectedFilters.deliveryTime ||
    selectedFilters.proServices ||
    selectedFilters.instantResponse;

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedFilters.category) count++;
    count += selectedFilters.serviceOptions.length;
    count += selectedFilters.sellerDetails.length;
    if (selectedFilters.budget) count++;
    if (selectedFilters.deliveryTime) count++;
    if (selectedFilters.proServices) count++;
    if (selectedFilters.instantResponse) count++;
    return count;
  };

  // Fonctions utilitaires pour récupérer les noms
  const getCategoryName = (categoryId) => {
    return (
      defaultCategories.find((c) => c.id === categoryId)?.name || categoryId
    );
  };

  const getServiceOptionName = (optionId) => {
    return (
      defaultServiceOptions.find((o) => o.id === optionId)?.name || optionId
    );
  };

  const getSellerDetailName = (detailId) => {
    return (
      defaultSellerDetails.find((d) => d.id === detailId)?.name || detailId
    );
  };

  const getBudgetName = (budgetId) => {
    return defaultBudgetRanges.find((b) => b.id === budgetId)?.name || budgetId;
  };

  const getDeliveryTimeName = (deliveryId) => {
    return (
      defaultDeliveryTimes.find((d) => d.id === deliveryId)?.name || deliveryId
    );
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
        {/* Header de la modal */}
        <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
          <h3 className="text-lg font-semibold text-gray-900">
            Filtres de recherche
          </h3>
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
          {/* Catégorie */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Catégorie
            </h4>
            <div className="grid grid-cols-1 gap-1 max-h-52 overflow-y-auto bg-gray-50 rounded-lg p-2">
              <label className="flex items-center space-x-3 p-2 hover:bg-white rounded cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="category"
                  checked={!selectedFilters.category}
                  onChange={() => handleFilterChange("category", "")}
                  className="w-4 h-4 text-green-600 focus:ring-green-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-900 flex-1 font-medium">
                  Toutes les catégories
                </span>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                  {allResults.length}
                </span>
              </label>
              {defaultCategories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center space-x-3 p-2 hover:bg-white rounded cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="category"
                    checked={selectedFilters.category === category.id}
                    onChange={() => handleFilterChange("category", category.id)}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-700 flex-1">
                    {category.name}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                    {category.count}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Options de service */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Options de service
            </h4>
            <div className="grid grid-cols-1 gap-1 max-h-52 overflow-y-auto bg-gray-50 rounded-lg p-2">
              {defaultServiceOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center space-x-3 p-2 hover:bg-white rounded cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.serviceOptions.includes(option.id)}
                    onChange={() =>
                      handleFilterChange("serviceOptions", option.id)
                    }
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 rounded"
                  />
                  <span className="text-sm text-gray-700 flex-1">
                    {option.name}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                    {option.count}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Détails vendeur */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Détails vendeur
            </h4>
            <div className="grid grid-cols-1 gap-1 max-h-52 overflow-y-auto bg-gray-50 rounded-lg p-2">
              {defaultSellerDetails.map((detail) => (
                <label
                  key={detail.id}
                  className="flex items-center space-x-3 p-2 hover:bg-white rounded cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.sellerDetails.includes(detail.id)}
                    onChange={() =>
                      handleFilterChange("sellerDetails", detail.id)
                    }
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 rounded"
                  />
                  <span className="text-sm text-gray-700 flex-1">
                    {detail.name}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                    {detail.count}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              Fourchette de prix
            </h4>
            <div className="grid grid-cols-1 gap-1 bg-gray-50 rounded-lg p-2">
              <label className="flex items-center space-x-3 p-2 hover:bg-white rounded cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="budget"
                  checked={!selectedFilters.budget}
                  onChange={() => handleFilterChange("budget", "")}
                  className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-900 flex-1 font-medium">
                  Tous les budgets
                </span>
              </label>
              {defaultBudgetRanges.map((budget) => (
                <label
                  key={budget.id}
                  className="flex items-center space-x-3 p-2 hover:bg-white rounded cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="budget"
                    checked={selectedFilters.budget === budget.id}
                    onChange={() => handleFilterChange("budget", budget.id)}
                    className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-700 flex-1">
                    {budget.name}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                    {budget.count}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Délai de livraison */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              Délai de livraison
            </h4>
            <div className="grid grid-cols-1 gap-1 bg-gray-50 rounded-lg p-2">
              <label className="flex items-center space-x-3 p-2 hover:bg-white rounded cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="deliveryTime"
                  checked={!selectedFilters.deliveryTime}
                  onChange={() => handleFilterChange("deliveryTime", "")}
                  className="w-4 h-4 text-red-600 focus:ring-red-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-900 flex-1 font-medium">
                  Tous les délais
                </span>
              </label>
              {defaultDeliveryTimes.map((time) => (
                <label
                  key={time.id}
                  className="flex items-center space-x-3 p-2 hover:bg-white rounded cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="deliveryTime"
                    checked={selectedFilters.deliveryTime === time.id}
                    onChange={() => handleFilterChange("deliveryTime", time.id)}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-700 flex-1">
                    {time.name}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                    {time.count}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Options spéciales */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
              Options spéciales
            </h4>
            <div className="space-y-3 bg-gray-50 rounded-lg p-3">
              <label className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:shadow-sm transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-1 rounded">
                    <Star className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Services Pro uniquement
                  </span>
                </div>
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

              <label className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:shadow-sm transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-1 rounded">
                    <Clock className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      Réponse instantanée
                    </span>
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      Nouveau
                    </span>
                  </div>
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
              <span>Voir les résultats</span>
              <span className="bg-green-500 text-white text-sm px-2 py-0.5 rounded-full">
                {totalResults}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 mt-32">
      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20 py-6">
        {/* Suggested Tags */}
        <div className="mb-6">
          <div className="flex items-start space-x-4">
            <span className="text-sm font-medium text-gray-900 mt-2">
              Suggestions
            </span>
            <div className="flex flex-wrap gap-2">
              {defaultSuggestedTags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(tag)}
                  className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm hover:bg-gray-200 hover:shadow-sm transition-all duration-200"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Résultats pour{" "}
            <span className="font-normal text-gray-700">"{searchQuery}"</span>
          </h1>

          {/* Mobile Filter Button */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <p className="text-gray-600">
              <span className="font-semibold">
                {totalResults.toLocaleString()}
              </span>{" "}
              résultats
            </p>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative"
            >
              <SlidersHorizontal className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Filtres</span>
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full font-medium min-w-[20px] text-center">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
              <div className="flex items-start justify-between">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-semibold text-blue-800 mr-2 flex items-center">
                    <Filter className="h-4 w-4 mr-1" />
                    Filtres actifs:
                  </span>

                  {selectedFilters.category && (
                    <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full border border-green-200">
                      <span className="font-medium">
                        {getCategoryName(selectedFilters.category)}
                      </span>
                      <button
                        onClick={() => handleFilterChange("category", "")}
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

          {/* Desktop Filters Row */}
          <div className="hidden lg:flex flex-wrap items-center gap-4 mb-6 relative">
            {/* Service Options Filter */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("serviceOptions");
                }}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-lg hover:border-gray-400 transition-colors ${
                  selectedFilters.serviceOptions.length > 0
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300"
                }`}
              >
                <span className="text-sm font-medium">
                  Options de service{" "}
                  {selectedFilters.serviceOptions.length > 0 &&
                    `(${selectedFilters.serviceOptions.length})`}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {openDropdowns.serviceOptions && (
                <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-20 min-w-80 max-h-72 overflow-hidden">
                  <div className="p-2 border-b">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Options disponibles
                    </span>
                  </div>
                  <div className="py-2 max-h-60 overflow-y-auto">
                    {defaultServiceOptions.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters.serviceOptions.includes(
                            option.id
                          )}
                          onChange={() =>
                            handleFilterChange("serviceOptions", option.id)
                          }
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded mr-3"
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

            {/* Budget Filter */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("budget");
                }}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-lg hover:border-gray-400 transition-colors ${
                  selectedFilters.budget
                    ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                    : "border-gray-300"
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
                  <div className="p-2 border-b">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Fourchettes de prix
                    </span>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => handleFilterChange("budget", "")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Tous les budgets
                    </button>
                    {defaultBudgetRanges.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleFilterChange("budget", option.id)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex justify-between items-center transition-colors ${
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

            {/* Delivery Time Filter */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("deliveryTime");
                }}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-lg hover:border-gray-400 transition-colors ${
                  selectedFilters.deliveryTime
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-300"
                }`}
              >
                <span className="text-sm font-medium">
                  {selectedFilters.deliveryTime
                    ? getDeliveryTimeName(selectedFilters.deliveryTime)
                    : "Délai de livraison"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {openDropdowns.deliveryTime && (
                <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-20 min-w-56">
                  <div className="p-2 border-b">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Temps de livraison
                    </span>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => handleFilterChange("deliveryTime", "")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Tous les délais
                    </button>
                    {defaultDeliveryTimes.map((option) => (
                      <button
                        key={option.id}
                        onClick={() =>
                          handleFilterChange("deliveryTime", option.id)
                        }
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex justify-between items-center transition-colors ${
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

            {/* Toggle Filters */}
            <div className="flex items-center space-x-6 ml-auto">
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedFilters.proServices}
                    onChange={(e) =>
                      setSelectedFilters({
                        ...selectedFilters,
                        proServices: e.target.checked,
                      })
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
                      className={`w-4 h-4 bg-white rounded-full mt-1 mx-1 transition-transform shadow ${
                        selectedFilters.proServices ? "translate-x-5" : ""
                      }`}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium flex items-center">
                  <Star className="h-4 w-4 mr-1 text-purple-600" />
                  Services Pro
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedFilters.instantResponse}
                    onChange={(e) =>
                      setSelectedFilters({
                        ...selectedFilters,
                        instantResponse: e.target.checked,
                      })
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
                      className={`w-4 h-4 bg-white rounded-full mt-1 mx-1 transition-transform shadow ${
                        selectedFilters.instantResponse ? "translate-x-5" : ""
                      }`}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-green-600" />
                  Réponse instantanée
                  <span className="ml-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    Nouveau
                  </span>
                </span>
              </label>
            </div>
          </div>

          {/* Sort Controls - Desktop */}
          <div className="hidden lg:flex justify-between items-center">
            <p className="text-gray-600 flex items-center">
              <span className="font-semibold text-lg">
                {totalResults.toLocaleString()}
              </span>
              <span className="ml-1">résultats trouvés</span>
              {hasActiveFilters && (
                <span className="ml-2 text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {getActiveFiltersCount()} filtre
                  {getActiveFiltersCount() > 1 ? "s" : ""} actif
                  {getActiveFiltersCount() > 1 ? "s" : ""}
                </span>
              )}
            </p>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 font-medium">
                Trier par:
              </span>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("sort");
                  }}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 bg-white transition-colors"
                >
                  <span className="text-sm font-medium">
                    {
                      sortOptions.find((option) => option.value === sortBy)
                        ?.label
                    }
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
            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedResults.map((result) => (
                <div
                  key={result.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
                >
                  {/* Service Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <div className="bg-white/25 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                        <div className="text-white font-bold text-lg mb-1">
                          {result.title.split(" ").slice(0, 3).join(" ")}
                        </div>
                        <div className="text-white/90 text-sm">
                          {getCategoryName(result.category)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFavorite(result.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors group"
                    >
                      <Heart
                        className={`h-5 w-5 transition-colors ${
                          result.isFavorited
                            ? "fill-red-500 text-red-500"
                            : "text-white group-hover:text-red-300"
                        }`}
                      />
                    </button>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {result.freelancer.pro && (
                        <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg flex items-center">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          PRO
                        </span>
                      )}
                      {result.freelancer.instantResponse && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Rapide
                        </span>
                      )}
                      {result.freelancer.certified && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                          Certifié
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    {/* Freelancer Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div
                          className={`w-7 h-7 rounded-full mr-3 border-2 ${
                            result.freelancer.online
                              ? "bg-green-300 border-green-400"
                              : "bg-gray-300 border-gray-400"
                          }`}
                        ></div>
                        <div>
                          <span className="text-sm text-gray-600">Par </span>
                          <span className="font-semibold text-gray-900">
                            {result.freelancer.name}
                          </span>
                          {result.freelancer.verified && (
                            <CheckCircle className="h-4 w-4 text-green-500 ml-1 inline" />
                          )}
                        </div>
                      </div>
                      <span className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium">
                        {result.freelancer.level}
                      </span>
                    </div>

                    {/* Service Title */}
                    <h3 className="font-semibold text-gray-900 mb-4 line-clamp-2 hover:text-green-600 cursor-pointer transition-colors group-hover:text-green-600">
                      {result.title}
                    </h3>

                    {/* Rating & Delivery */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center bg-yellow-50 rounded-lg px-2 py-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-sm font-bold text-gray-900">
                          {result.rating}
                        </span>
                        <span className="text-sm text-gray-600 ml-1">
                          ({result.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg px-2 py-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {getDeliveryTimeName(result.deliveryTime)}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right border-t border-gray-100 pt-4">
                      <div className="text-sm text-gray-500 mb-1">
                        À partir de
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        €{result.startingPrice}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {paginatedResults.length === 0 && !isLoading && (
              <div className="text-center py-20">
                <div className="text-gray-400 mb-6">
                  <Search className="h-24 w-24 mx-auto mb-6" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Aucun résultat trouvé
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Aucun service ne correspond à vos critères de recherche.
                  Essayez d'ajuster vos filtres ou utilisez d'autres mots-clés.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={clearAllFilters}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg"
                  >
                    Effacer tous les filtres
                  </button>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Nouvelle recherche
                  </button>
                </div>
              </div>
            )}

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

                {/* Page Numbers */}
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
                      {totalResults.toLocaleString()}
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

export default SearchResultsPage;
