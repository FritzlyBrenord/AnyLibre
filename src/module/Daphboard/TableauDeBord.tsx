import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Activity,
  User,
  CreditCard,
  UserX,
  UserCheck,
  Clock,
  CheckCircle,
  GraduationCap,
} from "lucide-react";
import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);
interface StatsCard {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  illustration: React.ReactNode;
  color: string;
}
interface Props {
  isDarkMode: boolean;
}

const TableauDeBord = ({ isDarkMode }: Props) => {
  // Illustrations SVG améliorées
  const StudentGirlIllustration = () => (
    <div className="relative">
      <svg width="64" height="64" viewBox="0 0 64 64" className="text-pink-500">
        <circle cx="32" cy="20" r="12" fill="currentColor" opacity="0.8" />
        <path
          d="M12 52c0-11 9-20 20-20s20 9 20 20"
          fill="currentColor"
          opacity="0.6"
        />
        <rect
          x="20"
          y="8"
          width="24"
          height="16"
          rx="4"
          fill="currentColor"
          opacity="0.9"
        />
        <circle cx="26" cy="16" r="2" fill="white" />
        <circle cx="38" cy="16" r="2" fill="white" />
        <path
          d="M28 20c2 2 6 2 8 0"
          stroke="white"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
        <span className="text-xs text-pink-600 dark:text-pink-300">♀</span>
      </div>
    </div>
  );

  const StudentBoyIllustration = () => (
    <div className="relative">
      <svg width="64" height="64" viewBox="0 0 64 64" className="text-blue-500">
        <circle cx="32" cy="20" r="12" fill="currentColor" opacity="0.8" />
        <path
          d="M12 52c0-11 9-20 20-20s20 9 20 20"
          fill="currentColor"
          opacity="0.6"
        />
        <rect
          x="20"
          y="8"
          width="24"
          height="16"
          rx="4"
          fill="currentColor"
          opacity="0.9"
        />
        <circle cx="26" cy="16" r="2" fill="white" />
        <circle cx="38" cy="16" r="2" fill="white" />
        <path
          d="M28 20c2 2 6 2 8 0"
          stroke="white"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
        <span className="text-xs text-blue-600 dark:text-blue-300">♂</span>
      </div>
    </div>
  );

  const TeacherIllustration = () => (
    <div className="relative">
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        className="text-purple-500"
      >
        <circle cx="32" cy="20" r="12" fill="currentColor" opacity="0.8" />
        <path
          d="M12 52c0-11 9-20 20-20s20 9 20 20"
          fill="currentColor"
          opacity="0.6"
        />
        <path d="M16 16l16-8 16 8-4 2v8l-12 6-12-6v-8z" fill="currentColor" />
        <rect x="44" y="16" width="4" height="12" fill="currentColor" />
        <circle cx="46" cy="30" r="2" fill="currentColor" />
      </svg>
      <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
        <span className="text-xs text-purple-600 dark:text-purple-300">🎓</span>
      </div>
    </div>
  );

  const EmployeeIllustration = () => (
    <div className="relative">
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        className="text-green-500"
      >
        <circle cx="32" cy="20" r="12" fill="currentColor" opacity="0.8" />
        <path
          d="M12 52c0-11 9-20 20-20s20 9 20 20"
          fill="currentColor"
          opacity="0.6"
        />
        <rect
          x="20"
          y="25"
          width="24"
          height="16"
          rx="2"
          fill="currentColor"
          opacity="0.9"
        />
        <rect
          x="28"
          y="20"
          width="8"
          height="6"
          fill="currentColor"
          opacity="0.7"
        />
        <circle cx="32" cy="33" r="2" fill="white" />
      </svg>
      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
        <span className="text-xs text-green-600 dark:text-green-300">💼</span>
      </div>
    </div>
  );

  const statsCards: StatsCard[] = [
    {
      title: "Élèves Filles",
      value: "634",
      change: "+3.2%",
      changeType: "increase",
      illustration: <StudentGirlIllustration />,
      color: "pink",
    },
    {
      title: "Élèves Garçons",
      value: "600",
      change: "+2.1%",
      changeType: "increase",
      illustration: <StudentBoyIllustration />,
      color: "blue",
    },
    {
      title: "Professeurs",
      value: "89",
      change: "+2.1%",
      changeType: "increase",
      illustration: <TeacherIllustration />,
      color: "purple",
    },
    {
      title: "Employés",
      value: "42",
      change: "-1.5%",
      changeType: "decrease",
      illustration: <EmployeeIllustration />,
      color: "green",
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      pink: "bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/10 dark:to-pink-800/20 border-pink-200 dark:border-pink-800",
      blue: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-800/20 border-blue-200 dark:border-blue-800",
      purple:
        "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/10 dark:to-purple-800/20 border-purple-200 dark:border-purple-800",
      green:
        "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-800/20 border-green-200 dark:border-green-800",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  // Données pour les graphiques avec couleurs améliorées
  const subjectsByClassData = {
    labels: ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Term"],
    datasets: [
      {
        label: "Mathématiques",
        data: [245, 238, 232, 219, 203, 195, 189],
        backgroundColor: isDarkMode
          ? "rgba(59, 130, 246, 0.8)"
          : "rgba(37, 99, 235, 0.8)",
        borderColor: isDarkMode
          ? "rgba(59, 130, 246, 1)"
          : "rgba(37, 99, 235, 1)",
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: "Français",
        data: [245, 238, 232, 219, 203, 195, 189],
        backgroundColor: isDarkMode
          ? "rgba(34, 197, 94, 0.8)"
          : "rgba(22, 163, 74, 0.8)",
        borderColor: isDarkMode
          ? "rgba(34, 197, 94, 1)"
          : "rgba(22, 163, 74, 1)",
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: "Anglais",
        data: [245, 238, 232, 219, 203, 195, 189],
        backgroundColor: isDarkMode
          ? "rgba(251, 191, 36, 0.8)"
          : "rgba(245, 158, 11, 0.8)",
        borderColor: isDarkMode
          ? "rgba(251, 191, 36, 1)"
          : "rgba(245, 158, 11, 1)",
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: "Sciences",
        data: [0, 0, 232, 219, 203, 195, 189],
        backgroundColor: isDarkMode
          ? "rgba(147, 51, 234, 0.8)"
          : "rgba(126, 34, 206, 0.8)",
        borderColor: isDarkMode
          ? "rgba(147, 51, 234, 1)"
          : "rgba(126, 34, 206, 1)",
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const enrollmentByYearData = {
    labels: ["2020-2021", "2021-2022", "2022-2023", "2023-2024", "2024-2025"],
    datasets: [
      {
        label: "Élèves Filles",
        data: [580, 595, 610, 625, 634],
        backgroundColor: isDarkMode
          ? "rgba(236, 72, 153, 0.8)"
          : "rgba(219, 39, 119, 0.8)",
        borderColor: isDarkMode
          ? "rgba(236, 72, 153, 1)"
          : "rgba(219, 39, 119, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: "Élèves Garçons",
        data: [570, 580, 590, 595, 600],
        backgroundColor: isDarkMode
          ? "rgba(59, 130, 246, 0.8)"
          : "rgba(37, 99, 235, 0.8)",
        borderColor: isDarkMode
          ? "rgba(59, 130, 246, 1)"
          : "rgba(37, 99, 235, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const genderDistributionData = {
    labels: ["Filles", "Garçons"],
    datasets: [
      {
        data: [634, 600],
        backgroundColor: [
          isDarkMode ? "rgba(236, 72, 153, 0.8)" : "rgba(219, 39, 119, 0.8)",
          isDarkMode ? "rgba(59, 130, 246, 0.8)" : "rgba(37, 99, 235, 0.8)",
        ],
        borderColor: [
          isDarkMode ? "rgba(236, 72, 153, 1)" : "rgba(219, 39, 119, 1)",
          isDarkMode ? "rgba(59, 130, 246, 1)" : "rgba(37, 99, 235, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          color: isDarkMode ? "#f3f4f6" : "#374151",
          padding: 15,
          usePointStyle: true,
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode
            ? "rgba(75, 85, 99, 0.4)"
            : "rgba(229, 231, 235, 0.8)",
        },
        ticks: {
          color: isDarkMode ? "#d1d5db" : "#6b7280",
        },
      },
      x: {
        grid: {
          color: isDarkMode
            ? "rgba(75, 85, 99, 0.4)"
            : "rgba(229, 231, 235, 0.8)",
        },
        ticks: {
          color: isDarkMode ? "#d1d5db" : "#6b7280",
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: isDarkMode ? "#f3f4f6" : "#374151",
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };
  return (
    <div>
      {" "}
      <div className="p-6 space-y-6">
        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <div
              key={index}
              className={`${getColorClasses(
                card.color
              )} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium mb-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {card.title}
                  </p>
                  <p
                    className={`text-3xl font-bold mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {card.value}
                  </p>
                  <div className="flex items-center">
                    {card.changeType === "increase" ? (
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        card.changeType === "increase"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {card.change}
                    </span>
                    <span
                      className={`text-sm ml-2 ${
                        isDarkMode ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      vs mois dernier
                    </span>
                  </div>
                </div>
                <div className="ml-4 transform hover:scale-110 transition-transform duration-200">
                  {card.illustration}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graphique des matières par classe */}
          <div
            className={`rounded-xl p-6 shadow-lg border lg:col-span-2 ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Matières par Classe
              </h3>
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div className="h-80">
              <Bar data={subjectsByClassData} options={chartOptions} />
            </div>
          </div>

          {/* Graphique de répartition par sexe */}
          <div
            className={`rounded-xl p-6 shadow-lg border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Répartition Élèves
              </h3>
              <Users className="w-5 h-5 text-pink-500" />
            </div>
            <div className="h-64">
              <Doughnut
                data={genderDistributionData}
                options={doughnutOptions}
              />
            </div>
            <div className="mt-4 text-center">
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total:{" "}
                <span
                  className={`font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  1,234 élèves
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Graphique inscription par année */}
        <div
          className={`rounded-xl p-6 shadow-lg border ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Évolution des Inscriptions par Année Scolaire
            </h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="h-80">
            <Bar data={enrollmentByYearData} options={chartOptions} />
          </div>
          <div className="mt-4 flex justify-center space-x-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-pink-500 rounded-full mr-2"></div>
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Filles: 634 (+1.4%)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Garçons: 600 (+0.8%)
              </span>
            </div>
          </div>
        </div>

        {/* Section statistiques détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Répartition par niveau */}
          <div
            className={`rounded-xl p-6 shadow-lg border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Répartition par Niveau
            </h3>
            <div className="space-y-4">
              {[
                { level: "6ème", students: 245, color: "bg-blue-500" },
                { level: "5ème", students: 238, color: "bg-green-500" },
                { level: "4ème", students: 232, color: "bg-yellow-500" },
                { level: "3ème", students: 219, color: "bg-purple-500" },
                { level: "2nde", students: 203, color: "bg-pink-500" },
                { level: "1ère", students: 195, color: "bg-indigo-500" },
                { level: "Term", students: 189, color: "bg-red-500" },
              ].map((item) => (
                <div
                  key={item.level}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                    <span
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {item.level}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {item.students} élèves
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance du personnel */}
          <div
            className={`rounded-xl p-6 shadow-lg border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Performance du Personnel
            </h3>
            <div className="space-y-4">
              {[
                {
                  category: "Professeurs présents",
                  value: 87,
                  total: 89,
                  percentage: 98,
                  color: "text-green-600",
                },
                {
                  category: "Employés présents",
                  value: 40,
                  total: 42,
                  percentage: 95,
                  color: "text-blue-600",
                },
                {
                  category: "Cours assurés",
                  value: 142,
                  total: 145,
                  percentage: 98,
                  color: "text-purple-600",
                },
                {
                  category: "Satisfaction élèves",
                  value: 91,
                  total: 100,
                  percentage: 91,
                  color: "text-amber-600",
                },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {item.category}
                    </span>
                    <span className={`text-sm font-bold ${item.color}`}>
                      {item.percentage}%
                    </span>
                  </div>
                  <div
                    className={`w-full rounded-full h-2 ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        item.percentage >= 95
                          ? "bg-green-500"
                          : item.percentage >= 85
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.value}/{item.total}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activités récentes */}
        <div
          className={`rounded-xl p-6 shadow-lg border ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Activités Récentes
            </h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {[
              {
                action: "Nouvelle élève inscrite",
                details: "Sophie Martin (Fille) - Classe de 5ème B",
                time: "Il y a 2 heures",
                type: "success",
                icon: <User className="w-4 h-4" />,
                avatar: "👧",
              },
              {
                action: "Paiement reçu",
                details: "Famille Dubois - Frais de scolarité mensuelle",
                time: "Il y a 3 heures",
                type: "info",
                icon: <CreditCard className="w-4 h-4" />,
                avatar: "💳",
              },
              {
                action: "Absence signalée",
                details: "Pierre Durand (Garçon) - Classe de 3ème A",
                time: "Il y a 4 heures",
                type: "warning",
                icon: <UserX className="w-4 h-4" />,
                avatar: "⚠️",
              },
              {
                action: "Nouveau professeur",
                details: "Mme Claire Rousseau - Professeure de Mathématiques",
                time: "Il y a 1 jour",
                type: "success",
                icon: <UserCheck className="w-4 h-4" />,
                avatar: "👩‍🏫",
              },
              {
                action: "Nouvel employé",
                details: "M. Paul Legrand - Agent de maintenance",
                time: "Il y a 2 jours",
                type: "success",
                icon: <Users className="w-4 h-4" />,
                avatar: "👨‍🔧",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-200 hover:transform hover:scale-105 ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                }`}
              >
                <div className="text-2xl">{activity.avatar}</div>
                <div
                  className={`p-2 rounded-full ${
                    activity.type === "success"
                      ? "bg-green-100 text-green-600 dark:bg-green-900/20"
                      : activity.type === "warning"
                      ? "bg-amber-100 text-amber-600 dark:bg-amber-900/20"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900/20"
                  }`}
                >
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {activity.action}
                  </p>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {activity.details}
                  </p>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors hover:underline">
              Voir toutes les activités →
            </button>
          </div>
        </div>

        {/* Résumé financier rapide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Paiements ce mois</p>
                <p className="text-2xl font-bold">847</p>
                <p className="text-blue-200 text-xs">sur 1,234 élèves</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Taux de présence</p>
                <p className="text-2xl font-bold">94.2%</p>
                <p className="text-green-200 text-xs">+2.1% vs mois dernier</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Notes moyennes</p>
                <p className="text-2xl font-bold">14.7/20</p>
                <p className="text-purple-200 text-xs">
                  +0.3 vs trimestre dernier
                </p>
              </div>
              <GraduationCap className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableauDeBord;
