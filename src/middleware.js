// middleware.js
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const path = request.nextUrl.pathname
  
  console.log("🔍 Page:", path);

  // Vérifier si l'utilisateur est connecté
  const { data: { user }, error } = await supabase.auth.getUser();
  const isAuthenticated = !!user && !error;

  // Si l'utilisateur est connecté et accède à la racine, rediriger vers /Accueil
  if (isAuthenticated && path === '/') {
    console.log("✅ Utilisateur connecté - Redirection vers /Accueil");
    return NextResponse.redirect(new URL('/Accueil', request.url));
  }

  // Chemins publics (accessibles sans authentification)
  const publicPaths = ['/', '/Authentification', '/ResultatRecherche'];
  if (publicPaths.includes(path)) {
    console.log("✅ Public");
    return response;
  }

  // Si on arrive ici, l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!isAuthenticated) {
    console.log("❌ Pas connecté - Redirection vers Authentification");
    const loginUrl = new URL('/Authentification', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  console.log("✅ Connecté:", user.email);

  try {
    // Vérifier le profil utilisateur
    const { data: userProfile } = await supabase
      .from('users')
      .select('id, is_blocked')
      .eq('id', user.id)
      .single();

    if (!userProfile || userProfile.is_blocked) {
      console.log("❌ Profil invalide");
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/Authentification', request.url));
    }

    // Vérifier le profil freelance
    const { data: freelanceProfile } = await supabase
      .from('freelances')
      .select('id')
      .eq('id_user', user.id)
      .eq('isdeleted', false)
      .eq('statut', 'actif')
      .single();

    const isFreelance = !!freelanceProfile;

    // Logique de redirection selon les routes
    if (path.startsWith('/TableauDeBord')) {
      if (!isFreelance) {
        console.log("❌ Accès TableauDeBord refusé - Pas freelance");
        return NextResponse.redirect(new URL('/Accueil', request.url));
      }
      console.log("✅ Accès TableauDeBord autorisé");
      return response;
    }

    if (path === '/FreelanceRegistrationForm' || path === '/FreelancePage') {
      if (isFreelance) {
        console.log("❌ Déjà freelance - Redirection TableauDeBord");
        return NextResponse.redirect(new URL('/TableauDeBord', request.url));
      }
      console.log("✅ Accès formulaire freelance autorisé");
      return response;
    }

    // Chemins communs accessibles à tous les utilisateurs connectés
    const commonPaths = ['/Accueil', '/Commande', '/DetailService', '/Message', '/Profil'];
    if (commonPaths.some(p => path === p || path.startsWith(p + '/'))) {
      console.log("✅ Accès commun autorisé");
      return response;
    }

    // Pour toutes les autres routes protégées
    console.log("✅ Accès autorisé (route protégée standard)");
    return response;

  } catch (error) {
    console.error("❌ Erreur middleware:", error.message);
    // En cas d'erreur, rediriger vers l'authentification
    return NextResponse.redirect(new URL('/Authentification', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};