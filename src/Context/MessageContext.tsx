// contexts/MessagingContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
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

// Types
export interface Message {
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
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    nom_utilisateur: string;
    email: string;
    profile_image?: string;
  };
  reply_to?: Message;
}

export interface Conversation {
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
    email: string;
    profile_image?: string;
    role: "client" | "freelance";
  };
  last_message?: Message;
  unread_count: number;
}

export interface MessagingContextType {
  // Conversations
  conversations: Conversation[];
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;

  // Messages
  messages: Message[];
  loading: boolean;
  error: string | null;

  // Actions
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
  deleteConversation: (conversationId: string) => Promise<boolean>;

  // Recherche et filtres
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;

  // États UI
  isMobile: boolean;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;

  // Référence pour le scroll
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessagingContext = createContext<MessagingContextType | undefined>(
  undefined
);

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentSession } = useAuth();
  const currentUserId = currentSession.user?.id;

  // États
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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Détection de la taille d'écran
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

  // Fonction pour charger les conversations avec les métadonnées
  const loadConversations = async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);

      // Récupérer les conversations où l'utilisateur est impliqué
      const userConversations = await SelectData("conversations", {
        conditions: [
          { column: "user1_id", operator: "eq", value: currentUserId },
          { column: "user2_id", operator: "eq", value: currentUserId },
        ],
        or: true,
      });

      if (userConversations && Array.isArray(userConversations)) {
        // Enrichir avec les informations des utilisateurs et messages
        const enrichedConversations = await Promise.all(
          userConversations.map(async (conv: any) => {
            // Déterminer l'autre utilisateur
            const otherUserId =
              conv.user1_id === currentUserId ? conv.user2_id : conv.user1_id;

            // Récupérer les informations de l'autre utilisateur
            const otherUserData = await SelectData("users", {
              conditions: [
                { column: "id", operator: "eq", value: otherUserId },
              ],
            });

            const otherUser =
              otherUserData && otherUserData[0]
                ? {
                    id: otherUserData[0].id,
                    nom_utilisateur: otherUserData[0].nom_utilisateur,
                    email: otherUserData[0].email,
                    profile_image: otherUserData[0].profile_image,
                    role: otherUserData[0].role,
                  }
                : undefined;

            // Récupérer le dernier message
            const lastMessages = await SelectData("messages", {
              conditions: [
                { column: "conversation_id", operator: "eq", value: conv.id },
              ],
              orderBy: { column: "created_at", ascending: false },
              limit: 1,
            });

            const last_message =
              lastMessages && lastMessages[0] ? lastMessages[0] : undefined;

            // Compter les messages non lus
            const unreadMessages = await SelectData("messages", {
              conditions: [
                { column: "conversation_id", operator: "eq", value: conv.id },
                { column: "sender_id", operator: "neq", value: currentUserId },
                { column: "is_read", operator: "eq", value: false },
              ],
            });

            const unread_count = unreadMessages ? unreadMessages.length : 0;

            return {
              ...conv,
              other_user: otherUser,
              last_message,
              unread_count,
            };
          })
        );

        setConversations(enrichedConversations);
      }
    } catch (err: any) {
      console.error("Erreur chargement conversations:", err);
      setError(err.message || "Erreur lors du chargement des conversations");
    } finally {
      setLoading(false);
    }
  };

  // Charger les messages d'une conversation
  const loadMessages = async (conversationId: string) => {
    if (!conversationId) return;

    try {
      setLoading(true);
      const messagesData = await SelectData("messages", {
        conditions: [
          { column: "conversation_id", operator: "eq", value: conversationId },
        ],
        orderBy: { column: "created_at", ascending: true },
      });

      if (messagesData && Array.isArray(messagesData)) {
        // Enrichir avec les informations des expéditeurs
        const enrichedMessages = await Promise.all(
          messagesData.map(async (msg: any) => {
            const senderData = await SelectData("users", {
              conditions: [
                { column: "id", operator: "eq", value: msg.sender_id },
              ],
            });

            const sender =
              senderData && senderData[0]
                ? {
                    id: senderData[0].id,
                    nom_utilisateur: senderData[0].nom_utilisateur,
                    email: senderData[0].email,
                    profile_image: senderData[0].profile_image,
                    role: senderData[0].role,
                  }
                : undefined;

            // Récupérer le message de réponse si applicable
            let reply_to = undefined;
            if (msg.reply_to_id) {
              const replyData = await SelectData("messages", {
                conditions: [
                  { column: "id", operator: "eq", value: msg.reply_to_id },
                ],
              });
              reply_to = replyData && replyData[0] ? replyData[0] : undefined;
            }

            return {
              ...msg,
              sender,
              reply_to,
            };
          })
        );

        setMessages(enrichedMessages);

        // Marquer comme lu
        await markAsRead(conversationId);
      }
    } catch (err: any) {
      console.error("Erreur chargement messages:", err);
      setError(err.message || "Erreur lors du chargement des messages");
    } finally {
      setLoading(false);
    }
  };

  // Envoyer un message
  const sendMessage = async (
    content: string,
    conversationId: string,
    file?: File,
    replyTo?: string
  ): Promise<boolean> => {
    if (!currentUserId || !content.trim()) return false;

    try {
      const messageData: any = {
        conversation_id: conversationId,
        sender_id: currentUserId,
        content: content.trim(),
        message_type: "text",
        is_read: false,
      };

      if (replyTo) {
        messageData.reply_to_id = replyTo;
      }

      // Gérer l'upload de fichier si présent (version simplifiée)
      if (file) {
        messageData.message_type = file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
          ? "video"
          : "file";
        messageData.file_name = file.name;
        messageData.file_size = file.size;
        messageData.file_type = file.type;
        // Note: L'upload réel vers Supabase Storage nécessiterait une implémentation supplémentaire
      }

      const result = await InsertDataReturn("messages", messageData);

      if (result?.success) {
        // Mettre à jour le timestamp de la conversation
        await UpdateData("conversations", conversationId, {
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        // Recharger les messages et conversations
        await loadMessages(conversationId);
        await loadConversations();
        return true;
      }

      return false;
    } catch (err: any) {
      console.error("Erreur envoi message:", err);
      setError(err.message || "Erreur lors de l'envoi du message");
      return false;
    }
  };

  // Créer une nouvelle conversation
  const createConversation = async (
    otherUserId: string,
    initialMessage?: string
  ): Promise<string | null> => {
    if (!currentUserId || !otherUserId) return null;

    try {
      // Vérifier si une conversation existe déjà
      const existingConversations = await SelectData("conversations", {
        conditions: [
          { column: "user1_id", operator: "eq", value: currentUserId },
          { column: "user2_id", operator: "eq", value: otherUserId },
        ],
      });

      if (existingConversations && existingConversations.length > 0) {
        return existingConversations[0].id;
      }

      // Vérifier aussi dans l'autre sens
      const existingConversationsReverse = await SelectData("conversations", {
        conditions: [
          { column: "user1_id", operator: "eq", value: otherUserId },
          { column: "user2_id", operator: "eq", value: currentUserId },
        ],
      });

      if (
        existingConversationsReverse &&
        existingConversationsReverse.length > 0
      ) {
        return existingConversationsReverse[0].id;
      }

      // Créer une nouvelle conversation
      const conversationData = {
        user1_id: currentUserId,
        user2_id: otherUserId,
        conversation_type: "direct",
        is_archived: false,
        is_blocked: false,
        is_spam: false,
        is_starred: false,
        last_message_at: new Date().toISOString(),
      };

      const result = await InsertDataReturn("conversations", conversationData);

      if (result?.success && result.rows?.[0]?.id) {
        const conversationId = result.rows[0].id;

        // Envoyer un message initial si fourni
        if (initialMessage) {
          await sendMessage(initialMessage, conversationId);
        }

        // Recharger les conversations
        await loadConversations();
        return conversationId;
      }

      return null;
    } catch (err: any) {
      console.error("Erreur création conversation:", err);
      setError(err.message || "Erreur lors de la création de la conversation");
      return null;
    }
  };

  // Marquer une conversation comme lue
  const markAsRead = async (conversationId: string): Promise<boolean> => {
    if (!currentUserId) return false;

    try {
      // Marquer tous les messages non lus de cette conversation comme lus
      const unreadMessages = messages.filter(
        (msg) => !msg.is_read && msg.sender_id !== currentUserId
      );

      for (const message of unreadMessages) {
        await UpdateData("messages", message.id, {
          is_read: true,
          read_at: new Date().toISOString(),
        });
      }

      // Recharger les messages et conversations
      await loadMessages(conversationId);
      await loadConversations();

      return true;
    } catch (err: any) {
      console.error("Erreur marquage comme lu:", err);
      return false;
    }
  };

  // Marquer/démarquer une conversation ou un message
  const toggleStar = async (
    conversationId: string,
    messageId?: string
  ): Promise<boolean> => {
    try {
      if (messageId) {
        // Star/unstar un message
        const message = messages.find((msg) => msg.id === messageId);
        if (message) {
          await UpdateData("messages", messageId, {
            is_starred: !message.is_starred,
          });
          await loadMessages(conversationId);
        }
      } else {
        // Star/unstar une conversation
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

  // Archiver une conversation
  const archiveConversation = async (
    conversationId: string
  ): Promise<boolean> => {
    try {
      await UpdateData("conversations", conversationId, {
        is_archived: true,
        updated_at: new Date().toISOString(),
      });
      await loadConversations();

      // Si la conversation archivée est la conversation courante, la désélectionner
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

  // Signaler une conversation
  const reportConversation = async (
    conversationId: string
  ): Promise<boolean> => {
    try {
      await UpdateData("conversations", conversationId, {
        is_spam: true,
        updated_at: new Date().toISOString(),
      });
      await loadConversations();
      return true;
    } catch (err: any) {
      console.error("Erreur signalement:", err);
      return false;
    }
  };

  // Supprimer une conversation
  const deleteConversation = async (
    conversationId: string
  ): Promise<boolean> => {
    try {
      const success = await DeleteData("conversations", conversationId);

      if (success) {
        await loadConversations();

        // Si la conversation supprimée est la conversation courante, la désélectionner
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(null);
          setMessages([]);
        }
      }

      return success;
    } catch (err: any) {
      console.error("Erreur suppression:", err);
      return false;
    }
  };

  // Filtrer les conversations
  const filteredConversations = React.useMemo(() => {
    let filtered = conversations;

    // Appliquer les filtres
    switch (activeFilter) {
      case "unread":
        filtered = filtered.filter((conv) => conv.unread_count > 0);
        break;
      case "starred":
        filtered = filtered.filter((conv) => conv.is_starred);
        break;
      case "archived":
        filtered = filtered.filter((conv) => conv.is_archived);
        break;
      case "spam":
        filtered = filtered.filter((conv) => conv.is_spam);
        break;
      default:
        filtered = filtered.filter(
          (conv) => !conv.is_archived && !conv.is_spam
        );
    }

    // Appliquer la recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (conv) =>
          conv.other_user?.nom_utilisateur?.toLowerCase().includes(term) ||
          conv.other_user?.email?.toLowerCase().includes(term) ||
          conv.last_message?.content?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [conversations, activeFilter, searchTerm]);

  // Abonnement aux nouvelles conversations et messages (version simplifiée)
  useEffect(() => {
    if (!currentUserId) return;

    let conversationsSubscription: any = null;
    let messagesSubscription: any = null;

    const setupSubscriptions = async () => {
      // S'abonner aux nouvelles conversations
      conversationsSubscription = SubscribeToTable(
        "conversations",
        "conversations-channel",
        {
          event: "INSERT",
          filter: `user1_id=eq.${currentUserId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            loadConversations();
          }
        }
      );

      // S'abonner aussi pour user2_id
      const conversationsSubscription2 = SubscribeToTable(
        "conversations",
        "conversations-channel-2",
        {
          event: "INSERT",
          filter: `user2_id=eq.${currentUserId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            loadConversations();
          }
        }
      );

      // S'abonner aux nouveaux messages
      messagesSubscription = SubscribeToTable(
        "messages",
        "messages-channel",
        {
          event: "INSERT",
        },
        (payload) => {
          if (payload.eventType === "INSERT" && currentConversation) {
            const newMessage = payload.new;
            if (newMessage.conversation_id === currentConversation.id) {
              // Ajouter le nouveau message et marquer comme lu si c'est notre conversation actuelle
              setMessages((prev) => [...prev, newMessage]);
              if (newMessage.sender_id !== currentUserId) {
                markAsRead(currentConversation.id);
              }
            }
            // Recharger les conversations pour mettre à jour le dernier message
            loadConversations();
          }
        }
      );
    };

    setupSubscriptions();

    return () => {
      if (conversationsSubscription) {
        UnsubscribeFromChannel("conversations-channel");
        UnsubscribeFromChannel("conversations-channel-2");
      }
      if (messagesSubscription) {
        UnsubscribeFromChannel("messages-channel");
      }
    };
  }, [currentUserId, currentConversation]);

  // Charger les données initiales
  useEffect(() => {
    if (currentUserId) {
      loadConversations();
    }
  }, [currentUserId]);

  // Charger les messages quand la conversation change
  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id);
    } else {
      setMessages([]);
    }
  }, [currentConversation]);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const value: MessagingContextType = {
    // Conversations
    conversations: filteredConversations,
    currentConversation,
    setCurrentConversation,

    // Messages
    messages,
    loading,
    error,

    // Actions
    sendMessage,
    createConversation,
    markAsRead,
    toggleStar,
    archiveConversation,
    reportConversation,
    deleteConversation,

    // Recherche et filtres
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,

    // États UI
    isMobile,
    showSidebar,
    setShowSidebar,

    // Référence pour le scroll
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
    throw new Error("useMessaging doit être utilisé dans un MessagingProvider");
  }
  return context;
};
