"use client";
import React, { useState, useMemo } from "react";
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
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Play,
  AlertTriangle,
  Image as ImageIcon,
  FileText,
  Video,
  X,
} from "lucide-react";
import {
  useServices,
  Service,
  StatutService,
} from "@/Context/Freelance/ContextService";
import { redirect } from "next/navigation";
import { useAuth } from "@/Context/ContextUser";
import { useFreelances } from "@/Context/Freelance/FreelanceContext";
import getDefaultServiceImage from "@/Component/Data/ImageDefault/ImageParDefaut";

// ==================== INTERFACES ====================

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onView: (service: Service) => void;
  onDelete: (service: Service) => void;
  onStatusChange: (serviceId: string, newStatus: StatutService) => void;
}

interface StatusBadgeProps {
  status: StatutService;
}

interface MediaPreviewProps {
  service: Service;
  onView: (service: Service) => void;
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmColor?: string;
}

interface DetailModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

// ==================== COMPOSANTS ====================

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    actif: {
      label: "Actif",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
    },
    en_pause: {
      label: "En pause",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Pause,
    },
    en_attente: {
      label: "En attente",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Clock,
    },
    a_modifier: {
      label: "À modifier",
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: Edit,
    },
    suspendre: {
      label: "Suspendu",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: AlertTriangle,
    },
  };

  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}
    >
      <IconComponent size={12} />
      {config.label}
    </span>
  );
};

