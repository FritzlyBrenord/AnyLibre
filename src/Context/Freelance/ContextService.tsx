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
} from "@/Config/SupabaseData";
import { supabase } from "@/Config/supabase";
import { compressVideo, getVideoMetadata } from "@/Utils//lib/videoCompression";
import { compressImage, getImageMetadata } from "@/Utils/lib/imageCompression";

// ==================== TYPES ====================

export type StatutService =
  | "actif"
  | "en_pause"
  | "en_attente"
  | "a_modifier"
  | "suspendre";

export interface PackageFeature {
  id: string;
  label: string;
  value: string | number | boolean;
  type: "text" | "number" | "boolean";
  icon?: string;
  unit?: string;
}

export interface Package {
  id?: string;
  name: "Basic" | "Standard" | "Premium";
  price: string;
  deliveryDays: string;
  revisions: string;
  description: string;
  features?: PackageFeature[];
  highlights?: string[];
  popular?: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
  isEditing?: boolean;
  isOpen?: boolean;
}

export interface Requirement {
  question: string;
  type: "text" | "choice" | "file";
  required: boolean;
  options?: string[];
  multipleChoice?: boolean;
  isEditing?: boolean;
  isOpen?: boolean;
}

export interface ServiceImage {
  id: string;
  name: string;
  url: string;
  path: string;
  type: string;
}

export interface ServiceDocument {
  id: string;
  name: string;
  url: string;
  path: string;
  type: string;
  size: string;
}

export interface Service {
  id: string;
  freelance_id: string;
  title: string;
  category: string;
  subcategory: string;
  metadata: Record<string, any>;
  tags: string[];
  packages: Package[];
  description: string;
  faq: FAQ[];
  requirements: Requirement[];
  images: ServiceImage[];
  video_url: string;
  video_path: string;
  documents: ServiceDocument[];
  statut: StatutService;
  isdeleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceFormData {
  freelance_id: string;
  title: string;
  category: string;
  subcategory: string;
  metadata: Record<string, any>;
  tags: string[];
  packages: Package[];
  description: string;
  faq: FAQ[];
  requirements: Requirement[];
  images: ServiceImage[];
  videoUrl?: string;
  videoPath?: string;
  documents: ServiceDocument[];
  statut?: StatutService;
}

export interface UploadResult {
  url: string;
  path: string;
  originalSize: number;
  compressedSize: number;
  compressionRate: number;
}

// ==================== CONTEXT TYPE ====================

export interface ServicesContextType {
  services: Service[];
  isLoading: boolean;
  error: string | null;

  // CRUD Operations
  ajouterService: (data: ServiceFormData) => Promise<Service | null>;
  modifierService: (
    id: string,
    data: Partial<ServiceFormData>
  ) => Promise<void>;
  supprimerService: (id: string) => Promise<void>;
  supprimerServiceDefinitif: (id: string) => Promise<void>;
  restaurerService: (id: string) => Promise<void>;

  // Gestion des images
  uploadImage: (
    file: File,
    freelanceId: string
  ) => Promise<ServiceImage | null>;
  deleteImage: (path: string) => Promise<boolean>;
  isUploadingImage: boolean;
  imageCompressionProgress: number;

  // Gestion des documents
  uploadDocument: (
    file: File,
    freelanceId: string
  ) => Promise<ServiceDocument | null>;
  deleteDocument: (path: string) => Promise<boolean>;
  isUploadingDocument: boolean;

  // Gestion des vidéos
  uploadVideo: (
    file: File,
    freelanceId: string
  ) => Promise<UploadResult | null>;
  deleteVideo: (path: string) => Promise<boolean>;
  isUploadingVideo: boolean;
  isCompressingVideo: boolean;
  videoCompressionProgress: number;
  videoUploadProgress: number;
  videoUploadStep:
    | "idle"
    | "validating"
    | "compressing"
    | "uploading"
    | "complete";

  // Gestion du statut
  changerStatut: (id: string, nouveauStatut: StatutService) => Promise<void>;
  activerService: (id: string) => Promise<void>;
  mettreEnPause: (id: string) => Promise<void>;
  mettreEnAttente: (id: string) => Promise<void>;
  marquerAModifier: (id: string) => Promise<void>;

