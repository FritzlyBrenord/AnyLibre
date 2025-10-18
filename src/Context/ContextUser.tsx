"use client";

import {
  InsertDataReturn,
  UpdateData,
  DeleteData,
  DataExsite,
  CreerUtilisateur,
  SignIn,
  SignOut,
  getUser,
  UnbanUserAdmin,
  BanUserAdmin,
  DeleteUserAdmin,
  UpdatePasswordAdmin,
  UpdateEmailAdmin,
  SelectData,
  VerifierUtilisateurAuth,
} from "@/Config/SupabaseData";
import React, { createContext, useContext, useEffect, useState } from "react";

// Types d'utilisateur
type UserRole = "client" | "freelance";

// Interface pour notre utilisateur dans la base de données
interface UserProfile {
  id: string;
  email: string;
  nom_utilisateur: string;
  role: UserRole;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  profile_image?: string;
  // Données supplémentaires si nécessaire
  phone?: string;
  address?: string;
}

// Interface pour la session
interface SessionData {
  user: any | null;
  userProfile: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  canAccess: boolean;
}

interface AuthContextType {
  // Gestion des utilisateurs
  listeUtilisateurs: UserProfile[];
  AddUser: (
    userData: Omit<UserProfile, "id" | "created_at" | "updated_at">,
    password: string
  ) => Promise<boolean>;
  UpdateUser: (
    id: string,
    updatedUser: Partial<UserProfile>
  ) => Promise<boolean>;
  BlockUser: (id: string) => Promise<boolean>;
  BlockUserByEmail: (email: string) => Promise<boolean>;
  UnblockUser: (id: string) => Promise<boolean>;
  DeleteUser: (id: string) => Promise<boolean>;
  RefreshUsers: () => Promise<void>;

  // Nouvelle fonction pour changer le rôle
  ChangeUserRole: (
    userId: string,
    newRole: UserRole
  ) => Promise<{ success: boolean; message: string }>;

  // Gestion du profil
  SaveProfileImage: (userId: string, imageBase64: string) => void;
  GetProfileImage: (userId: string) => string | null;
  RemoveProfileImage: (userId: string) => void;

