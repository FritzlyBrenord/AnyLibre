"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  Eye,
  EyeOff,
  AlertTriangle,
  X,
  Check,
  Star,
  TrendingUp,
  Package,
  DollarSign,
  Calendar,
  ArrowRight,
  Wallet,
  CreditCard,
  Plus,
  ArrowDownToLine,
  User,
  Settings,
} from "lucide-react";
import Header from "../Header/Header";

export default function FiverrStyleDashboard() {
  const [showBalance, setShowBalance] = useState(true);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [paymentMethodModalOpen, setPaymentMethodModalOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

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
  };

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "PayPal",
      email: "brenord@paypal.com",
      verified: true,
      default: true,
      icon: "💳",
    },
    {
      id: 2,
      type: "Virement Bancaire",
      iban: "FR76 **** **** **** **89",
      verified: true,
      default: false,
      icon: "🏦",
    },
  ]);

  // Withdraw Modal
  const WithdrawModal = () => {
    const [amount, setAmount] = useState("");
    const [selectedMethod, setSelectedMethod] = useState(
      paymentMethods.find((m) => m.default)?.id || null
    );
    const minWithdraw = 20;
    const fee = 2.5;
    const finalAmount = amount
      ? (parseFloat(amount) * (1 - fee / 100)).toFixed(2)
      : "0.00";

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full my-8">
          <div className="flex items-center justify-between p-4 lg:p-6 border-b">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900">
              Retirer mes gains
            </h3>
            <button
              onClick={() => setWithdrawModalOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Solde disponible</p>
              <p className="text-3xl font-bold text-gray-900">
                {userData.balance.toFixed(2)} €
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Minimum: {minWithdraw}€
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Montant à retirer
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <span className="absolute right-4 top-3 text-gray-500">€</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Méthode de paiement
                </label>
                <button
                  onClick={() => {
                    setWithdrawModalOpen(false);
                    setPaymentMethodModalOpen(true);
                  }}
                  className="text-sm text-green-600 hover:text-green-700 font-semibold"
                >
                  + Ajouter
                </button>
              </div>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {method.type}
                          </p>
                          <p className="text-sm text-gray-500">
                            {method.email || method.iban}
                          </p>
                        </div>
                      </div>
                      {method.verified && (
                        <Check className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Montant demandé</span>
                <span className="font-semibold">{amount || "0.00"} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Frais ({fee}%)</span>
                <span className="font-semibold text-red-600">
                  -
                  {amount
                    ? ((parseFloat(amount) * fee) / 100).toFixed(2)
                    : "0.00"}{" "}
                  €
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-bold text-gray-900">Vous recevrez</span>
                <span className="font-bold text-green-600 text-lg">
                  {finalAmount} €
                </span>
              </div>
            </div>

            <button
              disabled={
                !amount ||
                parseFloat(amount) < minWithdraw ||
                parseFloat(amount) > userData.balance
              }
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Confirmer le retrait
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Payment Method Modal
  const PaymentMethodModal = () => {
    const [methodType, setMethodType] = useState("paypal");

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full my-8">
          <div className="flex items-center justify-between p-4 lg:p-6 border-b">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900">
              Ajouter un moyen de paiement
            </h3>
            <button
              onClick={() => setPaymentMethodModalOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "paypal", icon: "💳", label: "PayPal" },
                { value: "bank", icon: "🏦", label: "Banque" },
                { value: "stripe", icon: "⚡", label: "Stripe" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMethodType(option.value)}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    methodType === option.value
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-3xl block mb-2">{option.icon}</span>
                  <span className="text-sm font-semibold">{option.label}</span>
                </button>
              ))}
            </div>

            {methodType === "paypal" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email PayPal
                </label>
                <input
                  type="email"
                  placeholder="votre.email@paypal.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
            )}

            {methodType === "bank" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom de la banque
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Crédit Agricole"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    IBAN
                  </label>
                  <input
                    type="text"
                    placeholder="FR76 1234 5678 9012 3456 7890 123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Ajouter cette méthode
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Layout - 2 colonnes comme Fiverr */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar Toggle Button - Mobile */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center z-30 hover:bg-green-700"
        >
          <User className="w-6 h-6" />
        </button>

        {/* Sidebar Gauche */}
        <aside
          className={`
          ${showSidebar ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 
          fixed lg:sticky top-0 lg:top-0 left-0 
          w-80 bg-white border-r border-gray-200 
          h-screen lg:min-h-screen p-4 lg:p-6 space-y-6 lg:space-y-8 
          transition-transform duration-300 z-30
          overflow-y-auto overscroll-contain
        `}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Profil */}
          <div className="text-center">
            <div className="flex lg:block items-center lg:justify-center gap-4 lg:gap-0">
              <div className="relative inline-block flex-shrink-0">
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  className="w-20 h-20 lg:w-32 lg:h-32 rounded-full mx-auto border-4 border-gray-100"
                />
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="lg:mt-4 text-left lg:text-center">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                  {userData.name}
                </h2>
                <p className="text-sm text-gray-600">{userData.username}</p>
              </div>
            </div>
            <button
              onClick={() => (window.location.href = "/TableauDeBord/edit")}
              className="w-full  gap-y-8 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 text-sm lg:text-base"
            >
              Voir le profil
            </button>
          </div>

          {/* Aperçu des niveaux */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Aperçu des niveaux
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Mon niveau</span>
                <span className="font-semibold text-gray-900">
                  {userData.level}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Score de réussite</span>
                <span className="font-semibold text-gray-900">
                  {userData.successScore}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Notation</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-gray-900">
                    {userData.rating}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taux de réponse</span>
                <span className="font-semibold text-gray-900">
                  {userData.responseRate}
                </span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700">
              Voir la progression
            </button>
          </div>

          {/* Disponibilité */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Disponibilité
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Pendant leur indisponibilité, vos Gigs sont
            </p>
            <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-center justify-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Gains - Ajouté */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-5 rounded-xl border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Mes gains</h3>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-1 hover:bg-white/50 rounded"
              >
                {showBalance ? (
                  <Eye className="w-4 h-4 text-gray-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
            <div className="mb-4">
              {showBalance ? (
                <p className="text-3xl font-bold text-gray-900">
                  {userData.balance.toFixed(2)} €
                </p>
              ) : (
                <p className="text-3xl font-bold text-gray-900">••••••</p>
              )}
              <p className="text-xs text-gray-600 mt-1">Solde disponible</p>
            </div>
            <button
              onClick={() => setWithdrawModalOpen(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowDownToLine className="w-4 h-4" />
              Retirer mes gains
            </button>
          </div>
        </aside>

        {/* Sidebar Overlay - Mobile */}
        {showSidebar && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setShowSidebar(false)}
          ></div>
        )}

        {/* Zone de contenu principale */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-5xl mx-auto lg:mx-0">
            {/* Welcome Message */}
            <div className="mb-6 lg:mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Bienvenue, {userData.name}
              </h1>
              <p className="text-sm lg:text-base text-gray-600">
                Vous trouverez ici des messages importants, des conseils et des
                liens vers des ressources utiles :
              </p>
            </div>

            {/* Alert - Vérifier vos informations */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 lg:p-6 mb-4 lg:mb-6 flex flex-col sm:flex-row items-start gap-4">
              <div className="flex items-start gap-3 lg:gap-4 flex-1">
                <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1 text-sm lg:text-base">
                    Vérifier vos informations
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-700">
                    Restez en conformité pour continuer à travailler avec les
                    clients de l'UE
                  </p>
                </div>
              </div>
              <button className="w-full sm:w-auto px-4 lg:px-6 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 text-sm lg:text-base flex-shrink-0">
                Vérifier
              </button>
            </div>

            {/* Promo Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 mb-6 lg:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-lg transition-shadow">
              <div className="flex-1">
                <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-2">
                  Rejoignez Seller Plus Kickstart et développez votre entreprise
                </h3>
                <p className="text-xs lg:text-sm text-gray-600">
                  Découvrez tous les outils et ressources exclusifs qui peuvent
                  vous aider à accélérer votre succès
                </p>
              </div>
              <div className="flex items-center gap-3 lg:gap-4 sm:ml-6">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Commandes actives */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2 lg:gap-3">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                    Commandes actives
                  </h2>
                  <span className="text-sm lg:text-base text-gray-600">
                    - {userData.activeOrders} ({userData.activeOrdersValue} $)
                  </span>
                </div>
                <button className="flex items-center gap-2 px-3 lg:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs lg:text-sm font-medium whitespace-nowrap">
                  Commandes actives ({userData.activeOrders})
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Empty State */}
              <div className="text-center py-12 lg:py-16">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400" />
                </div>
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">
                  Aucune commande active
                </h3>
                <p className="text-sm lg:text-base text-gray-600 max-w-md mx-auto mb-6">
                  Créez vos premiers services pour commencer à recevoir des
                  commandes de clients
                </p>
                <button className="px-4 lg:px-6 py-2.5 lg:py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto text-sm lg:text-base">
                  <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                  Créer un service
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {withdrawModalOpen && <WithdrawModal />}
      {paymentMethodModalOpen && <PaymentMethodModal />}
    </div>
  );
}
