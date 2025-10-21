"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  FreelanceFormData,
  useFreelances,
} from "@/Context/Freelance/FreelanceContext";
import { useServices, Service } from "@/Context/Freelance/ContextService";
import PoserUneQuestion from "@/Module/Client/PoserUneQuestion/PoserUneQuestion";

import {
  Heart,
  Star,
  MapPin,
  Globe,
  Clock,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ServiceCard } from "@/Module/Client/CadreService/CadreService";

// Types pour les données
interface ProfileData {
  name: string;
  username: string;
  level: string;
  description: string;
  rating: string;
  location: string;
  language: string[];
  contact: {
    localTime: string;
  };
}

interface Freelance {
  id: string;
  nom: string;
  prenom: string;
  username: string;
  description: string;
  occupations: string[];
  competences: string[];
  formations: Formation[];
  certifications: Certification[];
  sites_web: string[];
}

interface Formation {
  pays: string;
  universite: string;
  annee: string;
  id?: number;
}

interface Certification {
  nom: string;
  annee: string;
  id?: number;
}

interface ServiceImage {
  id: string;
  name: string;
  url: string;
  path: string;
  type: string;
}

interface Seller {
  name: string;
  level: string;
  isTopRated: boolean;
  isOnline: boolean;
  photo_url?: string;
}

// Interface renommée pour éviter le conflit avec Service du contexte
interface ServiceDisplay {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  rating: number;
  reviews: number;
  images: ServiceImage[];
  video_url?: string;
  hasVideo?: boolean;
  freelance_id: string;
  seller: Seller;
  badges: string[];
}

