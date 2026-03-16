import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function SocialLoginButtons() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleOAuth = async (provider: "google" | "apple") => {
    setLoading(provider);
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => handleOAuth("google")}
        disabled={!!loading}
        className="w-full h-12 flex items-center justify-center gap-3 font-body text-[13px] font-medium text-terroir-cream transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.3)] disabled:opacity-50"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "2px",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
          <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 2.58 9 3.58z" fill="#EA4335"/>
        </svg>
        {loading === "google" ? "Connecting..." : "Continue with Google"}
      </button>

      <button
        onClick={() => handleOAuth("apple")}
        disabled={!!loading}
        className="w-full h-12 flex items-center justify-center gap-3 font-body text-[13px] font-medium text-terroir-cream transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.3)] disabled:opacity-50"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "2px",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
          <path d="M14.94 9.88c-.02-2.08 1.7-3.08 1.78-3.13-0.97-1.42-2.48-1.61-3.02-1.63-1.28-.13-2.51.76-3.16.76-.65 0-1.66-.74-2.73-.72-1.4.02-2.7.82-3.42 2.08-1.46 2.53-.37 6.29 1.05 8.34.7 1.01 1.53 2.14 2.62 2.1 1.05-.04 1.45-.68 2.72-.68 1.27 0 1.64.68 2.74.66 1.13-.02 1.85-1.03 2.54-2.04.8-1.17 1.13-2.3 1.15-2.36-.02-.01-2.21-.85-2.23-3.38zM12.87 3.53c.58-.7.97-1.68.86-2.65-.83.03-1.84.55-2.44 1.25-.53.62-1 1.61-.87 2.56.93.07 1.87-.47 2.45-1.16z"/>
        </svg>
        {loading === "apple" ? "Connecting..." : "Continue with Apple"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px" style={{ background: "rgba(212,175,55,0.2)" }} />
        <span className="font-body text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--color-text-muted)" }}>OR</span>
        <div className="flex-1 h-px" style={{ background: "rgba(212,175,55,0.2)" }} />
      </div>
    </div>
  );
}
