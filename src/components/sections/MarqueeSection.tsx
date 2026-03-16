export default function MarqueeSection() {
  const text = "SINGLE ORIGIN BEANS  ·  ROASTED TO ORDER  ·  SPECIALTY GRADE 86+  ·  SOURCED DIRECT FROM FARMS  ·  WOMEN-LED CO-OPS  ·  CLIMATE POSITIVE  ·  FREE SHIPPING $75+  ·  SUBSCRIBE & SAVE 15%  ·  ";

  return (
    <section
      className="w-full py-4 overflow-hidden"
      style={{
        background: "#2C1F14",
        borderTop: "1px solid rgba(212,175,55,0.15)",
        borderBottom: "1px solid rgba(212,175,55,0.15)",
      }}
    >
      <div className="animate-marquee flex whitespace-nowrap">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-terroir-gold mx-4"
          >
            {text}
          </span>
        ))}
      </div>
    </section>
  );
}
