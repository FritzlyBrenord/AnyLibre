"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { useAuth } from "@/Context/ContextUser";
import { useMessaging } from "@/Context/MessageContext";
import { useFreelances } from "@/Context/Freelance/FreelanceContext";

interface User2 {
  nom: string;
  prenom: string;
  username: string;
  photo: string;
}

// Composant de chargement
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-40">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
  </div>
);

// Formater la date
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return format(date, "HH:mm", { locale: fr });
  } else {
    return format(date, "d MMM", { locale: fr });
  }
};

// Obtenir les initiales d'un nom
const getInitials = (name: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
};

// Types pour la sélection multiple
interface SelectedItems {
  messages: string[];
  conversations: string[];
}

const MessagingInterface = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const otherUserId = searchParams.get("userId");

  // Contextes - UTILISATION COMPLÈTE DU CONTEXTE
  const {
    // États
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    realtimeConnected,

    // Conversations
    GetOrCreateConversation,
    SetCurrentConversation,
    ArchiveConversation,
    StarConversation,
    MarkConversationAsSpam,
    DeleteConversation,
    SendMessageWithFile,

    // Messages
    SendMessage,
    MarkAllMessagesAsRead,
    DeleteMessage,
    StarMessage,
    EditMessage,
    ReplyToMessage,

    // Utilitaires
    RefreshConversations,
    RefreshMessages,
  } = useMessaging();

  const { currentSession, GetUserById } = useAuth();
  const { getFreelanceByUserId, getPhotoProfileUrl } = useFreelances();

  // États locaux
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showContactMenu, setShowContactMenu] = useState<string | null>(null);
  const [searchInConversation, setSearchInConversation] = useState("");
  const [showInfoSidebar, setShowInfoSidebar] = useState(false);
  const [selected, setSelected] = useState<SelectedItems>({
    messages: [],
    conversations: [],
  });
  const [selectMode, setSelectMode] = useState<
    "none" | "messages" | "conversations"
  >("none");
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  // États locaux - AJOUTE CES LIGNES

  const [attachmentPreviews, setAttachmentPreviews] = useState<
    { file: File; preview: string; type: "image" | "video" | "file" }[]
  >([]);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  // Sections affichées/masquées
  const [showContactSections, setShowContactSections] = useState({
    filters: false,
    starred: false,
    recent: true,
  });

  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // États responsive
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Références
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contactMenuRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Filtres de messages
  const messageFilters = [
    { id: "all", label: "Tous les messages", icon: "💬" },
    { id: "unread", label: "Non lues", icon: "🔴" },
    { id: "starred", label: "Suivies", icon: "⭐" },
    { id: "order", label: "Commandes", icon: "🛒" },
    { id: "archived", label: "Archives", icon: "📁" },
    { id: "spam", label: "Spam", icon: "🚫" },
  ];

  // Emojis communs
  const commonEmojis = [
    "😊",
    "😄",
    "😍",
    "😂",
    "🥰",
    "😎",
    "🤔",
    "👏",
    "🙌",
    "🔥",
    "⭐",
    "🎉",
    "💯",
    "❤️",
    "👍",
    "👎",
    "🙏",
    "😢",
    "😡",
    "🤯",
  ];

  // Ajoute cet useEffect pour nettoyer les URLs
  useEffect(() => {
    return () => {
      // Nettoyer toutes les URLs de prévisualisation
      attachmentPreviews.forEach((preview) => {
        if (preview.preview) {
          URL.revokeObjectURL(preview.preview);
        }
      });
    };
  }, [attachmentPreviews]);
  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setShowSidebar(window.innerWidth >= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Récupérer la conversation initiale si userId est présent
  useEffect(() => {
    const initConversation = async () => {
      if (otherUserId && currentSession?.user?.id) {
        const existingConv = conversations.find(
          (conv) =>
            (conv.user1_id === currentSession.user.id &&
              conv.user2_id === otherUserId) ||
            (conv.user1_id === otherUserId &&
              conv.user2_id === currentSession.user.id)
        );

        if (existingConv) {
          SetCurrentConversation(existingConv);
        } else {
          const newConv = await GetOrCreateConversation(otherUserId);
          if (newConv) {
            await RefreshConversations();
            const updatedConv = conversations.find(
              (conv) => conv.id === newConv.id
            );
            if (updatedConv) SetCurrentConversation(updatedConv);
          }
        }
      }
    };

    if (otherUserId && conversations.length > 0) {
      initConversation();
    }
  }, [
    otherUserId,
    conversations,
    currentSession.user.id,
    SetCurrentConversation,
    GetOrCreateConversation,
    RefreshConversations,
  ]);

  // Fermer les menus en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contactMenuRef.current &&
        !contactMenuRef.current.contains(event.target as Node)
      ) {
        setShowContactMenu(null);
      }
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll vers le bas quand les messages changent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Récupération des informations utilisateur
  const useUserInfo = (): User2 => {
    const [userInfo, setUserInfo] = useState<User2>({
      nom: "",
      prenom: "",
      username: "",
      photo: "",
    });

    useEffect(() => {
      const fetchUserInfo = async () => {
        try {
          if (!currentConversation || !currentSession?.user?.id) return;

          const otherUserId =
            currentConversation.user1_id === currentSession.user.id
              ? currentConversation.user2_id
              : currentConversation.user1_id;

          if (!otherUserId) {
            setUserInfo({
              nom: "Utilisateur",
              prenom: "Inconnu",
              username: "user",
              photo: "",
            });
            return;
          }

          // 1. Essayer le compte freelance d'abord
          const freelanceInfo = getFreelanceByUserId(otherUserId);
          if (freelanceInfo) {
            setUserInfo({
              nom: freelanceInfo.nom || "",
              prenom: freelanceInfo.prenom || "",
              username: freelanceInfo.username || "",
              photo: getPhotoProfileUrl(freelanceInfo.photo_url || ""),
            });
            return;
          }

          // 2. Si pas de freelance, chercher l'utilisateur normal
          const userData = await GetUserById(otherUserId);
          if (userData) {
            setUserInfo({
              nom:
                userData.nom_utilisateur ||
                userData.email?.split("@")[0] ||
                "Utilisateur",
              prenom: "",
              username:
                userData.nom_utilisateur ||
                userData.email?.split("@")[0] ||
                "user",
              photo: getPhotoProfileUrl(userData.profile_image || ""),
            });
            return;
          }

          // 3. Fallback si rien trouvé
          setUserInfo({
            nom: "",
            prenom: "",
            username: "",
            photo: "",
          });
        } catch (error) {
          console.error("Erreur récupération infos utilisateur:", error);
          setUserInfo({
            nom: "",
            prenom: "",
            username: "",
            photo: "",
          });
        }
      };

      fetchUserInfo();
    }, []);

    return userInfo;
  };

  const userInfo = useUserInfo();

  // Fonctions d'interface
  const toggleSection = (section: keyof typeof showContactSections) => {
    setShowContactSections({
      ...showContactSections,
      [section]: !showContactSections[section],
    });
  };

  const selectContact = async (conversation: any) => {
    if (selectMode === "conversations") {
      const isSelected = selected.conversations.includes(conversation.id);
      if (isSelected) {
        setSelected({
          ...selected,
          conversations: selected.conversations.filter(
            (id) => id !== conversation.id
          ),
        });
      } else {
        setSelected({
          ...selected,
          conversations: [...selected.conversations, conversation.id],
        });
      }
    } else {
      SetCurrentConversation(conversation);
      setSearchInConversation("");
      if (isMobile) setShowSidebar(false);
      await MarkAllMessagesAsRead(conversation.id);
    }
  };

  const toggleMessageSelection = (messageId: string) => {
    const isSelected = selected.messages.includes(messageId);
    if (isSelected) {
      setSelected({
        ...selected,
        messages: selected.messages.filter((id) => id !== messageId),
      });
    } else {
      setSelected({
        ...selected,
        messages: [...selected.messages, messageId],
      });
    }
  };

  const toggleSelectMode = (mode: "messages" | "conversations" | "none") => {
    setSelectMode(mode === selectMode ? "none" : mode);
    setSelected({
      messages: [],
      conversations: [],
    });
  };

  // Fonction d'envoi de message
  const handleSendMessage = async () => {
    if (
      (!newMessage.trim() && attachments.length === 0) ||
      !currentConversation
    )
      return;

    try {
      let messageResult;

      if (replyingTo) {
        // Répondre à un message
        messageResult = await ReplyToMessage(
          currentConversation.id,
          newMessage.trim(),
          replyingTo.id
        );
        setReplyingTo(null);
      } else {
        // Message normal
        messageResult = await SendMessage(
          currentConversation.id,
          newMessage.trim(),
          "text"
        );
      }

      if (messageResult) {
        setNewMessage("");
        setAttachments([]);
        setShowEmojiPicker(false);

        // Recharger les messages pour voir le nouveau
        await RefreshMessages(currentConversation.id);
      }
    } catch (error) {
      console.error("Erreur envoi message:", error);
    }
  };
  const removeAttachmentPreview = (index: number) => {
    setAttachmentPreviews((prev) => {
      const newPreviews = [...prev];
      // Libérer l'URL de l'image/vidéo pour éviter les fuites mémoire
      if (newPreviews[index].preview) {
        URL.revokeObjectURL(newPreviews[index].preview);
      }
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };
  // Gestion des fichiers
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (!currentConversation || !files.length) return;

    // Créer les prévisualisations
    const newPreviews = await Promise.all(
      files.map(async (file) => {
        let preview = "";
        let type: "image" | "video" | "file" = "file";

        if (file.type.startsWith("image/")) {
          type = "image";
          preview = URL.createObjectURL(file);
        } else if (file.type.startsWith("video/")) {
          type = "video";
          preview = URL.createObjectURL(file);
        }

        return { file, preview, type };
      })
    );

    setAttachmentPreviews((prev) => [...prev, ...newPreviews]);

    // Réinitialiser l'input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleSendFiles = async () => {
    if (attachmentPreviews.length === 0 || !currentConversation) return;

    try {
      for (const preview of attachmentPreviews) {
        // Ajouter à la liste des uploads en cours
        setUploadingFiles((prev) => [...prev, preview.file.name]);

        try {
          let messageType: "image" | "video" | "file" = "file";

          if (preview.file.type.startsWith("image/")) {
            messageType = "image";
          } else if (preview.file.type.startsWith("video/")) {
            messageType = "video";
          }

          // Simuler la progression (tu peux adapter avec ta vraie progression)
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => ({
              ...prev,
              [preview.file.name]: Math.min(
                (prev[preview.file.name] || 0) + 20,
                100
              ),
            }));
          }, 200);

          // Utiliser SendMessageWithFile du contexte
          await SendMessageWithFile(
            currentConversation.id,
            preview.file,
            messageType
          );

          clearInterval(progressInterval);
          setUploadProgress((prev) => ({
            ...prev,
            [preview.file.name]: 100,
          }));
        } catch (error) {
          console.error(`Erreur envoi ${preview.file.name}:`, error);
        } finally {
          // Retirer de la liste des uploads
          setUploadingFiles((prev) =>
            prev.filter((name) => name !== preview.file.name)
          );
        }
      }

      // Vider les prévisualisations après envoi
      setAttachmentPreviews([]);
    } catch (error) {
      console.error("Erreur envoi fichiers:", error);
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  // Emojis
  const addEmoji = (emoji: string) => {
    setNewMessage(newMessage + emoji);
    setShowEmojiPicker(false);
  };

  // Actions sur les conversations
  const handleArchiveConversation = async (
    conversationId: string,
    archive: boolean
  ) => {
    await ArchiveConversation(conversationId, archive);
    setShowContactMenu(null);
  };

  const handleStarConversation = async (
    conversationId: string,
    star: boolean
  ) => {
    await StarConversation(conversationId, star);
  };

  const handleReportConversation = async (
    conversationId: string,
    spam: boolean
  ) => {
    await MarkConversationAsSpam(conversationId, spam);
    setShowContactMenu(null);
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await DeleteConversation(conversationId);
      setShowContactMenu(null);
    } catch (error) {
      console.error("Erreur suppression conversation:", error);
    }
  };

  // Actions sur les messages
  const handleDeleteMessage = async (messageId: string) => {
    if (!currentConversation) return;
    try {
      await DeleteMessage(messageId);
    } catch (error) {
      console.error("Erreur suppression message:", error);
    }
  };

  const handleStarMessage = async (messageId: string, star: boolean) => {
    try {
      await StarMessage(messageId, star);
    } catch (error) {
      console.error("Erreur favori message:", error);
    }
  };

  // Mettez à jour la fonction de modification pour utiliser is_edited
  const handleEditMessage = async (messageId: string) => {
    if (!editContent.trim()) return;
    try {
      await EditMessage(messageId, editContent);
      setEditingMessage(null);
      setEditContent("");
    } catch (error) {
      console.error("Erreur modification message:", error);
    }
  };
  const handleReplyToMessage = (message: any) => {
    setReplyingTo(message);
    setNewMessage("");
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  // Suppression multiple
  const handleDeleteSelected = async () => {
    if (selectMode === "conversations" && selected.conversations.length > 0) {
      for (const convId of selected.conversations) {
        await DeleteConversation(convId);
      }
      setSelected({ ...selected, conversations: [] });
      setSelectMode("none");
    } else if (selectMode === "messages" && selected.messages.length > 0) {
      for (const msgId of selected.messages) {
        await DeleteMessage(msgId);
      }
      setSelected({ ...selected, messages: [] });
      setSelectMode("none");
    }
  };

  // Filtrage des conversations
  const filteredConversations = conversations.filter((conv) => {
    if (searchTerm) {
      const otherUser = conv.otherUser;
      const searchLower = searchTerm.toLowerCase();
      return (
        otherUser?.nom_utilisateur?.toLowerCase().includes(searchLower) ||
        otherUser?.email?.toLowerCase().includes(searchLower) ||
        conv.lastMessage?.content?.toLowerCase().includes(searchLower)
      );
    }

    switch (activeFilter) {
      case "unread":
        return conv.unreadCount && conv.unreadCount > 0;
      case "starred":
        return conv.is_starred_user1;
      case "archived":
        return conv.is_archived_user1;
      case "spam":
        return conv.is_spam_user1;
      case "order":
        return conv.conversation_type === "order";
      default:
        return !conv.is_archived_user1 && !conv.is_spam_user1;
    }
  });

  // Filtrage des messages pour la recherche
  const filteredMessages = searchInConversation
    ? messages.filter((msg) =>
        msg.content?.toLowerCase().includes(searchInConversation.toLowerCase())
      )
    : messages;

  // Rendu du contenu des messages
  const renderMessageContent = (message: any) => {
    const isCurrentUser = message.sender_id === currentSession?.user?.id;

    switch (message.message_type) {
      case "warning":
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
            <div className="font-semibold mb-1 flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              INFORMATION IMPORTANTE
            </div>
            <div className="text-sm">
              {message.content}{" "}
              <Link
                href="/faq"
                className="text-yellow-600 font-medium underline"
              >
                En savoir plus
              </Link>
            </div>
          </div>
        );

      case "order":
        const orderDetails = message.order_details || {};
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="font-semibold text-blue-800 mb-3">
              {message.content || "Commande personnalisée"}
            </div>
            <div className="space-y-2 text-sm">
              {orderDetails.budget && (
                <div className="flex justify-between">
                  <span className="text-blue-600">Budget:</span>
                  <span className="font-semibold text-blue-800">
                    {orderDetails.budget}
                  </span>
                </div>
              )}
              {orderDetails.delivery && (
                <div className="flex justify-between">
                  <span className="text-blue-600">Livraison:</span>
                  <span className="font-semibold text-blue-800">
                    {orderDetails.delivery}
                  </span>
                </div>
              )}
              {orderDetails.features && orderDetails.features.length > 0 && (
                <div className="mt-3">
                  <div className="text-blue-600 mb-2">Caractéristiques:</div>
                  <div className="space-y-1">
                    {orderDetails.features.map(
                      (feature: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                          <span className="text-blue-800">{feature}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      // Dans renderMessageContent, pour afficher les images/vidéos
      case "image":
        const imageUrl = message.file_url;
        return (
          <div
            className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setEnlargedImage(imageUrl)}
          >
            <img
              src={imageUrl}
              alt={message.content}
              className="max-w-full max-h-64 rounded-lg object-cover"
            />
          </div>
        );

      case "video":
        const videoUrl = message.file_url;
        return (
          <div className="relative rounded-lg overflow-hidden">
            <video controls className="max-w-full max-h-64 rounded-lg">
              <source src={videoUrl} type={message.file_type} />
              Votre navigateur ne prend pas en charge les vidéos.
            </video>
          </div>
        );

      case "file":
        const fileUrl = message.file_url;
        return (
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="bg-gray-100 p-2 rounded-md mr-3">
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">
                {message.file_name || message.content}
              </div>
              <a
                href={fileUrl}
                download
                className="text-xs text-blue-500 underline"
              >
                Télécharger
              </a>
            </div>
          </div>
        );

      case "proposal":
        const proposalDetails = message.proposal_details || {};
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="font-semibold text-green-800 mb-2">
              Nouvelle Proposition
            </div>
            <div className="text-sm text-green-700 space-y-1">
              {proposalDetails.title && (
                <div>
                  <strong>Titre:</strong> {proposalDetails.title}
                </div>
              )}
              {proposalDetails.amount && (
                <div>
                  <strong>Montant:</strong> {proposalDetails.amount}{" "}
                  {proposalDetails.currency}
                </div>
              )}
              {proposalDetails.delivery_days && (
                <div>
                  <strong>Livraison:</strong> {proposalDetails.delivery_days}{" "}
                  jours
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <div className="whitespace-pre-wrap">{message.content}</div>;
    }
  };
  const ReplyPreview = ({ replyTo }: { replyTo: any }) => {
    if (!replyTo) return null;

    const isCurrentUser = replyTo.sender_id === currentSession?.user?.id;

    return (
      <div
        className={`mb-2 p-2 rounded border-l-3 ${
          isCurrentUser
            ? "border-blue-400 bg-blue-50"
            : "border-gray-400 bg-gray-100"
        }`}
      >
        <div className="text-xs font-medium text-gray-600 mb-1">
          {isCurrentUser ? "Vous" : userInfo.nom}
        </div>
        <div className="text-sm text-gray-700 truncate">
          {replyTo.content || "Pièce jointe"}
        </div>
      </div>
    );
  };
  // Déterminer si un message est envoyé par l'utilisateur actuel
  const isCurrentUserMessage = (message: any) => {
    return message.sender_id === currentSession?.user?.id;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 mt-20">
      {/* Modal agrandissement image */}
      {enlargedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setEnlargedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-screen"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={enlargedImage}
              alt="Image agrandie"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Filtres et liste des contacts */}
        {(showSidebar || !isMobile) && (
          <div
            ref={contactMenuRef}
            className={`${
              isMobile ? "absolute inset-0 z-20 shadow-xl" : "w-[280px]"
            } bg-white border-r border-gray-200 flex flex-col`}
          >
            {/* En-tête */}
            <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10 flex justify-between items-center">
              <h1 className="text-xl font-medium text-gray-700">Messages</h1>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    realtimeConnected
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {realtimeConnected ? "🟢 En ligne" : "🔴 Hors ligne"}
                </span>
                {selectMode === "none" && (
                  <button
                    onClick={() => toggleSelectMode("conversations")}
                    className="p-1.5 rounded text-gray-500 hover:bg-gray-100"
                    title="Sélection multiple"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </button>
                )}
                {selectMode === "conversations" && (
                  <>
                    <button
                      onClick={() => toggleSelectMode("none")}
                      className="p-1.5 rounded bg-gray-100 text-gray-500"
                      title="Annuler la sélection"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    {selected.conversations.length > 0 && (
                      <button
                        onClick={handleDeleteSelected}
                        className="p-1.5 rounded bg-red-100 text-red-500"
                        title="Supprimer la sélection"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </>
                )}
                {isMobile && (
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Barre de recherche */}
            <div className="p-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher des messages ou des contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Section Filtres */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("filters")}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-700 flex items-center">
                    <svg
                      className="h-4 w-4 mr-2 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Filtres
                  </span>
                  <svg
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      showContactSections.filters ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showContactSections.filters && (
                  <div>
                    {messageFilters.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`w-full flex items-center px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                          activeFilter === filter.id
                            ? "bg-blue-50 border-l-2 border-blue-500"
                            : "text-gray-600"
                        }`}
                      >
                        <span className="mr-2 text-lg">{filter.icon}</span>
                        <span className="text-sm">{filter.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Section Messages suivis */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("starred")}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-700 flex items-center">
                    <svg
                      className="h-4 w-4 mr-2 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Messages suivis
                  </span>
                  <svg
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      showContactSections.starred ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showContactSections.starred && (
                  <div>
                    {filteredConversations
                      .filter((conv) => conv.is_starred_user1)
                      .map((conv) => (
                        <div
                          key={conv.id}
                          onClick={() => selectContact(conv)}
                          className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectMode === "conversations" &&
                            selected.conversations.includes(conv.id)
                              ? "bg-blue-50"
                              : currentConversation?.id === conv.id
                              ? "bg-blue-50 border-l-2 border-blue-500"
                              : ""
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              {selectMode === "conversations" && (
                                <div className="mt-2">
                                  <input
                                    type="checkbox"
                                    checked={selected.conversations.includes(
                                      conv.id
                                    )}
                                    onChange={() => {}}
                                    className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                                  />
                                </div>
                              )}
                              <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                  {conv.otherUser?.profile_image ? (
                                    <img
                                      src={conv.otherUser.profile_image}
                                      alt={conv.otherUser.nom_utilisateur}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-white font-medium">
                                      {getInitials(
                                        conv.otherUser?.nom_utilisateur || ""
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium text-gray-800 text-sm truncate">
                                    {conv.otherUser?.nom_utilisateur ||
                                      "Utilisateur"}
                                  </h3>
                                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                    {conv.last_message_at
                                      ? formatTime(conv.last_message_at)
                                      : ""}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">
                                  {conv.otherUser?.email || ""}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                  {conv.lastMessage?.content || "Aucun message"}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStarConversation(
                                  conv.id,
                                  !conv.is_starred_user1
                                );
                              }}
                              className={`${
                                conv.is_starred_user1
                                  ? "text-yellow-400"
                                  : "text-gray-300 hover:text-yellow-400"
                              } rounded-full`}
                            >
                              <svg
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}

                    {filteredConversations.filter(
                      (conv) => conv.is_starred_user1
                    ).length === 0 && (
                      <div className="p-4 text-center text-gray-500 italic text-sm">
                        Aucun message suivi
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section Conversations récentes */}
              <div>
                <button
                  onClick={() => toggleSection("recent")}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-700 flex items-center">
                    <svg
                      className="h-4 w-4 mr-2 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Conversations récentes
                  </span>
                  <svg
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      showContactSections.recent ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showContactSections.recent && (
                  <div>
                    {loading && filteredConversations.length === 0 ? (
                      <LoadingSpinner />
                    ) : (
                      filteredConversations.map((conv) => (
                        <div
                          key={conv.id}
                          className={`p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                            selectMode === "conversations" &&
                            selected.conversations.includes(conv.id)
                              ? "bg-blue-50"
                              : currentConversation?.id === conv.id
                              ? "bg-blue-50 border-l-2 border-blue-500"
                              : ""
                          }`}
                        >
                          <div className="flex items-start">
                            <div
                              className="flex items-start flex-1 min-w-0 cursor-pointer"
                              onClick={() => selectContact(conv)}
                            >
                              {selectMode === "conversations" && (
                                <div className="mr-2 mt-2">
                                  <input
                                    type="checkbox"
                                    checked={selected.conversations.includes(
                                      conv.id
                                    )}
                                    onChange={() => {}}
                                    className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                                  />
                                </div>
                              )}

                              <div className="relative mr-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                  {conv.otherUser?.profile_image ? (
                                    <img
                                      src={conv.otherUser.profile_image}
                                      alt={conv.otherUser.nom_utilisateur}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-medium">
                                      {getInitials(
                                        conv.otherUser?.nom_utilisateur || ""
                                      )}
                                    </div>
                                  )}
                                </div>
                                {conv.unreadCount && conv.unreadCount > 0 && (
                                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {conv.unreadCount}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium text-gray-800 text-sm truncate">
                                    {conv.otherUser?.nom_utilisateur ||
                                      "Utilisateur"}
                                  </h3>
                                  <span className="text-xs text-gray-500 whitespace-nowrap ml-1">
                                    {conv.last_message_at
                                      ? formatTime(conv.last_message_at)
                                      : ""}
                                  </span>
                                </div>

                                <p className="text-xs text-gray-500 mt-1 truncate">
                                  {conv.lastMessage?.content || "Aucun message"}
                                </p>

                                {!selectMode && (
                                  <div className="mt-2 flex space-x-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        selectContact(conv);
                                      }}
                                      className="flex-1 py-1 px-2 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 rounded-full transition-colors"
                                    >
                                      Voir conversation
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-end ml-2 space-y-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStarConversation(
                                    conv.id,
                                    !conv.is_starred_user1
                                  );
                                }}
                                className={`p-0.5 rounded-full ${
                                  conv.is_starred_user1
                                    ? "text-yellow-400"
                                    : "text-gray-300 hover:text-yellow-400"
                                }`}
                              >
                                <svg
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </button>
                              {selectMode === "none" && (
                                <div className="relative">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowContactMenu(conv.id);
                                    }}
                                    className="p-0.5 text-gray-400 hover:text-gray-600 rounded-full"
                                  >
                                    <svg
                                      className="h-4 w-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                      />
                                    </svg>
                                  </button>

                                  {showContactMenu === conv.id && (
                                    <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-30 w-48">
                                      {/* Archive/Unarchive */}
                                      {conv.is_archived_user1 ? (
                                        <button
                                          onClick={() =>
                                            handleArchiveConversation(
                                              conv.id,
                                              false
                                            )
                                          }
                                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                        >
                                          <svg
                                            className="h-4 w-4 mr-2 text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                            />
                                          </svg>
                                          Désarchiver
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() =>
                                            handleArchiveConversation(
                                              conv.id,
                                              true
                                            )
                                          }
                                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                        >
                                          <svg
                                            className="h-4 w-4 mr-2 text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                            />
                                          </svg>
                                          Archiver
                                        </button>
                                      )}

                                      {/* Spam/Unspam */}
                                      {conv.is_spam_user1 ? (
                                        <button
                                          onClick={() =>
                                            handleReportConversation(
                                              conv.id,
                                              false
                                            )
                                          }
                                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                        >
                                          <svg
                                            className="h-4 w-4 mr-2 text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                          </svg>
                                          Retirer du spam
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() =>
                                            handleReportConversation(
                                              conv.id,
                                              true
                                            )
                                          }
                                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                        >
                                          <svg
                                            className="h-4 w-4 mr-2 text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                          </svg>
                                          Signaler comme spam
                                        </button>
                                      )}

                                      {/* Delete */}
                                      <button
                                        onClick={() =>
                                          handleDeleteConversation(conv.id)
                                        }
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center border-t border-gray-100"
                                      >
                                        <svg
                                          className="h-4 w-4 mr-2 text-red-500"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                          />
                                        </svg>
                                        Supprimer
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}

                    {!loading && filteredConversations.length === 0 && (
                      <div className="p-4 text-center text-gray-500 italic text-sm">
                        Aucune conversation trouvée
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Zone de chat principale */}
        <div className="flex-1 flex flex-col">
          {/* En-tête du chat */}
          {currentConversation ? (
            <div className="bg-white border-b border-gray-200 p-3 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isMobile && !showSidebar && (
                    <button
                      onClick={() => setShowSidebar(true)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-1"
                    >
                      <svg
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </button>
                  )}

                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      {userInfo.photo ? (
                        <img
                          src={userInfo.photo}
                          alt={userInfo.nom}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-600 font-medium rounded-full">
                          {getInitials(userInfo.nom || "")}
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="font-medium text-gray-800">
                        {userInfo.nom} {userInfo.prenom}
                      </h2>
                      <div className="flex items-center">
                        <p className="text-xs text-gray-500">
                          @
                          {userInfo.prenom === ""
                            ? userInfo.nom
                            : userInfo.username}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  {/* Bouton de recherche dans la conversation */}
                  <div className="relative group">
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>

                    <div className="absolute right-0 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 w-64">
                        <input
                          type="text"
                          placeholder="Rechercher dans la conversation..."
                          value={searchInConversation}
                          onChange={(e) =>
                            setSearchInConversation(e.target.value)
                          }
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mode de sélection de messages */}
                  <button
                    onClick={() => toggleSelectMode("messages")}
                    className={`p-2 ${
                      selectMode === "messages"
                        ? "text-blue-500 bg-blue-50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    } rounded-full transition-colors`}
                    title="Sélectionner des messages"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-8 8-4-4"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => setShowInfoSidebar(!showInfoSidebar)}
                    className={`p-2 ${
                      showInfoSidebar
                        ? "text-blue-500 bg-blue-50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    } rounded-full transition-colors`}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>

                  {/* Menu des actions */}
                  <div className="relative">
                    <button
                      onClick={() => setShowContactMenu(currentConversation.id)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>

                    {showContactMenu === currentConversation.id && (
                      <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-30 w-48">
                        {/* Archive/Unarchive */}
                        {currentConversation.is_archived_user1 ? (
                          <button
                            onClick={() =>
                              handleArchiveConversation(
                                currentConversation.id,
                                false
                              )
                            }
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <svg
                              className="h-4 w-4 mr-2 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                              />
                            </svg>
                            Désarchiver
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleArchiveConversation(
                                currentConversation.id,
                                true
                              )
                            }
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <svg
                              className="h-4 w-4 mr-2 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                              />
                            </svg>
                            Archiver
                          </button>
                        )}

                        {/* Spam/Unspam */}
                        {currentConversation.is_spam_user1 ? (
                          <button
                            onClick={() =>
                              handleReportConversation(
                                currentConversation.id,
                                false
                              )
                            }
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <svg
                              className="h-4 w-4 mr-2 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            Retirer du spam
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleReportConversation(
                                currentConversation.id,
                                true
                              )
                            }
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <svg
                              className="h-4 w-4 mr-2 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            Signaler comme spam
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() =>
                            handleDeleteConversation(currentConversation.id)
                          }
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center border-t border-gray-100"
                        >
                          <svg
                            className="h-4 w-4 mr-2 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Barre d'actions pour la sélection de messages */}
              {selectMode === "messages" && selected.messages.length > 0 && (
                <div className="mt-2 py-2 px-3 bg-blue-50 rounded-lg flex justify-between items-center">
                  <div className="text-sm text-blue-700">
                    {selected.messages.length} message
                    {selected.messages.length > 1 ? "s" : ""} sélectionné
                    {selected.messages.length > 1 ? "s" : ""}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteSelected}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-red-200 transition-colors"
                    >
                      Supprimer
                    </button>
                    <button
                      onClick={() => toggleSelectMode("none")}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {/* Indication de réponse */}
              {replyingTo && (
                <div className="mt-2 py-2 px-3 bg-blue-50 rounded-lg flex justify-between items-center">
                  <div className="text-sm text-blue-700">
                    Réponse à: {replyingTo.content?.substring(0, 50)}
                    {replyingTo.content && replyingTo.content.length > 50
                      ? "..."
                      : ""}
                  </div>
                  <button
                    onClick={cancelReply}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border-b border-gray-200 p-3 sticky top-0 z-10">
              <div className="flex items-center">
                {isMobile && !showSidebar && (
                  <button
                    onClick={() => setShowSidebar(true)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2"
                  >
                    <svg
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                )}
                <h2 className="font-medium text-gray-800">Messages</h2>
              </div>
            </div>
          )}

          {/* Zone de messages */}
          <div className="flex-1 flex overflow-hidden">
            {/* Messages */}
            <div className="flex-1 flex flex-col">
              {/* Corps du chat */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                {!currentConversation ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-gray-400 mb-2">
                        <svg
                          className="h-16 w-16 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">
                        Sélectionnez une conversation pour commencer
                      </p>
                    </div>
                  </div>
                ) : loading ? (
                  <LoadingSpinner />
                ) : filteredMessages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-gray-400 mb-2">
                        <svg
                          className="h-16 w-16 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">
                        {searchInConversation
                          ? "Aucun message ne correspond à votre recherche"
                          : `Commencez une conversation avec ${
                              userInfo.nom || "cet utilisateur"
                            }`}
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredMessages.map((message) => {
                    const isCurrentUser = isCurrentUserMessage(message);
                    const isSelected = selected.messages.includes(message.id);
                    const repliedMessage = message.reply_to_id
                      ? messages.find((m) => m.id === message.reply_to_id)
                      : null;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isCurrentUser
                            ? "justify-end"
                            : message.message_type === "system" ||
                              message.message_type === "warning"
                            ? "justify-center"
                            : "justify-start"
                        } group relative`}
                      >
                        {/* Checkbox pour la sélection */}
                        {selectMode === "messages" && (
                          <div
                            className={`absolute ${
                              isCurrentUser
                                ? "right-10 mr-36 mt-8"
                                : "left-10 ml-36 mt-8"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() =>
                                toggleMessageSelection(message.id)
                              }
                              className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                            />
                          </div>
                        )}

                        {!isCurrentUser &&
                          message.message_type !== "system" && (
                            <div className="shrink-0 mr-2 mt-1">
                              <div className="w-8 h-8 rounded-full overflow-hidden">
                                {userInfo.photo ? (
                                  <img
                                    src={userInfo.photo}
                                    alt={userInfo.nom || ""}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium">
                                    {getInitials(userInfo.nom || "")}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                        <div
                          className={`max-w-[75%] ${
                            message.message_type === "system" ||
                            message.message_type === "warning"
                              ? "w-full max-w-md"
                              : ""
                          }`}
                        >
                          {message.message_type !== "system" &&
                            message.message_type !== "warning" && (
                              <div
                                className={`text-xs text-gray-500 mb-1 ${
                                  isCurrentUser ? "text-right" : ""
                                }`}
                              >
                                {!isCurrentUser && (
                                  <span className="font-medium mr-2">
                                    {userInfo.nom || "Utilisateur"}
                                  </span>
                                )}
                                {formatTime(message.created_at)}
                              </div>
                            )}

                          <div className="relative">
                            <div
                              className={`rounded-lg p-3 text-sm ${
                                isCurrentUser
                                  ? "bg-blue-500 text-white"
                                  : message.message_type === "system" ||
                                    message.message_type === "warning"
                                  ? "bg-transparent"
                                  : "bg-white border border-gray-200 text-gray-700"
                              }`}
                            >
                              {/* Message en cours d'édition */}
                              {editingMessage === message.id ? (
                                <div className="flex flex-col space-y-2">
                                  <textarea
                                    value={editContent}
                                    onChange={(e) =>
                                      setEditContent(e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm resize-none text-gray-900"
                                    rows={3}
                                    autoFocus
                                  />
                                  <div className="flex justify-end space-x-2 mt-2">
                                    <button
                                      onClick={() => {
                                        setEditingMessage(null);
                                        setEditContent("");
                                      }}
                                      className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                                    >
                                      Annuler
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleEditMessage(message.id)
                                      }
                                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                    >
                                      Modifier
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {/* Aperçu du message auquel on répond (style WhatsApp) */}
                                  {repliedMessage && (
                                    <ReplyPreview replyTo={repliedMessage} />
                                  )}

                                  {renderMessageContent(message)}
                                </>
                              )}

                              {/* Indicateur de message modifié */}
                              {message.is_edited && (
                                <div className="text-xs text-gray-400 mt-1 italic">
                                  modifié
                                </div>
                              )}
                            </div>

                            {/* Actions rapides sur le message */}
                            {selectMode === "none" &&
                              editingMessage !== message.id && (
                                <div
                                  className={`absolute ${
                                    isCurrentUser ? "-left-16" : "-right-16"
                                  } top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex flex-col space-y-1 transition-opacity`}
                                >
                                  {/* Bouton réponse */}
                                  <button
                                    onClick={() =>
                                      handleReplyToMessage(message)
                                    }
                                    className="p-1.5 bg-white rounded-full shadow-sm text-gray-500 hover:text-blue-500"
                                    title="Répondre"
                                  >
                                    <svg
                                      className="h-4 w-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                      />
                                    </svg>
                                  </button>

                                  {/* Bouton favori */}
                                  <button
                                    onClick={() =>
                                      handleStarMessage(
                                        message.id,
                                        !message.is_starred
                                      )
                                    }
                                    className={`p-1.5 bg-white rounded-full shadow-sm ${
                                      message.is_starred
                                        ? "text-yellow-500"
                                        : "text-gray-500 hover:text-yellow-500"
                                    }`}
                                    title={
                                      message.is_starred
                                        ? "Retirer des favoris"
                                        : "Ajouter aux favoris"
                                    }
                                  >
                                    <svg
                                      className="h-4 w-4"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  </button>

                                  {/* Bouton modifier (uniquement pour les messages de l'utilisateur) */}
                                  {isCurrentUser && (
                                    <button
                                      onClick={() => {
                                        setEditingMessage(message.id);
                                        setEditContent(message.content || "");
                                      }}
                                      className="p-1.5 bg-white rounded-full shadow-sm text-gray-500 hover:text-green-500"
                                      title="Modifier"
                                    >
                                      <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                      </svg>
                                    </button>
                                  )}

                                  {/* Bouton supprimer (uniquement pour les messages de l'utilisateur) */}
                                  {isCurrentUser && (
                                    <button
                                      onClick={() =>
                                        handleDeleteMessage(message.id)
                                      }
                                      className="p-1.5 bg-white rounded-full shadow-sm text-gray-500 hover:text-red-500"
                                      title="Supprimer"
                                    >
                                      <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
              {currentConversation && (
                <div className="border-t border-gray-200 bg-white p-3">
                  {/* Pièces jointes */}
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5"
                        >
                          <span className="text-sm text-gray-700 mr-2">
                            {file.name}
                          </span>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Zone de prévisualisation des fichiers */}
                  {(attachmentPreviews.length > 0 ||
                    uploadingFiles.length > 0) && (
                    <div className="border-t border-gray-200 bg-white p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-700">
                          Fichiers à envoyer (
                          {attachmentPreviews.length + uploadingFiles.length})
                        </h4>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSendFiles}
                            disabled={uploadingFiles.length > 0}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {uploadingFiles.length > 0
                              ? "Envoi en cours..."
                              : "Tout envoyer"}
                          </button>
                          <button
                            onClick={() => {
                              setAttachmentPreviews([]);
                              setUploadingFiles([]);
                            }}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto">
                        {/* Prévisualisations des fichiers */}
                        {attachmentPreviews.map((preview, index) => (
                          <div
                            key={index}
                            className="relative border border-gray-200 rounded-lg overflow-hidden group"
                          >
                            {preview.type === "image" && (
                              <div className="aspect-square bg-gray-100">
                                <img
                                  src={preview.preview}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            {preview.type === "video" && (
                              <div className="aspect-square bg-gray-800 flex items-center justify-center">
                                <video className="w-full h-full object-cover">
                                  <source
                                    src={preview.preview}
                                    type={preview.file.type}
                                  />
                                </video>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="bg-black bg-opacity-50 rounded-full p-2">
                                    <svg
                                      className="h-8 w-8 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            )}

                            {preview.type === "file" && (
                              <div className="aspect-square bg-gray-100 flex flex-col items-center justify-center p-2">
                                <svg
                                  className="h-8 w-8 text-gray-400 mb-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                <span className="text-xs text-gray-600 text-center truncate w-full">
                                  {preview.file.name}
                                </span>
                              </div>
                            )}

                            <button
                              onClick={() => removeAttachmentPreview(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>

                            <div className="p-2">
                              <div className="text-xs font-medium text-gray-700 truncate">
                                {preview.file.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {(preview.file.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Indicateurs d'upload en cours */}
                        {uploadingFiles.map((fileName, index) => (
                          <div
                            key={`uploading-${index}`}
                            className="border border-gray-200 rounded-lg p-3"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="shrink-0">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <svg
                                    className="h-5 w-5 text-blue-500 animate-spin"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-700 truncate">
                                  {fileName}
                                </div>
                                <div className="mt-1">
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${
                                          uploadProgress[fileName] || 0
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {uploadProgress[fileName] || 0}% • Envoi en
                                    cours...
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-end space-x-3">
                    <div className="flex-1 relative">
                      <textarea
                        placeholder="Tapez un message..."
                        rows={1}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="w-full border border-gray-200 rounded-lg py-3 px-4 pr-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                        <button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="p-1.5 text-gray-500 hover:text-gray-700 rounded"
                        >
                          <span className="text-lg">😊</span>
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="p-1.5 text-gray-500 hover:text-gray-700 rounded"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                            />
                          </svg>
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          multiple
                          onChange={handleFileChange}
                        />
                      </div>

                      {showEmojiPicker && (
                        <div
                          ref={emojiPickerRef}
                          className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10"
                        >
                          <div className="grid grid-cols-5 gap-1 max-w-xs">
                            {commonEmojis.map((emoji, index) => (
                              <button
                                key={index}
                                onClick={() => addEmoji(emoji)}
                                className="text-xl hover:bg-gray-100 rounded p-1.5 transition-colors"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() && attachments.length === 0}
                      className={`bg-blue-500 text-white rounded-lg p-3 ${
                        !newMessage.trim() && attachments.length === 0
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-blue-600"
                      } transition-colors`}
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar d'information */}
            {showInfoSidebar && currentConversation && (
              <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">Informations</h3>
                  <button
                    onClick={() => setShowInfoSidebar(false)}
                    className="text-gray-500 hover:text-gray-700 p-1.5 rounded hover:bg-gray-100"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-center flex-col mb-6">
                    <div className="relative mb-2">
                      {userInfo.photo ? (
                        <img
                          src={userInfo.photo}
                          alt={userInfo.nom}
                          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl border-4 border-white shadow">
                          {getInitials(userInfo.nom)}
                        </div>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-800 text-center">
                      {userInfo.nom} {userInfo.prenom}
                    </h4>
                    <p className="text-sm text-gray-500">
                      @{userInfo.username}
                    </p>
                  </div>

                  {/* Statistiques de la conversation */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-500 mb-2">
                      Statistiques
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-gray-600">Messages</div>
                        <div className="font-medium text-gray-800">
                          {messages.length}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Non lus</div>
                        <div className="font-medium text-gray-800">
                          {currentConversation.unreadCount || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date de création */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-500">
                      Conversation créée
                    </div>
                    <div className="font-medium text-gray-800">
                      {format(
                        new Date(currentConversation.created_at),
                        "dd MMMM yyyy",
                        { locale: fr }
                      )}
                    </div>
                  </div>

                  {/* Dernier message */}
                  {currentConversation.last_message_at && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500">
                        Dernier message
                      </div>
                      <div className="font-medium text-gray-800">
                        {format(
                          new Date(currentConversation.last_message_at),
                          "dd/MM/yyyy à HH:mm",
                          { locale: fr }
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">Actions</div>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() =>
                          handleStarConversation(
                            currentConversation.id,
                            !currentConversation.is_starred_user1
                          )
                        }
                        className={`px-4 py-2 rounded text-sm transition-colors flex items-center ${
                          currentConversation.is_starred_user1
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <svg
                          className="h-4 w-4 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {currentConversation.is_starred_user1
                          ? "Retirer des favoris"
                          : "Ajouter aux favoris"}
                      </button>

                      {currentConversation.is_archived_user1 ? (
                        <button
                          onClick={() =>
                            handleArchiveConversation(
                              currentConversation.id,
                              false
                            )
                          }
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-200 transition-colors flex items-center"
                        >
                          <svg
                            className="h-4 w-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                            />
                          </svg>
                          Désarchiver
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleArchiveConversation(
                              currentConversation.id,
                              true
                            )
                          }
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-200 transition-colors flex items-center"
                        >
                          <svg
                            className="h-4 w-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                            />
                          </svg>
                          Archiver
                        </button>
                      )}

                      {currentConversation.is_spam_user1 ? (
                        <button
                          onClick={() =>
                            handleReportConversation(
                              currentConversation.id,
                              false
                            )
                          }
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-200 transition-colors flex items-center"
                        >
                          <svg
                            className="h-4 w-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          Retirer du spam
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleReportConversation(
                              currentConversation.id,
                              true
                            )
                          }
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-200 transition-colors flex items-center"
                        >
                          <svg
                            className="h-4 w-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          Signaler comme spam
                        </button>
                      )}

                      <button
                        onClick={() =>
                          handleDeleteConversation(currentConversation.id)
                        }
                        className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm hover:bg-red-200 transition-colors flex items-center"
                      >
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Supprimer la conversation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingInterface;
