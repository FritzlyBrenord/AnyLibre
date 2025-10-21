"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  X,
  Filter,
  Star,
  TrendingUp,
  Clock,
  MapPin,
  Tag,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { searchTags } from "@/Component/Data/Service/Service";
import { ServiceCard } from "../CadreService/CadreService";
import { useFreelances } from "@/Context/Freelance/FreelanceContext";
import { useServices } from "@/Context/Freelance/ContextService";
import { useRouter, useSearchParams } from "next/navigation";

// Types pour les données
interface ProfileData {
  name: string;
  username: string;
  level: string;
  description: string;
  rating: string;
  location: string;
  language: string[];
  contact: {
    localTime: string;
  };
}

interface Freelance {
  id: string;
  nom: string;
  prenom: string;
  username: string;
  description: string;
  occupations: string[];
  competences: string[];
  formations: Formation[];
  certifications: Certification[];
  sites_web: string[];
}

interface Formation {
  pays: string;
  universite: string;
  annee: string;
  id?: number;
}

interface Certification {
  nom: string;
  annee: string;
  id?: number;
}

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

interface ServiceDisplay {
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

interface SearchSuggestion {
  text: string;
  type: "tag" | "service" | "category";
  count?: number;
  category?: string;
}

interface FilterState {
  category: string;
  priceRange: [number, number];
  rating: number;
  deliveryTime: number;
  tagCategory: string;
  sortBy: string;
}

const RechercheServices: React.FC = () => {
  const { services, rechercherServices } = useServices();
  const { freelances, getPhotoProfileUrl } = useFreelances();
  const router = useRouter();
  const searchParams = useSearchParams();

  // États de recherche
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(12);

  const [filters, setFilters] = useState<FilterState>({
    category: "",
    priceRange: [0, 1000],
    rating: 0,
    deliveryTime: 30,
    tagCategory: "all",
    sortBy: "relevance",
  });

  // Combiner tous les tags en un seul tableau
  const allTags = useMemo(() => {
    return Object.values(searchTags).flat();
  }, []);

  // Tags par catégorie pour les filtres
  const tagsByCategory = useMemo(() => {
    return Object.entries(searchTags).map(([category, tags]) => ({
      category,
      tags,
      count: tags.length,
    }));
  }, []);

  // Extraire toutes les catégories uniques des services
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    services.forEach((service) => {
      if (service.category) categories.add(service.category);
    });
    return Array.from(categories);
  }, [services]);

  // Générer les suggestions de recherche
  const generateSuggestions = useCallback(
    (term: string): SearchSuggestion[] => {
      if (term.length < 2) return [];

      const termLower = term.toLowerCase();
      const suggestions: SearchSuggestion[] = [];

      // Suggestions basées sur les tags (avec catégorie)
      const tagSuggestions = allTags
        .filter((tag) => tag.toLowerCase().includes(termLower))
        .slice(0, 8)
        .map((tag) => {
          // Trouver la catégorie du tag
          const category =
            Object.entries(searchTags).find(([cat, tags]) =>
              tags.includes(tag)
            )?.[0] || "general";

          return {
            text: tag,
            type: "tag" as const,
            count: services.filter((s) => s.tags?.includes(tag)).length,
            category,
          };
        });

      suggestions.push(...tagSuggestions);

      // Suggestions basées sur les titres de services
      const serviceSuggestions = services
        .filter(
          (service) =>
            service.title.toLowerCase().includes(termLower) ||
            service.description.toLowerCase().includes(termLower)
        )
        .slice(0, 5)
        .map((service) => ({
          text: service.title,
          type: "service" as const,
        }));

      suggestions.push(...serviceSuggestions);

      // Suggestions basées sur les catégories
      const categorySuggestions = allCategories
        .filter((category) => category.toLowerCase().includes(termLower))
        .slice(0, 3)
        .map((category) => ({
          text: category,
          type: "category" as const,
          count: services.filter((s) => s.category === category).length,
        }));

      suggestions.push(...categorySuggestions);

      return suggestions.slice(0, 12);
    },
    [services, allTags, allCategories]
  );

  // Effectuer la recherche
  const performSearch = useCallback(() => {
    let results = services;

    // Recherche par terme
    if (searchTerm.trim()) {
      results = rechercherServices(searchTerm);
    }

    // Filtrage par tags sélectionnés
    if (selectedTags.length > 0) {
      results = results.filter((service) =>
        selectedTags.some((tag) =>
          service.tags?.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
        )
      );
    }

    // Appliquer les autres filtres
    if (filters.category) {
      results = results.filter(
        (service) => service.category === filters.category
      );
    }

    // Filtrer par prix
    results = results.filter((service) => {
      const price = service.packages?.[0]?.price
        ? parseFloat(service.packages[0].price)
        : 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Trier les résultats
    switch (filters.sortBy) {
      case "price-low":
        results.sort((a, b) => {
          const priceA = a.packages?.[0]?.price
            ? parseFloat(a.packages[0].price)
            : 0;
          const priceB = b.packages?.[0]?.price
            ? parseFloat(b.packages[0].price)
            : 0;
          return priceA - priceB;
        });
        break;
      case "price-high":
        results.sort((a, b) => {
          const priceA = a.packages?.[0]?.price
            ? parseFloat(a.packages[0].price)
            : 0;
          const priceB = b.packages?.[0]?.price
            ? parseFloat(b.packages[0].price)
            : 0;
          return priceB - priceA;
        });
        break;
      case "newest":
        results.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "rating":
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Par défaut, tri par pertinence
        break;
    }

    setSearchResults(results);
  }, [searchTerm, selectedTags, filters, services, rechercherServices]);

  // Gérer la saisie de recherche
  const handleSearchInput = (value: string) => {
    setSearchTerm(value);

    if (value.length >= 2) {
      const newSuggestions = generateSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Sélectionner une suggestion
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    if (suggestion.type === "tag") {
      if (!selectedTags.includes(suggestion.text)) {
        setSelectedTags((prev) => [...prev, suggestion.text]);
      }
      setSearchTerm("");
    } else {
      setSearchTerm(suggestion.text);
    }
    setShowSuggestions(false);
  };

  // Ajouter un tag depuis la liste
  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  // Supprimer un tag
  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  // Effacer tous les filtres
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
    setFilters({
      category: "",
      priceRange: [0, 1000],
      rating: 0,
      deliveryTime: 30,
      tagCategory: "all",
      sortBy: "relevance",
    });
    setCurrentPage(1);
  };

  // Mettre à jour l'URL avec les paramètres de recherche
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("q", searchTerm);
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
    if (filters.category) params.set("category", filters.category);
    if (filters.sortBy !== "relevance") params.set("sort", filters.sortBy);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [searchTerm, selectedTags, filters.category, filters.sortBy]);

  // Récupérer les paramètres depuis l'URL au chargement
  useEffect(() => {
    const urlSearchTerm = searchParams.get("q");
    const urlTags = searchParams.get("tags");
    const urlCategory = searchParams.get("category");
    const urlSort = searchParams.get("sort");

    if (urlSearchTerm) setSearchTerm(urlSearchTerm);
    if (urlTags) setSelectedTags(urlTags.split(","));
    if (urlCategory) setFilters((prev) => ({ ...prev, category: urlCategory }));
    if (urlSort) setFilters((prev) => ({ ...prev, sortBy: urlSort }));
  }, [searchParams]);

  // Recherche initiale et lors des changements
  useEffect(() => {
    performSearch();
    updateURL();
  }, [performSearch, updateURL]);

  // Tags populaires (basés sur la fréquence dans les services)
  const popularTags = useMemo(() => {
    const tagCounts: { [key: string]: number } = {};

    services.forEach((service) => {
      service.tags?.forEach((tag) => {
        if (allTags.includes(tag)) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      });
    });

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15)
      .map(([tag]) => tag);
  }, [services, allTags]);

  // Tags filtrés par catégorie sélectionnée
  const filteredTags = useMemo(() => {
    if (filters.tagCategory === "all") {
      return allTags.slice(0, 50);
    }
    return searchTags[filters.tagCategory as keyof typeof searchTags] || [];
  }, [filters.tagCategory, allTags]);

  // Statistiques de recherche
  const searchStats = useMemo(() => {
    return {
      totalServices: services.length,
      filteredServices: searchResults.length,
      activeTags: selectedTags.length,
      isFiltered:
        selectedTags.length > 0 ||
        searchTerm.trim() !== "" ||
        filters.category !== "" ||
        filters.sortBy !== "relevance" ||
        filters.priceRange[0] > 0 ||
        filters.priceRange[1] < 1000,
    };
  }, [
    services.length,
    searchResults.length,
    selectedTags.length,
    searchTerm,
    filters.category,
    filters.sortBy,
    filters.priceRange,
  ]);

  // Pagination
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return searchResults.slice(startIndex, startIndex + itemsPerPage);
  }, [searchResults, currentPage, itemsPerPage]);

  // Préparer les données pour ServiceCard
  const preparedServices = useMemo(() => {
    return paginatedResults.map((service) => {
      const freelance = freelances.find((f) => f.id === service.freelance_id);
      const price = service.packages?.[0]?.price
        ? parseFloat(service.packages[0].price)
        : 0;

      return {
        ...service,
        seller: freelance
          ? {
              name: `${freelance.prenom} ${freelance.nom}`,
              level: "Expert",
              isTopRated: true,
              isOnline: true,
              photo_url: freelance.photo_url
                ? getPhotoProfileUrl(freelance.photo_url)
                : undefined,
            }
          : {
              name: "Freelance",
              level: "Expert",
              isTopRated: false,
              isOnline: true,
            },
        price: price,
        rating: service.rating || 4.5,
        reviews: service.reviews || Math.floor(Math.random() * 100) + 10,
        badges: service.tags?.slice(0, 3) || [],
      };
    });
  }, [paginatedResults, freelances, getPhotoProfileUrl]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête de recherche */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          {/* Barre de recherche principale */}
          <div className="relative max-w-4xl mx-auto mb-4 mt-20">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Rechercher un service, une compétence, un tag..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg placeholder-gray-400"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl mt-2 max-h-80 overflow-y-auto z-50">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0 group"
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded mr-3 ${
                            suggestion.type === "tag"
                              ? "bg-blue-100 text-blue-600"
                              : suggestion.type === "service"
                              ? "bg-green-100 text-green-600"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {suggestion.type === "tag" && (
                            <Tag className="w-3 h-3" />
                          )}
                          {suggestion.type === "service" && (
                            <Search className="w-3 h-3" />
                          )}
                          {suggestion.type === "category" && (
                            <Filter className="w-3 h-3" />
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">
                              {suggestion.text}
                            </span>
                            {suggestion.category && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full capitalize">
                                {suggestion.category}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 capitalize">
                            {suggestion.type}
                          </span>
                        </div>
                      </div>
                      {suggestion.count !== undefined && (
                        <span className="text-sm text-gray-400 bg-gray-100 px-2 py-1 rounded-full min-w-8 text-center">
                          {suggestion.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tags sélectionnés */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 max-w-4xl mx-auto">
              <span className="text-sm text-gray-600 font-medium">
                Tags actifs :
              </span>
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-blue-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={() => setSelectedTags([])}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                Tout effacer
              </button>
            </div>
          )}

          {/* Tags populaires */}
          {popularTags.length > 0 && (
            <div className="max-w-6xl mx-auto mt-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Suggestions :
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleAddTag(tag)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors duration-200 font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar des filtres */}
          <div
            className={`lg:w-80 flex-shrink-0 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtres
                </h3>
                {searchStats.isFiltered && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Tout effacer
                  </button>
                )}
              </div>

              {/* Statistiques */}
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Services trouvés :</span>
                    <span className="font-semibold">
                      {searchStats.filteredServices}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tags actifs :</span>
                    <span className="font-semibold text-blue-600">
                      {searchStats.activeTags}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tri des résultats */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Trier par
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="relevance">Pertinence</option>
                  <option value="newest">Plus récents</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                  <option value="rating">Meilleures notes</option>
                </select>
              </div>

              {/* Filtre par catégorie de service */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Catégorie
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Toutes les catégories</option>
                  {allCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtre par prix */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Fourchette de prix ($)
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: [
                          prev.priceRange[0],
                          parseInt(e.target.value),
                        ],
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Filtre par catégorie de tags */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Catégorie de tags
                </label>
                <select
                  value={filters.tagCategory}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      tagCategory: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">Tous les tags</option>
                  {tagsByCategory.map(({ category, count }) => (
                    <option key={category} value={category}>
                      {category} ({count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Liste des tags par catégorie */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tags disponibles
                </label>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {filteredTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleAddTag(tag)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                        selectedTags.includes(tag)
                          ? "bg-blue-100 text-blue-800 font-medium"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Tag
                          className={`w-3 h-3 ${
                            selectedTags.includes(tag)
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        />
                        {tag}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Résultats de recherche */}
          <div className="flex-1">
            {/* En-tête des résultats */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchStats.isFiltered
                    ? "Résultats de la recherche"
                    : "Tous les services"}
                </h2>
                <p className="text-gray-600 mt-1">
                  {searchStats.filteredServices === searchStats.totalServices
                    ? `${searchStats.totalServices} services disponibles`
                    : `${searchStats.filteredServices} services sur ${searchStats.totalServices}`}
                  {selectedTags.length > 0 &&
                    ` • ${selectedTags.length} tag(s) actif(s)`}
                </p>
              </div>

              {/* Bouton filtre mobile */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtres
              </button>
            </div>

            {/* Grille des résultats */}
            {preparedServices.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {preparedServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onFavorite={(id) => console.log("Favorite:", id)}
                      isFavorited={false}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg border ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun service trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  Essayez de modifier vos critères de recherche ou vos tags
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Réinitialiser la recherche
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RechercheServices;
