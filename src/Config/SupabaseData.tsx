import { supabase } from "@/Config/supabase";
import { supabaseLogin } from "@/Config/supabase-client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const DataExsite = async (table: string, column: string, value: any) => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select(column)
      .eq(column, value)
      .single();
    if (error && error.code === "PGRST116") {
      console.log("nexiste pas");
      return false;
    } else {
      console.log("existe");
      return true;
    }
  } catch (err) {
    console.error("Erreur lors de l'insertion: ");
  }
};

export const DataObjectExiste = async (
  table: string,
  conditions: Record<string, any>
) => {
  try {
    // Construire la requête de base
    let query = supabase.from(table).select("*");

    // Ajouter chaque condition à la requête
    Object.entries(conditions).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query.single();

    if (error && error.code === "PGRST116") {
      console.log("n'existe pas");
      return false;
    } else {
      console.log("existe");
      return true;
    }
  } catch (err) {
    console.error("Erreur lors de la vérification: ", err);
    return false;
  }
};

export const DataExsiteUneSeuleLigne = async (
  table: string,
  column: string,
  value: string,
  idValue: string,
  idcolone: string
) => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select(column)
      .eq(idcolone, idValue)
      .eq(column, value)
      .single();
    if (error && error.code === "PGRST116") {
      console.log("nexiste pas");
      return false;
    } else {
      console.log("existe");
      return true;
    }
  } catch (err) {
    console.error("Erreur lors de l'insertion: ");
  }
};
export const DataExisteObjet = async (
  table: string,
  column: string,
  value: any
) => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select(column)
      .contains(column, value) // Vérifie si l'objet existe dans la colonne JSONB
      .maybeSingle(); // Peut retourner null au lieu d'une erreur

    if (error) {
      console.error("Erreur lors de la vérification :", error);
      return false; // En cas d'erreur, on suppose que la donnée n'existe pas
    }

    return data ? false : true; // false si l'objet existe, true sinon
  } catch (err) {
    console.error("Erreur lors de la requête :", err);
    return false; // Retourne false en cas d'erreur
  }
};

export const InsertData = async (table: string, data: object) => {
  try {
    const { error } = await supabase.from(table).insert(data);

    if (!error) {
      console.log("insertion réussie");
      return true;
    } else {
      return error;
    }
  } catch (err) {
    console.error("Erreur lors de l'insertion: ");
  }
};

// Insert and return inserted row(s) to immediately get generated IDs
export const InsertDataReturn = async (
  table: string,
  data: object
): Promise<{ success: boolean; rows?: any[]; error?: any }> => {
  try {
    console.log("📥 InsertDataReturn - Table:", table);
    console.log("📥 InsertDataReturn - Data:", data);

    const { data: rows, error } = await supabase
      .from(table)
      .insert(data)
      .select();

    console.log("📥 InsertDataReturn - Rows:", rows);
    console.log("📥 InsertDataReturn - Error:", error);

    if (error) {
      console.error("❌ Erreur Supabase:", error);
      return { success: false, error };
    }

    if (!rows || rows.length === 0) {
      console.error("❌ Aucune ligne retournée");
      return { success: false, error: "Aucune ligne insérée" };
    }

    console.log("✅ Insertion réussie:", rows);
    return { success: true, rows };
  } catch (err) {
    console.error("❌ Exception dans InsertDataReturn:", err);
    return { success: false, error: err };
  }
};
export const BanUserAdmin = async (userId: string) => {
  try {
    const response = await fetch("/api/auth/ban-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const result = await response.json();
    return result.success ? { succes: true } : { succes: false };
  } catch (error) {
    console.error("Erreur ban user:", error);
    return { succes: false };
  }
};

export const UnbanUserAdmin = async (userId: string) => {
  try {
    const response = await fetch("/api/auth/unban-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const result = await response.json();
    return result.success ? { succes: true } : { succes: false };
  } catch (error) {
    console.error("Erreur unban user:", error);
    return { succes: false };
  }
};

export const VerifierUtilisateurAuth = async (userId: string) => {
  try {
    const response = await fetch("/api/auth/verify-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const result = await response.json();
    return result.success && result.exists ? result.user : null;
  } catch (error) {
    console.error("Erreur vérification user:", error);
    return null;
  }
};
export const SelectData = async (
  table: string,
  options?: {
    conditions?: { column: string; operator: string; value: any }[];
    or?: boolean;
    orderBy?: { column: string; ascending: boolean };
    limit?: number;
  }
) => {
  try {
    let query = supabase.from(table).select("*");

    // Appliquer le tri
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending,
      });
    } else {
      // Tri par défaut
      query = query.order("created_at", { ascending: false });
    }

    // Appliquer la limite
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erreur lors de la sélection:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Erreur lors de la sélection:", err);
    return null;
  }
};

