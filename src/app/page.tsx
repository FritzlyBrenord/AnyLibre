"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Menu,
  X,
  Star,
  MapPin,
  Clock,
  Users,
  Shield,
  CheckCircle,
  ArrowRight,
  Play,
  ChevronLeft,
  ChevronRight,
  Award,
  TrendingUp,
  Globe,
  Eye,
  MessageSquare,
  ThumbsUp,
  Lock,
  Headphones,
  Zap,
} from "lucide-react";
import Header from "@/Component/Header/Header";
import Footer from "@/Component/Header/Footer/Footer";
import Layout from "@/Component/Layout/Layout";
import Accueil from "@/Module/Client/Accueil/Accueil";

const AnylibreaHomepage = () => {
  return (
    <Layout>
      <Accueil />
    </Layout>
  );
};

export default AnylibreaHomepage;
