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

export default function App() {
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