export const DeleteData = async (table: string, id: string | number) => {
  try {
    const { data, error } = await supabase.from(table).delete().eq("id", id);

    if (!error) {
      console.log("Element suprimer");
      return true;
    } else {
      console.log("Erreur lors de la supression");
      return false;
    }
  } catch (err) {
    console.error("Erreur lors de l'insertion: ");
  }
};
export const DeleteDataMultiple = async (table: string, ids: any[]) => {
  try {
    const { data, error } = await supabase.from(table).delete().in("id", ids);

    if (!error) {
      console.log("Element suprimer");
      return true;
    } else {
      console.log("Erreur lors de la supression");
      return false;
    }
  } catch (err) {
    console.error("Erreur lors de l'insertion: ");
  }
};
export const UploadImagePublic = async (
  fileNames: any,
  files: any,
  bucket: string
) => {
  let uploadsPromises: any;
  function isAnyArray(value: any): value is any[] {
    return Array.isArray(value);
  }
  if (isAnyArray(files) && isAnyArray(fileNames)) {
    uploadsPromises = await files.map(async (file: any, index: any) => {
      await supabase.storage.from(bucket).upload(fileNames[index], file);
      return uploadsPromises;
    });
  } else {
    uploadsPromises = await supabase.storage
      .from(bucket)
      .upload(fileNames, files);
    return uploadsPromises;
  }

  if (uploadsPromises) {
    return true;
  } else {
    return false;
  }
};

export const getPublicImageUrl = async (imageName: string, bucket: string) => {
  const { data } = await supabase.storage.from(bucket).getPublicUrl(imageName);

  return data.publicUrl;
};

export const UpdateUneSeuleElement = async (
  table: string,
  id: string,
  collone: any,
  newValeur: any
) => {
  try {
    const { data, error } = await supabase
      .from(table)
      .update({ [collone]: newValeur })
      .eq("id", id);

    if (!error) {
      console.log("modifier");
      return true;
    } else {
      console.log("Erreur lors de la supression");
      return false;
    }
  } catch (err) {
    console.error("Erreur lors de l'insertion: ");
  }
};

export const UpdateData = async (table: string, id: any, newValeur: object) => {
  const { data: currentRow, error: fetchError } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .single();

  try {
    const { data, error } = await supabase
      .from(table)
      .update(newValeur)
      .eq("id", id);
    if (!error) {
      console.log("modifier");
      return true;
    } else {
      console.log("Erreur lors de la modiffication", error);
      return false;
    }
  } catch (err) {
    console.error("Erreur lors de modification ", err);
  }
};

export const SignUp = async (email: string, password: string) => {
  const { data, error } = await supabaseLogin.auth.signUp({ email, password });

  try {
    if (!error) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Erreur lors de modification ", err);
  }
};

export const SignIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabaseLogin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Erreur lors de la connexion:", err);
    return {
      success: false,
      error: { message: "Erreur inattendue lors de la connexion" },
    };
  }
};

export const SignOut = async () => {
  const { error } = await supabaseLogin.auth.signOut();
  try {
    if (!error) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Erreur lors de modification ", err);
  }
};

