
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { clientJourneyData } from '@/lib/clientJourneyData';
import { motion } from 'framer-motion';
import { Microscope, Milestone, Repeat, UserCheck, HelpCircle } from 'lucide-react';

const iconMap = {
  Microscope,
  Milestone,
  Repeat,
  UserCheck,
  HelpCircle,
};

export default function ClientJourneySection() {
  return (
    <section id="client-journey" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-semibold mb-4 text-glow-primary text-gradient-primary-accent">
            Your Personalised Odyssey to Peak Performance
          </h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto font-body">
            Your investment in RUDRA R8 is a profound commitment to yourself. This is not a static treatment; it is a dynamic, hyper-personalized odyssey, meticulously architected to adapt, accelerate, and achieve your ultimate physical freedom.
          </p>
        </div>

        <div className="relative">
          <div 
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-primary/10 via-primary/50 to-accent/50 rounded-full" 
          ></div>

          <div className="space-y-12 md:space-y-0">
            {clientJourneyData.map((phase, index) => {
              const PhaseIcon = iconMap[phase.iconName as keyof typeof iconMap] || HelpCircle;
              return (
              <div 
                  key={phase.title} 
                  className="relative md:grid md:grid-cols-2 md:items-center md:gap-12"
              >
                <div 
                  className={`flex-shrink-0 relative hidden md:flex items-center justify-center ${index % 2 !== 0 ? 'md:order-2' : ''}`}
                >
                  <motion.div 
                    whileHover={{ scale: 1.2 }}
                    className="absolute w-8 h-8 bg-primary rounded-full z-20 glow-primary"
                  ></motion.div>
                  <div className="absolute w-16 h-16 bg-primary/20 rounded-full z-10 animate-ping"></div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`pl-12 md:pl-0 ${index % 2 !== 0 ? 'md:order-1' : ''}`}
                >
                  <Card className="bg-gradient-to-br from-card-foreground/[.02] to-transparent shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-out border border-border/30 transform hover:-translate-y-1">
                    <CardHeader className="p-6">
                      <div className="flex items-start space-x-4">
                        <PhaseIcon className="h-12 w-12 md:h-16 md:w-16 text-primary shrink-0 animate-pulse-glow" />
                        <div>
                          <p className="text-sm font-semibold text-primary font-body">PHASE {phase.phaseNumber}</p>
                          <CardTitle className="text-xl md:text-2xl font-headline text-primary">{phase.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-4">
                      <p className="text-foreground/80 font-body text-base">{phase.whatItIs}</p>
                      
                      {(phase.tools || phase.process || phase.technologyExpertise || phase.metrics) && (
                         <div className="mt-4 pt-4 border-t border-border/20 space-y-3 text-sm">
                           {phase.tools && <p><strong className="text-accent">Tools:</strong> {phase.tools}</p>}
                           {phase.process && <p><strong className="text-accent">Process:</strong> {phase.process}</p>}
                           {phase.technologyExpertise && <p><strong className="text-accent">Tech:</strong> {phase.technologyExpertise}</p>}
                           {phase.metrics && <p><strong className="text-accent">Metrics:</strong> {phase.metrics}</p>}
                         </div>
                      )}
                      <div className="mt-4 pt-4 border-t border-border/20">
                        <p className="text-base text-foreground/90 font-body"><strong className="text-secondary text-glow-secondary font-headline">Benefit to You:</strong> {phase.benefit}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )})}
          </div>
        </div>
      </div>
    </section>
  );
}
