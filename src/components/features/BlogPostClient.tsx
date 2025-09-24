
'use client';

import { motion, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Layers } from 'lucide-react';
import type { BlogPost } from '@/lib/blogPostsData';
import BlogInteractiveControls from '@/components/features/BlogInteractiveControls';
import { useInteractive3D } from '@/hooks/useInteractive3D';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  // Extract just the text content for the TTS feature, stripping any HTML tags.
  const textContentForAudio = post.content.map(block => {
    if (block.type === 'paragraph') return block.text;
    if (block.type === 'heading') return block.text;
    if (block.type === 'list' && block.items) return block.items.map(item => `- ${item}`).join('\n');
    return '';
  }).join('\n\n').replace(/<[^>]*>?/gm, ''); // Strip HTML tags

  // Centralized "Aura Core" engine for 3D effects
  const { ref, style, ySpring, onMouseMove, onMouseLeave, onClick } = useInteractive3D({
    stiffness: 100,
    damping: 20,
    rotationRangeX: 8,
    rotationRangeY: 8,
  });

  // Derivative animations powered by the core engine's spring values
  const cardTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 40]);
  const headerTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 60]);
  const controlsTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 80]);
  const contentTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 50]);


  return (
    <div 
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className="flex-grow pt-28 pb-12 container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-start"
      style={{ perspective: '2000px' }}
    >
      <motion.div
          style={{ ...style, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-4xl"
      >
        <motion.div style={{ transform: `translateZ(${cardTranslateZ}px)` }}>
            <Card className="bg-gradient-to-br from-card-foreground/[.03] to-transparent shadow-2xl shadow-primary/20 border border-primary/20">
              <motion.div 
                style={{ transform: `translateZ(${headerTranslateZ}px)` }}
              >
                  <CardHeader className="pb-4">
                    <div className="mb-4 flex justify-between items-center">
                        <span className="text-sm font-body text-accent bg-accent/10 px-3 py-1 rounded-full inline-flex items-center">
                          <Layers size={16} className="mr-2"/>{post.category}
                        </span>
                        <Button variant="outline" asChild className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary glow-primary">
                          <Link href="/blog">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                          </Link>
                        </Button>
                    </div>
                    <CardTitle className="text-3xl sm:text-4xl font-headline font-semibold text-glow-primary text-gradient-primary-accent">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-lg text-foreground/70 mt-1 font-body">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
              </motion.div>
              <CardContent className="space-y-6">
                <motion.div style={{ transform: `translateZ(${controlsTranslateZ}px)` }}>
                    <BlogInteractiveControls
                      initialImageUrl={post.imageUrl}
                      initialImageAlt={post.imageAlt}
                      dataAiHint={post.dataAiHint}
                      blogTitle={post.title}
                      textContent={textContentForAudio}
                    />
                </motion.div>

                <motion.div 
                    style={{ transform: `translateZ(${contentTranslateZ}px)` }}
                    className="prose prose-invert prose-lg max-w-none font-body text-foreground/80 marker:text-primary [&_a]:text-accent [&_a:hover]:text-accent/80 [&_strong]:text-foreground/90 p-6 bg-card/30 rounded-lg border border-border/20"
                >
                  {post.content.map((block, index) => {
                    const itemVariants = {
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } }
                    };
                    return (
                      <motion.div key={index} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={itemVariants}>
                          {
                            (() => {
                              switch (block.type) {
                                case 'paragraph':
                                  return <p dangerouslySetInnerHTML={{ __html: block.text || '' }}></p>;
                                case 'heading':
                                  return <h3 className="text-2xl font-headline font-semibold text-secondary mt-8 mb-4 text-glow-secondary">{block.text}</h3>;
                                case 'list':
                                  return (
                                    <div className="mt-8 pt-6 border-t border-border/20">
                                      <h4 className="text-xl font-headline text-primary mb-3">{block.title}</h4>
                                      <ul className="list-disc list-inside space-y-2 font-body text-foreground/75">
                                        {block.items && block.items.map((item, itemIndex) => (
                                          <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item }}></li>
                                        ))}
                                      </ul>
                                    </div>
                                  );
                                default:
                                  return null;
                              }
                            })()
                          }
                      </motion.div>
                    );
                  })}
                </motion.div>
              </CardContent>
            </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
