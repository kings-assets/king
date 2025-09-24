
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpenText, Layers, Move3d } from 'lucide-react';
import { blogPosts, type BlogPost } from '@/lib/blogPostsData';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import React from 'react';
import { useInteractive3D } from '@/hooks/useInteractive3D';

// A reusable component for the permission prompt
const Mobile3DPrompt = () => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg pointer-events-none">
        <div className="flex flex-col items-center text-white text-glow-primary animate-pulse">
            <Move3d className="h-10 w-10 mb-2" />
            <span className="text-sm font-semibold">Tap to Activate 3D Tilt</span>
        </div>
    </div>
);

const BlogCard = ({ post }: { post: BlogPost }) => {
    const { ref, style, onMouseMove, onMouseLeave, onClick, xSpring, ySpring, isPermissionPromptVisible } = useInteractive3D({
        stiffness: 300,
        damping: 30,
        rotationRangeX: 17.5,
        rotationRangeY: 17.5,
    });
    
    const imageTranslateZ = useTransform(ySpring, [-0.5, 0.5], [-20, 10]);
    const contentTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 50]);
    const categoryTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 60]);
    
    const shineX = useTransform(xSpring, [-0.5, 0.5], [0, 100]);
    const shineY = useTransform(ySpring, [-0.5, 0.5], [0, 100]);

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            style={{
                ...style,
                transformStyle: "preserve-3d",
            }}
            className="relative h-full w-full"
        >
            <Link href={`/blog/${post.slug}`} className="block h-full w-full">
                <div
                    style={{
                        transform: "translateZ(75px)",
                        transformStyle: "preserve-3d",
                    }}
                    className="absolute inset-2"
                >
                    <Card className="h-full w-full flex flex-col bg-card border border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden group">
                        <motion.div
                            className="absolute inset-0 z-0"
                            style={{ transform: "translateZ(0px)", translateZ: imageTranslateZ }}
                        >
                            <Image
                                src={post.imageUrl}
                                alt={post.imageAlt}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                data-ai-hint={post.dataAiHint}
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </motion.div>

                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
                        
                        <motion.div
                            style={{
                                transform: "translateZ(60px)",
                                translateZ: contentTranslateZ,
                            }}
                            className="p-6 flex flex-col flex-grow justify-end z-20 text-white"
                        >
                            <motion.div 
                                style={{ transform: "translateZ(80px)", translateZ: categoryTranslateZ }} 
                                className="mb-3"
                            >
                                <span className="text-xs font-body text-accent bg-accent/20 px-3 py-1 rounded-full inline-flex items-center [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] border border-accent/30">
                                    <Layers size={14} className="mr-2"/>{post.category}
                                </span>
                            </motion.div>
                            <div className="flex-grow-0">
                                <CardTitle className="text-xl font-headline text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.7)] mb-2">
                                    {post.title}
                                </CardTitle>
                                <p className="text-sm text-white/80 font-body line-clamp-3 [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]">
                                    {post.excerpt}
                                </p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/20">
                                <span className="font-semibold text-primary text-glow-primary flex items-center">
                                    Read More <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </motion.div>
                         {isPermissionPromptVisible && <Mobile3DPrompt />}
                    </Card>
                </div>
                 <motion.div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '1.25rem',
                        background: useTransform(
                            [shineX, shineY],
                            ([x, y]) => `radial-gradient(50% 50% at ${x}% ${y}%, hsl(var(--primary)/0.25), transparent)`
                        ),
                        transform: "translateZ(30px)",
                    }}
                    className="pointer-events-none"
                 />
            </Link>
        </motion.div>
    );
};


export default function BlogIndexPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 md:pt-28">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-semibold mb-4 text-glow-primary text-gradient-primary-accent">
          <BookOpenText className="inline-block mr-3 h-8 sm:h-10 w-8 sm:w-10 align-bottom animate-pulse-glow-accent" />
          Our Blog Insights
        </h1>
        <p className="text-base sm:text-lg text-foreground/80 max-w-2xl mx-auto font-body">
          Explore insights on health, performance, the science behind R8, and how it can transform your physical well-being.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-16">
        {blogPosts.map((post, index) => (
           <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ perspective: "1200px" }}
              className="h-auto min-h-[480px] sm:min-h-[500px]"
          >
              <BlogCard post={post} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