export const getUser = async () => {
  const { data, error } = await supabaseLogin.auth.getUser();

  try {
    if (!error) {
      console.log("Utilisateur connecte", data);
      return data;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Erreur lors de la recuperation de l'utilisateur:");
  }
};

export const UtilisateurConnecter = async () => {
  const { data: session } = await supabaseLogin.auth.getSession();
  if (!session) {
    NextResponse.redirect("/Compte");
  }
  return NextResponse.next();
};

export const UpdateEmail = async (newValeur: string) => {
  try {
    const { data, error } = await supabaseLogin.auth.updateUser({
      email: newValeur,
    });
    if (error) {
      throw error;
    }
    return { succes: true };
  } catch (error) {}
};

export const UpdateEmailAdmin = async (newValeur: string, userId: string) => {
  try {
    const response = await fetch("/api/auth/update-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, email: newValeur }),
    });

    const result = await response.json();
    return result.success ? { succes: true } : { succes: false };
  } catch (error) {
    console.error("Erreur update email:", error);
    return { succes: false };
  }
};

export const UpdatePasswordAdmin = async (
  newValeur: string,
  userId: string
) => {
  console.log("🔐 UpdatePasswordAdmin appelé:", {
    userId,
    passwordLength: newValeur?.length,
  });

  try {
    const response = await fetch("/api/auth/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, password: newValeur }),
    });

    console.log("📡 Response status:", response.status);

    const result = await response.json();
    console.log("📦 Response data:", result);

    if (!response.ok) {
      console.error("❌ Erreur HTTP:", result);
      return { succes: false, error: result.error };
    }

    if (result.success) {
      console.log("✅ Password mis à jour avec succès");
      return { succes: true };
    } else {
      console.error("❌ Success = false:", result);
      return { succes: false, error: result.error };
    }
  } catch (error) {
    console.error("💥 Exception update password:", error);
    return { succes: false, error };
  }
};

export const DeleteUserAdmin = async (userId: string) => {
  try {
    const response = await fetch("/api/auth/delete-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const result = await response.json();
    return result.success ? { succes: true } : { succes: false };
  } catch (error) {
    console.error("Erreur delete user:", error);
    return { succes: false };
  }
};
export const CreerUtilisateur = async (email: string, password: string) => {
  try {
    console.log("📤 Envoi requête création:", { email });

    const response = await fetch("/api/auth/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    console.log("📥 Réponse reçue:", result);
    console.log("📊 Status HTTP:", response.status);

    if (!result.success) {
      console.error("❌ Erreur création auth:", result.error);
      console.error("📋 Détails complets:", JSON.stringify(result, null, 2));
      return null;
    }

    console.log("✅ Utilisateur créé, ID:", result.userId);
    return result.userId;
  } catch (err) {
    console.error("💥 Exception lors de la création:", err);
    return null;
  }
};

export const VerifierPassword = async (
  email: string,
  actuelMotDePasse: string
) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: actuelMotDePasse,
    });
    if (error) {
      return true;
    } else {
      return false;
    }
  } catch (error) {}
};
export const UpdatePassword = async (newValeur: string) => {
  try {
    const { error } = await supabase.auth.updateUser({ password: newValeur });
    if (error) {
      return true;
    } else {
      return false;
    }
  } catch (error) {}
};
// Fonction pour s'abonner aux changements d'une table
// Fonction pour s'abonner aux changements d'une table
export const SubscribeToTable = (config: {
  table: string;
  channelName: string;
  event: string;
  filter?: string;
  callback: (payload: any) => void;
}) => {
  try {
    const subscriptionConfig: any = {
      event: config.event as any,
      schema: "public",
      table: config.table,
    };

    // Ajouter le filtre si spécifié
    if (config.filter) {
      subscriptionConfig.filter = config.filter;
    }

    const subscription = supabase
      .channel(config.channelName)
      .on("postgres_changes", subscriptionConfig, config.callback)
      .subscribe();

    return subscription;
  } catch (error) {
    console.error(`Erreur d'abonnement à la table ${config.table}:`, error);
    return null;
  }
};
// Fonction pour se désabonner
export const UnsubscribeFromChannel = (channel: RealtimeChannel) => {
  supabase.removeChannel(channel);
};
