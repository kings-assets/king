
import ContactUsSection from '@/components/sections/ContactUsSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Revive 2.0 Underground | Book Your Session',
  description: 'Contact us to book your R8 session, ask questions about our physical therapy and performance programs, or visit us in Gurgaon & Delhi NCR.',
};

export default function ContactPage() {
  return (
    <>
      <ContactUsSection />
    </>
  );
}
