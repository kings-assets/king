
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useTransform } from 'framer-motion';
import React from 'react';
import { whoCanBenefitData, type WhoCanBenefit } from '@/lib/whoCanBenefitData';
import { ArrowRight, Move3d, Award, Users, HeartHandshake, Shield, Zap } from 'lucide-react';
import { Card, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useInteractive3D } from '@/hooks/useInteractive3D';

const iconMap = {
    Award,
    Users,
    HeartHandshake,
    Shield,
    Zap,
};

// A reusable component for the permission prompt
const Mobile3DPrompt = () => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg pointer-events-none">
        <div className="flex flex-col items-center text-white text-glow-primary animate-pulse">
            <Move3d className="h-10 w-10 mb-2" />
            <span className="text-sm font-semibold">Tap to Activate 3D Tilt</span>
        </div>
    </div>
);

const BenefitCard = ({ audience }: { audience: WhoCanBenefit }) => {
    const { ref, style, onMouseMove, onMouseLeave, onClick, xSpring, ySpring, isPermissionPromptVisible } = useInteractive3D({
        rotationRangeX: 17.5,
        rotationRangeY: 17.5,
    });

    const imageTranslateZ = useTransform(ySpring, [-0.5, 0.5], [-20, 20]);
    const contentTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 60]);
    const iconTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 80]);

    const shineX = useTransform(xSpring, [-0.5, 0.5], [0, 100]);
    const shineY = useTransform(ySpring, [-0.5, 0.5], [0, 100]);
    
    const AudienceIcon = iconMap[audience.iconName as keyof typeof iconMap] || Users;

    return (
        <Link href={`/who-can-benefit/${audience.slug}`} className="block h-full group" style={{ perspective: '1200px' }}>
            <motion.div
                ref={ref}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                style={{ ...style, transformStyle: "preserve-3d" }}
                className="relative h-full"
            >
                <div
                    style={{
                        transform: "translateZ(50px)",
                        transformStyle: "preserve-3d",
                    }}
                    className="absolute inset-0"
                >
                    <Card className="h-full w-full flex flex-col bg-card border border-border/30 shadow-2xl shadow-black/20 overflow-hidden">
                        <motion.div
                            className="absolute inset-0 z-0"
                            style={{ transform: "translateZ(0px)", translateZ: imageTranslateZ }}
                        >
                            <Image
                                src={audience.imageUrl}
                                alt={audience.imageAlt}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                data-ai-hint={audience.dataAiHint}
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
                        </motion.div>

                        <motion.div
                            style={{ transform: "translateZ(60px)", translateZ: contentTranslateZ }}
                            className="p-6 flex flex-col flex-grow z-10 justify-end text-white"
                        >
                            <motion.div style={{ transform: "translateZ(80px)", translateZ: iconTranslateZ }}>
                                <AudienceIcon className={cn("h-12 w-12 mb-4", audience.classNames.textColor)} style={{ filter: audience.classNames.glowFilter }} />
                            </motion.div>
                            <CardTitle className="text-2xl font-headline mb-3 text-white" style={{textShadow: '0px 2px 10px rgba(0,0,0,0.8)'}}>
                                {audience.name}
                            </CardTitle>
                            <p className="text-sm text-white/80 font-body flex-grow" style={{textShadow: '0px 1px 5px rgba(0,0,0,0.7)'}}>
                                {audience.benefits}
                            </p>
                            <div className={cn("mt-4 text-sm font-semibold flex items-center group-hover:text-white transition-colors", audience.classNames.textColor)}>
                                Learn More <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                        {isPermissionPromptVisible && <Mobile3DPrompt />}
                    </Card>
                </div>
                <motion.div
                    style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        borderRadius: 'calc(var(--radius) - 2px)',
                        background: useTransform(
                            [shineX, shineY],
                            ([x, y]) => `radial-gradient(60% 60% at ${x}% ${y}%, ${audience.classNames.shadowColor}20, transparent)`
                        ),
                        transform: "translateZ(80px)",
                    }}
                    className="pointer-events-none"
                 />
            </motion.div>
        </Link>
    );
};

export default function WhoCanBenefitSection() {
  return (
    <section id="who-can-benefit" className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-semibold mb-4 text-glow-primary text-gradient-primary-accent">
            For Everyone, For Every Body
          </h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto font-body">
            Whether you're an athlete aiming for peak performance, a professional battling desk-related pain, a senior seeking active aging, or simply someone who wants to live a pain-free, energetic life – RUDRA R8 is for you. Our personalized programs cater to your unique needs, helping you reclaim your health and unleash your full potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whoCanBenefitData.map((audience, index) => (
            <motion.div
                key={audience.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-auto min-h-[420px] sm:min-h-[450px]"
            >
               <BenefitCard audience={audience} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
