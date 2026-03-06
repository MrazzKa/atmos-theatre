import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Afisha from "../components/Afisha";
import Team from "../components/Team";
import Reviews from "../components/Reviews";
import News from "../components/News";
import Contacts from "../components/Contacts";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-dark text-cream">
      <Navbar />
      <Hero />
      <About />
      <Afisha />
      <Team />
      <Reviews />
      <News />
      <Contacts />
      <Footer />
    </main>
  );
}

