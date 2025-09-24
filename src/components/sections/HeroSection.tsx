'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion, useTransform, Variants } from 'framer-motion';
import { useInteractive3D } from '@/hooks/useInteractive3D';

const HeroSection = () => {
  const { ref, onMouseMove, onMouseLeave, onClick, xSpring, ySpring } = useInteractive3D({
    stiffness: 80,
    damping: 15,
    rotationRangeX: 5,
    rotationRangeY: 5
  });

  const bgTranslateX = useTransform(xSpring, [-0.5, 0.5], ["3%", "-3%"]);
  const bgTranslateY = useTransform(ySpring, [-0.5, 0.5], ["3%", "-3%"]);
  const bgScale = useTransform(ySpring, [-0.5, 0.5], [1.15, 1]);

  const gridTranslateX = useTransform(xSpring, [-0.5, 0.5], ["-10%", "10%"]);
  const gridTranslateY = useTransform(ySpring, [-0.5, 0.5], ["-10%", "10%"]);
  
  const contentTranslateZ = useTransform(ySpring, [-0.5, 0.5], [-40, 80]);
  const buttonTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 100]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1], 
      },
    },
  };

  return (
    <section 
      id="home" 
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className="relative h-svh min-h-[700px] md:h-screen md:min-h-[750px] flex items-center justify-center text-center text-white overflow-hidden bg-background"
      style={{ perspective: "1500px" }}
    >
      
      {/* Background Image Layer */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{
          scale: bgScale,
          translateX: bgTranslateX,
          translateY: bgTranslateY,
        }}
      >
          <Image
            src="/rudra-manifestation.png"
            alt="Cosmic energy visualization representing the RUDRA R8 system's power"
            data-ai-hint="cosmic energy"
            fill
            priority
            className="object-cover opacity-80"
          />
      </motion.div>
      
      {/* Animated Holographic Grid Overlay */}
      <motion.div
        className="absolute inset-[-50%] opacity-20"
        style={{
            backgroundImage: 'linear-gradient(hsl(var(--primary)/0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            translateX: gridTranslateX,
            translateY: gridTranslateY,
        }}
        animate={{
            rotate: 360
        }}
        transition={{
            duration: 500,
            repeat: Infinity,
            ease: 'linear'
        }}
      />
      
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>
      
      {/* Content Layer */}
      <motion.div
        className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div style={{ transform: `translateZ(${contentTranslateZ}px)` }}>
            
            <motion.p variants={itemVariants} className="text-lg sm:text-xl text-primary text-glow-primary mb-4 font-headline">
              Recovery Redefined. Human Potential Unleashed.
            </motion.p>
            
            <motion.h1 
              variants={itemVariants} 
              className="font-headline font-extrabold mb-6 leading-tight"
            >
              <span className="text-5xl sm:text-6xl md:text-7xl block text-glow-primary">RUDRA R8</span>
              <span className="text-3xl sm:text-4xl block text-gradient-primary-accent mt-2">
                The World's Most Complete Fitness &amp; Therapy System
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-base sm:text-lg text-foreground/80 max-w-2xl mx-auto mb-10 font-body">
              This isn't just therapy. It's a definitive system engineered to eradicate pain, shatter performance plateaus, and rebuild you from the cellular level up. Welcome to the future of physical mastery.
            </motion.p>
        </motion.div>

        <motion.div variants={itemVariants} style={{ transform: `translateZ(${buttonTranslateZ}px)` }}>
          <Link href="/smart-booking">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary hover:glow-primary text-lg px-10 py-7 transform hover:scale-105 transition-transform duration-300">
              Begin Your Transformation
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
