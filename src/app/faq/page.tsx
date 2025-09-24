
import FaqSection from '@/components/sections/FaqSection';
import type { Metadata } from 'next';
import Script from 'next/script';
import { faqData } from '@/lib/faqData';

export const metadata: Metadata = {
  title: 'FAQ - Revive 2.0 Underground',
  description: 'Frequently asked questions about the RUDRA R8 System, our programs, recovery timelines, and who can benefit. Get answers from Shivansh Sharma’s team.',
};

export default function FaqPage() {
  const allFaqs = [...faqData.general, ...faqData.experience, ...faqData.programs];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFaqs.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqSection />
    </>
  );
}
