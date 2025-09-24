
import R8ProgramsSection from '@/components/sections/R8ProgramsSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'R8 Therapy Programs | Revive 2.0 Underground',
  description: 'Explore our bespoke R8 therapy programs like Ascent for athletes, Reclaim for chronic pain, and Genesis for beginners. Find your gateway to transformation.',
};


export default function R8ProgramsPage() {
  return (
    <>
      <R8ProgramsSection />
    </>
  );
}
