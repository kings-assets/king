
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import WhoCanBenefitPageClient from '@/components/features/WhoCanBenefitPageClient';
import { whoCanBenefitData } from '@/lib/whoCanBenefitData';
import { PageProps } from '@/ai/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://revive2-0ug.space';

export async function generateStaticParams() {
    return whoCanBenefitData.map((audience) => ({
      slug: audience.slug,
    }));
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const audience = whoCanBenefitData.find((a) => a.slug === params.slug);

  if (!audience) {
    return {
      title: 'Audience Not Found',
      description: 'The audience profile you are looking for does not exist.',
    }
  }

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${audience.name} | Who Can Benefit`,
    description: audience.benefits,
    openGraph: {
      title: audience.name,
      description: audience.benefits,
      url: `${BASE_URL}/who-can-benefit/${audience.slug}`,
      images: [
        {
          url: `${BASE_URL}${audience.imageUrl}`,
          width: 1200,
          height: 630,
          alt: audience.imageAlt,
        },
        ...previousImages,
      ],
    },
    twitter: {
        card: 'summary_large_image',
        title: audience.name,
        description: audience.benefits,
        images: [`${BASE_URL}${audience.imageUrl}`],
    }
  }
}

export default function WhoCanBenefitPage({ params }: PageProps) {
    const audienceDetails = whoCanBenefitData.find(a => a.slug === params.slug);

    if (!audienceDetails) {
        notFound();
    }

  return (
    <>
      <WhoCanBenefitPageClient audienceDetails={audienceDetails} />
    </>
  );
}
