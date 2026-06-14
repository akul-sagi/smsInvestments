import { useSiteNavigation } from './hooks/useSiteNavigation';
import { AboutSection } from './components/AboutSection';
import { CapabilitiesSection } from './components/CapabilitiesSection';
import { ContactSection } from './components/ContactSection';
import { DotNav } from './components/DotNav';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { InternshipSection } from './components/InternshipSection';
import { NewsletterSection } from './components/NewsletterSection';

export default function App() {
  const { activeSection, scrollProgress, jumpTo, prefersReducedMotion } = useSiteNavigation();
  const reduceMotion = Boolean(prefersReducedMotion);

  return (
    <div className="site-shell">
      <Header activeSection={activeSection} onJump={jumpTo} />
      <DotNav activeSection={activeSection} onJump={jumpTo} />

      <main>
        <HeroSection scrollProgress={scrollProgress} onJump={jumpTo} prefersReducedMotion={reduceMotion} />
        <AboutSection prefersReducedMotion={reduceMotion} />
        <CapabilitiesSection prefersReducedMotion={reduceMotion} />
        <NewsletterSection prefersReducedMotion={reduceMotion} />
        <ContactSection prefersReducedMotion={reduceMotion} />
      </main>
    </div>
  );
}
