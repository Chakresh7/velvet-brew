import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthTabs from "@/components/auth/AuthTabs";
import heroCoffee from "@/assets/hero-coffee.jpg";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignup = location.pathname === "/signup";

  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel — Cinematic Brand Side */}
      <div className="relative lg:w-1/2 flex flex-col justify-center overflow-hidden min-h-[200px] lg:min-h-screen"
        style={{ background: "var(--color-espresso)" }}
      >
        {/* Background image */}
        <img
          src={heroCoffee}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, rgba(26,15,10,0.85) 0%, rgba(44,31,20,0.6) 100%)",
        }} />
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        }} />

        <div className="relative z-10 p-10 lg:p-[60px] flex flex-col justify-between h-full">
          {/* Logo */}
          <div>
            <Link to="/" className="inline-block">
              <span className="font-display text-[32px] font-bold tracking-[0.08em] text-terroir-gold">TERROIR</span>
              <span className="hidden lg:block font-body text-[9px] font-light uppercase tracking-[0.15em] text-terroir-gold/60 mt-1">
                EST. MMXVI · RARE ORIGINS
              </span>
            </Link>
          </div>

          {/* Main statement */}
          <div className="hidden lg:block">
            <p className="font-accent text-[52px] font-light italic text-terroir-cream leading-[1.2] animate-[fade-in_1s_0.3s_ease_both]">
              Every cup<br />tells a story<br />of its origin.
            </p>
          </div>

          {/* Social proof */}
          <div className="hidden lg:block">
            {/* Avatars */}
            <div className="flex items-center mb-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-display text-sm text-terroir-gold"
                  style={{
                    background: `hsl(${30 + i * 10}, ${20 + i * 5}%, ${12 + i * 3}%)`,
                    border: "2px solid var(--color-gold)",
                    marginLeft: i > 1 ? "-12px" : "0",
                    zIndex: 5 - i,
                    position: "relative",
                  }}
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="font-body text-[12px] text-terroir-cream">
              Join 12,400+ members who have found their perfect cup
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-terroir-gold text-[14px]">★★★★★</span>
              <span className="font-body text-[11px] text-terroir-text-muted">4.9/5 average rating</span>
            </div>

            {/* Benefits */}
            <div className="mt-6 space-y-2">
              {[
                "Exclusive access to limited micro-lot releases",
                "Subscribe & save 15% on every order",
                "Free shipping on all orders over $75",
                "Personal roast recommendations",
              ].map((benefit, i) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 animate-[fade-in_0.5s_ease_both]"
                  style={{ animationDelay: `${0.5 + i * 0.1}s` }}
                >
                  <span className="w-1 h-1 rounded-full bg-terroir-gold flex-shrink-0" />
                  <span className="font-body text-[12px] text-terroir-cream">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Decorative line */}
            <div className="mt-10 mx-auto w-px h-20" style={{
              background: "linear-gradient(to bottom, var(--color-gold), transparent)",
            }} />
          </div>
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="lg:w-1/2 flex items-center justify-center" style={{ background: "#0F0805" }}>
        <div className="w-full max-w-[420px] px-6 py-10 lg:px-12 lg:py-[60px]">
          <AuthTabs defaultTab={isSignup ? "signup" : "signin"} onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}
