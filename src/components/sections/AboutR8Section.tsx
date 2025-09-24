
'use client';

import Image from 'next/image';
import { motion, useTransform } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useInteractive3D } from '@/hooks/useInteractive3D';
import { useIsMobile } from '@/hooks/use-is-mobile';

const AboutR8Section = () => {
  const { ref, style, onMouseMove, onMouseLeave, onClick, ySpring } = useInteractive3D({
    rotationRangeX: 15,
    rotationRangeY: 15,
  });
  const isMobile = useIsMobile();

  const contentTranslateZ = useTransform(ySpring, [-0.5, 0.5], [20, 80]);
  const imageTranslateZ = useTransform(ySpring, [-0.5, 0.5], [-25, 50]);

  return (
    <section id="about-r8" className="py-16 md:py-24 bg-background overflow-hidden">
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div
          ref={ref}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onClick={onClick}
          className="relative w-full rounded-2xl bg-gradient-to-br from-card-foreground/[.05] to-transparent border border-primary/20 shadow-2xl shadow-primary/10"
          style={{ perspective: "2000px" }}
        >
          <motion.div
            style={style}
            className="relative p-5 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
          >
            <motion.div
              style={{ transform: `translateZ(${contentTranslateZ}px)` }}
              className="z-20 order-2 md:order-1"
            >
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-headline font-semibold mb-6 text-gradient-primary-accent"
                style={{ textShadow: '0 0 15px hsl(var(--primary)/0.5), 0 0 25px hsl(var(--accent)/0.5)' }}
              >
                Meet RUDRA R8: The Revolutionary Path to Total Wellness
              </h2>
              
              <ScrollArea className="h-[350px] w-full rounded-lg border border-border/20 p-6 bg-card/50 backdrop-blur-sm shadow-xl">
                <div className="space-y-4 text-foreground/80 font-body text-base md:text-lg">
                    <p className="text-lg md:text-xl font-semibold text-primary">At its heart, RUDRA R8 is a revolutionary 8-stage framework designed to systematically analyze, repair, and enhance your body.</p>
                    <p>
                        It’s a complete system that understands the intricate connection between your physical, mental, and energetic well-being. We believe that true health isn’t just the absence of disease, but the presence of vibrant energy, effortless movement, and a powerful connection to your inner self.
                    </p>
                    <p className="font-semibold text-foreground/90">
                       Unlike fragmented approaches that offer temporary fixes, RUDRA R8 provides a holistic, 8-stage journey that works with your body's natural intelligence. We combine deep diagnostics with personalized therapies, ensuring results that are 3-5x faster and truly last. It's the only system that empowers your body to heal itself, giving you back control over your health and life.
                    </p>
                     <p>
                        Our mission is to empower millions to live pain-free, energetic lives, establishing RUDRA R8 as the undisputed leader in holistic wellness across the globe. We understand the unique health challenges and aspirations of individuals worldwide and our system is designed to be accessible, relatable, and profoundly effective for everyone.
                    </p>
                </div>
              </ScrollArea>
            </motion.div>
            
            <motion.div
              style={{ transform: `translateZ(${imageTranslateZ}px)` }}
              className="relative w-full aspect-[4/3] z-10 order-1 md:order-2"
              animate={!isMobile ? { rotateY: 360 } : {}}
              transition={!isMobile ? { repeat: Infinity, duration: 30, ease: 'linear' } : {}}
            >
              <Image
                src="/about-r8-visualization.jpg"
                alt="Visualization of the R8 system's REMAP stage, showing brain-body connection."
                data-ai-hint="brain pathways"
                fill
                className="object-cover rounded-lg"
                style={{
                    filter: "drop-shadow(0 0 30px hsl(var(--primary)/0.5))"
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default AboutR8Section;