const MediaPreview: React.FC<MediaPreviewProps> = ({ service, onView }) => {
  const hasImages = service.images && service.images.length > 0;
  const hasVideo = service.video_url;
  const hasDocuments = service.documents && service.documents.length > 0;

  return (
    <div className="flex items-center gap-2 mt-2">
      {hasImages && (
        <button
          onClick={() => onView(service)}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ImageIcon size={14} />
          <span>{service.images.length}</span>
        </button>
      )}
      {hasVideo && (
        <button
          onClick={() => onView(service)}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Video size={14} />
          <span>Vidéo</span>
        </button>
      )}
      {hasDocuments && (
        <button
          onClick={() => onView(service)}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition-colors"
        >
          <FileText size={14} />
          <span>{service.documents.length}</span>
        </button>
      )}
      {!hasImages && !hasVideo && !hasDocuments && (
        <span className="text-xs text-gray-400">Aucun média</span>
      )}
    </div>
  );
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onEdit,
  onView,
  onDelete,
  onStatusChange,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  // Logique de gestion des statuts améliorée
  const getAvailableActions = () => {
    const actions = [];

    switch (service.statut) {
      case "actif":
        actions.push({
          label: "Mettre en pause",
          action: () => handleStatusChange("en_pause"),
          icon: Pause,
          color: "text-yellow-600 hover:bg-yellow-50",
        });
        break;

      case "en_pause":
        actions.push({
          label: "Activer",
          action: () => handleStatusChange("actif"),
          icon: Play,
          color: "text-green-600 hover:bg-green-50",
        });
        break;

      case "suspendre":
        actions.push({
          label: "Activer",
          action: () => handleStatusChange("actif"),
          icon: Play,
          color: "text-green-600 hover:bg-green-50",
        });
        break;

      // Pour "en_attente" et "a_modifier", on ne permet pas de changer le statut via le menu
    }

    return actions;
  };

  const availableActions = getAvailableActions();
  const cannotModify =
    service.statut === "suspendre" || service.statut === "a_modifier";

  // Image de couverture
  const coverImage =
    service.images && service.images.length > 0
      ? service.images[0].url
      : getDefaultServiceImage(service.category, service.subcategory);

  // Prix min/max
  const pricing = useMemo(() => {
    if (!service.packages || service.packages.length === 0) {
      return { min: 0, max: 0 };
    }
    const prices = service.packages.map((pkg) => parseFloat(pkg.price) || 0);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [service.packages]);

  const handleStatusChange = (newStatus: StatutService) => {
    onStatusChange(service.id, newStatus);
    setShowMenu(false);
  };

  const handleDelete = () => {
    onDelete(service);
    setShowMenu(false);
  };

  return (
    <div className=" bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image de couverture */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={coverImage}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <StatusBadge status={service.statut} />
        </div>
        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-56 bg-gray-600 border border-gray-200 rounded-lg shadow-lg z-50">
            {/* Actions de statut conditionnelles */}
            {availableActions.length > 0 && (
              <>
                {availableActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${action.color}`}
                    >
                      <IconComponent size={16} />
                      {action.label}
                    </button>
                  );
                })}
                <div className="border-t border-gray-200 my-1" />
              </>
            )}

            {/* Bouton Supprimer - TOUJOURS visible */}
            <button
              onClick={handleDelete}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
            >
              <Trash2 size={16} />
              Supprimer
            </button>

            {/* Message d'information si aucune action de statut disponible */}
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-5">
        <div className="mb-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {service.category} • {service.subcategory}
          </p>
          <h3 className="font-semibold text-gray-900 text-base line-clamp-2 min-h-[3rem] mb-2">
            {service.title}
          </h3>

          {/* Description avec gestion du débordement */}
          <div className="mb-3">
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
              {service.description?.replace(/<[^>]*>/g, "") ||
                "Aucune description disponible"}
            </p>
          </div>
        </div>

        {/* Prix */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">À partir de</p>
          <p className="text-xl font-bold text-gray-900">
            ${pricing.min}
            {pricing.max > pricing.min && ` - $${pricing.max}`}
          </p>
        </div>

        {/* Médias */}
        <MediaPreview service={service} onView={onView} />

        {/* Tags */}
        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {service.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {service.tags.length > 3 && (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{service.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions - TOUJOURS VISIBLES */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
          {/* Bouton Voir - TOUJOURS visible */}
          <button
            onClick={() => onView(service)}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center"
          >
            <Eye size={16} className="mr-1" />
            Voir
          </button>

          {/* Bouton Modifier - visible seulement si autorisé */}
          {!cannotModify && (
            <button
              onClick={() => onEdit(service)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center"
            >
              <Edit size={16} className="mr-1" />
              Modifier
            </button>
          )}

          {/* Menu déroulant - TOUJOURS visible mais avec contenu conditionnel */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center"
            >
              <MoreVertical size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay pour fermer le menu en cliquant ailleurs */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmer",
  confirmColor = "bg-red-600 hover:bg-red-700",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-600" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>

        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailModal: React.FC<DetailModalProps> = ({
  service,
  isOpen,
  onClose,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  if (!isOpen || !service) return null;

  const coverImage =
    service.images && service.images.length > 0
      ? service.images[0].url
      : "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête avec image */}
        <div className="relative h-64 bg-gray-200">
          <img
            src={coverImage}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-4 left-4">
            <StatusBadge status={service.statut} />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Titre et catégorie */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {service.title}
            </h2>
            <p className="text-gray-600">
              {service.category} • {service.subcategory}
            </p>
          </div>

          {/* Description complète */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
            <div className="max-w-3xl">
              <p
                className={`text-gray-600 leading-relaxed whitespace-pre-wrap break-words ${
                  expanded ? "" : "line-clamp-3"
                }`}
              >
                {service.description?.replace(/<[^>]*>/g, "") ||
                  "Aucune description disponible"}
              </p>
              {service.description && service.description.length > 200 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-blue-600 text-sm mt-2 hover:underline"
                >
                  {expanded ? "Voir moins" : "Voir plus"}
                </button>
              )}
            </div>
          </div>

          {/* Forfaits */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Forfaits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {service.packages.map((pkg, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {pkg.name}
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix:</span>
                      <span className="font-semibold text-green-600">
                        ${pkg.price}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Délai:</span>
                      <span>{pkg.deliveryDays} jours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Révisions:</span>
                      <span>{pkg.revisions}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    {pkg.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Galerie d'images */}
          {service.images && service.images.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Galerie ({service.images.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {service.images.map((image, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vidéo */}
          {service.video_url && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Vidéo de présentation
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <video
                  src={service.video_url}
                  controls
                  className="w-full max-h-96"
                />
              </div>
            </div>
          )}

          {/* Documents */}
          {service.documents && service.documents.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Documents ({service.documents.length})
              </h3>
              <div className="space-y-2">
                {service.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-600">{doc.size}</p>
                      </div>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Télécharger
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== COMPOSANT PRINCIPAL ====================

const ServiceList: React.FC = () => {
  const {
    services,
    isLoading,
    changerStatut,
    supprimerService,
    getServicesByFreelanceId,
    rechercherServices,
  } = useServices();

  const [activeTab, setActiveTab] = useState<StatutService | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [serviceToView, setServiceToView] = useState<Service | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { currentSession } = useAuth();
  const userId = currentSession?.userProfile?.id;

  const { getUserFreelance } = useFreelances();

  // Récupérer dynamiquement le freelance de l'utilisateur connecté
  const freelance = userId ? getUserFreelance(userId) : false;
  const FREELANCE_ID: any = freelance && freelance.id;
  const ITEMS_PER_PAGE = 6;

  const tabs = [
    { id: "all" as const, label: "Tous", icon: Package },
    { id: "actif" as const, label: "Actifs", icon: CheckCircle },
    { id: "en_pause" as const, label: "En pause", icon: Pause },
    { id: "en_attente" as const, label: "En attente", icon: Clock },
    { id: "a_modifier" as const, label: "À modifier", icon: Edit },
    { id: "suspendre" as const, label: "Suspendus", icon: AlertTriangle },
  ];

  // Récupérer les services du freelance
  const freelanceServices = useMemo(() => {
    return getServicesByFreelanceId(FREELANCE_ID);
  }, [getServicesByFreelanceId, FREELANCE_ID]);

  // Filtrer et rechercher les services
  const filteredServices = useMemo(() => {
    let filtered = freelanceServices;

    // Filtre par statut
    if (activeTab !== "all") {
      filtered = filtered.filter((service) => service.statut === activeTab);
    }

    // Recherche
    if (searchTerm.trim()) {
      filtered = rechercherServices(searchTerm).filter((service) =>
        freelanceServices.some((s) => s.id === service.id)
      );
    }

    return filtered;
  }, [freelanceServices, activeTab, searchTerm, rechercherServices]);

  // Pagination
  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredServices, currentPage]);

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);

  // Gestionnaires d'événements
  const handleStatusChange = async (
    serviceId: string,
    newStatus: StatutService
  ) => {
    try {
      await changerStatut(serviceId, newStatus);
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      alert("Erreur lors du changement de statut");
    }
  };

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (serviceToDelete) {
      try {
        await supprimerService(serviceToDelete.id);
        setShowDeleteModal(false);
        setServiceToDelete(null);
        // Réinitialiser la pagination si nécessaire
        if (paginatedServices.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression du service");
      }
    }
  };

  const handleViewClick = (service: Service) => {
    setServiceToView(service);
    setShowDetailModal(true);
  };

  const handleEditClick = (service: Service) => {
    redirect(`./Service/Edit?id=${service.id}&${FREELANCE_ID}`);
  };

  // Statistiques
  const stats = useMemo(() => {
    const total = freelanceServices.length;
    const active = freelanceServices.filter((s) => s.statut === "actif").length;
    const paused = freelanceServices.filter(
      (s) => s.statut === "en_pause"
    ).length;
    const pending = freelanceServices.filter(
      (s) => s.statut === "en_attente"
    ).length;
    const toModify = freelanceServices.filter(
      (s) => s.statut === "a_modifier"
    ).length;
    const suspended = freelanceServices.filter(
      (s) => s.statut === "suspendre"
    ).length;

    return { total, active, paused, pending, toModify, suspended };
  }, [freelanceServices]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des services...</p>
        </div>
      </div>
    );
  }

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
              onClick={() => (window.location.href = "./Service/Nouveau")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center font-semibold shadow-sm"
            >
              <Plus size={20} className="mr-2" />
              Créer un Service
            </button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.active}
              </div>
              <div className="text-sm text-green-600">Actifs</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.paused}
              </div>
              <div className="text-sm text-yellow-600">En pause</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.pending}
              </div>
              <div className="text-sm text-blue-600">En attente</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.toModify}
              </div>
              <div className="text-sm text-orange-600">À modifier</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.suspended}
              </div>
              <div className="text-sm text-red-600">Suspendus</div>
            </div>
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
                  tab.id === "all"
                    ? freelanceServices.length
                    : freelanceServices.filter((s) => s.statut === tab.id)
                        .length;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setCurrentPage(1);
                    }}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={handleEditClick}
              onView={handleViewClick}
              onDelete={handleDeleteClick}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Précédent
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-green-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun service trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || activeTab !== "all"
                ? "Aucun résultat pour vos critères de recherche"
                : "Commencez par créer votre premier service"}
            </p>
            {!searchTerm && activeTab === "all" && (
              <button
                onClick={() => (window.location.href = "/add-service")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center font-semibold"
              >
                <Plus size={20} className="mr-2" />
                Créer mon premier service
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer le service "${serviceToDelete?.title}" ? Cette action est irréversible et toutes les données associées (images, vidéos, documents) seront définitivement supprimées.`}
        confirmText="Supprimer définitivement"
        confirmColor="bg-red-600 hover:bg-red-700"
      />

      {/* Modal de détails */}
      <DetailModal
        service={serviceToView}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </div>
  );
};

export default ServiceList;
