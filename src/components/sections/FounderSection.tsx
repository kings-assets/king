'use client';

import Image from 'next/image';
import { motion, useTransform } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useInteractive3D } from '@/hooks/useInteractive3D';
import { useIsMobile } from '@/hooks/use-is-mobile';

const FounderSection = () => {
  const { ref, style, onMouseMove, onMouseLeave, onClick, ySpring } = useInteractive3D({
    rotationRangeX: 8,
    rotationRangeY: -8, // Invert Y rotation for a different feel
  });
  const isMobile = useIsMobile();

  const contentTranslateZ = useTransform(ySpring, [-0.5, 0.5], [40, 100]);
  const imageTranslateZ = useTransform(ySpring, [-0.5, 0.5], [-20, 60]);
  const logoTranslateZ = useTransform(ySpring, [-0.5, 0.5], [60, 150]);

  return (
    <section id="founder" className="py-16 md:py-24 bg-background overflow-hidden">
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div
          ref={ref}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onClick={onClick}
          className="relative w-full rounded-2xl bg-gradient-to-br from-card-foreground/[.05] to-transparent border border-secondary/20 shadow-2xl shadow-secondary/10"
          style={{ perspective: "2500px" }}
        >
          <motion.div
            style={style}
            className="relative p-5 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
          >
            <motion.div
              style={{ transform: `translateZ(${imageTranslateZ}px)` }}
              className="relative w-full aspect-[2/3] md:max-h-[550px] z-10 order-1"
            >
                <div className="absolute inset-0 animate-aurora-pulse rounded-full blur-3xl opacity-50"></div>
                <Image
                    src="/shivansh.png"
                    alt="Shivansh Sharma, founder of RUDRA R8 System"
                    data-ai-hint="portrait man"
                    fill
                    className="object-cover rounded-lg"
                    style={{
                        filter: "drop-shadow(0 0 40px hsl(var(--secondary)/0.6))"
                    }}
                />
                <motion.div
                    style={{ transform: `translateZ(${logoTranslateZ}px)` }}
                    className="absolute w-20 h-20 md:w-24 md:h-24 pointer-events-none top-4 right-4"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                >
                    <Image
                        src="/small logo.png"
                        alt="Rudra R8 small logo"
                        fill
                        className="object-contain"
                        style={{
                            filter: "drop-shadow(0 0 15px hsl(var(--primary)/0.8)) drop-shadow(0 0 25px hsl(var(--accent)/0.6))"
                        }}
                    />
                </motion.div>
            </motion.div>
            
            <motion.div
              style={{ transform: `translateZ(${contentTranslateZ}px)` }}
              className="z-20 relative order-2"
            >
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-headline font-semibold mb-6 text-gradient-secondary-accent"
                style={{ textShadow: '0 0 15px hsl(var(--secondary)/0.5), 0 0 25px hsl(var(--accent)/0.5)' }}
              >
                Born from a Vision: Shivansh Sharma’s Quest for True Healing
              </h2>
              
              <ScrollArea className="h-[350px] w-full rounded-lg border border-border/20 p-6 bg-card/50 backdrop-blur-sm shadow-xl">
                 <div className="space-y-4 text-foreground/80 font-body text-base md:text-lg">
                    <p className="text-lg md:text-xl font-semibold text-secondary text-glow-secondary">RUDRA R8 is the brainchild of Shivansh Sharma, a visionary driven by a deep, almost 'God-gifted' understanding of the human body and a passion for holistic well-being.</p>
                    <p>
                      Frustrated by conventional approaches that often fell short, Shivansh embarked on a relentless journey, delving into ancient healing traditions, cutting-edge scientific research, and diverse therapeutic modalities from across the globe. His mission was to synthesize this vast knowledge into a single, cohesive system that could deliver what others couldn't: a true, lasting solution with a 95% success rate.
                    </p>
                    <p>
                      His unique diagnostic ability allows him to see the root cause of an issue just by observing a person. This intuitive insight is the foundation of the R8 system, which is a system that doesn’t just treat symptoms but empowers the body to heal and thrive from its core.
                    </p>
                    <p>
                      The result of this journey is RUDRA R8—a revolutionary system where a unique fusion of ancient wisdom and modern precision allows us to unlock your body’s innate healing capabilities, delivering results that are not just fast, but fundamentally transformative.
                    </p>
                 </div>
              </ScrollArea>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default FounderSection;
