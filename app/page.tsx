import { HeroSection } from "@/components/hero-section"
import { WhyChooseSection } from "@/components/why-choose-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-background">
      <Header />
      <HeroSection />
      <WhyChooseSection />
      <HowItWorksSection />
      <FAQSection />
      <Footer />
    </div>
  )
}
