import './globals.css';
import type { Metadata } from 'next';
import { Alegreya, Belleza } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import ClientLayoutWrapper from '@/components/layout/ClientLayoutWrapper';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/react';

const belleza = Belleza({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-belleza',
});

const alegreya = Alegreya({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-alegreya',
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://revive2-0ug.space';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Revive 2.0 Underground | The World’s Most Complete Fitness & Therapy System',
    template: '%s | Revive 2.0 Underground',
  },
  description: 'Revive 2.0 Underground, pioneered by Shivansh Sharma, offers a revolutionary 8-stage physical therapy and fitness system, RUDRA R8, to eliminate pain, optimize performance, and unlock your true potential.',
  openGraph: {
    title: 'Revive 2.0 Underground | The World’s Most Complete Fitness & Therapy System',
    description: 'Experience the future of physical mastery with the RUDRA R8 system. Eliminate pain, accelerate recovery, and unlock peak performance.',
    url: BASE_URL,
    siteName: 'Revive 2.0 Underground',
    images: [
      {
        url: `${BASE_URL}/og-image.png`, 
        width: 1200,
        height: 630,
        alt: 'Revive 2.0 Underground Logo and Branding',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Revive 2.0 Underground | The World’s Most Complete Fitness & Therapy System',
    description: 'Experience the future of physical mastery with the RUDRA R8 system. Eliminate pain, accelerate recovery, and unlock peak performance.',
    images: [`${BASE_URL}/og-image.png`],
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code here
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn('dark', belleza.variable, alegreya.variable)}>
      <body>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        <Toaster />
        <SpeedInsights/>
        <Analytics/>
      </body>
    </html>
  );
}
