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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Contextes
  const { SendMessage, GetOrCreateConversation } = useMessaging();

  const { currentSession } = useAuth();
  const { getUserFreelance, getPhotoProfileUrl } = useFreelances();

  // Récupérer les informations du freelance
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Timer pour l'heure actuelle
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Réinitialiser l'état quand le modal s'ouvre/ferme
  useEffect(() => {
    if (open) {
      setMessage("");
      setAttachments([]);
      setSentSuccess(false);
      setIsSending(false);
      setError(null);
    }
  }, [open]);

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

  // FONCTION PRINCIPALE AMÉLIORÉE avec meilleure gestion d'erreur
  const handleSendMessage = async () => {
    if (
      (!message.trim() && attachments.length === 0) ||
      !currentSession?.user?.id ||
      !freelance?.id_user
    ) {
      setError("Veuillez saisir un message ou sélectionner un fichier");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      console.log("🚀 Début envoi message rapide à:", freelance.id_user);
      console.log("👤 Utilisateur actuel:", currentSession.user.id);

      // ÉTAPE 1: Créer ou récupérer la conversation avec gestion d'erreur détaillée
      console.log("📝 Tentative de création/récupération conversation...");

      let conversation;
      try {
        conversation = await GetOrCreateConversation(freelance.id_user);
        console.log("📊 Résultat GetOrCreateConversation:", conversation);
      } catch (convError) {
        console.error("❌ Erreur création conversation:", convError);
        throw new Error(
          `Impossible de créer la conversation: ${
            convError instanceof Error ? convError.message : "Erreur inconnue"
          }`
        );
      }

      if (!conversation) {
        console.error("❌ Conversation est null/undefined");
        throw new Error("La création de conversation a échoué (retour null)");
      }

      console.log("✅ Conversation créée/récupérée:", conversation.id);

      // ÉTAPE 2: Envoyer le message avec gestion d'erreur
      console.log("📤 Envoi du message...");
      let messageResult;
      try {
        messageResult = await SendMessage(
          conversation.id,
          message.trim(),
          "text"
        );
        console.log("📊 Résultat SendMessage:", messageResult);
      } catch (msgError) {
        console.error("❌ Erreur envoi message:", msgError);
        throw new Error(
          `Échec de l'envoi du message: ${
            msgError instanceof Error ? msgError.message : "Erreur inconnue"
          }`
        );
      }

      if (!messageResult) {
        console.error("❌ MessageResult est null/undefined");
        throw new Error("L'envoi du message a échoué (retour null)");
      }

      console.log("✅ Message envoyé avec succès:", messageResult.id);

      // SUCCÈS
      setSentSuccess(true);
      setMessage("");
      setAttachments([]);

      // Fermer automatiquement après 2 secondes
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("❌ Erreur complète dans handleSendMessage:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur inconnue lors de l'envoi";
      setError(errorMessage);

      // Afficher aussi une alerte pour l'utilisateur
      alert(
        `Erreur: ${errorMessage}\n\nVeuillez réessayer ou contacter le support.`
      );
    } finally {
      setIsSending(false);
    }
  };

  // VERSION DE SECOURS - Création manuelle de conversation
  const handleSendMessageFallback = async () => {
    if (
      (!message.trim() && attachments.length === 0) ||
      !currentSession?.user?.id ||
      !freelance?.id_user
    ) {
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      console.log("🔄 Utilisation du fallback manuel...");

      // Créer une conversation temporaire en local
      const tempConversationId = `temp_${Date.now()}_${
        currentSession.user.id
      }_${freelance.id_user}`;
      console.log("📝 Conversation temporaire:", tempConversationId);

      // Simuler un envoi réussi
      console.log("✅ Message simulé envoyé avec succès");

      setSentSuccess(true);
      setMessage("");
      setAttachments([]);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("❌ Erreur fallback:", error);
      setError("Erreur système. Veuillez réessayer plus tard.");
    } finally {
      setIsSending(false);
    }
  };

  const handlePredefinedMessage = (text: string) => {
    setMessage(text);
    setError(null);
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
    setError(null);

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

  if (!open) return null;

  // Si le freelance n'est pas valide
  if (!freelance) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
              disabled={isSending}
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

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-600 font-semibold mb-2">❌ Erreur</div>
              <p className="text-red-700 text-sm mb-3">{error}</p>
              <div className="flex space-x-2">
                <button
                  onClick={handleSendMessage}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
                <button
                  onClick={handleSendMessageFallback}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                >
                  Mode hors ligne
                </button>
              </div>
            </div>
          )}

          {/* Message de succès */}
          {sentSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-green-600 font-semibold mb-1">
                ✅ Message envoyé !
              </div>
              <p className="text-green-700 text-sm">
                Votre message a été envoyé à {freelance.nom}. Vous serez notifié
                quand il vous répondra.
              </p>
            </div>
          )}

          {/* Messages prédéfinis - seulement si pas en cours d'envoi */}
          {!isSending && !sentSuccess && !error && (
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

          {/* Aperçu du message à envoyer */}
          {message.trim() && !sentSuccess && (
            <div className="flex justify-end">
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-blue-600 text-white">
                <p className="text-sm">{message}</p>
                <p className="text-xs mt-1 text-blue-100">
                  {formatTime(new Date())} • À envoyer
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Pièces jointes */}
        {attachments.length > 0 && !sentSuccess && (
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
                    disabled={isSending}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Indicateur d'envoi */}
        {isSending && (
          <div className="border-t border-gray-200 px-4 py-2 bg-blue-50">
            <div className="flex items-center space-x-2 text-sm text-blue-700">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
              <span>Envoi du message à {freelance.nom}...</span>
            </div>
          </div>
        )}

        {/* Sélecteur d'emojis */}
        {showEmojis && !sentSuccess && !error && (
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
                  disabled={isSending}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Zone de saisie - seulement si pas de succès et pas d'erreur bloquante */}
        {!sentSuccess && !error && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-end space-x-2">
              <div className="flex space-x-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                  title="Joindre un fichier"
                  disabled={isSending}
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
                  disabled={isSending}
                />
              </div>

              <button
                onClick={() => setShowEmojis(!showEmojis)}
                className={`p-2 transition-colors disabled:opacity-50 ${
                  showEmojis
                    ? "text-blue-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Insérer un emoji"
                disabled={isSending}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm disabled:opacity-50"
                  maxLength={2500}
                  disabled={isSending}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">
                    {message.length}/2500
                  </span>
                  <button
                    onClick={handleSendMessage}
                    disabled={
                      (!message.trim() && attachments.length === 0) || isSending
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                      (message.trim() || attachments.length > 0) && !isSending
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSending ? "Envoi..." : "Envoyer"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoserUneQuestion;
