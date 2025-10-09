"use client";
import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  CheckCircle,
  Pause,
  Clock,
  AlertCircle,
  BarChart3,
  TrendingUp,
  DollarSign,
} from "lucide-react";

const ServiceList = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      title: "Logo Design Professionnel + Identité Visuelle",
      category: "Design Graphique",
      subcategory: "Logo & Identité de Marque",
      status: "actif",
      image:
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400",
      pricing: { min: 50, max: 200 },
      views: 1245,
      orders: 23,
      revenue: 3450,
      rating: 4.9,
      impressions: 5678,
      clicks: 892,
      conversionRate: 2.6,
    },
    {
      id: 2,
      title: "Développement Site Web WordPress Responsive",
      category: "Programmation & Tech",
      subcategory: "Développement WordPress",
      status: "actif",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
      pricing: { min: 300, max: 1200 },
      views: 2341,
      orders: 15,
      revenue: 12600,
      rating: 5.0,
      impressions: 8934,
      clicks: 1456,
      conversionRate: 1.0,
    },
    {
      id: 3,
      title: "Rédaction Articles de Blog SEO Optimisés",
      category: "Rédaction & Traduction",
      subcategory: "Rédaction d'Articles",
      status: "pause",
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400",
      pricing: { min: 75, max: 150 },
      views: 456,
      orders: 8,
      revenue: 920,
      rating: 4.7,
      impressions: 2345,
      clicks: 234,
      conversionRate: 3.4,
    },
  ]);

  const [activeTab, setActiveTab] = useState("tous");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: "tous", label: "Tous", icon: Package },
    { id: "actif", label: "Actifs", icon: CheckCircle },
    { id: "pause", label: "En pause", icon: Pause },
    { id: "en_attente", label: "En attente", icon: Clock },
    { id: "modification", label: "À modifier", icon: AlertCircle },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      actif: "bg-green-100 text-green-800 border-green-200",
      pause: "bg-yellow-100 text-yellow-800 border-yellow-200",
      en_attente: "bg-blue-100 text-blue-800 border-blue-200",
      modification: "bg-red-100 text-red-800 border-red-200",
    };

    const labels = {
      actif: "Actif",
      pause: "En pause",
      en_attente: "En attente",
      modification: "À modifier",
    };

    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const filteredServices = services.filter((service) => {
    const matchesTab = activeTab === "tous" || service.status === activeTab;
    const matchesSearch = service.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalStats = {
    activeServices: services.filter((s) => s.status === "actif").length,
    totalOrders: services.reduce((sum, s) => sum + s.orders, 0),
    totalRevenue: services.reduce((sum, s) => sum + s.revenue, 0),
    avgRating: (
      services.reduce((sum, s) => sum + s.rating, 0) / services.length
    ).toFixed(1),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Services</h1>
              <p className="text-gray-600 mt-1">
                Gérez tous vos services en un seul endroit
              </p>
            </div>
            <button
              onClick={() => (window.location.href = "Service/Nouveau")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center font-semibold shadow-sm"
            >
              <Plus size={20} className="mr-2" />
              Créer un Service
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher un service par titre, catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const count =
                  tab.id === "tous"
                    ? services.length
                    : services.filter((s) => s.status === tab.id).length;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                      isActive
                        ? "border-b-2 border-green-600 text-green-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="mr-2" size={18} />
                    {tab.label}
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        isActive
                          ? "bg-green-100 text-green-600"
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
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(service.status)}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {service.category}
                  </p>
                  <h3 className="font-semibold text-gray-900 text-base line-clamp-2 min-h-[3rem]">
                    {service.title}
                  </h3>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Prix</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${service.pricing.min} - ${service.pricing.max}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Ventes</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {service.orders}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Vues</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {service.views}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Note</p>
                    <p className="text-sm font-semibold text-gray-900 flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      {service.rating}
                    </p>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Impressions:</span>
                    <span className="font-medium text-gray-900">
                      {service.impressions.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Clics:</span>
                    <span className="font-medium text-gray-900">
                      {service.clicks}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taux de conversion:</span>
                    <span className="font-medium text-green-600">
                      {service.conversionRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenus:</span>
                    <span className="font-bold text-gray-900">
                      ${service.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center">
                    <Eye size={16} className="mr-1" />
                    Voir
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center">
                    <Edit size={16} className="mr-1" />
                    Modifier
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun service trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Aucun résultat pour votre recherche"
                : "Commencez par créer votre premier service"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => (window.location.href = "/services/create")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center font-semibold"
              >
                <Plus size={20} className="mr-2" />
                Créer mon premier service
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceList;
