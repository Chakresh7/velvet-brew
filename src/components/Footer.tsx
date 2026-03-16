import { Link } from "react-router-dom";

const footerLinks = {
  shop: ["Coffee", "Teas", "Subscriptions", "Gift Cards", "Limited Editions", "Sale"],
  company: ["Our Story", "Our Farms", "Sustainability", "Press", "Careers", "Blog"],
  support: ["FAQ", "Shipping", "Returns", "Track Order", "Contact", "Wholesale"],
};

export default function Footer() {
  return (
    <footer
      className="bg-terroir-espresso pt-16 md:pt-20 pb-8"
      style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div>
            <span className="font-display text-2xl font-bold tracking-[0.08em] text-terroir-gold">TERROIR</span>
            <p className="font-accent text-base italic text-terroir-sand mt-3">
              Rare origins, exceptional moments. Since 2016.
            </p>
            <div className="flex gap-4 mt-6">
              {["Instagram", "Pinterest", "TikTok", "YouTube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="font-body text-[10px] uppercase tracking-[0.1em] text-terroir-sand hover:text-terroir-gold transition-colors"
                  aria-label={social}
                >
                  {social.slice(0, 2)}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-terroir-gold mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link}>
                  <Link to="/shop" className="font-body text-sm text-terroir-sand hover:text-terroir-gold transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-terroir-gold mb-4">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <Link to="/" className="font-body text-sm text-terroir-sand hover:text-terroir-gold transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-terroir-gold mb-4">Support</h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <Link to="/" className="font-body text-sm text-terroir-sand hover:text-terroir-gold transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}
        >
          <p className="font-body text-[11px] text-terroir-text-muted">
            © 2026 TERROIR · Privacy · Terms · Accessibility
          </p>
          <div className="flex items-center gap-3">
            {["Visa", "MC", "Amex", "Apple Pay", "Shop Pay"].map((pay) => (
              <span
                key={pay}
                className="font-body text-[9px] uppercase tracking-[0.05em] text-terroir-text-muted px-2 py-1"
                style={{ border: "1px solid rgba(212,175,55,0.1)" }}
              >
                {pay}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
