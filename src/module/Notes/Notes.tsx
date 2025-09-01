import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Save,
  FileText,
  Calculator,
  Users,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
  Award,
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
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

interface Note {
  id: string;
  studentId: string;
  matiere: string;
  trimestre: 1 | 2 | 3;
  note: number;
  observation?: string;
  dateAjout: string;
}

interface Matiere {
  id: string;
  nom: string;
  coefficient: number;
  categorie: string;
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

const matieres: Matiere[] = [
  { id: "1", nom: "Français", coefficient: 100, categorie: "Langues" },
  { id: "2", nom: "Mathématiques", coefficient: 100, categorie: "Sciences" },
  {
    id: "3",
    nom: "Histoire-Géographie",
    coefficient: 100,
    categorie: "Sciences Humaines",
  },
  { id: "4", nom: "Anglais", coefficient: 100, categorie: "Langues" },
  {
    id: "5",
    nom: "Sciences Physiques",
    coefficient: 100,
    categorie: "Sciences",
  },
  { id: "6", nom: "SVT", coefficient: 100, categorie: "Sciences" },
  { id: "7", nom: "EPS", coefficient: 100, categorie: "Sports" },
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
  isDarkMode: boolean;
}

const NotesPage = ({ isDarkMode }: Props) => {
  // États principaux
  const [students] = useState<Student[]>(sampleStudents);
  const [notes, setNotes] = useState<Note[]>([]);

  // États de sélection
  const [selectedClasse, setSelectedClasse] = useState("");
  const [selectedSalle, setSelectedSalle] = useState("");
  const [selectedMatiere, setSelectedMatiere] = useState("");
  const [selectedTrimestre, setSelectedTrimestre] = useState<1 | 2 | 3>(1);

  // États d'interface
  const [activeTab, setActiveTab] = useState<
    "saisie" | "consultation" | "bulletins"
  >("saisie");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMatiere, setFilterMatiere] = useState("");
  const [filterTrimestre, setFilterTrimestre] = useState("");

  // États de formulaire
  const [notesForm, setNotesForm] = useState<{
    [studentId: string]: { note: string; observation: string };
  }>({});

  // Étudiants actifs de la classe/salle sélectionnée
  const activeStudents = students.filter(
    (s) =>
      s.status === "actif" &&
      (!selectedClasse || s.classesDemandee === selectedClasse) &&
      (!selectedSalle || s.salle === selectedSalle)
  );

  // États pour la génération de bulletins
  const [selectedStudentsForBulletin, setSelectedStudentsForBulletin] =
    useState<string[]>([]);
  const [selectedTrimestresForBulletin, setSelectedTrimestresForBulletin] =
    useState({
      trimestre1: true,
      trimestre2: false,
      trimestre3: false,
    });
  const [selectedStudentsForReleve, setSelectedStudentsForReleve] = useState<
    string[]
  >([]);
  const [selectedTrimestreForReleve, setSelectedTrimestreForReleve] =
    useState("");
  const [selectedTrimestreForClasse, setSelectedTrimestreForClasse] =
    useState("1");
  const [searchStudentsForBulletin, setSearchStudentsForBulletin] =
    useState("");
  const [searchStudentsForReleve, setSearchStudentsForReleve] = useState("");

  // Fonctions utilitaires
  const getNoteColor = (note: number) => {
    return note < 50
      ? "text-red-600"
      : isDarkMode
      ? "text-white"
      : "text-gray-900";
  };

  const getMoyenneColor = (moyenne: number) => {
    return moyenne < 5.5
      ? "text-red-600"
      : isDarkMode
      ? "text-white"
      : "text-gray-900";
  };

  // Fonction pour générer l'observation automatique basée sur la moyenne
  const generateObservation = (moyenne: number): string => {
    if (moyenne >= 8.0 && moyenne <= 10.0) {
      return "Excellent";
    } else if (moyenne >= 7.0 && moyenne <= 7.99) {
      return "Très bien";
    } else if (moyenne >= 6.0 && moyenne <= 6.99) {
      return "Bien";
    } else if (moyenne >= 5.5 && moyenne <= 5.99) {
      return "Assez bien";
    } else if (moyenne >= 4.0 && moyenne <= 5.49) {
      return "Mauvais";
    } else if (moyenne >= 0.0 && moyenne <= 3.99) {
      return "Très mal";
    }
    return "-";
  };

  // Calcul de la note brute par matière et trimestre
  const getNoteMatiereTrimestre = (
    studentId: string,
    matiere: string,
    trimestre: number
  ) => {
    const studentNotes = notes.filter(
      (n) =>
        n.studentId === studentId &&
        n.matiere === matiere &&
        n.trimestre === trimestre
    );

    if (studentNotes.length === 0) return null;

    // Retourner la note brute (moyenne des notes si plusieurs)
    const sum = studentNotes.reduce((acc, n) => acc + n.note, 0);
    return sum / studentNotes.length;
  };

  // Calcul de la moyenne générale par trimestre pour un élève
  const calculateMoyenneGeneraleTrimestre = (
    studentId: string,
    trimestre: number
  ) => {
    let totalPoints = 0;
    let totalCoefficient = 0;

    matieres.forEach((matiere) => {
      const noteMatiere = getNoteMatiereTrimestre(
        studentId,
        matiere.nom,
        trimestre
      );
      totalCoefficient = matieres.reduce((sum, m) => sum + m.coefficient, 0);
      if (noteMatiere !== null) {
        totalPoints += noteMatiere;
      }
    });

    if (totalCoefficient === 0) return 0;

    // Formule: Total des notes / (Total coefficients / 10)
    return totalPoints / (totalCoefficient / 10);
  };

  // Calcul de la moyenne générale annuelle (moyenne des moyennes des trimestres)
  const calculateMoyenneGeneraleAnnuelle = (
    studentId: string,
    trimestres: number[]
  ) => {
    const moyennesTrimestres = trimestres
      .map((trimestre) =>
        calculateMoyenneGeneraleTrimestre(studentId, trimestre)
      )
      .filter((moyenne) => moyenne > 0);

    if (moyennesTrimestres.length === 0) return 0;
    return moyennesTrimestres.reduce((sum, moyenne) => sum + moyenne, 0)/3;
  };

