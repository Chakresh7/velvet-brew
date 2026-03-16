import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, Lock, Leaf, RotateCcw } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { products } from "@/data/products";
import { toast } from "@/hooks/use-toast";

const FREQ_OPTIONS: { value: "2_weeks" | "4_weeks" | "6_weeks" | "8_weeks"; label: string }[] = [
  { value: "2_weeks", label: "2wk" },
  { value: "4_weeks", label: "4wk" },
  { value: "6_weeks", label: "6wk" },
  { value: "8_weeks", label: "8wk" },
];

export default function CartDrawer() {
  const {
    items, isOpen, closeDrawer, removeItem, updateQuantity,
    toggleSubscription, setFrequency, clearCart,
    promoCode, discount, promoError, applyPromo, clearPromo,
    totalItems, subtotal, discountAmount, shipping, total,
    hasNonSubscription, subscribeAll, addItem,
  } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isClosing, setIsClosing] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [promoOpen, setPromoOpen] = useState(false);
  const [undoItem, setUndoItem] = useState<{ item: typeof items[0]; timeout: NodeJS.Timeout } | null>(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => { closeDrawer(); setIsClosing(false); }, 350);
  };

  const handleRemove = (cartItemId: string) => {
    const item = items.find((i) => i.cartItemId === cartItemId);
    setRemovingId(cartItemId);
    setTimeout(() => {
      removeItem(cartItemId);
      setRemovingId(null);
      if (item) {
        if (undoItem) clearTimeout(undoItem.timeout);
        const timeout = setTimeout(() => setUndoItem(null), 5000);
        setUndoItem({ item, timeout });
      }
    }, 400);
  };

  const handleUndo = () => {
    if (!undoItem) return;
    clearTimeout(undoItem.timeout);
    const i = undoItem.item;
    const product = products.find((p) => p.id === i.productId);
    if (product) {
      addItem(product, i.variant.grind, i.variant.weight, i.quantity, i.isSubscription);
    }
    setUndoItem(null);
  };

  const handleExplore = () => {
    handleClose();
    setTimeout(() => navigate("/shop"), 400);
  };

  // Upsell products (those not in cart)
  const cartIds = new Set(items.map((i) => i.productId));
  const upsellProducts = products.filter((p) => !cartIds.has(p.id)).slice(0, 3);

  if (!isOpen && !isClosing) return null;

  const drawerAnimClass = isMobile
    ? isClosing ? "translate-y-full" : "translate-y-0"
    : isClosing ? "translate-x-full" : "translate-x-0";

  const drawerPositionClass = isMobile
    ? "inset-x-0 bottom-0 top-0 w-full"
    : "top-0 right-0 h-full w-[520px] max-w-full";

  const shippingProgress = Math.min((subtotal / 75) * 100, 100);

  return (
    <div className="fixed inset-0 z-[9997]">
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
            <ShoppingBag size={16} className="text-terroir-gold" />
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-terroir-gold">
              YOUR CART
            </span>
            <span className="font-body text-xs font-light text-terroir-cream/60 ml-1">
              ({totalItems} item{totalItems !== 1 ? "s" : ""})
            </span>
          </div>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <>
                <button
                  onClick={clearCart}
                  className="font-body text-[10px] uppercase tracking-[0.1em] text-terroir-gold/50 hover:text-destructive transition-colors"
                >
                  CLEAR CART
                </button>
                <div className="w-px h-4 bg-terroir-gold/20" />
              </>
            )}
            <button
              onClick={handleClose}
              className="font-body text-2xl font-light text-terroir-cream hover:text-terroir-gold transition-colors"
              aria-label="Close cart"
            >
              ×
            </button>
          </div>
        </div>

        {/* Free Shipping Progress */}
        {items.length > 0 && (
          <div
            className="px-8 py-2.5 shrink-0"
            style={{ background: "rgba(44,31,20,0.6)", borderBottom: "1px solid rgba(212,175,55,0.1)" }}
          >
            {subtotal >= 75 ? (
              <span className="font-body text-[11px] font-medium text-terroir-gold flex items-center gap-1.5">
                ✓ FREE SHIPPING UNLOCKED
              </span>
            ) : (
              <span className="font-body text-[11px] text-terroir-cream">
                You're <span className="font-semibold text-terroir-gold">${(75 - subtotal).toFixed(2)}</span> away from{" "}
                <span className="text-terroir-gold">free shipping</span>
              </span>
            )}
            <div className="mt-1.5 h-[3px] w-full rounded-full" style={{ background: "rgba(212,175,55,0.2)" }}>
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${shippingProgress}%`,
                  background: subtotal >= 75
                    ? "linear-gradient(90deg, var(--color-gold), var(--color-gold-light))"
                    : "var(--color-gold)",
                }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <div className="relative">
              <ShoppingBag size={80} className="text-terroir-gold/30" strokeWidth={1} />
              <div className="cart-steam-1" />
              <div className="cart-steam-2" />
            </div>
            <h3 className="font-display text-[28px] italic text-terroir-cream mt-6">Your cup is empty</h3>
            <p className="font-body text-[13px] font-light text-muted-foreground text-center mt-3 leading-relaxed">
              Add a rare origin to begin{"\n"}your ritual.
            </p>
            <button
              onClick={handleExplore}
              className="mt-8 w-full font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-terroir-gold py-4 transition-all hover:bg-terroir-gold/10"
              style={{ border: "1px solid rgba(212,175,55,0.3)" }}
            >
              SHOP THE COLLECTION →
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto wishlist-scrollbar">
              <div className="px-8 py-5 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className={`p-4 transition-all duration-400 ${
                      removingId === item.cartItemId ? "opacity-0 translate-x-[100%]" : "opacity-100 translate-x-0"
                    }`}
                    style={{
                      background: "rgba(44,31,20,0.35)",
                      border: "1px solid rgba(212,175,55,0.1)",
                      borderRadius: 2,
                    }}
                  >
                    <div className="flex gap-3.5">
                      {/* Image */}
                      <Link to={`/product/${item.slug}`} onClick={handleClose} className="shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className={`${isMobile ? "w-[60px] h-[60px]" : "w-[72px] h-[72px]"} object-cover hover:shadow-[0_0_12px_rgba(212,175,55,0.2)] transition-shadow`}
                          style={{ border: "1px solid rgba(212,175,55,0.25)" }}
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/product/${item.slug}`}
                                onClick={handleClose}
                                className="font-display text-[15px] font-medium text-terroir-cream hover:text-terroir-gold transition-colors truncate"
                              >
                                {item.name}
                              </Link>
                              {item.isSubscription && (
                                <span
                                  className="font-body text-[8px] font-semibold uppercase text-terroir-gold px-2 py-0.5 shrink-0"
                                  style={{ background: "rgba(212,175,55,0.15)", border: "1px solid var(--color-gold)" }}
                                >
                                  SUBSCRIBE
                                </span>
                              )}
                            </div>
                            <p className="font-body text-[11px] font-light text-terroir-gold mt-0.5">
                              {item.variant.label}
                              {item.isSubscription && item.frequency && (
                                <span className="text-muted-foreground"> · Every {item.frequency.replace("_", " ")}</span>
                              )}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemove(item.cartItemId)}
                            className="font-body text-lg font-light text-terroir-gold/40 hover:text-destructive transition-colors ml-2 shrink-0"
                            aria-label="Remove item"
                          >
                            ×
                          </button>
                        </div>

                        {/* Subscribe toggle */}
                        <button
                          onClick={() => toggleSubscription(item.cartItemId)}
                          className={`mt-2 flex items-center gap-1.5 font-body text-[11px] transition-colors ${
                            item.isSubscription ? "text-terroir-gold" : "text-muted-foreground"
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 border flex items-center justify-center text-[8px] shrink-0"
                            style={{
                              borderColor: item.isSubscription ? "var(--color-gold)" : "rgba(212,175,55,0.3)",
                              background: item.isSubscription ? "var(--color-gold)" : "transparent",
                              color: item.isSubscription ? "#1A0F0A" : "transparent",
                            }}
                          >
                            ✓
                          </span>
                          Subscribe & Save 15%
                        </button>

                        {/* Frequency selector */}
                        {item.isSubscription && (
                          <div className="flex gap-1.5 mt-2">
                            {FREQ_OPTIONS.map((f) => (
                              <button
                                key={f.value}
                                onClick={() => setFrequency(item.cartItemId, f.value)}
                                className={`font-body text-[10px] uppercase px-2 py-1 transition-all ${
                                  item.frequency === f.value
                                    ? "bg-terroir-gold text-terroir-espresso font-semibold"
                                    : "text-muted-foreground hover:text-terroir-gold"
                                }`}
                                style={item.frequency !== f.value ? { border: "1px solid rgba(212,175,55,0.2)" } : {}}
                              >
                                {f.label}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Price + Quantity */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            {item.isSubscription ? (
                              <>
                                <span className="font-body text-[13px] text-muted-foreground line-through">
                                  ${(item.unitPrice * item.quantity).toFixed(2)}
                                </span>
                                <span className="font-body text-[15px] font-semibold text-terroir-gold">
                                  ${item.subtotal.toFixed(2)}
                                </span>
                                <span
                                  className="font-body text-[8px] font-semibold text-terroir-gold px-2 py-0.5"
                                  style={{ background: "rgba(212,175,55,0.15)" }}
                                >
                                  SAVE ${((item.unitPrice - item.subscribePrice) * item.quantity).toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="font-body text-[15px] font-semibold text-terroir-cream">
                                ${item.subtotal.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Quantity stepper */}
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                item.quantity === 1
                                  ? handleRemove(item.cartItemId)
                                  : updateQuantity(item.cartItemId, item.quantity - 1)
                              }
                              className={`${isMobile ? "w-9 h-9" : "w-7 h-7"} flex items-center justify-center text-terroir-gold hover:bg-terroir-gold hover:text-terroir-espresso transition-all`}
                              style={{ border: "1px solid rgba(212,175,55,0.3)" }}
                            >
                              {item.quantity === 1 ? <Trash2 size={12} /> : "−"}
                            </button>
                            <span className="font-body text-sm font-semibold text-terroir-cream min-w-[32px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className={`${isMobile ? "w-9 h-9" : "w-7 h-7"} flex items-center justify-center text-terroir-gold hover:bg-terroir-gold hover:text-terroir-espresso transition-all`}
                              style={{ border: "1px solid rgba(212,175,55,0.3)" }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upsell strip */}
              {upsellProducts.length > 0 && (
                <div
                  className="px-8 py-3.5"
                  style={{
                    background: "rgba(212,175,55,0.05)",
                    borderTop: "1px solid rgba(212,175,55,0.1)",
                    borderBottom: "1px solid rgba(212,175,55,0.1)",
                  }}
                >
                  <span className="font-body text-[9px] font-medium uppercase tracking-[0.2em] text-terroir-gold">
                    YOU MIGHT ALSO LOVE
                  </span>
                  <div className="flex gap-3 mt-2.5 overflow-x-auto pb-1 wishlist-scrollbar">
                    {upsellProducts.map((p) => (
                      <div key={p.id} className="w-[130px] shrink-0">
                        <img src={p.image} alt={p.name} className="w-[130px] h-[80px] object-cover" style={{ border: "1px solid rgba(212,175,55,0.15)" }} />
                        <p className="font-display text-[13px] text-terroir-cream mt-1.5 truncate">{p.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-body text-xs font-medium text-terroir-gold">${p.price.toFixed(2)}</span>
                          <button
                            onClick={() => {
                              addItem(p, p.grindOptions[0], p.weightOptions[0], 1);
                              toast({ title: "✓ Added to cart", description: p.name });
                            }}
                            className="w-6 h-6 flex items-center justify-center text-terroir-gold hover:bg-terroir-gold hover:text-terroir-espresso transition-all rounded-full text-sm"
                            style={{ border: "1px solid rgba(212,175,55,0.3)" }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Undo bar */}
            {undoItem && (
              <div
                className="px-8 py-3 flex items-center justify-between shrink-0"
                style={{ background: "rgba(44,31,20,0.95)", borderTop: "1px solid rgba(212,175,55,0.2)" }}
              >
                <span className="font-body text-xs text-terroir-cream">{undoItem.item.name} removed</span>
                <button onClick={handleUndo} className="font-body text-xs font-semibold text-terroir-gold underline">UNDO</button>
              </div>
            )}

            {/* Order Summary */}
            <div
              className="shrink-0 px-8 py-5"
              style={{ borderTop: "1px solid rgba(212,175,55,0.2)", background: "#120A06" }}
            >
              {/* Promo code */}
              <div className="mb-4">
                <button
                  onClick={() => setPromoOpen(!promoOpen)}
                  className="font-body text-xs text-terroir-gold underline underline-offset-2 flex items-center gap-1"
                >
                  Have a promo code? <span className={`transition-transform ${promoOpen ? "rotate-180" : ""}`}>▾</span>
                </button>
                {promoOpen && (
                  <div className="flex gap-2 mt-2">
                    <input
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="ENTER CODE"
                      className="flex-1 font-body text-[13px] uppercase bg-terroir-roast px-3 py-2 text-terroir-cream placeholder:text-muted-foreground focus:outline-none transition-colors"
                      style={{
                        border: promoError
                          ? "1px solid hsl(var(--destructive))"
                          : promoCode
                          ? "1px solid #2ecc71"
                          : "1px solid rgba(212,175,55,0.2)",
                      }}
                    />
                    {promoCode ? (
                      <button onClick={clearPromo} className="font-body text-[11px] font-semibold uppercase text-destructive px-3">
                        REMOVE
                      </button>
                    ) : (
                      <button
                        onClick={() => applyPromo(promoInput)}
                        className="font-body text-[11px] font-semibold uppercase text-terroir-gold px-4 py-2 hover:bg-terroir-gold hover:text-terroir-espresso transition-all"
                        style={{ border: "1px solid rgba(212,175,55,0.3)" }}
                      >
                        APPLY
                      </button>
                    )}
                  </div>
                )}
                {promoCode && (
                  <p className="font-body text-[11px] text-terroir-gold mt-1.5">✓ {Math.round(discount * 100)}% discount applied</p>
                )}
                {promoError && (
                  <p className="font-body text-[11px] text-destructive mt-1.5">{promoError}</p>
                )}
              </div>

              {/* Line items */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-body text-xs text-muted-foreground">Subtotal</span>
                  <span className="font-body text-sm text-terroir-cream">${subtotal.toFixed(2)}</span>
                </div>
                {promoCode && (
                  <div className="flex justify-between">
                    <span className="font-body text-xs text-terroir-gold">{promoCode} −{Math.round(discount * 100)}%</span>
                    <span className="font-body text-sm text-terroir-gold">−${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-body text-xs text-muted-foreground">Shipping</span>
                  <span className={`font-body text-sm ${shipping === 0 ? "text-terroir-gold font-medium" : "text-terroir-cream"}`}>
                    {shipping === 0 ? "FREE ✓" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-xs text-muted-foreground">Tax</span>
                  <span className="font-body text-xs text-muted-foreground">Calculated at checkout</span>
                </div>
              </div>

              <div className="my-3 h-px" style={{ background: "rgba(212,175,55,0.15)" }} />

              <div className="flex justify-between items-baseline">
                <span className="font-body text-[13px] font-bold uppercase text-terroir-cream">ORDER TOTAL</span>
                <span className="font-display text-[26px] font-bold text-terroir-cream">${total.toFixed(2)}</span>
              </div>

              {/* Subscribe all toggle */}
              {hasNonSubscription && (
                <button
                  onClick={() => subscribeAll(true)}
                  className="w-full mt-3 flex items-center justify-between p-3 transition-all"
                  style={{
                    background: "rgba(212,175,55,0.08)",
                    border: "1px solid rgba(212,175,55,0.3)",
                    borderRadius: 2,
                  }}
                >
                  <span className="font-body text-xs text-terroir-cream">
                    Switch all to Subscribe & Save{" "}
                    <span className="font-bold text-terroir-gold">15% off every order</span>
                  </span>
                  <span className="font-body text-xs text-terroir-gold">→</span>
                </button>
              )}

              {/* Checkout button */}
              <button
                className={`w-full mt-4 font-body text-xs font-bold uppercase tracking-[0.2em] bg-terroir-gold text-terroir-espresso hover:bg-terroir-gold-light transition-all active:scale-[0.98] ${
                  isMobile ? "h-[60px]" : "h-[54px]"
                }`}
                style={{ boxShadow: "0 0 24px rgba(212,175,55,0.15)" }}
              >
                PROCEED TO CHECKOUT →
              </button>

              {/* Trust row */}
              <div className="flex items-center justify-center gap-1.5 mt-3 flex-wrap">
                {[
                  { icon: Lock, label: "Secure Checkout" },
                  { icon: RotateCcw, label: "30-Day Returns" },
                  { icon: Leaf, label: "Carbon Neutral" },
                ].map(({ icon: Icon, label }, i) => (
                  <span key={label} className="flex items-center gap-1 font-body text-[10px] text-muted-foreground">
                    <Icon size={10} /> {label}
                    {i < 2 && <span className="ml-1">·</span>}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
