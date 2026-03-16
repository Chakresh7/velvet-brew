import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/use-scroll";

export default function QuizSection() {
  const ref = useScrollReveal();

  return (
    <section
      className="py-16 md:py-[120px] relative overflow-hidden"
      style={{ background: "#1A0F0A" }}
    >
      {/* Gold radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 70%)",
        }}
      />

      <div ref={ref} className="relative z-10 max-w-[1440px] mx-auto px-6 text-center stagger-children">
        <span className="fade-up font-body text-[10px] font-medium uppercase tracking-[0.3em] text-terroir-gold block">
          THE TERROIR QUIZ
        </span>
        <h2 className="fade-up font-display text-4xl md:text-6xl lg:text-[64px] font-black text-terroir-cream mt-6 leading-tight">
          Find Your{"\n"}Perfect Cup.
        </h2>
        <p className="fade-up font-body text-sm md:text-[15px] font-light text-terroir-sand mt-6 max-w-[480px] mx-auto">
          Answer 5 questions. We'll match you with your ideal roast, origin, and brew method.
        </p>
        <div className="fade-up mt-10">
          <Button variant="outline" size="xl">
            START THE QUIZ →
          </Button>
        </div>
        <div className="fade-up flex items-center justify-center gap-6 mt-8">
          {["🌿 Flavor Profile", "☕ Brew Method", "📦 Custom Box"].map((item) => (
            <span key={item} className="font-body text-[10px] uppercase tracking-[0.1em] text-terroir-sand">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
