import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SocialLoginButtons from "./SocialLoginButtons";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  onForgotPassword: () => void;
  onSuccess?: () => void;
}

export default function SignInForm({ onForgotPassword, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const emailError = touched.email && (!email || !email.includes("@")) ? "Please enter a valid email address" : "";
  const pwError = touched.password && !password ? "Password is required" : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!email || !email.includes("@") || !password) return;

    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Incorrect email or password. Please try again.");
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => onSuccess?.(), 800);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <h2 className="font-display text-[36px] font-bold text-terroir-cream leading-tight">Welcome back.</h2>
      <p className="font-body text-[13px] text-terroir-text-muted mt-2 leading-relaxed">
        Sign in to access your orders,<br />subscriptions and wishlist.
      </p>

      <div className="mt-8">
        <SocialLoginButtons />
      </div>

      {error && (
        <div className="mb-4 p-3" style={{
          background: "rgba(192,57,43,0.1)",
          border: "1px solid rgba(192,57,43,0.4)",
          borderLeft: "3px solid #C0392B",
        }}>
          <span className="font-body text-[12px]" style={{ color: "#E74C3C" }}>⚠ {error}</span>
        </div>
      )}

      {/* Email */}
      <div className="mb-4">
        <label className="font-body text-[10px] font-medium uppercase tracking-[0.15em] text-terroir-gold block mb-2">
          EMAIL ADDRESS
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          placeholder="your@email.com"
          className="auth-input w-full h-[52px] px-4 font-body text-[14px] text-terroir-cream placeholder:text-terroir-text-muted/35 outline-none transition-all duration-200"
          style={{
            background: "rgba(44,31,20,0.5)",
            border: emailError ? "1px solid #C0392B" : "1px solid rgba(212,175,55,0.2)",
            borderRadius: "2px",
          }}
        />
        {emailError && (
          <p className="font-body text-[11px] mt-1" style={{ color: "#E74C3C" }}>⚠ {emailError}</p>
        )}
      </div>

      {/* Password */}
      <div className="mb-3">
        <label className="font-body text-[10px] font-medium uppercase tracking-[0.15em] text-terroir-gold block mb-2">
          PASSWORD
        </label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            placeholder="••••••••"
            className="auth-input w-full h-[52px] px-4 pr-12 font-body text-[14px] text-terroir-cream placeholder:text-terroir-text-muted/35 outline-none transition-all duration-200"
            style={{
              background: "rgba(44,31,20,0.5)",
              border: pwError ? "1px solid #C0392B" : "1px solid rgba(212,175,55,0.2)",
              borderRadius: "2px",
            }}
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-terroir-gold/50 hover:text-terroir-gold transition-colors"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {pwError && (
          <p className="font-body text-[11px] mt-1" style={{ color: "#E74C3C" }}>⚠ {pwError}</p>
        )}
      </div>

      {/* Forgot + Remember */}
      <div className="flex items-center justify-between mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            onClick={() => setRemember(!remember)}
            className="w-4 h-4 flex items-center justify-center transition-all duration-200 cursor-pointer"
            style={{
              background: remember ? "var(--color-gold)" : "transparent",
              border: `1px solid ${remember ? "var(--color-gold)" : "rgba(212,175,55,0.4)"}`,
              borderRadius: "2px",
            }}
          >
            {remember && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span className="font-body text-[12px] text-terroir-cream-muted">Keep me signed in</span>
        </label>
        <button
          type="button"
          onClick={onForgotPassword}
          className="font-body text-[11px] text-terroir-gold hover:underline"
        >
          Forgot your password?
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || success}
        className="w-full h-[52px] font-body text-[12px] font-bold uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-80"
        style={{
          background: success ? "#27AE60" : "var(--color-gold)",
          color: success ? "white" : "var(--color-espresso)",
          borderRadius: "2px",
        }}
      >
        {success ? "WELCOME BACK ✓" : loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-terroir-espresso/30 border-t-terroir-espresso rounded-full animate-spin" />
            SIGNING IN...
          </span>
        ) : "SIGN IN →"}
      </button>
    </form>
  );
}
