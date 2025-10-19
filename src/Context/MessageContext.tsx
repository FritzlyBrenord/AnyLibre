// contexts/MessagingContext.tsx - FILTRAGE CORRIGÉ + REALTIME
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

import {
  SelectData,
  InsertDataReturn,
  UpdateData,
  DeleteData,
  SubscribeToTable,
  UnsubscribeFromChannel,
} from "@/Config/SupabaseData";
import { useAuth } from "./ContextUser";
import { compressVideo, getVideoMetadata } from "@/Utils/lib/videoCompression";
import { compressImage, getImageMetadata } from "@/Utils/lib/imageCompression";
import { supabase } from "@/Config/supabase";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  reply_to_id?: string;
  content: string;
  message_type:
    | "text"
    | "image"
    | "video"
    | "file"
    | "order"
    | "system"
    | "warning";
  is_read: boolean;
  is_starred: boolean;
  is_edited: boolean;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  order_details?: any;
  read_at?: string;
  is_deleted_user1: boolean;
  is_deleted_user2: boolean;
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    nom_utilisateur: string;
    profile_image?: string;
  };
  reply_to?: Message;
}

interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  title?: string;
  conversation_type: "direct" | "group" | "order";
  is_archived: boolean;
  is_blocked: boolean;
  is_spam: boolean;
  is_starred: boolean;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  order_id?: string;
  other_user?: {
    id: string;
    nom_utilisateur: string;
    profile_image?: string;
    role: "client" | "freelance";
    email?: string;
    status?: string;
    phone?: string;
  };
  last_message?: Message;
  unread_count: number;
}

