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
import { useMessaging } from "@/Context/MessageContext";
import Link from "next/link";

// Interface pour User2
interface User2 {
  nom: string;
  prenom: string;
  username: string;
  photo: string;
}

// Hook personnalisé pour les infos utilisateur
const useUserInfo = (conversationId?: string): User2 => {
  const { conversations } = useMessaging();
  const { GetUserById, currentSession } = useAuth();
  const { getFreelanceByUserId, getPhotoProfileUrl } = useFreelances();
  const [userInfo, setUserInfo] = useState<User2>({
    nom: "",
    prenom: "",
    username: "",
    photo: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Si un conversationId est fourni, trouver la conversation spécifique
        const conversation = conversationId
          ? conversations.find((conv) => conv.id === conversationId)
          : conversations[0]; // Sinon prendre la première conversation

        if (!conversation) {
          setUserInfo({
            nom: "Utilisateur",
            prenom: "Inconnu",
            username: "user",
            photo: "",
          });
          return;
        }

        const id1 = conversation.user1_id;
        const id2 = conversation.user2_id;
        const currentUserId = currentSession?.user?.id;

        // Déterminer l'ID de l'autre utilisateur
        const otherUserId = id1 === currentUserId ? id2 : id1;

        if (!otherUserId) {
          setUserInfo({
            nom: "Utilisateur",
            prenom: "Inconnu",
            username: "user",
            photo: "",
          });
          return;
        }

        // 1. Essayer le compte freelance d'abord
        const freelanceInfo = getFreelanceByUserId(otherUserId);
        if (freelanceInfo) {
          setUserInfo({
            nom: freelanceInfo.nom || "",
            prenom: freelanceInfo.prenom || "",
            username: freelanceInfo.username || "",
            photo: getPhotoProfileUrl(freelanceInfo.photo_url || ""),
          });
          return;
        }

        // 2. Si pas de freelance, chercher l'utilisateur normal
        const userData = await GetUserById(otherUserId);
        if (userData) {
          setUserInfo({
            nom:
              userData.nom_utilisateur ||
              userData.email?.split("@")[0] ||
              "Utilisateur",
            prenom: "",
            username:
              userData.nom_utilisateur ||
              userData.email?.split("@")[0] ||
              "user",
            photo: getPhotoProfileUrl(userData.profile_image || ""),
          });
          return;
        }

        // 3. Fallback si rien trouvé
        setUserInfo({
          nom: "",
          prenom: "",
          username: "",
          photo: "",
        });
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des infos utilisateur:",
          error
        );
        setUserInfo({
          nom: "",
          prenom: "",
          username: "",
          photo: "",
        });
      }
    };

    if (conversations.length > 0) {
      fetchUserInfo();
    }
  }, [
    conversations,
    conversationId,
    currentSession,
    GetUserById,
    getFreelanceByUserId,
    getPhotoProfileUrl,
  ]);

  return userInfo;
};

const HeaderAuth = () => {
  const router = useRouter();
  const { currentSession, Logout } = useAuth();
  const { getUserFreelance, getPhotoProfileUrl } = useFreelances();

  // Utiliser le contexte de messagerie
  const { conversations, loading } = useMessaging();

  // Calculer le nombre total de messages non lus
  const unreadCount = conversations.reduce(
    (total, conv) => total + (conv.unread_count || 0),
    0
  );

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

  // Fonction pour formater la date des messages
  const formatMessageTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `Il y a ${diffMins} min`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} h`;
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} j`;
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      });
    }
  };

  // Récupérer les conversations récentes pour le dropdown
  const recentConversations = conversations
    .filter((conv) => !conv.is_archived && !conv.is_spam)
    .sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at))
    .slice(0, 3);

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

  // Composant pour afficher un message dans le dropdown
  const MessageItem = ({ conversation }) => {
    const userInfo = useUserInfo(conversation.id);

    return (
      <div
        className={`px-4 py-3 flex items-start hover:bg-gray-50 cursor-pointer ${
          conversation.unread_count > 0 ? "bg-green-50" : ""
        }`}
        onClick={() => {
          router.push(`/Message?conversation=${conversation.id}`);
          setMessagesMenuOpen(false);
        }}
      >
        <div className="flex-shrink-0 mr-3">
          {userInfo.photo ? (
            <img
              src={userInfo.photo}
              alt={`${userInfo.nom} ${userInfo.prenom}`}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {(
                userInfo.nom.charAt(0) + userInfo.prenom.charAt(0)
              ).toUpperCase() || "U"}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-900 flex justify-between">
            {userInfo.nom} {userInfo.prenom}
            <span className="text-xs text-gray-500 font-normal">
              {conversation.last_message_at
                ? formatMessageTime(conversation.last_message_at)
                : ""}
            </span>
          </p>
          <p className="text-xs text-gray-500 truncate">
            {conversation.last_message?.content || "Aucun message"}
          </p>
        </div>
        {conversation.unread_count > 0 && (
          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-2"></div>
        )}
      </div>
    );
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
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Messages Dropdown avec données réelles */}
                  {messagesMenuOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 z-10">
                      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700">
                          Messages
                        </h3>
                        {unreadCount > 0 && (
                          <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">
                            {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>

                      {loading ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                          Chargement des messages...
                        </div>
                      ) : recentConversations.length > 0 ? (
                        <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                          {recentConversations.map((conversation) => (
                            <MessageItem
                              key={conversation.id}
                              conversation={conversation}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500">
                          Aucune conversation
                        </div>
                      )}

                      <div className="px-4 py-2 bg-gray-50 text-center">
                        <Link
                          href="/Message"
                          className="text-sm font-medium text-green-600 hover:text-green-700"
                          onClick={() => setMessagesMenuOpen(false)}
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
                        {/* Vous pouvez remplacer par vos vraies notifications */}
                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer bg-orange-50">
                          <div className="flex justify-between">
                            <p className="font-medium text-sm text-gray-900">
                              Nouveau message
                            </p>
                            <span className="text-xs text-gray-500">
                              Il y a 20 min
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            Vous avez reçu un nouveau message
                          </p>
                        </div>
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
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
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
                      {unreadCount > 0 && (
                        <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
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
