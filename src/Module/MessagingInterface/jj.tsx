"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/Context/ContextUser";
import { useMessaging } from "@/Context/MessageContext";

// ============================================================================
// COMPOSANTS SIMPLES
// ============================================================================

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-40">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
  </div>
);

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isDangerous = false,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm shadow-xl">
        <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg ${
              isDangerous
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

const ImageLightbox = ({ isOpen, imageSrc, imageName, onClose }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageSrc}
          alt={imageName}
          className="max-w-full max-h-screen object-contain"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 shadow-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// ✅ MODALE DE PRÉVISUALISATION AVANT ENVOI
const PreviewModal = ({ isOpen, files, onConfirm, onCancel, onRemove }) => {
  if (!isOpen || files.length === 0) return null;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return "🖼️";
    if (type.startsWith("video/")) return "🎬";
    if (type.startsWith("application/pdf")) return "📄";
    return "📎";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl mx-4 shadow-xl max-h-96 overflow-y-auto">
        <h3 className="font-semibold text-gray-800 mb-4">
          Prévisualisation des fichiers ({files.length})
        </h3>

        <div className="space-y-3 mb-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
            >
              <div className="flex items-center flex-1 min-w-0">
                <span className="text-2xl mr-3">{getFileIcon(file.type)}</span>
                <div className="min-w-0 flex-1">
                  {file.type.startsWith("image/") && (
                    <div className="mb-2">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="max-h-32 rounded"
                      />
                    </div>
                  )}
                  {file.type.startsWith("video/") && (
                    <div className="mb-2">
                      <video className="max-h-32 rounded" controls>
                        <source
                          src={URL.createObjectURL(file)}
                          type={file.type}
                        />
                      </video>
                    </div>
                  )}
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRemove(index)}
                className="ml-2 text-red-500 hover:text-red-700 p-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            Envoyer ({files.length})
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ MODALE DE RECHERCHE
const SearchModal = ({ isOpen, searchTerm, onSearchChange, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">
            Rechercher dans la conversation
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <input
          type="text"
          placeholder="Chercher un message..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          autoFocus
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-3">
          Appuyez sur Échap pour fermer
        </p>
      </div>
    </div>
  );
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return format(date, "HH:mm", { locale: fr });
  }
  return format(date, "d MMM", { locale: fr });
};

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
};

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

