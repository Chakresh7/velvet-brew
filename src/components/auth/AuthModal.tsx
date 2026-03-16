import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthTabs from "./AuthTabs";
import { X } from "lucide-react";

export default function AuthModal() {
  const { authModalOpen, closeAuthModal } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (authModalOpen) {
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [authModalOpen]);

  useEffect(() => {
    if (!authModalOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuthModal();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      style={{
        background: visible ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(8px)" : "blur(0px)",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        className="relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto"
        style={{
          background: "#0F0805",
          border: "1px solid rgba(212,175,55,0.25)",
          borderRadius: "2px",
          boxShadow: "0 40px 120px rgba(0,0,0,0.9)",
          padding: "48px",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.95)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
      >
        {/* Close */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-terroir-cream/50 hover:text-terroir-gold transition-colors"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-display text-2xl font-bold tracking-[0.08em] text-terroir-gold">TERROIR</span>
        </div>

        <AuthTabs onSuccess={closeAuthModal} />
      </div>
    </div>
  );
}
