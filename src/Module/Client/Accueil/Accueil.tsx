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
} from "lucide-react";
import React, { useEffect, useState } from "react";

const Accueil = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("fr");
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  const [showLiteCategories, setShowLiteCategories] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [showHeaderSearch, setShowHeaderSearch] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [stats, setStats] = useState({
    freelancers: 0,
    projects: 0,
    satisfaction: 0,
    countries: 0,
  });

  // Hero Slider Data
  const heroSlides = [
    {
      id: 1,
      title: "Trouvez le Freelance Expert pour Votre Projet",
      subtitle: "25,000+ freelances vérifiés • Résultats garantis",
      description:
        "Des développeurs, designers, marketeurs et consultants prêts à transformer vos idées en succès",
      backgroundImage:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
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
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
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
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
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
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80",
      cta: "Booster mon Marketing",
      searchPlaceholder: "SEO, Google Ads, réseaux sociaux...",
    },
  ];

  // Auto-play slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Lite categories data
  const liteCategories = [
    { name: "Développement Web", icon: "💻", count: "8.5K" },
    { name: "Design Graphique", icon: "🎨", count: "6.2K" },
    { name: "Marketing Digital", icon: "📈", count: "5.6K" },
    { name: "Rédaction", icon: "✏️", count: "4.8K" },
    { name: "Vidéo & Animation", icon: "🎬", count: "3.2K" },
    { name: "E-commerce", icon: "🛒", count: "2.8K" },
    { name: "Consultation", icon: "💼", count: "2.4K" },
    { name: "Data & IA", icon: "🤖", count: "1.9K" },
    { name: "Mobile App", icon: "📱", count: "2.1K" },
    { name: "SEO", icon: "🔍", count: "1.7K" },
    { name: "Social Media", icon: "📱", count: "1.5K" },
    { name: "Photo", icon: "📸", count: "1.3K" },
    { name: "Audio", icon: "🎵", count: "900" },
    { name: "Traduction", icon: "🌐", count: "800" },
    { name: "3D & CAD", icon: "🎯", count: "600" },
  ];

  // Categories per view (responsive)
  const getCategoriesPerView = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 8; // lg
      if (window.innerWidth >= 768) return 6; // md
      if (window.innerWidth >= 640) return 4; // sm
      return 3; // mobile
    }
    return 8;
  };

  const [categoriesPerView, setCategoriesPerView] = useState(8);

  useEffect(() => {
    const handleResize = () => {
      setCategoriesPerView(getCategoriesPerView());
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation des compteurs
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        freelancers: Math.min(prev.freelancers + 150, 25000),
        projects: Math.min(prev.projects + 800, 180000),
        satisfaction: Math.min(prev.satisfaction + 1, 99),
        countries: Math.min(prev.countries + 2, 195),
      }));
    }, 50);

    setTimeout(() => clearInterval(interval), 2000);
    return () => clearInterval(interval);
  }, []);

  // Mock data avec plus de contenu de confiance
  const popularServices = [
    {
      id: 1,
      title: "Site Web Professionnel Complet avec SEO",
      freelancer: "Marie Dubois",
      freelancerAvatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b1c8?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
      price: 1500,
      originalPrice: 2200,
      rating: 4.9,
      reviewCount: 156,
      category: "Développement Web",
      thumbnail:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      deliveryTime: "7 jours",
      featured: true,
      level: "Expert Certifié",
    },
    {
      id: 2,
      title: "Identité Visuelle Complète + Logo Premium",
      freelancer: "Jean Martin",
      freelancerAvatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
      price: 450,
      originalPrice: 650,
      rating: 4.8,
      reviewCount: 203,
      category: "Design Graphique",
      thumbnail:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      deliveryTime: "3 jours",
      featured: true,
      level: "Top Rated",
    },
    {
      id: 3,
      title: "Stratégie Marketing Digital ROI Garantie",
      freelancer: "Sophie Laurent",
      freelancerAvatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
      price: 2500,
      originalPrice: 3200,
      rating: 5.0,
      reviewCount: 89,
      category: "Marketing Digital",
      thumbnail:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      deliveryTime: "10 jours",
      featured: true,
      level: "Expert Vérifié",
    },
    {
      id: 4,
      title: "Application Mobile Native iOS + Android",
      freelancer: "Thomas Durand",
      freelancerAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
      price: 8500,
      originalPrice: 12000,
      rating: 4.9,
      reviewCount: 67,
      category: "Développement Mobile",
      thumbnail:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      deliveryTime: "21 jours",
      featured: true,
      level: "Expert Certifié",
    },
  ];

  const featuredFreelancers = [
    {
      id: 1,
      name: "Emma Rousseau",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b1c8?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
      title: "Développeuse Full-Stack Senior",
      rating: 4.9,
      reviewCount: 234,
      skills: ["React", "Node.js", "Python", "AWS"],
      hourlyRate: 85,
      badge: "Top Rated",
      completedProjects: 127,
      responseTime: "< 1h",
      verified: true,
      location: "Paris, France",
    },
    {
      id: 2,
      name: "Lucas Petit",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
      title: "Designer UI/UX Expert",
      rating: 4.8,
      reviewCount: 189,
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      hourlyRate: 70,
      badge: "Expert Vérifié",
      completedProjects: 156,
      responseTime: "< 2h",
      verified: true,
      location: "Lyon, France",
    },
    {
      id: 3,
      name: "Camille Bernard",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
      title: "Consultante Marketing Digital",
      rating: 5.0,
      reviewCount: 198,
      skills: ["SEO", "Google Ads", "Analytics", "Strategy"],
      hourlyRate: 95,
      badge: "Top Rated Plus",
      completedProjects: 203,
      responseTime: "< 1h",
      verified: true,
      location: "Marseille, France",
    },
    {
      id: 4,
      name: "Antoine Moreau",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
      title: "Rédacteur & Content Strategist",
      rating: 4.7,
      reviewCount: 267,
      skills: ["Copywriting", "SEO Content", "Social Media", "Blogging"],
      hourlyRate: 55,
      badge: "Rising Star",
      completedProjects: 189,
      responseTime: "< 3h",
      verified: true,
      location: "Toulouse, France",
    },
  ];

  const categories = [
    {
      name: "Développement Web & Mobile",
      icon: "💻",
      serviceCount: 8500,
      trending: true,
      avgPrice: "€1,200",
    },
    {
      name: "Design Graphique & UI/UX",
      icon: "🎨",
      serviceCount: 6200,
      trending: true,
      avgPrice: "€650",
    },
    {
      name: "Rédaction & Content Marketing",
      icon: "✏️",
      serviceCount: 4800,
      trending: false,
      avgPrice: "€400",
    },
    {
      name: "Marketing Digital & SEO",
      icon: "📈",
      serviceCount: 5600,
      trending: true,
      avgPrice: "€850",
    },
    {
      name: "Consultation Business",
      icon: "💼",
      serviceCount: 2400,
      trending: false,
      avgPrice: "€1,500",
    },
    {
      name: "Vidéo & Animation",
      icon: "🎬",
      serviceCount: 3200,
      trending: true,
      avgPrice: "€750",
    },
    {
      name: "E-commerce & Ventes",
      icon: "🛒",
      serviceCount: 2800,
      trending: true,
      avgPrice: "€950",
    },
    {
      name: "Data & Intelligence Artificielle",
      icon: "🤖",
      serviceCount: 1900,
      trending: true,
      avgPrice: "€1,800",
    },
  ];

  const testimonials = [
    {
      id: 1,
      clientName: "Pierre Legrand",
      clientCompany: "TechStart SAS",
      clientRole: "CEO",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
      rating: 5,
      comment:
        "Anylibre a révolutionné notre approche du recrutement freelance. La qualité des profils est exceptionnelle et le processus de matching est remarquablement précis. En 6 mois, nous avons économisé plus de 40% sur nos coûts de développement tout en gagnant en efficacité.",
      projectType: "Développement d'application SaaS",
      projectBudget: "€25,000",
      completionTime: "8 semaines",
      verified: true,
    },
    {
      id: 2,
      clientName: "Marine Dubois",
      clientCompany: "Creative Studio Pro",
      clientRole: "Directrice Artistique",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b1c8?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
      rating: 5,
      comment:
        "Une plateforme d'exception ! Les freelances sur Anylibre comprennent vraiment les enjeux business. Notre ROI marketing a augmenté de 180% grâce aux stratégies proposées. La sécurité des paiements et le suivi de projet sont irréprochables.",
      projectType: "Refonte complète identité de marque",
      projectBudget: "€12,000",
      completionTime: "4 semaines",
      verified: true,
    },
    {
      id: 3,
      clientName: "Julien Martinez",
      clientCompany: "E-commerce Solutions",
      clientRole: "COO",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
      rating: 5,
      comment:
        "Depuis que nous utilisons Anylibre, notre vélocité de développement a triplé. Les freelances sont non seulement experts techniques mais aussi d'excellents communicants. Le système de garantie satisfaction nous donne une confiance totale.",
      projectType: "Plateforme e-commerce multi-vendeurs",
      projectBudget: "€45,000",
      completionTime: "12 semaines",
      verified: true,
    },
  ];

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
        "Utilisez notre formulaire intelligent pour définir vos besoins précis, votre budget et vos délais. Notre IA vous suggère le type de profil idéal.",
      icon: "📝",
      time: "3 minutes",
    },
    {
      step: 2,
      title: "Recevez des propositions personnalisées",
      description:
        "Les meilleurs freelances vous contactent directement avec des propositions sur-mesure. Consultez leurs portfolios, avis clients et tarifs.",
      icon: "💡",
      time: "24 heures",
    },
    {
      step: 3,
      title: "Collaborez en toute sérénité",
      description:
        "Outils de suivi en temps réel, paiements sécurisés par étapes, communication intégrée. Votre succès est notre priorité.",
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
      stat: "50+",
      label: "Langues supportées",
      description: "Travaillez avec des experts du monde entier",
    },
  ];
  // Données des devises
  const currencies = [
    { code: "EUR", name: "Euro", symbol: "€", country: "EU" },
    { code: "USD", name: "Dollar US", symbol: "$", country: "US" },
    { code: "HTG", name: "Gourde Haïtienne", symbol: "G", country: "HT" },
    { code: "CLP", name: "Peso Chilien", symbol: "$", country: "CL" },
    { code: "DOP", name: "Peso Dominicain", symbol: "$", country: "DO" },
    { code: "CAD", name: "Dollar Canadien", symbol: "$", country: "CA" },
    { code: "MXN", name: "Peso Mexicain", symbol: "$", country: "MX" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner Carousel */}
      <section className="hero-section relative h-screen overflow-hidden pt-16">
        {/* Background Slides */}
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

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="transition-all duration-1000 transform">
                <h1 className="text-lg md:text-6xl font-bold mb-6 leading-tight">
                  {heroSlides[currentSlide].title}
                </h1>
                <p className="text-sm md:text-2xl mb-4 text-green-300 font-semibold">
                  {heroSlides[currentSlide].subtitle}
                </p>
                <p className="text-xs md:text-xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
                  {heroSlides[currentSlide].description}
                </p>
              </div>

              {/* Search Bar */}
              <div className="max-w-3xl mx-auto mb-10">
                <div className="bg-white p-4 rounded-xl shadow-2xl text-gray-600">
                  <div className="flex  md:flex-row gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder={heroSlides[currentSlide].searchPlaceholder}
                        className="w-full px-6 py-4 text-xs sm:text-lg border-0 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                    <a
                      href="/ResultatRecherche"
                      className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-bold text-lg shadow-lg flex items-center justify-center"
                    >
                      <Search className="h-5 w-5 mr-2" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Popular Searches */}
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                <span className="text-sm text-gray-300">Populaire :</span>
                {[
                  "WordPress",
                  "Logo Design",
                  "SEO",
                  "App Mobile",
                  "Video Editing",
                ].map((tag) => (
                  <a
                    key={tag}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm hover:bg-white/30 transition-colors border border-white/30"
                    href="/Category"
                  >
                    {tag}
                  </a>
                ))}
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-green-600 text-white px-10 py-4 rounded-xl hover:bg-green-700 transition-all transform hover:scale-105 font-bold text-lg shadow-xl">
                  {heroSlides[currentSlide].cta}
                </button>
                <button className="border-2 border-white text-white px-10 py-4 rounded-xl hover:bg-white hover:text-gray-900 transition-colors font-bold text-lg">
                  Voir Comment Ça Marche
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
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

      {/* Categories Premium */}
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105 border group"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {category.serviceCount.toLocaleString()} experts disponibles
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
        </div>
      </section>

      {/* Featured Services Premium */}
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden border"
              >
                <div className="relative">
                  <img
                    src={service.thumbnail}
                    alt={service.title}
                    className="w-full h-48 object-cover"
                  />
                  {service.featured && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                      RECOMMANDÉ
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {service.level}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                    {service.title}
                  </h3>

                  <div className="flex items-center mb-3">
                    <img
                      src={service.freelancerAvatar}
                      alt={service.freelancer}
                      className="w-8 h-8 rounded-full mr-3"
                    />
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
                          currencies.find(
                            (curr) => curr.code === selectedCurrency
                          )?.symbol
                        }
                        {service.price.toLocaleString()}
                      </span>
                      {service.originalPrice && (
                        <span className="text-sm text-gray-400 line-through ml-2">
                          {
                            currencies.find(
                              (curr) => curr.code === selectedCurrency
                            )?.symbol
                          }
                          {service.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                      Commander
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps Enhanced */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
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
                {stats.freelancers.toLocaleString()}+
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
                {stats.projects.toLocaleString()}+
              </div>
              <div className="text-gray-300 font-medium">Projets Réussis</div>
              <div className="text-sm text-gray-400 mt-1">
                Livrés avec satisfaction
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
                {stats.countries}+
              </div>
              <div className="text-gray-300 font-medium">Pays</div>
              <div className="text-sm text-gray-400 mt-1">
                Couverture mondiale
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Freelancers Enhanced */}
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
              <div
                key={freelancer.id}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border"
              >
                <div className="text-center">
                  <div className="relative mb-6">
                    <img
                      src={freelancer.avatar}
                      alt={freelancer.name}
                      className="w-24 h-24 rounded-full mx-auto"
                    />
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

                  <div className="mb-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        currencies.find(
                          (curr) => curr.code === selectedCurrency
                        )?.symbol
                      }
                      {freelancer.hourlyRate}/h
                    </p>
                    <p className="text-sm text-gray-500">
                      {freelancer.completedProjects} projets •{" "}
                      {freelancer.responseTime}
                    </p>
                  </div>

                  <div className="mb-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        freelancer.badge === "Top Rated Plus"
                          ? "bg-purple-100 text-purple-800"
                          : freelancer.badge === "Top Rated"
                          ? "bg-green-100 text-green-800"
                          : freelancer.badge === "Expert Vérifié"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {freelancer.badge}
                    </span>
                  </div>

                  <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                    Contacter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Enhanced */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ce Que Disent Nos Clients
            </h2>
            <p className="text-xl text-gray-600">
              Des témoignages authentiques de projets réussis
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="bg-white p-10 rounded-2xl shadow-xl border">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonials[currentTestimonial].avatar}
                      alt={testimonials[currentTestimonial].clientName}
                      className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        {testimonials[currentTestimonial].clientName}
                      </h4>
                      <p className="text-gray-600">
                        {testimonials[currentTestimonial].clientRole}
                      </p>
                      <p className="text-green-600 font-medium">
                        {testimonials[currentTestimonial].clientCompany}
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-6">
                    {[...Array(testimonials[currentTestimonial].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="h-6 w-6 text-yellow-400 fill-current"
                        />
                      )
                    )}
                  </div>

                  <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                    "{testimonials[currentTestimonial].comment}"
                  </blockquote>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h5 className="font-bold text-gray-900 mb-4">
                    Détails du Projet
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type :</span>
                      <span className="font-medium">
                        {testimonials[currentTestimonial].projectType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget :</span>
                      <span className="font-medium">
                        {testimonials[currentTestimonial].projectBudget}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée :</span>
                      <span className="font-medium">
                        {testimonials[currentTestimonial].completionTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-full shadow-lg hover:bg-gray-50 -ml-6"
              onClick={() =>
                setCurrentTestimonial(
                  currentTestimonial === 0
                    ? testimonials.length - 1
                    : currentTestimonial - 1
                )
              }
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-full shadow-lg hover:bg-gray-50 -mr-6"
              onClick={() =>
                setCurrentTestimonial(
                  currentTestimonial === testimonials.length - 1
                    ? 0
                    : currentTestimonial + 1
                )
              }
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section Premium */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
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