const MessagingInterface = () => {
  const searchParams = useSearchParams();
  const otherUserId = searchParams.get("userId");

  const {
    conversations,
    currentConversation,
    setCurrentConversation,
    messages,
    loading,
    error,
    setError,
    sendMessage,
    markAsRead,
    toggleStar,
    archiveConversation,
    reportConversation,
    deleteConversation,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    isMobile,
    showSidebar,
    setShowSidebar,
    messagesEndRef,
    isUploadingImage,
    isUploadingVideo,
    isUploadingDocument,
    videoCompressionProgress,
    createConversation,
  } = useMessaging();

  const { currentSession } = useAuth();

  // ✅ ÉTATS LOCAUX
  const [newMessage, setNewMessage] = useState("");
  const [previewFiles, setPreviewFiles] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showContactMenu, setShowContactMenu] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchInConversation, setSearchInConversation] = useState("");
  const [showInfoSidebar, setShowInfoSidebar] = useState(false);
  const [showContactSections, setShowContactSections] = useState({
    filters: true,
    starred: true,
    recent: true,
  });

  // Modales
  const [showConfirm, setShowConfirm] = useState({
    isOpen: false,
    action: null, // 'archive' | 'delete' | 'report' | 'delete-message'
    conversationId: null,
    messageId: null,
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [showImageLightbox, setShowImageLightbox] = useState(false);
  const [lightboxImage, setLightboxImage] = useState({ src: "", name: "" });

  const fileInputRef = useRef(null);
  const contactMenuRef = useRef(null);

  const messageFilters = [
    { id: "all", label: "Tous", icon: "💬" },
    { id: "unread", label: "Non lues", icon: "🔴" },
    { id: "starred", label: "Favoris", icon: "⭐" },
    { id: "archived", label: "Archives", icon: "📁" },
    { id: "spam", label: "Spam", icon: "🚫" },
  ];

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

  // ✅ FERMER MENUS
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contactMenuRef.current &&
        !contactMenuRef.current.contains(event.target)
      ) {
        setShowContactMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ AUTO-DISMISS MESSAGES
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // ✅ ÉCHAP pour fermer recherche
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        setShowSearchModal(false);
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  // ✅ INITIALISER CONVERSATION
  useEffect(() => {
    if (otherUserId && currentSession?.user?.id && conversations.length > 0) {
      const existing = conversations.find(
        (conv) =>
          (conv.user1_id === currentSession.user.id &&
            conv.user2_id === otherUserId) ||
          (conv.user1_id === otherUserId &&
            conv.user2_id === currentSession.user.id)
      );

      if (existing) {
        setCurrentConversation(existing);
      } else {
        createConversation(otherUserId).then((convId) => {
          const newConv = conversations.find((c) => c.id === convId);
          if (newConv) setCurrentConversation(newConv);
        });
      }
    }
  }, [otherUserId, conversations.length, currentSession?.user?.id]);

  // ✅ FILTRER CONVERSATIONS
  const getFilteredConversations = () => {
    return conversations.filter((conv) => {
      switch (activeFilter) {
        case "unread":
          return conv.unread_count > 0 && !conv.is_archived && !conv.is_spam;
        case "starred":
          return conv.is_starred && !conv.is_archived && !conv.is_spam;
        case "archived":
          return conv.is_archived === true;
        case "spam":
          return conv.is_spam === true;
        default:
          return !conv.is_archived && !conv.is_spam;
      }
    });
  };

  // ✅ FILTRER MESSAGES
  const getFilteredMessages = () => {
    if (!searchInConversation.trim()) return messages;
    return messages.filter((msg) =>
      msg.content.toLowerCase().includes(searchInConversation.toLowerCase())
    );
  };

  // ✅ SÉLECTIONNER CONVERSATION
  const selectContact = (conversation) => {
    setCurrentConversation(conversation);
    setSearchInConversation("");
    if (isMobile) setShowSidebar(false);
    markAsRead(conversation.id);
  };

  // ✅ ENVOYER MESSAGE
  const handleSendMessage = async () => {
    if (!newMessage.trim() && previewFiles.length === 0) return;
    if (!currentConversation) return;

    // Envoyer fichiers
    if (previewFiles.length > 0) {
      for (const file of previewFiles) {
        await sendMessage(file.name, currentConversation.id, file, undefined);
      }
    }

    // Envoyer message texte
    if (newMessage.trim()) {
      await sendMessage(
        newMessage,
        currentConversation.id,
        undefined,
        undefined
      );
    }

    setNewMessage("");
    setPreviewFiles([]);
    setShowPreviewModal(false);
    setSuccessMsg("Message envoyé");
  };

  // ✅ GÉRER FICHIERS
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setPreviewFiles([...previewFiles, ...files]);
    setShowPreviewModal(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFilePreview = (index) => {
    const newFiles = [...previewFiles];
    newFiles.splice(index, 1);
    setPreviewFiles(newFiles);
  };

  // ✅ ACTIONS AVEC CONFIRMATION
  const confirmAction = (action, conversationId = null, messageId = null) => {
    setShowConfirm({
      isOpen: true,
      action,
      conversationId,
      messageId,
    });
  };

  const handleConfirmAction = async () => {
    const { action, conversationId, messageId } = showConfirm;

    try {
      if (action === "archive") {
        await archiveConversation(conversationId);
        setSuccessMsg("Conversation archivée");
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(null);
        }
      } else if (action === "delete") {
        await deleteConversation(conversationId);
        setSuccessMsg("Conversation supprimée");
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(null);
        }
      } else if (action === "report") {
        await reportConversation(conversationId);
        setSuccessMsg("Conversation signalée");
      } else if (action === "delete-message") {
        // ✅ SUPPRIMER MESSAGE (SOFT DELETE)
        await deleteMessage(messageId);
        setSuccessMsg("Message supprimé");
      }
      setShowContactMenu(null);
    } catch (err) {
      setError("Erreur lors de l'action");
    } finally {
      setShowConfirm({
        isOpen: false,
        action: null,
        conversationId: null,
        messageId: null,
      });
    }
  };

  // ✅ SUPPRIMER MESSAGE (SOFT DELETE)
  const deleteMessage = async (messageId) => {
    try {
      // Utiliser le même système que pour les conversations
      const { UpdateData } = require("@/Config/SupabaseData");
      await UpdateData("messages", messageId, {
        is_deleted: true,
      });

      // Recharger les messages
      if (currentConversation) {
        const { loadMessages } = require("@/Context/MessageContext");
        // Les messages se rechargeront via subscription
      }
    } catch (err) {
      console.error("Erreur suppression message:", err);
      setError("Erreur lors de la suppression");
    }
  };

  // ✅ ÉTOILER MESSAGE
  const handleStarMessage = async (conversationId, messageId) => {
    await toggleStar(conversationId, messageId);
  };

  // ✅ RENDU CONTENU MESSAGE
  const renderMessageContent = (message) => {
    switch (message.message_type) {
      case "image":
        return (
          <div
            className="cursor-pointer hover:opacity-80"
            onClick={() => {
              setLightboxImage({
                src: message.file_url,
                name: message.file_name || "Image",
              });
              setShowImageLightbox(true);
            }}
          >
            <img
              src={message.file_url}
              alt="Message"
              className="max-w-sm max-h-64 rounded-lg"
            />
          </div>
        );

      case "video":
        return (
          <video controls className="max-w-sm max-h-64 rounded-lg">
            <source src={message.file_url} type="video/mp4" />
          </video>
        );

      case "file":
        return (
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <span className="text-xl">📄</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {message.file_name}
              </p>
              <a
                href={message.file_url}
                download
                className="text-xs text-blue-500 hover:underline"
              >
                Télécharger
              </a>
            </div>
          </div>
        );

      default:
        return <div className="whitespace-pre-wrap">{message.content}</div>;
    }
  };

  const isCurrentUserMessage = (message) =>
    message.sender_id === currentSession?.user?.id;
  const currentRecipient = currentConversation?.other_user;
  const filteredConversations = getFilteredConversations();
  const filteredMessages = getFilteredMessages();

  // ============================================================================
  // RENDU
  // ============================================================================

  return (
    <div className="h-screen flex flex-col bg-gray-100 py-16">
      {/* Messages de succès */}
      {successMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-40">
          {successMsg}
        </div>
      )}

      {/* Messages d'erreur */}
      {error && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-40 flex items-center gap-2">
          {error}
          <button onClick={() => setError(null)} className="ml-2">
            ✕
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR GAUCHE */}
        {(showSidebar || !isMobile) && (
          <div
            ref={contactMenuRef}
            className={`${
              isMobile ? "absolute inset-0 z-20 shadow-xl" : "w-80"
            } bg-white border-r border-gray-200 flex flex-col`}
          >
            {/* En-tête */}
            <div className="p-4 border-b border-gray-200 sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800">
                  Messages
                </h1>
                {isMobile && (
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Barre de recherche */}
            <div className="p-3 border-b border-gray-200">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Contenu */}
            <div className="flex-1 overflow-y-auto">
              {/* Section Filtres */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() =>
                    setShowContactSections({
                      ...showContactSections,
                      filters: !showContactSections.filters,
                    })
                  }
                  className="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-50 font-semibold text-gray-700"
                >
                  Filtres
                  <span>{showContactSections.filters ? "✓" : ">"}</span>
                </button>

                {showContactSections.filters && (
                  <div>
                    {messageFilters.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setActiveFilter(f.id)}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          activeFilter === f.id
                            ? "bg-blue-50 border-l-2 border-blue-500 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {f.icon} {f.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Section Favoris */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() =>
                    setShowContactSections({
                      ...showContactSections,
                      starred: !showContactSections.starred,
                    })
                  }
                  className="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-50 font-semibold text-gray-700"
                >
                  Favoris
                  <span>{showContactSections.starred ? "✓" : ">"}</span>
                </button>

                {showContactSections.starred && (
                  <div>
                    {filteredConversations
                      .filter((c) => c.is_starred)
                      .map((conv) => (
                        <ConversationRow
                          key={conv.id}
                          conv={conv}
                          isActive={currentConversation?.id === conv.id}
                          onSelect={() => selectContact(conv)}
                          onStar={() => toggleStar(conv.id)}
                          onMenu={() => setShowContactMenu(conv.id)}
                          showMenu={showContactMenu === conv.id}
                          onArchive={() => confirmAction("archive", conv.id)}
                          onDelete={() => confirmAction("delete", conv.id)}
                          onReport={() => confirmAction("report", conv.id)}
                        />
                      ))}
                    {filteredConversations.filter((c) => c.is_starred)
                      .length === 0 && (
                      <div className="p-4 text-center text-gray-500 text-xs">
                        Aucun favori
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section Conversations */}
              <div>
                <button
                  onClick={() =>
                    setShowContactSections({
                      ...showContactSections,
                      recent: !showContactSections.recent,
                    })
                  }
                  className="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-50 font-semibold text-gray-700"
                >
                  Conversations
                  <span>{showContactSections.recent ? "✓" : ">"}</span>
                </button>

                {showContactSections.recent && (
                  <div>
                    {loading && filteredConversations.length === 0 ? (
                      <LoadingSpinner />
                    ) : filteredConversations.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-xs">
                        Aucune conversation
                      </div>
                    ) : (
                      filteredConversations.map((conv) => (
                        <ConversationRow
                          key={conv.id}
                          conv={conv}
                          isActive={currentConversation?.id === conv.id}
                          onSelect={() => selectContact(conv)}
                          onStar={() => toggleStar(conv.id)}
                          onMenu={() => setShowContactMenu(conv.id)}
                          showMenu={showContactMenu === conv.id}
                          onArchive={() => confirmAction("archive", conv.id)}
                          onDelete={() => confirmAction("delete", conv.id)}
                          onReport={() => confirmAction("report", conv.id)}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ZONE DE CHAT PRINCIPALE */}
        <div className="flex-1 flex flex-col">
          {/* En-tête */}
          {currentConversation ? (
            <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {isMobile && !showSidebar && (
                    <button
                      onClick={() => setShowSidebar(true)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      ☰
                    </button>
                  )}
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                    {currentRecipient?.profile_image ? (
                      <img
                        src={currentRecipient.profile_image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-medium text-sm text-gray-600">
                        {getInitials(currentRecipient?.nom_utilisateur || "")}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-gray-800 truncate">
                      {currentRecipient?.nom_utilisateur}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {currentRecipient?.role === "client"
                        ? "Client"
                        : "Freelance"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => setShowSearchModal(true)}
                    className="p-2 hover:bg-gray-100 rounded text-gray-500"
                    title="Rechercher"
                  >
                    🔍
                  </button>
                  <button
                    onClick={() => setShowInfoSidebar(!showInfoSidebar)}
                    className={`p-2 rounded ${
                      showInfoSidebar
                        ? "bg-blue-50 text-blue-500"
                        : "hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    ℹ️
                  </button>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowContactMenu(
                          showContactMenu === currentConversation.id
                            ? null
                            : currentConversation.id
                        )
                      }
                      className="p-2 hover:bg-gray-100 rounded text-gray-500"
                    >
                      ⋮
                    </button>

                    {showContactMenu === currentConversation.id && (
                      <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded shadow-lg z-20">
                        <button
                          onClick={() =>
                            confirmAction("archive", currentConversation.id)
                          }
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                          📁 Archiver
                        </button>
                        <button
                          onClick={() =>
                            confirmAction("report", currentConversation.id)
                          }
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                          ⚠️ Signaler
                        </button>
                        <button
                          onClick={() =>
                            confirmAction("delete", currentConversation.id)
                          }
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-b border-gray-200 p-4 sticky top-0">
              {isMobile && !showSidebar && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="p-2 hover:bg-gray-100 rounded mb-2"
                >
                  ☰ Afficher conversations
                </button>
              )}
            </div>
          )}

          {/* Zone messages + info */}
          <div className="flex-1 flex overflow-hidden">
            {/* Messages */}
            <div className="flex-1 flex flex-col">
              {/* Affichage messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
                {!currentConversation ? (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Sélectionnez une conversation
                  </div>
                ) : loading ? (
                  <LoadingSpinner />
                ) : filteredMessages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                    {searchInConversation
                      ? "Aucun message trouvé"
                      : "Pas de messages"}
                  </div>
                ) : (
                  filteredMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isCurrentUserMessage(msg)
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {!isCurrentUserMessage(msg) && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex-shrink-0 flex items-center justify-center text-xs font-medium text-gray-600">
                          {msg.sender?.nom_utilisateur
                            ? getInitials(msg.sender.nom_utilisateur)
                            : "?"}
                        </div>
                      )}

                      <div className="max-w-xs">
                        <div className="text-xs text-gray-500 mb-1">
                          {!isCurrentUserMessage(msg) &&
                            msg.sender?.nom_utilisateur}{" "}
                          {formatTime(msg.created_at)}
                        </div>

                        <div
                          className={`rounded-lg p-3 group relative ${
                            isCurrentUserMessage(msg)
                              ? "bg-blue-50 border border-blue-100"
                              : "bg-white border border-gray-200"
                          }`}
                        >
                          {renderMessageContent(msg)}

                          {/* Actions hover */}
                          <div className="absolute -right-16 top-0 opacity-0 group-hover:opacity-100 flex gap-1">
                            <button
                              onClick={() =>
                                handleStarMessage(
                                  currentConversation.id,
                                  msg.id
                                )
                              }
                              className={`p-1.5 bg-white rounded shadow border border-gray-200 ${
                                msg.is_starred
                                  ? "text-yellow-500"
                                  : "text-gray-500 hover:text-yellow-500"
                              }`}
                              title="Favori"
                            >
                              ⭐
                            </button>
                            {isCurrentUserMessage(msg) && (
                              <button
                                onClick={() =>
                                  confirmAction("delete-message", null, msg.id)
                                }
                                className="p-1.5 bg-white rounded shadow border border-gray-200 text-gray-500 hover:text-red-500"
                                title="Supprimer"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Zone d'entrée */}
              {currentConversation && (
                <div className="border-t border-gray-200 bg-white p-4 space-y-2">
                  {/* Barre de progression */}
                  {(isUploadingImage ||
                    isUploadingVideo ||
                    isUploadingDocument) && (
                    <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-500 h-2 transition-all"
                        style={{
                          width: `${
                            isUploadingImage || isUploadingDocument
                              ? 50
                              : videoCompressionProgress
                          }%`,
                        }}
                      />
                    </div>
                  )}

                  {/* Fichiers sélectionnés */}
                  {previewFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {previewFiles.map((file, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                        >
                          {file.name} ({(file.size / 1024).toFixed(0)}KB)
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Champ d'entrée */}
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      onChange={handleFileChange}
                    />

                    <textarea
                      placeholder="Tapez un message..."
                      rows={2}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    />

                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Pièce jointe"
                      >
                        📎
                      </button>
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Emoji"
                      >
                        😊
                      </button>
                      <button
                        onClick={handleSendMessage}
                        disabled={
                          !newMessage.trim() && previewFiles.length === 0
                        }
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                      >
                        ➤
                      </button>
                    </div>
                  </div>

                  {/* Emoji picker */}
                  {showEmojiPicker && (
                    <div className="bg-gray-50 border border-gray-200 rounded p-3 grid grid-cols-5 gap-1">
                      {commonEmojis.map((e) => (
                        <button
                          key={e}
                          onClick={() => {
                            setNewMessage(newMessage + e);
                            setShowEmojiPicker(false);
                          }}
                          className="text-lg hover:bg-gray-200 rounded p-1"
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Info sidebar */}
            {showInfoSidebar && currentRecipient && (
              <div className="w-72 bg-white border-l border-gray-200 p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">À propos</h3>
                  <button
                    onClick={() => setShowInfoSidebar(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-3 bg-gray-200 border-4 border-blue-100">
                    {currentRecipient.profile_image ? (
                      <img
                        src={currentRecipient.profile_image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-lg text-gray-600">
                        {getInitials(currentRecipient.nom_utilisateur)}
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-800">
                    {currentRecipient.nom_utilisateur}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {currentRecipient.role === "client"
                      ? "Client"
                      : "Freelance"}
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() =>
                      confirmAction("archive", currentConversation.id)
                    }
                    className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                  >
                    📁 Archiver
                  </button>
                  <button
                    onClick={() =>
                      confirmAction("delete", currentConversation.id)
                    }
                    className="w-full px-3 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALES */}
      <ConfirmDialog
        isOpen={showConfirm.isOpen}
        title={
          showConfirm.action === "delete"
            ? "Supprimer la conversation ?"
            : showConfirm.action === "delete-message"
            ? "Supprimer le message ?"
            : showConfirm.action === "archive"
            ? "Archiver la conversation ?"
            : "Signaler comme spam ?"
        }
        message={
          showConfirm.action === "delete"
            ? "Cette action est irréversible."
            : showConfirm.action === "delete-message"
            ? "Le message sera supprimé pour vous uniquement."
            : showConfirm.action === "archive"
            ? "La conversation sera archivée et visible dans les archives."
            : "La conversation sera signalée."
        }
        onConfirm={handleConfirmAction}
        onCancel={() =>
          setShowConfirm({
            isOpen: false,
            action: null,
            conversationId: null,
            messageId: null,
          })
        }
        isDangerous={
          showConfirm.action === "delete" ||
          showConfirm.action === "delete-message"
        }
      />

      <ImageLightbox
        isOpen={showImageLightbox}
        imageSrc={lightboxImage.src}
        imageName={lightboxImage.name}
        onClose={() => setShowImageLightbox(false)}
      />

      <PreviewModal
        isOpen={showPreviewModal}
        files={previewFiles}
        onConfirm={handleSendMessage}
        onCancel={() => {
          setShowPreviewModal(false);
          setPreviewFiles([]);
        }}
        onRemove={removeFilePreview}
      />

      <SearchModal
        isOpen={showSearchModal}
        searchTerm={searchInConversation}
        onSearchChange={setSearchInConversation}
        onClose={() => setShowSearchModal(false)}
      />
    </div>
  );
};

// ✅ COMPOSANT RÉUTILISABLE POUR CONVERSATION
const ConversationRow = ({
  conv,
  isActive,
  onSelect,
  onStar,
  onMenu,
  showMenu,
  onArchive,
  onDelete,
  onReport,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
        isActive ? "bg-blue-50 border-l-2 border-blue-500" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
          {conv.other_user?.profile_image ? (
            <img
              src={conv.other_user.profile_image}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-medium text-gray-600">
              {getInitials(conv.other_user?.nom_utilisateur || "")}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-medium text-sm text-gray-800 truncate">
              {conv.other_user?.nom_utilisateur}
            </h3>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-1">
              {formatTime(conv.last_message_at)}
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate">
            {conv.last_message?.content || "Aucun message"}
          </p>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {conv.unread_count > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {conv.unread_count}
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStar();
            }}
            className={conv.is_starred ? "text-yellow-400" : "text-gray-300"}
          >
            ⭐
          </button>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMenu();
              }}
              className="p-0.5 text-gray-400"
            >
              ⋮
            </button>
            {showMenu && (
              <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded shadow z-20 w-40">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive();
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  📁 Archiver
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReport();
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  ⚠️ Signaler
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                >
                  🗑️ Supprimer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingInterface;
