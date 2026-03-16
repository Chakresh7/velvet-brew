import { useState, useEffect } from "react";
import { testimonials } from "@/data/products";
import { useScrollReveal } from "@/hooks/use-scroll";

export default function TestimonialsSection() {
  const ref = useScrollReveal();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Show 3 at a time on desktop
  const getVisible = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      result.push(testimonials[(active + i) % testimonials.length]);
    }
    return result;
  };

  return (
    <section className="py-16 md:py-[120px] bg-terroir-espresso">
      <div ref={ref} className="max-w-[1440px] mx-auto px-6 md:px-12 text-center stagger-children">
        <span className="fade-up font-display text-6xl md:text-8xl text-terroir-gold/20 leading-none">"</span>
        
        {/* Mobile: single testimonial */}
        <div className="md:hidden fade-up">
          <blockquote className="font-accent text-xl italic text-terroir-cream max-w-lg mx-auto">
            {testimonials[active].quote}
          </blockquote>
          <div className="mt-6">
            <p className="font-body text-[13px] font-semibold text-terroir-cream">{testimonials[active].name}</p>
            <p className="font-body text-[11px] text-terroir-gold">{testimonials[active].location}</p>
            <div className="text-terroir-gold text-sm mt-1">★ ★ ★ ★ ★</div>
          </div>
        </div>

        {/* Desktop: 3 visible */}
        <div className="hidden md:grid grid-cols-3 gap-8 fade-up">
          {getVisible().map((t, i) => (
            <div key={`${t.name}-${i}`} className="text-center px-4">
              <blockquote className="font-accent text-lg lg:text-[22px] italic text-terroir-cream">
                "{t.quote}"
              </blockquote>
              <div className="mt-6">
                <div className="w-12 h-12 rounded-full bg-terroir-mahogany mx-auto mb-3 flex items-center justify-center">
                  <span className="font-display text-lg text-terroir-gold">{t.name[0]}</span>
                </div>
                <p className="font-body text-[13px] font-semibold text-terroir-cream">{t.name}</p>
                <p className="font-body text-[11px] text-terroir-gold">{t.location}</p>
                <div className="text-terroir-gold text-sm mt-1">★ ★ ★ ★ ★</div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === active ? "bg-terroir-gold w-6" : "bg-terroir-gold/30"
              }`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
