// contexts/MessagingContext.tsx - VERSION CORRIGÉE AVEC SÉCURITÉ
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
  // Nouvelles fonctions de vérification de sécurité
  hasAccessToConversation: (conversationId: string) => Promise<boolean>;
  validateConversationAccess: (conversationId: string) => Promise<boolean>;
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
  const refreshTimeoutRef = useRef<NodeJS.Timeout>(null);

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

  const validateUserAccess = (conversation: any): boolean => {
    if (!currentUserId || !conversation) return false;
    return (
      conversation.user1_id === currentUserId ||
      conversation.user2_id === currentUserId
    );
  };
  // ✅ VÉRIFIER SI L'UTILISATEUR A ACCÈS À LA CONVERSATION
  const hasAccessToConversation = useCallback(
    async (conversationId: string): Promise<boolean> => {
      if (!currentUserId || !conversationId) {
        console.error(
          "❌ Accès refusé: utilisateur non connecté ou conversation manquante"
        );
        return false;
      }

      try {
        const conversationData = await SelectData("conversations", {
          conditions: [{ column: "id", operator: "eq", value: conversationId }],
        });

        if (!conversationData || conversationData.length === 0) {
          console.error("❌ Conversation non trouvée:", conversationId);
          return false;
        }

        const conversation = conversationData[0];
        const hasAccess =
          conversation.user1_id === currentUserId ||
          conversation.user2_id === currentUserId;

        if (!hasAccess) {
          console.error(
            "🚫 Accès refusé: utilisateur",
            currentUserId,
            "n'a pas accès à la conversation",
            conversationId
          );
          console.log(
            "User1:",
            conversation.user1_id,
            "User2:",
            conversation.user2_id
          );
        }

        return hasAccess;
      } catch (error) {
        console.error("❌ Erreur vérification accès conversation:", error);
        return false;
      }
    },
    [currentUserId]
  );

  // ✅ VALIDER L'ACCÈS AVEC ERREUR
  const validateConversationAccess = useCallback(
    async (conversationId: string): Promise<boolean> => {
      const hasAccess = await hasAccessToConversation(conversationId);
      if (!hasAccess) {
        setError(
          "Accès refusé: vous n'avez pas la permission de voir cette conversation"
        );
        return false;
      }
      return true;
    },
    [hasAccessToConversation]
  );

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
      const isCurrentUserUser1 =
        currentConversation?.user1_id === currentUserId;
      const deleteFlag = isCurrentUserUser1
        ? msg.is_deleted_user1
        : msg.is_deleted_user2;

      return !deleteFlag; // Afficher seulement si NON supprimé
    });
  };

  // ✅ CHARGER LES CONVERSATIONS (SEULEMENT CELLES DE L'UTILISATEUR)
  // contexts/MessagingContext.tsx - CORRECTIONS CRITIQUES

  // ✅ CORRECTION: Charger seulement les conversations de l'utilisateur
  const loadConversations = useCallback(async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);

      // ✅ CORRECTION: Récupérer SEULEMENT les conversations où l'utilisateur est user1 OU user2
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
        or: true, // ✅ IMPORTANT: user1_id = currentUserId OU user2_id = currentUserId
        orderBy: { column: "last_message_at", ascending: false },
      });

      if (userConversations && Array.isArray(userConversations)) {
        const enrichedConversations = await Promise.all(
          userConversations.map(async (conv: any) => {
            try {
              // ✅ DOUBLE VÉRIFICATION: S'assurer que l'utilisateur fait bien partie de la conversation
              if (
                conv.user1_id !== currentUserId &&
                conv.user2_id !== currentUserId
              ) {
                console.warn(
                  "🚫 Conversation filtrée - utilisateur non autorisé:",
                  conv.id
                );
                return null;
              }

              // ✅ Récupérer l'autre utilisateur
              const otherUserId =
                conv.user1_id === currentUserId ? conv.user2_id : conv.user1_id;
              const otherUser = await getUserData(otherUserId);

              // ✅ Récupérer les messages avec vérification de sécurité
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

              // ✅ Filtrer les messages visibles pour cet utilisateur
              const isCurrentUserUser1 = conv.user1_id === currentUserId;
              const visibleMessages =
                allMessages?.filter((msg: any) => {
                  const deleteFlag = isCurrentUserUser1
                    ? msg.is_deleted_user1
                    : msg.is_deleted_user2;
                  return !deleteFlag;
                }) || [];

              // Si aucun message visible, ne pas afficher la conversation
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

  // ✅ CHARGER LES MESSAGES (AVEC VÉRIFICATION DE SÉCURITÉ)
  // ✅ CORRECTION: Charger les messages avec vérification de sécurité
  // ✅ CORRECTION: Charger les messages avec vérification de sécurité
  const loadMessages = useCallback(
    async (conversationId: string) => {
      if (!conversationId || !currentUserId) return;

      // ✅ VÉRIFICATION CRITIQUE: L'utilisateur a-t-il accès à cette conversation?
      const hasAccess = await validateConversationAccess(conversationId);
      if (!hasAccess) {
        console.error("🚫 Accès refusé au chargement des messages");
        setMessages([]);
        setCurrentConversation(null);
        return;
      }

      try {
        setLoading(true);

        const conversation = await SelectData("conversations", {
          conditions: [{ column: "id", operator: "eq", value: conversationId }],
        });

        if (!conversation || conversation.length === 0) {
          console.error("Conversation non trouvée");
          return;
        }

        const conv = conversation[0];

        // ✅ DOUBLE VÉRIFICATION: S'assurer que l'utilisateur fait partie de la conversation
        if (
          conv.user1_id !== currentUserId &&
          conv.user2_id !== currentUserId
        ) {
          console.error("🚫 Utilisateur non autorisé à voir ces messages");
          setMessages([]);
          setCurrentConversation(null);
          return;
        }

        const isCurrentUserUser1 = conv.user1_id === currentUserId;

        // Récupérer tous les messages
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
          // ✅ FILTRAGE CRITIQUE: Ne montrer que les messages non supprimés par cet utilisateur
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
    [currentUserId, getUserData, validateConversationAccess]
  );

  // ✅ MARQUER COMME LU (AVEC VÉRIFICATION)
  const markAsRead = useCallback(
    async (conversationId: string): Promise<boolean> => {
      if (!currentUserId) return false;

      // ✅ VÉRIFIER L'ACCÈS
      const hasAccess = await validateConversationAccess(conversationId);
      if (!hasAccess) return false;

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
    [
      currentUserId,
      messages,
      loadMessages,
      loadConversations,
      validateConversationAccess,
    ]
  );

  // ✅ ENVOYER MESSAGE (AVEC VÉRIFICATION)
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

    // ✅ VÉRIFIER L'ACCÈS À LA CONVERSATION
    const hasAccess = await validateConversationAccess(conversationId);
    if (!hasAccess) {
      console.error("❌ Envoi message refusé: pas d'accès à la conversation");
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

  // ✅ CRÉER CONVERSATION (DÉJÀ SÉCURISÉ)
  // ✅ CRÉER OU RÉCUPÉRER CONVERSATION EXISTANTE
  const createConversation = async (
    otherUserId: string,
    initialMessage?: string
  ): Promise<string | null> => {
    if (!currentUserId || !otherUserId) {
      setError("ID utilisateur manquant");
      return null;
    }

    // ✅ EMPÊCHER LA CRÉATION AVEC SOI-MÊME
    if (currentUserId === otherUserId) {
      setError("Impossible de créer une conversation avec soi-même");
      return null;
    }

    try {
      // ✅ VÉRIFIER QUE L'AUTRE UTILISATEUR EXISTE
      const otherUserData = await getUserData(otherUserId);
      if (!otherUserData) {
        setError("Utilisateur non trouvé");
        return null;
      }

      // ✅ RECHERCHER LES CONVERSATIONS EXISTANTES AVEC LA BONNE SYNTAXE
      const existingConversations = await SelectData("conversations", {
        conditions: [
          // Conversation où currentUserId est user1 et otherUserId est user2
          { column: "user1_id", operator: "eq", value: currentUserId },
          { column: "user2_id", operator: "eq", value: otherUserId },
          // OU conversation où currentUserId est user2 et otherUserId est user1
          { column: "user1_id", operator: "eq", value: otherUserId },
          { column: "user2_id", operator: "eq", value: currentUserId },
        ],
        or: true,
      });

      console.log(
        "📋 Conversations existantes trouvées:",
        existingConversations
      );

      // ✅ FILTRER MANUELLEMENT POUR LES BONNES COMBINAISONS
      const validConversations =
        existingConversations?.filter(
          (conv: any) =>
            (conv.user1_id === currentUserId &&
              conv.user2_id === otherUserId) ||
            (conv.user1_id === otherUserId && conv.user2_id === currentUserId)
        ) || [];

      console.log(
        "✅ Conversations valides après filtrage:",
        validConversations
      );

      // ✅ SI CONVERSATION EXISTE DÉJÀ
      if (validConversations.length > 0) {
        const existingConv = validConversations[0];
        console.log("✅ Conversation existante trouvée:", existingConv.id);

        // ✅ VÉRIFIER QUE L'UTILISATEUR A BIEN ACCÈS À CETTE CONVERSATION
        if (
          existingConv.user1_id !== currentUserId &&
          existingConv.user2_id !== currentUserId
        ) {
          console.error("🚫 Accès refusé à la conversation existante");
          setError("Accès refusé à la conversation existante");
          return null;
        }

        // ✅ SI UN MESSAGE INITIAL EST FOURNI, L'AJOUTER
        if (initialMessage && initialMessage.trim()) {
          console.log(
            "💬 Ajout du message initial à la conversation existante"
          );
          const messageSent = await sendMessage(
            initialMessage,
            existingConv.id
          );
          if (!messageSent) {
            console.error("❌ Échec de l'envoi du message initial");
          }
        }

        // ✅ METTRE À JOUR LA DATE DU DERNIER MESSAGE
        await UpdateData("conversations", existingConv.id, {
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        // ✅ RECHARGER LES DONNÉES
        await loadConversations();

        console.log("✅ Conversation existante réutilisée:", existingConv.id);
        return existingConv.id;
      }

      // ✅ AUCUNE CONVERSATION EXISTANTE → CRÉER UNE NOUVELLE CONVERSATION
      console.log("🆕 Création d'une nouvelle conversation...");

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
        console.log("✅ Nouvelle conversation créée:", conversationId);

        // ✅ SI UN MESSAGE INITIAL EST FOURNI, L'AJOUTER
        if (initialMessage && initialMessage.trim()) {
          console.log("💬 Ajout du message initial à la nouvelle conversation");
          const messageSent = await sendMessage(initialMessage, conversationId);
          if (!messageSent) {
            console.error("❌ Échec de l'envoi du message initial");
            // On retourne quand même l'ID de conversation même si l'envoi échoue
          }
        }

        // ✅ RECHARGER LES DONNÉES
        await loadConversations();

        console.log("✅ Nouvelle conversation prête:", conversationId);
        return conversationId;
      }

      console.error("❌ Erreur création conversation - Aucun ID retourné");
      setError("Erreur lors de la création de la conversation");
      return null;
    } catch (err: any) {
      console.error("❌ Erreur création conversation:", err);
      setError(err.message || "Erreur lors de la création de la conversation");
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

      // ✅ VÉRIFICATION D'ACCÈS
      if (!validateUserAccess(conversation)) {
        setError("Accès refusé à cette conversation");
        return false;
      }

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

  // ✅ SUBSCRIPTIONS REALTIME - AVEC FILTRAGE DE SÉCURITÉ
  // ✅ CORRECTION: Sécuriser les subscriptions realtime
  useEffect(() => {
    if (!currentUserId) return;

    let conversationsSubscription: any = null;
    let messagesSubscription: any = null;

    const setupSubscriptions = async () => {
      // ✅ Subscription conversations: seulement celles de l'utilisateur
      conversationsSubscription = SubscribeToTable({
        table: "conversations",
        channelName: `conversations-${currentUserId}`,
        event: "*",
        callback: async (payload: any) => {
          console.log("Changement conversations détecté:", payload);

          // ✅ VÉRIFICATION: Ce changement concerne-t-il l'utilisateur courant?
          if (
            payload.new &&
            (payload.new.user1_id === currentUserId ||
              payload.new.user2_id === currentUserId)
          ) {
            // Recharger seulement si l'utilisateur a accès
            const hasAccess = await hasAccessToConversation(payload.new.id);
            if (hasAccess) {
              loadConversations();

              if (
                currentConversation &&
                payload.new?.id === currentConversation.id
              ) {
                loadMessages(currentConversation.id);
              }
            }
          }
        },
      });

      // ✅ Subscription messages: avec vérification d'accès
      messagesSubscription = SubscribeToTable({
        table: "messages",
        channelName: `messages-${currentUserId}`,
        event: "*",
        callback: async (payload: any) => {
          console.log("Changement messages détecté:", payload);

          // ✅ VÉRIFICATION CRITIQUE: L'utilisateur a-t-il accès à cette conversation?
          if (payload.new?.conversation_id) {
            const hasAccess = await hasAccessToConversation(
              payload.new.conversation_id
            );
            if (!hasAccess) {
              console.log("🚫 Message ignoré - pas d'accès à la conversation");
              return;
            }

            // Vérifier que l'utilisateur fait partie de la conversation
            const conversation = await SelectData("conversations", {
              conditions: [
                {
                  column: "id",
                  operator: "eq",
                  value: payload.new.conversation_id,
                },
              ],
            });

            if (conversation && conversation.length > 0) {
              const conv = conversation[0];
              if (
                conv.user1_id !== currentUserId &&
                conv.user2_id !== currentUserId
              ) {
                console.log("🚫 Message ignoré - utilisateur non autorisé");
                return;
              }
            }

            // ✅ Si les vérifications passent, procéder au rechargement
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
    hasAccessToConversation,
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
    // Nouvelles fonctions de sécurité
    hasAccessToConversation,
    validateConversationAccess,
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
