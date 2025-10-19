"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  FreelanceFormData,
  useFreelances,
} from "@/Context/Freelance/FreelanceContext";
import { useServices } from "@/Context/Freelance/ContextService";
import PoserUneQuestion from "@/Module/Client/PoserUneQuestion/PoserUneQuestion";

// Types pour les données
interface ProfileData {
  name: string;
  username: string;
  level: string;
  description: string;
  rating: string;
  location: string;
  language: string;
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

interface Service {
  id: string;
  title: string;
  description: string;
  packages?: Package[];
  statut: string;
}

interface Package {
  price: string;
  deliveryDays: string;
}

const FreelancerProfile = () => {
  const searchParams = useSearchParams();
  const freelanceId = searchParams.get("id");
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [showEnglish, setShowEnglish] = useState(false);
  const [activeTab, setActiveTab] = useState("services");
  const [isLoading, setIsLoading] = useState(true);

  // Contextes pour récupérer les données depuis le serveur
  const { getFreelanceById } = useFreelances();
  const { getServicesByFreelanceId } = useServices();

  // États pour les données récupérées
  const [freelance, setFreelance] = useState<FreelanceFormData | null>(null);
  const [freelanceServices, setFreelanceServices] = useState<Service[]>([]);
  const UserFreelance = freelance?.id_user;
  // Données par défaut pour le profil (à remplacer par les données du freelance)
  const profileData: ProfileData = {
    name: freelance ? `${freelance.prenom} ${freelance.nom}` : "Freelancer",
    username: freelance?.username || "username",
    level: "Expert",
    description: freelance?.description || "Description du freelance",
    rating: "4,9",
    location: "Paris, France",
    language: "Français, Anglais",
    contact: {
      localTime: "GMT+1",
    },
  };

  // Données par défaut pour les témoignages et portfolio (à remplacer par des données serveur)
  const testimonials = [
    {
      id: 1,
      name: "Sophie Martin",
      company: "Boutique Élégance",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
      rating: 5,
      date: "15 Juin 2024",
      comment:
        "Akibur a transformé mon site Wix en une boutique e-commerce professionnelle qui a doublé mes ventes en seulement 2 mois. Son expertise technique et sa créativité ont dépassé mes attentes.",
    },
    {
      id: 2,
      name: "Jean Dupont",
      company: "Conseil JD",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      date: "28 Mai 2024",
      comment:
        "Excellente collaboration avec Akibur pour l'optimisation SEO de notre site. Résultats visibles dès le premier mois avec une augmentation de 45% du trafic organique.",
    },
    {
      id: 3,
      name: "Marie Leclerc",
      company: "Studio Design ML",
      image: "https://randomuser.me/api/portraits/women/22.jpg",
      rating: 4,
      date: "10 Avril 2024",
      comment:
        "Service rapide et professionnel. Le design proposé correspondait parfaitement à notre identité de marque. Je recommande vivement pour tout projet Wix.",
    },
  ];

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
    {
      id: 4,
      title: "Application de Réservation",
      category: "Application Web",
      image: "https://source.unsplash.com/random/600x400?app,booking",
      description: "Système de réservation en ligne pour un salon de coiffure",
    },
  ];

