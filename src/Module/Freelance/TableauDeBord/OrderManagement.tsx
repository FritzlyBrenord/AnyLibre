"use client";
import React, { useState } from "react";
import {
  Search,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Upload,
  X,
  Send,
  DollarSign,
  FileText,
  Eye,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

const OrderManagement = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      client: "Marie Dupont",
      service: "Logo Design + Brand Identity",
      dueDate: "2025-10-08",
      deliveredDate: null,
      total: 450,
      status: "actif",
      priority: true,
      note: "Client demande révisions rapides",
      deliveryMessage: "",
      revisionMessage: "",
      cancellationReason: "",
      revisionCount: 0,
    },
    {
      id: 2,
      client: "Jean-Pierre Laurent",
      service: "Développement site web",
      dueDate: "2025-10-03",
      deliveredDate: null,
      total: 1200,
      status: "révision",
      priority: true,
      note: "Urgent - Client attend",
      deliveryMessage:
        "Site web livré avec toutes les fonctionnalités demandées.",
      revisionMessage:
        "Le menu de navigation ne fonctionne pas correctement sur mobile. Pourriez-vous corriger cela?",
      cancellationReason: "",
      revisionCount: 1,
    },
    {
      id: 3,
      client: "Sophie Martin",
      service: "Rédaction articles blog (5x)",
      dueDate: "2025-10-10",
      deliveredDate: null,
      total: 300,
      status: "actif",
      priority: false,
      note: "",
      deliveryMessage: "",
      revisionMessage: "",
      cancellationReason: "",
      revisionCount: 0,
    },
    {
      id: 4,
      client: "Thomas Bernard",
      service: "Création vidéo promotionnelle",
      dueDate: "2025-09-28",
      deliveredDate: "2025-09-27",
      total: 800,
      status: "livré",
      priority: false,
      note: "Livraison anticipée",
      deliveryMessage:
        "Vidéo promotionnelle de 2 minutes livrée avec musique et sous-titres comme demandé.",
      revisionMessage: "",
      cancellationReason: "",
      revisionCount: 0,
    },
    {
      id: 5,
      client: "Claire Dubois",
      service: "SEO Optimization",
      dueDate: "2025-09-20",
      deliveredDate: "2025-09-20",
      total: 600,
      status: "terminé",
      priority: false,
      note: "Client très satisfait - 5 étoiles",
      deliveryMessage:
        "Optimisation SEO complète: 50 mots-clés ciblés, méta-descriptions, structure améliorée.",
      revisionMessage: "",
      cancellationReason: "",
      revisionCount: 0,
    },
    {
      id: 6,
      client: "Lucas Petit",
      service: "Application mobile",
      dueDate: "2025-09-15",
      deliveredDate: null,
      total: 2500,
      status: "annulé",
      priority: false,
      note: "Annulé par le client",
      deliveryMessage: "",
      revisionMessage: "",
      cancellationReason:
        "Le client a changé d'avis sur les fonctionnalités. Budget insuffisant pour continuer. Remboursement effectué.",
      revisionCount: 0,
    },
    {
      id: 7,
      client: "Emma Rousseau",
      service: "Consultation marketing",
      dueDate: "2025-10-12",
      deliveredDate: null,
      total: 350,
      status: "actif",
      priority: false,
      note: "",
      deliveryMessage: "",
      revisionMessage: "",
      cancellationReason: "",
      revisionCount: 0,
    },
  ]);

  const [activeTab, setActiveTab] = useState("actif");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [deliveryFile, setDeliveryFile] = useState(null);
  const [isRevision, setIsRevision] = useState(false);

  const tabs = [
    {
      id: "priorité",
      label: "PRIORITÉ",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    { id: "actif", label: "ACTIF", icon: Package, color: "text-blue-600" },
    { id: "tard", label: "TARD", icon: Clock, color: "text-red-500" },
    {
      id: "révision",
      label: "RÉVISION",
      icon: RefreshCw,
      color: "text-red-600",
    },
    { id: "livré", label: "LIVRÉ", icon: Send, color: "text-yellow-600" },
    {
      id: "terminé",
      label: "TERMINÉ",
      icon: CheckCircle,
      color: "text-green-600",
    },
    { id: "annulé", label: "ANNULÉ", icon: XCircle, color: "text-gray-600" },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      activeTab === "priorité" ? order.priority : order.status === activeTab;
    const matchesSearch = order.client
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getCounts = () => {
    return {
      priorité: orders.filter((o) => o.priority).length,
      actif: orders.filter((o) => o.status === "actif").length,
      tard: orders.filter((o) => o.status === "tard").length,
      révision: orders.filter((o) => o.status === "révision").length,
      livré: orders.filter((o) => o.status === "livré").length,
      terminé: orders.filter((o) => o.status === "terminé").length,
      annulé: orders.filter((o) => o.status === "annulé").length,
    };
  };

  const counts = getCounts();

  const openDeliveryModal = (order, revision = false) => {
    setSelectedOrder(order);
    setIsRevision(revision);
    setShowDeliveryModal(true);
    setDeliveryMessage("");
    setDeliveryFile(null);
  };

  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const closeModals = () => {
    setShowDeliveryModal(false);
    setShowDetailsModal(false);
    setSelectedOrder(null);
    setDeliveryMessage("");
    setDeliveryFile(null);
    setIsRevision(false);
  };

  const handleDeliver = () => {
    if (!deliveryMessage.trim()) {
      alert("Veuillez ajouter un message de livraison");
      return;
    }

    setOrders(
      orders.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              status: "livré",
              deliveredDate: new Date().toISOString().split("T")[0],
              deliveryMessage: deliveryMessage,
              revisionCount: isRevision
                ? order.revisionCount + 1
                : order.revisionCount,
            }
          : order
      )
    );

    closeModals();
    alert(
      isRevision
        ? "Révision livrée avec succès!"
        : "Commande livrée avec succès!"
    );
  };

  const handleMarkAsCompleted = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "terminé" } : order
      )
    );
    closeModals();
    alert("Commande marquée comme terminée avec succès!");
  };

  const getStatusBadge = (status) => {
    const badges = {
      actif: {
        color: "bg-blue-100 text-blue-800 border border-blue-300",
        icon: "🟡",
        label: "En cours",
      },
      livré: {
        color: "bg-yellow-100 text-yellow-800 border border-yellow-300",
        icon: "📦",
        label: "Livré",
      },
      révision: {
        color: "bg-red-100 text-red-800 border border-red-300",
        icon: "🔄",
        label: "En révision",
      },
      terminé: {
        color: "bg-green-100 text-green-800 border border-green-300",
        icon: "✅",
        label: "Terminé",
      },
      annulé: {
        color: "bg-gray-100 text-gray-800 border border-gray-300",
        icon: "⚫",
        label: "Annulé",
      },
      tard: {
        color: "bg-red-200 text-red-900 border border-red-400",
        icon: "⚠️",
        label: "En retard",
      },
    };
    const badge = badges[status] || badges.actif;
    return (
      <span
        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.color}`}
      >
        {badge.icon} {badge.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gérer les commandes
          </h1>
          <p className="text-gray-600">
            Suivez et gérez toutes vos commandes en un seul endroit
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Commandes actives</p>
                <p className="text-2xl font-bold text-blue-900">
                  {counts.actif}
                </p>
              </div>
              <Package className="text-blue-600" size={32} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700">En révision</p>
                <p className="text-2xl font-bold text-red-900">
                  {counts.révision}
                </p>
              </div>
              <RefreshCw className="text-red-600" size={32} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Livrées ce mois</p>
                <p className="text-2xl font-bold text-green-900">
                  {counts.livré + counts.terminé}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700">Revenu actuel</p>
                <p className="text-2xl font-bold text-yellow-900">
                  ${totalRevenue}
                </p>
              </div>
              <DollarSign className="text-yellow-600" size={32} />
            </div>
          </div>
        </div>

        {/* Recherche */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Rechercher par nom de client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-x-auto">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const count = counts[tab.id];

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap ${
                    isActive
                      ? `border-b-2 border-blue-600 ${tab.color}`
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="mr-2" size={18} />
                  {tab.label}
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune commande {activeTab}
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Aucun résultat ne correspond à votre recherche."
                  : `Vous n'avez pas de commandes avec le statut "${activeTab}".`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Dû le
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Livré le
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                            {order.client.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.client}
                            </div>
                            {order.priority && (
                              <span className="inline-flex items-center text-xs text-red-600">
                                <AlertTriangle size={12} className="mr-1" />
                                Prioritaire
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.service}
                        </div>
                        {order.note && (
                          <div className="text-xs text-gray-500 mt-1">
                            {order.note}
                          </div>
                        )}
                        {order.revisionCount > 0 && (
                          <div className="text-xs text-purple-600 mt-1">
                            Révision #{order.revisionCount}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.dueDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.deliveredDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ${order.total}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          {(order.status === "actif" ||
                            order.status === "tard") && (
                            <button
                              onClick={() => openDeliveryModal(order, false)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center shadow-sm"
                            >
                              <Send size={16} className="mr-2" />
                              Livrer
                            </button>
                          )}
                          {order.status === "révision" && (
                            <>
                              <button
                                onClick={() => openDetailsModal(order)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center shadow-sm"
                              >
                                <Eye size={16} className="mr-2" />
                                Voir
                              </button>
                              <button
                                onClick={() => openDeliveryModal(order, true)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center shadow-sm"
                              >
                                <RefreshCw size={16} className="mr-2" />
                                Relivrer
                              </button>
                            </>
                          )}
                          {(order.status === "livré" ||
                            order.status === "terminé" ||
                            order.status === "annulé") && (
                            <button
                              onClick={() => openDetailsModal(order)}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center shadow-sm"
                            >
                              <Eye size={16} className="mr-2" />
                              Détails
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modale de livraison */}
      {showDeliveryModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isRevision ? "Relivrer la commande" : "Livrer la commande"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Commande #{selectedOrder.id} - {selectedOrder.client}
                </p>
              </div>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Détails de la commande
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Service:</span>
                    <p className="font-medium text-gray-900">
                      {selectedOrder.service}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Montant:</span>
                    <p className="font-medium text-gray-900">
                      ${selectedOrder.total}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Date limite:</span>
                    <p className="font-medium text-gray-900">
                      {formatDate(selectedOrder.dueDate)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Révisions:</span>
                    <p className="font-medium text-gray-900">
                      {selectedOrder.revisionCount}/3
                    </p>
                  </div>
                </div>
              </div>

              {isRevision && selectedOrder.revisionMessage && (
                <div className="bg-red-50 border border-red-300 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2 flex items-center">
                    <MessageSquare className="mr-2" size={18} />
                    Message du client
                  </h4>
                  <p className="text-red-800 text-sm">
                    {selectedOrder.revisionMessage}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message de livraison *
                </label>
                <textarea
                  value={deliveryMessage}
                  onChange={(e) => setDeliveryMessage(e.target.value)}
                  rows={6}
                  placeholder={
                    isRevision
                      ? "Décrivez les modifications apportées suite à la demande de révision..."
                      : "Décrivez le travail effectué et ajoutez des instructions pour le client..."
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Soyez clair et professionnel. Ce message sera envoyé au
                  client.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fichiers livrables
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    id="deliveryFile"
                    onChange={(e) => setDeliveryFile(e.target.files[0])}
                    className="hidden"
                  />
                  <label
                    htmlFor="deliveryFile"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="text-gray-400 mb-2" size={32} />
                    <span className="text-sm text-gray-600">
                      Cliquez pour télécharger ou glissez vos fichiers ici
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PDF, ZIP, JPG, PNG (max 50MB)
                    </span>
                  </label>
                </div>
                {deliveryFile && (
                  <div className="mt-3 flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="text-blue-600 mr-2" size={20} />
                      <span className="text-sm text-gray-900">
                        {deliveryFile.name}
                      </span>
                    </div>
                    <button
                      onClick={() => setDeliveryFile(null)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeModals}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDeliver}
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center shadow-sm"
              >
                <Send className="mr-2" size={18} />
                {isRevision ? "Envoyer la révision" : "Envoyer la livraison"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de détails */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Détails de la commande
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Commande #{selectedOrder.id}
                </p>
              </div>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Client</p>
                  <p className="font-semibold text-gray-900">
                    {selectedOrder.client}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Statut</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service</p>
                  <p className="font-semibold text-gray-900">
                    {selectedOrder.service}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Montant</p>
                  <p className="font-semibold text-gray-900">
                    ${selectedOrder.total}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date limite</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(selectedOrder.dueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date de livraison</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(selectedOrder.deliveredDate)}
                  </p>
                </div>
              </div>

              {selectedOrder.deliveryMessage && (
                <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">
                    Message de livraison
                  </h4>
                  <p className="text-yellow-800 text-sm">
                    {selectedOrder.deliveryMessage}
                  </p>
                </div>
              )}

              {selectedOrder.revisionMessage && (
                <div className="bg-red-50 border border-red-300 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">
                    Demande de révision
                  </h4>
                  <p className="text-red-800 text-sm">
                    {selectedOrder.revisionMessage}
                  </p>
                </div>
              )}

              {selectedOrder.status === "annulé" &&
                selectedOrder.cancellationReason && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">
                      Raison de l'annulation
                    </h4>
                    <p className="text-red-800 text-sm">
                      {selectedOrder.cancellationReason}
                    </p>
                  </div>
                )}

              {selectedOrder.status === "terminé" && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                    <CheckCircle className="mr-2" size={18} />
                    Commande terminée avec succès
                  </h4>
                  <p className="text-green-800 text-sm">
                    Le client a accepté la livraison. Paiement effectué.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeModals}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Fermer
              </button>

              {selectedOrder.status === "révision" && (
                <button
                  onClick={() => {
                    closeModals();
                    openDeliveryModal(selectedOrder, true);
                  }}
                  className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center shadow-sm"
                >
                  <RefreshCw className="mr-2" size={16} />
                  Relivrer
                </button>
              )}

              {selectedOrder.status === "livré" && (
                <button
                  onClick={() => handleMarkAsCompleted(selectedOrder.id)}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center shadow-sm"
                >
                  <CheckCircle className="mr-2" size={16} />
                  Marquer comme terminé
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