  // Utilitaires
  rechercherServices: (terme: string) => Service[];
  getServiceById: (id: string) => Service | undefined;
  getServicesByFreelanceId: (freelanceId: string) => Service[];
  getServicesByStatut: (statut: StatutService) => Service[];
  rechargerServices: () => Promise<void>;
}

// ==================== CONTEXT ====================

const ServicesContext = createContext<ServicesContextType | undefined>(
  undefined
);

// ==================== PROVIDER ====================

interface ServicesProviderProps {
  children: ReactNode;
}

export const ServicesProvider: React.FC<ServicesProviderProps> = ({
  children,
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // États pour l'upload d'images
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [imageCompressionProgress, setImageCompressionProgress] =
    useState<number>(0);

  // États pour l'upload de documents
  const [isUploadingDocument, setIsUploadingDocument] =
    useState<boolean>(false);

  // États pour l'upload vidéo
  const [isUploadingVideo, setIsUploadingVideo] = useState<boolean>(false);
  const [isCompressingVideo, setIsCompressingVideo] = useState<boolean>(false);
  const [videoCompressionProgress, setVideoCompressionProgress] =
    useState<number>(0);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number>(0);
  const [videoUploadStep, setVideoUploadStep] = useState<
    "idle" | "validating" | "compressing" | "uploading" | "complete"
  >("idle");

  // ==================== CHARGEMENT DES DONNÉES ====================

  const rechargerServices = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const servicesRows = await SelectData("services");

      if (servicesRows && Array.isArray(servicesRows)) {
        const servicesActifs: Service[] = (servicesRows as Service[]).filter(
          (s: Service) => !s.isdeleted
        );
        setServices(servicesActifs);
      } else {
        setServices([]);
      }
    } catch (e: unknown) {
      const errorMessage: string =
        e instanceof Error
          ? e.message
          : "Erreur lors du chargement des services";
      setError(errorMessage);
      console.error("Erreur rechargerServices:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ==================== GESTION DES IMAGES ====================

  const uploadImage = async (
    file: File,
    freelanceId: string
  ): Promise<ServiceImage | null> => {
    const originalSize = file.size;

    try {
      setIsUploadingImage(true);
      setError(null);
      setImageCompressionProgress(0);

      // Validation du type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Format d'image non supporté. Utilisez JPG, PNG ou WebP"
        );
      }

      // Vérifier la taille initiale
      const maxInitialSizeMB = 20;
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxInitialSizeMB) {
        throw new Error(
          `L'image fait ${fileSizeMB.toFixed(
            2
          )}MB. Maximum ${maxInitialSizeMB}MB`
        );
      }

      // Obtenir les métadonnées
      const metadata = await getImageMetadata(file);
      console.log("📸 Métadonnées image:", metadata);

      // Compression de l'image
      const compressedFile = await compressImage(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        onProgress: (progress) => {
          setImageCompressionProgress(progress);
        },
      });

      const compressedSize = compressedFile.size;
      const compressionRate = (1 - compressedSize / originalSize) * 100;
      console.log(`📊 Compression image: ${compressionRate.toFixed(0)}%`);

      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const fileExt = file.name.split(".").pop();
      const fileName = `${timestamp}-${randomStr}.${fileExt}`;
      const filePath = `${freelanceId}/${fileName}`;

      // Upload vers Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("service-images")
        .upload(filePath, compressedFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: compressedFile.type,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      if (!data) {
        throw new Error("Aucune donnée retournée après l'upload");
      }

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from("service-images")
        .getPublicUrl(filePath);

      return {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        url: urlData.publicUrl,
        path: filePath,
        type: "image",
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'upload de l'image";
      setError(errorMessage);
      console.error("❌ Erreur upload image:", err);
      return null;
    } finally {
      setIsUploadingImage(false);
      setTimeout(() => setImageCompressionProgress(0), 1000);
    }
  };

  const deleteImage = async (path: string): Promise<boolean> => {
    try {
      setError(null);

      const { error: deleteError } = await supabase.storage
        .from("service-images")
        .remove([path]);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      console.log("✅ Image supprimée:", path);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la suppression";
      setError(errorMessage);
      console.error("❌ Erreur suppression image:", err);
      return false;
    }
  };

  // ==================== GESTION DES DOCUMENTS ====================

  const uploadDocument = async (
    file: File,
    freelanceId: string
  ): Promise<ServiceDocument | null> => {
    try {
      setIsUploadingDocument(true);
      setError(null);

      // Validation du type
      if (file.type !== "application/pdf") {
        throw new Error("Seuls les fichiers PDF sont autorisés");
      }

      // Vérifier la taille
      const maxSizeMB = 10;
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        throw new Error(
          `Le document fait ${fileSizeMB.toFixed(2)}MB. Maximum ${maxSizeMB}MB`
        );
      }

      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const fileName = `${timestamp}-${randomStr}.pdf`;
      const filePath = `${freelanceId}/${fileName}`;

      // Upload vers Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("service-documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: "application/pdf",
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      if (!data) {
        throw new Error("Aucune donnée retournée après l'upload");
      }

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from("service-documents")
        .getPublicUrl(filePath);

      return {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        url: urlData.publicUrl,
        path: filePath,
        type: "pdf",
        size: fileSizeMB.toFixed(1) + "MB",
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'upload du document";
      setError(errorMessage);
      console.error("❌ Erreur upload document:", err);
      return null;
    } finally {
      setIsUploadingDocument(false);
    }
  };

  const deleteDocument = async (path: string): Promise<boolean> => {
    try {
      setError(null);

      const { error: deleteError } = await supabase.storage
        .from("service-documents")
        .remove([path]);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      console.log("✅ Document supprimé:", path);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la suppression";
      setError(errorMessage);
      console.error("❌ Erreur suppression document:", err);
      return false;
    }
  };

  // ==================== GESTION DES VIDÉOS ====================

  const uploadVideo = async (
    file: File,
    freelanceId: string
  ): Promise<UploadResult | null> => {
    const originalSize = file.size;

    try {
      setIsUploadingVideo(true);
      setError(null);
      setVideoCompressionProgress(0);
      setVideoUploadProgress(0);

      setVideoUploadStep("validating");

      const allowedTypes = [
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
        "video/webm",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Format vidéo non supporté. Utilisez MP4, MOV, AVI ou WebM"
        );
      }

      const metadata = await getVideoMetadata(file);
      console.log("📹 Métadonnées vidéo:", metadata);

      if (metadata.duration > 75) {
        throw new Error(
          `La vidéo dure ${Math.round(metadata.duration)}s. Maximum 75 secondes`
        );
      }

      const maxInitialSizeMB = 200;
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxInitialSizeMB) {
        throw new Error(
          `La vidéo fait ${fileSizeMB.toFixed(
            2
          )}MB. Maximum ${maxInitialSizeMB}MB`
        );
      }

      setVideoUploadStep("compressing");
      setIsCompressingVideo(true);

      const compressedFile = await compressVideo(file, {
        quality: 28,
        maxDuration: 75,
        maxSize: 50,
        onProgress: (progress) => {
          setVideoCompressionProgress(progress);
        },
      });

      setIsCompressingVideo(false);
      const compressedSize = compressedFile.size;
      const compressionRate = (1 - compressedSize / originalSize) * 100;

      console.log(`📊 Compression vidéo: ${compressionRate.toFixed(0)}%`);

      setVideoUploadStep("uploading");
      setVideoUploadProgress(0);

      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const fileName = `${timestamp}-${randomStr}.mp4`;
      const filePath = `${freelanceId}/${fileName}`;

      const progressInterval = setInterval(() => {
        setVideoUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 200);

      const { data, error: uploadError } = await supabase.storage
        .from("service-videos")
        .upload(filePath, compressedFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: "video/mp4",
        });

      clearInterval(progressInterval);
      setVideoUploadProgress(100);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      if (!data) {
        throw new Error("Aucune donnée retournée après l'upload");
      }

      const { data: urlData } = supabase.storage
        .from("service-videos")
        .getPublicUrl(filePath);

      setVideoUploadStep("complete");

      return {
        url: urlData.publicUrl,
        path: filePath,
        originalSize,
        compressedSize,
        compressionRate,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du traitement de la vidéo";
      setError(errorMessage);
      console.error("❌ Erreur upload vidéo:", err);
      return null;
    } finally {
      setIsUploadingVideo(false);
      setIsCompressingVideo(false);
      setTimeout(() => {
        setVideoCompressionProgress(0);
        setVideoUploadProgress(0);
        setVideoUploadStep("idle");
      }, 2000);
    }
  };

