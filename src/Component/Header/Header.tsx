"use client";
import {
  Shield,
  Headphones,
  Award,
  Globe,
  Search,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface Props {
  showSearch: boolean;
}
const Header = () => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("fr");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  const [showLiteCategories, setShowLiteCategories] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [showHeaderSearch, setShowHeaderSearch] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categoriesPerView, setCategoriesPerView] = useState(8);
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
  const languages = [
    { code: "fr", name: "Français", country: "FR" },
    { code: "en", name: "English", country: "US" },
    { code: "es", name: "Español", country: "ES" },
    { code: "ht", name: "Kreyòl", country: "HT" },
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

  const navigateCategories = (direction: any) => {
    const maxIndex = Math.max(0, liteCategories.length - categoriesPerView);
    if (direction === "left") {
      setCurrentCategoryIndex(Math.max(0, currentCategoryIndex - 1));
    } else {
      setCurrentCategoryIndex(Math.min(maxIndex, currentCategoryIndex + 1));
    }
  };

  // Scroll detection for lite categories and header search
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector(".hero-section");
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const shouldShow = scrollTop > heroBottom - 100;
        setShowLiteCategories(shouldShow);
        setShowHeaderSearch(shouldShow);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-lg border-b border-gray-200 z-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20">
          {/* Top bar */}
          <div className="hidden lg:flex justify-between items-center py-2 text-sm border-b border-gray-100">
            <div className="flex items-center space-x-6 text-gray-600">
              <span className="flex items-center hover:text-green-600 cursor-pointer transition-colors">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                Paiements Sécurisés
              </span>
              <span className="flex items-center hover:text-blue-600 cursor-pointer transition-colors">
                <Headphones className="h-4 w-4 mr-2 text-blue-500" />
                Support 24/7
              </span>
              <span className="flex items-center hover:text-purple-600 cursor-pointer transition-colors">
                <Award className="h-4 w-4 mr-2 text-purple-500" />
                Experts Certifiés
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="flex items-center space-x-2 px-3 py-1 rounded-md border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {
                      languages.find((lang) => lang.code === selectedLanguage)
                        ?.name
                    }
                  </span>
                </button>

                {isLanguageOpen && (
                  <div className="absolute top-10 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setSelectedLanguage(language.code);
                          setIsLanguageOpen(false);
                        }}
                        className={`w-full flex items-center px-4 py-2 text-left hover:bg-blue-50 transition-colors ${
                          selectedLanguage === language.code
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="w-6 h-4 mr-3 bg-gray-200 rounded text-xs flex items-center justify-center">
                          {language.country}
                        </span>
                        <span className="font-medium">{language.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Currency Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className="flex items-center space-x-2 px-3 py-1 rounded-md border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <span className="font-bold text-gray-600">
                    {
                      currencies.find((curr) => curr.code === selectedCurrency)
                        ?.symbol
                    }
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {selectedCurrency}
                  </span>
                </button>

                {isCurrencyOpen && (
                  <div className="absolute top-10 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    {currencies.map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => {
                          setSelectedCurrency(currency.code);
                          setIsCurrencyOpen(false);
                        }}
                        className={`w-full flex items-center px-4 py-2 text-left hover:bg-blue-50 transition-colors ${
                          selectedCurrency === currency.code
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="font-bold mr-2">
                          {currency.symbol}
                        </span>
                        <span className="font-medium">{currency.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main header */}
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                <span className="text-green-600">Any</span>
                <span className="text-gray-800">libre</span>
              </div>
            </div>

            {/* Header Search - Desktop (only when scrolled) */}
            {showHeaderSearch && (
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="w-full relative">
                  <input
                    type="text"
                    placeholder="Rechercher un service..."
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            )}

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Explorer
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Comment ça marche
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Business
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                À propos
              </a>
            </nav>

            {/* Actions - Desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              <button className="text-gray-700 hover:text-green-600 transition-colors font-medium px-4 py-2">
                Se connecter
              </button>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                S'inscrire
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center space-x-3">
              {/* Search Icon - Mobile (only when scrolled) */}
              {showHeaderSearch && (
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Search className="h-5 w-5 text-gray-600" />
                </button>
              )}

              {/* Mobile menu button */}
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-gray-600" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (when search icon is clicked) */}
          {showHeaderSearch && (
            <div className="md:hidden border-t border-gray-200 py-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un service..."
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          )}

          {/* Categories - Desktop (only when scrolled) */}
          {showLiteCategories && (
            <div className="hidden md:block border-t border-gray-200">
              <div className="relative flex items-center py-3">
                {/* Left Arrow */}
                <button
                  onClick={() => navigateCategories("left")}
                  disabled={currentCategoryIndex === 0}
                  className={`mr-4 p-2 rounded-full transition-all ${
                    currentCategoryIndex === 0
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Categories Container */}
                <div className="flex-1 overflow-hidden">
                  <div
                    className="flex space-x-6 transition-transform duration-300 ease-in-out"
                    style={{
                      transform: `translateX(-${
                        currentCategoryIndex * (100 / categoriesPerView)
                      }%)`,
                    }}
                  >
                    {liteCategories.map((category, index) => (
                      <button
                        key={index}
                        className="flex-shrink-0 flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors border border-transparent hover:border-green-200"
                        style={{ minWidth: `${100 / categoriesPerView}%` }}
                      >
                        <span className="text-base">{category.icon}</span>
                        <span className="truncate">{category.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Arrow */}
                <button
                  onClick={() => navigateCategories("right")}
                  disabled={
                    currentCategoryIndex >=
                    Math.max(0, liteCategories.length - categoriesPerView)
                  }
                  className={`ml-4 p-2 rounded-full transition-all ${
                    currentCategoryIndex >=
                    Math.max(0, liteCategories.length - categoriesPerView)
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-3">
                <nav className="flex flex-col space-y-3">
                  <a
                    href="#"
                    className="text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
                  >
                    Explorer
                  </a>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
                  >
                    Comment ça marche
                  </a>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
                  >
                    Business
                  </a>
                </nav>
                <div className="flex flex-col space-y-3 pt-3 border-t border-gray-100">
                  <button className="text-left text-gray-700 hover:text-green-600 transition-colors font-medium py-2">
                    Se connecter
                  </button>
                  <button className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                    S'inscrire
                  </button>
                </div>

                {/* Mobile Categories (when scrolled) */}
                {showLiteCategories && (
                  <div className="pt-3 border-t border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Catégories
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {liteCategories.slice(0, 8).map((category, index) => (
                        <button
                          key={index}
                          className="flex items-center space-x-2 p-2 rounded-lg text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
                        >
                          <span>{category.icon}</span>
                          <span className="truncate">{category.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
