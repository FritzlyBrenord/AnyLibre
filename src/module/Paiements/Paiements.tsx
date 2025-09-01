import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  FileText,
  DollarSign,
  Users,
  ChevronDown,
  Settings,
  Receipt,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Printer,
  BarChart3,
} from "lucide-react";

// Types
interface Student {
  id: string;
  code: string;
  nom: string;
  prenom: string;
  classesDemandee: string;
  salle: string;
  status: "actif" | "inactif" | "suspendu";
}

interface TypeFrais {
  id: string;
  nom: string;
  montantDefaut: number;
  description: string;
  obligatoire: boolean;
}

interface FraisParClasse {
  id: string;
  classe: string;
  typeFraisId: string;
  montant: number;
}

interface Paiement {
  id: string;
  studentId: string;
  typeFrais: string;
  montantDu: number;
  montantPaye: number;
  datePaiement: string;
  heurePaiement: string;
  remarques?: string;
  numeroRecu: string;
}

// Données d'exemple
const sampleStudents: Student[] = [
  {
    id: "1",
    code: "ETU001",
    nom: "Duval",
    prenom: "Marie",
    classesDemandee: "9ème AF",
    salle: "9eA",
    status: "actif",
  },
  {
    id: "2",
    code: "ETU002",
    nom: "Jean-Baptiste",
    prenom: "Pierre",
    classesDemandee: "9ème AF",
    salle: "9eA",
    status: "actif",
  },
  {
    id: "3",
    code: "ETU003",
    nom: "Charles",
    prenom: "Anne",
    classesDemandee: "9ème AF",
    salle: "9eA",
    status: "suspendu",
  },
  {
    id: "4",
    code: "ETU004",
    nom: "Moreau",
    prenom: "Jean",
    classesDemandee: "7ème AF",
    salle: "7eA",
    status: "actif",
  },
];

const defaultTypesFrais: TypeFrais[] = [
  {
    id: "1",
    nom: "Frais d'Entrée",
    montantDefaut: 10000,
    description: "Frais d'inscription annuelle",
    obligatoire: true,
  },
  {
    id: "2",
    nom: "1er Trimestre",
    montantDefaut: 15000,
    description: "Frais de scolarité du premier trimestre",
    obligatoire: true,
  },
  {
    id: "3",
    nom: "2ème Trimestre",
    montantDefaut: 15000,
    description: "Frais de scolarité du deuxième trimestre",
    obligatoire: true,
  },
  {
    id: "4",
    nom: "3ème Trimestre",
    montantDefaut: 15000,
    description: "Frais de scolarité du troisième trimestre",
    obligatoire: true,
  },
];

// Données d'exemple pour les frais par classe
const defaultFraisParClasse: FraisParClasse[] = [
  // 6ème AF
  { id: "1", classe: "6ème AF", typeFraisId: "1", montant: 8000 },
  { id: "2", classe: "6ème AF", typeFraisId: "2", montant: 12000 },
  { id: "3", classe: "6ème AF", typeFraisId: "3", montant: 12000 },
  { id: "4", classe: "6ème AF", typeFraisId: "4", montant: 12000 },
  
  // 7ème AF
  { id: "5", classe: "7ème AF", typeFraisId: "1", montant: 8500 },
  { id: "6", classe: "7ème AF", typeFraisId: "2", montant: 13000 },
  { id: "7", classe: "7ème AF", typeFraisId: "3", montant: 13000 },
  { id: "8", classe: "7ème AF", typeFraisId: "4", montant: 13000 },
  
  // 8ème AF
  { id: "9", classe: "8ème AF", typeFraisId: "1", montant: 9000 },
  { id: "10", classe: "8ème AF", typeFraisId: "2", montant: 14000 },
  { id: "11", classe: "8ème AF", typeFraisId: "3", montant: 14000 },
  { id: "12", classe: "8ème AF", typeFraisId: "4", montant: 14000 },
  
  // 9ème AF
  { id: "13", classe: "9ème AF", typeFraisId: "1", montant: 10000 },
  { id: "14", classe: "9ème AF", typeFraisId: "2", montant: 15000 },
  { id: "15", classe: "9ème AF", typeFraisId: "3", montant: 15000 },
  { id: "16", classe: "9ème AF", typeFraisId: "4", montant: 15000 },
  
  // Seconde
  { id: "17", classe: "Seconde", typeFraisId: "1", montant: 12000 },
  { id: "18", classe: "Seconde", typeFraisId: "2", montant: 18000 },
  { id: "19", classe: "Seconde", typeFraisId: "3", montant: 18000 },
  { id: "20", classe: "Seconde", typeFraisId: "4", montant: 18000 },
  
  // Première
  { id: "21", classe: "Première", typeFraisId: "1", montant: 13000 },
  { id: "22", classe: "Première", typeFraisId: "2", montant: 20000 },
  { id: "23", classe: "Première", typeFraisId: "3", montant: 20000 },
  { id: "24", classe: "Première", typeFraisId: "4", montant: 20000 },
  
  // Terminale
  { id: "25", classe: "Terminale", typeFraisId: "1", montant: 15000 },
  { id: "26", classe: "Terminale", typeFraisId: "2", montant: 22000 },
  { id: "27", classe: "Terminale", typeFraisId: "3", montant: 22000 },
  { id: "28", classe: "Terminale", typeFraisId: "4", montant: 22000 },
];

