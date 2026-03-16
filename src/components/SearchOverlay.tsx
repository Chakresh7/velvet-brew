import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { products, type Product } from "@/data/products";

const TRENDING = [
  "Ethiopia Yirgacheffe",
  "Pour Over",
  "Subscription",
  "Limited Editions",
  "Gift Sets",
  "Dark Roast",
];

const BROWSE_CATEGORIES = [
  { label: "BY ORIGIN", emoji: "🌍", param: "origin" },
  { label: "BY ROAST", emoji: "☕", param: "roast" },
  { label: "BY FLAVOR", emoji: "🍫", param: "profile" },
];

const STORAGE_KEY = "terroir_recent_searches";

function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]").slice(0, 5);
  } catch {
    return [];
  }
}

function saveSearch(term: string) {
  const recent = getRecentSearches().filter((s) => s !== term);
  recent.unshift(term);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent.slice(0, 5)));
}

function clearRecentSearches() {
  localStorage.removeItem(STORAGE_KEY);
}

function scoreProduct(product: Product, query: string): number {
  const q = query.toLowerCase();
  if (product.name.toLowerCase() === q) return 100;
  if (product.name.toLowerCase().includes(q)) return 80;
  if (product.origin.toLowerCase().includes(q)) return 60;
  if (product.region.toLowerCase().includes(q)) return 55;
  if (product.tastingNotes.some((n) => n.toLowerCase().includes(q))) return 40;
  if (product.category.toLowerCase().includes(q)) return 30;
  const roastMap: Record<string, number[]> = {
    light: [1, 2],
    medium: [3],
    dark: [4, 5],
    espresso: [2, 3],
  };
  if (roastMap[q]?.includes(product.roastLevel)) return 25;
  return 0;
}

function getQuickLinks(query: string) {
  const q = query.toLowerCase();
  if (q.includes("ethiopia") || q.includes("africa")) {
    return [
      { label: "All Ethiopian Coffees", href: "/shop?origin=ethiopia" },
      { label: "Light Roasts from Africa", href: "/shop?roast=light" },
      { label: "Our Ethiopia Farm Story", href: "/story" },
    ];
  }
  if (q.includes("gift")) {
    return [
      { label: "Gift Sets & Bundles", href: "/shop" },
      { label: "Custom Engraving", href: "/shop" },
      { label: "Gift Subscriptions", href: "/subscriptions" },
    ];
  }
  return [];
}

