"use client";
import {
  ChevronDown,
  Package,
  User,
  DollarSign,
  Calendar,
  Star,
  TrendingUp,
  MessageSquare,
  Bell,
  HelpCircle,
  X,
} from "lucide-react";
import React, { useState } from "react";

const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBusinessMenu, setShowBusinessMenu] = useState(false);
  const [showMarketingMenu, setShowMarketingMenu] = useState(false);
  const [showAnalyticsMenu, setShowAnalyticsMenu] = useState(false);

  // Notifications data
  const notifications = [
    {
      id: 1,
      type: "order",
      title: "Nouvelle commande reçue",
      message: 'Marie Laurent a commandé votre service "Site web responsive"',
      time: "5 min",
      read: false,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 2,
      type: "review",
      title: "Nouvel avis 5 étoiles",
      message: "Pierre Martin a laissé un excellent avis sur votre travail",
      time: "2 heures",
      read: false,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      id: 3,
      type: "payment",
      title: "Paiement reçu",
      message: "Vous avez reçu 450€ pour la commande #12847",
      time: "1 jour",
      read: true,
      color: "bg-green-100 text-green-600",
    },
    {
      id: 4,
      type: "message",
      title: "Nouveau message",
      message:
        "Sophie Dubois vous a envoyé un message concernant votre service",
      time: "2 jours",
      read: true,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  // Messages data
  const messages = [
    {
      id: 1,
      sender: "Marie Laurent",
      message: "Bonjour, pouvez-vous commencer le projet demain ?",
      time: "10 min",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
      unread: true,
    },
    {
      id: 2,
      sender: "Pierre Martin",
      message: "Merci beaucoup pour le travail, c'est parfait !",
      time: "1 heure",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre",
      unread: true,
    },
    {
      id: 3,
      sender: "Sophie Dubois",
      message: "J'ai besoin de révisions mineures sur le design...",
      time: "3 heures",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
      unread: false,
    },
  ];

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const unreadMessages = messages.filter((m) => m.unread).length;

  const userData = {
    name: "Brenord",
    username: "@brenordfritzly",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Brenord",
    level: "Niveau 0",
    successScore: "-",
    rating: "-",
    responseRate: "-",
    balance: 2847.5,
    activeOrders: 0,
    activeOrdersValue: 0,
    email: "brenord@anylibre.com",
  };

  // Fermer tous les menus
  const closeAllMenus = () => {
    setShowBusinessMenu(false);
    setShowMarketingMenu(false);
    setShowAnalyticsMenu(false);
    setShowUserMenu(false);
    setShowNotifications(false);
    setShowMessages(false);
  };

  return (
    <div>
      {/* Header - Style Fiverr */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Menu Hamburger */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <h1 className="text-xl lg:text-2xl font-bold text-green-600">
                AnyLibre
              </h1>

              <nav className="hidden lg:flex items-center gap-1">
                <a
                  href="#"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-semibold rounded-lg hover:bg-gray-50"
                >
                  Tableau de bord
                </a>

                {/* Menu Mon entreprise */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowBusinessMenu(!showBusinessMenu);
                      setShowMarketingMenu(false);
                      setShowAnalyticsMenu(false);
                    }}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-semibold rounded-lg hover:bg-gray-50 flex items-center gap-1"
                  >
                    Mon entreprise
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showBusinessMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {showBusinessMenu && (
                    <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <a
                        href="/TableauDeBord/Order"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      >
                        <Package className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="font-semibold text-sm">Commandes</div>
                          <div className="text-xs text-gray-500">
                            Gérer vos commandes
                          </div>
                        </div>
                      </a>
                      <a
                        href="/TableauDeBord/Service"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        <div>
                          <div className="font-semibold text-sm">Services</div>
                          <div className="text-xs text-gray-500">
                            Gérer vos services
                          </div>
                        </div>
                      </a>
                      <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      >
                        <User className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="font-semibold text-sm">Profil</div>
                          <div className="text-xs text-gray-500">
                            Voir votre profil public
                          </div>
                        </div>
                      </a>
                      <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      >
                        <DollarSign className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="font-semibold text-sm">Revenus</div>
                          <div className="text-xs text-gray-500">
                            Suivre vos revenus
                          </div>
                        </div>
                      </a>
                      <div className="border-t border-gray-200 my-2"></div>
                      <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      >
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="font-semibold text-sm">
                            Disponibilité
                          </div>
                          <div className="text-xs text-gray-500">
                            Définir votre emploi du temps
                          </div>
                        </div>
                      </a>
                      <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      >
                        <Star className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="font-semibold text-sm">Avis</div>
                          <div className="text-xs text-gray-500">
                            Retours clients
                          </div>
                        </div>
                      </a>
                    </div>
                  )}
                </div>

                {/* Menu Croissance et marketing */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowMarketingMenu(!showMarketingMenu);
                      setShowBusinessMenu(false);
                      setShowAnalyticsMenu(false);
                    }}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-semibold rounded-lg hover:bg-gray-50 flex items-center gap-1"
                  >
                    Croissance et marketing
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showMarketingMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {showMarketingMenu && (
                    <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      >
                        <TrendingUp className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="font-semibold text-sm">
                            Vendeur Plus
                          </div>
                          <div className="text-xs text-gray-500">
                            Développez plus rapidement
                          </div>
                        </div>
                      </a>
                      <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <div>
                          <div className="font-semibold text-sm">
                            Services promus
                          </div>
                          <div className="text-xs text-gray-500">
                            Augmentez votre visibilité
                          </div>
                        </div>
                      </a>
                      <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <div className="font-semibold text-sm">
                            Forfaits tarifaires
                          </div>
                          <div className="text-xs text-gray-500">
                            Optimisez vos tarifs
                          </div>
                        </div>
                      </a>
                      <div className="border-t border-gray-200 my-2"></div>
                      <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                        <div>
                          <div className="font-semibold text-sm">Apprendre</div>
                          <div className="text-xs text-gray-500">
                            Conseils et ressources
                          </div>
                        </div>
                      </a>
                      <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      >
                        <MessageSquare className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="font-semibold text-sm">
                            Demandes d'acheteurs
                          </div>
                          <div className="text-xs text-gray-500">
                            Trouver des opportunités
                          </div>
                        </div>
                      </a>
                    </div>
                  )}
                </div>

                {/* Menu Analytique */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowAnalyticsMenu(!showAnalyticsMenu);
                      setShowBusinessMenu(false);
                      setShowMarketingMenu(false);
                    }}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-semibold rounded-lg hover:bg-gray-50 flex items-center gap-1"
                  >
                    Analytique
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showAnalyticsMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {showAnalyticsMenu && (
                    <div className="absolute left-0 top-full mt-1 w-60 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        <div>
                          <div className="font-semibold text-sm">Aperçu</div>
                          <div className="text-xs text-gray-500">
                            Tableau de bord
                          </div>
                        </div>
                      </a>
                      <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <div>
                          <div className="font-semibold text-sm">
                            Performance des services
                          </div>
                          <div className="text-xs text-gray-500">
                            Analytique détaillée
                          </div>
                        </div>
                      </a>
                      <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      >
                        <DollarSign className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="font-semibold text-sm">Revenus</div>
                          <div className="text-xs text-gray-500">
                            Répartition des revenus
                          </div>
                        </div>
                      </a>
                      <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <div>
                          <div className="font-semibold text-sm">
                            Acheteurs récurrents
                          </div>
                          <div className="text-xs text-gray-500">
                            Fidélisation client
                          </div>
                        </div>
                      </a>
                      <div className="border-t border-gray-200 my-2"></div>
                      <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <div>
                          <div className="font-semibold text-sm">Rapports</div>
                          <div className="text-xs text-gray-500">
                            Exporter les données
                          </div>
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowMessages(false);
                    setShowUserMenu(false);
                    setShowBusinessMenu(false);
                    setShowMarketingMenu(false);
                    setShowAnalyticsMenu(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg relative"
                >
                  <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0.5 right-0.5 lg:top-1 lg:right-1 w-4 h-4 lg:w-5 lg:h-5 bg-red-500 text-white text-[10px] lg:text-xs rounded-full flex items-center justify-center font-semibold">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-screen max-w-md lg:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[85vh] lg:max-h-[32rem] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="p-3 lg:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-lg">
                          Notifications
                        </h3>
                        {notifications.length > 0 && (
                          <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                            Tout marquer comme lu
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div
                      className="flex-1 overflow-y-auto overscroll-contain"
                      style={{ WebkitOverflowScrolling: "touch" }}
                    >
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                              !notif.read ? "bg-blue-50/30" : ""
                            }`}
                          >
                            <div className="flex gap-3">
                              <div
                                className={`w-10 h-10 rounded-full ${notif.color} flex items-center justify-center flex-shrink-0`}
                              >
                                {notif.type === "order" && (
                                  <Package className="w-5 h-5" />
                                )}
                                {notif.type === "review" && (
                                  <Star className="w-5 h-5" />
                                )}
                                {notif.type === "payment" && (
                                  <DollarSign className="w-5 h-5" />
                                )}
                                {notif.type === "message" && (
                                  <MessageSquare className="w-5 h-5" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-semibold text-gray-900 text-sm">
                                    {notif.title}
                                  </h4>
                                  {!notif.read && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {notif.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-12 text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-8 h-8 text-gray-400" />
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Aucune notification
                          </h4>
                          <p className="text-sm text-gray-600">
                            Vous n'avez aucune notification pour le moment
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-semibold py-2">
                          Voir toutes les notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowMessages(!showMessages);
                    setShowNotifications(false);
                    setShowUserMenu(false);
                    setShowBusinessMenu(false);
                    setShowMarketingMenu(false);
                    setShowAnalyticsMenu(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg relative"
                >
                  <MessageSquare className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
                  {unreadMessages > 0 && (
                    <span className="absolute top-0.5 right-0.5 lg:top-1 lg:right-1 w-4 h-4 lg:w-5 lg:h-5 bg-green-500 text-white text-[10px] lg:text-xs rounded-full flex items-center justify-center font-semibold">
                      {unreadMessages}
                    </span>
                  )}
                </button>

                {showMessages && (
                  <div className="absolute right-0 mt-2 w-screen max-w-md lg:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[85vh] lg:max-h-[32rem] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="p-3 lg:p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50 flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-lg">
                          Messages
                        </h3>
                        {messages.length > 0 && (
                          <button className="text-sm text-green-600 hover:text-green-700 font-semibold">
                            Voir tout
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Messages List */}
                    <div
                      className="flex-1 overflow-y-auto overscroll-contain"
                      style={{ WebkitOverflowScrolling: "touch" }}
                    >
                      {messages.length > 0 ? (
                        messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                              msg.unread ? "bg-green-50/30" : ""
                            }`}
                          >
                            <div className="flex gap-3">
                              <div className="relative flex-shrink-0">
                                <img
                                  src={msg.avatar}
                                  alt={msg.sender}
                                  className="w-12 h-12 rounded-full border-2 border-white shadow"
                                />
                                {msg.unread && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h4
                                    className={`text-sm ${
                                      msg.unread
                                        ? "font-bold text-gray-900"
                                        : "font-semibold text-gray-700"
                                    }`}
                                  >
                                    {msg.sender}
                                  </h4>
                                  <span className="text-xs text-gray-500 flex-shrink-0">
                                    {msg.time}
                                  </span>
                                </div>
                                <p
                                  className={`text-sm mt-1 line-clamp-2 ${
                                    msg.unread
                                      ? "text-gray-900 font-medium"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {msg.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-12 text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-gray-400" />
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Aucun message
                          </h4>
                          <p className="text-sm text-gray-600">
                            Vous n'avez aucun message pour le moment
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {messages.length > 0 && (
                      <div className="p-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                        <button className="w-full text-center text-sm text-green-600 hover:text-green-700 font-semibold py-2">
                          Ouvrir la messagerie
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-lg">
                <HelpCircle className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
              </button>

              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                    setShowMessages(false);
                    setShowBusinessMenu(false);
                    setShowMarketingMenu(false);
                    setShowAnalyticsMenu(false);
                  }}
                  className="flex items-center gap-1 lg:gap-2 hover:bg-gray-100 rounded-lg p-1"
                >
                  <img
                    src={userData.avatar}
                    alt="Avatar"
                    className="w-7 h-7 lg:w-8 lg:h-8 rounded-full border-2 border-green-500"
                  />
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-screen max-w-sm lg:w-80 bg-white rounded-xl shadow-2xl border border-gray-200">
                    {/* User Info Header */}
                    <div className="p-4 lg:p-6 border-b border-gray-200">
                      <div className="flex items-center gap-3 lg:gap-4 mb-3 lg:mb-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={userData.avatar}
                            alt={userData.name}
                            className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border-2 border-gray-200"
                          />
                          <div className="absolute bottom-0 right-0 w-3 h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-base lg:text-lg truncate">
                            {userData.name}
                          </h3>
                          <p className="text-xs lg:text-sm text-gray-600 truncate">
                            {userData.email}
                          </p>
                        </div>
                      </div>

                      {/* Switch to Buyer Mode Button */}
                      <button className="w-full px-3 lg:px-4 py-2.5 lg:py-3 border-2 border-gray-900 text-gray-900 rounded-lg text-sm lg:text-base font-semibold hover:bg-gray-900 hover:text-white transition-all">
                        Passer en mode client
                      </button>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <a
                        href="#"
                        className="flex items-center px-6 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        <span className="text-base font-medium">Profil</span>
                      </a>

                      <a
                        href="#"
                        className="flex items-center px-6 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        <span className="text-base font-medium">
                          Parrainer un ami
                        </span>
                      </a>

                      <a
                        href="#"
                        className="flex items-center px-6 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        <span className="text-base font-medium">
                          Paramètres du compte
                        </span>
                      </a>

                      <a
                        href="#"
                        className="flex items-center px-6 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        <span className="text-base font-medium">
                          Facturation et paiements
                        </span>
                      </a>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200"></div>

                    {/* Language & Currency */}
                    <div className="py-2">
                      <button className="w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                        <span className="text-base font-medium text-gray-700">
                          Français
                        </span>
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                      </button>

                      <button className="w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                        <span className="text-base font-medium text-gray-700">
                          $US USD
                        </span>
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200"></div>

                    {/* Logout */}
                    <div className="p-2">
                      <button className="w-full text-left px-6 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors">
                        <span className="text-base font-medium">
                          Déconnexion
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay pour fermer les menus */}
      {(showBusinessMenu ||
        showMarketingMenu ||
        showAnalyticsMenu ||
        showUserMenu ||
        showNotifications ||
        showMessages) && (
        <div className="fixed inset-0 z-30" onClick={closeAllMenus}></div>
      )}

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowMobileMenu(false)}
          ></div>
          <div
            className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="p-6 pb-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-green-600">AnyLibre</h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-2">
                <a
                  href="#"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold"
                >
                  Tableau de bord
                </a>

                {/* Mon entreprise */}
                <div className="space-y-1">
                  <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">
                    Mon entreprise
                  </div>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
                  >
                    <Package className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium">Commandes</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <span className="text-sm font-medium">Services</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
                  >
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium">Profil</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
                  >
                    <DollarSign className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium">Revenus</span>
                  </a>
                </div>

                {/* Croissance et marketing */}
                <div className="space-y-1 mt-4">
                  <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">
                    Croissance et marketing
                  </div>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
                  >
                    <TrendingUp className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium">Vendeur Plus</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
                  >
                    <MessageSquare className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium">
                      Demandes d'acheteurs
                    </span>
                  </a>
                </div>

                {/* Analytique */}
                <div className="space-y-1 mt-4">
                  <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">
                    Analytique
                  </div>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Aperçu</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
                  >
                    <DollarSign className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium">Revenus</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
