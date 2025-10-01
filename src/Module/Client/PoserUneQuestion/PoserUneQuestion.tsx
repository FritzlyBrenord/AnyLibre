import React, { useState, useRef, useEffect } from "react";
import { X, Paperclip, Smile, Send, Moon } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "contact";
  timestamp: Date;
}

interface MessagingModalProps {
  open: boolean;
  onClose: () => void;
  contact: {
    name: string;
    avatar: string;
    isOnline: boolean;
    averageResponseTime: string;
  };
}

const PoserUneQuestion: React.FC<MessagingModalProps> = ({
  open,
  onClose,
  contact,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const predefinedMessages = [
    "💬 Bonjour Akibur Rahman, je recherche un travail de développement de site web pour...",
    "Bonjour Akibur Rahman, je cherche quelqu'un qui a de l'expérience avec des plateformes comme...",
    "Bonjour Akibur Rahman, j'ai besoin d'un service en webdesign, pouvez-vous m'aider avec...",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");

      // Simuler une réponse automatique
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: "Merci pour votre message ! Je vous réponds dans les plus brefs délais.",
          sender: "contact",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, response]);
      }, 2000);
    }
  };

  const handlePredefinedMessage = (text: string) => {
    setMessage(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header avec l'heure */}
        <div className="bg-black text-white px-4 py-3 flex items-center">
          <Moon className="w-4 h-4 mr-2" />
          <span className="text-sm">
            Il est {formatTime(currentTime)} pour {contact.name}. Cela peut
            prendre un certain temps pour obtenir une réponse
          </span>
        </div>

        {/* Profil du contact */}
        <div className="bg-gray-50 px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {contact.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  Contactez {contact.name}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    En ligne
                  </span>
                  <span>•</span>
                  <span>
                    Temps de réponse moy. : {contact.averageResponseTime}
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
            Posez une question à {contact.name} ou partagez les informations de
            votre projet (critères, échéances, budget, etc.)
          </div>

          {/* Messages prédéfinis */}
          {messages.length === 0 && (
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
          {messages.map((msg) => (
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
                <p className="text-sm">{msg.text}</p>
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

        {/* Zone de saisie */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-end space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Smile className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>

            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                maxLength={2500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">
                  {message.length}/2500
                </span>
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    message.trim()
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Envoyer le message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exemple d'utilisation
export default PoserUneQuestion;
