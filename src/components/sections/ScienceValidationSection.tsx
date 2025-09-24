
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { scienceValidationData } from "@/lib/scienceValidationData";
import { motion } from "framer-motion";
import { BookOpen, Brain, FlaskConical, CheckSquare, HelpCircle } from 'lucide-react';

const iconMap = {
    BookOpen,
    Brain,
    FlaskConical,
    CheckSquare,
    HelpCircle
};

export default function ScienceValidationSection() {
    return (
      <section id="science-validation" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-semibold mb-4 text-gradient-primary-accent" style={{ textShadow: '0 0 15px hsl(var(--primary)/0.5), 0 0 25px hsl(var(--accent)/0.5)' }}>
              The RUDRA R8 Toolkit: Forged in Science
            </h2>
            <p className="text-lg text-foreground/80 max-w-3xl mx-auto font-body">
              The RUDRA R8 system is not theoretical. It's a battle-tested protocol using a powerful toolkit of modalities. Click each pillar to understand the depth of our approach.
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {scienceValidationData.map((point, index) => {
              const PointIcon = iconMap[point.iconName as keyof typeof iconMap] || HelpCircle;
              return (
              <motion.div 
                key={point.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
              >
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Card className="group h-full rounded-lg bg-gradient-to-br from-card-foreground/[.02] to-transparent p-6 text-card-foreground transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transform hover:-translate-y-2 cursor-pointer">
                          <CardHeader className="p-0 items-center text-center">
                              <PointIcon className="h-16 w-16 text-primary group-hover:animate-pulse-glow transition-all duration-300 mb-4" />
                              <CardTitle className="text-xl font-headline text-foreground transition-colors group-hover:text-primary mb-2">{point.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                            <p className="text-foreground/70 font-body flex-grow">{point.text}</p>
                          </CardContent>
                      </Card>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-2xl bg-background/90 backdrop-blur-md border-primary/30 shadow-2xl shadow-primary/20">
                      <AlertDialogHeader>
                        <div className="flex items-center space-x-4 mb-4">
                           <PointIcon className="h-10 w-10 text-primary shrink-0 animate-pulse-glow" />
                          <AlertDialogTitle className="font-headline text-2xl text-primary text-glow-primary">{point.title}</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription asChild>
                           <div className="font-body text-base text-foreground/80 text-left max-h-[60vh] overflow-y-auto space-y-4 pr-3">
                              <p className="whitespace-pre-line leading-relaxed">{point.detailedExplanation}</p>
                           </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-4">
                          <AlertDialogAction asChild>
                              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">Understood</Button>
                          </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </motion.div>
            )})}
          </div>
        </div>
      </section>
    );
  }
