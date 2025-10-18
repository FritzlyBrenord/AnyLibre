"use client";
import { Search, X, Menu } from "lucide-react";
import React, { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("fr");
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");

  const languages = [
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "ht", name: "Kreyòl", flag: "🇭🇹" },
  ];

  const currencies = [
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "USD", name: "Dollar US", symbol: "$" },
    { code: "HTG", name: "Gourde", symbol: "G" },
    { code: "CAD", name: "Dollar CA", symbol: "CA$" },
  ];

  return (
    <div className="mb-8">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main header */}
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold cursor-pointer">
                <span className="text-green-600">Any</span>
                <span className="text-gray-800">libre</span>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="w-full relative">
                <input
                  type="text"
                  placeholder="Rechercher un service ou un freelance..."
                  className="w-full px-5 py-3 pl-12 border border-gray-200 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition-colors"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Navigation & Actions - Desktop */}
            <div className="hidden lg:flex items-center space-x-6">
              <a
                href="#"
                className="text-gray-600 hover:text-green-600 transition-colors font-medium"
              >
                Explorer
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-green-600 transition-colors font-medium"
              >
                Comment ça marche
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-green-600 transition-colors font-medium"
              >
                Business
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-green-600 transition-colors font-medium"
              >
                À propos
              </a>

              <div className="h-6 w-px bg-gray-200"></div>

              <button
                onClick={() => (window.location.href = "/Authentification")}
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Connexion
              </button>
              <button className="bg-green-600 text-white px-6 py-2.5 rounded-full hover:bg-green-700 transition-all hover:shadow-lg font-medium">
                S'inscrire
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center space-x-3">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Search className="h-5 w-5 text-gray-600" />
              </button>

              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
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

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="lg:hidden pb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full px-5 py-3 pl-12 border border-gray-200 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-100 py-4">
              <div className="flex flex-col space-y-1">
                <a
                  href="#"
                  className="text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors font-medium py-3 px-3 rounded-lg"
                >
                  Explorer
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors font-medium py-3 px-3 rounded-lg"
                >
                  Comment ça marche
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors font-medium py-3 px-3 rounded-lg"
                >
                  Business
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors font-medium py-3 px-3 rounded-lg"
                >
                  À propos
                </a>

                <div className="my-2 border-t border-gray-100"></div>

                {/* Language Selector - Mobile */}
                <div className="px-3 py-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Langue
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-700 font-medium"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Currency Selector - Mobile */}
                <div className="px-3 py-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Devise
                  </label>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-700 font-medium"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="my-2 border-t border-gray-100"></div>

                <button className="text-left text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors font-medium py-3 px-3 rounded-lg">
                  Connexion
                </button>
                <button className="bg-green-600 text-white py-3 px-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                  S'inscrire
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
