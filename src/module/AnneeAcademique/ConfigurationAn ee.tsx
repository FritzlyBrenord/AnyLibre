import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Minus,
  Calendar,
  GraduationCap,
  Users,
  BookOpen,
  Clock,
  Save,
  Trash2,
  Edit3,
  Search,
  Printer,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
  teacher?: Teacher;
}

interface Class {
  id: string;
  name: string;
  maxStudents: number;
  subjects: Subject[];
  schedule: ScheduleItem[];
}

interface Level {
  id: string;
  name: string;
  classes: Class[];
}

interface ScheduleItem {
  id: string;
  day: "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi";
  startTime: string;
  endTime: string;
  subject: string;
  teacherName?: string;
}

interface Teacher {
  id: string;
  name: string;
}

interface NewYearModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingYears: string[];
  isDarkMode: boolean;
  // new props for edit/create support and persistence
  mode?: "create" | "edit";
  initialConfig?: {
    year: string;
    description?: string;
    levels: Level[];
  };
  onSave?: (config: {
    year: string;
    description?: string;
    levels: Level[];
  }) => void;
  onDelete?: (year: string) => void;
}

const NewYearModal: React.FC<NewYearModalProps> = ({
  isOpen,
  onClose,
  existingYears,
  isDarkMode,
  mode = "create",
  initialConfig,
  onSave,
  onDelete,
}) => {
  const [step, setStep] = useState(1);
  const [yearInput, setYearInput] = useState("");
  const [description, setDescription] = useState("");
  const [levels, setLevels] = useState<Level[]>([]);
  const [error, setError] = useState("");
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [showScheduleConfig, setShowScheduleConfig] = useState(false);
  const [selectedClassForSchedule, setSelectedClassForSchedule] = useState<
    string | null
  >(null);
  const [showRecap, setShowRecap] = useState(false);

  // Initialize from initialConfig when provided (edit mode or resume)
  useEffect(() => {
    if (initialConfig) {
      setYearInput(initialConfig.year || "");
      setDescription(initialConfig.description || "");
      setLevels(initialConfig.levels || []);
    }
  }, [initialConfig]);

  const availableLevels = [
    "1ère Année Fondamentale",
    "2e Année Fondamentale",
    "3e Année Fondamentale",
    "4e Année Fondamentale",
    "5e Année Fondamentale",
    "6e Année Fondamentale",
    "7e Année Fondamentale",
    "8e Année Fondamentale",
    "9e Année Fondamentale",
    "NSI",
    "NSII",
    "NSIII",
    "NSIV",
  ];

  const availableSubjects = [
    "Français",
    "Mathématiques",
    "Sciences",
    "Histoire",
    "Géographie",
    "Anglais",
    "Éducation Physique",
    "Arts",
    "Musique",
    "Informatique",
    "Philosophie",
    "Physique",
    "Chimie",
    "Biologie",
    "Économie",
  ];

  const availableTeachers: Teacher[] = [
    { id: "t1", name: "Mme Claire Rousseau" },
    { id: "t2", name: "M. Jean Martin" },
    { id: "t3", name: "Mme Sophie Bernard" },
    { id: "t4", name: "M. Paul Legrand" },
  ];

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

  useEffect(() => {
    if (existingYears.length > 0 && !yearInput) {
      const latestYear = existingYears.sort().reverse()[0];
      const [startYear] = latestYear.split("-");
      const nextStartYear = parseInt(startYear) + 1;
      setYearInput(`${nextStartYear}-${nextStartYear + 1}`);
    }
  }, [existingYears, yearInput]);

  const validateYear = (year: string) => {
    const yearPattern = /^\d{4}-\d{4}$/;
    if (!yearPattern.test(year)) {
      return "Format invalide. Utilisez le format YYYY-YYYY";
    }

    const [startYear, endYear] = year.split("-").map(Number);
    if (endYear !== startYear + 1) {
      return "L'année de fin doit être exactement 1 an après l'année de début";
    }

    if (existingYears.includes(year)) {
      return "Cette année scolaire existe déjà";
    }

    return "";
  };

  const handleYearChange = (value: string) => {
    setYearInput(value);
    setError(validateYear(value));
  };

  // Persistence helpers
  const emitSave = (closeAfter = true) => {
    if (onSave) {
      onSave({ year: yearInput, description, levels });
    }
    if (closeAfter) onClose();
  };

  // Save current step progress
  const saveCurrentStep = () => {
    if (onSave) {
      onSave({ year: yearInput, description, levels });
    }
  };

  const addLevel = (levelName: string) => {
    const newLevel: Level = {
      id: Date.now().toString(),
      name: levelName,
      classes: [],
    };
    setLevels([...levels, newLevel]);
  };

  const addClass = (
    levelId: string,
    className: string,
    maxStudents: number
  ) => {
    const existingClass = levels
      .find((l) => l.id === levelId)
      ?.classes.find((c) => c.name.toLowerCase() === className.toLowerCase());

    if (existingClass) {
      setError("Une classe avec ce nom existe déjà dans ce niveau");
      return;
    }

    const newClass: Class = {
      id: Date.now().toString(),
      name: className,
      maxStudents,
      subjects: [],
      schedule: [],
    };

    setLevels(
      levels.map((level) =>
        level.id === levelId
          ? { ...level, classes: [...level.classes, newClass] }
          : level
      )
    );
    setError("");
  };

  const addSubjectToClass = (
    levelId: string,
    classId: string,
    subjectName: string
  ) => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: subjectName,
    };

    setLevels(
      levels.map((level) =>
        level.id === levelId
          ? {
              ...level,
              classes: level.classes.map((cls) =>
                cls.id === classId
                  ? { ...cls, subjects: [...cls.subjects, newSubject] }
                  : cls
              ),
            }
          : level
      )
    );
  };

  const addScheduleItem = (classId: string, scheduleItem: ScheduleItem) => {
    setLevels(
      levels.map((level) => ({
        ...level,
        classes: level.classes.map((cls) =>
          cls.id === classId
            ? { ...cls, schedule: [...cls.schedule, scheduleItem] }
            : cls
        ),
      }))
    );
  };

  const removeLevel = (levelId: string) => {
    setLevels(levels.filter((level) => level.id !== levelId));
  };

  const removeClass = (levelId: string, classId: string) => {
    setLevels(
      levels.map((level) =>
        level.id === levelId
          ? {
              ...level,
              classes: level.classes.filter((cls) => cls.id !== classId),
            }
          : level
      )
    );
  };

  const removeSubject = (
    levelId: string,
    classId: string,
    subjectId: string
  ) => {
    setLevels(
      levels.map((level) =>
        level.id === levelId
          ? {
              ...level,
              classes: level.classes.map((cls) =>
                cls.id === classId
                  ? {
                      ...cls,
                      subjects: cls.subjects.filter((s) => s.id !== subjectId),
                    }
                  : cls
              ),
            }
          : level
      )
    );
  };

  const removeScheduleItem = (classId: string, scheduleId: string) => {
    setLevels(
      levels.map((level) => ({
        ...level,
        classes: level.classes.map((cls) =>
          cls.id === classId
            ? {
                ...cls,
                schedule: cls.schedule.filter((s) => s.id !== scheduleId),
              }
            : cls
        ),
      }))
    );
  };

  // Fonction pour générer le contenu d'impression des classes et matières
  const generateClassesPrintContent = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Configuration Classes et Matières</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .school-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .school-info { font-size: 14px; color: #666; }
          .level { margin-bottom: 30px; }
          .level-title { font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .class { margin-bottom: 20px; margin-left: 20px; }
          .class-title { font-size: 16px; font-weight: bold; color: #059669; margin-bottom: 10px; }
          .class-info { font-size: 14px; color: #666; margin-bottom: 10px; }
          .subjects { margin-left: 20px; }
          .subject { display: inline-block; background: #f3f4f6; padding: 5px 10px; margin: 2px; border-radius: 15px; font-size: 12px; }
          .summary { margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px; }
          .summary-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; }
          .summary-item { margin-bottom: 8px; }
          @media print { body { margin: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">ÉTABLISSEMENT SCOLAIRE</div>
          <div class="school-info">123 Rue de l'Éducation, Ville, Téléphone: +123 456 789</div>
          <div class="school-info">Configuration des Classes et Matières</div>
        </div>
        
        <div class="content">
          ${levels
            .map(
              (level: Level) => `
            <div class="level">
              <div class="level-title">${level.name}</div>
              ${level.classes
                .map(
                  (cls: Class) => `
                <div class="class">
                  <div class="class-title">${cls.name}</div>
                  <div class="class-info">Nombre maximum d'élèves: ${
                    cls.maxStudents
                  }</div>
                  <div class="subjects">
                    <strong>Matières (${cls.subjects.length}):</strong><br>
                    ${cls.subjects
                      .map(
                        (subject: Subject) =>
                          `<span class="subject">${subject.name}</span>`
                      )
                      .join(" ")}
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          `
            )
            .join("")}
        </div>
        
        <div class="summary">
          <div class="summary-title">Récapitulatif</div>
          <div class="summary-item">Total des niveaux: ${levels.length}</div>
          <div class="summary-item">Total des classes: ${levels.reduce(
            (acc: number, level: Level) => acc + level.classes.length,
            0
          )}</div>
          <div class="summary-item">Total des matières: ${levels.reduce(
            (acc: number, level: Level) =>
              acc +
              level.classes.reduce(
                (acc2: number, cls: Class) => acc2 + cls.subjects.length,
                0
              ),
            0
          )}</div>
        </div>
      </body>
      </html>
    `;
  };

  // Fonction pour générer le contenu d'impression de l'emploi du temps complet
  const generateSchedulePrintContent = () => {
    let printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Emplois du Temps Complets</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .school-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .school-info { font-size: 14px; color: #666; }
          .level { margin-bottom: 30px; }
          .level-title { font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .class { margin-bottom: 20px; margin-left: 20px; }
          .class-title { font-size: 16px; font-weight: bold; color: #059669; margin-bottom: 10px; }
          .class-info { font-size: 14px; color: #666; margin-bottom: 10px; }
          .subjects { margin-left: 20px; }
          .subject { display: inline-block; background: #f3f4f6; padding: 5px 10px; margin: 2px; border-radius: 15px; font-size: 12px; }
          .schedule-item { margin-bottom: 10px; padding: 8px; background: #f9fafb; border-radius: 5px; }
          .schedule-item-header { font-weight: bold; margin-bottom: 5px; }
          .schedule-item-time { font-size: 14px; color: #555; }
          .schedule-item-subject { font-size: 14px; color: #333; }
          .schedule-item-teacher { font-size: 14px; color: #666; }
          .schedule-item-day { font-size: 14px; color: #444; }
          @media print { body { margin: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">ÉTABLISSEMENT SCOLAIRE</div>
          <div class="school-info">123 Rue de l'Éducation, Ville, Téléphone: +123 456 789</div>
          <div class="school-info">Emplois du Temps Complets</div>
        </div>
        
        <div class="content">
          ${levels
            .map(
              (level: Level) => `
            <div class="level">
              <div class="level-title">${level.name}</div>
              ${level.classes
                .map(
                  (cls: Class) => `
                <div class="class">
                  <div class="class-title">${cls.name}</div>
                  <div class="class-info">Nombre maximum d'élèves: ${
                    cls.maxStudents
                  }</div>
                  <div class="subjects">
                    <strong>Matières (${cls.subjects.length}):</strong><br>
                    ${cls.subjects
                      .map(
                        (subject: Subject) =>
                          `<span class="subject">${subject.name}</span>`
                      )
                      .join(" ")}
                  </div>
                  <div class="schedule-item-header">Emplois du temps - ${
                    cls.name
                  }</div>
                  ${days
                    .map(
                      (day: string) => `
                    <div class="schedule-item-day">${day}</div>
                    ${cls.schedule
                      .filter((item: ScheduleItem) => item.day === day)
                      .map(
                        (item: ScheduleItem) => `
                        <div class="schedule-item">
                          <div class="schedule-item-time">${item.startTime} - ${
                          item.endTime
                        }</div>
                          <div class="schedule-item-subject">${
                            item.subject
                          }</div>
                          <div class="schedule-item-teacher">${
                            item.teacherName || "Aucun professeur"
                          }</div>
                        </div>
                      `
                      )
                      .join("")}
                  `
                    )
                    .join("")}
                </div>
              `
                )
                .join("")}
            </div>
          `
            )
            .join("")}
        </div>
        
        <div class="summary">
          <div class="summary-title">Récapitulatif</div>
          <div class="summary-item">Total des niveaux: ${levels.length}</div>
          <div class="summary-item">Total des classes: ${levels.reduce(
            (acc: number, level: Level) => acc + level.classes.length,
            0
          )}</div>
          <div class="summary-item">Total des matières: ${levels.reduce(
            (acc: number, level: Level) =>
              acc +
              level.classes.reduce(
                (acc2: number, cls: Class) => acc2 + cls.subjects.length,
                0
              ),
            0
          )}</div>
        </div>
      </body>
      </html>
    `;
    return printContent;
  };

  // Fonction pour générer le contenu d'impression d'un emploi du temps individuel
  const generateClassSchedulePrintContent = (cls: Class, levelName: string) => {
    let printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Emploi du temps - ${cls.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .school-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .school-info { font-size: 14px; color: #666; }
          .level { margin-bottom: 30px; }
          .level-title { font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .class { margin-bottom: 20px; margin-left: 20px; }
          .class-title { font-size: 16px; font-weight: bold; color: #059669; margin-bottom: 10px; }
          .class-info { font-size: 14px; color: #666; margin-bottom: 10px; }
          .subjects { margin-left: 20px; }
          .subject { display: inline-block; background: #f3f4f6; padding: 5px 10px; margin: 2px; border-radius: 15px; font-size: 12px; }
          .schedule-item { margin-bottom: 10px; padding: 8px; background: #f9fafb; border-radius: 5px; }
          .schedule-item-header { font-weight: bold; margin-bottom: 5px; }
          .schedule-item-time { font-size: 14px; color: #555; }
          .schedule-item-subject { font-size: 14px; color: #333; }
          .schedule-item-teacher { font-size: 14px; color: #666; }
          .schedule-item-day { font-size: 14px; color: #444; }
          @media print { body { margin: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">ÉTABLISSEMENT SCOLAIRE</div>
          <div class="school-info">123 Rue de l'Éducation, Ville, Téléphone: +123 456 789</div>
          <div class="school-info">Emploi du temps - ${cls.name}</div>
        </div>
        
        <div class="content">
          <div class="level">
            <div class="level-title">${levelName}</div>
            <div class="class">
              <div class="class-title">${cls.name}</div>
              <div class="class-info">Nombre maximum d'élèves: ${
                cls.maxStudents
              }</div>
              <div class="subjects">
                <strong>Matières (${cls.subjects.length}):</strong><br>
                ${cls.subjects
                  .map(
                    (subject: Subject) =>
                      `<span class="subject">${subject.name}</span>`
                  )
                  .join(" ")}
              </div>
              <div class="schedule-item-header">Emplois du temps - ${
                cls.name
              }</div>
              ${days
                .map(
                  (day: string) => `
                <div class="schedule-item-day">${day}</div>
                ${cls.schedule
                  .filter((item: ScheduleItem) => item.day === day)
                  .map(
                    (item: ScheduleItem) => `
                    <div class="schedule-item">
                      <div class="schedule-item-time">${item.startTime} - ${
                      item.endTime
                    }</div>
                      <div class="schedule-item-subject">${item.subject}</div>
                      <div class="schedule-item-teacher">${
                        item.teacherName || "Aucun professeur"
                      }</div>
                    </div>
                  `
                  )
                  .join("")}
              `
                )
                .join("")}
            </div>
          </div>
        </div>
        
        <div class="summary">
          <div class="summary-title">Récapitulatif</div>
          <div class="summary-item">Total des matières: ${
            cls.subjects.length
          }</div>
        </div>
      </body>
      </html>
    `;
    return printContent;
  };

  // Fonction pour générer le contenu d'impression de la configuration complète
  const generateCompleteConfigPrintContent = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Configuration Complète - ${yearInput}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .school-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .school-info { font-size: 14px; color: #666; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .level { margin-bottom: 20px; }
          .level-title { font-size: 16px; font-weight: bold; color: #059669; margin-bottom: 10px; }
          .class { margin-bottom: 15px; margin-left: 20px; }
          .class-title { font-size: 14px; font-weight: bold; color: #7c3aed; margin-bottom: 5px; }
          .class-info { font-size: 12px; color: #666; margin-bottom: 5px; }
          .subjects { margin-left: 20px; }
          .subject { display: inline-block; background: #f3f4f6; padding: 3px 8px; margin: 1px; border-radius: 12px; font-size: 11px; }
          .schedule-item { margin-bottom: 8px; padding: 6px; background: #f9fafb; border-radius: 4px; font-size: 11px; }
          .schedule-item-time { font-weight: bold; color: #555; }
          .schedule-item-subject { color: #333; }
          .schedule-item-teacher { color: #666; font-style: italic; }
          .summary { margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px; }
          .summary-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; }
          .summary-item { margin-bottom: 8px; }
          @media print { body { margin: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">ÉTABLISSEMENT SCOLAIRE</div>
          <div class="school-info">123 Rue de l'Éducation, Ville, Téléphone: +123 456 789</div>
          <div class="school-info">Configuration Complète - Année ${yearInput}</div>
          ${description ? `<div class="school-info">${description}</div>` : ""}
        </div>
        
        <div class="content">
          <div class="section">
            <div class="section-title">Classes et Matières</div>
            ${levels
              .map(
                (level: Level) => `
              <div class="level">
                <div class="level-title">${level.name}</div>
                ${level.classes
                  .map(
                    (cls: Class) => `
                  <div class="class">
                    <div class="class-title">${cls.name}</div>
                    <div class="class-info">Nombre maximum d'élèves: ${
                      cls.maxStudents
                    }</div>
                    <div class="subjects">
                      <strong>Matières (${cls.subjects.length}):</strong><br>
                      ${cls.subjects
                        .map(
                          (subject: Subject) =>
                            `<span class="subject">${subject.name}</span>`
                        )
                        .join(" ")}
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            `
              )
              .join("")}
          </div>
          
          <div class="section">
            <div class="section-title">Emplois du Temps</div>
            ${levels
              .map(
                (level: Level) => `
              <div class="level">
                <div class="level-title">${level.name}</div>
                ${level.classes
                  .map(
                    (cls: Class) => `
                  <div class="class">
                    <div class="class-title">${cls.name}</div>
                    ${
                      cls.schedule.length > 0
                        ? `
                      ${days
                        .map(
                          (day: string) => `
                        <div class="schedule-item">
                          <strong>${day}:</strong><br>
                          ${cls.schedule
                            .filter((item: ScheduleItem) => item.day === day)
                            .map(
                              (item: ScheduleItem) => `
                              <div class="schedule-item">
                                <span class="schedule-item-time">${
                                  item.startTime
                                } - ${item.endTime}</span>
                                <span class="schedule-item-subject">${
                                  item.subject
                                }</span>
                                ${
                                  item.teacherName
                                    ? `<span class="schedule-item-teacher">• ${item.teacherName}</span>`
                                    : ""
                                }
                              </div>
                            `
                            )
                            .join("")}
                        </div>
                      `
                        )
                        .join("")}
                    `
                        : '<div class="class-info">Aucun emploi du temps configuré</div>'
                    }
                  </div>
                `
                  )
                  .join("")}
              </div>
            `
              )
              .join("")}
          </div>
        </div>
        
        <div class="summary">
          <div class="summary-title">Récapitulatif</div>
          <div class="summary-item">Total des niveaux: ${levels.length}</div>
          <div class="summary-item">Total des classes: ${levels.reduce(
            (acc: number, level: Level) => acc + level.classes.length,
            0
          )}</div>
          <div class="summary-item">Total des matières: ${levels.reduce(
            (acc: number, level: Level) =>
              acc +
              level.classes.reduce(
                (acc2: number, cls: Class) => acc2 + cls.subjects.length,
                0
              ),
            0
          )}</div>
          <div class="summary-item">Total des créneaux horaires: ${levels.reduce(
            (acc: number, level: Level) =>
              acc +
              level.classes.reduce(
                (acc2: number, cls: Class) => acc2 + cls.schedule.length,
                0
              ),
            0
          )}</div>
        </div>
      </body>
      </html>
    `;
  };

  const handleSave = () => {
    emitSave(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-50">
      <div
        className={`w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-blue-500" />
            <h2
              className={`text-xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {mode === "edit"
                ? `Configurer l'année ${yearInput || initialConfig?.year || ""}`
                : "Créer une Nouvelle Année Scolaire"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "text-gray-400 hover:text-white hover:bg-gray-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps indicator */}
        <div
          className={`px-6 py-4 border-b ${
            isDarkMode
              ? "border-gray-700 bg-gray-700/50"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum
                      ? "bg-blue-500 text-white"
                      : isDarkMode
                      ? "bg-gray-600 text-gray-400"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {stepNum}
                </div>
                <span
                  className={`ml-2 text-sm ${
                    step >= stepNum
                      ? "text-blue-500"
                      : isDarkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {stepNum === 1 && "Année scolaire"}
                  {stepNum === 2 && "Classes & Matières"}
                  {stepNum === 3 && "Emplois du temps"}
                </span>
                {stepNum < 3 && (
                  <div
                    className={`w-12 h-0.5 mx-4 ${
                      step > stepNum
                        ? "bg-blue-500"
                        : isDarkMode
                        ? "bg-gray-600"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Année scolaire *
                </label>
                <input
                  type="text"
                  value={yearInput}
                  onChange={(e) => handleYearChange(e.target.value)}
                  placeholder="2024-2025"
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                    error
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  } ${
                    isDarkMode
                      ? "bg-gray-700 text-white placeholder-gray-400"
                      : "bg-white text-gray-900 placeholder-gray-500"
                  }`}
                  disabled={mode === "edit"}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Description (optionnel)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Description de l'année scolaire..."
                  className={`w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 transition-colors resize-none ${
                    isDarkMode
                      ? "bg-gray-700 text-white placeholder-gray-400"
                      : "bg-white text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Organisation des Classes et Matières
                </h3>
                <div className="flex space-x-2">
                  <select
                    onChange={(e) => e.target.value && addLevel(e.target.value)}
                    value=""
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="">Ajouter un niveau</option>
                    {availableLevels
                      .filter((level) => !levels.some((l) => l.name === level))
                      .map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => {
                      // Print classes and subjects summary
                      const printWindow = window.open("", "_blank");
                      if (printWindow) {
                        const printContent = generateClassesPrintContent();
                        printWindow.document.write(printContent);
                        printWindow.document.close();
                        printWindow.print();
                      }
                    }}
                    className={`px-4 py-2 rounded-lg border flex items-center space-x-2 transition-colors ${
                      isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimer</span>
                  </button>
                </div>
              </div>

              {levels.map((level) => (
                <div
                  key={level.id}
                  className={`border rounded-lg p-4 ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() =>
                        setExpandedLevel(
                          expandedLevel === level.id ? null : level.id
                        )
                      }
                      className="flex items-center space-x-2"
                    >
                      {expandedLevel === level.id ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                      <GraduationCap className="w-5 h-5 text-blue-500" />
                      <h4
                        className={`font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {level.name}
                      </h4>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          isDarkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {level.classes.length} classe
                        {level.classes.length !== 1 ? "s" : ""}
                      </span>
                    </button>
                    <button
                      onClick={() => removeLevel(level.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {expandedLevel === level.id && (
                    <div className="space-y-4">
                      <AddClassForm
                        levelId={level.id}
                        onAddClass={addClass}
                        isDarkMode={isDarkMode}
                      />

                      {level.classes.map((cls) => (
                        <div
                          key={cls.id}
                          className={`border rounded-lg p-4 ${
                            isDarkMode
                              ? "border-gray-600 bg-gray-700/50"
                              : "border-gray-300 bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <button
                              onClick={() =>
                                setExpandedClass(
                                  expandedClass === cls.id ? null : cls.id
                                )
                              }
                              className="flex items-center space-x-2"
                            >
                              {expandedClass === cls.id ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                              <Users className="w-4 h-4 text-green-500" />
                              <span
                                className={`font-medium ${
                                  isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {cls.name}
                              </span>
                              <span
                                className={`text-sm px-2 py-1 rounded-full ${
                                  isDarkMode
                                    ? "bg-gray-600 text-gray-300"
                                    : "bg-gray-200 text-gray-600"
                                }`}
                              >
                                Max: {cls.maxStudents} élèves
                              </span>
                            </button>
                            <button
                              onClick={() => removeClass(level.id, cls.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {expandedClass === cls.id && (
                            <div className="space-y-3">
                              <div>
                                <h5
                                  className={`text-sm font-medium mb-2 ${
                                    isDarkMode
                                      ? "text-gray-300"
                                      : "text-gray-700"
                                  }`}
                                >
                                  Matières ({cls.subjects.length})
                                </h5>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {cls.subjects.map((subject) => (
                                    <span
                                      key={subject.id}
                                      className={`px-3 py-1 rounded-full text-sm flex items-center space-x-2 ${
                                        isDarkMode
                                          ? "bg-blue-900/30 text-blue-300"
                                          : "bg-blue-100 text-blue-700"
                                      }`}
                                    >
                                      <BookOpen className="w-3 h-3" />
                                      <span>{subject.name}</span>
                                      <button
                                        onClick={() =>
                                          removeSubject(
                                            level.id,
                                            cls.id,
                                            subject.id
                                          )
                                        }
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                                <AddSubjectForm
                                  levelId={level.id}
                                  classId={cls.id}
                                  availableSubjects={availableSubjects}
                                  onAddSubject={addSubjectToClass}
                                  isDarkMode={isDarkMode}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Emplois du Temps
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      // Print all schedules
                      const printWindow = window.open("", "_blank");
                      if (printWindow) {
                        const printContent = generateSchedulePrintContent();
                        printWindow.document.write(printContent);
                        printWindow.document.close();
                        printWindow.print();
                      }
                    }}
                    className={`px-4 py-2 rounded-lg border flex items-center space-x-2 transition-colors ${
                      isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimer tout</span>
                  </button>
                </div>
              </div>

              {levels.map((level) => (
                <div
                  key={level.id}
                  className={`border rounded-lg p-4 ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <h4
                    className={`font-semibold mb-4 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {level.name}
                  </h4>

                  {level.classes.map((cls) => (
                    <div
                      key={cls.id}
                      className={`border rounded-lg p-4 mb-4 ${
                        isDarkMode
                          ? "border-gray-600 bg-gray-700/30"
                          : "border-gray-300 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5
                          className={`font-medium ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {cls.name}
                        </h5>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedClassForSchedule(cls.id);
                              setShowScheduleConfig(true);
                            }}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                          >
                            Configurer
                          </button>
                          <button
                            onClick={() => {
                              // Print individual class schedule
                              const printWindow = window.open("", "_blank");
                              if (printWindow) {
                                const printContent =
                                  generateClassSchedulePrintContent(
                                    cls,
                                    level.name
                                  );
                                printWindow.document.write(printContent);
                                printWindow.document.close();
                                printWindow.print();
                              }
                            }}
                            className={`px-3 py-1 rounded-lg text-sm border transition-colors ${
                              isDarkMode
                                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <Printer className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {cls.schedule.length > 0 ? (
                        <div className="grid grid-cols-5 gap-2">
                          {days.map((day) => (
                            <div
                              key={day}
                              className={`p-2 rounded border ${
                                isDarkMode
                                  ? "border-gray-600"
                                  : "border-gray-300"
                              }`}
                            >
                              <h6
                                className={`text-xs font-medium mb-2 ${
                                  isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {day}
                              </h6>
                              {cls.schedule
                                .filter((item) => item.day === day)
                                .map((item) => (
                                  <div
                                    key={item.id}
                                    className={`p-1 rounded text-xs mb-1 ${
                                      isDarkMode
                                        ? "bg-blue-900/30 text-blue-300"
                                        : "bg-blue-100 text-blue-700"
                                    }`}
                                  >
                                    <div>
                                      {item.startTime}-{item.endTime}
                                    </div>
                                    <div className="font-medium">
                                      {item.subject}
                                      {item.teacherName
                                        ? ` • ${item.teacherName}`
                                        : ""}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Aucun emploi du temps configuré
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {showScheduleConfig && selectedClassForSchedule && (
                <ScheduleConfigModal
                  classId={selectedClassForSchedule}
                  className={
                    levels
                      .flatMap((l) => l.classes)
                      .find((c) => c.id === selectedClassForSchedule)?.name ||
                    ""
                  }
                  subjects={
                    levels
                      .flatMap((l) => l.classes)
                      .find((c) => c.id === selectedClassForSchedule)
                      ?.subjects || []
                  }
                  teachers={availableTeachers}
                  onClose={() => {
                    setShowScheduleConfig(false);
                    setSelectedClassForSchedule(null);
                  }}
                  onAddSchedule={addScheduleItem}
                  isDarkMode={isDarkMode}
                />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-between p-6 border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className={`px-4 py-2 rounded-lg transition-colors ${
              step === 1
                ? "text-gray-400 cursor-not-allowed"
                : isDarkMode
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Précédent
          </button>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                isDarkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Annuler
            </button>

            {step < 3 ? (
              <div className="flex space-x-2">
                <button
                  onClick={saveCurrentStep}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Sauvegarder
                </button>
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && (error || !yearInput)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    step === 1 && (error || !yearInput)
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Suivant
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowRecap(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Voir récapitulatif</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de récapitulatif */}
      {showRecap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div
            className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between p-6 border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-green-500" />
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Récapitulatif de la Configuration
                </h2>
              </div>
              <button
                onClick={() => setShowRecap(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Informations générales */}
                <div
                  className={`p-4 rounded-lg border ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-700/50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-3 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Informations Générales
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Année scolaire:
                      </span>
                      <p
                        className={`text-lg font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {yearInput}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Description:
                      </span>
                      <p
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {description || "Aucune description"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Statistiques */}
                <div
                  className={`p-4 rounded-lg border ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-700/50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-3 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Statistiques
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold text-blue-500 ${
                          isDarkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      >
                        {levels.length}
                      </div>
                      <div
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Niveaux
                      </div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold text-green-500 ${
                          isDarkMode ? "text-green-400" : "text-green-600"
                        }`}
                      >
                        {levels.reduce(
                          (acc, level) => acc + level.classes.length,
                          0
                        )}
                      </div>
                      <div
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Classes
                      </div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold text-purple-500 ${
                          isDarkMode ? "text-purple-400" : "text-purple-600"
                        }`}
                      >
                        {levels.reduce(
                          (acc, level) =>
                            acc +
                            level.classes.reduce(
                              (acc2, cls) => acc2 + cls.subjects.length,
                              0
                            ),
                          0
                        )}
                      </div>
                      <div
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Matières
                      </div>
                    </div>
                  </div>
                </div>

                {/* Détails par niveau */}
                {levels.map((level) => (
                  <div
                    key={level.id}
                    className={`border rounded-lg p-4 ${
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <h4
                      className={`font-semibold mb-3 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {level.name}
                    </h4>
                    <div className="space-y-3">
                      {level.classes.map((cls) => (
                        <div
                          key={cls.id}
                          className={`p-3 rounded-lg ${
                            isDarkMode ? "bg-gray-700/30" : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5
                              className={`font-medium ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {cls.name}
                            </h5>
                            <span
                              className={`text-sm px-2 py-1 rounded-full ${
                                isDarkMode
                                  ? "bg-gray-600 text-gray-300"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {cls.maxStudents} élèves max
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {cls.subjects.map((subject) => (
                              <span
                                key={subject.id}
                                className={`px-2 py-1 rounded-full text-xs ${
                                  isDarkMode
                                    ? "bg-blue-900/30 text-blue-300"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {subject.name}
                              </span>
                            ))}
                          </div>
                          {cls.schedule.length > 0 && (
                            <div className="mt-2 text-xs text-gray-500">
                              {cls.schedule.length} créneaux horaires configurés
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              className={`flex items-center justify-between p-6 border-t ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <button
                onClick={() => setShowRecap(false)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Retour
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    // Print complete configuration
                    const printWindow = window.open("", "_blank");
                    if (printWindow) {
                      const printContent = generateCompleteConfigPrintContent();
                      printWindow.document.write(printContent);
                      printWindow.document.close();
                      printWindow.print();
                    }
                  }}
                  className={`px-4 py-2 rounded-lg border flex items-center space-x-2 transition-colors ${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer</span>
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Créer l'année</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant pour ajouter une classe
const AddClassForm: React.FC<{
  levelId: string;
  onAddClass: (levelId: string, className: string, maxStudents: number) => void;
  isDarkMode: boolean;
}> = ({ levelId, onAddClass, isDarkMode }) => {
  const [className, setClassName] = useState("");
  const [maxStudents, setMaxStudents] = useState(30);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (className.trim()) {
      onAddClass(levelId, className.trim(), maxStudents);
      setClassName("");
      setMaxStudents(30);
      setShowForm(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className={`w-full p-3 border-2 border-dashed rounded-lg transition-colors flex items-center justify-center space-x-2 ${
          isDarkMode
            ? "border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300"
            : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"
        }`}
      >
        <Plus className="w-4 h-4" />
        <span>Ajouter une classe</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Nom de la classe"
          className={`px-3 py-2 rounded-lg border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
          autoFocus
        />
        <input
          type="number"
          value={maxStudents}
          onChange={(e) => setMaxStudents(parseInt(e.target.value) || 30)}
          placeholder="Max élèves"
          min="1"
          max="100"
          className={`px-3 py-2 rounded-lg border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
        >
          Ajouter
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
            isDarkMode
              ? "text-gray-300 hover:bg-gray-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

// Composant pour ajouter une matière
const AddSubjectForm: React.FC<{
  levelId: string;
  classId: string;
  availableSubjects: string[];
  onAddSubject: (levelId: string, classId: string, subjectName: string) => void;
  isDarkMode: boolean;
}> = ({ levelId, classId, availableSubjects, onAddSubject, isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [customSubject, setCustomSubject] = useState("");

  const filteredSubjects = availableSubjects.filter((subject) =>
    subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubject = (subjectName: string) => {
    onAddSubject(levelId, classId, subjectName);
    setSearchTerm("");
    setCustomSubject("");
    setShowForm(false);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSubject.trim()) {
      handleAddSubject(customSubject.trim());
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className={`px-3 py-2 border border-dashed rounded-lg transition-colors flex items-center space-x-2 text-sm ${
          isDarkMode
            ? "border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300"
            : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"
        }`}
      >
        <Plus className="w-3 h-3" />
        <span>Ajouter matière</span>
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher une matière..."
          className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />
      </div>

      {searchTerm && (
        <div
          className={`max-h-32 overflow-y-auto border rounded-lg ${
            isDarkMode ? "border-gray-600" : "border-gray-300"
          }`}
        >
          {filteredSubjects.map((subject) => (
            <button
              key={subject}
              onClick={() => handleAddSubject(subject)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {subject}
            </button>
          ))}
          {filteredSubjects.length === 0 && (
            <div
              className={`px-3 py-2 text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Aucune matière trouvée
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleAddCustom} className="flex space-x-2">
        <input
          type="text"
          value={customSubject}
          onChange={(e) => setCustomSubject(e.target.value)}
          placeholder="Nouvelle matière..."
          className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />
        <button
          type="submit"
          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          Ajouter
        </button>
      </form>

      <button
        onClick={() => setShowForm(false)}
        className={`text-sm transition-colors ${
          isDarkMode
            ? "text-gray-400 hover:text-gray-300"
            : "text-gray-500 hover:text-gray-600"
        }`}
      >
        Annuler
      </button>
    </div>
  );
};

// Modal de configuration d'emploi du temps
const ScheduleConfigModal: React.FC<{
  classId: string;
  className: string;
  subjects: Subject[];
  teachers: Teacher[];
  onClose: () => void;
  onAddSchedule: (classId: string, scheduleItem: ScheduleItem) => void;
  isDarkMode: boolean;
}> = ({
  classId,
  className,
  subjects,
  teachers,
  onClose,
  onAddSchedule,
  isDarkMode,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>("Lundi");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTeacherName, setSelectedTeacherName] = useState<string>("");
  const [teacherSearch, setTeacherSearch] = useState("");
  const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubject && startTime && endTime) {
      const scheduleItem: ScheduleItem = {
        id: Date.now().toString(),
        day: selectedDay as any,
        startTime,
        endTime,
        subject: selectedSubject,
        teacherName: selectedTeacherName || undefined,
      };
      onAddSchedule(classId, scheduleItem);
      setStartTime("08:00");
      setEndTime("09:00");
      setSelectedSubject("");
      setSelectedTeacherName("");
      setTeacherSearch("");
    }
  };

  const selectTeacher = (teacher: Teacher) => {
    setSelectedTeacherName(teacher.name);
    setTeacherSearch(teacher.name);
    setShowTeacherDropdown(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-50">
      <div
        className={`w-full max-w-2xl rounded-xl shadow-2xl ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-blue-500" />
            <h3
              className={`text-lg font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Emploi du temps - {className}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "text-gray-400 hover:text-white hover:bg-gray-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Jour
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
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
                  Matière
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedSubject(value);
                    const subj = subjects.find((s) => s.name === value);
                    if (subj?.teacher?.name) {
                      setSelectedTeacherName(subj.teacher.name);
                      setTeacherSearch(subj.teacher.name);
                    } else {
                      setSelectedTeacherName("");
                      setTeacherSearch("");
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                >
                  <option value="">Sélectionner une matière</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.name}>
                      {subject.name}
                      {subject.teacher ? ` • ${subject.teacher.name}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Heure de début
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Heure de fin
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Professeur
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={teacherSearch}
                  onChange={(e) => {
                    setTeacherSearch(e.target.value);
                    setShowTeacherDropdown(true);
                  }}
                  onFocus={() => setShowTeacherDropdown(true)}
                  placeholder="Rechercher un professeur..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />

                {showTeacherDropdown && teacherSearch && (
                  <div
                    className={`absolute z-10 mt-1 w-full max-h-36 overflow-y-auto rounded border ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {filteredTeachers.map((teacher) => (
                      <button
                        key={teacher.id}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                        onClick={() => selectTeacher(teacher)}
                      >
                        {teacher.name}
                      </button>
                    ))}
                    {filteredTeachers.length === 0 && (
                      <div
                        className={`px-3 py-2 text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Aucun professeur trouvé
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Fermer
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter au planning</span>
              </button>
            </div>
          </form>

          {subjects.length === 0 && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                isDarkMode
                  ? "bg-yellow-900/20 border border-yellow-800"
                  : "bg-yellow-50 border border-yellow-200"
              }`}
            >
              <p
                className={`text-sm ${
                  isDarkMode ? "text-yellow-300" : "text-yellow-700"
                }`}
              >
                Aucune matière n'est configurée pour cette classe. Veuillez
                d'abord ajouter des matières à l'étape précédente.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewYearModal;
