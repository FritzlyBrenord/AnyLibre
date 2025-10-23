"use client";
import {
  InsertDataReturn,
  UpdateData,
  DeleteData,
  SelectData,
} from "@/Config/SupabaseData";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./ContextUser";
import { supabase } from "@/Config/supabase";
import { compressVideo, getVideoMetadata } from "@/Utils/lib/videoCompression";
import { compressImage, getImageMetadata } from "@/Utils/lib/imageCompression";

// ============= INTERFACES =============

interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  title?: string;
  conversation_type: "direct" | "group" | "order" | "project" | "dispute";
  is_archived_user1: boolean;
  is_archived_user2: boolean;
  is_blocked_user1: boolean;
  is_blocked_user2: boolean;
  is_spam_user1: boolean;
  is_spam_user2: boolean;
  is_starred_user1: boolean;
  is_starred_user2: boolean;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  order_id?: string;
  service_id?: string;
  project_title?: string;
  budget_amount?: number;
  budget_currency?: string;
  deadline?: string;
  is_deleted_user1: boolean;
  is_deleted_user2: boolean;
  deleted_at_user1?: string;
  deleted_at_user2?: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  reply_to_id?: string;
  content?: string;
  message_type:
    | "text"
    | "image"
    | "video"
    | "file"
    | "order"
    | "system"
    | "warning"
    | "proposal"
    | "milestone"
    | "payment"
    | "delivery";
  is_read_user1: boolean;
  is_read_user2: boolean;
  read_at_user1?: string;
  read_at_user2?: string;
  is_starred: boolean;
  is_edited: boolean;
  edited_at?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  thumbnail_url?: string;
  order_details?: any;
  milestone_number?: number;
  payment_amount?: number;
  delivery_date?: string;
  proposal_details?: any;
  created_at: string;
  updated_at: string;
  is_deleted_user1: boolean;
  is_deleted_user2: boolean;
  deleted_at_user1?: string;
  deleted_at_user2?: string;
}

interface ConversationWithDetails extends Conversation {
  otherUser?: {
    id: string;
    nom_utilisateur: string;
    email: string;
    profile_image?: string;
    user_type?: string;
  };
  lastMessage?: Message;
  unreadCount?: number;
}

// ============= TYPES =============

interface MessagingContextType {
  // Conversations
  conversations: ConversationWithDetails[];
  currentConversation: ConversationWithDetails | null;
  GetOrCreateConversation: (
    otherUserId: string,
    conversationType?: string,
    orderDetails?: any
  ) => Promise<Conversation | null>;
  GetConversationById: (conversationId: string) => Promise<Conversation | null>;
  GetUserConversations: (userId: string) => Promise<ConversationWithDetails[]>;
  DeleteConversation: (conversationId: string) => Promise<boolean>;
  ArchiveConversation: (
    conversationId: string,
    archive: boolean
  ) => Promise<boolean>;
  BlockConversation: (
    conversationId: string,
    block: boolean
  ) => Promise<boolean>;
  StarConversation: (conversationId: string, star: boolean) => Promise<boolean>;
  MarkConversationAsSpam: (
    conversationId: string,
    spam: boolean
  ) => Promise<boolean>;
  SetCurrentConversation: (
    conversation: ConversationWithDetails | null
  ) => void;
  uploadImage: (file: File, userId: string) => Promise<any>;
  uploadVideo: (file: File, userId: string) => Promise<any>;
  uploadDocument: (file: File, userId: string) => Promise<any>;
  deleteImage: (path: string) => Promise<boolean>;
  deleteVideo: (path: string) => Promise<boolean>;
  deleteDocument: (path: string) => Promise<boolean>;
  isUploadingImage: boolean;
  isUploadingVideo: boolean;
  isUploadingDocument: boolean;
  isCompressingVideo: boolean;
  videoCompressionProgress: number;
  videoUploadProgress: number;
  imageCompressionProgress: number;
  videoUploadStep:
    | "idle"
    | "validating"
    | "compressing"
    | "uploading"
    | "complete";
  // Messages
  messages: Message[];
  SendMessage: (
    conversationId: string,
    content: string,
    messageType?: string,
    fileData?: any
  ) => Promise<Message | null>;
  GetConversationMessages: (conversationId: string) => Promise<Message[]>;
  MarkMessageAsRead: (messageId: string) => Promise<boolean>;
  MarkAllMessagesAsRead: (conversationId: string) => Promise<boolean>;
  DeleteMessage: (messageId: string) => Promise<boolean>;
  EditMessage: (messageId: string, newContent: string) => Promise<boolean>;
  StarMessage: (messageId: string, star: boolean) => Promise<boolean>;
  ReplyToMessage: (
    conversationId: string,
    content: string,
    replyToId: string
  ) => Promise<Message | null>;

