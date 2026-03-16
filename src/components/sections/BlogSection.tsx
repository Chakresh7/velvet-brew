import { blogPosts } from "@/data/products";
import { useScrollReveal } from "@/hooks/use-scroll";

export default function BlogSection() {
  const ref = useScrollReveal();

  return (
    <section className="py-16 md:py-[120px] max-w-[1440px] mx-auto px-6 md:px-12">
      <div ref={ref} className="stagger-children">
        <span className="fade-up font-body text-[10px] font-medium uppercase tracking-[0.2em] text-terroir-gold">
          FROM THE JOURNAL
        </span>
        <h2 className="fade-up font-display text-3xl md:text-5xl font-bold text-terroir-cream mt-4 leading-tight">
          Brew Knowledge,{"\n"}Deep Sourced.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="group cursor-pointer"
            style={{
              border: "1px solid rgba(212,175,55,0.15)",
              background: "rgba(44, 31, 20, 0.6)",
            }}
          >
            <div className="overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <span className="font-body text-[10px] font-medium uppercase tracking-[0.15em] text-terroir-gold">
                {post.category}
              </span>
              <h3 className="font-display text-lg md:text-xl text-terroir-cream mt-2 leading-snug">
                {post.title}
              </h3>
              <p className="font-body text-[13px] text-terroir-sand mt-2 line-clamp-2">
                {post.excerpt}
              </p>
              <span className="nav-link font-body text-[11px] font-medium uppercase tracking-[0.1em] text-terroir-gold mt-4 inline-block">
                Read More →
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
