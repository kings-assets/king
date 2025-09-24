
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import R8StagePageClient from '@/components/features/R8StagePageClient';
import { r8Stages } from '@/lib/r8StagesData';
import { PageProps } from '@/ai/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://revive2-0ug.space';

export async function generateStaticParams() {
  return r8Stages.map((stage) => ({
    slug: stage.slug,
  }));
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const stage = r8Stages.find((s) => s.slug === params.slug);

  if (!stage) {
    return {
      title: 'R8 Stage Not Found',
      description: 'The R8 stage you are looking for does not exist.',
    }
  }

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `Stage ${stage.id.toUpperCase()}: ${stage.title} | The R8 System`,
    description: stage.explanation,
    openGraph: {
      title: stage.title,
      description: stage.explanation,
      url: `${BASE_URL}/r8-stages/${stage.slug}`,
      images: [
        {
          url: `${BASE_URL}${stage.imageUrl}`,
          width: 1200,
          height: 630,
          alt: stage.imageAlt,
        },
        ...previousImages,
      ],
    },
    twitter: {
        card: 'summary_large_image',
        title: stage.title,
        description: stage.explanation,
        images: [`${BASE_URL}${stage.imageUrl}`],
    }
  }
}

export default function R8StagePage({ params }: PageProps) {
  const stage = r8Stages.find(s => s.slug === params.slug);

  if (!stage) {
    notFound();
  }

  return (
    <>
      <R8StagePageClient stage={stage} />
    </>
  );
}
