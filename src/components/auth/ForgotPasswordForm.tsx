import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  onBack: () => void;
}

export default function ForgotPasswordForm({ onBack }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
      setResendTimer(30);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    setResendTimer(30);
  };

  return (
    <div className="mt-6">
      <button onClick={onBack} className="font-body text-[11px] text-terroir-gold hover:underline mb-6 block">
        ← Back to Sign In
      </button>

      {!sent ? (
        <form onSubmit={handleSubmit}>
          <h2 className="font-display text-[32px] font-bold text-terroir-cream leading-tight">Reset your password.</h2>
          <p className="font-body text-[13px] text-terroir-text-muted mt-2 leading-relaxed">
            Enter your email and we'll send<br />you a reset link.
          </p>

          {error && (
            <div className="mt-4 p-3" style={{
              background: "rgba(192,57,43,0.1)",
              border: "1px solid rgba(192,57,43,0.4)",
              borderLeft: "3px solid #C0392B",
            }}>
              <span className="font-body text-[12px]" style={{ color: "#E74C3C" }}>⚠ {error}</span>
            </div>
          )}

          <div className="mt-8 mb-6">
            <label className="font-body text-[10px] font-medium uppercase tracking-[0.15em] text-terroir-gold block mb-2">EMAIL ADDRESS</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="auth-input w-full h-[52px] px-4 font-body text-[14px] text-terroir-cream placeholder:text-terroir-text-muted/35 outline-none transition-all"
              style={{
                background: "rgba(44,31,20,0.5)",
                border: "1px solid rgba(212,175,55,0.2)",
                borderRadius: "2px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[52px] font-body text-[12px] font-bold uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-80"
            style={{
              background: "var(--color-gold)",
              color: "var(--color-espresso)",
              borderRadius: "2px",
            }}
          >
            {loading ? "SENDING..." : "SEND RESET LINK →"}
          </button>
        </form>
      ) : (
        <div className="text-center mt-8">
          {/* Envelope icon */}
          <div className="mx-auto w-12 h-12 flex items-center justify-center mb-6 animate-[scale-in_0.3s_ease]">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="10" width="40" height="28" rx="2" stroke="var(--color-gold)" strokeWidth="1.5" fill="none"/>
              <path d="M4 14L24 28L44 14" stroke="var(--color-gold)" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
          <h2 className="font-display text-[28px] font-bold text-terroir-cream">Check your inbox.</h2>
          <p className="font-body text-[13px] text-terroir-text-muted mt-3 leading-relaxed">
            We've sent a reset link to<br /><span className="text-terroir-cream">{email}</span>.
            <br />Check your spam folder if you don't see it.
          </p>
          <button
            onClick={handleResend}
            disabled={resendTimer > 0}
            className="mt-8 font-body text-[12px] text-terroir-gold hover:underline disabled:opacity-50 disabled:no-underline"
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s...` : "Resend email"}
          </button>
          <br />
          <button onClick={onBack} className="mt-4 font-body text-[11px] text-terroir-gold hover:underline">
            ← Back to Sign In
          </button>
        </div>
      )}
    </div>
  );
}
