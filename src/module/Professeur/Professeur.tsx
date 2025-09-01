import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  User,
  Users,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

// Types
interface Professeur {
  id: string;
  code: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  dateEmbauche: string;
  matieres: string;
  classes: string;
  diplomes: string;
  statut: "actif" | "inactif";
}

interface Props {
  isDarkMode?: boolean;
}

const GestionProfesseurs = ({ isDarkMode = false }: Props) => {
  // État des professeurs
  const [professeurs, setProfesseurs] = useState<Professeur[]>([
    {
      id: "1",
      code: "PROF001",
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@institut.edu",
      telephone: "+509 1234-5678",
      adresse: "123 Rue des Écoles, Port-au-Prince",
      dateEmbauche: "2020-09-01",
      matieres: "Mathématiques, Physique",
      classes: "9ème AF, Seconde",
      diplomes: "Licence en Mathématiques",
      statut: "actif",
    },
    {
      id: "2",
      code: "PROF002",
      nom: "Martin",
      prenom: "Marie",
      email: "marie.martin@institut.edu",
      telephone: "+509 8765-4321",
      adresse: "456 Avenue de l'Éducation, Port-au-Prince",
      dateEmbauche: "2019-08-15",
      matieres: "Français, Histoire-Géographie",
      classes: "7ème AF, 8ème AF",
      diplomes: "Licence en Lettres Modernes",
      statut: "actif",
    },
    {
      id: "3",
      code: "PROF003",
      nom: "Bernard",
      prenom: "Pierre",
      email: "pierre.bernard@institut.edu",
      telephone: "+509 9876-5432",
      adresse: "789 Boulevard des Sciences, Port-au-Prince",
      dateEmbauche: "2021-01-10",
      matieres: "Anglais",
      classes: "9ème AF, Première, Terminale",
      diplomes: "Master en Langues Étrangères",
      statut: "inactif",
    },
  ]);

  // États d'interface
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<
    "add" | "edit" | "view" | "delete"
  >("add");
  const [selectedProf, setSelectedProf] = useState<Professeur | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // État du formulaire
  const [formData, setFormData] = useState<Omit<Professeur, "id">>({
    code: "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    dateEmbauche: "",
    matieres: "",
    classes: "",
    diplomes: "",
    statut: "actif",
  });

  // Styles conditionnels

  const baseClasses = isDarkMode
    ? "min-h-screen bg-gray-900 text-white"
    : "min-h-screen bg-gray-50 text-gray-900";

  const cardClasses = isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  const inputClasses = isDarkMode
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-400 focus:border-blue-400"
    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500";

  const buttonPrimaryClasses = isDarkMode
    ? "bg-blue-700 hover:bg-blue-600 text-white"
    : "bg-blue-600 hover:bg-blue-700 text-white";

  const buttonSecondaryClasses = isDarkMode
    ? "bg-gray-600 hover:bg-gray-500 text-white"
    : "bg-gray-300 hover:bg-gray-400 text-gray-700";

  const buttonDangerClasses = isDarkMode
    ? "bg-red-700 hover:bg-red-600 text-white"
    : "bg-red-600 hover:bg-red-700 text-white";

  const tableHeaderClasses = isDarkMode
    ? "bg-gray-700 text-gray-300"
    : "bg-gray-50 text-gray-500";

  const tableRowClasses = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50";

  const tableBorderClasses = isDarkMode ? "divide-gray-700" : "divide-gray-200";

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      code: "",
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      adresse: "",
      dateEmbauche: "",
      matieres: "",
      classes: "",
      diplomes: "",
      statut: "actif",
    });
  };

  // Générer un nouveau code professeur
  const generateProfCode = () => {
    const lastCode = professeurs.reduce((max, prof) => {
      const num = parseInt(prof.code.slice(-3));
      return num > max ? num : max;
    }, 0);
    return `PROF${String(lastCode + 1).padStart(3, "0")}`;
  };

  // Ouvrir modal
  const openModal = (
    type: "add" | "edit" | "view" | "delete",
    prof: Professeur | null = null
  ) => {
    setModalType(type);
    setSelectedProf(prof);

    if (type === "add") {
      resetForm();
      setFormData((prev) => ({ ...prev, code: generateProfCode() }));
    } else if (type === "edit" && prof) {
      setFormData({ ...prof });
    }

    setShowModal(true);
  };

  // Fermer modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedProf(null);
    resetForm();
  };

  // Soumettre le formulaire
  const handleSubmit = () => {
    if (!formData.nom || !formData.prenom || !formData.email) {
      alert(
        "Veuillez remplir tous les champs obligatoires (nom, prénom, email)"
      );
      return;
    }

    if (modalType === "add") {
      if (professeurs.some((p) => p.code === formData.code)) {
        alert("Ce code professeur existe déjà");
        return;
      }

      const nouveauProf: Professeur = {
        ...formData,
        id: Date.now().toString(),
      };

      setProfesseurs((prev) => [...prev, nouveauProf]);
      alert("Professeur ajouté avec succès!");
    } else if (modalType === "edit" && selectedProf) {
      setProfesseurs((prev) =>
        prev.map((p) =>
          p.id === selectedProf.id ? { ...formData, id: selectedProf.id } : p
        )
      );
      alert("Professeur modifié avec succès!");
    }

    closeModal();
  };

  // Supprimer professeur
  const handleDelete = () => {
    if (!selectedProf) return;

    setProfesseurs((prev) => prev.filter((p) => p.id !== selectedProf.id));
    alert("Professeur supprimé avec succès!");
    closeModal();
  };

  // Gérer les changements d'input
  const handleInputChange = (
    field: keyof Omit<Professeur, "id">,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Filtrer les professeurs
  const filteredProfesseurs = professeurs.filter((prof) => {
    if (searchTerm === "") return true;
    const search = searchTerm.toLowerCase();
    return (
      prof.nom.toLowerCase().includes(search) ||
      prof.prenom.toLowerCase().includes(search) ||
      prof.code.toLowerCase().includes(search) ||
      prof.email.toLowerCase().includes(search) ||
      prof.matieres.toLowerCase().includes(search)
    );
  });

  return (
    <div className={`${baseClasses} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gestion des Professeurs</h1>
          <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
            Système de gestion du personnel enseignant - SIGEP
          </p>
        </div>

        {/* Barre d'actions */}
        <div className={`${cardClasses} rounded-lg shadow-sm border p-6 mb-6`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un professeur..."
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => openModal("add")}
              className={`${buttonPrimaryClasses} px-4 py-2 rounded-lg flex items-center gap-2 transition-colors`}
            >
              <Plus className="h-4 w-4" />
              Ajouter un Professeur
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className={`${cardClasses} p-6 rounded-lg shadow-sm border`}>
            <div className="flex items-center">
              <div
                className={`p-2 rounded-lg ${
                  isDarkMode ? "bg-blue-900" : "bg-blue-100"
                }`}
              >
                <Users
                  className={`h-6 w-6 ${
                    isDarkMode ? "text-blue-300" : "text-blue-600"
                  }`}
                />
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Total Professeurs
                </p>
                <p className="text-2xl font-bold">{professeurs.length}</p>
              </div>
            </div>
          </div>

          <div className={`${cardClasses} p-6 rounded-lg shadow-sm border`}>
            <div className="flex items-center">
              <div
                className={`p-2 rounded-lg ${
                  isDarkMode ? "bg-green-900" : "bg-green-100"
                }`}
              >
                <CheckCircle
                  className={`h-6 w-6 ${
                    isDarkMode ? "text-green-300" : "text-green-600"
                  }`}
                />
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Actifs
                </p>
                <p className="text-2xl font-bold">
                  {professeurs.filter((p) => p.statut === "actif").length}
                </p>
              </div>
            </div>
          </div>

          <div className={`${cardClasses} p-6 rounded-lg shadow-sm border`}>
            <div className="flex items-center">
              <div
                className={`p-2 rounded-lg ${
                  isDarkMode ? "bg-red-900" : "bg-red-100"
                }`}
              >
                <AlertTriangle
                  className={`h-6 w-6 ${
                    isDarkMode ? "text-red-300" : "text-red-600"
                  }`}
                />
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Inactifs
                </p>
                <p className="text-2xl font-bold">
                  {professeurs.filter((p) => p.statut === "inactif").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des professeurs */}
        <div className={`${cardClasses} rounded-lg shadow-sm border`}>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Liste des Professeurs ({filteredProfesseurs.length})
            </h2>

            {filteredProfesseurs.length === 0 ? (
              <div className="text-center py-12">
                <User
                  className={`h-16 w-16 mx-auto mb-4 ${
                    isDarkMode ? "text-gray-600" : "text-gray-400"
                  }`}
                />
                <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                  Aucun professeur trouvé
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className={tableHeaderClasses}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Professeur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Matières
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${tableBorderClasses}`}>
                    {filteredProfesseurs.map((prof) => (
                      <tr key={prof.id} className={tableRowClasses}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div
                                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                  isDarkMode ? "bg-gray-600" : "bg-gray-300"
                                }`}
                              >
                                <User
                                  className={`h-5 w-5 ${
                                    isDarkMode
                                      ? "text-gray-300"
                                      : "text-gray-600"
                                  }`}
                                />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">
                                {prof.prenom} {prof.nom}
                              </div>
                              <div
                                className={`text-sm ${
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {prof.code}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">{prof.email}</div>
                          <div
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {prof.telephone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">{prof.matieres}</div>
                          <div
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {prof.classes}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              prof.statut === "actif"
                                ? isDarkMode
                                  ? "bg-green-900 text-green-300"
                                  : "bg-green-100 text-green-800"
                                : isDarkMode
                                ? "bg-red-900 text-red-300"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {prof.statut === "actif" ? "Actif" : "Inactif"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openModal("view", prof)}
                              className={`${
                                isDarkMode
                                  ? "text-gray-400 hover:text-gray-200"
                                  : "text-gray-600 hover:text-gray-900"
                              } p-1`}
                              title="Voir"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openModal("edit", prof)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openModal("delete", prof)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div
              className={`relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg rounded-md ${cardClasses} max-h-screen overflow-y-auto`}
            >
              <div className="mt-3">
                {/* En-tête du modal */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {modalType === "add" && "Ajouter un Professeur"}
                    {modalType === "edit" && "Modifier le Professeur"}
                    {modalType === "view" && "Détails du Professeur"}
                    {modalType === "delete" && "Confirmer la Suppression"}
                  </h3>
                  <button
                    onClick={closeModal}
                    className={`${
                      isDarkMode
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Contenu du modal */}
                {modalType === "delete" ? (
                  <div className="text-center">
                    <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
                    <p
                      className={`mb-6 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Êtes-vous sûr de vouloir supprimer le professeur{" "}
                      <strong>
                        {selectedProf?.prenom} {selectedProf?.nom}
                      </strong>{" "}
                      ? Cette action est irréversible.
                    </p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={closeModal}
                        className={`px-4 py-2 rounded-lg ${buttonSecondaryClasses}`}
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleDelete}
                        className={`px-4 py-2 rounded-lg ${buttonDangerClasses}`}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ) : modalType === "view" ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p>
                          <strong>Code:</strong> {selectedProf?.code}
                        </p>
                        <p>
                          <strong>Nom:</strong> {selectedProf?.nom}
                        </p>
                        <p>
                          <strong>Prénom:</strong> {selectedProf?.prenom}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedProf?.email}
                        </p>
                        <p>
                          <strong>Téléphone:</strong> {selectedProf?.telephone}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p>
                          <strong>Date d'embauche:</strong>{" "}
                          {new Date(
                            selectedProf?.dateEmbauche || ""
                          ).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Statut:</strong> {selectedProf?.statut}
                        </p>
                        <p>
                          <strong>Adresse:</strong> {selectedProf?.adresse}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p>
                        <strong>Matières enseignées:</strong>{" "}
                        {selectedProf?.matieres}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Classes assignées:</strong>{" "}
                        {selectedProf?.classes}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Diplômes:</strong> {selectedProf?.diplomes}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Code Professeur *
                        </label>
                        <input
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                          value={formData.code}
                          onChange={(e) =>
                            handleInputChange("code", e.target.value)
                          }
                          disabled={modalType === "edit"}
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Statut *
                        </label>
                        <select
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                          value={formData.statut}
                          onChange={(e) =>
                            handleInputChange(
                              "statut",
                              e.target.value as "actif" | "inactif"
                            )
                          }
                        >
                          <option value="actif">Actif</option>
                          <option value="inactif">Inactif</option>
                        </select>
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Nom *
                        </label>
                        <input
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                          value={formData.nom}
                          onChange={(e) =>
                            handleInputChange("nom", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Prénom *
                        </label>
                        <input
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                          value={formData.prenom}
                          onChange={(e) =>
                            handleInputChange("prenom", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                          value={formData.telephone}
                          onChange={(e) =>
                            handleInputChange("telephone", e.target.value)
                          }
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Adresse
                        </label>
                        <input
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                          value={formData.adresse}
                          onChange={(e) =>
                            handleInputChange("adresse", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Date d'embauche
                        </label>
                        <input
                          type="date"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                          value={formData.dateEmbauche}
                          onChange={(e) =>
                            handleInputChange("dateEmbauche", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Matières enseignées
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Mathématiques, Physique"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                          value={formData.matieres}
                          onChange={(e) =>
                            handleInputChange("matieres", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Classes assignées
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: 9ème AF, Seconde"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                          value={formData.classes}
                          onChange={(e) =>
                            handleInputChange("classes", e.target.value)
                          }
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Diplômes et qualifications
                        </label>
                        <textarea
                          rows={2}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                          value={formData.diplomes}
                          onChange={(e) =>
                            handleInputChange("diplomes", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex justify-end gap-4 mt-6">
                      <button
                        onClick={closeModal}
                        className={`px-4 py-2 rounded-lg ${buttonSecondaryClasses}`}
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSubmit}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${buttonPrimaryClasses}`}
                      >
                        <Save className="h-4 w-4" />
                        {modalType === "add" ? "Ajouter" : "Modifier"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionProfesseurs;
