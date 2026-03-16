import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { type Product } from "@/data/products";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const roastDots = Array.from({ length: 5 }, (_, i) => i < product.roastLevel);
  const { isWishlisted, toggleItem } = useWishlist();
  const { addItem } = useCart();
  const wishlisted = isWishlisted(product.id);
  const [animClass, setAnimClass] = useState("");

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (wishlisted) {
      setAnimClass("wishlist-shake");
      toast({ title: "💔 Removed from wishlist", description: product.name });
    } else {
      setAnimClass("wishlist-pop");
      toast({ title: "❤️ Saved to wishlist", description: product.name });
    }
    toggleItem(product);
    setTimeout(() => setAnimClass(""), 400);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card block group"
      style={{
        background: "rgba(44, 31, 20, 0.6)",
        border: "1px solid rgba(212,175,55,0.15)",
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <img
          src={product.image}
          alt={product.name}
          className="card-image w-full h-full object-cover"
        />
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-terroir-gold text-terroir-espresso font-body text-[8px] font-semibold uppercase tracking-[0.1em] px-2.5 py-1">
            {product.badge}
          </span>
        )}
        {/* Wishlist */}
        <button
          className={`absolute top-3 right-3 transition-colors ${animClass} ${
            wishlisted ? "text-terroir-gold" : "text-terroir-cream/60 hover:text-terroir-gold"
          }`}
          onClick={handleWishlistToggle}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={18}
            strokeWidth={1.5}
            fill={wishlisted ? "currentColor" : "none"}
          />
        </button>
        {/* Quick View overlay */}
        <div className="absolute inset-0 bg-terroir-espresso/40 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
          <span className="font-body text-[11px] font-medium uppercase tracking-[0.15em] text-terroir-cream">
            QUICK VIEW
          </span>
        </div>
        {/* Add to Cart reveal */}
        <div className="absolute bottom-0 left-0 right-0 add-to-cart-reveal">
          <button
            className="w-full bg-terroir-gold text-terroir-espresso font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-center py-3 hover:bg-terroir-gold-light transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product, product.grindOptions[0], product.weightOptions[0], 1);
              toast({ title: "✓ Added to cart", description: product.name });
            }}
          >
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 md:p-5">
        <h3 className="font-display text-lg md:text-xl font-semibold text-terroir-cream">
          {product.name}
        </h3>
        <p className="font-body text-[11px] font-normal uppercase tracking-[0.1em] text-terroir-gold mt-1">
          {product.origin} · {product.region.split("·")[0].trim()}
        </p>
        <p className="font-body text-xs text-terroir-text-muted mt-2">
          {product.tastingNotes.join(" · ")}
        </p>

        {/* Roast Level */}
        <div className="flex items-center gap-1.5 mt-3">
          <span className="font-body text-[9px] uppercase tracking-[0.1em] text-terroir-sand mr-1">Roast</span>
          {roastDots.map((filled, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full ${
                filled ? "bg-terroir-gold" : "bg-terroir-gold/20"
              }`}
            />
          ))}
        </div>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-body text-lg font-semibold text-terroir-cream">
            ${product.price.toFixed(2)}
          </span>
          <span className="font-body text-[13px] text-terroir-gold">
            Subscribe: ${product.subscribePrice.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}
