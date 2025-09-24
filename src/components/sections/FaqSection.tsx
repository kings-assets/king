
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Move3d } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { faqData } from "@/lib/faqData";
import { useInteractive3D } from "@/hooks/useInteractive3D";


type FaqTheme = 'primary' | 'secondary' | 'accent';

// A reusable component for the permission prompt
const Mobile3DPrompt = () => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg pointer-events-none">
        <div className="flex flex-col items-center text-white text-glow-primary animate-pulse">
            <Move3d className="h-10 w-10 mb-2" />
            <span className="text-sm font-semibold">Tap to Activate 3D Tilt</span>
        </div>
    </div>
);

const FaqAccordionItem = ({ q, a, theme = 'primary' }: { q: string, a: string, theme?: FaqTheme }) => {
    const { ref, style, onMouseMove, onMouseLeave, onClick, xSpring, ySpring, isPermissionPromptVisible } = useInteractive3D({
        rotationRangeX: 10,
        rotationRangeY: 10,
        stiffness: 300,
        damping: 25,
    });
    
    const contentTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 50]);
    const shineTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 80]);
    
    const shineX = useTransform(xSpring, [-0.5, 0.5], [0, 100]);
    const shineY = useTransform(ySpring, [-0.5, 0.5], [0, 100]);

    const themeClasses = {
        primary: { border: 'data-[state=open]:border-primary/50', text: 'group-data-[state=open]:text-primary', shadow: 'data-[state=open]:shadow-primary/20', shine: 'hsl(var(--primary)/0.15)' },
        secondary: { border: 'data-[state=open]:border-secondary/50', text: 'group-data-[state=open]:text-secondary', shadow: 'data-[state=open]:shadow-secondary/20', shine: 'hsl(var(--secondary)/0.15)' },
        accent: { border: 'data-[state=open]:border-accent/50', text: 'group-data-[state=open]:text-accent', shadow: 'data-[state=open]:shadow-accent/20', shine: 'hsl(var(--accent)/0.15)' }
    };
    const currentTheme = themeClasses[theme];

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            style={{ ...style, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
        >
            <AccordionItem value={q} className="border-b-0">
                <Card className={cn("bg-card/50 backdrop-blur-xl border border-border/20 shadow-lg group transition-all duration-300 relative overflow-hidden", currentTheme.border, currentTheme.shadow)}>
                     <motion.div
                        style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            background: useTransform(
                                [shineX, shineY],
                                ([px, py]) => `radial-gradient(40% 40% at ${px}% ${py}%, ${currentTheme.shine}, transparent)`
                            ),
                            transform: "translateZ(80px)",
                            translateZ: shineTranslateZ,
                        }}
                        className="pointer-events-none"
                     />
                    <motion.div style={{ transform: "translateZ(60px)", translateZ: contentTranslateZ }}>
                        <AccordionTrigger className={cn("p-6 text-left font-headline text-lg hover:no-underline", currentTheme.text)}>
                            {q}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-base font-body text-foreground/80">
                            {a}
                        </AccordionContent>
                    </motion.div>
                    {isPermissionPromptVisible && <Mobile3DPrompt />}
                </Card>
            </AccordionItem>
        </motion.div>
    );
};


export default function FaqSection() {
    const [activeTab, setActiveTab] = useState("general");

    const renderContent = () => {
        const contentMap: { [key: string]: { data: typeof faqData.general; theme: FaqTheme } } = {
            general: { data: faqData.general, theme: 'primary' },
            experience: { data: faqData.experience, theme: 'secondary' },
            programs: { data: faqData.programs, theme: 'accent' },
        };

        const { data, theme } = contentMap[activeTab];

        return (
            <Accordion type="single" collapsible className="w-full space-y-4" style={{ perspective: '1000px' }}>
                <AnimatePresence mode="popLayout">
                    {data.map((item, i) => (
                        <FaqAccordionItem key={`${activeTab}-${i}`} q={item.q} a={item.a} theme={theme} />
                    ))}
                </AnimatePresence>
            </Accordion>
        );
    };

    return (
        <section id="faq" className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <HelpCircle className="mx-auto h-16 w-16 text-primary mb-4 animate-pulse-glow" />
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-semibold mb-4 text-glow-primary text-gradient-secondary-accent">
                        Your Questions Answered
                    </h1>
                    <p className="text-lg text-foreground/80 max-w-3xl mx-auto font-body">
                        Demystifying R8 and Empowering Your Decisions. Here you'll find clarity and confidence for your journey ahead.
                    </p>
                </div>

                <Tabs defaultValue="general" onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
                    <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-8 bg-card border border-border/50 h-auto p-2">
                        <TabsTrigger value="general" className="text-base py-2.5 data-[state=active]:text-primary">General & Scope</TabsTrigger>
                        <TabsTrigger value="experience" className="text-base py-2.5 data-[state=active]:text-secondary">Experience & Results</TabsTrigger>
                        <TabsTrigger value="programs" className="text-base py-2.5 data-[state=active]:text-accent">Programs & Suitability</TabsTrigger>
                    </TabsList>
                    
                    <div className="mt-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </Tabs>
            </div>
        </section>
    );
}
