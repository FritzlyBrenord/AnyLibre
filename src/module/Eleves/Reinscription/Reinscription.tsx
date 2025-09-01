import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  Filter,
  ArrowRight,
  Users,
  GraduationCap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

// Types
interface Student {
  id: string;
  code: string;
  nom: string;
  prenom: string;
  classeActuelle: string;
  salleActuelle: string;
  moyenneGenerale: number;
  status: "actif" | "inactif" | "suspendu";
}

interface ReenrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

// Données d'exemple des élèves avec moyennes
const sampleStudents: Student[] = [
  {
    id: "1",
    code: "ETU001",
    nom: "Duval",
    prenom: "Marie",
    classeActuelle: "6ème AF",
    salleActuelle: "6eA",
    moyenneGenerale: 7.5,
    status: "actif",
  },
  {
    id: "2",
    code: "ETU002",
    nom: "Jean-Baptiste",
    prenom: "Pierre",
    classeActuelle: "6ème AF",
    salleActuelle: "6eA",
    moyenneGenerale: 4.2,
    status: "actif",
  },
  {
    id: "3",
    code: "ETU003",
    nom: "Charles",
    prenom: "Anne",
    classeActuelle: "7ème AF",
    salleActuelle: "7eB",
    moyenneGenerale: 2.8,
    status: "actif",
  },
  {
    id: "4",
    code: "ETU004",
    nom: "Moreau",
    prenom: "Jean",
    classeActuelle: "7ème AF",
    salleActuelle: "7eA",
    moyenneGenerale: 6.75,
    status: "actif",
  },
  {
    id: "5",
    code: "ETU005",
    nom: "Laurent",
    prenom: "Sophie",
    classeActuelle: "8ème AF",
    salleActuelle: "8eA",
    moyenneGenerale: 5.8,
    status: "actif",
  },
  {
    id: "6",
    code: "ETU006",
    nom: "Martin",
    prenom: "Paul",
    classeActuelle: "9ème AF",
    salleActuelle: "9eB",
    moyenneGenerale: 8.2,
    status: "actif",
  },
  {
    id: "7",
    code: "ETU007",
    nom: "Bernard",
    prenom: "Lisa",
    classeActuelle: "Seconde",
    salleActuelle: "2ndA",
    moyenneGenerale: 3.9,
    status: "actif",
  },
  {
    id: "8",
    code: "ETU008",
    nom: "Petit",
    prenom: "Marc",
    classeActuelle: "Première",
    salleActuelle: "1ereA",
    moyenneGenerale: 7.1,
    status: "actif",
  },
  {
    id: "9",
    code: "ETU009",
    nom: "Robert",
    prenom: "Emma",
    classeActuelle: "Terminale",
    salleActuelle: "TermA",
    moyenneGenerale: 6.45,
    status: "actif",
  },
  {
    id: "10",
    code: "ETU010",
    nom: "Richard",
    prenom: "Alex",
    classeActuelle: "NS4",
    salleActuelle: "NS4A",
    moyenneGenerale: 5.9,
    status: "actif",
  },
];

const classes = [
  "6ème AF",
  "7ème AF",
  "8ème AF",
  "9ème AF",
  "Seconde",
  "Première",
  "Terminale",
  "NS4",
];

const sallesByClass: { [key: string]: string[] } = {
  "6ème AF": ["6eA", "6eB"],
  "7ème AF": ["7eA", "7eB", "7eC"],
  "8ème AF": ["8eA", "8eB"],
  "9ème AF": ["9eA", "9eB", "9eC"],
  Seconde: ["2ndA", "2ndB"],
  Première: ["1ereA", "1ereB"],
  Terminale: ["TermA", "TermB"],
  NS4: ["NS4A"],
};

const classProgression: { [key: string]: string } = {
  "6ème AF": "7ème AF",
  "7ème AF": "8ème AF",
  "8ème AF": "9ème AF",
  "9ème AF": "Seconde",
  Seconde: "Première",
  Première: "Terminale",
  Terminale: "NS4",
  NS4: "DIPLOME", // Fin de parcours
};

