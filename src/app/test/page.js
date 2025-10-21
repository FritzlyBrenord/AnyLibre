// app/login/page.js
"use client";
import { createBrowserClient } from '@supabase/ssr'

export function ClientLogin() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export default function LoginPage() {
  const supabase = ClientLogin();

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!error) {
      // Les cookies sont automatiquement créés
      window.location.href = "/dashboard";
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <button type="submit">Se connecter</button>
    </form>
  );
}
