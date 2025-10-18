"use client";
import {
  Search,
  X,
  Menu,
  Bell,
  MessageSquare,
  Heart,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Globe,
  DollarSign,
  ChevronDown,
  Briefcase,
} from "lucide-react";
import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/Context/ContextUser";
import { useFreelances } from "@/Context/Freelance/FreelanceContext";
import Link from "next/link";

const HeaderAuth = () => {
  const router = useRouter();
  const { currentSession, Logout } = useAuth();
  const { getUserFreelance } = useFreelances(); // Access getUserFreelance function

  // State to track if user is a freelancer
  const [isFreelancer, setIsFreelancer] = useState(false);

  // Vérifier si l'utilisateur est connecté
  const isLoggedIn =
    currentSession.isAuthenticated && currentSession.userProfile;

  // États pour les menus
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("fr");
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [messagesMenuOpen, setMessagesMenuOpen] = useState(false);
  const [notificationsMenuOpen, setNotificationsMenuOpen] = useState(false);

  // Check if user is a freelancer when authentication changes
  useEffect(() => {
    if (isLoggedIn && currentSession.user?.id) {
      const freelanceStatus = getUserFreelance(currentSession.user.id);
      setIsFreelancer(!!freelanceStatus);
    } else {
      setIsFreelancer(false);
    }
  }, [isLoggedIn, currentSession.user, getUserFreelance]);

  // Vérifier l'authentification et rediriger si non connecté (pour les pages protégées)
  useEffect(() => {
    const checkAuth = () => {
      const isProtectedPage =
        window.location.pathname.startsWith("/dashboard") ||
        window.location.pathname.startsWith("/profile") ||
        window.location.pathname.startsWith("/messages");

      if (isProtectedPage && !isLoggedIn) {
        router.push("/");
      }
    };

    checkAuth();
  }, [isLoggedIn, router]);

  // Gérer la déconnexion
  const handleLogout = async () => {
    const success = await Logout();
    if (success) {
      router.push("/");
    }
  };

  // Fermer tous les menus sauf celui spécifié
  const closeAllMenusExcept = (menuToKeepOpen) => {
    if (menuToKeepOpen !== "profile") setProfileMenuOpen(false);
    if (menuToKeepOpen !== "messages") setMessagesMenuOpen(false);
    if (menuToKeepOpen !== "notifications") setNotificationsMenuOpen(false);
  };

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

  // Données de démonstration pour les messages
  const recentMessages = [
    {
      id: 1,
      sender: "Jean Dupont",
      avatar: "👨‍💻",
      content: "Bonjour, avez-vous reçu...",
      time: "15:30",
      unread: true,
    },
    {
      id: 2,
      sender: "Marie Lambert",
      avatar: "👩‍🎨",
      content: "Merci pour votre aide !",
      time: "Hier",
      unread: false,
    },
    {
      id: 3,
      sender: "Pierre Martin",
      avatar: "🧑‍💼",
      content: "Je vous envoie les détails...",
      time: "Mar 15",
      unread: false,
    },
  ];

  // Données de démonstration pour les notifications
  const notifications = [
    {
      id: 1,
      title: "Nouvelle commande",
      content: "Votre commande #4582 a été confirmée",
      time: "Il y a 20 min",
      unread: true,
    },
    {
      id: 2,
      title: "Commentaire reçu",
      content: "Thomas a commenté votre projet",
      time: "Il y a 2h",
      unread: true,
    },
    {
      id: 3,
      title: "Rappel",
      content: "Réunion programmée à 14h30",
      time: "Aujourd'hui",
      unread: false,
    },
  ];

  // Fonction pour obtenir les initiales de l'utilisateur
  const getUserInitials = () => {
    if (
      !currentSession.userProfile ||
      !currentSession.userProfile.nom_utilisateur
    ) {
      return "?";
    }

    const username = currentSession.userProfile.nom_utilisateur;
    return username.charAt(0).toUpperCase();
  };

  return (
    <div className="mb-8">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main header */}
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div
                className="text-2xl font-bold cursor-pointer"
                onClick={() => router.push("/")}
              >
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
            {!isLoggedIn ? (
              // Non-connecté: Afficher les liens de navigation + connexion/inscription
              <div className="hidden lg:flex items-center space-x-6">
                <Link
                  href="/explorer"
                  className="text-gray-600 hover:text-green-600 transition-colors font-medium"
                >
                  Explorer
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-green-600 transition-colors font-medium"
                >
                  Comment ça marche
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-green-600 transition-colors font-medium"
                >
                  Business
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-green-600 transition-colors font-medium"
                >
                  À propos
                </Link>

                <div className="h-6 w-px bg-gray-200"></div>

                <button
                  onClick={() => router.push("/Authentification")}
                  className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                >
                  Connexion
                </button>
                <button
                  onClick={() => router.push("/Authentification")}
                  className="bg-green-600 text-white px-6 py-2.5 rounded-full hover:bg-green-700 transition-all hover:shadow-lg font-medium"
                >
                  S'inscrire
                </button>
              </div>
            ) : (
              // Connecté: Afficher les icônes utilisateur
              <div className="hidden lg:flex items-center space-x-2">
                <Link
                  href="/Explorer"
                  className="text-gray-600 hover:text-green-600 transition-colors font-medium px-3"
                >
                  Commande
                </Link>

                {/* Tableau de bord - Afficher seulement si l'utilisateur est un freelancer */}
                {isFreelancer && (
                  <Link
                    href="/TableauDeBord"
                    className="text-gray-600 hover:text-green-600 transition-colors font-medium px-3"
                  >
                    Tableau de bord
                  </Link>
                )}

                {/* Favoris */}
                <div className="relative px-1">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-green-600 transition-colors relative"
                    aria-label="Favoris"
                  >
                    <Heart className="h-5 w-5" />
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      3
                    </span>
                  </button>
                </div>

                {/* Messages */}
                <div className="relative px-1">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-green-600 transition-colors relative"
                    aria-label="Messages"
                    onClick={() => {
                      closeAllMenusExcept("messages");
                      setMessagesMenuOpen(!messagesMenuOpen);
                    }}
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span className="absolute top-0 right-0 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      2
                    </span>
                  </button>

                  {/* Messages Dropdown */}
                  {messagesMenuOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 z-10">
                      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700">
                          Messages
                        </h3>
                        <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">
                          2 non lus
                        </span>
                      </div>

                      <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                        {recentMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`px-4 py-3 flex items-start hover:bg-gray-50 cursor-pointer ${
                              message.unread ? "bg-green-50" : ""
                            }`}
                          >
                            <div className="flex-shrink-0 mr-3 text-xl">
                              {message.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-900 flex justify-between">
                                {message.sender}
                                <span className="text-xs text-gray-500 font-normal">
                                  {message.time}
                                </span>
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {message.content}
                              </p>
                            </div>
                            {message.unread && (
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-2"></div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="px-4 py-2 bg-gray-50 text-center">
                        <Link
                          href="/Message"
                          className="text-sm font-medium text-green-600 hover:text-green-700"
                        >
                          Voir tous les messages
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notifications */}
                <div className="relative px-1">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-green-600 transition-colors relative"
                    aria-label="Notifications"
                    onClick={() => {
                      closeAllMenusExcept("notifications");
                      setNotificationsMenuOpen(!notificationsMenuOpen);
                    }}
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      2
                    </span>
                  </button>

                  {/* Notifications Dropdown */}
                  {notificationsMenuOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 z-10">
                      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700">
                          Notifications
                        </h3>
                        <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded-full">
                          2 nouvelles
                        </span>
                      </div>

                      <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                              notification.unread ? "bg-orange-50" : ""
                            }`}
                          >
                            <div className="flex justify-between">
                              <p className="font-medium text-sm text-gray-900">
                                {notification.title}
                              </p>
                              <span className="text-xs text-gray-500">
                                {notification.time}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {notification.content}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="px-4 py-2 bg-gray-50 text-center">
                        <Link
                          href="/notifications"
                          className="text-sm font-medium text-green-600 hover:text-green-700"
                        >
                          Voir toutes les notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-8 w-px bg-gray-200 mx-2"></div>

                {/* Profil utilisateur */}
                <div className="relative">
                  <button
                    className="flex items-center space-x-2 rounded-full hover:bg-gray-100 px-3 py-2 transition-colors"
                    onClick={() => {
                      closeAllMenusExcept("profile");
                      setProfileMenuOpen(!profileMenuOpen);
                    }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {getUserInitials()}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {/* Menu profil */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 z-10">
                      {/* En-tête profil */}
                      <div className="px-4 pt-4 pb-3 bg-gray-50">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                            {getUserInitials()}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-800">
                              {currentSession.userProfile?.nom_utilisateur ||
                                "Utilisateur"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {currentSession.userProfile?.email ||
                                "email@exemple.com"}
                            </p>
                          </div>
                        </div>
                        {isFreelancer && (
                          <div className="mt-2 flex items-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              <Briefcase className="w-3 h-3 mr-1" />
                              Freelance
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions principales */}
                      <div className="py-1 border-b border-gray-200">
                        <Link
                          href="/profile"
                          className="px-4 py-2.5 flex items-center text-gray-700 hover:bg-gray-100"
                        >
                          <User className="h-4 w-4 mr-3 text-gray-500" />
                          <span className="text-sm">Mon profil</span>
                        </Link>
                        <Link
                          href="/settings"
                          className="px-4 py-2.5 flex items-center text-gray-700 hover:bg-gray-100"
                        >
                          <Settings className="h-4 w-4 mr-3 text-gray-500" />
                          <span className="text-sm">Paramètres du compte</span>
                        </Link>
                        <Link
                          href="/Facturation"
                          className="px-4 py-2.5 flex items-center text-gray-700 hover:bg-gray-100"
                        >
                          <DollarSign className="w-5 h-5 mr-3 text-gray-500" />
                          <span className="text-sm">
                            Facturation et paiements
                          </span>
                        </Link>
                        {/* Afficher "Devenir freelance" seulement si l'utilisateur n'est pas déjà freelance */}
                        {!isFreelancer && (
                          <Link
                            href="/FreelancePage"
                            className="px-4 py-2.5 flex items-center text-gray-700 hover:bg-gray-100"
                          >
                            <Briefcase className="h-4 w-4 mr-3 text-gray-500" />
                            <span className="text-sm">Devenir freelance</span>
                          </Link>
                        )}
                      </div>

                      {/* Langue et devise */}
                      <div className="py-1 border-b border-gray-200">
                        <div className="px-4 py-2.5 flex items-center text-gray-700 hover:bg-gray-100 cursor-pointer">
                          <Globe className="h-4 w-4 mr-3 text-gray-500" />
                          <span className="text-sm">Langue:</span>
                          <select
                            value={selectedLanguage}
                            onChange={(e) =>
                              setSelectedLanguage(e.target.value)
                            }
                            className="ml-2 text-sm bg-transparent border-none text-gray-700 focus:ring-0 py-0 pl-0 pr-4 cursor-pointer"
                          >
                            {languages.map((lang) => (
                              <option key={lang.code} value={lang.code}>
                                {lang.flag} {lang.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="px-4 py-2.5 flex items-center text-gray-700 hover:bg-gray-100 cursor-pointer">
                          <DollarSign className="h-4 w-4 mr-3 text-gray-500" />
                          <span className="text-sm">Devise:</span>
                          <select
                            value={selectedCurrency}
                            onChange={(e) =>
                              setSelectedCurrency(e.target.value)
                            }
                            className="ml-2 text-sm bg-transparent border-none text-gray-700 focus:ring-0 py-0 pl-0 pr-4 cursor-pointer"
                          >
                            {currencies.map((currency) => (
                              <option key={currency.code} value={currency.code}>
                                {currency.symbol} {currency.code}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Aide et déconnexion */}
                      <div className="py-1">
                        <Link
                          href="/help"
                          className="px-4 py-2.5 flex items-center text-gray-700 hover:bg-gray-100"
                        >
                          <HelpCircle className="h-4 w-4 mr-3 text-gray-500" />
                          <span className="text-sm">Aide et assistance</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 flex items-center text-gray-700 hover:bg-gray-100 hover:text-red-600 group"
                        >
                          <LogOut className="h-4 w-4 mr-3 text-gray-500 group-hover:text-red-500" />
                          <span className="text-sm">Déconnexion</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center space-x-3">
              {isLoggedIn && (
                <>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                    onClick={() => router.push("/messages")}
                  >
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-0 right-0 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      2
                    </span>
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                    onClick={() => router.push("/notifications")}
                  >
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      2
                    </span>
                  </button>
                </>
              )}

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
                {isLoggedIn && (
                  <div className="px-3 py-3 bg-gray-50 rounded-lg mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                        {getUserInitials()}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">
                          {currentSession.userProfile?.nom_utilisateur ||
                            "Utilisateur"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {currentSession.userProfile?.email ||
                            "email@exemple.com"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <Link
                        href="/profile"
                        className="text-center text-sm bg-white py-2 rounded-lg border border-gray-200 text-gray-700"
                      >
                        Mon profil
                      </Link>
                      <Link
                        href="/settings"
                        className="text-center text-sm bg-white py-2 rounded-lg border border-gray-200 text-gray-700"
                      >
                        Paramètres
                      </Link>
                    </div>
                  </div>
                )}

                <Link
                  href="/explorer"
                  className="text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors font-medium py-3 px-3 rounded-lg"
                >
                  Explorer
                </Link>

                {isLoggedIn ? (
                  /* Modifier le menu mobile pour les utilisateurs connectés */
                  <>
                    {/* Afficher le tableau de bord seulement si l'utilisateur est un freelancer */}
                    {isFreelancer && (
                      <Link
                        href="/dashboard"
                        className="text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors font-medium py-3 px-3 rounded-lg"
                      >
                        Tableau de bord
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      href="#"
                      className="text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors font-medium py-3 px-3 rounded-lg"
                    >
                      Comment ça marche
                    </Link>
                    <Link
                      href="#"
                      className="text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors font-medium py-3 px-3 rounded-lg"
                    >
                      Business
                    </Link>
                    <Link
                      href="#"
                      className="text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors font-medium py-3 px-3 rounded-lg"
                    >
                      À propos
                    </Link>
                  </>
                )}

                {isLoggedIn && (
                  <>
                    <Link
                      href="/messages"
                      className="text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors font-medium py-3 px-3 rounded-lg flex justify-between items-center"
                    >
                      <span>Messages</span>
                      <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        2
                      </span>
                    </Link>
                    <Link
                      href="/notifications"
                      className="text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors font-medium py-3 px-3 rounded-lg flex justify-between items-center"
                    >
                      <span>Notifications</span>
                      <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        2
                      </span>
                    </Link>
                    <Link
                      href="/favorites"
                      className="text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors font-medium py-3 px-3 rounded-lg flex justify-between items-center"
                    >
                      <span>Favoris</span>
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        3
                      </span>
                    </Link>

                    {/* Afficher "Devenir freelance" seulement si l'utilisateur n'est pas déjà freelance */}
                    {!isFreelancer && (
                      <Link
                        href="/FreelancePage"
                        className="text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors font-medium py-3 px-3 rounded-lg"
                      >
                        Devenir freelance
                      </Link>
                    )}
                  </>
                )}

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

                <Link
                  href="/help"
                  className="text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors font-medium py-3 px-3 rounded-lg"
                >
                  Aide et assistance
                </Link>

                <div className="my-2 border-t border-gray-100"></div>

                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors font-medium py-3 px-3 rounded-lg flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Déconnexion</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => router.push("/Authentification")}
                      className="text-left text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors font-medium py-3 px-3 rounded-lg"
                    >
                      Connexion
                    </button>
                    <button
                      onClick={() => router.push("/Authentification")}
                      className="bg-green-600 text-white py-3 px-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      S'inscrire
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default HeaderAuth;
