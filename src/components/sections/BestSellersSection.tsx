import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useScrollReveal } from "@/hooks/use-scroll";
import { Link } from "react-router-dom";

export default function BestSellersSection() {
  const ref = useScrollReveal();
  const featured = products.slice(0, 4);

  return (
    <section className="py-16 md:py-[120px] max-w-[1440px] mx-auto px-6 md:px-12">
      <div ref={ref} className="stagger-children">
        <span className="fade-up font-body text-[10px] font-medium uppercase tracking-[0.2em] text-terroir-gold">
          — THE COLLECTION
        </span>
        <h2 className="fade-up font-display text-3xl md:text-[52px] font-bold text-terroir-cream mt-4 leading-tight">
          Our Most{"\n"}Celebrated Roasts
        </h2>
        <p className="fade-up font-accent text-base md:text-lg italic text-terroir-sand mt-4">
          Curated by our Head Roastmaster. Loved by 12,000 subscribers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/shop"
          className="nav-link font-body text-[11px] font-medium uppercase tracking-[0.15em] text-terroir-gold"
        >
          View All Products →
        </Link>
      </div>
    </section>
  );
}
