import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import SearchOverlay from "./SearchOverlay";
import { useWishlist } from "@/contexts/WishlistContext";

const navLinks = [
  { label: "SHOP", href: "/shop" },
  { label: "ORIGINS", href: "/origins" },
  { label: "SUBSCRIPTIONS", href: "/subscriptions" },
  { label: "GIFTS", href: "/gifts" },
  { label: "OUR STORY", href: "/story" },
  { label: "THE QUIZ", href: "/quiz" },
];

const megaMenuData = {
  byOrigin: ["Ethiopia", "Colombia", "Japan", "India", "Kenya", "Guatemala", "Panama", "Indonesia"],
  byRoast: ["Light", "Medium", "Dark", "Espresso"],
  byProfile: ["Floral", "Fruity", "Chocolatey", "Earthy", "Nutty"],
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const handleCloseSearch = useCallback(() => setSearchOpen(false), []);
  const { items, openDrawer, justAdded } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[rgba(26,15,10,0.92)] backdrop-blur-[20px]"
            : "bg-transparent"
        }`}
        style={{ borderBottom: scrolled ? "1px solid rgba(212,175,55,0.15)" : "none" }}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span className="font-display text-xl md:text-2xl font-bold tracking-[0.08em] text-terroir-gold">
              TERROIR
            </span>
            <span className="font-body text-[8px] font-light uppercase tracking-[0.15em] text-terroir-sand hidden md:block">
              EST. MMXVI · RARE ORIGINS
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.label}
                onMouseEnter={() => link.label === "SHOP" && setMegaOpen(true)}
                onMouseLeave={() => link.label === "SHOP" && setMegaOpen(false)}
              >
                <Link
                  to={link.href}
                  className="nav-link font-body text-[11px] font-medium uppercase tracking-[0.15em] text-terroir-cream transition-colors hover:text-terroir-gold"
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-5">
            <button className="text-terroir-cream hover:text-terroir-gold transition-colors" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button
              className={`text-terroir-cream hover:text-terroir-gold transition-colors hidden md:block relative ${justAdded ? "wishlist-heart-pulse" : ""}`}
              aria-label="Wishlist"
              onClick={openDrawer}
            >
              <Heart
                size={18}
                strokeWidth={1.5}
                className={items.length > 0 ? "text-terroir-gold" : ""}
                fill={items.length > 0 ? "currentColor" : "none"}
              />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-terroir-gold text-terroir-espresso text-[9px] font-body font-semibold flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
            <button className="text-terroir-cream hover:text-terroir-gold transition-colors relative" aria-label="Cart">
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-terroir-gold text-terroir-espresso text-[9px] font-body font-semibold flex items-center justify-center">
                2
              </span>
            </button>
            <button
              className="lg:hidden text-terroir-cream hover:text-terroir-gold transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Mega Menu */}
        <div
          className={`absolute top-full left-0 right-0 bg-terroir-espresso transition-all duration-350 overflow-hidden ${
            megaOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}
          onMouseEnter={() => setMegaOpen(true)}
          onMouseLeave={() => setMegaOpen(false)}
        >
          <div className="max-w-[1440px] mx-auto px-12 py-10 grid grid-cols-4 gap-8">
            <div>
              <h4 className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-terroir-gold mb-4">By Origin</h4>
              <ul className="space-y-2.5">
                {megaMenuData.byOrigin.map((item) => (
                  <li key={item}>
                    <Link to={`/shop?origin=${item.toLowerCase()}`} className="font-body text-sm text-terroir-cream-muted hover:text-terroir-gold transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-terroir-gold mb-4">By Roast</h4>
              <ul className="space-y-2.5">
                {megaMenuData.byRoast.map((item) => (
                  <li key={item}>
                    <Link to={`/shop?roast=${item.toLowerCase()}`} className="font-body text-sm text-terroir-cream-muted hover:text-terroir-gold transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-terroir-gold mb-4">By Profile</h4>
              <ul className="space-y-2.5">
                {megaMenuData.byProfile.map((item) => (
                  <li key={item}>
                    <Link to={`/shop?profile=${item.toLowerCase()}`} className="font-body text-sm text-terroir-cream-muted hover:text-terroir-gold transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-terroir-roast p-6" style={{ border: "1px solid rgba(212,175,55,0.15)" }}>
              <span className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-terroir-gold">Featured</span>
              <h4 className="font-display text-xl text-terroir-cream mt-2">Seasonal Rarities</h4>
              <p className="font-body text-xs text-terroir-sand mt-2">Discover our limited spring allocation from three new micro-lots.</p>
              <Link to="/shop" className="font-body text-[11px] font-medium uppercase tracking-[0.1em] text-terroir-gold mt-4 inline-block hover:text-terroir-gold-light transition-colors">
                Shop Seasonal Rarities →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-terroir-espresso flex flex-col">
          <div className="flex items-center justify-between px-6 h-20">
            <span className="font-display text-xl font-bold tracking-[0.08em] text-terroir-gold">TERROIR</span>
            <button onClick={() => setMobileOpen(false)} className="text-terroir-gold" aria-label="Close menu">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
          <nav className="flex flex-col px-6 pt-8 gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="font-body text-lg font-medium uppercase tracking-[0.15em] text-terroir-cream hover:text-terroir-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Search Overlay */}
      <SearchOverlay open={searchOpen} onClose={handleCloseSearch} />
    </>
  );
}
