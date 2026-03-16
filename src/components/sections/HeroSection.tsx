import heroImage from "@/assets/hero-coffee.jpg";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/use-scroll";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const ref = useScrollReveal();

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Coffee pour" className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(26,15,10,0.3) 0%, rgba(26,15,10,0.75) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div
        ref={ref}
        className="relative z-10 h-full flex items-center max-w-[1440px] mx-auto px-6 md:px-20"
      >
        <div className="max-w-[680px] stagger-children">
          <span className="fade-up font-body text-[10px] font-medium uppercase tracking-[0.3em] text-terroir-gold block mb-6">
            SINGLE ORIGIN · ARTISAN ROASTED
          </span>
          <h1 className="fade-up font-display text-5xl md:text-7xl lg:text-[82px] font-black text-terroir-cream leading-[1.1]">
            Rare Origins,{"\n"}
            Exceptional{"\n"}
            Moments.
          </h1>
          <p className="fade-up font-accent text-lg md:text-[22px] italic text-terroir-sand mt-6 max-w-[520px]">
            Coffee and tea sourced from 23 farms across 11 countries. Roasted to order. Delivered to your ritual.
          </p>
          <div className="fade-up flex flex-wrap items-center gap-4 mt-8">
            <Button variant="hero" size="xl" asChild>
              <Link to="/shop">SHOP THE COLLECTION →</Link>
            </Button>
            <button className="font-body text-[11px] font-medium uppercase tracking-[0.1em] text-terroir-gold nav-link">
              Watch Our Story ▶
            </button>
          </div>
          <div className="fade-up flex items-center gap-3 mt-8 text-terroir-cream-muted">
            <span className="text-terroir-gold text-sm">★ ★ ★ ★ ★</span>
            <span className="font-body text-[10px] font-light">
              4.9/5 · 12,400+ Members · Free Shipping $75+
            </span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center scroll-indicator">
        <div className="w-px h-10 bg-terroir-gold/50" />
        <span className="font-body text-[8px] uppercase tracking-[0.2em] text-terroir-gold/50 mt-2">Scroll</span>
      </div>
    </section>
  );
}
