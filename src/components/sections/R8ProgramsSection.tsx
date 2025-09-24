
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Layers, Tag, Package, Award, Zap, BarChart3, HeartHandshake, Users, Move3d } from 'lucide-react';
import { r8Programs, type R8Program } from '@/lib/r8ProgramsData';
import { motion, useTransform } from 'framer-motion';
import React from 'react';
import { useInteractive3D } from '@/hooks/useInteractive3D';

const iconMap = {
    Award,
    Zap,
    BarChart3,
    HeartHandshake,
    Users,
    Layers
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

const ProgramCard = ({ program }: { program: R8Program }) => {
    const { ref, style, onMouseMove, onMouseLeave, onClick, xSpring, ySpring, isPermissionPromptVisible } = useInteractive3D({
        stiffness: 300,
        damping: 30,
        rotationRangeX: 17.5,
        rotationRangeY: 17.5,
    });

    const imageTranslateZ = useTransform(ySpring, [-0.5, 0.5], [-20, 20]);
    const contentTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 60]);
    const iconTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 80]);
    
    const shineX = useTransform(xSpring, [-0.5, 0.5], [0, 100]);
    const shineY = useTransform(ySpring, [-0.5, 0.5], [0, 100]);

    const ProgramIcon = iconMap[program.iconName as keyof typeof iconMap] || Layers;

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            style={style}
            className="relative h-full w-full"
        >
            <div
                style={{
                    transform: "translateZ(75px)",
                    transformStyle: "preserve-3d",
                }}
                className="absolute inset-2"
            >
                <Card className="h-full w-full flex flex-col bg-transparent border border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden group">
                    <motion.div
                        className="absolute inset-0 z-0"
                        style={{ transform: "translateZ(0px)", translateZ: imageTranslateZ }}
                    >
                        <Image
                            src={program.imageCardUrl}
                            alt={`Image for ${program.name}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            data-ai-hint={program.dataAiHint}
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
                        <motion.div style={{ transform: "translateZ(80px)", translateZ: iconTranslateZ }}>
                          <ProgramIcon className="h-10 w-10 text-primary mb-3" style={{ filter: 'drop-shadow(0 0 10px hsl(var(--primary)/0.8))' }} />
                        </motion.div>
                        <div className="flex-grow-0">
                            <CardTitle className="text-xl font-headline text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.7)] mb-2">
                                <Link href={`/r8-programs/${program.slug}`}>{program.name}</Link>
                            </CardTitle>
                             <CardDescription className="text-sm font-semibold text-white/90 font-body mb-2 [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]">
                                For: {program.whoIsItFor}
                            </CardDescription>
                            <p className="text-xs text-white/70 font-body line-clamp-3 [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]">
                                {program.description}
                            </p>
                        </div>
                        <div className="mt-auto pt-4 border-t border-white/20 space-y-3">
                           <div className="space-y-1">
                                <div className="flex items-center text-primary">
                                    <Tag size={18} className="mr-2"/>
                                    <p className="font-headline font-bold text-lg text-glow-primary">{program.pricing.price}</p>
                                </div>
                                {program.pricing.packagePrice && (
                                    <div className="flex items-center text-accent">
                                        <Package size={18} className="mr-2"/>
                                        <p className="font-headline font-bold text-lg text-glow-accent">{program.pricing.packagePrice}</p>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-white/70 font-body">{program.pricing.details}</p>
                             <Button asChild size="sm" className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary hover:glow-primary mt-2">
                                <Link href={`/smart-booking?program=${encodeURIComponent(program.name)}&programSlug=${program.slug}`}>
                                    Book Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
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
        </motion.div>
    );
};


export default function R8ProgramsSection() {
  return (
    <section id="r8-programs-overview" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-semibold mb-4 text-gradient-primary-accent" style={{ textShadow: '0 0 15px hsl(var(--primary)/0.5), 0 0 25px hsl(var(--accent)/0.5)' }}>
            Your Gateway to Transformation
          </h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto font-body">
            The RUDRA R8 system is a dynamic framework, distilled into bespoke programs designed to unlock your specific potential. Choose your launchpad to peak health.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {r8Programs.map((program, index) => (
            <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ perspective: "1200px" }}
                className="h-auto min-h-[480px] sm:min-h-[520px]"
            >
                <ProgramCard program={program} />
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-24">
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary hover:glow-primary px-10 py-7 text-lg transform hover:scale-105 transition-transform">
            <Link href="/r8-programs">
              Explore All R8 Programs In Detail <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
