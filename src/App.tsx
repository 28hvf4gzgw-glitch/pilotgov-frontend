import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PartnerStrip from '@/components/PartnerStrip';
import ProblemStatement from '@/components/ProblemStatement';
import HowItWorks from '@/components/HowItWorks';
import PostNeed from '@/components/PostNeed';
import StartupDiscovery from '@/components/StartupDiscovery';
import PilotTracker from '@/components/PilotTracker';
import TrustSection from '@/components/TrustSection';
import ImpactCalculator from '@/components/ImpactCalculator';
import Footer from '@/components/Footer';
import DomainPage from '@/components/DomainPage';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function HomePage() {
  return (
    <div className="min-h-screen bg-ink-950 text-white antialiased selection:bg-emerald2-500/30">
      <Navbar />
      <main>
        <Hero />
        <PartnerStrip />
        <ProblemStatement />
        <HowItWorks />
        <PostNeed />
        <StartupDiscovery />
        <PilotTracker />
        <TrustSection />
        <ImpactCalculator />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/domains/agritech" element={<DomainPage domain="AgriTech" />} />
        <Route path="/domains/cleantech" element={<DomainPage domain="CleanTech" />} />
        <Route path="/domains/healthtech" element={<DomainPage domain="HealthTech" />} />
        <Route path="/domains/smart-mobility" element={<DomainPage domain="Smart Mobility" />} />
        <Route path="/domains/edtech" element={<DomainPage domain="EdTech" />} />
        <Route path="/domains/:slug" element={<DomainPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