  const deleteVideo = async (path: string): Promise<boolean> => {
    try {
      setError(null);

      const { error: deleteError } = await supabase.storage
        .from("service-videos")
        .remove([path]);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      console.log("✅ Vidéo supprimée:", path);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la suppression";
      setError(errorMessage);
      console.error("❌ Erreur suppression vidéo:", err);
      return false;
    }
  };

  // ==================== AJOUTER SERVICE ====================

  const ajouterService = async (
    data: ServiceFormData
  ): Promise<Service | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // VALIDATION MINIMALE - Seulement les champs essentiels
      if (!data.title || !data.category || !data.subcategory) {
        throw new Error(
          "Le titre, la catégorie et la sous-catégorie sont obligatoires"
        );
      }

      // DÉTERMINER LE STATUT AUTOMATIQUEMENT
      const isComplete = checkServiceComplete(data);
      const statut = isComplete ? "actif" : "en_attente";

      const serviceData = {
        freelance_id: data.freelance_id,
        title: data.title,
        category: data.category,
        subcategory: data.subcategory,
        metadata: data.metadata || {},
        tags: data.tags || [],
        packages: data.packages || [],
        description: data.description || "",
        faq: data.faq || [],
        requirements: data.requirements || [],
        images: data.images || [],
        video_url: data.videoUrl || "",
        video_path: data.videoPath || "",
        documents: data.documents || [],
        statut: statut,
        isdeleted: false,
      };

