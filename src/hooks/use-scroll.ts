import { useEffect, useRef, useCallback } from "react";

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Also reveal staggered children
            const children = entry.target.querySelectorAll(".fade-up");
            children.forEach((child) => {
              child.classList.add("visible");
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    // Observe the element itself
    if (el.classList.contains("fade-up")) {
      observer.observe(el);
    }

    // Observe children with fade-up
    const fadeElements = el.querySelectorAll(".fade-up");
    fadeElements.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, []);

  return ref;
}

export function useScrollProgress() {
  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    const bar = document.getElementById("scroll-progress");
    if (bar) {
      bar.style.width = `${progress}%`;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, [updateProgress]);
}
