"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  CheckCircle,
  XCircle,
  Loader2,
  Briefcase,
  Globe,
  Star,
  AlertCircle,
} from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/Context/ContextUser";

// Fonctions de validation sécurisées
const SecurityUtils = {
  // Nettoyer et échapper les entrées utilisateur
  sanitizeInput: (input: string): string => {
    return input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;")
      .replace(/\\/g, "&#x5C;")
      .trim();
  },

  // Valider l'email
  validateEmail: (email: string): { isValid: boolean; message: string } => {
    const sanitizedEmail = SecurityUtils.sanitizeInput(email);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!sanitizedEmail) {
      return { isValid: false, message: "L'email est requis" };
    }

    if (!emailRegex.test(sanitizedEmail)) {
      return { isValid: false, message: "Format d'email invalide" };
    }

    if (sanitizedEmail.length > 254) {
      return { isValid: false, message: "L'email est trop long" };
    }

    return { isValid: true, message: "Email valide" };
  },

  // Valider le nom d'utilisateur
  validateUsername: (
    username: string
  ): { isValid: boolean; message: string } => {
    const sanitizedUsername = SecurityUtils.sanitizeInput(username);

    if (!sanitizedUsername) {
      return { isValid: false, message: "Le nom d'utilisateur est requis" };
    }

    if (sanitizedUsername.length < 3) {
      return { isValid: false, message: "Minimum 3 caractères" };
    }

    if (sanitizedUsername.length > 30) {
      return { isValid: false, message: "Maximum 30 caractères" };
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(sanitizedUsername)) {
      return {
        isValid: false,
        message: "Caractères autorisés: lettres, chiffres, _ et -",
      };
    }

    if (/^\d+$/.test(sanitizedUsername)) {
      return {
        isValid: false,
        message: "Le nom ne peut pas être uniquement des chiffres",
      };
    }

    return { isValid: true, message: "Nom d'utilisateur valide" };
  },

  // Valider le mot de passe
  validatePassword: (
    password: string
  ): {
    isValid: boolean;
    message: string;
    errors: {
      length: boolean;
      hasUppercase: boolean;
      hasLowercase: boolean;
      hasNumber: boolean;
      hasSpecial: boolean;
    };
  } => {
    const errors = {
      length: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const isValid = Object.values(errors).every(Boolean);

    let message = "Mot de passe valide";
    if (!isValid) {
      const missing = [];
      if (!errors.length) missing.push("8 caractères");
      if (!errors.hasUppercase) missing.push("une majuscule");
      if (!errors.hasLowercase) missing.push("une minuscule");
      if (!errors.hasNumber) missing.push("un chiffre");
      if (!errors.hasSpecial) missing.push("un caractère spécial");
      message = `Manque: ${missing.join(", ")}`;
    }

    return { isValid, message, errors };
  },
};