      const result = await InsertDataReturn("services", serviceData);

      if (!result.success) {
        throw new Error(
          result.error?.message || "Erreur lors de l'ajout du service"
        );
      }

      const nouveauService = result.rows?.[0] as Service | undefined;

      if (!nouveauService) {
        throw new Error("Aucun service retourné après l'insertion");
      }

      await rechargerServices();
      return nouveauService;
    } catch (e: unknown) {
      const errorMessage: string =
        e instanceof Error ? e.message : "Erreur lors de l'ajout du service";
      setError(errorMessage);
      console.error("❌ Erreur ajouterService:", e);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== FONCTION POUR VÉRIFIER SI LE SERVICE EST COMPLET ====================

  const checkServiceComplete = (data: ServiceFormData): boolean => {
    // 1. Vérifier le titre (minimum 15 caractères)
    if (!data.title || data.title.length < 15) {
      return false;
    }

    // 2. Vérifier la catégorie et sous-catégorie
    if (!data.category || !data.subcategory) {
      return false;
    }

    // 3. Vérifier les packages (au moins 1 package valide)
    if (!data.packages || data.packages.length === 0) {
      return false;
    }

    for (const pkg of data.packages) {
      if (!pkg.price || parseFloat(pkg.price) < 5) {
        return false;
      }
      if (!pkg.deliveryDays || parseInt(pkg.deliveryDays) < 1) {
        return false;
      }
      if (!pkg.revisions) {
        return false;
      }
      if (!pkg.description || pkg.description.length < 20) {
        return false;
      }
    }

    // 4. Vérifier la description (minimum 120 caractères sans HTML)
    if (!data.description) {
      return false;
    }
    const textLength = data.description.replace(/<[^>]*>/g, "").length;
    if (textLength < 120) {
      return false;
    }

    // 5. Tous les champs obligatoires sont remplis
    return true;
  };

  // ==================== MODIFIER SERVICE ====================

  const modifierService = async (
    id: string,
    data: Partial<ServiceFormData>
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const serviceExistant = services.find((s) => s.id === id);

      if (!serviceExistant) {
        throw new Error("Service introuvable");
      }

      const updateData: any = { ...data };
      if (data.videoUrl !== undefined) {
        updateData.video_url = data.videoUrl;
        delete updateData.videoUrl;
      }
      if (data.videoPath !== undefined) {
        updateData.video_path = data.videoPath;
        delete updateData.videoPath;
      }

      // RECALCULER LE STATUT APRÈS LA MISE À JOUR
      const updatedServiceData = {
        ...serviceExistant,
        ...updateData,
      };

      // Convertir back les champs pour la vérification
      const dataForCheck: ServiceFormData = {
        freelance_id: updatedServiceData.freelance_id,
        title: updatedServiceData.title,
        category: updatedServiceData.category,
        subcategory: updatedServiceData.subcategory,
        metadata: updatedServiceData.metadata,
        tags: updatedServiceData.tags,
        packages: updatedServiceData.packages,
        description: updatedServiceData.description,
        faq: updatedServiceData.faq,
        requirements: updatedServiceData.requirements,
        images: updatedServiceData.images,
        videoUrl: updatedServiceData.video_url,
        videoPath: updatedServiceData.video_path,
        documents: updatedServiceData.documents,
      };

      const isComplete = checkServiceComplete(dataForCheck);

      // Ne mettre à jour le statut que s'il n'est pas déjà "actif" ou "suspendre"
      if (serviceExistant.statut !== "suspendre") {
        updateData.statut = isComplete ? "actif" : "en_attente";
      }

      const result = await UpdateData("services", id, updateData);

      if (!result) {
        throw new Error("Erreur lors de la modification du service");
      }

      await rechargerServices();
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

  const supprimerService = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const service = services.find((s) => s.id === id);

      // Supprimer tous les fichiers associés
      if (service) {
        // Supprimer les images
        if (service.images && service.images.length > 0) {
          for (const image of service.images) {
            if (image.path) {
              await deleteImage(image.path);
            }
          }
        }

        // Supprimer les documents
        if (service.documents && service.documents.length > 0) {
          for (const doc of service.documents) {
            if (doc.path) {
              await deleteDocument(doc.path);
            }
          }
        }

        // Supprimer la vidéo
        if (service.video_path) {
          await deleteVideo(service.video_path);
        }
      }

      const result = await UpdateData("services", id, {
        isdeleted: true,
      });

      if (!result) {
        throw new Error("Erreur lors de la suppression du service");
      }

      await rechargerServices();
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

  const supprimerServiceDefinitif = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const service = services.find((s) => s.id === id);

      if (service) {
        if (service.images && service.images.length > 0) {
          for (const image of service.images) {
            if (image.path) await deleteImage(image.path);
          }
        }

        if (service.documents && service.documents.length > 0) {
          for (const doc of service.documents) {
            if (doc.path) await deleteDocument(doc.path);
          }
        }

        if (service.video_path) {
          await deleteVideo(service.video_path);
        }
      }

      const result = await DeleteData("services", id);

      if (!result) {
        throw new Error("Erreur lors de la suppression définitive du service");
      }

      await rechargerServices();
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

  // ==================== RESTAURER SERVICE ====================

  const restaurerService = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await UpdateData("services", id, {
        isdeleted: false,
      });

      if (!result) {
        throw new Error("Erreur lors de la restauration du service");
      }

      await rechargerServices();
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
    nouveauStatut: StatutService
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await UpdateData("services", id, {
        statut: nouveauStatut,
      });

      if (!result) {
        throw new Error("Erreur lors du changement de statut");
      }

      await rechargerServices();
    } catch (e: unknown) {
      const errorMessage: string =
        e instanceof Error ? e.message : "Erreur lors du changement de statut";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const activerService = async (id: string): Promise<void> => {
    await changerStatut(id, "actif");
  };

  const mettreEnPause = async (id: string): Promise<void> => {
    await changerStatut(id, "en_pause");
  };

  const mettreEnAttente = async (id: string): Promise<void> => {
    await changerStatut(id, "en_attente");
  };

  const marquerAModifier = async (id: string): Promise<void> => {
    await changerStatut(id, "a_modifier");
  };

  // ==================== UTILITAIRES ====================

  const rechercherServices = (terme: string): Service[] => {
    if (!terme.trim()) return services;

    const q: string = terme.toLowerCase().trim();

    return services.filter((s: Service) => {
      const searchableFields: string[] = [
        s.title,
        s.category,
        s.subcategory,
        s.description,
        ...s.tags,
      ].filter(Boolean) as string[];

      return searchableFields.some((v: string) => v.toLowerCase().includes(q));
    });
  };

  const getServiceById = (id: string): Service | undefined => {
    return services.find((s: Service) => s.id === id);
  };

  const getServicesByFreelanceId = (freelanceId: string): Service[] => {
    return services.filter((s: Service) => s.freelance_id === freelanceId);
  };

  const getServicesByStatut = (statut: StatutService): Service[] => {
    return services.filter((s: Service) => s.statut === statut);
  };

  // ==================== EFFET INITIAL ====================

  useEffect(() => {
    rechargerServices();
  }, [rechargerServices]);

  // ==================== PROVIDER VALUE ====================

  const contextValue: ServicesContextType = {
    services,
    isLoading,
    error,
    ajouterService,
    modifierService,
    supprimerService,
    supprimerServiceDefinitif,
    restaurerService,
    uploadImage,
    deleteImage,
    isUploadingImage,
    imageCompressionProgress,
    uploadDocument,
    deleteDocument,
    isUploadingDocument,
    uploadVideo,
    deleteVideo,
    isUploadingVideo,
    isCompressingVideo,
    videoCompressionProgress,
    videoUploadProgress,
    videoUploadStep,
    changerStatut,
    activerService,
    mettreEnPause,
    mettreEnAttente,
    marquerAModifier,
    rechercherServices,
    getServiceById,
    getServicesByFreelanceId,
    getServicesByStatut,
    rechargerServices,
  };

  return (
    <ServicesContext.Provider value={contextValue}>
      {children}
    </ServicesContext.Provider>
  );
};

// ==================== HOOK PERSONNALISÉ ====================

export const useServices = (): ServicesContextType => {
  const ctx = useContext(ServicesContext);
  if (!ctx) {
    throw new Error("useServices must be used within a ServicesProvider");
  }
  return ctx;
};
