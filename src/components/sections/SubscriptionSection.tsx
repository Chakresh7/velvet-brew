import lifestyleCup from "@/assets/lifestyle-cup.jpg";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/use-scroll";
import { Check } from "lucide-react";

const plans = [
  { name: "Espresso Essentials", price: "$29/mo", desc: "Two single-origin bags, roasted fresh weekly." },
  { name: "Connoisseur", price: "$49/mo", desc: "Three rare micro-lots with tasting cards.", popular: true },
  { name: "Grand Cru", price: "$89/mo", desc: "Four exclusive lots plus a curated tea pairing." },
];

export default function SubscriptionSection() {
  const ref = useScrollReveal();

  return (
    <section className="py-16 md:py-[120px] max-w-[1440px] mx-auto px-6 md:px-12">
      <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="stagger-children">
          <span className="fade-up font-body text-[10px] font-medium uppercase tracking-[0.2em] text-terroir-gold">
            TERROIR CLUB
          </span>
          <h2 className="fade-up font-display text-3xl md:text-[52px] font-bold text-terroir-cream mt-4 leading-tight">
            A New Rarity,{"\n"}Every Month.
          </h2>
          <p className="fade-up font-accent text-base md:text-lg text-terroir-sand mt-6">
            Join 12,000 members who discover rare micro-lot coffees before they sell out. Curated monthly by our sourcing team.
          </p>
          <div className="fade-up space-y-3 mt-8">
            {[
              "Save 15% on every order",
              "First access to limited releases",
              "Free shipping, always",
              "Skip or cancel anytime",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <Check size={16} className="text-terroir-gold flex-shrink-0" />
                <span className="font-body text-sm text-terroir-cream">{benefit}</span>
              </div>
            ))}
          </div>
          <div className="fade-up flex items-center gap-4 mt-8">
            <Button variant="hero" size="lg">JOIN THE CLUB →</Button>
            <button className="nav-link font-body text-[11px] font-medium uppercase tracking-[0.1em] text-terroir-gold">
              Learn More
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="fade-up">
          <img src={lifestyleCup} alt="Morning coffee ritual" className="w-full h-auto object-cover" style={{ aspectRatio: "3/4" }} />
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="p-6 md:p-8 relative"
            style={{
              background: "rgba(44, 31, 20, 0.6)",
              border: plan.popular ? "1px solid #D4AF37" : "1px solid rgba(212,175,55,0.15)",
            }}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-6 bg-terroir-gold text-terroir-espresso font-body text-[8px] font-semibold uppercase tracking-[0.1em] px-3 py-1">
                MOST POPULAR
              </span>
            )}
            <h3 className="font-display text-xl font-bold text-terroir-cream">{plan.name}</h3>
            <p className="font-body text-2xl font-semibold text-terroir-gold mt-2">{plan.price}</p>
            <p className="font-body text-sm text-terroir-sand mt-3">{plan.desc}</p>
            <Button variant={plan.popular ? "hero" : "outline"} className="w-full mt-6">
              Select
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
