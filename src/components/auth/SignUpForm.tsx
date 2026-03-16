import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import SocialLoginButtons from "./SocialLoginButtons";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { Eye, EyeOff, Check, X, ChevronDown } from "lucide-react";

interface Props {
  onSuccess?: () => void;
}

const BREW_OPTIONS = ["Pour Over", "Espresso", "French Press", "Cold Brew"];
const FLAVOR_OPTIONS = ["Fruity", "Chocolatey", "Floral", "Earthy"];

export default function SignUpForm({ onSuccess }: Props) {
  const { setIsNewSignup } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [selectedBrew, setSelectedBrew] = useState<string | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);

  const blur = (field: string) => () => setTouched((t) => ({ ...t, [field]: true }));

  const errors = {
    firstName: touched.firstName && firstName.length < 2 ? "Minimum 2 characters" : "",
    lastName: touched.lastName && lastName.length < 2 ? "Minimum 2 characters" : "",
    email: touched.email && (!email || !email.includes("@")) ? "Please enter a valid email" : "",
    password: touched.password && password.length < 8 ? "Minimum 8 characters" : "",
    confirmPw: touched.confirmPw && confirmPw && confirmPw !== password ? "Passwords don't match" : "",
  };

  const confirmMatch = confirmPw.length > 0 && confirmPw === password;
  const confirmMismatch = touched.confirmPw && confirmPw.length > 0 && confirmPw !== password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, email: true, password: true, confirmPw: true });
    if (firstName.length < 2 || lastName.length < 2 || !email.includes("@") || password.length < 8 || password !== confirmPw || !termsAccepted) return;

    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: `${firstName} ${lastName}`,
          first_name: firstName,
          last_name: lastName,
          brew_preference: selectedBrew,
          flavor_preference: selectedFlavor,
        },
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setIsNewSignup(true);
      setTimeout(() => onSuccess?.(), 800);
    }
  };

  const inputStyle = (err: string) => ({
    background: "rgba(44,31,20,0.5)",
    border: err ? "1px solid #C0392B" : "1px solid rgba(212,175,55,0.2)",
    borderRadius: "2px",
  });

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <h2 className="font-display text-[36px] font-bold text-terroir-cream leading-tight">Begin your ritual.</h2>
      <p className="font-body text-[13px] text-terroir-text-muted mt-2 leading-relaxed">
        Create an account to unlock member<br />pricing and exclusive origins.
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

      {/* Name row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="font-body text-[10px] font-medium uppercase tracking-[0.15em] text-terroir-gold block mb-2">FIRST NAME</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onBlur={blur("firstName")}
            placeholder="First"
            className="auth-input w-full h-[52px] px-4 font-body text-[14px] text-terroir-cream placeholder:text-terroir-text-muted/35 outline-none transition-all"
            style={inputStyle(errors.firstName)}
          />
          {errors.firstName && <p className="font-body text-[11px] mt-1" style={{ color: "#E74C3C" }}>⚠ {errors.firstName}</p>}
        </div>
        <div>
          <label className="font-body text-[10px] font-medium uppercase tracking-[0.15em] text-terroir-gold block mb-2">LAST NAME</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onBlur={blur("lastName")}
            placeholder="Last"
            className="auth-input w-full h-[52px] px-4 font-body text-[14px] text-terroir-cream placeholder:text-terroir-text-muted/35 outline-none transition-all"
            style={inputStyle(errors.lastName)}
          />
          {errors.lastName && <p className="font-body text-[11px] mt-1" style={{ color: "#E74C3C" }}>⚠ {errors.lastName}</p>}
        </div>
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="font-body text-[10px] font-medium uppercase tracking-[0.15em] text-terroir-gold block mb-2">EMAIL ADDRESS</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={blur("email")}
          placeholder="your@email.com"
          className="auth-input w-full h-[52px] px-4 font-body text-[14px] text-terroir-cream placeholder:text-terroir-text-muted/35 outline-none transition-all"
          style={inputStyle(errors.email)}
        />
        {errors.email && <p className="font-body text-[11px] mt-1" style={{ color: "#E74C3C" }}>⚠ {errors.email}</p>}
      </div>

      {/* Password */}
      <div className="mb-4">
        <label className="font-body text-[10px] font-medium uppercase tracking-[0.15em] text-terroir-gold block mb-2">PASSWORD</label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={blur("password")}
            placeholder="••••••••"
            className="auth-input w-full h-[52px] px-4 pr-12 font-body text-[14px] text-terroir-cream placeholder:text-terroir-text-muted/35 outline-none transition-all"
            style={inputStyle(errors.password)}
          />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-terroir-gold/50 hover:text-terroir-gold transition-colors">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="font-body text-[11px] mt-1" style={{ color: "#E74C3C" }}>⚠ {errors.password}</p>}
        <PasswordStrengthMeter password={password} />
      </div>

      {/* Confirm Password */}
      <div className="mb-4">
        <label className="font-body text-[10px] font-medium uppercase tracking-[0.15em] text-terroir-gold block mb-2">CONFIRM PASSWORD</label>
        <div className="relative">
          <input
            type={showConfirmPw ? "text" : "password"}
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            onBlur={blur("confirmPw")}
            placeholder="••••••••"
            className="auth-input w-full h-[52px] px-4 pr-20 font-body text-[14px] text-terroir-cream placeholder:text-terroir-text-muted/35 outline-none transition-all"
            style={inputStyle(errors.confirmPw)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {confirmPw && (
              confirmMatch ? <Check size={16} className="text-[#27AE60]" /> : confirmMismatch ? <X size={16} className="text-[#E74C3C]" /> : null
            )}
            <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="text-terroir-gold/50 hover:text-terroir-gold transition-colors">
              {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        {errors.confirmPw && <p className="font-body text-[11px] mt-1" style={{ color: "#E74C3C" }}>⚠ {errors.confirmPw}</p>}
      </div>

      {/* Coffee Preferences */}
      <div className="mb-5">
        <button
          type="button"
          onClick={() => setPrefsOpen(!prefsOpen)}
          className="flex items-center gap-2 font-body text-[11px] text-terroir-gold"
        >
          <span>✦</span>
          Personalize your experience (optional)
          <ChevronDown size={14} className={`transition-transform duration-200 ${prefsOpen ? "rotate-180" : ""}`} />
        </button>
        {prefsOpen && (
          <div className="mt-4 space-y-4 animate-[fade-in_0.25s_ease]">
            <div>
              <p className="font-body text-[11px] text-terroir-cream-muted mb-2">How do you brew?</p>
              <div className="grid grid-cols-2 gap-2">
                {BREW_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedBrew(selectedBrew === opt ? null : opt)}
                    className="font-body text-[11px] uppercase tracking-[0.05em] px-3 py-2 transition-all"
                    style={{
                      background: selectedBrew === opt ? "var(--color-gold)" : "transparent",
                      color: selectedBrew === opt ? "var(--color-espresso)" : "var(--color-cream-muted)",
                      border: `1px solid ${selectedBrew === opt ? "var(--color-gold)" : "rgba(212,175,55,0.2)"}`,
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-body text-[11px] text-terroir-cream-muted mb-2">Favorite flavor profile?</p>
              <div className="grid grid-cols-2 gap-2">
                {FLAVOR_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedFlavor(selectedFlavor === opt ? null : opt)}
                    className="font-body text-[11px] uppercase tracking-[0.05em] px-3 py-2 transition-all"
                    style={{
                      background: selectedFlavor === opt ? "var(--color-gold)" : "transparent",
                      color: selectedFlavor === opt ? "var(--color-espresso)" : "var(--color-cream-muted)",
                      border: `1px solid ${selectedFlavor === opt ? "var(--color-gold)" : "rgba(212,175,55,0.2)"}`,
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Terms */}
      <div className="mb-6">
        <label className="flex items-start gap-2 cursor-pointer">
          <div
            onClick={() => setTermsAccepted(!termsAccepted)}
            className="w-4 h-4 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200 cursor-pointer"
            style={{
              background: termsAccepted ? "var(--color-gold)" : "transparent",
              border: `1px solid ${termsAccepted ? "var(--color-gold)" : "rgba(212,175,55,0.4)"}`,
              borderRadius: "2px",
            }}
          >
            {termsAccepted && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span className="font-body text-[11px] text-terroir-text-muted leading-relaxed">
            By creating an account, I agree to TERROIR's{" "}
            <span className="text-terroir-gold underline cursor-pointer">Terms of Service</span>
            {" "}and{" "}
            <span className="text-terroir-gold underline cursor-pointer">Privacy Policy</span>
          </span>
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || success || !termsAccepted}
        className="w-full h-[52px] font-body text-[12px] font-bold uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-60"
        style={{
          background: success ? "#27AE60" : "var(--color-gold)",
          color: success ? "white" : "var(--color-espresso)",
          borderRadius: "2px",
        }}
      >
        {success ? "WELCOME TO TERROIR ✓" : loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-terroir-espresso/30 border-t-terroir-espresso rounded-full animate-spin" />
            CREATING YOUR ACCOUNT...
          </span>
        ) : "CREATE ACCOUNT →"}
      </button>
    </form>
  );
}
