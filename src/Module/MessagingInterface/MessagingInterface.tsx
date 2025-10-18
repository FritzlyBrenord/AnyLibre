"use client";

import React, { useState, useRef, useEffect } from "react";

// Types pour TypeScript
interface Message {
  id: number;
  sender: "user" | "freelancer" | "system";
  content: string;
  time: string;
  isStarred: boolean;
  read: boolean;
  avatar?: string;
  type?: "warning" | "code" | "image" | "video" | "file" | "order";
  url?: string;
  fileType?: string;
  orderDetails?: {
    budget: string;
    delivery: string;
    features: string[];
  };
}

interface Contact {
  id: number;
  name: string;
  username: string;
  avatar: string;
  status: "online" | "offline";
  lastMessage: string;
  time: string;
  unread: number;
  isStarred: boolean;
  isSelected: boolean;
  type:
    | "all"
    | "unread"
    | "starred"
    | "custom"
    | "archived"
    | "spam"
    | "progress"
    | "checking"
    | "submission";
  localTime?: string;
  location?: string;
  joinedDate?: string;
  language?: string;
  level?: string;
  responseRate?: string;
  rating?: string;
  completedOrders?: string;
}

interface Attachment {
  name: string;
  size: number;
  type: string;
  file: File;
}

const MessagingInterface = () => {
  // États pour les messages et contacts
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "freelancer",
      content: "Hello there, Thank you for contacting me.",
      time: "9 heures",
      isStarred: false,
      read: true,
      avatar: "/avatars/akibur.jpg",
    },
    {
      id: 2,
      sender: "system",
      content:
        "Pour plus de sécurité et de protection, veillez à garder les paiements et les communications au sein de Fiverr.",
      time: "",
      isStarred: false,
      read: true,
      type: "warning",
    },
    {
      id: 3,
      sender: "user",
      content: "Demande de commande personnalisée",
      time: "16 oct., 2:38",
      isStarred: false,
      read: true,
    },
    {
      id: 4,
      sender: "user",
      content: `import Layout from "@/Component/Layout/Layout";
import ServiceByCategory from "@/Module/Client/ServiceByCategory/ServiceByCategory";
import FreelancerProfile from "@/Module/Freelance/TableauDeBord/FreelancerProfilPublic";
import React from "react";`,
      time: "",
      isStarred: false,
      read: true,
      type: "code",
    },
    {
      id: 5,
      sender: "user",
      content: "Commande personnalisée",
      time: "16 oct., 2:38",
      isStarred: false,
      read: true,
      type: "order",
      orderDetails: {
        budget: "20 $US",
        delivery: "7 jours (22 oct. 2025)",
        features: [
          "Design responsive",
          "Optimisation SEO",
          "Support technique",
        ],
      },
    },
  ]);

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: "Akibur Rahman",
      username: "@wix_buddy",
      avatar: "/avatars/akibur.jpg",
      status: "online",
      lastMessage: "Hello there, Thank you for contacting me.",
      time: "9 heures",
      unread: 0,
      isStarred: false,
      isSelected: true,
      type: "all",
      localTime: "22:54 heure locale",
      location: "Bangladesh",
      joinedDate: "nov. 2021",
      language: "Anglais - Courant",
      level: "Level 2",
      responseRate: "1h",
      rating: "4,9 (1573)",
      completedOrders: "1,573",
    },
    {
      id: 2,
      name: "Sophie Martin",
      username: "@sophie_design",
      avatar: "/avatars/sophie.jpg",
      status: "offline",
      lastMessage: "Merci pour votre commande !",
      time: "14 oct.",
      unread: 2,
      isStarred: true,
      isSelected: false,
      type: "unread",
    },
    {
      id: 3,
      name: "Jean Dupont",
      username: "@jeandupont",
      avatar: "/avatars/jean.jpg",
      status: "online",
      lastMessage: "Je vous envoie la première version demain.",
      time: "12 oct.",
      unread: 0,
      isStarred: false,
      isSelected: false,
      type: "progress",
    },
  ]);

  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(contacts);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showContactMenu, setShowContactMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInConversation, setSearchInConversation] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  // Sections affichées/masquées
  const [showContactSections, setShowContactSections] = useState({
    filters: true,
    starred: true,
    recent: true,
  });

  // Sidebar dimensions et info
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [showInfoSidebar, setShowInfoSidebar] = useState(false);

  // Références
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contactMenuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Filtres de messages
  const messageFilters = [
    { id: "all", label: "Tous les messages", icon: "💬" },
    { id: "unread", label: "Non lues", icon: "🔴" },
    { id: "starred", label: "Suivies", icon: "⭐" },
    { id: "custom", label: "Offres personnalisées", icon: "🎯" },
    { id: "archived", label: "Archives", icon: "📁" },
    { id: "spam", label: "Spam", icon: "🚫" },
    { id: "progress", label: "Order in progress", icon: "🔄" },
    { id: "checking", label: "Checking in", icon: "👁️" },
    { id: "submission", label: "Final submission", icon: "✅" },
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

  // Détection de la taille de l'écran
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);

      // Ajuster les sidebars en fonction de la taille
      if (width >= 1200) {
        setShowSidebar(true);
        setShowInfoSidebar(false);
        setSidebarWidth(280);
      } else if (width >= 768 && width < 1200) {
        setShowSidebar(true);
        setShowInfoSidebar(false);
        setSidebarWidth(280);
      } else {
        setShowInfoSidebar(false);
        setSidebarWidth(width * 0.8);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filtrage des contacts par recherche
  useEffect(() => {
    let filtered = contacts;

    // Filtre par type
    if (activeFilter !== "all") {
      filtered = filtered.filter((contact) => contact.type === activeFilter);
    }

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(query) ||
          contact.username.toLowerCase().includes(query) ||
          contact.lastMessage.toLowerCase().includes(query)
      );
    }

    setFilteredContacts(filtered);
  }, [activeFilter, contacts, searchQuery]);

  // Scroll auto
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fermer le menu contact en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contactMenuRef.current &&
        !contactMenuRef.current.contains(event.target as Node)
      ) {
        setShowContactMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSection = (section: keyof typeof showContactSections) => {
    setShowContactSections({
      ...showContactSections,
      [section]: !showContactSections[section],
    });
  };

  const selectContact = (contactId: number) => {
    const updatedContacts = contacts.map((contact) => ({
      ...contact,
      isSelected: contact.id === contactId,
    }));
    setContacts(updatedContacts);
    setFilteredContacts(updatedContacts);

    // Reset message states
    setReplyingTo(null);
    setSearchInConversation("");

    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const replyToMessage = (message: Message) => {
    setReplyingTo(message);
  };

  const sendMessage = () => {
    if (newMessage.trim() === "" && attachments.length === 0) return;

    const now = new Date();
    const timeFormatted = formatTime(now);

    const attachmentMessages: Message[] = attachments.map((attachment) => ({
      id: Date.now() + Math.random(),
      sender: "user" as const,
      content: attachment.name,
      time: timeFormatted,
      isStarred: false,
      read: true,
      type: attachment.type.startsWith("image/")
        ? "image"
        : attachment.type.startsWith("video/")
        ? "video"
        : "file",
      url: URL.createObjectURL(attachment.file),
      fileType: attachment.type,
    }));

    const textMessage: Message[] =
      newMessage.trim() !== ""
        ? [
            {
              id: Date.now() + Math.random(),
              sender: "user" as const,
              content: newMessage,
              time: timeFormatted,
              isStarred: false,
              read: true,
              replyTo: replyingTo
                ? {
                    id: replyingTo.id,
                    content: replyingTo.content,
                    sender: replyingTo.sender,
                  }
                : undefined,
            },
          ]
        : [];

    setMessages([...messages, ...attachmentMessages, ...textMessage]);

    // Update last message for selected contact
    const selectedContactId = contacts.find((c) => c.isSelected)?.id;
    if (selectedContactId) {
      const updatedContacts = contacts.map((contact) =>
        contact.id === selectedContactId
          ? {
              ...contact,
              lastMessage: newMessage.trim() || "Pièce jointe",
              time: timeFormatted,
            }
          : contact
      );
      setContacts(updatedContacts);
      setFilteredContacts(updatedContacts);
    }

    setNewMessage("");
    setAttachments([]);
    setReplyingTo(null);
  };

  const formatTime = (date: Date) => {
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      return `${date.getHours()}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${date.getDate()} ${date.toLocaleString("fr-FR", {
        month: "short",
      })}.`;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachments: Attachment[] = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    }));

    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(newMessage + emoji);
    setShowEmojiPicker(false);
  };

  // Fonctions de gestion des contacts
  const archiveContact = (contactId: number) => {
    setContacts(
      contacts.map((contact) =>
        contact.id === contactId
          ? { ...contact, type: "archived" as const }
          : contact
      )
    );
    setShowContactMenu(false);
  };

  const reportContact = (contactId: number) => {
    setContacts(
      contacts.map((contact) =>
        contact.id === contactId
          ? { ...contact, type: "spam" as const }
          : contact
      )
    );
    setShowContactMenu(false);
  };

  const deleteContact = (contactId: number) => {
    setContacts(contacts.filter((contact) => contact.id !== contactId));
    setShowContactMenu(false);
  };

  const markAsUnread = (contactId: number) => {
    setContacts(
      contacts.map((contact) =>
        contact.id === contactId
          ? { ...contact, unread: contact.unread + 1 }
          : contact
      )
    );
    setShowContactMenu(false);
  };

  const starContact = (contactId: number) => {
    const updatedContacts = contacts.map((contact) =>
      contact.id === contactId
        ? { ...contact, isStarred: !contact.isStarred }
        : contact
    );
    setContacts(updatedContacts);
    setFilteredContacts(updatedContacts);
  };

  const starMessage = (messageId: number) => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
      )
    );
  };

  const startNewChat = (contactId: number) => {
    selectContact(contactId);
  };

  const renderMessageContent = (message: Message) => {
    // Si c'est une réponse à un autre message
    if (message.replyTo) {
      return (
        <div>
          <div className="bg-gray-100 p-2 mb-2 rounded border-l-2 border-gray-300 text-sm text-gray-600">
            <span className="font-medium">
              {message.replyTo.sender === "user"
                ? "Vous"
                : message.replyTo.sender === "freelancer"
                ? "Freelancer"
                : "Système"}
            </span>
            : {message.replyTo.content.substring(0, 50)}
            {message.replyTo.content.length > 50 ? "..." : ""}
          </div>
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
      );
    }

    if (message.type === "warning") {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700">
          <div className="font-semibold mb-1">NOUS VOUS SOUTENONS</div>
          <div className="text-sm">
            {message.content}{" "}
            <a href="#" className="text-gray-600 font-medium underline">
              En savoir plus
            </a>
          </div>
        </div>
      );
    } else if (message.type === "code") {
      return (
        <pre className="bg-gray-50 text-gray-700 rounded-lg p-4 text-sm overflow-x-auto whitespace-pre-wrap font-mono border border-gray-200">
          {message.content}
        </pre>
      );
    } else if (message.type === "order") {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="font-semibold text-gray-800 mb-3">
            {message.content}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Budget:</span>
              <span className="font-semibold text-gray-800">
                {message.orderDetails?.budget}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Livraison:</span>
              <span className="font-semibold text-gray-800">
                {message.orderDetails?.delivery}
              </span>
            </div>
            <div className="mt-3">
              <div className="text-gray-600 mb-2">Caractéristiques:</div>
              <div className="space-y-1">
                {message.orderDetails?.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    <span className="text-gray-800">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (message.type === "image") {
      return (
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={message.url}
            alt="Image jointe"
            className="max-w-full max-h-64 rounded-lg object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {message.content}
          </div>
        </div>
      );
    } else if (message.type === "video") {
      return (
        <div className="relative rounded-lg overflow-hidden">
          <video controls className="max-w-full max-h-64 rounded-lg">
            <source src={message.url} type={message.fileType} />
            Votre navigateur ne prend pas en charge les vidéos.
          </video>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {message.content}
          </div>
        </div>
      );
    } else if (message.type === "file") {
      return (
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="bg-gray-100 p-2 rounded-md mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
              {message.content}
            </div>
            <a
              href={message.url}
              download
              className="text-xs text-blue-500 underline"
            >
              Télécharger
            </a>
          </div>
        </div>
      );
    } else {
      return <div className="whitespace-pre-wrap">{message.content}</div>;
    }
  };

  // Filtrer les messages selon la recherche
  const filteredMessages = searchInConversation
    ? messages.filter((msg) =>
        msg.content.toLowerCase().includes(searchInConversation.toLowerCase())
      )
    : messages;

  // Récupérer le contact sélectionné
  const selectedContact =
    contacts.find((contact) => contact.isSelected) || contacts[0];

  // Obtenir les initiales d'un nom
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 py-16">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Filtres et liste des contacts */}
        {(showSidebar || !isMobile) && (
          <div
            ref={sidebarRef}
            className={`${
              isMobile ? "absolute inset-0 z-20 shadow-xl" : "w-[280px]"
            } bg-white border-r border-gray-200 flex flex-col`}
            style={{ width: isMobile ? "100%" : `${sidebarWidth}px` }}
          >
            {/* En-tête */}
            <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10 flex justify-between items-center">
              <h1 className="text-xl font-medium text-gray-700">Messages</h1>
              {isMobile && (
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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

            {/* Barre de recherche */}
            <div className="p-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher des messages ou des contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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
              {/* Section Filtres avec chevron */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("filters")}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-700 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
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
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      showContactSections.filters ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Messages suivis
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      showContactSections.starred ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
                    {filteredContacts
                      .filter((contact) => contact.isStarred)
                      .map((contact) => (
                        <div
                          key={contact.id}
                          onClick={() => selectContact(contact.id)}
                          className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                            contact.isSelected
                              ? "bg-blue-50 border-l-2 border-blue-500"
                              : ""
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                  {contact.avatar ? (
                                    <img
                                      src={contact.avatar}
                                      alt={contact.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-white font-medium">
                                      {getInitials(contact.name)}
                                    </div>
                                  )}
                                </div>
                                {contact.status === "online" && (
                                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white"></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium text-gray-800 text-sm truncate">
                                    {contact.name}
                                  </h3>
                                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                    {contact.time}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">
                                  {contact.username}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                  {contact.lastMessage}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {contact.unread > 0 && (
                                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2">
                                  {contact.unread}
                                </span>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  starContact(contact.id);
                                }}
                                className={`text-yellow-400 hover:text-yellow-500 rounded-full`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                    {filteredContacts.filter((contact) => contact.isStarred)
                      .length === 0 && (
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
                      xmlns="http://www.w3.org/2000/svg"
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
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      showContactSections.recent ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
                    {filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                          contact.isSelected
                            ? "bg-blue-50 border-l-2 border-blue-500"
                            : ""
                        }`}
                      >
                        <div className="flex items-start">
                          <div
                            className="flex items-start flex-1 min-w-0 cursor-pointer"
                            onClick={() => selectContact(contact.id)}
                          >
                            <div className="relative mr-3">
                              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                {contact.avatar ? (
                                  <img
                                    src={contact.avatar}
                                    alt={contact.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-medium">
                                    {getInitials(contact.name)}
                                  </div>
                                )}
                              </div>
                              {contact.status === "online" && (
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-gray-800 text-sm truncate">
                                  {contact.name}
                                </h3>
                                <span className="text-xs text-gray-500 whitespace-nowrap ml-1">
                                  {contact.time}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 truncate">
                                {contact.username}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 truncate">
                                {contact.lastMessage}
                              </p>

                              <div className="mt-2 flex space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    selectContact(contact.id);
                                  }}
                                  className="flex-1 py-1 px-2 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 rounded-full transition-colors"
                                >
                                  Voir conversation
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startNewChat(contact.id);
                                  }}
                                  className="flex-1 py-1 px-2 bg-gray-200 hover:bg-gray-300 text-xs text-gray-700 rounded-full transition-colors"
                                >
                                  Nouveau message
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end ml-2 space-y-1">
                            {contact.unread > 0 && (
                              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {contact.unread}
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                starContact(contact.id);
                              }}
                              className={`p-0.5 rounded-full ${
                                contact.isStarred
                                  ? "text-yellow-400"
                                  : "text-gray-300 hover:text-yellow-400"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </button>
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowContactMenu(contact.id);
                                }}
                                className="p-0.5 text-gray-400 hover:text-gray-600 rounded-full"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                  />
                                </svg>
                              </button>

                              {showContactMenu === contact.id && (
                                <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-30 w-48">
                                  <button
                                    onClick={() => markAsUnread(contact.id)}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-2 text-gray-500"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                      />
                                    </svg>
                                    Marquer comme non lu
                                  </button>
                                  <button
                                    onClick={() => archiveContact(contact.id)}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-2 text-gray-500"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
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
                                  <button
                                    onClick={() => reportContact(contact.id)}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-2 text-gray-500"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
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
                                  <button
                                    onClick={() => deleteContact(contact.id)}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-2 text-red-500"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
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
                      </div>
                    ))}

                    {filteredContacts.length === 0 && (
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
          <div className="bg-white border-b border-gray-200 p-3 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isMobile && !showSidebar && (
                  <button
                    onClick={() => setShowSidebar(true)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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
                    {selectedContact?.avatar ? (
                      <img
                        src={selectedContact.avatar}
                        alt={selectedContact.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-600 font-medium rounded-full">
                        {getInitials(selectedContact?.name)}
                      </div>
                    )}
                    {selectedContact?.status === "online" && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-800">
                      {selectedContact?.name}
                    </h2>
                    <div className="flex items-center">
                      <p className="text-xs text-gray-500">
                        {selectedContact?.username}
                      </p>
                      <span className="mx-1.5 text-gray-300">•</span>
                      <p className="text-xs text-gray-500">
                        {selectedContact?.status === "online"
                          ? "En ligne"
                          : "Hors ligne"}
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
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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

                <button
                  onClick={() => setShowInfoSidebar(!showInfoSidebar)}
                  className={`p-2 ${
                    showInfoSidebar
                      ? "text-blue-500 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  } rounded-full transition-colors`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>

                {/* Menu des actions sur le contact */}
                <div className="relative" ref={contactMenuRef}>
                  <button
                    onClick={() => setShowContactMenu(!showContactMenu)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>

                  {showContactMenu === true && (
                    <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-30 w-48">
                      <button
                        onClick={() => markAsUnread(selectedContact.id)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Marquer comme non lu
                      </button>
                      <button
                        onClick={() => archiveContact(selectedContact.id)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
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
                      <button
                        onClick={() => reportContact(selectedContact.id)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
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
                      <button
                        onClick={() => deleteContact(selectedContact.id)}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
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
          </div>

          {/* Zone de messages et sidebar d'information */}
          <div className="flex-1 flex overflow-hidden">
            {/* Messages */}
            <div className="flex-1 flex flex-col">
              {/* Corps du chat */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                {filteredMessages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-gray-400 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 mx-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
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
                          : "Commencez une conversation avec " +
                            selectedContact?.name}
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : message.sender === "system"
                          ? "justify-center"
                          : "justify-start"
                      } group`}
                    >
                      {message.sender === "freelancer" && (
                        <div className="flex-shrink-0 mr-2 mt-1">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            {message.avatar ? (
                              <img
                                src={message.avatar}
                                alt={selectedContact?.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium">
                                {getInitials(selectedContact?.name)}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div
                        className={`max-w-[75%] ${
                          message.sender === "system" ? "w-full max-w-md" : ""
                        }`}
                      >
                        {message.sender !== "system" && (
                          <div
                            className={`text-xs text-gray-500 mb-1 ${
                              message.sender === "user" ? "text-right" : ""
                            }`}
                          >
                            {message.sender === "freelancer" && (
                              <span className="font-medium mr-2">
                                {selectedContact?.name}
                              </span>
                            )}
                            {message.time}
                          </div>
                        )}

                        <div className="relative">
                          <div
                            className={`rounded-lg p-3 text-sm ${
                              message.sender === "user"
                                ? "bg-blue-50 text-gray-700 border border-blue-100"
                                : message.sender === "system"
                                ? "bg-transparent"
                                : "bg-white border border-gray-200 text-gray-700"
                            }`}
                          >
                            {renderMessageContent(message)}
                          </div>

                          {/* Actions rapides sur le message */}
                          <div
                            className={`absolute ${
                              message.sender === "user" ? "-left-8" : "-right-8"
                            } top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex flex-col space-y-1`}
                          >
                            <button
                              onClick={() => replyToMessage(message)}
                              className="p-1 bg-white rounded-full shadow-sm text-gray-400 hover:text-blue-500"
                              title="Répondre"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                />
                              </svg>
                            </button>

                            <button
                              onClick={() => starMessage(message.id)}
                              className={`p-1 bg-white rounded-full shadow-sm ${
                                message.isStarred
                                  ? "text-yellow-500"
                                  : "text-gray-400 hover:text-yellow-500"
                              }`}
                              title={
                                message.isStarred
                                  ? "Retirer des favoris"
                                  : "Ajouter aux favoris"
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
              <div className="border-t border-gray-200 bg-white p-3">
                {/* Si on répond à un message */}
                {replyingTo && (
                  <div className="mb-2 bg-gray-50 p-2 rounded border-l-2 border-blue-300 flex justify-between items-start">
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">
                        {replyingTo.sender === "user"
                          ? "Vous"
                          : replyingTo.sender === "freelancer"
                          ? "Freelancer"
                          : "Système"}
                      </span>
                      : {replyingTo.content.substring(0, 50)}
                      {replyingTo.content.length > 50 ? "..." : ""}
                    </div>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="text-gray-400 hover:text-gray-600 p-0.5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Pièces jointes */}
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5"
                      >
                        <span className="text-sm text-gray-700 mr-2">
                          {attachment.name}
                        </span>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
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
                          sendMessage();
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
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
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
                      <div className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
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
                    onClick={sendMessage}
                    disabled={!newMessage.trim() && attachments.length === 0}
                    className={`bg-blue-500 text-white rounded-lg p-3 ${
                      !newMessage.trim() && attachments.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-600"
                    } transition-colors`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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
            </div>

            {/* Sidebar d'information du contact */}
            {showInfoSidebar && (
              <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">
                    À propos de {selectedContact?.name}
                  </h3>
                  <button
                    onClick={() => setShowInfoSidebar(false)}
                    className="text-gray-500 hover:text-gray-700 p-1.5 rounded hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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
                      {selectedContact?.avatar ? (
                        <img
                          src={selectedContact.avatar}
                          alt={selectedContact.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl border-4 border-white shadow">
                          {getInitials(selectedContact?.name)}
                        </div>
                      )}
                      {selectedContact?.status === "online" && (
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-800">
                      {selectedContact?.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {selectedContact?.username}
                    </p>
                  </div>

                  {selectedContact?.location && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500">De</div>
                      <div className="font-medium text-gray-800">
                        {selectedContact.location}
                      </div>
                    </div>
                  )}

                  {selectedContact?.joinedDate && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500">
                        Sur Fiverr depuis
                      </div>
                      <div className="font-medium text-gray-800">
                        {selectedContact.joinedDate}
                      </div>
                    </div>
                  )}

                  {selectedContact?.language && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500">Langues</div>
                      <div className="font-medium text-gray-800">
                        {selectedContact.language}
                      </div>
                    </div>
                  )}

                  {selectedContact?.localTime && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500">Heure locale</div>
                      <div className="font-medium text-gray-800">
                        {selectedContact.localTime}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">
                      En tant que
                    </div>
                    <div className="flex space-x-2">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        Client
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        Freelance
                      </span>
                    </div>
                  </div>

                  {selectedContact?.level && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500">
                        Niveau du prestataire
                      </div>
                      <div className="font-medium text-gray-800">
                        {selectedContact.level}
                      </div>
                    </div>
                  )}

                  {selectedContact?.responseRate && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500">
                        Taux de réponse
                      </div>
                      <div className="font-medium text-gray-800">
                        {selectedContact.responseRate}
                      </div>
                    </div>
                  )}

                  {selectedContact?.rating && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500">Évaluation</div>
                      <div className="font-medium text-gray-800">
                        {selectedContact.rating}
                      </div>
                    </div>
                  )}

                  {selectedContact?.completedOrders && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500">
                        Commandes terminées
                      </div>
                      <div className="font-medium text-gray-800">
                        {selectedContact.completedOrders}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">Activité</div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-sm text-blue-700 mb-2">
                        Rejoignez{" "}
                        <span className="font-semibold">Seller Plus</span> pour
                        obtenir plus d'informations
                      </div>
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-800 underline">
                        En savoir plus
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