const ReenrollmentModal: React.FC<ReenrollmentModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  const [students, setStudents] = useState<Student[]>(sampleStudents);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterSalle, setFilterSalle] = useState("");
  const [selectedNewClass, setSelectedNewClass] = useState("");
  const [selectedNewSalle, setSelectedNewSalle] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Reset filters when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setFilterClass("");
      setFilterSalle("");
      setSelectedStudents([]);
      setSelectedNewClass("");
      setSelectedNewSalle("");
      setShowFilters(false);
    }
  }, [isOpen]);

  // Fonction pour déterminer la décision de fin d'année
  const getAcademicDecision = (moyenne: number, classeActuelle: string) => {
    if (classeActuelle === "NS4") {
      return {
        type: "DIPLOME" as const,
        label: "Diplômé",
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        canReenroll: false,
      };
    }

    if (moyenne >= 5.5) {
      return {
        type: "REUSSIT" as const,
        label: "Réussit",
        color: "text-green-600",
        bgColor: "bg-green-100",
        canReenroll: true,
      };
    } else if (moyenne >= 3.0) {
      return {
        type: "REDOUBLE" as const,
        label: "Redouble",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        canReenroll: true,
      };
    } else {
      return {
        type: "EXPULSE" as const,
        label: "Expulsé",
        color: "text-red-600",
        bgColor: "bg-red-100",
        canReenroll: false,
      };
    }
  };

  // Fonction pour déterminer la classe suivante suggérée
  const getSuggestedClass = (student: Student) => {
    const decision = getAcademicDecision(
      student.moyenneGenerale,
      student.classeActuelle
    );

    if (decision.type === "REUSSIT") {
      return classProgression[student.classeActuelle] || student.classeActuelle;
    } else if (decision.type === "REDOUBLE") {
      return student.classeActuelle;
    }

    return null; // Expulsé ou diplômé
  };

  // Filtrer les élèves disponibles (partie droite)
  const availableStudents = students.filter((student) => {
    // Exclure les élèves déjà sélectionnés
    if (selectedStudents.some((s) => s.id === student.id)) return false;

    // Filtres de recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (
        !student.nom.toLowerCase().includes(searchLower) &&
        !student.prenom.toLowerCase().includes(searchLower) &&
        !student.code.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    // Filtres par classe et salle
    if (filterClass && student.classeActuelle !== filterClass) return false;
    if (filterSalle && student.salleActuelle !== filterSalle) return false;

    return true;
  });

  // Ajouter un élève à la liste de réinscription
  const addStudentToReenrollment = (student: Student) => {
    const decision = getAcademicDecision(
      student.moyenneGenerale,
      student.classeActuelle
    );

    if (!decision.canReenroll) {
      alert(
        decision.type === "EXPULSE"
          ? "Cet élève ne peut pas être réinscrit (expulsé)"
          : "Cet élève a terminé son parcours (diplômé)"
      );
      return;
    }

    const suggestedClass = getSuggestedClass(student);
    if (suggestedClass) {
      setSelectedStudents((prev) => [...prev, student]);

      // Auto-sélectionner la classe suggérée si pas encore sélectionnée
      if (!selectedNewClass) {
        setSelectedNewClass(suggestedClass);
        // Auto-sélectionner la première salle disponible
        const availableSalles = sallesByClass[suggestedClass];
        if (
          availableSalles &&
          availableSalles.length > 0 &&
          !selectedNewSalle
        ) {
          setSelectedNewSalle(availableSalles[0]);
        }
      }
    }
  };

  // Retirer un élève de la liste de réinscription
  const removeStudentFromReenrollment = (studentId: string) => {
    setSelectedStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  // Confirmer la réinscription
  const confirmReenrollment = () => {
    if (!selectedNewClass || !selectedNewSalle) {
      alert(
        "Veuillez sélectionner une classe et une salle pour la réinscription"
      );
      return;
    }

    if (selectedStudents.length === 0) {
      alert("Aucun élève sélectionné pour la réinscription");
      return;
    }

    // Simulation de la réinscription
    const updatedStudents = students.map((student) => {
      const selectedStudent = selectedStudents.find((s) => s.id === student.id);
      if (selectedStudent) {
        return {
          ...student,
          classeActuelle: selectedNewClass,
          salleActuelle: selectedNewSalle,
        };
      }
      return student;
    });

    setStudents(updatedStudents);

    alert(
      `${selectedStudents.length} élève(s) réinscrit(s) avec succès en ${selectedNewClass} - ${selectedNewSalle}`
    );

    // Reset
    setSelectedStudents([]);
    setSelectedNewClass("");
    setSelectedNewSalle("");
  };

  if (!isOpen) return null;

  const modalClasses = isDarkMode
    ? "bg-gray-900 text-white"
    : "bg-white text-gray-900";

  const cardClasses = isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  const inputClasses = isDarkMode
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-400 focus:border-blue-400"
    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 p-4">
      <div
        className={`${modalClasses} rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col`}
      >
        {/* En-tête */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold">Réinscription des Élèves</h2>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Gestion des réinscriptions pour la nouvelle année scolaire
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-opacity-20 hover:bg-gray-500 transition-colors ${
              isDarkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Partie Droite - Liste des élèves disponibles */}
          <div className="w-1/2 p-6 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Élèves Disponibles</h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${inputClasses}`}
              >
                <Filter className="h-4 w-4" />
                Filtres
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Filtres */}
            {showFilters && (
              <div
                className={`mb-4 p-4 rounded-lg border ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-800"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <select
                    className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                    value={filterClass}
                    onChange={(e) => {
                      setFilterClass(e.target.value);
                      setFilterSalle("");
                    }}
                  >
                    <option value="">Toutes les classes</option>
                    {classes.map((classe) => (
                      <option key={classe} value={classe}>
                        {classe}
                      </option>
                    ))}
                  </select>

                  <select
                    className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                    value={filterSalle}
                    onChange={(e) => setFilterSalle(e.target.value)}
                    disabled={!filterClass}
                  >
                    <option value="">Toutes les salles</option>
                    {filterClass &&
                      sallesByClass[filterClass]?.map((salle) => (
                        <option key={salle} value={salle}>
                          {salle}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            )}

            {/* Liste des élèves */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {availableStudents.map((student) => {
                const decision = getAcademicDecision(
                  student.moyenneGenerale,
                  student.classeActuelle
                );
                const suggestedClass = getSuggestedClass(student);

                return (
                  <div
                    key={student.id}
                    className={`p-4 rounded-lg border ${cardClasses} hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold">
                            {student.prenom} {student.nom}
                          </div>
                          <button
                            onClick={() => addStudentToReenrollment(student)}
                            disabled={!decision.canReenroll}
                            className={`p-2 rounded-full transition-colors ${
                              decision.canReenroll
                                ? "text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900"
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>

                        <div
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          } mb-2`}
                        >
                          {student.code} • {student.classeActuelle} -{" "}
                          {student.salleActuelle}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">
                              {student.moyenneGenerale.toFixed(2)}/10
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${decision.bgColor} ${decision.color}`}
                            >
                              {decision.label}
                            </span>
                          </div>

                          {suggestedClass && (
                            <div
                              className={`text-xs ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              → {suggestedClass}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {availableStudents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Users className="h-16 w-16 mb-4" />
                  <p>Aucun élève trouvé selon les critères de filtrage</p>
                </div>
              )}
            </div>
          </div>

          {/* Partie Gauche - Nouvelle classe et élèves sélectionnés */}
          <div className="w-1/2 p-6 flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Nouvelle Classe</h3>

            {/* Sélection de la nouvelle classe */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Classe
                </label>
                <select
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                  value={selectedNewClass}
                  onChange={(e) => {
                    setSelectedNewClass(e.target.value);
                    setSelectedNewSalle("");
                  }}
                >
                  <option value="">Sélectionner une classe</option>
                  {classes
                    .filter((c) => c !== "NS4")
                    .map((classe) => (
                      <option key={classe} value={classe}>
                        {classe}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Salle
                </label>
                <select
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                  value={selectedNewSalle}
                  onChange={(e) => setSelectedNewSalle(e.target.value)}
                  disabled={!selectedNewClass}
                >
                  <option value="">Sélectionner une salle</option>
                  {selectedNewClass &&
                    sallesByClass[selectedNewClass]?.map((salle) => (
                      <option key={salle} value={salle}>
                        {salle}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Élèves sélectionnés pour réinscription */}
            <div className="flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">
                  Élèves à réinscrire ({selectedStudents.length})
                </h4>
              </div>

              {selectedStudents.length > 0 ? (
                <div className="space-y-3">
                  {selectedStudents.map((student) => {
                    const decision = getAcademicDecision(
                      student.moyenneGenerale,
                      student.classeActuelle
                    );

                    return (
                      <div
                        key={student.id}
                        className={`p-4 rounded-lg border ${cardClasses}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold">
                            {student.prenom} {student.nom}
                          </div>
                          <button
                            onClick={() =>
                              removeStudentFromReenrollment(student.id)
                            }
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          } mb-2`}
                        >
                          {student.code} • {student.classeActuelle} →{" "}
                          {selectedNewClass || "?"}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">
                              {student.moyenneGenerale.toFixed(2)}/10
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${decision.bgColor} ${decision.color}`}
                            >
                              {decision.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <RotateCcw className="h-16 w-16 mb-4" />
                  <p>Aucun élève sélectionné pour la réinscription</p>
                  <p className="text-sm mt-2">
                    Utilisez les flèches pour ajouter des élèves
                  </p>
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={onClose}
                className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Annuler
              </button>
              <button
                onClick={confirmReenrollment}
                disabled={
                  selectedStudents.length === 0 ||
                  !selectedNewClass ||
                  !selectedNewSalle
                }
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Confirmer ({selectedStudents.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReenrollmentModal;
