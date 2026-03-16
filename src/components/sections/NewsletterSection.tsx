import { useScrollReveal } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";

export default function NewsletterSection() {
  const ref = useScrollReveal();

  return (
    <section className="py-16 md:py-[120px] bg-terroir-espresso">
      <div ref={ref} className="max-w-[1440px] mx-auto px-6 text-center stagger-children">
        <h2 className="fade-up font-display text-3xl md:text-5xl font-bold text-terroir-cream">
          The Art of the Morning, Delivered.
        </h2>
        <p className="fade-up font-body text-sm md:text-base text-terroir-sand mt-4 max-w-[520px] mx-auto">
          Join 40,000 coffee lovers. Get tasting notes, origin stories, and early access — weekly.
        </p>
        <div className="fade-up flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-5 py-3.5 font-body text-sm bg-terroir-cream text-terroir-espresso placeholder:text-terroir-text-muted border-none outline-none focus:ring-2 focus:ring-terroir-gold"
          />
          <Button variant="hero" className="w-full sm:w-auto whitespace-nowrap">
            JOIN
          </Button>
        </div>
        <p className="fade-up font-body text-[11px] font-light text-terroir-text-muted mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
        <div className="fade-up flex items-center justify-center gap-2 mt-4">
          <div className="flex -space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-terroir-espresso"
                style={{ background: `hsl(${30 + i * 10}, 30%, ${35 + i * 10}%)` }}
              />
            ))}
          </div>
          <span className="font-body text-[11px] text-terroir-sand ml-2">12,400+ members</span>
        </div>
      </div>
    </section>
  );
}