const classes = [
  "6ème AF",
  "7ème AF",
  "8ème AF",
  "9ème AF",
  "Seconde",
  "Première",
  "Terminale",
];

const sallesByClass: { [key: string]: string[] } = {
  "6ème AF": ["6eA", "6eB"],
  "7ème AF": ["7eA", "7eB", "7eC"],
  "8ème AF": ["8eA", "8eB"],
  "9ème AF": ["9eA", "9eB", "9eC"],
  Seconde: ["2ndA", "2ndB"],
  Première: ["1ereA", "1ereB"],
  Terminale: ["TermA", "TermB"],
};

interface Props {
  isDarkMode?: boolean;
}

const FraisScolaritePage = ({ isDarkMode = false }: Props) => {
  // États principaux
  const [students] = useState<Student[]>(sampleStudents);
  const [typesFrais, setTypesFrais] = useState<TypeFrais[]>(defaultTypesFrais);
  const [fraisParClasse, setFraisParClasse] = useState<FraisParClasse[]>(defaultFraisParClasse);
  const [paiements, setPaiements] = useState<Paiement[]>([]);

  // États de sélection
  const [selectedClasse, setSelectedClasse] = useState("");
  const [selectedSalle, setSelectedSalle] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // États d'interface
  const [activeTab, setActiveTab] = useState<
    "paiements" | "consultation" | "configuration" | "rapports"
  >("paiements");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTypeFrais, setFilterTypeFrais] = useState("");
  const [filterStatutPaiement, setFilterStatutPaiement] = useState("");

  // États de formulaire
  const [paiementForm, setPaiementForm] = useState({
    typeFrais: "",
    montantDu: "",
    montantPaye: "",
    remarques: "",
  });

  const [newTypeFrais, setNewTypeFrais] = useState({
    nom: "",
    montantDefaut: "",
    description: "",
    obligatoire: false,
  });

  // États pour la configuration des frais par classe
  const [selectedClasseForConfig, setSelectedClasseForConfig] = useState("");
  const [fraisConfigForm, setFraisConfigForm] = useState<{
    [typeFraisId: string]: string;
  }>({});

  // Étudiants actifs filtrés
  const activeStudents = students.filter(
    (s) =>
      s.status === "actif" &&
      (!selectedClasse || s.classesDemandee === selectedClasse) &&
      (!selectedSalle || s.salle === selectedSalle)
  );

  // Fonctions utilitaires
  const generateReceiptNumber = () => {
    return "REC" + Date.now().toString().slice(-8);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString() + " HTG";
  };

  const getPaymentStatusColor = (montantDu: number, montantPaye: number) => {
    if (montantPaye >= montantDu) return "text-green-600";
    if (montantPaye > 0) return "text-yellow-600";
    return "text-red-600";
  };

  const getPaymentStatusIcon = (montantDu: number, montantPaye: number) => {
    if (montantPaye >= montantDu) return <CheckCircle className="h-4 w-4" />;
    if (montantPaye > 0) return <Clock className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  // Fonction pour obtenir le montant des frais pour une classe donnée
  const getFraisForClasse = (classe: string, typeFraisId: string) => {
    const frais = fraisParClasse.find(
      (f) => f.classe === classe && f.typeFraisId === typeFraisId
    );
    return frais ? frais.montant : 0;
  };

  // Fonction pour mettre à jour les frais par classe
  const updateFraisForClasse = (classe: string, typeFraisId: string, montant: number) => {
    setFraisParClasse((prev) => {
      const existingIndex = prev.findIndex(
        (f) => f.classe === classe && f.typeFraisId === typeFraisId
      );
      
      if (existingIndex >= 0) {
        // Mettre à jour l'existant
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], montant };
        return updated;
      } else {
        // Ajouter un nouveau
        return [...prev, {
          id: Date.now().toString(),
          classe,
          typeFraisId,
          montant,
        }];
      }
    });
  };

  // Calcul du solde d'un élève
  const getStudentBalance = (studentId: string) => {
    const studentPaiements = paiements.filter((p) => p.studentId === studentId);
    const totalDu = studentPaiements.reduce((sum, p) => sum + p.montantDu, 0);
    const totalPaye = studentPaiements.reduce(
      (sum, p) => sum + p.montantPaye,
      0
    );
    return { totalDu, totalPaye, solde: totalDu - totalPaye };
  };

  // Gestion du formulaire
  const handlePaiementChange = (field: string, value: string) => {
    setPaiementForm((prev) => ({ ...prev, [field]: value }));
  };

  const addPaiement = () => {
    if (
      !selectedStudent ||
      !paiementForm.typeFrais ||
      !paiementForm.montantDu
    ) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const now = new Date();
    const nouveauPaiement: Paiement = {
      id: Date.now().toString(),
      studentId: selectedStudent.id,
      typeFrais: paiementForm.typeFrais,
      montantDu: parseFloat(paiementForm.montantDu),
      montantPaye: parseFloat(paiementForm.montantPaye || "0"),
      datePaiement: now.toISOString().split("T")[0],
      heurePaiement: now.toTimeString().split(" ")[0],
      remarques: paiementForm.remarques,
      numeroRecu: generateReceiptNumber(),
    };

    setPaiements((prev) => [...prev, nouveauPaiement]);

    // Réinitialiser le formulaire
    setPaiementForm({
      typeFrais: "",
      montantDu: "",
      montantPaye: "",
      remarques: "",
    });

    alert(
      `Paiement ajouté avec succès! Numéro de reçu: ${nouveauPaiement.numeroRecu}`
    );
  };

  const addTypeFrais = () => {
    if (!newTypeFrais.nom || !newTypeFrais.montantDefaut) {
      alert("Veuillez remplir les champs obligatoires");
      return;
    }

    const nouveauType: TypeFrais = {
      id: Date.now().toString(),
      nom: newTypeFrais.nom,
      montantDefaut: parseFloat(newTypeFrais.montantDefaut),
      description: newTypeFrais.description,
      obligatoire: newTypeFrais.obligatoire,
    };

    setTypesFrais((prev) => [...prev, nouveauType]);
    setNewTypeFrais({
      nom: "",
      montantDefaut: "",
      description: "",
      obligatoire: false,
    });
  };

  // Génération de reçu
  const generateReceipt = (paiement: Paiement) => {
    const student = students.find((s) => s.id === paiement.studentId);
    if (!student) return;

    const receiptWindow = window.open("", "_blank", "width=800,height=600");
    if (!receiptWindow) return;

    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reçu ${paiement.numeroRecu}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .content { margin: 20px 0; }
          .amount { font-size: 24px; font-weight: bold; color: #2563eb; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INSTITUT SAINT-JOSEPH</h1>
          <p>REÇU DE PAIEMENT</p>
        </div>
        <div class="content">
          <p><strong>Élève:</strong> ${student.prenom} ${student.nom}</p>
          <p><strong>Code:</strong> ${student.code}</p>
          <p><strong>Classe:</strong> ${student.classesDemandee} - ${
      student.salle
    }</p>
          <p><strong>Type de frais:</strong> ${paiement.typeFrais}</p>
          <p><strong>N° Reçu:</strong> ${paiement.numeroRecu}</p>
          <p><strong>Date:</strong> ${new Date(
            paiement.datePaiement
          ).toLocaleDateString()}</p>
          <p><strong>Heure:</strong> ${paiement.heurePaiement}</p>
          <div class="amount">Montant payé: ${formatCurrency(
            paiement.montantPaye
          )}</div>
          ${
            paiement.remarques
              ? `<p><strong>Remarques:</strong> ${paiement.remarques}</p>`
              : ""
          }
        </div>
      </body>
      </html>
    `);
    receiptWindow.document.close();
  };

  // Auto-remplissage du montant
  useEffect(() => {
    if (paiementForm.typeFrais && selectedStudent) {
      const typeFrais = typesFrais.find(
        (t) => t.nom === paiementForm.typeFrais
      );
      if (typeFrais) {
        // Utiliser les frais configurés pour la classe de l'élève
        const fraisClasse = getFraisForClasse(selectedStudent.classesDemandee, typeFrais.id);
        const montant = fraisClasse > 0 ? fraisClasse : typeFrais.montantDefaut;
        
        setPaiementForm((prev) => ({
          ...prev,
          montantDu: montant.toString(),
        }));
      }
    }
  }, [paiementForm.typeFrais, selectedStudent, typesFrais, fraisParClasse]);

  // Styles conditionnels
  const cardClasses = isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";
  const inputClasses = isDarkMode
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-900";
  const buttonClasses = isDarkMode
    ? "bg-blue-700 hover:bg-blue-600 text-white"
    : "bg-blue-600 hover:bg-blue-700 text-white";
  const tabActiveClasses = isDarkMode
    ? "bg-blue-700 text-white"
    : "bg-blue-600 text-white";
  const tabInactiveClasses = isDarkMode
    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
    : "bg-gray-200 text-gray-700 hover:bg-gray-300";

  return (
    <div
      className={`min-h-screen p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Gestion des Frais de Scolarité
          </h1>
          <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
            Système de gestion des paiements et frais scolaires - SIGEP
          </p>
        </div>

        {/* Onglets */}
        <div
          className={`flex mb-6 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          {[
            { id: "paiements", icon: DollarSign, label: "Paiements" },
            { id: "consultation", icon: Eye, label: "Consultation" },
            { id: "configuration", icon: Settings, label: "Configuration" },
            { id: "rapports", icon: FileText, label: "Rapports" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id ? tabActiveClasses : tabInactiveClasses
              }`}
            >
              <tab.icon className="h-4 w-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sélecteurs principaux */}
        <div className={`${cardClasses} p-6 rounded-lg shadow-sm border mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Classe
              </label>
              <select
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                value={selectedClasse}
                onChange={(e) => {
                  setSelectedClasse(e.target.value);
                  setSelectedSalle("");
                  setSelectedStudent(null);
                }}
              >
                <option value="">Toutes les classes</option>
                {classes.map((classe) => (
                  <option key={classe} value={classe}>
                    {classe}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Salle
              </label>
              <select
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                value={selectedSalle}
                onChange={(e) => {
                  setSelectedSalle(e.target.value);
                  setSelectedStudent(null);
                }}
                disabled={!selectedClasse}
              >
                <option value="">Toutes les salles</option>
                {selectedClasse &&
                  sallesByClass[selectedClasse]?.map((salle) => (
                    <option key={salle} value={salle}>
                      {salle}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Rechercher un élève
              </label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nom, prénom ou code..."
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Liste des élèves */}
          {(selectedClasse || selectedSalle || searchTerm) && (
            <div className="mt-4">
              <h3 className="font-medium mb-3">
                Élèves ({activeStudents.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-40 overflow-y-auto">
                {activeStudents
                  .filter((student) => {
                    if (!searchTerm) return true;
                    const search = searchTerm.toLowerCase();
                    return (
                      student.nom.toLowerCase().includes(search) ||
                      student.prenom.toLowerCase().includes(search) ||
                      student.code.toLowerCase().includes(search)
                    );
                  })
                  .map((student) => {
                    const balance = getStudentBalance(student.id);
                    return (
                      <div
                        key={student.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedStudent?.id === student.id
                            ? isDarkMode
                              ? "bg-blue-800 border-blue-600"
                              : "bg-blue-100 border-blue-500"
                            : isDarkMode
                            ? "border-gray-600 hover:bg-gray-700"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedStudent(student)}
                      >
                        <div className="font-medium">
                          {student.prenom} {student.nom}
                        </div>
                        <div
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {student.code} • {student.classesDemandee} -{" "}
                          {student.salle}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            balance.solde > 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          Solde: {formatCurrency(balance.solde)}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* Contenu selon l'onglet actif */}
        {activeTab === "paiements" && (
          <div className={`${cardClasses} rounded-lg shadow-sm border`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Saisie des Paiements</h2>
                {selectedStudent && (
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isDarkMode ? "bg-gray-700" : "bg-blue-50"
                    }`}
                  >
                    <div className="font-medium">
                      {selectedStudent.prenom} {selectedStudent.nom}
                    </div>
                    <div className="text-sm">
                      Solde:{" "}
                      {formatCurrency(
                        getStudentBalance(selectedStudent.id).solde
                      )}
                    </div>
                  </div>
                )}
              </div>

              {!selectedStudent ? (
                <div className="text-center py-12">
                  <Users
                    className={`h-16 w-16 mx-auto mb-4 ${
                      isDarkMode ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                    Veuillez sélectionner un élève pour ajouter un paiement
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Formulaire */}
                  <div className="space-y-4">
                    <h3 className="font-bold mb-4">Nouveau Paiement</h3>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Type de Frais *
                      </label>
                      <select
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                        value={paiementForm.typeFrais}
                        onChange={(e) =>
                          handlePaiementChange("typeFrais", e.target.value)
                        }
                      >
                        <option value="">Sélectionner un type de frais</option>
                        {typesFrais.map((type) => (
                          <option key={type.id} value={type.nom}>
                            {type.nom} - {formatCurrency(type.montantDefaut)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Montant Dû *
                        </label>
                        <input
                          type="number"
                          min="0"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                          value={paiementForm.montantDu}
                          onChange={(e) =>
                            handlePaiementChange("montantDu", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Montant Payé
                        </label>
                        <input
                          type="number"
                          min="0"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                          value={paiementForm.montantPaye}
                          onChange={(e) =>
                            handlePaiementChange("montantPaye", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Remarques
                      </label>
                      <textarea
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                        value={paiementForm.remarques}
                        onChange={(e) =>
                          handlePaiementChange("remarques", e.target.value)
                        }
                      />
                    </div>

                    <button
                      onClick={addPaiement}
                      className={`w-full ${buttonClasses} px-4 py-3 rounded-lg font-medium transition-colors`}
                    >
                      <Save className="h-4 w-4 inline mr-2" />
                      Enregistrer le Paiement
                    </button>
                  </div>

                  {/* Historique */}
                  <div>
                    <h3 className="font-bold mb-4">Historique des Paiements</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {paiements
                        .filter((p) => p.studentId === selectedStudent.id)
                        .sort(
                          (a, b) =>
                            new Date(b.datePaiement).getTime() -
                            new Date(a.datePaiement).getTime()
                        )
                        .map((paiement) => (
                          <div
                            key={paiement.id}
                            className={`p-4 border rounded-lg ${
                              isDarkMode ? "border-gray-600" : "border-gray-200"
                            }`}
                          >
                            <div className="flex justify-between mb-2">
                              <div className="font-medium">
                                {paiement.typeFrais}
                              </div>
                              <div className="text-sm text-gray-500">
                                Reçu: {paiement.numeroRecu}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                              <div>
                                Dû: {formatCurrency(paiement.montantDu)}
                              </div>
                              <div>
                                Payé: {formatCurrency(paiement.montantPaye)}
                              </div>
                              <div>
                                {new Date(
                                  paiement.datePaiement
                                ).toLocaleDateString()}
                              </div>
                              <div>{paiement.heurePaiement}</div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div
                                className={`flex items-center gap-1 text-sm ${getPaymentStatusColor(
                                  paiement.montantDu,
                                  paiement.montantPaye
                                )}`}
                              >
                                {getPaymentStatusIcon(
                                  paiement.montantDu,
                                  paiement.montantPaye
                                )}
                                {paiement.montantPaye >= paiement.montantDu
                                  ? "Soldé"
                                  : paiement.montantPaye > 0
                                  ? "Partiel"
                                  : "Non payé"}
                              </div>
                              <button
                                onClick={() => generateReceipt(paiement)}
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                              >
                                <Receipt className="h-3 w-3" />
                                Reçu
                              </button>
                            </div>
                          </div>
                        ))}
                      {paiements.filter(
                        (p) => p.studentId === selectedStudent.id
                      ).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          Aucun paiement enregistré
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "consultation" && (
          <div className={`${cardClasses} rounded-lg shadow-sm border`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  Consultation des Paiements
                </h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-3 py-2 border rounded-lg flex items-center gap-2 ${inputClasses}`}
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

              {showFilters && (
                <div
                  className={`mb-6 p-4 border rounded-lg ${
                    isDarkMode ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      className={`px-3 py-2 border rounded-lg ${inputClasses}`}
                      value={filterTypeFrais}
                      onChange={(e) => setFilterTypeFrais(e.target.value)}
                    >
                      <option value="">Tous les types</option>
                      {typesFrais.map((type) => (
                        <option key={type.id} value={type.nom}>
                          {type.nom}
                        </option>
                      ))}
                    </select>

                    <select
                      className={`px-3 py-2 border rounded-lg ${inputClasses}`}
                      value={filterStatutPaiement}
                      onChange={(e) => setFilterStatutPaiement(e.target.value)}
                    >
                      <option value="">Tous les statuts</option>
                      <option value="solde">Soldé</option>
                      <option value="partiel">Partiel</option>
                      <option value="impaye">Non payé</option>
                    </select>

                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Recherche..."
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg ${inputClasses}`}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tableau des paiements */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Élève
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      isDarkMode ? "divide-gray-700" : "divide-gray-200"
                    }`}
                  >
                    {paiements.map((paiement) => {
                      const student = students.find(
                        (s) => s.id === paiement.studentId
                      );
                      if (!student) return null;

                      return (
                        <tr
                          key={paiement.id}
                          className={
                            isDarkMode
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-50"
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">
                              {student.prenom} {student.nom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.code}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {paiement.typeFrais}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              Payé: {formatCurrency(paiement.montantPaye)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Dû: {formatCurrency(paiement.montantDu)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`flex items-center gap-1 ${getPaymentStatusColor(
                                paiement.montantDu,
                                paiement.montantPaye
                              )}`}
                            >
                              {getPaymentStatusIcon(
                                paiement.montantDu,
                                paiement.montantPaye
                              )}
                              {paiement.montantPaye >= paiement.montantDu
                                ? "Soldé"
                                : paiement.montantPaye > 0
                                ? "Partiel"
                                : "Non payé"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {new Date(
                              paiement.datePaiement
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button
                                onClick={() => generateReceipt(paiement)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Receipt className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Supprimer ce paiement?")) {
                                    setPaiements((prev) =>
                                      prev.filter((p) => p.id !== paiement.id)
                                    );
                                  }
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "configuration" && (
          <div className={`${cardClasses} rounded-lg shadow-sm border`}>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">
                Configuration des Types de Frais
              </h2>

              {/* Configuration des frais par classe */}
              <div
                className={`mb-8 p-6 border rounded-lg ${
                  isDarkMode ? "border-gray-600" : "border-gray-200"
                }`}
              >
                <h3 className="font-bold mb-4">Configuration des Frais par Classe</h3>
                
                <div className="mb-4">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Sélectionner une classe
                  </label>
                  <select
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                    value={selectedClasseForConfig}
                    onChange={(e) => setSelectedClasseForConfig(e.target.value)}
                  >
                    <option value="">Choisir une classe</option>
                    {classes.map((classe) => (
                      <option key={classe} value={classe}>
                        {classe}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedClasseForConfig && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">
                      Frais pour la classe : {selectedClasseForConfig}
                    </h4>
                    
                    {typesFrais.map((typeFrais) => (
                      <div
                        key={typeFrais.id}
                        className={`p-4 border rounded-lg ${
                          isDarkMode ? "border-gray-600" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium">{typeFrais.nom}</div>
                            <div className="text-sm text-gray-500">
                              {typeFrais.description}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              min="0"
                              placeholder="Montant"
                              className={`w-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                              value={getFraisForClasse(selectedClasseForConfig, typeFrais.id)}
                              onChange={(e) => {
                                const montant = parseFloat(e.target.value) || 0;
                                updateFraisForClasse(selectedClasseForConfig, typeFrais.id, montant);
                              }}
                            />
                            <span className="text-sm text-gray-500">HTG</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ajout de nouveaux types de frais */}
              <div
                className={`mb-6 p-4 border rounded-lg ${
                  isDarkMode ? "border-gray-600" : "border-gray-200"
                }`}
              >
                <h3 className="font-bold mb-4">Ajouter un Type de Frais</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Nom"
                    className={`px-3 py-2 border rounded-lg ${inputClasses}`}
                    value={newTypeFrais.nom}
                    onChange={(e) =>
                      setNewTypeFrais((prev) => ({
                        ...prev,
                        nom: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="number"
                    placeholder="Montant"
                    className={`px-3 py-2 border rounded-lg ${inputClasses}`}
                    value={newTypeFrais.montantDefaut}
                    onChange={(e) =>
                      setNewTypeFrais((prev) => ({
                        ...prev,
                        montantDefaut: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    className={`px-3 py-2 border rounded-lg ${inputClasses}`}
                    value={newTypeFrais.description}
                    onChange={(e) =>
                      setNewTypeFrais((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={newTypeFrais.obligatoire}
                      onChange={(e) =>
                        setNewTypeFrais((prev) => ({
                          ...prev,
                          obligatoire: e.target.checked,
                        }))
                      }
                    />
                    Obligatoire
                  </label>
                </div>
                <button
                  onClick={addTypeFrais}
                  className={`${buttonClasses} px-4 py-2 rounded-lg`}
                >
                  <Plus className="h-4 w-4 inline mr-2" />
                  Ajouter
                </button>
              </div>

              <div className="space-y-4">
                {typesFrais.map((type) => (
                  <div
                    key={type.id}
                    className={`p-4 border rounded-lg ${
                      isDarkMode ? "border-gray-600" : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {type.nom}
                          {type.obligatoire && (
                            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              Obligatoire
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {type.description}
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(type.montantDefaut)}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm("Supprimer ce type de frais?")) {
                            setTypesFrais((prev) =>
                              prev.filter((t) => t.id !== type.id)
                            );
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "rapports" && (
          <div className={`${cardClasses} rounded-lg shadow-sm border`}>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">
                Rapports et Statistiques
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-blue-50"
                  }`}
                >
                  <div className="text-center">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm">Total Perçu</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(
                        paiements.reduce((sum, p) => sum + p.montantPaye, 0)
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-green-50"
                  }`}
                >
                  <div className="text-center">
                    <Receipt className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p className="text-sm">Nombre de Paiements</p>
                    <p className="text-2xl font-bold text-green-600">
                      {paiements.length}
                    </p>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-red-50"
                  }`}
                >
                  <div className="text-center">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                    <p className="text-sm">Élèves en Retard</p>
                    <p className="text-2xl font-bold text-red-600">
                      {
                        students.filter(
                          (student) => getStudentBalance(student.id).solde > 0
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              {selectedClasse && selectedSalle && (
                <div
                  className={`mt-8 p-6 border rounded-lg ${
                    isDarkMode ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <h3 className="text-lg font-bold mb-4">
                    Statistiques - {selectedClasse} ({selectedSalle})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total à Percevoir</p>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(
                          activeStudents.reduce((total, student) => {
                            return (
                              total + getStudentBalance(student.id).totalDu
                            );
                          }, 0)
                        )}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Perçu</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(
                          activeStudents.reduce((total, student) => {
                            return (
                              total + getStudentBalance(student.id).totalPaye
                            );
                          }, 0)
                        )}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Solde Restant</p>
                      <p className="text-xl font-bold text-red-600">
                        {formatCurrency(
                          activeStudents.reduce((total, student) => {
                            return total + getStudentBalance(student.id).solde;
                          }, 0)
                        )}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Taux de Recouvrement
                      </p>
                      <p className="text-xl font-bold text-yellow-600">
                        {(() => {
                          const totalDu = activeStudents.reduce(
                            (total, student) => {
                              return (
                                total + getStudentBalance(student.id).totalDu
                              );
                            },
                            0
                          );
                          const totalPaye = activeStudents.reduce(
                            (total, student) => {
                              return (
                                total + getStudentBalance(student.id).totalPaye
                              );
                            },
                            0
                          );
                          return totalDu > 0
                            ? `${((totalPaye / totalDu) * 100).toFixed(1)}%`
                            : "0%";
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FraisScolaritePage;
