
import { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/blogPostsData';
import { r8Programs } from '@/lib/r8ProgramsData';
import { whoCanBenefitData } from '@/lib/whoCanBenefitData';
import { r8Stages } from '@/lib/r8StagesData';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://revive2-0ug.space';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '/',
    '/about',
    '/r8-stages',
    '/r8-programs',
    '/who-can-benefit',
    '/blog',
    '/faq',
    '/contact',
    '/reviver-agent',
    '/nutrition-agent',
    '/smart-booking',
    '/privacy-policy',
  ].map(route => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1.0 : 0.8,
  }));

  const blogPages = blogPosts.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const programPages = r8Programs.map(program => ({
    url: `${BASE_URL}/r8-programs/${program.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const stagePages = r8Stages.map(stage => ({
    url: `${BASE_URL}/r8-stages/${stage.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const benefitPages = whoCanBenefitData.map(benefit => ({
    url: `${BASE_URL}/who-can-benefit/${benefit.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...blogPages,
    ...programPages,
    ...stagePages,
    ...benefitPages,
  ];
}
