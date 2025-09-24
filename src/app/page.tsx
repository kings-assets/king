import HeroSection from '@/components/sections/HeroSection';
import AboutR8Section from '@/components/sections/AboutR8Section';
import FounderSection from '@/components/sections/FounderSection';
import R8SystemSection from '@/components/sections/R8SystemSection';
import R8ProgramsSection from '@/components/sections/R8ProgramsSection';
import WhoCanBenefitSection from '@/components/sections/WhoCanBenefitSection';
import ClientJourneySection from '@/components/sections/ClientJourneySection';
import ScienceValidationSection from '@/components/sections/ScienceValidationSection';
import GallerySection from '@/components/sections/GallerySection';
import FaqSection from '@/components/sections/FaqSection';
import ContactUsSection from '@/components/sections/ContactUsSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutR8Section />
      <FounderSection />
      <R8SystemSection />
      <WhoCanBenefitSection />
      <R8ProgramsSection />
      <ClientJourneySection />
      <ScienceValidationSection />
      <GallerySection />
      <FaqSection />
      <ContactUsSection />
    </>
  );
}
