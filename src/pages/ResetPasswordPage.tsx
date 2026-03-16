import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    // Also check hash for type=recovery
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8 || password !== confirmPw) return;

    setLoading(true);
    setError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#0F0805" }}>
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <span className="font-display text-2xl font-bold tracking-[0.08em] text-terroir-gold">TERROIR</span>
        </div>

        {!isRecovery ? (
          <div className="text-center">
            <h2 className="font-display text-[28px] font-bold text-terroir-cream">Invalid reset link.</h2>
            <p className="font-body text-[13px] text-terroir-text-muted mt-3">
              This link may have expired. Please request a new password reset.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-6 font-body text-[11px] text-terroir-gold hover:underline"
            >
              ← Back to Sign In
            </button>
          </div>
        ) : success ? (
          <div className="text-center">
            <div className="text-[48px] mb-4">✓</div>
            <h2 className="font-display text-[28px] font-bold text-terroir-cream">Password updated.</h2>
            <p className="font-body text-[13px] text-terroir-text-muted mt-3">Redirecting you home...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="font-display text-[32px] font-bold text-terroir-cream leading-tight">Set new password.</h2>
            <p className="font-body text-[13px] text-terroir-text-muted mt-2">Enter your new password below.</p>

            {error && (
              <div className="mt-4 p-3" style={{
                background: "rgba(192,57,43,0.1)",
                border: "1px solid rgba(192,57,43,0.4)",
                borderLeft: "3px solid #C0392B",
              }}>
                <span className="font-body text-[12px]" style={{ color: "#E74C3C" }}>⚠ {error}</span>
              </div>
            )}

            <div className="mt-8 mb-4">
              <label className="font-body text-[10px] font-medium uppercase tracking-[0.15em] text-terroir-gold block mb-2">NEW PASSWORD</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="auth-input w-full h-[52px] px-4 pr-12 font-body text-[14px] text-terroir-cream placeholder:text-terroir-text-muted/35 outline-none transition-all"
                  style={{
                    background: "rgba(44,31,20,0.5)",
                    border: "1px solid rgba(212,175,55,0.2)",
                    borderRadius: "2px",
                  }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-terroir-gold/50 hover:text-terroir-gold">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrengthMeter password={password} />
            </div>

            <div className="mb-6">
              <label className="font-body text-[10px] font-medium uppercase tracking-[0.15em] text-terroir-gold block mb-2">CONFIRM PASSWORD</label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="••••••••"
                className="auth-input w-full h-[52px] px-4 font-body text-[14px] text-terroir-cream placeholder:text-terroir-text-muted/35 outline-none transition-all"
                style={{
                  background: "rgba(44,31,20,0.5)",
                  border: confirmPw && confirmPw !== password ? "1px solid #C0392B" : "1px solid rgba(212,175,55,0.2)",
                  borderRadius: "2px",
                }}
              />
              {confirmPw && confirmPw !== password && (
                <p className="font-body text-[11px] mt-1" style={{ color: "#E74C3C" }}>Passwords don't match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || password.length < 8 || password !== confirmPw}
              className="w-full h-[52px] font-body text-[12px] font-bold uppercase tracking-[0.2em] transition-all disabled:opacity-60"
              style={{
                background: "var(--color-gold)",
                color: "var(--color-espresso)",
                borderRadius: "2px",
              }}
            >
              {loading ? "UPDATING..." : "SET NEW PASSWORD →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