const FreelancerProfile = () => {
  const searchParams = useSearchParams();
  const freelanceId = searchParams.get("id");
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("services");
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Contextes pour récupérer les données depuis le serveur
  const { getFreelanceById, getPhotoProfileUrl } = useFreelances();
  const { getServicesByFreelanceId } = useServices();

  // États pour les données récupérées
  const [freelance, setFreelance] = useState<FreelanceFormData | null>(null);
  const [freelanceServices, setFreelanceServices] = useState<ServiceDisplay[]>(
    []
  );
  const UserFreelance = freelance?.id_user;

  // Données par défaut pour le profil
  const profileData: ProfileData = {
    name: freelance ? `${freelance.prenom} ${freelance.nom}` : "Freelancer",
    username: freelance?.username || "username",
    level: "Expert",
    description: freelance?.description || "Description du freelance",
    rating: "4,9",
    location: freelance?.pays + " " + freelance?.ville || "",
    language:
      freelance?.langues.find((item) => item.langue)?.langue.split(", ") || [],
    contact: {
      localTime: "GMT+1",
    },
  };

  // Données pour le portfolio
  const portfolio = [
    {
      id: 1,
      title: "Boutique Bio & Naturel",
      category: "E-commerce",
      image: "https://source.unsplash.com/random/600x400?website,ecommerce",
      description:
        "Site e-commerce pour une boutique de produits bio et naturels",
    },
    {
      id: 2,
      title: "Cabinet d'Architecture",
      category: "Site Vitrine",
      image: "https://source.unsplash.com/random/600x400?architecture,website",
      description:
        "Présentation portfolio pour un cabinet d'architecture moderne",
    },
    {
      id: 3,
      title: "Blog Culinaire Premium",
      category: "Blog",
      image: "https://source.unsplash.com/random/600x400?food,blog",
      description: "Blog gastronomique avec monétisation et section membres",
    },
  ];

  // Chargement des données
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      if (freelanceId) {
        // Récupérer les données du freelance
        const freelanceData = getFreelanceById(freelanceId);

        if (freelanceData) {
          setFreelance(freelanceData);

          // Récupérer les services du freelance
          const services = getServicesByFreelanceId(freelanceId);

          // Transformer les services du contexte en ServiceDisplay
          const transformedServices: ServiceDisplay[] = services
            .filter((service: Service) => service.statut === "actif")
            .map((service: any) => ({
              id: service.id || "",
              title: service.titre || service.title || "",
              description: service.description || "",
              category: service.categorie || service.category || "",
              subcategory: service.subcategory || "",
              price: service.prix || service.price || 0,
              rating: service.note || service.rating || 4.5,
              reviews: service.nombre_avis || service.reviews || 0,
              images: service.images || [],
              video_url: service.video_url,
              hasVideo: !!service.video_url,
              freelance_id: service.freelance_id || freelanceId,
              seller: {
                name: `${freelanceData.prenom} ${freelanceData.nom}`,
                level: "Expert",
                isTopRated: true,
                isOnline: true,
                photo_url:
                  freelanceData.photo_url &&
                  getPhotoProfileUrl(freelanceData.photo_url),
              },
              badges: service.badges || [],
            }));

          setFreelanceServices(transformedServices);
        }
      }

      setIsLoading(false);
    };

    loadData();
  }, [
    freelanceId,
    getFreelanceById,
    getPhotoProfileUrl,
    getServicesByFreelanceId,
  ]);

  // Gestion des favoris
  const handleFavorite = (serviceId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(serviceId)) {
        newFavorites.delete(serviceId);
      } else {
        newFavorites.add(serviceId);
      }
      return newFavorites;
    });
  };

  // Statistiques
  const statistics = [
    {
      label: "Services actifs",
      value: freelanceServices ? freelanceServices.length.toString() : "0",
    },
    { label: "Taux de satisfaction", value: "98%" },
    { label: "Clients fidèles", value: "57" },
    {
      label: "Expérience",
      value:
        freelance?.formations && freelance.formations.length > 0
          ? `${
              new Date().getFullYear() -
              Math.min(
                ...freelance.formations.map((f: Formation) => parseInt(f.annee))
              )
            } ans`
          : "0 ans",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!freelance) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Freelancer non trouvé
          </h2>
          <p className="text-gray-600">
            Le profil que vous recherchez n'existe pas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* En-tête du profil */}
      <header className="pt-20 pb-12 bg-gradient-to-br from-gray-200 via-yellow-50 to-yellow-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Avatar avec effet glassmorphism */}
            <div className="relative">
              <div className="w-32 h-32 bg-white backdrop-blur-lg rounded-2xl flex items-center justify-center text-blue-400 text-4xl font-bold border-2 border-blue-300 shadow-xl">
                {freelance.photo_url ? (
                  <img
                    src={
                      freelance.photo_url &&
                      getPhotoProfileUrl(freelance.photo_url)
                    }
                    alt={freelance.nom}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  freelance.prenom.charAt(0) + " " + freelance.nom.charAt(0)
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-yellow-400 border-4 border-white rounded-full shadow-lg"></div>
            </div>

            {/* Informations principales */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold text-gray-800">
                    {profileData.name}
                  </h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-gray-600">@{profileData.username}</p>
                    <span className="px-3 py-1 bg-yellow-200 rounded-full text-sm font-medium text-gray-700 border border-yellow-300">
                      {profileData.level}
                    </span>
                  </div>
                  <p className="text-gray-600 max-w-2xl leading-relaxed">
                    {profileData.description}
                  </p>
                </div>

                <div className="flex flex-col items-start lg:items-end gap-3 mt-4 lg:mt-0">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border-2 border-yellow-300 shadow-md">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-800">
                      {profileData.rating}
                    </span>
                    <span className="text-gray-600">/5</span>
                  </div>

                  <button
                    onClick={() => setIsMessagingOpen(true)}
                    className="px-6 py-3 bg-blue-300 text-gray-800 rounded-xl font-semibold hover:bg-blue-400 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Contacter
                  </button>

                  <div className="flex items-center gap-4 text-gray-700 text-sm flex-wrap">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profileData.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <span>{profileData.language}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{profileData.contact.localTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistiques avec design moderne */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {statistics.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-4 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-sm"
                  >
                    <p className="text-2xl font-bold text-gray-800">
                      {stat.value}
                    </p>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation par onglets moderne */}
      <div className="sticky top-0 z-40 bg-white border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1">
            {[
              { id: "services", label: "Services", icon: "🛠️" },
              { id: "portfolio", label: "Portfolio", icon: "🎨" },
              { id: "about", label: "À propos", icon: "👤" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "bg-blue-200 text-gray-800 shadow-md border-2 border-blue-300"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                } flex items-center gap-2 px-6 py-4 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Services avec le composant ServiceCard */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-800">Mes Services</h2>
              <span className="px-4 py-2 bg-blue-200 text-gray-800 rounded-full font-medium border-2 border-blue-300">
                {freelanceServices.length} services disponibles
              </span>
            </div>

            {freelanceServices && freelanceServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {freelanceServices.map((service: ServiceDisplay) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onFavorite={handleFavorite}
                    isFavorited={favorites.has(service.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-gray-200">
                  <span className="text-3xl">🛠️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun service disponible
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Ce freelance n'a pas encore publié de services. N'hésitez pas
                  à le contacter pour discuter de votre projet.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Portfolio */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Portfolio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((project) => (
                <div
                  key={project.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border-2 border-gray-200 hover:border-blue-300"
                >
                  <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-gray-100 to-blue-100">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-flex items-center px-3 py-1 bg-yellow-200 text-gray-800 text-sm font-medium rounded-full mb-3 border border-yellow-300">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {project.description}
                    </p>
                    <button className="mt-4 w-full py-3 bg-blue-300 text-gray-800 rounded-xl font-semibold hover:bg-blue-400 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg">
                      Voir le projet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* À propos */}
        {activeTab === "about" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">
              À propos de moi
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Colonne principale */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-2 h-8 bg-gradient-to-b from-blue-300 to-blue-400 rounded-full"></span>
                    Mon parcours
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {freelance.description}
                  </p>
                </div>

                {/* Formations */}
                {freelance.formations && freelance.formations.length > 0 && (
                  <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="w-2 h-8 bg-gradient-to-b from-blue-300 to-blue-400 rounded-full"></span>
                      Formation
                    </h3>
                    <div className="space-y-6">
                      {freelance.formations.map(
                        (formation: Formation, index: number) => (
                          <div key={index} className="flex gap-4 group">
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                              <div className="w-0.5 h-full bg-gradient-to-b from-blue-200 to-gray-200 mt-1"></div>
                            </div>
                            <div className="flex-1 pb-6">
                              <h4 className="font-bold text-gray-900 text-lg">
                                {formation.universite}
                              </h4>
                              <p className="text-gray-600">{formation.pays}</p>
                              <p className="text-blue-400 font-semibold">
                                {formation.annee}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {freelance.certifications &&
                  freelance.certifications.length > 0 && (
                    <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-gradient-to-b from-blue-300 to-blue-400 rounded-full"></span>
                        Certifications
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {freelance.certifications.map(
                          (certification: Certification, index: number) => (
                            <div
                              key={index}
                              className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 border-2 border-blue-300"
                            >
                              <h4 className="font-bold text-gray-900">
                                {certification.nom}
                              </h4>
                              <p className="text-blue-400 font-semibold">
                                {certification.annee}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {/* Colonne latérale */}
              <div className="space-y-6">
                {/* Compétences */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Compétences
                  </h3>
                  <div className="space-y-4">
                    {freelance.competences &&
                      freelance.competences.map(
                        (skill: string, index: number) => (
                          <div key={index} className="group">
                            <div className="flex justify-between mb-2">
                              <span className="font-medium text-gray-700">
                                {skill}
                              </span>
                              <span className="text-blue-400 font-bold">
                                {90 + (index % 10)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-blue-300 to-blue-400 h-2 rounded-full transition-all duration-1000 ease-out group-hover:from-blue-400 group-hover:to-yellow-400"
                                style={{ width: `${90 + (index % 10)}%` }}
                              ></div>
                            </div>
                          </div>
                        )
                      )}
                  </div>
                </div>

                {/* Contact & Réseaux sociaux */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Contact
                  </h3>

                  <div className="space-y-3 text-gray-700 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-blue-100 rounded-xl border border-blue-200">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-medium">Temps de réponse</p>
                        <p className="text-sm text-blue-400">Moins d'1 heure</p>
                      </div>
                    </div>
                  </div>

                  {/* Réseaux sociaux */}
                  {freelance.sites_web && freelance.sites_web.length > 0 && (
                    <>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Réseaux sociaux
                      </h4>
                      <div className="flex gap-3">
                        {freelance.sites_web.map(
                          (site: string, index: number) => {
                            const getPlatformInfo = (url: string) => {
                              if (url.includes("linkedin"))
                                return { icon: "💼", color: "bg-blue-300" };
                              if (url.includes("github"))
                                return { icon: "💻", color: "bg-gray-400" };
                              if (
                                url.includes("twitter") ||
                                url.includes("x.com")
                              )
                                return { icon: "🐦", color: "bg-blue-200" };
                              if (url.includes("facebook"))
                                return { icon: "👥", color: "bg-blue-300" };
                              if (url.includes("instagram"))
                                return { icon: "📸", color: "bg-yellow-300" };
                              return { icon: "🌐", color: "bg-gray-300" };
                            };

                            const platform = getPlatformInfo(site);

                            return (
                              <a
                                key={index}
                                href={site}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-12 h-12 ${platform.color} text-gray-800 rounded-xl flex items-center justify-center text-lg hover:scale-110 transition-transform duration-300 shadow-md hover:shadow-lg border-2 border-gray-300`}
                              >
                                {platform.icon}
                              </a>
                            );
                          }
                        )}
                      </div>
                    </>
                  )}

                  <button
                    onClick={() => setIsMessagingOpen(true)}
                    className="mt-6 w-full py-3 bg-blue-300 text-gray-800 rounded-xl font-semibold hover:bg-blue-400 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                  >
                    Contacter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Pied de page */}
      <footer className="bg-gradient-to-br from-gray-100 to-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-white backdrop-blur-lg rounded-2xl flex items-center justify-center text-2xl font-bold border-2 border-blue-400 text-blue-400">
              {freelance.prenom.charAt(0)}
              {freelance.nom.charAt(0)}
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              {freelance.prenom} {freelance.nom}
            </h2>

            <p className="text-gray-700 text-lg">
              {freelance.occupations && freelance.occupations.length > 0
                ? freelance.occupations.join(" • ")
                : "Freelancer professionnel"}
            </p>

            <p className="text-gray-600 mt-8">
              &copy; 2024 {freelance.prenom} {freelance.nom}. Tous droits
              réservés.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de contact */}
      <PoserUneQuestion
        open={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
        id={UserFreelance}
      />
    </div>
  );
};

export default FreelancerProfile;
