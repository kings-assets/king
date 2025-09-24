
import { blogPosts } from '@/lib/blogPostsData';
import { notFound } from 'next/navigation';
import BlogPostClient from '@/components/features/BlogPostClient';
import type { Metadata, ResolvingMetadata } from 'next';
import Script from 'next/script';
import { PageProps } from '@/ai/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://revive2-0ug.space';

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The blog post you are looking for does not exist.',
    }
  }

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: new Date().toISOString(), // This should ideally be a date from the post data
      authors: ['Shivansh Sharma'],
      images: [
        {
          url: `${BASE_URL}${post.imageUrl}`,
          width: 1200,
          height: 600,
          alt: post.imageAlt,
        },
        ...previousImages,
      ],
    },
    twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: [`${BASE_URL}${post.imageUrl}`],
    }
  }
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: PageProps) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${post.slug}`
    },
    "headline": post.title,
    "description": post.excerpt,
    "image": `${BASE_URL}${post.imageUrl}`,
    "author": {
      "@type": "Person",
      "name": "Shivansh Sharma",
      "url": `${BASE_URL}/about`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Revive 2.0 Underground",
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/logo.png`
      }
    },
    "datePublished": new Date().toISOString() // Fallback, should be from post data
  };

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogPostClient post={post} />
    </>
  );
}
