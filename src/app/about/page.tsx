
import AboutR8Section from '@/components/sections/AboutR8Section';
import FounderSection from '@/components/sections/FounderSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About The RUDRA R8 System & Shivansh Sharma',
  description: 'Learn about the revolutionary RUDRA R8 system and its visionary architect, Shivansh Sharma. Discover our mission to eliminate pain and unlock human potential.',
};

export default function AboutPage() {
  return (
    <>
      <AboutR8Section />
      <FounderSection />
    </>
  );
}
