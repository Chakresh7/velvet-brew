import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, Lock, Leaf, RotateCcw } from "lucide-react";
import { useScrollProgress } from "@/hooks/use-scroll";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

export default function ProductDetailPage() {
  useScrollProgress();
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [selectedGrind, setSelectedGrind] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [subscribeMode, setSubscribeMode] = useState(false);
  const { isWishlisted, toggleItem } = useWishlist();
  const [heartAnim, setHeartAnim] = useState("");

  if (!product) {
    return (
      <div className="min-h-screen bg-terroir-espresso flex items-center justify-center">
        <Header />
        <p className="font-body text-terroir-sand">Product not found.</p>
      </div>
    );
  }

  const related = products.filter((p) => p.id !== product.id).slice(0, 4);
  const images = [product.image, product.image, product.image, product.image];

  const renderDots = (filled: number, total: number = 5) => (
    <div className="flex gap-1">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`w-3 h-3 rounded-full ${i < filled ? "bg-terroir-gold" : "bg-terroir-gold/20"}`} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-terroir-espresso">
      <div id="scroll-progress" className="scroll-progress" />
      <Header />
      <main className="pt-28 pb-20 max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Breadcrumb */}
        <nav className="font-body text-[10px] uppercase tracking-[0.1em] text-terroir-gold mb-8">
          <Link to="/shop" className="hover:text-terroir-gold-light">SHOP</Link>
          <span className="mx-2 text-terroir-text-muted">/</span>
          <span className="text-terroir-sand">{product.origin}</span>
          <span className="mx-2 text-terroir-text-muted">/</span>
          <span className="text-terroir-sand">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 lg:gap-12">
          {/* Gallery */}
          <div>
            <div className="overflow-hidden cursor-zoom-in group" style={{ aspectRatio: "4/3" }}>
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="grid grid-cols-4 gap-3 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className="overflow-hidden transition-all"
                  style={{
                    aspectRatio: "1",
                    border: activeImage === i ? "2px solid #D4AF37" : "1px solid rgba(212,175,55,0.15)",
                  }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details - Sticky */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {product.badge && (
                <span className="font-body text-[9px] font-medium uppercase tracking-[0.1em] text-terroir-gold px-3 py-1"
                  style={{ border: "1px solid rgba(212,175,55,0.3)" }}>
                  {product.badge}
                </span>
              )}
              <span className="font-body text-[9px] font-medium uppercase tracking-[0.1em] text-terroir-gold px-3 py-1"
                style={{ border: "1px solid rgba(212,175,55,0.3)" }}>
                DIRECT TRADE
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-[40px] font-bold text-terroir-cream leading-tight">
              {product.name}
            </h1>
            <p className="font-body text-xs font-medium uppercase tracking-[0.1em] text-terroir-gold mt-2">
              {product.origin} · {product.region}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-terroir-gold text-sm">★ ★ ★ ★ ★</span>
              <span className="font-body text-sm text-terroir-sand">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mt-5">
              <span className="font-body text-3xl font-semibold text-terroir-cream">
                ${subscribeMode ? product.subscribePrice.toFixed(2) : product.price.toFixed(2)}
              </span>
              {!subscribeMode && (
                <span className="font-body text-sm text-terroir-gold ml-3">
                  Subscribe: ${product.subscribePrice.toFixed(2)}/mo
                </span>
              )}
            </div>

            {/* Tasting Notes */}
            <div className="mt-6" style={{ borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: "16px" }}>
              <span className="font-body text-[10px] font-medium uppercase tracking-[0.15em] text-terroir-gold">
                TASTING NOTES
              </span>
              <div className="flex flex-wrap gap-2 mt-3">
                {product.tastingNotes.map((note) => (
                  <span
                    key={note}
                    className="font-body text-xs text-terroir-gold px-3 py-1.5"
                    style={{ border: "1px solid rgba(212,175,55,0.3)" }}
                  >
                    {note}
                  </span>
                ))}
              </div>

              {/* Attribute sliders */}
              <div className="space-y-3 mt-5">
                {[
                  { label: "Acidity", value: product.acidity },
                  { label: "Body", value: product.body },
                  { label: "Sweetness", value: product.sweetness },
                ].map((attr) => (
                  <div key={attr.label} className="flex items-center gap-3">
                    <span className="font-body text-[10px] uppercase tracking-[0.1em] text-terroir-sand w-20">{attr.label}</span>
                    {renderDots(attr.value)}
                  </div>
                ))}
              </div>
            </div>

            {/* Roast Level bar */}
            <div className="mt-5">
              <span className="font-body text-[10px] font-medium uppercase tracking-[0.15em] text-terroir-gold">ROAST LEVEL</span>
              <div className="relative mt-2 h-2 w-full" style={{ background: "linear-gradient(to right, #E8CC6A, #3D2314)" }}>
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-terroir-cream border-2 border-terroir-gold"
                  style={{ left: `${((product.roastLevel - 1) / 4) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-body text-[8px] text-terroir-sand">Light</span>
                <span className="font-body text-[8px] text-terroir-sand">Dark</span>
              </div>
            </div>

            {/* Grind Selector */}
            <div className="mt-6">
              <span className="font-body text-[10px] font-medium uppercase tracking-[0.15em] text-terroir-gold">GRIND</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.grindOptions.map((g, i) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGrind(i)}
                    className={`font-body text-[11px] uppercase tracking-[0.05em] px-4 py-2 transition-all ${
                      selectedGrind === i
                        ? "bg-terroir-gold text-terroir-espresso"
                        : "text-terroir-sand hover:text-terroir-gold"
                    }`}
                    style={selectedGrind !== i ? { border: "1px solid rgba(212,175,55,0.15)" } : {}}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Weight Selector */}
            <div className="mt-4">
              <span className="font-body text-[10px] font-medium uppercase tracking-[0.15em] text-terroir-gold">WEIGHT</span>
              <div className="flex gap-2 mt-2">
                {product.weightOptions.map((w, i) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(i)}
                    className={`font-body text-[11px] uppercase tracking-[0.05em] px-4 py-2 transition-all ${
                      selectedWeight === i
                        ? "bg-terroir-gold text-terroir-espresso"
                        : "text-terroir-sand hover:text-terroir-gold"
                    }`}
                    style={selectedWeight !== i ? { border: "1px solid rgba(212,175,55,0.15)" } : {}}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center" style={{ border: "1px solid rgba(212,175,55,0.15)" }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 font-body text-terroir-sand hover:text-terroir-gold transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 font-body text-sm text-terroir-cream">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 font-body text-terroir-sand hover:text-terroir-gold transition-colors"
                >
                  +
                </button>
              </div>
              <Button
                variant="hero"
                size="xl"
                className="flex-1"
                onClick={() => {
                  const grind = product.grindOptions[selectedGrind];
                  const weight = product.weightOptions[selectedWeight];
                  addToCart(product, grind, weight, quantity, subscribeMode);
                  toast({ title: "✓ Added to cart", description: `${product.name} · ${weight} · ${grind}` });
                }}
              >
                ADD TO CART
              </Button>
              <button
                className={`p-3 transition-colors ${heartAnim} ${
                  product && isWishlisted(product.id) ? "text-terroir-gold" : "text-terroir-sand hover:text-terroir-gold"
                }`}
                style={{ border: "1px solid rgba(212,175,55,0.15)" }}
                onClick={() => {
                  if (!product) return;
                  if (isWishlisted(product.id)) {
                    setHeartAnim("wishlist-shake");
                    toast({ title: "💔 Removed from wishlist", description: product.name });
                  } else {
                    setHeartAnim("wishlist-pop");
                    toast({ title: "❤️ Saved to wishlist", description: product.name });
                  }
                  toggleItem(product);
                  setTimeout(() => setHeartAnim(""), 400);
                }}
              >
                <Heart size={18} fill={product && isWishlisted(product.id) ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Subscribe toggle */}
            <button
              onClick={() => setSubscribeMode(!subscribeMode)}
              className={`w-full mt-3 font-body text-[11px] uppercase tracking-[0.1em] py-3 transition-all ${
                subscribeMode
                  ? "bg-terroir-gold/10 text-terroir-gold border border-terroir-gold"
                  : "text-terroir-sand border border-terroir-gold/15"
              }`}
            >
              {subscribeMode ? "✓ SUBSCRIPTION MODE — SAVE 15%" : "SUBSCRIBE & SAVE 15%"}
            </button>

            {/* Trust row */}
            <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
              {[
                { icon: Lock, label: "Secure Checkout" },
                { icon: Leaf, label: "Carbon Neutral" },
                { icon: RotateCcw, label: "30-Day Returns" },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 font-body text-[10px] text-terroir-text-muted">
                  <Icon size={12} /> {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Origin Story */}
        <section className="mt-20 pt-16" style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}>
          <span className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-terroir-gold">ORIGIN STORY</span>
          <h2 className="font-display text-3xl font-bold text-terroir-cream mt-4">{product.origin} · {product.region}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <p className="font-accent text-lg text-terroir-sand leading-relaxed">{product.description}</p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { label: "Elevation", value: product.elevation },
                  { label: "Process", value: product.process },
                  { label: "Harvest", value: product.harvest },
                  { label: "Producer", value: product.farmer },
                ].map((d) => (
                  <div key={d.label}>
                    <span className="font-body text-[9px] uppercase tracking-[0.15em] text-terroir-gold">{d.label}</span>
                    <p className="font-body text-sm text-terroir-cream mt-1">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img src={product.image} alt={`${product.name} origin`} className="w-full h-auto object-cover" style={{ aspectRatio: "4/3" }} />
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="mt-20 pt-16" style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}>
          <span className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-terroir-gold">COMPLETE THE RITUAL</span>
          <h2 className="font-display text-3xl font-bold text-terroir-cream mt-4">You May Also Love</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