  // Chargement des données du freelance et de ses services
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
          setFreelanceServices(
            services.filter((service: Service) => service.statut === "actif")
          );
        }
      }

      setIsLoading(false);
    };

    loadData();
  }, [freelanceId, getFreelanceById, getServicesByFreelanceId]);

  // Statistiques calculées à partir des données réelles
  const statistics = [
    {
      label: "Projets complétés",
      value: freelanceServices ? freelanceServices.length.toString() : "0",
    },
    { label: "Taux de satisfaction", value: "98%" },
    { label: "Clients fidèles", value: "57" },
    {
      label: "Années d'expérience",
      value:
        freelance?.formations && freelance.formations.length > 0
          ? `${
              Math.max(
                ...freelance.formations.map((f: Formation) => parseInt(f.annee))
              ) -
              Math.min(
                ...freelance.formations.map((f: Formation) => parseInt(f.annee))
              )
            } ans`
          : "0 ans",
    },
  ];

  // Fonction pour générer les étoiles de notation
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={`full-${i}`} className="fas fa-star text-yellow-400"></i>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <i key="half" className="fas fa-star-half-alt text-yellow-400"></i>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i key={`empty-${i}`} className="far fa-star text-yellow-400"></i>
      );
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
      <header className="pt-20 pb-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {freelance.prenom.charAt(0)}
                {freelance.nom.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 h-5 w-5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            {/* Informations principales */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profileData.name}
                  </h1>
                  <p className="text-gray-600 flex items-center gap-2">
                    {profileData.username}{" "}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {profileData.level}
                    </span>
                  </p>
                  <p className="text-gray-700 mt-2">
                    {profileData.description}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                  <div className="flex items-center mb-2">
                    <span className="mr-2 font-medium text-gray-900">
                      Note :
                    </span>
                    <div className="flex items-center">
                      {renderStars(
                        parseFloat(profileData.rating.replace(",", "."))
                      )}
                      <span className="ml-2 text-gray-700">
                        {profileData.rating}/5
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMessagingOpen(true)}
                    className="mb-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Contacter
                  </button>
                  <div className="flex items-center gap-4 text-gray-600 text-sm">
                    <div className="flex items-center">
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      <span>{profileData.location}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-globe mr-2"></i>
                      <span>{profileData.language}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-clock mr-2"></i>
                      <span>{profileData.contact.localTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {statistics.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
              >
                <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {["services", "portfolio", "témoignages", "à propos"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Services */}
        {activeTab === "services" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Mes Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freelanceServices && freelanceServices.length > 0 ? (
                freelanceServices.map((service: Service) => (
                  <div
                    key={service.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        {service.description.substring(0, 120)}...
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          {renderStars(4.8)}
                          <span className="ml-2 text-sm text-gray-600">
                            (30)
                          </span>
                        </div>
                        <span className="text-blue-600 font-bold">
                          {service.packages && service.packages.length > 0
                            ? `À partir de ${service.packages[0].price}€`
                            : "Prix sur demande"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span className="flex items-center">
                          <i className="far fa-clock mr-2"></i>
                          {service.packages && service.packages.length > 0
                            ? `${service.packages[0].deliveryDays} jours`
                            : "Délai à définir"}
                        </span>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                          Commander
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">
                    Aucun service disponible pour le moment.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Portfolio */}
        {activeTab === "portfolio" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Portfolio de projets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                      {project.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {project.description}
                    </p>
                    <button className="mt-3 text-blue-600 text-sm font-medium hover:text-blue-800">
                      Voir le projet →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Témoignages */}
        {activeTab === "témoignages" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Témoignages clients
            </h2>
            <div className="space-y-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {testimonial.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {testimonial.company}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {testimonial.date}
                        </span>
                      </div>
                      <div className="flex mb-3">
                        {renderStars(testimonial.rating)}
                      </div>
                      <p className="text-gray-700">{testimonial.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* À propos */}
        {activeTab === "à propos" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">À propos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Mon parcours
                  </h3>
                  <p className="text-gray-700 mb-4">{freelance.description}</p>

                  {freelance.formations && freelance.formations.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-800 mb-2">
                        Formation
                      </h4>
                      <div className="space-y-2">
                        {freelance.formations.map(
                          (formation: Formation, index: number) => (
                            <div key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                              <p className="text-gray-700">
                                {formation.universite}, {formation.pays} -{" "}
                                {formation.annee}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {freelance.certifications &&
                    freelance.certifications.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-md font-semibold text-gray-800 mb-2">
                          Certifications
                        </h4>
                        <div className="space-y-2">
                          {freelance.certifications.map(
                            (certification: Certification, index: number) => (
                              <div key={index} className="flex items-center">
                                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                                <p className="text-gray-700">
                                  {certification.nom} ({certification.annee})
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
              <div>
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Compétences
                  </h3>
                  <div className="space-y-3">
                    {freelance.competences &&
                      freelance.competences.map(
                        (skill: string, index: number) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">
                                {skill}
                              </span>
                              <span className="text-sm font-medium text-blue-600">
                                {90 + (index % 10)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${90 + (index % 10)}%` }}
                              ></div>
                            </div>
                          </div>
                        )
                      )}
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Contactez-moi
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    <p className="flex items-center">
                      <i className="fas fa-clock mr-3 text-blue-600"></i>
                      Temps de réponse moyen: 1 heure
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    {freelance.sites_web &&
                      freelance.sites_web.length > 0 &&
                      freelance.sites_web.map((site: string, index: number) => {
                        // Déterminer l'icône en fonction de l'URL
                        let icon = "fas fa-globe";
                        if (site.includes("linkedin"))
                          icon = "fab fa-linkedin-in";
                        if (site.includes("github")) icon = "fab fa-github";
                        if (site.includes("twitter") || site.includes("x.com"))
                          icon = "fab fa-twitter";
                        if (site.includes("facebook"))
                          icon = "fab fa-facebook-f";
                        if (site.includes("instagram"))
                          icon = "fab fa-instagram";

                        return (
                          <a
                            key={index}
                            href={site}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white"
                          >
                            <i className={icon}></i>
                          </a>
                        );
                      })}
                  </div>
                  <button className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Contacter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Pied de page */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold text-gray-900">
              {freelance.prenom} {freelance.nom}
            </h2>
            <p className="text-gray-600 mt-1">
              {freelance.occupations && freelance.occupations.length > 0
                ? freelance.occupations.join(" • ")
                : "Freelancer"}
            </p>
            <p className="mt-6 text-center text-base text-gray-500">
              &copy; 2024 {freelance.prenom} {freelance.nom}. Tous droits
              réservés.
            </p>
          </div>
        </div>
      </footer>
      <PoserUneQuestion
        open={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
        id={UserFreelance}
      />
    </div>
  );
};

export default FreelancerProfile;