  // Fonctionnalités freelance
  SendProposal: (
    conversationId: string,
    proposalData: any
  ) => Promise<Message | null>;
  SendMilestone: (
    conversationId: string,
    milestoneData: any
  ) => Promise<Message | null>;
  SendPaymentRequest: (
    conversationId: string,
    paymentData: any
  ) => Promise<Message | null>;

  SendMessageWithFile: (
    conversationId: string,
    file: File,
    messageType?: "image" | "video" | "file"
  ) => Promise<Message | null>;
  // États
  loading: boolean;
  error: string | null;
  realtimeConnected: boolean;
  RefreshConversations: () => Promise<void>;
  RefreshMessages: (conversationId: string) => Promise<void>;
}

// ============= CONTEXTE =============

const MessagingContext = createContext<MessagingContextType | undefined>(
  undefined
);

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentSession, GetUserById } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>(
    []
  );
  const [currentConversation, setCurrentConversation] =
    useState<ConversationWithDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [realtimeConnected, setRealtimeConnected] = useState<boolean>(false);
  const [realtimeSubscription, setRealtimeSubscription] = useState<any>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [isCompressingVideo, setIsCompressingVideo] = useState(false);
  const [videoCompressionProgress, setVideoCompressionProgress] = useState(0);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [imageCompressionProgress, setImageCompressionProgress] = useState(0);
  const [videoUploadStep, setVideoUploadStep] = useState<
    "idle" | "validating" | "compressing" | "uploading" | "complete"
  >("idle");
  // ============= CONFIGURATION REALTIME =============

  // ============= FONCTIONS UPLOAD FICHIERS =============

  // ============= FONCTIONS UPLOAD FICHIERS =============

  const GetUserConversations = useCallback(
    async (userId: string): Promise<ConversationWithDetails[]> => {
      try {
        setLoading(true);
        setError(null);

        const allConversations = await SelectData("conversations");
        const allMessages = await SelectData("messages");

        if (!allConversations) return [];

        // Filtrer les conversations de l'utilisateur avec sécurité
        const userConversations = allConversations.filter(
          (conv: Conversation) => {
            const isUser1 = conv.user1_id === userId;
            const isUser2 = conv.user2_id === userId;

            if (isUser1) {
              return !conv.is_deleted_user1 && !conv.is_blocked_user2;
            }
            if (isUser2) {
              return !conv.is_deleted_user2 && !conv.is_blocked_user1;
            }
            return false;
          }
        );

        // Enrichir avec les détails
        const enrichedConversations: ConversationWithDetails[] =
          await Promise.all(
            userConversations.map(async (conv: Conversation) => {
              const otherUserId =
                conv.user1_id === userId ? conv.user2_id : conv.user1_id;
              const otherUser = await GetUserById(otherUserId);

              // Récupérer les messages de la conversation
              const convMessages = allMessages
                ?.filter((msg: Message) => {
                  const isInConv = msg.conversation_id === conv.id;
                  const isDeleted =
                    conv.user1_id === userId
                      ? msg.is_deleted_user1
                      : msg.is_deleted_user2;
                  return isInConv && !isDeleted;
                })
                .sort(
                  (a: Message, b: Message) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                );

              const lastMessage =
                convMessages && convMessages.length > 0
                  ? convMessages[0]
                  : undefined;

              // Compter les messages non lus
              const unreadCount =
                convMessages?.filter((msg: Message) => {
                  const isRead =
                    conv.user1_id === userId
                      ? msg.is_read_user1
                      : msg.is_read_user2;
                  return msg.sender_id !== userId && !isRead;
                }).length || 0;

              return {
                ...conv,
                otherUser: otherUser
                  ? {
                      id: otherUser.id,
                      nom_utilisateur: otherUser.nom_utilisateur,
                      email: otherUser.email,
                      profile_image: otherUser.profile_image,
                      user_type: otherUser.role,
                    }
                  : undefined,
                lastMessage,
                unreadCount,
              };
            })
          );

        // Trier par dernière activité
        enrichedConversations.sort(
          (a, b) =>
            new Date(b.last_message_at).getTime() -
            new Date(a.last_message_at).getTime()
        );

        return enrichedConversations;
      } catch (error: any) {
        console.error("❌ Erreur GetUserConversations:", error);
        setError(
          error.message || "Erreur lors de la récupération des conversations"
        );
        return [];
      } finally {
        setLoading(false);
      }
    },
    [GetUserById]
  );
  const RefreshConversations = useCallback(async () => {
    if (currentSession?.user?.id) {
      const userConversations = await GetUserConversations(
        currentSession?.user?.id
      );
      setConversations(userConversations);
    }
  }, [GetUserConversations, currentSession?.user?.id]);

  const SendMessageWithFile = async (
    conversationId: string,
    file: File,
    messageType: "image" | "video" | "file" = "file"
  ): Promise<Message | null> => {
    try {
      setLoading(true);
      setError(null);

      const currentUserId = currentSession?.user?.id;
      if (!currentUserId) {
        setError("Utilisateur non connecté");
        return null;
      }

      // Déterminer le type d'upload
      let uploadFunction: (file: File, userId: string) => Promise<any>;
      let dbMessageType = messageType;

      if (messageType === "image") {
        uploadFunction = uploadImage;
      } else if (messageType === "video") {
        uploadFunction = uploadVideo;
      } else {
        uploadFunction = uploadDocument;
        dbMessageType = "file";
      }

      // Upload du fichier
      const uploadResult = await uploadFunction(file, currentUserId);

      if (!uploadResult) {
        throw new Error("Échec de l'upload du fichier");
      }

      // Préparer les données du fichier
      const fileData = {
        file_url: uploadResult.url || uploadResult.publicUrl,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
      };

      // Envoyer le message
      const message = await SendMessage(
        conversationId,
        file.name, // Contenu = nom du fichier
        dbMessageType,
        fileData
      );

      return message;
    } catch (error: any) {
      console.error("❌ Erreur SendMessageWithFile:", error);
      setError(error.message || "Erreur lors de l'envoi du fichier");
      return null;
    } finally {
      setLoading(false);
    }
  };
  // ✅ UPLOAD FICHIERS
  const uploadImage = async (file: File, userId: string): Promise<any> => {
    try {
      setIsUploadingImage(true);
      setError(null);

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Format d'image non supporté");
      }

      const compressedFile = await compressImage(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        onProgress: (progress: number) => {
          setImageCompressionProgress(progress);
        },
      });

      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const fileExt = file.name.split(".").pop();
      const fileName = `${timestamp}-${randomStr}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from("message-images")
        .upload(filePath, compressedFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: compressedFile.type,
        });

      if (uploadError) throw new Error(uploadError.message);
      if (!data) throw new Error("Pas de données retournées");

      const { data: urlData } = supabase.storage
        .from("message-images")
        .getPublicUrl(filePath);

      return {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        url: urlData.publicUrl,
        path: filePath,
        type: "image",
      };
    } catch (err: any) {
      setError(err.message || "Erreur upload image");
      console.error("Erreur upload image:", err);
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const uploadVideo = async (file: File, userId: string): Promise<any> => {
    try {
      setIsUploadingVideo(true);
      setError(null);

      const allowedTypes = [
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
        "video/webm",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Format vidéo non supporté");
      }

      const metadata = await getVideoMetadata(file);
      if (metadata.duration > 75) {
        throw new Error(
          `La vidéo dure ${Math.round(metadata.duration)}s. Maximum 75 secondes`
        );
      }

      setVideoUploadStep("compressing");
      setIsCompressingVideo(true);

      const compressedFile = await compressVideo(file, {
        quality: 28,
        maxDuration: 75,
        maxSize: 50,
        onProgress: (progress: number) => {
          setVideoCompressionProgress(progress);
        },
      });

      setIsCompressingVideo(false);
      setVideoUploadStep("uploading");

      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const fileName = `${timestamp}-${randomStr}.mp4`;
      const filePath = `${userId}/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from("message-videos")
        .upload(filePath, compressedFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: "video/mp4",
        });

      if (uploadError) throw new Error(uploadError.message);
      if (!data) throw new Error("Pas de données");

      const { data: urlData } = supabase.storage
        .from("message-videos")
        .getPublicUrl(filePath);

      setVideoUploadStep("complete");

      return {
        url: urlData.publicUrl,
        path: filePath,
      };
    } catch (err: any) {
      setError(err.message || "Erreur upload vidéo");
      console.error("Erreur upload vidéo:", err);
      return null;
    } finally {
      setIsUploadingVideo(false);
      setIsCompressingVideo(false);
    }
  };

  const uploadDocument = async (file: File, userId: string): Promise<any> => {
    try {
      setIsUploadingDocument(true);
      setError(null);

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/zip",
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error("Type de document non supporté");
      }

      const maxSizeMB = 10;
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        throw new Error(`Document trop volumineux: ${fileSizeMB.toFixed(2)}MB`);
      }

      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const fileExt = file.name.split(".").pop();
      const fileName = `${timestamp}-${randomStr}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from("message-documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) throw new Error(uploadError.message);
      if (!data) throw new Error("Pas de données");

      const { data: urlData } = supabase.storage
        .from("message-documents")
        .getPublicUrl(filePath);

      return {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        url: urlData.publicUrl,
        path: filePath,
        type: "file",
      };
    } catch (err: any) {
      setError(err.message || "Erreur upload document");
      console.error("Erreur upload document:", err);
      return null;
    } finally {
      setIsUploadingDocument(false);
    }
  };

  const deleteImage = async (path: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from("message-images")
        .remove([path]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Erreur suppression image:", err);
      return false;
    }
  };

  const deleteVideo = async (path: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from("message-videos")
        .remove([path]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Erreur suppression vidéo:", err);
      return false;
    }
  };

  const deleteDocument = async (path: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from("message-documents")
        .remove([path]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Erreur suppression document:", err);
      return false;
    }
  };

  const GetConversationMessages = useCallback(
    async (conversationId: string): Promise<Message[]> => {
      try {
        const currentUserId = currentSession?.user?.id;
        if (!currentUserId) return [];

        const conversation = await GetConversationById(conversationId);
        if (!conversation) return [];

        const allMessages = await SelectData("messages");
        if (!allMessages) return [];

        const isUser1 = conversation.user1_id === currentUserId;

        const conversationMessages = allMessages
          .filter((msg: Message) => {
            const isInConv = msg.conversation_id === conversationId;
            const isDeleted = isUser1
              ? msg.is_deleted_user1
              : msg.is_deleted_user2;
            return isInConv && !isDeleted;
          })
          .sort(
            (a: Message, b: Message) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );

        return conversationMessages;
      } catch (error) {
        console.error("Erreur GetConversationMessages:", error);
        return [];
      }
    },
    [currentSession?.user?.id]
  );
  const RefreshMessages = useCallback(
    async (conversationId: string) => {
      const conversationMessages = await GetConversationMessages(
        conversationId
      );
      setMessages(conversationMessages);
    },
    [GetConversationMessages]
  );
  const MarkMessageAsRead = useCallback(
    async (messageId: string): Promise<boolean> => {
      try {
        const currentUserId = currentSession?.user?.id;
        if (!currentUserId) return false;

        const allMessages = await SelectData("messages");
        const message = allMessages?.find((m: Message) => m.id === messageId);
        if (!message) return false;

        const conversation = await GetConversationById(message.conversation_id);
        if (!conversation) return false;

        const isUser1 = conversation.user1_id === currentUserId;
        const updateData = isUser1
          ? {
              is_read_user1: true,
              read_at_user1: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          : {
              is_read_user2: true,
              read_at_user2: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

        const success = await UpdateData("messages", messageId, updateData);

        if (success === true) {
          await RefreshMessages(message.conversation_id);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Erreur MarkMessageAsRead:", error);
        return false;
      }
    },
    [RefreshMessages, currentSession?.user?.id]
  );

  const handleNewMessage = useCallback(
    async (newMessage: Message) => {
      try {
        // Vérifier si l'utilisateur actuel a accès à cette conversation
        const conversation = await GetConversationById(
          newMessage.conversation_id
        );
        if (!conversation) return;

        const currentUserId = currentSession?.user?.id;
        if (!currentUserId) return;

        // Vérifier les droits d'accès
        const hasAccess =
          (conversation.user1_id === currentUserId &&
            !conversation.is_deleted_user1 &&
            !conversation.is_blocked_user2) ||
          (conversation.user2_id === currentUserId &&
            !conversation.is_deleted_user2 &&
            !conversation.is_blocked_user1);

        if (!hasAccess) return;

        // Vérifier si le message n'est pas déjà dans la liste
        const messageExists = messages.some((msg) => msg.id === newMessage.id);
        if (messageExists) return;

        // Si le message appartient à la conversation actuelle, l'ajouter
        if (
          currentConversation &&
          currentConversation.id === newMessage.conversation_id
        ) {
          setMessages((prev) => {
            // Éviter les doublons
            if (prev.some((msg) => msg.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });

          // Marquer comme lu si c'est l'utilisateur actuel qui regarde
          if (newMessage.sender_id !== currentUserId) {
            MarkMessageAsRead(newMessage.id);
          }
        }

        // Mettre à jour la dernière conversation
        await RefreshConversations();
      } catch (error) {
        console.error("❌ Erreur handleNewMessage:", error);
      }
    },
    [
      MarkMessageAsRead,
      RefreshConversations,
      currentConversation,
      currentSession?.user?.id,
      messages,
    ]
  );

  const handleUpdatedMessage = (updatedMessage: Message) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
    );
  };

  const handleUpdatedConversation = useCallback(
    async (updatedConversation: Conversation) => {
      await RefreshConversations();
    },
    [RefreshConversations]
  );

  const initializeRealtime = useCallback(() => {
    try {
      // S'abonner aux nouveaux messages
      const subscription = supabase
        .channel("messages-changes")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            handleNewMessage(payload.new as Message);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            handleUpdatedMessage(payload.new as Message);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "conversations",
          },
          (payload) => {
            handleUpdatedConversation(payload.new as Conversation);
          }
        )
        .subscribe((status) => {
          console.log("🔄 Statut Realtime:", status);
          setRealtimeConnected(status === "SUBSCRIBED");
        });

      setRealtimeSubscription(subscription);
    } catch (error) {
      console.error("❌ Erreur initialisation Realtime:", error);
    }
  }, [handleNewMessage, handleUpdatedConversation]);

  // ============= FONCTIONS CONVERSATIONS =============

  const GetOrCreateConversation = async (
    otherUserId: string,
    conversationType: string = "direct",
    orderDetails?: any
  ): Promise<Conversation | null> => {
    try {
      setLoading(true);
      setError(null);

      const currentUserId = currentSession?.user?.id;
      if (!currentUserId) {
        setError("Utilisateur non connecté");
        return null;
      }

      // Rechercher une conversation existante
      const allConversations = await SelectData("conversations");
      const existingConversation = allConversations?.find(
        (conv: Conversation) => {
          return (
            ((conv.user1_id === currentUserId &&
              conv.user2_id === otherUserId) ||
              (conv.user1_id === otherUserId &&
                conv.user2_id === currentUserId)) &&
            conv.conversation_type === conversationType
          );
        }
      );

      if (existingConversation) {
        return existingConversation as Conversation;
      }

      // Créer une nouvelle conversation
      const newConversation = {
        user1_id: currentUserId,
        user2_id: otherUserId,
        conversation_type: conversationType,
        is_archived_user1: false,
        is_archived_user2: false,
        is_blocked_user1: false,
        is_blocked_user2: false,
        is_spam_user1: false,
        is_spam_user2: false,
        is_starred_user1: false,
        is_starred_user2: false,
        is_deleted_user1: false,
        is_deleted_user2: false,
        last_message_at: new Date().toISOString(),
        ...(orderDetails && {
          order_id: orderDetails.order_id,
          service_id: orderDetails.service_id,
          project_title: orderDetails.project_title,
          budget_amount: orderDetails.budget_amount,
          budget_currency: orderDetails.budget_currency,
          deadline: orderDetails.deadline,
        }),
      };

      const result = await InsertDataReturn("conversations", newConversation);

      if (result?.success && result.rows && result.rows.length > 0) {
        await RefreshConversations();
        return result.rows[0] as Conversation;
      }

      setError("Erreur lors de la création de la conversation");
      return null;
    } catch (error: any) {
      console.error("❌ Erreur GetOrCreateConversation:", error);
      setError(error.message || "Erreur lors de la gestion de la conversation");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const GetConversationById = async (
    conversationId: string
  ): Promise<Conversation | null> => {
    try {
      const conversations = await SelectData("conversations");
      const conversation = conversations?.find(
        (c: Conversation) => c.id === conversationId
      );
      return conversation || null;
    } catch (error) {
      console.error("Erreur GetConversationById:", error);
      return null;
    }
  };

  useEffect(() => {
    if (currentSession?.isAuthenticated && currentSession?.user?.id) {
      initializeRealtime();
    }

    return () => {
      // Nettoyer l'abonnement Realtime
      if (realtimeSubscription) {
        realtimeSubscription.unsubscribe();
      }
    };
  }, [
    currentSession?.isAuthenticated,
    currentSession?.user?.id,
    initializeRealtime,
    realtimeSubscription,
  ]);

  const DeleteConversation = async (
    conversationId: string
  ): Promise<boolean> => {
    try {
      const currentUserId = currentSession?.user?.id;
      if (!currentUserId) return false;

      const conversation = await GetConversationById(conversationId);
      if (!conversation) return false;

      const isUser1 = conversation.user1_id === currentUserId;
      const updateData = isUser1
        ? {
            is_deleted_user1: true,
            deleted_at_user1: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        : {
            is_deleted_user2: true,
            deleted_at_user2: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

      const success = await UpdateData(
        "conversations",
        conversationId,
        updateData
      );

      if (success === true) {
        await RefreshConversations();
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(null);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur DeleteConversation:", error);
      return false;
    }
  };

  const ArchiveConversation = async (
    conversationId: string,
    archive: boolean
  ): Promise<boolean> => {
    try {
      const currentUserId = currentSession?.user?.id;
      if (!currentUserId) return false;

      const conversation = await GetConversationById(conversationId);
      if (!conversation) return false;

      const isUser1 = conversation.user1_id === currentUserId;
      const updateData = isUser1
        ? { is_archived_user1: archive, updated_at: new Date().toISOString() }
        : { is_archived_user2: archive, updated_at: new Date().toISOString() };

      const success = await UpdateData(
        "conversations",
        conversationId,
        updateData
      );

      if (success === true) {
        await RefreshConversations();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur ArchiveConversation:", error);
      return false;
    }
  };

  const BlockConversation = async (
    conversationId: string,
    block: boolean
  ): Promise<boolean> => {
    try {
      const currentUserId = currentSession?.user?.id;
      if (!currentUserId) return false;

      const conversation = await GetConversationById(conversationId);
      if (!conversation) return false;

      const isUser1 = conversation.user1_id === currentUserId;
      const updateData = isUser1
        ? { is_blocked_user1: block, updated_at: new Date().toISOString() }
        : { is_blocked_user2: block, updated_at: new Date().toISOString() };

      const success = await UpdateData(
        "conversations",
        conversationId,
        updateData
      );

      if (success === true) {
        await RefreshConversations();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur BlockConversation:", error);
      return false;
    }
  };

  const StarConversation = async (
    conversationId: string,
    star: boolean
  ): Promise<boolean> => {
    try {
      const currentUserId = currentSession?.user?.id;
      if (!currentUserId) return false;

      const conversation = await GetConversationById(conversationId);
      if (!conversation) return false;

      const isUser1 = conversation.user1_id === currentUserId;
      const updateData = isUser1
        ? { is_starred_user1: star, updated_at: new Date().toISOString() }
        : { is_starred_user2: star, updated_at: new Date().toISOString() };

      const success = await UpdateData(
        "conversations",
        conversationId,
        updateData
      );

      if (success === true) {
        await RefreshConversations();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur StarConversation:", error);
      return false;
    }
  };

  const MarkConversationAsSpam = async (
    conversationId: string,
    spam: boolean
  ): Promise<boolean> => {
    try {
      const currentUserId = currentSession?.user?.id;
      if (!currentUserId) return false;

      const conversation = await GetConversationById(conversationId);
      if (!conversation) return false;

      const isUser1 = conversation.user1_id === currentUserId;
      const updateData = isUser1
        ? { is_spam_user1: spam, updated_at: new Date().toISOString() }
        : { is_spam_user2: spam, updated_at: new Date().toISOString() };

      const success = await UpdateData(
        "conversations",
        conversationId,
        updateData
      );

      if (success === true) {
        await RefreshConversations();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur MarkConversationAsSpam:", error);
      return false;
    }
  };

  const SetCurrentConversation = (
    conversation: ConversationWithDetails | null
  ) => {
    setCurrentConversation(conversation);
    if (conversation) {
      RefreshMessages(conversation.id);
      MarkAllMessagesAsRead(conversation.id);
    } else {
      setMessages([]);
    }
  };

  // ============= FONCTIONS MESSAGES =============

  const SendMessage = async (
    conversationId: string,
    content: string,
    messageType: string = "text",
    fileData?: any
  ): Promise<Message | null> => {
    try {
      setLoading(true);
      setError(null);

      const currentUserId = currentSession?.user?.id;
      if (!currentUserId) {
        setError("Utilisateur non connecté");
        return null;
      }

      const messageData: any = {
        conversation_id: conversationId,
        sender_id: currentUserId,
        content: content.trim(),
        message_type: messageType,
        is_read_user1: false,
        is_read_user2: false,
        is_starred: false,
        is_edited: false,
        is_deleted_user1: false,
        is_deleted_user2: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (fileData) {
        messageData.file_url = fileData.file_url;
        messageData.file_name = fileData.file_name;
        messageData.file_size = fileData.file_size;
        messageData.file_type = fileData.file_type;
      }

      // ✅ UTILISER LA MÊME MÉTHODE QUE DANS TON AUTRE CONTEXTE
      const result = await InsertDataReturn("messages", messageData);

      if (result?.success && result.rows && result.rows.length > 0) {
        // Mettre à jour last_message_at de la conversation
        await UpdateData("conversations", conversationId, {
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        // Recharger les données
        await RefreshMessages(conversationId);
        await RefreshConversations();

        return result.rows[0] as Message;
      }

      setError("Erreur lors de l'envoi du message");
      return null;
    } catch (error: any) {
      console.error("❌ Erreur SendMessage:", error);
      setError(error.message || "Erreur lors de l'envoi du message");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const MarkAllMessagesAsRead = async (
    conversationId: string
  ): Promise<boolean> => {
    try {
      const currentUserId = currentSession?.user?.id;
      if (!currentUserId) return false;

      const conversationMessages = await GetConversationMessages(
        conversationId
      );
      const unreadMessages = conversationMessages.filter(
        (msg) => msg.sender_id !== currentUserId
      );

      for (const msg of unreadMessages) {
        const isUser1 =
          currentUserId ===
          (await GetConversationById(conversationId))?.user1_id;
        const updateData = isUser1
          ? {
              is_read_user1: true,
              read_at_user1: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          : {
              is_read_user2: true,
              read_at_user2: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

        await UpdateData("messages", msg.id, updateData);
      }

      await RefreshMessages(conversationId);
      await RefreshConversations();
      return true;
    } catch (error) {
      console.error("Erreur MarkAllMessagesAsRead:", error);
      return false;
    }
  };

  const DeleteMessage = async (messageId: string): Promise<boolean> => {
    try {
      const currentUserId = currentSession?.user?.id;
      if (!currentUserId) return false;

      const allMessages = await SelectData("messages");
      const message = allMessages?.find((m: Message) => m.id === messageId);
      if (!message) return false;

      const conversation = await GetConversationById(message.conversation_id);
      if (!conversation) return false;

      const isUser1 = conversation.user1_id === currentUserId;
      const updateData = isUser1
        ? {
            is_deleted_user1: true,
            deleted_at_user1: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        : {
            is_deleted_user2: true,
            deleted_at_user2: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

      const success = await UpdateData("messages", messageId, updateData);

      if (success === true && currentConversation) {
        await RefreshMessages(currentConversation.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur DeleteMessage:", error);
      return false;
    }
  };

  const EditMessage = async (
    messageId: string,
    newContent: string
  ): Promise<boolean> => {
    try {
      const success = await UpdateData("messages", messageId, {
        content: newContent,
        is_edited: true,
        edited_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (success === true && currentConversation) {
        await RefreshMessages(currentConversation.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur EditMessage:", error);
      return false;
    }
  };

  const StarMessage = async (
    messageId: string,
    star: boolean
  ): Promise<boolean> => {
    try {
      const success = await UpdateData("messages", messageId, {
        is_starred: star,
        updated_at: new Date().toISOString(),
      });

      if (success === true && currentConversation) {
        await RefreshMessages(currentConversation.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur StarMessage:", error);
      return false;
    }
  };

  const ReplyToMessage = async (
    conversationId: string,
    content: string,
    replyToId: string
  ): Promise<Message | null> => {
    return await SendMessage(conversationId, content, "text", {
      reply_to_id: replyToId,
    });
  };

  // ============= FONCTIONNALITÉS FREELANCE =============

  const SendProposal = async (
    conversationId: string,
    proposalData: any
  ): Promise<Message | null> => {
    const content = `Nouvelle proposition: ${proposalData.title} - ${proposalData.amount}${proposalData.currency}`;
    return await SendMessage(conversationId, content, "proposal", {
      proposal_details: proposalData,
    });
  };

  const SendMilestone = async (
    conversationId: string,
    milestoneData: any
  ): Promise<Message | null> => {
    const content = `Livrable: ${milestoneData.title} - ${milestoneData.amount}${milestoneData.currency}`;
    return await SendMessage(conversationId, content, "milestone", {
      milestone_number: milestoneData.number,
      payment_amount: milestoneData.amount,
      delivery_date: milestoneData.due_date,
    });
  };

  const SendPaymentRequest = async (
    conversationId: string,
    paymentData: any
  ): Promise<Message | null> => {
    const content = `Demande de paiement: ${paymentData.amount}${paymentData.currency}`;
    return await SendMessage(conversationId, content, "payment", {
      payment_amount: paymentData.amount,
      order_details: paymentData.order_details,
    });
  };

  // ============= FONCTIONS REFRESH =============

  // ============= EFFET INITIAL =============

  useEffect(() => {
    if (currentSession?.isAuthenticated && currentSession?.user?.id) {
      RefreshConversations();
    }
  }, [
    RefreshConversations,
    currentSession?.isAuthenticated,
    currentSession?.user?.id,
  ]);

  return (
    <MessagingContext.Provider
      value={{
        conversations,
        currentConversation,
        GetOrCreateConversation,
        GetConversationById,
        GetUserConversations,
        DeleteConversation,
        ArchiveConversation,
        BlockConversation,
        StarConversation,
        MarkConversationAsSpam,
        SendMessageWithFile,
        SetCurrentConversation,
        messages,
        uploadImage,
        uploadVideo,
        uploadDocument,
        deleteImage,
        deleteVideo,
        deleteDocument,

        error,

        isUploadingImage,
        isUploadingVideo,
        isUploadingDocument,
        isCompressingVideo,
        videoCompressionProgress,
        videoUploadProgress,
        imageCompressionProgress,
        videoUploadStep,
        SendMessage,
        GetConversationMessages,
        MarkMessageAsRead,
        MarkAllMessagesAsRead,
        DeleteMessage,
        EditMessage,
        StarMessage,
        ReplyToMessage,
        SendProposal,
        SendMilestone,

        SendPaymentRequest,
        loading,
        realtimeConnected,
        RefreshConversations,
        RefreshMessages,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = (): MessagingContextType => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error("useMessaging doit être utilisé dans un MessagingProvider");
  }
  return context;
};