const DEFAULT_LINKS = [
  { label: "New Arrivals", href: "/shop" },
  { label: "Best Sellers", href: "/shop" },
  { label: "The Cupping Quiz", href: "/quiz" },
  { label: "Subscribe & Save", href: "/subscriptions" },
];

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [animateIn, setAnimateIn] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Animate in
  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches());
      setQuery("");
      setDebouncedQuery("");
      setSelectedIndex(-1);
      requestAnimationFrame(() => setAnimateIn(true));
      document.body.style.overflow = "hidden";
    } else {
      setAnimateIn(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Autofocus
  useEffect(() => {
    if (open && animateIn) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, animateIn]);

  // Debounce
  useEffect(() => {
    if (!query.trim()) {
      setDebouncedQuery("");
      setIsDebouncing(false);
      return;
    }
    setIsDebouncing(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsDebouncing(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // ESC key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Search results
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return products
      .map((p) => ({ product: p, score: scoreProduct(p, debouncedQuery) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.product);
  }, [debouncedQuery]);

  const quickLinks = useMemo(() => {
    const contextual = debouncedQuery ? getQuickLinks(debouncedQuery) : [];
    return [...contextual, ...DEFAULT_LINKS];
  }, [debouncedQuery]);

  const bestSellers = useMemo(
    () => products.filter((p) => p.badge === "BEST SELLER").slice(0, 3),
    []
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (results.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        const product = results[selectedIndex];
        saveSearch(query.trim());
        onClose();
        navigate(`/product/${product.id}`);
      }
    },
    [results, selectedIndex, query, onClose, navigate]
  );

  const handleProductClick = (product: Product) => {
    saveSearch(query.trim());
    onClose();
    navigate(`/product/${product.id}`);
  };

  const handlePillClick = (term: string) => {
    setQuery(term);
    setDebouncedQuery(term);
    saveSearch(term);
    setRecentSearches(getRecentSearches());
  };

  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const handleBrowseClick = (param: string) => {
    onClose();
    navigate(`/shop`);
  };

  const handleQuickLinkClick = (href: string) => {
    if (query.trim()) saveSearch(query.trim());
    onClose();
    navigate(href);
  };

  if (!open) return null;

  const hasQuery = debouncedQuery.trim().length > 0;
  const noResults = hasQuery && results.length === 0;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{
        background: "rgba(15, 8, 4, 0.97)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        opacity: animateIn ? 1 : 0,
        transform: animateIn ? "translateY(0)" : "translateY(-16px)",
        transition: "opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 md:top-8 md:right-12 font-body text-[11px] font-medium uppercase tracking-[0.15em] hover:opacity-60 transition-opacity z-10"
        style={{ color: "var(--color-gold)" }}
      >
        CLOSE ×
      </button>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="pt-[12vh] md:pt-[15vh] px-6 md:px-12 max-w-[720px] mx-auto w-full">
          {/* Eyebrow */}
          <span
            className="font-body text-[9px] font-medium uppercase tracking-[0.3em] block mb-4"
            style={{
              color: "var(--color-gold)",
              opacity: animateIn ? 1 : 0,
              transform: animateIn ? "translateY(0)" : "translateY(-8px)",
              transition: "opacity 0.3s 0.2s ease, transform 0.3s 0.2s ease",
            }}
          >
            SEARCH THE COLLECTION
          </span>

          {/* Input */}
          <div
            className="relative"
            style={{
              opacity: animateIn ? 1 : 0,
              transform: animateIn ? "translateY(0)" : "translateY(-12px)",
              transition: "opacity 0.4s 0.15s ease, transform 0.4s 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ethiopia, chocolate, pour over…"
              className="w-full bg-transparent border-0 border-b-2 outline-none font-display italic text-[28px] md:text-[42px] pb-3"
              style={{
                borderBottomColor: "var(--color-gold)",
                color: "var(--color-cream)",
                caretColor: "var(--color-gold)",
              }}
            />
            {/* Focus underline animation */}
            <div
              className="absolute bottom-0 left-1/2 h-[2px] transition-transform duration-300 ease-out"
              style={{
                background: "var(--color-gold-light)",
                width: "100%",
                transform: `translateX(-50%) scaleX(${query ? 1 : 0})`,
                transformOrigin: "center",
              }}
            />
            {/* Debounce pulsing line */}
            {isDebouncing && (
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{
                  background: "var(--color-gold)",
                  animation: "search-pulse 0.8s ease-in-out infinite",
                }}
              />
            )}
          </div>

          {/* DEFAULT STATE */}
          {!hasQuery && !noResults && (
            <div
              style={{
                opacity: animateIn ? 1 : 0,
                transition: "opacity 0.3s 0.35s ease",
              }}
            >
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="font-body text-[9px] font-medium uppercase tracking-[0.3em]"
                      style={{ color: "var(--color-gold)" }}
                    >
                      RECENT SEARCHES
                    </span>
                    <button
                      onClick={handleClearRecent}
                      className="font-body text-[11px] hover:opacity-70 transition-opacity"
                      style={{ color: "var(--color-gold)", opacity: 0.6 }}
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handlePillClick(term)}
                        className="font-body text-[12px] px-4 py-1.5 transition-all duration-200 hover:border-terroir-gold hover:text-terroir-gold"
                        style={{
                          border: "1px solid rgba(212,175,55,0.3)",
                          color: "var(--color-cream)",
                        }}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending */}
              <div className="mt-8">
                <span
                  className="font-body text-[9px] font-medium uppercase tracking-[0.3em] block mb-3"
                  style={{ color: "var(--color-gold)" }}
                >
                  TRENDING NOW
                </span>
                <div className="flex flex-wrap gap-2">
                  {TRENDING.map((term) => (
                    <button
                      key={term}
                      onClick={() => handlePillClick(term)}
                      className="font-body text-[12px] px-4 py-1.5 transition-all duration-200 hover:border-terroir-gold hover:text-terroir-gold"
                      style={{
                        border: "1px solid rgba(212,175,55,0.3)",
                        color: "var(--color-cream)",
                      }}
                    >
                      <span className="mr-1.5 text-[10px]">↗</span>
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse By */}
              <div className="mt-10">
                <span
                  className="font-body text-[9px] font-medium uppercase tracking-[0.3em] block mb-4"
                  style={{ color: "var(--color-gold)" }}
                >
                  BROWSE BY
                </span>
                <div className="grid grid-cols-3 gap-3 max-w-[600px]">
                  {BROWSE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => handleBrowseClick(cat.param)}
                      className="py-4 px-3 font-body text-[12px] font-semibold uppercase tracking-[0.1em] transition-all duration-200 hover:bg-terroir-gold hover:text-terroir-espresso"
                      style={{
                        border: "1px solid rgba(212,175,55,0.3)",
                        color: "var(--color-gold)",
                        background: "rgba(44,31,20,0.6)",
                      }}
                    >
                      <span className="block text-lg mb-1">{cat.emoji}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* RESULTS STATE */}
          {hasQuery && !noResults && (
            <div
              ref={resultsRef}
              className="mt-8 flex flex-col md:flex-row gap-8"
              style={{
                opacity: 1,
                animation: "search-results-in 0.25s ease",
              }}
            >
              {/* Left: Products */}
              <div className="flex-1 md:w-[65%]">
                <div className="flex items-baseline gap-2 mb-4">
                  <span
                    className="font-body text-[9px] font-medium uppercase tracking-[0.3em]"
                    style={{ color: "var(--color-gold)" }}
                  >
                    PRODUCTS
                  </span>
                  <span className="font-body text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                    ({results.length} result{results.length !== 1 ? "s" : ""})
                  </span>
                </div>
                <div className="space-y-1">
                  {results.map((product, i) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="w-full flex items-center gap-4 py-3 px-3 text-left transition-all duration-200 group"
                      style={{
                        animation: `search-row-in 0.25s ease ${i * 40}ms both`,
                        borderLeft: selectedIndex === i ? "2px solid var(--color-gold)" : "2px solid transparent",
                        background: selectedIndex === i ? "rgba(212,175,55,0.06)" : "transparent",
                        transform: selectedIndex === i ? "translateX(4px)" : "translateX(0)",
                      }}
                      onMouseEnter={() => setSelectedIndex(i)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover flex-shrink-0 transition-all duration-200 group-hover:border-2"
                        style={{ borderColor: "var(--color-gold)" }}
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-display font-medium text-lg truncate"
                          style={{ color: "var(--color-cream)" }}
                        >
                          {product.name}
                        </div>
                        <div
                          className="font-body text-[11px] font-normal uppercase tracking-[0.1em]"
                          style={{ color: "var(--color-gold)" }}
                        >
                          {product.origin} · {product.region.split("·")[0].trim()}
                        </div>
                        <div
                          className="font-body text-[11px] font-light mt-0.5"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {product.tastingNotes.join(" · ")}
                        </div>
                      </div>
                      <div
                        className="font-body text-sm font-semibold flex-shrink-0"
                        style={{ color: "var(--color-cream)" }}
                      >
                        ${product.price}.00
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Quick Links (desktop) / horizontal pills (mobile) */}
              <div
                className="md:w-[35%] md:pl-8 md:border-l"
                style={{ borderColor: "rgba(212,175,55,0.2)" }}
              >
                <span
                  className="font-body text-[9px] font-medium uppercase tracking-[0.3em] block mb-4"
                  style={{ color: "var(--color-gold)" }}
                >
                  QUICK LINKS
                </span>
                <div className="flex flex-row md:flex-col gap-2 md:gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                  {quickLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => handleQuickLinkClick(link.href)}
                      className="font-body text-[13px] font-medium text-left whitespace-nowrap py-2 group transition-colors duration-200 hover:text-terroir-gold flex-shrink-0"
                      style={{ color: "var(--color-cream)" }}
                    >
                      {link.label}{" "}
                      <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NO RESULTS */}
          {noResults && (
            <div
              className="mt-16 flex flex-col items-center text-center"
              style={{ animation: "search-results-in 0.25s ease" }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                className="mb-6"
              >
                <path
                  d="M24 4C14 4 8 12 8 20c0 4 1.5 7 4 9l-2 11h28l-2-11c2.5-2 4-5 4-9 0-8-6-16-16-16z"
                  stroke="var(--color-gold)"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path d="M18 20c0 0 2 4 6 4s6-4 6-4" stroke="var(--color-gold)" strokeWidth="1.5" fill="none" />
              </svg>
              <h3
                className="font-display italic text-2xl md:text-[32px]"
                style={{ color: "var(--color-cream)" }}
              >
                No origins found for '{debouncedQuery}'
              </h3>
              <p
                className="font-body text-sm font-light mt-3"
                style={{ color: "var(--color-text-muted)" }}
              >
                Try searching for a flavor, country, or roast level
              </p>

              {/* Bestseller fallback */}
              <div className="mt-10 w-full max-w-[600px]">
                <span
                  className="font-body text-[9px] font-medium uppercase tracking-[0.3em] block mb-4"
                  style={{ color: "var(--color-gold)" }}
                >
                  YOU MIGHT ENJOY
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {bestSellers.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="p-3 text-left transition-all duration-200 hover:bg-terroir-roast group"
                      style={{ border: "1px solid rgba(212,175,55,0.15)" }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full aspect-square object-cover mb-2"
                      />
                      <div className="font-display text-sm" style={{ color: "var(--color-cream)" }}>
                        {product.name}
                      </div>
                      <div
                        className="font-body text-[10px] uppercase tracking-wider mt-1"
                        style={{ color: "var(--color-gold)" }}
                      >
                        {product.origin}
                      </div>
                      <div className="font-body text-xs font-semibold mt-1" style={{ color: "var(--color-cream)" }}>
                        ${product.price}.00
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
