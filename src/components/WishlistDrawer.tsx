import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, X } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";

export default function WishlistDrawer() {
  const { items, isOpen, closeDrawer, removeItem, clearAll } = useWishlist();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});
  const [isClosing, setIsClosing] = useState(false);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeDrawer();
      setIsClosing(false);
    }, 350);
  };

  const handleRemove = (id: string, name: string) => {
    setRemovingId(id);
    setTimeout(() => {
      removeItem(id);
      setRemovingId(null);
      toast({ title: "💔 Removed from wishlist", description: name });
    }, 350);
  };

  const handleAddToCart = (id: string) => {
    setAddedToCart((prev) => ({ ...prev, [id]: true }));
    toast({ title: "✓ Added to cart" });
    setTimeout(() => {
      setAddedToCart((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const handleAddAllToCart = () => {
    toast({ title: "✓ All items added to cart", description: `${items.length} items` });
  };

  const handleExplore = () => {
    handleClose();
    setTimeout(() => navigate("/shop"), 400);
  };

  if (!isOpen && !isClosing) return null;

  const drawerAnimClass = isMobile
    ? isClosing ? "translate-y-full" : "translate-y-0"
    : isClosing ? "translate-x-full" : "translate-x-0";

  const drawerPositionClass = isMobile
    ? "inset-x-0 bottom-0 top-0 w-full"
    : "top-0 right-0 h-full w-[480px] max-w-full";

  return (
    <div className="fixed inset-0 z-[9998]">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-100"}`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`fixed ${drawerPositionClass} flex flex-col transition-transform duration-[450ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${drawerAnimClass}`}
        style={{
          background: "#120A06",
          borderLeft: isMobile ? "none" : "1px solid rgba(212,175,55,0.2)",
          borderTop: isMobile ? "1px solid rgba(212,175,55,0.2)" : "none",
          boxShadow: "-24px 0 80px rgba(0,0,0,0.7)",
        }}
      >
        {/* Mobile handle */}
        {isMobile && (
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-terroir-gold/30" />
          </div>
        )}

        {/* Header */}
        <div
          className="flex items-center justify-between px-8 shrink-0"
          style={{ height: 72, borderBottom: "1px solid rgba(212,175,55,0.15)" }}
        >
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-terroir-gold" fill="currentColor" />
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-terroir-gold">
              WISHLIST
            </span>
            <span className="font-body text-xs font-light text-terroir-cream/60 ml-1">
              ({items.length} saved)
            </span>
          </div>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <>
                <button
                  onClick={clearAll}
                  className="font-body text-[10px] uppercase tracking-[0.1em] text-terroir-gold/50 hover:text-destructive transition-colors"
                >
                  CLEAR ALL
                </button>
                <div className="w-px h-4 bg-terroir-gold/20" />
              </>
            )}
            <button
              onClick={handleClose}
              className="font-body text-2xl font-light text-terroir-cream hover:text-terroir-gold transition-colors"
              aria-label="Close wishlist"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <Heart size={80} className="text-terroir-gold/30 wishlist-empty-pulse" strokeWidth={1} />
            <h3 className="font-display text-[28px] italic text-terroir-cream mt-6">
              Your wishlist awaits
            </h3>
            <p className="font-body text-[13px] font-light text-muted-foreground text-center mt-3 leading-relaxed">
              Save your favorite origins and{"\n"}we'll let you know when they're running low.
            </p>
            <button
              onClick={handleExplore}
              className="mt-8 w-full font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-terroir-gold py-4 transition-all hover:bg-terroir-gold/10"
              style={{ border: "1px solid rgba(212,175,55,0.3)" }}
            >
              EXPLORE THE COLLECTION →
            </button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5 wishlist-scrollbar">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`grid gap-4 p-4 transition-all duration-300 ${
                    removingId === item.id
                      ? "opacity-0 translate-x-[120%]"
                      : "opacity-100 translate-x-0"
                  }`}
                  style={{
                    gridTemplateColumns: isMobile ? "64px 1fr auto" : "80px 1fr auto",
                    background: "rgba(44, 31, 20, 0.4)",
                    border: "1px solid rgba(212,175,55,0.12)",
                    borderRadius: 2,
                  }}
                >
                  {/* Image */}
                  <Link to={`/product/${item.id}`} onClick={handleClose}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`${isMobile ? "w-16 h-16" : "w-20 h-20"} object-cover hover:shadow-[0_0_12px_rgba(212,175,55,0.2)] transition-shadow`}
                      style={{ border: "1px solid rgba(212,175,55,0.2)" }}
                    />
                  </Link>

                  {/* Info */}
                  <div className="min-w-0 flex flex-col">
                    {item.badge && (
                      <span className="inline-block self-start font-body text-[8px] font-semibold uppercase bg-terroir-gold text-terroir-espresso px-2 py-0.5 mb-1.5">
                        {item.badge}
                      </span>
                    )}
                    <Link
                      to={`/product/${item.id}`}
                      onClick={handleClose}
                      className="font-display text-base font-medium text-terroir-cream hover:text-terroir-gold transition-colors leading-tight truncate"
                    >
                      {item.name}
                    </Link>
                    <span className="font-body text-[10px] font-normal uppercase tracking-[0.1em] text-terroir-gold mt-1">
                      {item.origin}
                    </span>
                    <span className="font-body text-[11px] font-light text-muted-foreground mt-0.5 truncate">
                      {item.flavor_notes.join(" · ")}
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-body text-base font-semibold text-terroir-cream">
                        ${item.price.toFixed(2)}
                      </span>
                      <span className="font-body text-xs text-terroir-gold">
                        Subscribe: ${item.subscribe_price.toFixed(2)}/mo
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemove(item.id, item.name)}
                      className="font-body text-lg font-light text-terroir-gold/40 hover:text-destructive transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      ×
                    </button>
                    <button
                      onClick={() => handleAddToCart(item.id)}
                      className="font-body text-[9px] font-semibold uppercase tracking-[0.15em] px-3 py-2 transition-all whitespace-nowrap"
                      style={{
                        background: addedToCart[item.id] ? "#2ecc71" : "var(--color-gold)",
                        color: "#1A0F0A",
                      }}
                    >
                      {addedToCart[item.id] ? "ADDED ✓" : "ADD TO CART"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              className="shrink-0 px-8 py-6"
              style={{ borderTop: "1px solid rgba(212,175,55,0.15)", background: "#120A06" }}
            >
              <button
                onClick={handleAddAllToCart}
                className={`w-full font-body text-[11px] font-semibold uppercase tracking-[0.15em] bg-terroir-gold text-terroir-espresso hover:bg-terroir-gold-light transition-all ${
                  isMobile ? "h-14" : "py-4"
                }`}
                style={{ boxShadow: "0 0 24px rgba(212,175,55,0.15)" }}
              >
                ADD ALL TO CART
              </button>
              <p className="font-body text-[11px] font-light text-muted-foreground text-center mt-3">
                Items saved for 30 days · Free shipping over $75
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