export default function AuthPage() {
  const {
    Login,
    AddUser,
    currentSession,
    loading: authLoading,
    error: authError,
    GetUserByEmail,
    GetUserById,
    listeUtilisateurs,
  } = useAuth();
  const router = useRouter();

  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [signupStep, setSignupStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validation, setValidation] = useState({
    email: { isValid: null as boolean | null, message: "" },
    password: {
      isValid: null as boolean | null,
      message: "",
      errors: {
        length: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false,
      },
    },
    username: { isValid: null as boolean | null, message: "" },
  });
  const [checkingAvailability, setCheckingAvailability] = useState({
    email: false,
    username: false,
  });

  // Afficher les erreurs du contexte d'authentification
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  // Vérifier la disponibilité de l'email
  useEffect(() => {
    const checkEmailAvailability = async () => {
      if (!formData.email || !validation.email.isValid) return;

      setCheckingAvailability((prev) => ({ ...prev, email: true }));

      try {
        const existingUser = await GetUserByEmail(formData.email);
        if (existingUser) {
          setValidation((prev) => ({
            ...prev,
            email: {
              isValid: false,
              message: "Cet email est déjà utilisé",
            },
          }));
        }
      } catch (error) {
        console.error("Erreur vérification email:", error);
      } finally {
        setCheckingAvailability((prev) => ({ ...prev, email: false }));
      }
    };

    const timeoutId = setTimeout(checkEmailAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.email, validation.email.isValid, GetUserByEmail]);

  // Vérifier la disponibilité du nom d'utilisateur
  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (!formData.username || !validation.username.isValid) return;

      setCheckingAvailability((prev) => ({ ...prev, username: true }));

      try {
        // Vérifier dans la liste des utilisateurs existants
        const existingUser = listeUtilisateurs.find(
          (user) =>
            user.nom_utilisateur.toLowerCase() ===
            formData.username.toLowerCase()
        );

        if (existingUser) {
          setValidation((prev) => ({
            ...prev,
            username: {
              isValid: false,
              message: "Ce nom d'utilisateur est déjà pris",
            },
          }));
        }
      } catch (error) {
        console.error("Erreur vérification username:", error);
      } finally {
        setCheckingAvailability((prev) => ({ ...prev, username: false }));
      }
    };

    const timeoutId = setTimeout(checkUsernameAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username, validation.username.isValid, listeUtilisateurs]);

  // Gestion sécurisée des changements de formulaire
  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = SecurityUtils.sanitizeInput(value);

    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }));
    setError("");

    // Validation en temps réel
    switch (field) {
      case "email":
        const emailValidation = SecurityUtils.validateEmail(sanitizedValue);
        setValidation((prev) => ({
          ...prev,
          email: { ...emailValidation, isValid: emailValidation.isValid },
        }));
        break;

      case "password":
        const passwordValidation =
          SecurityUtils.validatePassword(sanitizedValue);
        setValidation((prev) => ({
          ...prev,
          password: {
            ...passwordValidation,
            isValid: passwordValidation.isValid,
          },
        }));
        break;

      case "username":
        const usernameValidation =
          SecurityUtils.validateUsername(sanitizedValue);
        setValidation((prev) => ({
          ...prev,
          username: {
            ...usernameValidation,
            isValid: usernameValidation.isValid,
          },
        }));
        break;
    }
  };

  const handleContinue = () => {
    if (validation.email.isValid && validation.password.isValid) {
      setSignupStep(2);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation finale avant soumission
    const emailValidation = SecurityUtils.validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.message);
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setError("Le mot de passe est requis");
      setLoading(false);
      return;
    }

    try {
      console.log("🔐 Tentative de connexion:", formData.email);

      // ✅ RÉCUPÉRER L'URL DE REDIRECTION
      const redirectUrl = searchParams.get("redirect");
      console.log("🔍 URL de redirection:", redirectUrl);

      const result = await Login(formData.email, formData.password);

      console.log("📋 Résultat connexion:", result);

      if (result.success) {
        console.log("✅ Connexion réussie");
        setError("");

        // Réinitialiser le formulaire
        setFormData({ email: "", password: "", username: "" });

        // ✅ REDIRECTION IMMÉDIATE ET FORCÉE
        if (redirectUrl) {
          console.log("🚀 Redirection vers:", redirectUrl);
          window.location.href = redirectUrl; // Forcer la redirection
        } else {
          console.log("🚀 Redirection vers /Accueil");
          window.location.href = "/Accueil";
        }
      } else {
        setError(result.message);
        console.error("❌ Erreur connexion:", result.message);
      }
    } catch (err: any) {
      console.error("💥 Exception connexion:", err);
      setError("Une erreur inattendue est survenue");
    } finally {
      setLoading(false);
    }
  };
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation finale avant soumission
    const emailValidation = SecurityUtils.validateEmail(formData.email);
    const passwordValidation = SecurityUtils.validatePassword(
      formData.password
    );
    const usernameValidation = SecurityUtils.validateUsername(
      formData.username
    );

    if (!emailValidation.isValid) {
      setError(emailValidation.message);
      setLoading(false);
      return;
    }

    if (!passwordValidation.isValid) {
      setError("Le mot de passe ne respecte pas les exigences de sécurité");
      setLoading(false);
      return;
    }

    if (!usernameValidation.isValid) {
      setError(usernameValidation.message);
      setLoading(false);
      return;
    }

    try {
      console.log("🚀 Début inscription:", formData.email, formData.username);

      // Vérifications finales de disponibilité
      const existingEmail = await GetUserByEmail(formData.email);
      if (existingEmail) {
        setError("Cet email est déjà utilisé");
        setLoading(false);
        return;
      }

      const existingUsername = listeUtilisateurs.find(
        (user) =>
          user.nom_utilisateur.toLowerCase() === formData.username.toLowerCase()
      );
      if (existingUsername) {
        setError("Ce nom d'utilisateur est déjà pris");
        setLoading(false);
        return;
      }

      // Créer l'utilisateur avec le mot de passe fourni
      const userData = {
        email: formData.email,
        nom_utilisateur: formData.username,
        role: "client" as const,
        is_blocked: false,
      };

      // Appeler AddUser avec les deux paramètres
      const success = await AddUser(userData, formData.password);

      console.log("📝 Résultat AddUser:", success);

      if (success) {
        console.log("✅ Inscription réussie, connexion auto...");

        // Connexion automatique avec le mot de passe fourni
        const loginResult = await Login(formData.email, formData.password);

        console.log("🔐 Résultat connexion auto:", loginResult);

        if (loginResult.success) {
          console.log("🎉 Connexion automatique réussie");
          setError("");
          // Réinitialiser le formulaire
          setFormData({ email: "", password: "", username: "" });
          setSignupStep(1);
        } else {
          setError("Compte créé avec succès. Veuillez vous connecter.");
          setIsLogin(true);
          setSignupStep(1);
        }
      } else {
        setError("Erreur lors de la création du compte. Veuillez réessayer.");
      }
    } catch (err: any) {
      console.error("💥 Erreur inscription:", err);
      setError(err.message || "Une erreur est survenue lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setSignupStep(1);
    setFormData({ email: "", password: "", username: "" });
    setError("");
    setValidation({
      email: { isValid: null, message: "" },
      password: {
        isValid: null,
        message: "",
        errors: {
          length: false,
          hasUppercase: false,
          hasLowercase: false,
          hasNumber: false,
          hasSpecial: false,
        },
      },
      username: { isValid: null, message: "" },
    });
  };

  const skillCategories = [
    { name: "Personnel", icon: <User className="text-blue-500" /> },
    { name: "Professionnel", icon: <Briefcase className="text-purple-500" /> },
    { name: "Messagerie", icon: <Mail className="text-emerald-500" /> },
    { name: "Sécurité", icon: <Lock className="text-amber-500" /> },
  ];

  // ✅ Si déjà connecté, rediriger immédiatement
  useEffect(() => {
    if (currentSession.isAuthenticated) {
      console.log("✅ Utilisateur déjà connecté, redirection immédiate");
      const redirectUrl = searchParams.get("redirect");
      const destination = redirectUrl || "/Accueil";
      window.location.href = destination;
    }
  }, [currentSession.isAuthenticated, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 relative overflow-hidden py-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl top-[-100px] right-[-100px] animate-pulse"></div>
        <div
          className="absolute w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-3xl bottom-[-200px] left-[-200px] animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Container principal */}
      <div className="z-10 w-full max-w-5xl px-4 py-8 flex flex-col md:flex-row">
        {/* Section gauche - Branding */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center p-8 rounded-l-2xl bg-white backdrop-blur-xl text-slate-700 border-r border-slate-200">
          <div className="mb-10 w-full">
            <div className="relative flex flex-col items-center">
              <div className="w-72 h-72 bg-gradient-to-br from-blue-50 to-purple-100 rounded-2xl p-6 backdrop-blur-sm border border-slate-200 shadow-xl relative overflow-hidden">
                <div className="absolute top-4 left-4 bg-white rounded-lg p-4 shadow-md border border-slate-200 w-16 h-16 flex items-center justify-center">
                  <User className="text-blue-500" size={30} />
                </div>
                <div className="absolute bottom-4 right-4 bg-white rounded-lg p-4 shadow-md border border-slate-200 w-16 h-16 flex items-center justify-center">
                  <Globe className="text-purple-500" size={30} />
                </div>
                <div className="absolute top-20 right-4 bg-white rounded-lg p-4 shadow-md border border-slate-200 w-16 h-16 flex items-center justify-center">
                  <Mail className="text-cyan-500" size={30} />
                </div>
                <div className="absolute bottom-20 left-4 bg-white rounded-lg p-4 shadow-md border border-slate-200 w-16 h-16 flex items-center justify-center">
                  <Lock className="text-indigo-500" size={30} />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <Star className="text-white" size={30} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm">
            <p className="text-xl text-slate-700 mb-6">
              {isLogin
                ? "Connectez-vous à votre compte sécurisé"
                : "Créez votre compte en toute sécurité"}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {skillCategories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 bg-white rounded-lg border border-slate-200 shadow-sm"
                >
                  <div className="mr-3">{category.icon}</div>
                  <span className="text-slate-700">{category.name}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">50K+</div>
                <div className="text-sm text-slate-600">Utilisateurs</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-2xl font-bold text-purple-600">100%</div>
                <div className="text-sm text-slate-600">Sécurisé</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-2xl font-bold text-emerald-600">24/7</div>
                <div className="text-sm text-slate-600">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section droite - Formulaire */}
        <div className="w-full md:w-1/2 bg-white p-8 rounded-2xl md:rounded-l-none shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <div className="md:hidden inline-flex items-center justify-center mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                ConnexionPro
              </h1>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mt-2">
              {isLogin
                ? "Connectez-vous à votre compte"
                : signupStep === 1
                ? "Créez votre compte"
                : "Finalisez votre inscription"}
            </h2>
            <p className="text-gray-500 mt-2">
              {isLogin
                ? "Accédez à votre espace sécurisé"
                : "Rejoignez notre communauté en toute sécurité"}
            </p>
          </div>

          {/* Affichage des erreurs */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
              <AlertCircle
                className="text-red-500 mt-0.5 mr-3 flex-shrink-0"
                size={18}
              />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Processus d'authentification */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800"
                    placeholder="exemple@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="w-full bg-gray-50 border border-gray-300 pl-10 pr-12 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800"
                    placeholder="Votre mot de passe sécurisé"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  authLoading ||
                  !formData.email ||
                  !formData.password
                }
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3.5 px-4 rounded-xl font-medium shadow-lg shadow-purple-500/20 flex items-center justify-center transition-all group disabled:opacity-70"
              >
                {loading || authLoading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <>
                    <span>Se connecter</span>
                    <ArrowRight
                      size={18}
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>
          ) : signupStep === 1 ? (
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    id="signup-email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full bg-gray-50 border ${
                      validation.email.isValid === null
                        ? "border-gray-300"
                        : validation.email.isValid
                        ? "border-green-500"
                        : "border-red-500"
                    } pl-10 pr-12 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-800`}
                    placeholder="exemple@email.com"
                    required
                  />
                  {formData.email && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {checkingAvailability.email ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      ) : validation.email.isValid ? (
                        <CheckCircle className="text-green-500" size={18} />
                      ) : (
                        <XCircle className="text-red-500" size={18} />
                      )}
                    </div>
                  )}
                </div>
                {formData.email && validation.email.message && (
                  <p
                    className={`text-xs mt-1 ${
                      validation.email.isValid
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {validation.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="signup-password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`w-full bg-gray-50 border ${
                      validation.password.isValid === null
                        ? "border-gray-300"
                        : validation.password.isValid
                        ? "border-green-500"
                        : "border-red-500"
                    } pl-10 pr-12 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-800`}
                    placeholder="Créez un mot de passe sécurisé"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {formData.password && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Exigences de sécurité :
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center">
                        {validation.password.errors.length ? (
                          <CheckCircle
                            className="text-green-500 mr-2"
                            size={14}
                          />
                        ) : (
                          <XCircle className="text-red-500 mr-2" size={14} />
                        )}
                        <span>8 caractères minimum</span>
                      </div>
                      <div className="flex items-center">
                        {validation.password.errors.hasUppercase ? (
                          <CheckCircle
                            className="text-green-500 mr-2"
                            size={14}
                          />
                        ) : (
                          <XCircle className="text-red-500 mr-2" size={14} />
                        )}
                        <span>Au moins une lettre majuscule</span>
                      </div>
                      <div className="flex items-center">
                        {validation.password.errors.hasLowercase ? (
                          <CheckCircle
                            className="text-green-500 mr-2"
                            size={14}
                          />
                        ) : (
                          <XCircle className="text-red-500 mr-2" size={14} />
                        )}
                        <span>Au moins une lettre minuscule</span>
                      </div>
                      <div className="flex items-center">
                        {validation.password.errors.hasNumber ? (
                          <CheckCircle
                            className="text-green-500 mr-2"
                            size={14}
                          />
                        ) : (
                          <XCircle className="text-red-500 mr-2" size={14} />
                        )}
                        <span>Au moins un chiffre</span>
                      </div>
                      <div className="flex items-center">
                        {validation.password.errors.hasSpecial ? (
                          <CheckCircle
                            className="text-green-500 mr-2"
                            size={14}
                          />
                        ) : (
                          <XCircle className="text-red-500 mr-2" size={14} />
                        )}
                        <span>Au moins un caractère spécial</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleContinue}
                disabled={
                  !validation.email.isValid ||
                  !validation.password.isValid ||
                  checkingAvailability.email
                }
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3.5 px-4 rounded-xl font-medium shadow-lg shadow-purple-500/20 flex items-center justify-center transition-all group disabled:opacity-70 mt-6"
              >
                <span>Continuer</span>
                <ArrowRight
                  size={18}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="bg-blue-50 p-4 rounded-xl mb-4 flex items-start border border-blue-100">
                <CheckCircle
                  className="text-blue-500 mt-1 mr-3 flex-shrink-0"
                  size={18}
                />
                <div>
                  <p className="text-sm text-blue-900">
                    Email validé:{" "}
                    <span className="font-medium">{formData.email}</span>
                  </p>
                  <p className="text-sm text-blue-900">
                    Mot de passe: <span className="font-medium">••••••••</span>
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    className={`w-full bg-gray-50 border ${
                      validation.username.isValid === null
                        ? "border-gray-300"
                        : validation.username.isValid
                        ? "border-green-500"
                        : "border-red-500"
                    } pl-10 pr-12 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800`}
                    placeholder="Choisissez un nom d'utilisateur"
                    required
                    minLength={3}
                    maxLength={30}
                    pattern="[a-zA-Z0-9_-]+"
                  />
                  {formData.username && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {checkingAvailability.username ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      ) : validation.username.isValid ? (
                        <CheckCircle className="text-green-500" size={18} />
                      ) : (
                        <XCircle className="text-red-500" size={18} />
                      )}
                    </div>
                  )}
                </div>
                {formData.username && validation.username.message && (
                  <p
                    className={`text-xs mt-1 ${
                      validation.username.isValid
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {validation.username.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Caractères autorisés: lettres, chiffres, tiret et underscore
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setSignupStep(1)}
                  className="w-1/3 bg-gray-100 text-gray-700 hover:bg-gray-200 py-3.5 px-4 rounded-xl font-medium transition-all border border-gray-200"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={
                    loading ||
                    authLoading ||
                    !validation.username.isValid ||
                    checkingAvailability.username
                  }
                  className="w-2/3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3.5 px-4 rounded-xl font-medium shadow-lg shadow-purple-500/20 flex items-center justify-center transition-all group disabled:opacity-70"
                >
                  {loading || authLoading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <>
                      <span>Créer le compte</span>
                      <ArrowRight
                        size={18}
                        className="ml-2 group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {isLogin ? "Pas encore de compte?" : "Déjà un compte?"}
              <button
                type="button"
                onClick={switchMode}
                className="ml-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                {isLogin ? "Créer un compte" : "Se connecter"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
