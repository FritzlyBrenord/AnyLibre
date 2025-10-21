// components/ProtectedRoute.js
"use client";

import { useAuth } from "@/Context/ContextUser";
import { useFreelances } from "@/Context/Freelance/FreelanceContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ProtectedRoute({ 
  children, 
  requireFreelance = false,  // Si true, besoin d'être freelance
  requireClient = false,      // Si true, besoin d'être client (pas freelance)
}) {
  const { currentSession } = useAuth();
  const { getUserFreelance } = useFreelances();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      // 1. Vérifier si connecté
      if (!currentSession.isAuthenticated) {
        console.log("❌ Pas connecté");
        router.replace('/Authentification');
        return;
      }

      // 2. Si besoin d'être freelance
      if (requireFreelance) {
        const freelanceData = getUserFreelance(currentSession.user.id);
        if (!freelanceData) {
          console.log("❌ Pas freelance");
          router.replace('/Accueil');
          return;
        }
      }

      // 3. Si besoin d'être client (PAS freelance)
      if (requireClient) {
        const freelanceData = getUserFreelance(currentSession.user.id);
        if (freelanceData) {
          console.log("❌ Déjà freelance");
          router.replace('/TableauDeBord');
          return;
        }
      }

      // Tout est OK
      console.log("✅ Accès autorisé");
      setIsAuthorized(true);
      setIsChecking(false);
    };

    checkAccess();
  }, [currentSession, requireFreelance, requireClient, getUserFreelance, router]);

  // Pendant la vérification
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  // Si pas autorisé, ne rien afficher (redirection en cours)
  if (!isAuthorized) {
    return null;
  }

  // Si tout est OK, afficher le contenu
  return <>{children}</>;
}