export interface MessagingContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;
  messages: Message[];
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
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
  sendMessage: (
    content: string,
    conversationId: string,
    file?: File,
    replyTo?: string
  ) => Promise<boolean>;
  createConversation: (
    otherUserId: string,
    initialMessage?: string
  ) => Promise<string | null>;
  markAsRead: (conversationId: string) => Promise<boolean>;
  toggleStar: (conversationId: string, messageId?: string) => Promise<boolean>;
  archiveConversation: (conversationId: string) => Promise<boolean>;
  reportConversation: (conversationId: string) => Promise<boolean>;
  deleteMessage: (
    messageId: string,
    conversationId: string
  ) => Promise<boolean>;
  deleteAllMessagesForUser: (conversationId: string) => Promise<boolean>;
  deleteConversation: (conversationId: string) => Promise<boolean>;
  uploadImage: (file: File, userId: string) => Promise<any>;
  uploadVideo: (file: File, userId: string) => Promise<any>;
  uploadDocument: (file: File, userId: string) => Promise<any>;
  deleteImage: (path: string) => Promise<boolean>;
  deleteVideo: (path: string) => Promise<boolean>;
  deleteDocument: (path: string) => Promise<boolean>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  isMobile: boolean;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const MessagingContext = createContext<MessagingContextType | undefined>(
  undefined
);

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentSession } = useAuth();
  const currentUserId = currentSession?.user?.id;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ RÉCUPÉRER LES DONNÉES UTILISATEUR
  const getUserData = useCallback(async (userId: string) => {
    try {
      const userData = await SelectData("users", {
        conditions: [{ column: "id", operator: "eq", value: userId }],
      });

      if (userData && userData.length > 0) {
        return {
          id: userData[0].id,
          nom_utilisateur: userData[0].nom_utilisateur,
          profile_image: userData[0].profile_image,
          role: userData[0].role,
          email: userData[0].email,
          status: userData[0].status,
          phone: userData[0].phone,
        };
      }
      return null;
    } catch (err) {
      console.error("Erreur récupération utilisateur:", err);
      return null;
    }
  }, []);

  // ✅ DÉTERMINER QUEL FLAG DE SUPPRESSION UTILISER
  const getDeleteFlagForUser = (conversation: any): string => {
    return conversation.user1_id === currentUserId
      ? "is_deleted_user1"
      : "is_deleted_user2";
  };

  // ✅ FILTRER LES MESSAGES VISIBLES (CLIENT-SIDE FILTER)
  const filterVisibleMessages = (allMessages: Message[]): Message[] => {
    return allMessages.filter((msg) => {
      // Si l'utilisateur courant est user1, vérifier is_deleted_user1
      // Si l'utilisateur courant est user2, vérifier is_deleted_user2
      const isCurrentUserUser1 =
        currentConversation?.user1_id === currentUserId;
      const deleteFlag = isCurrentUserUser1
        ? msg.is_deleted_user1
        : msg.is_deleted_user2;

      return !deleteFlag; // Afficher seulement si NON supprimé
    });
  };

  // ✅ CHARGER LES CONVERSATIONS
  const loadConversations = useCallback(async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);

      const userConversations = await SelectData("conversations", {
        conditions: [
          {
            column: "user1_id",
            operator: "eq",
            value: currentUserId,
          },
          {
            column: "user2_id",
            operator: "eq",
            value: currentUserId,
          },
        ],
        or: true,
        orderBy: { column: "last_message_at", ascending: false },
      });

      if (userConversations && Array.isArray(userConversations)) {
        const enrichedConversations = await Promise.all(
          userConversations.map(async (conv: any) => {
            try {
              const otherUserId =
                conv.user1_id === currentUserId ? conv.user2_id : conv.user1_id;

              const otherUser = await getUserData(otherUserId);
              const isCurrentUserUser1 = conv.user1_id === currentUserId;

              // ✅ RÉCUPÉRER TOUS LES MESSAGES
              const allMessages = await SelectData("messages", {
                conditions: [
                  {
                    column: "conversation_id",
                    operator: "eq",
                    value: conv.id,
                  },
                ],
                orderBy: { column: "created_at", ascending: false },
              });

              // ✅ FILTRER PAR FLAG DE SUPPRESSION (CLIENT-SIDE)
              const visibleMessages =
                allMessages?.filter((msg: any) => {
                  const deleteFlag = isCurrentUserUser1
                    ? msg.is_deleted_user1
                    : msg.is_deleted_user2;
                  return !deleteFlag;
                }) || [];

              // ✅ SI AUCUN MESSAGE VISIBLE → CACHER LA CONVERSATION
              if (visibleMessages.length === 0) {
                return null;
              }

              // ✅ RÉCUPÉRER LE DERNIER MESSAGE VISIBLE
              let lastMessageEnriched = null;
              if (visibleMessages.length > 0) {
                const sender = await getUserData(visibleMessages[0].sender_id);
                lastMessageEnriched = {
                  ...visibleMessages[0],
                  sender,
                };
              }

              // ✅ COMPTER LES NON-LUS
              const unreadMessages = visibleMessages.filter(
                (msg: any) => msg.sender_id !== currentUserId && !msg.is_read
              );

              const unread_count = unreadMessages.length;

              return {
                ...conv,
                other_user: otherUser,
                last_message: lastMessageEnriched,
                unread_count,
              };
            } catch (error) {
              console.error("Erreur enrichissement:", error);
              return null;
            }
          })
        );

        const validConversations = enrichedConversations.filter(
          (c) => c !== null
        );
        setConversations(validConversations);
      } else {
        setConversations([]);
      }
    } catch (err: any) {
      console.error("Erreur chargement conversations:", err);
      setError(err.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, [currentUserId, getUserData]);

  // ✅ CHARGER LES MESSAGES
  const loadMessages = useCallback(
    async (conversationId: string) => {
      if (!conversationId || !currentUserId) return;

      try {
        setLoading(true);

        const conversation = await SelectData("conversations", {
          conditions: [{ column: "id", operator: "eq", value: conversationId }],
        });

        if (!conversation || conversation.length === 0) return;

        const conv = conversation[0];
        const isCurrentUserUser1 = conv.user1_id === currentUserId;

        // Récupérer TOUS les messages
        const messagesData = await SelectData("messages", {
          conditions: [
            {
              column: "conversation_id",
              operator: "eq",
              value: conversationId,
            },
          ],
          orderBy: { column: "created_at", ascending: true },
        });

        if (messagesData && Array.isArray(messagesData)) {
          // ✅ FILTRER PAR FLAG DE SUPPRESSION (CLIENT-SIDE)
          const visibleMessages = messagesData.filter((msg: any) => {
            const deleteFlag = isCurrentUserUser1
              ? msg.is_deleted_user1
              : msg.is_deleted_user2;
            return !deleteFlag;
          });

          const enrichedMessages = await Promise.all(
            visibleMessages.map(async (msg: any) => {
              const sender = await getUserData(msg.sender_id);

              let reply_to = null;
              if (msg.reply_to_id) {
                const replyData = await SelectData("messages", {
                  conditions: [
                    { column: "id", operator: "eq", value: msg.reply_to_id },
                  ],
                });

                if (replyData && replyData.length > 0) {
                  const replySender = await getUserData(replyData[0].sender_id);
                  reply_to = {
                    ...replyData[0],
                    sender: replySender,
                  };
                }
              }

              return {
                ...msg,
                sender,
                reply_to,
              };
            })
          );

          setMessages(enrichedMessages);
        } else {
          setMessages([]);
        }
      } catch (err: any) {
        console.error("Erreur chargement messages:", err);
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    },
    [currentUserId, getUserData]
  );

  // ✅ MARQUER COMME LU
  const markAsRead = useCallback(
    async (conversationId: string): Promise<boolean> => {
      if (!currentUserId) return false;

      try {
        const unreadMessages = messages.filter(
          (msg) => !msg.is_read && msg.sender_id !== currentUserId
        );

        for (const message of unreadMessages) {
          await UpdateData("messages", message.id, {
            is_read: true,
            read_at: new Date().toISOString(),
          });
        }

        await loadMessages(conversationId);
        await loadConversations();

        return true;
      } catch (err: any) {
        console.error("Erreur marquage:", err);
        return false;
      }
    },
    [currentUserId, messages, loadMessages, loadConversations]
  );

  // ✅ ENVOYER MESSAGE
  const sendMessage = async (
    content: string,
    conversationId: string,
    file?: File,
    replyTo?: string
  ): Promise<boolean> => {
    if (!currentUserId) {
      console.error("currentUserId manquant");
      return false;
    }

    try {
      const messageData: any = {
        conversation_id: conversationId,
        sender_id: currentUserId,
        content: content.trim(),
        message_type: "text",
        is_read: false,
        is_starred: false,
        is_edited: false,
        is_deleted_user1: false,
        is_deleted_user2: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (replyTo) {
        messageData.reply_to_id = replyTo;
      }

      if (file) {
        let uploadResult = null;

        if (file.type.startsWith("image/")) {
          messageData.message_type = "image";
          uploadResult = await uploadImage(file, currentUserId);
        } else if (file.type.startsWith("video/")) {
          messageData.message_type = "video";
          uploadResult = await uploadVideo(file, currentUserId);
        } else {
          messageData.message_type = "file";
          uploadResult = await uploadDocument(file, currentUserId);
        }

        if (uploadResult) {
          messageData.file_url = uploadResult.url;
          messageData.file_name = file.name;
          messageData.file_size = file.size;
          messageData.file_type = file.type;
        } else {
          throw new Error("Upload échoué");
        }
      }

      const result = await InsertDataReturn("messages", messageData);

      if (result?.success) {
        await UpdateData("conversations", conversationId, {
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        await loadMessages(conversationId);
        await loadConversations();

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);

        return true;
      }

      return false;
    } catch (err: any) {
      console.error("Erreur envoi:", err);
      setError(err.message || "Erreur lors de l'envoi");
      return false;
    }
  };

  // ✅ CRÉER CONVERSATION
  const createConversation = async (
    otherUserId: string,
    initialMessage?: string
  ): Promise<string | null> => {
    if (!currentUserId || !otherUserId) {
      setError("ID utilisateur manquant");
      return null;
    }

    if (currentUserId === otherUserId) {
      setError("Impossible de créer conversation avec soi-même");
      return null;
    }

    try {
      const otherUserData = await getUserData(otherUserId);
      if (!otherUserData) {
        setError("Utilisateur non trouvé");
        return null;
      }

      const existingConversations = await SelectData("conversations", {
        conditions: [
          {
            column: "user1_id",
            operator: "eq",
            value: currentUserId,
          },
          {
            column: "user2_id",
            operator: "eq",
            value: otherUserId,
          },
          {
            column: "user1_id",
            operator: "eq",
            value: otherUserId,
          },
          {
            column: "user2_id",
            operator: "eq",
            value: currentUserId,
          },
        ],
        or: true,
      });

      if (existingConversations && existingConversations.length > 0) {
        const existingConv = existingConversations[0];

        if (initialMessage) {
          await sendMessage(initialMessage, existingConv.id);
        }

        return existingConv.id;
      }

      const conversationData = {
        user1_id: currentUserId,
        user2_id: otherUserId,
        conversation_type: "direct",
        is_archived: false,
        is_blocked: false,
        is_spam: false,
        is_starred: false,
        last_message_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = await InsertDataReturn("conversations", conversationData);

      if (result?.success && result.rows?.[0]?.id) {
        const conversationId = result.rows[0].id;

        if (initialMessage) {
          await sendMessage(initialMessage, conversationId);
        }

        await loadConversations();
        return conversationId;
      }

      setError("Erreur création conversation");
      return null;
    } catch (err: any) {
      console.error("Erreur:", err);
      setError(err.message || "Erreur");
      return null;
    }
  };

  // ✅ BASCULER ÉTOILE
  const toggleStar = async (
    conversationId: string,
    messageId?: string
  ): Promise<boolean> => {
    try {
      if (messageId) {
        const message = messages.find((msg) => msg.id === messageId);
        if (message) {
          await UpdateData("messages", messageId, {
            is_starred: !message.is_starred,
          });
          await loadMessages(conversationId);
        }
      } else {
        const conversation = conversations.find(
          (conv) => conv.id === conversationId
        );
        if (conversation) {
          await UpdateData("conversations", conversationId, {
            is_starred: !conversation.is_starred,
            updated_at: new Date().toISOString(),
          });
          await loadConversations();
        }
      }
      return true;
    } catch (err: any) {
      console.error("Erreur toggle star:", err);
      return false;
    }
  };

  // ✅ ARCHIVER/DÉSARCHIVER
  const archiveConversation = async (
    conversationId: string
  ): Promise<boolean> => {
    try {
      const conversation = conversations.find((c) => c.id === conversationId);
      if (!conversation) return false;

      const newArchivedState = !conversation.is_archived;

      await UpdateData("conversations", conversationId, {
        is_archived: newArchivedState,
        updated_at: new Date().toISOString(),
      });

      await loadConversations();

      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }

      return true;
    } catch (err: any) {
      console.error("Erreur archivage:", err);
      return false;
    }
  };

  // ✅ SIGNALER/RETIRER SPAM
  const reportConversation = async (
    conversationId: string
  ): Promise<boolean> => {
    try {
      const conversation = conversations.find((c) => c.id === conversationId);
      if (!conversation) return false;

      const newSpamState = !conversation.is_spam;

      await UpdateData("conversations", conversationId, {
        is_spam: newSpamState,
        updated_at: new Date().toISOString(),
      });

      await loadConversations();

      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }

      return true;
    } catch (err: any) {
      console.error("Erreur rapport:", err);
      return false;
    }
  };

  // ✅ SUPPRIMER UN MESSAGE
  const deleteMessage = async (
    messageId: string,
    conversationId: string
  ): Promise<boolean> => {
    try {
      if (!currentUserId) {
        setError("Authentification requise");
        return false;
      }

      const conversation = conversations.find((c) => c.id === conversationId);
      if (!conversation) return false;

      const isCurrentUserUser1 = conversation.user1_id === currentUserId;
      const deleteFlag = isCurrentUserUser1
        ? "is_deleted_user1"
        : "is_deleted_user2";

      await UpdateData("messages", messageId, {
        [deleteFlag]: true,
        updated_at: new Date().toISOString(),
      });

      await loadMessages(conversationId);
      await loadConversations();

      return true;
    } catch (err: any) {
      console.error("Erreur suppression message:", err);
      setError(err.message || "Erreur suppression");
      return false;
    }
  };

  // ✅ SUPPRIMER TOUS LES MESSAGES POUR L'UTILISATEUR
  const deleteAllMessagesForUser = async (
    conversationId: string
  ): Promise<boolean> => {
    try {
      if (!currentUserId) {
        setError("Authentification requise");
        return false;
      }

      const conversation = conversations.find((c) => c.id === conversationId);
      if (!conversation) {
        setError("Conversation introuvable");
        return false;
      }

      if (conversation.is_archived || conversation.is_spam) {
        setError(
          "Impossible de supprimer une conversation archivée ou signalée comme spam"
        );
        return false;
      }

      const isCurrentUserUser1 = conversation.user1_id === currentUserId;
      const deleteFlag = isCurrentUserUser1
        ? "is_deleted_user1"
        : "is_deleted_user2";

      const allMessages = await SelectData("messages", {
        conditions: [
          {
            column: "conversation_id",
            operator: "eq",
            value: conversationId,
          },
        ],
      });

      if (allMessages && Array.isArray(allMessages)) {
        for (const msg of allMessages) {
          await UpdateData("messages", msg.id, {
            [deleteFlag]: true,
            updated_at: new Date().toISOString(),
          });
        }
      }

      await loadMessages(conversationId);
      await loadConversations();

      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }

      return true;
    } catch (err: any) {
      console.error("Erreur suppression conversation:", err);
      setError(err.message || "Erreur suppression");
      return false;
    }
  };

  // ✅ SUPPRIMER CONVERSATION
  const deleteConversation = async (
    conversationId: string
  ): Promise<boolean> => {
    return deleteAllMessagesForUser(conversationId);
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

  // ✅ SUBSCRIPTIONS REALTIME - AUTO-REFRESH SANS CLIC UTILISATEUR
  useEffect(() => {
    if (!currentUserId) return;

    let conversationsSubscription: any = null;
    let messagesSubscription: any = null;

    const setupSubscriptions = async () => {
      conversationsSubscription = SubscribeToTable({
        table: "conversations",
        channelName: `conversations-${currentUserId}`,
        event: "*",
        callback: (payload: any) => {
          console.log("Changement conversations détecté:", payload);
          // ✅ RECHARGER AUTOMATIQUEMENT
          loadConversations();

          if (
            currentConversation &&
            payload.new?.id === currentConversation.id
          ) {
            loadMessages(currentConversation.id);
          }
        },
      });

      messagesSubscription = SubscribeToTable({
        table: "messages",
        channelName: `messages-${currentUserId}`,
        event: "*",
        callback: (payload: any) => {
          console.log("Changement messages détecté:", payload);
          // ✅ RECHARGER AUTOMATIQUEMENT
          loadConversations();

          if (
            currentConversation &&
            payload.new?.conversation_id === currentConversation.id
          ) {
            loadMessages(currentConversation.id);

            if (
              payload.new?.sender_id !== currentUserId &&
              !payload.new?.is_read
            ) {
              markAsRead(currentConversation.id);
            }
          }
        },
      });
    };

    setupSubscriptions();

    return () => {
      if (conversationsSubscription)
        UnsubscribeFromChannel(conversationsSubscription);
      if (messagesSubscription) UnsubscribeFromChannel(messagesSubscription);
    };
  }, [
    currentUserId,
    currentConversation,
    loadConversations,
    loadMessages,
    markAsRead,
  ]);

  useEffect(() => {
    if (currentUserId) {
      loadConversations();
    }
  }, [currentUserId, loadConversations]);

  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id);
    } else {
      setMessages([]);
    }
  }, [currentConversation, loadMessages]);

  const value: MessagingContextType = {
    conversations,
    currentConversation,
    setCurrentConversation,
    messages,
    loading,
    error,
    setError,
    isUploadingImage,
    isUploadingVideo,
    isUploadingDocument,
    isCompressingVideo,
    videoCompressionProgress,
    videoUploadProgress,
    imageCompressionProgress,
    videoUploadStep,
    sendMessage,
    createConversation,
    markAsRead,
    toggleStar,
    archiveConversation,
    reportConversation,
    deleteMessage,
    deleteAllMessagesForUser,
    deleteConversation,
    uploadImage,
    uploadVideo,
    uploadDocument,
    deleteImage,
    deleteVideo,
    deleteDocument,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    isMobile,
    showSidebar,
    setShowSidebar,
    messagesEndRef,
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = (): MessagingContextType => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error("useMessaging must be used within MessagingProvider");
  }
  return context;
};
