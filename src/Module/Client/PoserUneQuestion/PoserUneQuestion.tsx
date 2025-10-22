import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Paperclip,
  Smile,
  Send,
  Moon,
  Image,
  Video,
  File,
} from "lucide-react";
import { useMessaging } from "@/Context/MessageContext";
import { useAuth } from "@/Context/ContextUser";
import { useFreelances } from "@/Context/Freelance/FreelanceContext";

interface Message {
  id: string;
  text: string;
  sender: "user" | "contact";
  timestamp: Date;
  type?: "text" | "image" | "video" | "file";
  fileUrl?: string;
  fileName?: string;
}

interface MessagingModalProps {
  open: boolean;
  onClose: () => void;
  id: any;
}

const PoserUneQuestion: React.FC<MessagingModalProps> = ({
  open,
  onClose,
  id,
}) => {
  const [message, setMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Contextes
  const {
    sendMessage,
    createConversation,
    uploadImage,
    uploadVideo,
    uploadDocument,
    isUploadingImage,
    isUploadingVideo,
    isUploadingDocument,
  } = useMessaging();

  const { currentSession } = useAuth();
  const { getFreelanceById, getUserFreelance, getPhotoProfileUrl } =
    useFreelances();

  // Récupérer les informations du freelance avec vérification de type
  const freelanceData = getUserFreelance(id);
  const isFreelanceValid =
    freelanceData && typeof freelanceData === "object" && "id" in freelanceData;
  const freelance = isFreelanceValid ? freelanceData : null;

  const photoUrl = getPhotoProfileUrl(freelance?.photo_url || "");

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

  const predefinedMessages = [
    "💬 Bonjour, je recherche un travail de développement de site web pour...",
    "Bonjour, je cherche quelqu'un qui a de l'expérience avec des plateformes comme...",
    "Bonjour, j'ai besoin d'un service en webdesign, pouvez-vous m'aider avec...",
  ];

  // Fermer le sélecteur d'emojis quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Ajouter un emoji au message
  const addEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojis(false);
  };

  // Version temporaire qui simule une conversation
  const handleSendMessage = async () => {
    if (
      (!message.trim() && attachments.length === 0) ||
      !currentSession?.user?.id ||
      !freelance
    ) {
      return;
    }

    setIsUploading(true);

    try {
      // SIMULATION TEMPORAIRE - Créer un ID de conversation fictif
      const temporaryConversationId = `temp_${Date.now()}_${
        currentSession.user.id
      }_${freelance.id}`;

      console.log(
        "🔄 Utilisation conversation temporaire:",
        temporaryConversationId
      );

      // Ajouter le message localement immédiatement
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim() || (attachments.length > 0 ? "Fichier joint" : ""),
        sender: "user",
        timestamp: new Date(),
        type:
          attachments.length > 0
            ? attachments[0].type.startsWith("image/")
              ? "image"
              : attachments[0].type.startsWith("video/")
              ? "video"
              : "file"
            : "text",
        // Pour les fichiers, on simule une URL locale
        fileUrl:
          attachments.length > 0
            ? URL.createObjectURL(attachments[0])
            : undefined,
        fileName: attachments.length > 0 ? attachments[0].name : undefined,
      };

      setLocalMessages((prev) => [...prev, newMessage]);
      setMessage("");
      setAttachments([]);
      setShowEmojis(false);

      // Simuler une réponse automatique après 2 secondes
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: "Merci pour votre message ! Je vous réponds dans les plus brefs délais.",
          sender: "contact",
          timestamp: new Date(),
        };
        setLocalMessages((prev) => [...prev, response]);
      }, 2000);

      // ESSAYER d'envoyer le message pour de vrai (mais ne pas bloquer si ça échoue)
      try {
        if (freelance.id_user) {
          const realConversationId = await createConversation(
            freelance.id_user
          );
          if (realConversationId) {
            await sendMessage(
              message.trim() || "Fichier joint",
              realConversationId,
              attachments.length > 0 ? attachments[0] : undefined
            );
            console.log("✅ Message envoyé avec succès via Supabase");
          }
        }
      } catch (supabaseError) {
        console.warn(
          "⚠️ Supabase échoue mais le message local est affiché:",
          supabaseError
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "❌ Erreur lors de l'envoi du message. Le message a été enregistré localement.",
        sender: "user",
        timestamp: new Date(),
      };
      setLocalMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePredefinedMessage = (text: string) => {
    setMessage(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const validFiles = files.filter((file) => {
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`Le fichier ${file.name} est trop volumineux (max 50MB)`);
        return false;
      }
      return true;
    });

    setAttachments((prev) => [...prev, ...validFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    if (file.type.startsWith("image/")) return <Image className="w-4 h-4" />;
    if (file.type.startsWith("video/")) return <Video className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const renderMessageContent = (msg: Message) => {
    if (msg.type === "image" && msg.fileUrl) {
      return (
        <div className="mt-2">
          <img
            src={msg.fileUrl}
            alt={msg.fileName || "Image"}
            className="max-w-full max-h-48 rounded-lg object-cover"
          />
          {msg.text && msg.text !== "Fichier joint" && (
            <p className="text-sm mt-2">{msg.text}</p>
          )}
        </div>
      );
    }

    if (msg.type === "video" && msg.fileUrl) {
      return (
        <div className="mt-2">
          <video controls className="max-w-full max-h-48 rounded-lg">
            <source src={msg.fileUrl} type="video/mp4" />
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
          {msg.text && msg.text !== "Fichier joint" && (
            <p className="text-sm mt-2">{msg.text}</p>
          )}
        </div>
      );
    }

    if (msg.type === "file" && msg.fileUrl) {
      return (
        <div className="mt-2">
          <div className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors">
            <File className="w-4 h-4" />
            <span className="text-sm font-medium">{msg.fileName}</span>
          </div>
          {msg.text && msg.text !== "Fichier joint" && (
            <p className="text-sm mt-2">{msg.text}</p>
          )}
        </div>
      );
    }

    return <p className="text-sm">{msg.text}</p>;
  };

  if (!open) return null;

  // Si le freelance n'est pas valide, afficher un message d'erreur
  if (!freelance) {
    return (
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Freelance non trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            Impossible de charger les informations du freelance.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header avec l'heure */}
        <div className="bg-black text-white px-4 py-3 flex items-center">
          <Moon className="w-4 h-4 mr-2" />
          <span className="text-sm">
            Il est {formatTime(currentTime)} pour {freelance.nom}{" "}
            {freelance.prenom}. Cela peut prendre un certain temps pour obtenir
            une réponse
          </span>
        </div>

        {/* Profil du freelance */}
        <div className="bg-gray-50 px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={photoUrl || "/images/default-avatar.png"}
                  alt={freelance.nom}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  Contactez {freelance.nom} {freelance.prenom}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    En ligne
                  </span>
                  <span>•</span>
                  <span>
                    {freelance.occupations &&
                      `Spécialité: ${freelance.occupations}`}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Zone de conversation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Instructions */}
          <div className="text-gray-600 text-sm">
            Posez une question à {freelance.nom} {freelance.prenom} ou partagez
            les informations de votre projet (critères, échéances, budget, etc.)
          </div>

          {/* Messages prédéfinis */}
          {localMessages.length === 0 && (
            <div className="space-y-3">
              {predefinedMessages.map((text, index) => (
                <button
                  key={index}
                  onClick={() => handlePredefinedMessage(text)}
                  className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors border border-gray-200"
                >
                  {text}
                </button>
              ))}
            </div>
          )}

          {/* Messages de conversation */}
          {localMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {renderMessageContent(msg)}
                <p
                  className={`text-xs mt-1 ${
                    msg.sender === "user" ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Pièces jointes */}
        {attachments.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  {getFileIcon(file)}
                  <span className="max-w-32 truncate">{file.name}</span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Indicateurs de chargement */}
        {(isUploading ||
          isUploadingImage ||
          isUploadingVideo ||
          isUploadingDocument) && (
          <div className="border-t border-gray-200 px-4 py-2 bg-blue-50">
            <div className="flex items-center space-x-2 text-sm text-blue-700">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
              <span>
                {isUploadingImage && "Compression de l'image..."}
                {isUploadingVideo && "Compression de la vidéo..."}
                {isUploadingDocument && "Upload du document..."}
                {isUploading && "Envoi du message..."}
              </span>
            </div>
          </div>
        )}

        {/* Sélecteur d'emojis */}
        {showEmojis && (
          <div
            ref={emojiPickerRef}
            className="border-t border-gray-200 px-4 py-3 bg-white"
          >
            <div className="flex flex-wrap gap-2">
              {commonEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => addEmoji(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors"
                  title={`Ajouter ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Zone de saisie */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-end space-x-2">
            <div className="flex space-x-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Joindre un fichier"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
              />
            </div>

            <button
              onClick={() => setShowEmojis(!showEmojis)}
              className={`p-2 transition-colors ${
                showEmojis
                  ? "text-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Insérer un emoji"
            >
              <Smile className="w-5 h-5" />
            </button>

            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Tapez votre message à ${freelance.nom} ${freelance.prenom} ...`}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                maxLength={2500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">
                  {message.length}/2500
                </span>
                <button
                  onClick={handleSendMessage}
                  disabled={
                    (!message.trim() && attachments.length === 0) || isUploading
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                    (message.trim() || attachments.length > 0) && !isUploading
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoserUneQuestion;