  // Authentification
  Login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string; user?: UserProfile }>;
  Logout: () => Promise<boolean>;

  // Session
  currentSession: SessionData;
  GetUserByEmail: (email: string) => Promise<UserProfile | null>;
  GetUserById: (id: string) => Promise<UserProfile | null>;

  // États
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [listeUtilisateurs, setListeUtilisateurs] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<SessionData>({
    user: null,
    userProfile: null,
    role: "client",
    isAuthenticated: false,
    canAccess: false,
  });

  // Fonction utilitaire pour vérifier la validité de l'utilisateur authentifié
  const isValidAuthUser = (authUser: any): boolean => {
    return authUser && authUser.user && typeof authUser.user.email === "string";
  };

  // Fonction pour récupérer tous les utilisateurs
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const users = await SelectData("users");

      if (users) {
        setListeUtilisateurs(users as UserProfile[]);
      }
    } catch (error: any) {
      setError(
        error.message || "Erreur lors de la récupération des utilisateurs"
      );
    } finally {
      setLoading(false);
    }
  };

  // NOUVELLE FONCTION : Changer le rôle d'un utilisateur
  const ChangeUserRole = async (
    userId: string,
    newRole: UserRole
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);

      console.log(
        `🔄 Tentative de changement de rôle pour l'utilisateur ${userId} vers ${newRole}`
      );

      // Vérifier que le nouveau rôle est valide
      if (newRole !== "client" && newRole !== "freelance") {
        return {
          success: false,
          message: "Rôle invalide. Doit être 'client' ou 'freelance'",
        };
      }

      // Récupérer l'utilisateur actuel
      const currentUser = await GetUserById(userId);
      if (!currentUser) {
        return {
          success: false,
          message: "Utilisateur non trouvé",
        };
      }

      // Vérifier si l'utilisateur n'est pas déjà dans le rôle demandé
      if (currentUser.role === newRole) {
        return {
          success: false,
          message: `L'utilisateur est déjà ${
            newRole === "client" ? "client" : "freelance"
          }`,
        };
      }

      // Mettre à jour le rôle dans la base de données
      const updateSuccess = await UpdateData("users", userId, {
        role: newRole,
        updated_at: new Date().toISOString(),
      });

      if (updateSuccess === true) {
        console.log(
          `✅ Rôle changé avec succès de ${currentUser.role} à ${newRole}`
        );

        // Mettre à jour la liste des utilisateurs
        await fetchUsers();

        // Si c'est l'utilisateur actuel, mettre à jour la session
        if (currentSession.user?.id === userId) {
          const updatedProfile = await GetUserById(userId);
          if (updatedProfile) {
            setCurrentSession((prev) => ({
              ...prev,
              userProfile: updatedProfile,
              role: updatedProfile.role,
            }));
          }
        }

        return {
          success: true,
          message: `Rôle changé avec succès de ${currentUser.role} à ${newRole}`,
        };
      } else {
        return {
          success: false,
          message:
            "Erreur lors de la mise à jour du rôle dans la base de données",
        };
      }
    } catch (error: any) {
      console.error("❌ Erreur lors du changement de rôle:", error);
      const errorMessage = error.message || "Erreur lors du changement de rôle";
      setError(errorMessage);

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour ajouter un utilisateur
  // Dans votre AuthProvider, modifiez la fonction AddUser :
  const AddUser = async (
    userData: Omit<UserProfile, "id" | "created_at" | "updated_at">,
    password: string // Ajouter le paramètre password
  ): Promise<boolean> => {
    let authUserId: string | null = null;

    try {
      setLoading(true);
      setError(null);

      console.log("1️⃣ Données reçues:", userData);
      console.log("🔐 Mot de passe fourni:", password);

      // ===== ÉTAPE 1: Vérifier si l'email existe déjà =====
      const emailExists = await DataExsite("users", "email", userData.email);

      console.log("2️⃣ Email existe dans table users?", emailExists);

      if (emailExists === true) {
        setError("Un utilisateur avec cet email existe déjà");
        return false;
      }

      // ===== ÉTAPE 2: Créer l'utilisateur dans l'authentification =====
      console.log("3️⃣ Création auth avec le mot de passe fourni...");
      authUserId = await CreerUtilisateur(userData.email, password); // Utiliser le mot de passe fourni

      console.log("4️⃣ Auth User ID reçu:", authUserId);

      if (!authUserId) {
        setError("Erreur lors de la création de l'authentification");
        return false;
      }

      // ===== ÉTAPE 3: VÉRIFIER que l'utilisateur auth existe vraiment =====
      console.log("5️⃣ Vérification de l'utilisateur auth...");
      const authUserVerified = await VerifierUtilisateurAuth(authUserId);

      if (!authUserVerified) {
        console.error("❌ L'utilisateur auth n'a pas été créé correctement");
        setError("Échec de la vérification de l'utilisateur dans auth.users");
        return false;
      }

      console.log("✅ Utilisateur auth vérifié:", authUserVerified);

      // ===== ÉTAPE 4: Insérer dans la table users =====
      const dataToInsert: any = {
        id: authUserId,
        email: userData.email,
        nom_utilisateur: userData.nom_utilisateur,
        role: userData.role,
        is_blocked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("6️⃣ Données à insérer dans table:", dataToInsert);

      const result = await InsertDataReturn("users", dataToInsert);

      console.log("7️⃣ Résultat insertion:", result);

      if (result?.success === true && result.rows) {
        console.log("✅ Utilisateur créé avec succès dans les deux tables!");
        await fetchUsers();
        return true;
      } else {
        console.error("❌ Échec insertion dans table users:", result);
        setError(
          `Erreur d'insertion: ${JSON.stringify(result?.error || "Inconnu")}`
        );

        // ===== ROLLBACK: Supprimer l'utilisateur auth =====
        console.log("🔄 Rollback: suppression de l'utilisateur auth...");
        await DeleteUserAdmin(authUserId);
        console.log("🔄 Utilisateur auth supprimé");

        return false;
      }
    } catch (error: any) {
      console.error("❌ Exception:", error);
      setError(error.message || "Erreur lors de l'ajout de l'utilisateur");

      // ===== ROLLBACK en cas d'exception =====
      if (authUserId) {
        console.log(
          "🔄 Rollback: suppression de l'utilisateur auth suite à exception..."
        );
        try {
          await DeleteUserAdmin(authUserId);
          console.log("🔄 Utilisateur auth supprimé");
        } catch (rollbackError) {
          console.error("❌ Erreur lors du rollback:", rollbackError);
        }
      }

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour un utilisateur
  const UpdateUser = async (
    id: string,
    updatedUser: Partial<UserProfile>
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const users = await SelectData("users");
      const currentUser = users?.find((u: any) => u.id === id);

      if (!currentUser) {
        setError("Utilisateur non trouvé");
        return false;
      }

      // Modifier l'email dans auth
      if (updatedUser.email && updatedUser.email !== currentUser.email) {
        const emailUpdateResult = await UpdateEmailAdmin(updatedUser.email, id);
        if (!emailUpdateResult?.succes) {
          setError("Erreur lors de la modification de l'email");
          return false;
        }
      }

      // Préparer les données pour la table
      const dataToUpdate: any = {
        updated_at: new Date().toISOString(),
      };

      if (updatedUser.email !== undefined) {
        dataToUpdate.email = updatedUser.email;
      }
      if (updatedUser.nom_utilisateur !== undefined) {
        dataToUpdate.nom_utilisateur = updatedUser.nom_utilisateur;
      }
      if (updatedUser.role !== undefined) {
        dataToUpdate.role = updatedUser.role;
      }
      if (updatedUser.is_blocked !== undefined) {
        dataToUpdate.is_blocked = updatedUser.is_blocked;
      }
      if (updatedUser.last_login !== undefined) {
        dataToUpdate.last_login = updatedUser.last_login;
      }
      if (updatedUser.profile_image !== undefined) {
        dataToUpdate.profile_image = updatedUser.profile_image;
      }
      if (updatedUser.phone !== undefined) {
        dataToUpdate.phone = updatedUser.phone;
      }
      if (updatedUser.address !== undefined) {
        dataToUpdate.address = updatedUser.address;
      }

      const success = await UpdateData("users", id, dataToUpdate);

      if (success === true) {
        await fetchUsers();

        // Si c'est l'utilisateur actuel, mettre à jour la session
        if (currentSession.user?.id === id) {
          const updatedProfile = await GetUserById(id);
          if (updatedProfile) {
            setCurrentSession((prev) => ({
              ...prev,
              userProfile: updatedProfile,
              role: updatedProfile.role,
            }));
          }
        }

        return true;
      } else {
        setError("Erreur lors de la mise à jour");
        return false;
      }
    } catch (error: any) {
      setError(error.message || "Erreur lors de la mise à jour");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour bloquer un utilisateur
  const BlockUser = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Bannir dans l'authentification
      const authBanResult = await BanUserAdmin(id);
      if (!authBanResult?.succes) {
        setError("Erreur lors du blocage dans l'authentification");
        return false;
      }

      // Mettre à jour dans la table
      const success = await UpdateData("users", id, {
        is_blocked: true,
        updated_at: new Date().toISOString(),
      });

      if (success === true) {
        await fetchUsers();
        return true;
      }
      return false;
    } catch (error: any) {
      setError(error.message || "Erreur lors du blocage");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour débloquer un utilisateur
  const UnblockUser = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Débannir dans l'authentification
      const authUnbanResult = await UnbanUserAdmin(id);
      if (!authUnbanResult?.succes) {
        setError("Erreur lors du déblocage dans l'authentification");
        return false;
      }

      // Mettre à jour dans la table
      const success = await UpdateData("users", id, {
        is_blocked: false,
        updated_at: new Date().toISOString(),
      });

      if (success === true) {
        await fetchUsers();
        return true;
      }
      return false;
    } catch (error: any) {
      setError(error.message || "Erreur lors du déblocage");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Bloquer un utilisateur par email
  const BlockUserByEmail = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔒 Tentative de blocage pour email:", email);

      // 1. Trouver l'utilisateur par email
      const users = await SelectData("users");
      const user = users?.find(
        (u: any) => u.email?.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        console.error("❌ Utilisateur introuvable:", email);
        setError("Utilisateur introuvable avec cet email");
        return false;
      }

      console.log("✅ Utilisateur trouvé:", user.id);

      // 2. Bannir dans l'authentification
      const authBanResult = await BanUserAdmin(user.id);
      if (!authBanResult?.succes) {
        console.error("❌ Erreur lors du blocage auth");
        setError("Erreur lors du blocage dans l'authentification");
        return false;
      }

      console.log("✅ Utilisateur banni dans auth");

      // 3. Mettre à jour dans la table
      const success = await UpdateData("users", user.id, {
        is_blocked: true,
        updated_at: new Date().toISOString(),
      });

      if (success === true) {
        console.log("✅ Utilisateur bloqué dans la table");
        await fetchUsers();
        return true;
      }

      console.error("❌ Échec mise à jour table");
      return false;
    } catch (error: any) {
      console.error("❌ Erreur lors du blocage par email:", error);
      setError(error.message || "Erreur lors du blocage");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer un utilisateur
  const DeleteUser = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // 1. Supprimer de l'authentification Supabase
      const authDeleteResult = await DeleteUserAdmin(id);
      if (!authDeleteResult?.succes) {
        setError("Erreur lors de la suppression de l'authentification");
        return false;
      }

      // 2. Supprimer de la table users
      const success = await DeleteData("users", id);

      if (success === true) {
        await fetchUsers();
        return true;
      } else {
        setError("Erreur lors de la suppression de l'utilisateur");
        return false;
      }
    } catch (error: any) {
      setError(error.message || "Erreur lors de la suppression");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer un utilisateur par email
  const GetUserByEmail = async (email: string): Promise<UserProfile | null> => {
    try {
      const users = await SelectData("users");
      const user = users?.find((u: any) => u.email === email);

      if (user) {
        return user as UserProfile;
      }

      return null;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      return null;
    }
  };

  // Fonction pour récupérer un utilisateur par ID
  const GetUserById = async (id: string): Promise<UserProfile | null> => {
    try {
      const users = await SelectData("users");
      const user = users?.find((u: any) => u.id === id);

      if (user) {
        return user as UserProfile;
      }

      return null;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      return null;
    }
  };

  // Gestion des images de profil (stockage local)
  const SaveProfileImage = (userId: string, imageBase64: string): void => {
    localStorage.setItem(`profile_image_${userId}`, imageBase64);
  };

  const GetProfileImage = (userId: string): string | null => {
    return localStorage.getItem(`profile_image_${userId}`);
  };

  const RemoveProfileImage = (userId: string): void => {
    localStorage.removeItem(`profile_image_${userId}`);
  };

  // Fonction de connexion
  const Login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; user?: UserProfile }> => {
    try {
      setLoading(true);

      // ===== ÉTAPE 1: Tentative de connexion Supabase Auth =====
      const loginResult = await SignIn(email, password);

      if (!loginResult.success) {
        const error = loginResult.error;

        // Gérer les erreurs
        if (error?.message?.includes("Email not confirmed")) {
          return {
            success: false,
            message: "Veuillez confirmer votre email avant de vous connecter",
          };
        }

        if (
          error?.message?.includes("user is banned") ||
          error?.message?.toLowerCase().includes("banned")
        ) {
          return {
            success: false,
            message: "Votre compte est bloqué. Contactez l'administrateur.",
          };
        }

        if (error?.message?.includes("Invalid login credentials")) {
          return {
            success: false,
            message: "Email ou mot de passe incorrect",
          };
        }

        return {
          success: false,
          message: error?.message || "Erreur lors de la connexion",
        };
      }

      // ===== ÉTAPE 2: Récupérer les données utilisateur =====
      const user = await GetUserByEmail(email);
      if (!user) {
        await SignOut();
        return {
          success: false,
          message: "Utilisateur non trouvé dans le système",
        };
      }

      if (user.is_blocked) {
        await SignOut();
        return {
          success: false,
          message: "Votre compte est bloqué. Contactez l'administrateur.",
        };
      }

      // ===== ÉTAPE 3: Mettre à jour la dernière connexion =====
      await UpdateData("users", user.id, {
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // ===== ÉTAPE 4: Mettre à jour la session du context =====
      const authUser = await getUser();
      if (isValidAuthUser(authUser)) {
        const updatedUser = await GetUserById(user.id);

        setCurrentSession({
          user: authUser.user,
          userProfile: updatedUser || user,
          role: user.role,
          isAuthenticated: true,
          canAccess: true,
        });

        return {
          success: true,
          message: "Connexion réussie",
          user: updatedUser || user,
        };
      } else {
        return {
          success: false,
          message: "Erreur lors de la récupération des données utilisateur",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Erreur lors de la connexion",
      };
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const Logout = async (): Promise<boolean> => {
    try {
      // Déconnexion Supabase
      const success = await SignOut();

      if (success === true) {
        setCurrentSession({
          user: null,
          userProfile: null,
          role: "client",
          isAuthenticated: false,
          canAccess: false,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      return false;
    }
  };

  // Fonction pour rafraîchir la liste
  const RefreshUsers = async () => {
    await fetchUsers();
  };

  // Vérifier la session au chargement
  useEffect(() => {
    const checkSession = async () => {
      try {
        const authUser = await getUser();
        if (isValidAuthUser(authUser) && authUser.user?.email) {
          const user = await GetUserByEmail(authUser.user.email);
          if (user && !user.is_blocked) {
            setCurrentSession({
              user: authUser.user,
              userProfile: user,
              role: user.role,
              isAuthenticated: true,
              canAccess: true,
            });
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de session:", error);
      }
    };

    checkSession();
    fetchUsers();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        listeUtilisateurs,
        AddUser,
        UpdateUser,
        BlockUser,
        BlockUserByEmail,
        UnblockUser,
        DeleteUser,
        RefreshUsers,
        ChangeUserRole,
        SaveProfileImage,
        GetProfileImage,
        RemoveProfileImage,
        Login,
        Logout,
        currentSession,
        GetUserByEmail,
        GetUserById,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
