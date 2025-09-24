'use client';

import { motion, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Zap, ArrowRight, Layers, Move3d, Award, BarChart3, HeartHandshake, Users } from 'lucide-react';
import { type R8Program } from '@/lib/r8ProgramsData';
import { useInteractive3D } from '@/hooks/useInteractive3D';

interface R8ProgramPageClientProps {
  program: R8Program;
}

const iconMap = {
    Award,
    Zap,
    BarChart3,
    HeartHandshake,
    Users,
    Layers,
};

export default function R8ProgramPageClient({ program }: R8ProgramPageClientProps) {
  const { ref, style, onMouseMove, onMouseLeave, onClick, ySpring } = useInteractive3D({
    rotationRangeX: 8,
    rotationRangeY: 8,
    stiffness: 80,
    damping: 15
  });
  
  const cardTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 40]);
  const contentTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 60]);
  const benefitsTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 70]);
  const stagesTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 80]);

  const ProgramIcon = iconMap[program.iconName as keyof typeof iconMap] || Layers;

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
              <CardHeader className="pb-4 relative">
                  <Button variant="outline" asChild className="absolute top-6 left-6 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary glow-primary z-10">
                      <Link href="/r8-programs"> 
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Programs
                      </Link>
                  </Button>
                  <div className="relative w-full h-64 md:h-80 rounded-t-lg overflow-hidden">
                     <Image
                          src={program.imageBannerUrl} 
                          alt={`Banner for ${program.name}`}
                          fill
                          data-ai-hint={program.dataAiHint}
                          className="object-cover"
                          priority 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent"></div>
                  </div>
                  <motion.div 
                    style={{ transform: `translateZ(${contentTranslateZ}px)` }}
                    className="relative -mt-16 px-6 z-10"
                  >
                      <div className="mb-4 flex items-center space-x-4">
                          <div className="p-3 bg-card rounded-full border border-primary/30 shadow-lg">
                              <ProgramIcon size={40} className="text-primary animate-pulse-glow"/>
                          </div>
                          <div>
                              <CardTitle className="text-3xl sm:text-4xl font-headline font-semibold text-glow-primary text-gradient-primary-accent">
                              {program.name}
                              </CardTitle>
                              <CardDescription className="text-lg text-foreground/70 mt-1 font-body">
                                  For: {program.whoIsItFor}
                              </CardDescription>
                          </div>
                      </div>
                  </motion.div>
              </CardHeader>
              <CardContent className="px-6 pb-8 space-y-8">
                  
                  <motion.div 
                    style={{ transform: `translateZ(${contentTranslateZ}px)` }}
                    className="prose prose-invert prose-lg max-w-none font-body text-foreground/80"
                  >
                      <h3 className="text-2xl font-headline font-semibold text-secondary text-glow-secondary">Program Overview</h3>
                      <p className="whitespace-pre-line leading-relaxed">{program.description}</p>
                  </motion.div>
                  
                  <motion.div style={{ transform: `translateZ(${benefitsTranslateZ}px)` }}>
                      <h3 className="text-2xl font-headline font-semibold text-accent mb-4 text-glow-accent">Key Benefits:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {program.keyBenefits.map((benefit, index) => (
                              <motion.div 
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                              >
                                  <div className="flex items-start p-3 rounded-lg bg-card-foreground/[.02] border border-border/20 h-full">
                                      <CheckCircle size={20} className="mr-3 mt-1 text-green-500 shrink-0" />
                                      <span>{benefit}</span>
                                  </div>
                              </motion.div>
                          ))}
                      </div>
                  </motion.div>

                  <motion.div style={{ transform: `translateZ(${stagesTranslateZ}px)` }}>
                    <h3 className="text-2xl font-headline font-semibold text-primary mt-8 mb-4 text-glow-primary">Targeted R8 Stages:</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {program.targetedR8Stages.map((stage, index) => (
                          <motion.div
                              key={stage.slug}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                          >
                              <Card className="bg-card-foreground/[.02] hover:shadow-md hover:border-primary/50 transition-all duration-300 h-full">
                                  <CardHeader className="p-4">
                                  <CardTitle className="text-lg font-headline text-primary">
                                      <Link href={`/r8-stages/${stage.slug}`} className="hover:underline flex items-center">
                                      <Layers size={18} className="mr-2 shrink-0"/> {stage.name.toUpperCase()}
                                      </Link>
                                  </CardTitle>
                                  </CardHeader>
                                  {stage.description && (
                                  <CardContent className="p-4 pt-0">
                                      <p className="text-sm text-foreground/75 font-body">{stage.description}</p>
                                  </CardContent>
                                  )}
                              </Card>
                          </motion.div>
                      ))}
                  </div>
                  </motion.div>

                  <motion.div 
                    style={{ transform: `translateZ(${stagesTranslateZ}px)` }}
                    className="mt-10 pt-8 border-t border-border/20 text-center"
                  >
                      <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary hover:glow-primary px-8 py-3 text-lg transform hover:scale-105 transition-transform duration-300">
                          <Link href={`/smart-booking?program=${encodeURIComponent(program.name)}&programSlug=${program.slug}`}>
                              Book Your {program.name.split(':')[0]} Journey <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                      </Button>
                  </motion.div>
              </CardContent>
              </Card>
          </motion.div>
      </motion.div>
    </div>
  );
}
