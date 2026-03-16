import { useState } from "react";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useScrollProgress } from "@/hooks/use-scroll";

const categories = ["All", "Coffee", "Tea"];
const roasts = ["All", "Light", "Medium", "Dark"];

export default function ShopPage() {
  useScrollProgress();
  const [category, setCategory] = useState("All");
  const [roast, setRoast] = useState("All");

  const filtered = products.filter((p) => {
    if (category !== "All" && p.category !== category.toLowerCase()) return false;
    if (roast !== "All") {
      const roastMap: Record<string, number[]> = {
        Light: [1, 2],
        Medium: [3],
        Dark: [4, 5],
      };
      if (!roastMap[roast]?.includes(p.roastLevel)) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-terroir-espresso">
      <div id="scroll-progress" className="scroll-progress" />
      <Header />
      <main className="pt-32 pb-20 max-w-[1440px] mx-auto px-6 md:px-12">
        <span className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-terroir-gold">
          — THE COLLECTION
        </span>
        <h1 className="font-display text-4xl md:text-6xl font-bold text-terroir-cream mt-4">
          Shop All
        </h1>
        <p className="font-accent text-lg italic text-terroir-sand mt-3">
          Rare coffees and exceptional teas, roasted to order.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-6 mt-10" style={{ borderBottom: "1px solid rgba(212,175,55,0.15)", paddingBottom: "16px" }}>
          <div className="flex items-center gap-3">
            <span className="font-body text-[10px] uppercase tracking-[0.15em] text-terroir-sand">Type:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`font-body text-[11px] uppercase tracking-[0.1em] px-3 py-1.5 transition-all ${
                  category === c
                    ? "bg-terroir-gold text-terroir-espresso"
                    : "text-terroir-sand hover:text-terroir-gold"
                }`}
                style={category !== c ? { border: "1px solid rgba(212,175,55,0.15)" } : {}}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-body text-[10px] uppercase tracking-[0.15em] text-terroir-sand">Roast:</span>
            {roasts.map((r) => (
              <button
                key={r}
                onClick={() => setRoast(r)}
                className={`font-body text-[11px] uppercase tracking-[0.1em] px-3 py-1.5 transition-all ${
                  roast === r
                    ? "bg-terroir-gold text-terroir-espresso"
                    : "text-terroir-sand hover:text-terroir-gold"
                }`}
                style={roast !== r ? { border: "1px solid rgba(212,175,55,0.15)" } : {}}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center font-body text-terroir-sand mt-20">No products match your filters.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
