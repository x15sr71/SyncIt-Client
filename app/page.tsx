import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import KeyFeatures from "./components/KeyFeatures"
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
    <main className="text-sm text-neutral-300 antialiased"></main>
    <Navbar/>
    <HeroSection/>
    <HowItWorks/>
    <KeyFeatures/>
    </>
  );
}