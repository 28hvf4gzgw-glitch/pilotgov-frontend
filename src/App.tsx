import { useEffect, useState } from 'react';
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
import ImpactDashboard from '@/components/ImpactDashboard';
import FullReport from '@/components/FullReport';
import AnimatedBackground from '@/components/AnimatedBackground';
import AssistantWidget from '@/components/AssistantWidget';
import ErrorBoundary from '@/components/ErrorBoundary';

import { PilotBoardProvider } from '@/context/PilotBoardContext';

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
  const [activeNeed, setActiveNeed] = useState<{
    id: string;
    title: string;
    dept?: string;
    budget?: string;
    domain?: string;
  } | null>(null);

  const handleNeedCreated = (need: {
    id: string;
    title: string;
    dept?: string;
    budget?: string;
    domain?: string;
  }) => {
    setActiveNeed(need);
    setTimeout(() => {
      document.getElementById('for-government')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <PilotBoardProvider>
      <div className="min-h-screen bg-transparent text-white antialiased selection:bg-emerald2-500/30">
        <Navbar />
        <main>
          <Hero />
          <PartnerStrip />
          <ProblemStatement />
          <HowItWorks />
          <PostNeed onNeedCreated={handleNeedCreated} />
          <StartupDiscovery
            needId={activeNeed?.id}
            needTitle={activeNeed?.title}
            needDept={activeNeed?.dept}
            needBudget={activeNeed?.budget}
            onClearNeed={() => setActiveNeed(null)}
          />
          <PilotTracker />
          <TrustSection />
          <ImpactCalculator />
        </main>
        <Footer />
      </div>
    </PilotBoardProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        {/* Site-wide persistent background */}
        <AnimatedBackground />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<FullReport />} />
          <Route path="/impact" element={<ImpactDashboard />} />
          <Route path="/scale" element={<ImpactDashboard />} />
          <Route path="/calculator" element={<ImpactDashboard />} />
          <Route path="/domains/agritech" element={<DomainPage domain="AgriTech" />} />
          <Route path="/domains/cleantech" element={<DomainPage domain="CleanTech" />} />
          <Route path="/domains/healthtech" element={<DomainPage domain="HealthTech" />} />
          <Route path="/domains/smart-mobility" element={<DomainPage domain="Smart Mobility" />} />
          <Route path="/domains/edtech" element={<DomainPage domain="EdTech" />} />
          <Route path="/domains/:slug" element={<DomainPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
        {/* Site-wide floating AI assistant widget */}
        <AssistantWidget />
      </BrowserRouter>
    </ErrorBoundary>
  );
}


