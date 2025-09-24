
'use client';

import { ArrowRight, Move3d, Eye, Zap, RefreshCcw, Layers3, BedDouble, Layout, Brain, Flame, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion, useTransform } from 'framer-motion';
import { r8Stages } from '@/lib/r8StagesData';
import { useInteractive3D } from '@/hooks/useInteractive3D';

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

// A reusable component for the permission prompt
const Mobile3DPrompt = () => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg pointer-events-none">
        <div className="flex flex-col items-center text-white text-glow-primary animate-pulse">
            <Move3d className="h-10 w-10 mb-2" />
            <span className="text-sm font-semibold">Tap to Activate 3D Tilt</span>
        </div>
    </div>
);

const StageCard = ({ stage }: { stage: typeof r8Stages[0] }) => {
    const { ref, style, onMouseMove, onMouseLeave, onClick, ySpring, isPermissionPromptVisible } = useInteractive3D({
      stiffness: 300,
      damping: 30,
      rotationRangeX: 17.5,
      rotationRangeY: 17.5,
    });
    
    const imageTranslateZ = useTransform(ySpring, [-0.5, 0.5], [-20, 20]);
    const contentTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 80]);

    const StageIcon = iconMap[stage.iconName as keyof typeof iconMap] || HelpCircle;

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
                <Card className="h-full w-full flex flex-col bg-gradient-to-br from-card-foreground/[.05] to-transparent border border-primary/20 shadow-2xl shadow-primary/10">
                    <motion.div
                        className="relative w-full h-48 rounded-t-xl"
                        style={{ transform: "translateZ(40px)", translateZ: imageTranslateZ }}
                    >
                        <Image
                            src={stage.imageUrl}
                            alt={stage.imageAlt}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            data-ai-hint={stage.dataAiHint}
                            className="object-cover rounded-t-xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-primary/10"></div>
                        {isPermissionPromptVisible && <Mobile3DPrompt />}
                    </motion.div>
                    
                    <motion.div
                        style={{ transform: "translateZ(80px)", translateZ: contentTranslateZ }}
                        className="p-4 flex flex-col flex-grow"
                    >
                        <div className="flex-grow">
                             <div className="flex items-center space-x-2">
                                <StageIcon className="h-6 w-6 text-primary" style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary)/0.8))' }} />
                                <CardTitle className="text-xl font-headline font-semibold text-gradient-primary-accent">{stage.title}</CardTitle>
                            </div>
                            <p className="text-sm font-medium text-foreground/70 mt-1 mb-2">{stage.subtitle}</p>
                            <p className="text-sm text-foreground/80 font-body line-clamp-5">{stage.explanation}</p>
                        </div>
                        <div className="mt-auto pt-2">
                            <Button asChild variant="link" className="p-0 h-auto self-end text-primary hover:text-accent font-semibold">
                                <Link href={`/r8-stages/${stage.slug}`}>
                                    Explore Stage <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </Card>
            </div>
        </motion.div>
    );
};


export default function R8SystemSection() {
    return (
        <section id="r8-system" className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-semibold mb-4 text-glow-primary text-gradient-primary-accent">
                        The 8 Stages of RUDRA R8: Your Blueprint for Total Transformation
                    </h2>
                    <p className="text-lg text-foreground/80 max-w-3xl mx-auto font-body">
                        The RUDRA R8 system is a meticulously designed 8-stage protocol, a scientific blueprint that guides your body from discomfort to peak performance. Each stage is crucial, building upon the last to create a holistic and lasting transformation. This isn't guesswork; it's precision engineering for your body.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                    {r8Stages.map((stage, index) => (
                         <motion.div
                            key={stage.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            style={{ perspective: "1200px" }}
                            className="h-auto min-h-[450px] sm:min-h-[500px]"
                        >
                           <StageCard stage={stage} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
