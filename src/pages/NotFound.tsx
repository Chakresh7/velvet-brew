import { useLocation, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Search } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

const NotFound = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [cupClicked, setCupClicked] = useState(false);
  const [easterEggText, setEasterEggText] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cupRef = useRef<SVGSVGElement>(null);
  const { addItem } = useCart();

  const featuredProduct = products.find((p) => p.id === "ethiopia-yirgacheffe") || products[0];

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    document.title = "Origin Not Found — TERROIR";
    const meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      const m = document.createElement("meta");
      m.name = "robots";
      m.content = "noindex";
      document.head.appendChild(m);
    }
    setMounted(true);
    return () => {
      document.title = "TERROIR";
      const m = document.querySelector('meta[name="robots"][content="noindex"]');
      m?.remove();
    };
  }, [location.pathname]);

  const handleCupClick = () => {
    if (cupClicked) return;
    setCupClicked(true);
    setTimeout(() => setEasterEggText(true), 300);
    setTimeout(() => setEasterEggText(false), 2800);
    setTimeout(() => setCupClicked(false), 3200);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleAddToCart = () => {
    addItem(featuredProduct, featuredProduct.grindOptions[0], featuredProduct.weightOptions[0], 1);
    toast({ title: "Added to cart", description: featuredProduct.name });
  };

  const quickLinks = [
    { label: "Best Sellers", href: "/shop?filter=bestseller" },
    { label: "Single Origins", href: "/shop?category=coffee" },
    { label: "Subscriptions", href: "/#subscription" },
    { label: "Gift Sets", href: "/shop" },
    { label: "The Quiz", href: "/#quiz" },
  ];

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
      style={{ background: "var(--color-espresso)" }}
    >
      {/* Layer 2 — Radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(44,31,20,0.8) 0%, transparent 70%)",
        }}
      />

      {/* Layer 3 — Noise texture */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.04 }}>
        <filter id="noise404">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise404)" />
      </svg>

      {/* CRT scan lines */}
      <div
        className="fixed inset-0 pointer-events-none select-none"
        style={{
          background: "repeating-linear-gradient(transparent 0px, transparent 2px, rgba(212,175,55,0.008) 2px, rgba(212,175,55,0.008) 4px)",
          zIndex: 0,
        }}
      />

      {/* Corner decorations */}
      <div className="fixed pointer-events-none select-none" style={{ top: 24, left: 24, zIndex: 0 }}>
        <div className="absolute top-0 left-0" style={{ width: 40, height: 1, background: "rgba(212,175,55,0.2)" }} />
        <div className="absolute top-0 left-0" style={{ width: 1, height: 40, background: "rgba(212,175,55,0.2)" }} />
      </div>
      <div className="fixed pointer-events-none select-none" style={{ bottom: 24, right: 24, zIndex: 0 }}>
        <div className="absolute bottom-0 right-0" style={{ width: 40, height: 1, background: "rgba(212,175,55,0.2)" }} />
        <div className="absolute bottom-0 right-0" style={{ width: 1, height: 40, background: "rgba(212,175,55,0.2)" }} />
      </div>

      {/* Coffee bean silhouettes */}
      {[
        { top: "15%", left: "8%", rotate: 25, size: 32, delay: 0 },
        { top: "25%", right: "12%", rotate: -15, size: 20, delay: 1.5 },
        { bottom: "30%", left: "15%", rotate: 45, size: 28, delay: 3 },
        { bottom: "20%", right: "8%", rotate: -30, size: 24, delay: 2 },
        { top: "60%", left: "5%", rotate: 10, size: 16, delay: 4 },
      ].map((bean, i) => (
        <svg
          key={i}
          className="absolute pointer-events-none select-none hidden md:block"
          style={{
            top: bean.top,
            left: bean.left,
            right: bean.right,
            bottom: bean.bottom,
            width: bean.size,
            height: bean.size,
            zIndex: 0,
            animation: `beanFloat ${6 + i * 1.2}s ease-in-out ${bean.delay}s infinite`,
            opacity: 0,
            animationFillMode: "forwards",
            animationDelay: `${2.2 + i * 0.2}s`,
          }}
          viewBox="0 0 24 16"
        >
          <ellipse cx="12" cy="8" rx="10" ry="7" fill="rgba(212,175,55,0.04)" stroke="rgba(212,175,55,0.08)" strokeWidth="1" />
          <line x1="12" y1="1" x2="12" y2="15" stroke="rgba(212,175,55,0.06)" strokeWidth="0.5" />
        </svg>
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-8 py-8 w-full max-w-2xl mx-auto">
        {/* Cup + 404 composition */}
        <div className="relative flex items-center justify-center mb-6 sm:mb-8" style={{ height: 220 }}>
          {/* 404 ghost number */}
          <span
            className="absolute select-none pointer-events-none font-display"
            style={{
              fontSize: "clamp(160px, 20vw, 280px)",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: "1px rgba(212,175,55,0.12)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              zIndex: 1,
              animation: mounted ? "ghost404In 1s ease 0.2s both" : undefined,
            }}
          >
            404
          </span>

          {/* Cup SVG */}
          <svg
            ref={cupRef}
            onClick={handleCupClick}
            className="relative cursor-pointer transition-transform duration-300"
            style={{
              width: "clamp(140px, 18vw, 200px)",
              height: "clamp(140px, 18vw, 200px)",
              zIndex: 2,
              transform: cupClicked ? "rotate(-15deg)" : "rotate(0deg)",
            }}
            viewBox="0 0 200 200"
            fill="none"
          >
            {/* Saucer */}
            <ellipse cx="100" cy="170" rx="80" ry="12" stroke="rgba(212,175,55,0.6)" strokeWidth="1.5" strokeLinecap="round" className="cup-draw" />
            {/* Cup body */}
            <path d="M60 90 L55 155 Q55 165 65 165 L135 165 Q145 165 145 155 L140 90" stroke="rgba(212,175,55,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="cup-draw" />
            {/* Rim */}
            <ellipse cx="100" cy="90" rx="40" ry="8" stroke="rgba(212,175,55,0.6)" strokeWidth="1.5" className="cup-draw" />
            {/* Inside cup */}
            <ellipse cx="100" cy="92" rx="36" ry="6" fill="rgba(26,15,10,0.9)" />
            {/* Handle */}
            <path d="M140 100 Q165 100 165 125 Q165 150 140 150" stroke="rgba(212,175,55,0.6)" strokeWidth="1.5" strokeLinecap="round" fill="none" className="cup-draw" />
            {/* Coffee drip on saucer */}
            <ellipse cx="130" cy="168" rx="3" ry="4" fill="rgba(212,175,55,0.4)" className="drip-pulse" />
            {/* Steam lines */}
            <path d="M85 82 Q82 65 88 55 Q84 45 87 30" stroke="rgba(212,175,55,0.5)" strokeWidth="1" fill="none" strokeLinecap="round" className="steam-line steam-1" />
            <path d="M100 80 Q97 62 103 52 Q99 42 102 25" stroke="rgba(212,175,55,0.5)" strokeWidth="1" fill="none" strokeLinecap="round" className="steam-line steam-2" />
            <path d="M115 82 Q112 65 118 55 Q114 45 117 30" stroke="rgba(212,175,55,0.5)" strokeWidth="1" fill="none" strokeLinecap="round" className="steam-line steam-3" />
            {/* Pour effect on click */}
            {cupClicked && (
              <path d="M75 95 Q72 110 78 135" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" className="pour-anim" />
            )}
          </svg>

          {/* Glow beneath cup */}
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: -10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 240,
              height: 60,
              background: "radial-gradient(ellipse, rgba(212,175,55,0.08) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Easter egg text */}
        <div className="h-6 mb-2">
          {easterEggText && (
            <p className="font-accent italic text-sm animate-fade-in" style={{ color: "rgba(212,175,55,0.6)" }}>
              Even empty cups have stories.
            </p>
          )}
        </div>

        {/* Eyebrow */}
        <p
          className="font-body font-medium uppercase text-center mb-4"
          style={{
            fontSize: 9,
            letterSpacing: "0.35em",
            color: "var(--color-gold)",
            animation: mounted ? "fadeUp 0.8s ease 0.8s both" : undefined,
          }}
        >
          ORIGIN NOT FOUND
        </p>

        {/* Headline */}
        <h1
          className="font-display font-bold italic text-center mb-5"
          style={{
            fontSize: "clamp(32px, 4vw, 42px)",
            lineHeight: 1.2,
            color: "var(--color-cream)",
            animation: mounted ? "fadeUp 0.8s ease 1.0s both" : undefined,
          }}
        >
          This cup has
          <br />
          never been brewed.
        </h1>

        {/* Poetic subtext */}
        <p
          className="font-accent italic text-center max-w-[540px] mb-8"
          style={{
            fontSize: "clamp(17px, 2vw, 20px)",
            lineHeight: 1.7,
            color: "rgba(245,236,215,0.55)",
            fontWeight: 300,
            animation: mounted ? "fadeUp 0.8s ease 1.3s both" : undefined,
          }}
        >
          Like a rare micro-lot lost in transit, the page you're looking for doesn't exist — or perhaps it never did. Let us guide you back to something exceptional.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto items-center"
          style={{ animation: mounted ? "fadeUp 0.6s ease 1.6s both" : undefined }}
        >
          <Link
            to="/"
            className="font-body font-bold uppercase text-center w-full sm:w-auto inline-block transition-all duration-300 hover:shadow-[0_8px_32px_rgba(212,175,55,0.3)]"
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              background: "var(--color-gold)",
              color: "var(--color-espresso)",
              padding: "16px 36px",
              borderRadius: 2,
              border: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-gold-light)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-gold)")}
          >
            RETURN HOME →
          </Link>
          <Link
            to="/shop"
            className="font-body font-semibold uppercase text-center w-full sm:w-auto transition-all duration-300"
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              background: "transparent",
              border: "1px solid rgba(212,175,55,0.4)",
              color: "var(--color-gold)",
              padding: "16px 36px",
              borderRadius: 2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-gold)";
              e.currentTarget.style.background = "rgba(212,175,55,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            EXPLORE THE COLLECTION
          </Link>
        </div>

        {/* Tertiary link */}
        <Link
          to="/#quiz"
          className="font-body text-center block mt-4 transition-opacity duration-200 hover:opacity-100 hover:underline"
          style={{ fontSize: 12, fontWeight: 300, color: "rgba(212,175,55,0.6)" }}
        >
          Or try our cupping quiz to find your perfect cup →
        </Link>

        {/* Quick links */}
        <div
          className="mt-10 sm:mt-12 flex flex-col items-center w-full"
          style={{ animation: mounted ? "fadeUp 0.6s ease 1.9s both" : undefined }}
        >
          <div className="mx-auto mb-5" style={{ width: 120, height: 1, background: "rgba(212,175,55,0.2)" }} />
          <p className="font-body uppercase text-center mb-4" style={{ fontSize: 9, fontWeight: 400, letterSpacing: "0.25em", color: "var(--color-gold)" }}>
            FIND YOUR WAY
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="font-body transition-all duration-200"
                style={{
                  fontSize: 11,
                  fontWeight: 400,
                  padding: "8px 18px",
                  borderRadius: 2,
                  background: "rgba(44,31,20,0.6)",
                  border: "1px solid rgba(212,175,55,0.2)",
                  color: "rgba(245,236,215,0.7)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-gold)";
                  e.currentTarget.style.color = "var(--color-cream)";
                  e.currentTarget.style.background = "rgba(44,31,20,0.9)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)";
                  e.currentTarget.style.color = "rgba(245,236,215,0.7)";
                  e.currentTarget.style.background = "rgba(44,31,20,0.6)";
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div
          className="mt-8 w-full max-w-[360px] flex flex-col items-center"
          style={{ animation: mounted ? "fadeUp 0.6s ease 1.9s both" : undefined }}
        >
          <p className="font-body uppercase text-center mb-3" style={{ fontSize: 9, fontWeight: 400, letterSpacing: "0.2em", color: "rgba(184,164,133,0.6)" }}>
            OR SEARCH OUR COLLECTION
          </p>
          <form onSubmit={handleSearch} className="flex w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search origins, flavors..."
              className="flex-1 font-body h-11 px-4 outline-none transition-colors duration-200"
              style={{
                fontSize: 13,
                fontWeight: 300,
                background: "rgba(44,31,20,0.5)",
                border: "1px solid rgba(212,175,55,0.2)",
                borderRight: "none",
                borderRadius: "2px 0 0 2px",
                color: "var(--color-cream)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-gold)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)")}
            />
            <button
              type="submit"
              className="flex items-center justify-center h-11 w-11 transition-colors duration-200"
              style={{
                background: "var(--color-gold)",
                borderRadius: "0 2px 2px 0",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-gold-light)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-gold)")}
            >
              <Search size={16} color="var(--color-espresso)" />
            </button>
          </form>
        </div>

        {/* Featured product */}
        <div
          className="mt-10 sm:mt-12 w-full max-w-[380px]"
          style={{ animation: mounted ? "fadeUp 0.8s ease 2.5s both" : undefined }}
        >
          <p className="font-body uppercase text-center mb-3" style={{ fontSize: 9, fontWeight: 400, letterSpacing: "0.25em", color: "rgba(212,175,55,0.5)" }}>
            WHILE YOU'RE HERE
          </p>
          <div
            className="flex items-center gap-4 p-4"
            style={{
              background: "rgba(44,31,20,0.4)",
              border: "1px solid rgba(212,175,55,0.15)",
              borderRadius: 2,
            }}
          >
            <img
              src={featuredProduct.image}
              alt={featuredProduct.name}
              className="w-[60px] h-[60px] object-cover"
              style={{ border: "1px solid rgba(212,175,55,0.3)" }}
            />
            <div className="flex-1 min-w-0">
              {featuredProduct.badge && (
                <span
                  className="inline-block font-body uppercase mb-1"
                  style={{
                    fontSize: 8,
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    color: "var(--color-gold)",
                    background: "rgba(212,175,55,0.1)",
                    padding: "2px 8px",
                    borderRadius: 2,
                  }}
                >
                  {featuredProduct.badge}
                </span>
              )}
              <p className="font-display font-medium text-base truncate" style={{ color: "var(--color-cream)" }}>
                {featuredProduct.name}
              </p>
              <p className="font-body text-xs truncate" style={{ fontWeight: 300, color: "rgba(184,164,133,0.7)" }}>
                {featuredProduct.tastingNotes.join(" · ")}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-body font-semibold text-sm" style={{ color: "var(--color-cream)" }}>
                  ${featuredProduct.price.toFixed(2)}
                </span>
                <button
                  onClick={handleAddToCart}
                  className="font-body uppercase transition-opacity duration-200 hover:opacity-80"
                  style={{ fontSize: 11, fontWeight: 600, color: "var(--color-gold)", letterSpacing: "0.1em", background: "none", border: "none", cursor: "pointer" }}
                >
                  ADD TO CART →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline styles for animations */}
      <style>{`
        @keyframes ghost404In {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes steamRise {
          0% { opacity: 0; transform: translateY(0) scaleX(1); }
          20% { opacity: 0.6; }
          50% { opacity: 0.4; transform: translateY(-20px) scaleX(1.1); }
          80% { opacity: 0.1; }
          100% { opacity: 0; transform: translateY(-40px) scaleX(0.9); }
        }
        @keyframes beanFloat {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
        @keyframes dripPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
        @keyframes pourDrop {
          0% { stroke-dashoffset: 60; opacity: 0.6; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @keyframes cupDraw {
          0% { stroke-dashoffset: 600; }
          100% { stroke-dashoffset: 0; }
        }
        .steam-1 { animation: steamRise 3s ease-in-out 0.6s infinite; }
        .steam-2 { animation: steamRise 3s ease-in-out 1.2s infinite; }
        .steam-3 { animation: steamRise 3s ease-in-out 1.8s infinite; }
        .drip-pulse { animation: dripPulse 2s ease-in-out infinite; }
        .pour-anim {
          stroke-dasharray: 60;
          animation: pourDrop 0.6s ease forwards;
        }
        .cup-draw {
          stroke-dasharray: 600;
          animation: cupDraw 1.2s ease 0.4s both;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
