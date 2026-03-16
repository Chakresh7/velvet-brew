import originFarm from "@/assets/origin-farm.jpg";
import { useScrollReveal } from "@/hooks/use-scroll";

export default function OriginSection() {
  const ref = useScrollReveal();

  return (
    <section className="py-16 md:py-[120px] bg-terroir-espresso">
      <div
        ref={ref}
        className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        {/* Map / Image */}
        <div className="fade-up relative">
          <img
            src={originFarm}
            alt="Coffee farm at dawn"
            className="w-full h-auto object-cover"
            style={{ aspectRatio: "3/2" }}
          />
          {/* Gold dot pins */}
          {[
            { top: "30%", left: "52%", label: "Ethiopia" },
            { top: "45%", left: "28%", label: "Colombia" },
            { top: "25%", left: "78%", label: "Japan" },
            { top: "40%", left: "72%", label: "India" },
            { top: "35%", left: "50%", label: "Kenya" },
          ].map((pin) => (
            <div
              key={pin.label}
              className="absolute w-3 h-3 bg-terroir-gold rounded-full group cursor-pointer"
              style={{ top: pin.top, left: pin.left, boxShadow: "0 0 12px rgba(212,175,55,0.5)" }}
              title={pin.label}
            >
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-terroir-espresso text-terroir-cream font-body text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                style={{ border: "1px solid rgba(212,175,55,0.15)" }}>
                {pin.label}
              </span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="stagger-children">
          <span className="fade-up font-body text-[10px] font-medium uppercase tracking-[0.2em] text-terroir-gold">
            OUR FARMS
          </span>
          <h2 className="fade-up font-display text-3xl md:text-5xl font-bold text-terroir-cream mt-4 leading-tight">
            From Mountainside{"\n"}to Your Morning Cup
          </h2>
          <p className="fade-up font-accent text-base md:text-lg text-terroir-sand mt-6 max-w-[480px]">
            We travel to origin. We meet the farmers. We taste hundreds of lots to select the few that earn the TERROIR name. Every bag tells the story of its land, its people, and the craft that brought it to your cup.
          </p>
          <div className="fade-up flex gap-8 md:gap-12 mt-10">
            {[
              { number: "23", label: "Farms" },
              { number: "11", label: "Countries" },
              { number: "100%", label: "Direct Trade" },
            ].map((stat) => (
              <div key={stat.label}>
                <span className="font-display text-3xl md:text-4xl font-bold text-terroir-gold">{stat.number}</span>
                <span className="block font-body text-[10px] uppercase tracking-[0.1em] text-terroir-sand mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
          <button className="fade-up nav-link font-body text-[11px] font-medium uppercase tracking-[0.15em] text-terroir-gold mt-8 inline-block">
            Read Our Origin Stories →
          </button>
        </div>
      </div>
    </section>
  );
}
