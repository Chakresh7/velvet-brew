import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import MarqueeSection from "@/components/sections/MarqueeSection";
import BestSellersSection from "@/components/sections/BestSellersSection";
import OriginSection from "@/components/sections/OriginSection";
import QuizSection from "@/components/sections/QuizSection";
import SubscriptionSection from "@/components/sections/SubscriptionSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import BlogSection from "@/components/sections/BlogSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import { useScrollProgress } from "@/hooks/use-scroll";

const Index = () => {
  useScrollProgress();

  return (
    <div className="min-h-screen bg-terroir-espresso">
      <div id="scroll-progress" className="scroll-progress" />
      <Header />
      <main>
        <HeroSection />
        <MarqueeSection />
        <BestSellersSection />
        <OriginSection />
        <QuizSection />
        <SubscriptionSection />
        <TestimonialsSection />
        <BlogSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
