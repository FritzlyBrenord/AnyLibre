"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  SelectData,
  InsertDataReturn,
  UpdateData,
  DeleteData,
  DataExsite,
} from "@/Config/SupabaseData";
import { supabase } from "@/Config/supabase";

// Constantes
const STORAGE_BUCKET = "photo_freelance";

// ==================== TYPES ====================

export type StatutFreelance = "actif" | "inactif" | "suspendu";

export interface Langue {
  langue: string;
  niveau: string;
  id?: number;
}

export interface Formation {
  pays: string;
  universite: string;
  annee: string;
  id?: number;
}

export interface Certification {
  nom: string;
  annee: string;
  id?: number;
}

export interface Freelance {
  id: string;
  id_user: string; // Relation avec la table users
  code: string;
  nom: string;
  prenom: string;
  username: string;
  email: string;
  telephone: string;
  pays_telephone: string;
  pays: string;
  region: string;
  ville: string;
  section: string;
  date_naissance?: string;
  genre?: string;
  photo_url?: string; // URL de la photo stockée dans Supabase Storage
  description: string;

  // Professionnel
  occupations: string[];
  competences: string[];
  langues: Langue[];

  // Formation et certifications
  formations: Formation[];
  certifications: Certification[];

  // Portfolio
  sites_web: string[];

  // Statut et gestion
  statut: StatutFreelance;
  isdeleted: boolean;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface FreelanceFormData {
  id_user: string; // ID de l'utilisateur dans la table users
  nom: string;
  prenom: string;
  username: string;
  email: string;
  telephone: string;
  pays_telephone: string;
  pays: string;
  region: string;
  ville: string;
  section: string;
  date_naissance?: string;
  genre?: string;
  photo_url?: string;
  description: string;
  occupations: string[];
  competences: string[];
  langues: Langue[];
  formations: Formation[];
  certifications: Certification[];
  sites_web: string[];
  statut?: StatutFreelance;
}

// ==================== CONTEXT TYPE ====================

export interface FreelancesContextType {
  freelances: Freelance[];
  isLoading: boolean;
  error: string | null;

  // CRUD Operations
  ajouterFreelance: (data: FreelanceFormData) => Promise<void>;
  modifierFreelance: (
    id: string,
    data: Partial<FreelanceFormData>
  ) => Promise<void>;
  supprimerFreelance: (id: string) => Promise<void>; // Suppression logique
  supprimerFreelanceDefinitif: (id: string) => Promise<void>; // Suppression définitive
  restaurerFreelance: (id: string) => Promise<void>;

  // Gestion du statut
  changerStatut: (id: string, nouveauStatut: StatutFreelance) => Promise<void>;
  activerFreelance: (id: string) => Promise<void>;
  desactiverFreelance: (id: string) => Promise<void>;
  suspendreFreelance: (id: string) => Promise<void>;

  // Gestion des photos de profil
  uploadPhotoProfile: (
    freelanceId: string,
    file: File
  ) => Promise<{ success: boolean; url?: string; error?: string }>;
  supprimerPhotoProfile: (freelanceId: string) => Promise<boolean>;
  getPhotoProfileUrl: (photoPath: string) => string;