  // Gestion du formulaire de notes
  const handleNoteChange = (
    studentId: string,
    field: "note" | "observation",
    value: string
  ) => {
    setNotesForm((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { note: "", observation: "" }),
        [field]: value,
      },
    }));
  };

  const saveNotes = () => {
    const newNotes: Note[] = [];
    const updatedNotes: Note[] = [];

    Object.entries(notesForm).forEach(([studentId, data]) => {
      if (data.note && !isNaN(parseFloat(data.note))) {
        const noteValue = parseFloat(data.note);
        if (noteValue < 0 || noteValue > 100) {
          alert("Les notes doivent être entre 0 et 100");
          return;
        }

        // Vérifier si la note existe déjà
        const existingNoteIndex = notes.findIndex(
          (n) =>
            n.studentId === studentId &&
            n.matiere === selectedMatiere &&
            n.trimestre === selectedTrimestre
        );

        const noteData: Note = {
          id:
            existingNoteIndex >= 0
              ? notes[existingNoteIndex].id
              : Date.now().toString() + Math.random(),
          studentId,
          matiere: selectedMatiere,
          trimestre: selectedTrimestre,
          note: noteValue,
          observation: data.observation || undefined,
          dateAjout: new Date().toISOString().split("T")[0],
        };

        if (existingNoteIndex >= 0) {
          updatedNotes.push(noteData);
        } else {
          newNotes.push(noteData);
        }
      }
    });

    // Mettre à jour l'état notes en une seule fois
    if (updatedNotes.length > 0 || newNotes.length > 0) {
      setNotes((prev) => {
        let result = [...prev];

        // Mettre à jour les notes existantes
        updatedNotes.forEach((updatedNote) => {
          const index = result.findIndex((n) => n.id === updatedNote.id);
          if (index >= 0) {
            result[index] = updatedNote;
          }
        });

        // Ajouter les nouvelles notes
        result = [...result, ...newNotes];

        return result;
      });
    }

    // Réinitialiser le formulaire
    setNotesForm({});
    alert(`Notes sauvegardées avec succès!`);
  };

  // Fonctions de génération de bulletins
  const generateBulletin = () => {
    if (selectedStudentsForBulletin.length === 0) {
      alert("Veuillez sélectionner au moins un élève");
      return;
    }

    const selectedTrimestres: number[] = [];
    if (selectedTrimestresForBulletin.trimestre1) selectedTrimestres.push(1);
    if (selectedTrimestresForBulletin.trimestre2) selectedTrimestres.push(2);
    if (selectedTrimestresForBulletin.trimestre3) selectedTrimestres.push(3);

    if (selectedTrimestres.length === 0) {
      alert("Veuillez sélectionner au moins un trimestre");
      return;
    }

    // Toujours générer dans une seule fenêtre, un bulletin par page
    const allBulletinsWindow = window.open("", "_blank", "width=1000,height=800");
    if (!allBulletinsWindow) return;

    const allBulletinsHTML = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bulletins - ${selectedStudentsForBulletin.length} élève(s)</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Times New Roman', serif;
            line-height: 1.3;
            color: #333;
            background: white;
          }
          
          .page {
            width: 8.5in;
            height: 11in;
            margin: 0 auto;
            background: white;
            padding: 0.5in;
          }
          
          .header {
            text-align: center;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          
          .institution-name {
            font-size: 22px;
            font-weight: bold;
            color: #1e3a8a;
            margin-bottom: 5px;
          }
          
          .institution-address {
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
          }
          
          .document-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-top: 8px;
          }
          
          .student-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
          }
          
          .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          
          .info-label {
            font-weight: bold;
            color: #333;
          }
          
          .info-value {
            color: #666;
          }
          
          .notes-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 11px;
          }
          
          .notes-table th {
            background: #1e3a8a;
            color: white;
            padding: 8px 6px;
            text-align: center;
            font-weight: bold;
          }
          
          .notes-table td {
            padding: 6px;
            text-align: center;
            border: 1px solid #ddd;
          }
          
          .matiere-cell {
            text-align: left !important;
            font-weight: 500;
          }
          
          .note-cell {
            font-weight: bold;
          }
          
          .total-row {
            background: #e6f2ff !important;
            font-weight: bold;
          }
          
          .summary-section {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 20px 0;
          }
          
          .summary-card {
            background: white;
            border: 2px solid #1e3a8a;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            min-width: 150px;
          }
          
          .summary-card h4 {
            font-size: 12px;
            margin-bottom: 8px;
            color: #1e3a8a;
          }
          
          .summary-value {
            font-size: 20px;
            font-weight: bold;
            color: #1e3a8a;
          }
          
          .signatures {
            margin-top: 120px;
            display: flex;
            justify-content: space-between;
          }
          
          .signature-block {
            text-align: center;
            width: 150px;
          }
          
          .signature-title {
            font-size: 11px;
            margin-bottom: 25px;
            color: #333;
          }
          
          .signature-line {
            border-bottom: 1px solid #333;
          }
          
          .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1e3a8a;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            z-index: 1000;
          }
          
          .bulletin-container {
            page-break-after: always;
            margin-bottom: 20px;
          }
          
          .bulletin-container:last-child {
            page-break-after: avoid;
          }
          
          @media print {
            body { background: white; }
            .print-btn { display: none; }
            .page { margin: 0; padding: 0.3in; }
            .bulletin-container { page-break-after: always; }
            .bulletin-container:last-child { page-break-after: avoid; }
          }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">Imprimer Tous</button>
        ${selectedStudentsForBulletin.map((studentId) => {
          const student = students.find((s) => s.id === studentId);
          if (!student) return '';
          
          return generateSingleBulletinHTML(student, selectedTrimestres);
        }).join('')}
      </body>
      </html>
    `;

    allBulletinsWindow.document.write(allBulletinsHTML);
    allBulletinsWindow.document.close();
  };

  const generateReleve = () => {
    if (selectedStudentsForReleve.length === 0) {
      alert("Veuillez sélectionner au moins un élève");
      return;
    }

    const trimestres = selectedTrimestreForReleve
      ? [parseInt(selectedTrimestreForReleve)]
      : [1, 2, 3];

    // Toujours générer dans une seule fenêtre, un relevé par page
    const allRelevesWindow = window.open("", "_blank", "width=1000,height=800");
    if (!allRelevesWindow) return;

    const allRelevesHTML = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relevés - ${selectedStudentsForReleve.length} élève(s)</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Times New Roman', serif;
            line-height: 1.3;
            color: #333;
            background: white;
          }
          
          .page {
            width: 8.5in;
            height: 11in;
            margin: 0 auto;
            background: white;
            padding: 0.5in;
          }
          
          .header {
            text-align: center;
            border-bottom: 2px solid #10b981;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          
          .institution-name {
            font-size: 22px;
            font-weight: bold;
            color: #10b981;
            margin-bottom: 5px;
          }
          
          .institution-address {
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
          }
          
          .document-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-top: 8px;
          }
          
          .student-info {
            background: #f0fdf4;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          
          .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          
          .info-label {
            font-weight: bold;
            color: #333;
          }
          
          .info-value {
            color: #666;
          }
          
          .notes-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 11px;
          }
          
          .notes-table th {
            background: #10b981;
            color: white;
            padding: 8px 6px;
            text-align: center;
            font-weight: bold;
          }
          
          .notes-table td {
            padding: 6px;
            text-align: center;
            border: 1px solid #ddd;
          }
          
          .matiere-cell {
            text-align: left !important;
            font-weight: 500;
          }
          
          .total-row {
            background: #e6f2ff !important;
            font-weight: bold;
          }
          
          .summary-section {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 20px 0;
          }
          
          .summary-card {
            background: white;
            border: 2px solid #10b981;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            min-width: 130px;
          }
          
          .summary-card h4 {
            font-size: 12px;
            margin-bottom: 8px;
            color: #10b981;
          }
          
          .summary-value {
            font-size: 18px;
            font-weight: bold;
            color: #10b981;
          }
          
          .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            z-index: 1000;
          }
          
          .releve-container {
            page-break-after: always;
            margin-bottom: 20px;
          }
          
          .releve-container:last-child {
            page-break-after: avoid;
          }
          
          @media print {
            body { background: white; }
            .print-btn { display: none; }
            .page { margin: 0; padding: 0.3in; }
            .releve-container { page-break-after: always; }
            .releve-container:last-child { page-break-after: avoid; }
          }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">Imprimer Tous</button>
        ${selectedStudentsForReleve.map((studentId) => {
          const student = students.find((s) => s.id === studentId);
          if (!student) return '';
          
          return generateSingleReleveHTML(student, trimestres);
        }).join('')}
      </body>
      </html>
    `;

    allRelevesWindow.document.write(allRelevesHTML);
    allRelevesWindow.document.close();
  };

  const generateBulletinClasse = () => {
    const trimestres =
      selectedTrimestreForClasse === "annuel"
        ? [1, 2, 3]
        : [parseInt(selectedTrimestreForClasse)];
    generateBulletinClasseHTML(trimestres);
  };

  const generateBulletinHTML = (student: Student, trimestres: number[]) => {
    const bulletinWindow = window.open("", "_blank", "width=800,height=600");
    if (!bulletinWindow) return;

    const bulletinHTML = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bulletin - ${student.prenom} ${student.nom}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Times New Roman', serif;
            line-height: 1.3;
            color: #333;
            background: white;
          }
          
          .page {
            width: 8.5in;
            height: 11in;
            margin: 0 auto;
            background: white;
            padding: 0.5in;
          }
          
          .header {
            text-align: center;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          
          .institution-name {
            font-size: 22px;
            font-weight: bold;
            color: #1e3a8a;
            margin-bottom: 5px;
          }
          
          .institution-address {
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
          }
          
          .document-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-top: 8px;
          }
          
          .student-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
          }
          
          .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          
          .info-label {
            font-weight: bold;
            color: #333;
          }
          
          .info-value {
            color: #666;
          }
          
          .notes-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 11px;
          }
          
          .notes-table th {
            background: #1e3a8a;
            color: white;
            padding: 8px 6px;
            text-align: center;
            font-weight: bold;
          }
          
          .notes-table td {
            padding: 6px;
            text-align: center;
            border: 1px solid #ddd;
          }
          
          .matiere-cell {
            text-align: left !important;
            font-weight: 500;
          }
          
          .note-cell {
            font-weight: bold;
          }
          
          .total-row {
            background: #e6f2ff !important;
            font-weight: bold;
          }
          
          .summary-section {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 20px 0;
          }
          
          .summary-card {
            background: white;
            border: 2px solid #1e3a8a;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            min-width: 150px;
          }
          
          .summary-card h4 {
            font-size: 12px;
            margin-bottom: 8px;
            color: #1e3a8a;
          }
          
          .summary-value {
            font-size: 20px;
            font-weight: bold;
            color: #1e3a8a;
          }
          
          .signatures {
            margin-top: 120px;
            display: flex;
            justify-content: space-between;
          }
          
          .signature-block {
            text-align: center;
            width: 150px;
          }
          
          .signature-title {
            font-size: 11px;
            margin-bottom: 25px;
            color: #333;
          }
          
          .signature-line {
            border-bottom: 1px solid #333;
          }
          
          .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1e3a8a;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
          }
          
          @media print {
            body { background: white; }
            .print-btn { display: none; }
            .page { margin: 0; padding: 0.3in; }
          }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">Imprimer</button>
        <div class="page">
          <div class="header">
            <div class="institution-name">INSTITUT SAINT-JOSEPH</div>
            <div class="institution-address">123 Avenue de l'Éducation, Port-au-Prince, Haïti</div>
            <div class="document-title">BULLETIN DE NOTES</div>
          </div>

          <div class="student-info">
            <div>
              <div class="info-item">
                <span class="info-label">Nom et Prénom :</span>
                <span class="info-value">${student.prenom} ${student.nom}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Code Élève :</span>
                <span class="info-value">${student.code}</span>
              </div>
            </div>
            <div>
              <div class="info-item">
                <span class="info-label">Classe :</span>
                <span class="info-value">${student.classesDemandee}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Salle :</span>
                <span class="info-value">${student.salle}</span>
              </div>
            </div>
          </div>

          ${generateNotesTableHTML(student, trimestres)}

          <div class="signatures">
            <br/> <br/> <br/> <br/> <br/> <br/> <br/>
             <br/> <br/> <br/> <br/> <br/> <br/>
            <div class="signature-block">
              <div class="signature-title">Signature du Directeur</div>
              <div class="signature-line"></div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    bulletinWindow.document.write(bulletinHTML);
    bulletinWindow.document.close();
  };

  const generateNotesTableHTML = (student: Student, trimestres: number[]) => {
    let tableHTML = '<div class="notes-section"><table class="notes-table">';

    // En-têtes
    tableHTML += "<thead><tr><th class='matiere-cell'>Matière</th>";
    trimestres.forEach((trimestre) => {
      tableHTML += `<th>${trimestre}${
        trimestre === 1 ? "er" : "ème"
      } Trimestre</th>`;
    });
    tableHTML += "</tr></thead><tbody>";

    // Variables pour calculer les totaux
    const totauxParTrimestre: { [key: number]: number } = {};
    const coefficientTotal = matieres.reduce(
      (sum, m) => sum + m.coefficient,
      0
    );

    // Initialiser les totaux
    trimestres.forEach((t) => {
      totauxParTrimestre[t] = 0;
    });

    // Lignes des matières
    matieres.forEach((matiere) => {
      tableHTML += "<tr>";
      tableHTML += `<td class="matiere-cell">${matiere.nom}</td>`;

      trimestres.forEach((trimestre) => {
        const noteMatiere = getNoteMatiereTrimestre(
          student.id,
          matiere.nom,
          trimestre
        );

        if (noteMatiere !== null) {
          tableHTML += `<td class="note-cell">${noteMatiere.toFixed(
            0
          )}/100</td>`;
          totauxParTrimestre[trimestre] += noteMatiere;
        } else {
          tableHTML += "<td>-</td>";
        }
      });

      tableHTML += "</tr>";
    });

    // Ligne des totaux
    tableHTML += '<tr class="total-row">';
    tableHTML += '<td class="matiere-cell"><strong>TOTAL</strong></td>';
    trimestres.forEach((trimestre) => {
      tableHTML += `<td><strong>${totauxParTrimestre[trimestre].toFixed(
        0
      )}/${coefficientTotal}</strong></td>`;
    });
    tableHTML += "</tr>";

    tableHTML += "</tbody></table></div>";

    // Section des moyennes et observations
    tableHTML += '<div class="summary-section">';

    if (trimestres.length === 1) {
      // Un seul trimestre
      const trimestre = trimestres[0];
      const moyenneGenerale = calculateMoyenneGeneraleTrimestre(
        student.id,
        trimestre
      );
      const observation = generateObservation(moyenneGenerale);

      tableHTML += `
        <div class="summary-card moyenne-card">
          <h4>Moyenne Générale</h4>
          <div class="summary-value moyenne-value">${moyenneGenerale.toFixed(
            2
          )}/10</div>
        </div>
        <div class="summary-card observation-card">
          <h4>Observation</h4>
          <div class="summary-value observation-value">${observation}</div>
        </div>
      `;
    } else {
      // Plusieurs trimestres - afficher moyennes par trimestre
      const moyennesTrimestres: number[] = [];

      trimestres.forEach((trimestre, index) => {
        const moyenneGenerale = calculateMoyenneGeneraleTrimestre(
          student.id,
          trimestre
        );
        const observation = generateObservation(moyenneGenerale);
        moyennesTrimestres.push(moyenneGenerale);

        tableHTML += `
          <div class="summary-card moyenne-card">
            <h4>${trimestre}${trimestre === 1 ? "er" : "ème"} Trimestre</h4>
            <div class="summary-value moyenne-value">${moyenneGenerale.toFixed(
              2
            )}/10</div>
            <div style="font-size: 12px; color: #10b981; font-weight: bold; margin-top: 5px;">${observation}</div>
          </div>
        `;
      });

      // Moyenne générale annuelle
      const moyenneAnnuelle =
        moyennesTrimestres.reduce((sum, m) => sum + m, 0) /
        moyennesTrimestres.length;
      const observationAnnuelle = generateObservation(moyenneAnnuelle);

      tableHTML += `
        <div class="summary-card observation-card" style="border-color: #f59e0b; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);">
          <h4 style="color: #d97706;">Moyenne Générale</h4>
          <div class="summary-value" style="color: #f59e0b;">${moyenneAnnuelle.toFixed(
            2
          )}/10</div>
          <div style="font-size: 12px; color: #d97706; font-weight: bold; margin-top: 5px;">${observationAnnuelle}</div>
        </div>
      `;
    }

    tableHTML += "</div>";

    return tableHTML;
  };

  const generateReleveHTML = (student: Student, trimestres: number[]) => {
    const releveWindow = window.open("", "_blank", "width=1000,height=700");
    if (!releveWindow) return;

    const releveHTML = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relevé de Notes - ${student.prenom} ${student.nom}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Times New Roman', serif;
            line-height: 1.3;
            color: #333;
            background: white;
          }
          
          .page {
            width: 8.5in;
            height: 11in;
            margin: 0 auto;
            background: white;
            padding: 0.5in;
          }
          
          .header {
            text-align: center;
            border-bottom: 2px solid #10b981;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          
          .institution-name {
            font-size: 22px;
            font-weight: bold;
            color: #10b981;
            margin-bottom: 5px;
          }
          
          .institution-address {
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
          }
          
          .document-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-top: 8px;
          }
          
          .student-info {
            background: #f0fdf4;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          
          .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          
          .info-label {
            font-weight: bold;
            color: #333;
          }
          
          .info-value {
            color: #666;
          }
          
          .notes-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 11px;
          }
          
          .notes-table th {
            background: #10b981;
            color: white;
            padding: 8px 6px;
            text-align: center;
            font-weight: bold;
          }
          
          .notes-table td {
            padding: 6px;
            text-align: center;
            border: 1px solid #ddd;
          }
          
          .matiere-cell {
            text-align: left !important;
            font-weight: 500;
          }
          
          .total-row {
            background: #e6f2ff !important;
            font-weight: bold;
          }
          
          .summary-section {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 20px 0;
          }
          
          .summary-card {
            background: white;
            border: 2px solid #10b981;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            min-width: 130px;
          }
          
          .summary-card h4 {
            font-size: 12px;
            margin-bottom: 8px;
            color: #10b981;
          }
          
          .summary-value {
            font-size: 18px;
            font-weight: bold;
            color: #10b981;
          }
          
          .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
          }
          
          @media print {
            body { background: white; }
            .print-btn { display: none; }
            .page { margin: 0; padding: 0.3in; }
          }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">Imprimer</button>
        <div class="page">
          <div class="header">
            <div class="institution-name">INSTITUT SAINT-JOSEPH</div>
            <div class="institution-address">123 Avenue de l'Éducation, Port-au-Prince, Haïti</div>
            <div class="document-title">RELEVÉ DE NOTES - TOUTES MATIÈRES</div>
          </div>

          <div class="student-info">
            <div>
              <div class="info-item">
                <span class="info-label">Nom et Prénom :</span>
                <span class="info-value">${student.prenom} ${student.nom}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Code Élève :</span>
                <span class="info-value">${student.code}</span>
              </div>
            </div>
            <div>
              <div class="info-item">
                <span class="info-label">Classe :</span>
                <span class="info-value">${student.classesDemandee}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Salle :</span>
                <span class="info-value">${student.salle}</span>
              </div>
            </div>
          </div>

          <table class="notes-table">
            <thead>
              <tr>
                <th class="matiere-cell">Matière</th>
                ${trimestres
                  .map(
                    (t) => `<th>${t}${t === 1 ? "er" : "ème"} Trimestre</th>`
                  )
                  .join("")}
              </tr>
            </thead>
            <tbody>
              ${matieres
                .map((matiere) => {
                  let row = `<tr><td class="matiere-cell">${matiere.nom}</td>`;

                  trimestres.forEach((trimestre) => {
                    const noteMatiere = getNoteMatiereTrimestre(
                      student.id,
                      matiere.nom,
                      trimestre
                    );
                    if (noteMatiere !== null) {
                      row += `<td>${noteMatiere.toFixed(0)}/100</td>`;
                    } else {
                      row += "<td>-</td>";
                    }
                  });

                  row += "</tr>";
                  return row;
                })
                .join("")}
              
              <tr class="total-row">
                <td class="matiere-cell"><strong>TOTAL</strong></td>
                ${trimestres
                  .map((trimestre) => {
                    let total = 0;
                    matieres.forEach((matiere) => {
                      const noteMatiere = getNoteMatiereTrimestre(
                        student.id,
                        matiere.nom,
                        trimestre
                      );
                      if (noteMatiere !== null) {
                        total += noteMatiere;
                      }
                    });
                    const coefficientTotal = matieres.reduce(
                      (sum, m) => sum + m.coefficient,
                      0
                    );
                    return `<td><strong>${total.toFixed(
                      0
                    )}/${coefficientTotal}</strong></td>`;
                  })
                  .join("")}
              </tr>
            </tbody>
          </table>

          <div class="summary-section">
            ${
              trimestres.length === 1
                ? (() => {
                    const trimestre = trimestres[0];
                    const moyenneGenerale = calculateMoyenneGeneraleTrimestre(
                      student.id,
                      trimestre
                    );
                    const observation = generateObservation(moyenneGenerale);
                    return `
                <div class="summary-card">
                  <h4>Moyenne Générale</h4>
                  <div class="summary-value">${moyenneGenerale.toFixed(
                    2
                  )}/10</div>
                </div>
                <div class="summary-card">
                  <h4>Observation</h4>
                  <div class="summary-value" style="font-size: 14px;">${observation}</div>
                </div>
              `;
                  })()
                : (() => {
                    const moyennesTrimestres = trimestres.map((t) =>
                      calculateMoyenneGeneraleTrimestre(student.id, t)
                    );
                    const moyenneAnnuelle =
                      moyennesTrimestres.reduce((sum, m) => sum + m, 0) /
                      moyennesTrimestres.length;
                    const observationAnnuelle =
                      generateObservation(moyenneAnnuelle);

                    let html = "";
                    trimestres.forEach((trimestre, index) => {
                      const moyenne = moyennesTrimestres[index];
                      const obs = generateObservation(moyenne);
                      html += `
                  <div class="summary-card">
                    <h4>T${trimestre}</h4>
                    <div class="summary-value">${moyenne.toFixed(2)}/10</div>
                    <div style="font-size: 10px; color: #666; margin-top: 3px;">${obs}</div>
                  </div>
                `;
                    });

                    html += `
                <div class="summary-card" style="border-color: #f59e0b;">
                  <h4 style="color: #f59e0b;">Moyenne Générale</h4>
                  <div class="summary-value" style="color: #f59e0b;">${moyenneAnnuelle.toFixed(
                    2
                  )}/10</div>
                  <div style="font-size: 10px; color: #f59e0b; margin-top: 3px;">${observationAnnuelle}</div>
                </div>
              `;

                    return html;
                  })()
            }
          </div>
        </div>
      </body>
      </html>
    `;

    releveWindow.document.write(releveHTML);
    releveWindow.document.close();
  };

  // Fonction alternative pour générer tous les bulletins dans une seule fenêtre
  const generateAllBulletinsInOneWindow = () => {
    if (selectedStudentsForBulletin.length === 0) {
      alert("Veuillez sélectionner au moins un élève");
      return;
    }

    const selectedTrimestres: number[] = [];
    if (selectedTrimestresForBulletin.trimestre1) selectedTrimestres.push(1);
    if (selectedTrimestresForBulletin.trimestre2) selectedTrimestres.push(2);
    if (selectedTrimestresForBulletin.trimestre3) selectedTrimestres.push(3);

    if (selectedTrimestres.length === 0) {
      alert("Veuillez sélectionner au moins un trimestre");
      return;
    }

    const allBulletinsWindow = window.open("", "_blank", "width=1000,height=800");
    if (!allBulletinsWindow) return;

    const allBulletinsHTML = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bulletins Multiples</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Times New Roman', serif;
            line-height: 1.3;
            color: #333;
            background: white;
          }
          
          .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1e3a8a;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            z-index: 1000;
          }
          
          .bulletin-container {
            page-break-after: always;
            margin-bottom: 20px;
          }
          
          .bulletin-container:last-child {
            page-break-after: avoid;
          }
          
          @media print {
            body { background: white; }
            .print-btn { display: none; }
            .bulletin-container { page-break-after: always; }
            .bulletin-container:last-child { page-break-after: avoid; }
          }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">Imprimer Tous</button>
        ${selectedStudentsForBulletin.map((studentId) => {
          const student = students.find((s) => s.id === studentId);
          if (!student) return '';
          
          return generateSingleBulletinHTML(student, selectedTrimestres);
        }).join('')}
      </body>
      </html>
    `;

    allBulletinsWindow.document.write(allBulletinsHTML);
    allBulletinsWindow.document.close();
  };

  // Fonction pour générer le HTML d'un seul bulletin avec tous les styles
  const generateSingleBulletinHTML = (student: Student, trimestres: number[]) => {
    return `
      <div class="bulletin-container">
        <div class="page">
          <div class="header">
            <div class="institution-name">INSTITUT SAINT-JOSEPH</div>
            <div class="institution-address">123 Avenue de l'Éducation, Port-au-Prince, Haïti</div>
            <div class="document-title">BULLETIN DE NOTES</div>
          </div>

          <div class="student-info">
            <div>
              <div class="info-item">
                <span class="info-label">Nom et Prénom :</span>
                <span class="info-value">${student.prenom} ${student.nom}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Code Élève :</span>
                <span class="info-value">${student.code}</span>
              </div>
            </div>
            <div>
              <div class="info-item">
                <span class="info-label">Classe :</span>
                <span class="info-value">${student.classesDemandee}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Salle :</span>
                <span class="info-value">${student.salle}</span>
              </div>
            </div>
          </div>

          ${generateNotesTableHTML(student, trimestres)}

          <div class="signatures">
            <br/> <br/> <br/> <br/> <br/> <br/> <br/>
            <br/> <br/> <br/> <br/> <br/> <br/>
            <div class="signature-block">
              <div class="signature-title">Signature du Directeur</div>
              <div class="signature-line"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // Fonction pour générer le HTML d'un seul relevé avec tous les styles
  const generateSingleReleveHTML = (student: Student, trimestres: number[]) => {
    return `
      <div class="releve-container">
        <div class="page">
          <div class="header">
            <div class="institution-name">INSTITUT SAINT-JOSEPH</div>
            <div class="institution-address">123 Avenue de l'Éducation, Port-au-Prince, Haïti</div>
            <div class="document-title">RELEVÉ DE NOTES - TOUTES MATIÈRES</div>
          </div>

          <div class="student-info">
            <div>
              <div class="info-item">
                <span class="info-label">Nom et Prénom :</span>
                <span class="info-value">${student.prenom} ${student.nom}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Code Élève :</span>
                <span class="info-value">${student.code}</span>
              </div>
            </div>
            <div>
              <div class="info-item">
                <span class="info-label">Classe :</span>
                <span class="info-value">${student.classesDemandee}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Salle :</span>
                <span class="info-value">${student.salle}</span>
              </div>
            </div>
          </div>

          <table class="notes-table">
            <thead>
              <tr>
                <th class="matiere-cell">Matière</th>
                ${trimestres
                  .map(
                    (t) => `<th>${t}${t === 1 ? "er" : "ème"} Trimestre</th>`
                  )
                  .join("")}
              </tr>
            </thead>
            <tbody>
              ${matieres
                .map((matiere) => {
                  let row = `<tr><td class="matiere-cell">${matiere.nom}</td>`;

                  trimestres.forEach((trimestre) => {
                    const noteMatiere = getNoteMatiereTrimestre(
                      student.id,
                      matiere.nom,
                      trimestre
                    );
                    if (noteMatiere !== null) {
                      row += `<td>${noteMatiere.toFixed(0)}/100</td>`;
                    } else {
                      row += "<td>-</td>";
                    }
                  });

                  row += "</tr>";
                  return row;
                })
                .join("")}
              
              <tr class="total-row">
                <td class="matiere-cell"><strong>TOTAL</strong></td>
                ${trimestres
                  .map((trimestre) => {
                    let total = 0;
                    matieres.forEach((matiere) => {
                      const noteMatiere = getNoteMatiereTrimestre(
                        student.id,
                        matiere.nom,
                        trimestre
                      );
                      if (noteMatiere !== null) {
                        total += noteMatiere;
                      }
                    });
                    const coefficientTotal = matieres.reduce(
                      (sum, m) => sum + m.coefficient,
                      0
                    );
                    return `<td><strong>${total.toFixed(
                      0
                    )}/${coefficientTotal}</strong></td>`;
                  })
                  .join("")}
              </tr>
            </tbody>
          </table>

          <div class="summary-section">
            ${
              trimestres.length === 1
                ? (() => {
                    const trimestre = trimestres[0];
                    const moyenneGenerale = calculateMoyenneGeneraleTrimestre(
                      student.id,
                      trimestre
                    );
                    const observation = generateObservation(moyenneGenerale);
                    return `
                <div class="summary-card">
                  <h4>Moyenne Générale</h4>
                  <div class="summary-value">${moyenneGenerale.toFixed(
                    2
                  )}/10</div>
                </div>
                <div class="summary-card">
                  <h4>Observation</h4>
                  <div class="summary-value" style="font-size: 14px;">${observation}</div>
                </div>
              `;
                  })()
                : (() => {
                    const moyennesTrimestres = trimestres.map((t) =>
                      calculateMoyenneGeneraleTrimestre(student.id, t)
                    );
                    const moyenneAnnuelle =
                      moyennesTrimestres.reduce((sum, m) => sum + m, 0) /
                      moyennesTrimestres.length;
                    const observationAnnuelle =
                      generateObservation(moyenneAnnuelle);

                    let html = "";
                    trimestres.forEach((trimestre, index) => {
                      const moyenne = moyennesTrimestres[index];
                      const obs = generateObservation(moyenne);
                      html += `
                  <div class="summary-card">
                    <h4>T${trimestre}</h4>
                    <div class="summary-value">${moyenne.toFixed(2)}/10</div>
                    <div style="font-size: 10px; color: #666; margin-top: 3px;">${obs}</div>
                  </div>
                `;
                    });

                    html += `
                <div class="summary-card" style="border-color: #f59e0b;">
                  <h4 style="color: #f59e0b;">Moyenne Générale</h4>
                  <div class="summary-value" style="color: #f59e0b;">${moyenneAnnuelle.toFixed(
                    2
                  )}/10</div>
                  <div style="font-size: 10px; color: #f59e0b; margin-top: 3px;">${observationAnnuelle}</div>
                </div>
              `;

                    return html;
                  })()
            }
          </div>
        </div>
      </div>
    `;
  };

  const generateBulletinClasseHTML = (trimestres: number[]) => {
    const bulletinWindow = window.open("", "_blank", "width=1200,height=800");
    if (!bulletinWindow) return;

    const bulletinHTML = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bulletin de Classe - ${selectedClasse} ${selectedSalle}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Times New Roman', serif;
            line-height: 1.3;
            color: #333;
            background: white;
          }
          
          .page {
            width: 11in;
            height: 8.5in;
            margin: 0 auto;
            background: white;
            padding: 0.4in;
          }
          
          .header {
            text-align: center;
            border-bottom: 2px solid #ea580c;
            padding-bottom: 12px;
            margin-bottom: 15px;
          }
          
          .institution-name {
            font-size: 20px;
            font-weight: bold;
            color: #ea580c;
            margin-bottom: 4px;
          }
          
          .document-title {
            font-size: 14px;
            font-weight: bold;
            color: #333;
            margin-top: 6px;
          }
          
          .class-info {
            background: #fff7ed;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
            text-align: center;
          }
          
          .notes-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9px;
          }
          
          .notes-table th {
            background: #ea580c;
            color: white;
            padding: 6px 4px;
            text-align: center;
            font-weight: bold;
          }
          
          .notes-table td {
            padding: 4px;
            text-align: center;
            border: 1px solid #ddd;
          }
          
          .notes-table tr:nth-child(even) {
            background-color: #f9fafb;
          }
          
          .student-cell {
            text-align: left !important;
            font-weight: 500;
            min-width: 120px;
          }
          
          .moyenne-cell {
            background-color: #fef3c7 !important;
            font-weight: bold;
          }
          
          .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ea580c;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
          }
          
          @media print {
            body { background: white; }
            .print-btn { display: none; }
            .page { margin: 0; padding: 0.3in; }
          }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">Imprimer</button>
        <div class="page">
          <div class="header">
            <div class="institution-name">INSTITUT SAINT-JOSEPH</div>
            <div class="document-title">BULLETIN DE CLASSE</div>
          </div>

          <div class="class-info">
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">
              ${selectedClasse} - ${selectedSalle}
            </div>
            <div style="color: #666; font-size: 12px;">
              ${
                trimestres.length === 1
                  ? `${trimestres[0]}${
                      trimestres[0] === 1 ? "er" : "ème"
                    } Trimestre`
                  : "Bulletin Annuel"
              }
            </div>
          </div>

          <table class="notes-table">
            <thead>
              <tr>
                <th class="student-cell">Élève</th>
                <th>Code</th>
                ${matieres
                  .map((m) => `<th>${m.nom.substring(0, 8)}</th>`)
                  .join("")}
                ${
                  trimestres.length === 1
                    ? "<th>Moyenne</th>"
                    : trimestres.map((t) => `<th>T${t}</th>`).join("") +
                      "<th>Moy. Gén.</th>"
                }
              </tr>
            </thead>
            <tbody>
              ${activeStudents
                .map((student) => {
                  let row = `<tr><td class="student-cell">${student.prenom} ${student.nom}</td><td>${student.code}</td>`;

                  if (trimestres.length === 1) {
                    // Un seul trimestre - afficher notes par matière
                    const trimestre = trimestres[0];
                    matieres.forEach((matiere) => {
                      const noteMatiere = getNoteMatiereTrimestre(
                        student.id,
                        matiere.nom,
                        trimestre
                      );
                      if (noteMatiere !== null) {
                        row += `<td>${noteMatiere.toFixed(0)}</td>`;
                      } else {
                        row += "<td>-</td>";
                      }
                    });

                    // Moyenne générale du trimestre
                    const moyenneGenerale = calculateMoyenneGeneraleTrimestre(
                      student.id,
                      trimestre
                    );
                    row += `<td class="moyenne-cell">${moyenneGenerale.toFixed(
                      2
                    )}</td>`;
                  } else {
                    // Plusieurs trimestres - afficher notes par matière (moyenne des trimestres)
                    matieres.forEach((matiere) => {
                      const notesTrimestres = trimestres
                        .map((t) =>
                          getNoteMatiereTrimestre(student.id, matiere.nom, t)
                        )
                        .filter((n) => n !== null);
                      if (notesTrimestres.length > 0) {
                        const moyenneMatiere =
                          notesTrimestres.reduce((sum, n) => sum + n, 0) /
                          notesTrimestres.length;
                        row += `<td>${moyenneMatiere.toFixed(0)}</td>`;
                      } else {
                        row += "<td>-</td>";
                      }
                    });

                    // Moyennes par trimestre
                    trimestres.forEach((trimestre) => {
                      const moyenneGenerale = calculateMoyenneGeneraleTrimestre(
                        student.id,
                        trimestre
                      );
                      row += `<td class="moyenne-cell">${moyenneGenerale.toFixed(
                        2
                      )}</td>`;
                    });

                    // Moyenne générale annuelle
                    const moyenneAnnuelle = calculateMoyenneGeneraleAnnuelle(
                      student.id,
                      trimestres
                    );
                    row += `<td class="moyenne-cell" style="background-color: #fed7aa !important;">${moyenneAnnuelle.toFixed(
                      2
                    )}</td>`;
                  }

                  row += "</tr>";
                  return row;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;

    bulletinWindow.document.write(bulletinHTML);
    bulletinWindow.document.close();
  };

  // Référence pour éviter les mises à jour inutiles
  const lastSyncRef = React.useRef({
    selectedMatiere: "",
    selectedTrimestre: 0,
    activeStudentsCount: 0,
    notesCount: 0,
  });

  // Synchroniser le formulaire avec les notes existantes
  useEffect(() => {
    if (selectedMatiere && selectedTrimestre) {
      const currentSync = {
        selectedMatiere,
        selectedTrimestre,
        activeStudentsCount: activeStudents.length,
        notesCount: notes.length,
      };

      // Vérifier si quelque chose a vraiment changé
      const hasRealChanges =
        lastSyncRef.current.selectedMatiere !== selectedMatiere ||
        lastSyncRef.current.selectedTrimestre !== selectedTrimestre ||
        lastSyncRef.current.activeStudentsCount !== activeStudents.length;

      if (hasRealChanges) {
        const formData: {
          [studentId: string]: { note: string; observation: string };
        } = {};

        activeStudents.forEach((student) => {
          const existingNote = notes.find(
            (n) =>
              n.studentId === student.id &&
              n.matiere === selectedMatiere &&
              n.trimestre === selectedTrimestre
          );

          if (existingNote) {
            formData[student.id] = {
              note: existingNote.note.toString(),
              observation: existingNote.observation || "",
            };
          }
        });

        setNotesForm(formData);
        lastSyncRef.current = currentSync;
      }
    }
  }, [selectedMatiere, selectedTrimestre, activeStudents, notes]);

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

  const tabActiveClasses = isDarkMode
    ? "bg-blue-700 text-white"
    : "bg-blue-600 text-white";

  const tabInactiveClasses = isDarkMode
    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
    : "bg-gray-200 text-gray-700 hover:bg-gray-300";

  return (
    <div className={`${baseClasses} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gestion des Notes</h1>
          <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
            Système de saisie et gestion des notes par trimestre
          </p>
        </div>

        {/* Onglets */}
        <div
          className={`flex mb-6 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            onClick={() => setActiveTab("saisie")}
            className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
              activeTab === "saisie" ? tabActiveClasses : tabInactiveClasses
            }`}
          >
            <Edit className="h-4 w-4 inline mr-2" />
            Saisie des Notes
          </button>
          <button
            onClick={() => setActiveTab("consultation")}
            className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
              activeTab === "consultation"
                ? tabActiveClasses
                : tabInactiveClasses
            }`}
          >
            <Eye className="h-4 w-4 inline mr-2" />
            Consultation
          </button>
          <button
            onClick={() => setActiveTab("bulletins")}
            className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
              activeTab === "bulletins" ? tabActiveClasses : tabInactiveClasses
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Bulletins & Relevés
          </button>
        </div>

        {/* Sélecteurs principaux */}
        <div className={`${cardClasses} p-6 rounded-lg shadow-sm border mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
                }}
              >
                <option value="">Sélectionner une classe</option>
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
                onChange={(e) => setSelectedSalle(e.target.value)}
                disabled={!selectedClasse}
              >
                <option value="">Sélectionner une salle</option>
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
                Matière
              </label>
              <select
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                value={selectedMatiere}
                onChange={(e) => setSelectedMatiere(e.target.value)}
              >
                <option value="">Sélectionner une matière</option>
                {matieres.map((matiere) => (
                  <option key={matiere.id} value={matiere.nom}>
                    {matiere.nom} (Coef. {matiere.coefficient})
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
                Trimestre
              </label>
              <select
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                value={selectedTrimestre}
                onChange={(e) =>
                  setSelectedTrimestre(Number(e.target.value) as 1 | 2 | 3)
                }
              >
                <option value={1}>1er Trimestre</option>
                <option value={2}>2ème Trimestre</option>
                <option value={3}>3ème Trimestre</option>
              </select>
            </div>
          </div>

          {/* Informations de sélection */}
          {selectedClasse && selectedSalle && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-blue-50"
              }`}
            >
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {activeStudents.length} élève(s) actif(s)
                </span>
                {selectedMatiere && (
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    Matière: {selectedMatiere}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Trimestre {selectedTrimestre}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Contenu des onglets */}
        {activeTab === "saisie" && (
          <div className={`${cardClasses} rounded-lg shadow-sm border`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Saisie des Notes</h2>
                {selectedMatiere && activeStudents.length > 0 && (
                  <button
                    onClick={saveNotes}
                    className={`${buttonPrimaryClasses} px-4 py-2 rounded-lg flex items-center gap-2 transition-colors`}
                  >
                    <Save className="h-4 w-4" />
                    Sauvegarder les Notes
                  </button>
                )}
              </div>

              {!selectedClasse || !selectedSalle || !selectedMatiere ? (
                <div className="text-center py-12">
                  <BookOpen
                    className={`h-16 w-16 mx-auto mb-4 ${
                      isDarkMode ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                    Veuillez sélectionner une classe, salle et matière pour
                    commencer la saisie
                  </p>
                </div>
              ) : activeStudents.length === 0 ? (
                <div className="text-center py-12">
                  <Users
                    className={`h-16 w-16 mx-auto mb-4 ${
                      isDarkMode ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                    Aucun élève actif trouvé dans cette classe/salle
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeStudents.map((student) => {
                    const existingNote = notes.find(
                      (n) =>
                        n.studentId === student.id &&
                        n.matiere === selectedMatiere &&
                        n.trimestre === selectedTrimestre
                    );

                    return (
                      <div
                        key={student.id}
                        className={`p-4 border rounded-lg ${
                          isDarkMode ? "border-gray-600" : "border-gray-200"
                        } ${
                          existingNote
                            ? isDarkMode
                              ? "bg-gray-700"
                              : "bg-green-50"
                            : ""
                        }`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <div>
                            <div className="font-medium">
                              {student.prenom} {student.nom}
                              {existingNote && (
                                <span className="ml-2 text-green-600 text-xs">
                                  (Note existante)
                                </span>
                              )}
                            </div>
                            <div
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {student.code} • {student.classesDemandee} -{" "}
                              {student.salle}
                            </div>
                          </div>

                          <div>
                            <label
                              className={`block text-sm font-medium mb-1 ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              Note (/100)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.5"
                              placeholder="Note"
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                              value={notesForm[student.id]?.note || ""}
                              onChange={(e) =>
                                handleNoteChange(
                                  student.id,
                                  "note",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "consultation" && (
          <div className={`${cardClasses} rounded-lg shadow-sm border`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Consultation des Notes</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-3 py-2 border rounded-lg flex items-center gap-2 hover:bg-opacity-80 ${inputClasses}`}
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

                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Matière
                      </label>
                      <select
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                        value={filterMatiere}
                        onChange={(e) => setFilterMatiere(e.target.value)}
                      >
                        <option value="">Toutes les matières</option>
                        {matieres.map((matiere) => (
                          <option key={matiere.id} value={matiere.nom}>
                            {matiere.nom}
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
                        Trimestre
                      </label>
                      <select
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClasses}`}
                        value={filterTrimestre}
                        onChange={(e) => setFilterTrimestre(e.target.value)}
                      >
                        <option value="">Tous les trimestres</option>
                        <option value="1">1er Trimestre</option>
                        <option value="2">2ème Trimestre</option>
                        <option value="3">3ème Trimestre</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Tableau des notes */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
                    <tr>
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Élève
                      </th>
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Matière
                      </th>
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Trimestre
                      </th>
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Note
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      isDarkMode ? "divide-gray-700" : "divide-gray-200"
                    }`}
                  >
                    {notes
                      .filter((note) => {
                        const student = students.find(
                          (s) => s.id === note.studentId
                        );
                        if (!student) return false;

                        if (
                          selectedClasse &&
                          student.classesDemandee !== selectedClasse
                        )
                          return false;
                        if (selectedSalle && student.salle !== selectedSalle)
                          return false;
                        if (filterMatiere && note.matiere !== filterMatiere)
                          return false;
                        if (
                          filterTrimestre &&
                          note.trimestre.toString() !== filterTrimestre
                        )
                          return false;

                        if (searchTerm) {
                          const searchLower = searchTerm.toLowerCase();
                          return (
                            student.nom.toLowerCase().includes(searchLower) ||
                            student.prenom
                              .toLowerCase()
                              .includes(searchLower) ||
                            student.code.toLowerCase().includes(searchLower)
                          );
                        }

                        return true;
                      })
                      .map((note) => {
                        const student = students.find(
                          (s) => s.id === note.studentId
                        );
                        if (!student) return null;

                        return (
                          <tr
                            key={note.id}
                            className={
                              isDarkMode
                                ? "hover:bg-gray-700"
                                : "hover:bg-gray-50"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium">
                                  {student.prenom} {student.nom}
                                </div>
                                <div
                                  className={`text-sm ${
                                    isDarkMode
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {student.code} • {student.classesDemandee} -{" "}
                                  {student.salle}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {note.matiere}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {note.trimestre}er Trimestre
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`text-sm font-medium ${getNoteColor(
                                  note.note
                                )}`}
                              >
                                {note.note}/100
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {notes.length === 0 && (
                <div className="text-center py-12">
                  <BarChart3
                    className={`h-16 w-16 mx-auto mb-4 ${
                      isDarkMode ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                    Aucune note trouvée selon vos critères
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "bulletins" && (
          <div className={`${cardClasses} rounded-lg shadow-sm border`}>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">
                Génération de Bulletins et Relevés
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Bulletin individuel ou multiple */}
                <div
                  className={`p-6 border rounded-lg ${
                    isDarkMode ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <FileText className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-bold">
                        Bulletin Individuel/Multiple
                      </h3>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Par élève(s) et trimestre(s)
                      </p>

                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {/* Sélection multiple d'élèves */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Sélectionner un ou plusieurs élèves
                      </label>

                      {/* Filtre de recherche */}
                      <div className="mb-3">
                        <div className="relative">
                          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Rechercher par nom, prénom ou code..."
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-400 focus:border-blue-400"
                                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                            }`}
                            value={searchStudentsForBulletin}
                            onChange={(e) =>
                              setSearchStudentsForBulletin(e.target.value)
                            }
                          />
                        </div>
                      </div>

                      {/* Options de sélection rapide */}
                      <div className="mb-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const allStudentIds = activeStudents.map(
                              (s) => s.id
                            );
                            setSelectedStudentsForBulletin(allStudentIds);
                          }}
                          className={`px-3 py-1 text-xs rounded-md transition-colors ${
                            isDarkMode
                              ? "bg-blue-700 hover:bg-blue-600 text-white"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          Tout sélectionner
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedStudentsForBulletin([])}
                          className={`px-3 py-1 text-xs rounded-md transition-colors ${
                            isDarkMode
                              ? "bg-gray-700 hover:bg-gray-600 text-white"
                              : "bg-gray-600 hover:bg-gray-700 text-white"
                          }`}
                        >
                          Tout désélectionner
                        </button>
                      </div>

                      {/* Liste des élèves avec filtre */}
                      <div className="max-h-48 overflow-y-auto border rounded-lg p-2">
                        {activeStudents
                          .filter((student) => {
                            if (!searchStudentsForBulletin) return true;
                            const searchTerm =
                              searchStudentsForBulletin.toLowerCase();
                            return (
                              student.nom.toLowerCase().includes(searchTerm) ||
                              student.prenom
                                .toLowerCase()
                                .includes(searchTerm) ||
                              student.code.toLowerCase().includes(searchTerm)
                            );
                          })
                          .map((student) => (
                            <label
                              key={student.id}
                              className="flex items-center mb-2 hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded"
                            >
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={selectedStudentsForBulletin.includes(
                                  student.id
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedStudentsForBulletin((prev) =>
                                      prev.includes(student.id)
                                        ? prev
                                        : [...prev, student.id]
                                    );
                                  } else {
                                    setSelectedStudentsForBulletin((prev) =>
                                      prev.filter((id) => id !== student.id)
                                    );
                                  }
                                }}
                              />
                              <span className="text-sm">
                                <span className="font-medium">
                                  {student.prenom} {student.nom}
                                </span>
                                <span
                                  className={`ml-2 text-xs ${
                                    isDarkMode
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  ({student.code}) • {student.salle}
                                </span>
                              </span>
                            </label>
                          ))}

                        {/* Message si aucun élève trouvé */}
                        {activeStudents.filter((student) => {
                          if (!searchStudentsForBulletin) return true;
                          const searchTerm =
                            searchStudentsForBulletin.toLowerCase();
                          return (
                            student.nom.toLowerCase().includes(searchTerm) ||
                            student.prenom.toLowerCase().includes(searchTerm) ||
                            student.code.toLowerCase().includes(searchTerm)
                          );
                        }).length === 0 &&
                          searchStudentsForBulletin && (
                            <div
                              className={`text-center py-4 text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Aucun élève trouvé pour "
                              {searchStudentsForBulletin}"
                            </div>
                          )}
                      </div>

                      {/* Compteur d'élèves sélectionnés */}
                      {selectedStudentsForBulletin.length > 0 && (
                        <div
                          className={`mt-2 text-sm ${
                            isDarkMode ? "text-blue-300" : "text-blue-600"
                          }`}
                        >
                          {selectedStudentsForBulletin.length} élève(s)
                          sélectionné(s)
                        </div>
                      )}
                    </div>

                    {/* Sélection des trimestres */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Sélectionner les trimestres
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={selectedTrimestresForBulletin.trimestre1}
                            onChange={(e) =>
                              setSelectedTrimestresForBulletin((prev) => ({
                                ...prev,
                                trimestre1: e.target.checked,
                              }))
                            }
                          />
                          <span className="text-sm">1er Trimestre</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={selectedTrimestresForBulletin.trimestre2}
                            onChange={(e) =>
                              setSelectedTrimestresForBulletin((prev) => ({
                                ...prev,
                                trimestre2: e.target.checked,
                              }))
                            }
                          />
                          <span className="text-sm">2ème Trimestre</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={selectedTrimestresForBulletin.trimestre3}
                            onChange={(e) =>
                              setSelectedTrimestresForBulletin((prev) => ({
                                ...prev,
                                trimestre3: e.target.checked,
                              }))
                            }
                          />
                          <span className="text-sm">3ème Trimestre</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => generateBulletin()}
                    disabled={selectedStudentsForBulletin.length === 0}
                    className={`w-full ${buttonPrimaryClasses} px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Download className="h-4 w-4 inline mr-2" />
                    Générer Bulletin(s)
                  </button>
                </div>

                {/* Relevé par élèves */}
                <div
                  className={`p-6 border rounded-lg ${
                    isDarkMode ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <h3 className="font-bold">Relevé par Élèves</h3>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Toutes les matières
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {/* Sélection des élèves */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Sélectionner les élèves
                      </label>

                      {/* Filtre de recherche */}
                      <div className="mb-3">
                        <div className="relative">
                          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Rechercher..."
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${inputClasses}`}
                            value={searchStudentsForReleve}
                            onChange={(e) =>
                              setSearchStudentsForReleve(e.target.value)
                            }
                          />
                        </div>
                      </div>

                      {/* Options de sélection rapide */}
                      <div className="mb-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const allStudentIds = activeStudents.map(
                              (s) => s.id
                            );
                            setSelectedStudentsForReleve(allStudentIds);
                          }}
                          className={`px-3 py-1 text-xs rounded-md transition-colors ${
                            isDarkMode
                              ? "bg-green-700 hover:bg-green-600 text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }`}
                        >
                          Tout sélectionner
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedStudentsForReleve([])}
                          className={`px-3 py-1 text-xs rounded-md transition-colors ${
                            isDarkMode
                              ? "bg-gray-700 hover:bg-gray-600 text-white"
                              : "bg-gray-600 hover:bg-gray-700 text-white"
                          }`}
                        >
                          Tout désélectionner
                        </button>
                      </div>

                      {/* Liste des élèves */}
                      <div className="max-h-48 overflow-y-auto border rounded-lg p-2">
                        {activeStudents
                          .filter((student) => {
                            if (!searchStudentsForReleve) return true;
                            const searchTerm =
                              searchStudentsForReleve.toLowerCase();
                            return (
                              student.nom.toLowerCase().includes(searchTerm) ||
                              student.prenom
                                .toLowerCase()
                                .includes(searchTerm) ||
                              student.code.toLowerCase().includes(searchTerm)
                            );
                          })
                          .map((student) => (
                            <label
                              key={student.id}
                              className="flex items-center mb-2 hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded"
                            >
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={selectedStudentsForReleve.includes(
                                  student.id
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedStudentsForReleve((prev) =>
                                      prev.includes(student.id)
                                        ? prev
                                        : [...prev, student.id]
                                    );
                                  } else {
                                    setSelectedStudentsForReleve((prev) =>
                                      prev.filter((id) => id !== student.id)
                                    );
                                  }
                                }}
                              />
                              <span className="text-sm">
                                <span className="font-medium">
                                  {student.prenom} {student.nom}
                                </span>
                                <span
                                  className={`ml-2 text-xs ${
                                    isDarkMode
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  ({student.code}) • {student.salle}
                                </span>
                              </span>
                            </label>
                          ))}
                      </div>

                      {/* Compteur */}
                      {selectedStudentsForReleve.length > 0 && (
                        <div
                          className={`mt-2 text-sm ${
                            isDarkMode ? "text-green-300" : "text-green-600"
                          }`}
                        >
                          {selectedStudentsForReleve.length} élève(s)
                          sélectionné(s)
                        </div>
                      )}
                    </div>

                    <select
                      className={`w-full px-3 py-2 border rounded-lg ${inputClasses}`}
                      value={selectedTrimestreForReleve}
                      onChange={(e) =>
                        setSelectedTrimestreForReleve(e.target.value)
                      }
                    >
                      <option value="">Tous les trimestres</option>
                      <option value="1">1er Trimestre</option>
                      <option value="2">2ème Trimestre</option>
                      <option value="3">3ème Trimestre</option>
                    </select>
                  </div>

                  <button
                    onClick={() => generateReleve()}
                    disabled={selectedStudentsForReleve.length === 0}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileSpreadsheet className="h-4 w-4 inline mr-2" />
                    Générer Relevé(s)
                  </button>
                </div>

                {/* Bulletin de classe */}
                <div
                  className={`p-6 border rounded-lg ${
                    isDarkMode ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <Award className="h-8 w-8 text-orange-600 mr-3" />
                    <div>
                      <h3 className="font-bold">Bulletin de Classe</h3>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Toutes les matières
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <select
                      className={`w-full px-3 py-2 border rounded-lg ${inputClasses}`}
                      value={selectedTrimestreForClasse}
                      onChange={(e) =>
                        setSelectedTrimestreForClasse(e.target.value)
                      }
                    >
                      <option value="1">1er Trimestre</option>
                      <option value="2">2ème Trimestre</option>
                      <option value="3">3ème Trimestre</option>
                      <option value="annuel">Bulletin Annuel</option>
                    </select>

                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Inclure les observations</span>
                    </label>
                  </div>

                  <button
                    onClick={() => generateBulletinClasse()}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <TrendingUp className="h-4 w-4 inline mr-2" />
                    Générer Bulletin
                  </button>
                </div>
              </div>

              {/* Statistiques de classe */}
              {selectedClasse && selectedSalle && (
                <div
                  className={`mt-8 p-6 border rounded-lg ${
                    isDarkMode ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <h3 className="text-lg font-bold mb-4">
                    Statistiques de Classe - {selectedClasse} ({selectedSalle})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                      className={`p-4 rounded-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            Moyenne de Classe
                          </p>
                          <p className="text-2xl font-bold text-blue-600">
                            {activeStudents.length > 0
                              ? (
                                  activeStudents.reduce(
                                    (acc, student) =>
                                      acc +
                                      calculateMoyenneGeneraleAnnuelle(
                                        student.id,
                                        [1, 2, 3]
                                      ),
                                    0
                                  ) / activeStudents.length
                                ).toFixed(2)
                              : "0.00"}
                            /10
                          </p>
                        </div>
                        <Calculator className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-green-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            Élèves en Réussite
                          </p>
                          <p className="text-2xl font-bold text-green-600">
                            {
                              activeStudents.filter(
                                (student) =>
                                  calculateMoyenneGeneraleAnnuelle(
                                    student.id,
                                    [1, 2, 3]
                                  ) >= 5.5
                              ).length
                            }
                            /{activeStudents.length}
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-600" />
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-red-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            Notes Saisies
                          </p>
                          <p className="text-2xl font-bold text-red-600">
                            {
                              notes.filter((note) =>
                                activeStudents.some(
                                  (s) => s.id === note.studentId
                                )
                              ).length
                            }
                          </p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-red-600" />
                      </div>
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

export default NotesPage;
