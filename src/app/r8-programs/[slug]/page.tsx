
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import R8ProgramPageClient from '@/components/features/R8ProgramPageClient';
import { r8Programs } from '@/lib/r8ProgramsData';
import { PageProps } from '@/ai/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://revive2-0ug.space';

export async function generateStaticParams() {
  return r8Programs.map((program) => ({
    slug: program.slug,
  }));
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const program = r8Programs.find((p) => p.slug === params.slug);

  if (!program) {
    return {
      title: 'Program Not Found',
      description: 'The R8 program you are looking for does not exist.',
    }
  }

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${program.name} | R8 Programs`,
    description: program.description,
    openGraph: {
      title: program.name,
      description: program.description,
      url: `${BASE_URL}/r8-programs/${program.slug}`,
      images: [
        {
          url: `${BASE_URL}${program.imageBannerUrl}`,
          width: 1200,
          height: 630,
          alt: `Banner for ${program.name}`,
        },
        ...previousImages,
      ],
    },
    twitter: {
        card: 'summary_large_image',
        title: program.name,
        description: program.description,
        images: [`${BASE_URL}${program.imageBannerUrl}`],
    }
  }
}

export default function R8ProgramPage({ params }: PageProps) {
  const program = r8Programs.find((p) => p.slug === params.slug);

  if (!program) {
    notFound();
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": program.name,
    "name": program.name,
    "description": program.description,
    "provider": {
      "@type": "Organization",
      "name": "Revive 2.0 Underground"
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": ["Delhi NCR", "Gurgaon"]
    },
    "image": `${BASE_URL}${program.imageBannerUrl}`
  };

  return (
    <>
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <R8ProgramPageClient program={program} />
    </>
  );
}