  // Utilitaires
  rechercherFreelances: (terme: string) => Freelance[];
  getFreelanceById: (id: string) => Freelance | undefined;
  getFreelanceByUserId: (userId: string) => Freelance | undefined;
  getUserFreelance: (userId: string) => Freelance | false; // Nouvelle fonction
  genererNouveauCode: (nom?: string, prenom?: string) => Promise<string>;
  rechargerFreelances: () => Promise<void>;
}

// ==================== CONTEXT ====================

const FreelancesContext = createContext<FreelancesContextType | undefined>(
  undefined
);

// ==================== PROVIDER ====================

interface FreelancesProviderProps {
  children: ReactNode;
}

export const FreelancesProvider: React.FC<FreelancesProviderProps> = ({
  children,
}) => {
  const [freelances, setFreelances] = useState<Freelance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ==================== CHARGEMENT DES DONNÉES ====================

  const rechargerFreelances = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const freelancesRows: Freelance[] | null = await SelectData("freelances");

      if (freelancesRows) {
        // Filtrer uniquement les freelances non supprimés
        const freelancesActifs: Freelance[] = freelancesRows.filter(
          (f: Freelance) => !f.isdeleted
        );
        setFreelances(freelancesActifs);
      } else {
        setFreelances([]);
      }
    } catch (e: unknown) {
      const errorMessage: string =
        e instanceof Error
          ? e.message
          : "Erreur lors du chargement des freelances";
      setError(errorMessage);
      console.error("Erreur rechargerFreelances:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ==================== GÉNÉRATION DE CODE ====================

  const genererNouveauCode = async (
    nom?: string,
    prenom?: string
  ): Promise<string> => {
    const initialNom: string =
      (nom || "").trim().toUpperCase().slice(0, 1) || "X";
    const initialPrenom: string =
      (prenom || "").trim().toUpperCase().slice(0, 1) || "X";
    const rand1: number = Math.floor(Math.random() * 10);
    const rand2: number = Math.floor(Math.random() * 100);
    const rand2Str: string = String(rand2).padStart(2, "0");

    // Format: FL + N + P + d + _ + dd  ex: FLJS4_79
    return `FL${initialNom}${initialPrenom}${rand1}_${rand2Str}`;
  };

  // ==================== GESTION DES PHOTOS DE PROFIL ====================

  // Fonction pour uploader une photo de profil
  const uploadPhotoProfile = async (
    freelanceId: string,
    file: File
  ): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      setIsLoading(true);

      // Vérifier si le freelance existe
      const freelance = getFreelanceById(freelanceId);
      if (!freelance) {
        return {
          success: false,
          error: "Freelance introuvable",
        };
      }

      // Générer un nom de fichier unique
      const fileExt = file.name.split(".").pop();
      const fileName = `${freelanceId}_${Date.now()}.${fileExt}`;
      const filePath = `${freelanceId}/${fileName}`;

      // Si une photo existe déjà, la supprimer
      if (freelance.photo_url) {
        await supprimerPhotoProfile(freelanceId);
      }

      // Upload du fichier
      const { data, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      // Mettre à jour l'URL de la photo dans la base de données
      await UpdateData("freelances", freelanceId, {
        photo_url: filePath,
        updated_at: new Date().toISOString(),
      });

      // Recharger les données
      await rechargerFreelances();

      return {
        success: true,
        url: urlData.publicUrl,
      };
    } catch (e: unknown) {
      const errorMessage: string =
        e instanceof Error ? e.message : "Erreur lors de l'upload de la photo";
      setError(errorMessage);
      console.error("Erreur uploadPhotoProfile:", e);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour supprimer une photo de profil
  const supprimerPhotoProfile = async (
    freelanceId: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Vérifier si le freelance existe
      const freelance = getFreelanceById(freelanceId);
      if (!freelance || !freelance.photo_url) {
        return true; // Rien à supprimer
      }

      // Supprimer le fichier du stockage
      const { error: deleteError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([freelance.photo_url]);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      // Mettre à jour l'URL de la photo dans la base de données
      await UpdateData("freelances", freelanceId, {
        photo_url: null,
        updated_at: new Date().toISOString(),
      });

      // Recharger les données
      await rechargerFreelances();

      return true;
    } catch (e: unknown) {
      const errorMessage: string =
        e instanceof Error
          ? e.message
          : "Erreur lors de la suppression de la photo";
      setError(errorMessage);
      console.error("Erreur supprimerPhotoProfile:", e);

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour obtenir l'URL publique d'une photo
  const getPhotoProfileUrl = (photoPath: string): string => {
    if (!photoPath) return "";

    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(photoPath);

    return data.publicUrl;
  };

  // ==================== AJOUTER FREELANCE ====================

  const ajouterFreelance = async (data: FreelanceFormData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Vérifier si l'ID utilisateur est fourni
      if (!data.id_user) {
        throw new Error("L'ID de l'utilisateur est requis");
      }

      // Vérifier si l'utilisateur est déjà freelance
      const userFreelanceExists: boolean = await DataExsite(
        "freelances",
        "id_user",
        data.id_user
      );

      if (userFreelanceExists) {
        throw new Error("Cet utilisateur est déjà enregistré comme freelance");
      }

      // Vérifier si l'email existe déjà
      const emailExists: boolean = await DataExsite(
        "freelances",
        "email",
        data.email
      );
      if (emailExists) {
        throw new Error("Cet email est déjà utilisé");
      }

      // Vérifier si le username existe déjà
      const usernameExists: boolean = await DataExsite(
        "freelances",
        "username",
        data.username
      );
      if (usernameExists) {
        throw new Error("Ce nom d'utilisateur est déjà pris");
      }

      // Générer un code unique
      const code: string = await genererNouveauCode(data.nom, data.prenom);

      const codeExists: boolean = await DataExsite("freelances", "code", code);
      if (codeExists) {
        throw new Error("Erreur lors de la génération du code");
      }

      // Préparer les données
      const freelanceData: Omit<Freelance, "id" | "created_at" | "updated_at"> =
        {
          id_user: data.id_user,
          code,
          nom: data.nom,
          prenom: data.prenom,
          username: data.username,
          email: data.email,
          telephone: data.telephone,
          pays_telephone: data.pays_telephone,
          pays: data.pays,
          region: data.region,
          ville: data.ville,
          section: data.section,
          date_naissance: data.date_naissance,
          genre: data.genre,
          photo_url: data.photo_url,
          description: data.description,
          occupations: data.occupations,
          competences: data.competences,
          langues: data.langues,
          formations: data.formations,
          certifications: data.certifications,
          sites_web: data.sites_web,
          statut: data.statut || "actif",
          isdeleted: false,
        };

      const result = await InsertDataReturn("freelances", freelanceData);

      if (!result.success) {
        throw new Error(
          result.error?.message || "Erreur lors de l'ajout du freelance"
        );
      }

      await rechargerFreelances();
    } catch (e: unknown) {
      const errorMessage: string =
        e instanceof Error ? e.message : "Erreur lors de l'ajout du freelance";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== MODIFIER FREELANCE ====================

  const modifierFreelance = async (
    id: string,
    data: Partial<FreelanceFormData>
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Vérifier si le freelance existe
      const freelanceExistant: Freelance | undefined = freelances.find(
        (f: Freelance) => f.id === id
      );

      if (!freelanceExistant) {
        throw new Error("Freelance introuvable");
      }

      // Si l'email est modifié, vérifier qu'il n'existe pas déjà
      if (data.email && data.email !== freelanceExistant.email) {
        const emailExists: boolean = await DataExsite(
          "freelances",
          "email",
          data.email
        );
        if (emailExists) {
          throw new Error("Cet email est déjà utilisé");
        }
      }

      // Si le username est modifié, vérifier qu'il n'existe pas déjà
      if (data.username && data.username !== freelanceExistant.username) {
        const usernameExists: boolean = await DataExsite(
          "freelances",
          "username",
          data.username
        );
        if (usernameExists) {
          throw new Error("Ce nom d'utilisateur est déjà pris");
        }
      }

      const ok: boolean = await UpdateData("freelances", id, data);

      if (!ok) {
        throw new Error("Erreur lors de la modification du freelance");
      }

      await rechargerFreelances();
    } catch (e: unknown) {
      const errorMessage: string =
        e instanceof Error ? e.message : "Erreur lors de la modification";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== SUPPRESSION LOGIQUE ====================

  const supprimerFreelance = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const ok: boolean = await UpdateData("freelances", id, {
        isdeleted: true,
      });

      if (!ok) {
        throw new Error("Erreur lors de la suppression du freelance");
      }

      await rechargerFreelances();
    } catch (e: unknown) {
      const errorMessage: string =
        e instanceof Error ? e.message : "Erreur lors de la suppression";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== SUPPRESSION DÉFINITIVE ====================

  const supprimerFreelanceDefinitif = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Récupérer le freelance pour voir s'il a une photo
      const freelance = getFreelanceById(id);
      if (freelance && freelance.photo_url) {
        // Supprimer la photo de profil avant de supprimer le freelance
        await supprimerPhotoProfile(id);
      }

      const ok: boolean = await DeleteData("freelances", id);

      if (!ok) {
        throw new Error(
          "Erreur lors de la suppression définitive du freelance"
        );
      }

      await rechargerFreelances();
    } catch (e: unknown) {
      const errorMessage: string =
        e instanceof Error
          ? e.message
          : "Erreur lors de la suppression définitive";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== RESTAURER FREELANCE ====================

  const restaurerFreelance = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const ok: boolean = await UpdateData("freelances", id, {
        isdeleted: false,
      });

      if (!ok) {
        throw new Error("Erreur lors de la restauration du freelance");
      }

      await rechargerFreelances();
    } catch (e: unknown) {
      const errorMessage: string =
        e instanceof Error ? e.message : "Erreur lors de la restauration";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== GESTION DU STATUT ====================

  const changerStatut = async (
    id: string,
    nouveauStatut: StatutFreelance
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const ok: boolean = await UpdateData("freelances", id, {
        statut: nouveauStatut,
      });

      if (!ok) {
        throw new Error("Erreur lors du changement de statut");
      }

      await rechargerFreelances();
    } catch (e: unknown) {
      const errorMessage: string =
        e instanceof Error ? e.message : "Erreur lors du changement de statut";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const activerFreelance = async (id: string): Promise<void> => {
    await changerStatut(id, "actif");
  };

  const desactiverFreelance = async (id: string): Promise<void> => {
    await changerStatut(id, "inactif");
  };

  const suspendreFreelance = async (id: string): Promise<void> => {
    await changerStatut(id, "suspendu");
  };

  // ==================== UTILITAIRES ====================

  const rechercherFreelances = (terme: string): Freelance[] => {
    if (!terme.trim()) return freelances;

    const q: string = terme.toLowerCase().trim();

    return freelances.filter((f: Freelance) => {
      const searchableFields: string[] = [
        f.code,
        f.nom,
        f.prenom,
        f.username,
        f.email,
        `${f.prenom} ${f.nom}`,
        ...f.occupations,
        ...f.competences,
      ].filter(Boolean) as string[];

      return searchableFields.some((v: string) => v.toLowerCase().includes(q));
    });
  };

  const getFreelanceById = (id: string): Freelance | undefined => {
    return freelances.find((f: Freelance) => f.id === id);
  };

  const getFreelanceByUserId = (userId: string): Freelance | undefined => {
    return freelances.find((f: Freelance) => f.id_user === userId);
  };

  // Nouvelle fonction pour vérifier si un utilisateur est freelance
  const getUserFreelance = (userId: string): Freelance | false => {
    if (!userId) return false;

    const freelance = freelances.find(
      (f: Freelance) =>
        f.id_user === userId && f.statut === "actif" && !f.isdeleted
    );

    return freelance || false;
  };

  // ==================== EFFET INITIAL ====================

  useEffect(() => {
    rechargerFreelances();
  }, [rechargerFreelances]);

  // ==================== PROVIDER VALUE ====================

  const contextValue: FreelancesContextType = {
    freelances,
    isLoading,
    error,
    ajouterFreelance,
    modifierFreelance,
    supprimerFreelance,
    supprimerFreelanceDefinitif,
    restaurerFreelance,
    changerStatut,
    activerFreelance,
    desactiverFreelance,
    suspendreFreelance,
    uploadPhotoProfile,
    supprimerPhotoProfile,
    getPhotoProfileUrl,
    rechercherFreelances,
    getFreelanceById,
    getFreelanceByUserId,
    getUserFreelance, // Nouvelle fonction ajoutée
    genererNouveauCode,
    rechargerFreelances,
  };

  return (
    <FreelancesContext.Provider value={contextValue}>
      {children}
    </FreelancesContext.Provider>
  );
};

// ==================== HOOK PERSONNALISÉ ====================

export const useFreelances = (): FreelancesContextType => {
  const ctx = useContext(FreelancesContext);
  if (!ctx) {
    throw new Error("useFreelances must be used within a FreelancesProvider");
  }
  return ctx;
};
