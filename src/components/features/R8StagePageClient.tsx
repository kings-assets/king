'use client';

import { motion, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Sparkles, HelpCircle, Eye, Zap, RefreshCcw, Layers3, BedDouble, Layout, Brain, Flame, Lightbulb, Target, CheckCircle2 } from 'lucide-react';
import { useInteractive3D } from '@/hooks/useInteractive3D';
import type { r8Stages } from '@/lib/r8StagesData';

type R8Stage = (typeof r8Stages)[number];

interface R8StagePageClientProps {
  stage: R8Stage;
}

const iconMap = {
    Eye,
    Zap,
    RefreshCcw,
    Layers3,
    BedDouble,
    Layout,
    Brain,
    Flame,
    HelpCircle
};

export default function R8StagePageClient({ stage }: R8StagePageClientProps) {
    const { ref, style, onMouseMove, onMouseLeave, onClick, ySpring } = useInteractive3D({
      rotationRangeX: 8,
      rotationRangeY: 8,
      stiffness: 80,
      damping: 15,
    });
    
    const cardTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 40]);
    const headerTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 80]);
    const imageTranslateZ = useTransform(ySpring, [-0.5, 0.5], [-20, 20]);
    const explanationTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 50]);
    const analogyTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 65]);
    const focusTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 80]);
    
    const StageIcon = iconMap[stage.iconName as keyof typeof iconMap] || HelpCircle;

  return (
    <div 
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className="flex-grow pt-28 pb-12 container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-start"
      style={{ perspective: '2500px' }}
    >
      <motion.div
          style={style}
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-4xl"
      >
          <motion.div style={{ transform: `translateZ(${cardTranslateZ}px)` }}>
              <Card className="bg-gradient-to-br from-card-foreground/[.03] to-transparent shadow-2xl shadow-primary/20 border border-primary/20">
                  <CardHeader className="p-6 md:p-8 relative overflow-hidden text-center">
                      <motion.div 
                        style={{ transform: `translateZ(${headerTranslateZ}px)` }}
                        className="flex flex-col items-center"
                      >
                          <StageIcon className="h-16 w-16 md:h-20 md:w-20 text-primary mb-4 animate-pulse-glow" />
                          <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-headline font-semibold text-glow-primary text-gradient-primary-accent">
                          {stage.title}
                          </CardTitle>
                          <CardDescription className="text-lg md:text-xl text-foreground/80 mt-2 font-body max-w-2xl mx-auto">
                          {stage.subtitle}
                          </CardDescription>
                      </motion.div>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8 space-y-8">
                      <Button variant="outline" asChild className="absolute top-6 left-6 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary glow-primary z-10">
                          <Link href="/#r8-system">
                              <ArrowLeft className="mr-2 h-4 w-4" /> Back to R8 System
                          </Link>
                      </Button>
                      <motion.div 
                          style={{ transform: `translateZ(${imageTranslateZ}px)` }} 
                          className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border border-border/30 shadow-lg"
                      >
                          <Image
                              src={stage.imageUrl}
                              alt={stage.imageAlt}
                              fill
                              data-ai-hint={stage.dataAiHint}
                              className="object-cover"
                              priority
                          />
                      </motion.div>
                      
                      <motion.div style={{ transform: `translateZ(${explanationTranslateZ}px)` }}>
                        <Card className="bg-card-foreground/[.02]">
                            <CardHeader>
                            <CardTitle className="text-2xl font-headline text-primary flex items-center"><Sparkles size={24} className="mr-2"/>Core Explanation</CardTitle>
                            </CardHeader>
                            <CardContent className="text-foreground/80 font-body space-y-3 leading-relaxed">
                            <p>{stage.explanation}</p>
                            </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div style={{ transform: `translateZ(${analogyTranslateZ}px)` }}>
                        <Card className="bg-card-foreground/[.02]">
                            <CardHeader>
                                <CardTitle className="text-xl font-headline text-secondary flex items-center"><Lightbulb size={22} className="mr-2"/>Analogy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-foreground/80 font-body text-lg italic">"{stage.analogy}"</p>
                            </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div style={{ transform: `translateZ(${focusTranslateZ}px)` }}>
                        <Card className="bg-card-foreground/[.02]">
                            <CardHeader>
                                <CardTitle className="text-xl font-headline text-accent flex items-center"><Target size={22} className="mr-2"/>Key Focus Areas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {stage.keyFocusAreas.map((area, index) => (
                                <div key={index} className="flex items-start text-foreground/80 font-body">
                                    <CheckCircle2 size={18} className="mr-3 mt-1 text-accent shrink-0"/>
                                    <span>{area}</span>
                                </div>
                                ))}
                            </CardContent>
                        </Card>
                      </motion.div>

                  </CardContent>
              </Card>
          </motion.div>
      </motion.div>
    </div>
  );
}
