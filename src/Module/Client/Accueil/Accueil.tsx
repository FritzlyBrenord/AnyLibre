"use client";
import {
  Shield,
  Award,
  Headphones,
  CheckCircle,
  TrendingUp,
  Clock,
  Users,
  Globe,
  Search,
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  User,
  X,
} from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { useServices } from "@/Context/Freelance/ContextService";
import { useFreelances } from "@/Context/Freelance/FreelanceContext";
import getDefaultServiceImage from "@/Component/Data/ImageDefault/ImageParDefaut";

import { useRouter } from "next/navigation";
import { searchTags } from "@/Component/Data/Service/Service";

const Accueil = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const router = useRouter();

  // Récupérer les données des contexts
  const { services, isLoading: servicesLoading } = useServices();
  const {
    freelances,
    getPhotoProfileUrl,
    isLoading: freelancesLoading,
  } = useFreelances();

  // Combiner tous les tags
  const allTags = useMemo(() => {
    return Object.values(searchTags).flat();
  }, []);

  // Tags populaires basés sur l'usage réel
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
      .slice(0, 12)
      .map(([tag]) => tag);
  }, [services, allTags]);

  // Suggestions de tags basées sur la recherche
  const tagSuggestions = useMemo(() => {
    if (searchQuery.length < 2) return popularTags.slice(0, 8);

    const query = searchQuery.toLowerCase();
    return allTags
      .filter((tag) => tag.toLowerCase().includes(query))
      .slice(0, 10);
  }, [searchQuery, allTags, popularTags]);

  // Gérer la recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.append("q", searchQuery.trim());
    }

    if (selectedTags.length > 0) {
      selectedTags.forEach((tag) => params.append("tags", tag));
    }

    const queryString = params.toString();
    router.push(`/ResultatRecherche${queryString ? `?${queryString}` : ""}`);
  };

  // Ajouter un tag
  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
      setSearchQuery("");
      setShowTagSuggestions(false);
    }
  };

  // Supprimer un tag
  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  // Effacer la recherche
  const clearSearch = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setShowTagSuggestions(false);
  };

  // Hero Slider Data
  const heroSlides = [
    {
      id: 1,
      title: "Trouvez le Freelance Expert pour Votre Projet",
      subtitle: `${freelances.length}+ freelances vérifiés • Résultats garantis`,
      description:
        "Des développeurs, designers, marketeurs et consultants prêts à transformer vos idées en succès",
      backgroundImage:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=2000&h=1000&fit=crop",
      cta: "Commencer Maintenant",
      searchPlaceholder:
        "Recherchez 'développeur React', 'logo design', 'marketing SEO'...",
    },
    {
      id: 2,
      title: "Développement Web & Mobile Premium",
      subtitle: "Applications sur-mesure • Technologies modernes",
      description:
        "React, Vue, Node.js, Python, Flutter - Nos experts maîtrisent toutes les technologies",
      backgroundImage:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=2000&h=1000&fit=crop",
      cta: "Voir les Développeurs",
      searchPlaceholder: "Site web, application mobile, API...",
    },
    {
      id: 3,
      title: "Design & Identité Visuelle Exceptionnels",
      subtitle: "Créatifs primés • Designs qui convertissent",
      description:
        "Logos, sites web, applications, branding complet - Donnez vie à votre vision",
      backgroundImage:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=2000&h=1000&fit=crop",
      cta: "Découvrir les Designers",
      searchPlaceholder: "Logo, identité visuelle, UI/UX design...",
    },
    {
      id: 4,
      title: "Marketing Digital & Croissance",
      subtitle: "ROI garanti • Stratégies data-driven",
      description:
        "SEO, Google Ads, Social Media, Content Marketing - Propulsez votre business",
      backgroundImage:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=2000&h=1000&fit=crop",
      cta: "Booster mon Marketing",
      searchPlaceholder: "SEO, Google Ads, réseaux sociaux...",
    },
  ];

  // Auto-play slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Calculer les catégories avec services (non vides)
  const categoriesWithServices = useMemo(() => {
    const categoryMap = new Map<
      string,
      { count: number; icon: string; avgPrice: number }
    >();

    services.forEach((service) => {
      if (service.statut === "actif") {
        const existing = categoryMap.get(service.category) || {
          count: 0,
          icon: "💼",
          avgPrice: 0,
        };
        const price = service.packages?.[0]?.price
          ? parseFloat(service.packages[0].price)
          : 0;

        categoryMap.set(service.category, {
          count: existing.count + 1,
          icon: getCategoryIcon(service.category),
          avgPrice:
            (existing.avgPrice * existing.count + price) / (existing.count + 1),
        });
      }
    });

    return Array.from(categoryMap.entries())
      .map(([name, data]) => ({
        name,
        icon: data.icon,
        serviceCount: data.count,
        trending: data.count > 3,
        avgPrice: `$${Math.round(data.avgPrice)}`,
      }))
      .filter((cat) => cat.serviceCount > 0) // Seulement les catégories non vides
      .sort((a, b) => b.serviceCount - a.serviceCount);
  }, [services]);

  // Fonction helper pour obtenir l'icône de catégorie
  function getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      "programmation-tech": "💻",
      "design-graphique": "🎨",
      "redaction-traduction": "✏️",
      audiovisuel: "🎬",
      "marketing-digital": "📈",
      consultation: "💼",
    };
    return icons[category] || "💼";
  }

  // Services populaires (services actifs triés par date)
  const popularServices = useMemo(() => {
    return services
      .filter((s) => s.statut === "actif")
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 4)
      .map((service) => {
        const freelance = freelances.find((f) => f.id === service.freelance_id);
        const price = service.packages?.[0]?.price
          ? parseFloat(service.packages[0].price)
          : 0;
        const imageUrl =
          service.images?.[0]?.url ||
          getDefaultServiceImage(service.category, service.subcategory);

        return {
          id: service.id,
          title: service.title,
          freelancer: freelance
            ? `${freelance.prenom} ${freelance.nom}`
            : "Anonyme",
          freelancerAvatar: freelance?.photo_url
            ? getPhotoProfileUrl(freelance.photo_url)
            : "",
          price: price,
          originalPrice: price * 1.4,
          rating: 4.8,
          reviewCount: Math.floor(Math.random() * 200) + 50,
          category: service.category,
          thumbnail: imageUrl,
          deliveryTime: service.packages?.[0]?.deliveryDays
            ? `${service.packages[0].deliveryDays} jours`
            : "7 jours",
          featured: true,
          level: "Expert Certifié",
        };
      });
  }, [services, freelances, getPhotoProfileUrl]);

  // Freelances en vedette (top 4 par ordre alphabétique)
  const featuredFreelancers = useMemo(() => {
    return freelances
      .filter((f) => f.statut === "actif")
      .slice(0, 4)
      .map((freelance) => {
        const freelanceServices = services.filter(
          (s) => s.freelance_id === freelance.id && s.statut === "actif"
        );
        const avgPrice =
          freelanceServices.length > 0
            ? freelanceServices.reduce(
                (sum, s) => sum + parseFloat(s.packages?.[0]?.price || "0"),
                0
              ) / freelanceServices.length
            : 50;

        return {
          id: freelance.id,
          name: `${freelance.prenom} ${freelance.nom}`,
          avatar: freelance.photo_url
            ? getPhotoProfileUrl(freelance.photo_url)
            : "",
          title: freelance.occupations?.[0] || "Freelance Professionnel",
          rating: 4.8,
          reviewCount: Math.floor(Math.random() * 300) + 50,
          skills: freelance.competences?.slice(0, 4) || [],
          hourlyRate: Math.round(avgPrice / 8),
          badge: "Top Rated",
          completedProjects: freelanceServices.length,
          responseTime: "< 2h",
          verified: true,
          location: `${freelance.ville}, ${freelance.pays}`,
        };
      });
  }, [freelances, services, getPhotoProfileUrl]);

  // Statistiques réelles
  const stats = useMemo(
    () => ({
      freelancers: freelances.filter((f) => f.statut === "actif").length,
      projects: services.filter((s) => s.statut === "actif").length,
      satisfaction: 98,
      countries: new Set(freelances.map((f) => f.pays)).size,
    }),
    [freelances, services]
  );

  // Features de confiance
  const trustFeatures = [
    {
      icon: Shield,
      title: "Paiement 100% Sécurisé",
      description:
        "Vos fonds sont protégés jusqu'à la livraison complète. Remboursement garanti en cas de non-conformité.",
      color: "text-green-600",
    },
    {
      icon: Award,
      title: "Freelances Vérifiés",
      description:
        "Chaque profil est authentifié : identité, compétences, références clients. 98% de satisfaction moyenne.",
      color: "text-blue-600",
    },
    {
      icon: Headphones,
      title: "Support Expert 24/7",
      description:
        "Notre équipe de spécialistes vous accompagne à chaque étape. Résolution sous 2h garantie.",
      color: "text-purple-600",
    },
    {
      icon: CheckCircle,
      title: "Garantie Qualité Premium",
      description:
        "Révisions illimitées incluses. Si vous n'êtes pas satisfait, nous trouvons une solution ou vous remboursons.",
      color: "text-red-600",
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: "Décrivez votre projet en détail",
      description:
        "Utilisez notre formulaire intelligent pour définir vos besoins précis, votre budget et vos délais.",
      icon: "📝",
      time: "3 minutes",
    },
    {
      step: 2,
      title: "Recevez des propositions personnalisées",
      description:
        "Les meilleurs freelances vous contactent directement avec des propositions sur-mesure.",
      icon: "💡",
      time: "24 heures",
    },
    {
      step: 3,
      title: "Collaborez en toute sérénité",
      description:
        "Outils de suivi en temps réel, paiements sécurisés par étapes, communication intégrée.",
      icon: "🤝",
      time: "Selon projet",
    },
  ];

  const whyChooseUs = [
    {
      icon: TrendingUp,
      stat: "+300%",
      label: "ROI moyen constaté",
      description: "Nos clients voient leur retour sur investissement tripler",
    },
    {
      icon: Clock,
      stat: "2h",
      label: "Temps de réponse moyen",
      description: "Support ultra-réactif et freelances disponibles",
    },
    {
      icon: Users,
      stat: "98%",
      label: "Projets livrés à temps",
      description: "Respect scrupuleux des délais convenus",
    },
    {
      icon: Globe,
      stat: `${stats.countries}`,
      label: "Pays représentés",
      description: "Travaillez avec des experts du monde entier",
    },
  ];

  // Témoignages (exemples)
  const testimonials = [
    {
      id: 1,
      clientName: "Client Satisfait",
      clientCompany: "Entreprise",
      clientRole: "CEO",
      avatar: "",
      rating: 5,
      comment:
        "Excellente plateforme pour trouver des freelances qualifiés. Les projets sont livrés à temps et la qualité est au rendez-vous.",
      projectType: "Développement web",
      projectBudget: `$${Math.round(popularServices[0]?.price || 1000)}`,
      completionTime: "4 semaines",
      verified: true,
    },
  ];

  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "HTG", symbol: "G" },
  ];

  if (servicesLoading || freelancesLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner Carousel */}
      <section className="hero-section relative h-screen overflow-hidden pt-16">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                currentSlide === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(${slide.backgroundImage})`,
                }}
              />
            </div>
          ))}
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="transition-all duration-1000 transform">
                <h1 className="text-3xl md:text-6xl font-bold mb-6 leading-tight">
                  {heroSlides[currentSlide].title}
                </h1>
                <p className="text-lg md:text-2xl mb-4 text-green-300 font-semibold">
                  {heroSlides[currentSlide].subtitle}
                </p>
                <p className="text-base md:text-xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
                  {heroSlides[currentSlide].description}
                </p>
              </div>

              {/* Tags sélectionnés */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm border border-white/30"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-gray-300 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Barre de recherche améliorée */}
              <div className="max-w-3xl mx-auto mb-10">
                <form onSubmit={handleSearch} className="relative">
                  <div className="bg-white p-4 rounded-xl shadow-2xl text-gray-600">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowTagSuggestions(e.target.value.length >= 2);
                          }}
                          onFocus={() => {
                            if (searchQuery.length >= 2)
                              setShowTagSuggestions(true);
                          }}
                          placeholder={
                            heroSlides[currentSlide].searchPlaceholder
                          }
                          className="w-full pl-12 pr-12 py-4 text-sm sm:text-lg border-0 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />

                        {/* Bouton effacer */}
                        {(searchQuery || selectedTags.length > 0) && (
                          <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-bold text-lg shadow-lg flex items-center justify-center min-w-[140px]"
                      >
                        <Search className="h-5 w-5 mr-2" />
                        Rechercher
                      </button>
                    </div>
                  </div>

                  {/* Suggestions de tags */}
                  {showTagSuggestions && tagSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50">
                      <div className="p-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-700">
                          Suggestions de tags :
                        </p>
                      </div>
                      {tagSuggestions.map((tag, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleAddTag(tag)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center">
                            <span className="text-blue-500 mr-3">#</span>
                            <span className="font-medium text-gray-900">
                              {tag}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                            Tag
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </form>
              </div>

              {/* Tags populaires */}
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                <span className="text-sm text-gray-300">Populaire :</span>
                {popularTags.slice(0, 6).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleAddTag(tag)}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm hover:bg-white/30 transition-colors border border-white/30"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push("/recherche")}
                  className="bg-green-600 text-white px-10 py-4 rounded-xl hover:bg-green-700 transition-all transform hover:scale-105 font-bold text-lg shadow-xl"
                >
                  {heroSlides[currentSlide].cta}
                </button>
                <button className="border-2 border-white text-white px-10 py-4 rounded-xl hover:bg-white hover:text-gray-900 transition-colors font-bold text-lg">
                  Voir Comment Ça Marche
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Le reste du code reste inchangé */}
      {/* Trust Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Pourquoi Choisir Anylibre ?
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16">
            La plateforme de référence pour vos projets freelance
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all text-center border-t-4 border-green-500"
                >
                  <div
                    className={`w-16 h-16 ${feature.color} bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6`}
                  >
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories (uniquement celles avec services) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Services les Plus Populaires
            </h2>
            <p className="text-xl text-gray-600">
              Des experts dans chaque domaine pour tous vos besoins
            </p>
          </div>

          {categoriesWithServices.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoriesWithServices.map((category, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105 border group"
                >
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {category.serviceCount} services disponibles
                  </p>
                  <p className="text-sm font-semibold text-green-600 mb-3">
                    À partir de {category.avgPrice}
                  </p>
                  {category.trending && (
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                        Tendance
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Aucune catégorie disponible pour le moment
            </div>
          )}
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Services Recommandés
            </h2>
            <p className="text-xl text-gray-600">
              Les meilleures offres sélectionnées par nos experts
            </p>
          </div>

          {popularServices.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {popularServices.map((service) => (
                <a
                  key={service.id}
                  href={`/DetailService/?id=${service.id}`}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden border"
                >
                  <div className="relative">
                    <img
                      src={service.thumbnail}
                      alt={service.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getDefaultServiceImage(
                          service.category,
                          ""
                        );
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                      RECOMMANDÉ
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                      {service.title}
                    </h3>

                    <div className="flex items-center mb-3">
                      {service.freelancerAvatar ? (
                        <img
                          src={service.freelancerAvatar}
                          alt={service.freelancer}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {service.freelancer}
                        </p>
                        <p className="text-gray-500 text-xs">{service.level}</p>
                      </div>
                    </div>

                    <div className="flex items-center mb-4">
                      <div className="flex items-center mr-4">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-bold text-gray-900">
                          {service.rating}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">
                          ({service.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.deliveryTime}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          {
                            currencies.find((c) => c.code === selectedCurrency)
                              ?.symbol
                          }
                          {service.price.toLocaleString()}
                        </span>
                      </div>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                        Commander
                      </button>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Aucun service disponible pour le moment
            </div>
          )}
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-linear-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Comment Ça Marche ?</h2>
            <p className="text-xl text-green-100">
              Trois étapes simples pour réussir votre projet
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="text-center bg-white/10 backdrop-blur-sm p-8 rounded-xl"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                  {step.icon}
                </div>
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-green-100 mb-4 leading-relaxed">
                  {step.description}
                </p>
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full inline-block">
                  ⏱️ {step.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Anylibre en Chiffres</h2>
            <p className="text-gray-300">
              Des statistiques qui témoignent de notre succès
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-green-400 mb-2">
                {stats.freelancers}+
              </div>
              <div className="text-gray-300 font-medium">
                Freelances Experts
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Vérifiés et certifiés
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-400 mb-2">
                {stats.projects}+
              </div>
              <div className="text-gray-300 font-medium">Services Actifs</div>
              <div className="text-sm text-gray-400 mt-1">
                Disponibles maintenant
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-400 mb-2">
                {stats.satisfaction}%
              </div>
              <div className="text-gray-300 font-medium">
                Satisfaction Client
              </div>
              <div className="text-sm text-gray-400 mt-1">Note moyenne</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-400 mb-2">
                {stats.countries}
              </div>
              <div className="text-gray-300 font-medium">Pays</div>
              <div className="text-sm text-gray-400 mt-1">
                Couverture mondiale
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Freelancers */}
      {featuredFreelancers.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Freelances d'Excellence
              </h2>
              <p className="text-xl text-gray-600">
                Découvrez nos talents les mieux notés
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredFreelancers.map((freelancer) => (
                <a
                  key={freelancer.id}
                  href={`/Profil/?id=${freelancer.id}`}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border"
                >
                  <div className="text-center">
                    <div className="relative mb-6">
                      {freelancer.avatar ? (
                        <img
                          src={freelancer.avatar}
                          alt={freelancer.name}
                          className="w-24 h-24 rounded-full mx-auto object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full mx-auto bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                          <User className="w-12 h-12 text-white" />
                        </div>
                      )}
                      {freelancer.verified && (
                        <div className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-full">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-gray-900 mb-1 text-lg">
                      {freelancer.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {freelancer.title}
                    </p>
                    <p className="text-gray-500 text-xs mb-4 flex items-center justify-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {freelancer.location}
                    </p>

                    <div className="flex items-center justify-center mb-4">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-bold text-gray-900">
                        {freelancer.rating}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">
                        ({freelancer.reviewCount})
                      </span>
                    </div>

                    {freelancer.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4 justify-center">
                        {freelancer.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-green-50 text-green-800 text-xs px-2 py-1 rounded border border-green-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mb-4">
                      <p className="text-2xl font-bold text-gray-900">
                        ${freelancer.hourlyRate}/h
                      </p>
                      <p className="text-sm text-gray-500">
                        {freelancer.completedProjects} services •{" "}
                        {freelancer.responseTime}
                      </p>
                    </div>

                    <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                      Voir le profil
                    </button>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">
              Prêt à Démarrer Votre Projet ?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Rejoignez des milliers d'entrepreneurs qui font confiance à
              Anylibre pour réaliser leurs projets. Inscription gratuite, sans
              engagement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button className="bg-white text-green-600 px-10 py-4 rounded-xl hover:bg-gray-100 transition-colors font-bold text-lg flex items-center justify-center">
                Publier un Projet Gratuit
              </button>
              <button className="border-2 border-white text-white px-10 py-4 rounded-xl hover:bg-white/10 transition-colors font-bold text-lg">
                Devenir Freelance
              </button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-green-100">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Inscription gratuite
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Paiements sécurisés
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Support premium
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accueil;
