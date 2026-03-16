import { useState } from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

interface Props {
  defaultTab?: "signin" | "signup";
  onSuccess?: () => void;
}

export default function AuthTabs({ defaultTab = "signin", onSuccess }: Props) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(defaultTab);
  const [showForgot, setShowForgot] = useState(false);

  if (showForgot) {
    return <ForgotPasswordForm onBack={() => setShowForgot(false)} />;
  }

  return (
    <div>
      {/* Tabs */}
      <div className="relative flex" style={{ borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
        {(["signin", "signup"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 pb-4 font-body text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-200"
            style={{
              color: activeTab === tab ? "var(--color-gold)" : "rgba(245,236,215,0.4)",
            }}
          >
            {tab === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
          </button>
        ))}
        {/* Active indicator */}
        <div
          className="absolute bottom-0 h-[2px] transition-all duration-300 ease-out"
          style={{
            background: "var(--color-gold)",
            width: "50%",
            left: activeTab === "signin" ? "0%" : "50%",
          }}
        />
      </div>

      {/* Form */}
      <div key={activeTab} className="animate-[fade-in_0.25s_ease]">
        {activeTab === "signin" ? (
          <SignInForm onForgotPassword={() => setShowForgot(true)} onSuccess={onSuccess} />
        ) : (
          <SignUpForm onSuccess={onSuccess} />
        )}
      </div>
    </div>
  );
}
