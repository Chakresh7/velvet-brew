import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function WelcomeModal() {
  const { isNewSignup, setIsNewSignup, user } = useAuth();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isNewSignup && user) {
      requestAnimationFrame(() => setVisible(true));
    }
  }, [isNewSignup, user]);

  if (!isNewSignup || !user) return null;

  const firstName = user.user_metadata?.first_name || "there";

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setIsNewSignup(false), 300);
  };

  const handleShop = () => {
    handleClose();
    navigate("/shop");
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{
        background: visible ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(8px)" : "blur(0px)",
        transition: "background 0.3s, backdrop-filter 0.3s",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="relative max-w-[520px] w-full overflow-hidden"
        style={{
          background: "var(--color-espresso)",
          border: "1px solid rgba(212,175,55,0.3)",
          boxShadow: "0 32px 100px rgba(0,0,0,0.8)",
          padding: "48px",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.95)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
      >
        {/* Confetti */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: "3px",
                height: "8px",
                background: `hsl(${43 + (i * 5)}, ${60 + (i * 3)}%, ${50 + (i * 2)}%)`,
                left: `${10 + (i * 7)}%`,
                top: "-10px",
                transform: `rotate(${i * 30}deg)`,
                animation: `confetti-fall ${1.5 + (i * 0.1)}s ease-out forwards`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>

        <div className="text-center relative z-10">
          <span className="font-body text-[9px] font-medium uppercase tracking-[0.3em] text-terroir-gold">
            WELCOME TO THE FAMILY
          </span>
          <h2 className="font-display text-[40px] font-bold text-terroir-cream mt-4 leading-tight">
            Your ritual<br />starts now.
          </h2>
          <p className="font-body text-[14px] text-terroir-text-muted mt-4 leading-relaxed">
            As a new member, you get 10% off<br />your first order. Your discount has been<br />automatically applied.
          </p>

          {/* Promo badge */}
          <div className="mt-6 inline-block px-8 py-3" style={{
            background: "rgba(212,175,55,0.1)",
            border: "1px solid rgba(212,175,55,0.4)",
          }}>
            <span className="font-display italic text-2xl text-terroir-gold">WELCOME10</span>
          </div>

          <button
            onClick={handleShop}
            className="w-full mt-8 h-[52px] font-body text-[12px] font-bold uppercase tracking-[0.2em] transition-all duration-300"
            style={{
              background: "var(--color-gold)",
              color: "var(--color-espresso)",
              borderRadius: "2px",
            }}
          >
            SHOP THE COLLECTION →
          </button>

          <p className="mt-3">
            <span className="font-body text-[11px] text-terroir-text-muted">or </span>
            <button onClick={handleClose} className="font-body text-[11px] text-terroir-gold hover:underline">
              Explore your account →
            </button>
          </p>

          <p className="font-body text-[10px] text-terroir-text-muted mt-4">
            Discount valid for 30 days. One use per account.
          </p>
        </div>
      </div>
    </div>
  );
}
