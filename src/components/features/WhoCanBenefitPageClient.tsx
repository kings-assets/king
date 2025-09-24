'use client';

import { useRef } from 'react';
import { motion, useTransform, Variants } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Award, Users, HeartHandshake, Shield, Zap, HelpCircle, CheckCircle, Target, Layers, ArrowRight } from 'lucide-react';
import { useInteractive3D } from '@/hooks/useInteractive3D';
import type { WhoCanBenefit } from '@/lib/whoCanBenefitData';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

interface WhoCanBenefitPageClientProps {
  audienceDetails: WhoCanBenefit;
}

const iconMap = {
    Award,
    Users,
    HeartHandshake,
    Shield,
    Zap,
    HelpCircle
};

export default function WhoCanBenefitPageClient({ audienceDetails }: WhoCanBenefitPageClientProps) {
    const { ref, style, onMouseMove, onMouseLeave, onClick, ySpring } = useInteractive3D({
      rotationRangeX: 8,
      rotationRangeY: 8,
      stiffness: 80,
      damping: 15,
    });
    
    const cardTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 40]);
    const headerTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 80]);
    const imageTranslateZ = useTransform(ySpring, [-0.5, 0.5], [-20, 20]);
    const contentTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 60]);
    
    const AudienceIcon = iconMap[audienceDetails.iconName as keyof typeof iconMap] || HelpCircle;

    const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
    const itemVariants: Variants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring' } } };

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
              <Card className={cn("bg-gradient-to-br from-card-foreground/[.03] to-transparent shadow-2xl border", audienceDetails.classNames.borderColor, audienceDetails.classNames.shadowColor)}>
              <CardHeader className="items-center text-center p-6 md:p-8 relative overflow-hidden">
                  <motion.div style={{ transform: `translateZ(${headerTranslateZ}px)` }} className="flex flex-col items-center">
                      <AudienceIcon className={cn("h-16 w-16 md:h-20 md:w-20 mb-4", audienceDetails.classNames.textColor)} style={{filter: audienceDetails.classNames.glowFilter}} />
                      <CardTitle className={cn("text-3xl sm:text-4xl md:text-5xl font-headline font-semibold", audienceDetails.classNames.textGradient)}>
                      {audienceDetails.name}
                      </CardTitle>
                      <CardDescription className="text-lg md:text-xl text-foreground/80 mt-2 font-body max-w-3xl mx-auto">
                      {audienceDetails.introduction}
                      </CardDescription>
                  </motion.div>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-8">
                  <Button variant="outline" asChild className={cn("absolute top-6 left-6 hover:bg-opacity-10 z-10", audienceDetails.classNames.borderColor, audienceDetails.classNames.textColor, audienceDetails.classNames.hoverBgColor, audienceDetails.classNames.hoverTextColor)}>
                      <Link href="/#who-can-benefit">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to All
                      </Link>
                  </Button>
                  <motion.div
                    style={{ transform: `translateZ(${imageTranslateZ}px)` }}
                    className="relative w-full h-auto"
                  >
                    <Image
                        src={audienceDetails.imageUrl}
                        alt={audienceDetails.imageAlt}
                        width={1200}
                        height={500}
                        className="w-full h-auto object-cover rounded-lg border border-border/30 shadow-lg"
                        data-ai-hint={audienceDetails.dataAiHint}
                        priority
                    />
                  </motion.div>
                  
                   <motion.div 
                        style={{ transform: `translateZ(${contentTranslateZ}px)` }} 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                   >
                        <motion.div variants={itemVariants}>
                            <Card className="h-full bg-card-foreground/[.02]">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-headline text-primary flex items-center"><Target size={24} className="mr-3"/> Common Challenges</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                   {audienceDetails.commonChallenges.map((challenge, index) => (
                                       <div key={index} className="flex items-start text-foreground/80 font-body">
                                           <CheckCircle size={18} className="mr-3 mt-1 text-primary shrink-0"/>
                                           <span>{challenge}</span>
                                       </div>
                                   ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                         <motion.div variants={itemVariants}>
                            <Card className="h-full bg-card-foreground/[.02]">
                                <CardHeader>
                                    <CardTitle className={cn("text-2xl font-headline flex items-center", audienceDetails.classNames.textColor)}><Layers size={24} className="mr-3"/> The R8 Solution</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="font-body text-foreground/80">{audienceDetails.r8Solution.description}</p>
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-2">Key Stages:</h4>
                                        <div className="space-y-2">
                                        {audienceDetails.r8Solution.keyStages.map(stage => (
                                            <Link key={stage.slug} href={`/r8-stages/${stage.slug}`} className="block p-2 rounded-md hover:bg-muted transition-colors">
                                                <p className="font-semibold text-accent">{stage.name}</p>
                                                <p className="text-xs text-muted-foreground">{stage.reason}</p>
                                            </Link>
                                        ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                   </motion.div>
                  
                  <motion.div 
                    style={{ transform: `translateZ(${contentTranslateZ}px)` }}
                    className="text-center mt-10"
                  >
                      <Button size="lg" asChild className={cn("text-primary-foreground px-8 py-3 text-lg transform hover:scale-105 transition-transform", audienceDetails.classNames.buttonGradient, audienceDetails.classNames.buttonGlow)}>
                          <Link href="/smart-booking">Start Your Transformation <ArrowRight className="ml-2 h-5 w-5"/></Link>
                      </Button>
                  </motion.div>

              </CardContent>
              </Card>
          </motion.div>
      </motion.div>
    </div>
  );
}
